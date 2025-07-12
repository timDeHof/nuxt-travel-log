<script lang="ts" setup>
const authStore = useAuthStore();
const { loading, signIn } = authStore;
</script>

<template>
  <button
    :disabled="loading"
    class="btn btn-accent"
    @click="signIn"
  >
    Sign In With GitHub
    <span v-if="loading" class="loading loading-spinner loading-md" />
    <Icon
      v-else
      name="tabler:brand-github"
      size="24"
    />
  </button>
</template>
