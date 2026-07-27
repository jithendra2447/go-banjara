import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, identifier } = await request.json();
    const target = (email || identifier || '').trim().toLowerCase();

    if (!target) {
      return NextResponse.json(
        { success: false, error: 'Please enter your registered email address or 10-digit mobile number.' },
        { status: 400 }
      );
    }

    const cleanPhone = target.replace(/\D/g, '');
    const last10 = cleanPhone.slice(-10);

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: target },
          ...(cleanPhone.length >= 10 ? [
            { phone: cleanPhone },
            { phone: { contains: last10 } },
          ] : [])
        ]
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'No account registered with this email or phone number.' },
        { status: 404 }
      );
    }

    const resetToken = Math.random().toString(36).substring(2, 15);

    return NextResponse.json({
      success: true,
      message: `User verified. Password reset instructions generated for ${user.email}.`,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
      },
      resetToken,
    });
  } catch (error: any) {
    console.error('Password reset request failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Password reset request failed.' },
      { status: 500 }
    );
  }
}

