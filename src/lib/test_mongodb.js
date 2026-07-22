const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Testing connection to MongoDB Atlas cluster...');
  try {
    const userCount = await prisma.user.count();
    console.log(`Successfully connected to MongoDB Atlas! Total users in database: ${userCount}`);
  } catch (error) {
    console.error('MongoDB Atlas Connection Notice:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
