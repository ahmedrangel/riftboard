<script setup lang="ts">
import { useWebSocket } from "@vueuse/core";

useHead({ title: "RiftBoard" });

const { login } = useRoute("game-login").params;

const { data: fetchedData } = await useFetch(`/api/game/${login}`);
const data = ref<GameData | null>(fetchedData.value ?? null);
const protocol = import.meta.dev ? "ws" : "wss";
const wsURL = `${protocol}://${SITE.domain}/ws/${login}`;

onMounted(() => {
  useWebSocket(wsURL, {
    autoReconnect: {
      retries: 10,
      delay: 1000
    },
    onMessage: (_, event) => {
      try {
        const { data: parsedData } = JSON.parse(event.data);
        data.value = parsedData;
      }
      catch (error) {
        console.warn("Failed to parse WebSocket message:", error);
      }
    },
    onConnected: () => {
      console.info("WebSocket connected");
    },
    onDisconnected: () => {
      console.info("WebSocket disconnected");
    },
    onError: () => {
      console.warn("WebSocket error occurred");
    }
  });
});
</script>

<template>
  <UMain>
    <ClientOnly>
      <ScoreboardMain v-if="data" :data="data" />
    </ClientOnly>
  </UMain>
</template>
