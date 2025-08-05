import type { MapPoint } from "~/lib/types";

import { createMapPointFromLocation } from "~/utils/map-points";

import type { SidebarItem } from "./sidebar";

export const useLocationsStore = defineStore("useLocationsStore", () => {
  const { data, status, refresh } = useFetch("/api/locations", {
    lazy: true,
  });
  const sidebarStore = useSidebarStore();
  const mapStore = useMapStore();

  effect(() => {
    if (data.value) {
      const mapPoints: MapPoint[] = [];
      const SidebarItems: SidebarItem[] = [];
      data.value.forEach((location) => {
        const mapPoint = createMapPointFromLocation(location);
        mapPoints.push(mapPoint);
        SidebarItems.push({
          id: `location-${location.id}`,
          label: location.name,
          icon: "tabler:map-pin-filled",
          to: { name: "dashboard-location-slug", params: { slug: location.slug } },
          mapPoint,
        });
        mapPoints.push(mapPoint);
      });
      sidebarStore.sidebarItems = SidebarItems;
      mapStore.mapPoints = mapPoints;
    }
    sidebarStore.loading = status.value === "pending";
  });
  return {
    locations: data,
    status,
    refresh,
  };
});
