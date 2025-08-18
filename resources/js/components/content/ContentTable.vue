<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { mockApi } from '@/services/mockApi';
import type { ARContent, ContentFilters, ContentViewMode } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Eye, 
  Edit, 
  Trash2, 
  Download,
  QrCode,
  Box,
  Volume2
} from 'lucide-vue-next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Props {
  onEdit?: (content: ARContent) => void;
  onDelete?: (content: ARContent) => void;
  onPreview?: (content: ARContent) => void;
}

const props = defineProps<Props>();

// Reactive state
const content = ref<ARContent[]>([]);
const loading = ref(false);
const viewMode = ref<ContentViewMode>('grid');
const currentPage = ref(1);
const totalItems = ref(0);
const perPage = ref(12);

// Filters
const filters = ref<ContentFilters>({
  search: '',
  subject: undefined,
  gradeLevel: undefined,
  type: undefined,
  status: 'active',
  sortBy: 'createdAt',
  sortOrder: 'desc'
});

// Constants
const subjects = ['History', 'Science'];
const gradeLevels = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];
const contentTypes = [
  { value: '3d_model', label: '3D Model' },
  { value: 'audio', label: 'Audio' }
];
const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
];

// Computed
const totalPages = computed(() => Math.ceil(totalItems.value / perPage.value));

const hasFilters = computed(() => {
  return filters.value.search || 
         filters.value.subject || 
         filters.value.gradeLevel || 
         filters.value.type ||
         filters.value.status !== 'active';
});

// Methods
const fetchContent = async () => {
  loading.value = true;
  try {
    const params = {
      ...filters.value,
      page: currentPage.value,
      per_page: perPage.value
    };
    
    const response = await mockApi.getContent(params);
    if (response.success) {
      content.value = response.data;
      totalItems.value = response.pagination?.total || 0;
    }
  } catch (error) {
    console.error('Error fetching content:', error);
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  currentPage.value = 1;
  fetchContent();
};

const handleFilterChange = () => {
  currentPage.value = 1;
  fetchContent();
};

const clearFilters = () => {
  filters.value = {
    search: '',
    subject: undefined,
    gradeLevel: undefined,
    type: undefined,
    status: 'active',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  };
  currentPage.value = 1;
  fetchContent();
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchContent();
};

const getContentTypeIcon = (type: string) => {
  return type === '3d_model' ? Box : Volume2;
};

const getContentTypeBadge = (type: string) => {
  return type === '3d_model' ? '3D Model' : 'Audio';
};

const getStatusBadge = (status: string) => {
  return status === 'active' ? 'success' : 'secondary';
};

const formatFileSize = (size: string) => {
  return size;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

// Lifecycle
onMounted(() => {
  fetchContent();
});
</script>

<template>
  <div class="space-y-6 flex h-full flex-1 flex-col gap-6 rounded-xl p-4 overflow-x-auto">
    <!-- Header with Search and Filters -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex flex-1 items-center gap-2">
        <div class="relative flex-1 max-w-sm">
          <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            v-model="filters.search"
            placeholder="Search content..."
            class="pl-9"
            @keyup.enter="handleSearch"
          />
        </div>
        <Button @click="handleSearch" size="sm">
          Search
        </Button>
      </div>
      
      <div class="flex items-center gap-2">
        <!-- View Mode Toggle -->
        <div class="flex items-center rounded-md border">
          <Button
            variant="ghost"
            size="sm"
            :class="{ 'bg-muted': viewMode === 'grid' }"
            @click="viewMode = 'grid'"
          >
            <Grid3X3 class="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            :class="{ 'bg-muted': viewMode === 'table' }"
            @click="viewMode = 'table'"
          >
            <List class="h-4 w-4" />
          </Button>
        </div>
        
        <!-- Filters Dropdown -->
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline" size="sm">
              <Filter class="h-4 w-4 mr-2" />
              Filters
              <Badge v-if="hasFilters" variant="secondary" class="ml-2">
                {{ Object.values(filters).filter(v => v && v !== 'active').length }}
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-80 p-4">
            <div class="space-y-4">
              <!-- Subject Filter -->
              <div>
                <label class="text-sm font-medium">Subject</label>
                <Select v-model="filters.subject" @update:model-value="handleFilterChange">
                  <SelectTrigger>
                    <SelectValue placeholder="All subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All subjects</SelectItem>
                    <SelectItem v-for="subject in subjects" :key="subject" :value="subject">
                      {{ subject }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <!-- Grade Level Filter -->
              <div>
                <label class="text-sm font-medium">Grade Level</label>
                <Select v-model="filters.gradeLevel" @update:model-value="handleFilterChange">
                  <SelectTrigger>
                    <SelectValue placeholder="All grades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All grades</SelectItem>
                    <SelectItem v-for="grade in gradeLevels" :key="grade" :value="grade">
                      {{ grade }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <!-- Content Type Filter -->
              <div>
                <label class="text-sm font-medium">Content Type</label>
                <Select v-model="filters.type" @update:model-value="handleFilterChange">
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All types</SelectItem>
                    <SelectItem v-for="type in contentTypes" :key="type.value" :value="type.value">
                      {{ type.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <!-- Status Filter -->
              <div>
                <label class="text-sm font-medium">Status</label>
                <Select v-model="filters.status" @update:model-value="handleFilterChange">
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="status in statusOptions" :key="status.value" :value="status.value">
                      {{ status.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button @click="clearFilters" variant="outline" size="sm" class="w-full">
                Clear Filters
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p class="text-muted-foreground">Loading content...</p>
      </div>
    </div>

    <!-- Grid View -->
    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <Card v-for="item in content" :key="item.id" class="group hover:shadow-md transition-shadow">
        <CardHeader class="pb-3">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-2">
              <component :is="getContentTypeIcon(item.type)" class="h-5 w-5 text-muted-foreground" />
              <Badge :variant="getStatusBadge(item.status)">
                {{ item.status }}
              </Badge>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" size="sm" class="opacity-0 group-hover:opacity-100 transition-opacity">
                  <span class="sr-only">Actions</span>
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem @click="props.onPreview?.(item)">
                  <Eye class="h-4 w-4 mr-2" />
                  Preview
                </DropdownMenuItem>
                <DropdownMenuItem @click="props.onEdit?.(item)">
                  <Edit class="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <QrCode class="h-4 w-4 mr-2" />
                  QR Code
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download class="h-4 w-4 mr-2" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem @click="props.onDelete?.(item)" class="text-destructive">
                  <Trash2 class="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardTitle class="text-lg line-clamp-2">{{ item.title }}</CardTitle>
          <CardDescription class="line-clamp-2">
            {{ item.description || 'No description available' }}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <!-- Thumbnail -->
            <div class="aspect-video bg-muted rounded-md flex items-center justify-center">
              <component :is="getContentTypeIcon(item.type)" class="h-8 w-8 text-muted-foreground" />
            </div>
            
            <!-- Metadata -->
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-muted-foreground">Subject:</span>
                <Badge variant="outline">{{ item.subject }}</Badge>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Grade:</span>
                <span>{{ item.gradeLevel }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Type:</span>
                <Badge variant="secondary">{{ getContentTypeBadge(item.type) }}</Badge>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Size:</span>
                <span>{{ formatFileSize(item.fileSize) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">QR Code:</span>
                <code class="text-xs bg-muted px-1 rounded">{{ item.qrCode }}</code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Table View -->
    <div v-else class="border rounded-lg">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="border-b bg-muted/50">
            <tr>
              <th class="text-left p-4 font-medium">Content</th>
              <th class="text-left p-4 font-medium">Subject</th>
              <th class="text-left p-4 font-medium">Grade</th>
              <th class="text-left p-4 font-medium">Type</th>
              <th class="text-left p-4 font-medium">Size</th>
              <th class="text-left p-4 font-medium">QR Code</th>
              <th class="text-left p-4 font-medium">Status</th>
              <th class="text-left p-4 font-medium">Created</th>
              <th class="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in content" :key="item.id" class="border-b hover:bg-muted/50">
              <td class="p-4">
                <div class="flex items-center gap-3">
                  <component :is="getContentTypeIcon(item.type)" class="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div class="font-medium">{{ item.title }}</div>
                    <div class="text-sm text-muted-foreground line-clamp-1">
                      {{ item.description || 'No description' }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="p-4">
                <Badge variant="outline">{{ item.subject }}</Badge>
              </td>
              <td class="p-4">{{ item.gradeLevel }}</td>
              <td class="p-4">
                <Badge variant="secondary">{{ getContentTypeBadge(item.type) }}</Badge>
              </td>
              <td class="p-4">{{ formatFileSize(item.fileSize) }}</td>
              <td class="p-4">
                <code class="text-xs bg-muted px-2 py-1 rounded">{{ item.qrCode }}</code>
              </td>
              <td class="p-4">
                <Badge :variant="getStatusBadge(item.status)">{{ item.status }}</Badge>
              </td>
              <td class="p-4 text-sm text-muted-foreground">
                {{ formatDate(item.createdAt) }}
              </td>
              <td class="p-4">
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="sm">
                      <span class="sr-only">Actions</span>
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem @click="props.onPreview?.(item)">
                      <Eye class="h-4 w-4 mr-2" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="props.onEdit?.(item)">
                      <Edit class="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <QrCode class="h-4 w-4 mr-2" />
                      QR Code
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download class="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="props.onDelete?.(item)" class="text-destructive">
                      <Trash2 class="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && content.length === 0" class="text-center py-12">
      <Box class="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 class="text-lg font-medium mb-2">No content found</h3>
      <p class="text-muted-foreground mb-4">
        {{ hasFilters ? 'Try adjusting your filters' : 'Get started by creating your first AR content' }}
      </p>
      <Button v-if="hasFilters" @click="clearFilters" variant="outline">
        Clear Filters
      </Button>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-between">
      <div class="text-sm text-muted-foreground">
        Showing {{ ((currentPage - 1) * perPage) + 1 }} to {{ Math.min(currentPage * perPage, totalItems) }} of {{ totalItems }} results
      </div>
      <div class="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="currentPage === 1"
          @click="handlePageChange(currentPage - 1)"
        >
          Previous
        </Button>
        <div class="flex items-center gap-1">
          <Button
            v-for="page in Math.min(totalPages, 5)"
            :key="page"
            variant="outline"
            size="sm"
            :class="{ 'bg-primary text-primary-foreground': page === currentPage }"
            @click="handlePageChange(page)"
          >
            {{ page }}
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          :disabled="currentPage === totalPages"
          @click="handlePageChange(currentPage + 1)"
        >
          Next
        </Button>
      </div>
    </div>
  </div>
</template>