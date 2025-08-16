<template>
  <div class="space-y-4">
    <!-- Table -->
    <div class="rounded-md border">
      <table class="w-full">
        <thead>
          <tr class="border-b bg-muted/50">
            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              <button
                @click="$emit('sort', 'title')"
                class="flex items-center gap-2 hover:text-foreground"
              >
                Title
                <ArrowUpDown class="h-4 w-4" />
              </button>
            </th>
            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              <button
                @click="$emit('sort', 'subject')"
                class="flex items-center gap-2 hover:text-foreground"
              >
                Subject
                <ArrowUpDown class="h-4 w-4" />
              </button>
            </th>
            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              <button
                @click="$emit('sort', 'gradeLevel')"
                class="flex items-center gap-2 hover:text-foreground"
              >
                Grade Level
                <ArrowUpDown class="h-4 w-4" />
              </button>
            </th>
            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Questions
            </th>
            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Time Limit
            </th>
            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Status
            </th>
            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Associated Content
            </th>
            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              <button
                @click="$emit('sort', 'createdAt')"
                class="flex items-center gap-2 hover:text-foreground"
              >
                Created
                <ArrowUpDown class="h-4 w-4" />
              </button>
            </th>
            <th class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="border-b">
            <td colspan="9" class="h-24 px-4 text-center">
              <div class="flex items-center justify-center">
                <Loader2 class="h-6 w-6 animate-spin" />
                <span class="ml-2">Loading quizzes...</span>
              </div>
            </td>
          </tr>
          <tr v-else-if="quizzes.length === 0" class="border-b">
            <td colspan="9" class="h-24 px-4 text-center text-muted-foreground">
              No quizzes found.
            </td>
          </tr>
          <tr
            v-else
            v-for="quiz in quizzes"
            :key="quiz.id"
            class="border-b transition-colors hover:bg-muted/50"
          >
            <td class="p-4 align-middle">
              <div class="space-y-1">
                <div class="font-medium">{{ quiz.title }}</div>
                <div v-if="quiz.description" class="text-sm text-muted-foreground line-clamp-2">
                  {{ quiz.description }}
                </div>
              </div>
            </td>
            <td class="p-4 align-middle">
              <Badge :variant="quiz.subject === 'History' ? 'default' : 'secondary'">
                {{ quiz.subject }}
              </Badge>
            </td>
            <td class="p-4 align-middle">
              <span class="text-sm">{{ quiz.gradeLevel }}</span>
            </td>
            <td class="p-4 align-middle">
              <div class="flex items-center gap-2">
                <FileQuestion class="h-4 w-4 text-muted-foreground" />
                <span class="text-sm">{{ quiz.questionsCount }}</span>
              </div>
            </td>
            <td class="p-4 align-middle">
              <div class="flex items-center gap-2">
                <Clock class="h-4 w-4 text-muted-foreground" />
                <span class="text-sm">{{ quiz.timeLimit }}m</span>
              </div>
            </td>
            <td class="p-4 align-middle">
              <Badge
                :variant="getStatusVariant(quiz.status)"
                class="capitalize"
              >
                {{ quiz.status }}
              </Badge>
            </td>
            <td class="p-4 align-middle">
              <div v-if="quiz.associatedContent" class="flex items-center gap-2">
                <component
                  :is="quiz.associatedContent.type === '3d_model' ? Box : Volume2"
                  class="h-4 w-4 text-muted-foreground"
                />
                <span class="text-sm truncate max-w-32" :title="quiz.associatedContent.title">
                  {{ quiz.associatedContent.title }}
                </span>
              </div>
              <span v-else class="text-sm text-muted-foreground">None</span>
            </td>
            <td class="p-4 align-middle">
              <span class="text-sm text-muted-foreground">
                {{ formatDate(quiz.createdAt) }}
              </span>
            </td>
            <td class="p-4 align-middle text-right">
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="ghost" class="h-8 w-8 p-0">
                    <span class="sr-only">Open menu</span>
                    <MoreHorizontal class="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem @click="$emit('view', quiz.id)">
                    <Eye class="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="$emit('edit', quiz.id)">
                    <Edit class="mr-2 h-4 w-4" />
                    Edit Quiz
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="$emit('builder', quiz.id)">
                    <Settings class="mr-2 h-4 w-4" />
                    Quiz Builder
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="$emit('preview', quiz.id)">
                    <Play class="mr-2 h-4 w-4" />
                    Preview Quiz
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="$emit('attempts', quiz.id)">
                    <BarChart3 class="mr-2 h-4 w-4" />
                    View Attempts
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem @click="$emit('duplicate', quiz.id)">
                    <Copy class="mr-2 h-4 w-4" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    @click="$emit('delete', quiz.id)"
                    class="text-destructive focus:text-destructive"
                  >
                    <Trash2 class="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && pagination.total > pagination.per_page" class="flex items-center justify-between">
      <div class="text-sm text-muted-foreground">
        Showing {{ ((pagination.current_page - 1) * pagination.per_page) + 1 }} to 
        {{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }} of 
        {{ pagination.total }} results
      </div>
      <div class="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="pagination.current_page <= 1"
          @click="$emit('page-change', pagination.current_page - 1)"
        >
          <ChevronLeft class="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="pagination.current_page >= Math.ceil(pagination.total / pagination.per_page)"
          @click="$emit('page-change', pagination.current_page + 1)"
        >
          Next
          <ChevronRight class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Simple date formatting without external dependency
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
import {
  ArrowUpDown,
  BarChart3,
  Box,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Edit,
  Eye,
  FileQuestion,
  Loader2,
  MoreHorizontal,
  Play,
  Settings,
  Trash2,
  Volume2,
} from 'lucide-vue-next';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { Quiz } from '@/types';

interface Props {
  quizzes: Quiz[];
  loading?: boolean;
  pagination?: {
    current_page: number;
    total: number;
    per_page: number;
  };
}

defineProps<Props>();

defineEmits<{
  sort: [field: string];
  'page-change': [page: number];
  view: [id: number];
  edit: [id: number];
  builder: [id: number];
  preview: [id: number];
  attempts: [id: number];
  duplicate: [id: number];
  delete: [id: number];
}>();

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

</script>