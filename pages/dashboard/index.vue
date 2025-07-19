<script setup lang="ts">
const isSidebarOpen = ref(true);

onMounted(() => {
  const storedSidebarState = localStorage.getItem("sidebarOpen");
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
    <div class="bg-base-100 transition-all duration-300" :class="{ 'w-64': isSidebarOpen, 'w-14': !isSidebarOpen }">
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
          to="/dashboard"
          icon="tabler:map"
          label="Locations"
        />
        <sidebarButton
          :show-label="isSidebarOpen"
          to="/dashboard/add"
          icon="tabler:circle-plus-filled"
          label="Add Location"
        />
        <div class="divider my-2" />
        <sidebarButton
          :show-label="isSidebarOpen"
          to="/sign-out"
          icon="tabler:logout"
          label="Sign Out"
        />
      </div>
    </div>
    <div class="flex-1">
      <slot />
    </div>
  </div>
</template>
