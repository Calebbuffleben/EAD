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
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
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

  if (!student) {
    return (
      <>
        <Header showStudentNav={true} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Welcome to Your Learning Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Start your learning journey by exploring our courses.
            </p>
            <Button asChild>
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header showStudentNav={true} />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Learning Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {student.name}! Continue your learning journey.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{purchases.length}</div>
              <p className="text-xs text-muted-foreground">
                Active enrollments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalLearningTime()}</div>
              <p className="text-xs text-muted-foreground">
                Hours spent learning
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getCompletedLessons()}</div>
              <p className="text-xs text-muted-foreground">
                Across all courses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certificates</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getCertificatesEarned()}</div>
              <p className="text-xs text-muted-foreground">
                Earned certificates
              </p>
            </CardContent>
          </Card>
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
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
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
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
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
    </>
  );
} 