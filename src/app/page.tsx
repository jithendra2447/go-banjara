'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  MapPin, Calendar, Users, Star, ArrowRight, ShieldCheck, Compass, Heart, Sparkles, 
  ChevronDown, ChevronUp, Check, ShoppingBag, ArrowUpRight, MessageSquare, Info, BookOpen
} from 'lucide-react';
import { useCart } from '@/components/providers';
import { HOLIDAY_PACKAGES } from '@/data/packages';
import { PRODUCTS } from '@/data/products';
import { BonjoMascot } from '@/components/BonjoMascot';

// Static Blog/Diaries list
const BLOG_POSTS = [
  {
    id: 'post-leh-prep',
    title: 'Acclimatization Guide: Surviving the Srinagar-to-Leh Pass',
    excerpt: 'Heading up to 11,500ft? Read our essential guidelines on altitude sickness, rest schedules, and local medication.',
    image: '/travel-leh-day1.jpg',
    readTime: '6 min read',
    date: 'July 8, 2026',
    author: 'Stanzin Gyatso'
  },
  {
    id: 'post-kerala-monsoon',
    title: 'Monsoon Magic: Why Kerala is Best Visited in the Rains',
    excerpt: 'Discover the lush, misty backwaters, off-season tranquil stays, and traditional Ayurvedic wellness therapies.',
    image: '/travel-leh-3.jpg', // Placeholder image matching existing files
    readTime: '5 min read',
    date: 'June 20, 2026',
    author: 'Anjali Menon'
  },
  {
    id: 'post-nomad-gear-care',
    title: 'How to Care for Handcrafted Full-Grain Leather Journals',
    excerpt: 'Preserve the rich patina and waterproof protection of your Nomad Journal with natural beeswax and proper drying.',
    image: '/shop-hero-2.jpg',
    readTime: '4 min read',
    date: 'May 12, 2026',
    author: 'Bonjo'
  },
  {
    id: 'post-solo-travel',
    title: 'First Time Solo on the Leh-Manali Loop: A Journey of Self-Discovery',
    excerpt: 'Detailed packing list, fuel planning, and safety pointers for solo adventurers tackling the high passes alone.',
    image: '/ladakh-hero.jpg',
    readTime: '8 min read',
    date: 'April 29, 2026',
    author: 'Kiran Makwan'
  }
];

// FAQs list
const FAQ_ITEMS = [
  {
    question: "What is Go Banjara?",
    answer: "Go Banjara is a slow-travel community and premium outdoor boutique brand. We craft immersive road trips, treks, and beach escapes, alongside durable, highly styled travel gear like waterproof backpacks, passport covers, iron-on badges, and premium journals."
  },
  {
    question: "How do I book a travel package?",
    answer: "Browse our curated packages under the Travel section. Choose your travel date and group size, then click 'Book Now' to submit an inquiry. Our community guides will reach out within 24 hours to confirm your details and add the package to your cart."
  },
  {
    question: "What is your gear return policy?",
    answer: "We offer a 15-day hassle-free return window for all boutique gear and apparel in unused, original packaging. All products also carry a 6-month warranty against manufacturing defects."
  },
  {
    question: "Do you support local communities?",
    answer: "Yes, 85% of your travel package expenses go directly to supporting local homestays, native guides, remote monasteries, and local micro-economies. Our gear is also sourced responsibly from local artisans."
  }
];

export default function Homepage() {
  const { addToCart, setCartOpen } = useCart();

  // Selected featured products
  const badges = useMemo(() => {
    return PRODUCTS.filter(p => p.category === 'Badges' || p.category === 'Stickers').slice(0, 3);
  }, []);

  const featuredGear = useMemo(() => {
    return PRODUCTS.filter(p => ['explore-more-keychain-1', 'go-banjara-tshirt-1', 'naturally-nomad-badge-1', 'banjara-blue-slides-png'].includes(p.id)).slice(0, 4);
  }, []);

  const curatedEssentials = useMemo(() => {
    return PRODUCTS.filter(p => ['fur-jaden-backpack-1', 'go-passport-cover-1', 'banjara-luggage-tag-1', 'wakefit-pillow-1'].includes(p.id)).slice(0, 4);
  }, []);

  // Featured Packages
  const mainFeaturedPkg = useMemo(() => {
    return HOLIDAY_PACKAGES.find(p => p.id === 'pkg-kashmir-classic') || HOLIDAY_PACKAGES[0];
  }, []);

  const subFeaturedPkgs = useMemo(() => {
    return HOLIDAY_PACKAGES.filter(p => ['pkg-kashmir-gulmarg', 'pkg-kerala-4in1'].includes(p.id));
  }, []);

  // Product Add Alert state
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const handleProductAdd = (prod: any) => {
    const cartItem = {
      id: prod.id,
      name: prod.name,
      price: prod.price,
      image: prod.image,
    };
    addToCart(cartItem, 'shop', undefined, 1);
    setAddedProductId(prod.id);
    setTimeout(() => setAddedProductId(null), 2500);
  };

  // Mascot Bubble State
  const [mascotBubble, setMascotBubble] = useState("Hey wanderer! I'm Bonjo. Ready to hit the road?");
  const [mascotMood, setMascotMood] = useState({ goggles: true, hat: true });

  // FAQ Accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white text-[#1D493E] font-sans antialiased relative">
      
      {/* 1. HERO BACKGROUND & BIKER LAYER (Direct child of root, absolute positioning) */}
      <div className="absolute inset-x-0 top-0 h-[600px] md:h-[660px] pointer-events-none z-20 overflow-visible">
        {/* Layer 1: Background (Clipped at bottom 80px using clip-path to stay inside Hero section) */}
        <img 
          src="/hero-combined.png?v=2" 
          alt="Hero Background" 
          className="absolute inset-0 w-full h-full object-cover object-top z-10"
          style={{ clipPath: 'inset(0 0 80px 0)' }}
        />

        {/* Layer 2: White Gradient Fade (Positioned behind/back side of the bike, overlaying the transition) */}
        <div 
          className="absolute inset-x-0 bottom-0 h-36 z-20 pointer-events-none" 
          style={{ 
            background: 'linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.2) 60%, rgba(255, 255, 255, 0) 100%)' 
          }}
        />

        {/* Layer 3: Biker & Buttons (Renders on top of the gradient, fully visible, bleeding past frame) */}
        <img 
          src="/hero-bike.png?v=3" 
          alt="Biker" 
          className="absolute inset-0 w-full h-full object-cover object-top z-30"
        />
      </div>

      {/* 2. HERO CONTENT SECTION (Transparent background, relative z-30) */}
      <section className="relative min-h-[520px] md:min-h-[580px] flex items-center z-30 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid md:grid-cols-2 gap-12 items-center relative pt-24 pb-16">
          <div className="space-y-6 text-left max-w-xl">
            <h1 className="text-4xl md:text-[68px] md:leading-[1.1] tracking-tight font-black text-white font-sans">
              Hey! Let’s <br />
              Escape from <br />
              the Ordinary
            </h1>
            <p className="text-sm md:text-base text-white/95 font-semibold leading-relaxed max-w-md">
              We bridge the gap between soulful Indian travel and high end gear. curated for those who find home in the dust of the road
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link 
                href="/shop"
                className="px-8 py-3 rounded-lg bg-[#1D493E] hover:bg-[#16372f] text-white font-black text-[11px] uppercase tracking-widest transition duration-300 shadow-sm cursor-pointer min-w-[140px] text-center"
              >
                Shop Now
              </Link>
              <Link 
                href="/travel"
                className="px-8 py-3 rounded-lg border border-[#1D493E] text-[#1D493E] hover:bg-[#1D493E]/5 font-black text-[11px] uppercase tracking-widest transition duration-300 cursor-pointer min-w-[190px] text-center"
              >
                See Travel Packages
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. METRICS WIDGET BAR */}
      <section className="bg-white border-b border-gray-100 py-10 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-5 gap-y-6 md:gap-y-0 text-center md:divide-x md:divide-gray-100">
          <div className="flex flex-col items-center justify-center space-y-1.5 px-2">
            <h4 className="text-3xl md:text-[36px] font-bold text-[#1A1A1A] font-sans tracking-tight">10+</h4>
            <p className="text-[13px] md:text-sm text-gray-500 font-medium font-sans">Travel Packages</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-1.5 px-2">
            <h4 className="text-3xl md:text-[36px] font-bold text-[#1A1A1A] font-sans tracking-tight">15k+</h4>
            <p className="text-[13px] md:text-sm text-gray-500 font-medium font-sans">Nomads Joined</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-1.5 px-2">
            <h4 className="text-3xl md:text-[36px] font-bold text-[#1A1A1A] font-sans tracking-tight">24/7</h4>
            <p className="text-[13px] md:text-sm text-gray-500 font-medium font-sans">On-road Support</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-1.5 px-2">
            <h4 className="text-3xl md:text-[36px] font-bold text-[#1A1A1A] font-sans tracking-tight">7+</h4>
            <p className="text-[13px] md:text-sm text-gray-500 font-medium font-sans">Shop Products</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-1.5 px-2 text-center">
            <h4 className="text-3xl md:text-[36px] font-bold text-[#1A1A1A] font-sans tracking-tight">4.5+</h4>
            <p className="text-[13px] md:text-sm text-gray-500 font-medium font-sans">Average trip rating</p>
          </div>
        </div>
      </section>


      {/* 5. NOMAD BADGES & STICKERS */}
      <section className="bg-[#FAF9F6] border-t border-b border-[#1D493E]/5 py-16 text-left">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#E05434] uppercase font-black tracking-widest">
                COLLECTIBLES
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-light text-[#1D493E]">
                Sticker Pack & Iron-On <span className="text-[#E05434] font-serif font-normal">Badges</span>
              </h2>
              <p className="text-gray-500 text-xs md:text-sm font-semibold leading-relaxed max-w-xl">
                Durable, high-quality, weatherproof stickers and embroidered badges featuring our mascot Bonjo.
              </p>
            </div>
            <Link 
              href="/shop?category=Badges"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#1D493E] hover:text-[#E05434] uppercase tracking-wider shrink-0 transition"
            >
              <span>View all badges</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {badges.map((prod) => (
              <div 
                key={prod.id} 
                className="bg-white rounded-3xl border border-[#1D493E]/10 p-6 flex flex-col justify-between items-center text-center space-y-4 hover:shadow-xs transition duration-300"
              >
                <Link href={`/shop/product/${prod.id}`} className="block relative w-32 h-32 overflow-hidden hover:scale-105 transition-transform duration-300">
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-contain" />
                </Link>
                <div className="space-y-1">
                  <h4 className="text-sm font-black uppercase text-[#1D493E] tracking-wider truncate max-w-[200px]">
                    {prod.name}
                  </h4>
                  <span className="text-xs font-serif text-[#E05434] font-black">₹{prod.price}</span>
                </div>
                <button
                  onClick={() => handleProductAdd(prod)}
                  className="w-full py-2.5 rounded-xl bg-[#1D493E] hover:bg-[#E05434] text-white text-[10px] font-black uppercase tracking-wider transition cursor-pointer"
                >
                  {addedProductId === prod.id ? 'Added to Cart!' : 'Add to Cart'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. YELLOW HIGHLIGHT MARQUEE BANNER */}
      <div className="bg-[#FFFF80] text-[#1D493E] border-t border-b border-[#1D493E]/15 py-3 overflow-hidden select-none relative z-10">
        <div className="flex whitespace-nowrap gap-8 animate-marquee font-mono text-xs font-black uppercase tracking-widest">
          <span>10% OFF FOR FIRST CUSTOMER • USE CODE Nomads10 • 10% OFF FOR FIRST CUSTOMER • USE CODE Nomads10 • 10% OFF FOR FIRST CUSTOMER • USE CODE Nomads10 • 10% OFF FOR FIRST CUSTOMER • USE CODE Nomads10</span>
        </div>
      </div>

      {/* 7. FEATURED GEAR GRID */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-left">
          <div className="space-y-2">
            <span className="text-xs font-mono text-[#E05434] uppercase font-black tracking-widest">
              NOMAD BOUTIQUE
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-[#1D493E]">
              Explore Our <span className="text-[#E05434] font-serif font-normal">Nomad Gear</span>
            </h2>
            <p className="text-gray-500 text-xs md:text-sm font-semibold leading-relaxed max-w-xl">
              Street fashion, slides, keychains, and accessories handpicked for the traveler's soul.
            </p>
          </div>
          <Link 
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#1D493E] hover:text-[#E05434] uppercase tracking-wider shrink-0 transition"
          >
            <span>View all gear</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredGear.map((prod) => (
            <div 
              key={prod.id} 
              className="bg-white rounded-3xl border border-[#1D493E]/10 p-4 hover:border-[#1D493E]/20 transition duration-300 flex flex-col justify-between space-y-4 text-left"
            >
              <div className="space-y-3">
                <Link href={`/shop/product/${prod.id}`} className="block relative aspect-square bg-[#FAF9F6] rounded-2xl overflow-hidden border border-[#1D493E]/5 hover:opacity-95 transition-opacity">
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                </Link>
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[8px] font-mono font-black uppercase text-gray-400 tracking-wider">
                      {prod.category}
                    </span>
                    <div className="flex items-center gap-0.5 text-gray-500 text-[9px] font-bold">
                      ★ {prod.rating.toFixed(1)}
                    </div>
                  </div>
                  <Link href={`/shop/product/${prod.id}`} className="hover:text-[#E05434] transition-colors block">
                    <h4 className="text-xs font-black uppercase text-[#1D493E] truncate">
                      {prod.name}
                    </h4>
                  </Link>
                </div>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-sm font-serif font-black text-[#E05434]">₹{prod.price}</span>
                <button
                  onClick={() => handleProductAdd(prod)}
                  className="px-3.5 py-2 bg-[#1D493E] hover:bg-[#E05434] text-white text-[9.5px] font-black uppercase tracking-widest rounded-xl transition cursor-pointer"
                >
                  {addedProductId === prod.id ? 'Added' : 'Add'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. CURATED TRAVEL ESSENTIALS */}
      <section className="bg-[#FAF9F6] py-16 border-t border-[#1D493E]/5 text-left">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#E05434] uppercase font-black tracking-widest">
                TRAVEL ESSENTIALS
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-light text-[#1D493E]">
                Handcrafted With Love For <span className="text-[#E05434] font-serif font-normal">The Road</span>
              </h2>
              <p className="text-gray-500 text-xs md:text-sm font-semibold leading-relaxed max-w-xl">
                Functional travel gear including waterproof backpacks, leather travel notebooks, and luggage tags.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {curatedEssentials.map((prod) => (
              <div 
                key={prod.id} 
                className="bg-white rounded-3xl border border-[#1D493E]/10 p-4 hover:border-[#1D493E]/20 transition duration-300 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <Link href={`/shop/product/${prod.id}`} className="block relative aspect-square bg-[#FAF9F6] rounded-2xl overflow-hidden border border-[#1D493E]/5 hover:opacity-95 transition-opacity">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                  </Link>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[8px] font-mono font-black uppercase text-gray-400 tracking-wider">
                        {prod.category}
                      </span>
                      <div className="flex items-center gap-0.5 text-gray-500 text-[9px] font-bold">
                        ★ {prod.rating.toFixed(1)}
                      </div>
                    </div>
                    <Link href={`/shop/product/${prod.id}`} className="hover:text-[#E05434] transition-colors block">
                      <h4 className="text-xs font-black uppercase text-[#1D493E] truncate">
                        {prod.name}
                      </h4>
                    </Link>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-sm font-serif font-black text-[#E05434]">₹{prod.price}</span>
                  <button
                    onClick={() => handleProductAdd(prod)}
                    className="px-3.5 py-2 bg-[#1D493E] hover:bg-[#E05434] text-white text-[9.5px] font-black uppercase tracking-widest rounded-xl transition cursor-pointer"
                  >
                    {addedProductId === prod.id ? 'Added' : 'Add'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. MEET BONJO MASCOT SECTION (Interactive Speech Bubble Board) */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="bg-white border border-[#1D493E]/15 rounded-[36px] p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 md:gap-16 shadow-xs relative overflow-hidden text-left">
          
          {/* Left Mascot side */}
          <div className="relative shrink-0 flex flex-col items-center gap-4">
            <div className="bg-[#F3FFEF] border border-[#1D493E]/15 rounded-full p-2 relative">
              <BonjoMascot 
                width={160} 
                height={160} 
                withGoggles={mascotMood.goggles} 
                withHat={mascotMood.hat} 
                interactive={true} 
              />
            </div>
            {/* Custom Interactive Mascot controls */}
            <div className="flex gap-2">
              <button 
                onClick={() => setMascotMood(prev => ({ ...prev, goggles: !prev.goggles }))}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition ${mascotMood.goggles ? 'bg-[#1D493E] text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                Goggles
              </button>
              <button 
                onClick={() => setMascotMood(prev => ({ ...prev, hat: !prev.hat }))}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition ${mascotMood.hat ? 'bg-[#1D493E] text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                Hat
              </button>
            </div>
          </div>

          {/* Right Content side */}
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#E05434] uppercase font-black tracking-widest">
                MEET THE MASCOT
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-light text-[#1D493E]">
                Talk to <span className="text-[#E05434] font-serif font-normal">Bonjo</span>
              </h2>
            </div>

            {/* Spech bubble block */}
            <div className="relative bg-[#F3FFEF] border border-[#1D493E]/20 p-5 rounded-2xl rounded-tl-none text-[#1D493E] font-medium text-xs leading-relaxed max-w-xl shadow-xs">
              <div className="absolute top-0 left-0 -translate-x-[9.5px] -translate-y-[0.5px] border-[10px] border-transparent border-t-[#F3FFEF] border-r-[#F3FFEF] z-10" />
              <p className="font-semibold text-gray-700">{mascotBubble}</p>
            </div>

            {/* Quick interactive speech triggers */}
            <div className="space-y-2">
              <h5 className="text-[10px] font-mono text-gray-400 uppercase font-black tracking-wider">Quick questions</h5>
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => setMascotBubble("Check out our double-walled thermal flask, our naturally nomad badges, and the leather journal. Waterproof backpack is my personal favourite!")}
                  className="px-4 py-2 rounded-xl border border-[#1D493E]/15 hover:border-[#1D493E] bg-white text-[11px] font-bold text-[#1D493E] hover:bg-[#FAF9F6] transition cursor-pointer"
                >
                  🎒 Recommend Gear
                </button>
                <button
                  type="button"
                  onClick={() => setMascotBubble("The Srinagar-to-Leh Highway loop is beautiful. Be sure to stay in local homestays and visit the Hemis monastery!")}
                  className="px-4 py-2 rounded-xl border border-[#1D493E]/15 hover:border-[#1D493E] bg-white text-[11px] font-bold text-[#1D493E] hover:bg-[#FAF9F6] transition cursor-pointer"
                >
                  ⛰️ Best Travel Spots
                </button>
                <button
                  type="button"
                  onClick={() => setMascotBubble("Always pack heavy fleece jackets, robust trekking boots, high SPF sunscreen, and altitude pills like Diamox if you are heading up!")}
                  className="px-4 py-2 rounded-xl border border-[#1D493E]/15 hover:border-[#1D493E] bg-white text-[11px] font-bold text-[#1D493E] hover:bg-[#FAF9F6] transition cursor-pointer"
                >
                  📝 Packing Advice
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. TRAVEL DIARIES / STORIES */}
      <section className="bg-[#FAF9F6] py-16 border-t border-b border-[#1D493E]/5 text-left">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#E05434] uppercase font-black tracking-widest">
                CHRONICLES
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-light text-[#1D493E]">
                Stories From <span className="text-[#E05434] font-serif font-normal">The Road</span>
              </h2>
              <p className="text-gray-500 text-xs md:text-sm font-semibold leading-relaxed max-w-xl">
                Slow-travel journals, destination checklists, gear care, and diaries written by explorers.
              </p>
            </div>
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#1D493E] hover:text-[#E05434] uppercase tracking-wider shrink-0 transition"
            >
              <span>View all chronicles</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {BLOG_POSTS.map((post) => (
              <div 
                key={post.id} 
                className="bg-white rounded-3xl border border-[#1D493E]/10 overflow-hidden shadow-2xs hover:border-[#1D493E]/20 transition duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
                    />
                    <span className="absolute bottom-4 left-4 bg-white/95 text-[#1D493E] font-mono text-[9px] font-black px-2.5 py-1 rounded shadow-sm">
                      {post.readTime}
                    </span>
                  </div>
                  <div className="p-5 space-y-2">
                    <span className="text-[9px] font-mono font-black text-[#E05434] tracking-wider block">
                      {post.date} • BY {post.author.toUpperCase()}
                    </span>
                    <h4 className="text-sm font-serif font-bold text-[#1D493E] leading-snug line-clamp-2 hover:text-[#E05434] transition">
                      <Link href={`/blog`}>{post.title}</Link>
                    </h4>
                    <p className="text-[11px] text-gray-500 font-semibold leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
                <div className="px-5 pb-5 pt-2">
                  <Link 
                    href={`/blog`} 
                    className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase text-[#1D493E] hover:text-[#E05434] tracking-wider transition"
                  >
                    <span>Read story</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FAQ ACCORDION SECTION */}
      <section className="max-w-4xl mx-auto px-6 md:px-12 py-16 text-center space-y-10">
        <div className="space-y-2">
          <span className="text-xs font-mono text-[#E05434] uppercase font-black tracking-widest">HELP DESK</span>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-[#1D493E]">
            Frequently Asked <span className="text-[#E05434] font-serif font-normal">Questions</span>
          </h2>
        </div>

        <div className="space-y-4 text-left">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div 
                key={idx}
                className="bg-white border border-[#1D493E]/15 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 flex items-center justify-between text-[#1D493E] hover:bg-[#FAF9F6] transition cursor-pointer text-sm font-bold"
                >
                  <span>{faq.question}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-gray-500 leading-relaxed font-semibold border-t border-gray-50 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 12. WHY CHOOSE GO BANJARA / VALUES */}
      <section className="bg-[#FAF9F6] py-16 border-t border-[#1D493E]/5 text-left">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-mono text-[#E05434] uppercase font-black tracking-widest">OUR VALUES</span>
            <h2 className="text-3xl font-serif font-light text-[#1D493E]">
              Built For Travelers, By <span className="text-[#E05434] font-serif font-normal">Travelers</span>
            </h2>
            <p className="text-gray-500 text-xs md:text-sm font-semibold leading-relaxed">
              We focus on safety, unique slow-travel routes, handcrafted durable products, and supporting remote communities.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white border border-[#1D493E]/10 p-6 rounded-3xl space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#FFF0EB] flex items-center justify-center text-[#E05434]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black uppercase text-[#1D493E] tracking-wider">100% Secure Booking</h4>
              <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
                SSL secure transactions, instant confirmations, and reliable backup infrastructure.
              </p>
            </div>

            <div className="bg-white border border-[#1D493E]/10 p-6 rounded-3xl space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#FFF0EB] flex items-center justify-center text-[#E05434]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black uppercase text-[#1D493E] tracking-wider">Premium Gear</h4>
              <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
                Handcrafted luggage tags, keychains, and waterproof bags built to endure rough trails.
              </p>
            </div>

            <div className="bg-white border border-[#1D493E]/10 p-6 rounded-3xl space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#FFF0EB] flex items-center justify-center text-[#E05434]">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black uppercase text-[#1D493E] tracking-wider">Community-Led Tourism</h4>
              <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
                85% of trip revenue goes directly to remote homestays, native guides, and local helpers.
              </p>
            </div>

            <div className="bg-white border border-[#1D493E]/10 p-6 rounded-3xl space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#FFF0EB] flex items-center justify-center text-[#E05434]">
                <Check className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black uppercase text-[#1D493E] tracking-wider">Flexible Policies</h4>
              <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
                Easy reschedules, flexible cancellations, and friendly support teams to help you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 13. BOTTOM NEWSLETTER / CTA */}
      <section className="bg-[#1D493E] text-white py-16 text-center border-t border-white/5 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 space-y-6 relative z-10">
          <span className="text-[10px] font-mono text-[#FFFF80] font-black uppercase tracking-widest">JOIN THE TRIBE</span>
          <h2 className="text-3xl md:text-5xl font-serif leading-tight font-light">
            Keep up with <span className="text-[#FFFF80] font-serif font-normal">the road</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-200 max-w-xl mx-auto leading-relaxed font-semibold">
            Sign up to get notified of new itineraries, off-beat destination drops, and exclusive boutique product offers.
          </p>
          <div className="pt-4 max-w-md mx-auto">
            <form onSubmit={(e) => { e.preventDefault(); alert("Welcome to the Go Banjara Tribe!"); }} className="flex gap-2 bg-white/5 border border-white/10 p-1.5 rounded-2xl">
              <input 
                type="email" 
                required 
                placeholder="Enter your email address" 
                className="flex-1 px-4 py-3 bg-transparent border-0 text-xs font-semibold placeholder-slate-400 focus:ring-0 focus:outline-none"
              />
              <button 
                type="submit" 
                className="px-6 py-3 bg-[#E05434] hover:bg-[#c94526] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition cursor-pointer"
              >
                Join Tribe
              </button>
            </form>
          </div>
        </div>
        <Compass className="w-48 h-48 text-white/5 absolute -bottom-10 -left-10 transform rotate-12" />
        <ShoppingBag className="w-48 h-48 text-white/5 absolute -top-10 -right-10 transform -rotate-12" />
      </section>
    </div>
  );
}
