import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsUrl,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateLessonDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsUrl()
  videoUrl?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  duration?: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  order: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
