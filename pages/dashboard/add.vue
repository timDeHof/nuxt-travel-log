<script setup lang="ts">
import type { InsertLocation } from "~/lib/db/schema";

async function onSubmit(values: InsertLocation) {
  await $fetch("/api/location", {
    method: "POST",
    body: values,
  });
}
function onSubmitComplete() {
  navigateTo("/dashboard");
}
</script>

<template>
  <div class="container mx-auto max-w-md p-4">
    <div class="my-4">
      <h1 class="text-lg font-bold mb-4">
        Add New Location
      </h1>
      <p class="text-sm">
        A location is a place you have traveled or will travel to. It can be a city, country,state or point of interest. You can add specific times you visited this location after adding it.
      </p>
    </div>

    <LocationForm
      :on-submit
      submit-label="Add"
      submit-icon="tabler:circle-plus-filled"
      :on-submit-complete
    />
  </div>
</template>
