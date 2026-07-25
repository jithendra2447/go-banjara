import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/?auth_error=instagram_cancelled', request.url));
  }

  const clientId = process.env.INSTAGRAM_CLIENT_ID || process.env.FACEBOOK_CLIENT_ID || '';
  const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET || process.env.FACEBOOK_CLIENT_SECRET || '';
  const redirectUri = `${new URL(request.url).origin}/api/auth/instagram/callback`;

  try {
    // 1. Exchange authorization code for Instagram Short-Lived Access Token
    const form = new URLSearchParams();
    form.append('client_id', clientId);
    form.append('client_secret', clientSecret);
    form.append('grant_type', 'authorization_code');
    form.append('redirect_uri', redirectUri);
    form.append('code', code);

    const tokenRes = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form,
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || (!tokenData.access_token && !tokenData.user_id)) {
      console.error('Instagram token exchange failed:', tokenData);
      return NextResponse.redirect(new URL('/?auth_error=instagram_token_failed', request.url));
    }

    const instagramUserId = tokenData.user_id;
    const accessToken = tokenData.access_token;

    // 2. Fetch User Profile Details from Instagram Graph API
    let username = `insta_user_${instagramUserId}`;
    try {
      const userRes = await fetch(
        `https://graph.instagram.com/me?fields=id,username,account_type&access_token=${accessToken}`
      );
      const instaUser = await userRes.json();
      if (instaUser.username) {
        username = instaUser.username;
      }
    } catch (e) {
      console.warn('Instagram profile fetch notice:', e);
    }

    const userEmail = `${username}@instagram.gobanjara.com`;

    // 3. Save User Profile in MongoDB Atlas
    const user = await prisma.user.upsert({
      where: { email: userEmail },
      update: {
        name: username || undefined,
        lastLoginAt: new Date(),
      },
      create: {
        email: userEmail,
        name: username,
        passwordHash: 'INSTAGRAM_OAUTH_VERIFIED',
        role: 'USER',
        lastLoginAt: new Date(),
      },
    });

    // Redirect user back to app profile page with session
    const successUrl = new URL('/profile', request.url);
    successUrl.searchParams.set('auth_success', 'instagram');
    successUrl.searchParams.set('email', userEmail);
    successUrl.searchParams.set('name', username);

    return NextResponse.redirect(successUrl);
  } catch (error) {
    console.error('Instagram OAuth callback failed:', error);
    return NextResponse.redirect(new URL('/?auth_error=server_error', request.url));
  }
}
