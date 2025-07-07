'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Calendar, 
  Save, 
  Camera,
  Settings,
  Shield,
  BookOpen,
  Award
} from "lucide-react";
import Link from "next/link";
import { studentsApi, Student, UpdateStudentData } from "@/lib/api/students";
import Header from "@/components/Header";

export default function StudentProfilePage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState<UpdateStudentData>({
    name: '',
    email: '',
    avatar: '',
  });

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
          setFormData({
            name: userStudent.name,
            email: userStudent.email,
            avatar: userStudent.avatar || '',
          });
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

  const handleInputChange = (field: keyof UpdateStudentData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!student) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      const updatedStudent = await studentsApi.update(student.id, formData);
      setStudent(updatedStudent);
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (student) {
      setFormData({
        name: student.name,
        email: student.email,
        avatar: student.avatar || '',
      });
    }
    setIsEditing(false);
    setError(null);
    setSuccess(null);
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

  if (!student) {
    return (
      <>
        <Header showStudentNav={true} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Profile Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Unable to load your profile information.
            </p>
            <Button asChild>
              <Link href="/student">Back to Dashboard</Link>
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
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/student">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your account information and preferences.
              </p>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 mb-6">
            <CardContent className="pt-6">
              <p className="text-red-600 dark:text-red-400 text-sm">
                {error}
              </p>
            </CardContent>
          </Card>
        )}

        {success && (
          <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950 mb-6">
            <CardContent className="pt-6">
              <p className="text-green-600 dark:text-green-400 text-sm">
                {success}
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and contact information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                        {student.avatar ? (
                          <img 
                            src={student.avatar} 
                            alt={student.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="h-12 w-12 text-gray-500" />
                        )}
                      </div>
                      {isEditing && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{student.name}</h3>
                      <p className="text-sm text-muted-foreground">{student.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Member since {new Date(student.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="avatar">Profile Picture URL</Label>
                    <Input
                      id="avatar"
                      value={formData.avatar}
                      onChange={(e) => handleInputChange('avatar', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter profile picture URL"
                    />
                  </div>

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex gap-2">
                      <Button type="submit" disabled={saving}>
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
                      <Button type="button" variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Account Security */}
            <Card>
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>
                  Manage your account security settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium">Password</h4>
                      <p className="text-sm text-muted-foreground">
                        Last changed recently
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Change Password
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="font-medium">Email Verification</h4>
                      <p className="text-sm text-muted-foreground">
                        Email is verified
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Verified
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Status */}
            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className={`${
                    student.isActive 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {student.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Member Since</span>
                  <span className="text-sm font-medium">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Updated</span>
                  <span className="text-sm font-medium">
                    {new Date(student.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Learning Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">{student._count?.purchases || 0}</div>
                    <div className="text-sm text-muted-foreground">Enrolled Courses</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-yellow-600" />
                  <div>
                    <div className="font-medium">0</div>
                    <div className="text-sm text-muted-foreground">Certificates Earned</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium">
                      {Math.floor((Date.now() - new Date(student.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                    <div className="text-sm text-muted-foreground">Days as Member</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" asChild className="w-full justify-start">
                  <Link href="/student">
                    <BookOpen className="h-4 w-4 mr-2" />
                    View My Courses
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Award className="h-4 w-4 mr-2" />
                  My Certificates
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
} 