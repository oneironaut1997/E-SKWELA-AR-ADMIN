<template>
  <div :class="containerClasses">
    <div :class="spinnerClasses">
      <div class="animate-spin rounded-full border-2 border-current border-t-transparent" :style="spinnerStyle"></div>
    </div>
    <p v-if="message" :class="messageClasses">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'muted';
  message?: string;
  overlay?: boolean;
  centered?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'primary',
  overlay: false,
  centered: false,
});

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

const variantClasses = {
  primary: 'text-blue-600',
  secondary: 'text-gray-600',
  muted: 'text-gray-400',
};

const containerClasses = computed(() => [
  'flex items-center gap-3',
  props.centered && 'justify-center',
  props.overlay && 'fixed inset-0 bg-white bg-opacity-75 z-50 flex-col',
]);

const spinnerClasses = computed(() => [
  sizeClasses[props.size],
  variantClasses[props.variant],
]);

const spinnerStyle = computed(() => ({
  width: sizeClasses[props.size].split(' ')[1].replace('w-', '').replace('4', '1rem').replace('6', '1.5rem').replace('8', '2rem').replace('12', '3rem'),
  height: sizeClasses[props.size].split(' ')[0].replace('h-', '').replace('4', '1rem').replace('6', '1.5rem').replace('8', '2rem').replace('12', '3rem'),
}));

const messageClasses = computed(() => [
  'text-sm font-medium',
  variantClasses[props.variant],
  props.overlay && 'mt-2',
]);
</script>