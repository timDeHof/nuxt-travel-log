<script lang="ts" setup>
const route = useRoute();
const router = useRouter();

type ErrorType = {
  code?: number;
  message: string;
  fatal?: boolean;
};

const error = computed<ErrorType>(() => ({
  code: Number(route.query.code) || 500,
  message: sanitizeError(route.query.error),
  fatal: Boolean(route.query.fatal),
}));

const sanitizedMessage = computed(() =>
  error.value.message || "An unexpected error occurred",
);

const errorMetadata = computed(() => ({
  timestamp: new Date().toISOString(),
  path: route.fullPath,
  stack: route.query.stack?.toString(),
}));

function sanitizeError(input: unknown): string {
  const message = String(input ?? "");
  // Basic XSS protection and truncation
  return message.replace(/</g, "<").substring(0, 500);
}

async function handleReload() {
  try {
    await clearError();
    await router.replace("/");
  }
  catch (error) {
    console.error("Failed to clear error state:", error);
  }
}

// Client-side error logging
onMounted(() => {
  if (import.meta.client) {
    console.error("Client error:", errorMetadata.value);
    // Integrate with error tracking service here
  }
});
</script>

<template>
  <div class="error-page">
    <div
      :key="error.message"
      role="alert"
      aria-live="assertive"
      :aria-busy="!!error.message"
      class="card bg-base-300 container mt-4 min-h-auto text-center mx-auto p-4"
    >
      <div class="alert alert-error p-8 space-y-4 min-w-1/2">
        <Icon name="tabler:alert-triangle" size="32" />

        <h1 class="text-2xl font-bold">
          Error {{ error.code }}: {{ sanitizedMessage }}
        </h1>

        <p v-if="error.fatal" class="text-sm opacity-75">
          Our team has been notified. Please try again later.
        </p>

        <div class="mt-6">
          <button
            class="btn btn-primary"
            @click="handleReload"
          >
            Return to Safety
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  min-height: calc(100vh - 160px);
  display: grid;
  place-items: center;
}
</style>
