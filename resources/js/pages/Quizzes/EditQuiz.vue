<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="space-y-6 flex h-full flex-1 flex-col gap-6 rounded-xl p-4 overflow-x-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Edit Quiz</h1>
          <p class="text-muted-foreground">
            Update quiz settings and configuration
          </p>
        </div>
        <div class="flex items-center gap-2">
          <Button
            variant="outline"
            @click="$inertia.visit(`/quizzes/${quizId}/builder`)"
            :disabled="!quiz"
          >
            <Settings class="mr-2 h-4 w-4" />
            Quiz Builder
          </Button>
          <Button
            variant="outline"
            @click="$inertia.visit(`/quizzes/${quizId}/preview`)"
            :disabled="!quiz"
          >
            <Play class="mr-2 h-4 w-4" />
            Preview
          </Button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading && !quiz" class="flex items-center justify-center py-12">
        <div class="flex items-center gap-2">
          <Loader2 class="h-6 w-6 animate-spin" />
          <span>Loading quiz...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="text-destructive mb-4">
          <AlertCircle class="h-12 w-12 mx-auto mb-2" />
          <h3 class="text-lg font-medium">Quiz Not Found</h3>
          <p class="text-sm text-muted-foreground">
            The quiz you're looking for doesn't exist or has been deleted.
          </p>
        </div>
        <Button @click="$inertia.visit('/quizzes')">
          Back to Quizzes
        </Button>
      </div>

      <!-- Edit Quiz Form -->
      <div v-else-if="quiz" class="max-w-4xl">
        <div class="bg-card border rounded-lg p-6">
          <QuizForm
            mode="edit"
            :quiz="quiz"
            :available-content="availableContent"
            :loading="submitting"
            @submit="handleSubmit"
            @save-draft="handleSaveDraft"
            @cancel="handleCancel"
          />
        </div>
      </div>

      <!-- Quiz Info -->
      <div v-if="quiz" class="max-w-4xl">
        <div class="bg-muted/50 border rounded-lg p-6">
          <h3 class="text-lg font-medium mb-4 flex items-center gap-2">
            <Info class="h-5 w-5" />
            Quiz Information
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="space-y-3">
              <h4 class="font-medium flex items-center gap-2">
                <FileQuestion class="h-4 w-4 text-blue-600" />
                Quiz Details
              </h4>
              <div class="text-sm space-y-1">
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Questions:</span>
                  <span>{{ quiz.questionsCount }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Total Points:</span>
                  <span>{{ quiz.totalPoints }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Status:</span>
                  <Badge :variant="getStatusVariant(quiz.status)" class="capitalize">
                    {{ quiz.status }}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div class="space-y-3">
              <h4 class="font-medium flex items-center gap-2">
                <Clock class="h-4 w-4 text-orange-600" />
                Settings
              </h4>
              <div class="text-sm space-y-1">
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Time Limit:</span>
                  <span>{{ quiz.timeLimit }} minutes</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Max Attempts:</span>
                  <span>{{ quiz.maxAttempts }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Scoring:</span>
                  <span class="capitalize">{{ quiz.scoringMethod }}</span>
                </div>
              </div>
            </div>
            
            <div class="space-y-3">
              <h4 class="font-medium flex items-center gap-2">
                <Calendar class="h-4 w-4 text-green-600" />
                Timeline
              </h4>
              <div class="text-sm space-y-1">
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Created:</span>
                  <span>{{ formatDate(quiz.createdAt) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Updated:</span>
                  <span>{{ formatDate(quiz.updatedAt) }}</span>
                </div>
                <div v-if="quiz.associatedContent" class="flex justify-between">
                  <span class="text-muted-foreground">AR Content:</span>
                  <span class="truncate max-w-24" :title="quiz.associatedContent.title">
                    {{ quiz.associatedContent.title }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { router, usePage } from '@inertiajs/vue3';
import {
  AlertCircle,
  Calendar,
  Clock,
  FileQuestion,
  Info,
  Loader2,
  Play,
  Settings,
} from 'lucide-vue-next';

import AppLayout from '@/layouts/AppLayout.vue';
import QuizForm from '@/components/quizzes/QuizForm.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { mockApi } from '@/services/mockApi';
import type { Quiz, ARContent, UpdateQuizData, BreadcrumbItem } from '@/types';

// Page props
interface Props {
  quizId: number;
}

const props = defineProps<Props>();

// Page data
const quiz = ref<Quiz | null>(null);
const availableContent = ref<ARContent[]>([]);
const loading = ref(false);
const submitting = ref(false);
const error = ref(false);

// Get quiz ID from route or props
const quizId = computed(() => {
  return props.quizId || parseInt(usePage().url.split('/')[2]);
});

// Breadcrumbs
const breadcrumbs = computed((): BreadcrumbItem[] => [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Quizzes', href: '/quizzes' },
  { title: quiz.value?.title || 'Edit Quiz', href: `/quizzes/${quizId.value}/edit` },
]);

// Load quiz data
const loadQuiz = async () => {
  loading.value = true;
  error.value = false;
  
  try {
    const response = await mockApi.getQuizById(quizId.value);
    
    if (response.success) {
      quiz.value = response.data;
    } else {
      error.value = true;
      console.error('Failed to load quiz:', response.message);
    }
  } catch (err) {
    error.value = true;
    console.error('Error loading quiz:', err);
  } finally {
    loading.value = false;
  }
};

// Load available AR content for association
const loadAvailableContent = async () => {
  try {
    const response = await mockApi.getContent({
      status: 'active',
      per_page: 100, // Get all active content
    });
    
    if (response.success) {
      availableContent.value = response.data;
    }
  } catch (error) {
    console.error('Failed to load available content:', error);
  }
};

// Event handlers
const handleSubmit = async (data: UpdateQuizData) => {
  submitting.value = true;
  
  try {
    const response = await mockApi.updateQuiz(quizId.value, data);
    
    if (response.success) {
      quiz.value = response.data;
      // Show success message
      console.log('Quiz updated successfully');
      
      // Redirect to quiz list
      router.visit('/quizzes', {
        onSuccess: () => {
          console.log('Quiz updated and redirected to list');
        }
      });
    } else {
      // Show error message
      console.error('Failed to update quiz:', response.message);
      alert(response.message || 'Failed to update quiz. Please try again.');
    }
  } catch (error) {
    console.error('Error updating quiz:', error);
    alert('An error occurred while updating the quiz. Please try again.');
  } finally {
    submitting.value = false;
  }
};

const handleSaveDraft = async (data: UpdateQuizData) => {
  submitting.value = true;
  
  try {
    const response = await mockApi.updateQuiz(quizId.value, {
      ...data,
      status: 'draft',
    });
    
    if (response.success) {
      quiz.value = response.data;
      // Show success message
      console.log('Quiz saved as draft');
    } else {
      console.error('Failed to save draft:', response.message);
      alert(response.message || 'Failed to save draft. Please try again.');
    }
  } catch (error) {
    console.error('Error saving draft:', error);
    alert('An error occurred while saving the draft. Please try again.');
  } finally {
    submitting.value = false;
  }
};

const handleCancel = () => {
  if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
    router.visit('/quizzes');
  }
};

// Helper functions
const getStatusVariant = (status: string) => {
  switch (status) {
    case 'published':
      return 'default';
    case 'draft':
      return 'secondary';
    case 'archived':
      return 'outline';
    default:
      return 'secondary';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Initialize
onMounted(() => {
  loadQuiz();
  loadAvailableContent();
});
</script>