<template>
  <div class="space-y-6 flex h-full flex-1 flex-col gap-6 rounded-xl p-4 overflow-x-auto">
    <!-- Header with Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="p-4 border rounded-lg">
        <div class="flex items-center gap-2">
          <Users class="h-4 w-4 text-muted-foreground" />
          <span class="text-sm font-medium">Total Attempts</span>
        </div>
        <p class="text-2xl font-bold mt-1">{{ stats.totalAttempts }}</p>
      </div>
      
      <div class="p-4 border rounded-lg">
        <div class="flex items-center gap-2">
          <CheckCircle class="h-4 w-4 text-green-600" />
          <span class="text-sm font-medium">Completed</span>
        </div>
        <p class="text-2xl font-bold mt-1 text-green-600">{{ stats.completedAttempts }}</p>
      </div>
      
      <div class="p-4 border rounded-lg">
        <div class="flex items-center gap-2">
          <Target class="h-4 w-4 text-blue-600" />
          <span class="text-sm font-medium">Average Score</span>
        </div>
        <p class="text-2xl font-bold mt-1 text-blue-600">{{ stats.averageScore }}%</p>
      </div>
      
      <div class="p-4 border rounded-lg">
        <div class="flex items-center gap-2">
          <Clock class="h-4 w-4 text-orange-600" />
          <span class="text-sm font-medium">Avg. Time</span>
        </div>
        <p class="text-2xl font-bold mt-1 text-orange-600">{{ formatTime(stats.averageTime) }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <Input
          v-model="filters.search"
          placeholder="Search by student name..."
          class="max-w-sm"
        />
      </div>
      
      <div class="flex gap-2">
        <Select v-model="filters.status">
          <SelectTrigger class="w-40">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All statuses</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="abandoned">Abandoned</SelectItem>
          </SelectContent>
        </Select>
        
        <Button
          variant="outline"
          @click="exportResults"
          :disabled="loading"
        >
          <Download class="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </div>

    <!-- Attempts Table -->
    <div class="rounded-md border">
      <table class="w-full">
        <thead>
          <tr class="border-b bg-muted/50">
            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Student
            </th>
            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Status
            </th>
            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Score
            </th>
            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Time Spent
            </th>
            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Started At
            </th>
            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Completed At
            </th>
            <th class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="border-b">
            <td colspan="7" class="h-24 px-4 text-center">
              <div class="flex items-center justify-center">
                <Loader2 class="h-6 w-6 animate-spin" />
                <span class="ml-2">Loading attempts...</span>
              </div>
            </td>
          </tr>
          <tr v-else-if="filteredAttempts.length === 0" class="border-b">
            <td colspan="7" class="h-24 px-4 text-center text-muted-foreground">
              No quiz attempts found.
            </td>
          </tr>
          <tr
            v-else
            v-for="attempt in paginatedAttempts"
            :key="attempt.id"
            class="border-b transition-colors hover:bg-muted/50"
          >
            <td class="p-4 align-middle">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span class="text-sm font-medium">
                    {{ getInitials(attempt.user?.name || 'Unknown') }}
                  </span>
                </div>
                <div>
                  <div class="font-medium">{{ attempt.user?.name || 'Unknown User' }}</div>
                  <div class="text-sm text-muted-foreground">{{ attempt.user?.email }}</div>
                </div>
              </div>
            </td>
            <td class="p-4 align-middle">
              <Badge :variant="getStatusVariant(attempt.status)" class="capitalize">
                {{ attempt.status.replace('_', ' ') }}
              </Badge>
            </td>
            <td class="p-4 align-middle">
              <div v-if="attempt.status === 'completed'" class="space-y-1">
                <div class="font-medium">{{ attempt.score }}/{{ attempt.totalPoints }}</div>
                <div class="text-sm text-muted-foreground">{{ attempt.percentage }}%</div>
              </div>
              <span v-else class="text-muted-foreground">-</span>
            </td>
            <td class="p-4 align-middle">
              <span v-if="attempt.timeSpent > 0">{{ formatTime(attempt.timeSpent) }}</span>
              <span v-else class="text-muted-foreground">-</span>
            </td>
            <td class="p-4 align-middle">
              <span class="text-sm">{{ formatDate(attempt.startedAt) }}</span>
            </td>
            <td class="p-4 align-middle">
              <span v-if="attempt.completedAt" class="text-sm">{{ formatDate(attempt.completedAt) }}</span>
              <span v-else class="text-muted-foreground">-</span>
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
                  <DropdownMenuItem @click="viewAttempt(attempt.id)">
                    <Eye class="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    v-if="attempt.status === 'completed'"
                    @click="viewAnswers(attempt.id)"
                  >
                    <FileText class="mr-2 h-4 w-4" />
                    View Answers
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    @click="deleteAttempt(attempt.id)"
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
    <div v-if="totalPages > 1" class="flex items-center justify-between">
      <div class="text-sm text-muted-foreground">
        Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to 
        {{ Math.min(currentPage * itemsPerPage, filteredAttempts.length) }} of 
        {{ filteredAttempts.length }} results
      </div>
      <div class="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="currentPage <= 1"
          @click="currentPage--"
        >
          <ChevronLeft class="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="currentPage >= totalPages"
          @click="currentPage++"
        >
          Next
          <ChevronRight class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileText,
  Loader2,
  MoreHorizontal,
  Target,
  Trash2,
  Users,
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { QuizAttempt } from '@/types';

interface Props {
  attempts: QuizAttempt[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  'view-attempt': [id: number];
  'view-answers': [id: number];
  'delete-attempt': [id: number];
  'export-results': [];
}>();

// Pagination
const currentPage = ref(1);
const itemsPerPage = 10;

// Filters
const filters = reactive({
  search: '',
  status: '',
});

// Computed properties
const stats = computed(() => {
  const completedAttempts = props.attempts.filter(a => a.status === 'completed');
  const totalScore = completedAttempts.reduce((sum, a) => sum + a.percentage, 0);
  const totalTime = completedAttempts.reduce((sum, a) => sum + a.timeSpent, 0);

  return {
    totalAttempts: props.attempts.length,
    completedAttempts: completedAttempts.length,
    averageScore: completedAttempts.length > 0 ? Math.round(totalScore / completedAttempts.length) : 0,
    averageTime: completedAttempts.length > 0 ? Math.round(totalTime / completedAttempts.length) : 0,
  };
});

const filteredAttempts = computed(() => {
  let filtered = [...props.attempts];

  // Search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(attempt =>
      attempt.user?.name.toLowerCase().includes(searchLower) ||
      attempt.user?.email.toLowerCase().includes(searchLower)
    );
  }

  // Status filter
  if (filters.status) {
    filtered = filtered.filter(attempt => attempt.status === filters.status);
  }

  return filtered;
});

const totalPages = computed(() => Math.ceil(filteredAttempts.value.length / itemsPerPage));

const paginatedAttempts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredAttempts.value.slice(start, end);
});

// Helper functions
const getStatusVariant = (status: string) => {
  switch (status) {
    case 'completed':
      return 'default';
    case 'in_progress':
      return 'secondary';
    case 'abandoned':
      return 'outline';
    default:
      return 'secondary';
  }
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Event handlers
const viewAttempt = (id: number) => {
  emit('view-attempt', id);
};

const viewAnswers = (id: number) => {
  emit('view-answers', id);
};

const deleteAttempt = (id: number) => {
  if (confirm('Are you sure you want to delete this quiz attempt? This action cannot be undone.')) {
    emit('delete-attempt', id);
  }
};

const exportResults = () => {
  emit('export-results');
};
</script>