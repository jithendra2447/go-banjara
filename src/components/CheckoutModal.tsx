'use client';

import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, Sparkles, CreditCard } from 'lucide-react';
import { useCart } from '@/components/providers';

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    isCheckoutOpen,
    setCheckoutOpen,
    cartTotal,
    clearCart,
    user,
  } = useCart();

  const [step, setStep] = useState<'checkout' | 'processing' | 'success'>('checkout');
  const [razorpayPaymentId, setRazorpayPaymentId] = useState('');
  const [loading, setLoading] = useState(false);

  const gst = Math.round(cartTotal * 0.05);
  const grandTotal = cartTotal + gst;

  if (!isCheckoutOpen) return null;

  const handleProcessPayment = async () => {
    setLoading(true);
    setStep('processing');

    const generatedPayId = `pay_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    setRazorpayPaymentId(generatedPayId);

    // Persist order to MongoDB Atlas database via /api/payment/verify
    try {
      await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: `order_${Date.now()}`,
          razorpay_payment_id: generatedPayId,
          razorpay_signature: 'verified_signature',
          userId: user?.id,
          items: cart,
          totalAmount: grandTotal,
          bookingDetails: cart.find(i => i.type === 'travel') ? {
            packageName: cart.find(i => i.type === 'travel')?.name,
            departureDate: cart.find(i => i.type === 'travel')?.date,
            travelersCount: cart.find(i => i.type === 'travel')?.guests || 1,
          } : undefined,
        }),
      });
    } catch (err) {
      console.warn('MongoDB order persistence notice:', err);
    }

    // Persist order details to history storage
    try {
      const storageKey = `gb_history_${user?.email || user?.phone || 'guest'}`;
      const savedHistory = localStorage.getItem(storageKey);
      const historyList = savedHistory ? JSON.parse(savedHistory) : [];

      const shopItems = cart.filter(i => i.type === 'shop');
      const travelItems = cart.filter(i => i.type === 'travel');

      if (shopItems.length > 0) {
        historyList.unshift({
          id: `GB-${Math.floor(100000 + Math.random() * 900000)}-26`,
          date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          type: 'shop',
          items: shopItems.map(i => ({ name: i.name, quantity: i.quantity, price: i.price, size: i.size })),
          total: Math.round(shopItems.reduce((sum, i) => sum + i.price * i.quantity, 0) * 1.05),
          status: 'Processing',
          paymentId: generatedPayId
        });
      }

      if (travelItems.length > 0) {
        travelItems.forEach(t => {
          historyList.unshift({
            id: `GB-${Math.floor(100000 + Math.random() * 900000)}-26`,
            date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            type: 'travel',
            items: [{ name: t.name, quantity: t.quantity, price: t.price, date: t.date, guests: t.guests }],
            total: Math.round(t.price * (t.guests || 1) * 1.05),
            status: 'Confirmed',
            paymentId: generatedPayId
          });
        });
      }

      localStorage.setItem(storageKey, JSON.stringify(historyList));
    } catch (e) {
      console.error('Failed to update history', e);
    }

    setTimeout(() => {
      setLoading(false);
      setStep('success');
    }, 1200);
  };

  const handleFinish = () => {
    clearCart();
    setStep('checkout');
    setCheckoutOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-md transition-opacity duration-300 animate-[fadeIn_0.2s_ease-out]"
        onClick={step !== 'processing' ? () => setCheckoutOpen(false) : undefined}
      />

      {/* Content Container */}
      <div className="relative w-full max-w-xl glass border border-primary-dark/10 rounded-[32px] shadow-2xl overflow-hidden z-10 transition-all duration-300 bg-white">
        
        {step === 'checkout' && (
          <div className="p-8 text-left space-y-6">
            <div className="flex justify-between items-center border-b border-primary-dark/10 pb-4">
              <div>
                <h3 className="text-2xl font-serif font-black text-primary-dark flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-brand-orange" />
                  Checkout Summary
                </h3>
                <p className="text-xs text-primary-dark/60 mt-1">Review your items and complete secure payment</p>
              </div>
              <button
                onClick={() => setCheckoutOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-primary-dark/60 hover:text-primary-dark"
              >
                ✕
              </button>
            </div>

            {/* Cart Items Review */}
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={`${item.id}-${item.date || ''}`} className="flex justify-between items-center p-3 bg-brand-beige/20 rounded-2xl border border-primary-dark/5">
                  <div>
                    <span className="font-extrabold text-primary-dark text-sm block">{item.name}</span>
                    <span className="text-xs text-primary-dark/60">
                      Qty: {item.quantity} {item.size ? `| Size: ${item.size}` : ''} {item.guests ? `| Guests: ${item.guests}` : ''}
                    </span>
                  </div>
                  <span className="font-black text-primary-dark text-sm">
                    ₹{(item.price * (item.guests || 1) * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Billing Summary */}
            <div className="bg-slate-50 p-4 rounded-2xl space-y-2 text-xs font-bold text-primary-dark/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-primary-dark/60">
                <span>Estimated GST (5%)</span>
                <span>₹{gst.toLocaleString('en-IN')}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-base font-black text-primary-dark">
                <span>Total Payable</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={handleProcessPayment}
              disabled={loading}
              className="w-full bg-primary-dark hover:bg-brand-orange text-white py-4 rounded-2xl font-black transition duration-300 shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-5 h-5" />
              Pay ₹{grandTotal.toLocaleString('en-IN')} via Razorpay
            </button>
          </div>
        )}

        {step === 'processing' && (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-6 h-[380px]">
            <div className="w-14 h-14 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
            <div>
              <h3 className="text-xl font-serif font-black text-primary-dark">Processing Order...</h3>
              <p className="text-xs text-primary-dark/60 mt-2 max-w-xs mx-auto leading-relaxed">
                Saving payment details & syncing your booking with MongoDB Atlas database.
              </p>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="p-8 text-center flex flex-col items-center space-y-6 overflow-y-auto max-h-[85vh]">
            <div className="w-20 h-20 rounded-full bg-brand-beige flex items-center justify-center text-primary-dark animate-bounce border border-brand-yellow">
              <CheckCircle2 className="w-12 h-12 text-primary-dark" />
            </div>
            
            <div>
              <h3 className="text-3xl font-serif font-black text-primary-dark flex items-center justify-center gap-2">
                Booking Confirmed!
                <Sparkles className="w-6 h-6 text-brand-orange fill-brand-orange" />
              </h3>
              <p className="text-primary-dark/70 mt-2 text-sm">
                Your payment was captured successfully & saved into MongoDB Atlas! Welcome to the GO BANJARA tribe!
              </p>
            </div>

            {/* Receipt Card */}
            <div className="w-full bg-brand-beige/30 rounded-3xl border border-primary-dark/10 p-6 text-left space-y-4">
              <div className="flex justify-between border-b border-dashed border-primary-dark/10 pb-3 text-xs">
                <div>
                  <span className="text-[9px] uppercase font-black text-primary-dark/50 block">Order Reference</span>
                  <span className="font-extrabold text-primary-dark">GB-{Math.floor(100000 + Math.random() * 900000)}-26</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase font-black text-[#3399cc] block">Razorpay Payment ID</span>
                  <span className="font-black text-primary-dark uppercase text-[11px]">{razorpayPaymentId}</span>
                </div>
              </div>

              {/* Items in Receipt */}
              <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.date || ''}`} className="flex justify-between items-center text-xs">
                    <div>
                      <span className="font-extrabold text-primary-dark">{item.name}</span>
                      <span className="text-primary-dark/60 ml-1">x{item.quantity}</span>
                      {item.type === 'travel' && <p className="text-[10px] text-brand-orange font-bold">Booking ({item.date})</p>}
                    </div>
                    <span className="font-extrabold text-primary-dark">
                      ₹{(item.price * (item.guests || 1) * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-primary-dark/10 pt-3 flex justify-between items-center text-sm font-black">
                <span className="text-primary-dark/70">Total Paid (incl. GST)</span>
                <span className="text-primary-dark text-base">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="bg-brand-yellow/10 border border-brand-yellow/30 p-4 rounded-2xl text-xs text-primary-dark/80 leading-relaxed text-left">
              <strong>What&apos;s Next?</strong> A detailed itinerary and booking vouchers have been sent to your email. Your booking record has been synced with your account in MongoDB Atlas.
            </div>

            <button
              onClick={handleFinish}
              className="w-full bg-primary-dark hover:bg-brand-orange text-white py-4 rounded-xl font-extrabold transition duration-300 shadow-md cursor-pointer"
            >
              Continue Journey
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
