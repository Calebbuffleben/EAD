'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Users, 
  Clock, 
  Play, 
  CheckCircle, 
  Award,
  TrendingUp,
  Calendar,
  User,
  Settings
} from "lucide-react";
import Link from "next/link";
import { studentsApi, Student, CoursePurchase } from "@/lib/api/students";
import { coursesApi, Course } from "@/lib/api/courses";
import Header from "@/components/Header";

export default function StudentDashboardPage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [purchases, setPurchases] = useState<CoursePurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        // TODO: Get the authenticated user
        // For demo purposes, we'll get the first student
        // In a real app, this would be the authenticated user
        const students = await studentsApi.getAll();
        if (students.length > 0) {
          const userStudent = students[0];
          setStudent(userStudent);
          
          // Fetch student's purchases
          const studentPurchases = await studentsApi.getPurchases(userStudent.id);
          setPurchases(studentPurchases);
        }
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Failed to load student data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const getCourseProgress = (courseId: string) => {
    // In a real app, this would calculate actual progress
    // For now, we'll return a random progress
    return Math.floor(Math.random() * 100);
  };

  const getTotalLearningTime = () => {
    // In a real app, this would calculate actual learning time
    return purchases.length * 2.5; // hours
  };

  const getCompletedLessons = () => {
    // In a real app, this would count actual completed lessons
    return purchases.length * 15; // lessons
  };

  const getCertificatesEarned = () => {
    // In a real app, this would count actual certificates
    return Math.floor(purchases.length * 0.3); // 30% completion rate
  };

  if (loading) {
    return (
      <>
        <Header showStudentNav={true} />
        <div className="min-h-screen bg-[var(--background)]">
          <div className="container mx-auto px-8 py-12">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded-lg w-1/3 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
                ))}
              </div>
              <div className="h-96 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header showStudentNav={true} />
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Oops! Something went wrong</h2>
            <p className="text-[var(--secondary)] mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="button"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!student) {
    return (
      <>
        <Header showStudentNav={true} />
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-10 w-10 text-[var(--primary)]" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--foreground)] mb-4">Welcome to Your Learning Dashboard</h1>
            <p className="text-[var(--secondary)] mb-8">
              Start your learning journey by exploring our courses.
            </p>
            <Link href="/courses" className="button">
              Browse Courses
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header showStudentNav={true} />
      <div className="min-h-screen bg-[var(--background)]">
        <div className="container mx-auto px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">My Learning Dashboard</h1>
            <p className="text-xl text-[var(--secondary)]">
              Welcome back, <span className="text-[var(--primary)] font-semibold">{student.name}</span>! Continue your learning journey.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[var(--secondary)]">Enrolled Courses</h3>
                <div className="w-10 h-10 bg-[var(--primary)]/10 rounded-full flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-[var(--primary)]" />
                </div>
              </div>
              <div className="text-3xl font-bold text-[var(--foreground)] mb-2">{purchases.length}</div>
              <p className="text-sm text-[var(--secondary)]">
                Active enrollments
              </p>
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[var(--secondary)]">Learning Time</h3>
                <div className="w-10 h-10 bg-[var(--accent)]/10 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-[var(--accent)]" />
                </div>
              </div>
              <div className="text-3xl font-bold text-[var(--foreground)] mb-2">{getTotalLearningTime()}</div>
              <p className="text-sm text-[var(--secondary)]">
                Hours spent learning
              </p>
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[var(--secondary)]">Lessons Completed</h3>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-[var(--foreground)] mb-2">{getCompletedLessons()}</div>
              <p className="text-sm text-[var(--secondary)]">
                Across all courses
              </p>
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[var(--secondary)]">Certificates</h3>
                <div className="w-10 h-10 bg-[var(--primary)]/10 rounded-full flex items-center justify-center">
                  <Award className="h-5 w-5 text-[var(--primary)]" />
                </div>
              </div>
              <div className="text-3xl font-bold text-[var(--foreground)] mb-2">{getCertificatesEarned()}</div>
              <p className="text-sm text-[var(--secondary)]">
                Earned certificates
              </p>
            </div>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="courses" className="space-y-4">
            <TabsList>
              <TabsTrigger value="courses">My Courses</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">My Enrolled Courses</h2>
                <Button asChild>
                  <Link href="/courses">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Browse More Courses
                  </Link>
                </Button>
              </div>

              {purchases.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No courses enrolled yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start your learning journey by enrolling in your first course.
                    </p>
                    <Button asChild>
                      <Link href="/courses">Browse Courses</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {purchases.map((purchase) => {
                    const progress = getCourseProgress(purchase.courseId);
                    return (
                      <Card key={purchase.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{purchase.course?.title}</CardTitle>
                              <CardDescription>
                                {purchase.course?.organization?.name}
                              </CardDescription>
                            </div>
                            <Badge className={`${
                              progress === 100 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {progress === 100 ? 'Completed' : 'In Progress'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span>Progress</span>
                                <span>{progress}%</span>
                              </div>
                              <Progress value={progress} className="h-2" />
                            </div>
                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>Enrolled {new Date(purchase.purchasedAt).toLocaleDateString()}</span>
                              </div>
                              <span>${purchase.amount}</span>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" asChild className="flex-1">
                                <Link href={`/courses/${purchase.courseId}`}>
                                  <Play className="h-4 w-4 mr-2" />
                                  Continue
                                </Link>
                              </Button>
                              <Button variant="outline" size="sm" asChild className="flex-1">
                                <Link href={`/student/courses/${purchase.courseId}`}>
                                  <TrendingUp className="h-4 w-4 mr-2" />
                                  Progress
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="progress" className="space-y-4">
              <h2 className="text-2xl font-bold">Learning Progress</h2>
              <Card>
                <CardContent className="text-center py-12">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Detailed Progress Tracking</h3>
                  <p className="text-muted-foreground">
                    Detailed progress analytics and learning insights will be available soon.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-4">
              <h2 className="text-2xl font-bold">Profile Settings</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Student Information</CardTitle>
                  <CardDescription>
                    Manage your profile and account settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{student.name}</h3>
                      <p className="text-sm text-muted-foreground">{student.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Member since {new Date(student.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/student/profile">
                        <Settings className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Account Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
} 