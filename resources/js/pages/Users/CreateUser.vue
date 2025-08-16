<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="max-w-2xl mx-auto">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Create New User</h1>
        <p class="mt-1 text-sm text-gray-500">
          Add a new student, teacher, or administrator to the E-Skwela AR system
        </p>
      </div>

      <!-- Create User Form -->
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>
            Fill in the details below to create a new user account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm
            ref="userFormRef"
            :loading="loading"
            :is-editing="false"
            @submit="handleSubmit"
            @cancel="handleCancel"
          />
        </CardContent>
      </Card>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import UserForm from '@/components/users/UserForm.vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockApi } from '@/services/mockApi';
import type { CreateUserData, UpdateUserData, BreadcrumbItem } from '@/types';

// Page data
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'User Management', href: '/users' },
  { title: 'Create User', href: '/users/create' },
];

// State
const loading = ref(false);
const userFormRef = ref<InstanceType<typeof UserForm> | null>(null);

// Methods
const handleSubmit = async (userData: CreateUserData | UpdateUserData) => {
  // Type guard to ensure we have CreateUserData
  if (!('password' in userData) || !userData.password) {
    if (userFormRef.value) {
      userFormRef.value.setSubmitError('Password is required for new users');
    }
    return;
  }
  
  const createData = userData as CreateUserData;
  loading.value = true;
  
  try {
    const response = await mockApi.createUser(createData);
    
    if (response.success) {
      // Success - redirect to users list with success message
      router.visit('/users', {
        onSuccess: () => {
          // The success message will be handled by the UserList page
          console.log('User created successfully:', response.data);
        }
      });
    } else {
      // Handle API error
      if (userFormRef.value) {
        userFormRef.value.setSubmitError(response.message || 'Failed to create user');
      }
    }
  } catch (error) {
    console.error('Error creating user:', error);
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
</script>