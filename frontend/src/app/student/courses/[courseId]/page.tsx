'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Play, 
  CheckCircle, 
  Clock, 
  BookOpen,
  Lock,
  Unlock,
  Calendar,
  Award
} from "lucide-react";
import Link from "next/link";
import { coursesApi, Course, Chapter, Lesson } from "@/lib/api/courses";
import { studentsApi, Student } from "@/lib/api/students";
import Header from "@/components/Header";

export default function StudentCourseProgressPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        
        // Fetch course details
        const courseData = await coursesApi.getById(courseId);
        setCourse(courseData);
        
        // For demo purposes, get the first student
        // In a real app, this would be the authenticated user
        const students = await studentsApi.getAll();
        if (students.length > 0) {
          setStudent(students[0]);
        }
      } catch (err) {
        console.error('Error fetching course data:', err);
        setError('Failed to load course data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const getLessonProgress = (lessonId: string) => {
    // In a real app, this would check actual lesson progress
    // For now, return random progress
    return Math.random() > 0.5 ? 100 : Math.floor(Math.random() * 100);
  };

  const getChapterProgress = (chapter: Chapter) => {
    if (!chapter.lessons || chapter.lessons.length === 0) return 0;
    
    const totalLessons = chapter.lessons.length;
    const completedLessons = chapter.lessons.filter(lesson => 
      getLessonProgress(lesson.id) === 100
    ).length;
    
    return Math.round((completedLessons / totalLessons) * 100);
  };

  const getOverallProgress = () => {
    if (!course?.chapters || course.chapters.length === 0) return 0;
    
    const totalChapters = course.chapters.length;
    const completedChapters = course.chapters.filter(chapter => 
      getChapterProgress(chapter) === 100
    ).length;
    
    return Math.round((completedChapters / totalChapters) * 100);
  };

  const getTotalDuration = () => {
    if (!course?.chapters) return 0;
    
    return course.chapters.reduce((total, chapter) => {
      if (!chapter.lessons) return total;
      return total + chapter.lessons.reduce((chapterTotal, lesson) => {
        return chapterTotal + (lesson.duration || 0);
      }, 0);
    }, 0);
  };

  const getCompletedLessons = () => {
    if (!course?.chapters) return 0;
    
    return course.chapters.reduce((total, chapter) => {
      if (!chapter.lessons) return total;
      return total + chapter.lessons.filter(lesson => 
        getLessonProgress(lesson.id) === 100
      ).length;
    }, 0);
  };

  const getTotalLessons = () => {
    if (!course?.chapters) return 0;
    
    return course.chapters.reduce((total, chapter) => {
      if (!chapter.lessons) return total;
      return total + chapter.lessons.length;
    }, 0);
  };

  if (loading) {
    return (
      <>
        <Header showStudentNav={true} />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header showStudentNav={true} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </>
    );
  }

  if (!course) {
    return (
      <>
        <Header showStudentNav={true} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Course Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              The course you're looking for doesn't exist or you don't have access to it.
            </p>
            <Button asChild>
              <Link href="/student">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  const overallProgress = getOverallProgress();
  const totalDuration = getTotalDuration();
  const completedLessons = getCompletedLessons();
  const totalLessons = getTotalLessons();

  return (
    <>
      <Header showStudentNav={true} />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/student">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track your progress and continue learning
              </p>
            </div>
            <Button asChild>
              <Link href={`/courses/${courseId}`}>
                <Play className="h-4 w-4 mr-2" />
                Continue Learning
              </Link>
            </Button>
          </div>
        </div>

        {/* Course Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Course Progress</CardTitle>
            <CardDescription>
              Your overall progress in this course
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Overall Progress Bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Overall Progress</span>
                  <span>{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-3" />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{course.chapters?.length || 0}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Chapters</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{totalLessons}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Lessons</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{completedLessons}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{Math.round(totalDuration / 60)}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Hours</div>
                </div>
              </div>

              {/* Completion Status */}
              {overallProgress === 100 && (
                <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <Award className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800 dark:text-green-200">
                    Congratulations! You've completed this course.
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chapters and Lessons */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Course Content</h2>
          
          {!course.chapters || course.chapters.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No content available</h3>
                <p className="text-muted-foreground">
                  This course doesn't have any chapters or lessons yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {course.chapters.map((chapter, chapterIndex) => {
                const chapterProgress = getChapterProgress(chapter);
                const isChapterUnlocked = chapterIndex === 0 || 
                  (course.chapters && getChapterProgress(course.chapters[chapterIndex - 1]) === 100);
                
                return (
                  <Card key={chapter.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {isChapterUnlocked ? (
                              <Unlock className="h-4 w-4 text-green-600" />
                            ) : (
                              <Lock className="h-4 w-4 text-gray-400" />
                            )}
                            <span className="text-sm font-medium text-muted-foreground">
                              Chapter {chapterIndex + 1}
                            </span>
                            <Badge className={`${
                              chapterProgress === 100 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            }`}>
                              {chapterProgress === 100 ? 'Completed' : `${chapterProgress}%`}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg">{chapter.title}</CardTitle>
                          <CardDescription>{chapter.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {chapter.lessons && chapter.lessons.length > 0 ? (
                        <div className="space-y-3">
                          {chapter.lessons.map((lesson, lessonIndex) => {
                            const lessonProgress = getLessonProgress(lesson.id);
                            const isLessonUnlocked = isChapterUnlocked && 
                              (lessonIndex === 0 || (chapter.lessons && getLessonProgress(chapter.lessons[lessonIndex - 1].id) === 100));
                            
                            return (
                              <div 
                                key={lesson.id} 
                                className={`flex items-center justify-between p-3 rounded-lg border ${
                                  isLessonUnlocked 
                                    ? 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700' 
                                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                                }`}
                              >
                                <div className="flex items-center gap-3 flex-1">
                                  <div className="flex items-center gap-2">
                                    {lessonProgress === 100 ? (
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    ) : isLessonUnlocked ? (
                                      <Play className="h-4 w-4 text-blue-600" />
                                    ) : (
                                      <Lock className="h-4 w-4 text-gray-400" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">
                                        {lessonIndex + 1}. {lesson.title}
                                      </span>
                                      {lessonProgress > 0 && lessonProgress < 100 && (
                                        <Badge variant="outline" className="text-xs">
                                          {lessonProgress}%
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        <span>{Math.round((lesson.duration || 0) / 60)} min</span>
                                      </div>
                                      {lessonProgress === 100 && (
                                        <div className="flex items-center gap-1">
                                          <Calendar className="h-3 w-3" />
                                          <span>Completed</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {isLessonUnlocked && lessonProgress < 100 && (
                                  <Button variant="outline" size="sm" asChild>
                                    <Link href={`/courses/${courseId}/lessons/${lesson.id}`}>
                                      <Play className="h-4 w-4 mr-2" />
                                      Continue
                                    </Link>
                                  </Button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          No lessons available in this chapter.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
} 