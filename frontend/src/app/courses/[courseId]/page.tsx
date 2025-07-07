'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Star, Clock, Users, BookOpen, Play, Check, Heart, Share2, Bookmark, Calendar, Award, Zap } from "lucide-react";
import Link from "next/link";
import { coursesApi, Course, Chapter } from "@/lib/api/courses";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const courseData = await coursesApi.getById(courseId);
        setCourse(courseData);
        
        // Fetch chapters
        const chaptersData = await coursesApi.getChapters(courseId);
        setChapters(chaptersData);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('Failed to load course data.');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const getCourseRating = (course: Course) => {
    const baseRating = 4.0;
    const purchaseBonus = Math.min((course._count?.purchases || 0) / 100, 1);
    return (baseRating + purchaseBonus).toFixed(1);
  };

  const getCourseLevel = (course: Course) => {
    const purchaseCount = course._count?.purchases || 0;
    if (purchaseCount > 1000) return { level: 'Advanced', color: 'bg-red-100 text-red-800' };
    if (purchaseCount > 500) return { level: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' };
    return { level: 'Beginner', color: 'bg-green-100 text-green-800' };
  };

  const getCourseDuration = (course: Course) => {
    const chapters = course._count?.chapters || 0;
    const hours = Math.max(1, Math.floor(chapters * 0.5));
    return `${hours}h`;
  };

  const getLastUpdated = (course: Course) => {
    const date = new Date(course.updatedAt);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <div className="container mx-auto px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded-lg w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-64 bg-gray-200 rounded-2xl mb-6"></div>
                <div className="h-8 bg-gray-200 rounded-lg w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
                <div className="h-96 bg-gray-200 rounded-2xl"></div>
              </div>
              <div className="h-96 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Course Not Found</h2>
          <p className="text-[var(--secondary)] mb-6">
            {error || 'The course you are looking for does not exist.'}
          </p>
          <Link href="/courses" className="button">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/courses" className="inline-flex items-center text-[var(--primary)] font-semibold hover:text-[var(--primary-hover)] transition-colors mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Hero */}
            <div className="relative">
              <div className="h-64 bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20 rounded-2xl overflow-hidden">
                {course.thumbnail && (
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge className={getCourseLevel(course).color}>
                  {getCourseLevel(course).level}
                </Badge>
                <Badge className="bg-white/90 text-[var(--foreground)]">
                  <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                  {getCourseRating(course)}
                </Badge>
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <Button size="sm" className="bg-white/90 text-[var(--foreground)] hover:bg-white">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button size="sm" className="bg-white/90 text-[var(--foreground)] hover:bg-white">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Course Title and Description */}
            <div>
              <h1 className="text-4xl font-bold text-[var(--foreground)] mb-6">{course.title}</h1>
              <p className="text-xl text-[var(--secondary)] leading-relaxed">
                {course.description || 'No description available.'}
              </p>
            </div>

            {/* Course Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card text-center">
                <div className="text-2xl font-bold text-[var(--primary)] mb-2">{chapters.length}</div>
                <div className="text-sm text-[var(--secondary)]">Chapters</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-[var(--accent)] mb-2">{getCourseDuration(course)}</div>
                <div className="text-sm text-[var(--secondary)]">Duration</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-[var(--primary)] mb-2">{course._count?.purchases || 0}</div>
                <div className="text-sm text-[var(--secondary)]">Students</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-[var(--accent)] mb-2">{getCourseRating(course)}</div>
                <div className="text-sm text-[var(--secondary)]">Rating</div>
              </div>
            </div>

            {/* Course Content */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[var(--foreground)]">Course Curriculum</h2>
              
              {chapters.length === 0 ? (
                <div className="card text-center">
                  <div className="w-20 h-20 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="h-10 w-10 text-[var(--primary)]" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">No chapters yet</h3>
                  <p className="text-[var(--secondary)]">
                    This course is still being developed. Check back soon!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {chapters.map((chapter, index) => (
                    <div key={chapter.id} className="card hover:shadow-lg transition-all duration-300">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-[var(--secondary)]">
                              Chapter {index + 1}
                            </span>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              chapter.isPublished 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {chapter.isPublished ? 'Available' : 'Coming Soon'}
                            </div>
                          </div>
                          <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">{chapter.title}</h3>
                          {chapter.description && (
                            <p className="text-[var(--secondary)] mb-4">
                              {chapter.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[var(--secondary)]">
                          <Clock className="h-4 w-4" />
                          <span>~30 min</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <div className="card">
              <div className="text-center mb-6">
                {course.price === 0 ? (
                  <div className="text-3xl font-bold text-[var(--primary)] mb-2">Free</div>
                ) : (
                  <div className="text-3xl font-bold text-[var(--primary)] mb-2">${course.price.toFixed(2)}</div>
                )}
                <p className="text-[var(--secondary)]">Lifetime access</p>
              </div>
              
              <div className="space-y-4">
                <Button className="w-full" size="lg">
                  <Play className="h-5 w-5 mr-2" />
                  Enroll Now
                </Button>
                <Button variant="outline" className="w-full">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Add to Wishlist
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--border)]">
                <h4 className="font-semibold text-[var(--foreground)] mb-3">This course includes:</h4>
                <ul className="space-y-2 text-sm text-[var(--secondary)]">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    {chapters.length} chapters
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    {getCourseDuration(course)} of content
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    Certificate of completion
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    Lifetime access
                  </li>
                </ul>
              </div>
            </div>

            {/* Instructor Info */}
            {course.organization && (
              <div className="card">
                <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">Instructor</h3>
                <div className="flex items-center gap-4">
                  {course.organization.logo ? (
                    <img 
                      src={course.organization.logo} 
                      alt={course.organization.name}
                      className="w-16 h-16 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-2xl flex items-center justify-center">
                      <span className="text-2xl font-bold text-[var(--primary)]">
                        {course.organization.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-[var(--foreground)]">{course.organization.name}</h4>
                    <p className="text-sm text-[var(--secondary)]">Expert Instructor</p>
                  </div>
                </div>
              </div>
            )}

            {/* Course Info */}
            <div className="card">
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">Course Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--secondary)]">Last updated:</span>
                  <span className="font-medium">{getLastUpdated(course)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--secondary)]">Language:</span>
                  <span className="font-medium">English</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--secondary)]">Level:</span>
                  <span className="font-medium">{getCourseLevel(course).level}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 