<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { ARContent } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Move3D,
  Box,
  QrCode,
  Download,
  ExternalLink,
  Clock,
  FileText
} from 'lucide-vue-next';

interface Props {
  content: ARContent;
  showMetadata?: boolean;
  compact?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showMetadata: true,
  compact: false
});

// 3D Model Viewer State
const modelViewerState = ref({
  isLoading: true,
  rotation: { x: 0, y: 0, z: 0 },
  zoom: 1,
  position: { x: 0, y: 0 },
  wireframe: false,
  autoRotate: false
});

// Audio Player State
const audioPlayerState = ref({
  isPlaying: false,
  currentTime: 0,
  duration: 180, // Mock 3 minutes
  volume: 0.8,
  isMuted: false,
  isLoading: false
});

// Computed
const isAudio = computed(() => props.content.type === 'audio');
const is3DModel = computed(() => props.content.type === '3d_model');

const formattedDuration = computed(() => {
  const minutes = Math.floor(audioPlayerState.value.duration / 60);
  const seconds = audioPlayerState.value.duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

const formattedCurrentTime = computed(() => {
  const minutes = Math.floor(audioPlayerState.value.currentTime / 60);
  const seconds = Math.floor(audioPlayerState.value.currentTime % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

const progressPercentage = computed(() => {
  return (audioPlayerState.value.currentTime / audioPlayerState.value.duration) * 100;
});

// 3D Model Methods
const resetModelView = () => {
  modelViewerState.value.rotation = { x: 0, y: 0, z: 0 };
  modelViewerState.value.zoom = 1;
  modelViewerState.value.position = { x: 0, y: 0 };
};

const zoomIn = () => {
  modelViewerState.value.zoom = Math.min(modelViewerState.value.zoom + 0.2, 3);
};

const zoomOut = () => {
  modelViewerState.value.zoom = Math.max(modelViewerState.value.zoom - 0.2, 0.5);
};

const toggleAutoRotate = () => {
  modelViewerState.value.autoRotate = !modelViewerState.value.autoRotate;
};

const toggleWireframe = () => {
  modelViewerState.value.wireframe = !modelViewerState.value.wireframe;
};

// Audio Player Methods
const togglePlayPause = () => {
  audioPlayerState.value.isPlaying = !audioPlayerState.value.isPlaying;
  
  if (audioPlayerState.value.isPlaying) {
    // Simulate audio playback
    const interval = setInterval(() => {
      if (audioPlayerState.value.isPlaying && audioPlayerState.value.currentTime < audioPlayerState.value.duration) {
        audioPlayerState.value.currentTime += 1;
      } else {
        clearInterval(interval);
        audioPlayerState.value.isPlaying = false;
      }
    }, 1000);
  }
};

const seekTo = (percentage: number) => {
  audioPlayerState.value.currentTime = (percentage / 100) * audioPlayerState.value.duration;
};

const toggleMute = () => {
  audioPlayerState.value.isMuted = !audioPlayerState.value.isMuted;
};

const setVolume = (volume: number) => {
  audioPlayerState.value.volume = Math.max(0, Math.min(1, volume));
  if (volume > 0) {
    audioPlayerState.value.isMuted = false;
  }
};

const formatFileSize = (size: string) => {
  return size;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

// Lifecycle
onMounted(() => {
  // Simulate loading delay
  setTimeout(() => {
    modelViewerState.value.isLoading = false;
  }, 1500);
});
</script>

<template>
  <div class="space-y-6 flex h-full flex-1 flex-col gap-6 rounded-xl p-4 overflow-x-auto">
    <!-- Preview Area -->
    <Card>
      <CardHeader v-if="!compact">
        <div class="flex items-center justify-between">
          <div>
            <CardTitle class="flex items-center gap-2">
              <component :is="is3DModel ? Box : Volume2" class="h-5 w-5" />
              {{ content.title }}
            </CardTitle>
            <CardDescription>
              {{ content.description || 'No description available' }}
            </CardDescription>
          </div>
          <div class="flex items-center gap-2">
            <Badge variant="outline">{{ content.subject }}</Badge>
            <Badge variant="secondary">{{ content.gradeLevel }}</Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent class="p-6">
        <!-- 3D Model Viewer -->
        <div v-if="is3DModel" class="space-y-4">
          <!-- Viewer Container -->
          <div class="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border-2 border-dashed border-slate-200 aspect-video flex items-center justify-center">
            <!-- Loading State -->
            <div v-if="modelViewerState.isLoading" class="text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p class="text-muted-foreground">Loading 3D model...</p>
            </div>
            
            <!-- Mock 3D Model Display -->
            <div v-else class="text-center">
              <div class="relative">
                <!-- Mock 3D Object -->
                <div 
                  class="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg shadow-lg transform transition-transform duration-300"
                  :style="{
                    transform: `scale(${modelViewerState.zoom}) rotateX(${modelViewerState.rotation.x}deg) rotateY(${modelViewerState.rotation.y}deg) rotateZ(${modelViewerState.rotation.z}deg)`,
                    filter: modelViewerState.wireframe ? 'contrast(2) brightness(0.8)' : 'none'
                  }"
                  :class="{
                    'animate-spin': modelViewerState.autoRotate,
                    'border-2 border-white': modelViewerState.wireframe
                  }"
                >
                  <div class="absolute inset-2 bg-white/20 rounded"></div>
                  <div class="absolute top-4 left-4 w-4 h-4 bg-white/40 rounded-full"></div>
                  <div class="absolute bottom-4 right-4 w-6 h-6 bg-white/30 rounded"></div>
                </div>
                
                <!-- Model Info -->
                <div class="text-sm text-muted-foreground">
                  <div>{{ content.fileName || 'model.glb' }}</div>
                  <div>{{ formatFileSize(content.fileSize) }}</div>
                </div>
              </div>
            </div>
            
            <!-- Viewer Controls Overlay -->
            <div v-if="!modelViewerState.isLoading" class="absolute top-4 right-4 flex flex-col gap-2">
              <Button size="sm" variant="secondary" @click="resetModelView">
                <RotateCcw class="h-4 w-4" />
              </Button>
              <Button size="sm" variant="secondary" @click="toggleAutoRotate">
                <Move3D class="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <!-- 3D Model Controls -->
          <div class="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div class="flex items-center gap-2">
              <Button size="sm" variant="outline" @click="zoomOut">
                <ZoomOut class="h-4 w-4" />
              </Button>
              <span class="text-sm font-mono">{{ Math.round(modelViewerState.zoom * 100) }}%</span>
              <Button size="sm" variant="outline" @click="zoomIn">
                <ZoomIn class="h-4 w-4" />
              </Button>
            </div>
            
            <div class="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                @click="toggleWireframe"
                :class="{ 'bg-primary text-primary-foreground': modelViewerState.wireframe }"
              >
                Wireframe
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                @click="toggleAutoRotate"
                :class="{ 'bg-primary text-primary-foreground': modelViewerState.autoRotate }"
              >
                Auto Rotate
              </Button>
              <Button size="sm" variant="outline" @click="resetModelView">
                Reset View
              </Button>
            </div>
          </div>
        </div>
        
        <!-- Audio Player -->
        <div v-if="isAudio" class="space-y-4">
          <!-- Audio Visualizer -->
          <div class="relative bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-dashed border-slate-200 aspect-video flex items-center justify-center">
            <div class="text-center">
              <!-- Mock Audio Visualizer -->
              <div class="flex items-end justify-center gap-1 mb-4">
                <div 
                  v-for="i in 20" 
                  :key="i"
                  class="bg-gradient-to-t from-green-500 to-blue-500 rounded-sm transition-all duration-300"
                  :class="{
                    'animate-pulse': audioPlayerState.isPlaying
                  }"
                  :style="{
                    width: '4px',
                    height: `${Math.random() * 40 + 10}px`
                  }"
                ></div>
              </div>
              
              <!-- Audio Info -->
              <div class="text-sm text-muted-foreground">
                <div class="flex items-center justify-center gap-2 mb-2">
                  <Volume2 class="h-4 w-4" />
                  {{ content.fileName || 'audio.mp3' }}
                </div>
                <div>{{ formatFileSize(content.fileSize) }} • {{ formattedDuration }}</div>
              </div>
            </div>
          </div>
          
          <!-- Audio Controls -->
          <div class="p-4 bg-muted/50 rounded-lg space-y-4">
            <!-- Progress Bar -->
            <div class="space-y-2">
              <div class="flex justify-between text-sm text-muted-foreground">
                <span>{{ formattedCurrentTime }}</span>
                <span>{{ formattedDuration }}</span>
              </div>
              <div 
                class="w-full bg-muted rounded-full h-2 cursor-pointer"
                @click="seekTo(($event.offsetX / $event.currentTarget.offsetWidth) * 100)"
              >
                <div 
                  class="bg-primary h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${progressPercentage}%` }"
                ></div>
              </div>
            </div>
            
            <!-- Playback Controls -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Button size="sm" @click="togglePlayPause">
                  <component :is="audioPlayerState.isPlaying ? Pause : Play" class="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" @click="toggleMute">
                  <component :is="audioPlayerState.isMuted ? VolumeX : Volume2" class="h-4 w-4" />
                </Button>
                <div class="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    :value="audioPlayerState.isMuted ? 0 : audioPlayerState.volume"
                    @input="setVolume(parseFloat(($event.target as HTMLInputElement).value))"
                    class="w-20"
                  />
                  <span class="text-sm text-muted-foreground w-8">
                    {{ Math.round((audioPlayerState.isMuted ? 0 : audioPlayerState.volume) * 100) }}%
                  </span>
                </div>
              </div>
              
              <div class="text-sm text-muted-foreground">
                {{ audioPlayerState.isPlaying ? 'Playing' : 'Paused' }}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    
    <!-- Metadata Panel -->
    <Card v-if="showMetadata">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <FileText class="h-5 w-5" />
          Content Details
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Basic Info -->
          <div class="space-y-3">
            <div>
              <label class="text-sm font-medium text-muted-foreground">Title</label>
              <div class="font-medium">{{ content.title }}</div>
            </div>
            <div>
              <label class="text-sm font-medium text-muted-foreground">Description</label>
              <div class="text-sm">{{ content.description || 'No description provided' }}</div>
            </div>
            <div>
              <label class="text-sm font-medium text-muted-foreground">Subject</label>
              <Badge variant="outline">{{ content.subject }}</Badge>
            </div>
            <div>
              <label class="text-sm font-medium text-muted-foreground">Grade Level</label>
              <Badge variant="secondary">{{ content.gradeLevel }}</Badge>
            </div>
          </div>
          
          <!-- Technical Info -->
          <div class="space-y-3">
            <div>
              <label class="text-sm font-medium text-muted-foreground">Content Type</label>
              <div class="flex items-center gap-2">
                <component :is="is3DModel ? Box : Volume2" class="h-4 w-4" />
                <span>{{ is3DModel ? '3D Model' : 'Audio File' }}</span>
              </div>
            </div>
            <div>
              <label class="text-sm font-medium text-muted-foreground">File Size</label>
              <div>{{ formatFileSize(content.fileSize) }}</div>
            </div>
            <div>
              <label class="text-sm font-medium text-muted-foreground">QR Code</label>
              <div class="flex items-center gap-2">
                <code class="text-xs bg-muted px-2 py-1 rounded">{{ content.qrCode }}</code>
                <Button size="sm" variant="outline">
                  <QrCode class="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <label class="text-sm font-medium text-muted-foreground">Created</label>
              <div class="flex items-center gap-2">
                <Clock class="h-4 w-4" />
                <span>{{ formatDate(content.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="flex items-center gap-2 pt-4 border-t">
          <Button variant="outline" size="sm">
            <Download class="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm">
            <QrCode class="h-4 w-4 mr-2" />
            Generate QR
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink class="h-4 w-4 mr-2" />
            Open in AR
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>