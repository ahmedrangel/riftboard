<script setup lang="ts">
import { useWindowSize } from "@vueuse/core";

const props = defineProps<{
  data: GameData | null;
  downscale?: number;
  isMobile?: boolean;
}>();

const { width, height } = useWindowSize();
const scale = computed(() => props.isMobile ? height.value / 1920 : width.value / 1920);

const bluePlayers = computed(() => props.data?.players.filter(player => player.team === "blue") || []);
const redPlayers = computed(() => props.data?.players.filter(player => player.team === "red") || []);
const downscale = computed(() => (props.downscale || 0) / 100);
</script>

<template>
  <div class="relative h-dvh w-full" :class="{ 'overflow-hidden': !isMobile }">
    <div
      class="border border-slate-600/70 text-slate-200 bg-neutral-900"
      :class="isMobile ? 'w-full min-w-270 -translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2' : 'w-[1920px] -translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2'"
      :style="isMobile ? { transform: `scale(${scale - downscale})` } : { transform: `scale(${scale - downscale})` }"
    >
      <template v-if="data?.game?.started">
        <ScoreboardTeamStatsHeader class="scoreboard" :teams="data.teams" :game="data.game" :is-mobile="isMobile" />
        <div :class="isMobile ? 'scoreboard-mobile flex flex-col' : 'scoreboard grid grid-cols-2'">
          <div>
            <div class="min-w-0" :class="{ 'border-r border-slate-500/40': !isMobile }">
              <ScoreboardEntityStats v-if="isMobile" name="blue" :team="data.teams.blue" class="bg-black/20 flex items-center justify-center py-5 gap-14 text-3xl font-bold text-slate-100" />
              <ScoreboardPlayerRow :players="bluePlayers" :cdn="data.resources.cdn" :version="data.game.version" />
            </div>
          </div>
          <div class="mt-auto">
            <div class="min-w-0">
              <ScoreboardEntityStats v-if="isMobile" name="red" :team="data.teams.red" class="bg-black/20 flex items-center justify-center py-5 gap-14 text-3xl font-bold text-slate-100" />
              <ScoreboardPlayerRow :players="redPlayers" :cdn="data.resources.cdn" :version="data.game.version" />
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
