<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="max-w-2xl mx-auto">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Edit User</h1>
        <p class="mt-1 text-sm text-gray-500">
          Update user information and settings
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="pageLoading" class="space-y-6">
        <Card>
          <CardContent class="p-6">
            <div class="animate-pulse space-y-4">
              <div class="h-4 bg-gray-200 rounded w-1/4"></div>
              <div class="h-10 bg-gray-200 rounded"></div>
              <div class="h-4 bg-gray-200 rounded w-1/4"></div>
              <div class="h-10 bg-gray-200 rounded"></div>
              <div class="h-4 bg-gray-200 rounded w-1/4"></div>
              <div class="h-10 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Edit User Form -->
      <Card v-else-if="user">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>
            Update the details below to modify the user account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm
            ref="userFormRef"
            :user="user"
            :loading="loading"
            :is-editing="true"
            @submit="handleSubmit"
            @cancel="handleCancel"
          />
        </CardContent>
      </Card>

      <!-- Error State -->
      <Card v-else-if="error">
        <CardContent class="p-6">
          <div class="text-center">
            <Icon name="AlertCircle" class="w-12 h-12 mx-auto mb-4 text-red-400" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">Error Loading User</h3>
            <p class="text-sm text-gray-500 mb-4">{{ error }}</p>
            <Button @click="loadUser" variant="outline">
              <Icon name="RefreshCw" class="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import UserForm from '@/components/users/UserForm.vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/Icon.vue';
import { mockApi } from '@/services/mockApi';
import type { User, UpdateUserData, BreadcrumbItem } from '@/types';

// Get user ID from route parameters
const userId = computed(() => {
  // Extract ID from current URL path
  const pathParts = window.location.pathname.split('/');
  const userIndex = pathParts.indexOf('users');
  return userIndex !== -1 && pathParts[userIndex + 1] ? parseInt(pathParts[userIndex + 1]) : null;
});

// Page data
const breadcrumbs = computed((): BreadcrumbItem[] => [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'User Management', href: '/users' },
  { title: 'Edit User', href: `/users/${userId.value}/edit` },
]);

// State
const user = ref<User | null>(null);
const pageLoading = ref(true);
const loading = ref(false);
const error = ref('');
const userFormRef = ref<InstanceType<typeof UserForm> | null>(null);

// Methods
const loadUser = async () => {
  if (!userId.value) {
    error.value = 'Invalid user ID';
    pageLoading.value = false;
    return;
  }

  pageLoading.value = true;
  error.value = '';
  
  try {
    const response = await mockApi.getUserById(userId.value);
    
    if (response.success) {
      user.value = response.data;
    } else {
      error.value = response.message || 'User not found';
    }
  } catch (err) {
    console.error('Error loading user:', err);
    error.value = 'An unexpected error occurred while loading the user';
  } finally {
    pageLoading.value = false;
  }
};

const handleSubmit = async (userData: UpdateUserData) => {
  if (!userId.value) return;
  
  loading.value = true;
  
  try {
    const response = await mockApi.updateUser(userId.value, userData);
    
    if (response.success) {
      // Success - redirect to users list with success message
      router.visit('/users', {
        onSuccess: () => {
          console.log('User updated successfully:', response.data);
        }
      });
    } else {
      // Handle API error
      if (userFormRef.value) {
        userFormRef.value.setSubmitError(response.message || 'Failed to update user');
      }
    }
  } catch (error) {
    console.error('Error updating user:', error);
    if (userFormRef.value) {
      userFormRef.value.setSubmitError('An unexpected error occurred. Please try again.');
    }
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  router.visit('/users');
};

// Lifecycle
onMounted(() => {
  loadUser();
});
</script>