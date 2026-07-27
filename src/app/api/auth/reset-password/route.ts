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
    const { identifier, newPassword } = await request.json();

    if (!identifier || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Please provide your email/phone and a new password.' },
        { status: 400 }
      );
    }

    // Password strength check
    const hasMinLength = newPassword.length >= 8;
    const hasCapital = /[A-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);

    if (!hasMinLength || !hasCapital || !hasNumber || !hasSpecial) {
      return NextResponse.json(
        {
          success: false,
          error: 'Password must be at least 8 characters long with 1 uppercase letter, 1 number, and 1 special character.',
        },
        { status: 400 }
      );
    }

    const cleanIdentifier = identifier.trim().toLowerCase();
    const cleanPhone = identifier.replace(/\D/g, '');
    const last10 = cleanPhone.slice(-10);

    // Find user by email OR phone
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanIdentifier },
          ...(cleanPhone.length >= 10 ? [
            { phone: cleanPhone },
            { phone: { contains: last10 } },
          ] : [])
        ]
      }
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'No user account found matching the provided details.' },
        { status: 404 }
      );
    }

    const passwordHash = await hashPassword(newPassword);

    const updatedUser = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        passwordHash,
        updatedAt: new Date(),
      },
    });

    console.log('Successfully updated password for user in MongoDB Atlas:', updatedUser.id);

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully! You can now log in with your new password.',
    });
  } catch (error: any) {
    console.error('Password reset failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update password.' },
      { status: 500 }
    );
  }
}
