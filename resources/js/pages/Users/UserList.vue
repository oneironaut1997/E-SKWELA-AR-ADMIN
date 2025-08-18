<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="space-y-6 flex h-full flex-1 flex-col gap-6 rounded-xl p-4 overflow-x-auto">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
          <p class="mt-1 text-sm text-gray-500">
            Manage students, teachers, and administrators in the E-Skwela AR system
          </p>
        </div>
        <div class="mt-4 sm:mt-0">
          <Button @click="navigateToCreate" class="w-full sm:w-auto">
            <Icon name="Plus" class="w-4 h-4 mr-2" />
            Add New User
          </Button>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon name="Users" class="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Total Users</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.totalUsers }}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Icon name="GraduationCap" class="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Students</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.students }}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Icon name="BookOpen" class="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Teachers</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.teachers }}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Icon name="Shield" class="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Administrators</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.admins }}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Users Table -->
      <UserTable
        :users="users"
        :loading="loading"
        :pagination="pagination || undefined"
        @filter-change="handleFilterChange"
        @edit-user="handleEditUser"
        @delete-user="handleDeleteUser"
      />

      <!-- Delete Confirmation Dialog -->
      <Dialog :open="showDeleteDialog" @update:open="showDeleteDialog = $event">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{{ userToDelete?.name }}</strong>? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" @click="showDeleteDialog = false" :disabled="deleteLoading">
              Cancel
            </Button>
            <Button variant="destructive" @click="confirmDelete" :disabled="deleteLoading">
              <Icon v-if="deleteLoading" name="Loader2" class="w-4 h-4 mr-2 animate-spin" />
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <!-- Success/Error Toast -->
      <div
        v-if="toast.show"
        :class="[
          'fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg transition-all duration-300',
          toast.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        ]"
      >
        <div class="flex items-center">
          <Icon
            :name="toast.type === 'success' ? 'CheckCircle' : 'AlertCircle'"
            :class="toast.type === 'success' ? 'w-5 h-5 mr-3 text-green-400' : 'w-5 h-5 mr-3 text-red-400'"
          />
          <p :class="toast.type === 'success' ? 'text-green-800' : 'text-red-800'">
            {{ toast.message }}
          </p>
          <button @click="hideToast" class="ml-4">
            <Icon name="X" class="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import UserTable from '@/components/users/UserTable.vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/Icon.vue';
import { mockApi } from '@/services/mockApi';
import type { User, UserFilters, BreadcrumbItem } from '@/types';

// Page data
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'User Management', href: '/users' },
];

// State
const users = ref<User[]>([]);
const loading = ref(false);
const deleteLoading = ref(false);
const pagination = ref<{
  current_page: number;
  total: number;
  per_page: number;
} | null>(null);

const currentFilters = ref<UserFilters>({
  page: 1,
  per_page: 10,
});

// Delete dialog state
const showDeleteDialog = ref(false);
const userToDelete = ref<User | null>(null);

// Toast state
const toast = reactive({
  show: false,
  type: 'success' as 'success' | 'error',
  message: '',
});

// Statistics
const stats = computed(() => {
  const totalUsers = pagination.value?.total || 0;
  const students = users.value.filter(u => u.role === 'student').length;
  const teachers = users.value.filter(u => u.role === 'teacher').length;
  const admins = users.value.filter(u => u.role === 'admin').length;
  
  return {
    totalUsers,
    students,
    teachers,
    admins,
  };
});

// Methods
const fetchUsers = async (filters: UserFilters = currentFilters.value) => {
  loading.value = true;
  try {
    const response = await mockApi.getUsers(filters);
    if (response.success) {
      users.value = response.data;
      pagination.value = response.pagination || null;
      currentFilters.value = filters;
    } else {
      showToast('error', 'Failed to load users');
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    showToast('error', 'An error occurred while loading users');
  } finally {
    loading.value = false;
  }
};

const handleFilterChange = (filters: UserFilters) => {
  fetchUsers(filters);
};

const handleEditUser = (user: User) => {
  router.visit(`/users/${user.id}/edit`);
};

const handleDeleteUser = (user: User) => {
  userToDelete.value = user;
  showDeleteDialog.value = true;
};

const confirmDelete = async () => {
  if (!userToDelete.value) return;
  
  deleteLoading.value = true;
  try {
    const response = await mockApi.deleteUser(userToDelete.value.id);
    if (response.success) {
      showToast('success', 'User deleted successfully');
      showDeleteDialog.value = false;
      userToDelete.value = null;
      // Refresh the users list
      await fetchUsers(currentFilters.value);
    } else {
      showToast('error', response.message || 'Failed to delete user');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    showToast('error', 'An error occurred while deleting the user');
  } finally {
    deleteLoading.value = false;
  }
};

const navigateToCreate = () => {
  router.visit('/users/create');
};

const showToast = (type: 'success' | 'error', message: string) => {
  toast.type = type;
  toast.message = message;
  toast.show = true;
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    toast.show = false;
  }, 5000);
};

const hideToast = () => {
  toast.show = false;
};

// Lifecycle
onMounted(() => {
  fetchUsers();
});
</script>