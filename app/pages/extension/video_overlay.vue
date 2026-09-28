<script setup lang="ts">
import type { HelixUser } from "@twurple/api";
import { useWebSocket } from "@vueuse/core";

useHead({ bodyAttrs: { class: "bg-transparent" } });

const twitch = useTwitch();

const data = ref<GameData | null>(null);
const protocol = import.meta.dev ? "ws" : "wss";
const broadcaster = ref<ExcludeFn<HelixUser> | null>(null);
const slideOpen = ref(true);
const scoreboardOpen = ref(false);
const extAuth = ref<Twitch.ext.Authorized | null>(null);
const socket = ref<ReturnType<typeof useWebSocket> | null>(null);
const loading = ref(false);

onMounted(() => {
  Twitch.ext.onAuthorized(async (auth) => {
    extAuth.value = auth;
    twitch.init(auth.clientId);
    if (!broadcaster.value) {
      broadcaster.value = await twitch.getUserById(auth.channelId);
    }
  });

  Twitch.ext.onContext((context) => {
    const { arePlayerControlsVisible } = context;
    slideOpen.value = arePlayerControlsVisible || false;
  });
});

watch(scoreboardOpen, async () => {
  if (!scoreboardOpen.value || !extAuth.value || !broadcaster.value) {
    socket.value?.close();
    socket.value = null;
    return;
  }
  loading.value = true;
  const wsURL = `${protocol}://${SITE.domain}/ws/${broadcaster.value!.name}`;
  data.value = await extFetch(`/api/ebs/game/${broadcaster.value!.name}`, {
    headers: { "Channel-Id": extAuth.value.channelId }
  }).catch(() => null);
  loading.value = false;
  socket.value = useWebSocket(wsURL, {
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

const slideMenuItems = [
  {
    id: "scoreboard",
    title: "Scoreboard",
    icon: "material-symbols-light:space-dashboard",
    onClick: () => scoreboardOpen.value = true,
    onClose: () => scoreboardOpen.value = false
  }
];
</script>

<template>
  <UMain>
    <ClientOnly>
      <SlideMenu v-model="slideOpen" :items="slideMenuItems">
        <template #scoreboard>
          <div>
            <div v-if="loading" class="absolute inset-0 flex items-center justify-center z-50">
              <Icon name="material-symbols-light:data-usage" size="60" class="animate-spin inline-block" />
            </div>
            <div v-else-if="scoreboardOpen && !loading">
              <ScoreboardMain :data="data" :downscale="8" />
            </div>
          </div>
        </template>
      </SlideMenu>
    </ClientOnly>
  </UMain>
</template>
