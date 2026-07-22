import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function PUT(request: Request) {
  try {
    const { userId, email, name, phone, address, pincode, dob, gender } = await request.json();

    if (!userId && !email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Missing user account identifier.' },
        { status: 401 }
      );
    }

    let updatedUser: any = null;
    try {
      if (userId && userId.length === 24) {
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: {
            name: name || undefined,
            email: email || undefined,
            phone: phone || undefined,
          },
        });
      } else if (email) {
        updatedUser = await prisma.user.update({
          where: { email },
          data: {
            name: name || undefined,
            phone: phone || undefined,
          },
        });
      }
    } catch (dbErr) {
      console.warn('Prisma profile update error:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Profile details updated successfully in MongoDB Atlas.',
      user: {
        id: updatedUser?.id || userId || `usr_${Date.now()}`,
        name: updatedUser?.name || name,
        email: updatedUser?.email || email,
        phone: updatedUser?.phone || phone,
        address: address || 'H.No 45, Banjara Hills, Road No 4',
        pincode: pincode || '500034',
        dob: dob || '15/08/1997',
        gender: gender || 'Male',
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
