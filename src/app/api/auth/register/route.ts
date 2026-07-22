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
    const { name, email, phone, password } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: 'Please provide all registration fields.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
    const last10 = cleanPhone.slice(-10);

    // Check if user already exists by email OR phone suffix
    let existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          ...(cleanPhone.length >= 10 ? [
            { phone: { contains: last10 } },
            { phone: cleanPhone },
          ] : [])
        ]
      }
    });

    const passwordHash = await hashPassword(password);

    let newUser;
    if (existingUser) {
      // Update existing record (e.g. created during OTP verification or previous step)
      newUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name,
          email: cleanEmail,
          phone: cleanPhone || existingUser.phone,
          passwordHash,
        }
      });
    } else {
      newUser = await prisma.user.create({
        data: {
          name,
          email: cleanEmail,
          phone: cleanPhone,
          passwordHash,
          role: 'USER',
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Account registered successfully.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    console.error('Registration failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Registration failed.' },
      { status: 500 }
    );
  }
}
