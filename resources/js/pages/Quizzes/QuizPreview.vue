<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Quiz Preview</h1>
          <p class="text-muted-foreground">
            {{ quiz?.title || 'Loading...' }} - Student Experience Simulation
          </p>
        </div>
        <div class="flex items-center gap-2">
          <Button
            variant="outline"
            @click="$inertia.visit(`/quizzes/${quizId}/builder`)"
            :disabled="!quiz"
          >
            <Edit class="mr-2 h-4 w-4" />
            Edit Questions
          </Button>
          <Button
            variant="outline"
            @click="$inertia.visit(`/quizzes/${quizId}/edit`)"
            :disabled="!quiz"
          >
            <Settings class="mr-2 h-4 w-4" />
            Quiz Settings
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

      <!-- Empty Quiz State -->
      <div v-else-if="quiz && questions.length === 0" class="text-center py-12">
        <div class="mb-4">
          <FileQuestion class="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
          <h3 class="text-lg font-medium">No Questions Available</h3>
          <p class="text-sm text-muted-foreground">
            This quiz doesn't have any questions yet. Add questions to preview the student experience.
          </p>
        </div>
        <Button @click="$inertia.visit(`/quizzes/${quizId}/builder`)">
          <Plus class="mr-2 h-4 w-4" />
          Add Questions
        </Button>
      </div>

      <!-- Quiz Preview Content -->
      <div v-else-if="quiz && questions.length > 0" class="max-w-4xl mx-auto">
        <!-- Quiz Start Screen -->
        <div v-if="!quizStarted && !showResults" class="bg-card border rounded-lg p-8 text-center">
          <div class="mb-6">
            <h2 class="text-3xl font-bold mb-2">{{ quiz.title }}</h2>
            <p v-if="quiz.description" class="text-muted-foreground text-lg">
              {{ quiz.description }}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-blue-50 p-4 rounded-lg">
              <div class="text-2xl font-bold text-blue-600 mb-1">{{ questions.length }}</div>
              <div class="text-sm text-muted-foreground">Questions</div>
            </div>
            <div class="bg-orange-50 p-4 rounded-lg">
              <div class="text-2xl font-bold text-orange-600 mb-1">{{ quiz.timeLimit }}</div>
              <div class="text-sm text-muted-foreground">Minutes</div>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <div class="text-2xl font-bold text-green-600 mb-1">{{ totalPoints }}</div>
              <div class="text-sm text-muted-foreground">Total Points</div>
            </div>
          </div>

          <div class="bg-muted/50 p-4 rounded-lg mb-6">
            <h3 class="font-medium mb-2">Instructions:</h3>
            <ul class="text-sm text-muted-foreground space-y-1 text-left max-w-md mx-auto">
              <li>• Read each question carefully before selecting your answer</li>
              <li>• You can navigate between questions using the Next/Previous buttons</li>
              <li>• Your progress is automatically saved</li>
              <li>• You have {{ quiz.timeLimit }} minutes to complete the quiz</li>
              <li>• Click "Submit Quiz" when you're finished</li>
            </ul>
          </div>

          <Button @click="startQuiz" size="lg" class="px-8">
            <Play class="mr-2 h-5 w-5" />
            Start Quiz Preview
          </Button>
        </div>

        <!-- Quiz Questions -->
        <div v-else-if="quizStarted && !showResults" class="space-y-6">
          <!-- Progress Bar -->
          <div class="bg-card border rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium">
                Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}
              </span>
              <div class="flex items-center gap-2">
                <Clock class="h-4 w-4 text-muted-foreground" />
                <span class="text-sm font-mono">{{ formatTime(timeRemaining) }}</span>
              </div>
            </div>
            <div class="w-full bg-muted rounded-full h-2">
              <div 
                class="bg-primary h-2 rounded-full transition-all duration-300"
                :style="{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }"
              ></div>
            </div>
          </div>

          <!-- Current Question -->
          <div class="bg-card border rounded-lg p-6">
            <div class="mb-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  {{ currentQuestionIndex + 1 }}
                </div>
                <div class="flex items-center gap-2 text-sm text-muted-foreground">
                  <Trophy class="h-4 w-4" />
                  {{ currentQuestion.points }} points
                </div>
              </div>
              
              <h3 class="text-xl font-medium mb-4">{{ currentQuestion.title }}</h3>
              
              <div class="space-y-3">
                <div
                  v-for="(option, index) in currentQuestion.options"
                  :key="index"
                  @click="selectAnswer(index)"
                  :class="[
                    'flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all',
                    selectedAnswers[currentQuestion.id] === index
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  ]"
                >
                  <div 
                    :class="[
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                      selectedAnswers[currentQuestion.id] === index
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground'
                    ]"
                  >
                    <div 
                      v-if="selectedAnswers[currentQuestion.id] === index"
                      class="w-2 h-2 bg-white rounded-full"
                    ></div>
                  </div>
                  <span class="flex-1">{{ option }}</span>
                </div>
              </div>
            </div>

            <!-- Navigation -->
            <div class="flex items-center justify-between pt-4 border-t">
              <Button
                variant="outline"
                @click="previousQuestion"
                :disabled="currentQuestionIndex === 0"
              >
                <ChevronLeft class="mr-2 h-4 w-4" />
                Previous
              </Button>

              <div class="flex items-center gap-2">
                <Button
                  v-if="currentQuestionIndex < questions.length - 1"
                  @click="nextQuestion"
                >
                  Next
                  <ChevronRight class="ml-2 h-4 w-4" />
                </Button>
                
                <Button
                  v-else
                  @click="submitQuiz"
                  :disabled="!allQuestionsAnswered"
                  class="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle class="mr-2 h-4 w-4" />
                  Submit Quiz
                </Button>
              </div>
            </div>
          </div>

          <!-- Question Overview -->
          <div class="bg-card border rounded-lg p-4">
            <h4 class="font-medium mb-3">Question Overview</h4>
            <div class="grid grid-cols-5 sm:grid-cols-10 gap-2">
              <button
                v-for="(question, index) in questions"
                :key="question.id"
                @click="goToQuestion(index)"
                :class="[
                  'w-8 h-8 rounded text-xs font-medium transition-all',
                  index === currentQuestionIndex
                    ? 'bg-primary text-primary-foreground'
                    : selectedAnswers[question.id] !== undefined
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                ]"
              >
                {{ index + 1 }}
              </button>
            </div>
            <div class="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <div class="flex items-center gap-1">
                <div class="w-3 h-3 bg-primary rounded"></div>
                <span>Current</span>
              </div>
              <div class="flex items-center gap-1">
                <div class="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
                <span>Answered</span>
              </div>
              <div class="flex items-center gap-1">
                <div class="w-3 h-3 bg-muted rounded"></div>
                <span>Not Answered</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Results Screen -->
        <div v-else-if="showResults" class="bg-card border rounded-lg p-8 text-center">
          <div class="mb-6">
            <CheckCircle class="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 class="text-3xl font-bold mb-2">Quiz Completed!</h2>
            <p class="text-muted-foreground">
              Here's how a student would see their results
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-green-50 p-6 rounded-lg">
              <div class="text-3xl font-bold text-green-600 mb-1">{{ score }}</div>
              <div class="text-sm text-muted-foreground">Score</div>
            </div>
            <div class="bg-blue-50 p-6 rounded-lg">
              <div class="text-3xl font-bold text-blue-600 mb-1">{{ percentage }}%</div>
              <div class="text-sm text-muted-foreground">Percentage</div>
            </div>
            <div class="bg-orange-50 p-6 rounded-lg">
              <div class="text-3xl font-bold text-orange-600 mb-1">{{ formatTime(timeSpent) }}</div>
              <div class="text-sm text-muted-foreground">Time Spent</div>
            </div>
          </div>

          <div class="flex items-center justify-center gap-4">
            <Button @click="resetQuiz" variant="outline">
              <RotateCcw class="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button @click="$inertia.visit(`/quizzes/${quizId}/builder`)">
              <Edit class="mr-2 h-4 w-4" />
              Edit Quiz
            </Button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { usePage } from '@inertiajs/vue3';
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit,
  FileQuestion,
  Loader2,
  Play,
  Plus,
  RotateCcw,
  Settings,
  Trophy,
} from 'lucide-vue-next';

import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';

import { mockApi } from '@/services/mockApi';
import type { Quiz, Question, BreadcrumbItem } from '@/types';

// Page props
interface Props {
  quizId: number;
}

const props = defineProps<Props>();

// Page data
const quiz = ref<Quiz | null>(null);
const questions = ref<Question[]>([]);
const loading = ref(false);
const error = ref(false);

// Quiz state
const quizStarted = ref(false);
const showResults = ref(false);
const currentQuestionIndex = ref(0);
const selectedAnswers = ref<Record<number, number>>({});
const timeRemaining = ref(0);
const timeSpent = ref(0);
const timerInterval = ref<number | null>(null);

// Get quiz ID from route or props
const quizId = computed(() => {
  return props.quizId || parseInt(usePage().url.split('/')[2]);
});

// Computed properties
const currentQuestion = computed(() => {
  return questions.value[currentQuestionIndex.value];
});

const totalPoints = computed(() => {
  return questions.value.reduce((sum, question) => sum + question.points, 0);
});

const allQuestionsAnswered = computed(() => {
  return questions.value.every(question => selectedAnswers.value[question.id] !== undefined);
});

const score = computed(() => {
  let totalScore = 0;
  questions.value.forEach(question => {
    const selectedAnswer = selectedAnswers.value[question.id];
    if (selectedAnswer === question.correctAnswer) {
      totalScore += question.points;
    }
  });
  return totalScore;
});

const percentage = computed(() => {
  return totalPoints.value > 0 ? Math.round((score.value / totalPoints.value) * 100) : 0;
});

// Breadcrumbs
const breadcrumbs = computed((): BreadcrumbItem[] => [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Quizzes', href: '/quizzes' },
  { title: quiz.value?.title || 'Quiz Preview', href: `/quizzes/${quizId.value}/preview` },
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
      questions.value = response.data.sort((a, b) => a.order - b.order);
    }
  } catch (error) {
    console.error('Failed to load questions:', error);
  }
};

// Quiz control functions
const startQuiz = () => {
  quizStarted.value = true;
  timeRemaining.value = (quiz.value?.timeLimit || 30) * 60; // Convert minutes to seconds
  startTimer();
};

const startTimer = () => {
  timerInterval.value = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--;
      timeSpent.value++;
    } else {
      submitQuiz();
    }
  }, 1000);
};

const stopTimer = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
    timerInterval.value = null;
  }
};

const selectAnswer = (answerIndex: number) => {
  selectedAnswers.value[currentQuestion.value.id] = answerIndex;
};

const nextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++;
  }
};

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  }
};

const goToQuestion = (index: number) => {
  currentQuestionIndex.value = index;
};

const submitQuiz = () => {
  stopTimer();
  showResults.value = true;
};

const resetQuiz = () => {
  quizStarted.value = false;
  showResults.value = false;
  currentQuestionIndex.value = 0;
  selectedAnswers.value = {};
  timeRemaining.value = 0;
  timeSpent.value = 0;
  stopTimer();
};

// Helper functions
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Cleanup
onUnmounted(() => {
  stopTimer();
});

// Initialize
onMounted(() => {
  loadQuiz();
});
</script>

<style scoped>
/* Custom animations for quiz transitions */
.question-enter-active,
.question-leave-active {
  transition: all 0.3s ease;
}

.question-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.question-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>