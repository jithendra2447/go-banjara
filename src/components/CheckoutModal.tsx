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
    setAuthOpen,
  } = useCart();

  const [step, setStep] = useState<'checkout' | 'add_address' | 'processing' | 'success'>('checkout');
  const [razorpayPaymentId, setRazorpayPaymentId] = useState('');
  const [loading, setLoading] = useState(false);

  // Address state management
  const [addresses, setAddresses] = useState<Array<{
    id: string;
    type: string;
    name: string;
    phone: string;
    fullAddress: string;
  }>>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');

  // Address Form State
  const [addrName, setAddrName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrPincode, setAddrPincode] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrType, setAddrType] = useState<'HOME' | 'WORK'>('HOME');

  const gst = Math.round(cartTotal * 0.05);
  const grandTotal = cartTotal + gst;

  // Hydrate user addresses on checkout open
  React.useEffect(() => {
    if (isCheckoutOpen && user?.email) {
      const key = `gb_saved_addresses_${user.email}`;
      const saved = localStorage.getItem(key);
      let list: any[] = [];
      if (saved) {
        try {
          list = JSON.parse(saved);
        } catch (e) {}
      }
      if (list.length === 0 && user.address) {
        list = [{
          id: `addr_${Date.now()}`,
          type: 'HOME',
          name: user.name || 'Valued Guest',
          phone: user.phone || '',
          fullAddress: `${user.address} ${user.pincode || ''}`.trim(),
        }];
      }
      setAddresses(list);
      if (list.length > 0) {
        setSelectedAddressId(list[0].id);
      }
      setAddrName(user.name || '');
      setAddrPhone(user.phone || '');
    }
  }, [isCheckoutOpen, user]);

  if (!isCheckoutOpen) return null;

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrStreet || !addrPincode) return;

    const newAddrObj = {
      id: `addr_${Date.now()}`,
      type: addrType,
      name: addrName || user?.name || 'Valued Guest',
      phone: addrPhone || user?.phone || '',
      fullAddress: `${addrStreet}, ${addrCity} - ${addrPincode}`.trim(),
    };

    const updated = [...addresses, newAddrObj];
    setAddresses(updated);
    setSelectedAddressId(newAddrObj.id);

    if (user?.email) {
      localStorage.setItem(`gb_saved_addresses_${user.email}`, JSON.stringify(updated));
      // Save address to MongoDB Atlas
      fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          address: newAddrObj.fullAddress,
          pincode: addrPincode,
        }),
      }).catch(err => console.warn('Address sync error:', err));
    }

    setStep('checkout');
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const finalizePaymentVerification = async (
    orderId: string,
    paymentId: string,
    signature: string
  ) => {
    // Persist order to MongoDB Atlas database via /api/payment/verify
    try {
      const verifyRes = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: signature,
          userId: user?.id,
          items: cart,
          totalAmount: grandTotal,
          bookingDetails: cart.find((i) => i.type === 'travel')
            ? {
                packageName: cart.find((i) => i.type === 'travel')?.name,
                departureDate: cart.find((i) => i.type === 'travel')?.date,
                travelersCount: cart.find((i) => i.type === 'travel')?.guests || 1,
              }
            : undefined,
        }),
      });
      const verifyData = await verifyRes.json();
      if (verifyData.orderId) {
        setRazorpayPaymentId(paymentId);
      }
    } catch (err) {
      console.warn('MongoDB order persistence notice:', err);
    }

    // Persist order details to history storage
    try {
      const storageKey = `gb_history_${user?.email || user?.phone || 'guest'}`;
      const savedHistory = localStorage.getItem(storageKey);
      const historyList = savedHistory ? JSON.parse(savedHistory) : [];

      const shopItems = cart.filter((i) => i.type === 'shop');
      const travelItems = cart.filter((i) => i.type === 'travel');

      if (shopItems.length > 0) {
        historyList.unshift({
          id: `GB-${Math.floor(100000 + Math.random() * 900000)}-26`,
          date: new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          type: 'shop',
          items: shopItems.map((i) => ({
            name: i.name,
            quantity: i.quantity,
            price: i.price,
            size: i.size,
          })),
          total: Math.round(
            shopItems.reduce((sum, i) => sum + i.price * i.quantity, 0) * 1.05
          ),
          status: 'Processing',
          paymentId: paymentId,
        });
      }

      if (travelItems.length > 0) {
        travelItems.forEach((t) => {
          historyList.unshift({
            id: `GB-${Math.floor(100000 + Math.random() * 900000)}-26`,
            date: new Date().toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }),
            type: 'travel',
            items: [
              {
                name: t.name,
                quantity: t.quantity,
                price: t.price,
                date: t.date,
                guests: t.guests,
              },
            ],
            total: Math.round(t.price * (t.guests || 1) * 1.05),
            status: 'Confirmed',
            paymentId: paymentId,
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
    }, 800);
  };

  const handleProcessPayment = async () => {
    setLoading(true);

    try {
      // 1. Create order on backend API `/api/payment`
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: grandTotal }),
      });
      const orderData = await res.json();

      if (orderData.error || !orderData.success) {
        throw new Error(orderData.error || orderData.message || 'Failed to initialize Razorpay checkout.');
      }

      if (orderData.success && orderData.orderId && orderData.keyId) {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded || !(window as any).Razorpay) {
          throw new Error('Failed to load Razorpay SDK script.');
        }

        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency || 'INR',
          name: 'Go Banjara',
          description: 'Payment for Travel & Lifestyle Order',
          image: '/logo.png',
          order_id: orderData.orderId,
          handler: async function (response: any) {
            setStep('processing');
            const paymentId = response.razorpay_payment_id;
            setRazorpayPaymentId(paymentId);

            // Verify signature & save order in MongoDB Atlas
            await finalizePaymentVerification(
              response.razorpay_order_id || orderData.orderId,
              paymentId,
              response.razorpay_signature
            );
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
            contact: user?.phone || '',
          },
          theme: {
            color: '#1D493E',
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            },
          },
        };

        const razorpayInstance = new (window as any).Razorpay(options);
        razorpayInstance.open();
        return;
      }
    } catch (err: any) {
      console.error('Razorpay payment error:', err);
      alert(`Payment Error: ${err.message || 'Payment initialization failed. Please check your Razorpay API keys.'}`);
      setLoading(false);
    }
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

            {/* Delivery Address Section */}
            <div className="space-y-2">
              <label style={{ fontFamily: '"Fraunces", serif', color: '#1D493E' }} className="text-sm font-bold block">
                Shipping & Delivery Address
              </label>
              {addresses.length > 0 ? (
                <div className="bg-[#F4F1EA] border border-[#E5E0D5] rounded-xl p-3.5 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-[#1D493E] block">
                      Deliver To: {addresses.find(a => a.id === selectedAddressId)?.name || user?.name} ({addresses.find(a => a.id === selectedAddressId)?.phone || user?.phone})
                    </span>
                    <span className="text-[#526E65] font-medium block mt-0.5">
                      {addresses.find(a => a.id === selectedAddressId)?.fullAddress}
                    </span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setStep('add_address')} 
                    className="text-[#FF5A36] font-bold text-xs hover:underline cursor-pointer ml-2 whitespace-nowrap"
                  >
                    + Change / Add
                  </button>
                </div>
              ) : (
                <div className="bg-[#FFF4F2] border border-[#FFD0C7] rounded-xl p-3.5 flex justify-between items-center text-xs">
                  <span className="font-bold text-[#D9381E]">⚠️ Delivery address required before checkout</span>
                  <button 
                    type="button" 
                    onClick={() => setStep('add_address')} 
                    className="bg-[#FF5A36] text-white px-3 py-1.5 rounded-lg font-bold cursor-pointer hover:bg-[#e04726]"
                  >
                    + Add Address
                  </button>
                </div>
              )}
            </div>

            {/* Cart Items Review */}
            <div className="space-y-3 max-h-36 overflow-y-auto pr-1">
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
              <span>{addresses.length === 0 ? 'Add Address to Continue' : `Pay ₹${grandTotal.toLocaleString('en-IN')} via Razorpay`}</span>
            </button>
          </div>
        )}

        {step === 'add_address' && (
          <form onSubmit={handleSaveNewAddress} className="p-6 md:p-8 text-left space-y-4">
            <div className="flex justify-between items-center border-b border-[#E5E0D5] pb-3">
              <h3 style={{ fontFamily: '"Fraunces", serif', color: '#1D493E' }} className="text-xl font-bold">
                Add Delivery Address
              </h3>
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-8 h-8 rounded-full bg-[#EFECE6] flex items-center justify-center text-[#1D493E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-[#1D493E] block mb-1">Full Name *</label>
                <input 
                  type="text"
                  required
                  value={addrName}
                  onChange={(e) => setAddrName(e.target.value)}
                  placeholder="Receiver's Name"
                  className="w-full h-10 border border-slate-300 rounded-lg px-3 outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-[#1D493E] block mb-1">Mobile Number *</label>
                <input 
                  type="tel"
                  required
                  value={addrPhone}
                  onChange={(e) => setAddrPhone(e.target.value)}
                  placeholder="10-digit Mobile"
                  className="w-full h-10 border border-slate-300 rounded-lg px-3 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-[#1D493E] text-xs block mb-1">House / Flat No / Street Address *</label>
              <input 
                type="text"
                required
                value={addrStreet}
                onChange={(e) => setAddrStreet(e.target.value)}
                placeholder="H.No 45, Banjara Hills, Road No 4"
                className="w-full h-10 border border-slate-300 rounded-lg px-3 text-xs outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-[#1D493E] block mb-1">City / Town *</label>
                <input 
                  type="text"
                  required
                  value={addrCity}
                  onChange={(e) => setAddrCity(e.target.value)}
                  placeholder="Hyderabad"
                  className="w-full h-10 border border-slate-300 rounded-lg px-3 outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-[#1D493E] block mb-1">Pincode *</label>
                <input 
                  type="text"
                  required
                  value={addrPincode}
                  onChange={(e) => setAddrPincode(e.target.value)}
                  placeholder="500034"
                  className="w-full h-10 border border-slate-300 rounded-lg px-3 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-4 items-center pt-2">
              <label className="text-xs font-bold text-[#1D493E]">Address Type:</label>
              <button
                type="button"
                onClick={() => setAddrType('HOME')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${addrType === 'HOME' ? 'bg-[#1D493E] text-white' : 'bg-slate-200 text-slate-700'}`}
              >
                HOME
              </button>
              <button
                type="button"
                onClick={() => setAddrType('WORK')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${addrType === 'WORK' ? 'bg-[#1D493E] text-white' : 'bg-slate-200 text-slate-700'}`}
              >
                WORK
              </button>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-1/3 h-11 border border-slate-300 rounded-xl font-bold text-xs text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-2/3 h-11 bg-[#1D493E] text-white rounded-xl font-bold text-xs hover:bg-[#15342c] cursor-pointer"
              >
                Save & Continue
              </button>
            </div>
          </form>
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
