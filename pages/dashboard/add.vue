<script setup lang="ts">
import type { FetchError } from "ofetch";

import { toTypedSchema } from "@vee-validate/zod";
import { AppFormField } from "#components";

import type { NominatimResult } from "~/lib/types";

import { CENTER_USA } from "~/lib/constant";
import { InsertLocation } from "~/lib/db/schema";
import { GetFetchErrorMessage } from "~/utils/get-fetch-error-message";

const { $csrfFetch } = useNuxtApp();
const router = useRouter();
const loading = ref(false);
const submitError = ref("");
const mapStore = useMapStore();
const submitSuccess = ref(false);
const { handleSubmit, errors, meta, setErrors, setFieldValue, controlledValues } = useForm({
  validationSchema: toTypedSchema(InsertLocation),
  initialValues: {
    name: "",
    description: "",
    long: (CENTER_USA as [number, number])[0],
    lat: (CENTER_USA as [number, number])[1],
  },
});
function formatNumber(value?: number) {
  if (!value)
    return 0;
  return value.toFixed(5);
}
const onSubmit = handleSubmit(async (values) => {
  try {
    submitError.value = "";
    loading.value = true;
    await $csrfFetch("/api/locations", {
      method: "post",
      body: values,
    });
    submitSuccess.value = true;
    navigateTo("/dashboard");
  }
  catch (e) {
    const error = e as FetchError;
    if (error.data?.data) {
      // If the error response contains validation errors, set them
      setErrors(error.data.data);
    }
    submitError.value = GetFetchErrorMessage(error);
  }
  finally {
    loading.value = false;
  }
});
function searchResultedSelected(result: NominatimResult) {
  setFieldValue("name", result.display_name);
  mapStore.addedPoint = {
    long: Number(result.lon),
    lat: Number(result.lat),
    description: "",
    name: result.name,
    id: result.place_id,
    centerMap: true,
  };
}

effect(() => {
  if (mapStore.addedPoint) {
    setFieldValue("long", mapStore.addedPoint.long);
    setFieldValue("lat", mapStore.addedPoint.lat);
  }
});

onMounted(() => {
  mapStore.addedPoint = {
    long: (CENTER_USA as [number, number])[0],
    lat: (CENTER_USA as [number, number])[1],
    description: "",
    name: "Added Point",
    id: 1,
  };
});
onBeforeRouteLeave((to, from, next) => {
  if (!submitSuccess.value && meta.value.dirty) {
    // eslint-disable-next-line no-alert
    const confirmLeave = window.confirm("You have unsaved changes. Are you sure you want to leave?");
    if (!confirmLeave) {
      next(false); // Prevent navigation
      return;
    }
  }
  mapStore.addedPoint = null;
  next(); // Allow navigation
});
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
    <div
      v-if="submitError"
      role="alert"
      class="alert alert-error"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{{ submitError }}</span>
    </div>
    <form
      class="flex flex-col gap-2"
      @submit.prevent="onSubmit()"
    >
      <AppFormField
        :disabled="loading"
        name="name"
        label="Name"
        :error="errors.name"
        :class="{ 'input-error': errors.name }"
      />
      <AppFormField
        :disabled="loading"
        type="textarea"
        name="description"
        label="Description"
        :error="errors.description"
      />
      <p class="text-xs text-gray-400">
        Current Coordinates: {{ formatNumber(controlledValues.lat) }}, {{ formatNumber(controlledValues.long) }}
      </p>
      <p>To Set your Coordinates:</p>
      <ol class="list-disc ml-4 text-sm">
        <li>
          Drag the <Icon
            name="tabler:map-pin-filled"
            class="text-warning"
          /> marker on the map..
        </li>
        <li>
          Double click the map.
        </li>
        <li>
          Search for the desired location below.
        </li>
      </ol>
      <div class="flex justify-end gap-2">
        <button
          type="button"
          :disabled="loading"
          class="btn btn-outline"
          @click="router.back()"
        >
          <Icon
            name="tabler:arrow-left"
            size="24"
          />
          Cancel
        </button>
        <button
          type="submit"
          :disabled="loading"
          class="btn btn-primary"
        >
          Add
          <span v-if="loading" class="loading loading-spinner loading-sm" />
          <Icon
            v-else
            name="tabler:circle-plus-filled"
            size="24"
          />
        </button>
      </div>

      <div class="divider flex-1" />

      <AppPlaceSearch @result-selected="searchResultedSelected" />
    </form>
  </div>
</template>
