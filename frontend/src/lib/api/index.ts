// Export API instance
export { default as api } from '../api';

// Export API services
export * from './courses';
export * from './students';
export * from './organizations';

// Re-export types for convenience
export type {
  Course,
  Chapter,
  Lesson,
  CreateCourseData,
  CreateChapterData,
  CreateLessonData,
} from './courses';

export type {
  Student,
  CoursePurchase,
  LessonProgress,
  CreateStudentData,
  UpdateStudentData,
} from './students';

export type {
  TeacherOrganization,
  TeacherTeamMember,
  CreateOrganizationData,
  CreateTeamMemberData,
  UpdateTeamMemberData,
} from './organizations';

export { TeacherRole } from './organizations'; 