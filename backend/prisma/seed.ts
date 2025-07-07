import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create a sample organization
  const organization = await prisma.teacherOrganization.create({
    data: {
      name: 'Academy of Learning',
      description: 'A premier educational institution focused on online learning',
      website: 'https://academyoflearning.com',
      logo: 'https://example.com/logo.png',
    },
  });

  console.log('✅ Created organization:', organization.name);

  // Create a sample team member (teacher)
  const teamMember = await prisma.teacherTeamMember.create({
    data: {
      organizationId: organization.id,
      clerkUserId: 'user_placeholder_123',
      email: 'teacher@academyoflearning.com',
      name: 'John Doe',
      role: 'TEACHER',
      isActive: true,
    },
  });

  console.log('✅ Created team member:', teamMember.name);

  // Create a sample student
  const student = await prisma.student.create({
    data: {
      clerkUserId: 'student_placeholder_456',
      email: 'student@example.com',
      name: 'Jane Smith',
      avatar: 'https://example.com/avatar.jpg',
      isActive: true,
    },
  });

  console.log('✅ Created student:', student.name);

  console.log('🎉 Database seeding completed successfully!');
  console.log('');
  console.log('📋 Sample Data Created:');
  console.log(`   Organization ID: ${organization.id}`);
  console.log(`   Team Member ID: ${teamMember.id}`);
  console.log(`   Student ID: ${student.id}`);
  console.log('');
  console.log('💡 You can now create courses using these IDs');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 