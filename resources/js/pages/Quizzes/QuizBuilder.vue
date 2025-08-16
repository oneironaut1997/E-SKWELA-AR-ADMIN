<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Quiz Builder</h1>
          <p class="text-muted-foreground">
            {{ quiz?.title || 'Loading...' }} - Drag and drop to reorder questions
          </p>
        </div>
        <div class="flex items-center gap-2">
          <Button
            variant="outline"
            @click="$inertia.visit(`/quizzes/${quizId}/preview`)"
            :disabled="!quiz || questions.length === 0"
          >
            <Play class="mr-2 h-4 w-4" />
            Preview Quiz
          </Button>
          <Button
            variant="outline"
            @click="$inertia.visit(`/quizzes/${quizId}/edit`)"
            :disabled="!quiz"
          >
            <Settings class="mr-2 h-4 w-4" />
            Quiz Settings
          </Button>
          <Button @click="showAddQuestion = true">
            <Plus class="mr-2 h-4 w-4" />
            Add Question
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

      <!-- Quiz Builder Content -->
      <div v-else-if="quiz" class="space-y-6">
        <!-- Quiz Summary -->
        <div class="bg-card border rounded-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium">Quiz Overview</h3>
            <Badge :variant="getStatusVariant(quiz.status)" class="capitalize">
              {{ quiz.status }}
            </Badge>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <div class="text-2xl font-bold text-blue-600">{{ questions.length }}</div>
              <div class="text-sm text-muted-foreground">Questions</div>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <div class="text-2xl font-bold text-green-600">{{ totalPoints }}</div>
              <div class="text-sm text-muted-foreground">Total Points</div>
            </div>
            <div class="text-center p-4 bg-orange-50 rounded-lg">
              <div class="text-2xl font-bold text-orange-600">{{ quiz.timeLimit }}</div>
              <div class="text-sm text-muted-foreground">Minutes</div>
            </div>
            <div class="text-center p-4 bg-purple-50 rounded-lg">
              <div class="text-2xl font-bold text-purple-600">{{ quiz.maxAttempts }}</div>
              <div class="text-sm text-muted-foreground">Max Attempts</div>
            </div>
          </div>
        </div>

        <!-- Questions List -->
        <div class="bg-card border rounded-lg">
          <div class="p-6 border-b">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium">Questions</h3>
              <div class="text-sm text-muted-foreground">
                Drag questions to reorder them
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="questions.length === 0" class="p-12 text-center">
            <FileQuestion class="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 class="text-lg font-medium mb-2">No Questions Yet</h3>
            <p class="text-muted-foreground mb-4">
              Start building your quiz by adding your first question.
            </p>
            <Button @click="showAddQuestion = true">
              <Plus class="mr-2 h-4 w-4" />
              Add First Question
            </Button>
          </div>

          <!-- Questions List with Drag and Drop -->
          <div v-else class="p-6">
            <div
              class="space-y-4"
              @dragover.prevent
              @drop="handleDrop"
            >
              <div
                v-for="(question, index) in questions"
                :key="question.id"
                :draggable="true"
                @dragstart="handleDragStart($event, index)"
                @dragend="handleDragEnd"
                :class="[
                  'bg-background border rounded-lg p-4 cursor-move transition-all duration-200',
                  draggedIndex === index ? 'opacity-50 scale-95' : 'hover:shadow-md'
                ]"
              >
                <div class="flex items-start gap-4">
                  <!-- Drag Handle -->
                  <div class="flex-shrink-0 mt-1">
                    <GripVertical class="h-5 w-5 text-muted-foreground" />
                  </div>

                  <!-- Question Number -->
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {{ index + 1 }}
                    </div>
                  </div>

                  <!-- Question Content -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-4">
                      <div class="flex-1">
                        <h4 class="font-medium mb-2">{{ question.title }}</h4>
                        <div class="space-y-1">
                          <div
                            v-for="(option, optionIndex) in question.options"
                            :key="optionIndex"
                            :class="[
                              'flex items-center gap-2 text-sm p-2 rounded',
                              optionIndex === question.correctAnswer
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-muted/50'
                            ]"
                          >
                            <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                                 :class="optionIndex === question.correctAnswer ? 'border-green-500 bg-green-500' : 'border-muted-foreground'">
                              <div v-if="optionIndex === question.correctAnswer" class="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <span>{{ option }}</span>
                            <CheckCircle v-if="optionIndex === question.correctAnswer" class="h-4 w-4 text-green-600 ml-auto" />
                          </div>
                        </div>
                        <div class="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                          <span class="flex items-center gap-1">
                            <Trophy class="h-4 w-4" />
                            {{ question.points }} points
                          </span>
                          <span v-if="question.explanation" class="flex items-center gap-1">
                            <Info class="h-4 w-4" />
                            Has explanation
                          </span>
                        </div>
                      </div>

                      <!-- Question Actions -->
                      <div class="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          @click="editQuestion(question)"
                        >
                          <Edit class="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          @click="duplicateQuestion(question)"
                        >
                          <Copy class="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          @click="deleteQuestion(question.id)"
                          class="text-destructive hover:text-destructive"
                        >
                          <Trash2 class="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add/Edit Question Modal -->
      <div v-if="showAddQuestion || editingQuestion" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-background border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium">
                {{ editingQuestion ? 'Edit Question' : 'Add New Question' }}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                @click="closeQuestionModal"
              >
                <X class="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div class="p-6">
            <QuestionEditor
              :mode="editingQuestion ? 'edit' : 'create'"
              :question="editingQuestion || undefined"
              :loading="submitting"
              @submit="handleQuestionSubmit"
              @cancel="closeQuestionModal"
            />
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { usePage } from '@inertiajs/vue3';
import {
  AlertCircle,
  CheckCircle,
  Copy,
  Edit,
  FileQuestion,
  GripVertical,
  Info,
  Loader2,
  Play,
  Plus,
  Settings,
  Trash2,
  Trophy,
  X,
} from 'lucide-vue-next';

import AppLayout from '@/layouts/AppLayout.vue';
import QuestionEditor from '@/components/quizzes/QuestionEditor.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { mockApi } from '@/services/mockApi';
import type { Quiz, Question, CreateQuestionData, UpdateQuestionData, BreadcrumbItem } from '@/types';

// Page props
interface Props {
  quizId: number;
}

const props = defineProps<Props>();

// Page data
const quiz = ref<Quiz | null>(null);
const questions = ref<Question[]>([]);
const loading = ref(false);
const submitting = ref(false);
const error = ref(false);

// Modal states
const showAddQuestion = ref(false);
const editingQuestion = ref<Question | null>(null);

// Drag and drop state
const draggedIndex = ref<number | null>(null);

// Get quiz ID from route or props
const quizId = computed(() => {
  return props.quizId || parseInt(usePage().url.split('/')[2]);
});

// Computed properties
const totalPoints = computed(() => {
  return questions.value.reduce((sum, question) => sum + question.points, 0);
});

// Breadcrumbs
const breadcrumbs = computed((): BreadcrumbItem[] => [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Quizzes', href: '/quizzes' },
  { title: quiz.value?.title || 'Quiz Builder', href: `/quizzes/${quizId.value}/builder` },
]);

// Load quiz data
const loadQuiz = async () => {
  loading.value = true;
  error.value = false;
  
  try {
    const response = await mockApi.getQuizById(quizId.value);
    
    if (response.success) {
      quiz.value = response.data;
      await loadQuestions();
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

// Load questions
const loadQuestions = async () => {
  try {
    const response = await mockApi.getQuizQuestions(quizId.value);
    
    if (response.success) {
      questions.value = response.data;
    }
  } catch (error) {
    console.error('Failed to load questions:', error);
  }
};

// Drag and drop handlers
const handleDragStart = (event: DragEvent, index: number) => {
  draggedIndex.value = index;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', index.toString());
  }
};

const handleDragEnd = () => {
  draggedIndex.value = null;
};

const handleDrop = async (event: DragEvent) => {
  event.preventDefault();
  
  if (draggedIndex.value === null) return;
  
  const dropTarget = event.target as HTMLElement;
  const questionElement = dropTarget.closest('[draggable="true"]');
  
  if (!questionElement) return;
  
  const dropIndex = Array.from(questionElement.parentElement!.children).indexOf(questionElement);
  
  if (draggedIndex.value === dropIndex) return;
  
  // Reorder questions locally
  const newQuestions = [...questions.value];
  const [draggedQuestion] = newQuestions.splice(draggedIndex.value, 1);
  newQuestions.splice(dropIndex, 0, draggedQuestion);
  
  questions.value = newQuestions;
  
  // Update order on server
  try {
    const questionIds = newQuestions.map(q => q.id);
    await mockApi.reorderQuestions(quizId.value, questionIds);
  } catch (error) {
    console.error('Failed to reorder questions:', error);
    // Revert on error
    await loadQuestions();
  }
  
  draggedIndex.value = null;
};

// Question management
const editQuestion = (question: Question) => {
  editingQuestion.value = question;
  showAddQuestion.value = false;
};

const duplicateQuestion = async (question: Question) => {
  try {
    const questionData: CreateQuestionData = {
      title: `${question.title} (Copy)`,
      options: [...question.options],
      correctAnswer: question.correctAnswer,
      points: question.points,
      explanation: question.explanation,
    };
    
    const response = await mockApi.createQuestion(quizId.value, questionData);
    
    if (response.success) {
      await loadQuestions();
    } else {
      alert('Failed to duplicate question');
    }
  } catch (error) {
    console.error('Error duplicating question:', error);
    alert('An error occurred while duplicating the question');
  }
};

const deleteQuestion = async (questionId: number) => {
  if (!confirm('Are you sure you want to delete this question?')) return;
  
  try {
    const response = await mockApi.deleteQuestion(questionId);
    
    if (response.success) {
      await loadQuestions();
    } else {
      alert('Failed to delete question');
    }
  } catch (error) {
    console.error('Error deleting question:', error);
    alert('An error occurred while deleting the question');
  }
};

// Modal handlers
const closeQuestionModal = () => {
  showAddQuestion.value = false;
  editingQuestion.value = null;
};

const handleQuestionSubmit = async (data: CreateQuestionData | UpdateQuestionData) => {
  submitting.value = true;
  
  try {
    let response;
    
    if (editingQuestion.value) {
      response = await mockApi.updateQuestion(
        editingQuestion.value.id,
        data as UpdateQuestionData
      );
    } else {
      response = await mockApi.createQuestion(quizId.value, data as CreateQuestionData);
    }
    
    if (response.success) {
      await loadQuestions();
      closeQuestionModal();
    } else {
      alert(response.message || 'Failed to save question');
    }
  } catch (error) {
    console.error('Error saving question:', error);
    alert('An error occurred while saving the question');
  } finally {
    submitting.value = false;
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

// Initialize
onMounted(() => {
  loadQuiz();
});
</script>

<style scoped>
/* Custom drag and drop styles */
[draggable="true"] {
  user-select: none;
}

[draggable="true"]:hover {
  cursor: move;
}

.drag-over {
  border-color: hsl(var(--primary));
  background-color: hsl(var(--primary) / 0.05);
}
</style>