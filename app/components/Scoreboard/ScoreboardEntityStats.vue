<script setup lang="ts">
const statsMap = [
  { type: "dragons", title: "Dragons", icon: "/icons/dragon.png" },
  { type: "heralds", title: "Heralds", icon: "/icons/riftherald.png" },
  { type: "grubs", title: "Grubs", icon: "/icons/grub.png" },
  { type: "turrets", title: "Turrets", icon: "/icons/tower.png" }
];

defineProps<{
  name: string;
  team: TeamStats;
  reverse?: boolean;
}>();
</script>

<template>
  <div>
    <div v-for="stats in reverse ? statsMap.slice().reverse() : statsMap" :key="`${name}-${stats.type}`" class="flex items-center gap-1">
      <img :src="extAsset(stats.icon)" class="h-12 w-12">
      <span class="tabular-nums w-10">{{ team[stats.type as keyof typeof team] }}</span>
    </div>
  </div>
</template>
