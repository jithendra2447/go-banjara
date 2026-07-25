import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/?auth_error=google_cancelled', request.url));
  }

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || '';
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
  const redirectUri = `${new URL(request.url).origin}/api/auth/google/callback`;

  try {
    // 1. Exchange authorization code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('Google token exchange failed:', tokenData);
      return NextResponse.redirect(new URL('/?auth_error=token_failed', request.url));
    }

    // 2. Fetch User Profile from Google UserInfo API
    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userRes.json();

    if (!googleUser.email) {
      return NextResponse.redirect(new URL('/?auth_error=no_email', request.url));
    }

    // 3. Save REAL user profile in MongoDB Atlas database
    let user = null;
    user = await prisma.user.upsert({
      where: { email: googleUser.email },
      update: {
        name: googleUser.name || undefined,
        lastLoginAt: new Date(),
      },
      create: {
        email: googleUser.email,
        name: googleUser.name || 'Google User',
        passwordHash: 'GOOGLE_OAUTH_VERIFIED',
        role: 'USER',
        lastLoginAt: new Date(),
      },
    });

    // Redirect user back to app homepage with session params
    const successUrl = new URL('/profile', request.url);
    successUrl.searchParams.set('auth_success', 'google');
    successUrl.searchParams.set('email', googleUser.email);
    successUrl.searchParams.set('name', googleUser.name || '');
    successUrl.searchParams.set('avatar', googleUser.picture || '');

    return NextResponse.redirect(successUrl);
  } catch (error) {
    console.error('Google OAuth callback failed:', error);
    return NextResponse.redirect(new URL('/?auth_error=server_error', request.url));
  }
}
