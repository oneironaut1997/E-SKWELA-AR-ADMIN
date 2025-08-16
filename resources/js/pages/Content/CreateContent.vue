<script setup lang="ts">
import { ref } from 'vue';
import { router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import type { BreadcrumbItem, CreateContentData } from '@/types';
import { mockApi } from '@/services/mockApi';
import ContentForm from '@/components/content/ContentForm.vue';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-vue-next';

// Page setup
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'AR Content', href: '/content' },
  { title: 'Create Content', href: '/content/create' }
];

// State
const loading = ref(false);
const error = ref<string | null>(null);

// Methods
const handleSubmit = async (data: CreateContentData) => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await mockApi.createContent(data);
    
    if (response.success) {
      // Show success message and redirect
      router.visit('/content', {
        onSuccess: () => {
          // Success notification would be handled by the parent component
          console.log('Content created successfully:', response.data);
        }
      });
    } else {
      error.value = response.message || 'Failed to create content';
    }
  } catch (err) {
    console.error('Error creating content:', err);
    error.value = err instanceof Error ? err.message : 'An unexpected error occurred';
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
    router.visit('/content');
  }
};

const handlePreview = (content: any) => {
  // Preview functionality is handled within the ContentForm component
  console.log('Preview content:', content);
};

const goBack = () => {
  router.visit('/content');
};
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center gap-4">
        <Button variant="ghost" size="sm" @click="goBack" class="gap-2">
          <ArrowLeft class="h-4 w-4" />
          Back to Content
        </Button>
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <Plus class="h-6 w-6 text-primary" />
            <h1 class="text-3xl font-bold tracking-tight">Create New AR Content</h1>
          </div>
          <p class="text-muted-foreground mt-1">
            Add new 3D models or audio files to your AR content library
          </p>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="rounded-md bg-red-50 p-4 border border-red-200">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              Error Creating Content
            </h3>
            <div class="mt-2 text-sm text-red-700">
              {{ error }}
            </div>
          </div>
        </div>
      </div>

      <!-- Content Form -->
      <ContentForm
        mode="create"
        :loading="loading"
        @submit="handleSubmit"
        @cancel="handleCancel"
        @preview="handlePreview"
      />

      <!-- Help Section -->
      <div class="mt-8 p-6 bg-muted/50 rounded-lg border border-dashed">
        <h3 class="text-lg font-medium mb-3">Content Creation Guidelines</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 class="font-medium text-primary mb-2">3D Models</h4>
            <ul class="space-y-1 text-muted-foreground">
              <li>• Supported formats: .gltf, .glb</li>
              <li>• Maximum file size: 100MB</li>
              <li>• Optimized models perform better</li>
              <li>• Include textures in the model file</li>
            </ul>
          </div>
          <div>
            <h4 class="font-medium text-primary mb-2">Audio Files</h4>
            <ul class="space-y-1 text-muted-foreground">
              <li>• Supported formats: .mp3, .wav</li>
              <li>• Maximum file size: 100MB</li>
              <li>• Recommended: 44.1kHz, 16-bit</li>
              <li>• Clear audio enhances learning</li>
            </ul>
          </div>
        </div>
        <div class="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
          <p class="text-sm text-blue-800">
            <strong>Tip:</strong> QR codes are automatically generated based on your content's subject and will be assigned a unique ID once created.
          </p>
        </div>
      </div>
    </div>
  </AppLayout>
</template>