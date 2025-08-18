<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="space-y-6 flex h-full flex-1 flex-col gap-6 rounded-xl p-4 overflow-x-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p class="text-muted-foreground">
            Monitor student progress, content engagement, and system performance
          </p>
        </div>
        
        <!-- Date Range Selector -->
        <div class="flex items-center gap-2">
          <Select v-model="selectedDateRange" @update:model-value="handleDateRangeChange">
            <SelectTrigger class="w-48">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7days">Last 7 days</SelectItem>
              <SelectItem value="last30days">Last 30 days</SelectItem>
              <SelectItem value="last3months">Last 3 months</SelectItem>
              <SelectItem value="last6months">Last 6 months</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" @click="refreshData" :disabled="loading">
            <RefreshCw class="mr-2 h-4 w-4" :class="{ 'animate-spin': loading }" />
            Refresh
          </Button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="flex items-center gap-2">
          <RefreshCw class="h-5 w-5 animate-spin" />
          <span>Loading analytics data...</span>
        </div>
      </div>

      <!-- Analytics Content -->
      <div v-else class="space-y-6">
        <!-- KPI Cards Section -->
        <section>
          <h2 class="text-lg font-semibold mb-4">Overview</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Total Students -->
            <div class="p-6 border rounded-lg bg-card">
              <div class="flex items-center gap-2 mb-2">
                <Users class="h-5 w-5 text-blue-600" />
                <span class="text-sm font-medium text-muted-foreground">Total Students</span>
              </div>
              <div class="space-y-1">
                <p class="text-2xl font-bold">{{ formatNumber(analyticsData?.overview.totalStudents) }}</p>
                <div class="flex items-center gap-1 text-sm">
                  <TrendingUp v-if="getGrowthRate('totalStudents') > 0" class="h-3 w-3 text-green-600" />
                  <TrendingDown v-else class="h-3 w-3 text-red-600" />
                  <span :class="getGrowthRate('totalStudents') > 0 ? 'text-green-600' : 'text-red-600'">
                    {{ Math.abs(getGrowthRate('totalStudents')) }}%
                  </span>
                  <span class="text-muted-foreground">vs last period</span>
                </div>
              </div>
            </div>

            <!-- Active Content -->
            <div class="p-6 border rounded-lg bg-card">
              <div class="flex items-center gap-2 mb-2">
                <FileText class="h-5 w-5 text-green-600" />
                <span class="text-sm font-medium text-muted-foreground">Active Content</span>
              </div>
              <div class="space-y-1">
                <p class="text-2xl font-bold">{{ formatNumber(analyticsData?.overview.activeContent) }}</p>
                <div class="flex items-center gap-1 text-sm">
                  <TrendingUp v-if="getGrowthRate('activeContent') > 0" class="h-3 w-3 text-green-600" />
                  <TrendingDown v-else class="h-3 w-3 text-red-600" />
                  <span :class="getGrowthRate('activeContent') > 0 ? 'text-green-600' : 'text-red-600'">
                    {{ Math.abs(getGrowthRate('activeContent')) }}%
                  </span>
                  <span class="text-muted-foreground">vs last period</span>
                </div>
              </div>
            </div>

            <!-- Quiz Completion Rate -->
            <div class="p-6 border rounded-lg bg-card">
              <div class="flex items-center gap-2 mb-2">
                <CheckCircle class="h-5 w-5 text-orange-600" />
                <span class="text-sm font-medium text-muted-foreground">Quiz Completion</span>
              </div>
              <div class="space-y-1">
                <p class="text-2xl font-bold">{{ analyticsData?.overview.quizCompletionRate }}%</p>
                <div class="flex items-center gap-1 text-sm">
                  <TrendingUp v-if="getGrowthRate('quizCompletionRate') > 0" class="h-3 w-3 text-green-600" />
                  <TrendingDown v-else class="h-3 w-3 text-red-600" />
                  <span :class="getGrowthRate('quizCompletionRate') > 0 ? 'text-green-600' : 'text-red-600'">
                    {{ Math.abs(getGrowthRate('quizCompletionRate')) }}%
                  </span>
                  <span class="text-muted-foreground">vs last period</span>
                </div>
              </div>
            </div>

            <!-- AR Sessions -->
            <div class="p-6 border rounded-lg bg-card">
              <div class="flex items-center gap-2 mb-2">
                <Smartphone class="h-5 w-5 text-purple-600" />
                <span class="text-sm font-medium text-muted-foreground">AR Sessions</span>
              </div>
              <div class="space-y-1">
                <p class="text-2xl font-bold">{{ formatNumber(analyticsData?.overview.arSessionsThisMonth) }}</p>
                <div class="flex items-center gap-1 text-sm">
                  <TrendingUp v-if="getGrowthRate('arSessionsThisMonth') > 0" class="h-3 w-3 text-green-600" />
                  <TrendingDown v-else class="h-3 w-3 text-red-600" />
                  <span :class="getGrowthRate('arSessionsThisMonth') > 0 ? 'text-green-600' : 'text-red-600'">
                    {{ Math.abs(getGrowthRate('arSessionsThisMonth')) }}%
                  </span>
                  <span class="text-muted-foreground">vs last period</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Student Performance Chart -->
          <section class="p-6 border rounded-lg bg-card">
            <h3 class="text-lg font-semibold mb-4">Student Performance Trends</h3>
            <div class="h-80">
              <LineChart
                v-if="studentPerformanceChartData"
                :data="studentPerformanceChartData"
                :options="chartOptions.line"
                :height="320"
              />
              <div v-else class="flex items-center justify-center h-full text-muted-foreground">
                No data available
              </div>
            </div>
          </section>

          <!-- Content Engagement Chart -->
          <section class="p-6 border rounded-lg bg-card">
            <h3 class="text-lg font-semibold mb-4">Content Engagement</h3>
            <div class="h-80">
              <BarChart
                v-if="contentEngagementChartData"
                :data="contentEngagementChartData"
                :options="chartOptions.bar"
                :height="320"
              />
              <div v-else class="flex items-center justify-center h-full text-muted-foreground">
                No data available
              </div>
            </div>
          </section>
        </div>

        <!-- Subject Comparison -->
        <section class="p-6 border rounded-lg bg-card">
          <h3 class="text-lg font-semibold mb-4">Subject Performance Comparison</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="h-64">
              <PieChart
                v-if="subjectComparisonChartData"
                :data="subjectComparisonChartData"
                :options="chartOptions.pie"
                :height="256"
              />
            </div>
            <div class="space-y-4">
              <div v-for="subject in analyticsData?.quizAnalytics.subjectComparison" :key="subject.subject" 
                   class="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 class="font-medium">{{ subject.subject }}</h4>
                  <p class="text-sm text-muted-foreground">{{ subject.totalStudents }} students</p>
                </div>
                <div class="text-right">
                  <p class="text-lg font-semibold">{{ subject.averageScore }}%</p>
                  <p class="text-sm text-muted-foreground">Average Score</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Quick Actions -->
        <section class="p-6 border rounded-lg bg-card">
          <h3 class="text-lg font-semibold mb-4">Quick Actions</h3>
          <div class="flex flex-wrap gap-3">
            <Button variant="outline" @click="exportReport('student_progress')">
              <Download class="mr-2 h-4 w-4" />
              Export Student Report
            </Button>
            <Button variant="outline" @click="exportReport('content_engagement')">
              <Download class="mr-2 h-4 w-4" />
              Export Content Report
            </Button>
            <Button variant="outline" @click="exportReport('quiz_performance')">
              <Download class="mr-2 h-4 w-4" />
              Export Quiz Report
            </Button>
          </div>
        </section>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import {
  CheckCircle,
  Download,
  FileText,
  RefreshCw,
  Smartphone,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-vue-next';

import AppLayout from '@/layouts/AppLayout.vue';
import LineChart from '@/components/charts/LineChart.vue';
import BarChart from '@/components/charts/BarChart.vue';
import PieChart from '@/components/charts/PieChart.vue';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { mockApi } from '@/services/mockApi';
import type { BreadcrumbItem } from '@/types';
import type { AnalyticsData, DateRange } from '@/types/analytics';
import type { ChartData, ChartOptions } from 'chart.js';

// Page data
const analyticsData = ref<AnalyticsData | null>(null);
const loading = ref(false);
const selectedDateRange = ref('last30days');

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Analytics', href: '/analytics' },
];

// Chart options
const chartOptions = {
  line: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  } as ChartOptions<'line'>,
  bar: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  } as ChartOptions<'bar'>,
  pie: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
    },
  } as ChartOptions<'pie'>,
};

// Computed properties for chart data
const studentPerformanceChartData = computed((): ChartData<'line'> | null => {
  if (!analyticsData.value) return null;

  const students = analyticsData.value.studentProgress.slice(0, 5); // Top 5 students
  const dates = students[0]?.progressOverTime.map(p => p.date) || [];

  return {
    labels: dates,
    datasets: students.map((student, index) => ({
      label: student.userName,
      data: student.progressOverTime.map(p => p.score),
      borderColor: `hsl(${index * 60}, 70%, 50%)`,
      backgroundColor: `hsl(${index * 60}, 70%, 50%, 0.1)`,
      tension: 0.4,
    })),
  };
});

const contentEngagementChartData = computed((): ChartData<'bar'> | null => {
  if (!analyticsData.value) return null;

  const topContent = analyticsData.value.contentEngagement
    .sort((a, b) => b.qrScans - a.qrScans)
    .slice(0, 8);

  return {
    labels: topContent.map(content => content.title),
    datasets: [
      {
        label: 'QR Scans',
        data: topContent.map(content => content.qrScans),
        backgroundColor: 'hsl(210, 70%, 50%)',
      },
      {
        label: 'Avg. Duration (min)',
        data: topContent.map(content => content.averageSessionDuration),
        backgroundColor: 'hsl(150, 70%, 50%)',
      },
    ],
  };
});

const subjectComparisonChartData = computed((): ChartData<'pie'> | null => {
  if (!analyticsData.value) return null;

  const subjects = analyticsData.value.quizAnalytics.subjectComparison;

  return {
    labels: subjects.map(s => s.subject),
    datasets: [
      {
        data: subjects.map(s => s.totalStudents),
        backgroundColor: [
          'hsl(210, 70%, 50%)',
          'hsl(150, 70%, 50%)',
        ],
      },
    ],
  };
});

// Helper functions
const formatNumber = (num?: number): string => {
  if (!num) return '0';
  return num.toLocaleString();
};

const getGrowthRate = (metric: keyof AnalyticsData['overview']): number => {
  if (!analyticsData.value) return 0;
  
  const current = analyticsData.value.overview[metric] as number;
  const previous = analyticsData.value.overview.previousPeriod[metric] as number;
  
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
};

const getDateRange = (preset: string): DateRange => {
  const now = new Date();
  let startDate: Date;

  switch (preset) {
    case 'last7days':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'last3months':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case 'last6months':
      startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
      break;
    default: // last30days
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: now.toISOString().split('T')[0],
    preset: preset as any,
  };
};

// Event handlers
const loadAnalyticsData = async () => {
  loading.value = true;
  try {
    const dateRange = getDateRange(selectedDateRange.value);
    const response = await mockApi.getAnalytics({ dateRange });
    
    if (response.success) {
      analyticsData.value = response.data;
    }
  } catch (error) {
    console.error('Failed to load analytics data:', error);
  } finally {
    loading.value = false;
  }
};

const handleDateRangeChange = () => {
  loadAnalyticsData();
};

const refreshData = () => {
  loadAnalyticsData();
};

const exportReport = async (type: 'student_progress' | 'content_engagement' | 'quiz_performance') => {
  try {
    const dateRange = getDateRange(selectedDateRange.value);
    const response = await mockApi.generateReport(type, { dateRange });
    
    if (response.success) {
      // Simulate file download
      console.log(`Exporting ${type} report:`, response.data);
      // In a real implementation, this would trigger a file download
    }
  } catch (error) {
    console.error('Failed to export report:', error);
  }
};

// Initialize
onMounted(() => {
  loadAnalyticsData();
});
</script>