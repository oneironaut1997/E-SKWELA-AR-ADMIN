<script setup lang="ts">
import { inject, computed } from 'vue';
import { cn } from '@/lib/utils';

interface Props {
  value: string;
  class?: string;
  disabled?: boolean;
}

const props = defineProps<Props>();
const selectContext = inject('selectContext') as any;

const itemClasses = computed(() => 
  cn(
    'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
    props.disabled && 'pointer-events-none opacity-50',
    props.class
  )
);

const handleClick = () => {
  if (!props.disabled) {
    selectContext?.onValueChange(props.value);
  }
};
</script>

<template>
  <div
    :class="itemClasses"
    @click="handleClick"
  >
    <slot />
  </div>
</template>