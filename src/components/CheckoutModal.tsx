'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { useCart } from '@/components/providers';

// Helper to dynamically load the external Razorpay Checkout script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as Window & { Razorpay?: unknown }).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      resolve(true);
      return;
    };
    script.onerror = () => {
      resolve(false);
      return;
    };
    document.body.appendChild(script);
  });
};

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    isCheckoutOpen,
    setCheckoutOpen,
    cartTotal,
    clearCart,
    user,
  } = useCart();

  const [step, setStep] = useState<'processing' | 'success'>('processing');
  const [razorpayPaymentId, setRazorpayPaymentId] = useState('');

  const gst = Math.round(cartTotal * 0.05);
  const grandTotal = cartTotal + gst;

  // Auto-trigger Razorpay checkout when the modal opens
  useEffect(() => {
    if (!isCheckoutOpen) return;

    let active = true;

    const triggerPayment = async () => {
      setStep('processing');

      // 1. Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        if (active) {
          alert('Razorpay Checkout SDK failed to load. Please verify your internet connection.');
          setCheckoutOpen(false);
        }
        return;
      }

      // 2. Resolve Key ID: prioritize custom env key if configured, fallback to public test key on localhost
      const envKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      const isLocalhost = typeof window !== 'undefined' && 
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      
      const keyId = envKey || (isLocalhost ? 'rzp_test_5k6K89Lp3xCo5d' : 'rzp_live_SJ6c61Oqm7rmQV');

      // 3. Configure Razorpay Standard Checkout options
      const options = {
        key: keyId,
        amount: Math.round(grandTotal * 100), // amount in paise
        currency: 'INR',
        name: 'Go Banjāra',
        description: 'Secure Payment Transaction',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=faces', // Brand avatar
        handler: function (response: Record<string, string>) {
          if (active) {
            const payId = response.razorpay_payment_id || 'pay_mock_payment_id';
            setRazorpayPaymentId(payId);
            setStep('success');

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
                  paymentId: payId
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
                    paymentId: payId
                  });
                });
              }

              localStorage.setItem(storageKey, JSON.stringify(historyList));
            } catch (e) {
              console.error('Failed to update history', e);
            }
          }
        },
        prefill: {
          name: 'Banjara Explorer',
          email: 'explorer@gobanjara.com',
          contact: '9999999999',
        },
        theme: {
          color: '#1D493E', // Matches Signature Brand Green
        },
        modal: {
          ondismiss: function () {
            if (active) {
              setCheckoutOpen(false);
            }
          },
        },
      };

      const RazorpayConstructor = ((window as unknown) as { Razorpay: new (opts: typeof options) => { open: () => void } }).Razorpay;
      const paymentObject = new RazorpayConstructor(options);
      paymentObject.open();
    };

    triggerPayment();

    return () => {
      active = false;
    };
  }, [isCheckoutOpen, grandTotal, setCheckoutOpen, cart, user?.email, user?.phone]);

  if (!isCheckoutOpen) return null;

  const handleFinish = () => {
    clearCart();
    setStep('processing');
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
        
        {step === 'processing' && (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-6 h-[380px]">
            <Loader2 className="w-14 h-14 text-[#3399cc] animate-spin" />
            <div>
              <h3 className="text-xl font-serif font-black text-primary-dark">Connecting to Razorpay...</h3>
              <p className="text-xs text-primary-dark/60 mt-2 max-w-xs mx-auto leading-relaxed">
                Opening secure gateway. Please complete your transaction in the Razorpay popup checkout.
              </p>
            </div>
            <div className="w-64 bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#3399cc] h-full w-2/3 rounded-full animate-[pulse_1.5s_infinite]" style={{ animationDuration: '2s' }} />
            </div>
            <button
              onClick={() => setCheckoutOpen(false)}
              className="text-[10px] uppercase tracking-wider font-black text-slate-400 hover:text-primary-dark transition cursor-pointer"
            >
              Cancel Payment
            </button>
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
                Your payment was captured successfully via Razorpay. Welcome to the GO BANJARA tribe!
              </p>
            </div>

            {/* Receipt Card */}
            <div className="w-full bg-brand-beige/30 rounded-3xl border border-primary-dark/10 p-6 text-left space-y-4">
              <div className="flex justify-between border-b border-dashed border-primary-dark/10 pb-3 text-xs">
                <div>
                  <span className="text-[9px] uppercase font-black text-primary-dark/50 block">Order Reference</span>
                  <span className="font-extrabold text-primary-dark">GB-837492-26</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase font-black text-[#3399cc] block font-black">Razorpay Payment ID</span>
                  <span className="font-black text-primary-dark uppercase text-[11px]">{razorpayPaymentId || 'pay_test_payment_id'}</span>
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
              <strong>What&apos;s Next?</strong> A detailed itinerary and booking vouchers have been sent to your email. For travel packages, our Banjara Travel Ambassador will call you within 24 hours to coordinate details.
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
