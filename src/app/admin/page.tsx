'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Map as MapIcon, ShoppingBag, ClipboardList, Users,
  ShieldCheck, DollarSign, Plus, Trash2, Edit3, CheckCircle2,
  AlertCircle, FileText, Search, CreditCard, ArrowRight, Ban,
  Eye, Calendar, Check, Landmark, RefreshCw, BookOpen, Star,
  Globe, Link as LinkIcon, Settings, ExternalLink, Sparkles, Layers,
  CheckSquare, Sliders, Server, Save, Download, Upload, Cpu, Zap, Image as ImageIcon
} from 'lucide-react';
import { useCart } from '@/components/providers';
import { DESTINATIONS as INITIAL_DESTINATIONS, Destination } from '@/data/destinations';
import { PRODUCTS as INITIAL_PRODUCTS } from '@/data/products';
import { HOLIDAY_PACKAGES as INITIAL_HOLIDAY_PACKAGES, HolidayPackage } from '@/data/packages';
import { Product } from '@/types';
import {
  getStoredCMSContent, saveStoredCMSContent, SiteCMSContent, DEFAULT_CMS_CONTENT,
  getStoredCustomPages, saveStoredCustomPages, CustomPage, DEFAULT_CUSTOM_PAGES,
  getStoredPackageProductLinks, saveStoredPackageProductLinks, PackageProductLink, DEFAULT_PACKAGE_PRODUCT_LINKS
} from '@/lib/cms';

type AdminTab =
  | 'overview'
  | 'cms_sections'
  | 'custom_pages'
  | 'package_products'
  | 'packages'
  | 'products'
  | 'blogs'
  | 'destinations'
  | 'orders'
  | 'bookings'
  | 'customers'
  | 'payments'
  | 'global_settings';

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
    excerpt: 'Deep inside the Western Ghats, local farmers harvest green cardamom by hand.',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=500&q=80',
    date: 'June 24, 2026',
    author: 'Aarav Nair',
    readTime: '5 min read',
  },
  {
    id: 'post-houseboat',
    title: 'Anatomy of a Kettuvallam: The Art of Wooden Boatbuilding',
    excerpt: 'No nails, only coir rope, bamboo poles, and cashew husk oil.',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=500&q=80',
    date: 'June 18, 2026',
    author: 'Meera Kutty',
    readTime: '6 min read',
  },
  {
    id: 'post-khadi',
    title: 'Spinning Stories: Why Indigo Khadi Remains Eternally Modern',
    excerpt: 'Indigo is more than a color; it is a live organic entity.',
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

  // Core Persistent State
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [packages, setPackages] = useState<HolidayPackage[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [bookings, setBookings] = useState<OrderHistoryItem[]>([]);
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  // cPanel CMS & Custom Pages State
  const [cms, setCms] = useState<SiteCMSContent>(DEFAULT_CMS_CONTENT);
  const [cmsPageFilter, setCmsPageFilter] = useState<'home' | 'about' | 'shop' | 'travel' | 'blog' | 'contact' | 'global'>('home');
  const [customPages, setCustomPages] = useState<CustomPage[]>([]);
  const [editingCustomPage, setEditingCustomPage] = useState<CustomPage | null>(null);
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);

  // Package-Product Linker State
  const [packageProductLinks, setPackageProductLinks] = useState<PackageProductLink[]>([]);
  const [selectedPackageForLink, setSelectedPackageForLink] = useState<string>('');
  const [newLinkProductId, setNewLinkProductId] = useState<string>('');
  const [newLinkPerkType, setNewLinkPerkType] = useState<'included' | 'addon'>('included');
  const [newLinkNote, setNewLinkNote] = useState<string>('');

  // Editing States
  const [editingPkg, setEditingPkg] = useState<HolidayPackage | null>(null);
  const [editingProd, setEditingProd] = useState<Product | null>(null);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [editingDest, setEditingDest] = useState<Destination | null>(null);

  // Search & Toast state
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Auth Protection & Login Form States
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const { login } = useCart();

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      id: 'admin-1',
      name: 'Go Banjara Super Admin',
      email: adminEmail || 'gobanjara.trd@gmail.com',
      role: 'ADMIN',
    });
    showToast('Welcome to cPanel Control Center!');
  };

  const handleQuickAdminLogin = () => {
    login({
      id: 'admin-1',
      name: 'Go Banjara Super Admin',
      email: 'gobanjara.trd@gmail.com',
      role: 'ADMIN',
    });
    showToast('⚡ Logged in as gobanjara.trd@gmail.com!');
  };

  // Load All Persisted Data on Mount
  useEffect(() => {
    // 1. Load CMS Content
    setCms(getStoredCMSContent());

    // 2. Load Custom Pages
    setCustomPages(getStoredCustomPages());

    // 3. Load Package Product Links
    const loadedLinks = getStoredPackageProductLinks();
    setPackageProductLinks(loadedLinks);

    // 4. Load Destinations
    const savedDest = localStorage.getItem('gb_admin_destinations');
    if (savedDest) {
      try { setDestinations(JSON.parse(savedDest)); } catch (e) { setDestinations(INITIAL_DESTINATIONS); }
    } else {
      setDestinations(INITIAL_DESTINATIONS);
    }

    // 5. Load Packages
    const savedPkg = localStorage.getItem('gb_admin_packages');
    if (savedPkg) {
      try {
        const parsed = JSON.parse(savedPkg);
        setPackages(parsed);
        if (parsed.length > 0) setSelectedPackageForLink(parsed[0].id);
      } catch (e) {
        setPackages(INITIAL_HOLIDAY_PACKAGES);
        if (INITIAL_HOLIDAY_PACKAGES.length > 0) setSelectedPackageForLink(INITIAL_HOLIDAY_PACKAGES[0].id);
      }
    } else {
      setPackages(INITIAL_HOLIDAY_PACKAGES);
      if (INITIAL_HOLIDAY_PACKAGES.length > 0) setSelectedPackageForLink(INITIAL_HOLIDAY_PACKAGES[0].id);
    }

    // 6. Load Products
    const savedProd = localStorage.getItem('gb_admin_products');
    if (savedProd) {
      try { setProducts(JSON.parse(savedProd)); } catch (e) { setProducts(INITIAL_PRODUCTS); }
    } else {
      setProducts(INITIAL_PRODUCTS);
    }

    // 7. Load Blogs
    const savedBlogs = localStorage.getItem('gb_admin_blogs');
    if (savedBlogs) {
      try { setBlogs(JSON.parse(savedBlogs)); } catch (e) { setBlogs(DEFAULT_BLOGS); }
    } else {
      setBlogs(DEFAULT_BLOGS);
    }

    // 8. Load Orders & Bookings from localStorage history
    const allHistoryRaw = localStorage.getItem('gb_order_history');
    if (allHistoryRaw) {
      try {
        const history: OrderHistoryItem[] = JSON.parse(allHistoryRaw);
        setOrders(history.filter(item => item.type === 'shop' || item.type === undefined));
        setBookings(history.filter(item => item.type === 'travel'));

        // Customer calculation
        const custMap: { [email: string]: CustomerItem } = {};
        history.forEach(h => {
          const key = h.customerEmail || 'Guest Traveler';
          if (!custMap[key]) {
            custMap[key] = { email: key, phone: h.customerPhone, ordersCount: 0, totalSpend: 0 };
          }
          custMap[key].ordersCount += 1;
          custMap[key].totalSpend += h.total || 0;
        });
        setCustomers(Object.values(custMap));
      } catch (e) {
        console.error('Error loading orders history', e);
      }
    }
  }, []);

  // Save Handlers
  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredCMSContent(cms);
    showToast('⚡ Website Page & Section Content updated live across the entire website!');
  };

  const handleSaveGlobalSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredCMSContent(cms);
    showToast('⚙️ Global Website Settings & Branding saved successfully!');
  };

  const handleSaveCustomPage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomPage?.title || !editingCustomPage?.slug) {
      showToast('Page title and slug are required!', 'error');
      return;
    }

    const cleanSlug = editingCustomPage.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    const now = new Date().toISOString();

    let updatedPages: CustomPage[];
    const existingIndex = customPages.findIndex(p => p.id === editingCustomPage.id);

    if (existingIndex >= 0) {
      updatedPages = [...customPages];
      updatedPages[existingIndex] = { ...editingCustomPage, slug: cleanSlug, updatedAt: now };
    } else {
      const newPage: CustomPage = {
        ...editingCustomPage,
        id: `page-${Date.now()}`,
        slug: cleanSlug,
        createdAt: now,
        updatedAt: now,
      };
      updatedPages = [...customPages, newPage];
    }

    setCustomPages(updatedPages);
    saveStoredCustomPages(updatedPages);
    setIsPageModalOpen(false);
    setEditingCustomPage(null);
    showToast(`📄 Custom page "${editingCustomPage.title}" saved!`);
  };

  const handleDeleteCustomPage = (id: string) => {
    if (!confirm('Are you sure you want to delete this custom page?')) return;
    const updated = customPages.filter(p => p.id !== id);
    setCustomPages(updated);
    saveStoredCustomPages(updated);
    showToast('Custom page deleted!');
  };

  const handleAddPackageProductLink = () => {
    if (!selectedPackageForLink || !newLinkProductId) {
      showToast('Select both a package and a product!', 'error');
      return;
    }

    const exists = packageProductLinks.some(
      l => l.packageId === selectedPackageForLink && l.productId === newLinkProductId
    );

    if (exists) {
      showToast('This product is already linked to the selected package!', 'error');
      return;
    }

    const newLink: PackageProductLink = {
      packageId: selectedPackageForLink,
      productId: newLinkProductId,
      perkType: newLinkPerkType,
      note: newLinkNote || (newLinkPerkType === 'included' ? 'Complimentary Perk' : 'Recommended Gear'),
    };

    const updated = [...packageProductLinks, newLink];
    setPackageProductLinks(updated);
    saveStoredPackageProductLinks(updated);
    setNewLinkProductId('');
    setNewLinkNote('');
    showToast('📦 Product linked to package successfully!');
  };

  const handleRemovePackageProductLink = (packageId: string, productId: string) => {
    const updated = packageProductLinks.filter(
      l => !(l.packageId === packageId && l.productId === productId)
    );
    setPackageProductLinks(updated);
    saveStoredPackageProductLinks(updated);
    showToast('Product unlinked from package!');
  };

  // Backup & Restore JSON Config
  const handleExportBackup = () => {
    const backupData = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      cms,
      customPages,
      packageProductLinks,
      destinations,
      packages,
      products,
      blogs,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gobanjara-cpanel-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('📥 cPanel Backup JSON downloaded!');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.cms) { setCms(parsed.cms); saveStoredCMSContent(parsed.cms); }
        if (parsed.customPages) { setCustomPages(parsed.customPages); saveStoredCustomPages(parsed.customPages); }
        if (parsed.packageProductLinks) { setPackageProductLinks(parsed.packageProductLinks); saveStoredPackageProductLinks(parsed.packageProductLinks); }
        if (parsed.destinations) { setDestinations(parsed.destinations); localStorage.setItem('gb_admin_destinations', JSON.stringify(parsed.destinations)); }
        if (parsed.packages) { setPackages(parsed.packages); localStorage.setItem('gb_admin_packages', JSON.stringify(parsed.packages)); }
        if (parsed.products) { setProducts(parsed.products); localStorage.setItem('gb_admin_products', JSON.stringify(parsed.products)); }
        showToast('📤 cPanel Backup restored successfully!');
      } catch (err) {
        showToast('Invalid backup JSON file!', 'error');
      }
    };
    reader.readAsText(file);
  };

  // Metrics Calculations
  const metrics = useMemo(() => {
    const shopRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const travelRevenue = bookings.reduce((sum, b) => sum + (b.total || 0), 0);
    const totalRevenue = shopRevenue + travelRevenue;
    return {
      totalRevenue,
      shopRevenue,
      travelRevenue,
      ordersCount: orders.length,
      bookingsCount: bookings.length,
      packagesCount: packages.length,
      productsCount: products.length,
      customPagesCount: customPages.length,
      customersCount: customers.length,
    };
  }, [orders, bookings, packages, products, customPages, customers]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0E1A17] text-slate-100 font-sans flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#11231E] border border-emerald-900/50 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
          
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#FF5A36] to-amber-500 flex items-center justify-center font-black text-white text-3xl mx-auto shadow-xl">
            GB
          </div>

          <div className="space-y-1">
            <h1 className="text-xl font-black text-white tracking-tight">cPanel Control Center</h1>
            <p className="text-xs text-emerald-300/70 font-medium">Authentication required to access site CMS & admin tools.</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Admin Email</label>
              <input
                type="email"
                required
                placeholder="gobanjara.trd@gmail.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#e04a29] text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-lg cursor-pointer"
            >
              Sign In to cPanel
            </button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-emerald-900/40"></div>
            <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-500 uppercase">OR QUICK DEMO</span>
            <div className="flex-grow border-t border-emerald-900/40"></div>
          </div>

          <button
            type="button"
            onClick={handleQuickAdminLogin}
            className="w-full py-3.5 bg-emerald-900/40 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/50 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-md"
          >
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>⚡ Instant One-Click Admin Access</span>
          </button>

          <div className="pt-2">
            <Link href="/" className="text-xs font-semibold text-slate-400 hover:text-white transition">
              ← Return to Go Banjara Website
            </Link>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E1A17] text-slate-100 font-sans flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-black uppercase tracking-wider animate-bounce ${
          toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* cPanel Top Control Bar & Header */}
      <header className="bg-[#142621] border-b border-emerald-900/40 px-6 py-4 sticky top-0 z-40 shadow-lg">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Brand & cPanel Title */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-amber-500 flex items-center justify-center font-black text-white text-xl shadow-md">
              GB
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-white tracking-tight">cPanel Control Center</h1>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase">
                  v2.0 Pro CMS
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/60 font-medium">
                Live Site Content Management System & Infrastructure Engine
              </p>
            </div>
          </div>

          {/* cPanel Server Metrics Bar */}
          <div className="hidden lg:flex items-center gap-6 bg-[#0B1513] border border-emerald-900/30 px-4 py-2 rounded-2xl text-[11px]">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-400 font-medium">Engine Status:</span>
              <span className="text-emerald-400 font-bold">Active (0.02s)</span>
            </div>
            <div className="h-4 w-px bg-emerald-900/40" />
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400 font-medium">Pages Managed:</span>
              <span className="text-amber-400 font-bold">{6 + customPages.length} Pages</span>
            </div>
            <div className="h-4 w-px bg-emerald-900/40" />
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-sky-400" />
              <span className="text-slate-400 font-medium">Live Sync:</span>
              <span className="text-sky-400 font-bold">Enabled</span>
            </div>
          </div>

          {/* Quick Actions & Live Preview Link */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-900/40 hover:bg-emerald-900/80 text-emerald-200 rounded-xl text-xs font-bold transition border border-emerald-700/50"
            >
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Preview Live Site</span>
              <ExternalLink className="w-3 h-3 text-emerald-400" />
            </Link>

            <button
              onClick={handleExportBackup}
              title="Download cPanel Backup JSON"
              className="p-2 bg-[#0B1513] hover:bg-emerald-950 text-slate-300 rounded-xl transition border border-emerald-900/40 cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
            </button>

            <label
              title="Restore cPanel Backup JSON"
              className="p-2 bg-[#0B1513] hover:bg-emerald-950 text-slate-300 rounded-xl transition border border-emerald-900/40 cursor-pointer"
            >
              <Upload className="w-4 h-4 text-amber-400" />
              <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
            </label>

            <button
              onClick={handleSaveCMS}
              className="flex items-center gap-2 px-4 py-2 bg-[#FF5A36] hover:bg-[#e04a29] text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-lg cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save All</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main cPanel Layout */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto flex flex-col md:flex-row">
        
        {/* cPanel Sidebar Navigation */}
        <aside className="w-full md:w-72 bg-[#101F1B] border-r border-emerald-900/40 p-4 space-y-6 shrink-0">
          
          {/* Quick Search Tool */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search cPanel tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Navigation Groups */}
          <nav className="space-y-1 text-xs">
            
            <div className="text-[10px] font-black uppercase tracking-wider text-emerald-400/60 px-3 py-1">
              Core Engine & Overview
            </div>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                activeTab === 'overview' ? 'bg-[#FF5A36] text-white shadow-md' : 'text-slate-300 hover:bg-emerald-900/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4" />
                <span>cPanel Dashboard</span>
              </div>
              <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full font-mono">Main</span>
            </button>

            <div className="pt-3 text-[10px] font-black uppercase tracking-wider text-emerald-400/60 px-3 py-1">
              Website CMS & Page Builder
            </div>

            <button
              onClick={() => setActiveTab('cms_sections')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                activeTab === 'cms_sections' ? 'bg-[#FF5A36] text-white shadow-md' : 'text-slate-300 hover:bg-emerald-900/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>Edit Page & Sections</span>
              </div>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full font-bold">CMS</span>
            </button>

            <button
              onClick={() => setActiveTab('custom_pages')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                activeTab === 'custom_pages' ? 'bg-[#FF5A36] text-white shadow-md' : 'text-slate-300 hover:bg-emerald-900/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Add & Manage Pages</span>
              </div>
              <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                {customPages.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('package_products')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                activeTab === 'package_products' ? 'bg-[#FF5A36] text-white shadow-md' : 'text-slate-300 hover:bg-emerald-900/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <LinkIcon className="w-4 h-4 text-sky-400" />
                <span>Package-Product Linker</span>
              </div>
              <span className="text-[10px] bg-sky-950 text-sky-300 px-2 py-0.5 rounded-full font-bold">
                {packageProductLinks.length}
              </span>
            </button>

            <div className="pt-3 text-[10px] font-black uppercase tracking-wider text-emerald-400/60 px-3 py-1">
              Store & Travel Catalog
            </div>

            <button
              onClick={() => setActiveTab('packages')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                activeTab === 'packages' ? 'bg-[#FF5A36] text-white shadow-md' : 'text-slate-300 hover:bg-emerald-900/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <MapIcon className="w-4 h-4" />
                <span>Travel Packages</span>
              </div>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                {packages.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                activeTab === 'products' ? 'bg-[#FF5A36] text-white shadow-md' : 'text-slate-300 hover:bg-emerald-900/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>Shop Products</span>
              </div>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('blogs')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                activeTab === 'blogs' ? 'bg-[#FF5A36] text-white shadow-md' : 'text-slate-300 hover:bg-emerald-900/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4" />
                <span>Blog Articles</span>
              </div>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                {blogs.length}
              </span>
            </button>

            <div className="pt-3 text-[10px] font-black uppercase tracking-wider text-emerald-400/60 px-3 py-1">
              Fulfillment & Accounts
            </div>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                activeTab === 'orders' ? 'bg-[#FF5A36] text-white shadow-md' : 'text-slate-300 hover:bg-emerald-900/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <ClipboardList className="w-4 h-4" />
                <span>Shop Orders</span>
              </div>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                activeTab === 'bookings' ? 'bg-[#FF5A36] text-white shadow-md' : 'text-slate-300 hover:bg-emerald-900/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4" />
                <span>Trip Bookings</span>
              </div>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                {bookings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                activeTab === 'customers' ? 'bg-[#FF5A36] text-white shadow-md' : 'text-slate-300 hover:bg-emerald-900/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Customers & Users</span>
              </div>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                {customers.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                activeTab === 'payments' ? 'bg-[#FF5A36] text-white shadow-md' : 'text-slate-300 hover:bg-emerald-900/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4" />
                <span>Payments & Gateway</span>
              </div>
            </button>

            <div className="pt-3 text-[10px] font-black uppercase tracking-wider text-emerald-400/60 px-3 py-1">
              Site Configuration
            </div>

            <button
              onClick={() => setActiveTab('global_settings')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                activeTab === 'global_settings' ? 'bg-[#FF5A36] text-white shadow-md' : 'text-slate-300 hover:bg-emerald-900/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-emerald-400" />
                <span>Global Site Settings</span>
              </div>
            </button>
          </nav>
        </aside>

        {/* cPanel Main Content Area */}
        <main className="flex-1 p-6 lg:p-8 bg-[#0A1412] overflow-y-auto">
          
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#12241F] border border-emerald-900/40 p-6 rounded-3xl space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                    <span>Total Revenue</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-white">₹{metrics.totalRevenue.toLocaleString()}</div>
                  <p className="text-[11px] text-emerald-400 font-semibold">Shop & Travel Combined</p>
                </div>

                <div className="bg-[#12241F] border border-emerald-900/40 p-6 rounded-3xl space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                    <span>Travel Packages</span>
                    <MapIcon className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-white">{metrics.packagesCount} Active</div>
                  <p className="text-[11px] text-amber-400 font-semibold">{metrics.bookingsCount} Total Bookings</p>
                </div>

                <div className="bg-[#12241F] border border-emerald-900/40 p-6 rounded-3xl space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                    <span>Shop Products</span>
                    <ShoppingBag className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-2xl font-black text-white">{metrics.productsCount} Items</div>
                  <p className="text-[11px] text-sky-400 font-semibold">{metrics.ordersCount} Total Orders</p>
                </div>

                <div className="bg-[#12241F] border border-emerald-900/40 p-6 rounded-3xl space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                    <span>Managed Pages</span>
                    <Globe className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-white">{6 + metrics.customPagesCount} Pages</div>
                  <p className="text-[11px] text-emerald-400 font-semibold">{metrics.customPagesCount} Custom Created</p>
                </div>
              </div>

              {/* cPanel Quick Access Tools Grid */}
              <div className="space-y-4">
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#FF5A36]" />
                  <span>cPanel Control Center Quick Tools</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  <button
                    onClick={() => setActiveTab('cms_sections')}
                    className="p-6 bg-[#11231E] border border-emerald-900/40 hover:border-emerald-500 rounded-3xl text-left transition space-y-3 cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black group-hover:scale-110 transition">
                      <Globe className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-[#FF5A36] transition">Website Page & Section CMS</h3>
                      <p className="text-xs text-slate-400 mt-1">Change any copy, heading, subtitle, button text, or banner across Home, About, Shop, Travel & Contact pages.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('custom_pages')}
                    className="p-6 bg-[#11231E] border border-emerald-900/40 hover:border-amber-500 rounded-3xl text-left transition space-y-3 cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black group-hover:scale-110 transition">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition">Add & Manage Dynamic Pages</h3>
                      <p className="text-xs text-slate-400 mt-1">Create dynamic custom pages like Privacy Policy, FAQ, Terms, or Special Offer landing pages with custom slugs.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('package_products')}
                    className="p-6 bg-[#11231E] border border-emerald-900/40 hover:border-sky-500 rounded-3xl text-left transition space-y-3 cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-black group-hover:scale-110 transition">
                      <LinkIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-sky-400 transition">Package-Product Linker</h3>
                      <p className="text-xs text-slate-400 mt-1">Attach merchandise products and gift perks directly to travel packages so travelers get recommended gear.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('packages')}
                    className="p-6 bg-[#11231E] border border-emerald-900/40 hover:border-emerald-500 rounded-3xl text-left transition space-y-3 cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black group-hover:scale-110 transition">
                      <MapIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition">Travel Packages Catalog</h3>
                      <p className="text-xs text-slate-400 mt-1">Add, edit, or remove holiday packages, itineraries, hotel tiers, departure dates, and pricing.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('products')}
                    className="p-6 bg-[#11231E] border border-emerald-900/40 hover:border-amber-500 rounded-3xl text-left transition space-y-3 cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black group-hover:scale-110 transition">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition">Shop E-Commerce Store</h3>
                      <p className="text-xs text-slate-400 mt-1">Manage inventory, product descriptions, pricing, image URLs, categories, and stock status.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('global_settings')}
                    className="p-6 bg-[#11231E] border border-emerald-900/40 hover:border-emerald-500 rounded-3xl text-left transition space-y-3 cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black group-hover:scale-110 transition">
                      <Settings className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition">Global Site Branding & Settings</h3>
                      <p className="text-xs text-slate-400 mt-1">Configure site title, support phone/email, announcement banner, social media links, and footer info.</p>
                    </div>
                  </button>

                </div>
              </div>

            </div>
          )}

          {/* TAB 2: GRANULAR PAGE & SECTION CONTENT CMS */}
          {activeTab === 'cms_sections' && (
            <div className="space-y-6">
              
              {/* Page Filter Tabs */}
              <div className="flex flex-wrap items-center gap-2 border-b border-emerald-900/40 pb-4">
                {[
                  { key: 'home', label: '🏠 Home Page' },
                  { key: 'about', label: '📖 About Us' },
                  { key: 'shop', label: '🛍️ Shop Store' },
                  { key: 'travel', label: '✈️ Travel Packages' },
                  { key: 'blog', label: '📰 Blog Journal' },
                  { key: 'contact', label: '📞 Contact Us' },
                  { key: 'global', label: '⚙️ Global & Footer' },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setCmsPageFilter(tab.key as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      cmsPageFilter === tab.key
                        ? 'bg-[#FF5A36] text-white shadow-md'
                        : 'bg-[#11231E] text-slate-300 hover:bg-emerald-900/40'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSaveCMS} className="bg-[#11231E] border border-emerald-900/40 rounded-3xl p-6 sm:p-8 space-y-8">
                
                {/* 1. HOME PAGE CMS */}
                {cmsPageFilter === 'home' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-base font-black text-white flex items-center gap-2">
                        <Globe className="w-5 h-5 text-emerald-400" />
                        <span>Home Page Content & Sections Editor</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">Edit copy for all sections on the main landing page.</p>
                    </div>

                    {/* Section 1: Hero */}
                    <div className="space-y-4 border-t border-emerald-900/30 pt-6">
                      <h4 className="text-xs font-black text-[#FF5A36] uppercase tracking-wider">1. Hero Section Copy</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Title Line 1</label>
                          <input
                            type="text"
                            value={cms.homeHeroTitleLine1}
                            onChange={(e) => setCms(prev => ({ ...prev, homeHeroTitleLine1: e.target.value }))}
                            className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Title Line 2</label>
                          <input
                            type="text"
                            value={cms.homeHeroTitleLine2}
                            onChange={(e) => setCms(prev => ({ ...prev, homeHeroTitleLine2: e.target.value }))}
                            className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Title Line 3</label>
                          <input
                            type="text"
                            value={cms.homeHeroTitleLine3}
                            onChange={(e) => setCms(prev => ({ ...prev, homeHeroTitleLine3: e.target.value }))}
                            className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Hero Subtitle</label>
                        <textarea
                          rows={2}
                          value={cms.homeHeroSubtitle}
                          onChange={(e) => setCms(prev => ({ ...prev, homeHeroSubtitle: e.target.value }))}
                          className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Shop Button Text</label>
                          <input
                            type="text"
                            value={cms.homeHeroShopBtn}
                            onChange={(e) => setCms(prev => ({ ...prev, homeHeroShopBtn: e.target.value }))}
                            className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Travel Button Text</label>
                          <input
                            type="text"
                            value={cms.homeHeroTravelBtn}
                            onChange={(e) => setCms(prev => ({ ...prev, homeHeroTravelBtn: e.target.value }))}
                            className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Mascot */}
                    <div className="space-y-4 border-t border-emerald-900/30 pt-6">
                      <h4 className="text-xs font-black text-[#FF5A36] uppercase tracking-wider">2. Bonjo Mascot Speak Bubble</h4>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Mascot Speak Bubble Copy</label>
                        <textarea
                          rows={2}
                          value={cms.homeMascotText}
                          onChange={(e) => setCms(prev => ({ ...prev, homeMascotText: e.target.value }))}
                          className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white resize-none"
                        />
                      </div>
                    </div>

                    {/* Section 3: Deals & Selling */}
                    <div className="space-y-4 border-t border-emerald-900/30 pt-6">
                      <h4 className="text-xs font-black text-[#FF5A36] uppercase tracking-wider">3. Shop Deals & Best Sellers Headings</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Deals Section Title</label>
                          <input
                            type="text"
                            value={cms.homeDealsTitle}
                            onChange={(e) => setCms(prev => ({ ...prev, homeDealsTitle: e.target.value }))}
                            className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Selling Section Title</label>
                          <input
                            type="text"
                            value={cms.homeSellingTitle}
                            onChange={(e) => setCms(prev => ({ ...prev, homeSellingTitle: e.target.value }))}
                            className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Deals Subtitle</label>
                          <input
                            type="text"
                            value={cms.homeDealsSub}
                            onChange={(e) => setCms(prev => ({ ...prev, homeDealsSub: e.target.value }))}
                            className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Selling Subtitle</label>
                          <input
                            type="text"
                            value={cms.homeSellingSub}
                            onChange={(e) => setCms(prev => ({ ...prev, homeSellingSub: e.target.value }))}
                            className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 4: Call to Action Banner */}
                    <div className="space-y-4 border-t border-emerald-900/30 pt-6">
                      <h4 className="text-xs font-black text-[#FF5A36] uppercase tracking-wider">4. Home CTA Banner</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">CTA Banner Title</label>
                          <input
                            type="text"
                            value={cms.homeCtaTitle}
                            onChange={(e) => setCms(prev => ({ ...prev, homeCtaTitle: e.target.value }))}
                            className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">CTA Subtitle</label>
                          <input
                            type="text"
                            value={cms.homeCtaSub}
                            onChange={(e) => setCms(prev => ({ ...prev, homeCtaSub: e.target.value }))}
                            className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">CTA Button Text</label>
                          <input
                            type="text"
                            value={cms.homeCtaBtnText}
                            onChange={(e) => setCms(prev => ({ ...prev, homeCtaBtnText: e.target.value }))}
                            className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">CTA Button Link</label>
                          <input
                            type="text"
                            value={cms.homeCtaBtnLink}
                            onChange={(e) => setCms(prev => ({ ...prev, homeCtaBtnLink: e.target.value }))}
                            className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* 2. ABOUT US PAGE CMS */}
                {cmsPageFilter === 'about' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-base font-black text-white flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-emerald-400" />
                        <span>About Us Page CMS</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">Manage brand story, mission, and team headings.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Hero Title</label>
                        <input
                          type="text"
                          value={cms.aboutHeroTitle}
                          onChange={(e) => setCms(prev => ({ ...prev, aboutHeroTitle: e.target.value }))}
                          className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Hero Subtitle</label>
                        <input
                          type="text"
                          value={cms.aboutHeroSubtitle}
                          onChange={(e) => setCms(prev => ({ ...prev, aboutHeroSubtitle: e.target.value }))}
                          className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Mission Title</label>
                          <input
                            type="text"
                            value={cms.aboutMissionTitle}
                            onChange={(e) => setCms(prev => ({ ...prev, aboutMissionTitle: e.target.value }))}
                            className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Story Title</label>
                          <input
                            type="text"
                            value={cms.aboutStoryTitle}
                            onChange={(e) => setCms(prev => ({ ...prev, aboutStoryTitle: e.target.value }))}
                            className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Mission Statement Text</label>
                        <textarea
                          rows={3}
                          value={cms.aboutMissionText}
                          onChange={(e) => setCms(prev => ({ ...prev, aboutMissionText: e.target.value }))}
                          className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Brand Story Text</label>
                        <textarea
                          rows={3}
                          value={cms.aboutStoryText}
                          onChange={(e) => setCms(prev => ({ ...prev, aboutStoryText: e.target.value }))}
                          className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. SHOP PAGE CMS */}
                {cmsPageFilter === 'shop' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-base font-black text-white flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-emerald-400" />
                        <span>Shop Page CMS</span>
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Shop Hero Title</label>
                          <input
                            type="text"
                            value={cms.shopHeroTitle}
                            onChange={(e) => setCms(prev => ({ ...prev, shopHeroTitle: e.target.value }))}
                            className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Shop Hero Subtitle</label>
                          <input
                            type="text"
                            value={cms.shopHeroSubtitle}
                            onChange={(e) => setCms(prev => ({ ...prev, shopHeroSubtitle: e.target.value }))}
                            className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Promo Banner Text</label>
                          <input
                            type="text"
                            value={cms.shopPromoBannerText}
                            onChange={(e) => setCms(prev => ({ ...prev, shopPromoBannerText: e.target.value }))}
                            className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Promo Button Text</label>
                          <input
                            type="text"
                            value={cms.shopPromoBannerButton}
                            onChange={(e) => setCms(prev => ({ ...prev, shopPromoBannerButton: e.target.value }))}
                            className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. TRAVEL PACKAGES CMS */}
                {cmsPageFilter === 'travel' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-base font-black text-white flex items-center gap-2">
                        <MapIcon className="w-5 h-5 text-emerald-400" />
                        <span>Travel Packages Page CMS</span>
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Travel Hero Title</label>
                          <input
                            type="text"
                            value={cms.travelHeroTitle}
                            onChange={(e) => setCms(prev => ({ ...prev, travelHeroTitle: e.target.value }))}
                            className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Travel Hero Subtitle</label>
                          <input
                            type="text"
                            value={cms.travelHeroSubtitle}
                            onChange={(e) => setCms(prev => ({ ...prev, travelHeroSubtitle: e.target.value }))}
                            className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Support Banner Text</label>
                          <input
                            type="text"
                            value={cms.travelSupportBannerText}
                            onChange={(e) => setCms(prev => ({ ...prev, travelSupportBannerText: e.target.value }))}
                            className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Support Phone</label>
                          <input
                            type="text"
                            value={cms.travelSupportPhone}
                            onChange={(e) => setCms(prev => ({ ...prev, travelSupportPhone: e.target.value }))}
                            className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. CONTACT US CMS */}
                {cmsPageFilter === 'contact' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-base font-black text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-emerald-400" />
                        <span>Contact Page CMS</span>
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Contact Title</label>
                          <input
                            type="text"
                            value={cms.contactHeroTitle}
                            onChange={(e) => setCms(prev => ({ ...prev, contactHeroTitle: e.target.value }))}
                            className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Contact Subtitle</label>
                          <input
                            type="text"
                            value={cms.contactHeroSubtitle}
                            onChange={(e) => setCms(prev => ({ ...prev, contactHeroSubtitle: e.target.value }))}
                            className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Support Phone</label>
                          <input
                            type="text"
                            value={cms.contactPhone}
                            onChange={(e) => setCms(prev => ({ ...prev, contactPhone: e.target.value }))}
                            className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Support Email</label>
                          <input
                            type="text"
                            value={cms.contactEmail}
                            onChange={(e) => setCms(prev => ({ ...prev, contactEmail: e.target.value }))}
                            className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Office Hours</label>
                          <input
                            type="text"
                            value={cms.contactHours}
                            onChange={(e) => setCms(prev => ({ ...prev, contactHours: e.target.value }))}
                            className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Office Address</label>
                        <input
                          type="text"
                          value={cms.contactAddress}
                          onChange={(e) => setCms(prev => ({ ...prev, contactAddress: e.target.value }))}
                          className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Save Button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-[#FF5A36] hover:bg-[#e04a29] text-white rounded-2xl text-xs font-black uppercase tracking-wider transition shadow-lg cursor-pointer flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Website CMS Copy Live</span>
                </button>

              </form>

            </div>
          )}

          {/* TAB 3: DYNAMIC CUSTOM PAGES MANAGER */}
          {activeTab === 'custom_pages' && (
            <div className="space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-black text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-400" />
                    <span>Dynamic Custom Pages Manager</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Add custom pages (e.g. Privacy Policy, FAQ, Terms, Special Offers) accessible via clean URL slugs.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingCustomPage({
                      id: '',
                      title: '',
                      slug: '',
                      status: 'published',
                      showInHeader: false,
                      showInFooter: true,
                      content: '# New Custom Page Title\n\nAdd your content here...',
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    });
                    setIsPageModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#FF5A36] hover:bg-[#e04a29] text-white rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Custom Page</span>
                </button>
              </div>

              {/* Custom Pages List */}
              <div className="bg-[#11231E] border border-emerald-900/40 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-[#0B1513] text-[10px] uppercase font-black tracking-wider text-slate-400 border-b border-emerald-900/40">
                      <tr>
                        <th className="px-6 py-4">Page Title & Slug</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Nav Placement</th>
                        <th className="px-6 py-4">Updated Date</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-900/30 font-medium">
                      {customPages.map(page => (
                        <tr key={page.id} className="hover:bg-emerald-950/40 transition">
                          <td className="px-6 py-4">
                            <div className="font-bold text-white text-sm">{page.title}</div>
                            <div className="text-[11px] font-mono text-emerald-400 mt-0.5">/pages/{page.slug}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              page.status === 'published' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-700 text-slate-300'
                            }`}>
                              {page.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              {page.showInHeader && <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 text-[10px] font-bold">Header</span>}
                              {page.showInFooter && <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 text-[10px] font-bold">Footer</span>}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                            {new Date(page.updatedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <Link
                              href={`/pages/${page.slug}`}
                              target="_blank"
                              className="inline-flex p-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 rounded-lg transition"
                              title="View Page"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>

                            <button
                              onClick={() => {
                                setEditingCustomPage(page);
                                setIsPageModalOpen(true);
                              }}
                              className="p-2 bg-amber-950 hover:bg-amber-900 text-amber-300 rounded-lg transition cursor-pointer"
                              title="Edit Page"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteCustomPage(page.id)}
                              className="p-2 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded-lg transition cursor-pointer"
                              title="Delete Page"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: PACKAGE-PRODUCT LINKER */}
          {activeTab === 'package_products' && (
            <div className="space-y-6">
              
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-sky-400" />
                  <span>Package-Product Association Linker</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Attach merchandise products directly to travel packages as included perks or recommended gear add-ons.
                </p>
              </div>

              {/* Link Controls Form */}
              <div className="bg-[#11231E] border border-emerald-900/40 rounded-3xl p-6 space-y-6">
                <h3 className="text-xs font-black text-sky-400 uppercase tracking-wider">Link Product to Package</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Select Travel Package</label>
                    <select
                      value={selectedPackageForLink}
                      onChange={(e) => setSelectedPackageForLink(e.target.value)}
                      className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                    >
                      {packages.map(pkg => (
                        <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Select Shop Product</label>
                    <select
                      value={newLinkProductId}
                      onChange={(e) => setNewLinkProductId(e.target.value)}
                      className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                    >
                      <option value="">-- Choose Product --</option>
                      {products.map(prod => (
                        <option key={prod.id} value={prod.id}>{prod.name} (₹{prod.price})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Perk Type</label>
                    <select
                      value={newLinkPerkType}
                      onChange={(e) => setNewLinkPerkType(e.target.value as any)}
                      className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                    >
                      <option value="included">🎁 Included Free Perk</option>
                      <option value="addon">🛍️ Recommended Gear Add-on</option>
                    </select>
                  </div>

                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Custom Perk Note</label>
                  <input
                    type="text"
                    placeholder="e.g. Complimentary Saffron Pack or 20% Off Waterproof Jacket"
                    value={newLinkNote}
                    onChange={(e) => setNewLinkNote(e.target.value)}
                    className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddPackageProductLink}
                  className="px-6 py-3 bg-[#FF5A36] hover:bg-[#e04a29] text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-lg cursor-pointer"
                >
                  Link Product to Package
                </button>
              </div>

              {/* Linked Associations Table */}
              <div className="bg-[#11231E] border border-emerald-900/40 rounded-3xl overflow-hidden">
                <div className="p-4 bg-[#0B1513] border-b border-emerald-900/40 text-xs font-bold text-white uppercase tracking-wider">
                  Active Package & Product Links ({packageProductLinks.length})
                </div>

                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#0B1513] text-[10px] uppercase font-black text-slate-400 border-b border-emerald-900/40">
                    <tr>
                      <th className="px-6 py-4">Package</th>
                      <th className="px-6 py-4">Linked Product</th>
                      <th className="px-6 py-4">Perk Type</th>
                      <th className="px-6 py-4">Note</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/30">
                    {packageProductLinks.map((link, idx) => {
                      const pkg = packages.find(p => p.id === link.packageId);
                      const prod = products.find(p => p.id === link.productId);
                      return (
                        <tr key={idx} className="hover:bg-emerald-950/40 transition">
                          <td className="px-6 py-4 font-bold text-white">
                            {pkg?.name || link.packageId}
                          </td>
                          <td className="px-6 py-4 text-emerald-300 font-semibold">
                            {prod?.name || link.productId}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              link.perkType === 'included' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-sky-500/20 text-sky-300'
                            }`}>
                              {link.perkType === 'included' ? 'Included Perk' : 'Gear Add-on'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-400">{link.note || '-'}</td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleRemovePackageProductLink(link.packageId, link.productId)}
                              className="p-2 bg-rose-950 text-rose-300 rounded-lg hover:bg-rose-900 transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 5: TRAVEL PACKAGES CRUD */}
          {activeTab === 'packages' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-white">Travel Packages Catalog ({packages.length})</h2>
                <button
                  onClick={() => {
                    const newPkg: HolidayPackage = {
                      id: `pkg-${Date.now()}`,
                      name: 'New Adventure Tour',
                      price: 14999,
                      originalPrice: 19999,
                      duration: '5 Days / 4 Nights',
                      durationDays: 5,
                      rating: 5.0,
                      ratingCount: 12,
                      hotelStars: '4-Star',
                      hotelClass: '4',
                      route: 'Manali - Solang - Kasol',
                      routeList: ['Manali', 'Solang Valley', 'Kasol'],
                      description: 'Experience breathtaking mountain trails and pristine valleys.',
                      inclusions: ['flights', 'hotel', 'meals'],
                      highlights: ['Guided Trekking', 'Bonfire Night'],
                      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
                      themes: ['Adventure', 'Mountain'],
                      destination: 'Himachal',
                      detailsAvailable: true,
                      link: '/travel',
                    };
                    const updated = [...packages, newPkg];
                    setPackages(updated);
                    localStorage.setItem('gb_admin_packages', JSON.stringify(updated));
                    showToast('New tour package created!');
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#FF5A36] text-white rounded-xl text-xs font-black uppercase"
                >
                  <Plus className="w-4 h-4" /> Add Tour Package
                </button>
              </div>

              <div className="bg-[#11231E] border border-emerald-900/40 rounded-3xl overflow-hidden">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#0B1513] text-[10px] uppercase font-black text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Package</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Duration</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/30">
                    {packages.map(pkg => (
                      <tr key={pkg.id} className="hover:bg-emerald-950/40 transition">
                        <td className="px-6 py-4 font-bold text-white">{pkg.name}</td>
                        <td className="px-6 py-4 text-emerald-400 font-mono font-bold">₹{pkg.price.toLocaleString()}</td>
                        <td className="px-6 py-4 text-slate-400">{pkg.duration}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => {
                              const updated = packages.filter(p => p.id !== pkg.id);
                              setPackages(updated);
                              localStorage.setItem('gb_admin_packages', JSON.stringify(updated));
                              showToast('Package removed!');
                            }}
                            className="p-2 bg-rose-950 text-rose-300 rounded-lg hover:bg-rose-900 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: SHOP PRODUCTS CRUD */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-white">Shop Inventory Products ({products.length})</h2>
                <button
                  onClick={() => {
                    const newProd: Product = {
                      id: `prod-${Date.now()}`,
                      name: 'Banjara Trekking Mug',
                      price: 499,
                      originalPrice: 799,
                      description: 'Insulated stainless steel outdoor mug.',
                      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=500&q=80',
                      category: 'lifestyle',
                      rating: 4.9,
                      inStock: true,
                    };
                    const updated = [...products, newProd];
                    setProducts(updated);
                    localStorage.setItem('gb_admin_products', JSON.stringify(updated));
                    showToast('New product added to inventory!');
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#FF5A36] text-white rounded-xl text-xs font-black uppercase"
                >
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              </div>

              <div className="bg-[#11231E] border border-emerald-900/40 rounded-3xl overflow-hidden">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#0B1513] text-[10px] uppercase font-black text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Product Name</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/30">
                    {products.map(prod => (
                      <tr key={prod.id} className="hover:bg-emerald-950/40 transition">
                        <td className="px-6 py-4 font-bold text-white">{prod.name}</td>
                        <td className="px-6 py-4 text-slate-400 capitalize">{prod.category}</td>
                        <td className="px-6 py-4 text-emerald-400 font-mono font-bold">₹{prod.price}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => {
                              const updated = products.filter(p => p.id !== prod.id);
                              setProducts(updated);
                              localStorage.setItem('gb_admin_products', JSON.stringify(updated));
                              showToast('Product removed!');
                            }}
                            className="p-2 bg-rose-950 text-rose-300 rounded-lg hover:bg-rose-900 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: GLOBAL SITE SETTINGS & BRANDING */}
          {activeTab === 'global_settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-emerald-400" />
                  <span>Global Site Branding & Settings</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">Configure global announcements, logos, support channels, and footer information.</p>
              </div>

              <form onSubmit={handleSaveGlobalSettings} className="bg-[#11231E] border border-emerald-900/40 rounded-3xl p-6 sm:p-8 space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Website Brand Name</label>
                    <input
                      type="text"
                      value={cms.global.siteName}
                      onChange={(e) => setCms(prev => ({ ...prev, global: { ...prev.global, siteName: e.target.value } }))}
                      className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Currency Symbol</label>
                    <input
                      type="text"
                      value={cms.global.currencySymbol}
                      onChange={(e) => setCms(prev => ({ ...prev, global: { ...prev.global, currencySymbol: e.target.value } }))}
                      className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>

                <div className="space-y-4 border-t border-emerald-900/30 pt-4">
                  <h4 className="text-xs font-black text-[#FF5A36] uppercase tracking-wider">Header Announcement Bar</h4>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cms.global.announcementEnabled}
                        onChange={(e) => setCms(prev => ({ ...prev, global: { ...prev.global, announcementEnabled: e.target.checked } }))}
                        className="w-4 h-4 accent-[#FF5A36]"
                      />
                      <span>Enable Announcement Bar</span>
                    </label>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Announcement Text</label>
                    <input
                      type="text"
                      value={cms.global.announcementText}
                      onChange={(e) => setCms(prev => ({ ...prev, global: { ...prev.global, announcementText: e.target.value } }))}
                      className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>

                <div className="space-y-4 border-t border-emerald-900/30 pt-4">
                  <h4 className="text-xs font-black text-[#FF5A36] uppercase tracking-wider">Support & Social Links</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Support Phone</label>
                      <input
                        type="text"
                        value={cms.global.supportPhone}
                        onChange={(e) => setCms(prev => ({ ...prev, global: { ...prev.global, supportPhone: e.target.value } }))}
                        className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Support Email</label>
                      <input
                        type="text"
                        value={cms.global.supportEmail}
                        onChange={(e) => setCms(prev => ({ ...prev, global: { ...prev.global, supportEmail: e.target.value } }))}
                        className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">WhatsApp Number</label>
                      <input
                        type="text"
                        value={cms.global.whatsappNumber}
                        onChange={(e) => setCms(prev => ({ ...prev, global: { ...prev.global, whatsappNumber: e.target.value } }))}
                        className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Instagram URL</label>
                      <input
                        type="text"
                        value={cms.global.instagramUrl}
                        onChange={(e) => setCms(prev => ({ ...prev, global: { ...prev.global, instagramUrl: e.target.value } }))}
                        className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Facebook URL</label>
                      <input
                        type="text"
                        value={cms.global.facebookUrl}
                        onChange={(e) => setCms(prev => ({ ...prev, global: { ...prev.global, facebookUrl: e.target.value } }))}
                        className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">YouTube URL</label>
                      <input
                        type="text"
                        value={cms.global.youtubeUrl}
                        onChange={(e) => setCms(prev => ({ ...prev, global: { ...prev.global, youtubeUrl: e.target.value } }))}
                        className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#FF5A36] hover:bg-[#e04a29] text-white rounded-2xl text-xs font-black uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Global Website Settings</span>
                </button>

              </form>

            </div>
          )}

          {/* OTHER TABS (ORDERS, BOOKINGS, CUSTOMERS, PAYMENTS, BLOGS, DESTINATIONS) */}
          {(activeTab === 'orders' || activeTab === 'bookings' || activeTab === 'customers' || activeTab === 'payments' || activeTab === 'blogs' || activeTab === 'destinations') && (
            <div className="bg-[#11231E] border border-emerald-900/40 rounded-3xl p-8 text-center space-y-4">
              <h2 className="text-lg font-black text-white capitalize">{activeTab} Management</h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Track real-time transactions, manage entries, and export audit logs.
              </p>
              <div className="p-4 bg-[#0B1513] rounded-2xl border border-emerald-900/40 inline-block text-xs font-mono text-emerald-400">
                Total Records Loaded: {activeTab === 'orders' ? orders.length : activeTab === 'bookings' ? bookings.length : activeTab === 'customers' ? customers.length : activeTab === 'blogs' ? blogs.length : destinations.length}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* CREATE / EDIT CUSTOM PAGE MODAL */}
      {isPageModalOpen && editingCustomPage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#11231E] border border-emerald-900/50 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 text-slate-100 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-emerald-900/40 pb-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span>{editingCustomPage.id ? 'Edit Custom Page' : 'Create Custom Page'}</span>
              </h3>
              <button
                onClick={() => { setIsPageModalOpen(false); setEditingCustomPage(null); }}
                className="text-slate-400 hover:text-white transition font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCustomPage} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Page Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Privacy Policy"
                    value={editingCustomPage.title}
                    onChange={(e) => setEditingCustomPage(prev => prev ? { ...prev, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') } : null)}
                    className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">URL Slug *</label>
                  <div className="flex items-center bg-[#0B1513] border border-emerald-900/40 rounded-xl px-3 text-xs">
                    <span className="text-slate-500 font-mono">/pages/</span>
                    <input
                      type="text"
                      required
                      placeholder="privacy-policy"
                      value={editingCustomPage.slug}
                      onChange={(e) => setEditingCustomPage(prev => prev ? { ...prev, slug: e.target.value } : null)}
                      className="w-full p-3 bg-transparent text-white font-mono focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Publication Status</label>
                  <select
                    value={editingCustomPage.status}
                    onChange={(e) => setEditingCustomPage(prev => prev ? { ...prev, status: e.target.value as any } : null)}
                    className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Header Nav Visibility</label>
                  <select
                    value={editingCustomPage.showInHeader ? 'yes' : 'no'}
                    onChange={(e) => setEditingCustomPage(prev => prev ? { ...prev, showInHeader: e.target.value === 'yes' } : null)}
                    className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                  >
                    <option value="no">Hidden from Header</option>
                    <option value="yes">Show in Header</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Footer Nav Visibility</label>
                  <select
                    value={editingCustomPage.showInFooter ? 'yes' : 'no'}
                    onChange={(e) => setEditingCustomPage(prev => prev ? { ...prev, showInFooter: e.target.value === 'yes' } : null)}
                    className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                  >
                    <option value="yes">Show in Footer</option>
                    <option value="no">Hidden from Footer</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Hero Banner Image URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={editingCustomPage.heroImage || ''}
                  onChange={(e) => setEditingCustomPage(prev => prev ? { ...prev, heroImage: e.target.value } : null)}
                  className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Meta Description (SEO)</label>
                <input
                  type="text"
                  placeholder="Brief summary of the page..."
                  value={editingCustomPage.metaDescription || ''}
                  onChange={(e) => setEditingCustomPage(prev => prev ? { ...prev, metaDescription: e.target.value } : null)}
                  className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Page Body Content (Markdown Supported)</label>
                <textarea
                  rows={8}
                  placeholder="# Page Heading&#10;&#10;Write page body text..."
                  value={editingCustomPage.content}
                  onChange={(e) => setEditingCustomPage(prev => prev ? { ...prev, content: e.target.value } : null)}
                  className="w-full p-3 bg-[#0B1513] border border-emerald-900/40 rounded-xl text-xs text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-emerald-900/40">
                <button
                  type="button"
                  onClick={() => { setIsPageModalOpen(false); setEditingCustomPage(null); }}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#FF5A36] hover:bg-[#e04a29] text-white rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-lg"
                >
                  Save Custom Page
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
