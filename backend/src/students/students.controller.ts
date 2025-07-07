import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.student.findMany({
      include: {
        _count: {
          select: {
            purchases: true,
          },
        },
      },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.prisma.student.findUnique({
      where: { id },
      include: {
        purchases: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                thumbnail: true,
                organization: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        progress: {
          include: {
            lesson: {
              select: {
                id: true,
                title: true,
                chapter: {
                  select: {
                    id: true,
                    title: true,
                    courseId: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  @Get('clerk/:clerkUserId')
  async findByClerkUserId(@Param('clerkUserId') clerkUserId: string) {
    return this.prisma.student.findUnique({
      where: { clerkUserId },
      include: {
        purchases: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                thumbnail: true,
                organization: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  @Post()
  async create(@Body() createDto: CreateStudentDto) {
    return this.prisma.student.create({
      data: createDto,
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateStudentDto) {
    return this.prisma.student.update({
      where: { id },
      data: updateDto,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.prisma.student.delete({
      where: { id },
    });
  }

  // Purchase endpoints
  @Get(':id/purchases')
  async getPurchases(@Param('id') studentId: string) {
    return this.prisma.coursePurchase.findMany({
      where: { studentId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
            organization: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  @Post(':id/purchase/:courseId')
  async purchaseCourse(
    @Param('id') studentId: string,
    @Param('courseId') courseId: string,
    @Body() purchaseData: { amount: number },
  ) {
    return this.prisma.coursePurchase.create({
      data: {
        studentId,
        courseId,
        amount: purchaseData.amount,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
          },
        },
      },
    });
  }
}
