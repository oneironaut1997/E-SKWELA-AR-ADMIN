<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { router, usePage } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import type { BreadcrumbItem, ARContent, UpdateContentData } from '@/types';
import { mockApi } from '@/services/mockApi';
import ContentForm from '@/components/content/ContentForm.vue';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2 } from 'lucide-vue-next';

// Page props
interface Props {
  id: string;
}

const props = defineProps<Props>();

// Page setup
const breadcrumbs = ref<BreadcrumbItem[]>([
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'AR Content', href: '/content' },
  { title: 'Edit Content', href: `/content/${props.id}/edit` }
]);

// State
const content = ref<ARContent | null>(null);
const loading = ref(false);
const loadingContent = ref(true);
const error = ref<string | null>(null);
const notFound = ref(false);

// Methods
const fetchContent = async () => {
  loadingContent.value = true;
  error.value = null;
  
  try {
    const response = await mockApi.getContentById(parseInt(props.id));
    
    if (response.success) {
      content.value = response.data;
      // Update breadcrumbs with content title
      breadcrumbs.value = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'AR Content', href: '/content' },
        { title: response.data.title, href: `/content/${props.id}/edit` }
      ];
    } else {
      notFound.value = true;
      error.value = response.message || 'Content not found';
    }
  } catch (err) {
    console.error('Error fetching content:', err);
    error.value = err instanceof Error ? err.message : 'Failed to load content';
  } finally {
    loadingContent.value = false;
  }
};

const handleSubmit = async (data: UpdateContentData) => {
  if (!content.value) return;
  
  loading.value = true;
  error.value = null;
  
  try {
    const response = await mockApi.updateContent(content.value.id, data);
    
    if (response.success) {
      // Update local content data
      content.value = response.data;
      
      // Show success message and redirect
      router.visit('/content', {
        onSuccess: () => {
          console.log('Content updated successfully:', response.data);
        }
      });
    } else {
      error.value = response.message || 'Failed to update content';
    }
  } catch (err) {
    console.error('Error updating content:', err);
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

const handlePreview = (previewContent: ARContent) => {
  // Preview functionality is handled within the ContentForm component
  console.log('Preview content:', previewContent);
};

const handleDelete = async () => {
  if (!content.value) return;
  
  const confirmMessage = `Are you sure you want to delete "${content.value.title}"? This action cannot be undone.`;
  
  if (confirm(confirmMessage)) {
    try {
      loading.value = true;
      const response = await mockApi.deleteContent(content.value.id);
      
      if (response.success) {
        router.visit('/content', {
          onSuccess: () => {
            console.log('Content deleted successfully');
          }
        });
      } else {
        error.value = response.message || 'Failed to delete content';
      }
    } catch (err) {
      console.error('Error deleting content:', err);
      error.value = err instanceof Error ? err.message : 'Failed to delete content';
    } finally {
      loading.value = false;
    }
  }
};

const goBack = () => {
  router.visit('/content');
};

// Lifecycle
onMounted(() => {
  fetchContent();
});
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="space-y-6">
      <!-- Loading State -->
      <div v-if="loadingContent" class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p class="text-muted-foreground">Loading content...</p>
        </div>
      </div>

      <!-- Not Found State -->
      <div v-else-if="notFound" class="text-center py-12">
        <div class="mx-auto max-w-md">
          <svg class="mx-auto h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">Content not found</h3>
          <p class="mt-2 text-sm text-muted-foreground">
            The content you're looking for doesn't exist or may have been deleted.
          </p>
          <div class="mt-6">
            <Button @click="goBack" class="gap-2">
              <ArrowLeft class="h-4 w-4" />
              Back to Content
            </Button>
          </div>
        </div>
      </div>

      <!-- Content Edit Form -->
      <template v-else-if="content">
        <!-- Page Header -->
        <div class="flex items-center gap-4">
          <Button variant="ghost" size="sm" @click="goBack" class="gap-2">
            <ArrowLeft class="h-4 w-4" />
            Back to Content
          </Button>
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <Edit class="h-6 w-6 text-primary" />
              <h1 class="text-3xl font-bold tracking-tight">Edit AR Content</h1>
            </div>
            <p class="text-muted-foreground mt-1">
              Update your AR content details and files
            </p>
          </div>
          <Button 
            variant="destructive" 
            size="sm" 
            @click="handleDelete"
            :disabled="loading"
            class="gap-2"
          >
            <Trash2 class="h-4 w-4" />
            Delete
          </Button>
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
                Error Updating Content
              </h3>
              <div class="mt-2 text-sm text-red-700">
                {{ error }}
              </div>
            </div>
          </div>
        </div>

        <!-- Content Form -->
        <ContentForm
          :content="content"
          mode="edit"
          :loading="loading"
          @submit="handleSubmit"
          @cancel="handleCancel"
          @preview="handlePreview"
        />

        <!-- Content Information -->
        <div class="mt-8 p-6 bg-muted/50 rounded-lg border border-dashed">
          <h3 class="text-lg font-medium mb-3">Content Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 class="font-medium text-primary mb-1">Created</h4>
              <p class="text-muted-foreground">{{ new Date(content.createdAt).toLocaleDateString() }}</p>
            </div>
            <div>
              <h4 class="font-medium text-primary mb-1">Last Updated</h4>
              <p class="text-muted-foreground">{{ new Date(content.updatedAt).toLocaleDateString() }}</p>
            </div>
            <div>
              <h4 class="font-medium text-primary mb-1">QR Code</h4>
              <code class="text-xs bg-muted px-2 py-1 rounded">{{ content.qrCode }}</code>
            </div>
          </div>
          <div class="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
            <p class="text-sm text-yellow-800">
              <strong>Note:</strong> Uploading a new file will replace the existing file. The QR code will remain the same.
            </p>
          </div>
        </div>
      </template>
    </div>
  </AppLayout>
</template>