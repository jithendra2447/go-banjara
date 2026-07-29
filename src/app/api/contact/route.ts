import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, mobile, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Please provide name, email, and message.' },
        { status: 400 }
      );
    }

    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        email: email.toLowerCase(),
        mobile: mobile || '',
        message,
      },
    });

    // Forward to Google Sheets Webhook if configured
    if (process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
      try {
        await fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            formType: 'CONTACT_US',
            name,
            email: email.toLowerCase(),
            mobile: mobile || '',
            message,
            submittedAt: new Date().toISOString(),
          }),
        });
      } catch (sheetErr) {
        console.warn('Google Sheets Webhook Sync Notice:', sheetErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for reaching out! Your message has been saved.',
      submissionId: submission.id,
    });
  } catch (error: any) {
    console.error('Contact submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit contact message.' },
      { status: 500 }
    );
  }
}
