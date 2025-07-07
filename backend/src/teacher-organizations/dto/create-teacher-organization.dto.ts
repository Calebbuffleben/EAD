import { IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateTeacherOrganizationDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsString()
  logo?: string;
} 