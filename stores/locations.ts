import { useMapStore } from "./map";

export const useLocationsStore = defineStore("useLocationsStore", () => {
  const { data, status, refresh } = useFetch("/api/locations", {
    lazy: true,
  });
  const sidebarStore = useSidebarStore();
  const mapStore = useMapStore();

  effect(() => {
    if (data.value) {
      sidebarStore.sidebarItems = data.value?.map(location => ({
        id: `location-${location.id}`,
        label: location.name,
        icon: "tabler:map-pin-filled",
        href: `/dashboard/${location.id}`,
      }));
      mapStore.mapPoints = data.value?.map(location => ({
        id: location.id,
        label: location.name,
        lat: location.lat,
        long: location.long,
      }));
    }
    sidebarStore.loading = status.value === "pending";
  });
  return {
    locations: data,
    status,
    refresh,
  };
});
