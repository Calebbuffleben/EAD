'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Users, Crown, Shield, User, UserCheck } from "lucide-react";
import Link from "next/link";
import { organizationsApi, TeacherTeamMember, TeacherRole, CreateTeamMemberData } from "@/lib/api/organizations";

export default function TeamManagementPage() {
  const [teamMembers, setTeamMembers] = useState<TeacherTeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addingMember, setAddingMember] = useState(false);
  
  const [newMemberData, setNewMemberData] = useState<CreateTeamMemberData>({
    clerkUserId: '',
    email: '',
    name: '',
    role: TeacherRole.TEACHER,
  });

  // For demo purposes, we'll use the first organization
  const [organizationId, setOrganizationId] = useState<string>('');

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        // Get the first organization (in real app, this would be the user's org)
        const organizations = await organizationsApi.getAll();
        if (organizations.length > 0) {
          const org = organizations[0];
          setOrganizationId(org.id);
          
          // Fetch team members
          const members = await organizationsApi.getTeamMembers(org.id);
          setTeamMembers(members);
        }
      } catch (err) {
        console.error('Error fetching team data:', err);
        setError('Failed to load team data.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  const handleInputChange = (field: keyof CreateTeamMemberData, value: string) => {
    setNewMemberData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMemberData.email.trim() || !newMemberData.name.trim()) {
      setError('Email and name are required');
      return;
    }

    try {
      setAddingMember(true);
      setError(null);
      
      const newMember = await organizationsApi.createTeamMember(organizationId, newMemberData);
      setTeamMembers(prev => [...prev, newMember]);
      
      // Reset form
      setNewMemberData({
        clerkUserId: '',
        email: '',
        name: '',
        role: TeacherRole.TEACHER,
      });
      setShowAddForm(false);
    } catch (err) {
      console.error('Error adding team member:', err);
      setError('Failed to add team member. Please try again.');
    } finally {
      setAddingMember(false);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) {
      return;
    }

    try {
      await organizationsApi.deleteTeamMember(organizationId, memberId);
      setTeamMembers(prev => prev.filter(member => member.id !== memberId));
    } catch (err) {
      console.error('Error deleting team member:', err);
      setError('Failed to remove team member.');
    }
  };

  const getRoleIcon = (role: TeacherRole) => {
    switch (role) {
      case TeacherRole.OWNER:
        return <Crown className="h-4 w-4 text-yellow-600" />;
      case TeacherRole.ADMIN:
        return <Shield className="h-4 w-4 text-blue-600" />;
      case TeacherRole.TEACHER:
        return <User className="h-4 w-4 text-green-600" />;
      case TeacherRole.ASSISTANT:
        return <UserCheck className="h-4 w-4 text-purple-600" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleLabel = (role: TeacherRole) => {
    switch (role) {
      case TeacherRole.OWNER:
        return 'Owner';
      case TeacherRole.ADMIN:
        return 'Admin';
      case TeacherRole.TEACHER:
        return 'Teacher';
      case TeacherRole.ASSISTANT:
        return 'Assistant';
      default:
        return role;
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
            <h1 className="text-3xl font-bold mb-2">Team Management</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your organization's team members and their roles.
            </p>
          </div>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
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

      {/* Add Member Form */}
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add Team Member</CardTitle>
            <CardDescription>
              Invite a new member to your organization.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={newMemberData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter member's name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newMemberData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter member's email"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newMemberData.role}
                  onValueChange={(value: string) => handleInputChange('role', value as TeacherRole)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TeacherRole.TEACHER}>Teacher</SelectItem>
                    <SelectItem value={TeacherRole.ASSISTANT}>Assistant</SelectItem>
                    <SelectItem value={TeacherRole.ADMIN}>Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={addingMember}>
                  {addingMember ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Member
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Team Members List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Team Members ({teamMembers.length})</h2>
        </div>

        {teamMembers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No team members yet</h3>
              <p className="text-muted-foreground mb-4">
                Start building your team by adding the first member.
              </p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Member
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((member) => (
              <Card key={member.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getRoleIcon(member.role)}
                        <span className="text-sm font-medium text-muted-foreground">
                          {getRoleLabel(member.role)}
                        </span>
                      </div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <CardDescription>{member.email}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        member.isActive 
                          ? 'bg-green-500' 
                          : 'bg-gray-400'
                      }`}></div>
                      <span className="text-sm text-muted-foreground">
                        {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {member.role !== TeacherRole.OWNER && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteMember(member.id)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Role Information */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>
            Understanding the different roles in your organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-yellow-600" />
                <span className="font-medium">Owner</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Full access to all features including organization settings, team management, and billing.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Admin</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Can manage courses, team members, and organization settings. Cannot access billing.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-green-600" />
                <span className="font-medium">Teacher</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Can create and manage courses, chapters, and lessons. Cannot manage team members.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-purple-600" />
                <span className="font-medium">Assistant</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Can help manage courses and content. Limited access to organization settings.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 