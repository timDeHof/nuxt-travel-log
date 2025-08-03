<script lang="ts" setup>
import type { FetchError } from "ofetch";

import { toTypedSchema } from "@vee-validate/zod";

import type { NominatimResult } from "~/lib/types";

import { SearchSchema } from "~/lib/zod-schema";
import { GetFetchErrorMessage } from "~/utils/get-fetch-error-message";

const emit = defineEmits<{
  resultSelected: [result: NominatimResult];
}>();

const searchResults = ref<NominatimResult[]>([]);
const loading = ref(false);
const hasSearched = ref(false);
const errorMessage = ref("");

const { handleSubmit, errors, resetForm, defineField } = useForm({
  validationSchema: toTypedSchema(SearchSchema),
  initialValues: { q: "" },
});

const [q] = defineField("q");
function setLocation(result: NominatimResult) {
  emit("resultSelected", result);
  hasSearched.value = false;
  errorMessage.value = "";
  searchResults.value = [];
  resetForm();
}

const onSubmit = handleSubmit(
  async (query: Record<string, string>) => {
    try {
      loading.value = true;
      hasSearched.value = true;
      errorMessage.value = "";
      searchResults.value = [];
      const results = await $fetch("/api/search?", {
        query,
      });
      searchResults.value = results;
    }
    catch (e) {
      console.error(e);
      const error = e as FetchError;
      errorMessage.value = GetFetchErrorMessage(error);
    }
    finally {
      loading.value = false;
    }
  },
  () => {
    // This runs when validation fails
    errorMessage.value = "You must enter a search term.";
  },
);
</script>

<template>
  <div class="flex flex-col gap-2">
    <form
      class="flex flex-col items-center gap-2"
      @submit.prevent="onSubmit"
    >
      <div class="join mt-4">
        <div>
          <label class="input join-item">
            <Icon name="tabler:search" />
            <input
              v-model="q"
              type="text"
              :disabled="loading"
              placeholder="Search for a location..."
              :class="{
                'input-error': errors.q,
              }"
            >
          </label>
          <div v-if="errors.q" class="validator-hint text-error">
            {{ errors.q }}
          </div>
        </div>
        <button
          type="submit"
          class="btn btn-neutral join-item"
          :disabled="loading"
        >
          Search
        </button>
      </div>
    </form>
    <div
      v-if="!loading && errorMessage"
      role="alert"
      class="alert alert-error"
    >
      {{ errorMessage }}
    </div>

    <div
      v-if="!loading && hasSearched && !searchResults.length"
      role="alert"
      class="alert alert-warning"
    >
      No results found.
    </div>
    <div v-if="loading" class="flex justify-center items-center">
      <span class="loading loading-spinner loading-lg" />
    </div>
    <div v-if="searchResults.length" class="flex flex-col overflow-auto gap-2 max-h-60 mt-2">
      <div
        v-for="result in searchResults"
        :key="result.place_id"
        class="card card-sm bg-base-100 shadow-sm"
      >
        <div class="card-body">
          <h4 class="card-title text-sm">
            {{ result.display_name }}
          </h4>
          <div class="justify-end card-actions">
            <button class="btn btn-warning btn-sm" @click.prevent="setLocation(result)">
              Select location
              <Icon name="tabler:map-pin-share" size="20" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
