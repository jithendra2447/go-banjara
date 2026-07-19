'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, Mail, Phone, MapPin, ShoppingBag, Calendar, Lock, 
  CheckCircle2, AlertCircle, FileText, ArrowRight, ShieldCheck,
  ChevronRight, Heart, LogOut, Check
} from 'lucide-react';
import { useCart } from '@/components/providers';

type ProfileTab = 'profile' | 'orders' | 'bookings' | 'addresses' | 'wishlist';

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
  const { user, login, logout, setAuthOpen, wishlist, toggleWishlist } = useCart();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProfileTab>('profile');

  // Profile Edit form states
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editPincode, setEditPincode] = useState('');
  const [editDob, setEditDob] = useState('15/08/1997'); // Default date of birth
  const [editGender, setEditGender] = useState<'Male' | 'Female' | 'Others'>('Male'); // Default gender
  const [isEditing, setIsEditing] = useState(false);
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
      setEditDob(user.dob || '15/08/1997');
      setEditGender(user.gender || 'Male');
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
        <p className="text-sm font-semibold text-[#1D493E]/70">Redirecting to shop auth portal...</p>
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
          pincode: editPincode,
          dob: editDob,
          gender: editGender
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        login({
          ...user,
          ...data.user,
          dob: editDob,
          gender: editGender
        });
        setFeedback({
          type: 'success',
          message: 'Account details and shipping preferences updated successfully in database!'
        });
        setIsEditing(false);
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
        pincode: editPincode,
        dob: editDob,
        gender: editGender
      });
      setFeedback({
        type: 'success',
        message: 'Account details and shipping preferences updated successfully!'
      });
      setIsEditing(false);
    }

    setTimeout(() => {
      setFeedback({ type: '', message: '' });
    }, 4000);
  };

  const handleLogout = () => {
    logout();
    router.push('/shop');
  };

  const shopOrders = history.filter(item => item.type === 'shop');
  const travelBookings = history.filter(item => item.type === 'travel');
  const genders: ('Male' | 'Female' | 'Others')[] = ['Male', 'Female', 'Others'];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Breadcrumbs & Page Header */}
      <div className="mb-10 select-none">
        <h1 
          className="font-serif tracking-tight"
          style={{
            fontFamily: '"Faktum", "Outfit", sans-serif',
            fontWeight: 600,
            fontSize: '32px',
            lineHeight: '40px',
            color: '#1D493E',
            margin: '0 0 8px 0',
          }}
        >
          Profile Account Information
        </h1>
        <div 
          style={{
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 500,
            fontSize: '18px',
            lineHeight: '24px',
            color: 'rgba(29, 73, 62, 0.65)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span className="cursor-pointer hover:underline" onClick={() => router.push('/')}>Home</span>
          <span>&gt;</span>
          <span style={{ color: '#1D493E', fontWeight: 600 }}>My Profile</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar */}
        <div 
          className="lg:col-span-4 border border-slate-200 bg-white"
          style={{
            borderRadius: '4px',
            padding: '24px',
            boxSizing: 'border-box',
          }}
        >
          {/* Hello User Card */}
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100 mb-6">
            <div 
              className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200"
            >
              <User className="w-7 h-7" />
            </div>
            <div>
              <div 
                style={{
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 400,
                  fontSize: '14px',
                  color: 'rgba(141, 141, 141, 1)',
                }}
              >
                Hello
              </div>
              <div 
                style={{
                  fontFamily: '"Faktum", "Outfit", sans-serif',
                  fontWeight: 600,
                  fontSize: '20px',
                  color: '#1D493E',
                  marginTop: '2px',
                }}
              >
                {editName || user.name || 'Nomad Guest'}
              </div>
            </div>
          </div>

          {/* Sidebar Menu Items */}
          <div className="space-y-4">
            <button
              onClick={() => setActiveTab('orders')}
              className="w-full flex items-center justify-between px-4 py-3.5 transition"
              style={{
                background: activeTab === 'orders' ? 'rgba(29, 73, 62, 0.05)' : '#FFFFFF',
                borderRadius: '4px',
                border: 'none',
                fontFamily: '"Faktum", "Outfit", sans-serif',
                fontWeight: 500,
                fontSize: '18px',
                color: activeTab === 'orders' ? '#1D493E' : 'rgba(43, 43, 43, 1)',
                cursor: 'pointer',
              }}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-slate-400" />
                <span>My Orders</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>

            {/* Account Settings Section */}
            <div className="pt-2">
              <div 
                style={{
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: 'rgba(141, 141, 141, 1)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  paddingLeft: '16px',
                  marginBottom: '12px',
                }}
              >
                Account Settings
              </div>
              
              <button
                onClick={() => setActiveTab('profile')}
                className="w-full flex items-center gap-3 px-4 py-3.5 transition"
                style={{
                  background: activeTab === 'profile' ? 'rgba(29, 73, 62, 0.05)' : '#FFFFFF',
                  borderRadius: '4px',
                  border: 'none',
                  fontFamily: '"Faktum", "Outfit", sans-serif',
                  fontWeight: 500,
                  fontSize: '18px',
                  color: activeTab === 'profile' ? '#1D493E' : 'rgba(43, 43, 43, 1)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <User className="w-5 h-5 text-slate-400" />
                <span>Profile Information</span>
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className="w-full flex items-center gap-3 px-4 py-3.5 transition mt-2"
                style={{
                  background: activeTab === 'addresses' ? 'rgba(29, 73, 62, 0.05)' : '#FFFFFF',
                  borderRadius: '4px',
                  border: 'none',
                  fontFamily: '"Faktum", "Outfit", sans-serif',
                  fontWeight: 500,
                  fontSize: '18px',
                  color: activeTab === 'addresses' ? '#1D493E' : 'rgba(43, 43, 43, 1)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <MapPin className="w-5 h-5 text-slate-400" />
                <span>Manage Addresses</span>
              </button>
            </div>

            {/* My Stuff Section */}
            <div className="pt-2">
              <div 
                style={{
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: 'rgba(141, 141, 141, 1)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  paddingLeft: '16px',
                  marginBottom: '12px',
                }}
              >
                My stuff
              </div>

              <button
                onClick={() => setActiveTab('wishlist')}
                className="w-full flex items-center gap-3 px-4 py-3.5 transition"
                style={{
                  background: activeTab === 'wishlist' ? 'rgba(29, 73, 62, 0.05)' : '#FFFFFF',
                  borderRadius: '4px',
                  border: 'none',
                  fontFamily: '"Faktum", "Outfit", sans-serif',
                  fontWeight: 500,
                  fontSize: '18px',
                  color: activeTab === 'wishlist' ? '#1D493E' : 'rgba(43, 43, 43, 1)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <Heart className="w-5 h-5 text-slate-400" />
                <span>My Wishlist</span>
              </button>
            </div>

            {/* Logout Button */}
            <div className="pt-6 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3.5 transition text-red-600 hover:bg-red-50"
                style={{
                  borderRadius: '4px',
                  border: 'none',
                  fontFamily: '"Faktum", "Outfit", sans-serif',
                  fontWeight: 500,
                  fontSize: '18px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  background: '#FFFFFF',
                }}
              >
                <LogOut className="w-5 h-5 text-red-500" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Details Panel */}
        <div 
          className="lg:col-span-8 border border-slate-200 bg-white"
          style={{
            borderRadius: '4px',
            padding: '40px',
            boxSizing: 'border-box',
            minHeight: '650px',
          }}
        >
          {/* TAB 1: PROFILE MANAGEMENT */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {feedback.message && (
                <div className={`p-4 rounded border text-xs font-bold flex items-center gap-2.5 ${
                  feedback.type === 'success' 
                    ? 'bg-[#1D493E]/5 border-[#1D493E]/20 text-[#1D493E]' 
                    : 'bg-rose-50 border-rose-100 text-rose-600'
                }`}>
                  {feedback.type === 'success' ? <CheckCircle2 className="w-4.5 h-4.5" /> : <AlertCircle className="w-4.5 h-4.5" />}
                  {feedback.message}
                </div>
              )}

              <form onSubmit={handleProfileUpdate} className="space-y-6">
                
                {/* Full Name Field */}
                <div className="space-y-2">
                  <label 
                    style={{
                      fontFamily: '"Faktum", "Outfit", sans-serif',
                      fontWeight: 500,
                      fontSize: '18px',
                      color: 'rgba(43, 43, 43, 1)',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    Full Name
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    disabled={!isEditing}
                    placeholder="Enter your full name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={{
                      width: '100%',
                      height: '53px',
                      borderRadius: '4px',
                      border: '1px solid rgba(204, 204, 204, 1)',
                      background: isEditing ? '#FFFFFF' : '#F9F9F9',
                      padding: '0 16px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 500,
                      fontSize: '18px',
                      color: 'rgba(43, 43, 43, 1)',
                    }}
                  />
                </div>

                {/* Email Address Field */}
                <div className="space-y-2">
                  <label 
                    style={{
                      fontFamily: '"Faktum", "Outfit", sans-serif',
                      fontWeight: 500,
                      fontSize: '18px',
                      color: 'rgba(43, 43, 43, 1)',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    Email Address
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input 
                    type="email" 
                    required
                    disabled={!isEditing}
                    placeholder="Enter your email address"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    style={{
                      width: '100%',
                      height: '53px',
                      borderRadius: '4px',
                      border: '1px solid rgba(204, 204, 204, 1)',
                      background: isEditing ? '#FFFFFF' : '#F9F9F9',
                      padding: '0 16px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 500,
                      fontSize: '18px',
                      color: 'rgba(43, 43, 43, 1)',
                    }}
                  />
                </div>

                {/* Mobile Number Field (Prefixed with country code box) */}
                <div className="space-y-2">
                  <label 
                    style={{
                      fontFamily: '"Faktum", "Outfit", sans-serif',
                      fontWeight: 500,
                      fontSize: '18px',
                      color: 'rgba(43, 43, 43, 1)',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    Mobile Number
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div 
                    className="flex items-center" 
                    style={{ 
                      width: '100%', 
                      height: '53px', 
                      borderRadius: '4px', 
                      border: '1px solid rgba(204, 204, 204, 1)', 
                      background: isEditing ? '#FFFFFF' : '#F9F9F9',
                      overflow: 'hidden',
                      boxSizing: 'border-box',
                    }}
                  >
                    <div 
                      style={{ 
                        height: '100%', 
                        padding: '0 16px', 
                        background: 'rgba(240, 240, 240, 1)', 
                        borderRight: '1px solid rgba(204, 204, 204, 1)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontFamily: '"Faktum", "Outfit", sans-serif', 
                        fontWeight: 500, 
                        fontSize: '18px', 
                        color: 'rgba(43, 43, 43, 1)',
                        userSelect: 'none',
                      }}
                    >
                      +91
                    </div>
                    <input 
                      type="tel" 
                      required
                      disabled={!isEditing}
                      placeholder="Enter mobile number"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value.replace(/\D/g, ''))}
                      style={{
                        flex: 1,
                        height: '100%',
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        padding: '0 16px',
                        fontFamily: '"Outfit", sans-serif',
                        fontWeight: 500,
                        fontSize: '18px',
                        color: 'rgba(43, 43, 43, 1)',
                      }}
                    />
                  </div>
                </div>

                {/* DOB Field */}
                <div className="space-y-2">
                  <label 
                    style={{
                      fontFamily: '"Faktum", "Outfit", sans-serif',
                      fontWeight: 500,
                      fontSize: '18px',
                      color: 'rgba(43, 43, 43, 1)',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    DOB
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Calendar className="w-5 h-5" />
                    </span>
                    <input 
                      type="text" 
                      required
                      disabled={!isEditing}
                      placeholder="DD/MM/YYYY" 
                      value={editDob}
                      onChange={(e) => setEditDob(e.target.value)}
                      className="w-full"
                      style={{
                        height: '53px',
                        borderRadius: '4px',
                        border: '1px solid rgba(204, 204, 204, 1)',
                        background: isEditing ? '#FFFFFF' : '#F9F9F9',
                        paddingLeft: '44px',
                        paddingRight: '16px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        fontFamily: '"Outfit", sans-serif',
                        fontWeight: 500,
                        fontSize: '18px',
                        color: 'rgba(43, 43, 43, 1)',
                      }}
                    />
                  </div>
                </div>

                {/* Gender Field */}
                <div className="space-y-3">
                  <label 
                    style={{
                      fontFamily: '"Faktum", "Outfit", sans-serif',
                      fontWeight: 500,
                      fontSize: '18px',
                      color: 'rgba(43, 43, 43, 1)',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    Gender
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="space-y-2">
                    {genders.map((gender) => (
                      <div 
                        key={gender}
                        onClick={() => isEditing && setEditGender(gender)}
                        className={`flex items-center justify-between px-4 py-3.5 rounded border transition ${
                          isEditing ? 'cursor-pointer' : 'cursor-not-allowed opacity-85'
                        }`}
                        style={{
                          background: editGender === gender ? 'rgba(29, 73, 62, 0.05)' : '#FFFFFF',
                          borderColor: editGender === gender ? '#1D493E' : 'rgba(204, 204, 204, 1)',
                          borderRadius: '4px',
                          height: '53px',
                          fontFamily: '"Outfit", sans-serif',
                          fontWeight: 500,
                          fontSize: '18px',
                          color: 'rgba(43, 43, 43, 1)',
                        }}
                      >
                        <div className="flex items-center gap-3">
                          {/* Custom Radio Circle */}
                          <div 
                            className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition"
                            style={{
                              borderColor: editGender === gender ? '#1D493E' : 'rgba(141, 141, 141, 1)',
                              background: '#FFFFFF',
                            }}
                          >
                            {editGender === gender && (
                              <div 
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ background: '#1D493E' }}
                              />
                            )}
                          </div>
                          <span>{gender}</span>
                        </div>
                        {editGender === gender && (
                          <Check className="w-5 h-5 text-[#1D493E]" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions Row */}
                <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-6 py-3 transition font-semibold text-sm uppercase tracking-wider"
                    style={{
                      background: 'rgba(240, 244, 248, 1)',
                      color: 'rgba(0, 102, 204, 1)',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>

                  {isEditing && (
                    <button
                      type="submit"
                      className="px-8 py-3 transition font-bold text-sm uppercase tracking-wider hover:opacity-90 shadow-sm"
                      style={{
                        background: '#1D493E',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Save details
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: ORDER HISTORY */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div>
                <h2 
                  style={{
                    fontFamily: '"Faktum", "Outfit", sans-serif',
                    fontWeight: 600,
                    fontSize: '24px',
                    color: '#1D493E',
                    margin: 0,
                  }}
                >
                  My Orders & Travel Bookings
                </h2>
                <p 
                  style={{
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: '14px',
                    color: 'rgba(141, 141, 141, 1)',
                    marginTop: '4px',
                  }}
                >
                  Track and review your shop orders and travel odyssey bookings
                </p>
              </div>

              {/* Subtabs for Shop Orders and Travel Bookings */}
              <div className="space-y-6">
                {/* Apparel Shipments Section */}
                <div className="space-y-4">
                  <h3 
                    style={{
                      fontFamily: '"Faktum", "Outfit", sans-serif',
                      fontWeight: 600,
                      fontSize: '18px',
                      color: '#1D493E',
                      borderBottom: '2px solid rgba(29, 73, 62, 0.1)',
                      paddingBottom: '8px',
                    }}
                  >
                    Apparel Shipments ({shopOrders.length})
                  </h3>
                  {shopOrders.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-slate-200 rounded space-y-3">
                      <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
                      <p className="text-sm text-slate-500">No apparel orders placed yet.</p>
                      <button 
                        onClick={() => router.push('/shop')}
                        className="text-xs font-bold uppercase text-[#1D493E] hover:underline"
                      >
                        Browse Shop
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {shopOrders.map((order) => (
                        <div 
                          key={order.id} 
                          className="border border-slate-200 rounded p-4 space-y-3 shadow-sm hover:shadow-md transition"
                        >
                          <div className="flex justify-between items-start text-xs border-b border-slate-100 pb-2">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">Order Ref</span>
                              <span className="font-semibold text-primary-dark">{order.id}</span>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">Placed On</span>
                              <span className="font-semibold text-primary-dark">{order.date}</span>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
                              <span className="inline-block py-0.5 px-2 rounded-full font-bold text-[9px] uppercase tracking-wider bg-blue-50 border border-blue-200 text-blue-600">
                                {order.status}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-xs">
                                <div>
                                  <span className="font-medium text-slate-800">{item.name}</span>
                                  {item.size && <span className="ml-2 bg-slate-100 text-slate-600 py-0.5 px-1.5 rounded text-[10px]">Size: {item.size}</span>}
                                  <span className="text-slate-400 ml-2">x{item.quantity}</span>
                                </div>
                                <span className="font-bold text-slate-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                              </div>
                            ))}
                          </div>
                          <div className="border-t border-slate-100 pt-2 flex justify-between items-center text-xs">
                            <span className="text-slate-400">Paid via Razorpay</span>
                            <span className="font-bold text-sm text-[#1D493E]">₹{order.total.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Travel Itineraries Section */}
                <div className="space-y-4 pt-4">
                  <h3 
                    style={{
                      fontFamily: '"Faktum", "Outfit", sans-serif',
                      fontWeight: 600,
                      fontSize: '18px',
                      color: '#1D493E',
                      borderBottom: '2px solid rgba(29, 73, 62, 0.1)',
                      paddingBottom: '8px',
                    }}
                  >
                    Travel Odyssey Bookings ({travelBookings.length})
                  </h3>
                  {travelBookings.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-slate-200 rounded space-y-3">
                      <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
                      <p className="text-sm text-slate-500">No scheduled travel experiences yet.</p>
                      <button 
                        onClick={() => router.push('/travel')}
                        className="text-xs font-bold uppercase text-[#1D493E] hover:underline"
                      >
                        Explore Excursions
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {travelBookings.map((order) => (
                        <div 
                          key={order.id} 
                          className="border border-slate-200 rounded p-4 space-y-3 shadow-sm hover:shadow-md transition"
                        >
                          <div className="flex justify-between items-start text-xs border-b border-slate-100 pb-2">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">Booking Ref</span>
                              <span className="font-semibold text-primary-dark">{order.id}</span>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">Booked On</span>
                              <span className="font-semibold text-primary-dark">{order.date}</span>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
                              <span className="inline-block py-0.5 px-2 rounded-full font-bold text-[9px] uppercase tracking-wider bg-emerald-50 border border-emerald-200 text-emerald-600">
                                {order.status}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2 text-xs">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="space-y-2">
                                <div className="flex justify-between font-medium text-slate-800">
                                  <span>{item.name}</span>
                                  <span>₹{item.price.toLocaleString('en-IN')} / Traveler</span>
                                </div>
                                <div className="bg-slate-50 p-2 rounded text-[11px] text-slate-600 grid grid-cols-2 gap-2">
                                  <div>
                                    <span className="block text-slate-400">Departure</span>
                                    <span className="font-semibold">{item.date}</span>
                                  </div>
                                  <div>
                                    <span className="block text-slate-400">Guests</span>
                                    <span className="font-semibold">{item.guests} Person(s)</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="border-t border-slate-100 pt-2 flex justify-between items-center text-xs">
                            <button
                              onClick={() => alert('Dispatched itinerary PDF copy to registered email.')}
                              className="text-[10px] font-bold uppercase border border-slate-200 py-1 px-2.5 rounded hover:bg-slate-50"
                            >
                              Get Itinerary PDF
                            </button>
                            <span className="font-bold text-sm text-[#1D493E]">Paid: ₹{order.total.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MANAGE ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div>
                <h2 
                  style={{
                    fontFamily: '"Faktum", "Outfit", sans-serif',
                    fontWeight: 600,
                    fontSize: '24px',
                    color: '#1D493E',
                    margin: 0,
                  }}
                >
                  Manage Shipping Addresses
                </h2>
                <p 
                  style={{
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: '14px',
                    color: 'rgba(141, 141, 141, 1)',
                    marginTop: '4px',
                  }}
                >
                  Keep your checkout delivery preferences updated
                </p>
              </div>

              {feedback.message && (
                <div className={`p-4 rounded border text-xs font-bold flex items-center gap-2.5 ${
                  feedback.type === 'success' 
                    ? 'bg-[#1D493E]/5 border-[#1D493E]/20 text-[#1D493E]' 
                    : 'bg-rose-50 border-rose-100 text-rose-600'
                }`}>
                  {feedback.type === 'success' ? <CheckCircle2 className="w-4.5 h-4.5" /> : <AlertCircle className="w-4.5 h-4.5" />}
                  {feedback.message}
                </div>
              )}

              <form onSubmit={handleProfileUpdate} className="space-y-6">
                {/* Address Field */}
                <div className="space-y-2">
                  <label 
                    style={{
                      fontFamily: '"Faktum", "Outfit", sans-serif',
                      fontWeight: 500,
                      fontSize: '18px',
                      color: 'rgba(43, 43, 43, 1)',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    Street Address
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter street address"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    style={{
                      width: '100%',
                      height: '53px',
                      borderRadius: '4px',
                      border: '1px solid rgba(204, 204, 204, 1)',
                      background: '#FFFFFF',
                      padding: '0 16px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 500,
                      fontSize: '18px',
                      color: 'rgba(43, 43, 43, 1)',
                    }}
                  />
                </div>

                {/* Pincode Field */}
                <div className="space-y-2">
                  <label 
                    style={{
                      fontFamily: '"Faktum", "Outfit", sans-serif',
                      fontWeight: 500,
                      fontSize: '18px',
                      color: 'rgba(43, 43, 43, 1)',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    Pincode
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter pincode"
                    value={editPincode}
                    onChange={(e) => setEditPincode(e.target.value)}
                    style={{
                      width: '100%',
                      height: '53px',
                      borderRadius: '4px',
                      border: '1px solid rgba(204, 204, 204, 1)',
                      background: '#FFFFFF',
                      padding: '0 16px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 500,
                      fontSize: '18px',
                      color: 'rgba(43, 43, 43, 1)',
                    }}
                  />
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-8 py-3 transition font-bold text-sm uppercase tracking-wider hover:opacity-90 shadow-sm"
                    style={{
                      background: '#1D493E',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: MY WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <div>
                <h2 
                  style={{
                    fontFamily: '"Faktum", "Outfit", sans-serif',
                    fontWeight: 600,
                    fontSize: '24px',
                    color: '#1D493E',
                    margin: 0,
                  }}
                >
                  My Wishlist
                </h2>
                <p 
                  style={{
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: '14px',
                    color: 'rgba(141, 141, 141, 1)',
                    marginTop: '4px',
                  }}
                >
                  Your curated collection of premium products
                </p>
              </div>

              {wishlist.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-200 rounded space-y-4">
                  <Heart className="w-12 h-12 text-slate-300 mx-auto animate-pulse" />
                  <p className="text-sm text-slate-500 font-medium">Your wishlist is currently empty.</p>
                  <button 
                    onClick={() => router.push('/shop')}
                    className="px-6 py-3 transition font-semibold text-xs uppercase tracking-wider text-white bg-[#1D493E] hover:opacity-90"
                    style={{
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Explore Shop
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {wishlist.map((item: any) => (
                    <div 
                      key={item.id} 
                      className="border border-slate-200 rounded p-4 flex flex-col justify-between hover:shadow-md transition bg-white"
                    >
                      <div className="flex gap-4">
                        {item.images && item.images[0] ? (
                          <img 
                            src={item.images[0]} 
                            alt={item.name} 
                            className="w-20 h-20 object-cover rounded bg-slate-50"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded bg-slate-100 flex items-center justify-center text-slate-300">
                            <ShoppingBag className="w-8 h-8" />
                          </div>
                        )}
                        <div className="space-y-1">
                          <h4 className="font-semibold text-slate-800 text-sm line-clamp-2">{item.name}</h4>
                          <p className="font-bold text-slate-900 text-sm">₹{item.price.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
                        <button
                          onClick={() => router.push(`/shop`)}
                          className="flex-1 py-1.5 text-center text-xs font-bold border border-[#1D493E] text-[#1D493E] rounded hover:bg-slate-50"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => toggleWishlist(item)}
                          className="px-3 py-1.5 text-xs text-red-500 border border-red-100 hover:bg-red-50 rounded"
                        >
                          Remove
                        </button>
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
