import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsUrl,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  thumbnail?: string;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsString()
  organizationId: string;

  @IsString()
  createdById: string;
}
