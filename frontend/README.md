# E-Learning Platform Frontend

A modern Next.js frontend application for the e-learning platform.

## Features

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API communication
- **Clerk** - Authentication and user management
- **Lucide React** - Beautiful icons
- **Radix UI** - Accessible UI components
- **Class Variance Authority** - Component variants

### Teacher Dashboard Features

- **Course Management** - Create, edit, and manage courses
- **Organization Management** - Create and manage teaching organizations
- **Team Management** - Invite and manage team members with different roles
- **Chapter & Lesson Management** - Organize course content
- **Analytics Dashboard** - Track course performance and revenue
- **Real-time Updates** - Live data from backend API

### Student Features

- **Course Discovery** - Browse and search available courses
- **Course Purchases** - Buy courses and track progress
- **Learning Progress** - Track completion of lessons and chapters

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Copy the .env.local file and update with your Clerk credentials
cp .env.example .env.local
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── courses/           # Courses pages
│   ├── dashboard/         # Teacher dashboard
│   │   ├── courses/       # Course management
│   │   │   ├── create/    # Create new course
│   │   │   └── [courseId] # Edit course
│   │   └── organization/  # Organization management
│   │       ├── create/    # Create organization
│   │       └── team/      # Team management
│   ├── auth/              # Authentication pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   └── ui/               # UI components (Button, Card, Tabs, etc.)
├── lib/                  # Utility functions and API
│   ├── api/              # API services and types
│   │   ├── api.ts        # Axios configuration
│   │   ├── courses.ts    # Courses API functions
│   │   ├── students.ts   # Students API functions
│   │   ├── organizations.ts # Organizations API functions
│   │   └── index.ts      # API exports
│   └── utils.ts          # Common utilities
└── ...
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Development

### Adding New Pages

1. Create a new folder in `src/app/`
2. Add a `page.tsx` file
3. Export a default React component

### Adding New Components

1. Create a new file in `src/components/`
2. Use the `cn()` utility for class merging
3. Follow the existing component patterns


