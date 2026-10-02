<script setup lang="ts">
const statsMap = [
  { type: "dragons", title: "Dragons", icon: "/icons/dragon.png" },
  { type: "heralds", title: "Heralds", icon: "/icons/riftherald.png" },
  { type: "grubs", title: "Grubs", icon: "/icons/grub.png" },
  { type: "turrets", title: "Turrets", icon: "/icons/tower.png" }
];

const props = defineProps<{
  name: string;
  team: TeamStats;
  dragonSlots: number;
  reverse?: boolean;
}>();

const filteredStatsMap = computed(() => {
  if (!props.dragonSlots) {
    return statsMap.filter(stat => stat.type === "turrets");
  }
  return statsMap;
});
</script>

<template>
  <div>
    <div v-for="stats in reverse ? filteredStatsMap.slice().reverse() : filteredStatsMap" :key="`${name}-${stats.type}`" class="flex items-center gap-1">
      <img :src="extAsset(stats.icon)" class="h-12 w-12">
      <span class="tabular-nums w-10">{{ team[stats.type as keyof typeof team] }}</span>
    </div>
  </div>
</template>
