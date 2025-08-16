// Analytics Data Types for E-Skwela AR Admin Dashboard

export interface AnalyticsData {
  overview: OverviewMetrics;
  studentProgress: StudentProgressData[];
  contentEngagement: ContentEngagementData[];
  quizAnalytics: QuizAnalyticsData;
  dateRange: DateRange;
}

export interface OverviewMetrics {
  totalStudents: number;
  activeContent: number;
  quizCompletionRate: number;
  arSessionsThisMonth: number;
  previousPeriod: {
    totalStudents: number;
    activeContent: number;
    quizCompletionRate: number;
    arSessionsThisMonth: number;
  };
}

export interface StudentProgressData {
  userId: number;
  userName: string;
  gradeLevel: string;
  subject: 'History' | 'Science';
  completionRate: number;
  averageScore: number;
  timeSpent: number; // in minutes
  lastActivity: string;
  quizzesCompleted: number;
  arSessionsCount: number;
  progressOverTime: ProgressPoint[];
}

export interface ProgressPoint {
  date: string;
  completionRate: number;
  score: number;
}

export interface ContentEngagementData {
  contentId: number;
  title: string;
  subject: 'History' | 'Science';
  gradeLevel: string;
  type: '3d_model' | 'audio';
  qrScans: number;
  averageSessionDuration: number; // in minutes
  completionRate: number;
  lastAccessed: string;
  popularityRank: number;
  engagementTrend: EngagementPoint[];
}

export interface EngagementPoint {
  date: string;
  scans: number;
  duration: number;
}

export interface QuizAnalyticsData {
  totalQuizzes: number;
  totalAttempts: number;
  averageScore: number;
  completionRate: number;
  quizPerformance: QuizPerformanceData[];
  questionDifficulty: QuestionDifficultyData[];
  subjectComparison: SubjectComparisonData[];
}

export interface QuizPerformanceData {
  quizId: number;
  title: string;
  subject: 'History' | 'Science';
  gradeLevel: string;
  attempts: number;
  averageScore: number;
  completionRate: number;
  averageTimeSpent: number; // in minutes
  difficultyRating: 'Easy' | 'Medium' | 'Hard';
}

export interface QuestionDifficultyData {
  questionId: number;
  quizTitle: string;
  question: string;
  correctAnswers: number;
  totalAnswers: number;
  accuracyRate: number;
  averageTimeSpent: number; // in seconds
  difficultyLevel: 'Easy' | 'Medium' | 'Hard';
}

export interface SubjectComparisonData {
  subject: 'History' | 'Science';
  totalStudents: number;
  averageScore: number;
  completionRate: number;
  timeSpent: number; // in minutes
  contentAccessed: number;
  quizzesCompleted: number;
}

export interface DateRange {
  startDate: string;
  endDate: string;
  preset?: 'last7days' | 'last30days' | 'last3months' | 'last6months' | 'custom';
}

export interface AnalyticsFilters {
  dateRange: DateRange;
  gradeLevel?: string;
  subject?: 'History' | 'Science';
  contentType?: '3d_model' | 'audio';
}

export interface ReportData {
  id: string;
  type: 'student_progress' | 'content_engagement' | 'quiz_performance';
  title: string;
  generatedAt: string;
  dateRange: DateRange;
  filters: AnalyticsFilters;
  data: any;
  format: 'pdf' | 'csv';
}

// Chart Data Interfaces
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
  label?: string;
}

export interface ComparisonData {
  category: string;
  current: number;
  previous: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
}

// Heat Map Data for QR Scan Patterns
export interface HeatMapData {
  hour: number;
  day: string;
  value: number;
  intensity: 'low' | 'medium' | 'high';
}

// Trend Analysis
export interface TrendData {
  period: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  percentage: number;
}

// Performance Insights
export interface PerformanceInsight {
  type: 'success' | 'warning' | 'info';
  title: string;
  description: string;
  recommendation?: string;
  metric: string;
  value: number;
  threshold: number;
}

// Export Types
export type AnalyticsExportFormat = 'pdf' | 'csv' | 'excel';

export interface ExportOptions {
  format: AnalyticsExportFormat;
  includeCharts: boolean;
  dateRange: DateRange;
  sections: string[];
}

// Mock Data Generation Helpers
export interface MockDataOptions {
  studentCount: number;
  contentCount: number;
  quizCount: number;
  monthsOfData: number;
  gradeDistribution: Record<string, number>;
  subjectDistribution: Record<string, number>;
}

// API Response Types
export interface AnalyticsResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  generatedAt: string;
  cacheExpiry?: string;
}

// Date Preset Options
export const DATE_PRESETS = [
  { value: 'last7days', label: 'Last 7 days' },
  { value: 'last30days', label: 'Last 30 days' },
  { value: 'last3months', label: 'Last 3 months' },
  { value: 'last6months', label: 'Last 6 months' },
  { value: 'custom', label: 'Custom range' }
] as const;

// Chart Color Schemes
export const CHART_COLORS = {
  primary: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'],
  secondary: ['#93C5FD', '#6EE7B7', '#FCD34D', '#FCA5A5', '#C4B5FD', '#67E8F9'],
  gradients: [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  ]
} as const;

// Performance Thresholds
export const PERFORMANCE_THRESHOLDS = {
  quiz: {
    excellent: 90,
    good: 75,
    average: 60,
    poor: 40
  },
  engagement: {
    high: 80,
    medium: 50,
    low: 20
  },
  completion: {
    excellent: 95,
    good: 80,
    average: 65,
    poor: 40
  }
} as const;