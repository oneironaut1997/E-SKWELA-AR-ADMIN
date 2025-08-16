import type { LucideIcon } from 'lucide-vue-next';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon;
    isActive?: boolean;
}

export type AppPageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
};

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'student' | 'teacher' | 'admin';
    gradeLevel?: string;
    avatar?: string;
    lastActive: string;
    createdAt: string;
    status: 'active' | 'inactive';
    email_verified_at?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface CreateUserData {
    name: string;
    email: string;
    role: 'student' | 'teacher' | 'admin';
    gradeLevel?: string;
    password: string;
}

export interface UpdateUserData {
    name?: string;
    email?: string;
    role?: 'student' | 'teacher' | 'admin';
    gradeLevel?: string;
    password?: string;
    status?: 'active' | 'inactive';
}

export interface UserFilters {
    page?: number;
    per_page?: number;
    role?: 'student' | 'teacher' | 'admin';
    gradeLevel?: string;
    search?: string;
    sortBy?: 'name' | 'email' | 'role' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    status?: 'active' | 'inactive';
}

// AR Content Management Types
export interface ARContent {
    id: number;
    title: string;
    description?: string;
    subject: 'History' | 'Science';
    gradeLevel: string;
    type: '3d_model' | 'audio';
    qrCode: string;
    thumbnail?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize: string;
    createdAt: string;
    updatedAt: string;
    status: 'active' | 'inactive';
}

export interface CreateContentData {
    title: string;
    description?: string;
    subject: 'History' | 'Science';
    gradeLevel: string;
    type: '3d_model' | 'audio';
    file: File;
}

export interface UpdateContentData {
    title?: string;
    description?: string;
    subject?: 'History' | 'Science';
    gradeLevel?: string;
    type?: '3d_model' | 'audio';
    file?: File;
    status?: 'active' | 'inactive';
}

export interface ContentFilters {
    page?: number;
    per_page?: number;
    subject?: 'History' | 'Science';
    gradeLevel?: string;
    type?: '3d_model' | 'audio';
    search?: string;
    sortBy?: 'title' | 'subject' | 'gradeLevel' | 'type' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    status?: 'active' | 'inactive';
}

export interface FileUpload {
    id: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    url: string;
    uploadedAt: string;
}

export interface QRCode {
    id: number;
    contentId: number;
    code: string;
    imageUrl: string;
    generatedAt: string;
}

// File Upload Progress Types
export interface UploadProgress {
    progress: number;
    status: 'uploading' | 'completed' | 'error';
    message?: string;
}

// Content View Types
export type ContentViewMode = 'grid' | 'table';

// Grade Level Options
export const GRADE_LEVELS = [
    'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'
] as const;

export type GradeLevel = typeof GRADE_LEVELS[number];

// Subject Options
export const SUBJECTS = ['History', 'Science'] as const;
export type Subject = typeof SUBJECTS[number];

// Content Type Options
export const CONTENT_TYPES = ['3d_model', 'audio'] as const;
export type ContentType = typeof CONTENT_TYPES[number];

// File Type Validation
export const ALLOWED_FILE_TYPES = {
    '3d_model': ['.gltf', '.glb'],
    'audio': ['.mp3', '.wav']
} as const;

// Quiz Management Types
export interface Quiz {
    id: number;
    title: string;
    description?: string;
    subject: 'History' | 'Science';
    gradeLevel: string;
    timeLimit: number; // in minutes
    maxAttempts: number;
    scoringMethod: 'points' | 'percentage';
    status: 'draft' | 'published' | 'archived';
    associatedContentId?: number;
    associatedContent?: ARContent;
    questionsCount: number;
    totalPoints: number;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
}

export interface Question {
    id: number;
    quizId: number;
    title: string;
    options: string[]; // Always 4 options
    correctAnswer: number; // Index of correct option (0-3)
    order: number;
    points: number;
    explanation?: string;
}

export interface QuizAttempt {
    id: number;
    quizId: number;
    userId: number;
    user?: User;
    quiz?: Quiz;
    startedAt: string;
    completedAt?: string;
    score: number;
    totalPoints: number;
    percentage: number;
    timeSpent: number; // in seconds
    answers: QuizAnswer[];
    status: 'in_progress' | 'completed' | 'abandoned';
}

export interface QuizAnswer {
    questionId: number;
    selectedAnswer: number; // Index of selected option (0-3)
    isCorrect: boolean;
    pointsEarned: number;
    timeSpent: number; // in seconds
}

export interface CreateQuizData {
    title: string;
    description?: string;
    subject: 'History' | 'Science';
    gradeLevel: string;
    timeLimit: number;
    maxAttempts: number;
    scoringMethod: 'points' | 'percentage';
    associatedContentId?: number;
}

export interface UpdateQuizData {
    title?: string;
    description?: string;
    subject?: 'History' | 'Science';
    gradeLevel?: string;
    timeLimit?: number;
    maxAttempts?: number;
    scoringMethod?: 'points' | 'percentage';
    status?: 'draft' | 'published' | 'archived';
    associatedContentId?: number;
}

export interface CreateQuestionData {
    title: string;
    options: string[];
    correctAnswer: number;
    points: number;
    explanation?: string;
}

export interface UpdateQuestionData {
    title?: string;
    options?: string[];
    correctAnswer?: number;
    points?: number;
    explanation?: string;
    order?: number;
}

export interface QuizFilters {
    page?: number;
    per_page?: number;
    subject?: 'History' | 'Science';
    gradeLevel?: string;
    status?: 'draft' | 'published' | 'archived';
    associatedContentId?: number;
    search?: string;
    sortBy?: 'title' | 'subject' | 'gradeLevel' | 'createdAt' | 'questionsCount';
    sortOrder?: 'asc' | 'desc';
}

export interface QuizAttemptFilters {
    page?: number;
    per_page?: number;
    quizId?: number;
    userId?: number;
    status?: 'in_progress' | 'completed' | 'abandoned';
    dateFrom?: string;
    dateTo?: string;
    sortBy?: 'startedAt' | 'completedAt' | 'score' | 'percentage';
    sortOrder?: 'asc' | 'desc';
}

export interface QuizSettings {
    timeLimit: number;
    maxAttempts: number;
    scoringMethod: 'points' | 'percentage';
    showResults: boolean;
    showCorrectAnswers: boolean;
    allowReview: boolean;
    randomizeQuestions: boolean;
    randomizeOptions: boolean;
}

export interface QuizStatistics {
    totalAttempts: number;
    completedAttempts: number;
    averageScore: number;
    averageTimeSpent: number;
    passRate: number;
    questionStatistics: QuestionStatistics[];
}

export interface QuestionStatistics {
    questionId: number;
    question: Question;
    totalAnswers: number;
    correctAnswers: number;
    incorrectAnswers: number;
    accuracyRate: number;
    averageTimeSpent: number;
    optionStatistics: OptionStatistics[];
}

export interface OptionStatistics {
    optionIndex: number;
    optionText: string;
    selectedCount: number;
    selectionRate: number;
    isCorrect: boolean;
}

// Quiz Builder Types
export interface QuizBuilderState {
    quiz: Quiz;
    questions: Question[];
    isDirty: boolean;
    isLoading: boolean;
    draggedQuestion?: Question;
    selectedQuestion?: Question;
}

export interface DragDropResult {
    sourceIndex: number;
    destinationIndex: number;
    item: Question;
}

// Quiz Preview Types
export interface QuizPreviewState {
    quiz: Quiz;
    questions: Question[];
    currentQuestionIndex: number;
    answers: Record<number, number>; // questionId -> selectedOptionIndex
    timeRemaining: number;
    isCompleted: boolean;
    showResults: boolean;
}

// Time Limit Options
export const TIME_LIMITS = [
    { value: 5, label: '5 minutes' },
    { value: 10, label: '10 minutes' },
    { value: 15, label: '15 minutes' },
    { value: 20, label: '20 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '60 minutes' }
] as const;

// Max Attempts Options
export const MAX_ATTEMPTS = [
    { value: 1, label: '1 attempt' },
    { value: 2, label: '2 attempts' },
    { value: 3, label: '3 attempts' },
    { value: 5, label: '5 attempts' },
    { value: -1, label: 'Unlimited' }
] as const;

// Scoring Method Options
export const SCORING_METHODS = [
    { value: 'points', label: 'Points-based' },
    { value: 'percentage', label: 'Percentage-based' }
] as const;

export type BreadcrumbItemType = BreadcrumbItem;
