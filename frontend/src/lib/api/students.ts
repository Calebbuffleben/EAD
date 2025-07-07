import api from '../api';

export interface Student {
  id: string;
  clerkUserId: string;
  email: string;
  name: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  purchases?: CoursePurchase[];
  progress?: LessonProgress[];
  _count?: {
    purchases: number;
  };
}

export interface CoursePurchase {
  id: string;
  studentId: string;
  courseId: string;
  purchasedAt: string;
  amount: number;
  isActive: boolean;
  course?: {
    id: string;
    title: string;
    thumbnail?: string;
    organization?: {
      name: string;
    };
  };
}

export interface LessonProgress {
  id: string;
  studentId: string;
  lessonId: string;
  isCompleted: boolean;
  watchedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  lesson?: {
    id: string;
    title: string;
    chapter?: {
      id: string;
      title: string;
      courseId: string;
    };
  };
}

export interface CreateStudentData {
  clerkUserId: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface UpdateStudentData {
  email?: string;
  name?: string;
  avatar?: string;
}

// Student API functions
export const studentsApi = {
  // Get all students
  getAll: async (): Promise<Student[]> => {
    const response = await api.get('/students');
    return response.data;
  },

  // Get student by ID
  getById: async (id: string): Promise<Student> => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  // Get student by Clerk user ID
  getByClerkUserId: async (clerkUserId: string): Promise<Student> => {
    const response = await api.get(`/students/clerk/${clerkUserId}`);
    return response.data;
  },

  // Create new student
  create: async (data: CreateStudentData): Promise<Student> => {
    const response = await api.post('/students', data);
    return response.data;
  },

  // Update student
  update: async (id: string, data: UpdateStudentData): Promise<Student> => {
    const response = await api.put(`/students/${id}`, data);
    return response.data;
  },

  // Delete student
  delete: async (id: string): Promise<void> => {
    await api.delete(`/students/${id}`);
  },

  // Get student purchases
  getPurchases: async (studentId: string): Promise<CoursePurchase[]> => {
    const response = await api.get(`/students/${studentId}/purchases`);
    return response.data;
  },

  // Purchase course
  purchaseCourse: async (studentId: string, courseId: string, amount: number): Promise<CoursePurchase> => {
    const response = await api.post(`/students/${studentId}/purchase/${courseId}`, { amount });
    return response.data;
  },
}; 