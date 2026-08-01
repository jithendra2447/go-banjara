import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    // 1. Fetch all users
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // 2. Fetch all shop orders with user details
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // 3. Fetch all travel package bookings with user details
    const bookings = await prisma.booking.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // 4. Fetch newsletter subscribers
    const newsletterSubscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // 5. Fetch contact/form submissions
    const contactSubmissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      users,
      orders,
      bookings,
      newsletterSubscribers,
      contactSubmissions,
    });
  } catch (error: any) {
    console.error('Failed to fetch admin data from MongoDB:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch admin data.' },
      { status: 500 }
    );
  }
}
