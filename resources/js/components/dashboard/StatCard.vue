<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-vue-next';

interface Props {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
}

defineProps<Props>();
</script>

<template>
  <Card>
    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle class="text-sm font-medium">{{ title }}</CardTitle>
      <component v-if="icon" :is="icon" class="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div v-if="loading" class="space-y-2">
        <div class="h-8 w-20 bg-muted animate-pulse rounded"></div>
        <div class="h-4 w-32 bg-muted animate-pulse rounded"></div>
      </div>
      <div v-else>
        <div class="text-2xl font-bold">{{ value }}</div>
        <p v-if="description" class="text-xs text-muted-foreground">
          {{ description }}
        </p>
        <div v-if="trend" class="flex items-center text-xs mt-1">
          <span 
            :class="[
              'font-medium',
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            ]"
          >
            {{ trend.isPositive ? '+' : '' }}{{ trend.value }}%
          </span>
          <span class="text-muted-foreground ml-1">from last month</span>
        </div>
      </div>
    </CardContent>
  </Card>
</template>