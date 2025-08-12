<script setup lang="ts">
import { CURRENT_LOCATION_PAGES, EDIT_PAGES, LOCATION_PAGES } from "~/lib/constant";

const isSidebarOpen = ref(true);
const route = useRoute();
const sidebarStore = useSidebarStore();
const mapStore = useMapStore();
const locationStore = useLocationsStore();
const { currentLocation, currentLocationStatus } = storeToRefs(locationStore);

if (LOCATION_PAGES.has(route.name?.toString() || "")) {
  await locationStore.refreshLocations();
}

if (CURRENT_LOCATION_PAGES.has(route.name?.toString() || "")) {
  await locationStore.refreshCurrentLocation();
}
onMounted(() => {
  isSidebarOpen.value = localStorage.getItem("sidebarOpen") === "true";
});

effect(() => {
  if (LOCATION_PAGES.has(route.name?.toString() || "")) {
    sidebarStore.SidebarTopItems = [
      {
        id: "link-dashboard",
        label: "Locations",
        icon: "tabler:map",
        href: "/dashboard",
      },
      {
        id: "link-location-add",
        label: "Add Location",
        icon: "tabler:circle-plus-filled",
        href: "/dashboard/add",
      },
    ];
  }
  else if (CURRENT_LOCATION_PAGES.has(route.name?.toString() || "")) {
    sidebarStore.SidebarTopItems = [
      {
        id: "link-dashboard",
        label: "Back to Locations",
        icon: "tabler:arrow-back",
        href: "/dashboard",
      },
    ];
    if (currentLocation.value && currentLocationStatus.value !== "pending") {
      sidebarStore.SidebarTopItems.push({
        id: "link-dashboard",
        label: currentLocation.value.name,
        icon: "tabler:map",
        to: {
          name: "dashboard-location-slug",
          params: {
            slug: route.params.slug,
          },
        },
      });
      sidebarStore.SidebarTopItems.push({
        id: "link-location-edit",
        label: "Edit Location",
        icon: "tabler:map-pin-cog",
        to: {
          name: "dashboard-location-slug-edit",
          params: {
            slug: route.params.slug,
          },
        },
      });
      sidebarStore.SidebarTopItems.push({
        id: "link-locationlog-add",
        label: "Add Location Log",
        icon: "tabler:circle-plus-filled",
        to: {
          name: "dashboard-location-slug-add",
          params: {
            slug: route.params.slug,
          },
        },
      });
    }
  }
});

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
  localStorage.setItem("sidebarOpen", isSidebarOpen.value.toString());
}
</script>

<template>
  <div class="flex-1 flex">
    <div class="bg-base-100 transition-all duration-300 shrink-0" :class="{ 'w-64': isSidebarOpen, 'w-14': !isSidebarOpen }">
      <div
        class="flex hover:bg-base-200 p-2 hover:cursor-pointer"
        :class="{ 'justify-center': !isSidebarOpen, 'justify-end': isSidebarOpen }"
        @click="toggleSidebar"
      >
        <Icon
          v-if="isSidebarOpen"
          name="tabler:chevron-left"
          size="32"
        />
        <Icon
          v-else
          name="tabler:chevron-right"
          size="32"
        />
      </div>
      <div class="flex flex-col">
        <div v-if="route.path.startsWith('/dashboard/location') && currentLocationStatus === 'pending'" class="flex items-center justify-center">
          <div class="loading" />
        </div>
        <sidebarButton
          v-for="item in sidebarStore.SidebarTopItems"
          :key="item.id"
          :show-label="isSidebarOpen"
          :href="item.href"
          :icon="item.icon"
          :label="item.label"
          :to="item.to"
        />
        <div v-if="sidebarStore.loading || sidebarStore.sidebarItems.length > 0" class="divider my-2" />
        <div v-if="sidebarStore.loading" class="w-full px-4">
          <div class="skeleton h-4" />
        </div>
        <div v-if="!sidebarStore.loading && sidebarStore.sidebarItems.length" class="flex flex-col">
          <sidebarButton
            v-for="item in sidebarStore.sidebarItems"
            :key="item.id"
            :show-label="isSidebarOpen"
            :to="item.to"
            :icon="item.icon"
            :label="item.label"
            :icon-color="isPointSelected(item.mapPoint, mapStore.selectedPoint) ? 'text-accent' : undefined"
            @mouseenter="mapStore.selectedPoint = item.mapPoint ?? null"
            @mouseleave="mapStore.selectedPoint = null"
          />
        </div>
        <div class="divider my-2" />
        <sidebarButton
          :show-label="isSidebarOpen"
          href="/sign-out"
          icon="tabler:logout"
          label="Sign Out"
        />
      </div>
    </div>
    <div class="flex-1 overflow-auto bg-base-200">
      <div
        class="flex size-full"
        :class="{ 'flex-col': !EDIT_PAGES.has(route.name?.toString() || '') }"
      >
        <NuxtPage
          :class="{
            'shrink-0': EDIT_PAGES.has(route.name?.toString() || ''),
            'w-96': EDIT_PAGES.has(route.name?.toString() || ''),
          }"
        />
        <AppMap class="flex-1" />
      </div>
    </div>
  </div>
</template>
