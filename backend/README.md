# EAD Backend

A Nest.js backend application with Prisma ORM for an E-learning platform with teacher organizations and student management.

## Features

- **Nest.js** - Progressive Node.js framework
- **Prisma** - Modern database toolkit
- **PostgreSQL** - Database
- **TypeScript** - Type safety
- **Validation** - Request validation with class-validator
- **Clerk Ready** - Database structure prepared for Clerk authentication integration

## Database Schema

The application includes the following models:
- **TeacherOrganization** - Organizations that can have multiple team members
- **TeacherTeamMember** - Team members within teacher organizations (OWNER, ADMIN, TEACHER, ASSISTANT roles)
- **Student** - Individual users who purchase courses
- **Course** - Educational courses with pricing and chapters
- **Chapter** - Organizes lessons within courses
- **Lesson** - Individual lessons within chapters
- **CoursePurchase** - Student purchases of courses
- **LessonProgress** - Student progress tracking for lessons
- **ClerkWebhook** - For future Clerk integration

## Setup

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Copy the .env file and update the DATABASE_URL
cp .env.example .env
```

3. Update the `.env` file with your database credentials:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/ead_db?schema=public"
PORT=3000
NODE_ENV=development
```

4. Generate Prisma client:
```bash
npm run db:generate
```

5. Push the database schema:
```bash
npm run db:push
```

### Running the Application

#### Development
```bash
npm run start:dev
```

#### Production
```bash
npm run build
npm run start:prod
```

### Database Commands

- **Generate Prisma Client**: `npm run db:generate`
- **Push Schema Changes**: `npm run db:push`
- **Create Migration**: `npm run db:migrate`
- **Open Prisma Studio**: `npm run db:studio`
- **Seed Database**: `npm run db:seed`

## API Endpoints

### Teacher Organizations
- `GET /teacher-organizations` - Get all organizations
- `GET /teacher-organizations/:id` - Get organization by ID
- `POST /teacher-organizations` - Create new organization
- `PUT /teacher-organizations/:id` - Update organization
- `DELETE /teacher-organizations/:id` - Delete organization

### Teacher Team Members (nested under organizations)
- `GET /teacher-organizations/:organizationId/team-members` - Get team members by organization
- `GET /teacher-organizations/:organizationId/team-members/:memberId` - Get team member by ID
- `POST /teacher-organizations/:organizationId/team-members` - Create new team member
- `PUT /teacher-organizations/:organizationId/team-members/:memberId` - Update team member
- `DELETE /teacher-organizations/:organizationId/team-members/:memberId` - Delete team member

### Students
- `GET /students` - Get all students
- `GET /students/:id` - Get student by ID
- `GET /students/clerk/:clerkUserId` - Get student by Clerk user ID
- `POST /students` - Create new student
- `PUT /students/:id` - Update student
- `DELETE /students/:id` - Delete student
- `GET /students/:id/purchases` - Get student purchases
- `POST /students/:id/purchase/:courseId` - Purchase course

### Courses
- `GET /courses` - Get all courses (with optional organizationId filter)
- `GET /courses/published` - Get published courses only
- `GET /courses/:id` - Get course by ID with chapters and lessons
- `POST /courses` - Create new course
- `PUT /courses/:id` - Update course
- `DELETE /courses/:id` - Delete course

### Chapters (nested under courses)
- `GET /courses/:courseId/chapters` - Get chapters for a course
- `GET /courses/:courseId/chapters/:chapterId` - Get chapter by ID
- `POST /courses/:courseId/chapters` - Create new chapter
- `PUT /courses/:courseId/chapters/:chapterId` - Update chapter
- `DELETE /courses/:courseId/chapters/:chapterId` - Delete chapter

### Lessons (nested under chapters)
- `GET /courses/:courseId/chapters/:chapterId/lessons` - Get lessons for a chapter
- `GET /courses/:courseId/chapters/:chapterId/lessons/:lessonId` - Get lesson by ID
- `POST /courses/:courseId/chapters/:chapterId/lessons` - Create new lesson
- `PUT /courses/:courseId/chapters/:chapterId/lessons/:lessonId` - Update lesson
- `DELETE /courses/:courseId/chapters/:chapterId/lessons/:lessonId` - Delete lesson

### Course Purchases
- `POST /courses/:courseId/purchase` - Purchase a course
- `GET /courses/:courseId/purchases` - Get all purchases for a course

## Project Structure

```
src/
├── app.module.ts                    # Main application module
├── main.ts                         # Application entry point
├── prisma/                         # Prisma configuration
│   ├── prisma.service.ts           # Prisma service
│   └── prisma.module.ts            # Prisma module
├── teacher-organizations/          # Teacher organizations & team members module
│   ├── teacher-organizations.controller.ts
│   ├── teacher-organizations.module.ts
│   └── dto/                        # Data Transfer Objects
├── students/                       # Students module
│   ├── students.controller.ts
│   ├── students.module.ts
│   └── dto/                        # Data Transfer Objects
├── courses/                        # Courses, chapters & lessons module
│   ├── courses.controller.ts
│   ├── courses.module.ts
│   └── dto/                        # Data Transfer Objects
└── ...
```

## Teacher Roles

- **OWNER** - Can manage organization and all courses
- **ADMIN** - Can manage courses and team members
- **TEACHER** - Can create and manage courses
- **ASSISTANT** - Can view and assist with courses

## Development

### Adding New Models

1. Update `prisma/schema.prisma`
2. Run `npm run db:generate`
3. Run `npm run db:push` or `npm run db:migrate`

### Adding New Controllers

1. Create controller file
2. Create DTOs for validation
3. Add to module
4. Import module in `app.module.ts`

## Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```
