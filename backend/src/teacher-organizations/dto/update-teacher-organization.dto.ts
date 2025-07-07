import { PartialType } from '@nestjs/mapped-types';
import { CreateTeacherOrganizationDto } from './create-teacher-organization.dto';

export class UpdateTeacherOrganizationDto extends PartialType(CreateTeacherOrganizationDto) {} 