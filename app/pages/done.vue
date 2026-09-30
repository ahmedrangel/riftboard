<script setup lang="ts">
const { user, loggedIn } = useUserSession();
if (!loggedIn.value) {
  navigateTo("/");
}
const loading = ref(true);
const verified = ref(false);
const { sid } = useRoute().query;

onMounted(async () => {
  // Verify with the local service using the session ID (sid)
  const response = await $fetch<{ verified: boolean }>(`${SITE.localService}/verify`, { method: "POST", body: { sid: sid } }).catch(() => null);
  verified.value = response?.verified ?? false;
  if (!verified.value) {
    throw createError({
      fatal: true,
      status: 503,
      statusText: "Service Unavailable",
      message: "Session verification failed. Make sure the local service is running and try again."
    });
  }
  loading.value = false;
  window.close();
});
</script>

<template>
  <main class="text-center overflow-hidden w-dvw h-dvh flex flex-col items-center justify-center gap-4">
    <template v-if="loading && !verified">
      <span class="text-4xl font-semibold">Verifying session...</span>
    </template>
    <template v-else-if="!loading && verified && user">
      <span class="text-4xl font-semibold">Hello, {{ user.displayName }}! You are now logged in.</span>
      <span class="text-xl">You can close this page.</span>
    </template>
  </main>
</template>
