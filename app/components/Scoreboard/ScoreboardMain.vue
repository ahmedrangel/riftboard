<script setup lang="ts">
import { useElementSize, useWindowSize } from "@vueuse/core";

const props = defineProps<{
  data: GameData | null;
  downscale?: number;
  isMobile?: boolean;
}>();

const { width, height } = useWindowSize();

const content = ref<HTMLElement | null>(null);
const { height: contentHeight } = useElementSize(content, undefined, { box: "border-box" });

const baseWidth = computed(() => props.isMobile ? 1080 : 1920);
const downscale = computed(() => (props.downscale || 0) / 100);

const scale = computed(() => {
  const scaleX = width.value / baseWidth.value;
  if (!props.isMobile || !contentHeight.value) return scaleX;
  const scaleY = height.value / contentHeight.value;
  return Math.min(scaleX, scaleY);
});

const finalScale = computed(() => Math.max(scale.value - downscale.value, 0.01));

const bluePlayers = computed(() => props.data?.players.filter(player => player.team === "blue") || []);
const redPlayers = computed(() => props.data?.players.filter(player => player.team === "red") || []);
</script>

<template>
  <div class="relative h-dvh w-full" :class="{ 'overflow-hidden': !isMobile }">
    <div
      ref="content"
      class="absolute top-1/2 left-1/2 border border-slate-600/70 text-slate-200 bg-neutral-900 rounded-md overflow-hidden"
      :class="isMobile ? 'w-[1080px]' : 'w-[1920px]'"
      :style="{ transform: `translate(-50%, -50%) scale(${finalScale})` }"
    >
      <template v-if="data?.game?.started">
        <ScoreboardTeamStatsHeader class="scoreboard" :teams="data.teams" :game="data.game" :is-mobile="isMobile" />
        <div :class="isMobile ? 'scoreboard-mobile flex flex-col' : 'scoreboard grid grid-cols-2'">
          <div>
            <div class="min-w-0" :class="{ 'border-r border-slate-500/40': !isMobile }">
              <ScoreboardEntityStats v-if="isMobile" name="blue" :team="data.teams.blue" class="bg-black/20 flex items-center justify-center py-5 gap-14 text-3xl font-bold text-slate-100" :dragon-slots="data.game.dragonSlots" />
              <ScoreboardPlayerRow :account="data.account" :players="bluePlayers" :cdn="data.resources.cdn" :version="data.game.version" />
            </div>
          </div>
          <div class="mt-auto">
            <div class="min-w-0">
              <ScoreboardEntityStats v-if="isMobile" name="red" :team="data.teams.red" class="bg-black/20 flex items-center justify-center py-5 gap-14 text-3xl font-bold text-slate-100" :dragon-slots="data.game.dragonSlots" />
              <ScoreboardPlayerRow :account="data.account" :players="redPlayers" :cdn="data.resources.cdn" :version="data.game.version" />
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div v-if="data?.account?.gameName && data.account.tagLine" class="flex items-center justify-center h-96 text-4xl text-slate-200 font-semibold">
          <span class="text-slate-50 font-bold">{{ data.account.gameName }}#{{ data.account.tagLine }}</span>&nbsp;is not currently in a game.
        </div>
        <div v-else class="flex items-center justify-center h-96 text-4xl text-slate-200 font-semibold">
          No game data available.
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.scoreboard {
  background: linear-gradient(90deg, rgba(16, 27, 49, 0.97) 0%, rgba(12, 29, 29, 0.95) 50%, rgba(30, 13, 18, 0.97) 100%);
}

.scoreboard-mobile {
  background: linear-gradient(180deg, rgba(16, 27, 49, 0.97) 0%, rgba(12, 29, 29, 0.95) 50%, rgba(30, 13, 18, 0.97) 100%);
}

.scoreboard__top {
  background: linear-gradient(180deg, rgba(13, 31, 38, 0.98), rgba(4, 18, 25, 0.98));
}

.scoreboard__stats {
  background: linear-gradient(180deg, rgba(11, 35, 43, 0.96), rgba(5, 23, 30, 0.95));
}

.scoreboard__row {
  background: linear-gradient(180deg, rgba(8, 21, 28, 0.38), rgba(4, 16, 22, 0.4));
}
</style>
