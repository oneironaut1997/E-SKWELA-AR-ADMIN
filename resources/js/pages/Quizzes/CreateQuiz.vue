<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="space-y-6 flex h-full flex-1 flex-col gap-6 rounded-xl p-4 overflow-x-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Create New Quiz</h1>
          <p class="text-muted-foreground">
            Set up a new quiz for your students
          </p>
        </div>
      </div>

      <!-- Create Quiz Form -->
      <div class="max-w-4xl">
        <div class="bg-card border rounded-lg p-6">
          <QuizForm
            mode="create"
            :available-content="availableContent"
            :loading="loading"
            @submit="handleSubmit"
            @cancel="handleCancel"
          />
        </div>
      </div>

      <!-- Help Section -->
      <div class="max-w-4xl">
        <div class="bg-muted/50 border rounded-lg p-6">
          <h3 class="text-lg font-medium mb-4 flex items-center gap-2">
            <HelpCircle class="h-5 w-5" />
            Quiz Creation Tips
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-3">
              <h4 class="font-medium flex items-center gap-2">
                <FileQuestion class="h-4 w-4 text-blue-600" />
                Quiz Settings
              </h4>
              <ul class="text-sm text-muted-foreground space-y-1">
                <li>• Choose appropriate time limits based on question count</li>
                <li>• Allow multiple attempts for practice quizzes</li>
                <li>• Use points-based scoring for detailed feedback</li>
                <li>• Link to AR content to provide context</li>
              </ul>
            </div>
            
            <div class="space-y-3">
              <h4 class="font-medium flex items-center gap-2">
                <Lightbulb class="h-4 w-4 text-yellow-600" />
                Best Practices
              </h4>
              <ul class="text-sm text-muted-foreground space-y-1">
                <li>• Write clear, concise questions</li>
                <li>• Ensure all answer options are plausible</li>
                <li>• Test your quiz before publishing</li>
                <li>• Review student performance regularly</li>
              </ul>
            </div>
          </div>
          
          <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="flex items-start gap-3">
              <Info class="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 class="font-medium text-blue-900">Next Steps</h4>
                <p class="text-sm text-blue-700 mt-1">
                  After creating your quiz, you'll be able to add questions using the Quiz Builder. 
                  You can also preview how students will see the quiz before publishing it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { router } from '@inertiajs/vue3';
import {
  FileQuestion,
  HelpCircle,
  Info,
  Lightbulb,
} from 'lucide-vue-next';

import AppLayout from '@/layouts/AppLayout.vue';
import QuizForm from '@/components/quizzes/QuizForm.vue';

import { mockApi } from '@/services/mockApi';
import type { ARContent, CreateQuizData, UpdateQuizData, BreadcrumbItem } from '@/types';

// Page data
const availableContent = ref<ARContent[]>([]);
const loading = ref(false);

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Quizzes', href: '/quizzes' },
  { title: 'Create Quiz', href: '/quizzes/create' },
];

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
const handleSubmit = async (data: CreateQuizData | UpdateQuizData) => {
  // Type guard to ensure we have CreateQuizData
  if (!data.title || !data.subject || !data.gradeLevel) {
    alert('Please fill in all required fields.');
    return;
  }
  
  const createData = data as CreateQuizData;
  loading.value = true;
  
  try {
    const response = await mockApi.createQuiz(data as CreateQuizData);
    
    if (response.success) {
      // Show success message
      console.log('Quiz created successfully:', response.data);
      
      // Redirect to quiz builder to add questions
      router.visit(`/quizzes/${response.data.id}/builder`, {
        onSuccess: () => {
          // Show success notification
          console.log('Redirecting to quiz builder...');
        }
      });
    } else {
      // Show error message
      console.error('Failed to create quiz:', response.message);
      alert(response.message || 'Failed to create quiz. Please try again.');
    }
  } catch (error) {
    console.error('Error creating quiz:', error);
    alert('An error occurred while creating the quiz. Please try again.');
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  // Confirm navigation away if user has made changes
  if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
    router.visit('/quizzes');
  }
};

// Initialize
onMounted(() => {
  loadAvailableContent();
});
</script>