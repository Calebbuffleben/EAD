import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateChapterDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  order: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
} 