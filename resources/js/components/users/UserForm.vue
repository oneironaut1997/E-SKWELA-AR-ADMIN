<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Name Field -->
    <div>
      <Label for="name" class="text-sm font-medium text-gray-700">
        Full Name <span class="text-red-500">*</span>
      </Label>
      <Input
        id="name"
        v-model="form.name"
        type="text"
        placeholder="Enter full name"
        :class="{ 'border-red-500': errors.name }"
        class="mt-1"
        @blur="validateField('name')"
      />
      <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
    </div>

    <!-- Email Field -->
    <div>
      <Label for="email" class="text-sm font-medium text-gray-700">
        Email Address <span class="text-red-500">*</span>
      </Label>
      <Input
        id="email"
        v-model="form.email"
        type="email"
        placeholder="Enter email address"
        :class="{ 'border-red-500': errors.email }"
        class="mt-1"
        @blur="validateField('email')"
      />
      <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
    </div>

    <!-- Role Field -->
    <div>
      <Label for="role" class="text-sm font-medium text-gray-700">
        Role <span class="text-red-500">*</span>
      </Label>
      <select
        id="role"
        v-model="form.role"
        :class="{ 'border-red-500': errors.role }"
        class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        @change="handleRoleChange"
      >
        <option value="">Select a role</option>
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
        <option value="admin">Administrator</option>
      </select>
      <p v-if="errors.role" class="mt-1 text-sm text-red-600">{{ errors.role }}</p>
    </div>

    <!-- Grade Level Field (only for students) -->
    <div v-if="form.role === 'student'">
      <Label for="gradeLevel" class="text-sm font-medium text-gray-700">
        Grade Level <span class="text-red-500">*</span>
      </Label>
      <select
        id="gradeLevel"
        v-model="form.gradeLevel"
        :class="{ 'border-red-500': errors.gradeLevel }"
        class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        @blur="validateField('gradeLevel')"
      >
        <option value="">Select grade level</option>
        <option value="Grade 1">Grade 1</option>
        <option value="Grade 2">Grade 2</option>
        <option value="Grade 3">Grade 3</option>
        <option value="Grade 4">Grade 4</option>
        <option value="Grade 5">Grade 5</option>
        <option value="Grade 6">Grade 6</option>
      </select>
      <p v-if="errors.gradeLevel" class="mt-1 text-sm text-red-600">{{ errors.gradeLevel }}</p>
    </div>

    <!-- Password Field (required for creation, optional for editing) -->
    <div v-if="!isEditing || showPasswordField">
      <Label for="password" class="text-sm font-medium text-gray-700">
        Password 
        <span v-if="!isEditing" class="text-red-500">*</span>
        <span v-else class="text-gray-500 text-xs">(leave blank to keep current password)</span>
      </Label>
      <div class="relative mt-1">
        <Input
          id="password"
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Enter password"
          :class="{ 'border-red-500': errors.password }"
          class="pr-10"
          @blur="validateField('password')"
        />
        <button
          type="button"
          @click="showPassword = !showPassword"
          class="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <Icon :name="showPassword ? 'EyeOff' : 'Eye'" class="w-4 h-4 text-gray-400" />
        </button>
      </div>
      <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
      <p v-if="!isEditing" class="mt-1 text-xs text-gray-500">
        Password must be at least 8 characters long
      </p>
    </div>

    <!-- Show Password Field Toggle (for editing) -->
    <div v-if="isEditing && !showPasswordField">
      <Button
        type="button"
        variant="outline"
        size="sm"
        @click="showPasswordField = true"
      >
        <Icon name="Key" class="w-4 h-4 mr-2" />
        Change Password
      </Button>
    </div>

    <!-- Status Field (only for editing) -->
    <div v-if="isEditing">
      <Label for="status" class="text-sm font-medium text-gray-700">
        Status
      </Label>
      <select
        id="status"
        v-model="form.status"
        class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>

    <!-- Form Actions -->
    <div class="flex items-center justify-end space-x-4 pt-6 border-t">
      <Button
        type="button"
        variant="outline"
        @click="$emit('cancel')"
        :disabled="loading"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        :disabled="loading || !isFormValid"
        class="min-w-[100px]"
      >
        <Icon v-if="loading" name="Loader2" class="w-4 h-4 mr-2 animate-spin" />
        {{ isEditing ? 'Update User' : 'Create User' }}
      </Button>
    </div>

    <!-- Error Message -->
    <div v-if="submitError" class="p-4 bg-red-50 border border-red-200 rounded-md">
      <div class="flex">
        <Icon name="AlertCircle" class="w-5 h-5 text-red-400" />
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error</h3>
          <p class="mt-1 text-sm text-red-700">{{ submitError }}</p>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Icon from '@/components/Icon.vue';
import type { User, CreateUserData, UpdateUserData } from '@/types';

interface Props {
  user?: User;
  loading?: boolean;
  isEditing?: boolean;
}

interface Emits {
  (e: 'submit', data: CreateUserData | UpdateUserData): void;
  (e: 'cancel'): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  isEditing: false,
});

const emit = defineEmits<Emits>();

// Form state
const form = reactive({
  name: '',
  email: '',
  role: '' as 'student' | 'teacher' | 'admin' | '',
  gradeLevel: '',
  password: '',
  status: 'active' as 'active' | 'inactive',
});

const errors = reactive({
  name: '',
  email: '',
  role: '',
  gradeLevel: '',
  password: '',
});

const showPassword = ref(false);
const showPasswordField = ref(false);
const submitError = ref('');

// Initialize form with user data if editing
watch(() => props.user, (user) => {
  if (user && props.isEditing) {
    form.name = user.name;
    form.email = user.email;
    form.role = user.role;
    form.gradeLevel = user.gradeLevel || '';
    form.status = user.status;
    form.password = ''; // Always start with empty password for editing
  }
}, { immediate: true });

// Validation rules
const validationRules = {
  name: (value: string) => {
    if (!value.trim()) return 'Name is required';
    if (value.trim().length < 2) return 'Name must be at least 2 characters';
    if (value.trim().length > 100) return 'Name must be less than 100 characters';
    return '';
  },
  
  email: (value: string) => {
    if (!value.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Please enter a valid email address';
    return '';
  },
  
  role: (value: string) => {
    if (!value) return 'Role is required';
    if (!['student', 'teacher', 'admin'].includes(value)) return 'Please select a valid role';
    return '';
  },
  
  gradeLevel: (value: string) => {
    if (form.role === 'student' && !value) return 'Grade level is required for students';
    return '';
  },
  
  password: (value: string) => {
    if (!props.isEditing && !value) return 'Password is required';
    if (value && value.length < 8) return 'Password must be at least 8 characters';
    return '';
  },
};

// Validation functions
const validateField = (field: keyof typeof errors) => {
  const rule = validationRules[field];
  if (rule) {
    errors[field] = rule(form[field] as string);
  }
};

const validateForm = () => {
  Object.keys(validationRules).forEach(field => {
    validateField(field as keyof typeof errors);
  });
  
  return Object.values(errors).every(error => !error);
};

// Computed properties
const isFormValid = computed(() => {
  // Check required fields
  const requiredFields = ['name', 'email', 'role'];
  const hasRequiredFields = requiredFields.every(field => form[field as keyof typeof form]);
  
  // Check grade level for students
  const hasGradeLevel = form.role !== 'student' || form.gradeLevel;
  
  // Check password for creation
  const hasPassword = props.isEditing || form.password;
  
  // Check for validation errors
  const hasNoErrors = Object.values(errors).every(error => !error);
  
  return hasRequiredFields && hasGradeLevel && hasPassword && hasNoErrors;
});

// Event handlers
const handleRoleChange = () => {
  validateField('role');
  
  // Clear grade level if not a student
  if (form.role !== 'student') {
    form.gradeLevel = '';
    errors.gradeLevel = '';
  } else {
    // Validate grade level for students
    validateField('gradeLevel');
  }
};

const handleSubmit = () => {
  submitError.value = '';
  
  if (!validateForm()) {
    return;
  }
  
  const submitData = props.isEditing ? getUpdateData() : getCreateData();
  emit('submit', submitData);
};

const getCreateData = (): CreateUserData => {
  return {
    name: form.name.trim(),
    email: form.email.trim(),
    role: form.role as 'student' | 'teacher' | 'admin',
    gradeLevel: form.role === 'student' ? form.gradeLevel : undefined,
    password: form.password,
  };
};

const getUpdateData = (): UpdateUserData => {
  const data: UpdateUserData = {
    name: form.name.trim(),
    email: form.email.trim(),
    role: form.role as 'student' | 'teacher' | 'admin',
    gradeLevel: form.role === 'student' ? form.gradeLevel : undefined,
    status: form.status,
  };
  
  // Only include password if it's being changed
  if (form.password) {
    data.password = form.password;
  }
  
  return data;
};

// Watch for external errors (e.g., from API)
const setSubmitError = (error: string) => {
  submitError.value = error;
};

// Expose method for parent component to set errors
defineExpose({
  setSubmitError,
});
</script>