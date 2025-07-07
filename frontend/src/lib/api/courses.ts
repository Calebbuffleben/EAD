import api from '../api';

// Helper function to convert Prisma Decimal to number
const convertDecimalToNumber = (value: any): number => {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value) || 0;
  // Handle Prisma Decimal object
  if (value && typeof value === 'object' && 'toNumber' in value) {
    return value.toNumber();
  }
  return 0;
};

// Helper function to process course data
const processCourseData = (course: any): Course => ({
  ...course,
  price: convertDecimalToNumber(course.price),
});

export interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  price: number; // This will be converted from Prisma Decimal
  isPublished: boolean;
  organizationId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  organization?: {
    id: string;
    name: string;
    logo?: string;
    description?: string;
  };
  createdBy?: {
    id: string;
    name: string;
  };
  chapters?: Chapter[];
  _count?: {
    chapters: number;
    purchases: number;
  };
}

export interface Chapter {
  id: string;
  title: string;
  description?: string;
  courseId: string;
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  content?: string;
  videoUrl?: string;
  duration?: number;
  chapterId: string;
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseData {
  title: string;
  description?: string;
  thumbnail?: string;
  price: number;
  isPublished?: boolean;
  organizationId: string;
  createdById: string;
}

export interface CreateChapterData {
  title: string;
  description?: string;
  order: number;
  isPublished?: boolean;
}

export interface CreateLessonData {
  title: string;
  content?: string;
  videoUrl?: string;
  duration?: number;
  order: number;
  isPublished?: boolean;
}

// Course API functions
export const coursesApi = {
  // Get all courses
  getAll: async (organizationId?: string): Promise<Course[]> => {
    const params = organizationId ? { organizationId } : {};
    const response = await api.get('/courses', { params });
    return response.data.map(processCourseData);
  },

  // Get published courses only
  getPublished: async (): Promise<Course[]> => {
    const response = await api.get('/courses/published');
    return response.data.map(processCourseData);
  },

  // Get course by ID
  getById: async (id: string): Promise<Course> => {
    const response = await api.get(`/courses/${id}`);
    return processCourseData(response.data);
  },

  // Create new course
  create: async (data: CreateCourseData): Promise<Course> => {
    const response = await api.post('/courses', data);
    return processCourseData(response.data);
  },

  // Update course
  update: async (id: string, data: Partial<CreateCourseData>): Promise<Course> => {
    const response = await api.put(`/courses/${id}`, data);
    return processCourseData(response.data);
  },

  // Delete course
  delete: async (id: string): Promise<void> => {
    await api.delete(`/courses/${id}`);
  },

  // Chapter API functions
  getChapters: async (courseId: string): Promise<Chapter[]> => {
    const response = await api.get(`/courses/${courseId}/chapters`);
    return response.data;
  },

  getChapter: async (courseId: string, chapterId: string): Promise<Chapter> => {
    const response = await api.get(`/courses/${courseId}/chapters/${chapterId}`);
    return response.data;
  },

  createChapter: async (courseId: string, data: CreateChapterData): Promise<Chapter> => {
    const response = await api.post(`/courses/${courseId}/chapters`, data);
    return response.data;
  },

  updateChapter: async (courseId: string, chapterId: string, data: Partial<CreateChapterData>): Promise<Chapter> => {
    const response = await api.put(`/courses/${courseId}/chapters/${chapterId}`, data);
    return response.data;
  },

  deleteChapter: async (courseId: string, chapterId: string): Promise<void> => {
    await api.delete(`/courses/${courseId}/chapters/${chapterId}`);
  },

  // Lesson API functions
  getLessons: async (courseId: string, chapterId: string): Promise<Lesson[]> => {
    const response = await api.get(`/courses/${courseId}/chapters/${chapterId}/lessons`);
    return response.data;
  },

  getLesson: async (courseId: string, chapterId: string, lessonId: string): Promise<Lesson> => {
    const response = await api.get(`/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`);
    return response.data;
  },

  createLesson: async (courseId: string, chapterId: string, data: CreateLessonData): Promise<Lesson> => {
    const response = await api.post(`/courses/${courseId}/chapters/${chapterId}/lessons`, data);
    return response.data;
  },

  updateLesson: async (courseId: string, chapterId: string, lessonId: string, data: Partial<CreateLessonData>): Promise<Lesson> => {
    const response = await api.put(`/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`, data);
    return response.data;
  },

  deleteLesson: async (courseId: string, chapterId: string, lessonId: string): Promise<void> => {
    await api.delete(`/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`);
  },

  // Purchase API functions
  purchaseCourse: async (courseId: string, data: { studentId: string; amount: number }): Promise<any> => {
    const response = await api.post(`/courses/${courseId}/purchase`, data);
    return response.data;
  },

  getCoursePurchases: async (courseId: string): Promise<any[]> => {
    const response = await api.get(`/courses/${courseId}/purchases`);
    return response.data;
  },
}; 