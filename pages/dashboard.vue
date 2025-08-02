<script setup lang="ts">
const isSidebarOpen = ref(true);
const route = useRoute();
const sidebarStore = useSidebarStore();
const mapStore = useMapStore();
const locationsStore = useLocationsStore();

onMounted(() => {
  const storedSidebarState = localStorage.getItem("sidebarOpen");
  if (route.path === "/dashboard") {
    locationsStore.refresh();
  }
  if (storedSidebarState !== null) {
    isSidebarOpen.value = storedSidebarState === "true";
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
        <sidebarButton
          :show-label="isSidebarOpen"
          href="/dashboard"
          icon="tabler:map"
          label="Locations"
        />
        <sidebarButton
          :show-label="isSidebarOpen"
          href="/dashboard/add"
          icon="tabler:circle-plus-filled"
          label="Add Location"
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
            :href="item.href"
            :icon="item.icon"
            :label="item.label"
            :icon-color="mapStore.selectedPoint === item.location ? 'text-accent' : undefined"
            @mouseenter="mapStore.selectedPoint = item.location ?? null"
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
    <div class="flex-1 overflow-auto">
      <div class="flex flex-col size-full">
        <NuxtPage />
        <AppMap class="flex-1" />
      </div>
    </div>
  </div>
</template>
