import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Please enter your email address.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'No user account registered with this email address.' },
        { status: 404 }
      );
    }

    // Mock link generation
    const resetToken = Math.random().toString(36).substring(2, 15);

    return NextResponse.json({
      success: true,
      message: 'Password reset link sent.',
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
