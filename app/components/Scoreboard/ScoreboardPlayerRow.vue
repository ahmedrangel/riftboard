<script setup lang="ts">
const props = defineProps<{
  players: Player[];
  cdn: string;
  version: string;
}>();

const players = computed(() => props.players);
const cdn = computed(() => props.cdn);
const version = computed(() => props.version);
</script>

<template>
  <div v-for="player in players" :key="player.riotIdGameName" class="scoreboard__row flex items-center justify-between border-b border-slate-500/20 p-3 gap-3" :class="{ 'bg-red-800/20': player.isDead }">
    <div class="order-1 flex gap-1">
      <div class="flex shrink-0 flex-col gap-1">
        <div v-for="spell in Object.values(player.summonerSpells)" :key="`${player.riotIdGameName}-${spell.displayName}`" class="h-10 w-10 overflow-hidden">
          <img v-if="spell" :src="getSummonerSpellIcon(cdn, version, spell.iconURL)" alt="" class="h-full w-full object-cover" :title="spell.displayName">
        </div>
      </div>
      <div class="flex shrink-0 flex-col gap-1">
        <div v-for="rune in [player.runes.keystone, player.runes.secondaryRuneTree]" :key="`${player.riotIdGameName}-${rune.displayName}`" class="h-10 w-10 overflow-hidden">
          <img v-if="rune" :src="getRuneIcon(cdn, rune.iconURL)" alt="" class="h-full w-full object-cover" :title="rune.displayName">
        </div>
      </div>
    </div>
    <div class="order-3 relative shrink-0">
      <img
        :src="getChampionIcon(cdn, version, player.champion.iconURL)"
        :class="[
          'h-24 w-24 rounded-full border-2 border-slate-300/80 object-cover',
          { grayscale: player.isDead },
        ]"
        :title="player.champion.displayName"
      >
      <span class="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border border-slate-300/80 bg-slate-950 text-xl font-bold text-white tabular-nums">
        {{ player.level }}
      </span>
      <span v-if="player.isDead" class="absolute inset-0 flex items-center justify-center text-4xl font-bold text-red-400 text-stroke tabular-nums">
        {{ Math.round(player.respawnTimer) }}
      </span>
    </div>
    <div class="w-20 order-5 text-center text-3xl text-yellow-200 tabular-nums">
      {{ player.scores.creepScore }}
    </div>
    <div class="w-40 order-6 text-center text-3xl font-semibold text-slate-300 tabular-nums">
      {{ player.scores.kills }}/{{ player.scores.deaths }}/{{ player.scores.assists }}
    </div>
    <div class="order-7 flex flex-col justify-center gap-2">
      <div class="text-2xl font-semibold" :class="{ 'text-red-400': player.team === 'red', 'text-sky-400': player.team === 'blue' }">
        {{ player.riotIdGameName }}
      </div>
      <div class="flex justify-center gap-1.5">
        <div v-for="slot in 7" :key="`${player.riotIdGameName}-item-${slot}`" class="relative h-16 w-16 border border-slate-600/60 bg-slate-950">
          <img
            v-if="player.items.find(item => item.slot === slot - 1)"
            :src="getItemIcon(cdn, version, player.items.find(item => item.slot === slot - 1)!.iconURL)"
            :title="player.items.find(item => item.slot === slot - 1)?.displayName"
            class="h-full w-full object-cover"
          >
          <span v-if="slot === 7" class="absolute bottom-0 left-1/2 -translate-x-1/2 px-1.5 text-3xl font-bold leading-5 text-white text-stroke tabular-nums">
            {{ Math.round(player.scores.wardScore) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .text-stroke {
  paint-order: stroke fill;
  -webkit-text-stroke: 8px black;
  }
</style>
