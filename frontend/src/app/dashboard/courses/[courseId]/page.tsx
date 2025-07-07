'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { coursesApi, Course, Chapter, Lesson, CreateChapterData, CreateLessonData } from "@/lib/api/courses";

export default function CourseEditPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    price: 0,
    isPublished: false,
  });

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const courseData = await coursesApi.getById(courseId);
        setCourse(courseData);
        setFormData({
          title: courseData.title,
          description: courseData.description || '',
          thumbnail: courseData.thumbnail || '',
          price: courseData.price,
          isPublished: courseData.isPublished,
        });
        
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

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveCourse = async () => {
    if (!course) return;
    
    try {
      setSaving(true);
      setError(null);
      
      const updatedCourse = await coursesApi.update(courseId, formData);
      setCourse(updatedCourse);
    } catch (err) {
      console.error('Error updating course:', err);
      setError('Failed to save course changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateChapter = async () => {
    if (!course) return;
    
    const newChapter: CreateChapterData = {
      title: 'New Chapter',
      description: '',
      order: chapters.length + 1,
      isPublished: false,
    };

    try {
      const createdChapter = await coursesApi.createChapter(courseId, newChapter);
      setChapters(prev => [...prev, createdChapter]);
    } catch (err) {
      console.error('Error creating chapter:', err);
      setError('Failed to create chapter.');
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (!confirm('Are you sure you want to delete this chapter? This action cannot be undone.')) {
      return;
    }

    try {
      await coursesApi.deleteChapter(courseId, chapterId);
      setChapters(prev => prev.filter(ch => ch.id !== chapterId));
    } catch (err) {
      console.error('Error deleting chapter:', err);
      setError('Failed to delete chapter.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error && !course) {
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

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Course not found.</p>
          <Button asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
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
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Edit Course</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Update your course details and manage content.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/courses/${courseId}`} target="_blank">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Link>
            </Button>
            <Button onClick={handleSaveCourse} disabled={saving}>
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 mb-6">
          <CardContent className="pt-6">
            <p className="text-red-600 dark:text-red-400 text-sm">
              {error}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Course Details</TabsTrigger>
          <TabsTrigger value="chapters">Chapters</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Update the essential details about your course.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Course Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter course title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe what students will learn in this course..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="thumbnail">Thumbnail URL</Label>
                    <Input
                      id="thumbnail"
                      type="url"
                      value={formData.thumbnail}
                      onChange={(e) => handleInputChange('thumbnail', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                  <CardDescription>
                    Set the price for your course.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="price">Course Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publish Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Publish Settings</CardTitle>
                  <CardDescription>
                    Control when your course becomes available.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="published">Publish Course</Label>
                      <p className="text-sm text-muted-foreground">
                        Make this course available to students
                      </p>
                    </div>
                    <Switch
                      id="published"
                      checked={formData.isPublished}
                      onCheckedChange={(checked) => handleInputChange('isPublished', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Course Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Course Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Chapters</span>
                    <span className="font-medium">{chapters.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Students</span>
                    <span className="font-medium">{course._count?.purchases || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Revenue</span>
                    <span className="font-medium">
                      ${((course._count?.purchases || 0) * course.price).toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="chapters" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Chapters</h2>
            <Button onClick={handleCreateChapter}>
              <Plus className="h-4 w-4 mr-2" />
              Add Chapter
            </Button>
          </div>

          {chapters.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No chapters yet. Create your first chapter to start building your course.
                </p>
                <Button onClick={handleCreateChapter}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Chapter
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {chapters.map((chapter, index) => (
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
                            {chapter.isPublished ? 'Published' : 'Draft'}
                          </div>
                        </div>
                        <CardTitle className="text-lg">{chapter.title}</CardTitle>
                        {chapter.description && (
                          <CardDescription className="mt-2">
                            {chapter.description}
                          </CardDescription>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/courses/${courseId}/chapters/${chapter.id}`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteChapter(chapter.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {chapter.lessons?.length || 0} lessons
                      </span>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/courses/${courseId}/chapters/${chapter.id}/lessons`}>
                          Manage Lessons
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <h2 className="text-2xl font-bold">Analytics</h2>
          <Card>
            <CardContent className="text-center py-12">
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