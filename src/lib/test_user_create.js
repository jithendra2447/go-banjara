const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testUserRegistration() {
  const testEmail = `test_user_${Date.now()}@gobanjara.com`;
  console.log('Creating test user in MongoDB Atlas:', testEmail);

  try {
    const user = await prisma.user.create({
      data: {
        name: 'Test Banjara Traveler',
        email: testEmail,
        phone: '9988776655',
        passwordHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        role: 'USER',
      },
    });

    console.log('USER SUCCESSFULLY SAVED TO MONGODB ATLAS!');
    console.log('Saved User ID:', user.id);
    console.log('Saved Email:', user.email);

    const allUsers = await prisma.user.findMany();
    console.log(`Total users stored in MongoDB Atlas: ${allUsers.length}`);
  } catch (error) {
    console.error('Failed to create user in MongoDB:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testUserRegistration();
