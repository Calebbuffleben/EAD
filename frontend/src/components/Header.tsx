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
    <header className="w-full px-8 py-6 flex items-center justify-between bg-white shadow-sm" style={{borderBottom: '1px solid var(--border)'}}>
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold text-xl shadow-md">
          <GraduationCap className="h-5 w-5" />
        </div>
        <span className="text-2xl font-bold text-[var(--primary)] tracking-tight">E-Learning</span>
      </Link>

      {/* Navigation */}
      <nav className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 text-[var(--secondary)] font-semibold hover:text-[var(--primary)] transition-colors">
          <Home className="h-4 w-4" />
          Home
        </Link>
        
        <Link href="/courses" className="flex items-center gap-2 text-[var(--secondary)] font-semibold hover:text-[var(--primary)] transition-colors">
          <BookOpen className="h-4 w-4" />
          Courses
        </Link>

        {showStudentNav && (
          <>
            <Link href="/student" className="flex items-center gap-2 text-[var(--secondary)] font-semibold hover:text-[var(--primary)] transition-colors">
              <User className="h-4 w-4" />
              My Dashboard
            </Link>
            <Link href="/student/profile" className="flex items-center gap-2 text-[var(--secondary)] font-semibold hover:text-[var(--primary)] transition-colors">
              <Settings className="h-4 w-4" />
              Profile
            </Link>
          </>
        )}

        {showTeacherNav && (
          <>
            <Link href="/dashboard" className="flex items-center gap-2 text-[var(--secondary)] font-semibold hover:text-[var(--primary)] transition-colors">
              <User className="h-4 w-4" />
              Teacher Dashboard
            </Link>
            <Link href="/dashboard/organization/team" className="flex items-center gap-2 text-[var(--secondary)] font-semibold hover:text-[var(--primary)] transition-colors">
              <Settings className="h-4 w-4" />
              Team
            </Link>
          </>
        )}

        {!showStudentNav && !showTeacherNav && (
          <div className="flex items-center gap-4">
            <Link href="/student" className="px-4 py-2 text-[var(--primary)] font-semibold hover:text-[var(--primary-hover)] transition-colors">
              Student Login
            </Link>
            <Link href="/dashboard" className="button">
              <GraduationCap className="h-4 w-4 mr-2" />
              Teacher Login
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
} 