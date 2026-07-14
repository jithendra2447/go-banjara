'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  MapPin, Calendar, Users, Star, ArrowRight, ShieldCheck, Compass, Heart, Sparkles, 
  ChevronDown, ChevronUp, Check, ShoppingBag, ArrowUpRight, MessageSquare, Info, BookOpen,
  ShoppingCart
} from 'lucide-react';
import { useCart } from '@/components/providers';
import { HOLIDAY_PACKAGES } from '@/data/packages';
import { PRODUCTS } from '@/data/products';
import { BonjoMascot } from '@/components/BonjoMascot';

// Static Blog/Diaries list
const BLOG_POSTS = [
  {
    id: 'post-ladakh-guide-1',
    title: 'Ultimate Ladakh Travel Guide: Plan Your Perfect Himalayan Adventure',
    excerpt: 'Detailed packing list, fuel planning, and safety pointers for solo adventurers tackling the high passes alone.',
    image: '/travel-leh-1.jpg',
    readTime: '5 min read',
    date: 'Sunday, August 12, 2023',
    author: 'Kiran Makwan'
  },
  {
    id: 'post-ladakh-guide-2',
    title: 'Leh Ladakh Travel Guide 2026: Best Time, Places & Complete Trip Planning',
    excerpt: 'Detailed packing list, fuel planning, and safety pointers for solo adventurers tackling the high passes alone.',
    image: '/travel-leh-2.jpg',
    readTime: '5 min read',
    date: 'Sunday, August 12, 2023',
    author: 'Kiran Makwan'
  },
  {
    id: 'post-ladakh-guide-3',
    title: 'Ladakh Bike Trip Guide: Routes, Budget & Essential Tips for Riders',
    excerpt: 'Detailed packing list, fuel planning, and safety pointers for solo adventurers tackling the high passes alone.',
    image: '/travel-leh-3.jpg',
    readTime: '5 min read',
    date: 'Sunday, August 12, 2023',
    author: 'Kiran Makwan'
  },
  {
    id: 'post-ladakh-guide-4',
    title: '7-Day Leh Ladakh Itinerary for First-Time Travelers',
    excerpt: 'Detailed packing list, fuel planning, and safety pointers for solo adventurers tackling the high passes alone.',
    image: '/travel-leh-4.jpg',
    readTime: '5 min read',
    date: 'Sunday, August 12, 2023',
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

  const [productsList, setProductsList] = useState<any[]>(PRODUCTS);
  const [packagesList, setPackagesList] = useState<any[]>(HOLIDAY_PACKAGES);

  const [pageContent, setPageContent] = useState({
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
    // 1. Load products
    const savedProds = localStorage.getItem('gb_admin_products_v3');
    if (savedProds) {
      try {
        const parsed = JSON.parse(savedProds);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProductsList(parsed);
        }
      } catch (e) {
        console.error('Error loading products:', e);
      }
    }

    // 2. Load packages
    const savedPkgs = localStorage.getItem('gb_admin_packages');
    if (savedPkgs) {
      try {
        const parsed = JSON.parse(savedPkgs);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPackagesList(parsed);
        }
      } catch (e) {
        console.error('Error loading packages:', e);
      }
    }

    // 3. Load dynamic page content
    const savedContent = localStorage.getItem('gb_admin_page_content');
    if (savedContent) {
      try {
        const parsed = JSON.parse(savedContent);
        setPageContent(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Error loading page content:', e);
      }
    }
  }, []);

  const resolveProduct = (defaultId: string, fallbackName: string, fallbackCategory: string, fallbackImg: string, fallbackPrice: number, fallbackOrig: number) => {
    const found = productsList.find(p => p.id === defaultId);
    if (found) {
      return {
        id: found.id,
        name: found.name,
        category: found.category,
        image: found.image,
        price: found.price,
        originalPrice: found.originalPrice,
        rating: found.rating || 5,
        reviews: `${found.reviewsCount || 120} Reviews`,
        boughtText: found.boughtCount || "200+ bought in past month",
        deliveryText: "FREE delivery as soon as Thu, 9 Apr, 7 am - 10 pm"
      };
    }
    return {
      id: defaultId,
      name: fallbackName,
      category: fallbackCategory,
      image: fallbackImg,
      price: fallbackPrice,
      originalPrice: fallbackOrig,
      rating: 5,
      reviews: "120 Reviews",
      boughtText: "200+ bought in past month",
      deliveryText: "FREE delivery as soon as Thu, 9 Apr, 7 am - 10 pm"
    };
  };

  // Selected featured products
  const badges = useMemo(() => {
    return productsList.filter(p => p.category === 'Badges' || p.category === 'Stickers').slice(0, 3);
  }, [productsList]);

  const featuredGear = useMemo(() => {
    return productsList.filter(p => ['explore-more-keychain-1', 'go-banjara-tshirt-1', 'naturally-nomad-badge-1', 'banjara-blue-slides-png'].includes(p.id)).slice(0, 4);
  }, [productsList]);

  const curatedEssentials = useMemo(() => {
    return productsList.filter(p => ['fur-jaden-backpack-1', 'go-passport-cover-1', 'banjara-luggage-tag-1', 'wakefit-pillow-1'].includes(p.id)).slice(0, 4);
  }, [productsList]);

  // Featured Packages
  const mainFeaturedPkg = useMemo(() => {
    return packagesList.find(p => p.id === 'pkg-kashmir-classic') || packagesList[0];
  }, [packagesList]);

  const subFeaturedPkgs = useMemo(() => {
    return packagesList.filter(p => ['pkg-kashmir-gulmarg', 'pkg-kerala-4in1'].includes(p.id));
  }, [packagesList]);

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

  useEffect(() => {
    if (pageContent.mascotText) {
      setMascotBubble(pageContent.mascotText);
    }
  }, [pageContent.mascotText]);

  // FAQ Accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white text-[#1D493E] font-sans antialiased relative">
      
      {/* 1. HERO BACKGROUND LAYER (z-20, sits behind metrics bar z-35) */}
      <div className="absolute inset-x-0 top-0 h-[600px] md:h-[601px] pointer-events-none z-20 overflow-visible">
        {/* Sub-container for background overlays (z-10, overflow-visible to prevent clipping) */}
        <div className="absolute inset-0 overflow-visible z-10">
          {/* Layer 1: Background */}
          <img 
            src="/hero-combined.png?v=5" 
            alt="Hero Background" 
            className="absolute inset-x-0 top-0 w-full h-[112%] object-cover object-top brightness-[0.88] contrast-[1.05] saturate-[1.05]"
            style={{ 
              imageRendering: '-webkit-optimize-contrast',
              transform: 'translateZ(0)'
            }}
          />

          {/* Layer 1.5: User's Grey Overlay Layer */}
          <img 
            src="/hero-overlay.png" 
            alt="Overlay Layer" 
            className="absolute inset-x-0 top-0 w-full h-[112%] object-cover object-top opacity-15 mix-blend-multiply"
            style={{ 
              imageRendering: '-webkit-optimize-contrast',
              transform: 'translateZ(0)'
            }}
          />

          {/* Layer 1.8: User's Top Dark Gradient Layer */}
          <img 
            src="/hero-top-gradient.png" 
            alt="Top Dark Gradient Layer" 
            className="absolute inset-x-0 top-0 w-full h-[112%] object-cover object-top"
            style={{ 
              imageRendering: '-webkit-optimize-contrast',
              transform: 'translateZ(0)'
            }}
          />

          {/* Layer 2: White Gradient Fade (Positioned behind/back side of the bike to transition to the metrics section) */}
          <div 
            className="absolute inset-x-0 bottom-0 h-[20px] z-20 pointer-events-none" 
            style={{ 
              background: 'linear-gradient(to top, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0) 100%)' 
            }}
          />
        </div>
      </div>

      {/* 1.5 BIKER LAYER (z-40, sits on top of metrics bar z-30 to overlap tyres, matches background proportions exactly) */}
      <div className="absolute inset-x-0 top-0 h-[720px] pointer-events-none z-40">
        <img 
          src="/hero-bike.png?v=5" 
          alt="Biker" 
          className="absolute inset-0 w-full h-full object-cover object-top"
          style={{ 
            imageRendering: '-webkit-optimize-contrast',
            transform: 'translateZ(0)'
          }}
        />
      </div>



      {/* 2. HERO CONTENT SECTION (Transparent background, relative z-50 to sit on top of everything) */}
      <section className="relative min-h-[600px] md:min-h-[601px] flex items-center z-50 bg-transparent">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 w-full grid md:grid-cols-2 gap-12 items-center relative pt-[100px] pb-4">
          <div className="flex flex-col gap-[52px] text-left md:max-w-[454px] w-full">
            <h1 className="text-4xl md:text-[62px] md:leading-[1.25] tracking-[-0.2px] font-semibold text-white font-sans md:max-w-[454px] md:h-[234px] w-full">
              {pageContent.heroTitleLine1} <br />
              {pageContent.heroTitleLine2} <br />
              {pageContent.heroTitleLine3}
            </h1>
            <p className="text-sm md:text-[20px] md:leading-[34px] tracking-[0px] text-white/95 font-sans font-medium max-w-md md:max-w-[454px]">
              {pageContent.heroSubtitle}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link 
                href="/shop"
                className="px-8 py-3.5 rounded-lg bg-[#1D493E] hover:bg-[#15342c] hover:scale-[1.02] active:scale-[0.98] text-white border border-[#1D493E] font-sans font-bold text-base transition-all duration-300 cursor-pointer text-center min-w-[150px] shadow-sm"
              >
                {pageContent.heroShopBtn}
              </Link>
              <Link 
                href="/travel"
                className="px-8 py-3.5 rounded-lg border border-[#1D493E] bg-transparent hover:bg-[#1D493E] hover:text-white hover:scale-[1.02] active:scale-[0.98] text-[#1D493E] font-sans font-bold text-base transition-all duration-300 cursor-pointer text-center min-w-[210px] shadow-sm"
              >
                {pageContent.heroTravelBtn}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. METRICS WIDGET BAR */}
      <section className="bg-white border-b border-gray-200 md:h-[145px] pt-6 pb-6 md:py-6 relative z-30 flex items-center">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 grid grid-cols-2 md:grid-cols-5 gap-y-6 md:gap-y-0 text-center md:divide-x md:divide-gray-200 w-full h-full items-center">
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

      {/* 3. DUAL CALL-TO-ACTIONS */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-20 pt-[42px] pb-[42px] bg-white relative z-35">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Card 1 - Shop Gear (Left, Green) */}
          <div className="bg-[#1D493E] text-white p-6 rounded-[4px] flex flex-col justify-between gap-8 relative overflow-hidden group shadow-md border border-white/5">
            <div className="space-y-4 text-left">
              <h2 className="text-2xl md:text-3xl font-black leading-tight font-sans">
                Shop Travel Gear for Nomads
              </h2>
              <p className="text-[20px] leading-[32px] tracking-[0px] text-white/80 font-sans font-medium">
                Explore our collection of hand-picked journals, weather-proof stickers and artisanal badges designed for the road
              </p>
            </div>
            <div className="relative z-10">
              <Link 
                href="/shop" 
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-sans font-semibold text-sm transition-all duration-300 cursor-pointer text-center"
              >
                <span>Explore Collections</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2 - Book a Trip (Right, Orange) */}
          <div className="bg-[#FF5A36] text-white p-6 rounded-[4px] flex flex-col justify-between gap-8 relative overflow-hidden group shadow-md border border-white/5">
            <div className="space-y-4 text-left">
              <h2 className="text-2xl md:text-3xl font-black leading-tight font-sans">
                Book a Trip
              </h2>
              <p className="text-[20px] leading-[32px] tracking-[0px] text-white/90 font-sans font-medium">
                Explore our collection of hand-picked journals, weather-proof stickers and artisanal badges designed for the road
              </p>
            </div>
            <div className="relative z-10">
              <Link 
                href="/travel" 
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-sans font-semibold text-sm transition-all duration-300 cursor-pointer text-center"
              >
                <span>Find the Route</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DESTINATIONS SECTION */}
      <section className="bg-white pt-[42px] pb-[24px] relative z-10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-[80px] flex flex-col gap-[62px] text-center">
          
          {/* Centered Header (Figma styled: serif title 42px, sans medium subtitle 24px) */}
          <div className="space-y-3.5 max-w-4xl mx-auto">
            <div className="flex justify-center">
              <span className="inline-block text-[#FF5A36] bg-[#FF5A36]/10 px-2.5 py-1 rounded-[4px] text-xs font-bold uppercase tracking-wider">
                Destinations
              </span>
            </div>
            <h2 className="text-3xl md:text-[42px] font-serif font-semibold text-[#1D493E] leading-none text-center">
              Place worth the <span className="text-[#FF5A36]">detour</span>
            </h2>
            <p className="text-gray-500 text-base md:text-[24px] md:leading-8 font-medium text-center max-w-2xl mx-auto">
              A hand-picked map of the corners of India our community keeps coming back to
            </p>
          </div>

          {/* Featured Destination Card (Top) */}
          {(() => {
            const displayPkgs = packagesList && packagesList.length > 0 ? packagesList : HOLIDAY_PACKAGES;
            const pkg1 = displayPkgs[0];
            if (!pkg1) return null;
            return (
              <div className="bg-white rounded-[4px] border border-gray-150/60 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-0 max-w-[1280px] mx-auto overflow-hidden md:h-[394px] text-left">
                {/* Image */}
                <div className="relative h-[280px] md:h-full w-full overflow-hidden">
                  <img 
                    src={pkg1.image} 
                    alt={pkg1.name} 
                    className="w-full h-full object-cover" 
                    style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)' }}
                  />
                </div>
                {/* Details */}
                <div className="p-6 md:p-8 flex flex-col justify-between h-full space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[#FF5A36] bg-[#FF5A36]/10 px-2.5 py-0.5 rounded-[4px] text-xs font-bold">{pkg1.category || 'Road Trip'}</span>
                    <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-[4px] text-xs font-bold">{pkg1.durationDays} days</span>
                  </div>
                  <div className="flex justify-between items-baseline gap-4">
                    <h3 className="text-2xl md:text-[32px] font-sans font-bold text-[#1D493E] leading-tight">{pkg1.name}</h3>
                    <span className="text-xl md:text-[24px] font-sans font-bold text-[#1D493E] shrink-0">₹{(pkg1.price ?? 0).toLocaleString('en-IN')}/Person</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 font-semibold leading-relaxed line-clamp-2">
                    {pkg1.description}
                  </p>
                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6 border-t border-gray-150 pt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#FAF9F6] border border-gray-200/60 rounded-[4px] flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-[#1D493E]" />
                      </div>
                      <span className="text-xs font-bold text-gray-600">Starts from {pkg1.startPoint || 'Srinagar'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#FAF9F6] border border-gray-200/60 rounded-[4px] flex items-center justify-center shrink-0">
                        <Users className="w-4 h-4 text-[#1D493E]" />
                      </div>
                      <span className="text-xs font-bold text-gray-600">{pkg1.groupType || 'Curated group Trip'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#FAF9F6] border border-gray-200/60 rounded-[4px] flex items-center justify-center shrink-0">
                        <ArrowUpRight className="w-4 h-4 text-[#1D493E]" />
                      </div>
                      <span className="text-xs font-bold text-gray-600">{pkg1.difficulty || 'Moderate'} Difficulty</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#FAF9F6] border border-gray-200/60 rounded-[4px] flex items-center justify-center shrink-0">
                        <Calendar className="w-4 h-4 text-[#1D493E]" />
                      </div>
                      <span className="text-xs font-bold text-gray-600">Next: {pkg1.nextDeparture || 'Aug, 2026'}</span>
                    </div>
                  </div>
                  {/* Buttons */}
                  <div className="flex gap-4 pt-2">
                    <Link 
                      href={`/travel/package/${pkg1.id}`} 
                      className="flex-1 py-3 rounded-[4px] bg-[#1D493E] hover:bg-[#15342c] text-white text-xs font-bold text-center transition cursor-pointer"
                    >
                      Book Now
                    </Link>
                    <Link 
                      href={pkg1.link || `/travel/package/${pkg1.id}`} 
                      className="flex-1 py-3 rounded-[4px] border border-[#1D493E] text-center text-[#1D493E] hover:bg-gray-50 text-xs font-bold transition"
                    >
                      Get details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Standard Grid Cards (Bottom Row) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(() => {
              const displayPkgs = packagesList && packagesList.length > 0 ? packagesList : HOLIDAY_PACKAGES;
              return displayPkgs.slice(1, 3).map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-[4px] border border-gray-150/60 shadow-xs p-6 md:p-8 flex flex-col justify-between text-left md:h-[778px]">
                  {/* Image */}
                  <div className="relative h-[200px] md:h-[384px] rounded-[4px] overflow-hidden shrink-0">
                    <img 
                      src={pkg.image} 
                      alt={pkg.name} 
                      className="w-full h-full object-cover" 
                      style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)' }}
                    />
                  </div>
                  {/* Details block */}
                  <div className="flex-1 flex flex-col justify-between pt-6 space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="text-[#FF5A36] bg-[#FF5A36]/10 px-2.5 py-0.5 rounded-[4px] text-xs font-bold">{pkg.category || 'Road Trip'}</span>
                        <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-[4px] text-xs font-bold">{pkg.durationDays} days</span>
                      </div>
                      <div className="flex justify-between items-baseline gap-4">
                        <h3 className="text-xl md:text-[24px] font-sans font-bold text-[#1D493E] leading-tight">{pkg.name}</h3>
                        <span className="text-lg md:text-[20px] font-sans font-bold text-[#1D493E] shrink-0">₹{(pkg.price ?? 0).toLocaleString('en-IN')}/Person</span>
                      </div>
                      <p className="text-xs text-gray-500 font-semibold leading-relaxed line-clamp-2">
                        {pkg.description}
                      </p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-y-4 gap-x-4 border-t border-gray-150 pt-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 bg-[#FAF9F6] border border-gray-200/60 rounded-[4px] flex items-center justify-center shrink-0">
                          <MapPin className="w-4 h-4 text-[#1D493E]" />
                        </div>
                        <span className="text-xs font-bold text-gray-600 leading-tight">Starts from {pkg.startPoint || 'Srinagar'}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 bg-[#FAF9F6] border border-gray-200/60 rounded-[4px] flex items-center justify-center shrink-0">
                          <Users className="w-4 h-4 text-[#1D493E]" />
                        </div>
                        <span className="text-xs font-bold text-gray-600 leading-tight">{pkg.groupType || 'Curated group Trip'}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 bg-[#FAF9F6] border border-gray-200/60 rounded-[4px] flex items-center justify-center shrink-0">
                          <ArrowUpRight className="w-4 h-4 text-[#1D493E]" />
                        </div>
                        <span className="text-xs font-bold text-gray-600 leading-tight">{pkg.difficulty || 'Moderate'} Difficulty</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 bg-[#FAF9F6] border border-gray-200/60 rounded-[4px] flex items-center justify-center shrink-0">
                          <Calendar className="w-4 h-4 text-[#1D493E]" />
                        </div>
                        <span className="text-xs font-bold text-gray-600 leading-tight">Next: {pkg.nextDeparture || 'Aug, 2026'}</span>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                      <Link 
                        href={`/travel/package/${pkg.id}`} 
                        className="flex-1 py-3 rounded-[4px] bg-[#1D493E] hover:bg-[#15342c] text-white text-xs font-bold text-center transition cursor-pointer"
                      >
                        Book Now
                      </Link>
                      <Link 
                        href={pkg.link || `/travel/package/${pkg.id}`} 
                        className="flex-1 py-3 rounded-[4px] border border-[#1D493E] text-center text-[#1D493E] hover:bg-gray-50 text-xs font-bold transition"
                      >
                        Get details
                      </Link>
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>

          {/* Centered Destinations Footer Link */}
          <div className="text-center">
            <Link 
              href="/travel" 
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1D493E] hover:text-[#FF5A36] transition-all duration-300 cursor-pointer"
            >
              <span>Explore all destinations</span>
              <ArrowUpRight className="w-4.5 h-4.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* 5. TOP PRODUCT CATEGORIES */}
      <section className="bg-white py-16 text-center relative z-10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 space-y-10">
          
          {/* Centered Header (Figma styled: serif title 42px, sans medium subtitle 24px) */}
          <div className="space-y-3.5 max-w-4xl mx-auto pb-4 text-center">
            <div className="flex justify-center">
              <span className="inline-block text-[#FF5A36] bg-[#FF5A36]/10 px-2.5 py-1 rounded-[4px] text-xs font-bold uppercase tracking-wider">
                The Collection
              </span>
            </div>
            <h2 className="text-3xl md:text-[42px] font-serif font-semibold text-[#1D493E] leading-none text-center">
              Shop Our <span className="text-[#FF5A36]">Top Product Categories</span>
            </h2>
            <p className="text-gray-500 text-base md:text-[24px] md:leading-8 font-medium text-center max-w-2xl mx-auto">
              A hand-picked map of the corners of India our community keeps coming back to
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Category 1: Stickers */}
            <Link href="/shop?category=Stickers" className="space-y-4 group">
              <div className="rounded-lg aspect-[3/2] overflow-hidden bg-[#FAF9F6] border border-gray-200/50">
                <img 
                  src="/around_the_world_sticker.jpg" 
                  alt="Stickers" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)' }}
                />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-[#1D493E]">Stickers</h4>
                <p className="text-xs text-gray-500 font-semibold">Starts from ₹93</p>
              </div>
            </Link>

            {/* Category 2: Badges */}
            <Link href="/shop?category=Badges" className="space-y-4 group">
              <div className="rounded-lg aspect-[3/2] overflow-hidden bg-[#FAF9F6] border border-gray-200/50">
                <img 
                  src="/around_the_world_sticker.jpg" 
                  alt="Badges" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)' }}
                />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-[#1D493E]">Badges</h4>
                <p className="text-xs text-gray-500 font-semibold">Starts from ₹199</p>
              </div>
            </Link>

            {/* Category 3: Fridge Magnets */}
            <Link href="/shop?category=Magnets" className="space-y-4 group">
              <div className="rounded-lg aspect-[3/2] overflow-hidden bg-[#FAF9F6] border border-gray-200/50">
                <img 
                  src="/around_the_world_sticker.jpg" 
                  alt="Fridge Magnets" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)' }}
                />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-[#1D493E]">Fridge Magnets</h4>
                <p className="text-xs text-gray-500 font-semibold">Starts from ₹199</p>
              </div>
            </Link>
          </div>

          {/* Bottom active state indicator line */}
          <div className="w-full h-[3px] bg-gray-200 relative rounded overflow-hidden mt-6">
            <div className="absolute left-0 top-0 h-full w-[33.3%] bg-[#1D493E] rounded" />
          </div>

          {/* Centered View all products Footer Link */}
          <div className="pt-4 text-center">
            <Link 
              href="/shop" 
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1D493E] hover:text-[#FF5A36] transition-all duration-300 cursor-pointer"
            >
              <span>View all products</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 6. YELLOW HIGHLIGHT MARQUEE BANNER */}
      <div className="bg-[#FFFF80] text-[#1D493E] border-t border-b border-[#1D493E]/15 py-6 overflow-hidden select-none relative z-10">
        <div className="flex whitespace-nowrap gap-12 animate-marquee font-sans text-sm md:text-base font-extrabold uppercase tracking-widest">
          <span>✦ BOOK YOUR NEXT TRIP ✦ SHOP TRAVEL GEAR ✦ DARE TO TRAVEL ✦ STICKERS ✦ MODERN NOMAD ✦ BADGES ✦ BOOK YOUR NEXT TRIP ✦ SHOP TRAVEL GEAR ✦ DARE TO TRAVEL ✦ STICKERS ✦ MODERN NOMAD ✦ BADGES ✦ BOOK YOUR NEXT TRIP ✦ SHOP TRAVEL GEAR ✦ DARE TO TRAVEL ✦ STICKERS ✦ MODERN NOMAD ✦ BADGES</span>
        </div>
      </div>

      {/* 7. TODAY'S BEST DEALS FOR YOU */}
      <section className="bg-white py-16 text-left relative z-10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 space-y-10">
          
          <div className="text-center space-y-3">
            <span className="inline-block text-[#FF5A36] bg-[#FF5A36]/10 px-2.5 py-1 rounded-[4px] text-xs font-bold uppercase tracking-wider">
              Most People Like
            </span>
            <h2 className="text-3xl md:text-[38px] font-sans font-black text-[#1D493E] leading-tight">
              {pageContent.dealsTitle.includes("best deals") ? (
                <>Today's <span className="text-[#FF5A36]">best deals</span> for you</>
              ) : (
                pageContent.dealsTitle
              )}
            </h2>
            <p className="text-gray-500 text-sm md:text-base font-semibold leading-relaxed max-w-2xl mx-auto">
              {pageContent.dealsSub}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              resolveProduct("naturally-nomad-badge-1", "Naturally Nomad", "Badges", "/naturally_nomad_badge.png", 139, 199),
              resolveProduct("explore-more-keychain-1", "Explore more", "Key Chains", "/explore_more_keychain.png", 149, 193),
              resolveProduct("go-banjara-tshirt-1", "Go Banjara", "T-Shirts", "/go_banjara_tshirt.jpg", 399, 599),
              resolveProduct("prod-badge-around", "Naturally Nomad", "Badges", "/around_the_world_sticker.jpg", 139, 199)
            ].map((deal) => {
              // Mock product object for cart action
              const mockProduct = {
                id: deal.id,
                name: deal.name,
                price: deal.price,
                image: deal.image,
                category: deal.category,
                rating: deal.rating,
                reviewsCount: 120,
                description: "Deal of the day product"
              };

              return (
                <div key={deal.id} className="bg-white rounded-2xl flex flex-col justify-between space-y-4 hover:shadow-xs transition duration-300">
                  <div className="space-y-4">
                    {/* Image Container with Dots */}
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                      <img 
                        src={deal.image} 
                        alt={deal.name} 
                        className="w-full h-full object-cover"
                        style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)' }}
                      />
                      {/* Dots indicator */}
                      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1D493E]"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-left">
                      <span className="inline-block text-[#FF5A36] bg-[#FF5A36]/10 px-2 py-0.5 rounded text-[10px] font-bold">
                        {deal.category}
                      </span>
                      <div className="flex justify-between items-baseline gap-2">
                        <h4 className="text-sm font-bold text-[#1D493E] truncate">{deal.name}</h4>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-gray-400 line-through text-xs font-semibold">₹{deal.originalPrice}</span>
                          <span className="text-sm font-bold text-[#1D493E]">₹{deal.price}</span>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1.5">
                        <div className="flex text-amber-400 text-xs gap-0.5">
                          <Star className="w-3 h-3 fill-current" />
                          <Star className="w-3 h-3 fill-current" />
                          <Star className="w-3 h-3 fill-current" />
                          <Star className="w-3 h-3 fill-current" />
                          <Star className="w-3 h-3 fill-current" />
                        </div>
                        <span className="text-[11px] text-gray-500 font-semibold">({deal.reviews})</span>
                      </div>

                      {/* Bought statistics */}
                      <p className="text-[11px] text-gray-500 font-semibold">{deal.boughtText}</p>
                      
                      {/* Delivery text */}
                      <p className="text-[10px] md:text-[11px] text-gray-400 font-medium leading-tight pt-1">
                        {deal.deliveryText}
                      </p>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleProductAdd(mockProduct)}
                    className="w-full py-2.5 rounded-xl border border-[#1D493E] hover:bg-[#1D493E] hover:text-white text-[#1D493E] text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{addedProductId === deal.id ? 'Added to Cart!' : 'Add to cart'}</span>
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Bottom active state indicator line */}
          <div className="w-full h-[4px] bg-gray-200 relative rounded-full overflow-hidden mt-6">
            <div className="absolute left-0 top-0 h-full w-[40%] bg-[#1D493E] rounded-full" />
          </div>

          {/* View all products footer */}
          <div className="text-center pt-2">
            <Link 
              href="/shop" 
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1D493E] hover:text-[#FF5A36] transition-all duration-300"
            >
              <span>View all products</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 8. MOST SELLING PRODUCTS */}
      <section className="bg-white py-16 text-left relative z-10 border-t border-gray-100">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-[38px] font-sans font-black text-[#1D493E] leading-tight">
              {pageContent.sellingTitle.includes("Selling Products") ? (
                <>Most <span className="text-[#FF5A36]">Selling Products</span></>
              ) : (
                pageContent.sellingTitle
              )}
            </h2>
            <p className="text-gray-500 text-sm md:text-base font-semibold leading-relaxed">
              {pageContent.sellingSub}
            </p>
            <div className="pt-2">
              <Link 
                href="/shop"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1D493E] hover:text-[#FF5A36] transition"
              >
                <span>View all products</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              resolveProduct("naturally-nomad-badge-1", "Naturally Nomad", "Badges", "/naturally_nomad_badge.png", 139, 199),
              resolveProduct("banjara-blue-slides-png", "Blue Mavin", "Slippers", "/blue_mavin_slides.jpg", 399, 599),
              resolveProduct("explore-more-keychain-1", "Explore more", "Key Chains", "/explore_more_keychain.png", 149, 193),
              resolveProduct("banjara-slides-1", "Banjara Slides", "Slippers", "/banjara_slides.jpg", 399, 599),
              resolveProduct("wakefit-pillow-1", "Wakefit Pillows", "Travel Pillows", "/wakefit_pillow.jpg", 139, 199),
              resolveProduct("fur-jaden-backpack-1", "Fur Jaden C/W", "Backpacks", "/fur_jaden_backpack.jpg", 149, 193),
              resolveProduct("go-passport-cover-1", "Go Passport Cover", "Passport Covers", "/go_passport_cover.jpg", 399, 599),
              resolveProduct("banjara-luggage-tag-1", "Banjara Luggage Tag", "Luggage Tags", "/banjara_luggage_tag.jpg", 139, 199)
            ].map((prod) => {
              // Mock product object for cart action
              const mockProduct = {
                id: prod.id,
                name: prod.name,
                price: prod.price,
                image: prod.image,
                category: prod.category,
                rating: prod.rating,
                reviewsCount: 120,
                description: "Best selling product"
              };

              return (
                <div key={prod.id} className="bg-white rounded-2xl border border-gray-150 p-4 flex flex-col justify-between space-y-4 hover:shadow-xs transition duration-300">
                  <div className="space-y-4">
                    {/* Image Container with Dots */}
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                      <img 
                        src={prod.image} 
                        alt={prod.name} 
                        className="w-full h-full object-cover"
                        style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)' }}
                      />
                      {/* Dots indicator */}
                      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1D493E]"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-left">
                      <span className="inline-block text-[#FF5A36] bg-[#FF5A36]/10 px-2 py-0.5 rounded text-[10px] font-bold">
                        {prod.category}
                      </span>
                      <div className="flex justify-between items-baseline gap-2">
                        <h4 className="text-sm font-bold text-[#1D493E] truncate">{prod.name}</h4>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-gray-400 line-through text-xs font-semibold">₹{prod.originalPrice}</span>
                          <span className="text-sm font-bold text-[#1D493E]">₹{prod.price}</span>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1.5">
                        <div className="flex text-amber-400 text-xs gap-0.5">
                          <Star className="w-3 h-3 fill-current" />
                          <Star className="w-3 h-3 fill-current" />
                          <Star className="w-3 h-3 fill-current" />
                          <Star className="w-3 h-3 fill-current" />
                          <Star className="w-3 h-3 fill-current" />
                        </div>
                        <span className="text-[11px] text-gray-500 font-semibold">({prod.reviews})</span>
                      </div>

                      {/* Bought statistics */}
                      <p className="text-[11px] text-gray-500 font-semibold">{prod.boughtText}</p>
                      
                      {/* Delivery text */}
                      <p className="text-[10px] md:text-[11px] text-gray-400 font-medium leading-tight pt-1">
                        {prod.deliveryText}
                      </p>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleProductAdd(mockProduct)}
                    className="w-full py-2.5 rounded-xl border border-[#1D493E] hover:bg-[#1D493E] hover:text-white text-[#1D493E] text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{addedProductId === prod.id ? 'Added to Cart!' : 'Add to cart'}</span>
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 8.5 ORANGE HIGHLIGHT MARQUEE BANNER */}
      <div className="bg-[#FF5A36] text-white py-6 overflow-hidden select-none relative z-10">
        <div className="flex whitespace-nowrap gap-12 animate-marquee font-sans text-sm md:text-base font-extrabold uppercase tracking-widest">
          <span>✦ ESCAPE THE ORDINARY ✦ SHOP TRAVEL GEAR ✦ DARE TO TRAVEL ✦ ADVENTURE AWAITS ✦ MODERN NOMAD ✦ SHOP ✦ ESCAPE THE ORDINARY ✦ SHOP TRAVEL GEAR ✦ DARE TO TRAVEL ✦ ADVENTURE AWAITS ✦ MODERN NOMAD ✦ SHOP ✦ ESCAPE THE ORDINARY ✦ SHOP TRAVEL GEAR ✦ DARE TO TRAVEL ✦ ADVENTURE AWAITS ✦ MODERN NOMAD ✦ SHOP</span>
        </div>
      </div>

      {/* 9. MEET BONJO SECTION (Brand story) */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-20 pt-16 pb-8 relative overflow-visible">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left Column: Image with slight rotation and glow */}
          <div className="relative">
            {/* Soft glow background */}
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-[#FF5A36]/15 rounded-full blur-3xl" />
            <div className="relative rounded-[32px] overflow-hidden shadow-2xl border border-gray-150 transform -rotate-2 hover:rotate-0 transition-transform duration-500 w-full aspect-square max-w-[440px] mx-auto md:mx-0 bg-gray-50">
              {/* Orange gradient overlay in top-left */}
              <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-[#FF5A36]/40 via-[#FF5A36]/10 to-transparent pointer-events-none z-10" />
              <img 
                src="/llama_mascot.png" 
                alt="Bonjo Mascot" 
                className="w-full h-full object-cover"
                style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)' }}
              />
            </div>
          </div>

          {/* Right Column: Text & Content */}
          <div className="space-y-6 text-left">
            <div className="space-y-3">
              <span className="inline-block text-[#FF5A36] bg-[#FF5A36]/10 px-2.5 py-1 rounded-[4px] text-xs font-bold uppercase tracking-wider">
                The Banjara Soul
              </span>
              <h2 className="text-3xl md:text-[40px] font-serif font-black text-[#1D493E] leading-tight">
                Meet Bonjo.
              </h2>
            </div>
            <div className="space-y-4 text-gray-600 text-sm md:text-base font-medium leading-relaxed">
              <p>
                Go Banjara was born from a frustration travel in India had become a checklist. Same cafés, same photo spots, same three-day Goa loop. We wanted something slower, closer to the ground, and honest about the places it visited.
              </p>
              <p>
                So we built a hybrid platform: curated small-group journeys, a shop of honest gear made by artisans we know by name, and a community of travelers who share notes from the road instead of just photos.
              </p>
              <p className="font-bold text-[#1D493E]">
                Travel. Lifestyle. Community. Commerce. Under one roof because we don't think they were ever supposed to live apart.
              </p>
            </div>
            <div className="pt-2">
              <Link 
                href="/about" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#1D493E] hover:bg-[#15342c] text-white text-sm font-bold transition-all shadow-sm cursor-pointer"
              >
                <span>Our Story</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 9.5 REVIEWS SECTION (3-column grid matching Figma design) */}
      <section className="bg-white pt-16 pb-8 text-left relative z-10 border-t border-gray-100">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 space-y-10">
          
          <div className="space-y-3">
            <span className="inline-block text-[#FF5A36] bg-[#FF5A36]/10 px-2.5 py-1 rounded-[4px] text-xs font-bold uppercase tracking-wider">
              Real Experiences
            </span>
            <h2 className="text-3xl md:text-[38px] font-sans font-black text-[#1D493E] leading-tight">
              What <span className="text-[#FF5A36]">people say</span> about products
            </h2>
          </div>

          {/* 3-column Testimonial Grid matching Figma design */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1 (Faded) */}
            <div className="space-y-8 md:opacity-40 hover:opacity-100 transition duration-300">
              {[
                {
                  id: "rev-1",
                  name: "Kiran Makwan",
                  subtitle: "Verified Wanderer",
                  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
                  text: "The quality of the journal is incredible. It feels like a piece of art that I can actually take on my treks. Bonjo's personality shines through the brand!",
                  stars: 5
                },
                {
                  id: "rev-4",
                  name: "Priyanka Sen",
                  subtitle: "Slow Traveler",
                  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
                  text: "The double-walled thermal flask keeps my chai steaming hot even at 14,000 feet in Ladakh. Truly premium travel gear built for real conditions.",
                  stars: 5
                }
              ].map((review) => (
                <div key={review.id} className="bg-gray-50 border border-gray-100 p-8 rounded-2xl space-y-5 text-left shadow-2xs">
                  <div className="flex text-amber-400 text-sm gap-0.5">
                    {Array.from({ length: review.stars }).map((_, s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-500 font-semibold italic text-xs md:text-sm leading-relaxed">
                    “{review.text}”
                  </p>
                  <div className="flex items-center gap-3.5 pt-2 border-t border-gray-100">
                    <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                    <div>
                      <h4 className="text-sm font-extrabold text-gray-805">{review.name}</h4>
                      <p className="text-xs text-gray-400 font-semibold">{review.subtitle}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Column 2 (Active/Sharp highlighted) */}
            <div className="space-y-8">
              {[
                {
                  id: "rev-2",
                  name: "Ananya Roy",
                  subtitle: "Himalayan Backpacker",
                  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
                  text: "I bought the waterproof stickers for my laptop and flask. They've survived rain, dust, and countless camping trips without peeling or fading at all!",
                  stars: 5
                },
                {
                  id: "rev-5",
                  name: "Arjun Mehta",
                  subtitle: "Weekend Explorer",
                  avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80",
                  text: "Super clean design on the T-shirts! The fit is perfect, the fabric is extremely soft and breathable, and the graphics represent the soul of travel.",
                  stars: 5
                }
              ].map((review) => (
                <div key={review.id} className="bg-white border border-gray-200 p-8 rounded-2xl space-y-5 text-left shadow-xs scale-102">
                  <div className="flex text-amber-400 text-sm gap-0.5">
                    {Array.from({ length: review.stars }).map((_, s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 font-bold italic text-xs md:text-sm leading-relaxed">
                    “{review.text}”
                  </p>
                  <div className="flex items-center gap-3.5 pt-2 border-t border-gray-100">
                    <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                    <div>
                      <h4 className="text-sm font-black text-gray-808">{review.name}</h4>
                      <p className="text-xs text-[#1D493E]/60 font-black">{review.subtitle}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Column 3 (Faded) */}
            <div className="space-y-8 md:opacity-40 hover:opacity-100 transition duration-300">
              {[
                {
                  id: "rev-3",
                  name: "Rohan Sharma",
                  subtitle: "Motorcycle Nomad",
                  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
                  text: "The Kashmir Road Trip package was pure magic. Extremely well-planned with authentic local homestays and off-the-beaten-path trails. Will book again!",
                  stars: 5
                }
              ].map((review) => (
                <div key={review.id} className="bg-gray-50 border border-gray-100 p-8 rounded-2xl space-y-5 text-left shadow-2xs">
                  <div className="flex text-amber-400 text-sm gap-0.5">
                    {Array.from({ length: review.stars }).map((_, s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-500 font-semibold italic text-xs md:text-sm leading-relaxed">
                    “{review.text}”
                  </p>
                  <div className="flex items-center gap-3.5 pt-2 border-t border-gray-100">
                    <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-gray-805">{review.name}</h4>
                      <p className="text-xs text-gray-400 font-semibold">{review.subtitle}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 10. TRAVEL DIARIES / STORIES */}
      <section className="bg-white pt-8 pb-8 text-left relative z-10 border-t border-gray-100">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 space-y-12">
          
          <div className="text-center space-y-3">
            <span className="inline-block text-[#FF5A36] bg-[#FF5A36]/10 px-2.5 py-1 rounded-[4px] text-xs font-bold uppercase tracking-wider">
              Blogs
            </span>
            <h2 className="text-3xl md:text-[38px] font-sans font-black text-[#1D493E] leading-tight">
              Travel Tales from the <span className="text-[#FF5A36]">curious Explorer</span>
            </h2>
            <p className="text-gray-500 text-sm md:text-base font-semibold leading-relaxed max-w-2xl mx-auto">
              Follow my voices to discover unique voices, breathtaking landscapes & unforgettable experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-12 md:gap-y-10">
            {BLOG_POSTS.slice(0, 4).map((post) => (
              <Link 
                key={post.id} 
                href={`/blog`}
                className="space-y-4 group block text-left"
              >
                {/* Image Wrapper */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[4px] bg-gray-100 border border-gray-150">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)' }}
                  />
                </div>
                {/* Text Content */}
                <div className="space-y-2">
                  <h3 className="text-lg md:text-xl font-serif font-black text-[#1D493E] leading-snug group-hover:text-[#FF5A36] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-400 font-bold leading-none">
                    {post.date}  •  {post.readTime}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* View all footer */}
          <div className="text-center pt-4">
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1D493E] hover:text-[#FF5A36] transition-all duration-300"
            >
              <span>View all</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 11. FAQ ACCORDION SECTION (Matching Shop page design) */}
      <section className="max-w-4xl mx-auto px-6 md:px-12 pt-[42px] pb-[24px] flex flex-col gap-[32px] w-full mt-8">
        {/* Header */}
        <div className="text-left space-y-2.5">
          <span className="inline-block text-[9px] font-black uppercase tracking-[0.15em] text-[#FF5B37] bg-[#FFEBE5] px-2.5 py-1 rounded-sm">
            FAQ'S
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#2B2B2B]">
            Frequently asked questions
          </h2>
        </div>

        {/* Accordion List */}
        <div className="w-full border-t border-slate-200 divide-y divide-slate-200">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="py-5 text-left">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex justify-between items-start text-left gap-4 font-sans text-sm sm:text-base font-bold text-[#2B2B2B] hover:text-[#1D493E] transition-colors cursor-pointer group"
                >
                  <span>{item.question}</span>
                  <span className="text-xl font-medium text-[#1D493E] shrink-0 leading-none select-none">
                    {isOpen ? '—' : '+'}
                  </span>
                </button>
                {/* Expandable answer */}
                {isOpen && (
                  <p className="mt-3 text-xs sm:text-sm text-slate-400 font-medium leading-relaxed animate-fade-in">
                    {item.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 12. SERVICES TO HELP YOU SHOP */}
      <section className="bg-[#FAF9F6] py-16 border-t border-[#1D493E]/5 text-left">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-block text-[#FF5A36] bg-[#FF5A36]/10 px-2.5 py-1 rounded-[4px] text-xs font-bold uppercase tracking-wider">
              Services
            </span>
            <h2 className="text-3xl md:text-[38px] font-sans font-black text-[#1D493E] leading-tight">
              Services to help you <span className="text-[#FF5A36]">shop</span>
            </h2>
            <p className="text-gray-500 text-xs md:text-sm font-semibold leading-relaxed">
              Premium services designed to make your travel gear shopping seamless, secure, and supportive of local communities.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Service 1: Free Shipping */}
            <div className="bg-white border border-[#1D493E]/10 p-6 rounded-3xl space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#FFF0EB] flex items-center justify-center text-[#E05434]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black uppercase text-[#1D493E] tracking-wider">Free Shipping</h4>
              <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
                Enjoy free delivery on all orders over ₹999 across India, shipped with reliable tracking partners.
              </p>
            </div>

            {/* Service 2: Easy Returns */}
            <div className="bg-white border border-[#1D493E]/10 p-6 rounded-3xl space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#FFF0EB] flex items-center justify-center text-[#E05434]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black uppercase text-[#1D493E] tracking-wider">15-Day Easy Returns</h4>
              <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
                Hassle-free 15-day return and replacement policy for all premium outdoor gear and apparel.
              </p>
            </div>

            {/* Service 3: Secure Checkout */}
            <div className="bg-white border border-[#1D493E]/10 p-6 rounded-3xl space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#FFF0EB] flex items-center justify-center text-[#E05434]">
                <Check className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black uppercase text-[#1D493E] tracking-wider">100% Secure Checkout</h4>
              <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
                Fully encrypted payment gateway supporting UPI, major credit/debit cards, and net banking.
              </p>
            </div>

            {/* Service 4: Community Support */}
            <div className="bg-white border border-[#1D493E]/10 p-6 rounded-3xl space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#FFF0EB] flex items-center justify-center text-[#E05434]">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black uppercase text-[#1D493E] tracking-wider">Artisan Support</h4>
              <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
                Every purchase directly supports our community homestays, native guides, and local helpers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 13. BRAND CTA SECTION */}
      <section className="bg-[#1D493E] text-white py-16 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-[44px] font-serif font-black tracking-tight leading-tight">
            Escape the ordinary. Join the road.
          </h2>
          <p className="text-sm md:text-base text-white/85 max-w-xl mx-auto leading-relaxed font-medium">
            Curated small-group journeys, hand-picked gear made by artisans we know by name, and a community of explorers. Ready to start your adventure?
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              href="/travel"
              className="px-8 py-3.5 rounded-lg bg-[#FF5A36] hover:bg-[#e04f2f] text-white font-bold text-sm transition-all shadow-sm cursor-pointer"
            >
              Explore Packages
            </Link>
            <Link
              href="/shop"
              className="px-8 py-3.5 rounded-lg border border-white bg-transparent hover:bg-white/10 text-white font-bold text-sm transition-all cursor-pointer"
            >
              Shop Travel Gear
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
