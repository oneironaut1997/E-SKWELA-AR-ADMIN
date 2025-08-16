<template>
  <div>
    <div v-if="hasError" class="min-h-96 flex items-center justify-center">
      <div class="text-center space-y-4 max-w-md mx-auto p-6">
        <div class="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <AlertTriangle class="w-8 h-8 text-red-600" />
        </div>
        
        <div class="space-y-2">
          <h3 class="text-lg font-semibold text-gray-900">Something went wrong</h3>
          <p class="text-sm text-gray-600">
            {{ errorMessage || 'An unexpected error occurred. Please try again.' }}
          </p>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-2 justify-center">
          <Button @click="retry" variant="default">
            <RefreshCw class="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button @click="goHome" variant="outline">
            <Home class="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </div>
        
        <details v-if="showDetails && errorDetails" class="text-left">
          <summary class="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
            Show error details
          </summary>
          <pre class="mt-2 p-3 bg-gray-100 rounded text-xs text-gray-700 overflow-auto">{{ errorDetails }}</pre>
        </details>
      </div>
    </div>
    
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue';
import { router } from '@inertiajs/vue3';
import { AlertTriangle, Home, RefreshCw } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

interface Props {
  showDetails?: boolean;
  fallbackMessage?: string;
}

const props = withDefaults(defineProps<Props>(), {
  showDetails: false,
});

const hasError = ref(false);
const errorMessage = ref('');
const errorDetails = ref('');

const retry = () => {
  hasError.value = false;
  errorMessage.value = '';
  errorDetails.value = '';
  // Force component re-render
  window.location.reload();
};

const goHome = () => {
  router.visit('/dashboard');
};

onErrorCaptured((error: Error) => {
  hasError.value = true;
  errorMessage.value = props.fallbackMessage || error.message;
  errorDetails.value = error.stack || error.toString();
  
  // Log error for debugging
  console.error('Error caught by ErrorBoundary:', error);
  
  return false; // Prevent error from propagating
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  hasError.value = true;
  errorMessage.value = 'An unexpected error occurred';
  errorDetails.value = event.reason?.toString() || 'Unknown error';
  console.error('Unhandled promise rejection:', event.reason);
});
</script>