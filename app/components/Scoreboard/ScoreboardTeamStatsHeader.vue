<script setup lang="ts">
const props = defineProps<{
  game: GameData["game"];
  teams: GameData["teams"];
  isMobile: boolean;
}>();

const dragonIconMap = [
  { type: "Fire", title: "Infernal Dragon", icon: "/icons/dragon_infernal.png" },
  { type: "Earth", title: "Mountain Dragon", icon: "/icons/dragon_mountain.png" },
  { type: "Water", title: "Ocean Dragon", icon: "/icons/dragon_ocean.png" },
  { type: "Air", title: "Cloud Dragon", icon: "/icons/dragon_cloud.png" },
  { type: "Hextech", title: "Hextech Dragon", icon: "/icons/dragon_hextech.png" },
  { type: "Chemtech", title: "Chemtech Dragon", icon: "/icons/dragon_chemtech.png" },
  { type: "Elder", title: "Elder Dragon", icon: "/icons/dragon_elder.png" }
];

const dragonSoulsIconMap = [
  { type: "Fire", title: "Infernal Soul", icon: "/icons/dragonsouliconinfernal.png" },
  { type: "Earth", title: "Mountain Soul", icon: "/icons/dragonsouliconmountain.png" },
  { type: "Water", title: "Ocean Soul", icon: "/icons/dragonsouliconocean.png" },
  { type: "Air", title: "Cloud Soul", icon: "/icons/dragonsouliconcloud.png" },
  { type: "Hextech", title: "Hextech Soul", icon: "/icons/dragonsouliconhextech.png" },
  { type: "Chemtech", title: "Chemtech Soul", icon: "/icons/dragonsouliconchemtech.png" }
];

const blueDragons = computed(() => props.teams.blue.dragonTypes?.filter(type => type !== "Elder") || []);
const redDragons = computed(() => props.teams.red.dragonTypes?.filter(type => type !== "Elder") || []);

const maxDragons = props.game.dragonSlots;

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
  <div>
    <div class="scoreboard__top flex items-center justify-center border-b border-slate-500/40 gap-2 relative">
      <div class="flex items-center py-6">
        <div class="ml-auto flex items-center gap-6 scale-x-[-1]">
          <div v-for="dot in maxDragons" :key="`blue-dragons-${dot}`" class="h-16 w-16 rounded-full border border-slate-800/80 bg-slate-950">
            <img
              v-if="dragonIconMap.find(item => item.type === blueDragons[dot - 1] as string) && teams.blue.dragonTypes[dot - 1] !== 'Elder'"
              :src="extAsset(dragonIconMap.find(item => item.type === blueDragons[dot - 1] as string)!.icon)"
              :title="dragonIconMap.find(item => item.type === blueDragons[dot - 1] as string)?.title"
              class="h-full w-full scale-x-[-1] p-1"
            >
          </div>
        </div>
      </div>
      <div v-if="game.dragonSlots > 0" class="mx-6 flex h-16 w-16 rotate-45 items-center justify-center border-2 border-slate-300/50 bg-slate-950 overflow-hidden">
        <span class="-rotate-45">
          <img v-if="dragonSoul || dragonSoulNotConsumed" :src="extAsset(dragonSoul?.icon || dragonSoulNotConsumed!.icon)" class="h-full w-full scale-110" :class="{ grayscale: !dragonSoul && dragonSoulNotConsumed }" :title="dragonSoul?.title || dragonSoulNotConsumed?.title">
        </span>
      </div>
      <div class="flex items-center">
        <div class="flex items-center gap-6">
          <div v-for="dot in maxDragons" :key="`red-dragons-${dot}`" class="h-16 w-16 rounded-full border border-slate-800/80 bg-slate-950">
            <img
              v-if="dragonIconMap.find(item => item.type === redDragons[dot - 1] as string) && teams.red.dragonTypes[dot - 1] !== 'Elder'"
              :src="extAsset(dragonIconMap.find(item => item.type === redDragons[dot - 1] as string)!.icon)"
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
    <div v-if="!isMobile" class="scoreboard__stats grid grid-cols-[1fr_200px_1fr] border-b border-slate-500/30 py-4">
      <ScoreboardEntityStats name="blue" :team="teams.blue" class="flex items-center gap-24 pl-24 text-3xl font-bold text-slate-100" :dragon-slots="game.dragonSlots" />
      <div class="flex items-center justify-center text-4xl font-semibold">
        <div class="text-sky-400 w-40 tabular-nums text-center">{{ teams.blue.score }}</div>
        <div class="text-yellow-400 w-40 tabular-nums text-center">⚔</div>
        <div class="text-rose-400 w-40 tabular-nums text-center">{{ teams.red.score }}</div>
      </div>
      <ScoreboardEntityStats name="red" :team="teams.red" reverse class="flex items-center gap-24 pl-24 text-3xl font-bold text-slate-100" :dragon-slots="game.dragonSlots" />
    </div>
  </div>
</template>
