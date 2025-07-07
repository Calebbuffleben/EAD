import { PartialType } from '@nestjs/mapped-types';
import { CreateTeacherTeamMemberDto } from './create-teacher-team-member.dto';

export class UpdateTeacherTeamMemberDto extends PartialType(CreateTeacherTeamMemberDto) {} 