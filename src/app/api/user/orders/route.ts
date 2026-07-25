import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const email = searchParams.get('email');

  try {
    let orders: any[] = [];
    let bookings: any[] = [];

    let userRecord = null;
    const cleanEmail = email ? email.trim().toLowerCase() : undefined;

    if (userId && userId.length === 24) {
      userRecord = await prisma.user.findUnique({ where: { id: userId } });
    }
    
    if (!userRecord && cleanEmail) {
      userRecord = await prisma.user.findUnique({ where: { email: cleanEmail } });
    }

    if (userRecord?.id) {
      orders = await prisma.order.findMany({
        where: { userId: userRecord.id },
        orderBy: { createdAt: 'desc' },
      });
      bookings = await prisma.booking.findMany({
        where: { userId: userRecord.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json({
      success: true,
      orders,
      bookings,
    });
  } catch (error: any) {
    console.error('Failed to fetch user orders from MongoDB:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch user orders.' },
      { status: 500 }
    );
  }
}
