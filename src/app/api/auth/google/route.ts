import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, credential, name, email, avatar } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required for Google authentication.' },
        { status: 400 }
      );
    }

    const userEmail = email.toLowerCase();
    const userName = name || 'Google User';
    const userAvatar = avatar || '';

    const isAdmin = userEmail === 'gobanjara.trd@gmail.com' || userEmail === 'admin@gobanjara.com';

    let user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userEmail.toLowerCase(),
          name: userName,
          passwordHash: 'GOOGLE_OAUTH_VERIFIED',
          role: isAdmin ? 'ADMIN' : 'USER',
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Google authentication successful.',
      user: {
        id: user.id,
        name: user.name || userName,
        email: user.email,
        avatar: userAvatar,
        role: isAdmin ? 'ADMIN' : (user.role || 'USER'),
        authType: 'google',
      },
    });
  } catch (error: any) {
    console.error('Google authentication failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Google authentication failed.' },
      { status: 500 }
    );
  }
}
