import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeacherOrganizationDto } from './dto/create-teacher-organization.dto';
import { UpdateTeacherOrganizationDto } from './dto/update-teacher-organization.dto';
import { CreateTeacherTeamMemberDto } from './dto/create-teacher-team-member.dto';
import { UpdateTeacherTeamMemberDto } from './dto/update-teacher-team-member.dto';

@Controller('teacher-organizations')
export class TeacherOrganizationsController {
  constructor(private readonly prisma: PrismaService) {}

  // Organization endpoints
  @Get()
  async findAll() {
    return this.prisma.teacherOrganization.findMany({
      include: {
        teamMembers: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        _count: {
          select: {
            courses: true,
          },
        },
      },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.prisma.teacherOrganization.findUnique({
      where: { id },
      include: {
        teamMembers: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
          },
        },
        courses: {
          select: {
            id: true,
            title: true,
            isPublished: true,
            _count: {
              select: {
                purchases: true,
              },
            },
          },
        },
      },
    });
  }

  @Post()
  async create(@Body() createDto: CreateTeacherOrganizationDto) {
    return this.prisma.teacherOrganization.create({
      data: createDto,
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateTeacherOrganizationDto) {
    return this.prisma.teacherOrganization.update({
      where: { id },
      data: updateDto,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.prisma.teacherOrganization.delete({
      where: { id },
    });
  }

  // Team member endpoints (nested under organization)
  @Get(':organizationId/team-members')
  async findTeamMembers(@Param('organizationId') organizationId: string) {
    return this.prisma.teacherTeamMember.findMany({
      where: { organizationId },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            courses: true,
          },
        },
      },
    });
  }

  @Get(':organizationId/team-members/:memberId')
  async findTeamMember(
    @Param('organizationId') organizationId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.prisma.teacherTeamMember.findFirst({
      where: { 
        id: memberId,
        organizationId,
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        courses: {
          select: {
            id: true,
            title: true,
            isPublished: true,
            _count: {
              select: {
                purchases: true,
              },
            },
          },
        },
      },
    });
  }

  @Post(':organizationId/team-members')
  async createTeamMember(
    @Param('organizationId') organizationId: string,
    @Body() createDto: CreateTeacherTeamMemberDto,
  ) {
    return this.prisma.teacherTeamMember.create({
      data: {
        ...createDto,
        organizationId,
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  @Put(':organizationId/team-members/:memberId')
  async updateTeamMember(
    @Param('organizationId') organizationId: string,
    @Param('memberId') memberId: string,
    @Body() updateDto: UpdateTeacherTeamMemberDto,
  ) {
    return this.prisma.teacherTeamMember.update({
      where: { 
        id: memberId,
        organizationId,
      },
      data: updateDto,
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  @Delete(':organizationId/team-members/:memberId')
  async removeTeamMember(
    @Param('organizationId') organizationId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.prisma.teacherTeamMember.delete({
      where: { 
        id: memberId,
        organizationId,
      },
    });
  }
} 