import { IsString, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { TeacherRole } from '@prisma/client';

export class CreateTeacherTeamMemberDto {
  @IsString()
  clerkUserId: string;

  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(TeacherRole)
  role?: TeacherRole;
} 