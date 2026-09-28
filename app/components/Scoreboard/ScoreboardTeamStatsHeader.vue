<script setup lang="ts">
const props = defineProps<{
  game: {
    started: boolean;
    startedAt: string;
    dragonSoul: string;
  };
  teams: {
    blue: { score: number, dragons: number, dragonTypes: string[], grubs: number, heralds: number, barons: number, turrets: number };
    red: { score: number, dragons: number, dragonTypes: string[], grubs: number, heralds: number, barons: number, turrets: number };
  };
}>();

const extAsset = (path: string) => import.meta.dev ? path : `.${path}`;

const statsMap = [
  { type: "dragons", title: "Dragons", icon: extAsset("/icons/dragon.png") },
  { type: "heralds", title: "Heralds", icon: extAsset("/icons/riftherald.png") },
  { type: "grubs", title: "Grubs", icon: extAsset("/icons/grub.png") },
  { type: "turrets", title: "Turrets", icon: extAsset("/icons/tower.png") }
];

const dragonIconMap = [
  { type: "Fire", title: "Infernal Dragon", icon: extAsset("/icons/dragon_infernal.png") },
  { type: "Earth", title: "Mountain Dragon", icon: extAsset("/icons/dragon_mountain.png") },
  { type: "Water", title: "Ocean Dragon", icon: extAsset("/icons/dragon_ocean.png") },
  { type: "Air", title: "Cloud Dragon", icon: extAsset("/icons/dragon_cloud.png") },
  { type: "Hextech", title: "Hextech Dragon", icon: extAsset("/icons/dragon_hextech.png") },
  { type: "Chemtech", title: "Chemtech Dragon", icon: extAsset("/icons/dragon_chemtech.png") },
  { type: "Elder", title: "Elder Dragon", icon: extAsset("/icons/dragon_elder.png") }
];

const dragonSoulsIconMap = [
  { type: "Fire", title: "Infernal Soul", icon: extAsset("/icons/dragonsouliconinfernal.png") },
  { type: "Earth", title: "Mountain Soul", icon: extAsset("/icons/dragonsouliconmountain.png") },
  { type: "Water", title: "Ocean Soul", icon: extAsset("/icons/dragonsouliconocean.png") },
  { type: "Air", title: "Cloud Soul", icon: extAsset("/icons/dragonsouliconcloud.png") },
  { type: "Hextech", title: "Hextech Soul", icon: extAsset("/icons/dragonsouliconhextech.png") },
  { type: "Chemtech", title: "Chemtech Soul", icon: extAsset("/icons/dragonsouliconchemtech.png") }
];

const blueDragons = computed(() => props.teams.blue.dragonTypes?.filter(type => type !== "Elder") || []);
const redDragons = computed(() => props.teams.red.dragonTypes?.filter(type => type !== "Elder") || []);

const maxDragons = 4;

const dragonSoul = computed(() => blueDragons.value.length > maxDragons - 1 || redDragons.value.length > maxDragons - 1 ? dragonSoulsIconMap.find(item => item.type === props.game.dragonSoul) : null);
const dragonSoulNotConsumed = computed(() => blueDragons.value.length <= maxDragons - 1 && redDragons.value.length <= maxDragons - 1 && props.game.dragonSoul ? dragonSoulsIconMap.find(item => item.type === props.game.dragonSoul) : null);

const gameStartedAt = computed(() => new Date(props.game.startedAt).getTime());
const gameCurrentTime = ref<number | null>(null);
onMounted(() => {
  setInterval(() => {
    gameCurrentTime.value = props.game.started ? Date.now() - gameStartedAt.value : null;
  }, 500);
});
</script>

<template>
  <div class="scoreboard__top flex items-center justify-center border-b border-slate-500/40 gap-2 relative">
    <div class="flex items-center py-5">
      <div class="ml-auto flex items-center gap-6 scale-x-[-1]">
        <div v-for="dot in 4" :key="`blue-dragons-${dot}`" class="h-16 w-16 rounded-full border border-slate-800/80 bg-slate-950">
          <img
            v-if="dragonIconMap.find(item => item.type === blueDragons[dot - 1] as string) && teams.blue.dragonTypes[dot - 1] !== 'Elder'"
            :src="dragonIconMap.find(item => item.type === blueDragons[dot - 1] as string)?.icon"
            :title="dragonIconMap.find(item => item.type === blueDragons[dot - 1] as string)?.title"
            class="h-full w-full scale-x-[-1] p-1"
          >
        </div>
      </div>
    </div>
    <div class="mx-6 flex h-16 w-16 rotate-45 items-center justify-center border-2 border-slate-300/50 bg-slate-950 overflow-hidden">
      <span class="-rotate-45">
        <img v-if="dragonSoul || dragonSoulNotConsumed" :src="dragonSoul?.icon || dragonSoulNotConsumed?.icon" class="h-full w-full scale-110" :class="{ grayscale: !dragonSoul && dragonSoulNotConsumed }" :title="dragonSoul?.title || dragonSoulNotConsumed?.title">
      </span>
    </div>
    <div class="flex items-center">
      <div class="flex items-center gap-6">
        <div v-for="dot in 4" :key="`red-dragons-${dot}`" class="h-16 w-16 rounded-full border border-slate-800/80 bg-slate-950">
          <img
            v-if="dragonIconMap.find(item => item.type === redDragons[dot - 1] as string) && teams.red.dragonTypes[dot - 1] !== 'Elder'"
            :src="dragonIconMap.find(item => item.type === redDragons[dot - 1] as string)?.icon"
            :title="dragonIconMap.find(item => item.type === redDragons[dot - 1] as string)?.title"
            class="h-full w-full p-1"
          >
        </div>
      </div>
    </div>
    <div v-if="gameCurrentTime" class="absolute right-0 p-5 text-2xl font-semibold flex items-end gap-1">
      <Icon name="material-symbols-light:timer" size="30" />
      <span class="tabular-nums">
        {{ new Date(gameCurrentTime).toLocaleTimeString([], { minute: "2-digit", second: "2-digit" }) }}
      </span>
    </div>
  </div>
  <div class="scoreboard__stats grid grid-cols-[1fr_200px_1fr] border-b border-slate-500/30 py-4">
    <div class="flex items-center justify-end gap-24 pr-24 text-3xl font-bold text-slate-100">
      <div v-for="stats in statsMap" :key="`blue-${stats.type}`" class="flex items-center gap-1">
        <img :src="stats.icon" class="h-12 w-12">
        <span class="tabular-nums w-10">{{ teams.blue[stats.type as keyof typeof teams.blue] }}</span>
      </div>
    </div>
    <div class="flex items-center justify-center text-4xl font-semibold">
      <div class="text-sky-400 w-40 tabular-nums text-center">{{ teams.blue.score }}</div>
      <div class="text-yellow-400 w-40 tabular-nums text-center">⚔</div>
      <div class="text-rose-400 w-40 tabular-nums text-center">{{ teams.red.score }}</div>
    </div>
    <div class="flex items-center gap-24 pl-24 text-3xl font-bold text-slate-100">
      <div v-for="stats in statsMap.slice().reverse()" :key="`red-${stats.type}`" class="flex items-center gap-1">
        <img :src="stats.icon" class="h-12 w-12">
        <span class="tabular-nums w-10">{{ teams.red[stats.type as keyof typeof teams.red] }}</span>
      </div>
    </div>
  </div>
</template>
