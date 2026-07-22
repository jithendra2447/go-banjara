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

    // Query candidate users matching email or phone
    const candidateUsers = await prisma.user.findMany({
      where: {
        OR: [
          { email: cleanInput },
          ...(cleanPhone.length >= 10 ? [
            { phone: { contains: last10 } },
            { phone: cleanPhone },
            { phone: `+91${last10}` },
            { phone: `+91 ${last10}` },
          ] : [])
        ]
      },
      orderBy: { updatedAt: 'desc' }
    });

    if (!candidateUsers || candidateUsers.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No user account found matching this mobile number or email address.' },
        { status: 401 }
      );
    }

    const inputHash = await hashPassword(password);

    // Find the candidate record whose passwordHash matches inputHash
    let matchedUser = candidateUsers.find((u: any) => u.passwordHash === inputHash);

    if (!matchedUser) {
      return NextResponse.json(
        { success: false, error: 'Password is incorrect. Please check your credentials and try again.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Login successful.',
      user: {
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
        phone: matchedUser.phone,
        dob: matchedUser.dob || undefined,
        gender: matchedUser.gender || undefined,
        address: matchedUser.address || undefined,
        pincode: matchedUser.pincode || undefined,
        role: matchedUser.role,
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
