<template>
  <div class="space-y-4">
    <!-- Search and Filters -->
    <div class="flex flex-col sm:flex-row gap-4">
      <!-- Search Input -->
      <div class="flex-1">
        <Input
          v-model="searchQuery"
          placeholder="Search users by name or email..."
          class="w-full"
          @input="handleSearch"
        />
      </div>
      
      <!-- Role Filter -->
      <div class="w-full sm:w-48">
        <select
          v-model="selectedRole"
          @change="handleRoleFilter"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Roles</option>
          <option value="student">Students</option>
          <option value="teacher">Teachers</option>
          <option value="admin">Administrators</option>
        </select>
      </div>
      
      <!-- Grade Level Filter (only show when students are selected) -->
      <div v-if="selectedRole === 'student'" class="w-full sm:w-48">
        <select
          v-model="selectedGradeLevel"
          @change="handleGradeLevelFilter"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Grades</option>
          <option value="Grade 1">Grade 1</option>
          <option value="Grade 2">Grade 2</option>
          <option value="Grade 3">Grade 3</option>
          <option value="Grade 4">Grade 4</option>
          <option value="Grade 5">Grade 5</option>
          <option value="Grade 6">Grade 6</option>
        </select>
      </div>
      
      <!-- Status Filter -->
      <div class="w-full sm:w-48">
        <select
          v-model="selectedStatus"
          @change="handleStatusFilter"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>

    <!-- Users Table -->
    <Card>
      <CardContent class="p-0">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" @click="handleSort('name')">
                  <div class="flex items-center space-x-1">
                    <span>Name</span>
                    <Icon :name="getSortIcon('name')" class="w-4 h-4" />
                  </div>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" @click="handleSort('email')">
                  <div class="flex items-center space-x-1">
                    <span>Email</span>
                    <Icon :name="getSortIcon('email')" class="w-4 h-4" />
                  </div>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" @click="handleSort('role')">
                  <div class="flex items-center space-x-1">
                    <span>Role</span>
                    <Icon :name="getSortIcon('role')" class="w-4 h-4" />
                  </div>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade Level
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" @click="handleSort('createdAt')">
                  <div class="flex items-center space-x-1">
                    <span>Created</span>
                    <Icon :name="getSortIcon('createdAt')" class="w-4 h-4" />
                  </div>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <!-- Loading State -->
              <template v-if="loading">
                <tr v-for="n in 5" :key="n">
                  <td v-for="col in 7" :key="col" class="px-6 py-4">
                    <div class="animate-pulse bg-gray-200 h-4 rounded"></div>
                  </td>
                </tr>
              </template>
              
              <!-- Users Data -->
              <tr v-else-if="users.length > 0" v-for="user in users" :key="user.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span class="text-sm font-medium text-gray-700">
                          {{ getInitials(user.name) }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ user.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" :class="getRoleBadgeClass(user.role)">
                    {{ getRoleLabel(user.role) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ user.gradeLevel || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" :class="getStatusBadgeClass(user.status)">
                    {{ user.status === 'active' ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(user.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Button variant="outline" size="sm" @click="$emit('edit-user', user)">
                    <Icon name="Edit" class="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" @click="$emit('delete-user', user)" class="text-red-600 hover:text-red-700">
                    <Icon name="Trash2" class="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </td>
              </tr>
              
              <!-- Empty State -->
              <tr v-else>
                <td colspan="7" class="px-6 py-12 text-center">
                  <div class="text-gray-500">
                    <Icon name="Users" class="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p class="text-lg font-medium">No users found</p>
                    <p class="text-sm">Try adjusting your search or filter criteria.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>

    <!-- Pagination -->
    <div v-if="pagination && pagination.total > 0" class="flex items-center justify-between">
      <div class="text-sm text-gray-700">
        Showing {{ ((pagination.current_page - 1) * pagination.per_page) + 1 }} to 
        {{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }} of 
        {{ pagination.total }} results
      </div>
      
      <div class="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          :disabled="pagination.current_page <= 1"
          @click="handlePageChange(pagination.current_page - 1)"
        >
          <Icon name="ChevronLeft" class="w-4 h-4" />
          Previous
        </Button>
        
        <div class="flex items-center space-x-1">
          <template v-for="page in getVisiblePages()">
            <Button
              v-if="page !== '...'"
              :key="`page-${page}`"
              :variant="page === pagination.current_page ? 'default' : 'outline'"
              size="sm"
              @click="handlePageChange(Number(page))"
            >
              {{ page }}
            </Button>
            <span v-else :key="`ellipsis-${page}`" class="px-2 text-gray-500">...</span>
          </template>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          :disabled="pagination.current_page >= Math.ceil(pagination.total / pagination.per_page)"
          @click="handlePageChange(pagination.current_page + 1)"
        >
          Next
          <Icon name="ChevronRight" class="w-4 h-4" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/Icon.vue';
import type { User, UserFilters } from '@/types';

interface Props {
  users: User[];
  loading?: boolean;
  pagination?: {
    current_page: number;
    total: number;
    per_page: number;
  };
}

interface Emits {
  (e: 'filter-change', filters: UserFilters): void;
  (e: 'edit-user', user: User): void;
  (e: 'delete-user', user: User): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<Emits>();

// Filter state
const searchQuery = ref('');
const selectedRole = ref('');
const selectedGradeLevel = ref('');
const selectedStatus = ref('');
const sortBy = ref<string>('name');
const sortOrder = ref<'asc' | 'desc'>('asc');

// Utility functions
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getRoleLabel = (role: string): string => {
  const labels = {
    student: 'Student',
    teacher: 'Teacher',
    admin: 'Administrator'
  };
  return labels[role as keyof typeof labels] || role;
};

const getRoleBadgeClass = (role: string): string => {
  const classes = {
    student: 'bg-blue-100 text-blue-800',
    teacher: 'bg-green-100 text-green-800',
    admin: 'bg-purple-100 text-purple-800'
  };
  return classes[role as keyof typeof classes] || 'bg-gray-100 text-gray-800';
};

const getStatusBadgeClass = (status: string): string => {
  return status === 'active' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800';
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });
};

const getSortIcon = (column: string): string => {
  if (sortBy.value !== column) return 'ChevronsUpDown';
  return sortOrder.value === 'asc' ? 'ChevronUp' : 'ChevronDown';
};

// Event handlers
const handleSearch = () => {
  emitFilters();
};

const handleRoleFilter = () => {
  // Reset grade level when role changes
  if (selectedRole.value !== 'student') {
    selectedGradeLevel.value = '';
  }
  emitFilters();
};

const handleGradeLevelFilter = () => {
  emitFilters();
};

const handleStatusFilter = () => {
  emitFilters();
};

const handleSort = (column: string) => {
  if (sortBy.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = column;
    sortOrder.value = 'asc';
  }
  emitFilters();
};

const handlePageChange = (page: number) => {
  emitFilters(page);
};

const emitFilters = (page?: number) => {
  const filters: UserFilters = {
    page: page || 1,
    per_page: 10,
    search: searchQuery.value || undefined,
    role: selectedRole.value as any || undefined,
    gradeLevel: selectedGradeLevel.value || undefined,
    status: selectedStatus.value as any || undefined,
    sortBy: sortBy.value as any,
    sortOrder: sortOrder.value,
  };
  
  // Remove undefined values
  Object.keys(filters).forEach(key => {
    if (filters[key as keyof UserFilters] === undefined) {
      delete filters[key as keyof UserFilters];
    }
  });
  
  emit('filter-change', filters);
};

const getVisiblePages = (): (number | string)[] => {
  if (!props.pagination) return [];
  
  const totalPages = Math.ceil(props.pagination.total / props.pagination.per_page);
  const currentPage = props.pagination.current_page;
  const pages: (number | string)[] = [];
  
  if (totalPages <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Show first page
    pages.push(1);
    
    if (currentPage > 4) {
      pages.push('...');
    }
    
    // Show pages around current page
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (currentPage < totalPages - 3) {
      pages.push('...');
    }
    
    // Show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
  }
  
  return pages;
};
</script>