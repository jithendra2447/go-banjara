const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testOrder() {
  console.log('Testing live Order & Booking creation in MongoDB Atlas...');

  try {
    const adminUser = await prisma.user.findFirst({ where: { email: 'admin@gobanjara.com' } });

    if (!adminUser) {
      console.error('No admin user found!');
      return;
    }

    const newOrder = await prisma.order.create({
      data: {
        userId: adminUser.id,
        items: [
          { name: 'Banjara Explorer Backpack', quantity: 1, price: 2499.00 }
        ],
        totalAmount: 2624.00,
        status: 'PROCESSING',
      },
    });

    console.log('ORDER SUCCESSFULLY SAVED TO MONGODB ATLAS!');
    console.log('Saved Order ID:', newOrder.id);
    console.log('Total Amount:', newOrder.totalAmount);

    const totalOrders = await prisma.order.count();
    console.log(`Total Orders stored in MongoDB Atlas: ${totalOrders}`);
  } catch (err) {
    console.error('Order creation error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

testOrder();
