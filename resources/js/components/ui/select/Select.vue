<script setup lang="ts">
import { ref, computed, provide, inject } from 'vue';
import { cn } from '@/lib/utils';

interface Props {
  modelValue?: string;
  placeholder?: string;
  disabled?: boolean;
  class?: string;
}

interface SelectContext {
  value: string | undefined;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const isOpen = ref(false);
const selectedValue = computed(() => props.modelValue);

const selectContext: SelectContext = {
  value: selectedValue.value,
  onValueChange: (value: string) => {
    emit('update:modelValue', value);
    isOpen.value = false;
  },
  placeholder: props.placeholder
};

provide('selectContext', selectContext);

const toggleOpen = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value;
  }
};

const closeSelect = () => {
  isOpen.value = false;
};

// Close on outside click
const handleOutsideClick = (event: Event) => {
  const target = event.target as Element;
  if (!target.closest('[data-select-root]')) {
    closeSelect();
  }
};

// Add/remove event listener
const addOutsideClickListener = () => {
  document.addEventListener('click', handleOutsideClick);
};

const removeOutsideClickListener = () => {
  document.removeEventListener('click', handleOutsideClick);
};

// Watch for open state changes
const watchOpen = (open: boolean) => {
  if (open) {
    addOutsideClickListener();
  } else {
    removeOutsideClickListener();
  }
};

// Provide open state and methods to children
provide('selectOpen', {
  isOpen,
  toggleOpen,
  closeSelect,
  watchOpen
});
</script>

<template>
  <div 
    data-select-root
    class="relative"
    :class="cn('', props.class)"
  >
    <slot />
  </div>
</template>