// Mock API Service for E-Skwela AR Admin Frontend
// This service simulates backend API responses for frontend-only operation

import type {
  AnalyticsData,
  OverviewMetrics,
  StudentProgressData,
  ContentEngagementData,
  QuizAnalyticsData,
  DateRange,
  AnalyticsFilters,
  ReportData,
  AnalyticsResponse,
  MockDataOptions,
} from '@/types/analytics';

export interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalAdmins: number;
  totalContent: number;
  totalQuizzes: number;
  totalSessions: number;
  activeUsers: number;
  completionRate: number;
  averageScore: number;
}

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

export interface Quiz {
  id: number;
  title: string;
  description?: string;
  subject: 'History' | 'Science';
  gradeLevel: string;
  timeLimit: number;
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
  options: string[];
  correctAnswer: number;
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
  timeSpent: number;
  answers: QuizAnswer[];
  status: 'in_progress' | 'completed' | 'abandoned';
}

export interface QuizAnswer {
  questionId: number;
  selectedAnswer: number;
  isCorrect: boolean;
  pointsEarned: number;
  timeSpent: number;
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

export interface MockAPIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    current_page: number;
    total: number;
    per_page: number;
  };
}

class MockAPIService {
  private generateMockStats(): DashboardStats {
    return {
      totalUsers: 1247,
      totalStudents: 1156,
      totalTeachers: 89,
      totalAdmins: 2,
      totalContent: 156,
      totalQuizzes: 89,
      totalSessions: 3421,
      activeUsers: 234,
      completionRate: 78.5,
      averageScore: 82.3,
    };
  }

  private generateMockUsers(count: number = 10): User[] {
    const roles: Array<'student' | 'teacher' | 'admin'> = ['student', 'teacher', 'admin'];
    const gradeLevels = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];
    const names = [
      'Maria Santos', 'Juan Dela Cruz', 'Ana Garcia', 'Pedro Rodriguez', 'Sofia Martinez',
      'Carlos Lopez', 'Isabella Gonzalez', 'Miguel Torres', 'Lucia Hernandez', 'Diego Morales'
    ];

    return Array.from({ length: count }, (_, i) => {
      const role = roles[Math.floor(Math.random() * roles.length)];
      return {
        id: i + 1,
        name: names[i % names.length],
        email: `user${i + 1}@eskwela.edu.ph`,
        role,
        gradeLevel: role === 'student' ? gradeLevels[Math.floor(Math.random() * gradeLevels.length)] : undefined,
        lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: Math.random() > 0.1 ? 'active' : 'inactive', // 90% active users
      };
    });
  }

  private generateMockContent(count: number = 10): ARContent[] {
    const subjects: Array<'History' | 'Science'> = ['History', 'Science'];
    const gradeLevels = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];
    const types: Array<'3d_model' | 'audio'> = ['3d_model', 'audio'];
    const titles = [
      'Ancient Philippines Artifacts', 'Solar System Model', 'Traditional Filipino Houses',
      'Human Body Systems', 'Philippine Heroes Monument', 'Plant Life Cycle',
      'Rizal\'s Life Timeline', 'Water Cycle Demonstration', 'Bayanihan Spirit',
      'Animal Habitats in Philippines'
    ];
    const descriptions = [
      'Explore ancient Filipino artifacts and their historical significance',
      'Interactive 3D model of our solar system with planetary details',
      'Traditional architecture of Filipino houses across different regions',
      'Comprehensive overview of human body systems and functions',
      'Monument dedicated to Philippine national heroes',
      'Complete plant life cycle from seed to mature plant',
      'Timeline of Dr. Jose Rizal\'s life and contributions',
      'Interactive demonstration of the water cycle process',
      'Understanding the Filipino spirit of community cooperation',
      'Diverse animal habitats found throughout the Philippines'
    ];

    return Array.from({ length: count }, (_, i) => {
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      const fileExtension = type === '3d_model' ? '.glb' : '.mp3';
      const fileName = `${titles[i % titles.length].toLowerCase().replace(/\s+/g, '_')}${fileExtension}`;
      
      return {
        id: i + 1,
        title: titles[i % titles.length],
        description: descriptions[i % descriptions.length],
        subject,
        gradeLevel: gradeLevels[Math.floor(Math.random() * gradeLevels.length)],
        type,
        qrCode: `ESK_${subject.toUpperCase().substring(0, 4)}_${String(i + 1).padStart(3, '0')}`,
        thumbnail: `/thumbnails/${type}_${i + 1}.jpg`,
        fileUrl: `/content/${fileName}`,
        fileName,
        fileSize: type === '3d_model' ? `${(Math.random() * 50 + 10).toFixed(1)}MB` : `${(Math.random() * 10 + 2).toFixed(1)}MB`,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: Math.random() > 0.1 ? 'active' : 'inactive', // 90% active content
      };
    });
  }

  private generateMockQuizzes(count: number = 10): Quiz[] {
    const subjects: Array<'History' | 'Science'> = ['History', 'Science'];
    const gradeLevels = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];
    const scoringMethods: Array<'points' | 'percentage'> = ['points', 'percentage'];
    const statuses: Array<'draft' | 'published' | 'archived'> = ['draft', 'published', 'archived'];
    const titles = [
      'Philippine History Quiz', 'Science Fundamentals', 'Heroes of the Philippines',
      'Basic Biology Test', 'Cultural Heritage Quiz', 'Earth Science Assessment',
      'National Symbols Quiz', 'Human Body Quiz', 'Filipino Traditions Test',
      'Environmental Science Quiz', 'Ancient Civilizations', 'Plant Biology',
      'Weather Patterns', 'Filipino Culture', 'Space Exploration'
    ];
    const descriptions = [
      'Test your knowledge of Philippine history and important events',
      'Fundamental concepts in science for elementary students',
      'Learn about the heroes who shaped our nation',
      'Basic biology concepts and living organisms',
      'Explore the rich cultural heritage of the Philippines',
      'Understanding Earth science and natural phenomena',
      'National symbols and their significance',
      'Human body systems and functions',
      'Traditional Filipino customs and practices',
      'Environmental science and conservation'
    ];

    return Array.from({ length: count }, (_, i) => {
      const questionsCount = Math.floor(Math.random() * 15) + 5;
      const pointsPerQuestion = Math.floor(Math.random() * 3) + 1; // 1-3 points per question
      
      return {
        id: i + 1,
        title: titles[i % titles.length],
        description: descriptions[i % descriptions.length],
        subject: subjects[Math.floor(Math.random() * subjects.length)],
        gradeLevel: gradeLevels[Math.floor(Math.random() * gradeLevels.length)],
        timeLimit: [10, 15, 20, 30, 45, 60][Math.floor(Math.random() * 6)],
        maxAttempts: Math.floor(Math.random() * 3) + 1,
        scoringMethod: scoringMethods[Math.floor(Math.random() * scoringMethods.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        associatedContentId: Math.random() > 0.6 ? Math.floor(Math.random() * 50) + 1 : undefined,
        questionsCount,
        totalPoints: questionsCount * pointsPerQuestion,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: Math.floor(Math.random() * 10) + 1, // Random teacher/admin ID
      };
    });
  }

  private generateMockQuestions(quizId: number, count: number = 10): Question[] {
    const questionTitles = [
      'Who is considered the national hero of the Philippines?',
      'What is the largest planet in our solar system?',
      'When did the Philippines gain independence?',
      'Which organ pumps blood throughout the body?',
      'What is the capital city of the Philippines?',
      'How many bones are in the adult human body?',
      'Who wrote the Philippine national anthem?',
      'What gas do plants absorb from the atmosphere?',
      'Which sea surrounds the Philippines?',
      'What is the process by which plants make food?',
      'Who was the first president of the Philippines?',
      'What is the smallest unit of matter?',
      'Which mountain is the highest in the Philippines?',
      'What are the three states of matter?',
      'When was Rizal executed?'
    ];

    const optionSets = [
      ['Jose Rizal', 'Andres Bonifacio', 'Emilio Aguinaldo', 'Lapu-Lapu'],
      ['Jupiter', 'Saturn', 'Neptune', 'Earth'],
      ['June 12, 1898', 'July 4, 1946', 'August 31, 1957', 'February 25, 1986'],
      ['Heart', 'Lungs', 'Liver', 'Kidneys'],
      ['Manila', 'Cebu', 'Davao', 'Quezon City'],
      ['206', '208', '210', '212'],
      ['Julian Felipe', 'Jose Palma', 'Nicanor Abelardo', 'Francisco Santiago'],
      ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen'],
      ['South China Sea', 'Pacific Ocean', 'Indian Ocean', 'Atlantic Ocean'],
      ['Photosynthesis', 'Respiration', 'Digestion', 'Circulation'],
      ['Emilio Aguinaldo', 'Manuel Quezon', 'Jose Laurel', 'Sergio Osmena'],
      ['Atom', 'Molecule', 'Cell', 'Electron'],
      ['Mount Apo', 'Mount Mayon', 'Mount Pulag', 'Mount Banahaw'],
      ['Solid, Liquid, Gas', 'Hot, Cold, Warm', 'Big, Medium, Small', 'Fast, Slow, Still'],
      ['December 30, 1896', 'June 19, 1861', 'December 29, 1896', 'January 1, 1897']
    ];

    const correctAnswers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const explanations = [
      'Jose Rizal is widely considered the national hero of the Philippines for his writings and peaceful resistance.',
      'Jupiter is the largest planet in our solar system, with a mass greater than all other planets combined.',
      'The Philippines declared independence from Spain on June 12, 1898.',
      'The heart is the organ that pumps blood throughout the body via the circulatory system.',
      'Manila is the capital city of the Philippines and the center of government.',
      'The adult human body has 206 bones.',
      'Julian Felipe composed the music for the Philippine national anthem.',
      'Plants absorb carbon dioxide from the atmosphere during photosynthesis.',
      'The Philippines is surrounded by the South China Sea and other bodies of water.',
      'Photosynthesis is the process by which plants make their own food using sunlight.',
      'Emilio Aguinaldo was the first president of the Philippines.',
      'An atom is the smallest unit of matter that retains the properties of an element.',
      'Mount Apo in Mindanao is the highest mountain in the Philippines.',
      'The three states of matter are solid, liquid, and gas.',
      'Jose Rizal was executed on December 30, 1896.'
    ];

    return Array.from({ length: count }, (_, i) => ({
      id: (quizId * 100) + i + 1, // Unique ID based on quiz
      quizId,
      title: questionTitles[i % questionTitles.length],
      options: optionSets[i % optionSets.length],
      correctAnswer: correctAnswers[i % correctAnswers.length],
      order: i + 1,
      points: Math.floor(Math.random() * 3) + 1, // 1-3 points
      explanation: explanations[i % explanations.length],
    }));
  }

  private generateMockQuizAttempts(quizId: number, count: number = 20): QuizAttempt[] {
    const statuses: Array<'in_progress' | 'completed' | 'abandoned'> = ['completed', 'completed', 'completed', 'in_progress', 'abandoned'];
    
    return Array.from({ length: count }, (_, i) => {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const startedAt = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
      const timeSpent = Math.floor(Math.random() * 1800) + 300; // 5-35 minutes
      const totalPoints = 20; // Assume 20 points total
      const score = status === 'completed' ? Math.floor(Math.random() * totalPoints) + 1 : 0;
      const percentage = status === 'completed' ? Math.round((score / totalPoints) * 100) : 0;
      
      const attempt: QuizAttempt = {
        id: (quizId * 1000) + i + 1,
        quizId,
        userId: Math.floor(Math.random() * 100) + 1,
        startedAt: startedAt.toISOString(),
        score,
        totalPoints,
        percentage,
        timeSpent,
        answers: [],
        status,
      };

      if (status === 'completed') {
        attempt.completedAt = new Date(startedAt.getTime() + timeSpent * 1000).toISOString();
        // Generate mock answers
        attempt.answers = Array.from({ length: 10 }, (_, qIndex) => ({
          questionId: (quizId * 100) + qIndex + 1,
          selectedAnswer: Math.floor(Math.random() * 4),
          isCorrect: Math.random() > 0.3, // 70% correct rate
          pointsEarned: Math.random() > 0.3 ? 2 : 0,
          timeSpent: Math.floor(Math.random() * 120) + 30, // 30-150 seconds per question
        }));
      }

      return attempt;
    });
  }

  // Dashboard API
  async getDashboardStats(): Promise<MockAPIResponse<DashboardStats>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      success: true,
      data: this.generateMockStats(),
    };
  }

  // Users API
  async getUsers(params?: UserFilters): Promise<MockAPIResponse<User[]>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let users = this.generateMockUsers(100); // Generate more users for better testing
    
    // Apply filters
    if (params?.role) {
      users = users.filter(user => user.role === params.role);
    }
    
    if (params?.gradeLevel) {
      users = users.filter(user => user.gradeLevel === params.gradeLevel);
    }
    
    if (params?.status) {
      users = users.filter(user => user.status === params.status);
    }
    
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      users = users.filter(user =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    if (params?.sortBy) {
      const sortOrder = params.sortOrder || 'asc';
      users.sort((a, b) => {
        let aValue: any = a[params.sortBy!];
        let bValue: any = b[params.sortBy!];
        
        if (params.sortBy === 'createdAt') {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        } else if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (sortOrder === 'desc') {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        }
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      });
    }

    const page = params?.page || 1;
    const perPage = params?.per_page || 10;
    const start = (page - 1) * perPage;
    const paginatedUsers = users.slice(start, start + perPage);

    return {
      success: true,
      data: paginatedUsers,
      pagination: {
        current_page: page,
        total: users.length,
        per_page: perPage,
      },
    };
  }

  async getUserById(id: number): Promise<MockAPIResponse<User>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const users = this.generateMockUsers(100);
    const user = users.find(u => u.id === id);
    
    if (!user) {
      return {
        success: false,
        data: {} as User,
        message: 'User not found',
      };
    }
    
    return {
      success: true,
      data: user,
    };
  }

  async createUser(userData: CreateUserData): Promise<MockAPIResponse<User>> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simulate email uniqueness check
    const existingUsers = this.generateMockUsers(100);
    const emailExists = existingUsers.some(user => user.email === userData.email);
    
    if (emailExists) {
      return {
        success: false,
        data: {} as User,
        message: 'Email already exists',
      };
    }
    
    // Create new user
    const newUser: User = {
      id: Math.max(...existingUsers.map(u => u.id)) + 1,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      gradeLevel: userData.gradeLevel,
      lastActive: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      status: 'active',
    };
    
    return {
      success: true,
      data: newUser,
      message: 'User created successfully',
    };
  }

  async updateUser(id: number, userData: UpdateUserData): Promise<MockAPIResponse<User>> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const users = this.generateMockUsers(100);
    const existingUser = users.find(u => u.id === id);
    
    if (!existingUser) {
      return {
        success: false,
        data: {} as User,
        message: 'User not found',
      };
    }
    
    // Check email uniqueness if email is being updated
    if (userData.email && userData.email !== existingUser.email) {
      const emailExists = users.some(user => user.email === userData.email && user.id !== id);
      if (emailExists) {
        return {
          success: false,
          data: {} as User,
          message: 'Email already exists',
        };
      }
    }
    
    // Update user
    const updatedUser: User = {
      ...existingUser,
      ...userData,
      id, // Ensure ID doesn't change
    };
    
    return {
      success: true,
      data: updatedUser,
      message: 'User updated successfully',
    };
  }

  async deleteUser(id: number): Promise<MockAPIResponse<void>> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const users = this.generateMockUsers(100);
    const userExists = users.some(u => u.id === id);
    
    if (!userExists) {
      return {
        success: false,
        data: undefined,
        message: 'User not found',
      };
    }
    
    return {
      success: true,
      data: undefined,
      message: 'User deleted successfully',
    };
  }

  // Content API
  async getContent(params?: ContentFilters): Promise<MockAPIResponse<ARContent[]>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let content = this.generateMockContent(50); // Generate more content for better testing
    
    // Apply filters
    if (params?.subject) {
      content = content.filter(item => item.subject === params.subject);
    }
    
    if (params?.gradeLevel) {
      content = content.filter(item => item.gradeLevel === params.gradeLevel);
    }
    
    if (params?.type) {
      content = content.filter(item => item.type === params.type);
    }
    
    if (params?.status) {
      content = content.filter(item => item.status === params.status);
    }
    
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      content = content.filter(item =>
        item.title.toLowerCase().includes(searchLower) ||
        (item.description && item.description.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply sorting
    if (params?.sortBy) {
      const sortOrder = params.sortOrder || 'asc';
      content.sort((a, b) => {
        let aValue: any = a[params.sortBy!];
        let bValue: any = b[params.sortBy!];
        
        if (params.sortBy === 'createdAt') {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        } else if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (sortOrder === 'desc') {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        }
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      });
    }

    const page = params?.page || 1;
    const perPage = params?.per_page || 12; // Default to 12 for better grid layout
    const start = (page - 1) * perPage;
    const paginatedContent = content.slice(start, start + perPage);

    return {
      success: true,
      data: paginatedContent,
      pagination: {
        current_page: page,
        total: content.length,
        per_page: perPage,
      },
    };
  }

  async getContentById(id: number): Promise<MockAPIResponse<ARContent>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const content = this.generateMockContent(50);
    const item = content.find(c => c.id === id);
    
    if (!item) {
      return {
        success: false,
        data: {} as ARContent,
        message: 'Content not found',
      };
    }
    
    return {
      success: true,
      data: item,
    };
  }

  async createContent(contentData: CreateContentData): Promise<MockAPIResponse<ARContent>> {
    await new Promise(resolve => setTimeout(resolve, 1200)); // Longer delay for file upload simulation
    
    // Validate file type
    const allowedTypes = {
      '3d_model': ['.gltf', '.glb'],
      'audio': ['.mp3', '.wav']
    };
    
    const fileExtension = '.' + contentData.file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes[contentData.type].includes(fileExtension)) {
      return {
        success: false,
        data: {} as ARContent,
        message: `Invalid file type. Expected ${allowedTypes[contentData.type].join(' or ')} for ${contentData.type}`,
      };
    }
    
    // Create new content
    const existingContent = this.generateMockContent(50);
    const newId = Math.max(...existingContent.map(c => c.id)) + 1;
    const qrCode = `ESK_${contentData.subject.toUpperCase().substring(0, 4)}_${String(newId).padStart(3, '0')}`;
    
    const newContent: ARContent = {
      id: newId,
      title: contentData.title,
      description: contentData.description,
      subject: contentData.subject,
      gradeLevel: contentData.gradeLevel,
      type: contentData.type,
      qrCode,
      thumbnail: `/thumbnails/${contentData.type}_${newId}.jpg`,
      fileUrl: `/content/${contentData.file.name}`,
      fileName: contentData.file.name,
      fileSize: `${(contentData.file.size / (1024 * 1024)).toFixed(1)}MB`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
    };
    
    return {
      success: true,
      data: newContent,
      message: 'Content created successfully',
    };
  }

  async updateContent(id: number, contentData: UpdateContentData): Promise<MockAPIResponse<ARContent>> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const content = this.generateMockContent(50);
    const existingContent = content.find(c => c.id === id);
    
    if (!existingContent) {
      return {
        success: false,
        data: {} as ARContent,
        message: 'Content not found',
      };
    }
    
    // Validate file type if file is being updated
    if (contentData.file && contentData.type) {
      const allowedTypes = {
        '3d_model': ['.gltf', '.glb'],
        'audio': ['.mp3', '.wav']
      };
      
      const fileExtension = '.' + contentData.file.name.split('.').pop()?.toLowerCase();
      if (!allowedTypes[contentData.type].includes(fileExtension)) {
        return {
          success: false,
          data: {} as ARContent,
          message: `Invalid file type. Expected ${allowedTypes[contentData.type].join(' or ')} for ${contentData.type}`,
        };
      }
    }
    
    // Update content
    const updatedContent: ARContent = {
      ...existingContent,
      ...contentData,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };
    
    // Update file-related fields if new file is provided
    if (contentData.file) {
      updatedContent.fileName = contentData.file.name;
      updatedContent.fileUrl = `/content/${contentData.file.name}`;
      updatedContent.fileSize = `${(contentData.file.size / (1024 * 1024)).toFixed(1)}MB`;
    }
    
    return {
      success: true,
      data: updatedContent,
      message: 'Content updated successfully',
    };
  }

  async deleteContent(id: number): Promise<MockAPIResponse<void>> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const content = this.generateMockContent(50);
    const contentExists = content.some(c => c.id === id);
    
    if (!contentExists) {
      return {
        success: false,
        data: undefined,
        message: 'Content not found',
      };
    }
    
    return {
      success: true,
      data: undefined,
      message: 'Content deleted successfully',
    };
  }

  // File Upload Simulation
  async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<MockAPIResponse<FileUpload>> {
    // Simulate realistic upload progress
    if (onProgress) {
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        onProgress(progress);
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    const fileUpload: FileUpload = {
      id: Math.random().toString(36).substring(2, 15),
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      url: `/uploads/${file.name}`,
      uploadedAt: new Date().toISOString(),
    };
    
    return {
      success: true,
      data: fileUpload,
      message: 'File uploaded successfully',
    };
  }

  // QR Code Generation
  async generateQRCode(contentId: number): Promise<MockAPIResponse<QRCode>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const content = this.generateMockContent(50);
    const item = content.find(c => c.id === contentId);
    
    if (!item) {
      return {
        success: false,
        data: {} as QRCode,
        message: 'Content not found',
      };
    }
    
    const qrCode: QRCode = {
      id: Math.floor(Math.random() * 1000) + 1,
      contentId,
      code: item.qrCode,
      imageUrl: `/qr-codes/${item.qrCode}.png`,
      generatedAt: new Date().toISOString(),
    };
    
    return {
      success: true,
      data: qrCode,
      message: 'QR code generated successfully',
    };
  }

  // Quizzes API
  async getQuizzes(params?: QuizFilters): Promise<MockAPIResponse<Quiz[]>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let quizzes = this.generateMockQuizzes(50); // Generate more quizzes for better testing
    
    // Apply filters
    if (params?.subject) {
      quizzes = quizzes.filter(quiz => quiz.subject === params.subject);
    }
    
    if (params?.gradeLevel) {
      quizzes = quizzes.filter(quiz => quiz.gradeLevel === params.gradeLevel);
    }
    
    if (params?.status) {
      quizzes = quizzes.filter(quiz => quiz.status === params.status);
    }
    
    if (params?.associatedContentId) {
      quizzes = quizzes.filter(quiz => quiz.associatedContentId === params.associatedContentId);
    }
    
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      quizzes = quizzes.filter(quiz =>
        quiz.title.toLowerCase().includes(searchLower) ||
        (quiz.description && quiz.description.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply sorting
    if (params?.sortBy) {
      const sortOrder = params.sortOrder || 'asc';
      quizzes.sort((a, b) => {
        let aValue: any = a[params.sortBy!];
        let bValue: any = b[params.sortBy!];
        
        if (params.sortBy === 'createdAt') {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        } else if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (sortOrder === 'desc') {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        }
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      });
    }

    // Add associated content data
    const content = this.generateMockContent(50);
    quizzes = quizzes.map(quiz => ({
      ...quiz,
      associatedContent: quiz.associatedContentId
        ? content.find(c => c.id === quiz.associatedContentId)
        : undefined
    }));

    const page = params?.page || 1;
    const perPage = params?.per_page || 10;
    const start = (page - 1) * perPage;
    const paginatedQuizzes = quizzes.slice(start, start + perPage);

    return {
      success: true,
      data: paginatedQuizzes,
      pagination: {
        current_page: page,
        total: quizzes.length,
        per_page: perPage,
      },
    };
  }

  async getQuizById(id: number): Promise<MockAPIResponse<Quiz>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const quizzes = this.generateMockQuizzes(50);
    const quiz = quizzes.find(q => q.id === id);
    
    if (!quiz) {
      return {
        success: false,
        data: {} as Quiz,
        message: 'Quiz not found',
      };
    }

    // Add associated content data
    const content = this.generateMockContent(50);
    const quizWithContent = {
      ...quiz,
      associatedContent: quiz.associatedContentId
        ? content.find(c => c.id === quiz.associatedContentId)
        : undefined
    };
    
    return {
      success: true,
      data: quizWithContent,
    };
  }

  async createQuiz(quizData: CreateQuizData): Promise<MockAPIResponse<Quiz>> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Create new quiz
    const existingQuizzes = this.generateMockQuizzes(50);
    const newId = Math.max(...existingQuizzes.map(q => q.id)) + 1;
    
    const newQuiz: Quiz = {
      id: newId,
      title: quizData.title,
      description: quizData.description,
      subject: quizData.subject,
      gradeLevel: quizData.gradeLevel,
      timeLimit: quizData.timeLimit,
      maxAttempts: quizData.maxAttempts,
      scoringMethod: quizData.scoringMethod,
      status: 'draft', // New quizzes start as draft
      associatedContentId: quizData.associatedContentId,
      questionsCount: 0, // No questions initially
      totalPoints: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 1, // Mock current user ID
    };

    // Add associated content data if provided
    if (newQuiz.associatedContentId) {
      const content = this.generateMockContent(50);
      newQuiz.associatedContent = content.find(c => c.id === newQuiz.associatedContentId);
    }
    
    return {
      success: true,
      data: newQuiz,
      message: 'Quiz created successfully',
    };
  }

  async updateQuiz(id: number, quizData: UpdateQuizData): Promise<MockAPIResponse<Quiz>> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const quizzes = this.generateMockQuizzes(50);
    const existingQuiz = quizzes.find(q => q.id === id);
    
    if (!existingQuiz) {
      return {
        success: false,
        data: {} as Quiz,
        message: 'Quiz not found',
      };
    }
    
    // Update quiz
    const updatedQuiz: Quiz = {
      ...existingQuiz,
      ...quizData,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };

    // Add associated content data if provided
    if (updatedQuiz.associatedContentId) {
      const content = this.generateMockContent(50);
      updatedQuiz.associatedContent = content.find(c => c.id === updatedQuiz.associatedContentId);
    }
    
    return {
      success: true,
      data: updatedQuiz,
      message: 'Quiz updated successfully',
    };
  }

  async deleteQuiz(id: number): Promise<MockAPIResponse<void>> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const quizzes = this.generateMockQuizzes(50);
    const quizExists = quizzes.some(q => q.id === id);
    
    if (!quizExists) {
      return {
        success: false,
        data: undefined,
        message: 'Quiz not found',
      };
    }
    
    return {
      success: true,
      data: undefined,
      message: 'Quiz deleted successfully',
    };
  }

  // Questions API
  async getQuizQuestions(quizId: number): Promise<MockAPIResponse<Question[]>> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const questions = this.generateMockQuestions(quizId, 10);
    
    return {
      success: true,
      data: questions,
    };
  }

  async createQuestion(quizId: number, questionData: CreateQuestionData): Promise<MockAPIResponse<Question>> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Validate question data
    if (questionData.options.length !== 4) {
      return {
        success: false,
        data: {} as Question,
        message: 'Question must have exactly 4 options',
      };
    }

    if (questionData.correctAnswer < 0 || questionData.correctAnswer > 3) {
      return {
        success: false,
        data: {} as Question,
        message: 'Correct answer must be between 0 and 3',
      };
    }
    
    const existingQuestions = this.generateMockQuestions(quizId, 10);
    const newId = Math.max(...existingQuestions.map(q => q.id), 0) + 1;
    const newOrder = existingQuestions.length + 1;
    
    const newQuestion: Question = {
      id: newId,
      quizId,
      title: questionData.title,
      options: questionData.options,
      correctAnswer: questionData.correctAnswer,
      order: newOrder,
      points: questionData.points,
      explanation: questionData.explanation,
    };
    
    return {
      success: true,
      data: newQuestion,
      message: 'Question created successfully',
    };
  }

  async updateQuestion(id: number, questionData: UpdateQuestionData): Promise<MockAPIResponse<Question>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find question (mock implementation)
    const quizId = Math.floor(id / 100); // Extract quiz ID from question ID
    const questions = this.generateMockQuestions(quizId, 10);
    const existingQuestion = questions.find(q => q.id === id);
    
    if (!existingQuestion) {
      return {
        success: false,
        data: {} as Question,
        message: 'Question not found',
      };
    }

    // Validate if options are being updated
    if (questionData.options && questionData.options.length !== 4) {
      return {
        success: false,
        data: {} as Question,
        message: 'Question must have exactly 4 options',
      };
    }

    if (questionData.correctAnswer !== undefined &&
        (questionData.correctAnswer < 0 || questionData.correctAnswer > 3)) {
      return {
        success: false,
        data: {} as Question,
        message: 'Correct answer must be between 0 and 3',
      };
    }
    
    const updatedQuestion: Question = {
      ...existingQuestion,
      ...questionData,
      id, // Ensure ID doesn't change
    };
    
    return {
      success: true,
      data: updatedQuestion,
      message: 'Question updated successfully',
    };
  }

  async deleteQuestion(id: number): Promise<MockAPIResponse<void>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock validation - in real implementation, would check if question exists
    return {
      success: true,
      data: undefined,
      message: 'Question deleted successfully',
    };
  }

  async reorderQuestions(quizId: number, questionIds: number[]): Promise<MockAPIResponse<Question[]>> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const questions = this.generateMockQuestions(quizId, questionIds.length);
    
    // Reorder questions based on provided IDs
    const reorderedQuestions = questionIds.map((id, index) => {
      const question = questions.find(q => q.id === id);
      return question ? { ...question, order: index + 1 } : questions[index];
    });
    
    return {
      success: true,
      data: reorderedQuestions,
      message: 'Questions reordered successfully',
    };
  }

  // Quiz Attempts API
  async getQuizAttempts(params?: QuizAttemptFilters): Promise<MockAPIResponse<QuizAttempt[]>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let attempts: QuizAttempt[] = [];
    
    if (params?.quizId) {
      attempts = this.generateMockQuizAttempts(params.quizId, 30);
    } else {
      // Generate attempts for multiple quizzes
      for (let quizId = 1; quizId <= 10; quizId++) {
        attempts.push(...this.generateMockQuizAttempts(quizId, 5));
      }
    }
    
    // Apply filters
    if (params?.userId) {
      attempts = attempts.filter(attempt => attempt.userId === params.userId);
    }
    
    if (params?.status) {
      attempts = attempts.filter(attempt => attempt.status === params.status);
    }
    
    if (params?.dateFrom) {
      const fromDate = new Date(params.dateFrom);
      attempts = attempts.filter(attempt => new Date(attempt.startedAt) >= fromDate);
    }
    
    if (params?.dateTo) {
      const toDate = new Date(params.dateTo);
      attempts = attempts.filter(attempt => new Date(attempt.startedAt) <= toDate);
    }
    
    // Apply sorting
    if (params?.sortBy) {
      const sortOrder = params.sortOrder || 'desc';
      attempts.sort((a, b) => {
        let aValue: any = a[params.sortBy!];
        let bValue: any = b[params.sortBy!];
        
        if (params.sortBy === 'startedAt' || params.sortBy === 'completedAt') {
          aValue = new Date(aValue || 0).getTime();
          bValue = new Date(bValue || 0).getTime();
        }
        
        if (sortOrder === 'desc') {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        }
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      });
    }

    // Add user and quiz data
    const users = this.generateMockUsers(100);
    const quizzes = this.generateMockQuizzes(50);
    
    attempts = attempts.map(attempt => ({
      ...attempt,
      user: users.find(u => u.id === attempt.userId),
      quiz: quizzes.find(q => q.id === attempt.quizId),
    }));

    const page = params?.page || 1;
    const perPage = params?.per_page || 10;
    const start = (page - 1) * perPage;
    const paginatedAttempts = attempts.slice(start, start + perPage);

    return {
      success: true,
      data: paginatedAttempts,
      pagination: {
        current_page: page,
        total: attempts.length,
        per_page: perPage,
      },
    };
  }

  async getQuizAttemptById(id: number): Promise<MockAPIResponse<QuizAttempt>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Extract quiz ID from attempt ID (mock implementation)
    const quizId = Math.floor(id / 1000);
    const attempts = this.generateMockQuizAttempts(quizId, 30);
    const attempt = attempts.find(a => a.id === id);
    
    if (!attempt) {
      return {
        success: false,
        data: {} as QuizAttempt,
        message: 'Quiz attempt not found',
      };
    }

    // Add user and quiz data
    const users = this.generateMockUsers(100);
    const quizzes = this.generateMockQuizzes(50);
    
    const attemptWithData = {
      ...attempt,
      user: users.find(u => u.id === attempt.userId),
      quiz: quizzes.find(q => q.id === attempt.quizId),
    };
    
    return {
      success: true,
      data: attemptWithData,
    };
  }

  async startQuizAttempt(quizId: number, userId: number): Promise<MockAPIResponse<QuizAttempt>> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newAttempt: QuizAttempt = {
      id: Date.now(), // Simple ID generation
      quizId,
      userId,
      startedAt: new Date().toISOString(),
      score: 0,
      totalPoints: 20, // Mock total points
      percentage: 0,
      timeSpent: 0,
      answers: [],
      status: 'in_progress',
    };
    
    return {
      success: true,
      data: newAttempt,
      message: 'Quiz attempt started successfully',
    };
  }

  async submitQuizAttempt(attemptId: number, answers: QuizAnswer[]): Promise<MockAPIResponse<QuizAttempt>> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Calculate score based on answers
    const totalPoints = 20;
    const score = answers.reduce((sum, answer) => sum + answer.pointsEarned, 0);
    const percentage = Math.round((score / totalPoints) * 100);
    const timeSpent = answers.reduce((sum, answer) => sum + answer.timeSpent, 0);
    
    const completedAttempt: QuizAttempt = {
      id: attemptId,
      quizId: Math.floor(attemptId / 1000), // Extract quiz ID
      userId: 1, // Mock user ID
      startedAt: new Date(Date.now() - timeSpent * 1000).toISOString(),
      completedAt: new Date().toISOString(),
      score,
      totalPoints,
      percentage,
      timeSpent,
      answers,
      status: 'completed',
    };
    
    return {
      success: true,
      data: completedAttempt,
      message: 'Quiz attempt submitted successfully',
    };
  }

  // Analytics API Methods
  private generateMockAnalyticsData(dateRange: DateRange): AnalyticsData {
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    // Generate overview metrics
    const overview: OverviewMetrics = {
      totalStudents: 1156,
      activeContent: 156,
      quizCompletionRate: 78.5,
      arSessionsThisMonth: 3421,
      previousPeriod: {
        totalStudents: 1089,
        activeContent: 142,
        quizCompletionRate: 74.2,
        arSessionsThisMonth: 2987,
      },
    };

    // Generate student progress data
    const studentProgress: StudentProgressData[] = Array.from({ length: 20 }, (_, i) => ({
      userId: i + 1,
      userName: `Student ${i + 1}`,
      gradeLevel: `Grade ${Math.floor(Math.random() * 6) + 1}`,
      subject: Math.random() > 0.5 ? 'History' : 'Science',
      completionRate: Math.floor(Math.random() * 40) + 60, // 60-100%
      averageScore: Math.floor(Math.random() * 30) + 70, // 70-100
      timeSpent: Math.floor(Math.random() * 120) + 30, // 30-150 minutes
      lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      quizzesCompleted: Math.floor(Math.random() * 15) + 5,
      arSessionsCount: Math.floor(Math.random() * 25) + 10,
      progressOverTime: Array.from({ length: Math.min(daysDiff, 30) }, (_, j) => ({
        date: new Date(startDate.getTime() + j * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        completionRate: Math.floor(Math.random() * 20) + 60 + j,
        score: Math.floor(Math.random() * 20) + 70 + j * 0.5,
      })),
    }));

    // Generate content engagement data
    const contentEngagement: ContentEngagementData[] = Array.from({ length: 15 }, (_, i) => ({
      contentId: i + 1,
      title: `Content Item ${i + 1}`,
      subject: Math.random() > 0.5 ? 'History' : 'Science',
      gradeLevel: `Grade ${Math.floor(Math.random() * 6) + 1}`,
      type: Math.random() > 0.5 ? '3d_model' : 'audio',
      qrScans: Math.floor(Math.random() * 500) + 100,
      averageSessionDuration: Math.floor(Math.random() * 15) + 5, // 5-20 minutes
      completionRate: Math.floor(Math.random() * 40) + 60,
      lastAccessed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      popularityRank: i + 1,
      engagementTrend: Array.from({ length: Math.min(daysDiff, 30) }, (_, j) => ({
        date: new Date(startDate.getTime() + j * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        scans: Math.floor(Math.random() * 50) + 10,
        duration: Math.floor(Math.random() * 10) + 5,
      })),
    }));

    // Generate quiz analytics data
    const quizAnalytics: QuizAnalyticsData = {
      totalQuizzes: 89,
      totalAttempts: 2341,
      averageScore: 82.3,
      completionRate: 78.5,
      quizPerformance: Array.from({ length: 10 }, (_, i) => ({
        quizId: i + 1,
        title: `Quiz ${i + 1}`,
        subject: Math.random() > 0.5 ? 'History' : 'Science',
        gradeLevel: `Grade ${Math.floor(Math.random() * 6) + 1}`,
        attempts: Math.floor(Math.random() * 100) + 50,
        averageScore: Math.floor(Math.random() * 30) + 70,
        completionRate: Math.floor(Math.random() * 40) + 60,
        averageTimeSpent: Math.floor(Math.random() * 20) + 10,
        difficultyRating: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)] as 'Easy' | 'Medium' | 'Hard',
      })),
      questionDifficulty: Array.from({ length: 15 }, (_, i) => ({
        questionId: i + 1,
        quizTitle: `Quiz ${Math.floor(i / 3) + 1}`,
        question: `Question ${i + 1}`,
        correctAnswers: Math.floor(Math.random() * 80) + 20,
        totalAnswers: Math.floor(Math.random() * 50) + 100,
        accuracyRate: Math.floor(Math.random() * 40) + 60,
        averageTimeSpent: Math.floor(Math.random() * 60) + 30,
        difficultyLevel: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)] as 'Easy' | 'Medium' | 'Hard',
      })),
      subjectComparison: [
        {
          subject: 'History',
          totalStudents: 578,
          averageScore: 81.2,
          completionRate: 76.8,
          timeSpent: 145,
          contentAccessed: 78,
          quizzesCompleted: 234,
        },
        {
          subject: 'Science',
          totalStudents: 578,
          averageScore: 83.4,
          completionRate: 80.2,
          timeSpent: 162,
          contentAccessed: 78,
          quizzesCompleted: 267,
        },
      ],
    };

    return {
      overview,
      studentProgress,
      contentEngagement,
      quizAnalytics,
      dateRange,
    };
  }

  async getAnalytics(filters?: AnalyticsFilters): Promise<AnalyticsResponse<AnalyticsData>> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const dateRange = filters?.dateRange || {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      preset: 'last30days',
    };

    let analyticsData = this.generateMockAnalyticsData(dateRange);

    // Apply filters
    if (filters?.gradeLevel) {
      analyticsData.studentProgress = analyticsData.studentProgress.filter(
        student => student.gradeLevel === filters.gradeLevel
      );
      analyticsData.contentEngagement = analyticsData.contentEngagement.filter(
        content => content.gradeLevel === filters.gradeLevel
      );
    }

    if (filters?.subject) {
      analyticsData.studentProgress = analyticsData.studentProgress.filter(
        student => student.subject === filters.subject
      );
      analyticsData.contentEngagement = analyticsData.contentEngagement.filter(
        content => content.subject === filters.subject
      );
      analyticsData.quizAnalytics.quizPerformance = analyticsData.quizAnalytics.quizPerformance.filter(
        quiz => quiz.subject === filters.subject
      );
    }

    if (filters?.contentType) {
      analyticsData.contentEngagement = analyticsData.contentEngagement.filter(
        content => content.type === filters.contentType
      );
    }

    return {
      success: true,
      data: analyticsData,
      generatedAt: new Date().toISOString(),
      cacheExpiry: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes cache
    };
  }

  async getStudentProgress(userId: number, dateRange?: DateRange): Promise<AnalyticsResponse<StudentProgressData>> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const range = dateRange || {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      preset: 'last30days',
    };

    const analyticsData = this.generateMockAnalyticsData(range);
    const studentData = analyticsData.studentProgress.find(student => student.userId === userId);

    if (!studentData) {
      return {
        success: false,
        data: {} as StudentProgressData,
        message: 'Student not found',
        generatedAt: new Date().toISOString(),
      };
    }

    return {
      success: true,
      data: studentData,
      generatedAt: new Date().toISOString(),
    };
  }

  async getContentEngagement(dateRange?: DateRange): Promise<AnalyticsResponse<ContentEngagementData[]>> {
    await new Promise(resolve => setTimeout(resolve, 600));

    const range = dateRange || {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      preset: 'last30days',
    };

    const analyticsData = this.generateMockAnalyticsData(range);

    return {
      success: true,
      data: analyticsData.contentEngagement,
      generatedAt: new Date().toISOString(),
    };
  }

  async generateReport(type: 'student_progress' | 'content_engagement' | 'quiz_performance', filters?: AnalyticsFilters): Promise<AnalyticsResponse<ReportData>> {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Longer delay for report generation

    const dateRange = filters?.dateRange || {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      preset: 'last30days',
    };

    const analyticsData = this.generateMockAnalyticsData(dateRange);
    let reportData: any;

    switch (type) {
      case 'student_progress':
        reportData = analyticsData.studentProgress;
        break;
      case 'content_engagement':
        reportData = analyticsData.contentEngagement;
        break;
      case 'quiz_performance':
        reportData = analyticsData.quizAnalytics;
        break;
      default:
        reportData = analyticsData;
    }

    const report: ReportData = {
      id: Math.random().toString(36).substring(2, 15),
      type,
      title: `${type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Report`,
      generatedAt: new Date().toISOString(),
      dateRange,
      filters: filters || { dateRange },
      data: reportData,
      format: 'pdf',
    };

    return {
      success: true,
      data: report,
      message: 'Report generated successfully',
      generatedAt: new Date().toISOString(),
    };
  }
}

// Export singleton instance
export const mockApi = new MockAPIService();
export default mockApi;