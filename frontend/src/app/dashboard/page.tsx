'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, BookOpen, Users, DollarSign, TrendingUp } from "lucide-react";
import Link from "next/link";
import { organizationsApi, TeacherOrganization } from "@/lib/api/organizations";
import { coursesApi, Course } from "@/lib/api/courses";
import { TeacherRole } from "@/lib/api/organizations";

export default function DashboardPage() {
  const [organization, setOrganization] = useState<TeacherOrganization | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // TODO: Get the organization of the authenticated user
        // For now, we'll fetch the first organization
        // In a real app, you'd get the user's organization from auth context
        const organizations = await organizationsApi.getAll();
        if (organizations.length > 0) {
          const userOrg = organizations[0];
          setOrganization(userOrg);
          
          // Fetch courses for this organization
          const orgCourses = await coursesApi.getAll(userOrg.id);
          setCourses(orgCourses);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
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
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            You need to create or join an organization to start creating courses.
          </p>
          <Button asChild>
            <Link href="/dashboard/organization/create">Create Organization</Link>
          </Button>
        </div>
      </div>
    );
  }

  const totalRevenue = courses.reduce((sum, course) => {
    return sum + (course._count?.purchases || 0) * course.price;
  }, 0);

  const totalStudents = courses.reduce((sum, course) => {
    return sum + (course._count?.purchases || 0);
  }, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back to {organization.name}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">
              {courses.filter(c => c.isPublished).length} published
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Across all courses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12%</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Your Courses</h2>
            <Button asChild>
              <Link href="/dashboard/courses/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Course
              </Link>
            </Button>
          </div>

          {courses.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first course to start teaching students.
                </p>
                <Button asChild>
                  <Link href="/dashboard/courses/create">Create Your First Course</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <Card key={course.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription>
                          {course._count?.chapters || 0} chapters
                        </CardDescription>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.isPublished 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {course.isPublished ? 'Published' : 'Draft'}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-green-600">
                        ${course.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {course._count?.purchases || 0} students
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild className="flex-1">
                        <Link href={`/dashboard/courses/${course.id}`}>
                          Edit
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild className="flex-1">
                        <Link href={`/dashboard/courses/${course.id}/analytics`}>
                          Analytics
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="organization" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Organization Settings</h2>
            <Button variant="outline" asChild>
              <Link href="/dashboard/organization/edit">Edit Organization</Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                {organization.logo && (
                  <img 
                    src={organization.logo} 
                    alt={organization.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h3 className="text-lg font-semibold">{organization.name}</h3>
                  <p className="text-muted-foreground">{organization.description}</p>
                  {organization.website && (
                    <a 
                      href={organization.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {organization.website}
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Manage your organization's team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/dashboard/organization/team">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Team
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <h2 className="text-2xl font-bold">Analytics</h2>
          <Card>
            <CardContent className="text-center py-12">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Analytics Coming Soon</h3>
              <p className="text-muted-foreground">
                Detailed analytics and insights will be available soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 