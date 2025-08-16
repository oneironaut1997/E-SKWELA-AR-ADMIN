<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { mockApi } from '@/services/mockApi';
import type { UploadProgress, ContentType } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  File, 
  X, 
  CheckCircle, 
  AlertCircle,
  Box,
  Volume2
} from 'lucide-vue-next';

interface Props {
  contentType?: ContentType;
  accept?: string;
  maxSize?: number; // in MB
  disabled?: boolean;
  modelValue?: File | null;
}

interface Emits {
  'update:modelValue': [file: File | null];
  'upload-complete': [file: File];
  'upload-error': [error: string];
}

const props = withDefaults(defineProps<Props>(), {
  maxSize: 100, // 100MB default
  accept: '*'
});

const emit = defineEmits<Emits>();

// State
const isDragOver = ref(false);
const isUploading = ref(false);
const uploadProgress = ref<UploadProgress>({
  progress: 0,
  status: 'uploading'
});
const uploadError = ref<string | null>(null);
const fileInputRef = ref<HTMLInputElement>();

// Computed
const acceptedTypes = computed(() => {
  if (props.contentType === '3d_model') {
    return '.gltf,.glb';
  } else if (props.contentType === 'audio') {
    return '.mp3,.wav';
  }
  return props.accept;
});

const allowedExtensions = computed(() => {
  if (props.contentType === '3d_model') {
    return ['.gltf', '.glb'];
  } else if (props.contentType === 'audio') {
    return ['.mp3', '.wav'];
  }
  return [];
});

const maxSizeBytes = computed(() => props.maxSize * 1024 * 1024);

const hasFile = computed(() => !!props.modelValue);

const fileIcon = computed(() => {
  if (!props.modelValue) return File;
  
  const extension = '.' + props.modelValue.name.split('.').pop()?.toLowerCase();
  if (['.gltf', '.glb'].includes(extension)) return Box;
  if (['.mp3', '.wav'].includes(extension)) return Volume2;
  return File;
});

// Methods
const validateFile = (file: File): string | null => {
  // Check file size
  if (file.size > maxSizeBytes.value) {
    return `File size must be less than ${props.maxSize}MB`;
  }
  
  // Check file type if contentType is specified
  if (allowedExtensions.value.length > 0) {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.value.includes(extension)) {
      return `Invalid file type. Expected ${allowedExtensions.value.join(' or ')}`;
    }
  }
  
  return null;
};

const handleFileSelect = async (file: File) => {
  uploadError.value = null;
  
  // Validate file
  const validationError = validateFile(file);
  if (validationError) {
    uploadError.value = validationError;
    return;
  }
  
  // Start upload simulation
  isUploading.value = true;
  uploadProgress.value = { progress: 0, status: 'uploading' };
  
  try {
    // Simulate file upload with progress
    const response = await mockApi.uploadFile(file, (progress) => {
      uploadProgress.value = { progress, status: 'uploading' };
    });
    
    if (response.success) {
      uploadProgress.value = { progress: 100, status: 'completed' };
      emit('update:modelValue', file);
      emit('upload-complete', file);
    } else {
      throw new Error(response.message || 'Upload failed');
    }
  } catch (error) {
    uploadProgress.value = { 
      progress: 0, 
      status: 'error', 
      message: error instanceof Error ? error.message : 'Upload failed' 
    };
    uploadError.value = error instanceof Error ? error.message : 'Upload failed';
    emit('upload-error', uploadError.value);
  } finally {
    isUploading.value = false;
  }
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = false;
  
  if (props.disabled || isUploading.value) return;
  
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    handleFileSelect(files[0]);
  }
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  if (!props.disabled && !isUploading.value) {
    isDragOver.value = true;
  }
};

const handleDragLeave = () => {
  isDragOver.value = false;
};

const handleFileInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  
  if (files && files.length > 0) {
    handleFileSelect(files[0]);
  }
  
  // Reset input value to allow selecting the same file again
  target.value = '';
};

const openFileDialog = () => {
  if (!props.disabled && !isUploading.value) {
    fileInputRef.value?.click();
  }
};

const removeFile = () => {
  if (!props.disabled && !isUploading.value) {
    emit('update:modelValue', null);
    uploadError.value = null;
    uploadProgress.value = { progress: 0, status: 'uploading' };
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Watch for external file changes
watch(() => props.modelValue, (newFile) => {
  if (!newFile) {
    uploadProgress.value = { progress: 0, status: 'uploading' };
    uploadError.value = null;
  }
});
</script>

<template>
  <div class="space-y-4">
    <!-- Upload Area -->
    <div
      class="relative border-2 border-dashed rounded-lg transition-colors"
      :class="{
        'border-primary bg-primary/5': isDragOver,
        'border-muted-foreground/25': !isDragOver && !hasFile,
        'border-green-500 bg-green-50': hasFile && !uploadError && !isUploading,
        'border-red-500 bg-red-50': uploadError,
        'border-blue-500 bg-blue-50': isUploading,
        'opacity-50 cursor-not-allowed': disabled
      }"
      @drop="handleDrop"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
    >
      <input
        ref="fileInputRef"
        type="file"
        :accept="acceptedTypes"
        :disabled="disabled || isUploading"
        class="hidden"
        @change="handleFileInputChange"
      />
      
      <!-- Upload Content -->
      <div class="p-8 text-center">
        <!-- No File State -->
        <div v-if="!hasFile && !isUploading" class="space-y-4">
          <Upload class="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h3 class="text-lg font-medium">Upload {{ contentType === '3d_model' ? '3D Model' : contentType === 'audio' ? 'Audio File' : 'File' }}</h3>
            <p class="text-sm text-muted-foreground mt-1">
              Drag and drop your file here, or 
              <button 
                type="button"
                class="text-primary hover:underline"
                @click="openFileDialog"
                :disabled="disabled"
              >
                browse
              </button>
            </p>
            <div class="text-xs text-muted-foreground mt-2 space-y-1">
              <div v-if="allowedExtensions.length > 0">
                Supported formats: {{ allowedExtensions.join(', ') }}
              </div>
              <div>Maximum file size: {{ maxSize }}MB</div>
            </div>
          </div>
        </div>
        
        <!-- Uploading State -->
        <div v-else-if="isUploading" class="space-y-4">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <div>
            <h3 class="text-lg font-medium">Uploading...</h3>
            <div class="w-full bg-muted rounded-full h-2 mt-2">
              <div 
                class="bg-primary h-2 rounded-full transition-all duration-300"
                :style="{ width: `${uploadProgress.progress}%` }"
              ></div>
            </div>
            <p class="text-sm text-muted-foreground mt-1">
              {{ uploadProgress.progress }}% complete
            </p>
          </div>
        </div>
        
        <!-- File Selected State -->
        <div v-else-if="hasFile" class="space-y-4">
          <component :is="fileIcon" class="h-12 w-12 text-green-600 mx-auto" />
          <div>
            <h3 class="text-lg font-medium text-green-700">File Ready</h3>
            <p class="text-sm text-muted-foreground">{{ modelValue?.name }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- File Details Card -->
    <Card v-if="hasFile && !isUploading" class="border-green-200">
      <CardContent class="p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <component :is="fileIcon" class="h-8 w-8 text-green-600" />
            <div>
              <div class="font-medium">{{ modelValue?.name }}</div>
              <div class="text-sm text-muted-foreground">
                {{ formatFileSize(modelValue?.size || 0) }}
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <Badge variant="success" class="gap-1">
              <CheckCircle class="h-3 w-3" />
              Ready
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              @click="removeFile"
              :disabled="disabled"
            >
              <X class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
    
    <!-- Error State -->
    <Card v-if="uploadError" class="border-red-200 bg-red-50">
      <CardContent class="p-4">
        <div class="flex items-center gap-3">
          <AlertCircle class="h-5 w-5 text-red-600" />
          <div>
            <div class="font-medium text-red-700">Upload Error</div>
            <div class="text-sm text-red-600">{{ uploadError }}</div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          class="mt-3"
          @click="openFileDialog"
          :disabled="disabled"
        >
          Try Again
        </Button>
      </CardContent>
    </Card>
    
    <!-- Upload Instructions -->
    <div v-if="!hasFile && !isUploading" class="text-xs text-muted-foreground">
      <div class="flex items-center gap-4 justify-center">
        <div v-if="contentType === '3d_model'" class="flex items-center gap-1">
          <Box class="h-3 w-3" />
          3D Models (.gltf, .glb)
        </div>
        <div v-else-if="contentType === 'audio'" class="flex items-center gap-1">
          <Volume2 class="h-3 w-3" />
          Audio Files (.mp3, .wav)
        </div>
        <div class="flex items-center gap-1">
          Max {{ maxSize }}MB
        </div>
      </div>
    </div>
  </div>
</template>