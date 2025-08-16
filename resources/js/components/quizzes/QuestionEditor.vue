<template>
  <div class="space-y-6">
    <!-- Question Form -->
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Question Title -->
      <div class="space-y-2">
        <Label for="questionTitle">Question *</Label>
        <textarea
          id="questionTitle"
          v-model="form.title"
          placeholder="Enter your question here..."
          class="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          :class="{ 'border-destructive': errors.title }"
          required
        />
        <p v-if="errors.title" class="text-sm text-destructive">
          {{ errors.title }}
        </p>
      </div>

      <!-- Multiple Choice Options -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <Label>Answer Options *</Label>
          <Badge variant="secondary" class="text-xs">
            Multiple Choice (4 options)
          </Badge>
        </div>
        
        <div class="space-y-3">
          <div
            v-for="(option, index) in form.options"
            :key="index"
            class="flex items-center gap-3 p-3 border rounded-lg"
            :class="{
              'border-primary bg-primary/5': form.correctAnswer === index,
              'border-destructive': errors.options && errors.options[index]
            }"
          >
            <!-- Option Letter -->
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
              {{ String.fromCharCode(65 + index) }}
            </div>
            
            <!-- Radio Button for Correct Answer -->
            <div class="flex-shrink-0">
              <input
                :id="`correct-${index}`"
                type="radio"
                :value="index"
                v-model="form.correctAnswer"
                class="w-4 h-4 text-primary bg-background border-border focus:ring-primary focus:ring-2"
                required
              />
              <Label :for="`correct-${index}`" class="sr-only">
                Mark as correct answer
              </Label>
            </div>
            
            <!-- Option Input -->
            <div class="flex-1">
              <Input
                v-model="form.options[index]"
                :placeholder="`Option ${String.fromCharCode(65 + index)}`"
                :class="{ 'border-destructive': errors.options && errors.options[index] }"
                required
              />
              <p v-if="errors.options && errors.options[index]" class="text-sm text-destructive mt-1">
                {{ errors.options[index] }}
              </p>
            </div>
            
            <!-- Correct Answer Indicator -->
            <div v-if="form.correctAnswer === index" class="flex-shrink-0">
              <Badge variant="default" class="text-xs">
                <Check class="w-3 h-3 mr-1" />
                Correct
              </Badge>
            </div>
          </div>
        </div>
        
        <p class="text-sm text-muted-foreground">
          Select the radio button next to the correct answer option.
        </p>
      </div>

      <!-- Points and Explanation -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <Label for="points">Points *</Label>
          <Select 
            :model-value="String(form.points)" 
            @update:model-value="form.points = Number($event)"
            required
          >
            <SelectTrigger :class="errors.points ? 'border-destructive' : ''">
              <SelectValue placeholder="Select points" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 point</SelectItem>
              <SelectItem value="2">2 points</SelectItem>
              <SelectItem value="3">3 points</SelectItem>
              <SelectItem value="5">5 points</SelectItem>
            </SelectContent>
          </Select>
          <p v-if="errors.points" class="text-sm text-destructive">
            {{ errors.points }}
          </p>
        </div>

        <div class="space-y-2">
          <Label for="explanation">Explanation (Optional)</Label>
          <Input
            id="explanation"
            v-model="form.explanation"
            placeholder="Brief explanation for the answer"
            :class="{ 'border-destructive': errors.explanation }"
          />
          <p v-if="errors.explanation" class="text-sm text-destructive">
            {{ errors.explanation }}
          </p>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex items-center justify-between pt-4 border-t">
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
            @click="handleDelete"
            :disabled="loading"
            class="text-destructive hover:text-destructive"
          >
            <Trash2 class="mr-2 h-4 w-4" />
            Delete Question
          </Button>
          
          <Button
            type="submit"
            :disabled="loading || !isFormValid"
          >
            <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
            <template v-else>
              {{ mode === 'create' ? 'Add Question' : 'Update Question' }}
            </template>
          </Button>
        </div>
      </div>
    </form>

    <!-- Question Preview -->
    <div v-if="isFormValid" class="space-y-4">
      <div class="flex items-center gap-2">
        <Eye class="h-4 w-4" />
        <h3 class="text-lg font-medium">Preview</h3>
      </div>
      
      <div class="p-4 border rounded-lg bg-muted/50">
        <div class="space-y-4">
          <!-- Question -->
          <div class="space-y-2">
            <h4 class="font-medium">{{ form.title }}</h4>
            <Badge variant="outline" class="text-xs">
              {{ form.points }} {{ form.points === 1 ? 'point' : 'points' }}
            </Badge>
          </div>
          
          <!-- Options -->
          <div class="space-y-2">
            <div
              v-for="(option, index) in form.options"
              :key="index"
              class="flex items-center gap-3 p-2 rounded border"
              :class="{
                'border-primary bg-primary/10': form.correctAnswer === index,
                'border-border': form.correctAnswer !== index
              }"
            >
              <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs"
                   :class="{
                     'border-primary bg-primary text-primary-foreground': form.correctAnswer === index,
                     'border-border': form.correctAnswer !== index
                   }">
                {{ String.fromCharCode(65 + index) }}
              </div>
              <span class="text-sm">{{ option }}</span>
              <Check v-if="form.correctAnswer === index" class="w-4 h-4 text-primary ml-auto" />
            </div>
          </div>
          
          <!-- Explanation -->
          <div v-if="form.explanation" class="pt-2 border-t">
            <p class="text-sm text-muted-foreground">
              <strong>Explanation:</strong> {{ form.explanation }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { Check, Eye, Loader2, Trash2 } from 'lucide-vue-next';

import { Badge } from '@/components/ui/badge';
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

import type { Question, CreateQuestionData, UpdateQuestionData } from '@/types';

interface Props {
  mode: 'create' | 'edit';
  question?: Question;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  submit: [data: CreateQuestionData | UpdateQuestionData];
  delete: [];
  cancel: [];
}>();

// Form data
const form = reactive({
  title: '',
  options: ['', '', '', ''],
  correctAnswer: 0,
  points: 1,
  explanation: '',
});

// Form errors
const errors = reactive({
  title: '',
  options: ['', '', '', ''],
  correctAnswer: '',
  points: '',
  explanation: '',
});

// Initialize form with question data if editing
watch(() => props.question, (question) => {
  if (question && props.mode === 'edit') {
    form.title = question.title;
    form.options = [...question.options];
    form.correctAnswer = question.correctAnswer;
    form.points = question.points;
    form.explanation = question.explanation || '';
  }
}, { immediate: true });

// Form validation
const isFormValid = computed(() => {
  return form.title.trim() !== '' &&
         form.options.every(option => option.trim() !== '') &&
         form.correctAnswer >= 0 && form.correctAnswer <= 3 &&
         form.points > 0;
});

// Validate form
const validateForm = () => {
  // Reset errors
  errors.title = '';
  errors.options = ['', '', '', ''];
  errors.correctAnswer = '';
  errors.points = '';
  errors.explanation = '';

  let isValid = true;

  // Title validation
  if (!form.title.trim()) {
    errors.title = 'Question is required';
    isValid = false;
  } else if (form.title.length < 10) {
    errors.title = 'Question must be at least 10 characters';
    isValid = false;
  } else if (form.title.length > 500) {
    errors.title = 'Question must be less than 500 characters';
    isValid = false;
  }

  // Options validation
  form.options.forEach((option, index) => {
    if (!option.trim()) {
      errors.options[index] = `Option ${String.fromCharCode(65 + index)} is required`;
      isValid = false;
    } else if (option.length > 200) {
      errors.options[index] = `Option ${String.fromCharCode(65 + index)} must be less than 200 characters`;
      isValid = false;
    }
  });

  // Check for duplicate options
  const uniqueOptions = new Set(form.options.map(opt => opt.trim().toLowerCase()));
  if (uniqueOptions.size !== form.options.length) {
    form.options.forEach((option, index) => {
      const duplicateIndex = form.options.findIndex((opt, i) => 
        i !== index && opt.trim().toLowerCase() === option.trim().toLowerCase()
      );
      if (duplicateIndex !== -1) {
        errors.options[index] = 'Duplicate option not allowed';
        isValid = false;
      }
    });
  }

  // Correct answer validation
  if (form.correctAnswer < 0 || form.correctAnswer > 3) {
    errors.correctAnswer = 'Please select a correct answer';
    isValid = false;
  }

  // Points validation
  if (!form.points || form.points < 1 || form.points > 10) {
    errors.points = 'Points must be between 1 and 10';
    isValid = false;
  }

  // Explanation validation
  if (form.explanation && form.explanation.length > 300) {
    errors.explanation = 'Explanation must be less than 300 characters';
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
    options: form.options.map(opt => opt.trim()),
    correctAnswer: form.correctAnswer,
    points: form.points,
    explanation: form.explanation.trim() || undefined,
  };

  emit('submit', formData);
};

// Handle delete
const handleDelete = () => {
  if (confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
    emit('delete');
  }
};
</script>