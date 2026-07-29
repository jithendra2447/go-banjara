import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'You are already subscribed to our newsletter!',
      });
    }

    await prisma.newsletterSubscriber.create({
      data: { email: cleanEmail },
    });

    // Forward to Google Sheets Webhook via GET (Apps Script requires GET from external servers)
    if (process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
      try {
        const params = new URLSearchParams({
          formType: 'NEWSLETTER_SUBSCRIBE',
          name: 'Subscriber',
          email: cleanEmail,
          mobile: '',
          message: 'Subscribed to newsletter',
          submittedAt: new Date().toISOString(),
        });
        await fetch(`${process.env.GOOGLE_SHEETS_WEBHOOK_URL}?${params.toString()}`, {
          method: 'GET',
          redirect: 'follow',
        });
      } catch (sheetErr) {
        console.warn('Google Sheets Webhook Sync Notice:', sheetErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Subscribed successfully to GO BANJARA updates!',
    });
  } catch (error: any) {
    console.error('Newsletter subscribe error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}
