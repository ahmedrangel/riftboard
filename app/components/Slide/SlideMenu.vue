<script setup lang="ts">
const props = defineProps<{
  items: MenuItem[];
  modelValue: boolean;
}>();
const menuSelected = ref<string | null>(null);
const open = computed(() => props.modelValue);

const menuItemOpen = (item: MenuItem) => {
  menuSelected.value = menuSelected.value === item.id ? null : item.id;
  item.onClick();
};

const menuItemClose = (item: MenuItem) => {
  menuSelected.value = null;
  item.onClose();
};

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  onClick: () => void;
  onClose: () => void;
}
</script>

<template>
  <USlideover v-model:open="open" side="left" :modal="false" :dismissible="false" :ui="{ content: 'bg-transparent ring-transparent shadow-transparent items-start justify-center max-w-[60px]' }">
    <template #content>
      <div class="flex flex-col gap-2">
        <template v-for="item in props.items" :key="item.id">
          <UButton color="neutral" class="shadow rounded-none focus-visible:outline-none hover:bg-slate-800 hover:text-white border border-white/20" :class="{ 'bg-slate-950 text-white': menuSelected === item.id }" @click="menuItemOpen(item)">
            <Icon :name="item.icon" size="40" />
          </UButton>
        </template>
        <UButton v-if="menuSelected" color="neutral" class="shadow rounded-none focus-visible:outline-none hover:bg-red-900 hover:text-white border border-white/20" @click="menuItemClose(props.items.find(item => item.id === 'scoreboard')!)">
          <Icon name="material-symbols-light:close" size="40" />
        </UButton>
      </div>
    </template>
    <TransitionGroup name="fade">
      <slot :name="menuSelected" />
    </TransitionGroup>
  </USlideover>
</template>
