import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(request: Request) {
  try {
    const { identifier, email, password } = await request.json();
    const loginKey = identifier || email;

    if (!loginKey || !password) {
      return NextResponse.json(
        { success: false, error: 'Please enter your mobile number/email and password.' },
        { status: 400 }
      );
    }

    const cleanInput = loginKey.toLowerCase();
    const cleanPhone = loginKey.replace(/\D/g, '');
    const last10 = cleanPhone.slice(-10);

    // Query user matching email or phone directly from MongoDB Atlas
    const userRecord = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanInput },
          ...(cleanPhone.length >= 10 ? [
            { phone: cleanPhone },
            { phone: last10 },
            { phone: `+91${last10}` },
            { phone: `+91 ${last10}` },
          ] : [])
        ]
      }
    });

    // If user is not found in MongoDB Atlas, reject login request cleanly
    if (!userRecord) {
      return NextResponse.json(
        { success: false, error: 'No account found with this email/mobile number. Please sign up first.' },
        { status: 404 }
      );
    }

    // Verify password if a custom password hash is set
    const inputHash = await hashPassword(password);
    if (
      userRecord.passwordHash &&
      userRecord.passwordHash !== 'USER_SIGNED_UP' &&
      userRecord.passwordHash !== 'USER_PROFILE_UPDATED' &&
      userRecord.passwordHash !== inputHash
    ) {
      return NextResponse.json(
        { success: false, error: 'Incorrect password. Please check your credentials and try again.' },
        { status: 401 }
      );
    }

    const isAdminEmail = cleanInput === 'gobanjara.trd@gmail.com' || cleanInput === 'admin@gobanjara.com';

    // Persist latest login timestamp directly to MongoDB Atlas
    try {
      await prisma.user.update({
        where: { id: userRecord.id },
        data: {
          lastLoginAt: new Date(),
        },
      });
    } catch (updateErr) {
      console.warn('MongoDB Atlas lastLoginAt update notice:', updateErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Login successful.',
      user: {
        id: userRecord.id,
        name: userRecord.name,
        email: userRecord.email,
        phone: userRecord.phone || cleanPhone || '',
        dob: userRecord.dob || '',
        gender: userRecord.gender || 'Male',
        address: userRecord.address || '',
        pincode: userRecord.pincode || '',
        role: isAdminEmail ? 'ADMIN' : (userRecord.role || 'USER'),
        lastLoginAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Login failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Login failed.' },
      { status: 500 }
    );
  }
}
