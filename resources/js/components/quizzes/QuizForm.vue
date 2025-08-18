<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Basic Information -->
    <div class="space-y-4">
      <div class="space-y-2">
        <Label for="title">Quiz Title *</Label>
        <Input
          id="title"
          v-model="form.title"
          placeholder="Enter quiz title"
          :class="{ 'border-destructive': errors.title }"
          required
        />
        <p v-if="errors.title" class="text-sm text-destructive">
          {{ errors.title }}
        </p>
      </div>

      <div class="space-y-2">
        <Label for="description">Description</Label>
        <textarea
          id="description"
          v-model="form.description"
          placeholder="Enter quiz description (optional)"
          class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          :class="{ 'border-destructive': errors.description }"
        />
        <p v-if="errors.description" class="text-sm text-destructive">
          {{ errors.description }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <Label for="subject">Subject *</Label>
          <Select v-model="form.subject" required>
            <SelectTrigger :class="errors.subject ? 'border-destructive' : ''">
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="History">History</SelectItem>
              <SelectItem value="Science">Science</SelectItem>
            </SelectContent>
          </Select>
          <p v-if="errors.subject" class="text-sm text-destructive">
            {{ errors.subject }}
          </p>
        </div>

        <div class="space-y-2">
          <Label for="gradeLevel">Grade Level *</Label>
          <Select v-model="form.gradeLevel" required>
            <SelectTrigger :class="errors.gradeLevel ? 'border-destructive' : ''">
              <SelectValue placeholder="Select grade level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="grade in GRADE_LEVELS" :key="grade" :value="grade">
                {{ grade }}
              </SelectItem>
            </SelectContent>
          </Select>
          <p v-if="errors.gradeLevel" class="text-sm text-destructive">
            {{ errors.gradeLevel }}
          </p>
        </div>
      </div>
    </div>

    <!-- Quiz Settings -->
    <div class="space-y-4">
      <h3 class="text-lg font-medium">Quiz Settings</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="space-y-2">
          <Label for="timeLimit">Time Limit (minutes) *</Label>
          <Select :model-value="String(form.timeLimit)" @update:model-value="form.timeLimit = Number($event)" required>
            <SelectTrigger :class="errors.timeLimit ? 'border-destructive' : ''">
              <SelectValue placeholder="Select time limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="option in TIME_LIMIT_OPTIONS" :key="option.value" :value="String(option.value)">
                {{ option.label }}
              </SelectItem>
            </SelectContent>
          </Select>
          <p v-if="errors.timeLimit" class="text-sm text-destructive">
            {{ errors.timeLimit }}
          </p>
        </div>

        <div class="space-y-2">
          <Label for="maxAttempts">Max Attempts *</Label>
          <Select v-model="form.maxAttempts" required>
            <SelectTrigger :class="{ 'border-destructive': errors.maxAttempts }">
              <SelectValue placeholder="Select max attempts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="option in MAX_ATTEMPTS_OPTIONS" :key="option.value" :value="option.value">
                {{ option.label }}
              </SelectItem>
            </SelectContent>
          </Select>
          <p v-if="errors.maxAttempts" class="text-sm text-destructive">
            {{ errors.maxAttempts }}
          </p>
        </div>

        <div class="space-y-2">
          <Label for="scoringMethod">Scoring Method *</Label>
          <Select v-model="form.scoringMethod" required>
            <SelectTrigger :class="errors.scoringMethod ? 'border-destructive' : ''">
              <SelectValue placeholder="Select scoring method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="points">Points-based</SelectItem>
              <SelectItem value="percentage">Percentage-based</SelectItem>
            </SelectContent>
          </Select>
          <p v-if="errors.scoringMethod" class="text-sm text-destructive">
            {{ errors.scoringMethod }}
          </p>
        </div>
      </div>
    </div>

    <!-- Associated Content -->
    <div class="space-y-4">
      <h3 class="text-lg font-medium">Associated Content (Optional)</h3>
      
      <div class="space-y-2">
        <Label for="associatedContent">Link to AR Content</Label>
        <Select
          :model-value="form.associatedContentId ? String(form.associatedContentId) : ''"
          @update:model-value="form.associatedContentId = $event ? Number($event) : undefined"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select AR content (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">No associated content</SelectItem>
            <SelectItem
              v-for="content in availableContent"
              :key="content.id"
              :value="String(content.id)"
            >
              <div class="flex items-center gap-2">
                <component
                  :is="content.type === '3d_model' ? Box : Volume2"
                  class="h-4 w-4"
                />
                <span>{{ content.title }} ({{ content.subject }} - {{ content.gradeLevel }})</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        <p class="text-sm text-muted-foreground">
          Linking a quiz to AR content helps students understand the context and enhances learning.
        </p>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="flex items-center justify-between pt-6 border-t">
      <Button
        type="button"
        variant="outline"
        @click="$emit('cancel')"
        :disabled="loading"
      >
        Cancel
      </Button>
      
      <div class="flex items-center gap-2">
        <Button
          v-if="mode === 'edit'"
          type="button"
          variant="outline"
          @click="handleSaveAsDraft"
          :disabled="loading"
        >
          <Save class="mr-2 h-4 w-4" />
          Save as Draft
        </Button>
        
        <Button
          type="submit"
          :disabled="loading || !isFormValid"
        >
          <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
          <template v-else>
            {{ mode === 'create' ? 'Create Quiz' : 'Update Quiz' }}
          </template>
        </Button>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { Box, Loader2, Save, Volume2 } from 'lucide-vue-next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { Quiz, ARContent, CreateQuizData, UpdateQuizData } from '@/types';
import { GRADE_LEVELS } from '@/types/index.d';

interface Props {
  mode: 'create' | 'edit';
  quiz?: Quiz;
  availableContent?: ARContent[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  availableContent: () => [],
  loading: false,
});

const emit = defineEmits<{
  submit: [data: CreateQuizData | UpdateQuizData];
  'save-draft': [data: UpdateQuizData];
  cancel: [];
}>();

// Time limit options
const TIME_LIMIT_OPTIONS = [
  { value: 10, label: '10 minutes' },
  { value: 15, label: '15 minutes' },
  { value: 20, label: '20 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '60 minutes' },
];

// Max attempts options
const MAX_ATTEMPTS_OPTIONS = [
  { value: 1, label: '1 attempt' },
  { value: 2, label: '2 attempts' },
  { value: 3, label: '3 attempts' },
  { value: 5, label: '5 attempts' },
];

// Form data
const form = reactive({
  title: '',
  description: '',
  subject: '' as 'History' | 'Science' | '',
  gradeLevel: '',
  timeLimit: 30,
  maxAttempts: 3,
  scoringMethod: 'points' as 'points' | 'percentage',
  associatedContentId: undefined as number | undefined,
});

// Form errors
const errors = reactive({
  title: '',
  description: '',
  subject: '',
  gradeLevel: '',
  timeLimit: '',
  maxAttempts: '',
  scoringMethod: '',
});

// Initialize form with quiz data if editing
watch(() => props.quiz, (quiz) => {
  if (quiz && props.mode === 'edit') {
    form.title = quiz.title;
    form.description = quiz.description || '';
    form.subject = quiz.subject;
    form.gradeLevel = quiz.gradeLevel;
    form.timeLimit = quiz.timeLimit;
    form.maxAttempts = quiz.maxAttempts;
    form.scoringMethod = quiz.scoringMethod;
    form.associatedContentId = quiz.associatedContentId;
  }
}, { immediate: true });

// Form validation
const isFormValid = computed(() => {
  return form.title.trim() !== '' &&
         form.subject !== '' &&
         form.gradeLevel !== '' &&
         form.timeLimit > 0 &&
         form.maxAttempts > 0 &&
         form.scoringMethod === 'points' || form.scoringMethod === 'percentage';
});

// Validate form
const validateForm = () => {
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = '';
  });

  let isValid = true;

  // Title validation
  if (!form.title.trim()) {
    errors.title = 'Quiz title is required';
    isValid = false;
  } else if (form.title.length < 3) {
    errors.title = 'Quiz title must be at least 3 characters';
    isValid = false;
  } else if (form.title.length > 100) {
    errors.title = 'Quiz title must be less than 100 characters';
    isValid = false;
  }

  // Description validation
  if (form.description && form.description.length > 500) {
    errors.description = 'Description must be less than 500 characters';
    isValid = false;
  }

  // Subject validation
  if (!form.subject) {
    errors.subject = 'Subject is required';
    isValid = false;
  }

  // Grade level validation
  if (!form.gradeLevel) {
    errors.gradeLevel = 'Grade level is required';
    isValid = false;
  }

  // Time limit validation
  if (!form.timeLimit || form.timeLimit < 5 || form.timeLimit > 120) {
    errors.timeLimit = 'Time limit must be between 5 and 120 minutes';
    isValid = false;
  }

  // Max attempts validation
  if (!form.maxAttempts || form.maxAttempts < 1 || form.maxAttempts > 10) {
    errors.maxAttempts = 'Max attempts must be between 1 and 10';
    isValid = false;
  }

  // Scoring method validation
  if (!form.scoringMethod) {
    errors.scoringMethod = 'Scoring method is required';
    isValid = false;
  }

  return isValid;
};

// Handle form submission
const handleSubmit = () => {
  if (!validateForm()) {
    return;
  }

  const formData = {
    title: form.title.trim(),
    description: form.description.trim() || undefined,
    subject: form.subject as 'History' | 'Science',
    gradeLevel: form.gradeLevel,
    timeLimit: form.timeLimit,
    maxAttempts: form.maxAttempts,
    scoringMethod: form.scoringMethod,
    associatedContentId: form.associatedContentId,
  };

  emit('submit', formData);
};

// Handle save as draft
const handleSaveAsDraft = () => {
  if (!form.title.trim()) {
    errors.title = 'Quiz title is required';
    return;
  }

  const formData = {
    title: form.title.trim(),
    description: form.description.trim() || undefined,
    subject: form.subject as 'History' | 'Science' | undefined,
    gradeLevel: form.gradeLevel || undefined,
    timeLimit: form.timeLimit,
    maxAttempts: form.maxAttempts,
    scoringMethod: form.scoringMethod,
    associatedContentId: form.associatedContentId,
    status: 'draft' as const,
  };

  emit('save-draft', formData);
};
</script>