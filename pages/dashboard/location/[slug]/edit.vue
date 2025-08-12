<script lang="ts" setup>
import type { InsertLocation } from "~/lib/db/schema";

const locationStore = useLocationsStore();
const { $csrfFetch } = useNuxtApp();
const route = useRoute();
async function onSubmit(values: InsertLocation) {
  await $csrfFetch(`/api/locations/${route.params.slug}`, {
    method: "put",
    body: values,
  });
}

function onSubmitComplete() {
  navigateTo({
    name: "dashboard-location-slug",
    params: { slug: route.params.slug },
  });
}
</script>

<template>
  <div>
    <LocationForm
      v-if="locationStore.currentLocationStatus !== 'pending'"
      :initial-values="locationStore.currentLocation"
      :on-submit
      submit-label="Update"
      submit-icon="tabler:map-pin-up"
      :on-submit-complete
    />
  </div>
</template>
