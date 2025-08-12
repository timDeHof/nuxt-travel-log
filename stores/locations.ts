import type { SelectLocationWithLogs } from "~/lib/db/schema";
import type { MapPoint } from "~/lib/types";

import { CURRENT_LOCATION_PAGES, LOCATION_PAGES } from "~/lib/constant";
import { createMapPointFromLocation } from "~/utils/map-points";

import type { SidebarItem } from "./sidebar";

export const useLocationsStore = defineStore("useLocationsStore", () => {
  const route = useRoute();
  const {
    data: locations,
    status: locationsStatus,
    refresh: refreshLocations,
  } = useFetch("/api/locations", {
    lazy: true,
  });
  const locationUrlWithSlug = computed(() => `/api/locations/${route.params.slug}`);
  const {
    data: currentLocation,
    status: currentLocationStatus,
    error: currentLocationError,
    refresh: refreshCurrentLocation,
  } = useFetch<SelectLocationWithLogs>(locationUrlWithSlug, {
    lazy: true,
    immediate: false,
    watch: false,
  });
  const sidebarStore = useSidebarStore();
  const mapStore = useMapStore();

  effect(() => {
    if (locations.value && LOCATION_PAGES.has(route.name?.toString() || "")) {
      const mapPoints: MapPoint[] = [];
      const SidebarItems: SidebarItem[] = [];
      locations.value.forEach((location) => {
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
    else if (currentLocation.value && CURRENT_LOCATION_PAGES.has(route.name?.toString() || "")) {
      sidebarStore.sidebarItems = [];
      mapStore.mapPoints = [currentLocation.value];
    }
    sidebarStore.loading = locationsStatus.value === "pending";
  });
  return {
    currentLocation,
    currentLocationStatus,
    refreshCurrentLocation,
    currentLocationError,
    locations,
    locationsStatus,
    refreshLocations,
  };
});
