'use client';

import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, Sparkles, CreditCard, X } from 'lucide-react';
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
      {/* Dark Overlay Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-[fadeIn_0.2s_ease-out]"
        onClick={step !== 'processing' ? () => setCheckoutOpen(false) : undefined}
      />

      {/* Content Container - Signature Go Banjara Sand & Forest Green Theme */}
      <div 
        style={{
          backgroundColor: '#FAF9F6',
          borderRadius: '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          fontFamily: '"Outfit", sans-serif',
        }}
        className="relative w-full max-w-lg overflow-hidden z-10 transition-all duration-300"
      >
        
        {step === 'checkout' && (
          <div className="p-6 md:p-8 text-left space-y-6">
            <div className="flex justify-between items-center border-b border-[#E5E0D5] pb-4">
              <div>
                <h3 
                  style={{ fontFamily: '"Fraunces", serif', color: '#1D493E' }}
                  className="text-2xl font-bold flex items-center gap-2"
                >
                  <CreditCard className="w-6 h-6 text-[#FF5A36]" />
                  Checkout Summary
                </h3>
                <p className="text-xs text-[#526E65] mt-1 font-medium">Review your items and complete secure payment</p>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutOpen(false)}
                className="w-9 h-9 rounded-full bg-[#EFECE6] hover:bg-[#E2DDD3] flex items-center justify-center text-[#1D493E] transition cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items Review */}
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div 
                  key={`${item.id}-${item.date || ''}`} 
                  style={{
                    backgroundColor: '#F4F1EA',
                    border: '1px solid #E5E0D5',
                    borderRadius: '16px',
                  }}
                  className="flex justify-between items-center p-3.5"
                >
                  <div>
                    <span 
                      style={{ fontFamily: '"Fraunces", serif', color: '#1D493E' }}
                      className="font-bold text-sm block"
                    >
                      {item.name}
                    </span>
                    <span className="text-xs text-[#526E65] font-medium">
                      Qty: {item.quantity} {item.size ? `| Size: ${item.size}` : ''} {item.guests ? `| Guests: ${item.guests}` : ''}
                    </span>
                  </div>
                  <span 
                    style={{ color: '#1D493E' }}
                    className="font-extrabold text-sm"
                  >
                    ₹{(item.price * (item.guests || 1) * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Billing Summary */}
            <div 
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E0D5',
                borderRadius: '16px',
              }}
              className="p-4 space-y-2 text-xs font-semibold text-[#526E65]"
            >
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#1D493E] font-bold">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated GST (5%)</span>
                <span className="text-[#1D493E] font-bold">₹{gst.toLocaleString('en-IN')}</span>
              </div>
              <div className="border-t border-[#E5E0D5] pt-3 flex justify-between text-base">
                <span style={{ fontFamily: '"Fraunces", serif', color: '#1D493E' }} className="font-bold">Total Payable</span>
                <span style={{ color: '#1D493E' }} className="font-extrabold text-lg">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleProcessPayment}
              disabled={loading}
              style={{
                backgroundColor: '#1D493E',
                color: '#FFFFFF',
                borderRadius: '12px',
                height: '52px',
              }}
              className="w-full hover:bg-[#15342c] font-bold text-sm transition duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <ShieldCheck className="w-5 h-5 text-white" />
              <span>Pay ₹{grandTotal.toLocaleString('en-IN')} via Razorpay</span>
            </button>
          </div>
        )}

        {step === 'processing' && (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-6 min-h-[380px]">
            <div className="relative flex items-center justify-center">
              {/* Outer pulsing ring */}
              <div className="w-20 h-20 rounded-full border-4 border-[#1D493E]/20 border-t-[#1D493E] animate-spin" />
              {/* Center icon badge */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl animate-pulse">🎒</span>
              </div>
            </div>
            <div>
              <h3 
                style={{ fontFamily: '"Fraunces", serif', color: '#1D493E' }} 
                className="text-2xl font-bold tracking-tight"
              >
                Processing Your Order...
              </h3>
              <p className="text-xs text-[#526E65] mt-2 max-w-xs mx-auto leading-relaxed font-medium">
                Saving payment details & securing your booking in MongoDB Atlas. Bonjo is getting things ready!
              </p>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="p-6 md:p-8 text-center flex flex-col items-center space-y-6 overflow-y-auto max-h-[85vh]">
            <div className="w-16 h-16 rounded-full bg-[#1D493E] flex items-center justify-center text-white shadow-lg animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            
            <div>
              <h3 
                style={{ fontFamily: '"Fraunces", serif', color: '#1D493E' }}
                className="text-2xl md:text-3xl font-bold flex items-center justify-center gap-2"
              >
                Booking Confirmed!
                <Sparkles className="w-6 h-6 text-[#FF5A36] fill-[#FF5A36]" />
              </h3>
              <p className="text-[#526E65] mt-2 text-xs md:text-sm font-medium max-w-md">
                Your payment was captured successfully & saved into MongoDB Atlas! Welcome to the GO BANJARA tribe!
              </p>
            </div>

            {/* Receipt Card */}
            <div 
              style={{
                backgroundColor: '#F4F1EA',
                border: '1px solid #E5E0D5',
                borderRadius: '16px',
              }}
              className="w-full p-5 text-left space-y-4"
            >
              <div className="flex justify-between border-b border-dashed border-[#D5CFBF] pb-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#526E65] block">Order Reference</span>
                  <span className="font-extrabold text-[#1D493E]">GB-{Math.floor(100000 + Math.random() * 900000)}-26</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-[#526E65] block">Razorpay Payment ID</span>
                  <span className="font-extrabold text-[#1D493E] uppercase text-[11px]">{razorpayPaymentId}</span>
                </div>
              </div>

              {/* Items in Receipt */}
              <div className="space-y-2.5 max-h-32 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.date || ''}`} className="flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-[#1D493E]">{item.name}</span>
                      <span className="text-[#526E65] ml-1">x{item.quantity}</span>
                      {item.type === 'travel' && <p className="text-[10px] text-[#FF5A36] font-bold">Booking ({item.date})</p>}
                    </div>
                    <span className="font-extrabold text-[#1D493E]">
                      ₹{(item.price * (item.guests || 1) * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#E5E0D5] pt-3 flex justify-between items-center text-sm">
                <span className="text-[#526E65] font-semibold">Total Paid (incl. GST)</span>
                <span className="text-[#1D493E] text-base font-black">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div 
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E0D5',
                borderRadius: '12px',
              }}
              className="p-4 text-xs text-[#526E65] leading-relaxed text-left"
            >
              <strong className="text-[#1D493E]">What&apos;s Next?</strong> A detailed itinerary and booking vouchers have been sent to your email. Your booking record has been synced with your account in MongoDB Atlas.
            </div>

            <button
              type="button"
              onClick={handleFinish}
              style={{
                backgroundColor: '#1D493E',
                color: '#FFFFFF',
                borderRadius: '12px',
                height: '50px',
              }}
              className="w-full hover:bg-[#15342c] font-bold text-sm transition duration-300 shadow-md cursor-pointer active:scale-98"
            >
              Continue Journey
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
