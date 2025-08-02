<script lang="ts" setup>
import { CENTER_USA } from "~/lib/constant";
import { useMapStore } from "~/stores/map";

const mapStore = useMapStore();
const colorMode = useColorMode();
// const style = "https://tiles.openfreemap.org/styles/liberty";
const style = computed(() =>
  colorMode.value === "dark"
    ? "/styles/dark.json"
    : "https://tiles.openfreemap.org/styles/liberty");
const zoom = 3;

onMounted(() => {
  mapStore.init();
});
</script>

<template>
  <MglMap
    :map-style="style"
    :center="CENTER_USA"
    :zoom="zoom"
  >
    <MglNavigationControl />
    <MglMarker
      v-for="point in mapStore.mapPoints"
      :key="point.id"
      :coordinates="[point.long, point.lat]"
    >
      <template #marker>
        <div
          class="tooltip tooltip-top hover:cursor-pointer"
          :data-tip="point.name"
          :class="{
            'tooltip-open': point === mapStore.selectedPoint,
          }"
          @mouseleave="mapStore.selectedPointWithoutFlyTo(null)"
          @mouseenter="mapStore.selectedPointWithoutFlyTo(point)"
        >
          <Icon
            name="tabler:map-pin-filled"
            size="30"
            :class="point === mapStore.selectedPoint ? 'text-accent' : 'text-secondary'"
          />
        </div>
      </template>
      <MglPopup>
        <h3 class="text-xl">
          {{ point.name }}
        </h3>
        <p v-if="point.description" class="text-sm">
          {{ point.description }}
        </p>
      </MglPopup>
    </MglMarker>
  </MglMap>
</template>
