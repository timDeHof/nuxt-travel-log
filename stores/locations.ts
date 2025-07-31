export const useLocationsStore = defineStore("useLocationStore", () => {
  const { data, status, refresh } = useFetch("/api/locations", {
    lazy: true,
  });
  const sidebarStore = useSidebarStore();

  watchEffect(() => {
    if (data.value) {
      sidebarStore.sidebarItems = data.value?.map(location => ({
        id: `location-${location.id}`,
        label: location.name,
        icon: "tabler:map-pin-filled",
        href: `/dashboard/${location.id}`,
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
