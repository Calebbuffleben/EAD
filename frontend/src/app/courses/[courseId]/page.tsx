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
    if (purchaseCount > 1000) return { level: 'Advanced', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' };
    if (purchaseCount > 500) return { level: 'Intermediate', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' };
    return { level: 'Beginner', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
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
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"></div>
              <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">
            {error || 'Course not found.'}
          </p>
          <Button asChild>
            <Link href="/courses">Back to Courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/courses">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Hero */}
          <div className="relative">
            <div className="h-64 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-lg overflow-hidden">
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
              <Badge variant="secondary" className="bg-white/90 dark:bg-gray-800/90">
                <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                {getCourseRating(course)}
              </Badge>
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <Button size="sm" variant="secondary">
                <Heart className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="secondary">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Course Title and Description */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              {course.description || 'No description available.'}
            </p>
          </div>

          {/* Course Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{chapters.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Chapters</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{getCourseDuration(course)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{course._count?.purchases || 0}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Students</div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{getCourseRating(course)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Rating</div>
            </div>
          </div>

          {/* Course Content */}
          <Tabs defaultValue="curriculum" className="space-y-4">
            <TabsList>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="curriculum" className="space-y-4">
              <div className="space-y-4">
                {chapters.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No chapters yet</h3>
                      <p className="text-muted-foreground">
                        This course is still being developed. Check back soon!
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  chapters.map((chapter, index) => (
                    <Card key={chapter.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium text-muted-foreground">
                                Chapter {index + 1}
                              </span>
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                chapter.isPublished 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              }`}>
                                {chapter.isPublished ? 'Available' : 'Coming Soon'}
                              </div>
                            </div>
                            <CardTitle className="text-lg">{chapter.title}</CardTitle>
                            {chapter.description && (
                              <CardDescription className="mt-2">
                                {chapter.description}
                              </CardDescription>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="h-4 w-4" />
                            <span>~30 min</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                            <BookOpen className="h-4 w-4" />
                            {chapter.lessons?.length || 0} lessons
                          </div>
                          {chapter.isPublished && (
                            <Button variant="outline" size="sm">
                              <Play className="h-4 w-4 mr-2" />
                              Preview
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>What you'll learn</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      'Master the fundamentals of the subject',
                      'Build real-world projects',
                      'Learn best practices and industry standards',
                      'Get hands-on experience with practical exercises',
                      'Understand advanced concepts and techniques',
                      'Develop problem-solving skills'
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Basic computer skills</li>
                    <li>• No prior experience required</li>
                    <li>• A computer with internet connection</li>
                    <li>• Eagerness to learn and practice</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Course updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>Last updated: {getLastUpdated(course)}</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              <Card>
                <CardContent className="text-center py-12">
                  <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Reviews Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Student reviews and ratings will be available soon.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Purchase Card */}
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Course Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                {course.price === 0 ? (
                  <div className="mb-4">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-lg px-4 py-2">
                      Free
                    </Badge>
                  </div>
                ) : (
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-green-600">
                      ${course.price.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              <Button className="w-full" size="lg">
                {course.price === 0 ? (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Enroll for Free
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5 mr-2" />
                    Buy Now
                  </>
                )}
              </Button>

              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                <p>✓ Full lifetime access</p>
                <p>✓ Access on mobile and TV</p>
                <p>✓ Certificate of completion</p>
                <p>✓ 30-day money-back guarantee</p>
              </div>
            </CardContent>
          </Card>

          {/* Instructor Info */}
          {course.organization && (
            <Card>
              <CardHeader>
                <CardTitle>Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    {course.organization.logo ? (
                      <img 
                        src={course.organization.logo} 
                        alt={course.organization.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <span className="text-lg font-medium">
                        {course.organization.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold">{course.organization.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Professional Instructor
                    </p>
                  </div>
                </div>
                {course.organization.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                    {course.organization.description}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Course Features */}
          <Card>
            <CardHeader>
              <CardTitle>Course Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Award className="h-4 w-4 text-blue-600" />
                <span>Certificate of completion</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-green-600" />
                <span>Lifetime access</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4 text-purple-600" />
                <span>Downloadable resources</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-orange-600" />
                <span>Community support</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 