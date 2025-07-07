'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Plus, 
  Eye, 
  Edit, 
  MoreHorizontal,
  Calendar,
  Clock,
  Award,
  Target,
  Sparkles,
  Zap,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Star
} from "lucide-react";
import Link from "next/link";
import { coursesApi, Course } from "@/lib/api/courses";
import Header from "@/components/Header";

export default function DashboardPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const allCourses = await coursesApi.getAll();
        setCourses(allCourses);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const getTotalRevenue = () => {
    return courses.reduce((sum, course) => sum + (course.price * (course._count?.purchases || 0)), 0);
  };

  const getTotalStudents = () => {
    return courses.reduce((sum, course) => sum + (course._count?.purchases || 0), 0);
  };

  const getAverageRating = () => {
    const totalRating = courses.reduce((sum, course) => {
      const baseRating = 4.0;
      const purchaseBonus = Math.min((course._count?.purchases || 0) / 100, 1);
      return sum + (baseRating + purchaseBonus);
    }, 0);
    return (totalRating / Math.max(courses.length, 1)).toFixed(1);
  };

  const getRecentCourses = () => {
    return courses
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  };

  const getTopPerformingCourses = () => {
    return courses
      .sort((a, b) => (b._count?.purchases || 0) - (a._count?.purchases || 0))
      .slice(0, 3);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[var(--background)]">
          <div className="container mx-auto px-8 py-12">
            <div className="animate-shimmer">
              <div className="h-12 bg-gray-200 rounded-lg w-1/3 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-96 bg-gray-200 rounded-2xl"></div>
                <div className="h-96 bg-gray-200 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Oops! Something went wrong</h2>
            <p className="text-[var(--secondary)] mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[var(--background)]">
        <div className="container mx-auto px-8 py-12">
          {/* Enhanced Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--primary)]/10 to-[var(--accent)]/10 rounded-full px-4 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-[var(--primary)]" />
              <span className="text-sm font-medium text-[var(--primary)]">Instructor Dashboard</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Welcome back,
              <span className="text-gradient block"> Instructor!</span>
            </h1>
            <p className="text-xl text-[var(--secondary)] max-w-2xl leading-relaxed">
              Track your course performance, manage your content, and grow your teaching business.
            </p>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="hover-lift group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BookOpen className="h-6 w-6 text-[var(--primary)]" />
                  </div>
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-[var(--foreground)] mb-2">{courses.length}</div>
                <p className="text-sm text-[var(--secondary)]">Total Courses</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>+12% this month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent)]/20 to-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="h-6 w-6 text-[var(--accent)]" />
                  </div>
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-[var(--foreground)] mb-2">{getTotalStudents().toLocaleString()}</div>
                <p className="text-sm text-[var(--secondary)]">Total Students</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>+8% this month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-[var(--foreground)] mb-2">${getTotalRevenue().toLocaleString()}</div>
                <p className="text-sm text-[var(--secondary)]">Total Revenue</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>+15% this month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-[var(--foreground)] mb-2">{getAverageRating()}</div>
                <p className="text-sm text-[var(--secondary)]">Average Rating</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>+0.2 this month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Recent Courses */}
            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-[var(--primary)]" />
                    Recent Courses
                  </CardTitle>
                  <CardDescription>Your latest course creations and updates</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/courses">
                    View All
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getRecentCourses().map((course) => (
                    <div key={course.id} className="flex items-center gap-4 p-4 bg-[var(--muted)] rounded-xl hover:bg-[var(--primary)]/5 transition-colors">
                      <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20 rounded-lg flex items-center justify-center">
                        {course.thumbnail ? (
                          <img 
                            src={course.thumbnail} 
                            alt={course.title}
                            className="w-8 h-8 rounded object-cover"
                          />
                        ) : (
                          <BookOpen className="h-6 w-6 text-[var(--primary)]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[var(--foreground)] truncate">{course.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-[var(--secondary)]">
                          <span>{course._count?.purchases || 0} students</span>
                          <span>${course.price}</span>
                          <Badge variant={course.isPublished ? "success" : "warning"} className="text-xs">
                            {course.isPublished ? 'Published' : 'Draft'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/courses/${course.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/courses/${course.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Courses */}
            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-[var(--accent)]" />
                    Top Performers
                  </CardTitle>
                  <CardDescription>Your best-selling courses this month</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getTopPerformingCourses().map((course, index) => (
                    <div key={course.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-[var(--accent)]/5 to-purple-500/5 rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-[var(--accent)] to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        #{index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[var(--foreground)] truncate">{course.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-[var(--secondary)]">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {course._count?.purchases || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            ${(course.price * (course._count?.purchases || 0)).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-[var(--accent)]">
                          ${course.price}
                        </div>
                        <div className="text-xs text-[var(--secondary)]">per student</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Zap className="h-6 w-6 text-[var(--primary)]" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover-lift group cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Plus className="h-8 w-8 text-[var(--primary)]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Create New Course</h3>
                  <p className="text-sm text-[var(--secondary)] mb-4">
                    Start building your next successful course
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/dashboard/courses/create">
                      Get Started
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover-lift group cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Target className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                  <p className="text-sm text-[var(--secondary)] mb-4">
                    Dive deep into your course performance
                  </p>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/dashboard/analytics">
                      View Analytics
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover-lift group cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Student Management</h3>
                  <p className="text-sm text-[var(--secondary)] mb-4">
                    Manage your students and their progress
                  </p>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/dashboard/students">
                      Manage Students
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Clock className="h-6 w-6 text-[var(--accent)]" />
              Recent Activity
            </h2>
            <Card className="hover-lift">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[
                    {
                      type: 'course_created',
                      title: 'New course created',
                      description: 'Web Development Bootcamp was created',
                      time: '2 hours ago',
                      icon: <Plus className="h-4 w-4 text-green-600" />
                    },
                    {
                      type: 'student_enrolled',
                      title: 'New student enrolled',
                      description: 'Sarah Johnson enrolled in Data Science Course',
                      time: '4 hours ago',
                      icon: <Users className="h-4 w-4 text-blue-600" />
                    },
                    {
                      type: 'course_published',
                      title: 'Course published',
                      description: 'Digital Marketing Masterclass is now live',
                      time: '1 day ago',
                      icon: <CheckCircle className="h-4 w-4 text-green-600" />
                    },
                    {
                      type: 'revenue_milestone',
                      title: 'Revenue milestone',
                      description: 'Reached $10,000 in total revenue',
                      time: '2 days ago',
                      icon: <DollarSign className="h-4 w-4 text-green-600" />
                    }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-[var(--muted)] rounded-xl hover:bg-[var(--primary)]/5 transition-colors">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-[var(--foreground)]">{activity.title}</h4>
                        <p className="text-sm text-[var(--secondary)]">{activity.description}</p>
                      </div>
                      <div className="text-sm text-[var(--secondary)]">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Call to Action */}
          <div className="text-center py-16 bg-gradient-to-br from-[var(--primary)]/10 via-[var(--accent)]/10 to-purple-50 rounded-3xl">
            <div className="w-20 h-20 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Teaching Business?</h2>
            <p className="text-lg text-[var(--secondary)] mb-8 max-w-2xl mx-auto leading-relaxed">
              Create more courses, reach more students, and increase your revenue with our powerful platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="group">
                <Link href="/dashboard/courses/create">
                  <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" />
                  Create New Course
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/dashboard/analytics">View Analytics</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 