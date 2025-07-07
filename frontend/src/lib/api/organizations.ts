import api from '../api';

export interface TeacherOrganization {
  id: string;
  name: string;
  description?: string;
  website?: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
  teamMembers?: TeacherTeamMember[];
  courses?: Course[];
  _count?: {
    courses: number;
  };
}

export interface TeacherTeamMember {
  id: string;
  organizationId: string;
  clerkUserId: string;
  email: string;
  name: string;
  role: TeacherRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  organization?: {
    id: string;
    name: string;
  };
  courses?: Course[];
  _count?: {
    courses: number;
  };
}

export interface Course {
  id: string;
  title: string;
  isPublished: boolean;
  _count?: {
    purchases: number;
  };
}

export enum TeacherRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  ASSISTANT = 'ASSISTANT',
}

export interface CreateOrganizationData {
  name: string;
  description?: string;
  website?: string;
  logo?: string;
}

export interface CreateTeamMemberData {
  clerkUserId: string;
  email: string;
  name: string;
  role?: TeacherRole;
}

export interface UpdateTeamMemberData {
  email?: string;
  name?: string;
  role?: TeacherRole;
  isActive?: boolean;
}

// Teacher Organization API functions
export const organizationsApi = {
  // Get all organizations
  getAll: async (): Promise<TeacherOrganization[]> => {
    const response = await api.get('/teacher-organizations');
    return response.data;
  },

  // Get organization by ID
  getById: async (id: string): Promise<TeacherOrganization> => {
    const response = await api.get(`/teacher-organizations/${id}`);
    return response.data;
  },

  // Create new organization
  create: async (data: CreateOrganizationData): Promise<TeacherOrganization> => {
    const response = await api.post('/teacher-organizations', data);
    return response.data;
  },

  // Update organization
  update: async (id: string, data: Partial<CreateOrganizationData>): Promise<TeacherOrganization> => {
    const response = await api.put(`/teacher-organizations/${id}`, data);
    return response.data;
  },

  // Delete organization
  delete: async (id: string): Promise<void> => {
    await api.delete(`/teacher-organizations/${id}`);
  },

  // Team Member API functions
  getTeamMembers: async (organizationId: string): Promise<TeacherTeamMember[]> => {
    const response = await api.get(`/teacher-organizations/${organizationId}/team-members`);
    return response.data;
  },

  getTeamMember: async (organizationId: string, memberId: string): Promise<TeacherTeamMember> => {
    const response = await api.get(`/teacher-organizations/${organizationId}/team-members/${memberId}`);
    return response.data;
  },

  createTeamMember: async (organizationId: string, data: CreateTeamMemberData): Promise<TeacherTeamMember> => {
    const response = await api.post(`/teacher-organizations/${organizationId}/team-members`, data);
    return response.data;
  },

  updateTeamMember: async (organizationId: string, memberId: string, data: UpdateTeamMemberData): Promise<TeacherTeamMember> => {
    const response = await api.put(`/teacher-organizations/${organizationId}/team-members/${memberId}`, data);
    return response.data;
  },

  deleteTeamMember: async (organizationId: string, memberId: string): Promise<void> => {
    await api.delete(`/teacher-organizations/${organizationId}/team-members/${memberId}`);
  },
}; 