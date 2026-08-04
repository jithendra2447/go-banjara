'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Map as MapIcon, ShoppingBag, ClipboardList, Users,
  ShieldCheck, DollarSign, Plus, Trash2, Edit3, CheckCircle2,
  AlertCircle, FileText, Search, CreditCard, ArrowRight, Ban,
  Eye, EyeOff, Calendar, Check, Landmark, RefreshCw, BookOpen, Star,
  Globe, Link as LinkIcon, Settings, ExternalLink, Sparkles, Layers,
  CheckSquare, Sliders, Server, Save, Download, Upload, Cpu, Zap, Image as ImageIcon,
  Mail, Key, Compass, ChevronDown
} from 'lucide-react';
import { useCart } from '@/components/providers';
import { PackageEditorModal } from '@/components/PackageEditorModal';
import { DESTINATIONS as INITIAL_DESTINATIONS, Destination } from '@/data/destinations';
import { PRODUCTS as INITIAL_PRODUCTS } from '@/data/products';
import { HOLIDAY_PACKAGES as INITIAL_HOLIDAY_PACKAGES, HolidayPackage } from '@/data/packages';
import { Product } from '@/types';
import {
  getStoredCMSContent, saveStoredCMSContent, SiteCMSContent, DEFAULT_CMS_CONTENT,
  getStoredCustomPages, saveStoredCustomPages, CustomPage, DEFAULT_CUSTOM_PAGES,
  getStoredPackageProductLinks, saveStoredPackageProductLinks, PackageProductLink, DEFAULT_PACKAGE_PRODUCT_LINKS
} from '@/lib/cms';

const DEFAULT_ADMIN_CREDS = {
  email: 'gobanjara.trd@gmail.com',
  password: 'GoBanjara123!'
};

const getStoredAdminCreds = () => {
  if (typeof window === 'undefined') return DEFAULT_ADMIN_CREDS;
  const saved = localStorage.getItem('gb_admin_credentials');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.email && parsed.password) {
        return parsed;
      }
    } catch (e) {}
  }
  return DEFAULT_ADMIN_CREDS;
};

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
  | 'newsletters'
  | 'submissions'
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
  const [prodFilterCategory, setProdFilterCategory] = useState<string>('');
  const [prodFilterSection, setProdFilterSection] = useState<string>('');
  const [openMultiSectionProdId, setOpenMultiSectionProdId] = useState<string | null>(null);

  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [bookings, setBookings] = useState<OrderHistoryItem[]>([]);
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  // Live admin data from MongoDB
  const [liveUsers, setLiveUsers] = useState<any[]>([]);
  const [liveOrders, setLiveOrders] = useState<any[]>([]);
  const [liveBookings, setLiveBookings] = useState<any[]>([]);
  const [liveSubscribers, setLiveSubscribers] = useState<any[]>([]);
  const [liveSubmissions, setLiveSubmissions] = useState<any[]>([]);
  const [isLiveLoading, setIsLiveLoading] = useState(true);

  const fetchLiveAdminData = async () => {
    setIsLiveLoading(true);
    try {
      const res = await fetch('/api/admin');
      const data = await res.json();
      if (data.success) {
        setLiveUsers(data.users || []);
        setLiveOrders(data.orders || []);
        setLiveBookings(data.bookings || []);
        setLiveSubscribers(data.newsletterSubscribers || []);
        setLiveSubmissions(data.contactSubmissions || []);
      }
    } catch (err) {
      console.error('Failed to load live admin data:', err);
    } finally {
      setIsLiveLoading(false);
    }
  };

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
  const [activeProdEditorTab, setActiveProdEditorTab] = useState<'basic' | 'specs' | 'reviews' | 'faqs'>('basic');
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [editingDest, setEditingDest] = useState<Destination | null>(null);

  // Search & Toast state
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const res = evt.target?.result as string;
        if (res) callback(res);
      };
      reader.readAsDataURL(file);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Auth Protection & Login Form States
  const [adminEmail, setAdminEmail] = useState('gobanjara.trd@gmail.com');
  const [adminPassword, setAdminPassword] = useState('GoBanjara123!');
  const { login } = useCart();

  // Change Admin Creds Modal State
  const [isChangingCreds, setIsChangingCreds] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [currentAdminPass, setCurrentAdminPass] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [confirmAdminPass, setConfirmAdminPass] = useState('');

  const openChangeCredsModal = () => {
    const current = getStoredAdminCreds();
    setNewAdminEmail(current.email);
    setCurrentAdminPass('');
    setNewAdminPass('');
    setConfirmAdminPass('');
    setIsChangingCreds(true);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const validCreds = getStoredAdminCreds();

    const inputEmail = adminEmail.trim().toLowerCase();
    const expectedEmail = validCreds.email.trim().toLowerCase();

    if (inputEmail === expectedEmail && adminPassword === validCreds.password) {
      login({
        id: 'admin-1',
        name: 'Go Banjara Super Admin',
        email: validCreds.email,
        role: 'ADMIN',
      });
      fetchLiveAdminData();
      showToast(`Welcome Go Banjara Super Admin (${validCreds.email})!`, 'success');
    } else {
      showToast('Invalid Admin Email or Password. Please check your credentials!', 'error');
    }
  };

  const handleQuickAdminLogin = () => {
    const validCreds = getStoredAdminCreds();
    setAdminEmail(validCreds.email);
    setAdminPassword(validCreds.password);
    login({
      id: 'admin-1',
      name: 'Go Banjara Super Admin',
      email: validCreds.email,
      role: 'ADMIN',
    });
    fetchLiveAdminData();
    showToast(`⚡ Instant Login as ${validCreds.email}!`, 'success');
  };

  const handleUpdateAdminCreds = (e: React.FormEvent) => {
    e.preventDefault();
    const currentCreds = getStoredAdminCreds();

    if (currentAdminPass !== currentCreds.password) {
      showToast('Current Admin Password is incorrect!', 'error');
      return;
    }

    if (!newAdminEmail.trim() || !newAdminEmail.includes('@')) {
      showToast('Please enter a valid Admin Email address!', 'error');
      return;
    }

    if (newAdminPass) {
      if (newAdminPass.length < 6) {
        showToast('New password must be at least 6 characters long!', 'error');
        return;
      }
      if (newAdminPass !== confirmAdminPass) {
        showToast('New Password and Confirm Password do not match!', 'error');
        return;
      }
    }

    const updatedCreds = {
      email: newAdminEmail.trim(),
      password: newAdminPass ? newAdminPass : currentCreds.password,
    };

    localStorage.setItem('gb_admin_credentials', JSON.stringify(updatedCreds));

    login({
      id: 'admin-1',
      name: 'Go Banjara Super Admin',
      email: updatedCreds.email,
      role: 'ADMIN',
    });

    setIsChangingCreds(false);
    setCurrentAdminPass('');
    setNewAdminPass('');
    setConfirmAdminPass('');
    showToast('Admin Email & Password updated successfully! Use your new credentials next time.', 'success');
  };

  // Load All Persisted Data on Mount
  useEffect(() => {
    // Hide site Navbar & Footer on admin
    document.body.classList.add('admin-page');
    document.documentElement.style.setProperty('--admin-pt', '0px');

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
        localStorage.setItem('gb_admin_packages', JSON.stringify(INITIAL_HOLIDAY_PACKAGES));
        if (INITIAL_HOLIDAY_PACKAGES.length > 0) setSelectedPackageForLink(INITIAL_HOLIDAY_PACKAGES[0].id);
      }
    } else {
      setPackages(INITIAL_HOLIDAY_PACKAGES);
      // Initialize localStorage so home/travel pages read admin-controlled data from start
      localStorage.setItem('gb_admin_packages', JSON.stringify(INITIAL_HOLIDAY_PACKAGES));
      if (INITIAL_HOLIDAY_PACKAGES.length > 0) setSelectedPackageForLink(INITIAL_HOLIDAY_PACKAGES[0].id);
    }


    // 6. Load Products
    let mergedProds: Product[] = [...INITIAL_PRODUCTS];
    const savedProd = localStorage.getItem('gb_admin_products_v3') || localStorage.getItem('gb_admin_products');
    if (savedProd) {
      try {
        const parsed = JSON.parse(savedProd);
        if (Array.isArray(parsed) && parsed.length > 0) {
          mergedProds = [...parsed];
          let needsSave = false;
          INITIAL_PRODUCTS.forEach(ip => {
            if (!mergedProds.some(p => p.id === ip.id)) {
              mergedProds.push(ip);
              needsSave = true;
            }
          });
          if (needsSave) {
            localStorage.setItem('gb_admin_products_v3', JSON.stringify(mergedProds));
            localStorage.setItem('gb_admin_products', JSON.stringify(mergedProds));
          }
        }
      } catch (e) {
        console.error('Error loading products from storage:', e);
      }
    } else {
      localStorage.setItem('gb_admin_products_v3', JSON.stringify(INITIAL_PRODUCTS));
      localStorage.setItem('gb_admin_products', JSON.stringify(INITIAL_PRODUCTS));
    }
    setProducts(mergedProds);

    // 7. Load Blogs
    const savedBlogs = localStorage.getItem('gb_admin_blogs');
    if (savedBlogs) {
      try { setBlogs(JSON.parse(savedBlogs)); } catch (e) { setBlogs(DEFAULT_BLOGS); }
    } else {
      setBlogs(DEFAULT_BLOGS);
    }

    // 8. Fetch live catalog from API database to sync packages, products & blogs
    fetch('/api/admin/catalog')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          if (Array.isArray(data.products) && data.products.length > 0) {
            setProducts(data.products);
            localStorage.setItem('gb_admin_products_v3', JSON.stringify(data.products));
          }
          if (Array.isArray(data.packages) && data.packages.length > 0) {
            setPackages(data.packages);
            localStorage.setItem('gb_admin_packages', JSON.stringify(data.packages));
          }
        }
      })
      .catch((err) => console.error('Admin API sync error:', err));

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
    fetchLiveAdminData();
  }, []);

  // Save Handlers
  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredCMSContent(cms);
    syncCatalogToApi({ products, packages, cms, blogs });
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

  const syncCatalogToApi = async (data: { products?: any[]; packages?: any[]; cms?: any; blogs?: any[] }) => {
    try {
      await fetch('/api/admin/catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error('Catalog sync error:', err);
    }
  };

  const handleSaveEditedProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProd) return;
    const exists = products.some(p => p.id === editingProd.id);
    const updated = exists
      ? products.map(p => p.id === editingProd.id ? editingProd : p)
      : [editingProd, ...products];
    setProducts(updated);
    localStorage.setItem('gb_admin_products_v3', JSON.stringify(updated));
    localStorage.setItem('gb_admin_products', JSON.stringify(updated));
    syncCatalogToApi({ products: updated });
    setEditingProd(null);
    showToast(exists ? 'Product updated successfully!' : '✨ New product added to inventory!');
  };

  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;
    const exists = blogs.some(b => b.id === editingBlog.id);
    const updated = exists
      ? blogs.map(b => b.id === editingBlog.id ? editingBlog : b)
      : [editingBlog, ...blogs];
    setBlogs(updated);
    localStorage.setItem('gb_admin_blogs', JSON.stringify(updated));
    syncCatalogToApi({ blogs: updated });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('gb_blogs_updated', { detail: updated }));
    }
    setEditingBlog(null);
    showToast(exists ? 'Blog article updated successfully!' : '✨ New blog article published!');
  };

  const handleDeleteBlog = (id: string) => {
    const updated = blogs.filter(b => b.id !== id);
    setBlogs(updated);
    localStorage.setItem('gb_admin_blogs', JSON.stringify(updated));
    syncCatalogToApi({ blogs: updated });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('gb_blogs_updated', { detail: updated }));
    }
    showToast('Blog article deleted!');
  };

  const handleSaveEditedPackage = (savedPkg: HolidayPackage) => {
    if (!savedPkg) return;
    const exists = packages.some(p => p.id === savedPkg.id);
    const updated = exists
      ? packages.map(p => p.id === savedPkg.id ? savedPkg : p)
      : [savedPkg, ...packages];
    setPackages(updated);
    localStorage.setItem('gb_admin_packages', JSON.stringify(updated));
    syncCatalogToApi({ packages: updated });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('gb_packages_updated', { detail: updated }));
    }
    setEditingPkg(null);
    showToast(exists ? 'Tour package updated successfully!' : '✨ New tour package created and added!');
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
    const shopRevenue = liveOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const travelRevenue = liveBookings.reduce((sum, b) => sum + (b.totalPaid || 0), 0);
    const totalRevenue = shopRevenue + travelRevenue;
    return {
      totalRevenue,
      shopRevenue,
      travelRevenue,
      ordersCount: liveOrders.length,
      bookingsCount: liveBookings.length,
      packagesCount: packages.length,
      productsCount: products.length,
      customPagesCount: customPages.length,
      customersCount: liveUsers.length,
    };
  }, [liveOrders, liveBookings, liveUsers, packages, products, customPages]);

  if (!user) {
    return (
      <div
        style={{ 
          fontFamily: '"Outfit", "Faktum", sans-serif',
          minHeight: "100vh",
          backgroundColor: "#FAF9F6",
          color: "#2B2B2B",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
          boxSizing: "border-box"
        }}
        className="min-h-screen bg-[#FAF9F6] text-[#2B2B2B] flex items-center justify-center p-4"
      >
        <div 
          style={{
            width: "100%",
            maxWidth: "448px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E0D5",
            borderRadius: "16px",
            padding: "32px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            textAlign: "center",
            boxSizing: "border-box"
          }}
          className="max-w-md w-full bg-white border border-[#E5E0D5] rounded-2xl p-8 shadow-xl space-y-6 text-center"
        >
          
          <div 
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              backgroundColor: "#1D493E",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              color: "#FFFFFF",
              fontSize: "24px",
              margin: "0 auto",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              letterSpacing: "-0.025em"
            }}
            className="w-16 h-16 rounded-2xl bg-[#1D493E] flex items-center justify-center font-bold text-white text-2xl mx-auto shadow-md tracking-tight"
          >
            GB
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }} className="space-y-1">
            <h1 
              style={{ fontFamily: '"Faktum", "Fraunces", sans-serif', fontSize: "24px", fontWeight: 700, color: "#1D493E", letterSpacing: "-0.025em", margin: 0 }}
              className="text-2xl font-bold text-[#1D493E] tracking-tight"
            >
              Go Banjara Admin Panel
            </h1>
            <p style={{ fontSize: "12px", color: "#8D8D8D", fontWeight: 500, margin: 0 }} className="text-xs text-[#8D8D8D] font-medium">Authentication required to access site CMS & admin tools.</p>
          </div>

          <form onSubmit={handleAdminLogin} style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" }} className="space-y-4 text-left">
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} className="space-y-1.5">
              <label style={{ fontSize: "11px", fontWeight: 700, color: "#1D493E", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "sans-serif" }} className="text-[11px] font-bold text-[#1D493E] uppercase tracking-wider block font-sans">Admin Email</label>
              <input
                type="email"
                required
                placeholder="gobanjara.trd@gmail.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px",
                  backgroundColor: "#FAF9F6",
                  border: "1px solid #E5E0D5",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "#2B2B2B",
                  outline: "none",
                  boxSizing: "border-box"
                }}
                className="w-full p-3.5 bg-[#FAF9F6] border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B] placeholder-gray-400 focus:outline-none focus:border-[#1D493E] focus:ring-1 focus:ring-[#1D493E]"
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} className="space-y-1.5">
              <label style={{ fontSize: "11px", fontWeight: 700, color: "#1D493E", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "sans-serif" }} className="text-[11px] font-bold text-[#1D493E] uppercase tracking-wider block font-sans">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px",
                  backgroundColor: "#FAF9F6",
                  border: "1px solid #E5E0D5",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "#2B2B2B",
                  outline: "none",
                  boxSizing: "border-box"
                }}
                className="w-full p-3.5 bg-[#FAF9F6] border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B] placeholder-gray-400 focus:outline-none focus:border-[#1D493E] focus:ring-1 focus:ring-[#1D493E]"
              />
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: "#1D493E",
                color: "#FFFFFF",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                border: "none",
                cursor: "pointer",
                fontFamily: '"Faktum", "Outfit", sans-serif',
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              }}
              className="w-full py-3.5 bg-[#1D493E] hover:bg-[#15342c] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md cursor-pointer"
            >
              Sign In to Admin Panel
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", padding: "8px 0" }} className="relative flex py-2 items-center">
            <div style={{ flexGrow: 1, borderTop: "1px solid #E5E0D5" }} className="flex-grow border-t border-gray-200"></div>
            <span style={{ flexShrink: 0, margin: "0 16px", fontSize: "10px", fontWeight: 700, color: "#8D8D8D", textTransform: "uppercase", letterSpacing: "0.1em" }} className="flex-shrink mx-4 text-[10px] font-bold text-[#8D8D8D] uppercase tracking-widest">OR QUICK DEMO</span>
            <div style={{ flexGrow: 1, borderTop: "1px solid #E5E0D5" }} className="flex-grow border-t border-gray-200"></div>
          </div>

          <button
            type="button"
            onClick={handleQuickAdminLogin}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: "rgba(29, 73, 62, 0.08)",
              color: "#1D493E",
              border: "1px solid rgba(29, 73, 62, 0.3)",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              fontFamily: '"Faktum", "Outfit", sans-serif'
            }}
            className="w-full py-3.5 bg-[#1D493E]/[0.08] hover:bg-[#1D493E]/[0.15] text-[#1D493E] border border-[#1D493E]/30 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
          >
            <Zap style={{ width: "16px", height: "16px", color: "#FF623E" }} />
            <span>Instant One-Click Admin Access</span>
          </button>

          <div style={{ paddingTop: "8px" }} className="pt-2">
            <Link href="/" style={{ fontSize: "12px", fontWeight: 600, color: "#8D8D8D", textDecoration: "none" }} className="text-xs font-semibold text-[#8D8D8D] hover:text-[#1D493E] transition">
              ← Return to Go Banjara Website
            </Link>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: '"Faktum", "Outfit", system-ui, -apple-system, sans-serif' }} className="min-h-screen bg-[#FAF9F6] text-[#2B2B2B] flex flex-col font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-black uppercase tracking-wider transition-all duration-300 ${
          toast.type === 'error' || toast.message.includes('⚠️') || toast.message.includes('Maximum 8')
            ? 'bg-red-600 text-white shadow-red-900/30 border border-red-400/40' 
            : 'bg-[#1D493E] text-white shadow-emerald-900/30 border border-emerald-500/30'
        }`}>
          {toast.type === 'error' || toast.message.includes('⚠️') || toast.message.includes('Maximum 8') ? (
            <AlertCircle className="w-5 h-5 text-white shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Admin Top Control Bar & Header */}
      <header className="bg-[#1D493E] border-b border-emerald-900/40 px-6 py-4 sticky top-0 z-40 shadow-md">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <img
                src="/icon.png"
                alt="go banjāra logo"
                className="h-8 w-8 rounded-full object-contain transition-transform group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.png';
                }}
              />
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-white tracking-tight leading-none font-sans">
                  go banjāra
                </span>
                <span className="text-[9px] font-extrabold bg-[#FF5A36] text-white px-2 py-0.5 rounded-md uppercase tracking-widest shadow-xs">
                  ADMIN
                </span>
              </div>
            </Link>
          </div>

          {/* Quick Actions & Live Preview Link */}
          <div className="flex items-center gap-3">
            <button
              onClick={openChangeCredsModal}
              title="Change Admin Email & Password"
              className="flex items-center gap-2 px-3.5 py-2 bg-[#15342c] hover:bg-[#0f2721] text-emerald-100 rounded-xl text-xs font-bold transition border border-emerald-600/40 cursor-pointer"
            >
              <Key className="w-4 h-4 text-emerald-300" />
              <span className="hidden sm:inline">Admin Security</span>
            </button>

            <a
              href="https://gobanjara.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#15342c] hover:bg-[#0f2721] text-emerald-100 rounded-xl text-xs font-bold transition border border-emerald-600/40"
            >
              <Eye className="w-4 h-4 text-white/70" />
              <span>Preview Live Site</span>
              <ExternalLink className="w-3 h-3 text-white/70" />
            </a>

            <button
              onClick={handleExportBackup}
              title="Download Admin Backup JSON"
              className="p-2 bg-[#15342c] hover:bg-[#0f2721] text-white rounded-xl transition border border-emerald-600/40 cursor-pointer"
            >
              <Download className="w-4 h-4 text-white/70" />
            </button>

            <label
              title="Restore Admin Backup JSON"
              className="p-2 bg-[#15342c] hover:bg-[#0f2721] text-white rounded-xl transition border border-emerald-600/40 cursor-pointer"
            >
              <Upload className="w-4 h-4 text-white/70" />
              <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
            </label>

            <button
              onClick={handleSaveCMS}
              style={{ fontFamily: '"Faktum", "Outfit", sans-serif' }}
              className="flex items-center gap-2 px-4 py-2 bg-[#FF623E] hover:bg-[#e05331] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save All</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Layout */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto flex flex-col md:flex-row pt-8 pb-12 px-4 sm:px-6 md:px-8 gap-8">
        
        {/* Admin Sidebar Navigation */}
        <aside className="w-full md:w-72 bg-white border-r border-[#E5E0D5] p-4 space-y-6 shrink-0 shadow-xs">
          
          {/* Quick Search Tool */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#8D8D8D] absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search admin tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#FAF9F6] border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B] placeholder-gray-400 focus:outline-none focus:border-[#1D493E]"
            />
          </div>

          {/* Navigation Groups */}
          <nav className="space-y-1 text-xs">
            
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#1D493E] px-3 py-1 font-sans">
              Core Engine & Overview
            </div>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                activeTab === 'overview' ? 'bg-[#1D493E] text-white shadow-sm' : 'text-[#2B2B2B] hover:bg-[#1D493E]/[0.08] hover:text-[#1D493E]'
              }`}
            >
              <span>Admin Dashboard</span>
              <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full font-mono">Main</span>
            </button>

            <div className="pt-3 text-[10px] font-bold uppercase tracking-wider text-[#1D493E] px-3 py-1 font-sans">
              Website CMS & Page Builder
            </div>

            <button
              onClick={() => setActiveTab('cms_sections')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                activeTab === 'cms_sections' ? 'bg-[#1D493E] text-white shadow-sm' : 'text-[#2B2B2B] hover:bg-[#1D493E]/[0.08] hover:text-[#1D493E]'
              }`}
            >
              <span>Edit Page & Sections</span>
              <span className="text-[10px] bg-[#1D493E]/10 text-[#1D493E] px-2 py-0.5 rounded-full font-bold">CMS</span>
            </button>

            <button
              onClick={() => setActiveTab('custom_pages')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                activeTab === 'custom_pages' ? 'bg-[#1D493E] text-white shadow-sm' : 'text-[#2B2B2B] hover:bg-[#1D493E]/[0.08] hover:text-[#1D493E]'
              }`}
            >
              <span>Add & Manage Pages</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                {customPages.length}
              </span>
            </button>



            <div className="pt-3 text-[10px] font-bold uppercase tracking-wider text-[#1D493E] px-3 py-1 font-sans">
              Store & Travel Catalog
            </div>

            <button
              onClick={() => setActiveTab('packages')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                activeTab === 'packages' ? 'bg-[#1D493E] text-white shadow-sm' : 'text-[#2B2B2B] hover:bg-[#1D493E]/[0.08] hover:text-[#1D493E]'
              }`}
            >
              <span>Travel Packages</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono">
                {packages.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                activeTab === 'products' ? 'bg-[#1D493E] text-white shadow-sm' : 'text-[#2B2B2B] hover:bg-[#1D493E]/[0.08] hover:text-[#1D493E]'
              }`}
            >
              <span>Shop Products</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono">
                {products.length}
              </span>
            </button>


            <div className="pt-3 text-[10px] font-bold uppercase tracking-wider text-[#1D493E] px-3 py-1 font-sans">
              Fulfillment & Accounts
            </div>

             <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                activeTab === 'orders' ? 'bg-[#1D493E] text-white shadow-sm' : 'text-[#2B2B2B] hover:bg-[#1D493E]/[0.08] hover:text-[#1D493E]'
              }`}
            >
              <span>Shop Orders</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono">
                {liveOrders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                activeTab === 'bookings' ? 'bg-[#1D493E] text-white shadow-sm' : 'text-[#2B2B2B] hover:bg-[#1D493E]/[0.08] hover:text-[#1D493E]'
              }`}
            >
              <span>Trip Bookings</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono">
                {liveBookings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                activeTab === 'customers' ? 'bg-[#1D493E] text-white shadow-sm' : 'text-[#2B2B2B] hover:bg-[#1D493E]/[0.08] hover:text-[#1D493E]'
              }`}
            >
              <span>Customers & Users</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono">
                {liveUsers.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('newsletters')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                activeTab === 'newsletters' ? 'bg-[#1D493E] text-white shadow-sm' : 'text-[#2B2B2B] hover:bg-[#1D493E]/[0.08] hover:text-[#1D493E]'
              }`}
            >
              <span>Newsletter Subs</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono">
                {liveSubscribers.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('submissions')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                activeTab === 'submissions' ? 'bg-[#1D493E] text-white shadow-sm' : 'text-[#2B2B2B] hover:bg-[#1D493E]/[0.08] hover:text-[#1D493E]'
              }`}
            >
              <span>Contact Us Enquiries</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono">
                {liveSubmissions.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                activeTab === 'payments' ? 'bg-[#1D493E] text-white shadow-sm' : 'text-[#2B2B2B] hover:bg-[#1D493E]/[0.08] hover:text-[#1D493E]'
              }`}
            >
              <span>Payments & Gateway</span>
            </button>

            <div className="pt-3 text-[10px] font-bold uppercase tracking-wider text-[#1D493E] px-3 py-1 font-sans">
              Site Configuration
            </div>

            <button
              onClick={() => setActiveTab('global_settings')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                activeTab === 'global_settings' ? 'bg-[#1D493E] text-white shadow-sm' : 'text-[#2B2B2B] hover:bg-[#1D493E]/[0.08] hover:text-[#1D493E]'
              }`}
            >
              <span>Global Site Settings</span>
            </button>
          </nav>
        </aside>

        {/* Admin Main Content Area */}
        <main className="flex-1 p-6 lg:p-8 bg-[#FAF9F6] text-[#2B2B2B] overflow-y-auto">
          
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border border-[#E5E0D5] p-6 rounded-2xl shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-[#8D8D8D] text-xs font-bold uppercase tracking-wider font-sans">
                    <span>Total Revenue</span>
                    <DollarSign className="w-4 h-4 text-[#1D493E]" />
                  </div>
                  <div className="text-2xl font-bold text-[#1D493E]">₹{metrics.totalRevenue.toLocaleString()}</div>
                  <p className="text-[11px] text-[#1D493E] font-semibold">Shop & Travel Combined</p>
                </div>

                <div className="bg-white border border-[#E5E0D5] p-6 rounded-2xl shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-[#8D8D8D] text-xs font-bold uppercase tracking-wider font-sans">
                    <span>Travel Packages</span>
                    <MapIcon className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-bold text-[#2B2B2B]">{metrics.packagesCount} Active</div>
                  <p className="text-[11px] text-amber-700 font-semibold">{metrics.bookingsCount} Total Bookings</p>
                </div>

                <div className="bg-white border border-[#E5E0D5] p-6 rounded-2xl shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-[#8D8D8D] text-xs font-bold uppercase tracking-wider font-sans">
                    <span>Shop Products</span>
                    <ShoppingBag className="w-4 h-4 text-sky-600" />
                  </div>
                  <div className="text-2xl font-bold text-[#2B2B2B]">{metrics.productsCount} Items</div>
                  <p className="text-[11px] text-sky-700 font-semibold">{metrics.ordersCount} Total Orders</p>
                </div>

                <div className="bg-white border border-[#E5E0D5] p-6 rounded-2xl shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-[#8D8D8D] text-xs font-bold uppercase tracking-wider font-sans">
                    <span>Managed Pages</span>
                    <Globe className="w-4 h-4 text-[#1D493E]" />
                  </div>
                  <div className="text-2xl font-bold text-[#1D493E]">{6 + metrics.customPagesCount} Pages</div>
                  <p className="text-[11px] text-[#1D493E] font-semibold">{metrics.customPagesCount} Custom Created</p>
                </div>
              </div>

              {/* Admin Quick Access Tools Grid */}
              <div className="space-y-4">
                <h2 
                  style={{ fontFamily: '"Fraunces", Georgia, serif' }}
                  className="text-lg font-semibold text-[#1D493E] flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5 text-[#FF623E]" />
                  <span>Go Banjara Admin Control Tools</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  <button
                    onClick={() => setActiveTab('cms_sections')}
                    className="p-6 bg-white border border-[#E5E0D5] hover:border-[#1D493E] rounded-2xl text-left transition space-y-3 cursor-pointer group shadow-xs"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#1D493E]/10 text-[#1D493E] flex items-center justify-center font-bold group-hover:scale-105 transition">
                      <Globe className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#2B2B2B] group-hover:text-[#1D493E] transition">Website Page & Section CMS</h3>
                      <p className="text-xs text-[#8D8D8D] mt-1 font-medium">Change any copy, heading, subtitle, button text, or banner across Home, About, Shop, Travel & Contact pages.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('custom_pages')}
                    className="p-6 bg-white border border-[#E5E0D5] hover:border-amber-600 rounded-2xl text-left transition space-y-3 cursor-pointer group shadow-xs"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold group-hover:scale-105 transition">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#2B2B2B] group-hover:text-amber-700 transition">Add & Manage Dynamic Pages</h3>
                      <p className="text-xs text-[#8D8D8D] mt-1 font-medium">Create dynamic custom pages like Privacy Policy, FAQ, Terms, or Special Offer landing pages with custom slugs.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('submissions')}
                    className="p-6 bg-white border border-[#E5E0D5] hover:border-emerald-600 rounded-2xl text-left transition space-y-3 cursor-pointer group shadow-xs"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold group-hover:scale-105 transition">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#2B2B2B] group-hover:text-emerald-700 transition">Contact Us Enquiries</h3>
                      <p className="text-xs text-[#8D8D8D] mt-1 font-medium">View and respond to customer messages, contact form submissions, and trip inquiries.</p>
                    </div>
                  </button>



                  <button
                    onClick={() => setActiveTab('packages')}
                    className="p-6 bg-white border border-[#E5E0D5] hover:border-[#1D493E] rounded-2xl text-left transition space-y-3 cursor-pointer group shadow-xs"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#1D493E]/10 text-[#1D493E] flex items-center justify-center font-bold group-hover:scale-105 transition">
                      <MapIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#2B2B2B] group-hover:text-[#1D493E] transition">Travel Packages Catalog</h3>
                      <p className="text-xs text-[#8D8D8D] mt-1 font-medium">Add, edit, or remove holiday packages, itineraries, hotel tiers, departure dates, and pricing.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('products')}
                    className="p-6 bg-white border border-[#E5E0D5] hover:border-amber-600 rounded-2xl text-left transition space-y-3 cursor-pointer group shadow-xs"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold group-hover:scale-105 transition">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#2B2B2B] group-hover:text-amber-700 transition">Shop E-Commerce Store</h3>
                      <p className="text-xs text-[#8D8D8D] mt-1 font-medium">Manage inventory, product descriptions, pricing, image URLs, categories, and stock status.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('global_settings')}
                    className="p-6 bg-white border border-[#E5E0D5] hover:border-[#1D493E] rounded-2xl text-left transition space-y-3 cursor-pointer group shadow-xs"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#1D493E]/10 text-[#1D493E] flex items-center justify-center font-bold group-hover:scale-105 transition">
                      <Settings className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#2B2B2B] group-hover:text-[#1D493E] transition">Global Site Branding & Settings</h3>
                      <p className="text-xs text-[#8D8D8D] mt-1 font-medium">Configure site title, support phone/email, announcement banner, social media links, and footer info.</p>
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
              <div className="flex flex-wrap items-center gap-2 border-b border-[#E5E0D5] pb-4">
                {[
                  { key: 'home', label: 'Home Page Editor' },
                  { key: 'contact', label: 'Contact Info & Location' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setCmsPageFilter(tab.key as any)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      cmsPageFilter === tab.key
                        ? 'bg-[#1D493E] text-white'
                        : 'bg-[#F0EDE8] text-[#6B7280] hover:text-[#1D493E]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSaveCMS} className="bg-white border border-[#E5E0D5] rounded-2xl p-6 sm:p-8 space-y-8 shadow-xs">
                
                {/* 1. HOME PAGE CMS */}
                {cmsPageFilter === 'home' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-base font-black text-[#1D493E]">
                        Homepage Content & Section Manager
                      </h3>
                      <p className="text-xs text-[#6B7280] mt-1">
                        Turn homepage sections ON/OFF, edit headings, subheadings, background videos, hero posters, pictures, and button links.
                      </p>
                    </div>

                    {/* SECTION VISIBILITY MATRIX (KEEP / HIDE) */}
                    <div className="bg-[#FAF9F6] border border-[#E5E0D5] rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-black text-[#1D493E] uppercase tracking-wider">
                            Homepage Section Visibility (Keep or Hide Sections)
                          </h4>
                          <p className="text-[11px] text-gray-500 font-medium">Toggle switches below to show or hide sections from the public homepage.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                        {[
                          { key: 'showHeroSection', label: 'Hero Video Banner', desc: 'Main video & title' },
                          { key: 'showDualCtaBanners', label: 'Dual CTA Banners', desc: 'Shop & Book cards' },
                          { key: 'showDestinationsSection', label: 'Places Worth Detour', desc: 'Top travel destinations' },
                          { key: 'showCategoriesSection', label: 'Top Categories', desc: 'Category cards' },
                          { key: 'showDealsSection', label: 'Trending Adventure Deals', desc: 'Discounted gear' },
                          { key: 'showBestSellingSection', label: 'Most Selling Products', desc: 'Popular products' },
                          { key: 'showReviewsSection', label: 'Community Reviews', desc: 'Customer testimonials' },
                          { key: 'showBlogSection', label: 'Travel Tales (Blog)', desc: 'Featured blog posts' },
                          { key: 'showFaqSection', label: 'FAQ Section', desc: 'Questions accordion' },
                          { key: 'showValuesSection', label: 'Why Choose Us', desc: 'Brand values & trust' },
                          { key: 'showCtaBannerSection', label: 'Bottom Newsletter Banner', desc: 'Subscription banner' },
                        ].map((sec) => (
                          <div
                            key={sec.key}
                            className={`p-3.5 rounded-xl border transition flex items-center justify-between ${
                              (cms as any)[sec.key] !== false
                                ? 'bg-emerald-50/70 border-emerald-300'
                                : 'bg-gray-50 border-gray-200 opacity-60'
                            }`}
                          >
                            <div className="space-y-0.5">
                              <span className="text-xs font-bold text-[#1D493E] block">{sec.label}</span>
                              <span className="text-[10px] text-gray-500">{sec.desc}</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={(cms as any)[sec.key] !== false}
                                onChange={(e) => setCms(prev => ({ ...prev, [sec.key]: e.target.checked }))}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1D493E]"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SECTION 1: HERO MEDIA & COPY */}
                    <div className="space-y-4 border-t border-[#E5E0D5] pt-6">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-[#FF5A36] uppercase tracking-wider">1. Hero Section (Background Video, Poster & Main Heading)</h4>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Media & Content</span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF9F6] p-4 rounded-xl border border-[#E5E0D5]">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-[#1D493E] uppercase block">Background Video File / URL (.mp4)</label>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              placeholder="/hero-video.mp4 or https://..."
                              value={cms.homeHeroVideoUrl || ''}
                              onChange={(e) => setCms(prev => ({ ...prev, homeHeroVideoUrl: e.target.value }))}
                              className="flex-1 p-3 bg-white border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B]"
                            />
                            <label className="px-4 py-3 bg-[#1D493E] hover:bg-[#15342c] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0">
                              <Upload className="w-4 h-4" />
                              <span>Upload Video</span>
                              <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => handleFileUpload(e, (url) => {
                                  setCms(prev => ({ ...prev, homeHeroVideoUrl: url }));
                                })}
                                className="hidden"
                              />
                            </label>
                          </div>
                          <p className="text-[10px] text-gray-400">Default: /hero-video.mp4</p>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-[#1D493E] uppercase block">Hero Video Poster Image URL (.jpg)</label>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              placeholder="/hero-poster.jpg or https://..."
                              value={cms.homeHeroPosterUrl || ''}
                              onChange={(e) => setCms(prev => ({ ...prev, homeHeroPosterUrl: e.target.value }))}
                              className="flex-1 p-3 bg-white border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B]"
                            />
                            <label className="px-4 py-3 bg-[#1D493E] hover:bg-[#15342c] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0">
                              <Upload className="w-4 h-4" />
                              <span>Upload Photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, (url) => {
                                  setCms(prev => ({ ...prev, homeHeroPosterUrl: url }));
                                })}
                                className="hidden"
                              />
                            </label>
                          </div>
                          <p className="text-[10px] text-gray-400">Instant load preview poster for smooth rendering</p>
                        </div>
                      </div>

                      {/* LIVE MEDIA PREVIEW PLAYER */}
                      <div className="bg-[#111] p-3 rounded-2xl border border-gray-800 space-y-2 max-w-xs sm:max-w-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                            Live Media Preview
                          </span>
                          <span className="text-[9px] text-gray-400 font-mono truncate max-w-[150px]">
                            {cms.homeHeroVideoUrl || '/hero-video.mp4'}
                          </span>
                        </div>
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black border border-gray-800 shadow-md flex items-center justify-center">
                          {cms.homeHeroVideoUrl ? (
                            <video
                              src={cms.homeHeroVideoUrl}
                              poster={cms.homeHeroPosterUrl || '/hero-poster.jpg'}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src={cms.homeHeroPosterUrl || '/hero-poster.jpg'}
                              alt="Hero Preview Poster"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      </div>
                    </div>



                    {/* SECTION 2: DESTINATIONS & LIVE 3 TRAVEL PACKAGES */}
                    <div className="space-y-4 border-t border-[#E5E0D5] pt-6">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-[#FF5A36] uppercase tracking-wider">2. Places Worth the Detour (Destinations)</h4>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          Live on Homepage
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#6B7280] uppercase">Tag Badge</label>
                          <input
                            type="text"
                            value={cms.homeDestinationsTag}
                            onChange={(e) => setCms(prev => ({ ...prev, homeDestinationsTag: e.target.value }))}
                            className="w-full p-3 bg-white border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#6B7280] uppercase">Heading</label>
                          <input
                            type="text"
                            value={cms.homeDestinationsTitle}
                            onChange={(e) => setCms(prev => ({ ...prev, homeDestinationsTitle: e.target.value }))}
                            className="w-full p-3 bg-white border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#6B7280] uppercase">Subheading</label>
                          <input
                            type="text"
                            value={cms.homeDestinationsSub}
                            onChange={(e) => setCms(prev => ({ ...prev, homeDestinationsSub: e.target.value }))}
                            className="w-full p-3 bg-white border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                          />
                        </div>
                      </div>

                      {/* LIVE 3 TRAVEL PACKAGES SHOWCASE */}
                      <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#E5E0D5] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[#1D493E] uppercase tracking-wider flex items-center gap-1.5">
                            <Compass className="w-4 h-4 text-[#FF5A36]" />
                            Live Featured 3 Travel Packages on Homepage
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveTab('packages')}
                            className="text-[10px] font-bold text-[#1D493E] hover:underline cursor-pointer"
                          >
                            Manage Packages &rarr;
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {((packages && packages.length > 0 ? packages : []).filter(p => p.showOnHome === true && !p.hidden).slice(0, 3)).map((pkg, idx) => (
                            <div key={pkg.id || idx} className="bg-white p-3 rounded-xl border border-[#E5E0D5] space-y-2 flex flex-col justify-between shadow-2xs">
                              <div className="space-y-2">
                                <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
                                  <img 
                                    src={pkg.image || '/travel-leh-6.jpg'} 
                                    alt={pkg.name} 
                                    className="w-full h-full object-cover" 
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = '/travel-leh-6.jpg';
                                    }}
                                  />
                                  <span className="absolute top-1.5 left-1.5 z-10 text-[9px] font-bold bg-[#1D493E] text-white px-2 py-0.5 rounded shadow-xs whitespace-nowrap">
                                    Package #{idx + 1}
                                  </span>
                                </div>
                                <div>
                                  <h5 className="text-xs font-bold text-[#2B2B2B] line-clamp-1">{pkg.name}</h5>
                                  <p className="text-[10px] text-[#6B7280]">{pkg.duration} &bull; {pkg.destination}</p>
                                </div>
                              </div>
                              <div className="pt-1 border-t border-gray-100 flex items-center justify-between">
                                <span className="text-xs font-black text-[#1D493E]">₹{pkg.price?.toLocaleString('en-IN')}</span>
                                <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded border border-emerald-200">Live</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4 border-t border-[#E5E0D5] pt-6">
                      <h4 className="text-xs font-black text-[#FF5A36] uppercase tracking-wider">3. Product Categories, Reviews & Travel Tales (Blog)</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#6B7280] uppercase">Categories Section Title</label>
                          <input
                            type="text"
                            value={cms.homeCollectionsTitle}
                            onChange={(e) => setCms(prev => ({ ...prev, homeCollectionsTitle: e.target.value }))}
                            className="w-full p-3 bg-white border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#6B7280] uppercase">Reviews Section Title</label>
                          <input
                            type="text"
                            value={cms.homeReviewsTitle}
                            onChange={(e) => setCms(prev => ({ ...prev, homeReviewsTitle: e.target.value }))}
                            className="w-full p-3 bg-white border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#6B7280] uppercase">Travel Tales (Blog) Title</label>
                          <input
                            type="text"
                            value={cms.homeBlogTitle}
                            onChange={(e) => setCms(prev => ({ ...prev, homeBlogTitle: e.target.value }))}
                            className="w-full p-3 bg-white border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#6B7280] uppercase">FAQ Section Title</label>
                          <input
                            type="text"
                            value={cms.homeFaqTitle}
                            onChange={(e) => setCms(prev => ({ ...prev, homeFaqTitle: e.target.value }))}
                            className="w-full p-3 bg-white border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                          />
                        </div>
                      </div>

                      {/* Category Items Editor */}
                      <div className="space-y-2 pt-4 border-t border-[#E5E0D5]">
                        <span className="text-[10px] font-bold text-[#1D493E] uppercase tracking-wider block">Homepage Product Category Cards:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {(cms.homeCategories || []).map((cat, cIdx) => (
                            <div key={cIdx} className="bg-white p-3.5 rounded-xl border border-[#E5E0D5] space-y-2 shadow-2xs">
                              <div className="flex gap-2">
                                <img src={cat.image || '/around_the_world_sticker.jpg'} className="w-10 h-10 rounded object-cover border shrink-0 bg-gray-50" alt="Category Thumbnail" />
                                <div className="flex-1 space-y-1 min-w-0">
                                  <input
                                    type="text"
                                    value={cat.name}
                                    onChange={(e) => {
                                      const updated = [...(cms.homeCategories || [])];
                                      updated[cIdx] = { ...updated[cIdx], name: e.target.value };
                                      setCms(prev => ({ ...prev, homeCategories: updated }));
                                    }}
                                    className="font-bold text-xs text-[#2B2B2B] w-full border-b border-dashed border-gray-300 focus:outline-none"
                                    placeholder="Category Name"
                                  />
                                  <input
                                    type="text"
                                    value={cat.price}
                                    onChange={(e) => {
                                      const updated = [...(cms.homeCategories || [])];
                                      updated[cIdx] = { ...updated[cIdx], price: e.target.value };
                                      setCms(prev => ({ ...prev, homeCategories: updated }));
                                    }}
                                    className="text-[10px] text-gray-500 w-full border-b border-dashed border-gray-300 focus:outline-none"
                                    placeholder="Price description"
                                  />
                                </div>
                              </div>
                              <div className="space-y-1.5 text-left">
                                <div className="space-y-0.5">
                                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Redirect Link</span>
                                  <input
                                    type="text"
                                    value={cat.link}
                                    onChange={(e) => {
                                      const updated = [...(cms.homeCategories || [])];
                                      updated[cIdx] = { ...updated[cIdx], link: e.target.value };
                                      setCms(prev => ({ ...prev, homeCategories: updated }));
                                    }}
                                    className="text-[10px] text-gray-600 w-full p-1 bg-gray-50 border border-gray-200 rounded focus:outline-none"
                                    placeholder="/shop?category=Patches"
                                  />
                                </div>
                                <div className="space-y-0.5">
                                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Image URL</span>
                                  <input
                                    type="text"
                                    value={cat.image || ''}
                                    onChange={(e) => {
                                      const updated = [...(cms.homeCategories || [])];
                                      updated[cIdx] = { ...updated[cIdx], image: e.target.value };
                                      setCms(prev => ({ ...prev, homeCategories: updated }));
                                    }}
                                    className="text-[10px] text-gray-600 w-full p-1 bg-gray-50 border border-gray-200 rounded focus:outline-none"
                                    placeholder="/around_the_world_sticker.jpg"
                                  />
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 pt-1 border-t border-gray-100">
                                <label className="flex-1 px-2 py-1 bg-[#1D493E] hover:bg-[#15342c] text-white rounded text-[9px] font-bold transition flex items-center justify-center gap-1 cursor-pointer">
                                  <Upload className="w-2.5 h-2.5" />
                                  <span>Picture</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload(e, (url) => {
                                      const updated = [...(cms.homeCategories || [])];
                                      updated[cIdx] = { ...updated[cIdx], image: url };
                                      setCms(prev => ({ ...prev, homeCategories: updated }));
                                    })}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Reviews Items Editor */}
                      <div className="space-y-2 pt-4 border-t border-[#E5E0D5]">
                        <span className="text-[10px] font-bold text-[#1D493E] uppercase tracking-wider block">Homepage Reviews & Testimonials:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {(cms.homeReviews || []).map((rev, rIdx) => (
                            <div key={rIdx} className="bg-white p-3.5 rounded-xl border border-[#E5E0D5] space-y-2 shadow-2xs">
                              <div className="flex gap-2">
                                <img src={rev.avatar || '/avatar.jpg'} className="w-10 h-10 rounded-full object-cover border shrink-0 bg-gray-50" alt="Reviewer Avatar" />
                                <div className="flex-1 space-y-1 min-w-0">
                                  <input
                                    type="text"
                                    value={rev.name}
                                    onChange={(e) => {
                                      const updated = [...(cms.homeReviews || [])];
                                      updated[rIdx] = { ...updated[rIdx], name: e.target.value };
                                      setCms(prev => ({ ...prev, homeReviews: updated }));
                                    }}
                                    className="font-bold text-xs text-[#2B2B2B] w-full border-b border-dashed border-gray-300 focus:outline-none"
                                    placeholder="Author Name"
                                  />
                                  <input
                                    type="text"
                                    value={rev.subtitle}
                                    onChange={(e) => {
                                      const updated = [...(cms.homeReviews || [])];
                                      updated[rIdx] = { ...updated[rIdx], subtitle: e.target.value };
                                      setCms(prev => ({ ...prev, homeReviews: updated }));
                                    }}
                                    className="text-[10px] text-gray-500 w-full border-b border-dashed border-gray-300 focus:outline-none"
                                    placeholder="Role / Location"
                                  />
                                </div>
                              </div>
                              <textarea
                                value={rev.text}
                                onChange={(e) => {
                                  const updated = [...(cms.homeReviews || [])];
                                  updated[rIdx] = { ...updated[rIdx], text: e.target.value };
                                  setCms(prev => ({ ...prev, homeReviews: updated }));
                                }}
                                className="text-[10px] text-gray-600 w-full p-2 bg-gray-50 border border-gray-200 rounded focus:outline-none h-16 resize-none"
                                placeholder="Write review body here..."
                              />
                              <div className="space-y-0.5 text-left">
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Avatar URL</span>
                                <input
                                  type="text"
                                  value={rev.avatar || ''}
                                  onChange={(e) => {
                                    const updated = [...(cms.homeReviews || [])];
                                    updated[rIdx] = { ...updated[rIdx], avatar: e.target.value };
                                    setCms(prev => ({ ...prev, homeReviews: updated }));
                                  }}
                                  className="text-[10px] text-gray-600 w-full p-1 bg-gray-50 border border-gray-200 rounded focus:outline-none"
                                  placeholder="e.g. /avatar.jpg"
                                />
                              </div>
                              <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-gray-100">
                                <div className="flex items-center gap-1">
                                  <span className="text-[9px] font-bold text-gray-400 uppercase">Stars:</span>
                                  <input
                                    type="number"
                                    min={1}
                                    max={5}
                                    value={rev.stars}
                                    onChange={(e) => {
                                      const updated = [...(cms.homeReviews || [])];
                                      updated[rIdx] = { ...updated[rIdx], stars: Number(e.target.value) };
                                      setCms(prev => ({ ...prev, homeReviews: updated }));
                                    }}
                                    className="w-10 text-[10px] font-bold border-b border-dashed border-gray-300 focus:outline-none text-center"
                                  />
                                </div>
                                <label className="px-3 py-1 bg-[#1D493E] hover:bg-[#15342c] text-white rounded text-[9px] font-bold transition flex items-center justify-center gap-1 cursor-pointer">
                                  <Upload className="w-2.5 h-2.5" />
                                  <span>Picture</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload(e, (url) => {
                                      const updated = [...(cms.homeReviews || [])];
                                      updated[rIdx] = { ...updated[rIdx], avatar: url };
                                      setCms(prev => ({ ...prev, homeReviews: updated }));
                                    })}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>






                    {/* DYNAMIC CUSTOM HOMEPAGE SECTIONS */}
                    <div className="space-y-4 border-t border-[#E5E0D5] pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-black text-[#1D493E] uppercase tracking-wider flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            <span>Custom Homepage Sections ({cms.homeCustomSections?.length || 0})</span>
                          </h4>
                          <p className="text-[11px] text-gray-500">Create new custom sections with titles, images, videos, and custom links on the homepage.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newSec = {
                              id: `custom_sec_${Date.now()}`,
                              title: 'New Custom Section',
                              subtitle: 'Add custom section subtitle here...',
                              tag: 'FEATURED',
                              image: '',
                              videoUrl: '',
                              content: '',
                              buttonText: 'Explore Now',
                              buttonLink: '/shop',
                              visible: true,
                            };
                            setCms(prev => ({
                              ...prev,
                              homeCustomSections: [...(prev.homeCustomSections || []), newSec]
                            }));
                          }}
                          className="px-3.5 py-2 bg-[#1D493E] hover:bg-[#15342c] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Custom Section</span>
                        </button>
                      </div>

                      {cms.homeCustomSections && cms.homeCustomSections.length > 0 && (
                        <div className="space-y-4 pt-2">
                          {cms.homeCustomSections.map((sec, idx) => (
                            <div key={sec.id} className="p-4 bg-[#FAF9F6] rounded-xl border border-[#E5E0D5] space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-[#1D493E]">Custom Section #{idx + 1}</span>
                                <div className="flex items-center gap-3">
                                  <label className="flex items-center gap-1.5 text-xs text-gray-600 font-medium cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={sec.visible !== false}
                                      onChange={(e) => {
                                        const updated = [...(cms.homeCustomSections || [])];
                                        updated[idx].visible = e.target.checked;
                                        setCms(prev => ({ ...prev, homeCustomSections: updated }));
                                      }}
                                    />
                                    <span>Visible</span>
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = (cms.homeCustomSections || []).filter(s => s.id !== sec.id);
                                      setCms(prev => ({ ...prev, homeCustomSections: updated }));
                                    }}
                                    className="text-red-500 hover:text-red-700 text-xs font-bold cursor-pointer"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>

                              {/* LOCATION / PLACEMENT SELECTOR */}
                              <div className="space-y-1 bg-white p-3 rounded-xl border border-[#E5E0D5]">
                                <label className="text-[10px] font-bold text-[#1D493E] uppercase block">Homepage Placement Location</label>
                                <select
                                  value={sec.position || 'bottom'}
                                  onChange={(e) => {
                                    const updated = [...(cms.homeCustomSections || [])];
                                    updated[idx].position = e.target.value as any;
                                    setCms(prev => ({ ...prev, homeCustomSections: updated }));
                                  }}
                                  className="w-full p-2.5 bg-[#FAF9F6] border border-[#E5E0D5] rounded-xl text-xs font-bold text-[#1D493E]"
                                >
                                  <option value="hero">Below Hero Section</option>
                                  <option value="dual_cta">Below Dual CTA Banners</option>
                                  <option value="destinations">Below Destinations (Places Worth Detour)</option>
                                  <option value="deals">Below Best Selling & Deals</option>
                                  <option value="categories">Below Product Collections</option>
                                  <option value="reviews">Below Community Reviews</option>
                                  <option value="blog">Below Travel Journal (Blog)</option>
                                  <option value="bottom">At Bottom of Home Page</option>
                                </select>
                              </div>

                              {/* TAG & TITLE */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <input
                                  type="text"
                                  placeholder="Tag Badge (e.g. FEATURED)"
                                  value={sec.tag || ''}
                                  onChange={(e) => {
                                    const updated = [...(cms.homeCustomSections || [])];
                                    updated[idx].tag = e.target.value;
                                    setCms(prev => ({ ...prev, homeCustomSections: updated }));
                                  }}
                                  className="p-3 bg-white border border-[#E5E0D5] rounded-xl text-xs"
                                />
                                <input
                                  type="text"
                                  placeholder="Section Title"
                                  value={sec.title}
                                  onChange={(e) => {
                                    const updated = [...(cms.homeCustomSections || [])];
                                    updated[idx].title = e.target.value;
                                    setCms(prev => ({ ...prev, homeCustomSections: updated }));
                                  }}
                                  className="p-3 bg-white border border-[#E5E0D5] rounded-xl text-xs sm:col-span-2 font-bold text-[#1D493E]"
                                />
                              </div>

                              {/* SUBTITLE */}
                              <textarea
                                rows={2}
                                placeholder="Subtitle / Description..."
                                value={sec.subtitle}
                                onChange={(e) => {
                                  const updated = [...(cms.homeCustomSections || [])];
                                  updated[idx].subtitle = e.target.value;
                                  setCms(prev => ({ ...prev, homeCustomSections: updated }));
                                }}
                                className="w-full p-3 bg-white border border-[#E5E0D5] rounded-xl text-xs resize-none"
                              />

                              {/* BUTTON OPTION, LABEL & LINK */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-[#1D493E] uppercase block">Button Option</label>
                                  <select
                                    value={sec.buttonStyle || 'solid'}
                                    onChange={(e) => {
                                      const updated = [...(cms.homeCustomSections || [])];
                                      updated[idx].buttonStyle = e.target.value as any;
                                      setCms(prev => ({ ...prev, homeCustomSections: updated }));
                                    }}
                                    className="w-full p-3 bg-[#FAF9F6] border border-[#E5E0D5] rounded-xl text-xs font-bold text-[#1D493E]"
                                  >
                                    <option value="solid">Solid Button</option>
                                    <option value="view_all">View All</option>
                                    <option value="drag">Drag Carousel</option>
                                    <option value="load_more">Load More</option>
                                  </select>
                                </div>

                                <input
                                  type="text"
                                  placeholder="Button Label (e.g. Explore Now)"
                                  value={sec.buttonText || ''}
                                  onChange={(e) => {
                                    const updated = [...(cms.homeCustomSections || [])];
                                    updated[idx].buttonText = e.target.value;
                                    setCms(prev => ({ ...prev, homeCustomSections: updated }));
                                  }}
                                  className="p-3 bg-white border border-[#E5E0D5] rounded-xl text-xs font-medium self-end"
                                />
                                <input
                                  type="text"
                                  placeholder="Button Link (e.g. /shop)"
                                  value={sec.buttonLink || ''}
                                  onChange={(e) => {
                                    const updated = [...(cms.homeCustomSections || [])];
                                    updated[idx].buttonLink = e.target.value;
                                    setCms(prev => ({ ...prev, homeCustomSections: updated }));
                                  }}
                                  className="p-3 bg-white border border-[#E5E0D5] rounded-xl text-xs font-mono self-end"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* CONTACT US PAGE CMS */}
                {cmsPageFilter === 'contact' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-base font-black text-[#1D493E] flex items-center gap-2">
                        <Mail className="w-5 h-5 text-[#1D493E]" />
                        <span>Contact Page Details & Office Location</span>
                      </h3>
                      <p className="text-xs text-[#6B7280] mt-1">Update your live support email, phone number, and office location address shown on http://localhost:3000/contact.</p>
                    </div>

                    <div className="space-y-4 bg-[#FAF9F6] p-6 rounded-2xl border border-[#E5E0D5]">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#1D493E] uppercase">Support Email Address</label>
                          <input
                            type="email"
                            value={cms.contactEmail || cms.global?.supportEmail || ''}
                            onChange={(e) => setCms(prev => ({
                              ...prev,
                              contactEmail: e.target.value,
                              global: { ...prev.global, supportEmail: e.target.value }
                            }))}
                            placeholder="e.g. hello@gobanjara.com"
                            className="w-full p-3 bg-white border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B] font-medium"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#1D493E] uppercase">Support Phone Number</label>
                          <input
                            type="text"
                            value={cms.contactPhone || cms.global?.supportPhone || ''}
                            onChange={(e) => setCms(prev => ({
                              ...prev,
                              contactPhone: e.target.value,
                              global: { ...prev.global, supportPhone: e.target.value }
                            }))}
                            placeholder="e.g. (+91) 9489094392"
                            className="w-full p-3 bg-white border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B] font-medium"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#1D493E] uppercase">Office Location Address</label>
                        <textarea
                          rows={3}
                          value={cms.contactAddress || cms.global?.address || ''}
                          onChange={(e) => setCms(prev => ({
                            ...prev,
                            contactAddress: e.target.value,
                            global: { ...prev.global, address: e.target.value }
                          }))}
                          placeholder="e.g. 1st Floor, DSR Tranquil, 102, Plot # 901, Ayyappa Society Main Rd..."
                          className="w-full p-3 bg-white border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B] font-medium resize-none"
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
                  <h2 className="text-base font-semibold text-[#1D493E]">
                    Custom Pages
                  </h2>
                  <p className="text-xs text-[#6B7280] mt-1">
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
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#1D493E] hover:bg-[#163d34] text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Page</span>
                </button>
              </div>

              {/* Custom Pages List */}
              <div className="bg-white border border-[#E5E0D5] rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#2B2B2B]">
                    <thead className="bg-[#F0EDE8] text-[10px] uppercase font-black tracking-wider text-[#1D493E] border-b border-[#E5E0D5]">
                      <tr>
                        <th className="px-6 py-4">Page Title & Slug</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Nav Placement</th>
                        <th className="px-6 py-4">Updated Date</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E0D5] font-medium">
                      {customPages.map(page => (
                        <tr key={page.id} className="hover:bg-[#F6F3EE] transition">
                          <td className="px-6 py-4">
                            <div className="font-bold text-[#2B2B2B] text-sm">{page.title}</div>
                            <div className="text-[11px] font-mono text-[#1D493E]/60 mt-0.5">/pages/{page.slug}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              page.status === 'published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-[#F0EDE8] text-[#8D8D8D] border border-[#E5E0D5]'
                            }`}>
                              {page.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              {page.showInHeader && <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">Header</span>}
                              {page.showInFooter && <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">Footer</span>}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[#8D8D8D] font-mono text-[11px]">
                            {new Date(page.updatedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <Link
                              href={`/pages/${page.slug}`}
                              target="_blank"
                              className="inline-flex p-2 bg-[#F0EDE8] hover:bg-[#1D493E] hover:text-white text-[#1D493E] rounded-lg transition"
                              title="View Page"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>

                            <button
                              onClick={() => {
                                setEditingCustomPage(page);
                                setIsPageModalOpen(true);
                              }}
                              className="p-2 bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-700 rounded-lg transition cursor-pointer"
                              title="Edit Page"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteCustomPage(page.id)}
                              className="p-2 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded-lg transition cursor-pointer"
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



          {/* TAB 5: TRAVEL PACKAGES CRUD */}
          {activeTab === 'packages' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#1D493E]">Travel Packages Catalog ({packages.length})</h2>
                <button
                  onClick={() => {
                    setEditingPkg({
                      id: `pkg-${Date.now()}`,
                      name: '',
                      price: 12000,
                      originalPrice: 15000,
                      duration: '3 Days / 2 Nights',
                      durationDays: 3,
                      rating: 5.0,
                      ratingCount: 1,
                      hotelStars: '3-Star',
                      hotelClass: '3',
                      route: '',
                      routeList: [],
                      description: '',
                      inclusions: ['hotel', 'meals'],
                      highlights: [],
                      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
                      themes: ['Adventure'],
                      destination: 'Kashmir' as any,
                      detailsAvailable: true,
                      link: '/travel',
                    });
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#1D493E] hover:bg-[#15342c] text-white rounded-xl text-xs font-bold uppercase transition cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Add Tour Package
                </button>
              </div>

              <div className="bg-white border border-[#E5E0D5] rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs text-[#2B2B2B]">
                  <thead className="bg-[#FAF9F6] border-b border-[#E5E0D5] text-[11px] uppercase font-bold text-[#1D493E] tracking-wider font-sans">
                    <tr>
                      <th className="px-6 py-4">Package</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Duration</th>
                      <th className="px-6 py-4">Destination</th>
                      <th className="px-6 py-4">Home Showcase</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {packages.map(pkg => (
                      <tr key={pkg.id} className={`hover:bg-[#1D493E]/[0.02] transition ${pkg.hidden ? 'opacity-60 bg-gray-50' : ''}`}>
                        <td className="px-6 py-4 font-bold text-[#2B2B2B]">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl overflow-hidden bg-[#12382F] border border-[#1D493E] flex items-center justify-center shrink-0 text-white font-extrabold text-xs tracking-wider shadow-xs relative">
                              <span>GB</span>
                              {pkg.image && (
                                <img
                                  src={pkg.image}
                                  alt={pkg.name}
                                  className="absolute inset-0 w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span>{pkg.name || 'Untitled Package'}</span>
                              {pkg.hidden && (
                                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold rounded-md uppercase tracking-wider">
                                  Hidden
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[#1D493E] font-bold font-sans">₹{pkg.price.toLocaleString()}</td>
                        <td className="px-6 py-4 text-[#8D8D8D] font-medium">{pkg.duration}</td>
                        <td className="px-6 py-4 text-[#8D8D8D] capitalize font-medium">{pkg.destination || 'General'}</td>
                        <td className="px-6 py-4">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={pkg.showOnHome === true}
                              onChange={(e) => {
                                const show = e.target.checked;
                                const updated = packages.map(p => p.id === pkg.id ? { ...p, showOnHome: show } : p);
                                setPackages(updated);
                                localStorage.setItem('gb_admin_packages', JSON.stringify(updated));
                                syncCatalogToApi({ packages: updated });
                                if (typeof window !== 'undefined') {
                                  window.dispatchEvent(new CustomEvent('gb_packages_updated', { detail: updated }));
                                }
                                showToast(`${show ? 'Showcasing' : 'Hidden from'} Homepage: "${pkg.name}"`);
                              }}
                              className="w-4 h-4 text-[#1D493E] accent-[#1D493E] rounded"
                            />
                            <span className={`text-[11px] font-bold ${pkg.showOnHome === true ? 'text-[#1D493E]' : 'text-gray-400'}`}>
                              {pkg.showOnHome === true ? 'Featured' : 'Off'}
                            </span>
                          </label>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                const isHiddenNow = !pkg.hidden;
                                const updated = packages.map(p => p.id === pkg.id ? { ...p, hidden: isHiddenNow } : p);
                                setPackages(updated);
                                localStorage.setItem('gb_admin_packages', JSON.stringify(updated));
                                syncCatalogToApi({ packages: updated });
                                if (typeof window !== 'undefined') {
                                  window.dispatchEvent(new CustomEvent('gb_packages_updated', { detail: updated }));
                                }
                                showToast(isHiddenNow ? `🙈 Hidden "${pkg.name}" from public site` : `👁️ Unhidden "${pkg.name}" on public site`);
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                                pkg.hidden
                                  ? 'bg-amber-100 hover:bg-amber-600 text-amber-900 hover:text-white border border-amber-300'
                                  : 'bg-slate-100 hover:bg-slate-700 text-slate-700 hover:text-white border border-slate-200'
                              }`}
                            >
                              {pkg.hidden ? (
                                <>
                                  <Eye className="w-3.5 h-3.5" /> Unhide
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3.5 h-3.5" /> Hide
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => setEditingPkg({ ...pkg })}
                              className="px-3 py-1.5 bg-[#1D493E]/10 hover:bg-[#1D493E] text-[#1D493E] hover:text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button
                              onClick={() => {
                                const updated = packages.filter(p => p.id !== pkg.id);
                                setPackages(updated);
                                localStorage.setItem('gb_admin_packages', JSON.stringify(updated));
                                showToast('Package removed!');
                              }}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
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
                <h2 className="text-base font-bold text-[#1D493E]">Shop Inventory Products ({products.length})</h2>
                <button
                  onClick={() => {
                    setEditingProd({
                      id: `prod-${Date.now()}`,
                      name: '',
                      price: 499,
                      originalPrice: 799,
                      description: '',
                      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=500&q=80',
                      category: 'lifestyle',
                      rating: 4.9,
                      inStock: true,
                    });
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#FF623E] hover:bg-[#e04a29] text-white rounded-xl text-xs font-bold uppercase transition cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              </div>

              {/* Filter Bar */}
              <div className="flex flex-wrap items-center gap-3 p-4 bg-[#FAF9F6] border border-[#E5E0D5] rounded-2xl">
                <span className="text-[11px] font-bold text-[#1D493E] uppercase tracking-wider shrink-0">Filter by:</span>

                {/* Category Filter */}
                <div className="flex flex-col gap-0.5">
                  <label className="text-[10px] font-bold text-[#8D8D8D] uppercase tracking-wider">Category</label>
                  <select
                    value={prodFilterCategory}
                    onChange={(e) => setProdFilterCategory(e.target.value)}
                    className="p-2 pr-6 bg-white border border-[#E5E0D5] rounded-lg text-xs text-[#2B2B2B] font-bold focus:outline-none focus:border-[#1D493E] cursor-pointer min-w-[140px]"
                  >
                    <option value="">All Categories</option>
                    {Array.from(new Set(products.map(p => p.category).filter(Boolean))).sort().map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Section Filter */}
                <div className="flex flex-col gap-0.5">
                  <label className="text-[10px] font-bold text-[#8D8D8D] uppercase tracking-wider">Placement Section</label>
                  <select
                    value={prodFilterSection}
                    onChange={(e) => setProdFilterSection(e.target.value)}
                    className="p-2 pr-6 bg-white border border-[#E5E0D5] rounded-lg text-xs text-[#2B2B2B] font-bold focus:outline-none focus:border-[#1D493E] cursor-pointer min-w-[180px]"
                  >
                    <option value="">All Sections</option>
                    <option value="deals">Trending Adventure Deals</option>
                    <option value="most-selling">Most Selling Products</option>
                    <option value="new-arrivals">New Arrivals</option>
                    <option value="travel-essentials">Travels Essentials</option>
                    <option value="limited-edition">Limited Edition</option>
                    <option value="discount-sale">25% to 50% Discount Sale</option>
                    {(cms.homeCustomSections || []).map((sec, idx) => (
                      <option key={sec.id || idx} value={sec.id}>
                        Custom: {sec.title || sec.tag || `Section #${idx + 1}`}
                      </option>
                    ))}
                  </select>
                </div>



                {/* Clear Filters */}
                {(prodFilterCategory || prodFilterSection) && (
                  <button
                    onClick={() => { setProdFilterCategory(''); setProdFilterSection(''); }}
                    className="mt-4 px-3 py-2 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-lg text-xs font-bold transition cursor-pointer border border-rose-200"
                  >
                    Clear Filters
                  </button>
                )}

                <span className="ml-auto text-[11px] text-[#8D8D8D] font-medium">
                  Showing {products.filter(p =>
                    (!prodFilterCategory || p.category === prodFilterCategory) &&
                    (!prodFilterSection || (p.section || 'deals') === prodFilterSection)
                  ).length} of {products.length} products
                </span>
              </div>

              <div className="bg-white border border-[#E5E0D5] rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs text-[#2B2B2B]">
                  <thead className="bg-[#FAF9F6] border-b border-[#E5E0D5] text-[11px] uppercase font-bold text-[#1D493E] tracking-wider font-sans">
                    <tr>
                      <th className="px-6 py-4">Product Name</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Section & Page</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(() => {
                      const filteredProds = products.filter(p =>
                        (!prodFilterCategory || p.category === prodFilterCategory) &&
                        (!prodFilterSection || (p.section || 'deals') === prodFilterSection)
                      );
                      return filteredProds.map((prod, idx) => {
                        const isNearBottom = idx >= Math.max(0, filteredProds.length - 3);

                        return (
                          <tr key={prod.id} className={`hover:bg-[#1D493E]/[0.02] transition ${prod.hidden ? 'opacity-60 bg-gray-50' : ''}`}>
                            <td className="px-6 py-4 font-bold text-[#2B2B2B]">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl overflow-hidden bg-[#12382F] border border-[#1D493E] flex items-center justify-center shrink-0 text-white font-extrabold text-xs tracking-wider shadow-xs relative">
                                  <span>GB</span>
                                  {prod.image && (
                                    <img
                                      src={prod.image}
                                      alt={prod.name}
                                      className="absolute inset-0 w-full h-full object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLElement).style.display = 'none';
                                      }}
                                    />
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span>{prod.name || 'Untitled Product'}</span>
                                  {prod.hidden && (
                                    <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold rounded-md uppercase tracking-wider">
                                      Hidden
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-[#8D8D8D] capitalize font-medium">{prod.category}</td>
                            <td className="px-6 py-4">
                              {/* Multi-Tick Section Dropdown */}
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() => setOpenMultiSectionProdId(openMultiSectionProdId === prod.id ? null : prod.id)}
                                  className="p-2 bg-[#FAF9F6] border border-[#E5E0D5] hover:border-[#1D493E] rounded-xl text-xs text-[#1D493E] font-bold flex items-center justify-between gap-2 cursor-pointer min-w-[180px] max-w-[240px]"
                                >
                                  <span className="truncate">
                                    {(() => {
                                      const activeSecs = Array.from(new Set([prod.section || 'deals', ...(prod.sections || [])])).filter(Boolean);
                                      const sectionLabels: Record<string, string> = {
                                        'deals': 'Trending Adventure Deals',
                                        'most-selling': 'Most Selling Products',
                                        'new-arrivals': 'New Arrivals',
                                        'travel-essentials': 'Travels Essentials',
                                        'limited-edition': 'Limited Edition',
                                        'discount-sale': '25% to 50% Discount Sale'
                                      };
                                      const firstLabel = sectionLabels[activeSecs[0]] || activeSecs[0];
                                      if (activeSecs.length <= 1) return firstLabel;
                                      return `✓ ${firstLabel} (+${activeSecs.length - 1})`;
                                    })()}
                                  </span>
                                  <ChevronDown className="w-3.5 h-3.5 shrink-0 text-[#1D493E]" />
                                </button>

                                {/* Checkbox Popover */}
                                {openMultiSectionProdId === prod.id && (
                                  <div className={`absolute left-0 w-64 bg-white border border-[#E5E0D5] rounded-2xl shadow-2xl z-50 p-3 space-y-1 text-xs ${
                                    isNearBottom ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
                                  }`}>
                                <div className="text-[10px] font-bold text-[#8D8D8D] uppercase tracking-wider px-2 py-1 border-b border-gray-100 flex items-center justify-between">
                                  <span>Select Sections (Multi-Tick)</span>
                                  <button type="button" onClick={() => setOpenMultiSectionProdId(null)} className="text-gray-400 hover:text-gray-600 font-bold text-sm">✕</button>
                                </div>

                                <div className="max-h-56 overflow-y-auto space-y-1 pt-1 pr-1">
                                  {[
                                    { id: 'deals', label: 'Trending Adventure Deals' },
                                    { id: 'most-selling', label: 'Most Selling Products' },
                                    { id: 'new-arrivals', label: 'New Arrivals' },
                                    { id: 'travel-essentials', label: 'Travels Essentials' },
                                    { id: 'limited-edition', label: 'Limited Edition' },
                                    { id: 'discount-sale', label: '25% to 50% Discount Sale' },
                                    ...(cms.homeCustomSections || []).map((sec, idx) => ({
                                      id: sec.id || `custom-${idx}`,
                                      label: `Custom: ${sec.title || sec.tag || `Section #${idx + 1}`}`
                                    }))
                                  ].map((secItem) => {
                                    const currentSecs = new Set([prod.section || 'deals', ...(prod.sections || [])]);
                                    const isChecked = currentSecs.has(secItem.id);

                                    return (
                                      <label
                                        key={secItem.id}
                                        className="flex items-center gap-2.5 px-2.5 py-1.5 hover:bg-[#1D493E]/[0.06] rounded-lg cursor-pointer transition text-[#2B2B2B]"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={isChecked}
                                          onChange={(e) => {
                                            if (e.target.checked && secItem.id === 'most-selling') {
                                              const currentCount = products.filter(p => p.id !== prod.id && (p.section === 'most-selling' || (Array.isArray(p.sections) && p.sections.includes('most-selling')) || p.isMostSelling)).length;
                                              if (currentCount >= 8) {
                                                showToast("⚠️ Maximum 8 products allowed for Most Selling Products!", "error");
                                                return;
                                              }
                                            }

                                            const nextSecsSet = new Set(currentSecs);
                                            if (e.target.checked) {
                                              nextSecsSet.add(secItem.id);
                                            } else {
                                              if (nextSecsSet.size > 1) {
                                                nextSecsSet.delete(secItem.id);
                                              }
                                            }
                                            const nextSecsArr = Array.from(nextSecsSet);
                                            const primarySec = nextSecsArr[0] || 'deals';

                                            const updated = products.map(p => p.id === prod.id ? {
                                              ...p,
                                              section: primarySec,
                                              sections: nextSecsArr,
                                              isBestDeal: nextSecsSet.has('deals'),
                                              isMostSelling: nextSecsSet.has('most-selling'),
                                              isNewArrival: nextSecsSet.has('new-arrivals'),
                                              isTravelEssential: nextSecsSet.has('travel-essentials'),
                                              isLimitedEdition: nextSecsSet.has('limited-edition'),
                                              isDiscountSale: nextSecsSet.has('discount-sale')
                                            } : p);

                                            setProducts(updated);
                                            localStorage.setItem('gb_admin_products_v3', JSON.stringify(updated));
                                            localStorage.setItem('gb_admin_products', JSON.stringify(updated));
                                            if (typeof window !== 'undefined') {
                                              window.dispatchEvent(new CustomEvent('gb_products_updated', { detail: updated }));
                                            }
                                          }}
                                          className="w-4 h-4 rounded border-gray-300 accent-[#1D493E] cursor-pointer shrink-0"
                                        />
                                        <span className={`font-medium leading-tight ${isChecked ? 'font-bold text-[#1D493E]' : 'text-gray-700'}`}>
                                          {secItem.label}
                                        </span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-[#1D493E] font-bold font-sans">₹{prod.price}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                const isHiddenNow = !prod.hidden;
                                const updated = products.map(p => p.id === prod.id ? { ...p, hidden: isHiddenNow } : p);
                                setProducts(updated);
                                localStorage.setItem('gb_admin_products_v3', JSON.stringify(updated));
                                localStorage.setItem('gb_admin_products', JSON.stringify(updated));
                                if (typeof window !== 'undefined') {
                                  window.dispatchEvent(new CustomEvent('gb_products_updated', { detail: updated }));
                                }
                                showToast(isHiddenNow ? `🙈 Hidden "${prod.name}" from store` : `👁️ Unhidden "${prod.name}" on store`);
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                                prod.hidden
                                  ? 'bg-amber-100 hover:bg-amber-600 text-amber-900 hover:text-white border border-amber-300'
                                  : 'bg-slate-100 hover:bg-slate-700 text-slate-700 hover:text-white border border-slate-200'
                              }`}
                            >
                              {prod.hidden ? (
                                <>
                                  <Eye className="w-3.5 h-3.5" /> Unhide
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3.5 h-3.5" /> Hide
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => setEditingProd({ ...prod })}
                              className="px-3 py-1.5 bg-[#1D493E]/10 hover:bg-[#1D493E] text-[#1D493E] hover:text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button
                              onClick={() => {
                                const updated = products.filter(p => p.id !== prod.id);
                                setProducts(updated);
                                localStorage.setItem('gb_admin_products_v3', JSON.stringify(updated));
                                localStorage.setItem('gb_admin_products', JSON.stringify(updated));
                                showToast('Product removed!');
                              }}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  });
                })()}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* EDIT PRODUCT MODAL */}
          {editingProd && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 text-left">
              <div className="bg-white border border-[#E5E0D5] rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-[#E5E0D5] pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#1D493E]">Edit Product Details</h3>
                    <p className="text-xs text-gray-500 font-medium">Update basic info, specifications grid, reviews, and FAQs</p>
                  </div>
                  <button
                    onClick={() => setEditingProd(null)}
                    className="text-[#8D8D8D] hover:text-[#2B2B2B] font-bold text-sm cursor-pointer p-1"
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Tabs Container */}
                <div className="flex gap-2 p-1.5 bg-[#FAF9F6] border border-[#E5E0D5] rounded-xl overflow-x-auto">
                  {[
                    { id: 'basic', label: '1. Basic Info' },
                    { id: 'specs', label: '2. Specifications' },
                    { id: 'reviews', label: '3. Reviews' },
                    { id: 'faqs', label: '4. FAQs' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveProdEditorTab(tab.id as any)}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                        activeProdEditorTab === tab.id
                          ? 'bg-[#1D493E] text-white shadow-xs'
                          : 'text-[#2B2B2B] hover:bg-gray-200/60'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSaveEditedProduct} className="space-y-5">
                  {/* TAB 1: BASIC INFO */}
                  {activeProdEditorTab === 'basic' && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-[#1D493E] uppercase font-sans tracking-wider">Product Name</label>
                        <input
                          type="text"
                          required
                          value={editingProd.name}
                          onChange={(e) => setEditingProd({ ...editingProd, name: e.target.value })}
                          className="w-full p-3 bg-[#FAF9F6] border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-[#1D493E] uppercase font-sans tracking-wider">Selling Price (₹)</label>
                          <input
                            type="number"
                            required
                            value={editingProd.price}
                            onChange={(e) => setEditingProd({ ...editingProd, price: parseFloat(e.target.value) || 0 })}
                            className="w-full p-3 bg-[#FAF9F6] border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-[#1D493E] uppercase font-sans tracking-wider">Original Price (₹)</label>
                          <input
                            type="number"
                            value={editingProd.originalPrice || ''}
                            onChange={(e) => setEditingProd({ ...editingProd, originalPrice: parseFloat(e.target.value) || 0 })}
                            className="w-full p-3 bg-[#FAF9F6] border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-[#1D493E] uppercase font-sans tracking-wider flex items-center justify-between">
                          <span>Category</span>
                          <span className="text-[10px] text-[#8D8D8D] font-normal">Select or type custom</span>
                        </label>
                        <div className="space-y-2">
                          <select
                            value={['Badges', 'Slippers', 'Key Chains', 'Travel Pillows', 'Backpacks', 'Passport Covers', 'Stickers', 'T-Shirts', 'Lifestyle'].includes(editingProd.category) ? editingProd.category : '__custom__'}
                            onChange={(e) => {
                              if (e.target.value !== '__custom__') {
                                setEditingProd({ ...editingProd, category: e.target.value });
                              }
                            }}
                            className="w-full p-3 bg-[#FAF9F6] border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                          >
                            <option value="Badges">Badges & Pins</option>
                            <option value="Slippers">Slippers & Footwear</option>
                            <option value="Key Chains">Key Chains & Accessories</option>
                            <option value="Travel Pillows">Travel Pillows</option>
                            <option value="Backpacks">Backpacks & Outdoor Bags</option>
                            <option value="Passport Covers">Passport Covers</option>
                            <option value="Stickers">Stickers</option>
                            <option value="T-Shirts">T-Shirts & Apparel</option>
                            <option value="Lifestyle">Lifestyle</option>
                            <option value="__custom__">+ Add Custom Category Below...</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Type Custom Product Category (e.g. Camping Gear)"
                            value={editingProd.category}
                            onChange={(e) => setEditingProd({ ...editingProd, category: e.target.value })}
                            className="w-full p-3 bg-[#FAF9F6] border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-[#1D493E] uppercase font-sans tracking-wider flex items-center justify-between">
                          <span>Target Section</span>
                          <span className="text-[10px] text-[#8D8D8D] font-normal">Which section on website</span>
                        </label>
                        <select
                          value={editingProd.section || 'deals'}
                          onChange={(e) => {
                            const s = e.target.value;
                            setEditingProd({
                              ...editingProd,
                              section: s,
                              isBestDeal: s === 'deals',
                              isMostSelling: s === 'most-selling',
                              isNewArrival: s === 'new-arrivals',
                              isTravelEssential: s === 'travel-essentials',
                              isLimitedEdition: s === 'limited-edition',
                              isDiscountSale: s === 'discount-sale'
                            });
                          }}
                          className="w-full p-3 bg-[#FAF9F6] border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                        >
                          <option value="deals">Trending Adventure Deals</option>
                          <option value="most-selling">Most Selling Products</option>
                          <option value="new-arrivals">New Arrivals</option>
                          <option value="travel-essentials">Travels Essentials</option>
                          <option value="limited-edition">Limited Edition</option>
                          <option value="discount-sale">25% to 50% Discount Sale</option>
                          {(cms.homeCustomSections || []).map((sec, idx) => (
                            <option key={sec.id || idx} value={sec.id}>
                              Custom: {sec.title || sec.tag || `Section #${idx + 1}`}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-[#1D493E] uppercase font-sans tracking-wider flex items-center justify-between">
                          <span>Page Location</span>
                          <span className="text-[10px] text-[#8D8D8D] font-normal">Home, Shop, or Both</span>
                        </label>
                        <select
                          value={editingProd.pageLocation || 'both'}
                          onChange={(e) => setEditingProd({ ...editingProd, pageLocation: e.target.value as 'home' | 'shop' | 'both' })}
                          className="w-full p-3 bg-[#EEF7F4] border border-[#1D493E]/40 rounded-xl text-xs text-[#1D493E] font-bold focus:outline-none focus:border-[#1D493E]"
                        >
                          <option value="both">Home &amp; Shop (Both Pages)</option>
                          <option value="home">Home Page Only</option>
                          <option value="shop">Shop Page Only</option>
                        </select>
                        <p className="text-[10px] text-[#8D8D8D] mt-1">Controls where this product&apos;s section appears across the website.</p>
                      </div>

                      <div className="space-y-2 pt-1">
                        <label className="text-[11px] font-bold text-[#1D493E] uppercase font-sans tracking-wider">Promotional Placement Badges</label>
                        <div className="grid grid-cols-2 gap-2 text-xs text-[#2B2B2B]">
                          <label className="flex items-center gap-2 p-2.5 bg-[#FAF9F6] border border-[#E5E0D5] rounded-xl cursor-pointer hover:border-[#1D493E]">
                            <input
                              type="checkbox"
                              checked={editingProd.isBestDeal !== false}
                              onChange={(e) => setEditingProd({ ...editingProd, isBestDeal: e.target.checked })}
                              className="w-4 h-4 text-[#1D493E] accent-[#1D493E] rounded"
                            />
                            <span className="font-bold">Today's Best Deal</span>
                          </label>
                          <label className="flex items-center gap-2 p-2.5 bg-[#FAF9F6] border border-[#E5E0D5] rounded-xl cursor-pointer hover:border-[#1D493E]">
                            <input
                              type="checkbox"
                              checked={editingProd.isMostSelling !== false}
                              onChange={(e) => setEditingProd({ ...editingProd, isMostSelling: e.target.checked })}
                              className="w-4 h-4 text-[#1D493E] accent-[#1D493E] rounded"
                            />
                            <span className="font-bold">Most Selling</span>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-[#1D493E] uppercase font-sans tracking-wider flex items-center justify-between">
                          <span>Cover Image</span>
                          <span className="text-[10px] text-[#8D8D8D] font-normal">URL or Local Upload</span>
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Paste image URL (https://...)"
                            value={editingProd.image}
                            onChange={(e) => setEditingProd({ ...editingProd, image: e.target.value })}
                            className="flex-1 p-3 bg-[#FAF9F6] border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                          />
                          <label className="px-4 py-3 bg-[#1D493E]/10 hover:bg-[#1D493E] text-[#1D493E] hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0">
                            <Upload className="w-4 h-4" />
                            <span>Upload Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (uploadEvt) => {
                                    const res = uploadEvt.target?.result as string;
                                    if (res) setEditingProd({ ...editingProd, image: res });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        </div>
                        {editingProd.image && (
                          <div className="relative w-full h-32 rounded-xl overflow-hidden border border-[#E5E0D5] bg-[#FAF9F6]">
                            <img src={editingProd.image} alt="Product Preview" className="w-full h-full object-cover" />
                            <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 text-white text-[10px] font-bold rounded-md">
                              Preview
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-[#1D493E] uppercase font-sans tracking-wider">Product Overview / Description</label>
                        <textarea
                          rows={4}
                          value={editingProd.description}
                          onChange={(e) => setEditingProd({ ...editingProd, description: e.target.value })}
                          placeholder="Write rich overview description..."
                          className="w-full p-3 bg-[#FAF9F6] border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B] focus:outline-none focus:border-[#1D493E] resize-none"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          id="inStockCheck"
                          checked={editingProd.inStock !== false}
                          onChange={(e) => setEditingProd({ ...editingProd, inStock: e.target.checked })}
                          className="w-4 h-4 text-[#1D493E] accent-[#1D493E] rounded"
                        />
                        <label htmlFor="inStockCheck" className="text-xs font-bold text-[#2B2B2B] cursor-pointer">In Stock & Ready to Buy</label>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: SPECIFICATIONS & HIGHLIGHTS */}
                  {activeProdEditorTab === 'specs' && (
                    <div className="space-y-6">
                      {/* Part A: Specifications Grid */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-[#1D493E] uppercase tracking-wider">Product Specifications Grid</label>
                          <button
                            type="button"
                            onClick={() => {
                              const defaultSpecs = [
                                { label: 'DIAMETER', value: '1.25 Inches' },
                                { label: 'MATERIAL', value: 'Premium Zinc Alloy' },
                                { label: 'CLASP', value: 'Butterfly Clutch' },
                                { label: 'FINISH', value: 'Hard Enamel Gloss' }
                              ];
                              const cur = editingProd.specs || defaultSpecs;
                              setEditingProd({
                                ...editingProd,
                                specs: [...cur, { label: 'FEATURE', value: 'Value' }]
                              });
                            }}
                            className="px-3 py-1.5 bg-[#1D493E] text-white rounded-lg text-xs font-bold hover:bg-[#15342c] transition cursor-pointer"
                          >
                            + Add Specification
                          </button>
                        </div>

                        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                          {(editingProd.specs || [
                            { label: 'DIAMETER', value: '1.25 Inches' },
                            { label: 'MATERIAL', value: 'Premium Zinc Alloy' },
                            { label: 'CLASP', value: 'Butterfly Clutch' },
                            { label: 'FINISH', value: 'Hard Enamel Gloss' }
                          ]).map((spec: any, idx: number) => (
                            <div key={idx} className="flex gap-2 items-center bg-[#FAF9F6] p-2.5 border border-[#E5E0D5] rounded-xl">
                              <input
                                type="text"
                                placeholder="Label (e.g. DIAMETER)"
                                value={spec.label}
                                onChange={(e) => {
                                  const cur = editingProd.specs || [
                                    { label: 'DIAMETER', value: '1.25 Inches' },
                                    { label: 'MATERIAL', value: 'Premium Zinc Alloy' },
                                    { label: 'CLASP', value: 'Butterfly Clutch' },
                                    { label: 'FINISH', value: 'Hard Enamel Gloss' }
                                  ];
                                  const updated = [...cur];
                                  updated[idx].label = e.target.value;
                                  setEditingProd({ ...editingProd, specs: updated });
                                }}
                                className="w-1/3 p-2 bg-white border border-[#E5E0D5] rounded-lg text-xs text-[#2B2B2B] font-bold focus:outline-none focus:border-[#1D493E]"
                              />
                              <input
                                type="text"
                                placeholder="Value (e.g. 1.25 Inches)"
                                value={spec.value}
                                onChange={(e) => {
                                  const cur = editingProd.specs || [
                                    { label: 'DIAMETER', value: '1.25 Inches' },
                                    { label: 'MATERIAL', value: 'Premium Zinc Alloy' },
                                    { label: 'CLASP', value: 'Butterfly Clutch' },
                                    { label: 'FINISH', value: 'Hard Enamel Gloss' }
                                  ];
                                  const updated = [...cur];
                                  updated[idx].value = e.target.value;
                                  setEditingProd({ ...editingProd, specs: updated });
                                }}
                                className="flex-1 p-2 bg-white border border-[#E5E0D5] rounded-lg text-xs text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const cur = editingProd.specs || [
                                    { label: 'DIAMETER', value: '1.25 Inches' },
                                    { label: 'MATERIAL', value: 'Premium Zinc Alloy' },
                                    { label: 'CLASP', value: 'Butterfly Clutch' },
                                    { label: 'FINISH', value: 'Hard Enamel Gloss' }
                                  ];
                                  const updated = cur.filter((_: any, i: number) => i !== idx);
                                  setEditingProd({ ...editingProd, specs: updated });
                                }}
                                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg text-xs font-bold cursor-pointer"
                                title="Remove Spec"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Part B: Product Highlights */}
                      <div className="space-y-3 pt-4 border-t border-[#E5E0D5]">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-[#FF623E] uppercase tracking-wider">Product Highlights (Bullet Points)</label>
                          <button
                            type="button"
                            onClick={() => {
                              const defaultHighlights = [
                                'Hand-crafted premium quality finish',
                                'Weatherproof and ultra-durable materials',
                                'Designed for digital nomads and explorers',
                                '100% authentic Banjāra Originals gear'
                              ];
                              const cur = editingProd.highlights || defaultHighlights;
                              setEditingProd({
                                ...editingProd,
                                highlights: [...cur, 'New Highlight Feature']
                              });
                            }}
                            className="px-3 py-1.5 bg-[#FF623E] text-white rounded-lg text-xs font-bold hover:bg-[#e05332] transition cursor-pointer"
                          >
                            + Add Highlight Point
                          </button>
                        </div>

                        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                          {(editingProd.highlights || [
                            'Hand-crafted premium quality finish',
                            'Weatherproof and ultra-durable materials',
                            'Designed for digital nomads and explorers',
                            '100% authentic Banjāra Originals gear'
                          ]).map((hl: string, idx: number) => (
                            <div key={idx} className="flex gap-2 items-center bg-[#FAF9F6] p-2.5 border border-[#E5E0D5] rounded-xl">
                              <span className="text-[#1D493E] font-bold text-xs">✓</span>
                              <input
                                type="text"
                                placeholder="Highlight feature text..."
                                value={hl}
                                onChange={(e) => {
                                  const defaultHighlights = [
                                    'Hand-crafted premium quality finish',
                                    'Weatherproof and ultra-durable materials',
                                    'Designed for digital nomads and explorers',
                                    '100% authentic Banjāra Originals gear'
                                  ];
                                  const list = [...(editingProd.highlights || defaultHighlights)];
                                  list[idx] = e.target.value;
                                  setEditingProd({ ...editingProd, highlights: list });
                                }}
                                className="flex-1 p-2 bg-white border border-[#E5E0D5] rounded-lg text-xs text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const defaultHighlights = [
                                    'Hand-crafted premium quality finish',
                                    'Weatherproof and ultra-durable materials',
                                    'Designed for digital nomads and explorers',
                                    '100% authentic Banjāra Originals gear'
                                  ];
                                  const list = (editingProd.highlights || defaultHighlights).filter((_: any, i: number) => i !== idx);
                                  setEditingProd({ ...editingProd, highlights: list });
                                }}
                                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg text-xs font-bold cursor-pointer"
                                title="Remove Highlight"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: CUSTOMER REVIEWS */}
                  {activeProdEditorTab === 'reviews' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-[#1D493E] uppercase tracking-wider">Customer Reviews</label>
                        <button
                          type="button"
                          onClick={() => {
                            const cur = editingProd.reviewsList || [
                              { id: "1", author: "Aditya Verma", date: "2 weeks ago", rating: 5, title: "Exceptional quality and vibe!", comment: "Bought this for my last Spiti trip and it exceeded all expectations. Extremely high durability, looks super clean on my travel rucksack. Absolutely loved it!" }
                            ];
                            setEditingProd({
                              ...editingProd,
                              reviewsList: [
                                ...cur,
                                { id: String(Date.now()), author: 'New Customer', date: 'Just now', rating: 5, title: 'Loved this product!', comment: 'Superb quality and packaging.' }
                              ]
                            });
                          }}
                          className="px-3 py-1.5 bg-[#1D493E] text-white rounded-lg text-xs font-bold hover:bg-[#15342c] transition cursor-pointer"
                        >
                          + Add Review
                        </button>
                      </div>

                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                        {(editingProd.reviewsList || [
                          { id: "1", author: "Aditya Verma", date: "2 weeks ago", rating: 5, title: "Exceptional quality and vibe!", comment: "Bought this for my last Spiti trip and it exceeded all expectations. Extremely high durability, looks super clean on my travel rucksack. Absolutely loved it!" },
                          { id: "2", author: "Sneha Roy", date: "1 month ago", rating: 5, title: "Perfect gift for travel lovers", comment: "The finish and color vibrance are top notch. Delivery was fast too. Will definitely purchase more products from Go Banjara!" }
                        ]).map((rev: any, idx: number) => (
                          <div key={idx} className="bg-[#FAF9F6] p-3 border border-[#E5E0D5] rounded-xl space-y-2 relative">
                            <button
                              type="button"
                              onClick={() => {
                                const cur = editingProd.reviewsList || [];
                                const updated = cur.filter((_: any, i: number) => i !== idx);
                                setEditingProd({ ...editingProd, reviewsList: updated });
                              }}
                              className="absolute top-2 right-2 text-rose-500 hover:bg-rose-50 p-1 rounded-md text-xs font-bold cursor-pointer"
                            >
                              ✕
                            </button>
                            <div className="grid grid-cols-3 gap-2">
                              <input
                                type="text"
                                placeholder="Author Name"
                                value={rev.author}
                                onChange={(e) => {
                                  const list = [...(editingProd.reviewsList || [])];
                                  list[idx] = { ...list[idx], author: e.target.value };
                                  setEditingProd({ ...editingProd, reviewsList: list });
                                }}
                                className="p-2 bg-white border border-[#E5E0D5] rounded-lg text-xs font-bold text-[#2B2B2B]"
                              />
                              <select
                                value={rev.rating}
                                onChange={(e) => {
                                  const list = [...(editingProd.reviewsList || [])];
                                  list[idx] = { ...list[idx], rating: Number(e.target.value) };
                                  setEditingProd({ ...editingProd, reviewsList: list });
                                }}
                                className="p-2 bg-white border border-[#E5E0D5] rounded-lg text-xs font-bold text-[#2B2B2B]"
                              >
                                <option value={5}>5 Stars ⭐⭐⭐⭐⭐</option>
                                <option value={4}>4 Stars ⭐⭐⭐⭐</option>
                                <option value={3}>3 Stars ⭐⭐⭐</option>
                                <option value={2}>2 Stars ⭐⭐</option>
                                <option value={1}>1 Star ⭐</option>
                              </select>
                              <input
                                type="text"
                                placeholder="Date (e.g. 2 weeks ago)"
                                value={rev.date}
                                onChange={(e) => {
                                  const list = [...(editingProd.reviewsList || [])];
                                  list[idx] = { ...list[idx], date: e.target.value };
                                  setEditingProd({ ...editingProd, reviewsList: list });
                                }}
                                className="p-2 bg-white border border-[#E5E0D5] rounded-lg text-xs text-[#2B2B2B]"
                              />
                            </div>
                            <input
                              type="text"
                              placeholder="Review Title"
                              value={rev.title}
                              onChange={(e) => {
                                const list = [...(editingProd.reviewsList || [])];
                                list[idx] = { ...list[idx], title: e.target.value };
                                setEditingProd({ ...editingProd, reviewsList: list });
                              }}
                              className="w-full p-2 bg-white border border-[#E5E0D5] rounded-lg text-xs font-bold text-[#2B2B2B]"
                            />
                            <textarea
                              rows={2}
                              placeholder="Review comment text..."
                              value={rev.comment || rev.content || ''}
                              onChange={(e) => {
                                const list = [...(editingProd.reviewsList || [])];
                                list[idx] = { ...list[idx], comment: e.target.value };
                                setEditingProd({ ...editingProd, reviewsList: list });
                              }}
                              className="w-full p-2 bg-white border border-[#E5E0D5] rounded-lg text-xs text-[#2B2B2B] resize-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 4: PRODUCT FAQS */}
                  {activeProdEditorTab === 'faqs' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-[#1D493E] uppercase tracking-wider">Product FAQs</label>
                        <button
                          type="button"
                          onClick={() => {
                            const defaultFaqs = [
                              { question: "What materials are the products made from?", answer: "We source only premium-grade, durable materials. Badges are made of zinc-alloy with glossy enamel; apparel is 100% organic cotton; and bags/covers are made of rugged, weatherproof canvas and genuine leather." },
                              { question: "Is cash on delivery (COD) available?", answer: "Yes, COD is available for all products across India. You can choose COD during checkout." }
                            ];
                            const cur = editingProd.faqsList || defaultFaqs;
                            setEditingProd({
                              ...editingProd,
                              faqsList: [
                                ...cur,
                                { question: 'New Question?', answer: 'Detailed answer goes here.' }
                              ]
                            });
                          }}
                          className="px-3 py-1.5 bg-[#1D493E] text-white rounded-lg text-xs font-bold hover:bg-[#15342c] transition cursor-pointer"
                        >
                          + Add FAQ
                        </button>
                      </div>

                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                        {(editingProd.faqsList || [
                          { question: "What materials are the products made from?", answer: "We source only premium-grade, durable materials. Badges are made of zinc-alloy with glossy enamel; apparel is 100% organic cotton; and bags/covers are made of rugged, weatherproof canvas and genuine leather." },
                          { question: "Is cash on delivery (COD) available?", answer: "Yes, COD is available for all products across India. You can choose COD during checkout." },
                          { question: "What is your return & exchange policy?", answer: "We offer a hassle-free 7-day return and exchange policy. Items must be unused, in their original packaging with tags intact." }
                        ]).map((faq: any, idx: number) => (
                          <div key={idx} className="bg-[#FAF9F6] p-3 border border-[#E5E0D5] rounded-xl space-y-2 relative">
                            <button
                              type="button"
                              onClick={() => {
                                const cur = editingProd.faqsList || [];
                                const updated = cur.filter((_: any, i: number) => i !== idx);
                                setEditingProd({ ...editingProd, faqsList: updated });
                              }}
                              className="absolute top-2 right-2 text-rose-500 hover:bg-rose-50 p-1 rounded-md text-xs font-bold cursor-pointer"
                            >
                              ✕
                            </button>
                            <input
                              type="text"
                              placeholder="Question"
                              value={faq.question}
                              onChange={(e) => {
                                const list = [...(editingProd.faqsList || [])];
                                list[idx] = { ...list[idx], question: e.target.value };
                                setEditingProd({ ...editingProd, faqsList: list });
                              }}
                              className="w-full p-2 bg-white border border-[#E5E0D5] rounded-lg text-xs font-bold text-[#2B2B2B]"
                            />
                            <textarea
                              rows={2}
                              placeholder="Answer"
                              value={faq.answer}
                              onChange={(e) => {
                                const list = [...(editingProd.faqsList || [])];
                                list[idx] = { ...list[idx], answer: e.target.value };
                                setEditingProd({ ...editingProd, faqsList: list });
                              }}
                              className="w-full p-2 bg-white border border-[#E5E0D5] rounded-lg text-xs text-[#2B2B2B] resize-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E0D5]">
                    <button
                      type="button"
                      onClick={() => setEditingProd(null)}
                      className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#2B2B2B] rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#1D493E] hover:bg-[#15342c] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Save className="w-4 h-4" /> {products.some(p => p.id === editingProd.id) ? 'Save Changes' : 'Add Product to Store'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* EDIT TOUR PACKAGE MODAL */}
          <PackageEditorModal
            isOpen={!!editingPkg}
            onClose={() => setEditingPkg(null)}
            packageData={editingPkg}
            onSave={handleSaveEditedPackage}
          />

          {/* TAB 7: GLOBAL SITE SETTINGS & BRANDING */}
          {activeTab === 'global_settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-black text-[#1D493E] flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#1D493E]" />
                  <span>Global Site Branding & Settings</span>
                </h2>
                <p className="text-xs text-[#6B7280] mt-1">Configure global announcements, logos, support channels, and footer information.</p>
              </div>

              <form onSubmit={handleSaveGlobalSettings} className="bg-white border border-[#E5E0D5] rounded-3xl p-6 sm:p-8 space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#6B7280] uppercase">Website Brand Name</label>
                    <input
                      type="text"
                      value={cms.global.siteName}
                      onChange={(e) => setCms(prev => ({ ...prev, global: { ...prev.global, siteName: e.target.value } }))}
                      className="w-full p-3 bg-white border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#6B7280] uppercase">Currency Symbol</label>
                    <input
                      type="text"
                      value={cms.global.currencySymbol}
                      onChange={(e) => setCms(prev => ({ ...prev, global: { ...prev.global, currencySymbol: e.target.value } }))}
                      className="w-full p-3 bg-white border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                    />
                  </div>
                </div>

                <div className="space-y-4 border-t border-emerald-900/30 pt-4">
                  <h4 className="text-xs font-black text-[#FF5A36] uppercase tracking-wider">Header Announcement Bar</h4>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-xs font-bold text-[#2B2B2B] cursor-pointer">
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
                    <label className="text-[10px] font-bold text-[#6B7280] uppercase">Announcement Text</label>
                    <input
                      type="text"
                      value={cms.global.announcementText}
                      onChange={(e) => setCms(prev => ({ ...prev, global: { ...prev.global, announcementText: e.target.value } }))}
                      className="w-full p-3 bg-white border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                    />
                  </div>
                </div>

                <div className="space-y-4 border-t border-emerald-900/30 pt-4">
                  <h4 className="text-xs font-black text-[#FF5A36] uppercase tracking-wider">Support & Social Links</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#6B7280] uppercase">Support Phone</label>
                      <input
                        type="text"
                        value={cms.global.supportPhone}
                        onChange={(e) => setCms(prev => ({ ...prev, global: { ...prev.global, supportPhone: e.target.value } }))}
                        className="w-full p-3 bg-white border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#6B7280] uppercase">Support Email</label>
                      <input
                        type="text"
                        value={cms.global.supportEmail}
                        onChange={(e) => setCms(prev => ({ ...prev, global: { ...prev.global, supportEmail: e.target.value } }))}
                        className="w-full p-3 bg-white border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#6B7280] uppercase">WhatsApp Number</label>
                      <input
                        type="text"
                        value={cms.global.whatsappNumber}
                        onChange={(e) => setCms(prev => ({ ...prev, global: { ...prev.global, whatsappNumber: e.target.value } }))}
                        className="w-full p-3 bg-white border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#6B7280] uppercase">Instagram URL</label>
                      <input
                        type="text"
                        value={cms.global.instagramUrl}
                        onChange={(e) => setCms(prev => ({ ...prev, global: { ...prev.global, instagramUrl: e.target.value } }))}
                        className="w-full p-3 bg-white border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#6B7280] uppercase">Facebook URL</label>
                      <input
                        type="text"
                        value={cms.global.facebookUrl}
                        onChange={(e) => setCms(prev => ({ ...prev, global: { ...prev.global, facebookUrl: e.target.value } }))}
                        className="w-full p-3 bg-white border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#6B7280] uppercase">YouTube URL</label>
                      <input
                        type="text"
                        value={cms.global.youtubeUrl}
                        onChange={(e) => setCms(prev => ({ ...prev, global: { ...prev.global, youtubeUrl: e.target.value } }))}
                        className="w-full p-3 bg-white border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
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

          {/* LIVE CUSTOMERS TAB */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-[#1D493E]">Registered Users & Customers</h2>
                  <p className="text-xs text-[#6B7280]">View and manage all user accounts signed up on the site.</p>
                </div>
                <button onClick={fetchLiveAdminData} className="p-2 bg-[#11231E] hover:bg-emerald-900 border border-emerald-900/40 rounded-xl transition cursor-pointer">
                  <RefreshCw className="w-4 h-4 text-[#1D493E]" />
                </button>
              </div>

              {isLiveLoading ? (
                <div className="text-center py-12 text-[#8D8D8D] text-xs">Loading users...</div>
              ) : liveUsers.length === 0 ? (
                <div className="text-center py-12 text-[#8D8D8D] text-xs">No users registered yet.</div>
              ) : (
                <div className="bg-white border border-[#E5E0D5] rounded-3xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#F0EDE8] text-[#1D493E] font-bold border-b border-[#E5E0D5]">
                          <th className="p-4">Name</th>
                          <th className="p-4">Email</th>
                          <th className="p-4">Phone</th>
                          <th className="p-4">Role</th>
                          <th className="p-4">Registered Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E0D5]">
                        {liveUsers.map((u) => (
                          <tr key={u.id} className="hover:bg-[#F6F3EE] transition">
                            <td className="p-4 font-bold text-[#2B2B2B]">{u.name || 'N/A'}</td>
                            <td className="p-4 text-[#6B7280] text-sm">{u.email}</td>
                            <td className="p-4">{u.phone || 'N/A'}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${u.role === 'ADMIN' ? 'bg-[#1D493E] text-white' : 'bg-[#F0EDE8] text-[#1D493E] border border-[#1D493E]/20'}`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="p-4 text-[#8D8D8D] text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LIVE ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-[#1D493E]">Merchandise Shop Orders</h2>
                  <p className="text-xs text-[#6B7280]">View and track all store purchases made by users.</p>
                </div>
                <button onClick={fetchLiveAdminData} className="p-2 bg-[#11231E] hover:bg-emerald-900 border border-emerald-900/40 rounded-xl transition cursor-pointer">
                  <RefreshCw className="w-4 h-4 text-[#1D493E]" />
                </button>
              </div>

              {isLiveLoading ? (
                <div className="text-center py-12 text-[#8D8D8D] text-xs">Loading orders...</div>
              ) : liveOrders.length === 0 ? (
                <div className="text-center py-12 text-[#8D8D8D] text-xs">No shop orders found.</div>
              ) : (
                <div className="bg-white border border-[#E5E0D5] rounded-3xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#F0EDE8] text-[#1D493E] font-bold border-b border-[#E5E0D5]">
                          <th className="p-4">Order ID</th>
                          <th className="p-4">Customer</th>
                          <th className="p-4">Items</th>
                          <th className="p-4">Total Amount</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E0D5]">
                        {liveOrders.map((o) => (
                          <tr key={o.id} className="hover:bg-[#F6F3EE] transition">
                            <td className="p-4 font-mono font-bold text-[#FF5A36]">#{o.id.slice(-6).toUpperCase()}</td>
                            <td className="p-4">
                              <div className="font-bold text-[#2B2B2B]">{o.user?.name || 'Guest User'}</div>
                              <div className="text-[10px] text-[#8D8D8D]">{o.user?.email}</div>
                            </td>
                            <td className="p-4 max-w-[200px] truncate">
                              {Array.isArray(o.items)
                                ? o.items.map((it: any) => `${it.name} (x${it.quantity})`).join(', ')
                                : 'No items'}
                            </td>
                            <td className="p-4 font-bold text-[#2B2B2B]">₹{(o.totalAmount || 0).toLocaleString()}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                o.status === 'DELIVERED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                o.status === 'SHIPPED' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' :
                                'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              }`}>
                                {o.status}
                              </span>
                            </td>
                            <td className="p-4 text-[#8D8D8D] text-sm">{new Date(o.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LIVE BOOKINGS TAB */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-[#1D493E]">Travel Package Bookings</h2>
                  <p className="text-xs text-[#6B7280]">View and manage all travel package booking transactions.</p>
                </div>
                <button onClick={fetchLiveAdminData} className="p-2 bg-[#11231E] hover:bg-emerald-900 border border-emerald-900/40 rounded-xl transition cursor-pointer">
                  <RefreshCw className="w-4 h-4 text-[#1D493E]" />
                </button>
              </div>

              {isLiveLoading ? (
                <div className="text-center py-12 text-[#8D8D8D] text-xs">Loading bookings...</div>
              ) : liveBookings.length === 0 ? (
                <div className="text-center py-12 text-[#8D8D8D] text-xs">No bookings found.</div>
              ) : (
                <div className="bg-white border border-[#E5E0D5] rounded-3xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#F0EDE8] text-[#1D493E] font-bold border-b border-[#E5E0D5]">
                          <th className="p-4">Booking ID</th>
                          <th className="p-4">Customer</th>
                          <th className="p-4">Package</th>
                          <th className="p-4">Departure Date</th>
                          <th className="p-4">Travelers</th>
                          <th className="p-4">Total Paid</th>
                          <th className="p-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E0D5]">
                        {liveBookings.map((b) => (
                          <tr key={b.id} className="hover:bg-[#F6F3EE] transition">
                            <td className="p-4 font-mono font-bold text-amber-500">#{b.id.slice(-6).toUpperCase()}</td>
                            <td className="p-4">
                              <div className="font-bold text-[#2B2B2B]">{b.user?.name || 'Guest User'}</div>
                              <div className="text-[10px] text-[#8D8D8D]">{b.user?.email}</div>
                            </td>
                            <td className="p-4 font-bold text-[#2B2B2B]">{b.packageName}</td>
                            <td className="p-4">{new Date(b.departureDate).toLocaleDateString()}</td>
                            <td className="p-4 text-center font-bold">{b.travelersCount}</td>
                            <td className="p-4 font-bold text-[#2B2B2B]">₹{(b.totalPaid || 0).toLocaleString()}</td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LIVE NEWSLETTER SUBSCRIBERS */}
          {activeTab === 'newsletters' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-[#1D493E]">Newsletter Subscribers</h2>
                  <p className="text-xs text-[#6B7280]">List of all users subscribed to your email updates.</p>
                </div>
                <button onClick={fetchLiveAdminData} className="p-2 bg-[#11231E] hover:bg-emerald-900 border border-emerald-900/40 rounded-xl transition cursor-pointer">
                  <RefreshCw className="w-4 h-4 text-[#1D493E]" />
                </button>
              </div>

              {isLiveLoading ? (
                <div className="text-center py-12 text-[#8D8D8D] text-xs">Loading subscribers...</div>
              ) : liveSubscribers.length === 0 ? (
                <div className="text-center py-12 text-[#8D8D8D] text-xs">No newsletter subscribers yet.</div>
              ) : (
                <div className="bg-white border border-[#E5E0D5] rounded-3xl overflow-hidden max-w-2xl shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#F0EDE8] text-[#1D493E] font-bold border-b border-[#E5E0D5]">
                          <th className="p-4">Subscriber Email</th>
                          <th className="p-4">Subscribed At</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E0D5]">
                        {liveSubscribers.map((sub) => (
                          <tr key={sub.id} className="hover:bg-[#F6F3EE] transition">
                            <td className="p-4 font-mono font-bold text-[#2B2B2B]">{sub.email}</td>
                            <td className="p-4 text-[#8D8D8D] text-sm">{new Date(sub.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LIVE FORM SUBMISSIONS */}
          {activeTab === 'submissions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-[#1D493E]">Contact Form Submissions</h2>
                  <p className="text-xs text-[#6B7280]">View and respond to customer queries sent from the Contact page.</p>
                </div>
                <button onClick={fetchLiveAdminData} className="p-2 bg-[#11231E] hover:bg-emerald-900 border border-emerald-900/40 rounded-xl transition cursor-pointer">
                  <RefreshCw className="w-4 h-4 text-[#1D493E]" />
                </button>
              </div>

              {isLiveLoading ? (
                <div className="text-center py-12 text-[#8D8D8D] text-xs">Loading form submissions...</div>
              ) : liveSubmissions.length === 0 ? (
                <div className="text-center py-12 text-[#8D8D8D] text-xs">No contact submissions found.</div>
              ) : (
                <div className="bg-white border border-[#E5E0D5] rounded-3xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#F0EDE8] text-[#1D493E] font-bold border-b border-[#E5E0D5]">
                          <th className="p-4">Name</th>
                          <th className="p-4">Email</th>
                          <th className="p-4">Mobile</th>
                          <th className="p-4">Message</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E0D5]">
                        {liveSubmissions.map((sub) => (
                          <tr key={sub.id} className="hover:bg-[#F6F3EE] transition">
                            <td className="p-4 font-bold text-[#2B2B2B]">{sub.name}</td>
                            <td className="p-4 text-[#6B7280] text-sm">{sub.email}</td>
                            <td className="p-4">{sub.mobile || 'N/A'}</td>
                            <td className="p-4 max-w-[250px] truncate" title={sub.message}>{sub.message}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                sub.status === 'READ' ? 'bg-[#F0EDE8] text-[#8D8D8D] border border-[#E5E0D5]' : 'bg-red-50 text-red-600 border border-red-200'
                              }`}>
                                {sub.status}
                              </span>
                            </td>
                            <td className="p-4 text-[#8D8D8D] text-sm">{new Date(sub.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LIVE PAYMENTS TAB */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-[#1D493E]">Payment Logs & Transactions</h2>
                  <p className="text-xs text-[#6B7280]">Audit logs for all Razorpay transactions processed through the gateway.</p>
                </div>
                <button onClick={fetchLiveAdminData} className="p-2 bg-[#11231E] hover:bg-emerald-900 border border-emerald-900/40 rounded-xl transition cursor-pointer">
                  <RefreshCw className="w-4 h-4 text-[#1D493E]" />
                </button>
              </div>

              {isLiveLoading ? (
                <div className="text-center py-12 text-[#8D8D8D] text-xs">Loading payment records...</div>
              ) : (liveOrders.length === 0 && liveBookings.length === 0) ? (
                <div className="text-center py-12 text-[#8D8D8D] text-xs">No payment logs found.</div>
              ) : (
                <div className="bg-white border border-[#E5E0D5] rounded-3xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#F0EDE8] text-[#1D493E] font-bold border-b border-[#E5E0D5]">
                          <th className="p-4">Transaction ID</th>
                          <th className="p-4">Type</th>
                          <th className="p-4">Customer</th>
                          <th className="p-4">Amount</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E0D5]">
                        {[
                          ...liveOrders.map((o) => ({ id: `pay_${o.id.slice(-8)}`, type: 'Shop Purchase', name: o.user?.name, email: o.user?.email, amount: o.totalAmount, date: o.createdAt, status: 'PAID' })),
                          ...liveBookings.map((b) => ({ id: `pay_${b.id.slice(-8)}`, type: 'Trip Booking', name: b.user?.name, email: b.user?.email, amount: b.totalPaid, date: b.createdAt, status: 'PAID' }))
                        ]
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .map((p, idx) => (
                            <tr key={idx} className="hover:bg-[#F6F3EE] transition">
                              <td className="p-4 font-mono font-bold text-[#6B7280]">{p.id}</td>
                              <td className="p-4 font-bold">{p.type}</td>
                              <td className="p-4">
                                <div className="font-bold text-[#2B2B2B]">{p.name || 'Guest User'}</div>
                                <div className="text-[10px] text-[#8D8D8D]">{p.email}</div>
                              </td>
                              <td className="p-4 font-bold text-[#2B2B2B]">₹{(p.amount || 0).toLocaleString()}</td>
                              <td className="p-4">
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                  {p.status}
                                </span>
                              </td>
                              <td className="p-4 text-[#8D8D8D] text-sm">{new Date(p.date).toLocaleDateString()}</td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}


          {/* TAB: DESTINATIONS PLACEHOLDER */}
          {activeTab === 'destinations' && (
            <div className="bg-white border border-[#E5E0D5] rounded-3xl p-8 text-center space-y-4 shadow-xl animate-fade-in">
              <h2 className="text-lg font-black text-[#1D493E] capitalize">{activeTab} Management</h2>
              <p className="text-xs text-[#6B7280] max-w-md mx-auto">
                Track real-time transactions, manage entries, and export audit logs.
              </p>
              <div className="p-4 bg-[#F0EDE8] rounded-2xl border border-[#E5E0D5] inline-block text-xs font-mono text-[#1D493E]">
                Total Records Loaded: {destinations.length}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* CREATE / EDIT CUSTOM PAGE MODAL */}
      {isPageModalOpen && editingCustomPage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#E5E0D5] rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 text-[#2B2B2B] shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-emerald-900/40 pb-4">
              <h3 className="text-base font-black text-[#1D493E] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#1D493E]" />
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
                  <label className="text-[10px] font-bold text-[#6B7280] uppercase">Page Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Privacy Policy"
                    value={editingCustomPage.title}
                    onChange={(e) => setEditingCustomPage(prev => prev ? { ...prev, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') } : null)}
                    className="w-full p-3 bg-[#F6F3EE] border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#6B7280] uppercase">URL Slug *</label>
                  <div className="flex items-center bg-[#F6F3EE] border border-[#E5E0D5] rounded-xl px-3 text-xs">
                    <span className="text-[#8D8D8D]">/pages/</span>
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
                  <label className="text-[10px] font-bold text-[#6B7280] uppercase">Publication Status</label>
                  <select
                    value={editingCustomPage.status}
                    onChange={(e) => setEditingCustomPage(prev => prev ? { ...prev, status: e.target.value as any } : null)}
                    className="w-full p-3 bg-[#F6F3EE] border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B]"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#6B7280] uppercase">Header Nav Visibility</label>
                  <select
                    value={editingCustomPage.showInHeader ? 'yes' : 'no'}
                    onChange={(e) => setEditingCustomPage(prev => prev ? { ...prev, showInHeader: e.target.value === 'yes' } : null)}
                    className="w-full p-3 bg-[#F6F3EE] border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B]"
                  >
                    <option value="no">Hidden from Header</option>
                    <option value="yes">Show in Header</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#6B7280] uppercase">Footer Nav Visibility</label>
                  <select
                    value={editingCustomPage.showInFooter ? 'yes' : 'no'}
                    onChange={(e) => setEditingCustomPage(prev => prev ? { ...prev, showInFooter: e.target.value === 'yes' } : null)}
                    className="w-full p-3 bg-[#F6F3EE] border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B]"
                  >
                    <option value="yes">Show in Footer</option>
                    <option value="no">Hidden from Footer</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#6B7280] uppercase flex items-center justify-between">
                  <span>Hero Banner Image (Optional)</span>
                  <span className="text-[10px] text-[#8D8D8D] font-normal">URL or Upload</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={editingCustomPage.heroImage || ''}
                    onChange={(e) => setEditingCustomPage(prev => prev ? { ...prev, heroImage: e.target.value } : null)}
                    className="flex-1 p-3 bg-[#F6F3EE] border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B]"
                  />
                  <label className="px-4 py-3 bg-[#1D493E]/10 hover:bg-[#1D493E] text-[#1D493E] hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0">
                    <Upload className="w-4 h-4" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            const res = evt.target?.result as string;
                            if (res) setEditingCustomPage(prev => prev ? { ...prev, heroImage: res } : null);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                {editingCustomPage.heroImage && (
                  <div className="relative w-full h-24 rounded-xl overflow-hidden border border-[#E5E0D5] bg-[#F6F3EE] mt-2">
                    <img src={editingCustomPage.heroImage} alt="Banner Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#6B7280] uppercase">Meta Description (SEO)</label>
                <input
                  type="text"
                  placeholder="Brief summary of the page..."
                  value={editingCustomPage.metaDescription || ''}
                  onChange={(e) => setEditingCustomPage(prev => prev ? { ...prev, metaDescription: e.target.value } : null)}
                  className="w-full p-3 bg-[#F6F3EE] border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#6B7280] uppercase">Page Body Content (Markdown Supported)</label>
                <textarea
                  rows={8}
                  placeholder="# Page Heading&#10;&#10;Write page body text..."
                  value={editingCustomPage.content}
                  onChange={(e) => setEditingCustomPage(prev => prev ? { ...prev, content: e.target.value } : null)}
                  className="w-full p-3 bg-[#F6F3EE] border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B] font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-emerald-900/40">
                <button
                  type="button"
                  onClick={() => { setIsPageModalOpen(false); setEditingCustomPage(null); }}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-[#F0EDE8] text-[#8D8D8D] border border-[#E5E0D5] rounded-xl text-xs font-bold transition cursor-pointer"
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


      {/* CHANGE ADMIN CREDENTIALS MODAL */}
      {isChangingCreds && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[99999] p-4 text-left font-sans">
          <div className="bg-white border border-[#E5E0D5] rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#E5E0D5] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#1D493E] text-white flex items-center justify-center font-bold">
                  <Key className="w-4 h-4 text-emerald-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1D493E]">
                    Admin Login Credentials
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">Update your admin login email & password</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsChangingCreds(false)}
                className="text-[#8D8D8D] hover:text-[#2B2B2B] font-bold text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateAdminCreds} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#1D493E] uppercase tracking-wider block">Admin Email Address</label>
                <input
                  type="email"
                  required
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="gobanjara.trd@gmail.com"
                  className="w-full p-3 bg-[#FAF9F6] border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#1D493E] uppercase tracking-wider block">Current Admin Password</label>
                <input
                  type="password"
                  required
                  value={currentAdminPass}
                  onChange={(e) => setCurrentAdminPass(e.target.value)}
                  placeholder="Enter current admin password"
                  className="w-full p-3 bg-[#FAF9F6] border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                />
                <p className="text-[10px] text-gray-400">Default: GoBanjara123!</p>
              </div>

              <div className="space-y-1 pt-1 border-t border-[#E5E0D5]">
                <label className="text-[11px] font-bold text-[#1D493E] uppercase tracking-wider block">New Admin Password (Optional)</label>
                <input
                  type="password"
                  value={newAdminPass}
                  onChange={(e) => setNewAdminPass(e.target.value)}
                  placeholder="Leave blank to keep current password"
                  className="w-full p-3 bg-[#FAF9F6] border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                />
              </div>

              {newAdminPass && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#1D493E] uppercase tracking-wider block">Confirm New Admin Password</label>
                  <input
                    type="password"
                    required={Boolean(newAdminPass)}
                    value={confirmAdminPass}
                    onChange={(e) => setConfirmAdminPass(e.target.value)}
                    placeholder="Re-enter new admin password"
                    className="w-full p-3 bg-[#FAF9F6] border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E0D5]">
                <button
                  type="button"
                  onClick={() => setIsChangingCreds(false)}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#2B2B2B] rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#1D493E] hover:bg-[#15342c] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Save className="w-4 h-4" /> Save Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
