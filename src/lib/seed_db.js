const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial data into MongoDB Atlas...');

  // 1. Seed Test Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@gobanjara.com' },
    update: {},
    create: {
      email: 'admin@gobanjara.com',
      name: 'Go Banjara Admin',
      phone: '9876543210',
      passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // 'admin123'
      role: 'ADMIN',
    },
  });
  console.log('Admin User Seeded:', adminUser.email);

  // 2. Seed Sample Product
  const sampleProduct = await prisma.product.create({
    data: {
      name: 'Banjara Explorer Leather Backpack',
      description: 'Handcrafted premium leather backpack designed for wanderlust travelers.',
      price: 2499.00,
      image: '/fur_jaden_backpack.jpg',
      category: 'Travel Bags',
      rating: 4.9,
      inStock: true,
    },
  });
  console.log('Sample Product Seeded:', sampleProduct.name);

  console.log('MongoDB Atlas seeding complete!');
}

main()
  .catch((e) => {
    console.error('Seeding Error:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
