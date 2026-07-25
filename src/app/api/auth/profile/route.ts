import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const userId = searchParams.get('userId');

    if (!email && !userId) {
      return NextResponse.json({ success: false, error: 'Email or userId parameter required' }, { status: 400 });
    }

    const cleanEmail = email ? email.trim().toLowerCase() : undefined;
    let userRecord = null;

    if (cleanEmail) {
      userRecord = await prisma.user.findUnique({ where: { email: cleanEmail } });
    } else if (userId && userId.length === 24) {
      userRecord = await prisma.user.findUnique({ where: { id: userId } });
    }

    if (!userRecord) {
      return NextResponse.json({ success: false, error: 'User profile not found in database' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userRecord.id,
        name: userRecord.name,
        email: userRecord.email,
        phone: userRecord.phone,
        dob: userRecord.dob,
        gender: userRecord.gender,
        address: userRecord.address,
        pincode: userRecord.pincode,
        role: userRecord.role,
        createdAt: userRecord.createdAt,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

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
    const cleanEmail = email ? email.trim().toLowerCase() : undefined;
    const cleanPhone = phone ? phone.replace(/\D/g, '') : undefined;

    if (cleanEmail) {
      updatedUser = await prisma.user.upsert({
        where: { email: cleanEmail },
        update: {
          name: name || undefined,
          phone: cleanPhone || undefined,
          dob: dob || undefined,
          gender: gender || undefined,
          address: address || undefined,
          pincode: pincode || undefined,
        },
        create: {
          email: cleanEmail,
          name: name || 'Go Banjara User',
          phone: cleanPhone || null,
          dob: dob || null,
          gender: gender || null,
          address: address || null,
          pincode: pincode || null,
          passwordHash: 'USER_PROFILE_UPDATED',
          role: cleanEmail === 'gobanjara.trd@gmail.com' ? 'ADMIN' : 'USER',
        }
      });
      console.log('Saved/Updated profile in MongoDB Atlas:', updatedUser.email);
    } else if (userId && userId.length === 24) {
      updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          name: name || undefined,
          phone: cleanPhone || undefined,
          dob: dob || undefined,
          gender: gender || undefined,
          address: address || undefined,
          pincode: pincode || undefined,
        },
      });
    }

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'Failed to update user profile in database.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile details updated successfully in MongoDB Atlas.',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address || '',
        pincode: updatedUser.pincode || '',
        dob: updatedUser.dob || '',
        gender: updatedUser.gender || 'Male',
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
