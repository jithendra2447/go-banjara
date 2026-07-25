import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { instagramId, username, name, email, avatar } = body;

    const userEmail = email || `${username || instagramId || 'instagram_user'}@instagram.gobanjara.com`;
    const userName = name || username || 'Instagram Traveler';
    const userAvatar = avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop';

    const isAdmin = userEmail.toLowerCase() === 'gobanjara.trd@gmail.com' || userEmail.toLowerCase() === 'admin@gobanjara.com';

    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: userEmail.toLowerCase() },
          { email: `${username}@instagram.gobanjara.com` },
        ],
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userEmail.toLowerCase(),
          name: userName,
          passwordHash: 'INSTAGRAM_OAUTH_VERIFIED',
          role: isAdmin ? 'ADMIN' : 'USER',
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Instagram authentication successful.',
      user: {
        id: user.id,
        name: user.name || userName,
        email: user.email,
        avatar: userAvatar,
        role: isAdmin ? 'ADMIN' : (user.role || 'USER'),
        authType: 'instagram',
      },
    });
  } catch (error: any) {
    console.error('Instagram authentication failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Instagram authentication failed.' },
      { status: 500 }
    );
  }
}
