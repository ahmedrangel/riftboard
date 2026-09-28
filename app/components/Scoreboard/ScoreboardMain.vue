<script setup lang="ts">
import { useWindowSize } from "@vueuse/core";

const props = defineProps<{
  data: GameData;
  downscale?: number;
}>();

const { width } = useWindowSize();
const scale = computed(() => width.value / 1920);

const bluePlayers = computed(() => props.data.players.filter(player => player.team === "blue"));
const redPlayers = computed(() => props.data.players.filter(player => player.team === "red"));
const downscale = computed(() => (props.downscale || 0) / 100);
</script>

<template>
  <ClientOnly>
    <div class="relative h-dvh w-full overflow-hidden">
      <div
        id="scoreboard"
        class="border border-slate-600/70 text-slate-200 -translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 w-[1920px]"
        :style="{ transform: `scale(${scale - downscale})` }"
      >
        <ScoreboardTeamStatsHeader :teams="data.teams" :game="data.game" />
        <div class="grid grid-cols-2">
          <section class="min-w-0 border-r border-slate-500/40">
            <ScoreboardPlayerRow :players="bluePlayers" :cdn="data.resources.cdn" :version="data.game.version" />
          </section>
          <section class="min-w-0">
            <ScoreboardPlayerRow :players="redPlayers" :cdn="data.resources.cdn" :version="data.game.version" />
          </section>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped>
#scoreboard {
  background: linear-gradient(90deg, rgba(16, 27, 49, 0.97) 0%, rgba(12, 29, 29, 0.95) 50%, rgba(30, 13, 18, 0.97) 100%);
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
