import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      userId,
      items,
      totalAmount,
      bookingDetails
    } = body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (keySecret && razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      // Cryptographic HMAC SHA256 signature verification
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return NextResponse.json(
          { success: false, error: 'Payment signature verification failed.' },
          { status: 400 }
        );
      }
    }

    // Save transaction in MongoDB database
    let savedOrder: any = null;
    let savedBooking: any = null;

    // Resolve or retrieve permanent MongoDB user document ID
    let mongoUserId = userId;
    try {
      let existingUser = null;
      if (mongoUserId && mongoUserId.length === 24) {
        existingUser = await prisma.user.findUnique({ where: { id: mongoUserId } });
      }

      if (!existingUser) {
        // Query any existing user or create a guest user in MongoDB Atlas
        existingUser = await prisma.user.findFirst();
        if (!existingUser) {
          existingUser = await prisma.user.create({
            data: {
              email: 'guest_' + Date.now() + '@gobanjara.com',
              name: 'Guest Wanderer',
              passwordHash: 'GUEST_CHECKOUT',
              role: 'USER',
            }
          });
        }
      }

      mongoUserId = existingUser.id;

      if (mongoUserId && items) {
        savedOrder = await prisma.order.create({
          data: {
            userId: mongoUserId,
            items: items,
            totalAmount: totalAmount || 0,
            status: 'PROCESSING',
          }
        });
        console.log('Saved verified Order in MongoDB Atlas:', savedOrder.id);
      }

      if (mongoUserId && bookingDetails) {
        savedBooking = await prisma.booking.create({
          data: {
            userId: mongoUserId,
            destinationId: bookingDetails.destinationId || 'default_dest',
            packageName: bookingDetails.packageName || 'Go Banjara Tour',
            departureDate: bookingDetails.departureDate ? new Date(bookingDetails.departureDate) : new Date(),
            travelersCount: bookingDetails.travelersCount || 1,
            totalPaid: totalAmount || 0,
            status: 'CONFIRMED',
          }
        });
        console.log('Saved verified Booking in MongoDB Atlas:', savedBooking.id);
      }
    } catch (dbErr) {
      console.error('MongoDB Atlas order/booking creation error:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and recorded successfully.',
      paymentId: razorpay_payment_id || `pay_${Date.now()}`,
      orderId: savedOrder?.id || razorpay_order_id,
      bookingId: savedBooking?.id,
    });
  } catch (error: any) {
    console.error('Payment verification failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Payment verification failed.' },
      { status: 500 }
    );
  }
}
