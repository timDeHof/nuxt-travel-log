import { createAuthClient } from "better-auth/client";
import { defineStore } from "pinia";

const authClient = createAuthClient();

export const useAuthStore = defineStore("useAuthStore", () => {
  const loading = ref(false);
  async function signIn() {
    loading.value = true;
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
      errorCallbackURL: "/error",
    });
    loading.value = false;
  };
  async function signOut() {
    loading.value = true;
    await authClient.signOut();
    loading.value = false;
  }

  return {
    loading,
    signIn,
    signOut,
  };
});
