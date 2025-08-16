<script setup lang="ts">
import { inject, computed } from 'vue';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-vue-next';

interface Props {
  class?: string;
  disabled?: boolean;
}

const props = defineProps<Props>();

const selectOpen = inject('selectOpen') as any;
const selectContext = inject('selectContext') as any;

const triggerClasses = computed(() => 
  cn(
    'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
    props.disabled && 'cursor-not-allowed opacity-50',
    props.class
  )
);
</script>

<template>
  <button
    type="button"
    :class="triggerClasses"
    :disabled="disabled"
    @click="selectOpen?.toggleOpen"
  >
    <slot />
    <ChevronDown class="h-4 w-4 opacity-50" />
  </button>
</template>