import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function PUT(request: Request) {
  try {
    const { userId, name, email, phone, address, pincode } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Missing user account identifier.' },
        { status: 401 }
      );
    }

    // Try updating user details in MongoDB via Prisma
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Account updated successfully in database.',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone,
        address,
        pincode,
      },
    });
  } catch (error: any) {
    console.error('Profile update failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Profile update failed.' },
      { status: 500 }
    );
  }
}
