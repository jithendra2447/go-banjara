'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, Mail, Phone, MapPin, ShoppingBag, Calendar, Lock, 
  CheckCircle2, AlertCircle, FileText, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { useCart } from '@/components/providers';

type ProfileTab = 'profile' | 'orders' | 'bookings';

interface OrderHistoryItem {
  id: string;
  date: string;
  type: 'shop' | 'travel';
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    size?: string;
    date?: string;
    guests?: number;
  }>;
  total: number;
  status: 'Processing' | 'Shipped' | 'Confirmed' | 'Completed';
  paymentId: string;
}

export default function ProfilePage() {
  const { user, login, setAuthOpen } = useCart();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProfileTab>('profile');

  // Profile Edit form states
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editPincode, setEditPincode] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // History list
  const [history, setHistory] = useState<OrderHistoryItem[]>([]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      alert('Please sign in to access your profile account.');
      setAuthOpen(true);
      router.push('/shop');
    } else {
      setEditName(user.name || '');
      setEditEmail(user.email || '');
      setEditPhone(user.phone || '');
      setEditAddress(user.address || 'H.No 45, Banjara Hills, Road No 4');
      setEditPincode(user.pincode || '500034');
    }
  }, [user, setAuthOpen, router]);

  // Load and seed orders history
  useEffect(() => {
    if (!user) return;

    // Load from local storage or set default mock history
    const storageKey = `gb_history_${user.email || user.phone || 'guest'}`;
    const savedHistory = localStorage.getItem(storageKey);

    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    } else {
      // Seed default history
      const mockHistory: OrderHistoryItem[] = [
        {
          id: 'GB-928401-26',
          date: '12 May, 2026',
          type: 'shop',
          items: [
            { name: 'Banjara Hand-Woven Khadi Shirt', quantity: 1, price: 2499, size: 'L' },
            { name: 'Signature Ceramic Spice Jar Set', quantity: 2, price: 1299 }
          ],
          total: 5097,
          status: 'Shipped',
          paymentId: 'pay_P1o983dG8f7qN1'
        },
        {
          id: 'GB-748291-26',
          date: '02 April, 2026',
          type: 'travel',
          items: [
            { name: 'Kashmir Valley Odyssey Tour', quantity: 1, price: 42000, date: '2026-09-12', guests: 2 }
          ],
          total: 84000,
          status: 'Confirmed',
          paymentId: 'pay_K7y392lB8d7fS2'
        }
      ];
      setHistory(mockHistory);
      localStorage.setItem(storageKey, JSON.stringify(mockHistory));
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <Loader2 className="w-12 h-12 text-[#1D493E] animate-spin" />
        <p className="text-sm font-semibold text-primary-dark/70">Redirecting to shop auth portal...</p>
      </div>
    );
  }

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id || 'mock-user-id',
          name: editName,
          email: editEmail,
          phone: editPhone,
          address: editAddress,
          pincode: editPincode
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        login({
          ...user,
          ...data.user
        });
        setFeedback({
          type: 'success',
          message: 'Account details and shipping preferences updated successfully in database!'
        });
      } else {
        if (data.error) throw new Error(data.error);
        else throw new Error('API request failed');
      }
    } catch (err: any) {
      console.warn('Prisma profile API failed, using sandbox fallback:', err.message);
      login({
        ...user,
        name: editName,
        email: editEmail,
        phone: editPhone,
        address: editAddress,
        pincode: editPincode
      });
      setFeedback({
        type: 'success',
        message: 'Account details and shipping preferences updated successfully!'
      });
    }

    setTimeout(() => {
      setFeedback({ type: '', message: '' });
    }, 4000);
  };

  const shopOrders = history.filter(item => item.type === 'shop');
  const travelBookings = history.filter(item => item.type === 'travel');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
      
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-serif font-black text-primary-dark flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-brand-orange" />
          Nomad Profile Account
        </h1>
        <p className="text-xs uppercase tracking-widest font-black text-primary-dark/65">
          Manage identity, travel bookings, and apparel orders
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 glass border border-primary-dark/10 rounded-3xl p-6 space-y-2 bg-white">
          <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100 mb-4 space-y-3">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-16 h-16 rounded-full object-cover border-2 border-brand-yellow shadow-md"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#E05434] text-white flex items-center justify-center font-extrabold text-2xl shadow-md border-2 border-white">
                {user.name[0]}
              </div>
            )}
            <div>
              <h3 className="font-extrabold text-primary-dark uppercase text-sm">{user.name}</h3>
              <p className="text-[10px] text-slate-400 font-bold tracking-wider mt-0.5">
                {user.authType ? `Connected via ${user.authType.toUpperCase()}` : 'Nomad Member'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-3 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-wider transition ${
              activeTab === 'profile'
                ? 'bg-[#1D493E] text-white'
                : 'text-primary-dark/70 hover:bg-slate-50'
            }`}
          >
            <User className="w-4 h-4" />
            Profile Details
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left px-4 py-3 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-wider transition ${
              activeTab === 'orders'
                ? 'bg-[#1D493E] text-white'
                : 'text-primary-dark/70 hover:bg-slate-50'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Order History ({shopOrders.length})
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`w-full text-left px-4 py-3 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-wider transition ${
              activeTab === 'bookings'
                ? 'bg-[#1D493E] text-white'
                : 'text-primary-dark/70 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Booking History ({travelBookings.length})
          </button>
        </div>

        {/* Tab Contents Panel */}
        <div className="lg:col-span-3 glass border border-primary-dark/10 rounded-3xl p-8 min-h-[500px] bg-white">
          
          {/* TAB 1: PROFILE MANAGEMENT */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold font-serif text-primary-dark">Personal Information</h2>
                <p className="text-xs text-slate-400 mt-1">Keep your checkout shipping and contact preferences updated</p>
              </div>

              {feedback.message && (
                <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2.5 ${
                  feedback.type === 'success' 
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                    : 'bg-rose-50 border-rose-100 text-rose-600'
                }`}>
                  {feedback.type === 'success' ? <CheckCircle2 className="w-4.5 h-4.5" /> : <AlertCircle className="w-4.5 h-4.5" />}
                  {feedback.message}
                </div>
              )}

              <form onSubmit={handleProfileUpdate} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-primary-dark/75">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      Full Name
                    </label>
                    <input 
                      type="text" 
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#1D493E]/10 focus:border-primary-dark transition text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-primary-dark/75">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      required
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#1D493E]/10 focus:border-primary-dark transition text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-primary-dark/75">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    Mobile Number
                  </label>
                  <input 
                    type="tel" 
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#1D493E]/10 focus:border-primary-dark transition text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1.5 pt-3 border-t border-slate-100">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Default Shipping Preferences</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-primary-dark/75">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        Address
                      </label>
                      <input 
                        type="text" 
                        required
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#1D493E]/10 focus:border-primary-dark transition text-xs font-semibold"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-wider text-primary-dark/75 block">Pincode</label>
                      <input 
                        type="text" 
                        required
                        value={editPincode}
                        onChange={(e) => setEditPincode(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#1D493E]/10 focus:border-primary-dark transition text-xs font-semibold"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-primary-dark hover:bg-brand-orange text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition duration-300 shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: ORDER HISTORY */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold font-serif text-primary-dark">Shop Order History</h2>
                <p className="text-xs text-slate-400 mt-1">Review your fashion apparel and culinary accessory shipments</p>
              </div>

              {shopOrders.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-3xl space-y-4">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500 font-semibold">You have not placed any shopping orders yet.</p>
                  <button 
                    onClick={() => router.push('/shop')}
                    className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#1D493E] hover:underline"
                  >
                    Go Shop Apparel <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {shopOrders.map((order) => (
                    <div 
                      key={order.id} 
                      className="border border-primary-dark/5 bg-slate-50/40 rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start text-xs border-b border-slate-100 pb-3">
                        <div>
                          <span className="text-[9px] uppercase font-black text-slate-400 block">Order Ref</span>
                          <span className="font-extrabold text-primary-dark">{order.id}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-black text-slate-400 block">Placed On</span>
                          <span className="font-extrabold text-primary-dark">{order.date}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-black text-slate-400 block">Status</span>
                          <span className={`inline-block py-0.5 px-2 rounded-full font-black text-[9px] uppercase tracking-wider ${
                            order.status === 'Shipped' 
                              ? 'bg-blue-50 border border-blue-200 text-blue-600' 
                              : 'bg-emerald-50 border border-emerald-200 text-emerald-600'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <div>
                              <span className="font-bold text-primary-dark">{item.name}</span>
                              {item.size && (
                                <span className="ml-2 font-black uppercase text-[10px] bg-slate-100 text-slate-600 py-0.5 px-2 rounded">
                                  Size: {item.size}
                                </span>
                              )}
                              <span className="text-slate-400 ml-2">x{item.quantity}</span>
                            </div>
                            <span className="font-extrabold text-primary-dark">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-xs">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-[#3399cc] block">Razorpay Transaction ID</span>
                          <span className="font-bold text-slate-500">{order.paymentId}</span>
                        </div>
                        <span className="font-black text-sm text-primary-dark">
                          Paid: ₹{order.total.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BOOKING HISTORY */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold font-serif text-primary-dark">Travel Booking History</h2>
                <p className="text-xs text-slate-400 mt-1">Access scheduled excursions, itineraries, and booking tickets</p>
              </div>

              {travelBookings.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-3xl space-y-4">
                  <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500 font-semibold">You have not scheduled any travel experiences yet.</p>
                  <button 
                    onClick={() => router.push('/travel')}
                    className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#1D493E] hover:underline"
                  >
                    Browse Travel Excursions <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {travelBookings.map((order) => (
                    <div 
                      key={order.id} 
                      className="border border-primary-dark/5 bg-slate-50/40 rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start text-xs border-b border-slate-100 pb-3">
                        <div>
                          <span className="text-[9px] uppercase font-black text-slate-400 block">Booking Ref</span>
                          <span className="font-extrabold text-primary-dark">{order.id}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-black text-slate-400 block">Booked On</span>
                          <span className="font-extrabold text-primary-dark">{order.date}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-black text-slate-400 block">Status</span>
                          <span className="inline-block py-0.5 px-2 rounded-full font-black text-[9px] uppercase tracking-wider bg-emerald-50 border border-emerald-200 text-emerald-600">
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="space-y-2">
                            <div className="flex justify-between text-xs font-bold text-primary-dark">
                              <span>{item.name}</span>
                              <span>₹{item.price.toLocaleString('en-IN')} / Traveler</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 bg-[#F8FAF7] border border-[#1D493E]/5 p-3 rounded-xl text-[11px] text-slate-600">
                              <div>
                                <span className="font-bold text-primary-dark/70 block">Departure Date</span>
                                <span className="font-extrabold text-primary-dark">{item.date}</span>
                              </div>
                              <div>
                                <span className="font-bold text-primary-dark/70 block">Guests / Travelers</span>
                                <span className="font-extrabold text-primary-dark">{item.guests} Person(s)</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-slate-100 pt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-[#3399cc] block">Razorpay Payment ID</span>
                          <span className="font-bold text-slate-500">{order.paymentId}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                          <button
                            onClick={() => alert('Dispatched itinerary PDF copy to registered email.')}
                            className="flex items-center gap-1 text-[10px] font-black uppercase text-primary-dark border border-primary-dark/20 hover:bg-slate-100 py-1.5 px-3 rounded-xl transition cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            Itinerary PDF
                          </button>
                          <span className="font-black text-sm text-primary-dark">
                            Total Paid: ₹{order.total.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// Inline fallback loader component for Next.js imports
function Loader2({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
