'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  User, Mail, Phone, MapPin, ShoppingBag, Calendar, Lock, 
  CheckCircle2, AlertCircle, FileText, ArrowRight, ShieldCheck,
  ChevronRight, Heart, LogOut, Check, Package, X, Search, ChevronDown, Copy, ChevronLeft, Trash2, MoreVertical, Star, Upload
} from 'lucide-react';
import { useCart } from '@/components/providers';

type ProfileTab = 'profile' | 'orders' | 'bookings' | 'addresses' | 'wishlist' | 'cart';

interface OrderHistoryItem {
  id: string;
  date: string;
  type: 'shop' | 'travel';
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    originalPrice?: number;
    discount?: string;
    size?: string;
    color?: string;
    image?: string;
    date?: string;
    guests?: number;
  }>;
  total: number;
  status: 'Processing' | 'Shipped' | 'Confirmed' | 'Completed' | 'DELIVERED ON MON, JULY 6TH';
  paymentId: string;
  deliveryDate?: string;
}

function ProfilePageContent() {
  const { user, login, logout, setAuthOpen, setCartOpen, setWishlistOpen, wishlist, toggleWishlist, addToCart, cart, removeFromCart, updateQuantity, cartCount, cartTotal, setCheckoutOpen } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<ProfileTab>('profile');
  const [wishlistQuantities, setWishlistQuantities] = useState<Record<string, number>>({});

  // Close side cart and wishlist drawers on page mount and tab changes
  useEffect(() => {
    if (setCartOpen) setCartOpen(false);
    if (setWishlistOpen) setWishlistOpen(false);
  }, [setCartOpen, setWishlistOpen, activeTab]);

  // Orders tab search, filter & pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Orders');
  const [filterTime, setFilterTime] = useState('All Time');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  // Helper for DOB date picker conversion (DD/MM/YYYY <-> YYYY-MM-DD)
  const formatToInputDate = (dobStr: string) => {
    if (!dobStr) return '';
    if (dobStr.includes('-')) return dobStr;
    const parts = dobStr.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return dobStr;
  };

  const formatFromInputDate = (isoStr: string) => {
    if (!isoStr) return '';
    const parts = isoStr.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    }
    return isoStr;
  };

  // History list with 1 dummy product order for testing
  const [history, setHistory] = useState<OrderHistoryItem[]>([
    {
      id: '4597534682159738',
      date: '2026-07-06',
      type: 'shop',
      deliveryDate: 'MON, JULY 6TH',
      paymentId: '4597534682159738',
      status: 'Completed',
      total: 22900,
      items: [
        {
          name: 'Nomad Pro Canvas Pack',
          price: 22900,
          originalPrice: 22000,
          discount: '16% off',
          quantity: 1,
          size: '45L',
          color: 'Olive Drab',
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
        },
      ],
    },
  ]);

  // Saved Addresses State — always starts empty on SSR, hydrated from localStorage client-side
  const [addressList, setAddressList] = useState<Array<{
    id: string;
    type: string;
    name: string;
    phone: string;
    fullAddress: string;
  }>>([]);

  // Hydrate addresses from localStorage on client mount (runs only once)
  useEffect(() => {
    const saved = localStorage.getItem('gb_saved_addresses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAddressList(parsed);
        }
      } catch (e) {
        console.error('Failed to parse saved addresses from localStorage', e);
      }
    }
  }, []);

  // Persist addressList to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('gb_saved_addresses', JSON.stringify(addressList));
  }, [addressList]);

  const [openAddressMenuId, setOpenAddressMenuId] = useState<string | null>(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [deleteAddressId, setDeleteAddressId] = useState<string | null>(null);
  const [copiedPhoneId, setCopiedPhoneId] = useState<string | null>(null);

  // Address Form States matching exact Figma fields
  const [formFullName, setFormFullName] = useState('');
  const [formMobileNumber, setFormMobileNumber] = useState('');
  const [formPincode, setFormPincode] = useState('');
  const [formLocality, setFormLocality] = useState('');
  const [formCompleteAddress, setFormCompleteAddress] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formState, setFormState] = useState('');
  const [formAddressType, setFormAddressType] = useState<'Home' | 'Office' | 'Others'>('Home');
  const [formOtherLabel, setFormOtherLabel] = useState('');

  // Rate & Review Form States
  const [reviewOpenOrderId, setReviewOpenOrderId] = useState<string | null>(null);
  const [reviewRatings, setReviewRatings] = useState<Record<string, number>>({});
  const [reviewTitles, setReviewTitles] = useState<Record<string, string>>({});
  const [reviewDescriptions, setReviewDescriptions] = useState<Record<string, string>>({});
  const [reviewImages, setReviewImages] = useState<Record<string, string[]>>({});
  const [submittedReviews, setSubmittedReviews] = useState<Record<string, boolean>>({});
  const [reviewThankYouOrder, setReviewThankYouOrder] = useState<OrderHistoryItem | null>(null);

  // Orders Pagination State
  const [ordersCurrentPage, setOrdersCurrentPage] = useState(1);

  // Sync tab from URL query params
  useEffect(() => {
    const tabParam = searchParams.get('tab') as ProfileTab;
    if (tabParam === 'cart') {
      router.push('/cart');
    } else if (tabParam && ['profile', 'orders', 'bookings', 'addresses', 'wishlist'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams, router]);

  // Sync initial form values from user or default fallback
  useEffect(() => {
    setEditName(user?.name || 'Jithendra Varma');
    setEditEmail(user?.email || 'jv@geonixa.com');
    setEditPhone(user?.phone || '9492906356');
    setEditAddress(user?.address || 'H.No 45, Banjara Hills, Road No 4');
    setEditPincode(user?.pincode || '500034');
    setEditDob(user?.dob || '15/08/1997');
    setEditGender(((user?.gender as any) || 'Male') as 'Male' | 'Female' | 'Others');
  }, [user]);

  // Load orders history from MongoDB Atlas and local storage
  useEffect(() => {
    const activeEmail = user?.email || 'jv@geonixa.com';
    const activePhone = user?.phone || '9492906356';
    const activeId = user?.id;

    const fetchMongoDBOrders = async () => {
      try {
        const queryParam = activeId ? `userId=${activeId}` : `email=${activeEmail}`;
        const res = await fetch(`/api/user/orders?${queryParam}`);
        const data = await res.json();

        if (data.success && (data.orders?.length > 0 || data.bookings?.length > 0)) {
          const dbOrders: OrderHistoryItem[] = [
            ...data.orders.map((o: any) => ({
              id: `GB-${o.id.slice(-6).toUpperCase()}-26`,
              date: new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
              type: 'shop' as const,
              items: Array.isArray(o.items) ? o.items : [],
              total: o.totalAmount,
              status: o.status === 'PROCESSING' ? 'Processing' : 'Shipped',
              paymentId: `pay_${o.id.slice(-8)}`,
            })),
            ...data.bookings.map((b: any) => ({
              id: `GB-${b.id.slice(-6).toUpperCase()}-26`,
              date: new Date(b.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
              type: 'travel' as const,
              items: [{ name: b.packageName, quantity: 1, price: b.totalPaid, date: b.departureDate, guests: b.travelersCount }],
              total: b.totalPaid,
              status: 'Confirmed' as const,
              paymentId: `pay_${b.id.slice(-8)}`,
            })),
          ];

          setHistory(dbOrders);
          return;
        }
      } catch (err) {
        console.warn('MongoDB orders fetch notice:', err);
      }

      // Default dummy order for testing
      const dummyOrder: OrderHistoryItem = {
        id: '4597534682159738',
        date: '2026-07-06',
        type: 'shop',
        deliveryDate: 'MON, JULY 6TH',
        paymentId: '4597534682159738',
        status: 'Completed',
        total: 22900,
        items: [
          {
            name: 'Nomad Pro Canvas Pack',
            price: 22900,
            originalPrice: 22000,
            discount: '16% off',
            quantity: 1,
            size: '45L',
            color: 'Olive Drab',
            image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
          },
        ],
      };

      // Load real history from local storage if present
      const storageKey = `gb_history_${activeEmail || activePhone}`;
      const savedHistory = localStorage.getItem(storageKey);
      if (savedHistory) {
        try {
          const parsed = JSON.parse(savedHistory);
          const realOrders = Array.isArray(parsed)
            ? parsed.filter((item: OrderHistoryItem) => item.id !== 'GB-928401-26' && item.id !== 'GB-748291-26')
            : [];
          setHistory(realOrders.length > 0 ? realOrders : [dummyOrder]);
        } catch (e) {
          console.error('Failed to parse history', e);
          setHistory([dummyOrder]);
        }
      } else {
        setHistory([dummyOrder]);
      }
    };

    fetchMongoDBOrders();
  }, [user?.id, user?.email, user?.phone]);

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });

    try {
      const payload = {
        userId: user.id || 'mock-user-id',
        name: editName,
        email: editEmail,
        phone: editPhone,
        address: editAddress,
        pincode: editPincode,
        dob: editDob,
        gender: editGender
      };

      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        const updatedUserObj = {
          ...user,
          ...data.user,
          name: editName,
          email: editEmail,
          phone: editPhone,
          address: editAddress,
          pincode: editPincode,
          dob: editDob,
          gender: editGender
        };

        login(updatedUserObj);

        setEditName(editName);
        setEditEmail(editEmail);
        setEditPhone(editPhone);
        setEditAddress(editAddress);
        setEditPincode(editPincode);
        setEditDob(editDob);
        setEditGender(editGender);

        setFeedback({
          type: 'success',
          message: 'Profile Information Save Successfully'
        });
      } else {
        setFeedback({
          type: 'error',
          message: data.error || 'Failed to update profile details.'
        });
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Network error updating profile.'
      });
    }

    setTimeout(() => {
      setFeedback({ type: '', message: '' });
    }, 4000);
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
    router.push('/');
  };

  const shopOrders = history.filter(item => item.type === 'shop');
  const travelBookings = history.filter(item => item.type === 'travel');
  const genders: ('Male' | 'Female' | 'Others')[] = ['Male', 'Female', 'Others'];

  return (
    <div className="w-full min-h-screen bg-white" style={{ background: 'rgba(255, 255, 255, 1)' }}>
      
      {/* Header Container matching exact Figma Specs (width: 1440, height: 194, gap: 24, padding: 62px 80px 24px 80px) */}
      <div 
        className="w-full bg-white select-none"
        style={{
          width: '100%',
          maxWidth: '1440px',
          height: '194px',
          paddingTop: '62px',
          paddingRight: '80px',
          paddingBottom: '24px',
          paddingLeft: '80px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          background: 'rgba(255, 255, 255, 1)',
          boxSizing: 'border-box',
          margin: '0 auto',
          opacity: 1,
        }}
      >
        <h1 
          style={{
            width: '100%',
            maxWidth: '1280px',
            height: '52px',
            fontFamily: '"Fraunces", Georgia, serif',
            fontWeight: 600,
            fontSize: '42px',
            lineHeight: '100%',
            letterSpacing: '0px',
            color: 'rgba(43, 43, 43, 1)',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            opacity: 1,
          }}
        >
          Profile Account Information
        </h1>
        <div 
          className="flex items-center select-none"
          style={{
            width: '100%',
            maxWidth: '1280px',
            height: '32px',
            gap: '12px',
            opacity: 1,
            boxSizing: 'border-box',
          }}
        >
          <span 
            className="cursor-pointer hover:underline" 
            onClick={() => router.push('/')}
            style={{
              fontFamily: '"Faktum", "Outfit", sans-serif',
              fontWeight: 500,
              fontSize: '16px',
              lineHeight: '22px',
              letterSpacing: '0px',
              color: 'rgba(141, 141, 141, 1)',
            }}
          >
            Home
          </span>
          <ChevronRight className="w-4 h-4 text-[#8D8D8D] inline" />
          <span 
            className={`cursor-pointer ${activeTab === 'profile' ? 'font-semibold text-slate-800' : 'hover:underline text-slate-400'}`}
            onClick={() => setActiveTab('profile')}
            style={{ 
              fontFamily: '"Faktum", "Outfit", sans-serif',
              fontWeight: activeTab === 'profile' ? 600 : 500,
              fontSize: '16px',
              lineHeight: '22px',
              letterSpacing: '0px',
              color: activeTab === 'profile' ? 'rgba(43, 43, 43, 1)' : 'rgba(141, 141, 141, 1)',
            }}
          >
            My Profile
          </span>
          {activeTab === 'orders' && (
            <>
              <ChevronRight className="w-4 h-4 text-[#8D8D8D] inline" />
              <span 
                style={{ 
                  fontFamily: '"Faktum", sans-serif',
                  fontWeight: 600,
                  fontSize: '16px',
                  lineHeight: '22px',
                  letterSpacing: '0px',
                  color: 'rgba(43, 43, 43, 1)',
                }}
              >
                My Orders
              </span>
            </>
          )}
          {activeTab === 'wishlist' && (
            <>
              <ChevronRight className="w-4 h-4 text-[#8D8D8D] inline" />
              <span 
                style={{ 
                  fontFamily: '"Faktum", sans-serif',
                  fontWeight: 600,
                  fontSize: '16px',
                  lineHeight: '22px',
                  letterSpacing: '0px',
                  color: 'rgba(43, 43, 43, 1)',
                }}
              >
                My Wishlist
              </span>
            </>
          )}
          {activeTab === 'cart' && (
            <>
              <ChevronRight className="w-4 h-4 text-[#8D8D8D] inline" />
              <span 
                style={{ 
                  fontFamily: '"Faktum", sans-serif',
                  fontWeight: 600,
                  fontSize: '16px',
                  lineHeight: '22px',
                  letterSpacing: '0px',
                  color: 'rgba(43, 43, 43, 1)',
                }}
              >
                My Cart
              </span>
            </>
          )}
        </div>
      </div>

      {/* Main Form Body Container */}
      <div 
        className="w-full mx-auto px-4 sm:px-6 lg:px-[80px]"
        style={{
          maxWidth: '1440px',
          paddingBottom: '24px',
          boxSizing: 'border-box',
        }}
      >
        <div className="flex flex-col lg:flex-row gap-[20px] items-start w-full">
        
        {/* Navigation Sidebar Card */}
        <div 
          className="w-full lg:w-[320px] flex-shrink-0 flex flex-col justify-between select-none"
          style={{
            padding: '12px',
            gap: '16px',
            borderRadius: '4px',
            border: '1px solid rgba(204, 204, 204, 1)',
            background: 'rgba(255, 255, 255, 1)',
            boxSizing: 'border-box',
          }}
        >
          <div className="flex flex-col gap-[20px] w-full min-w-0">
            
            {/* Hello User Card */}
            <div 
              className="flex items-center select-none pb-3 border-b border-[#CCCCCC] w-full min-w-0"
              style={{
                width: '100%',
                padding: '8px 4px',
                gap: '12px',
                background: 'rgba(255, 255, 255, 1)',
                boxSizing: 'border-box',
              }}
            >
              {/* Avatar Box (65px x 59px, 4px border-radius) */}
              <div 
                className="flex items-center justify-center bg-[#E5E7EB] text-slate-400 flex-shrink-0"
                style={{ 
                  width: '65px',
                  height: '59px',
                  borderRadius: '4px',
                }}
              >
                <User className="w-8 h-8 text-[#9CA3AF]" />
              </div>

              <div className="flex flex-col justify-center flex-1 min-w-0 overflow-hidden">
                <div 
                  style={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 400,
                    fontSize: '14px',
                    color: 'rgba(141, 141, 141, 1)',
                    lineHeight: '18px',
                  }}
                >
                  Hello
                </div>
                <div 
                  className="truncate"
                  title={user?.name || 'Banjara Traveler'}
                  style={{
                    fontFamily: '"Faktum", "Outfit", sans-serif',
                    fontWeight: 600,
                    fontSize: '18px',
                    color: 'rgba(43, 43, 43, 1)',
                    lineHeight: '22px',
                    marginTop: '2px',
                  }}
                >
                  {user?.name || 'Banjara Traveler'}
                </div>
              </div>
            </div>

            {/* My Orders Button */}
            <button
              onClick={() => setActiveTab('orders')}
              className="w-full flex items-center justify-between px-3 py-3 transition cursor-pointer"
              style={{
                background: activeTab === 'orders' ? 'rgba(29, 73, 62, 0.08)' : '#FFFFFF',
                borderRadius: '4px',
                border: 'none',
                fontFamily: '"Faktum", "Outfit", sans-serif',
                fontWeight: 500,
                fontSize: '18px',
                color: activeTab === 'orders' ? '#1D493E' : 'rgba(43, 43, 43, 1)',
              }}
            >
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-slate-700" />
                <span>My Orders</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-700" />
            </button>

            {/* Account Settings Section */}
            <div className="flex flex-col gap-2">
              <div 
                style={{
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 500,
                  fontSize: '14px',
                  color: 'rgba(141, 141, 141, 1)',
                  paddingLeft: '12px',
                  marginBottom: '4px',
                }}
              >
                Account Settings
              </div>
              
              <button
                onClick={() => setActiveTab('profile')}
                className="w-full flex items-center gap-3 px-3 py-3 transition cursor-pointer text-left"
                style={{
                  background: activeTab === 'profile' ? 'rgba(29, 73, 62, 0.08)' : '#FFFFFF',
                  borderRadius: '4px',
                  border: 'none',
                  fontFamily: '"Faktum", "Outfit", sans-serif',
                  fontWeight: 500,
                  fontSize: '18px',
                  color: activeTab === 'profile' ? '#1D493E' : 'rgba(43, 43, 43, 1)',
                }}
              >
                <User className="w-5 h-5 text-slate-700" />
                <span>Profile Information</span>
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className="w-full flex items-center gap-3 px-3 py-3 transition cursor-pointer text-left"
                style={{
                  background: activeTab === 'addresses' ? 'rgba(29, 73, 62, 0.08)' : '#FFFFFF',
                  borderRadius: '4px',
                  border: 'none',
                  fontFamily: '"Faktum", "Outfit", sans-serif',
                  fontWeight: 500,
                  fontSize: '18px',
                  color: activeTab === 'addresses' ? '#1D493E' : 'rgba(43, 43, 43, 1)',
                }}
              >
                <MapPin className="w-5 h-5 text-slate-700" />
                <span>Manage Addresses</span>
              </button>
            </div>

            <div className="w-full border-t border-[#CCCCCC] my-1" />

            {/* My Stuff Section */}
            <div className="flex flex-col gap-2">
              <div 
                style={{
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 500,
                  fontSize: '14px',
                  color: 'rgba(141, 141, 141, 1)',
                  paddingLeft: '12px',
                  marginBottom: '4px',
                }}
              >
                My stuff
              </div>

              <button
                onClick={() => setActiveTab('wishlist')}
                className="w-full flex items-center gap-3 px-3 py-3 transition cursor-pointer text-left"
                style={{
                  background: activeTab === 'wishlist' ? 'rgba(29, 73, 62, 0.08)' : '#FFFFFF',
                  borderRadius: '4px',
                  border: 'none',
                  fontFamily: '"Faktum", "Outfit", sans-serif',
                  fontWeight: 500,
                  fontSize: '18px',
                  color: activeTab === 'wishlist' ? '#1D493E' : 'rgba(43, 43, 43, 1)',
                }}
              >
                <Heart className="w-5 h-5 text-slate-700" />
                <span>My Wishlist</span>
              </button>

              <button
                onClick={() => router.push('/cart')}
                className="w-full flex items-center gap-3 px-3 py-3 transition cursor-pointer text-left"
                style={{
                  background: activeTab === 'cart' ? 'rgba(29, 73, 62, 0.08)' : '#FFFFFF',
                  borderRadius: '4px',
                  border: 'none',
                  fontFamily: '"Faktum", "Outfit", sans-serif',
                  fontWeight: 500,
                  fontSize: '18px',
                  color: activeTab === 'cart' ? '#1D493E' : 'rgba(43, 43, 43, 1)',
                }}
              >
                <ShoppingBag className="w-5 h-5 text-slate-700" />
                <span>My Cart</span>
              </button>
            </div>

          </div>

          {/* Logout Button at Bottom */}
          <div className="pt-4 mt-auto">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center gap-3 px-3 py-3 transition cursor-pointer text-left hover:bg-red-50 rounded"
              style={{
                borderRadius: '4px',
                border: 'none',
                fontFamily: '"Faktum", "Outfit", sans-serif',
                fontWeight: 500,
                fontSize: '18px',
                color: '#FF3B30',
                background: '#FFFFFF',
              }}
            >
              <LogOut className="w-5 h-5 text-[#FF3B30]" />
              <span>Logout</span>
            </button>
          </div>

        </div>

        {/* Right Details Form Panel - Single Screen Optimized */}
        <div 
          className="w-full flex-1 min-w-0 flex flex-col justify-between select-none"
          style={{
            maxWidth: '936px',
            padding: '20px',
            borderRadius: '4px',
            border: '1px solid rgba(204, 204, 204, 1)',
            background: 'rgba(255, 255, 255, 1)',
            boxSizing: 'border-box',
          }}
        >
          {/* TAB 1: PROFILE MANAGEMENT */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              {feedback.message && (
                <div 
                  className="flex items-center justify-between shadow-md transition-all animate-in fade-in slide-in-from-top-2 select-none mb-2"
                  style={{
                    width: '100%',
                    maxWidth: '425px',
                    height: '48px',
                    padding: '12px',
                    borderRadius: '4px',
                    background: feedback.type === 'success' ? 'rgba(71, 173, 105, 1)' : '#E53E3E',
                    gap: '12px',
                    boxSizing: 'border-box',
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* White Circle with Green Checkmark (24px x 24px) */}
                    <div 
                      className="flex items-center justify-center flex-shrink-0 bg-white rounded-full"
                      style={{ width: '24px', height: '24px' }}
                    >
                      {feedback.type === 'success' ? (
                        <Check className="w-4 h-4 text-[#47AD69]" strokeWidth={3} />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-[#E53E3E]" strokeWidth={2.5} />
                      )}
                    </div>

                    {/* Notification Text */}
                    <span 
                      className="truncate"
                      style={{
                        fontFamily: '"Faktum", "Outfit", sans-serif',
                        fontWeight: 500,
                        fontSize: '18px',
                        lineHeight: '100%',
                        color: 'rgba(255, 255, 255, 1)',
                      }}
                    >
                      {feedback.message}
                    </span>
                  </div>

                  {/* Close Icon (20px x 20px) */}
                  <X 
                    onClick={() => setFeedback({ type: '', message: '' })}
                    className="w-5 h-5 text-white cursor-pointer hover:opacity-80 flex-shrink-0 transition" 
                  />
                </div>
              )}

              <form onSubmit={handleProfileUpdate} className="flex flex-col justify-between space-y-4">
                
                <div className="space-y-3">
                  {/* Full Name Field */}
                  <div className="space-y-1">
                    <label 
                      style={{
                        fontFamily: '"Faktum", "Outfit", sans-serif',
                        fontWeight: 500,
                        fontSize: '15px',
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
                      placeholder="Enter your full name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      style={{
                        width: '100%',
                        height: '44px',
                        borderRadius: '4px',
                        border: '1px solid rgba(204, 204, 204, 1)',
                        background: '#FFFFFF',
                        padding: '0 14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        fontFamily: '"Outfit", sans-serif',
                        fontWeight: 500,
                        fontSize: '16px',
                        color: 'rgba(43, 43, 43, 1)',
                      }}
                    />
                  </div>

                  {/* Email Address Field */}
                  <div className="space-y-1">
                    <label 
                      style={{
                        fontFamily: '"Faktum", "Outfit", sans-serif',
                        fontWeight: 500,
                        fontSize: '15px',
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
                      placeholder="Enter your email address"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      style={{
                        width: '100%',
                        height: '44px',
                        borderRadius: '4px',
                        border: '1px solid rgba(204, 204, 204, 1)',
                        background: '#FFFFFF',
                        padding: '0 14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        fontFamily: '"Outfit", sans-serif',
                        fontWeight: 500,
                        fontSize: '16px',
                        color: 'rgba(43, 43, 43, 1)',
                      }}
                    />
                  </div>

                  {/* Mobile Number Field */}
                  <div className="space-y-1">
                    <label 
                      style={{
                        fontFamily: '"Faktum", "Outfit", sans-serif',
                        fontWeight: 500,
                        fontSize: '15px',
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
                        height: '44px', 
                        borderRadius: '4px', 
                        border: '1px solid rgba(204, 204, 204, 1)', 
                        background: '#FFFFFF',
                        overflow: 'hidden',
                        boxSizing: 'border-box',
                      }}
                    >
                      <div 
                        style={{ 
                          height: '100%', 
                          padding: '0 14px', 
                          background: 'rgba(240, 240, 240, 1)', 
                          borderRight: '1px solid rgba(204, 204, 204, 1)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontFamily: '"Faktum", "Outfit", sans-serif', 
                          fontWeight: 500, 
                          fontSize: '15px', 
                          color: 'rgba(43, 43, 43, 1)',
                          userSelect: 'none',
                        }}
                      >
                        +91
                      </div>
                      <input 
                        type="tel" 
                        required
                        placeholder="Enter mobile number"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value.replace(/\D/g, ''))}
                        style={{
                          flex: 1,
                          height: '100%',
                          border: 'none',
                          outline: 'none',
                          background: 'transparent',
                          padding: '0 14px',
                          fontFamily: '"Outfit", sans-serif',
                          fontWeight: 500,
                          fontSize: '16px',
                          color: 'rgba(43, 43, 43, 1)',
                        }}
                      />
                    </div>
                  </div>

                  {/* DOB Field */}
                  <div className="space-y-1">
                    <label 
                      style={{
                        fontFamily: '"Faktum", "Outfit", sans-serif',
                        fontWeight: 500,
                        fontSize: '15px',
                        color: 'rgba(43, 43, 43, 1)',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      DOB
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <input 
                        type="date" 
                        required
                        max={new Date().toISOString().split('T')[0]}
                        value={formatToInputDate(editDob)}
                        onChange={(e) => setEditDob(formatFromInputDate(e.target.value))}
                        className="w-full cursor-pointer"
                        style={{
                          height: '44px',
                          borderRadius: '4px',
                          border: '1px solid rgba(204, 204, 204, 1)',
                          background: '#FFFFFF',
                          paddingLeft: '14px',
                          paddingRight: '14px',
                          outline: 'none',
                          boxSizing: 'border-box',
                          fontFamily: '"Outfit", sans-serif',
                          fontWeight: 500,
                          fontSize: '16px',
                          color: 'rgba(43, 43, 43, 1)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Gender Field */}
                  <div className="space-y-2">
                    <label 
                      style={{
                        fontFamily: '"Faktum", "Outfit", sans-serif',
                        fontWeight: 500,
                        fontSize: '15px',
                        color: 'rgba(43, 43, 43, 1)',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      Gender
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="space-y-1.5">
                      {genders.map((gender) => (
                        <div 
                          key={gender}
                          onClick={() => setEditGender(gender)}
                          className="flex items-center justify-between px-3.5 py-2 rounded border transition cursor-pointer"
                          style={{
                            background: editGender === gender ? 'rgba(29, 73, 62, 0.08)' : '#FFFFFF',
                            borderColor: editGender === gender ? '#1D493E' : 'rgba(204, 204, 204, 1)',
                            borderRadius: '4px',
                            height: '44px',
                            fontFamily: '"Outfit", sans-serif',
                            fontWeight: 500,
                            fontSize: '16px',
                            color: 'rgba(43, 43, 43, 1)',
                          }}
                        >
                          <div className="flex items-center gap-3">
                            {/* Custom Radio Circle */}
                            <div 
                              className="w-4 h-4 rounded-full border-2 flex items-center justify-center transition"
                              style={{
                                borderColor: editGender === gender ? '#1D493E' : 'rgba(141, 141, 141, 1)',
                                background: '#FFFFFF',
                              }}
                            >
                              {editGender === gender && (
                                <div 
                                  className="w-2 h-2 rounded-full"
                                  style={{ background: '#1D493E' }}
                                />
                              )}
                            </div>
                            <span>{gender}</span>
                          </div>
                          {editGender === gender && (
                            <Check className="w-4 h-4 text-[#1D493E]" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center w-full">
                  <button
                    type="button"
                    onClick={() => {
                      if (user) {
                        setEditName(user.name || '');
                        setEditEmail(user.email || '');
                        setEditPhone(user.phone || '');
                        setEditDob(user.dob || '15/08/1997');
                        setEditGender(user.gender || 'Male');
                      }
                    }}
                    className="px-5 py-2.5 transition font-semibold text-xs uppercase tracking-wider hover:bg-slate-100"
                    style={{
                      background: 'rgba(240, 244, 248, 1)',
                      color: 'rgba(0, 102, 204, 1)',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Reset
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 transition font-bold text-xs uppercase tracking-wider shadow-sm hover:opacity-90 cursor-pointer"
                    style={{
                      background: '#1D493E',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '4px',
                    }}
                  >
                    Save details
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: MY ORDERS */}
          {activeTab === 'orders' && (
            <div style={{ paddingBottom: '62px' }} className="space-y-6">

              {/* Search & Filter Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-2">
                {/* Search Bar */}
                <div 
                  className="flex items-center flex-1 max-w-md"
                  style={{
                    height: '48px',
                    borderRadius: '4px',
                    border: '1px solid rgba(204, 204, 204, 1)',
                    background: '#FFFFFF',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                  }}
                >
                  <div className="pl-3 text-slate-400">
                    <Search className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search your orders here"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      flex: 1,
                      height: '100%',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      padding: '0 12px',
                      fontFamily: '"Outfit", sans-serif',
                      fontSize: '14px',
                      color: 'rgba(43, 43, 43, 1)',
                    }}
                  />
                  <button
                    type="button"
                    style={{
                      height: '100%',
                      background: 'rgba(29, 73, 62, 1)',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '0 20px',
                      fontFamily: '"Faktum", "Outfit", sans-serif',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#173A31'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(29, 73, 62, 1)'; }}
                  >
                    Search Orders
                  </button>
                </div>

                {/* Filters Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    style={{
                      height: '48px',
                      padding: '0 18px',
                      border: '1px solid rgba(204, 204, 204, 1)',
                      borderRadius: '4px',
                      background: '#FFFFFF',
                      fontFamily: '"Faktum", "Outfit", sans-serif',
                      fontWeight: 500,
                      fontSize: '15px',
                      color: 'rgba(43, 43, 43, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    Filters
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </button>
                  {showFilterDropdown && (
                    <div 
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 'calc(100% + 8px)',
                        width: '520px',
                        maxWidth: '90vw',
                        borderRadius: '4px',
                        border: '1px solid rgba(204, 204, 204, 1)',
                        backgroundColor: '#FFFFFF',
                        boxShadow: '0px 4px 12px 0px rgba(0, 0, 0, 0.25)',
                        zIndex: 50,
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        overflow: 'hidden',
                      }}
                      className="animate-fade-in select-none"
                    >
                      {/* Left Column: Order Status */}
                      <div style={{ padding: '16px', borderRight: '1px solid rgba(230, 230, 230, 1)' }} className="flex flex-col gap-3">
                        <h4 
                          style={{
                            fontFamily: '"Faktum", "Outfit", sans-serif',
                            fontWeight: 600,
                            fontSize: '16px',
                            color: 'rgba(141, 141, 141, 1)',
                            margin: 0,
                          }}
                        >
                          Order Status
                        </h4>
                        <div className="flex flex-col gap-1.5">
                          {[
                            { label: 'On the Way', val: 'On the Way' },
                            { label: 'Delivered', val: 'Delivered' },
                            { label: 'Cancelled', val: 'Cancelled' },
                            { label: 'Returned', val: 'Returned' },
                          ].map((item) => {
                            const isSelected = filterStatus === item.val;
                            return (
                              <button
                                key={item.val}
                                type="button"
                                onClick={() => {
                                  setFilterStatus(isSelected ? 'All Orders' : item.val);
                                }}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  borderRadius: '4px',
                                  backgroundColor: isSelected ? 'rgba(235, 243, 240, 1)' : 'transparent',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                  cursor: 'pointer',
                                  border: 'none',
                                  textAlign: 'left',
                                }}
                                className="hover:bg-slate-50 transition"
                              >
                                {/* Checkbox box */}
                                <div 
                                  style={{
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '3px',
                                    border: isSelected ? '1px solid #1D493E' : '1.5px solid #2B2B2B',
                                    backgroundColor: isSelected ? '#1D493E' : '#FFFFFF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                  }}
                                >
                                  {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                                </div>
                                <span 
                                  style={{
                                    fontFamily: '"Faktum", "Outfit", sans-serif',
                                    fontWeight: isSelected ? 600 : 500,
                                    fontSize: '16px',
                                    color: isSelected ? '#1D493E' : '#2B2B2B',
                                  }}
                                >
                                  {item.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right Column: Order Time */}
                      <div style={{ padding: '16px' }} className="flex flex-col gap-3">
                        <h4 
                          style={{
                            fontFamily: '"Faktum", "Outfit", sans-serif',
                            fontWeight: 600,
                            fontSize: '16px',
                            color: 'rgba(141, 141, 141, 1)',
                            margin: 0,
                          }}
                        >
                          Order Time
                        </h4>
                        <div className="flex flex-col gap-1.5">
                          {[
                            'Last 15 days',
                            'Last 30 days',
                            'Last 3 months',
                            'Last 6 months',
                            'Last 12 months',
                          ].map((timeOption) => {
                            const isSelected = filterTime === timeOption;
                            return (
                              <button
                                key={timeOption}
                                type="button"
                                onClick={() => {
                                  setFilterTime(isSelected ? 'All Time' : timeOption);
                                }}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  borderRadius: '4px',
                                  backgroundColor: isSelected ? 'rgba(235, 243, 240, 1)' : 'transparent',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                  cursor: 'pointer',
                                  border: 'none',
                                  textAlign: 'left',
                                }}
                                className="hover:bg-slate-50 transition"
                              >
                                {/* Checkbox box */}
                                <div 
                                  style={{
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '3px',
                                    border: isSelected ? '1px solid #1D493E' : '1.5px solid #2B2B2B',
                                    backgroundColor: isSelected ? '#1D493E' : '#FFFFFF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                  }}
                                >
                                  {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                                </div>
                                <span 
                                  style={{
                                    fontFamily: '"Faktum", "Outfit", sans-serif',
                                    fontWeight: isSelected ? 600 : 500,
                                    fontSize: '16px',
                                    color: isSelected ? '#1D493E' : '#2B2B2B',
                                  }}
                                >
                                  {timeOption}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Bottom Actions Row: Reset Filters & Apply Button */}
                      <div 
                        style={{
                          gridColumn: 'span 2',
                          borderTop: '1px solid rgba(230, 230, 230, 1)',
                          padding: '12px 16px',
                          backgroundColor: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setFilterStatus('All Orders');
                            setFilterTime('All Time');
                          }}
                          style={{
                            fontFamily: '"Faktum", "Outfit", sans-serif',
                            fontWeight: 500,
                            fontSize: '14px',
                            color: 'rgba(141, 141, 141, 1)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                          className="hover:text-[#2B2B2B] transition cursor-pointer"
                        >
                          Reset Filters
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowFilterDropdown(false)}
                          style={{
                            height: '40px',
                            padding: '0 28px',
                            borderRadius: '4px',
                            backgroundColor: '#1D493E',
                            color: '#FFFFFF',
                            fontFamily: '"Faktum", "Outfit", sans-serif',
                            fontWeight: 600,
                            fontSize: '14px',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                          className="hover:bg-[#15342c] active:scale-95 transition cursor-pointer shadow-xs"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Orders List Outer Container */}
              <div 
                style={{
                  border: '1px solid rgba(204, 204, 204, 1)',
                  borderRadius: '6px',
                  background: '#FFFFFF',
                  overflow: 'hidden',
                }}
              >
                {/* Orders Content */}
                {history.length === 0 ? (
                  <div className="p-12 text-center space-y-4">
                    <Package className="w-12 h-12 text-slate-300 mx-auto" />
                    <h3 
                      style={{
                        fontFamily: '"Faktum", "Outfit", sans-serif',
                        fontWeight: 600,
                        fontSize: '18px',
                        color: 'rgba(43, 43, 43, 1)',
                      }}
                    >
                      No orders found
                    </h3>
                    <p 
                      style={{
                        fontFamily: '"Outfit", sans-serif',
                        fontSize: '14px',
                        color: 'rgba(141, 141, 141, 1)',
                      }}
                      className="max-w-sm mx-auto"
                    >
                      {searchQuery || filterStatus !== 'All Orders'
                        ? 'No orders match your search criteria or filter status.'
                        : 'You haven\'t placed any shop orders yet. Explore our catalog to place your first order.'}
                    </p>
                    <button
                      onClick={() => router.push('/shop')}
                      style={{
                        height: '44px',
                        padding: '0 24px',
                        background: 'rgba(29, 73, 62, 1)',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '4px',
                        fontFamily: '"Faktum", "Outfit", sans-serif',
                        fontWeight: 600,
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#173A31'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(29, 73, 62, 1)'; }}
                    >
                      Browse Shop
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200">
                    {history.map((order) => {
                      const firstItem = order.items[0] || { name: 'Nomad Pro Canvas Pack', price: 22900, quantity: 1, size: '45L' };
                      return (
                        <div 
                          key={order.id} 
                          style={{
                            width: '100%',
                            maxWidth: '1280px',
                            height: 'auto',
                            padding: '24px',
                            gap: '24px',
                            background: 'rgba(255, 255, 255, 1)',
                            borderBottom: '1px solid rgba(204, 204, 204, 1)',
                            boxSizing: 'border-box',
                          }}
                          className="flex flex-col md:flex-row items-start justify-between hover:bg-slate-50/50 transition"
                        >
                          {/* Left: Product Image & Info matching exact Figma Specs (width: 532, height: 173, gap: 12) */}
                          <div 
                            style={{
                              width: '532px',
                              height: '173px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              flexShrink: 0,
                            }}
                            className="w-full md:w-[532px]"
                          >
                            {/* Product Image (width: 173, height: 173) */}
                            <div 
                              style={{
                                width: '173px',
                                height: '173px',
                                borderRadius: '4.42px',
                                overflow: 'hidden',
                                flexShrink: 0,
                              }}
                              className="bg-slate-100 border border-slate-200"
                            >
                              <img
                                src={firstItem.image || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop'}
                                alt={firstItem.name}
                                className="w-full h-full object-cover"
                                style={{ borderRadius: '4.42px' }}
                              />
                            </div>

                            {/* Product Details (width: 347, height: 173, gap: 12) */}
                            <div 
                              style={{
                                flex: 1,
                                height: '173px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                justifyContent: 'space-between',
                                opacity: 1,
                              }}
                            >
                              <div>
                                <h3 
                                  style={{
                                    fontFamily: '"Faktum", "Outfit", sans-serif',
                                    fontWeight: 600,
                                    fontSize: '24px',
                                    lineHeight: '100%',
                                    letterSpacing: '0px',
                                    color: 'rgba(43, 43, 43, 1)',
                                    margin: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    opacity: 1,
                                  }}
                                >
                                  {firstItem.name}
                                </h3>
                                <p 
                                  style={{
                                    fontFamily: '"Faktum", "Outfit", sans-serif',
                                    fontWeight: 500,
                                    fontSize: '16px',
                                    lineHeight: '100%',
                                    letterSpacing: '0px',
                                    color: 'rgba(141, 141, 141, 1)',
                                    margin: 0,
                                    marginTop: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    opacity: 1,
                                  }}
                                >
                                  {firstItem.color || 'Olive Drab'} / {firstItem.size || '45L'}
                                </p>
                              </div>

                              <div className="flex flex-col gap-1">
                                <span 
                                  style={{
                                    fontFamily: '"Faktum", "Outfit", sans-serif',
                                    fontWeight: 700,
                                    fontSize: '32px',
                                    lineHeight: '100%',
                                    letterSpacing: '0px',
                                    color: 'rgba(43, 43, 43, 1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    opacity: 1,
                                  }}
                                >
                                  ₹{(firstItem.price || 22900).toLocaleString('en-IN')}
                                </span>
                                <div className="flex items-center gap-2">
                                  {firstItem.originalPrice && (
                                    <span 
                                      style={{
                                        fontFamily: '"Outfit", sans-serif',
                                        fontSize: '14px',
                                        color: 'rgba(141, 141, 141, 1)',
                                        textDecoration: 'line-through',
                                      }}
                                    >
                                      ₹{firstItem.originalPrice.toLocaleString('en-IN')}
                                    </span>
                                  )}
                                  <span 
                                    style={{
                                      fontFamily: '"Faktum", "Outfit", sans-serif',
                                      fontWeight: 500,
                                      fontSize: '14px',
                                      lineHeight: '100%',
                                      letterSpacing: '0px',
                                      color: 'rgba(19, 115, 51, 1)',
                                      backgroundColor: 'rgba(230, 244, 234, 1)',
                                      padding: '2px 8px',
                                      borderRadius: '4px',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      opacity: 1,
                                    }}
                                  >
                                    {firstItem.discount || '16% off'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right: Status Tag, Order ID & Actions matching exact Figma Specs (width: 676, minHeight: 171, gap: 32) */}
                          <div 
                            style={{
                              width: '676px',
                              minHeight: '171px',
                              height: 'auto',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              gap: '32px',
                              opacity: 1,
                              backgroundColor: 'rgba(255, 255, 255, 1)',
                            }}
                            className="w-full md:w-[676px] self-stretch md:self-auto"
                          >
                            {/* Status Tag (Left Aligned matching Figma) */}
                            <div className="flex justify-start">
                              <span 
                                style={{
                                  fontFamily: '"Faktum", "Outfit", sans-serif',
                                  fontWeight: 700,
                                  fontSize: '12px',
                                  color: 'rgba(19, 115, 51, 1)',
                                  backgroundColor: 'rgba(230, 244, 234, 1)',
                                  padding: '4px 12px',
                                  borderRadius: '4px',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.05em',
                                }}
                              >
                                {order.deliveryDate ? `DELIVERED ON ${order.deliveryDate}` : `DELIVERED ON MON, JULY 6TH`}
                              </span>
                            </div>

                            {/* Order ID Row with Bottom Border */}
                            <div 
                              style={{
                                borderBottom: '1px solid rgba(204, 204, 204, 1)',
                                paddingBottom: '12px',
                              }}
                              className="flex items-center justify-between w-full"
                            >
                              <span style={{ fontFamily: '"Faktum", "Outfit", sans-serif', fontWeight: 500, fontSize: '18px', color: 'rgba(43, 43, 43, 1)' }}>
                                Order ID
                              </span>
                              <div className="flex items-center gap-2">
                                <span 
                                  style={{
                                    fontFamily: '"Outfit", sans-serif',
                                    fontWeight: 500,
                                    fontSize: '16px',
                                    color: '#3B82F6',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                  }}
                                  className="hover:opacity-80"
                                >
                                  {order.paymentId || order.id || '4597534682159738'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(order.paymentId || order.id || '4597534682159738');
                                    setCopiedOrderId(order.id);
                                    setTimeout(() => setCopiedOrderId(null), 2000);
                                  }}
                                  className="text-[#3B82F6] hover:opacity-75 p-0.5 cursor-pointer"
                                  title="Copy Order ID"
                                >
                                  {copiedOrderId === order.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#3B82F6]" />}
                                </button>
                              </div>
                            </div>

                            {/* Action Row: Rate & Review Product */}
                            <div className="flex flex-col w-full">
                              <button
                                type="button"
                                onClick={() => setReviewOpenOrderId(reviewOpenOrderId === order.id ? null : order.id)}
                                style={{
                                  fontFamily: '"Faktum", "Outfit", sans-serif',
                                  fontWeight: 600,
                                  fontSize: '18px',
                                  color: 'rgba(43, 43, 43, 1)',
                                  background: 'none',
                                  border: 'none',
                                  padding: 0,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  width: '100%',
                                }}
                                className="hover:text-[#1D493E] transition group"
                              >
                                <span>Rate & Review Product</span>
                                {reviewOpenOrderId === order.id ? (
                                  <ChevronDown className="w-5 h-5 text-[#2B2B2B] group-hover:text-[#1D493E] transition" />
                                ) : (
                                  <ChevronRight className="w-5 h-5 text-[#2B2B2B] group-hover:text-[#1D493E] transition" />
                                )}
                              </button>

                              {/* Expanded Rate & Review Form */}
                              {reviewOpenOrderId === order.id && (
                                <div className="w-full pt-4 mt-3 space-y-4 border-t border-gray-200 animate-fade-in">
                                  {/* Field 1: Rate this product */}
                                  <div className="flex items-center gap-4">
                                    <span style={{ fontFamily: '"Faktum", "Outfit", sans-serif', fontWeight: 500, fontSize: '16px', color: 'rgba(141, 141, 141, 1)' }}>
                                      Rate this product
                                    </span>
                                    <div className="flex items-center gap-1">
                                      {[1, 2, 3, 4, 5].map((starVal) => {
                                        const currentRating = reviewRatings[order.id] || 4;
                                        return (
                                          <button
                                            key={starVal}
                                            type="button"
                                            onClick={() => setReviewRatings(prev => ({ ...prev, [order.id]: starVal }))}
                                            className="p-0.5 focus:outline-none transition cursor-pointer hover:scale-110"
                                          >
                                            <Star
                                              className={`w-6 h-6 ${starVal <= currentRating ? 'fill-[#FBBF24] text-[#FBBF24]' : 'text-gray-300 fill-gray-100'}`}
                                            />
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  {/* Field 2: Review Title (Optional) */}
                                  <div className="flex flex-col gap-1.5 w-full">
                                    <label style={{ fontFamily: '"Faktum", "Outfit", sans-serif', fontWeight: 600, fontSize: '15px', color: '#2B2B2B' }}>
                                      Review Title <span style={{ color: 'rgba(141, 141, 141, 1)', fontWeight: 400 }}>(Optional)</span>
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="Enter your full name"
                                      value={reviewTitles[order.id] || ''}
                                      onChange={(e) => setReviewTitles(prev => ({ ...prev, [order.id]: e.target.value }))}
                                      style={{
                                        width: '100%',
                                        height: '48px',
                                        borderRadius: '4px',
                                        border: '1px solid rgba(204, 204, 204, 1)',
                                        padding: '0 14px',
                                        fontFamily: '"Outfit", sans-serif',
                                        fontSize: '15px',
                                        color: '#2B2B2B',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                      }}
                                      className="focus:border-[#1D493E] transition"
                                    />
                                  </div>

                                  {/* Field 3: Review this product */}
                                  <div className="flex flex-col gap-1.5 w-full">
                                    <label style={{ fontFamily: '"Faktum", "Outfit", sans-serif', fontWeight: 600, fontSize: '15px', color: '#2B2B2B' }}>
                                      Review this product
                                    </label>
                                    <textarea
                                      rows={3}
                                      placeholder="Description"
                                      value={reviewDescriptions[order.id] || ''}
                                      onChange={(e) => setReviewDescriptions(prev => ({ ...prev, [order.id]: e.target.value }))}
                                      style={{
                                        width: '100%',
                                        minHeight: '100px',
                                        borderRadius: '4px',
                                        border: '1px solid rgba(204, 204, 204, 1)',
                                        padding: '12px 14px',
                                        fontFamily: '"Outfit", sans-serif',
                                        fontSize: '15px',
                                        color: '#2B2B2B',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                        resize: 'vertical',
                                      }}
                                      className="focus:border-[#1D493E] transition"
                                    />
                                  </div>

                                  {/* Field 4: Upload Images Button matching exact Figma dashed style */}
                                  <div className="flex flex-col gap-3 pt-1">
                                    <div>
                                      <label 
                                        htmlFor={`upload-images-${order.id}`}
                                        style={{
                                          width: '155px',
                                          height: '48px',
                                          borderRadius: '4px',
                                          border: '1px dashed rgba(63, 136, 255, 1)',
                                          backgroundColor: 'rgba(240, 244, 255, 1)',
                                          color: 'rgba(63, 136, 255, 1)',
                                          fontFamily: '"Faktum", "Outfit", sans-serif',
                                          fontWeight: 600,
                                          fontSize: '14px',
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          gap: '8px',
                                          cursor: 'pointer',
                                        }}
                                        className="hover:bg-blue-100 transition shadow-xs cursor-pointer"
                                      >
                                        <Upload className="w-4 h-4 text-[#3B82F6]" />
                                        Upload Images
                                      </label>
                                      <input
                                        id={`upload-images-${order.id}`}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={(e) => {
                                          const files = e.target.files;
                                          if (files && files.length > 0) {
                                            const newUrls = Array.from(files).map(file => URL.createObjectURL(file));
                                            setReviewImages(prev => ({
                                              ...prev,
                                              [order.id]: [...(prev[order.id] || []), ...newUrls]
                                            }));
                                          }
                                        }}
                                      />
                                    </div>

                                    {/* Images Preview Grid */}
                                    {reviewImages[order.id] && reviewImages[order.id].length > 0 && (
                                      <div className="flex flex-wrap gap-3 pt-1">
                                        {reviewImages[order.id].map((imgUrl, imgIdx) => (
                                          <div key={imgIdx} className="relative w-20 h-20 rounded-md overflow-hidden border border-slate-200 group">
                                            <img src={imgUrl} alt={`Review product photo ${imgIdx + 1}`} className="w-full h-full object-cover" />
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setReviewImages(prev => ({
                                                  ...prev,
                                                  [order.id]: prev[order.id].filter((_, idx) => idx !== imgIdx)
                                                }));
                                              }}
                                              style={{
                                                position: 'absolute',
                                                top: '4px',
                                                right: '4px',
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '50%',
                                                backgroundColor: 'rgba(43, 43, 43, 0.85)',
                                                color: '#FFFFFF',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: 'none',
                                                cursor: 'pointer',
                                              }}
                                              className="hover:bg-red-600 transition"
                                              title="Remove Image"
                                            >
                                              <X className="w-3 h-3" />
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  {/* Submit Button */}
                                  <div className="pt-2 flex justify-end">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSubmittedReviews(prev => ({ ...prev, [order.id]: true }));
                                        setReviewThankYouOrder(order);
                                        setReviewOpenOrderId(null);
                                      }}
                                      style={{
                                        height: '44px',
                                        padding: '0 28px',
                                        borderRadius: '4px',
                                        backgroundColor: '#1D493E',
                                        color: '#FFFFFF',
                                        fontFamily: '"Faktum", "Outfit", sans-serif',
                                        fontWeight: 600,
                                        fontSize: '14px',
                                        border: 'none',
                                        cursor: 'pointer',
                                      }}
                                      className="hover:bg-[#15342c] active:scale-95 transition cursor-pointer shadow-sm"
                                    >
                                      Submit Review
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Pagination Controls matching exact Figma specs */}
                <div 
                  style={{
                    borderTop: '1px solid rgba(204, 204, 204, 1)',
                    padding: '16px 24px',
                    background: '#FFFFFF',
                  }}
                  className="flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <span 
                    style={{
                      fontFamily: '"Faktum", "Outfit", sans-serif',
                      fontWeight: 500,
                      fontSize: '16px',
                      color: 'rgba(43, 43, 43, 1)',
                    }}
                  >
                    Page {ordersCurrentPage} of {Math.max(1, Math.ceil(history.length / 4) || 4)}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={ordersCurrentPage <= 1}
                      onClick={() => setOrdersCurrentPage((prev) => Math.max(1, prev - 1))}
                      style={{
                        width: '36px',
                        height: '36px',
                        border: '1px solid rgba(204, 204, 204, 1)',
                        borderRadius: '4px',
                        background: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: ordersCurrentPage <= 1 ? 'not-allowed' : 'pointer',
                        opacity: ordersCurrentPage <= 1 ? 0.5 : 1,
                      }}
                      className="hover:bg-slate-50 transition cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4 text-slate-600" />
                    </button>

                    {Array.from({ length: Math.max(4, Math.ceil(history.length / 4)) }, (_, i) => i + 1).slice(0, 4).map((pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setOrdersCurrentPage(pageNum)}
                        style={{
                          width: '36px',
                          height: '36px',
                          border: pageNum === ordersCurrentPage ? '1px solid rgba(29, 73, 62, 1)' : '1px solid rgba(204, 204, 204, 1)',
                          borderRadius: '4px',
                          background: pageNum === ordersCurrentPage ? 'rgba(29, 73, 62, 0.08)' : '#FFFFFF',
                          fontFamily: '"Faktum", "Outfit", sans-serif',
                          fontWeight: pageNum === ordersCurrentPage ? 600 : 500,
                          fontSize: '14px',
                          color: pageNum === ordersCurrentPage ? 'rgba(29, 73, 62, 1)' : 'rgba(43, 43, 43, 1)',
                          cursor: 'pointer',
                        }}
                        className="transition cursor-pointer"
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button
                      type="button"
                      disabled={ordersCurrentPage >= Math.max(4, Math.ceil(history.length / 4))}
                      onClick={() => setOrdersCurrentPage((prev) => Math.min(Math.max(4, Math.ceil(history.length / 4)), prev + 1))}
                      style={{
                        width: '36px',
                        height: '36px',
                        border: '1px solid rgba(204, 204, 204, 1)',
                        borderRadius: '4px',
                        background: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: ordersCurrentPage >= Math.max(4, Math.ceil(history.length / 4)) ? 'not-allowed' : 'pointer',
                        opacity: ordersCurrentPage >= Math.max(4, Math.ceil(history.length / 4)) ? 0.5 : 1,
                      }}
                      className="hover:bg-slate-50 transition cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Review Thank You Modal Overlay */}
              {reviewThankYouOrder && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none animate-fade-in">
                  <div 
                    style={{
                      width: "500px",
                      maxWidth: "90vw",
                      borderRadius: "8px",
                      border: "1px solid rgba(204, 204, 204, 1)",
                      backgroundColor: "rgba(255, 255, 255, 1)",
                      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.25)",
                      padding: "36px 28px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      gap: "20px",
                      position: "relative",
                    }}
                    className="animate-scale-up"
                  >
                    {/* Close X Button */}
                    <button
                      type="button"
                      onClick={() => setReviewThankYouOrder(null)}
                      style={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        color: "rgba(141, 141, 141, 1)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                      className="hover:text-[#2B2B2B] transition p-1"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    {/* Circle Badge with Checkmark */}
                    <div 
                      style={{
                        width: "72px",
                        height: "72px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(230, 244, 234, 1)",
                        border: "2px solid rgba(19, 115, 51, 1)",
                        color: "rgba(19, 115, 51, 1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CheckCircle2 className="w-10 h-10 text-[#137333]" />
                    </div>

                    {/* Heading & Subtitle */}
                    <div className="space-y-2">
                      <h3 
                        style={{
                          fontFamily: '"Fraunces", Georgia, serif',
                          fontWeight: 600,
                          fontSize: "26px",
                          lineHeight: "110%",
                          color: "rgba(43, 43, 43, 1)",
                          margin: 0,
                        }}
                      >
                        Thank You for Your Review!
                      </h3>
                      <p 
                        style={{
                          fontFamily: '"Outfit", sans-serif',
                          fontSize: "15px",
                          color: "rgba(141, 141, 141, 1)",
                          lineHeight: "150%",
                          margin: 0,
                        }}
                      >
                        Your review for <strong className="text-[#2B2B2B]">{reviewThankYouOrder.items[0]?.name || 'Product'}</strong> has been submitted. Your feedback helps the Go Banjāra community make great gear choices!
                      </p>
                    </div>

                    {/* Rating Pill Badge Summary */}
                    <div 
                      style={{
                        backgroundColor: "#F9FAFB",
                        border: "1px solid rgba(230, 230, 230, 1)",
                        borderRadius: "6px",
                        padding: "12px 16px",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                        boxSizing: "border-box",
                      }}
                    >
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star 
                            key={s} 
                            className={`w-4 h-4 ${s <= (reviewRatings[reviewThankYouOrder.id] || 4) ? 'fill-[#FBBF24] text-[#FBBF24]' : 'text-gray-300 fill-gray-100'}`} 
                          />
                        ))}
                      </div>
                      <span 
                        style={{
                          fontFamily: '"Faktum", "Outfit", sans-serif',
                          fontWeight: 600,
                          fontSize: "12px",
                          color: "rgba(19, 115, 51, 1)",
                          backgroundColor: "rgba(230, 244, 234, 1)",
                          padding: "3px 10px",
                          borderRadius: "4px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Verified Purchaser
                      </span>
                    </div>

                    {/* Done / Continue Button */}
                    <button
                      type="button"
                      onClick={() => setReviewThankYouOrder(null)}
                      style={{
                        width: "100%",
                        height: "48px",
                        borderRadius: "4px",
                        backgroundColor: "#1D493E",
                        color: "#FFFFFF",
                        fontFamily: '"Faktum", "Outfit", sans-serif',
                        fontWeight: 600,
                        fontSize: "15px",
                        border: "none",
                        cursor: "pointer",
                      }}
                      className="hover:bg-[#15342c] active:scale-95 transition cursor-pointer shadow-md"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MANAGE ADDRESSES matching exact Figma specs */}
          {activeTab === 'addresses' && (
            <div 
              style={{
                width: "100%",
                maxWidth: "936px",
                height: "auto",
                borderRadius: "4px",
                border: "1px solid rgba(204, 204, 204, 1)",
                background: "rgba(255, 255, 255, 1)",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "32px",
                boxSizing: "border-box",
              }}
            >
              {isAddingAddress ? (
                /* ADD A NEW ADDRESS / EDIT ADDRESS Form matching exact Figma specs (width 888, height hug, gap 42) */
                <div 
                  style={{
                    width: "100%",
                    maxWidth: "888px",
                    height: "auto",
                    background: "rgba(255, 255, 255, 1)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "42px",
                    boxSizing: "border-box",
                  }}
                >
                  {/* Heading */}
                  <h2 
                    style={{
                      fontFamily: '"Faktum", "Outfit", sans-serif',
                      fontWeight: 700,
                      fontSize: "18px",
                      lineHeight: "100%",
                      letterSpacing: "0.5px",
                      color: "rgba(141, 141, 141, 1)",
                      textTransform: "uppercase",
                      margin: 0,
                    }}
                  >
                    {editingAddressId ? 'EDIT ADDRESS' : 'ADD A NEW ADDRESS'}
                  </h2>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formattedAddress = formCompleteAddress
                        ? formCompleteAddress
                        : '1st Floor, DSR Tranquil, 102, Plot # 901, Ayyappa Society Main Rd, SBH Officers Colony, Mega Hills, Madhapur, Hyderabad, Telangana 500081';

                      const savedType = formAddressType === 'Others'
                        ? (formOtherLabel.trim().toUpperCase() || 'OTHERS')
                        : formAddressType.toUpperCase();

                      if (editingAddressId) {
                        setAddressList((prev) => prev.map((a) => a.id === editingAddressId ? {
                          ...a,
                          type: savedType,
                          name: formFullName || 'Micheal Jackson',
                          phone: `(+91) ${formMobileNumber || '9492906356'}`,
                          fullAddress: formattedAddress,
                        } : a));
                      } else {
                        const newAddr = {
                          id: `addr-${Date.now()}`,
                          type: savedType,
                          name: formFullName || 'Micheal Jackson',
                          phone: `(+91) ${formMobileNumber || '9492906356'}`,
                          fullAddress: formattedAddress,
                        };
                        setAddressList((prev) => [newAddr, ...prev]);
                      }
                      setIsAddingAddress(false);
                      setEditingAddressId(null);
                    }}
                    className="flex flex-col gap-8 w-full"
                  >
                    {/* Row 1: Full Name & Mobile Number */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                      {/* Full Name */}
                      <div className="flex flex-col gap-2">
                        <label style={{ fontFamily: '"Faktum", "Outfit", sans-serif', fontWeight: 500, fontSize: "16px", color: "#2B2B2B" }}>
                          Full Name <span style={{ color: "rgba(255, 90, 54, 1)" }}>*</span>
                        </label>
                        <input 
                          type="text"
                          required
                          placeholder="Enter your full name"
                          value={formFullName}
                          onChange={(e) => setFormFullName(e.target.value)}
                          style={{
                            height: "48px",
                            borderRadius: "4px",
                            border: "1px solid rgba(204, 204, 204, 1)",
                            padding: "0 16px",
                            fontFamily: '"Faktum", "Outfit", sans-serif',
                            fontSize: "15px",
                            color: "#2B2B2B",
                            outline: "none",
                          }}
                          className="focus:border-[#1D493E] transition"
                        />
                      </div>

                      {/* Mobile Number */}
                      <div className="flex flex-col gap-2">
                        <label style={{ fontFamily: '"Faktum", "Outfit", sans-serif', fontWeight: 500, fontSize: "16px", color: "#2B2B2B" }}>
                          Mobile Number <span style={{ color: "rgba(255, 90, 54, 1)" }}>*</span>
                        </label>
                        <div className="flex items-center gap-2 w-full">
                          <div 
                            style={{
                              height: "48px",
                              padding: "0 14px",
                              borderRadius: "4px",
                              backgroundColor: "rgba(240, 244, 242, 1)",
                              border: "1px solid rgba(204, 204, 204, 1)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontFamily: '"Faktum", "Outfit", sans-serif',
                              fontWeight: 600,
                              fontSize: "15px",
                              color: "#1D493E",
                              flexShrink: 0,
                            }}
                          >
                            + 91
                          </div>
                          <input 
                            type="text"
                            required
                            placeholder="9492906356"
                            value={formMobileNumber}
                            onChange={(e) => setFormMobileNumber(e.target.value)}
                            style={{
                              flex: 1,
                              height: "48px",
                              borderRadius: "4px",
                              border: "1px solid rgba(204, 204, 204, 1)",
                              padding: "0 16px",
                              fontFamily: '"Faktum", "Outfit", sans-serif',
                              fontSize: "15px",
                              color: "#2B2B2B",
                              outline: "none",
                            }}
                            className="focus:border-[#1D493E] transition"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Pincode & Locality */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                      {/* Pincode */}
                      <div className="flex flex-col gap-2">
                        <label style={{ fontFamily: '"Faktum", "Outfit", sans-serif', fontWeight: 500, fontSize: "16px", color: "#2B2B2B" }}>
                          Pincode <span style={{ color: "rgba(255, 90, 54, 1)" }}>*</span>
                        </label>
                        <input 
                          type="text"
                          required
                          placeholder="Enter your pincode"
                          value={formPincode}
                          onChange={(e) => setFormPincode(e.target.value)}
                          style={{
                            height: "48px",
                            borderRadius: "4px",
                            border: "1px solid rgba(204, 204, 204, 1)",
                            padding: "0 16px",
                            fontFamily: '"Faktum", "Outfit", sans-serif',
                            fontSize: "15px",
                            color: "#2B2B2B",
                            outline: "none",
                          }}
                          className="focus:border-[#1D493E] transition"
                        />
                      </div>

                      {/* Locality */}
                      <div className="flex flex-col gap-2">
                        <label style={{ fontFamily: '"Faktum", "Outfit", sans-serif', fontWeight: 500, fontSize: "16px", color: "#2B2B2B" }}>
                          Locality <span style={{ color: "rgba(255, 90, 54, 1)" }}>*</span>
                        </label>
                        <input 
                          type="text"
                          required
                          placeholder="Enter your locality"
                          value={formLocality}
                          onChange={(e) => setFormLocality(e.target.value)}
                          style={{
                            height: "48px",
                            borderRadius: "4px",
                            border: "1px solid rgba(204, 204, 204, 1)",
                            padding: "0 16px",
                            fontFamily: '"Faktum", "Outfit", sans-serif',
                            fontSize: "15px",
                            color: "#2B2B2B",
                            outline: "none",
                          }}
                          className="focus:border-[#1D493E] transition"
                        />
                      </div>
                    </div>

                    {/* Row 3: Complete Address Textarea */}
                    <div className="flex flex-col gap-2 w-full">
                      <label style={{ fontFamily: '"Faktum", "Outfit", sans-serif', fontWeight: 500, fontSize: "16px", color: "#2B2B2B" }}>
                        Complete Address <span style={{ color: "rgba(255, 90, 54, 1)" }}>*</span>
                      </label>
                      <textarea 
                        required
                        rows={4}
                        placeholder="Enter your complete address"
                        value={formCompleteAddress}
                        onChange={(e) => setFormCompleteAddress(e.target.value)}
                        style={{
                          width: "100%",
                          minHeight: "110px",
                          borderRadius: "4px",
                          border: "1px solid rgba(204, 204, 204, 1)",
                          padding: "14px 16px",
                          fontFamily: '"Faktum", "Outfit", sans-serif',
                          fontSize: "15px",
                          color: "#2B2B2B",
                          outline: "none",
                          resize: "none",
                          boxSizing: "border-box",
                        }}
                        className="focus:border-[#1D493E] transition"
                      />
                    </div>

                    {/* Row 4: City/District/Town & State */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                      {/* City */}
                      <div className="flex flex-col gap-2">
                        <label style={{ fontFamily: '"Faktum", "Outfit", sans-serif', fontWeight: 500, fontSize: "16px", color: "#2B2B2B" }}>
                          City/District/Town <span style={{ color: "rgba(255, 90, 54, 1)" }}>*</span>
                        </label>
                        <input 
                          type="text"
                          required
                          placeholder="Enter your city/district/town"
                          value={formCity}
                          onChange={(e) => setFormCity(e.target.value)}
                          style={{
                            height: "48px",
                            borderRadius: "4px",
                            border: "1px solid rgba(204, 204, 204, 1)",
                            padding: "0 16px",
                            fontFamily: '"Faktum", "Outfit", sans-serif',
                            fontSize: "15px",
                            color: "#2B2B2B",
                            outline: "none",
                          }}
                          className="focus:border-[#1D493E] transition"
                        />
                      </div>

                      {/* State */}
                      <div className="flex flex-col gap-2">
                        <label style={{ fontFamily: '"Faktum", "Outfit", sans-serif', fontWeight: 500, fontSize: "16px", color: "#2B2B2B" }}>
                          State <span style={{ color: "rgba(255, 90, 54, 1)" }}>*</span>
                        </label>
                        <input 
                          type="text"
                          required
                          placeholder="Enter your state name"
                          value={formState}
                          onChange={(e) => setFormState(e.target.value)}
                          style={{
                            height: "48px",
                            borderRadius: "4px",
                            border: "1px solid rgba(204, 204, 204, 1)",
                            padding: "0 16px",
                            fontFamily: '"Faktum", "Outfit", sans-serif',
                            fontSize: "15px",
                            color: "#2B2B2B",
                            outline: "none",
                          }}
                          className="focus:border-[#1D493E] transition"
                        />
                      </div>
                    </div>

                    {/* Row 5: Address Type Radio List matching exact Figma Specs */}
                    <div className="flex flex-col gap-3 w-full">
                      <label style={{ fontFamily: '"Faktum", "Outfit", sans-serif', fontWeight: 500, fontSize: "16px", color: "#2B2B2B" }}>
                        Address Type <span style={{ color: "rgba(255, 90, 54, 1)" }}>*</span>
                      </label>

                      <div className="flex flex-col gap-2 w-full">
                        {/* Option 1: Home */}
                        <div
                          onClick={() => setFormAddressType('Home')}
                          style={{
                            width: "100%",
                            height: "48px",
                            padding: "0 16px",
                            borderRadius: "4px",
                            backgroundColor: formAddressType === 'Home' ? "rgba(240, 244, 242, 1)" : "#FFFFFF",
                            border: formAddressType === 'Home' ? "1px solid #1D493E" : "1px solid rgba(204, 204, 204, 1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                formAddressType === 'Home' ? 'border-[#1D493E]' : 'border-gray-400'
                              }`}
                            >
                              {formAddressType === 'Home' && (
                                <div className="w-2.5 h-2.5 rounded-full bg-[#1D493E]" />
                              )}
                            </div>
                            <span style={{ fontFamily: '"Faktum", "Outfit", sans-serif', fontWeight: 600, fontSize: "15px", color: formAddressType === 'Home' ? "#1D493E" : "#2B2B2B" }}>
                              Home
                            </span>
                          </div>
                          {formAddressType === 'Home' && (
                            <Check className="w-4 h-4 text-[#1D493E]" />
                          )}
                        </div>

                        {/* Option 2: Office */}
                        <div
                          onClick={() => setFormAddressType('Office')}
                          style={{
                            width: "100%",
                            height: "48px",
                            padding: "0 16px",
                            borderRadius: "4px",
                            backgroundColor: formAddressType === 'Office' ? "rgba(240, 244, 242, 1)" : "#FFFFFF",
                            border: formAddressType === 'Office' ? "1px solid #1D493E" : "1px solid rgba(204, 204, 204, 1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                formAddressType === 'Office' ? 'border-[#1D493E]' : 'border-gray-400'
                              }`}
                            >
                              {formAddressType === 'Office' && (
                                <div className="w-2.5 h-2.5 rounded-full bg-[#1D493E]" />
                              )}
                            </div>
                            <span style={{ fontFamily: '"Faktum", "Outfit", sans-serif', fontWeight: 600, fontSize: "15px", color: formAddressType === 'Office' ? "#1D493E" : "#2B2B2B" }}>
                              Office
                            </span>
                          </div>
                          {formAddressType === 'Office' && (
                            <Check className="w-4 h-4 text-[#1D493E]" />
                          )}
                        </div>

                        {/* Option 3: Others */}
                        <div
                          onClick={() => setFormAddressType('Others')}
                          style={{
                            width: "100%",
                            height: "48px",
                            padding: "0 16px",
                            borderRadius: "4px",
                            backgroundColor: formAddressType === 'Others' ? "rgba(240, 244, 242, 1)" : "#FFFFFF",
                            border: formAddressType === 'Others' ? "1px solid #1D493E" : "1px solid rgba(204, 204, 204, 1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                formAddressType === 'Others' ? 'border-[#1D493E]' : 'border-gray-400'
                              }`}
                            >
                              {formAddressType === 'Others' && (
                                <div className="w-2.5 h-2.5 rounded-full bg-[#1D493E]" />
                              )}
                            </div>
                            <span style={{ fontFamily: '"Faktum", "Outfit", sans-serif', fontWeight: 600, fontSize: "15px", color: formAddressType === 'Others' ? "#1D493E" : "#2B2B2B" }}>
                              Others
                            </span>
                          </div>
                          {formAddressType === 'Others' && (
                            <Check className="w-4 h-4 text-[#1D493E]" />
                          )}
                        </div>

                        {/* Custom Name Input when "Others" is selected */}
                        {formAddressType === 'Others' && (
                          <div className="flex flex-col gap-1.5 mt-2 w-full animate-fade-in">
                            <label style={{ fontFamily: '"Faktum", "Outfit", sans-serif', fontWeight: 500, fontSize: "14px", color: "#2B2B2B" }}>
                              Save address as <span style={{ color: "rgba(255, 90, 54, 1)" }}>*</span>
                            </label>
                            <input 
                              type="text"
                              required={formAddressType === 'Others'}
                              placeholder="e.g. Parent's House, Farmhouse, Studio"
                              value={formOtherLabel}
                              onChange={(e) => setFormOtherLabel(e.target.value)}
                              style={{
                                height: "46px",
                                borderRadius: "4px",
                                border: "1px solid rgba(204, 204, 204, 1)",
                                padding: "0 16px",
                                fontFamily: '"Faktum", "Outfit", sans-serif',
                                fontSize: "15px",
                                color: "#2B2B2B",
                                outline: "none",
                              }}
                              className="focus:border-[#1D493E] transition"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Row 6: Action Buttons (Cancel | Save new address) */}
                    <div className="flex items-center justify-between w-full pt-4">
                      {/* Cancel Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingAddress(false);
                          setEditingAddressId(null);
                        }}
                        style={{
                          height: "48px",
                          padding: "0 28px",
                          borderRadius: "4px",
                          backgroundColor: "#EFF6FF",
                          color: "#3B82F6",
                          fontFamily: '"Faktum", "Outfit", sans-serif',
                          fontWeight: 600,
                          fontSize: "15px",
                          border: "none",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        className="hover:bg-blue-100 active:scale-95 transition cursor-pointer"
                      >
                        Cancel
                      </button>

                      {/* Save new address Button */}
                      <button
                        type="submit"
                        style={{
                          height: "48px",
                          padding: "0 32px",
                          borderRadius: "4px",
                          backgroundColor: "#1D493E",
                          color: "#FFFFFF",
                          fontFamily: '"Faktum", "Outfit", sans-serif',
                          fontWeight: 600,
                          fontSize: "15px",
                          border: "none",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        className="hover:bg-[#15342c] active:scale-95 transition cursor-pointer shadow-sm"
                      >
                        {editingAddressId ? 'Save changes' : 'Save new address'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* Saved Addresses List View */
                <>
                  {/* Top Button: + ADD A NEW ADDRESS matching exact Figma specs */}
                  <button
                    type="button"
                    onClick={() => {
                      setEditingAddressId(null);
                      setFormFullName('');
                      setFormMobileNumber('');
                      setFormPincode('');
                      setFormLocality('');
                      setFormCompleteAddress('');
                      setFormCity('');
                      setFormState('');
                      setFormAddressType('Home');
                      setIsAddingAddress(true);
                    }}
                    style={{
                      width: "297px",
                      height: "73px",
                      borderRadius: "4px",
                      border: "1px dashed rgba(63, 136, 255, 1)",
                      background: "rgba(63, 136, 255, 0.08)",
                      padding: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      color: "rgba(63, 136, 255, 1)",
                      fontFamily: '"Faktum", "Outfit", sans-serif',
                      fontWeight: 600,
                      fontSize: "16px",
                      lineHeight: "100%",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      boxSizing: "border-box",
                    }}
                    className="hover:opacity-85 transition cursor-pointer"
                  >
                    <span className="text-xl font-normal">+</span>
                    <span>ADD A NEW ADDRESS</span>
                  </button>

                  {/* Heading: SAVED ADDRESSES */}
                  <h2 
                    style={{
                      fontFamily: '"Faktum", "Outfit", sans-serif',
                      fontWeight: 700,
                      fontSize: "18px",
                      lineHeight: "100%",
                      letterSpacing: "0.5px",
                      color: "rgba(141, 141, 141, 1)",
                      textTransform: "uppercase",
                      margin: 0,
                    }}
                  >
                    SAVED ADDRESSES
                  </h2>

                  {/* Saved Addresses Outer List Box */}
                  <div 
                    style={{
                      width: "100%",
                      borderRadius: "4px",
                      border: "1px solid rgba(204, 204, 204, 1)",
                      backgroundColor: "rgba(255, 255, 255, 1)",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {addressList.length === 0 ? (
                      <div 
                        style={{
                          width: "100%",
                          padding: "48px 24px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "12px",
                          textAlign: "center",
                        }}
                      >
                        <MapPin className="w-10 h-10 text-gray-300" />
                        <p style={{ fontFamily: '"Faktum", "Outfit", sans-serif', fontWeight: 600, fontSize: "16px", color: "#2B2B2B", margin: 0 }}>
                          No saved addresses yet
                        </p>
                        <p style={{ fontFamily: '"Faktum", "Outfit", sans-serif', fontSize: "14px", color: "#8D8D8D", margin: 0 }}>
                          Click "+ ADD A NEW ADDRESS" above to add your delivery address.
                        </p>
                      </div>
                    ) : (
                      addressList.map((addr, idx) => {
                      const isLast = idx === addressList.length - 1;
                      const isMenuOpen = openAddressMenuId === addr.id;

                      return (
                        <div 
                          key={addr.id}
                          style={{
                            width: "100%",
                            minHeight: "211px",
                            padding: "24px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            gap: "32px",
                            borderBottom: "1px solid rgba(204, 204, 204, 1)",
                            backgroundColor: "rgba(255, 255, 255, 1)",
                            boxSizing: "border-box",
                            position: "relative",
                          }}
                        >
                          {/* Top Row: Tag & Three Dots Menu */}
                          <div className="flex items-center justify-between w-full">
                            <span 
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                backgroundColor: addr.type === 'HOME' 
                                  ? "rgba(230, 244, 234, 1)" 
                                  : addr.type === 'OFFICE'
                                  ? "rgba(255, 235, 232, 1)"
                                  : "rgba(238, 242, 255, 1)",
                                color: addr.type === 'HOME' 
                                  ? "rgba(19, 115, 51, 1)" 
                                  : addr.type === 'OFFICE'
                                  ? "rgba(255, 90, 54, 1)"
                                  : "rgba(79, 70, 229, 1)",
                                fontFamily: '"Faktum", "Outfit", sans-serif',
                                fontWeight: 700,
                                fontSize: "12px",
                                lineHeight: "100%",
                                letterSpacing: "0.5px",
                                textTransform: "uppercase",
                              }}
                            >
                              {addr.type}
                            </span>

                            {/* Three Dots Menu Icon */}
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => setOpenAddressMenuId(isMenuOpen ? null : addr.id)}
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  borderRadius: "4px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  background: isMenuOpen ? "rgba(240, 240, 240, 1)" : "transparent",
                                  border: "none",
                                  cursor: "pointer",
                                }}
                                className="hover:bg-gray-100 transition cursor-pointer"
                              >
                                <MoreVertical className="w-5 h-5 text-gray-700" />
                              </button>

                              {/* Dropdown Menu (Edit Details / Delete) matching exact Figma Popup Specs */}
                              {isMenuOpen && (
                                <div 
                                  style={{
                                    position: "absolute",
                                    top: "36px",
                                    right: "0",
                                    width: "155px",
                                    height: "114px",
                                    backgroundColor: "rgba(255, 255, 255, 1)",
                                    borderRadius: "4px",
                                    border: "1px solid rgba(204, 204, 204, 1)",
                                    boxShadow: "0px 4px 12px 0px rgba(43, 43, 43, 0.25)",
                                    padding: "8px",
                                    gap: "4px",
                                    zIndex: 50,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    boxSizing: "border-box",
                                  }}
                                >
                                  <button 
                                    type="button"
                                    onClick={() => {
                                      setEditingAddressId(addr.id);
                                      setFormFullName(addr.name);
                                      setFormMobileNumber(addr.phone.replace(/[^0-9]/g, '').slice(-10) || '9492906356');
                                      setFormPincode('500081');
                                      setFormLocality('Madhapur');
                                      setFormCompleteAddress(addr.fullAddress);
                                      setFormCity('Hyderabad');
                                      setFormState('Telangana');
                                      setFormAddressType(addr.type === 'HOME' ? 'Home' : 'Office');
                                      setOpenAddressMenuId(null);
                                      setIsAddingAddress(true);
                                    }}
                                    style={{
                                      width: "100%",
                                      height: "45px",
                                      padding: "8px 12px",
                                      borderRadius: "4px",
                                      border: "none",
                                      backgroundColor: "transparent",
                                      color: "#2B2B2B",
                                      fontFamily: '"Faktum", "Outfit", sans-serif',
                                      fontWeight: 500,
                                      fontSize: "16px",
                                      textAlign: "left",
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                    className="hover:bg-gray-100 transition cursor-pointer"
                                  >
                                    Edit details
                                  </button>
                                  <button 
                                    type="button"
                                    onClick={() => {
                                      setDeleteAddressId(addr.id);
                                      setOpenAddressMenuId(null);
                                    }}
                                    style={{
                                      width: "100%",
                                      height: "45px",
                                      padding: "8px 12px",
                                      borderRadius: "4px",
                                      border: "none",
                                      backgroundColor: "transparent",
                                      color: "#2B2B2B",
                                      fontFamily: '"Faktum", "Outfit", sans-serif',
                                      fontWeight: 500,
                                      fontSize: "16px",
                                      textAlign: "left",
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                    className="hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Name & Phone Number */}
                          <div className="flex items-center gap-3">
                            <span 
                              style={{
                                fontFamily: '"Faktum", "Outfit", sans-serif',
                                fontWeight: 600,
                                fontSize: "18px",
                                color: "#2B2B2B",
                              }}
                            >
                              {addr.name}
                            </span>

                            <div className="flex items-center gap-1.5">
                              <span 
                                style={{
                                  fontFamily: '"Faktum", "Outfit", sans-serif',
                                  fontWeight: 500,
                                  fontSize: "16px",
                                  color: "#3B82F6",
                                  textDecoration: "underline",
                                  cursor: "pointer",
                                }}
                              >
                                {addr.phone}
                              </span>
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(addr.phone);
                                  setCopiedPhoneId(addr.id);
                                  setTimeout(() => setCopiedPhoneId(null), 2000);
                                }}
                                className="text-[#3B82F6] hover:opacity-75 transition p-0.5 cursor-pointer"
                                title="Copy Phone Number"
                              >
                                {copiedPhoneId === addr.id ? (
                                  <Check className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <Copy className="w-4 h-4 text-[#3B82F6]" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Full Address */}
                          <p 
                            style={{
                              fontFamily: '"Faktum", "Outfit", sans-serif',
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "150%",
                              color: "#2B2B2B",
                              margin: 0,
                            }}
                          >
                            {addr.fullAddress}
                          </p>
                        </div>
                      );
                    }))}
                  </div>
                </>
              )}

              {/* Delete Address Confirmation Modal matching exact Figma specs */}
              {deleteAddressId && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none animate-fade-in">
                  <div 
                    style={{
                      width: "500px",
                      maxWidth: "90vw",
                      minHeight: "314px",
                      borderRadius: "4px",
                      border: "1px solid rgba(204, 204, 204, 1)",
                      background: "rgba(255, 255, 255, 1)",
                      padding: "24px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      gap: "24px",
                      boxSizing: "border-box",
                      boxShadow: "0px 16px 40px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <div className="flex flex-col gap-4">
                      <h3 
                        style={{
                          fontFamily: '"Faktum", "Fraunces", sans-serif',
                          fontWeight: 700,
                          fontSize: "24px",
                          lineHeight: "120%",
                          color: "#2B2B2B",
                          margin: 0,
                        }}
                      >
                        Delete Address
                      </h3>

                      <div className="flex flex-col gap-1">
                        <p 
                          style={{
                            fontFamily: '"Faktum", "Outfit", sans-serif',
                            fontWeight: 500,
                            fontSize: "16px",
                            lineHeight: "150%",
                            color: "#2B2B2B",
                            margin: 0,
                          }}
                        >
                          You're about to permanently delete this address.
                        </p>
                        <p 
                          style={{
                            fontFamily: '"Faktum", "Outfit", sans-serif',
                            fontWeight: 500,
                            fontSize: "16px",
                            lineHeight: "150%",
                            color: "#2B2B2B",
                            margin: 0,
                          }}
                        >
                          This action can't be undone.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full">
                      {/* Delete Address Primary Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setAddressList((prev) => prev.filter((a) => a.id !== deleteAddressId));
                          setDeleteAddressId(null);
                        }}
                        style={{
                          width: "100%",
                          height: "48px",
                          borderRadius: "4px",
                          backgroundColor: "#FF3B00",
                          color: "#FFFFFF",
                          fontFamily: '"Faktum", "Outfit", sans-serif',
                          fontWeight: 600,
                          fontSize: "16px",
                          border: "none",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        className="hover:opacity-90 active:scale-95 transition cursor-pointer shadow-sm"
                      >
                        Delete Address
                      </button>

                      {/* Cancel Secondary Button */}
                      <button
                        type="button"
                        onClick={() => setDeleteAddressId(null)}
                        style={{
                          width: "100%",
                          height: "48px",
                          borderRadius: "4px",
                          backgroundColor: "#FFF0ED",
                          color: "#FF3B00",
                          fontFamily: '"Faktum", "Outfit", sans-serif',
                          fontWeight: 600,
                          fontSize: "16px",
                          border: "none",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        className="hover:bg-[#ffe5df] active:scale-95 transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MY WISHLIST */}
          {activeTab === 'wishlist' && (() => {
            const displayWishlist = wishlist.length > 0 ? wishlist : [
              { id: 'w1', name: 'Nomad Pro Canvas Pack', variant: 'Olive Drab / 45L', discount: '16% off', price: 22900, originalPrice: 22000, image: '/nomad_pro_canvas_pack.jpg' },
              { id: 'w2', name: 'Nomad Pro Canvas Pack', variant: 'Olive Drab / 45L', discount: '16% off', price: 22900, originalPrice: 22000, image: '/nomad_pro_canvas_pack.jpg' },
              { id: 'w3', name: 'Nomad Pro Canvas Pack', variant: 'Olive Drab / 45L', discount: '16% off', price: 22900, originalPrice: 22000, image: '/nomad_pro_canvas_pack.jpg' },
              { id: 'w4', name: 'Nomad Pro Canvas Pack', variant: 'Olive Drab / 45L', discount: '16% off', price: 22900, originalPrice: 22000, image: '/nomad_pro_canvas_pack.jpg' },
              { id: 'w5', name: 'Nomad Pro Canvas Pack', variant: 'Olive Drab / 45L', discount: '16% off', price: 22900, originalPrice: 22000, image: '/nomad_pro_canvas_pack.jpg' },
              { id: 'w6', name: 'Nomad Pro Canvas Pack', variant: 'Olive Drab / 45L', discount: '16% off', price: 22900, originalPrice: 22000, image: '/nomad_pro_canvas_pack.jpg' },
            ];

            const totalCount = wishlist.length > 0 ? wishlist.length : 10;

            return (
              <div 
                style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: "32px",
                  width: "100%",
                }}
              >
                {/* Header Title */}
                <h2 
                  style={{
                    fontFamily: 'Faktum, sans-serif',
                    fontWeight: 700,
                    fontSize: '20px',
                    lineHeight: '100%',
                    letterSpacing: '0px',
                    color: 'rgba(141, 141, 141, 1)',
                    textTransform: 'uppercase',
                    margin: 0,
                  }}
                >
                  MY WISHLIST ({totalCount})
                </h2>

                {/* Inner Card Container Box */}
                <div 
                  style={{
                    width: "100%",
                    borderRadius: "4px",
                    border: "1px solid rgba(204, 204, 204, 1)",
                    background: "#FFFFFF",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {displayWishlist.map((item: any, idx: number) => {
                    const itemImg = item.image || (item.images && item.images[0]) || '/nomad_pro_canvas_pack.jpg';
                    const isLast = idx === displayWishlist.length - 1;
                    const itemQty = wishlistQuantities[item.id] || 1;
                    const basePrice = item.price || 149;
                    const totalPrice = basePrice * itemQty;
                    const baseOrigPrice = item.originalPrice || 22000;
                    const totalOrigPrice = baseOrigPrice * itemQty;

                    return (
                      <div 
                        key={item.id || idx}
                        style={{
                          width: "100%",
                          padding: "10px 10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "20px",
                          borderBottom: isLast ? "none" : "1px solid rgba(204, 204, 204, 1)",
                          background: "#FFFFFF",
                          boxSizing: "border-box",
                        }}
                      >
                        {/* Left Side: Thumbnail & Product Info */}
                        <div style={{ display: "flex", alignItems: "center", gap: "20px", minWidth: 0 }}>
                          <img 
                            src={itemImg} 
                            alt={item.name}
                            style={{
                              width: "165px",
                              height: "110px",
                              borderRadius: "4px",
                              objectFit: "cover",
                              flexShrink: 0,
                              imageRendering: '-webkit-optimize-contrast',
                            }}
                          />
                          <div style={{ display: "flex", flexDirection: "column", gap: "12px", minWidth: 0 }}>
                            <h3 
                              style={{ 
                                fontFamily: "Faktum, sans-serif", 
                                fontWeight: 600, 
                                fontSize: "20px", 
                                lineHeight: "110%",
                                color: "rgba(43, 43, 43, 1)", 
                                margin: 0 
                              }}
                            >
                              {item.name}
                            </h3>
                            <p 
                              style={{ 
                                fontFamily: "Faktum, sans-serif", 
                                fontWeight: 500, 
                                fontSize: "14px", 
                                lineHeight: "100%",
                                color: "rgba(141, 141, 141, 1)", 
                                margin: 0 
                              }}
                            >
                              {item.variant || "Olive Drab / 45L"}
                            </p>
                            <span 
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "fit-content",
                                height: "22px",
                                padding: "0 8px",
                                borderRadius: "4px",
                                backgroundColor: "rgba(0, 160, 35, 0.1)",
                                color: "rgba(0, 160, 35, 1)",
                                fontFamily: "Faktum, sans-serif",
                                fontWeight: 500,
                                fontSize: "13px",
                                lineHeight: "100%",
                              }}
                            >
                              {item.discount || "16% off"}
                            </span>
                          </div>
                        </div>

                        {/* Middle: Quantity Stepper Component [- | 1 | +] */}
                        <div 
                          style={{
                            display: "flex",
                            alignItems: "center",
                            height: "38px",
                            backgroundColor: "#F7F6F2",
                            borderRadius: "6px",
                            border: "1px solid rgba(225, 223, 218, 1)",
                            overflow: "hidden",
                            userSelect: "none",
                            margin: "0 auto",
                            flexShrink: 0,
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setWishlistQuantities(prev => {
                                const curr = prev[item.id] || 1;
                                return { ...prev, [item.id]: Math.max(1, curr - 1) };
                              });
                            }}
                            style={{
                              width: "36px",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "transparent",
                              border: "none",
                              borderRight: "1px solid rgba(220, 220, 215, 0.8)",
                              cursor: "pointer",
                              color: "#2B2B2B",
                              fontSize: "18px",
                              fontWeight: 500,
                            }}
                            className="hover:bg-black/5 active:scale-95 transition"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <div 
                            style={{
                              width: "42px",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontFamily: "Faktum, sans-serif",
                              fontWeight: 600,
                              fontSize: "15px",
                              color: "#2B2B2B",
                            }}
                          >
                            {wishlistQuantities[item.id] || 1}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setWishlistQuantities(prev => {
                                const curr = prev[item.id] || 1;
                                return { ...prev, [item.id]: curr + 1 };
                              });
                            }}
                            style={{
                              width: "36px",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "transparent",
                              border: "none",
                              borderLeft: "1px solid rgba(220, 220, 215, 0.8)",
                              cursor: "pointer",
                              color: "#2B2B2B",
                              fontSize: "18px",
                              fontWeight: 500,
                            }}
                            className="hover:bg-black/5 active:scale-95 transition"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* Right Side: Price, Cart Button & Delete Trash Icon */}
                        <div style={{ display: "flex", alignItems: "center", gap: "24px", flexShrink: 0 }}>
                          {/* Price Block (Shifted left with marginRight) */}
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px", marginRight: "16px" }}>
                            <span 
                              style={{ 
                                fontFamily: "Faktum, sans-serif", 
                                fontWeight: 700, 
                                fontSize: "26px", 
                                lineHeight: "100%",
                                color: "rgba(43, 43, 43, 1)" 
                              }}
                            >
                              ₹{totalPrice.toLocaleString('en-IN')}
                            </span>
                            <span 
                              style={{ 
                                fontFamily: "Faktum, sans-serif", 
                                fontWeight: 400, 
                                fontSize: "14px", 
                                lineHeight: "100%",
                                color: "rgba(141, 141, 141, 1)", 
                                textDecoration: "line-through" 
                              }}
                            >
                              ₹{totalOrigPrice.toLocaleString('en-IN')}
                            </span>
                          </div>

                          {/* Action Buttons Group (Cart Button + Delete Button) */}
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            {/* Add to Cart Button (52px x 47px, padding: 8px 12px, radius: 4px) */}
                            <button
                              type="button"
                              onClick={() => addToCart(item, item.type || 'shop', undefined, undefined, undefined, itemQty)}
                              style={{
                                width: "52px",
                                height: "47px",
                                borderRadius: "4px",
                                padding: "8px 12px",
                                backgroundColor: "rgba(245, 245, 245, 1)",
                                border: "1px solid rgba(229, 231, 235, 1)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                              }}
                              className="hover:bg-[#1D493E]/10 hover:border-[#1D493E]/30 active:scale-95 cursor-pointer group"
                              title="Add to Cart"
                              aria-label="Add item to cart"
                            >
                              <ShoppingBag style={{ width: "20px", height: "20px", color: "rgba(43, 43, 43, 1)" }} className="group-hover:text-[#1D493E] transition-colors" />
                            </button>

                            {/* Delete Trash Button */}
                            <button
                              type="button"
                              onClick={() => toggleWishlist(item)}
                              style={{
                                width: "47px",
                                height: "47px",
                                borderRadius: "4px",
                                backgroundColor: "rgba(253, 242, 242, 1)",
                                border: "1px solid rgba(254, 226, 226, 1)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                              }}
                              className="hover:bg-red-100 active:scale-95 cursor-pointer"
                              title="Remove from Wishlist"
                              aria-label="Remove item from wishlist"
                            >
                              <Trash2 style={{ width: "18px", height: "18px", color: "rgba(239, 68, 68, 1)" }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* TAB 5: MY CART */}
          {activeTab === 'cart' && (() => {
            const totalCount = cartCount || cart.length;

            return (
              <div 
                style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: "32px",
                  width: "100%",
                }}
              >
                {/* Header Title */}
                <h2 
                  style={{
                    fontFamily: 'Faktum, sans-serif',
                    fontWeight: 700,
                    fontSize: '20px',
                    lineHeight: '100%',
                    letterSpacing: '0px',
                    color: 'rgba(141, 141, 141, 1)',
                    textTransform: 'uppercase',
                    margin: 0,
                  }}
                >
                  MY CART ({totalCount})
                </h2>

                {cart.length === 0 ? (
                  <div 
                    style={{
                      width: "100%",
                      minHeight: "395px",
                      padding: "42px 40px",
                      backgroundColor: "rgba(255, 255, 255, 1)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "24px",
                      boxSizing: "border-box",
                      border: "1px solid rgba(225, 223, 218, 1)",
                      borderRadius: "4px",
                    }}
                  >
                    {/* Icon Box with Bonjo Tag */}
                    <div 
                      className="relative flex items-center justify-center"
                      style={{
                        width: "110px",
                        height: "110px",
                        borderRadius: "8px",
                        backgroundColor: "rgba(240, 244, 242, 1)",
                      }}
                    >
                      <svg className="w-14 h-14 text-[#1D493E]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span 
                        className="absolute -bottom-1 -right-2 bg-[#1D493E] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-sm tracking-wider"
                        style={{ transform: "rotate(-6deg)" }}
                      >
                        BONJO
                      </span>
                    </div>

                    {/* Text Content */}
                    <div className="flex flex-col items-center gap-2 text-center">
                      <h2 
                        style={{
                          fontFamily: "Faktum, sans-serif",
                          fontWeight: 700,
                          fontSize: "26px",
                          lineHeight: "120%",
                          color: "rgba(43, 43, 43, 1)",
                          margin: 0,
                        }}
                      >
                        Your cart is currently empty
                      </h2>
                      <p 
                        style={{
                          fontFamily: "Faktum, sans-serif",
                          fontWeight: 500,
                          fontSize: "16px",
                          lineHeight: "140%",
                          color: "rgba(141, 141, 141, 1)",
                          margin: 0,
                        }}
                      >
                        Looks like Bonjo hasn't packed your bag yet. Let's start an adventure!
                      </p>
                    </div>

                    {/* Browse Button */}
                    <button 
                      onClick={() => router.push('/shop')}
                      style={{
                        height: "48px",
                        padding: "0 28px",
                        borderRadius: "4px",
                        backgroundColor: "#1D493E",
                        color: "#FFFFFF",
                        fontFamily: "Faktum, sans-serif",
                        fontWeight: 600,
                        fontSize: "16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      className="hover:bg-[#15342c] active:scale-95 cursor-pointer shadow-sm"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>Browse All Products</span>
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    {/* Inner Card Container Box */}
                    <div 
                      style={{
                        width: "100%",
                        borderRadius: "4px",
                        border: "1px solid rgba(204, 204, 204, 1)",
                        background: "#FFFFFF",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {cart.map((item: any, idx: number) => {
                        const itemImg = item.image || '/nomad_pro_canvas_pack.jpg';
                        const isLast = idx === cart.length - 1;

                        return (
                          <div 
                            key={item.id || idx}
                            style={{
                              width: "100%",
                              padding: "10px 10px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "20px",
                              borderBottom: isLast ? "none" : "1px solid rgba(204, 204, 204, 1)",
                              background: "#FFFFFF",
                              boxSizing: "border-box",
                            }}
                          >
                            {/* Left Side: Thumbnail & Product Info */}
                            <div style={{ display: "flex", alignItems: "center", gap: "20px", minWidth: 0 }}>
                              <img 
                                src={itemImg} 
                                alt={item.name}
                                style={{
                                  width: "165px",
                                  height: "110px",
                                  borderRadius: "4px",
                                  objectFit: "cover",
                                  flexShrink: 0,
                                  imageRendering: '-webkit-optimize-contrast',
                                }}
                              />
                              <div style={{ display: "flex", flexDirection: "column", gap: "12px", minWidth: 0 }}>
                                <h3 
                                  style={{ 
                                    fontFamily: "Faktum, sans-serif", 
                                    fontWeight: 600, 
                                    fontSize: "20px", 
                                    lineHeight: "110%",
                                    color: "rgba(43, 43, 43, 1)", 
                                    margin: 0 
                                  }}
                                >
                                  {item.name}
                                </h3>
                                <p 
                                  style={{ 
                                    fontFamily: "Faktum, sans-serif", 
                                    fontWeight: 500, 
                                    fontSize: "14px", 
                                    lineHeight: "100%",
                                    color: "rgba(141, 141, 141, 1)", 
                                    margin: 0 
                                  }}
                                >
                                  {item.size ? `Size: ${item.size}` : item.type === 'travel' ? `Guests: ${item.guests || 1}` : "Standard Variant"}
                                </p>

                              </div>
                            </div>

                            {/* Middle: Quantity Stepper Component [- | qty | +] */}
                            <div 
                              style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr 1fr",
                                width: "114px",
                                height: "38px",
                                backgroundColor: "#F7F6F2",
                                borderRadius: "6px",
                                border: "1px solid rgba(225, 223, 218, 1)",
                                overflow: "hidden",
                                userSelect: "none",
                                margin: "0 auto",
                                flexShrink: 0,
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  background: "transparent",
                                  border: "none",
                                  borderRight: "1px solid rgba(220, 220, 215, 0.8)",
                                  cursor: "pointer",
                                  color: "#2B2B2B",
                                  fontSize: "18px",
                                  fontWeight: 500,
                                }}
                                className="hover:bg-black/5 active:scale-95 transition cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                -
                              </button>
                              <div 
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontFamily: '"Faktum", sans-serif',
                                  fontWeight: 600,
                                  fontSize: "15px",
                                  color: "#2B2B2B",
                                }}
                              >
                                {item.quantity || 1}
                              </div>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  background: "transparent",
                                  border: "none",
                                  borderLeft: "1px solid rgba(220, 220, 215, 0.8)",
                                  cursor: "pointer",
                                  color: "#2B2B2B",
                                  fontSize: "18px",
                                  fontWeight: 500,
                                }}
                                className="hover:bg-black/5 active:scale-95 transition cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>

                            {/* Right Side: Total Price & Delete Button */}
                            <div style={{ display: "flex", alignItems: "center", gap: "24px", flexShrink: 0 }}>
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px", marginRight: "16px" }}>
                                <span 
                                  style={{ 
                                    fontFamily: "Faktum, sans-serif", 
                                    fontWeight: 700, 
                                    fontSize: "26px", 
                                    lineHeight: "100%",
                                    color: "rgba(43, 43, 43, 1)" 
                                  }}
                                >
                                  ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                                </span>
                                <span 
                                  style={{ 
                                    fontFamily: "Faktum, sans-serif", 
                                    fontWeight: 400, 
                                    fontSize: "13px", 
                                    lineHeight: "100%",
                                    color: "rgba(141, 141, 141, 1)" 
                                  }}
                                >
                                  ₹{item.price?.toLocaleString('en-IN')} each
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeFromCart(item.id)}
                                style={{
                                  width: "47px",
                                  height: "47px",
                                  borderRadius: "4px",
                                  backgroundColor: "rgba(253, 242, 242, 1)",
                                  border: "1px solid rgba(254, 226, 226, 1)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer",
                                  transition: "all 0.2s ease",
                                }}
                                className="hover:bg-red-100 active:scale-95 cursor-pointer"
                                title="Remove from Cart"
                                aria-label="Remove item from cart"
                              >
                                <Trash2 style={{ width: "18px", height: "18px", color: "rgba(239, 68, 68, 1)" }} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Summary Footer */}
                    <div className="bg-white rounded-[4px] border border-[#CCCCCC] p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500 font-sans">Total Amount:</span>
                        <div className="text-2xl font-bold font-sans text-[#1D493E]">₹{cartTotal.toLocaleString('en-IN')}</div>
                      </div>
                      <button
                        onClick={() => setCheckoutOpen(true)}
                        className="px-8 py-3.5 bg-[#1D493E] hover:bg-[#15342c] text-white font-sans font-bold text-sm uppercase tracking-wider rounded-[4px] transition cursor-pointer shadow-sm"
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
        {/* Account Logout Confirmation Modal */}
        {showLogoutModal && (
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm select-none"
            onClick={() => setShowLogoutModal(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: "460px",
                borderRadius: "12px",
                border: "1px solid rgba(204, 204, 204, 1)",
                backgroundColor: "#FFFFFF",
                padding: "32px 28px 24px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                boxSizing: "border-box",
                boxShadow: "0px 20px 60px rgba(0, 0, 0, 0.18)",
              }}
            >
              {/* Icon + Title */}
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{
                  width: "48px", height: "48px",
                  borderRadius: "50%",
                  background: "rgba(255, 40, 0, 0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,40,0,1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </div>
                <h3 style={{
                  fontFamily: '"Fraunces", Georgia, serif',
                  fontWeight: 700,
                  fontSize: "22px",
                  color: "rgba(43, 43, 43, 1)",
                  margin: 0,
                }}>
                  Log out of your account?
                </h3>
              </div>

              {/* Body text */}
              <p style={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 400,
                fontSize: "15px",
                lineHeight: "1.6",
                color: "rgba(43, 43, 43, 0.7)",
                margin: 0,
              }}>
                You&apos;ll be returned to the Home screen after logging out. Any unsaved changes may be lost.
              </p>

              {/* Action Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
                {/* Logout Red Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    height: "48px",
                    borderRadius: "6px",
                    backgroundColor: "rgba(255, 40, 0, 1)",
                    color: "#FFFFFF",
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 700,
                    fontSize: "15px",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    letterSpacing: "0.01em",
                  }}
                  className="hover:opacity-90 active:scale-[0.98] transition cursor-pointer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Yes, Log Out
                </button>

                {/* Cancel Button */}
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(false)}
                  style={{
                    width: "100%",
                    height: "48px",
                    borderRadius: "6px",
                    backgroundColor: "rgba(255, 241, 239, 1)",
                    color: "rgba(255, 40, 0, 1)",
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 600,
                    fontSize: "15px",
                    border: "1px solid rgba(255, 200, 195, 1)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  className="hover:bg-[#FFE5E0] active:scale-[0.98] transition cursor-pointer"
                >
                  Cancel, Stay Logged In
                </button>
              </div>
            </div>
          </div>
        )}

        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen bg-white flex items-center justify-center font-sans font-medium text-slate-500">
        Loading profile...
      </div>
    }>
      <ProfilePageContent />
    </Suspense>
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
