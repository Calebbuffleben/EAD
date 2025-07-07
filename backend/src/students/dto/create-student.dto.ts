import { IsString, IsEmail, IsOptional, IsUrl } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  clerkUserId: string;

  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsUrl()
  avatar?: string;
}
