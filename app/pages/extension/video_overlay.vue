<script setup lang="ts">
import type { HelixUser } from "@twurple/api";
import { useWebSocket } from "@vueuse/core";

const twitch = useTwitch();

const data = ref<GameData | null>();
const protocol = import.meta.dev ? "ws" : "wss";
const broadcaster = ref<ExcludeFn<HelixUser> | null>(null);

onMounted(() => {
  let extAuth: Twitch.ext.Authorized | null = null;
  Twitch.ext.onAuthorized(async (auth) => {
    extAuth = auth;
    twitch.init(auth.clientId);
    if (!broadcaster.value) {
      broadcaster.value = await twitch.getUserById(auth.channelId);
    }
    const wsURL = `${protocol}://${SITE.domain}/ws/${broadcaster.value!.name}`;
    data.value = await extFetch(`/api/ebs/game/${broadcaster.value!.name}`, {
      headers: {
        "Channel-Id": extAuth.channelId
      }
    });
    useWebSocket(wsURL, {
      autoReconnect: { retries: 10, delay: 1000 },
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
});
</script>

<template>
  <UMain>
    <ClientOnly>
      <ScoreboardMain v-if="data" :data="data" />
    </ClientOnly>
  </UMain>
</template>
