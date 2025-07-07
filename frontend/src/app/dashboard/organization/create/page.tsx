'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Building } from "lucide-react";
import Link from "next/link";
import { organizationsApi, CreateOrganizationData } from "@/lib/api/organizations";

export default function CreateOrganizationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CreateOrganizationData>({
    name: '',
    description: '',
    website: '',
    logo: '',
  });

  const handleInputChange = (field: keyof CreateOrganizationData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Organization name is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const newOrganization = await organizationsApi.create(formData);
      
      // Redirect to the dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('Error creating organization:', err);
      setError('Failed to create organization. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-3xl font-bold mb-2">Create Organization</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Set up your teaching organization to start creating courses.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Organization Information */}
            <Card>
              <CardHeader>
                <CardTitle>Organization Details</CardTitle>
                <CardDescription>
                  Provide the essential information about your organization.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Organization Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter organization name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your organization and what you teach..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="website">Website URL</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website || ''}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://your-organization.com"
                  />
                </div>

                <div>
                  <Label htmlFor="logo">Logo URL</Label>
                  <Input
                    id="logo"
                    type="url"
                    value={formData.logo || ''}
                    onChange={(e) => handleInputChange('logo', e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Provide a URL to your organization's logo.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Organization
                    </>
                  )}
                </Button>
                
                <Button variant="outline" asChild className="w-full">
                  <Link href="/dashboard">Cancel</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  About Organizations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Organizations allow you to:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Create and manage courses</li>
                  <li>• Invite team members</li>
                  <li>• Track analytics and revenue</li>
                  <li>• Build your brand</li>
                </ul>
              </CardContent>
            </Card>

            {/* Error Display */}
            {error && (
              <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                <CardContent className="pt-6">
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </form>
    </div>
  );
} 