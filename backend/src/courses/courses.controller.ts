import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly prisma: PrismaService) {}

  // Course endpoints
  @Get()
  async findAll(@Query('organizationId') organizationId?: string) {
    const where = organizationId ? { organizationId } : {};

    return this.prisma.course.findMany({
      where,
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            chapters: true,
            purchases: true,
          },
        },
      },
    });
  }

  @Get('published')
  async findPublished() {
    return this.prisma.course.findMany({
      where: { isPublished: true },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        createdBy: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            chapters: true,
            purchases: true,
          },
        },
      },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.prisma.course.findUnique({
      where: { id },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
        chapters: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                title: true,
                duration: true,
                isPublished: true,
              },
            },
          },
        },
        _count: {
          select: {
            purchases: true,
          },
        },
      },
    });
  }

  @Post()
  async create(@Body() createDto: CreateCourseDto) {
    return this.prisma.course.create({
      data: createDto,
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateCourseDto) {
    return this.prisma.course.update({
      where: { id },
      data: updateDto,
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.prisma.course.delete({
      where: { id },
    });
  }

  // Chapter endpoints (nested under course)
  @Get(':courseId/chapters')
  async findChapters(@Param('courseId') courseId: string) {
    return this.prisma.chapter.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            duration: true,
            isPublished: true,
          },
        },
      },
    });
  }

  @Get(':courseId/chapters/:chapterId')
  async findChapter(
    @Param('courseId') courseId: string,
    @Param('chapterId') chapterId: string,
  ) {
    return this.prisma.chapter.findFirst({
      where: {
        id: chapterId,
        courseId,
      },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  @Post(':courseId/chapters')
  async createChapter(
    @Param('courseId') courseId: string,
    @Body() createDto: CreateChapterDto,
  ) {
    return this.prisma.chapter.create({
      data: {
        ...createDto,
        courseId,
      },
    });
  }

  @Put(':courseId/chapters/:chapterId')
  async updateChapter(
    @Param('courseId') courseId: string,
    @Param('chapterId') chapterId: string,
    @Body() updateDto: Partial<CreateChapterDto>,
  ) {
    return this.prisma.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: updateDto,
    });
  }

  @Delete(':courseId/chapters/:chapterId')
  async removeChapter(
    @Param('courseId') courseId: string,
    @Param('chapterId') chapterId: string,
  ) {
    return this.prisma.chapter.delete({
      where: {
        id: chapterId,
        courseId,
      },
    });
  }

  // Lesson endpoints (nested under chapter)
  @Get(':courseId/chapters/:chapterId/lessons')
  async findLessons(
    @Param('courseId') courseId: string,
    @Param('chapterId') chapterId: string,
  ) {
    return this.prisma.lesson.findMany({
      where: {
        chapterId,
        chapter: { courseId },
      },
      orderBy: { order: 'asc' },
    });
  }

  @Get(':courseId/chapters/:chapterId/lessons/:lessonId')
  async findLesson(
    @Param('courseId') courseId: string,
    @Param('chapterId') chapterId: string,
    @Param('lessonId') lessonId: string,
  ) {
    return this.prisma.lesson.findFirst({
      where: {
        id: lessonId,
        chapterId,
        chapter: { courseId },
      },
    });
  }

  @Post(':courseId/chapters/:chapterId/lessons')
  async createLesson(
    @Param('courseId') courseId: string,
    @Param('chapterId') chapterId: string,
    @Body() createDto: CreateLessonDto,
  ) {
    return this.prisma.lesson.create({
      data: {
        ...createDto,
        chapterId,
      },
    });
  }

  @Put(':courseId/chapters/:chapterId/lessons/:lessonId')
  async updateLesson(
    @Param('courseId') courseId: string,
    @Param('chapterId') chapterId: string,
    @Param('lessonId') lessonId: string,
    @Body() updateDto: Partial<CreateLessonDto>,
  ) {
    return this.prisma.lesson.update({
      where: {
        id: lessonId,
        chapterId,
      },
      data: updateDto,
    });
  }

  @Delete(':courseId/chapters/:chapterId/lessons/:lessonId')
  async removeLesson(
    @Param('courseId') courseId: string,
    @Param('chapterId') chapterId: string,
    @Param('lessonId') lessonId: string,
  ) {
    return this.prisma.lesson.delete({
      where: {
        id: lessonId,
        chapterId,
      },
    });
  }

  // Purchase endpoints
  @Post(':courseId/purchase')
  async purchaseCourse(
    @Param('courseId') courseId: string,
    @Body() purchaseData: { studentId: string; amount: number },
  ) {
    return this.prisma.coursePurchase.create({
      data: {
        studentId: purchaseData.studentId,
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
        student: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  @Get(':courseId/purchases')
  async getCoursePurchases(@Param('courseId') courseId: string) {
    return this.prisma.coursePurchase.findMany({
      where: { courseId },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
}
