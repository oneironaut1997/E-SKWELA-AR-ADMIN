<template>
  <div
    v-if="visible"
    :class="[
      'fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 transform',
      'max-w-md min-w-80',
      toastClasses,
      visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    ]"
  >
    <!-- Icon -->
    <div class="flex-shrink-0">
      <CheckCircle v-if="type === 'success'" class="h-5 w-5" />
      <AlertCircle v-else-if="type === 'error'" class="h-5 w-5" />
      <AlertTriangle v-else-if="type === 'warning'" class="h-5 w-5" />
      <Info v-else class="h-5 w-5" />
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <p v-if="title" class="text-sm font-medium">{{ title }}</p>
      <p class="text-sm" :class="title ? 'text-opacity-90' : ''">{{ message }}</p>
    </div>

    <!-- Close Button -->
    <button
      @click="close"
      class="flex-shrink-0 p-1 rounded-md hover:bg-black hover:bg-opacity-10 transition-colors"
    >
      <X class="h-4 w-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-vue-next';

interface Props {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  persistent?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 5000,
  persistent: false,
});

const emit = defineEmits<{
  close: [];
}>();

const visible = ref(false);

const toastClasses = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-green-50 border border-green-200 text-green-800';
    case 'error':
      return 'bg-red-50 border border-red-200 text-red-800';
    case 'warning':
      return 'bg-yellow-50 border border-yellow-200 text-yellow-800';
    default:
      return 'bg-blue-50 border border-blue-200 text-blue-800';
  }
});

const close = () => {
  visible.value = false;
  setTimeout(() => {
    emit('close');
  }, 300);
};

onMounted(() => {
  visible.value = true;
  
  if (!props.persistent) {
    setTimeout(() => {
      close();
    }, props.duration);
  }
});
</script>