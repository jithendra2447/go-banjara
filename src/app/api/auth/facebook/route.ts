import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, name, email, avatar, uid } = body;

    const userEmail = (email || (uid ? `${uid}@facebook.gobanjara.com` : 'user@facebook.com')).toLowerCase();
    const userName = name || 'Facebook User';
    const userAvatar = avatar || 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop';

    const user = await prisma.user.upsert({
      where: { email: userEmail },
      update: {
        name: userName || undefined,
        lastLoginAt: new Date(),
      },
      create: {
        email: userEmail,
        name: userName,
        passwordHash: 'FACEBOOK_OAUTH_VERIFIED',
        role: 'USER',
        lastLoginAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Facebook authentication successful.',
      user: {
        id: user.id,
        name: user.name || userName,
        email: user.email,
        avatar: userAvatar,
        role: user.role || 'USER',
        authType: 'facebook',
      },
    });
  } catch (error: any) {
    console.error('Facebook authentication failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Facebook authentication failed.' },
      { status: 500 }
    );
  }
}
