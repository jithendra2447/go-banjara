'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, Map as MapIcon, ShoppingBag, ClipboardList, Users,
  ShieldCheck, DollarSign, Plus, Trash2, Edit3, CheckCircle2,
  AlertCircle, FileText, Search, CreditCard, ArrowRight, Ban,
  Eye, Calendar, Check, Landmark, RefreshCw, BookOpen, Star
} from 'lucide-react';
import { useCart } from '@/components/providers';
import { DESTINATIONS as INITIAL_DESTINATIONS, Destination } from '@/data/destinations';
import { PRODUCTS as INITIAL_PRODUCTS } from '@/data/products';
import { HOLIDAY_PACKAGES as INITIAL_HOLIDAY_PACKAGES, HolidayPackage } from '@/data/packages';
import { Product } from '@/types';

type AdminTab = 'overview' | 'destinations' | 'packages' | 'products' | 'orders' | 'bookings' | 'customers' | 'payments' | 'blogs' | 'pages';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  size?: string;
  date?: string;
  guests?: number;
}

interface OrderHistoryItem {
  id: string;
  date: string;
  type: 'shop' | 'travel';
  items: OrderItem[];
  total: number;
  status: string;
  paymentId: string;
  customerEmail?: string;
  customerPhone?: string;
}

interface CustomerItem {
  email?: string;
  phone?: string;
  ordersCount: number;
  totalSpend: number;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  readTime: string;
}

const DEFAULT_BLOGS: BlogPost[] = [
  {
    id: 'post-cardamom',
    title: 'The Queen of Spices: A Journey into Kerala’s Cardamom Hills',
    excerpt: 'Deep inside the Western Ghats, local farmers harvest green cardamom by hand. Discover the traditional sorting and sun-curing processes that give this spice its unmatched aroma.',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=500&q=80',
    date: 'June 24, 2026',
    author: 'Aarav Nair',
    readTime: '5 min read',
  },
  {
    id: 'post-houseboat',
    title: 'Anatomy of a Kettuvallam: The Art of Wooden Boatbuilding',
    excerpt: 'No nails, only coir rope, bamboo poles, and cashew husk oil. Learn how Kerala artisans construct colossal, luxury houseboats that float seamlessly on water without harming the ecosystem.',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=500&q=80',
    date: 'June 18, 2026',
    author: 'Meera Kutty',
    readTime: '6 min read',
  },
  {
    id: 'post-khadi',
    title: 'Spinning Stories: Why Indigo Khadi Remains Eternally Modern',
    excerpt: 'Indigo is more than a color; it is a live organic entity. Step inside rural hand-spinning workshops and find out why this traditional breathing fabric is the ultimate choice for sustainable fashion.',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=500&q=80',
    date: 'May 29, 2026',
    author: 'Vikram Joshi',
    readTime: '4 min read',
  }
];

export default function AdminPortal() {
  const { user, setAuthOpen } = useCart();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Core Data States (Synced to LocalStorage for full persistence)
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [packages, setPackages] = useState<HolidayPackage[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [bookings, setBookings] = useState<OrderHistoryItem[]>([]);
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  
  // Editing States
  const [editingPkg, setEditingPkg] = useState<HolidayPackage | null>(null);
  const [editingProd, setEditingProd] = useState<Product | null>(null);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [editingDest, setEditingDest] = useState<Destination | null>(null);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      alert('Unauthorized. Please log in to your admin account.');
      setAuthOpen(true);
      router.push('/shop');
    }
  }, [user, setAuthOpen, router]);

  // Load and Aggregate Data on Mount
  useEffect(() => {
    if (!user) return;

    // 1. Destinations load
    const savedDests = localStorage.getItem('gb_admin_destinations');
    if (savedDests) {
      setDestinations(JSON.parse(savedDests));
    } else {
      setDestinations(INITIAL_DESTINATIONS);
      localStorage.setItem('gb_admin_destinations', JSON.stringify(INITIAL_DESTINATIONS));
    }

    // 2. Packages load
    const savedPkgs = localStorage.getItem('gb_admin_packages');
    let parsedPkgs = savedPkgs ? JSON.parse(savedPkgs) : [];
    const hasAllFields = INITIAL_HOLIDAY_PACKAGES.every(hp => {
      const found = parsedPkgs.find((p: any) => p.id === hp.id);
      return found && found.price !== undefined && found.link && found.routeList && found.itinerary;
    });
    const isStale = !savedPkgs || parsedPkgs.length !== INITIAL_HOLIDAY_PACKAGES.length || !hasAllFields;

    if (isStale) {
      setPackages(INITIAL_HOLIDAY_PACKAGES);
      localStorage.setItem('gb_admin_packages', JSON.stringify(INITIAL_HOLIDAY_PACKAGES));
    } else {
      setPackages(parsedPkgs);
    }

    // 3. Products load
    const savedProds = localStorage.getItem('gb_admin_products_v3');
    if (savedProds) {
      setProducts(JSON.parse(savedProds));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('gb_admin_products_v3', JSON.stringify(INITIAL_PRODUCTS));
    }

    // 4. Blogs load
    const savedBlogs = localStorage.getItem('gb_admin_blogs');
    if (savedBlogs) {
      setBlogs(JSON.parse(savedBlogs));
    } else {
      setBlogs(DEFAULT_BLOGS);
      localStorage.setItem('gb_admin_blogs', JSON.stringify(DEFAULT_BLOGS));
    }

    // 5. Scan LocalStorage for histories
    const allOrders: OrderHistoryItem[] = [];
    const allBookings: OrderHistoryItem[] = [];
    const customersMap = new Map<string, CustomerItem>();

    let foundHistoryKeys = false;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('gb_history_')) {
        foundHistoryKeys = true;
        const userIdentifier = key.replace('gb_history_', '');
        try {
          const list = JSON.parse(localStorage.getItem(key) || '[]');
          list.forEach((item: any) => {
            const enrichedItem = {
              ...item,
              customerEmail: userIdentifier.includes('@') ? userIdentifier : undefined,
              customerPhone: !userIdentifier.includes('@') ? userIdentifier : undefined,
            };
            if (item.type === 'shop') {
              allOrders.push(enrichedItem);
            } else {
              allBookings.push(enrichedItem);
            }
          });

          const ordersTotal = list.reduce((sum: number, it: any) => sum + it.total, 0);
          customersMap.set(userIdentifier, {
            email: userIdentifier.includes('@') ? userIdentifier : undefined,
            phone: !userIdentifier.includes('@') ? userIdentifier : undefined,
            ordersCount: list.length,
            totalSpend: ordersTotal,
          });
        } catch (e) {
          console.error(e);
        }
      }
    }

    if (!foundHistoryKeys) {
      const mockHistory: OrderHistoryItem[] = [
        {
          id: 'GB-928401-26',
          date: '12 May, 2026',
          type: 'shop',
          items: [
            { name: 'Printed Organic Cotton T-Shirt', quantity: 1, price: 850, size: 'L' }
          ],
          total: 850,
          status: 'Shipped',
          paymentId: 'pay_P1o983dG8f7qN1',
          customerEmail: 'arjun.sen@gmail.com'
        }
      ];
      mockHistory.forEach(item => {
        if (item.type === 'shop') allOrders.push(item);
        else allBookings.push(item);
      });
      localStorage.setItem('gb_history_arjun.sen@gmail.com', JSON.stringify(mockHistory));
      customersMap.set('arjun.sen@gmail.com', {
        email: 'arjun.sen@gmail.com',
        ordersCount: 1,
        totalSpend: 850
      });
    }

    setOrders(allOrders);
    setBookings(allBookings);
    setCustomers(Array.from(customersMap.values()));

  }, [user]);

  const [cmsContent, setCmsContent] = useState({
    heroTitleLine1: "Hey! Let’s",
    heroTitleLine2: "Escape from",
    heroTitleLine3: "the Ordinary",
    heroSubtitle: "We bridge the gap between soulful Indian travel and high end gear. curated for those who find home in the dust of the road",
    heroShopBtn: "Shop Now",
    heroTravelBtn: "See Travel Packages",
    mascotText: "Hey wanderer! I'm Bonjo. Ready to hit the road?",
    dealsTitle: "Today's best deals for you",
    dealsSub: "A hand-picked map of the corners of India our community keeps coming back to",
    sellingTitle: "Most Selling Products",
    sellingSub: "A hand-picked map of the corners of India our community keeps coming back to",
    reviewsTitle: "What people say about products",
    blogTitle: "Travel Tales from the curious Explorer",
    blogSub: "Follow my voices to discover unique voices, breathtaking landscapes & unforgettable experiences",
    faqTitle: "Frequently Asked Questions",
    faqHelpDesk: "Help Desk",
    valuesTitle: "Built For Travelers, By Travelers",
    valuesSub: "We focus on safety, unique slow-travel routes, handcrafted durable products, and supporting remote communities"
  });

  useEffect(() => {
    const savedCMS = localStorage.getItem('gb_admin_page_content');
    if (savedCMS) {
      try {
        setCmsContent(JSON.parse(savedCMS));
      } catch (e) {
        console.error('Error loading cmsContent:', e);
      }
    }
  }, []);

  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('gb_admin_page_content', JSON.stringify(cmsContent));
    showToast('Website static text copy successfully updated!');
  };

  // Form input states
  const [newDest, setNewDest] = useState({ name: '', sub: '', desc: '', image: '', color: 'from-amber-600 to-amber-800', season: '', attractions: '' });
  const [newPkg, setNewPkg] = useState({ name: '', destination: 'Kashmir', price: '', originalPrice: '', duration: '', durationDays: '5', rating: '5.0', route: '', description: '', hotelStars: '4★ Premium Stays', highlights: '', image: '' });
  const [newProd, setNewProd] = useState({ name: '', category: 'apparel', price: '', originalPrice: '', description: '', rating: '5.0', inStock: true, image: '' });
  const [newBlog, setNewBlog] = useState({ title: '', excerpt: '', image: '', author: '', readTime: '5 min read' });

  // Calculations
  const calculatedMetrics = useMemo(() => {
    const totalOrderRevenue = orders.reduce((sum, o) => o.status !== 'Cancelled' ? sum + o.total : sum, 0);
    const totalBookingRevenue = bookings.reduce((sum, b) => b.status !== 'Cancelled' ? sum + b.total : sum, 0);
    const grossRevenue = totalOrderRevenue + totalBookingRevenue;

    const paymentLogs = [...orders, ...bookings].map(item => ({
      id: item.paymentId,
      amount: item.total,
      date: item.date,
      type: item.type,
      status: item.status === 'Cancelled' ? 'Failed' : 'Captured',
      method: item.type === 'travel' ? 'Netbanking / UPI' : 'Credit Card',
      email: item.customerEmail || item.customerPhone || 'Nomad Explorer'
    }));

    const totalAttempts = paymentLogs.length;
    const successfulAttempts = paymentLogs.filter(p => p.status === 'Captured').length;
    const successRate = totalAttempts > 0 ? Math.round((successfulAttempts / totalAttempts) * 100) : 100;

    return {
      grossRevenue,
      totalOrders: orders.length,
      totalBookings: bookings.length,
      totalCustomers: customers.length,
      successRate,
      paymentLogs
    };
  }, [orders, bookings, customers]);

  if (!user) return null;

  // Edit / Save Handlers
  const handleSaveDestEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDest) return;
    const updated = destinations.map(d => d.id === editingDest.id ? editingDest : d);
    setDestinations(updated);
    localStorage.setItem('gb_admin_destinations', JSON.stringify(updated));
    setEditingDest(null);
    showToast('Destination updated successfully!');
  };

  const handleSavePkgEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPkg) return;
    const updated = packages.map(p => p.id === editingPkg.id ? editingPkg : p);
    setPackages(updated);
    localStorage.setItem('gb_admin_packages', JSON.stringify(updated));
    setEditingPkg(null);
    showToast('Travel package updated successfully!');
  };

  const handleSaveProdEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProd) return;
    const updated = products.map(p => p.id === editingProd.id ? editingProd : p);
    setProducts(updated);
    localStorage.setItem('gb_admin_products_v3', JSON.stringify(updated));
    setEditingProd(null);
    showToast('Shop product updated successfully!');
  };

  const handleSaveBlogEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;
    const updated = blogs.map(b => b.id === editingBlog.id ? editingBlog : b);
    setBlogs(updated);
    localStorage.setItem('gb_admin_blogs', JSON.stringify(updated));
    setEditingBlog(null);
    showToast('Blog article updated successfully!');
  };

  // 1. Destination managers
  const handleAddDest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDest.name || !newDest.desc) {
      showToast('Please enter name and description', 'error');
      return;
    }
    const created: Destination = {
      id: newDest.name.toLowerCase().replace(/\s+/g, '-'),
      name: newDest.name,
      sub: newDest.sub || 'Custom Destination',
      desc: newDest.desc,
      image: newDest.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
      color: newDest.color,
      season: newDest.season || 'All Year Round',
      attractions: newDest.attractions ? newDest.attractions.split(',').map(s => s.trim()) : [],
      recommendedProductIds: []
    };

    const updated = [...destinations, created];
    setDestinations(updated);
    localStorage.setItem('gb_admin_destinations', JSON.stringify(updated));
    setNewDest({ name: '', sub: '', desc: '', image: '', color: 'from-amber-600 to-amber-800', season: '', attractions: '' });
    showToast('Destination created successfully!');
  };

  const handleDeleteDest = (id: string) => {
    const updated = destinations.filter(d => d.id !== id);
    setDestinations(updated);
    localStorage.setItem('gb_admin_destinations', JSON.stringify(updated));
    showToast('Destination deleted.');
  };

  // 2. Packages managers
  const handleAddPkg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPkg.name || !newPkg.price) {
      showToast('Please enter name and price', 'error');
      return;
    }
    const created: HolidayPackage = {
      id: `pkg-${Date.now()}`,
      name: newPkg.name,
      price: Number(newPkg.price),
      originalPrice: newPkg.originalPrice ? Number(newPkg.originalPrice) : Number(newPkg.price) * 1.25,
      duration: newPkg.duration || '5 Days / 4 Nights',
      durationDays: Number(newPkg.durationDays) || 5,
      rating: Number(newPkg.rating) || 5.0,
      ratingCount: 120,
      hotelStars: newPkg.hotelStars || '4★ Premium Stays',
      hotelClass: '4',
      route: newPkg.route || '',
      routeList: newPkg.route ? newPkg.route.split('→').map(s => s.trim()) : [],
      description: newPkg.description || '',
      inclusions: ['flights', 'hotel', 'transfers', 'meals', 'sightseeing'],
      highlights: newPkg.highlights ? newPkg.highlights.split(',').map(s => s.trim()) : [],
      image: newPkg.image || 'https://images.unsplash.com/photo-1566837945700-30057527ade0?w=800',
      themes: ['Adventure'],
      destination: newPkg.destination as any,
      detailsAvailable: true,
      link: '#'
    };

    const updated = [...packages, created];
    setPackages(updated);
    localStorage.setItem('gb_admin_packages', JSON.stringify(updated));
    setNewPkg({ name: '', destination: 'Kashmir', price: '', originalPrice: '', duration: '', durationDays: '5', rating: '5.0', route: '', description: '', hotelStars: '4★ Premium Stays', highlights: '', image: '' });
    showToast('Travel package created successfully!');
  };

  const handleDeletePkg = (id: string) => {
    const updated = packages.filter(p => p.id !== id);
    setPackages(updated);
    localStorage.setItem('gb_admin_packages', JSON.stringify(updated));
    showToast('Travel package deleted.');
  };

  // 3. Product managers
  const handleAddProd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price) {
      showToast('Please enter product name and price', 'error');
      return;
    }
    const created: Product = {
      id: `prod-${Date.now()}`,
      name: newProd.name,
      price: Number(newProd.price),
      originalPrice: newProd.originalPrice ? Number(newProd.originalPrice) : undefined,
      description: newProd.description || '',
      image: newProd.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500',
      category: newProd.category,
      rating: Number(newProd.rating) || 5.0,
      inStock: newProd.inStock,
      brand: 'Banjāra Originals',
      color: 'Beige'
    };

    const updated = [...products, created];
    setProducts(updated);
    localStorage.setItem('gb_admin_products_v3', JSON.stringify(updated));
    setNewProd({ name: '', category: 'apparel', price: '', originalPrice: '', description: '', rating: '5.0', inStock: true, image: '' });
    showToast('Shop product created successfully!');
  };

  const toggleStock = (id: string) => {
    const updated = products.map(p => p.id === id ? { ...p, inStock: !p.inStock } : p);
    setProducts(updated);
    localStorage.setItem('gb_admin_products_v3', JSON.stringify(updated));
    showToast('Product stock status updated.');
  };

  const handleDeleteProd = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem('gb_admin_products_v3', JSON.stringify(updated));
    showToast('Product deleted.');
  };

  // 4. Blogs managers
  const handleAddBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.author) {
      showToast('Please enter title and author name', 'error');
      return;
    }
    const created: BlogPost = {
      id: `post-${Date.now()}`,
      title: newBlog.title,
      excerpt: newBlog.excerpt || '',
      image: newBlog.image || 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      author: newBlog.author,
      readTime: newBlog.readTime
    };

    const updated = [...blogs, created];
    setBlogs(updated);
    localStorage.setItem('gb_admin_blogs', JSON.stringify(updated));
    setNewBlog({ title: '', excerpt: '', image: '', author: '', readTime: '5 min read' });
    showToast('Blog article created successfully!');
  };

  const handleDeleteBlog = (id: string) => {
    const updated = blogs.filter(b => b.id !== id);
    setBlogs(updated);
    localStorage.setItem('gb_admin_blogs', JSON.stringify(updated));
    showToast('Blog article deleted.');
  };

  // 5. Update booking / order status
  const updateStatus = (itemId: string, newStatus: string, type: 'shop' | 'travel') => {
    if (type === 'shop') {
      setOrders(prev => prev.map(o => o.id === itemId ? { ...o, status: newStatus } : o));
    } else {
      setBookings(prev => prev.map(b => b.id === itemId ? { ...b, status: newStatus } : b));
    }

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('gb_history_')) {
        try {
          const list = JSON.parse(localStorage.getItem(key) || '[]');
          const idx = list.findIndex((item: any) => item.id === itemId);
          if (idx > -1) {
            list[idx].status = newStatus;
            localStorage.setItem(key, JSON.stringify(list));
            showToast(`Status updated to ${newStatus}`);
            break;
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  // Filter listings based on search box query
  const filteredDests = destinations.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredPkgs = packages.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.destination.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredProds = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredOrders = orders.filter(o => o.id.includes(searchQuery) || (o.customerEmail && o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())));
  const filteredBookings = bookings.filter(b => b.id.includes(searchQuery) || (b.customerEmail && b.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())));
  const filteredBlogs = blogs.filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.author.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* Admin header */}
      <header className="bg-primary-dark text-white px-8 py-5 flex items-center justify-between border-b border-white/10 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-yellow text-primary-dark flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-serif leading-none tracking-wide">Go Banjāra</h1>
            <p className="text-[10px] uppercase font-black tracking-widest text-brand-yellow/80 mt-1">Admin Management Portal</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-xs font-semibold text-white/80">
          <span>Active Administrator: <strong className="text-white uppercase">{user.name}</strong></span>
          <button 
            onClick={() => router.push('/shop')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 hover:bg-brand-orange text-white rounded-lg transition text-[11px] font-black uppercase tracking-wider cursor-pointer"
          >
            Exit Portal <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main workspace grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-5 min-h-[calc(100vh-80px)]">
        
        {/* Navigation Sidebar */}
        <aside className="md:col-span-1 bg-white border-r border-slate-200 p-6 space-y-2">
          <button
            onClick={() => { setActiveTab('overview'); setSearchQuery(''); }}
            className={`w-full text-left px-4.5 py-3.5 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-wider transition ${
              activeTab === 'overview' ? 'bg-primary-dark text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard className="w-4.5 h-4.5" />
            Overview Dashboard
          </button>

          <button
            onClick={() => { setActiveTab('destinations'); setSearchQuery(''); }}
            className={`w-full text-left px-4.5 py-3.5 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-wider transition ${
              activeTab === 'destinations' ? 'bg-primary-dark text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <MapIcon className="w-4.5 h-4.5" />
            Manage Destinations
          </button>

          <button
            onClick={() => { setActiveTab('packages'); setSearchQuery(''); }}
            className={`w-full text-left px-4.5 py-3.5 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-wider transition ${
              activeTab === 'packages' ? 'bg-primary-dark text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-4.5 h-4.5" />
            Manage Packages
          </button>

          <button
            onClick={() => { setActiveTab('products'); setSearchQuery(''); }}
            className={`w-full text-left px-4.5 py-3.5 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-wider transition ${
              activeTab === 'products' ? 'bg-primary-dark text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <ShoppingBag className="w-4.5 h-4.5" />
            Manage Products
          </button>

          <button
            onClick={() => { setActiveTab('blogs'); setSearchQuery(''); }}
            className={`w-full text-left px-4.5 py-3.5 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-wider transition ${
              activeTab === 'blogs' ? 'bg-primary-dark text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4.5 h-4.5" />
            Manage Blogs
          </button>

          <button
            onClick={() => { setActiveTab('pages'); setSearchQuery(''); }}
            className={`w-full text-left px-4.5 py-3.5 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-wider transition ${
              activeTab === 'pages' ? 'bg-primary-dark text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-4.5 h-4.5" />
            Edit Website Pages
          </button>

          <button
            onClick={() => { setActiveTab('orders'); setSearchQuery(''); }}
            className={`w-full text-left px-4.5 py-3.5 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-wider transition ${
              activeTab === 'orders' ? 'bg-primary-dark text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <ClipboardList className="w-4.5 h-4.5" />
            Manage Orders
          </button>

          <button
            onClick={() => { setActiveTab('bookings'); setSearchQuery(''); }}
            className={`w-full text-left px-4.5 py-3.5 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-wider transition ${
              activeTab === 'bookings' ? 'bg-primary-dark text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4.5 h-4.5" />
            Manage Bookings
          </button>

          <button
            onClick={() => { setActiveTab('customers'); setSearchQuery(''); }}
            className={`w-full text-left px-4.5 py-3.5 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-wider transition ${
              activeTab === 'customers' ? 'bg-primary-dark text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4.5 h-4.5" />
            Manage Customers
          </button>

          <button
            onClick={() => { setActiveTab('payments'); setSearchQuery(''); }}
            className={`w-full text-left px-4.5 py-3.5 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-wider transition ${
              activeTab === 'payments' ? 'bg-primary-dark text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <CreditCard className="w-4.5 h-4.5" />
            Payment Monitoring
          </button>
        </aside>

        {/* Tab Workspace Panel */}
        <main className="md:col-span-4 p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-80px)]">
          
          {/* Notifications Toast */}
          {toast && (
            <div className={`fixed bottom-6 right-6 p-4.5 rounded-2xl shadow-xl border flex items-center gap-2.5 text-xs font-bold z-50 transition-all ${
              toast.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-600'
            }`}>
              <CheckCircle2 className="w-4.5 h-4.5" />
              {toast.message}
            </div>
          )}

          {/* Search filter banner (visible in listings tabs) */}
          {activeTab !== 'overview' && activeTab !== 'payments' && (
            <div className="flex items-center gap-3 bg-white p-4 border border-slate-200 rounded-2xl shadow-sm">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder={`Filter current list...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-xs font-semibold focus:outline-none bg-transparent"
              />
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Stat Metric Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <DollarSign className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Gross Sales</span>
                    <h3 className="text-2xl font-black text-slate-800 mt-0.5">₹{calculatedMetrics.grossRevenue.toLocaleString('en-IN')}</h3>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <FileText className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Excursion Bookings</span>
                    <h3 className="text-2xl font-black text-slate-800 mt-0.5">{calculatedMetrics.totalBookings} Booking(s)</h3>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-orange/10 text-[#E05434] flex items-center justify-center">
                    <ShoppingBag className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Shop Products</span>
                    <h3 className="text-2xl font-black text-slate-800 mt-0.5">{products.length} Items</h3>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Users className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Active Customers</span>
                    <h3 className="text-2xl font-black text-slate-800 mt-0.5">{calculatedMetrics.totalCustomers} Accounts</h3>
                  </div>
                </div>
              </div>

              {/* Destinations Distribution Overview */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">Excursion Volume by Destination</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {destinations.map(dest => {
                    const count = bookings.filter(b => b.items[0]?.name.toLowerCase().includes(dest.name.toLowerCase())).length;
                    return (
                      <div key={dest.id} className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                        <div>
                          <p className="font-extrabold text-sm text-slate-800">{dest.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{dest.sub}</p>
                        </div>
                        <span className="px-3.5 py-1 bg-primary-dark text-white rounded-full text-xs font-black">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MANAGE DESTINATIONS */}
          {activeTab === 'destinations' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Form column */}
                <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-brand-orange" />
                    New Destination
                  </h3>
                  
                  <form onSubmit={handleAddDest} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Name</label>
                      <input 
                        type="text" required value={newDest.name}
                        onChange={(e) => setNewDest(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Subtitle</label>
                      <input 
                        type="text" value={newDest.sub}
                        onChange={(e) => setNewDest(prev => ({ ...prev, sub: e.target.value }))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Description</label>
                      <textarea 
                        required rows={3} value={newDest.desc}
                        onChange={(e) => setNewDest(prev => ({ ...prev, desc: e.target.value }))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none resize-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Season</label>
                      <input 
                        type="text" placeholder="e.g. Winter & Spring" value={newDest.season}
                        onChange={(e) => setNewDest(prev => ({ ...prev, season: e.target.value }))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Banner Image URL</label>
                      <input 
                        type="url" value={newDest.image}
                        onChange={(e) => setNewDest(prev => ({ ...prev, image: e.target.value }))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full py-3 bg-[#1D493E] hover:bg-brand-orange text-white rounded-xl text-xs font-black uppercase tracking-wider shadow"
                    >
                      Save Destination
                    </button>
                  </form>
                </div>

                {/* Grid column */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {filteredDests.map((dest) => (
                      <div key={dest.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between">
                        <img src={dest.image} alt={dest.name} className="h-36 w-full object-cover" />
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div>
                            <h4 className="font-extrabold text-slate-800 text-base">{dest.name}</h4>
                            <p className="text-[10px] text-brand-orange font-bold uppercase tracking-wider mt-0.5">{dest.sub}</p>
                            <p className="text-xs text-slate-500 leading-relaxed mt-2 line-clamp-3">{dest.desc}</p>
                          </div>
                          <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                            <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 py-1 px-3 rounded-full">{dest.season}</span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setEditingDest(dest)}
                                className="text-slate-400 hover:text-primary-dark p-1.5 transition cursor-pointer"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteDest(dest.id)}
                                className="text-slate-400 hover:text-rose-600 p-1.5 transition cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: MANAGE PACKAGES */}
          {activeTab === 'packages' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Form column */}
                <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-brand-orange" />
                    New Package
                  </h3>
                  
                  <form onSubmit={handleAddPkg} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Package Name</label>
                      <input 
                        type="text" required value={newPkg.name}
                        onChange={(e) => setNewPkg(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Destination</label>
                      <select 
                        value={newPkg.destination}
                        onChange={(e) => setNewPkg(prev => ({ ...prev, destination: e.target.value }))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                      >
                        <option value="Kashmir">Kashmir</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Goa">Goa</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Himachal">Himachal</option>
                        <option value="Andaman">Andaman</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Price (INR)</label>
                        <input 
                          type="number" required value={newPkg.price}
                          onChange={(e) => setNewPkg(prev => ({ ...prev, price: e.target.value }))}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Original Price</label>
                        <input 
                          type="number" value={newPkg.originalPrice}
                          onChange={(e) => setNewPkg(prev => ({ ...prev, originalPrice: e.target.value }))}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Duration</label>
                        <input 
                          type="text" placeholder="5 Days / 4 Nights" value={newPkg.duration}
                          onChange={(e) => setNewPkg(prev => ({ ...prev, duration: e.target.value }))}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Duration Days</label>
                        <input 
                          type="number" value={newPkg.durationDays}
                          onChange={(e) => setNewPkg(prev => ({ ...prev, durationDays: e.target.value }))}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Route Details</label>
                      <input 
                        type="text" placeholder="e.g. Srinagar (3N) → Gulmarg" value={newPkg.route}
                        onChange={(e) => setNewPkg(prev => ({ ...prev, route: e.target.value }))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Rating (Out of 5.0)</label>
                      <input 
                        type="text" value={newPkg.rating}
                        onChange={(e) => setNewPkg(prev => ({ ...prev, rating: e.target.value }))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Image URL</label>
                      <input 
                        type="url" value={newPkg.image}
                        onChange={(e) => setNewPkg(prev => ({ ...prev, image: e.target.value }))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Short Description</label>
                      <textarea 
                        rows={2} value={newPkg.description}
                        onChange={(e) => setNewPkg(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none resize-none"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full py-3 bg-[#1D493E] hover:bg-brand-orange text-white rounded-xl text-xs font-black uppercase tracking-wider shadow"
                    >
                      Save Package
                    </button>
                  </form>
                </div>

                {/* Table column */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                        <th className="p-4">Package</th>
                        <th className="p-4">Destination</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Rating</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPkgs.map((pkg) => (
                        <tr key={pkg.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="p-4">
                            <p className="font-bold text-slate-800">{pkg.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold">{pkg.duration}</p>
                          </td>
                          <td className="p-4 font-semibold text-slate-500">{pkg.destination}</td>
                          <td className="p-4">
                            <p className="font-bold text-slate-800">₹{pkg.price.toLocaleString('en-IN')}</p>
                            {pkg.originalPrice && <p className="text-[10px] text-rose-500 font-bold line-through">₹{pkg.originalPrice.toLocaleString('en-IN')}</p>}
                          </td>
                          <td className="p-4 font-bold text-amber-500 mt-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-amber-500" />
                              {pkg.rating}
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setEditingPkg(pkg)}
                                className="text-slate-400 hover:text-primary-dark p-1.5 transition cursor-pointer"
                                title="Edit Package"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeletePkg(pkg.id)}
                                className="text-slate-400 hover:text-rose-600 p-1.5 transition cursor-pointer"
                                title="Delete Package"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: MANAGE PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Form column */}
                <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-brand-orange" />
                    New Shop Product
                  </h3>
                  
                  <form onSubmit={handleAddProd} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Product Name</label>
                      <input 
                        type="text" required value={newProd.name}
                        onChange={(e) => setNewProd(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Category</label>
                      <select 
                        value={newProd.category}
                        onChange={(e) => setNewProd(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                      >
                        <option value="apparel">Apparel & Garments</option>
                        <option value="spices">Gourmet Spices</option>
                        <option value="tea-coffee">Artisanal Tea/Coffee</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Price (INR)</label>
                        <input 
                          type="number" required value={newProd.price}
                          onChange={(e) => setNewProd(prev => ({ ...prev, price: e.target.value }))}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Original Price</label>
                        <input 
                          type="number" value={newProd.originalPrice}
                          onChange={(e) => setNewProd(prev => ({ ...prev, originalPrice: e.target.value }))}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Rating (Out of 5.0)</label>
                      <input 
                        type="text" value={newProd.rating}
                        onChange={(e) => setNewProd(prev => ({ ...prev, rating: e.target.value }))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Image URL</label>
                      <input 
                        type="url" value={newProd.image}
                        onChange={(e) => setNewProd(prev => ({ ...prev, image: e.target.value }))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Description</label>
                      <textarea 
                        rows={2} value={newProd.description}
                        onChange={(e) => setNewProd(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none resize-none"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full py-3 bg-[#1D493E] hover:bg-brand-orange text-white rounded-xl text-xs font-black uppercase tracking-wider shadow"
                    >
                      Save Product
                    </button>
                  </form>
                </div>

                {/* Table column */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                        <th className="p-4">Product</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price</th>
                        <th className="p-4 text-center">Stock status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProds.map((prod) => (
                        <tr key={prod.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="p-4 font-bold text-slate-800">{prod.name}</td>
                          <td className="p-4 font-semibold text-slate-500 capitalize">{prod.category}</td>
                          <td className="p-4">
                            <p className="font-bold text-slate-800">₹{prod.price.toLocaleString('en-IN')}</p>
                            {prod.originalPrice && <p className="text-[10px] text-rose-500 font-bold line-through">₹{prod.originalPrice.toLocaleString('en-IN')}</p>}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => toggleStock(prod.id)}
                              className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border cursor-pointer ${
                                prod.inStock 
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                                  : 'bg-rose-50 border-rose-200 text-rose-600'
                              }`}
                            >
                              {prod.inStock ? 'In Stock' : 'Out of Stock'}
                            </button>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setEditingProd(prod)}
                                className="text-slate-400 hover:text-primary-dark p-1.5 transition cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProd(prod.id)}
                                className="text-slate-400 hover:text-rose-600 p-1.5 transition cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: MANAGE BLOGS */}
          {activeTab === 'blogs' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Form column */}
                <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-brand-orange" />
                    New Blog Post
                  </h3>
                  
                  <form onSubmit={handleAddBlog} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Title</label>
                      <input 
                        type="text" required value={newBlog.title}
                        onChange={(e) => setNewBlog(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Author</label>
                      <input 
                        type="text" required value={newBlog.author}
                        onChange={(e) => setNewBlog(prev => ({ ...prev, author: e.target.value }))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Read Time</label>
                      <input 
                        type="text" placeholder="5 min read" value={newBlog.readTime}
                        onChange={(e) => setNewBlog(prev => ({ ...prev, readTime: e.target.value }))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Image URL</label>
                      <input 
                        type="url" value={newBlog.image}
                        onChange={(e) => setNewBlog(prev => ({ ...prev, image: e.target.value }))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Excerpt</label>
                      <textarea 
                        rows={3} value={newBlog.excerpt}
                        onChange={(e) => setNewBlog(prev => ({ ...prev, excerpt: e.target.value }))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none resize-none"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full py-3 bg-[#1D493E] hover:bg-brand-orange text-white rounded-xl text-xs font-black uppercase tracking-wider shadow"
                    >
                      Save Blog Post
                    </button>
                  </form>
                </div>

                {/* Table column */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                        <th className="p-4">Title</th>
                        <th className="p-4">Author</th>
                        <th className="p-4">Date</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBlogs.map((blog) => (
                        <tr key={blog.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="p-4">
                            <p className="font-bold text-slate-800">{blog.title}</p>
                            <p className="text-[10px] text-slate-400 font-bold">{blog.readTime}</p>
                          </td>
                          <td className="p-4 font-semibold text-slate-500">{blog.author}</td>
                          <td className="p-4 font-semibold text-slate-400">{blog.date}</td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setEditingBlog(blog)}
                                className="text-slate-400 hover:text-primary-dark p-1.5 transition cursor-pointer"
                                title="Edit Blog"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteBlog(blog.id)}
                                className="text-slate-400 hover:text-rose-600 p-1.5 transition cursor-pointer"
                                title="Delete Blog"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          )}

          {/* TAB 6: MANAGE ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer Contact</th>
                      <th className="p-4">Items Summary</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Order Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400 font-semibold italic">No active shop orders found.</td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="p-4 font-bold text-slate-800">{order.id}</td>
                          <td className="p-4">
                            <p className="font-semibold text-slate-700">{order.customerEmail || 'Guest Account'}</p>
                            {order.customerPhone && <p className="text-[10px] text-slate-400 font-bold">+91 {order.customerPhone}</p>}
                          </td>
                          <td className="p-4 font-semibold text-slate-500">
                            {order.items.map((i, idx) => (
                              <span key={idx} className="block text-[11px] font-medium text-slate-600">
                                {i.name} {i.size ? `(${i.size})` : ''} x{i.quantity}
                              </span>
                            ))}
                          </td>
                          <td className="p-4 font-bold text-slate-800">₹{order.total.toLocaleString('en-IN')}</td>
                          <td className="p-4">
                            <select
                              value={order.status}
                              onChange={(e) => updateStatus(order.id, e.target.value, 'shop')}
                              className="p-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-primary-dark"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: MANAGE BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                      <th className="p-4">Booking ID</th>
                      <th className="p-4">Customer Contact</th>
                      <th className="p-4">Excursion</th>
                      <th className="p-4">Departure / Travelers</th>
                      <th className="p-4">Total Paid</th>
                      <th className="p-4">Booking Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400 font-semibold italic">No travel package bookings found.</td>
                      </tr>
                    ) : (
                      filteredBookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="p-4 font-bold text-slate-800">{booking.id}</td>
                          <td className="p-4">
                            <p className="font-semibold text-slate-700">{booking.customerEmail || 'Guest Account'}</p>
                            {booking.customerPhone && <p className="text-[10px] text-slate-400 font-bold">+91 {booking.customerPhone}</p>}
                          </td>
                          <td className="p-4 font-bold text-slate-800">
                            {booking.items[0]?.name || 'Travel Excursion Package'}
                          </td>
                          <td className="p-4 font-semibold text-slate-500">
                            <p className="text-slate-700 font-extrabold">{booking.items[0]?.date || 'Flexible Date'}</p>
                            <p className="text-[10px] text-slate-400 font-bold">{booking.items[0]?.guests || 1} Travelers</p>
                          </td>
                          <td className="p-4 font-bold text-slate-800">₹{booking.total.toLocaleString('en-IN')}</td>
                          <td className="p-4">
                            <select
                              value={booking.status}
                              onChange={(e) => updateStatus(booking.id, e.target.value, 'travel')}
                              className="p-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-primary-dark"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 8: MANAGE CUSTOMERS */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                      <th className="p-4">Customer Contact</th>
                      <th className="p-4 text-center">Purchases / Excursions</th>
                      <th className="p-4">Cumulative Spend</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((cust, idx) => (
                      <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="p-4">
                          <p className="font-bold text-slate-800">{cust.email || 'Mobile Account'}</p>
                          {cust.phone && <p className="text-[10px] text-slate-400 font-bold">+91 {cust.phone}</p>}
                        </td>
                        <td className="p-4 text-center font-bold text-slate-700">{cust.ordersCount} item(s)</td>
                        <td className="p-4 font-black text-slate-800">₹{cust.totalSpend.toLocaleString('en-IN')}</td>
                        <td className="p-4">
                          <span className="inline-block py-0.5 px-3 rounded-full font-black text-[9px] uppercase tracking-wider bg-emerald-50 border border-emerald-200 text-emerald-600">
                            Active Explorer
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 9: PAYMENT MONITORING */}
          {activeTab === 'payments' && (
            <div className="space-y-8">
              
              {/* Payment Summary Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                    <Landmark className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Gateway Status</span>
                    <h3 className="text-base font-black text-slate-800 mt-1 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                      Razorpay Live
                    </h3>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <CheckCircle2 className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Success Rate</span>
                    <h3 className="text-2xl font-black text-slate-800 mt-0.5">{calculatedMetrics.successRate}% Success</h3>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <RefreshCw className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Payments Captured</span>
                    <h3 className="text-2xl font-black text-slate-800 mt-0.5">
                      {calculatedMetrics.paymentLogs.filter(p => p.status === 'Captured').length} / {calculatedMetrics.paymentLogs.length}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Transactions Logs Table */}
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">Live Gateway Transaction Logs</h3>
                
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                        <th className="p-4">Razorpay Payment ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Method</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Timestamp</th>
                        <th className="p-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculatedMetrics.paymentLogs.map((log, idx) => (
                        <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="p-4 font-mono font-black text-slate-700">{log.id}</td>
                          <td className="p-4 font-semibold text-slate-500 truncate max-w-xs">{log.email}</td>
                          <td className="p-4 font-semibold text-slate-400">{log.method}</td>
                          <td className="p-4 font-bold text-slate-800">₹{log.amount.toLocaleString('en-IN')}</td>
                          <td className="p-4 font-semibold text-slate-400">{log.date}</td>
                          <td className="p-4 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full font-black text-[9px] uppercase tracking-wider border ${
                              log.status === 'Captured' 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                                : 'bg-rose-50 border-rose-200 text-rose-600'
                            }`}>
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 10: EDIT WEBSITE PAGES */}
          {activeTab === 'pages' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
              
              {/* Left Columns: Forms */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-base font-black text-slate-800">Dynamic Page Content CMS</h3>
                    <p className="text-xs text-slate-400 font-semibold mt-1">Change any copy or headings across the entire website instantly.</p>
                  </div>
                  
                  <form onSubmit={handleSaveCMS} className="space-y-6">
                    {/* Section: Hero */}
                    <div className="space-y-4 border-b border-slate-100 pb-6">
                      <h4 className="text-xs font-black text-[#FF5A36] uppercase tracking-wider">1. Hero Section Copy</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Title Line 1</label>
                          <input 
                            type="text" 
                            value={cmsContent.heroTitleLine1} 
                            onChange={(e) => setCmsContent(prev => ({ ...prev, heroTitleLine1: e.target.value }))}
                            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Title Line 2</label>
                          <input 
                            type="text" 
                            value={cmsContent.heroTitleLine2} 
                            onChange={(e) => setCmsContent(prev => ({ ...prev, heroTitleLine2: e.target.value }))}
                            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Title Line 3</label>
                          <input 
                            type="text" 
                            value={cmsContent.heroTitleLine3} 
                            onChange={(e) => setCmsContent(prev => ({ ...prev, heroTitleLine3: e.target.value }))}
                            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Hero Subtitle</label>
                        <textarea 
                          rows={2} 
                          value={cmsContent.heroSubtitle} 
                          onChange={(e) => setCmsContent(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Shop Button Text</label>
                          <input 
                            type="text" 
                            value={cmsContent.heroShopBtn} 
                            onChange={(e) => setCmsContent(prev => ({ ...prev, heroShopBtn: e.target.value }))}
                            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Travel Button Text</label>
                          <input 
                            type="text" 
                            value={cmsContent.heroTravelBtn} 
                            onChange={(e) => setCmsContent(prev => ({ ...prev, heroTravelBtn: e.target.value }))}
                            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section: Mascot */}
                    <div className="space-y-4 border-b border-slate-100 pb-6">
                      <h4 className="text-xs font-black text-[#FF5A36] uppercase tracking-wider">2. Bonjo Mascot Speak</h4>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Mascot Speak Bubble Text</label>
                        <textarea 
                          rows={2} 
                          value={cmsContent.mascotText} 
                          onChange={(e) => setCmsContent(prev => ({ ...prev, mascotText: e.target.value }))}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none resize-none"
                        />
                      </div>
                    </div>

                    {/* Section: Deals & Selling */}
                    <div className="space-y-4 border-b border-slate-100 pb-6">
                      <h4 className="text-xs font-black text-[#FF5A36] uppercase tracking-wider">3. Shop Page & Deals Titles</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Deals Section Title</label>
                          <input 
                            type="text" 
                            value={cmsContent.dealsTitle} 
                            onChange={(e) => setCmsContent(prev => ({ ...prev, dealsTitle: e.target.value }))}
                            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Selling Section Title</label>
                          <input 
                            type="text" 
                            value={cmsContent.sellingTitle} 
                            onChange={(e) => setCmsContent(prev => ({ ...prev, sellingTitle: e.target.value }))}
                            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Deals Description Subtitle</label>
                        <input 
                          type="text" 
                          value={cmsContent.dealsSub} 
                          onChange={(e) => setCmsContent(prev => ({ ...prev, dealsSub: e.target.value }))}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Selling Description Subtitle</label>
                        <input 
                          type="text" 
                          value={cmsContent.sellingSub} 
                          onChange={(e) => setCmsContent(prev => ({ ...prev, sellingSub: e.target.value }))}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Section: Values & Others */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-[#FF5A36] uppercase tracking-wider">4. Core Brand Values Copy</h4>
                      
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Values Section Title</label>
                        <input 
                          type="text" 
                          value={cmsContent.valuesTitle} 
                          onChange={(e) => setCmsContent(prev => ({ ...prev, valuesTitle: e.target.value }))}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Values Description Subtitle</label>
                        <textarea 
                          rows={2} 
                          value={cmsContent.valuesSub} 
                          onChange={(e) => setCmsContent(prev => ({ ...prev, valuesSub: e.target.value }))}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none resize-none"
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="w-full py-4 bg-[#1D493E] hover:bg-brand-orange text-white rounded-2xl text-xs font-black uppercase tracking-wider transition shadow-md cursor-pointer"
                    >
                      Save Website Content Copy
                    </button>
                  </form>
                </div>
              </div>
              
              {/* Right Column: Design Guidelines */}
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm space-y-6 sticky top-8">
                  <div className="flex items-center gap-2 text-rose-500">
                    <ShieldCheck className="w-5.5 h-5.5 text-[#FF5A36]" />
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Layout Safety Rules</h3>
                  </div>
                  
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                    Follow these guidelines when adding products or packages to maintain visual symmetry and prevent UI overlap:
                  </p>
                  
                  <ul className="space-y-4">
                    <li className="flex gap-3 items-start">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] flex items-center justify-center font-black shrink-0">1</span>
                      <div>
                        <strong className="text-xs font-bold text-slate-700 block">Product Text Limits</strong>
                        <p className="text-[11px] text-slate-400 font-semibold mt-0.5 leading-normal">
                          Keep Product Names &lt; 25 characters and descriptions &lt; 120 characters to keep cards aligned.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] flex items-center justify-center font-black shrink-0">2</span>
                      <div>
                        <strong className="text-xs font-bold text-slate-700 block">Image Ratios</strong>
                        <p className="text-[11px] text-slate-400 font-semibold mt-0.5 leading-normal">
                          Use exact square images (1:1) for product thumbnails and 4:3 landscape ratio for travel packages.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] flex items-center justify-center font-black shrink-0">3</span>
                      <div>
                        <strong className="text-xs font-bold text-slate-700 block">Pricing Input</strong>
                        <p className="text-[11px] text-slate-400 font-semibold mt-0.5 leading-normal">
                          Input prices as pure numbers (e.g. 199, not ₹199). The interface automatically adds formatting.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] flex items-center justify-center font-black shrink-0">4</span>
                      <div>
                        <strong className="text-xs font-bold text-slate-700 block">Dynamic Package Pages</strong>
                        <p className="text-[11px] text-slate-400 font-semibold mt-0.5 leading-normal">
                          Any travel package you add gets its own URL instantly at <code className="text-[#FF5A36] text-[10px]">/travel/package/[id]</code> with the exact same template.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          )}

         </main>
      </div>

      {/* Destination Edit Modal */}
      {editingDest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditingDest(null)} />
          <div className="relative w-full max-w-md bg-white border border-slate-100 rounded-[32px] shadow-2xl p-8 z-10 animate-[fadeIn_0.2s_ease-out]">
            <h3 className="text-lg font-black font-serif text-primary-dark mb-4">Edit Destination</h3>
            
            <form onSubmit={handleSaveDestEdit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Name</label>
                <input 
                  type="text" required value={editingDest.name}
                  onChange={(e) => setEditingDest(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Subtitle</label>
                <input 
                  type="text" required value={editingDest.sub}
                  onChange={(e) => setEditingDest(prev => prev ? ({ ...prev, sub: e.target.value }) : null)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Season</label>
                <input 
                  type="text" required value={editingDest.season}
                  onChange={(e) => setEditingDest(prev => prev ? ({ ...prev, season: e.target.value }) : null)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Banner Image URL</label>
                <input 
                  type="url" required value={editingDest.image}
                  onChange={(e) => setEditingDest(prev => prev ? ({ ...prev, image: e.target.value }) : null)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Description</label>
                <textarea 
                  rows={3} required value={editingDest.desc}
                  onChange={(e) => setEditingDest(prev => prev ? ({ ...prev, desc: e.target.value }) : null)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none resize-none"
                />
              </div>
              <div className="flex gap-3 pt-3">
                <button 
                  type="button" onClick={() => setEditingDest(null)}
                  className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-black uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-[#1D493E] hover:bg-brand-orange text-white rounded-xl text-xs font-black uppercase tracking-wider shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Package Edit Modal */}
      {editingPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditingPkg(null)} />
          <div className="relative w-full max-w-md bg-white border border-slate-100 rounded-[32px] shadow-2xl p-8 z-10 max-h-[90vh] overflow-y-auto animate-[fadeIn_0.2s_ease-out]">
            <h3 className="text-lg font-black font-serif text-primary-dark mb-4">Edit Travel Package</h3>
            
            <form onSubmit={handleSavePkgEdit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Package Name</label>
                <input 
                  type="text" 
                  required
                  value={editingPkg.name}
                  onChange={(e) => setEditingPkg(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Destination</label>
                <select 
                  value={editingPkg.destination}
                  onChange={(e) => setEditingPkg(prev => prev ? ({ ...prev, destination: e.target.value as any }) : null)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                >
                  <option value="Kashmir">Kashmir</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Goa">Goa</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Himachal">Himachal</option>
                  <option value="Andaman">Andaman</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Price (INR)</label>
                  <input 
                    type="number" 
                    required
                    value={editingPkg.price}
                    onChange={(e) => setEditingPkg(prev => prev ? ({ ...prev, price: Number(e.target.value) }) : null)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Original Price</label>
                  <input 
                    type="number" 
                    required
                    value={editingPkg.originalPrice}
                    onChange={(e) => setEditingPkg(prev => prev ? ({ ...prev, originalPrice: Number(e.target.value) }) : null)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Duration</label>
                  <input 
                    type="text" 
                    required
                    value={editingPkg.duration}
                    onChange={(e) => setEditingPkg(prev => prev ? ({ ...prev, duration: e.target.value }) : null)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Duration Days</label>
                  <input 
                    type="number" 
                    required
                    value={editingPkg.durationDays}
                    onChange={(e) => setEditingPkg(prev => prev ? ({ ...prev, durationDays: Number(e.target.value) }) : null)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Rating (Out of 5.0)</label>
                <input 
                  type="number" 
                  step="0.1"
                  required
                  value={editingPkg.rating}
                  onChange={(e) => setEditingPkg(prev => prev ? ({ ...prev, rating: Number(e.target.value) }) : null)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Route Details</label>
                <input 
                  type="text" 
                  required
                  value={editingPkg.route}
                  onChange={(e) => setEditingPkg(prev => prev ? ({ ...prev, route: e.target.value, routeList: e.target.value.split('→').map(s => s.trim()) }) : null)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Image URL</label>
                <input 
                  type="url" 
                  required
                  value={editingPkg.image}
                  onChange={(e) => setEditingPkg(prev => prev ? ({ ...prev, image: e.target.value }) : null)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Description</label>
                <textarea 
                  rows={3} 
                  required
                  value={editingPkg.description}
                  onChange={(e) => setEditingPkg(prev => prev ? ({ ...prev, description: e.target.value }) : null)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none resize-none"
                />
              </div>
              
              <div className="flex gap-3 pt-3">
                <button 
                  type="button" 
                  onClick={() => setEditingPkg(null)}
                  className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-black uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-[#1D493E] hover:bg-brand-orange text-white rounded-xl text-xs font-black uppercase tracking-wider shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Edit Modal */}
      {editingProd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditingProd(null)} />
          <div className="relative w-full max-w-md bg-white border border-slate-100 rounded-[32px] shadow-2xl p-8 z-10 max-h-[90vh] overflow-y-auto animate-[fadeIn_0.2s_ease-out]">
            <h3 className="text-lg font-black font-serif text-primary-dark mb-4">Edit Shop Product</h3>
            
            <form onSubmit={handleSaveProdEdit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Product Name</label>
                <input 
                  type="text" 
                  required
                  value={editingProd.name}
                  onChange={(e) => setEditingProd(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Category</label>
                <select 
                  value={editingProd.category}
                  onChange={(e) => setEditingProd(prev => prev ? ({ ...prev, category: e.target.value }) : null)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                >
                  <option value="apparel">Apparel & Garments</option>
                  <option value="spices">Gourmet Spices</option>
                  <option value="tea-coffee">Artisanal Tea/Coffee</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Price (INR)</label>
                  <input 
                    type="number" 
                    required
                    value={editingProd.price}
                    onChange={(e) => setEditingProd(prev => prev ? ({ ...prev, price: Number(e.target.value) }) : null)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Original Price</label>
                  <input 
                    type="number" 
                    required
                    value={editingProd.originalPrice || ''}
                    onChange={(e) => setEditingProd(prev => prev ? ({ ...prev, originalPrice: Number(e.target.value) }) : null)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Rating</label>
                <input 
                  type="number" 
                  step="0.1"
                  required
                  value={editingProd.rating}
                  onChange={(e) => setEditingProd(prev => prev ? ({ ...prev, rating: Number(e.target.value) }) : null)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Image URL</label>
                <input 
                  type="url" 
                  required
                  value={editingProd.image}
                  onChange={(e) => setEditingProd(prev => prev ? ({ ...prev, image: e.target.value }) : null)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Inventory Status</label>
                <select 
                  value={editingProd.inStock ? 'true' : 'false'}
                  onChange={(e) => setEditingProd(prev => prev ? ({ ...prev, inStock: e.target.value === 'true' }) : null)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                >
                  <option value="true">In Stock</option>
                  <option value="false">Out of Stock</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Description</label>
                <textarea 
                  rows={3} 
                  required
                  value={editingProd.description}
                  onChange={(e) => setEditingProd(prev => prev ? ({ ...prev, description: e.target.value }) : null)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none resize-none"
                />
              </div>
              
              <div className="flex gap-3 pt-3">
                <button 
                  type="button" 
                  onClick={() => setEditingProd(null)}
                  className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-black uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-[#1D493E] hover:bg-brand-orange text-white rounded-xl text-xs font-black uppercase tracking-wider shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Blog Edit Modal */}
      {editingBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditingBlog(null)} />
          <div className="relative w-full max-w-md bg-white border border-slate-100 rounded-[32px] shadow-2xl p-8 z-10 max-h-[90vh] overflow-y-auto animate-[fadeIn_0.2s_ease-out]">
            <h3 className="text-lg font-black font-serif text-primary-dark mb-4">Edit Blog Article</h3>
            
            <form onSubmit={handleSaveBlogEdit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Title</label>
                <input 
                  type="text" 
                  required
                  value={editingBlog.title}
                  onChange={(e) => setEditingBlog(prev => prev ? ({ ...prev, title: e.target.value }) : null)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Author</label>
                <input 
                  type="text" 
                  required
                  value={editingBlog.author}
                  onChange={(e) => setEditingBlog(prev => prev ? ({ ...prev, author: e.target.value }) : null)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Read Time</label>
                <input 
                  type="text" 
                  required
                  value={editingBlog.readTime}
                  onChange={(e) => setEditingBlog(prev => prev ? ({ ...prev, readTime: e.target.value }) : null)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Image URL</label>
                <input 
                  type="url" 
                  required
                  value={editingBlog.image}
                  onChange={(e) => setEditingBlog(prev => prev ? ({ ...prev, image: e.target.value }) : null)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-mono font-black text-slate-400 uppercase">Excerpt</label>
                <textarea 
                  rows={4} 
                  required
                  value={editingBlog.excerpt}
                  onChange={(e) => setEditingBlog(prev => prev ? ({ ...prev, excerpt: e.target.value }) : null)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none resize-none"
                />
              </div>
              
              <div className="flex gap-3 pt-3">
                <button 
                  type="button" 
                  onClick={() => setEditingBlog(null)}
                  className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-black uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-[#1D493E] hover:bg-brand-orange text-white rounded-xl text-xs font-black uppercase tracking-wider shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
