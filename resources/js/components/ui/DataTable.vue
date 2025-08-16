<template>
  <div class="space-y-4">
    <!-- Table Header with Search and Actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex items-center gap-2">
        <Input
          v-if="searchable"
          v-model="searchQuery"
          placeholder="Search..."
          class="max-w-sm"
          @input="handleSearch"
        />
        <Select v-if="filterable && filterOptions.length > 0" v-model="selectedFilter" @update:model-value="handleFilter">
          <SelectTrigger class="w-40">
            <SelectValue placeholder="Filter by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem v-for="option in filterOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div class="flex items-center gap-2">
        <Button v-if="bulkActions.length > 0 && selectedRows.length > 0" variant="outline" @click="showBulkActions = !showBulkActions">
          <MoreHorizontal class="mr-2 h-4 w-4" />
          Actions ({{ selectedRows.length }})
        </Button>
        <slot name="actions" />
      </div>
    </div>

    <!-- Bulk Actions Dropdown -->
    <div v-if="showBulkActions && selectedRows.length > 0" class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium text-blue-800">{{ selectedRows.length }} items selected</span>
        <div class="flex gap-2 ml-auto">
          <Button
            v-for="action in bulkActions"
            :key="action.key"
            :variant="action.variant || 'outline'"
            size="sm"
            @click="handleBulkAction(action.key)"
          >
            <component :is="action.icon" v-if="action.icon" class="mr-2 h-4 w-4" />
            {{ action.label }}
          </Button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="border rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th v-if="selectable" class="w-12 px-4 py-3">
                <Checkbox
                  :checked="isAllSelected"
                  :indeterminate="isIndeterminate"
                  @update:checked="toggleSelectAll"
                />
              </th>
              <th
                v-for="column in columns"
                :key="column.key"
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                :class="column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''"
                @click="column.sortable ? handleSort(column.key) : null"
              >
                <div class="flex items-center gap-2">
                  {{ column.label }}
                  <div v-if="column.sortable" class="flex flex-col">
                    <ChevronUp
                      class="h-3 w-3"
                      :class="sortBy === column.key && sortOrder === 'asc' ? 'text-blue-600' : 'text-gray-400'"
                    />
                    <ChevronDown
                      class="h-3 w-3 -mt-1"
                      :class="sortBy === column.key && sortOrder === 'desc' ? 'text-blue-600' : 'text-gray-400'"
                    />
                  </div>
                </div>
              </th>
              <th v-if="actions.length > 0" class="w-20 px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading" class="h-32">
              <td :colspan="totalColumns" class="text-center">
                <LoadingSpinner message="Loading data..." centered />
              </td>
            </tr>
            <tr v-else-if="filteredData.length === 0" class="h-32">
              <td :colspan="totalColumns" class="text-center text-gray-500">
                <div class="flex flex-col items-center gap-2">
                  <Search class="h-8 w-8 text-gray-400" />
                  <span>No data found</span>
                </div>
              </td>
            </tr>
            <tr
              v-else
              v-for="(item, index) in paginatedData"
              :key="getRowKey(item, index)"
              class="hover:bg-gray-50 transition-colors"
            >
              <td v-if="selectable" class="px-4 py-3">
                <Checkbox
                  :checked="isRowSelected(item)"
                  @update:checked="toggleRowSelection(item)"
                />
              </td>
              <td v-for="column in columns" :key="column.key" class="px-4 py-3">
                <slot
                  :name="`cell-${column.key}`"
                  :item="item"
                  :value="getNestedValue(item, column.key)"
                  :column="column"
                >
                  <span v-if="column.type === 'badge'" :class="getBadgeClasses(getNestedValue(item, column.key))">
                    {{ formatValue(getNestedValue(item, column.key), column) }}
                  </span>
                  <span v-else>{{ formatValue(getNestedValue(item, column.key), column) }}</span>
                </slot>
              </td>
              <td v-if="actions.length > 0" class="px-4 py-3 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal class="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      v-for="action in actions"
                      :key="action.key"
                      @click="handleAction(action.key, item)"
                    >
                      <component :is="action.icon" v-if="action.icon" class="mr-2 h-4 w-4" />
                      {{ action.label }}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && !loading" class="flex items-center justify-between">
      <div class="text-sm text-gray-500">
        Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredData.length }} results
      </div>
      <div class="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          <ChevronLeft class="h-4 w-4" />
          Previous
        </Button>
        <div class="flex gap-1">
          <Button
            v-for="page in visiblePages"
            :key="page"
            :variant="page === currentPage ? 'default' : 'outline'"
            size="sm"
            @click="goToPage(page)"
          >
            {{ page }}
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          Next
          <ChevronRight class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  MoreHorizontal,
  Search,
} from 'lucide-vue-next';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import LoadingSpinner from './LoadingSpinner.vue';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'number' | 'date' | 'badge';
  format?: (value: any) => string;
}

interface Action {
  key: string;
  label: string;
  icon?: any;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

interface FilterOption {
  value: string;
  label: string;
}

interface Props {
  data: any[];
  columns: Column[];
  loading?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  selectable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  actions?: Action[];
  bulkActions?: Action[];
  filterOptions?: FilterOption[];
  rowKey?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  searchable: true,
  filterable: false,
  selectable: false,
  pagination: true,
  pageSize: 10,
  actions: () => [],
  bulkActions: () => [],
  filterOptions: () => [],
  rowKey: 'id',
});

const emit = defineEmits<{
  action: [key: string, item: any];
  bulkAction: [key: string, items: any[]];
  sort: [key: string, order: 'asc' | 'desc'];
  search: [query: string];
  filter: [value: string];
}>();

// State
const searchQuery = ref('');
const selectedFilter = ref('');
const sortBy = ref('');
const sortOrder = ref<'asc' | 'desc'>('asc');
const currentPage = ref(1);
const selectedRows = ref<any[]>([]);
const showBulkActions = ref(false);

// Computed
const totalColumns = computed(() => {
  let count = props.columns.length;
  if (props.selectable) count++;
  if (props.actions.length > 0) count++;
  return count;
});

const filteredData = computed(() => {
  let result = [...props.data];

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(item =>
      props.columns.some(column =>
        String(getNestedValue(item, column.key)).toLowerCase().includes(query)
      )
    );
  }

  // Apply filter
  if (selectedFilter.value) {
    // This is a basic implementation - you might want to customize based on your needs
    result = result.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(selectedFilter.value.toLowerCase())
      )
    );
  }

  // Apply sorting
  if (sortBy.value) {
    result.sort((a, b) => {
      const aValue = getNestedValue(a, sortBy.value);
      const bValue = getNestedValue(b, sortBy.value);
      
      if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return result;
});

const totalPages = computed(() => Math.ceil(filteredData.value.length / props.pageSize));

const startIndex = computed(() => (currentPage.value - 1) * props.pageSize);
const endIndex = computed(() => Math.min(startIndex.value + props.pageSize, filteredData.value.length));

const paginatedData = computed(() => {
  if (!props.pagination) return filteredData.value;
  return filteredData.value.slice(startIndex.value, endIndex.value);
});

const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, currentPage.value + 2);
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

const isAllSelected = computed(() => {
  return paginatedData.value.length > 0 && selectedRows.value.length === paginatedData.value.length;
});

const isIndeterminate = computed(() => {
  return selectedRows.value.length > 0 && selectedRows.value.length < paginatedData.value.length;
});

// Methods
const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

const getRowKey = (item: any, index: number) => {
  return getNestedValue(item, props.rowKey) || index;
};

const formatValue = (value: any, column: Column) => {
  if (column.format) return column.format(value);
  if (column.type === 'date' && value) {
    return new Date(value).toLocaleDateString();
  }
  return value;
};

const getBadgeClasses = (value: any) => {
  // Basic badge styling - customize based on your needs
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  if (typeof value === 'string') {
    switch (value.toLowerCase()) {
      case 'active':
      case 'published':
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'inactive':
      case 'draft':
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'archived':
      case 'deleted':
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }
  
  return `${baseClasses} bg-gray-100 text-gray-800`;
};

const handleSearch = () => {
  currentPage.value = 1;
  emit('search', searchQuery.value);
};

const handleFilter = () => {
  currentPage.value = 1;
  emit('filter', selectedFilter.value);
};

const handleSort = (key: string) => {
  if (sortBy.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = key;
    sortOrder.value = 'asc';
  }
  emit('sort', key, sortOrder.value);
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const isRowSelected = (item: any) => {
  return selectedRows.value.some(row => getRowKey(row, 0) === getRowKey(item, 0));
};

const toggleRowSelection = (item: any) => {
  const index = selectedRows.value.findIndex(row => getRowKey(row, 0) === getRowKey(item, 0));
  if (index > -1) {
    selectedRows.value.splice(index, 1);
  } else {
    selectedRows.value.push(item);
  }
};

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedRows.value = [];
  } else {
    selectedRows.value = [...paginatedData.value];
  }
};

const handleAction = (key: string, item: any) => {
  emit('action', key, item);
};

const handleBulkAction = (key: string) => {
  emit('bulkAction', key, selectedRows.value);
  selectedRows.value = [];
  showBulkActions.value = false;
};

// Watch for data changes to reset selection
watch(() => props.data, () => {
  selectedRows.value = [];
  currentPage.value = 1;
});
</script>