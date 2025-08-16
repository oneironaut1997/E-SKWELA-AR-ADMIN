<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { mockApi } from '@/services/mockApi';
import type { ARContent, CreateContentData, UpdateContentData, ContentType, Subject, GradeLevel } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import FileUpload from './FileUpload.vue';
import ContentPreview from './ContentPreview.vue';
import { 
  Save, 
  X, 
  AlertCircle, 
  CheckCircle,
  QrCode,
  Eye,
  FileText
} from 'lucide-vue-next';

interface Props {
  content?: ARContent;
  mode: 'create' | 'edit';
  loading?: boolean;
}

interface Emits {
  'submit': [data: CreateContentData | UpdateContentData];
  'cancel': [];
  'preview': [content: ARContent];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Form state
const formData = ref({
  title: '',
  description: '',
  subject: '' as Subject | '',
  gradeLevel: '' as GradeLevel | '',
  type: '' as ContentType | '',
  file: null as File | null
});

const errors = ref<Record<string, string>>({});
const isSubmitting = ref(false);
const showPreview = ref(false);

// Constants
const subjects: Subject[] = ['History', 'Science'];
const gradeLevels: GradeLevel[] = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];
const contentTypes = [
  { value: '3d_model' as ContentType, label: '3D Model', description: 'Interactive 3D models (.gltf, .glb)' },
  { value: 'audio' as ContentType, label: 'Audio File', description: 'Audio content (.mp3, .wav)' }
];

// Computed
const isEditMode = computed(() => props.mode === 'edit');
const isCreateMode = computed(() => props.mode === 'create');

const isFormValid = computed(() => {
  return formData.value.title.trim() &&
         formData.value.subject &&
         formData.value.gradeLevel &&
         formData.value.type &&
         (isEditMode.value || formData.value.file) &&
         Object.keys(errors.value).length === 0;
});

const generatedQRCode = computed(() => {
  if (!formData.value.subject || !formData.value.type) return '';
  const subjectCode = formData.value.subject.toUpperCase().substring(0, 4);
  const id = props.content?.id || 'NEW';
  return `ESK_${subjectCode}_${String(id).padStart(3, '0')}`;
});

const previewContent = computed((): ARContent | null => {
  if (!isFormValid.value) return null;
  
  return {
    id: props.content?.id || 0,
    title: formData.value.title,
    description: formData.value.description,
    subject: formData.value.subject as Subject,
    gradeLevel: formData.value.gradeLevel as GradeLevel,
    type: formData.value.type as ContentType,
    qrCode: generatedQRCode.value,
    thumbnail: props.content?.thumbnail || `/thumbnails/${formData.value.type}_preview.jpg`,
    fileUrl: props.content?.fileUrl || (formData.value.file ? URL.createObjectURL(formData.value.file) : ''),
    fileName: formData.value.file?.name || props.content?.fileName || '',
    fileSize: formData.value.file ? `${(formData.value.file.size / (1024 * 1024)).toFixed(1)}MB` : props.content?.fileSize || '0MB',
    createdAt: props.content?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: props.content?.status || 'active'
  };
});

// Validation
const validateField = (field: string, value: any) => {
  delete errors.value[field];
  
  switch (field) {
    case 'title':
      if (!value || value.trim().length < 3) {
        errors.value.title = 'Title must be at least 3 characters long';
      } else if (value.trim().length > 100) {
        errors.value.title = 'Title must be less than 100 characters';
      }
      break;
      
    case 'description':
      if (value && value.length > 500) {
        errors.value.description = 'Description must be less than 500 characters';
      }
      break;
      
    case 'subject':
      if (!value) {
        errors.value.subject = 'Subject is required';
      }
      break;
      
    case 'gradeLevel':
      if (!value) {
        errors.value.gradeLevel = 'Grade level is required';
      }
      break;
      
    case 'type':
      if (!value) {
        errors.value.type = 'Content type is required';
      }
      break;
      
    case 'file':
      if (isCreateMode.value && !value) {
        errors.value.file = 'File is required';
      }
      break;
  }
};

const validateForm = () => {
  errors.value = {};
  
  validateField('title', formData.value.title);
  validateField('description', formData.value.description);
  validateField('subject', formData.value.subject);
  validateField('gradeLevel', formData.value.gradeLevel);
  validateField('type', formData.value.type);
  validateField('file', formData.value.file);
  
  return Object.keys(errors.value).length === 0;
};

// Methods
const handleSubmit = async () => {
  if (!validateForm()) return;
  
  isSubmitting.value = true;
  
  try {
    const submitData = isEditMode.value 
      ? {
          title: formData.value.title,
          description: formData.value.description,
          subject: formData.value.subject as Subject,
          gradeLevel: formData.value.gradeLevel as GradeLevel,
          type: formData.value.type as ContentType,
          ...(formData.value.file && { file: formData.value.file })
        } as UpdateContentData
      : {
          title: formData.value.title,
          description: formData.value.description,
          subject: formData.value.subject as Subject,
          gradeLevel: formData.value.gradeLevel as GradeLevel,
          type: formData.value.type as ContentType,
          file: formData.value.file!
        } as CreateContentData;
    
    emit('submit', submitData);
  } catch (error) {
    console.error('Form submission error:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  emit('cancel');
};

const handleFileUpload = (file: File) => {
  formData.value.file = file;
  validateField('file', file);
};

const handleFileError = (error: string) => {
  errors.value.file = error;
};

const togglePreview = () => {
  if (previewContent.value) {
    showPreview.value = !showPreview.value;
    if (showPreview.value) {
      emit('preview', previewContent.value);
    }
  }
};

// Watchers
watch(() => formData.value.title, (value) => validateField('title', value));
watch(() => formData.value.description, (value) => validateField('description', value));
watch(() => formData.value.subject, (value) => validateField('subject', value));
watch(() => formData.value.gradeLevel, (value) => validateField('gradeLevel', value));
watch(() => formData.value.type, (value) => {
  validateField('type', value);
  // Clear file when type changes to ensure compatibility
  if (formData.value.file && value) {
    const fileExtension = '.' + formData.value.file.name.split('.').pop()?.toLowerCase();
    const allowedTypes = {
      '3d_model': ['.gltf', '.glb'],
      'audio': ['.mp3', '.wav']
    };
    
    if (!allowedTypes[value].includes(fileExtension)) {
      formData.value.file = null;
      errors.value.file = `File type not compatible with ${value === '3d_model' ? '3D Model' : 'Audio'} content`;
    }
  }
});

// Lifecycle
onMounted(() => {
  if (props.content) {
    formData.value = {
      title: props.content.title,
      description: props.content.description || '',
      subject: props.content.subject,
      gradeLevel: props.content.gradeLevel,
      type: props.content.type,
      file: null // File is not pre-populated in edit mode
    };
  }
});
</script>

<template>
  <div class="space-y-6">
    <!-- Form Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold">
          {{ isEditMode ? 'Edit Content' : 'Create New Content' }}
        </h2>
        <p class="text-muted-foreground">
          {{ isEditMode ? 'Update your AR content details' : 'Add new AR content to your library' }}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <Button 
          v-if="previewContent" 
          variant="outline" 
          @click="togglePreview"
          :disabled="!isFormValid"
        >
          <Eye class="h-4 w-4 mr-2" />
          {{ showPreview ? 'Hide Preview' : 'Preview' }}
        </Button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Form Section -->
      <div class="space-y-6">
        <!-- Basic Information -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <FileText class="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Provide the basic details for your AR content
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <!-- Title -->
            <div class="space-y-2">
              <Label for="title">Title *</Label>
              <Input
                id="title"
                v-model="formData.title"
                placeholder="Enter content title"
                :class="{ 'border-red-500': errors.title }"
              />
              <div v-if="errors.title" class="flex items-center gap-1 text-sm text-red-600">
                <AlertCircle class="h-3 w-3" />
                {{ errors.title }}
              </div>
            </div>

            <!-- Description -->
            <div class="space-y-2">
              <Label for="description">Description</Label>
              <textarea
                id="description"
                v-model="formData.description"
                placeholder="Enter content description (optional)"
                rows="3"
                class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                :class="{ 'border-red-500': errors.description }"
              />
              <div v-if="errors.description" class="flex items-center gap-1 text-sm text-red-600">
                <AlertCircle class="h-3 w-3" />
                {{ errors.description }}
              </div>
              <div class="text-xs text-muted-foreground">
                {{ formData.description.length }}/500 characters
              </div>
            </div>

            <!-- Subject -->
            <div class="space-y-2">
              <Label for="subject">Subject *</Label>
              <Select v-model="formData.subject">
                <SelectTrigger :class="{ 'border-red-500': errors.subject }">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="subject in subjects" :key="subject" :value="subject">
                    {{ subject }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <div v-if="errors.subject" class="flex items-center gap-1 text-sm text-red-600">
                <AlertCircle class="h-3 w-3" />
                {{ errors.subject }}
              </div>
            </div>

            <!-- Grade Level -->
            <div class="space-y-2">
              <Label for="gradeLevel">Grade Level *</Label>
              <Select v-model="formData.gradeLevel">
                <SelectTrigger :class="{ 'border-red-500': errors.gradeLevel }">
                  <SelectValue placeholder="Select grade level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="grade in gradeLevels" :key="grade" :value="grade">
                    {{ grade }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <div v-if="errors.gradeLevel" class="flex items-center gap-1 text-sm text-red-600">
                <AlertCircle class="h-3 w-3" />
                {{ errors.gradeLevel }}
              </div>
            </div>

            <!-- Content Type -->
            <div class="space-y-2">
              <Label for="type">Content Type *</Label>
              <Select v-model="formData.type">
                <SelectTrigger :class="{ 'border-red-500': errors.type }">
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="type in contentTypes" :key="type.value" :value="type.value">
                    <div>
                      <div class="font-medium">{{ type.label }}</div>
                      <div class="text-xs text-muted-foreground">{{ type.description }}</div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <div v-if="errors.type" class="flex items-center gap-1 text-sm text-red-600">
                <AlertCircle class="h-3 w-3" />
                {{ errors.type }}
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- File Upload -->
        <Card>
          <CardHeader>
            <CardTitle>File Upload</CardTitle>
            <CardDescription>
              {{ isEditMode ? 'Upload a new file to replace the current one (optional)' : 'Upload your AR content file' }}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUpload
              v-model="formData.file"
              :content-type="formData.type as ContentType"
              :max-size="100"
              @upload-complete="handleFileUpload"
              @upload-error="handleFileError"
            />
            <div v-if="errors.file" class="flex items-center gap-1 text-sm text-red-600 mt-2">
              <AlertCircle class="h-3 w-3" />
              {{ errors.file }}
            </div>
          </CardContent>
        </Card>

        <!-- QR Code Preview -->
        <Card v-if="generatedQRCode">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <QrCode class="h-5 w-5" />
              QR Code Preview
            </CardTitle>
            <CardDescription>
              This QR code will be generated for your content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <div class="font-medium">QR Code</div>
                <code class="text-sm bg-muted px-2 py-1 rounded">{{ generatedQRCode }}</code>
              </div>
              <Badge variant="outline">Auto-generated</Badge>
            </div>
          </CardContent>
        </Card>

        <!-- Form Actions -->
        <div class="flex items-center gap-3">
          <Button 
            @click="handleSubmit" 
            :disabled="!isFormValid || isSubmitting || props.loading"
            class="flex-1"
          >
            <Save class="h-4 w-4 mr-2" />
            {{ isSubmitting || props.loading ? 'Saving...' : (isEditMode ? 'Update Content' : 'Create Content') }}
          </Button>
          <Button variant="outline" @click="handleCancel" :disabled="isSubmitting || props.loading">
            <X class="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </div>

      <!-- Preview Section -->
      <div v-if="showPreview && previewContent" class="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Eye class="h-5 w-5" />
              Live Preview
            </CardTitle>
            <CardDescription>
              Preview how your content will appear
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContentPreview :content="previewContent" :compact="true" />
          </CardContent>
        </Card>
      </div>

      <!-- Form Status -->
      <div v-else class="flex items-center justify-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
        <div class="text-center">
          <div v-if="!isFormValid" class="space-y-2">
            <AlertCircle class="h-8 w-8 text-muted-foreground mx-auto" />
            <div class="text-sm text-muted-foreground">
              Complete the form to see preview
            </div>
          </div>
          <div v-else class="space-y-2">
            <CheckCircle class="h-8 w-8 text-green-600 mx-auto" />
            <div class="text-sm text-green-600">
              Form is ready for submission
            </div>
            <Button variant="outline" size="sm" @click="togglePreview">
              <Eye class="h-4 w-4 mr-2" />
              Show Preview
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>