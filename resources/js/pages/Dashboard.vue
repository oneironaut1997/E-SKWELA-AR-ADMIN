<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';
import { onMounted, ref } from 'vue';
import { mockApi, type DashboardStats } from '@/services/mockApi';
import StatCard from '@/components/dashboard/StatCard.vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  GraduationCap,
  UserCheck,
  Shield,
  Box,
  FileQuestion,
  Activity,
  TrendingUp,
  Target,
  Award
} from 'lucide-vue-next';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const stats = ref<DashboardStats | null>(null);
const loading = ref(true);

const loadDashboardData = async () => {
  try {
    loading.value = true;
    const response = await mockApi.getDashboardStats();
    if (response.success) {
      stats.value = response.data;
    }
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadDashboardData();
});
</script>

<template>
    <Head title="Dashboard" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 overflow-x-auto">
            <!-- Welcome Section -->
            <div class="space-y-2">
                <h1 class="text-3xl font-bold tracking-tight">E-Skwela AR Admin Dashboard</h1>
                <p class="text-muted-foreground">
                    Welcome to the E-Skwela AR administration panel. Monitor your AR learning platform performance and manage educational content.
                </p>
            </div>

            <!-- Key Statistics Cards -->
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Users"
                    :value="stats?.totalUsers || 0"
                    description="All registered users"
                    :icon="Users"
                    :loading="loading"
                    :trend="{ value: 12.5, isPositive: true }"
                />
                <StatCard
                    title="Students"
                    :value="stats?.totalStudents || 0"
                    description="Active student accounts"
                    :icon="GraduationCap"
                    :loading="loading"
                    :trend="{ value: 8.2, isPositive: true }"
                />
                <StatCard
                    title="AR Content"
                    :value="stats?.totalContent || 0"
                    description="3D models and audio files"
                    :icon="Box"
                    :loading="loading"
                    :trend="{ value: 15.3, isPositive: true }"
                />
                <StatCard
                    title="Quizzes"
                    :value="stats?.totalQuizzes || 0"
                    description="Interactive assessments"
                    :icon="FileQuestion"
                    :loading="loading"
                    :trend="{ value: 6.7, isPositive: true }"
                />
            </div>

            <!-- Performance Metrics -->
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    title="Active Users"
                    :value="stats?.activeUsers || 0"
                    description="Users active this week"
                    :icon="UserCheck"
                    :loading="loading"
                />
                <StatCard
                    title="Completion Rate"
                    :value="stats ? `${stats.completionRate}%` : '0%'"
                    description="Average quiz completion"
                    :icon="Target"
                    :loading="loading"
                />
                <StatCard
                    title="Average Score"
                    :value="stats ? `${stats.averageScore}%` : '0%'"
                    description="Student performance average"
                    :icon="Award"
                    :loading="loading"
                />
            </div>

            <!-- Recent Activity and Quick Actions -->
            <div class="grid gap-4 md:grid-cols-2">
                <!-- Recent Activity -->
                <Card>
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2">
                            <Activity class="h-5 w-5" />
                            Recent Activity
                        </CardTitle>
                        <CardDescription>
                            Latest system activities and user interactions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-4">
                            <div class="flex items-center space-x-4">
                                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                                <div class="flex-1 space-y-1">
                                    <p class="text-sm font-medium">New AR content uploaded</p>
                                    <p class="text-xs text-muted-foreground">Solar System 3D Model - Grade 4 Science</p>
                                </div>
                                <p class="text-xs text-muted-foreground">2 min ago</p>
                            </div>
                            <div class="flex items-center space-x-4">
                                <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <div class="flex-1 space-y-1">
                                    <p class="text-sm font-medium">Quiz completed</p>
                                    <p class="text-xs text-muted-foreground">Philippine History Quiz by Maria Santos</p>
                                </div>
                                <p class="text-xs text-muted-foreground">5 min ago</p>
                            </div>
                            <div class="flex items-center space-x-4">
                                <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <div class="flex-1 space-y-1">
                                    <p class="text-sm font-medium">New teacher registered</p>
                                    <p class="text-xs text-muted-foreground">Juan Dela Cruz - Grade 3 Teacher</p>
                                </div>
                                <p class="text-xs text-muted-foreground">1 hour ago</p>
                            </div>
                            <div class="flex items-center space-x-4">
                                <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
                                <div class="flex-1 space-y-1">
                                    <p class="text-sm font-medium">AR session started</p>
                                    <p class="text-xs text-muted-foreground">Traditional Filipino Houses - Grade 2</p>
                                </div>
                                <p class="text-xs text-muted-foreground">2 hours ago</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <!-- System Overview -->
                <Card>
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2">
                            <TrendingUp class="h-5 w-5" />
                            System Overview
                        </CardTitle>
                        <CardDescription>
                            Platform performance and usage statistics
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-2">
                                    <Users class="h-4 w-4 text-blue-500" />
                                    <span class="text-sm font-medium">Teachers</span>
                                </div>
                                <span class="text-sm text-muted-foreground">{{ stats?.totalTeachers || 0 }}</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-2">
                                    <Shield class="h-4 w-4 text-green-500" />
                                    <span class="text-sm font-medium">Administrators</span>
                                </div>
                                <span class="text-sm text-muted-foreground">{{ stats?.totalAdmins || 0 }}</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-2">
                                    <Activity class="h-4 w-4 text-purple-500" />
                                    <span class="text-sm font-medium">AR Sessions</span>
                                </div>
                                <span class="text-sm text-muted-foreground">{{ stats?.totalSessions || 0 }}</span>
                            </div>
                            <div class="pt-2 border-t">
                                <div class="flex items-center justify-between">
                                    <span class="text-sm font-medium">System Status</span>
                                    <div class="flex items-center space-x-2">
                                        <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span class="text-sm text-green-600">Operational</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </AppLayout>
</template>
