import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import nodemailer from 'nodemailer';

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

    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetUrl = `https://go-banjara-1pvk.vercel.app/profile?action=reset-password&email=${encodeURIComponent(user.email)}&token=${resetToken}`;

    // Configure Nodemailer Transporter
    const smtpHost = process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com';
    const smtpPort = Number(process.env.EMAIL_SERVER_PORT || 587);
    const smtpUser = process.env.EMAIL_SERVER_USER || 'gobanjara.trd@gmail.com';
    const smtpPass = process.env.EMAIL_SERVER_PASSWORD || '';
    const emailFrom = process.env.EMAIL_FROM || 'Go Banjara <gobanjara.trd@gmail.com>';

    let mailSent = false;

    if (smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: emailFrom,
          to: user.email,
          subject: '🔐 Reset Your GO BANJARA Password',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #E2E8F0; rounded-radius: 8px;">
              <h2 style="color: #1D493E; margin-bottom: 16px;">GO BANJARA Password Reset</h2>
              <p style="color: #4A5568; font-size: 16px; line-height: 1.5;">Hello ${user.name || 'Nomad Wanderer'},</p>
              <p style="color: #4A5568; font-size: 16px; line-height: 1.5;">We received a request to reset the password for your GO BANJARA account (<strong>${user.email}</strong>).</p>
              <div style="margin: 28px 0; text-align: center;">
                <a href="${resetUrl}" style="background-color: #1D493E; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">Reset Password Now</a>
              </div>
              <p style="color: #718096; font-size: 14px; line-height: 1.5;">If button does not work, copy and paste this link into your browser:</p>
              <p style="color: #1D493E; font-size: 13px; word-break: break-all;"><a href="${resetUrl}">${resetUrl}</a></p>
              <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 24px 0;" />
              <p style="color: #A0AEC0; font-size: 12px; text-align: center;">If you did not request a password reset, please ignore this email.</p>
            </div>
          `,
        });
        mailSent = true;
        console.log(`Password reset email sent to ${user.email}`);
      } catch (mailErr) {
        console.error('Nodemailer failed to send reset email:', mailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: mailSent 
        ? `Password reset link has been sent to ${user.email}. Please check your inbox!`
        : `Account verified for ${user.email}. You can now proceed to set a new password.`,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
      },
      resetUrl,
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

