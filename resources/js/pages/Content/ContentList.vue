<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import type { BreadcrumbItem, ARContent } from '@/types';
import { mockApi } from '@/services/mockApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ContentTable from '@/components/content/ContentTable.vue';
import ContentPreview from '@/components/content/ContentPreview.vue';
import { 
  Plus, 
  Box, 
  Volume2,
  FileText,
  QrCode,
  TrendingUp
} from 'lucide-vue-next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Page setup
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'AR Content', href: '/content' }
];

// State
const loading = ref(false);
const showPreviewDialog = ref(false);
const selectedContent = ref<ARContent | null>(null);
const stats = ref({
  total: 0,
  models3D: 0,
  audio: 0,
  active: 0
});

// Methods
const fetchStats = async () => {
  try {
    // Fetch content to calculate stats
    const response = await mockApi.getContent({ per_page: 1000 });
    if (response.success) {
      const content = response.data;
      stats.value = {
        total: content.length,
        models3D: content.filter(c => c.type === '3d_model').length,
        audio: content.filter(c => c.type === 'audio').length,
        active: content.filter(c => c.status === 'active').length
      };
    }
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
};

const handleCreateContent = () => {
  router.visit('/content/create');
};

const handleEditContent = (content: ARContent) => {
  router.visit(`/content/${content.id}/edit`);
};

const handleDeleteContent = async (content: ARContent) => {
  if (confirm(`Are you sure you want to delete "${content.title}"?`)) {
    try {
      loading.value = true;
      const response = await mockApi.deleteContent(content.id);
      if (response.success) {
        // Refresh the table by triggering a re-fetch
        await fetchStats();
        // The ContentTable component will handle its own refresh
      } else {
        alert(response.message || 'Failed to delete content');
      }
    } catch (error) {
      console.error('Error deleting content:', error);
      alert('Failed to delete content');
    } finally {
      loading.value = false;
    }
  }
};

const handlePreviewContent = (content: ARContent) => {
  selectedContent.value = content;
  showPreviewDialog.value = true;
};

const closePreview = () => {
  showPreviewDialog.value = false;
  selectedContent.value = null;
};

// Lifecycle
onMounted(() => {
  fetchStats();
});
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">AR Content Management</h1>
          <p class="text-muted-foreground">
            Manage your 3D models, audio files, and QR codes for AR experiences
          </p>
        </div>
        <Button @click="handleCreateContent" class="gap-2">
          <Plus class="h-4 w-4" />
          Create Content
        </Button>
      </div>

      <!-- Stats Cards -->
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Total Content</CardTitle>
            <FileText class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ stats.total }}</div>
            <p class="text-xs text-muted-foreground">
              AR content items
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">3D Models</CardTitle>
            <Box class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ stats.models3D }}</div>
            <p class="text-xs text-muted-foreground">
              Interactive 3D content
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Audio Files</CardTitle>
            <Volume2 class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ stats.audio }}</div>
            <p class="text-xs text-muted-foreground">
              Audio content
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Active Content</CardTitle>
            <TrendingUp class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ stats.active }}</div>
            <p class="text-xs text-muted-foreground">
              Published content
            </p>
          </CardContent>
        </Card>
      </div>

      <!-- Content Table -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Box class="h-5 w-5" />
            Content Library
          </CardTitle>
          <CardDescription>
            Browse, search, and manage your AR content collection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContentTable
            :on-edit="handleEditContent"
            :on-delete="handleDeleteContent"
            :on-preview="handlePreviewContent"
          />
        </CardContent>
      </Card>

      <!-- Preview Dialog -->
      <Dialog v-model:open="showPreviewDialog">
        <DialogContent class="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle class="flex items-center gap-2">
              <component :is="selectedContent?.type === '3d_model' ? Box : Volume2" class="h-5 w-5" />
              Content Preview
            </DialogTitle>
            <DialogDescription>
              Preview your AR content before publishing
            </DialogDescription>
          </DialogHeader>
          
          <div v-if="selectedContent" class="mt-4">
            <ContentPreview :content="selectedContent" />
          </div>
          
          <div class="flex justify-end gap-2 mt-6">
            <Button variant="outline" @click="closePreview">
              Close
            </Button>
            <Button v-if="selectedContent" @click="handleEditContent(selectedContent)">
              Edit Content
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  </AppLayout>
</template>