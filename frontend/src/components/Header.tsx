'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  User, 
  Settings, 
  Home,
  GraduationCap
} from "lucide-react";

interface HeaderProps {
  showStudentNav?: boolean;
  showTeacherNav?: boolean;
}

export default function Header({ showStudentNav = false, showTeacherNav = false }: HeaderProps) {
  return (
    <header className="border-b bg-white dark:bg-gray-900 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <GraduationCap className="h-6 w-6" />
            <span>E-Learning Platform</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
            </Button>
            
            <Button variant="ghost" asChild>
              <Link href="/courses">
                <BookOpen className="h-4 w-4 mr-2" />
                Courses
              </Link>
            </Button>

            {showStudentNav && (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/student">
                    <User className="h-4 w-4 mr-2" />
                    My Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/student/profile">
                    <Settings className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </Button>
              </>
            )}

            {showTeacherNav && (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard">
                    <User className="h-4 w-4 mr-2" />
                    Teacher Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard/organization/team">
                    <Settings className="h-4 w-4 mr-2" />
                    Team
                  </Link>
                </Button>
              </>
            )}

            {!showStudentNav && !showTeacherNav && (
              <>
                <Button variant="outline" asChild>
                  <Link href="/student">
                    <User className="h-4 w-4 mr-2" />
                    Student Login
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/dashboard">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Teacher Login
                  </Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
} 