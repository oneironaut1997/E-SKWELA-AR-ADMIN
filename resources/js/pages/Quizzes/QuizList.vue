<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="space-y-6 flex h-full flex-1 flex-col gap-6 rounded-xl p-4 overflow-x-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Quiz Management</h1>
          <p class="text-muted-foreground">
            Create and manage quizzes for your AR content
          </p>
        </div>
        <Button @click="$inertia.visit('/quizzes/create')">
          <Plus class="mr-2 h-4 w-4" />
          Create Quiz
        </Button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="p-4 border rounded-lg">
          <div class="flex items-center gap-2">
            <FileQuestion class="h-4 w-4 text-blue-600" />
            <span class="text-sm font-medium">Total Quizzes</span>
          </div>
          <p class="text-2xl font-bold mt-1">{{ stats.total }}</p>
        </div>
        
        <div class="p-4 border rounded-lg">
          <div class="flex items-center gap-2">
            <CheckCircle class="h-4 w-4 text-green-600" />
            <span class="text-sm font-medium">Published</span>
          </div>
          <p class="text-2xl font-bold mt-1 text-green-600">{{ stats.published }}</p>
        </div>
        
        <div class="p-4 border rounded-lg">
          <div class="flex items-center gap-2">
            <Edit class="h-4 w-4 text-orange-600" />
            <span class="text-sm font-medium">Drafts</span>
          </div>
          <p class="text-2xl font-bold mt-1 text-orange-600">{{ stats.drafts }}</p>
        </div>
        
        <div class="p-4 border rounded-lg">
          <div class="flex items-center gap-2">
            <Users class="h-4 w-4 text-purple-600" />
            <span class="text-sm font-medium">Total Attempts</span>
          </div>
          <p class="text-2xl font-bold mt-1 text-purple-600">{{ stats.attempts }}</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex flex-col lg:flex-row gap-4">
        <div class="flex-1">
          <Input
            v-model="filters.search"
            placeholder="Search quizzes..."
            class="max-w-sm"
            @input="debouncedSearch"
          />
        </div>
        
        <div class="flex flex-wrap gap-2">
          <Select v-model="filters.subject" @update:model-value="applyFilters">
            <SelectTrigger class="w-40">
              <SelectValue placeholder="All subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All subjects</SelectItem>
              <SelectItem value="History">History</SelectItem>
              <SelectItem value="Science">Science</SelectItem>
            </SelectContent>
          </Select>
          
          <Select v-model="filters.gradeLevel" @update:model-value="applyFilters">
            <SelectTrigger class="w-40">
              <SelectValue placeholder="All grades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All grades</SelectItem>
              <SelectItem v-for="grade in GRADE_LEVELS" :key="grade" :value="grade">
                {{ grade }}
              </SelectItem>
            </SelectContent>
          </Select>
          
          <Select v-model="filters.status" @update:model-value="applyFilters">
            <SelectTrigger class="w-40">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All statuses</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          
          <Select v-model="filters.associatedContent" @update:model-value="applyFilters">
            <SelectTrigger class="w-48">
              <SelectValue placeholder="All content" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All content</SelectItem>
              <SelectItem value="linked">With AR Content</SelectItem>
              <SelectItem value="unlinked">Without AR Content</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            @click="clearFilters"
            :disabled="!hasActiveFilters"
          >
            <X class="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      <!-- Quiz Table -->
      <QuizTable
        :quizzes="quizzes"
        :loading="loading"
        :pagination="pagination"
        @sort="handleSort"
        @page-change="handlePageChange"
        @view="handleView"
        @edit="handleEdit"
        @builder="handleBuilder"
        @preview="handlePreview"
        @attempts="handleAttempts"
        @duplicate="handleDuplicate"
        @delete="handleDelete"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { router } from '@inertiajs/vue3';
import {
  CheckCircle,
  Edit,
  FileQuestion,
  Plus,
  Users,
  X,
} from 'lucide-vue-next';

import AppLayout from '@/layouts/AppLayout.vue';
import QuizTable from '@/components/quizzes/QuizTable.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { mockApi } from '@/services/mockApi';
import type { Quiz, QuizFilters, BreadcrumbItem } from '@/types/index.d';
import { GRADE_LEVELS } from '@/types/index.d';

// Page data
const quizzes = ref<Quiz[]>([]);
const loading = ref(false);
const pagination = ref({
  current_page: 1,
  total: 0,
  per_page: 10,
});

// Filters
const filters = reactive({
  search: '',
  subject: undefined as 'History' | 'Science' | undefined,
  gradeLevel: '',
  status: undefined as 'draft' | 'published' | 'archived' | undefined,
  associatedContent: '',
  sortBy: 'createdAt' as 'title' | 'subject' | 'gradeLevel' | 'createdAt' | 'questionsCount',
  sortOrder: 'desc' as 'asc' | 'desc',
  page: 1,
  per_page: 10,
});

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Quizzes', href: '/quizzes' },
];

// Computed properties
const stats = computed(() => {
  const published = quizzes.value.filter(q => q.status === 'published').length;
  const drafts = quizzes.value.filter(q => q.status === 'draft').length;
  const attempts = quizzes.value.reduce((sum, q) => sum + (q.questionsCount * 5), 0); // Mock attempts

  return {
    total: quizzes.value.length,
    published,
    drafts,
    attempts,
  };
});

const hasActiveFilters = computed(() => {
  return filters.search !== '' ||
         filters.subject !== undefined ||
         filters.gradeLevel !== '' ||
         filters.status !== undefined ||
         filters.associatedContent !== '';
});

// Debounced search
let searchTimeout: number;
const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    applyFilters();
  }, 300);
};

// Load quizzes
const loadQuizzes = async () => {
  loading.value = true;
  try {
    // Convert associatedContent filter to proper format
    const apiFilters: any = { ...filters };
    delete apiFilters.associatedContent; // Remove this custom filter from API call

    const response = await mockApi.getQuizzes(apiFilters);
    
    if (response.success) {
      let filteredQuizzes = response.data;
      
      // Apply frontend filters for associated content
      if (filters.associatedContent === 'linked') {
        filteredQuizzes = filteredQuizzes.filter(q => q.associatedContentId);
      } else if (filters.associatedContent === 'unlinked') {
        filteredQuizzes = filteredQuizzes.filter(q => !q.associatedContentId);
      }
      
      quizzes.value = filteredQuizzes;
      pagination.value = response.pagination || {
        current_page: 1,
        total: filteredQuizzes.length,
        per_page: 10,
      };
    }
  } catch (error) {
    console.error('Failed to load quizzes:', error);
  } finally {
    loading.value = false;
  }
};

// Event handlers
const applyFilters = () => {
  filters.page = 1;
  loadQuizzes();
};

const clearFilters = () => {
  filters.search = '';
  filters.subject = undefined;
  filters.gradeLevel = '';
  filters.status = undefined;
  filters.associatedContent = '';
  applyFilters();
};

const handleSort = (field: string) => {
  if (filters.sortBy === field) {
    filters.sortOrder = filters.sortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    filters.sortBy = field as any;
    filters.sortOrder = 'asc';
  }
  loadQuizzes();
};

const handlePageChange = (page: number) => {
  filters.page = page;
  loadQuizzes();
};

const handleView = (id: number) => {
  router.visit(`/quizzes/${id}`);
};

const handleEdit = (id: number) => {
  router.visit(`/quizzes/${id}/edit`);
};

const handleBuilder = (id: number) => {
  router.visit(`/quizzes/${id}/builder`);
};

const handlePreview = (id: number) => {
  router.visit(`/quizzes/${id}/preview`);
};

const handleAttempts = (id: number) => {
  router.visit(`/quizzes/${id}/attempts`);
};

const handleDuplicate = async (id: number) => {
  try {
    const response = await mockApi.getQuizById(id);
    if (response.success) {
      const quiz = response.data;
      const duplicateData = {
        title: `${quiz.title} (Copy)`,
        description: quiz.description,
        subject: quiz.subject,
        gradeLevel: quiz.gradeLevel,
        timeLimit: quiz.timeLimit,
        maxAttempts: quiz.maxAttempts,
        scoringMethod: quiz.scoringMethod,
        associatedContentId: quiz.associatedContentId,
      };
      
      const createResponse = await mockApi.createQuiz(duplicateData);
      if (createResponse.success) {
        loadQuizzes();
        // Show success message
        console.log('Quiz duplicated successfully');
      }
    }
  } catch (error) {
    console.error('Failed to duplicate quiz:', error);
  }
};

const handleDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
    try {
      const response = await mockApi.deleteQuiz(id);
      if (response.success) {
        loadQuizzes();
        // Show success message
        console.log('Quiz deleted successfully');
      }
    } catch (error) {
      console.error('Failed to delete quiz:', error);
    }
  }
};

// Initialize
onMounted(() => {
  loadQuizzes();
});
</script>