import { Module } from '@nestjs/common';
import { TeacherOrganizationsController } from './teacher-organizations.controller';

@Module({
  controllers: [TeacherOrganizationsController],
})
export class TeacherOrganizationsModule {} 