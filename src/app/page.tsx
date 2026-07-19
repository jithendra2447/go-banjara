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
  },
  {
    question: "What materials are the badges made from?",
    answer: "Zinc alloy with glossy enamel fill. Lightweight, durable, and safe to pin on bags, jackets, or backpacks without damaging fabric."
  }
];

export default function Homepage() {
  const { addToCart, setCartOpen } = useCart();

  const [productsList, setProductsList] = useState<any[]>(PRODUCTS);
  const [packagesList, setPackagesList] = useState<any[]>(HOLIDAY_PACKAGES);

  // Active image index for each product card
  const [activeImageIndices, setActiveImageIndices] = useState<Record<string, number>>({});

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
          const updated = parsed.map((p: any) => {
            const defaultPkg = HOLIDAY_PACKAGES.find(hp => hp.id === p.id);
            if (defaultPkg) {
              return { 
                ...p, 
                name: defaultPkg.name, 
                description: defaultPkg.description,
                category: defaultPkg.category,
                durationDays: defaultPkg.durationDays,
                duration: defaultPkg.duration
              };
            }
            return p;
          });
          setPackagesList(updated);
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
    let img = found?.image || fallbackImg;
    
    if (!img || img === 'undefined' || img.trim() === '') {
      img = fallbackImg;
    }
    
    // Clean up absolute paths or local storage entries to make sure they are relative to the public folder
    if (img.includes('explore_more_keychain.png')) {
      img = '/explore_more_keychain.png';
    } else if (img.includes('go_banjara_tshirt.jpg')) {
      img = '/go_banjara_tshirt.jpg';
    } else if (img.includes('naturally_nomad_badge.png')) {
      img = '/naturally_nomad_badge.png';
    } else if (img.includes('around_the_world_sticker.jpg')) {
      img = '/around_the_world_sticker.jpg';
    } else if (img.includes('blue_mavin_slides.jpg')) {
      img = '/blue_mavin_slides.jpg';
    } else if (img.includes('banjara_slides.jpg')) {
      img = '/banjara_slides.jpg';
    } else if (img.includes('wakefit_pillow.jpg')) {
      img = '/wakefit_pillow.jpg';
    } else if (img.includes('fur_jaden_backpack.jpg')) {
      img = '/fur_jaden_backpack.jpg';
    } else if (img.includes('go_passport_cover.jpg')) {
      img = '/go_passport_cover.jpg';
    } else if (img.includes('banjara_luggage_tag.jpg')) {
      img = '/banjara_luggage_tag.jpg';
    } else if (img.includes('banjara_blue_slides.png')) {
      img = '/banjara_blue_slides.png';
    } else if (!img.startsWith('/') && !img.startsWith('http')) {
      img = '/' + img;
    }

    // Setup a list of 5 fallback images for indicators
    const fallbackImages = [
      img,
      img.includes('badge') ? '/around_the_world_sticker.jpg' : (img.includes('keychain') ? '/explore_more_keychain.png?v=1' : (img.includes('tshirt') ? '/go_banjara_tshirt.jpg?v=1' : (img.includes('slides') || img.includes('mavin') ? '/blue_mavin_slides.jpg' : img + '?v=1'))),
      img.includes('slides') || img.includes('mavin') ? '/banjara_blue_slides.png' : img + '?v=2',
      img.includes('badge') ? '/around_the_world_sticker.jpg?v=2' : (img.includes('keychain') ? '/explore_more_keychain.png?v=2' : (img.includes('tshirt') ? '/go_banjara_tshirt.jpg?v=2' : (img.includes('slides') || img.includes('mavin') ? '/blue_mavin_slides.jpg?v=2' : img + '?v=3'))),
      img + '?v=4'
    ];

    if (found) {
      return {
        id: found.id,
        name: found.name,
        category: found.category,
        image: img,
        images: found.images || fallbackImages,
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
      image: img,
      images: fallbackImages,
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
    <div className="min-h-screen bg-white text-[#1D493E] font-sans antialiased relative -mt-[90px]">
      
      {/* 1. HERO VIDEO BACKGROUND LAYER (z-20, sits behind metrics bar z-35) */}
      <div className="relative hero-banner-height w-full z-20 overflow-hidden">
        {/* HTML5 Video Element */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover brightness-[0.75] contrast-[1.05]"
          style={{ transform: 'translateZ(0)' }}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
          {/* Fallback image */}
          <img 
            src="/hero-combined.png?v=5" 
            alt="Hero Background Fallback" 
            className="w-full h-full object-cover object-top"
          />
        </video>

        {/* Dark overlay to make white text highly readable */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none z-10" />

        {/* 2. HERO CONTENT SECTION (Overlay on top of video, z-20) */}
        <div className="absolute inset-0 flex flex-col justify-end pb-12 md:pb-[62px] z-20 bg-transparent animate-fade-in">
          <div className="max-w-[1440px] mx-auto px-6 md:px-20 w-full flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12">
            
            {/* Left side: Heading & Subtitle */}
            <div className="flex flex-col gap-6 md:max-w-[850px] text-left">
              <h1 className="text-4xl md:text-[62px] md:leading-[1.2] tracking-[-0.2px] font-semibold text-white font-sans">
                Hey! Let’s Escape from the <br className="hidden md:inline" />
                Ordinary
              </h1>
              <p className="text-sm md:text-[20px] md:leading-[32px] tracking-[0px] text-white/95 font-sans font-medium max-w-[650px]">
                We bridge the gap between soulful Indian travel and high end gear. <br className="hidden md:inline" />
                curated for those who find home in the dust of the road
              </p>
            </div>

            {/* Right side: Two Buttons side-by-side */}
            <div className="flex flex-row items-center gap-[16px] md:gap-[24px] justify-start shrink-0 pb-1">
              <Link 
                href="/shop"
                className="hover:scale-[1.02] active:scale-[0.98] text-[#2B2B2B] bg-white hover:bg-white/90 transition-all duration-300 cursor-pointer flex items-center justify-center w-[150px] md:w-[177px] h-[55px]"
                style={{
                  borderRadius: "4px",
                  fontFamily: "'Faktum','Outfit',sans-serif",
                  fontWeight: 600,
                  fontSize: "16px",
                  lineHeight: "100%",
                  textDecoration: "none",
                  boxSizing: "border-box",
                  whiteSpace: "nowrap",
                }}
              >
                Shop Now
              </Link>
              <Link 
                href="/travel"
                className="hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center justify-center w-[190px] md:w-[215px] h-[55px] border border-white/30 text-white"
                style={{
                  borderRadius: "4px",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(4px)",
                  fontFamily: "'Faktum','Outfit',sans-serif",
                  fontWeight: 600,
                  fontSize: "16px",
                  lineHeight: "100%",
                  textDecoration: "none",
                  boxSizing: "border-box",
                  whiteSpace: "nowrap",
                }}
              >
                See Travel Packages
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* 3. DUAL CALL-TO-ACTIONS */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-20 pt-[20px] pb-[20px] bg-white relative z-35">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Card 1 - Shop Gear (Left, Green) */}
          <div className="bg-[#1D493E] text-white p-6 rounded-[4px] flex flex-col justify-between gap-8 relative overflow-hidden group shadow-md border border-white/5">
            <div className="space-y-4 text-left">
              <h2 className="text-2xl md:text-3xl font-black leading-tight font-sans">
                Shop Travel Gear for Nomads
              </h2>
              <p className="text-base md:text-[20px] leading-[32px] tracking-[0px] text-white/80 font-sans font-medium">
                Explore our collection of hand-picked journals, weather-proof stickers and artisanal badges designed for the road
              </p>
            </div>
            <div className="relative z-10">
              <Link 
                href="/shop" 
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-white/10 hover:bg-white/15 transition-all duration-300 cursor-pointer text-center"
                style={{ color: "rgba(255,255,255,1)", fontFamily: "'Faktum','Outfit',sans-serif", fontWeight: 500, fontSize: "16px", lineHeight: "100%", letterSpacing: "0px", verticalAlign: "middle", textDecoration: "none" }}
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
              <p className="text-base md:text-[20px] leading-[32px] tracking-[0px] text-white/90 font-sans font-medium">
                Explore our collection of hand-picked journals, weather-proof stickers and artisanal badges designed for the road
              </p>
            </div>
            <div className="relative z-10">
              <Link 
                href="/travel" 
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-white/15 hover:bg-white/25 transition-all duration-300 cursor-pointer text-center"
                style={{ color: "rgba(255,255,255,1)", fontFamily: "'Faktum','Outfit',sans-serif", fontWeight: 500, fontSize: "16px", lineHeight: "100%", letterSpacing: "0px", verticalAlign: "middle", textDecoration: "none" }}
              >
                <span>Find the Route</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DESTINATIONS SECTION */}
      <section className="bg-white pt-[20px] pb-0 relative z-10">
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
              A hand-picked map of the corners of India
            </p>
          </div>

          {/* Cards Vertical Flow Container (Width: 1280px, Height: Hug 1390px, Gap: 32px) */}
          <div className="flex flex-col gap-8 max-w-[1280px] w-full mx-auto">
            {/* Featured Destination Card (Top) */}
            {(() => {
              const displayPkgs = packagesList && packagesList.length > 0 ? packagesList : HOLIDAY_PACKAGES;
              const pkg1 = displayPkgs[0];
              if (!pkg1) return null;
              return (
                <div className="bg-[#F6F3EE] rounded-[4px] shadow-xs flex flex-col md:flex-row gap-0 w-full overflow-hidden md:h-[394px] text-left">
                  {/* Image */}
                  <div className="relative h-[280px] md:h-full w-full md:w-1/2 shrink-0 overflow-hidden">
                    <img 
                      src={pkg1.image} 
                      alt={pkg1.name} 
                      className="w-full h-full object-cover" 
                      style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)' }}
                    />
                  </div>
                  {/* Details */}
                  <div className="w-full md:w-1/2 pt-4 pb-4 px-4 flex flex-col justify-between md:h-full bg-white shrink-0 gap-6 md:gap-0">
                    {/* Top Group (Width: Fill, Height: 151px, Gap: 12px) */}
                    <div className="flex flex-col gap-2 min-h-[140px] shrink-0 w-full">
                      {/* Tags Container (Width: Fill, Height: Hug 28px, Justify: space-between) */}
                      <div className="flex justify-between items-center w-full h-[28px] shrink-0">
                        <span className="text-[#FF5A36] bg-[#FF5A36]/10 px-2.5 py-0.5 rounded-[4px] text-xs font-bold">{pkg1.category || 'Road Trip'}</span>
                        <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-[4px] text-xs font-bold">{pkg1.durationDays} days</span>
                      </div>
                      <div className="flex justify-between items-baseline gap-4">
                        <h3 className="text-2xl md:text-[32px] font-sans font-bold text-[#1D493E] leading-tight truncate flex-1" title={pkg1.name}>{pkg1.name}</h3>
                        <span className="text-xl md:text-[24px] font-sans font-bold text-[#1D493E] shrink-0">₹{(pkg1.price ?? 0).toLocaleString('en-IN')}/Person</span>
                      </div>
                      <p className="font-sans font-medium text-sm sm:text-base md:text-[20px] md:leading-[32px] text-[#8D8D8D] w-full max-w-[616px] md:h-[64px] overflow-hidden line-clamp-2 shrink-0">
                        {pkg1.description}
                      </p>
                    </div>
                    {/* Details Grid Block (Width: 616px, Height: 140px, Justify: space-between) */}
                    <div className="w-full max-w-[616px] h-auto flex flex-col sm:flex-row justify-between border-t border-gray-200 pt-3 shrink-0 gap-4 sm:gap-0">
                      {/* Column 1 (Width: 308px, Height: 140px, Gap: space-between) */}
                      <div className="w-full sm:w-[50%] lg:w-[308px] flex flex-col gap-2 sm:gap-0 justify-between shrink-0">
                        <div className="w-full sm:max-w-[308px] h-auto min-h-[50px] flex items-center gap-[8px] shrink-0 py-2">
                          <div className="w-10 h-10 bg-[#FAF9F6] border border-gray-200/60 rounded-[4px] flex items-center justify-center shrink-0">
                            <MapPin className="w-4 h-4 text-[#1D493E]" />
                          </div>
                          <span className="font-sans font-medium text-xs sm:text-sm md:text-[20px] leading-normal text-[#2B2B2B] align-middle">Starts from {pkg1.startPoint || 'Srinagar'}</span>
                        </div>
                        <div className="w-full sm:max-w-[308px] h-auto min-h-[50px] flex items-center gap-[8px] shrink-0 py-2">
                          <div className="w-10 h-10 bg-[#FAF9F6] border border-gray-200/60 rounded-[4px] flex items-center justify-center shrink-0">
                            <ArrowUpRight className="w-4 h-4 text-[#1D493E]" />
                          </div>
                          <span className="font-sans font-medium text-xs sm:text-sm md:text-[20px] leading-normal text-[#2B2B2B] align-middle">{pkg1.difficulty || 'Moderate'} Difficulty</span>
                        </div>
                      </div>
                      {/* Column 2 (Width: 308px, Height: 140px, Gap: space-between) */}
                      <div className="w-full sm:w-[50%] lg:w-[308px] flex flex-col gap-2 sm:gap-0 justify-between shrink-0">
                        <div className="w-full sm:max-w-[308px] h-auto min-h-[50px] flex items-center gap-[8px] shrink-0 py-2">
                          <div className="w-10 h-10 bg-[#FAF9F6] border border-gray-200/60 rounded-[4px] flex items-center justify-center shrink-0">
                            <Users className="w-4 h-4 text-[#1D493E]" />
                          </div>
                          <span className="font-sans font-medium text-xs sm:text-sm md:text-[20px] leading-normal text-[#2B2B2B] align-middle">{pkg1.groupType || 'Curated group Trip'}</span>
                        </div>
                        <div className="w-full sm:max-w-[308px] h-auto min-h-[50px] flex items-center gap-[8px] shrink-0 py-2">
                          <div className="w-10 h-10 bg-[#FAF9F6] border border-gray-200/60 rounded-[4px] flex items-center justify-center shrink-0">
                            <Calendar className="w-4 h-4 text-[#1D493E]" />
                          </div>
                          <span className="font-sans font-medium text-xs sm:text-sm md:text-[20px] leading-normal text-[#2B2B2B] align-middle">Next: {pkg1.nextDeparture || 'Aug, 2026'}</span>
                        </div>
                      </div>
                    </div>
                    {/* Buttons (Width: Fill 624px, Height: Hug 55px, Gap: 12px) */}
                    <div className="flex gap-3 w-full h-[55px] shrink-0 mt-0">
                      <Link 
                        href={`/travel/package/${pkg1.id}`} 
                        className="flex-1 h-[55px] flex items-center justify-center rounded-[4px] bg-[#1D493E] hover:bg-[#15342c] transition cursor-pointer"
                        style={{ color: "#FFFFFF", fontFamily: "'Faktum','Outfit',sans-serif", fontWeight: 500, fontSize: "18px", lineHeight: "100%", letterSpacing: "0px", textDecoration: "none", verticalAlign: "middle" }}
                      >
                        Book Now
                      </Link>
                      <Link 
                        href={pkg1.link || `/travel/package/${pkg1.id}`} 
                        className="flex-1 h-[55px] flex items-center justify-center rounded-[4px] border border-[#1D493E] text-center hover:bg-gray-50 transition"
                        style={{ color: "rgba(29,73,62,1)", fontFamily: "'Faktum','Outfit',sans-serif", fontWeight: 500, fontSize: "18px", lineHeight: "100%", letterSpacing: "0px", textDecoration: "none" }}
                      >
                        Get details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Standard Grid Cards (Bottom Row) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              {(() => {
                const displayPkgs = packagesList && packagesList.length > 0 ? packagesList : HOLIDAY_PACKAGES;
                return displayPkgs.slice(1, 3).map((pkg) => (
                  <div key={pkg.id} className="bg-white rounded-[4px] shadow-xs flex flex-col text-left md:h-[778px] overflow-hidden">
                    {/* Image (Flushed with top, left, and right edges) */}
                    <div className="relative w-full h-[200px] md:h-[384px] overflow-hidden shrink-0">
                      <img 
                        src={pkg.image} 
                        alt={pkg.name} 
                        className="w-full h-full object-cover" 
                        style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)' }}
                      />
                    </div>
                    {/* Details block with padding */}
                    <div className="flex-1 flex flex-col justify-between pt-4 pb-4 px-4 gap-6 md:gap-0">
                      {/* Top Group (Width: Fill, Height: 151px, Gap: 12px) */}
                      <div className="flex flex-col gap-2 min-h-[140px] shrink-0 w-full">
                        {/* Tags Container (Width: Fill, Height: Hug 28px, Justify: space-between) */}
                        <div className="flex justify-between items-center w-full h-[28px] shrink-0">
                          <span className="text-[#FF5A36] bg-[#FF5A36]/10 px-2.5 py-0.5 rounded-[4px] text-xs font-bold">{pkg.category || 'Road Trip'}</span>
                          <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-[4px] text-xs font-bold">{pkg.durationDays} days</span>
                        </div>
                        <div className="flex justify-between items-baseline gap-4">
                          <h3 className="text-2xl md:text-[32px] font-sans font-bold text-[#1D493E] leading-tight truncate flex-1" title={pkg.name}>{pkg.name}</h3>
                          <span className="text-xl md:text-[24px] font-sans font-bold text-[#1D493E] shrink-0">₹{(pkg.price ?? 0).toLocaleString('en-IN')}/Person</span>
                        </div>
                        <p className="font-sans font-medium text-sm sm:text-base md:text-[20px] md:leading-[32px] text-[#8D8D8D] w-full max-w-[616px] md:h-[64px] overflow-hidden line-clamp-2 shrink-0">
                          {pkg.description}
                        </p>
                      </div>

                      {/* Details Grid Block (Width: 616px, Height: 140px, Justify: space-between) */}
                      <div className="w-full max-w-[616px] h-auto flex flex-col sm:flex-row justify-between border-t border-gray-200 pt-3 shrink-0 gap-4 sm:gap-0">
                        {/* Column 1 (Width: 308px, Height: 140px, Gap: space-between) */}
                        <div className="w-full sm:w-[50%] lg:w-[308px] flex flex-col gap-2 sm:gap-0 justify-between shrink-0">
                          <div className="w-full sm:max-w-[308px] h-auto min-h-[50px] flex items-center gap-[8px] shrink-0 py-2">
                            <div className="w-10 h-10 bg-[#FAF9F6] border border-gray-200/60 rounded-[4px] flex items-center justify-center shrink-0">
                              <MapPin className="w-4 h-4 text-[#1D493E]" />
                            </div>
                            <span className="font-sans font-medium text-xs sm:text-sm md:text-[20px] leading-normal text-[#2B2B2B] align-middle">Starts from {pkg.startPoint || 'Srinagar'}</span>
                          </div>
                          <div className="w-full sm:max-w-[308px] h-auto min-h-[50px] flex items-center gap-[8px] shrink-0 py-2">
                            <div className="w-10 h-10 bg-[#FAF9F6] border border-gray-200/60 rounded-[4px] flex items-center justify-center shrink-0">
                              <ArrowUpRight className="w-4 h-4 text-[#1D493E]" />
                            </div>
                            <span className="font-sans font-medium text-xs sm:text-sm md:text-[20px] leading-normal text-[#2B2B2B] align-middle">{pkg.difficulty || 'Moderate'} Difficulty</span>
                          </div>
                        </div>
                        {/* Column 2 (Width: 308px, Height: 140px, Gap: space-between) */}
                        <div className="w-full sm:w-[50%] lg:w-[308px] flex flex-col gap-2 sm:gap-0 justify-between shrink-0">
                          <div className="w-full sm:max-w-[308px] h-auto min-h-[50px] flex items-center gap-[8px] shrink-0 py-2">
                            <div className="w-10 h-10 bg-[#FAF9F6] border border-gray-200/60 rounded-[4px] flex items-center justify-center shrink-0">
                              <Users className="w-4 h-4 text-[#1D493E]" />
                            </div>
                            <span className="font-sans font-medium text-xs sm:text-sm md:text-[20px] leading-normal text-[#2B2B2B] align-middle">{pkg.groupType || 'Curated group Trip'}</span>
                          </div>
                          <div className="w-full sm:max-w-[308px] h-auto min-h-[50px] flex items-center gap-[8px] shrink-0 py-2">
                            <div className="w-10 h-10 bg-[#FAF9F6] border border-gray-200/60 rounded-[4px] flex items-center justify-center shrink-0">
                              <Calendar className="w-4 h-4 text-[#1D493E]" />
                            </div>
                            <span className="font-sans font-medium text-xs sm:text-sm md:text-[20px] leading-normal text-[#2B2B2B] align-middle">Next: {pkg.nextDeparture || 'Aug, 2026'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Buttons (Width: Fill 624px, Height: Hug 55px, Gap: 12px) */}
                      <div className="flex gap-3 w-full h-[55px] shrink-0 mt-0">
                        <Link 
                          href={`/travel/package/${pkg.id}`} 
                          className="flex-1 h-[55px] flex items-center justify-center rounded-[4px] bg-[#1D493E] hover:bg-[#15342c] transition cursor-pointer"
                          style={{ color: "#FFFFFF", fontFamily: "'Faktum','Outfit',sans-serif", fontWeight: 500, fontSize: "18px", lineHeight: "100%", letterSpacing: "0px", textDecoration: "none", verticalAlign: "middle" }}
                        >
                          Book Now
                        </Link>
                        <Link 
                          href={pkg.link || `/travel/package/${pkg.id}`} 
                          className="flex-1 h-[55px] flex items-center justify-center rounded-[4px] border border-[#1D493E] text-center hover:bg-gray-50 transition"
                          style={{ color: "rgba(29,73,62,1)", fontFamily: "'Faktum','Outfit',sans-serif", fontWeight: 500, fontSize: "18px", lineHeight: "100%", letterSpacing: "0px", textDecoration: "none" }}
                        >
                          Get details
                        </Link>
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* Centered Destinations Footer Link (Figma style: 331x68px, padding 18x36px, radius 4px, NO BORDER) */}
            <div className="flex justify-center mt-4 mb-0">
              <Link 
                href="/travel" 
                className="inline-flex items-center justify-center w-full max-w-[331px] h-[68px] pt-[18px] pr-[36px] pb-[18px] pl-[36px] gap-[8px] rounded-[4px] bg-transparent text-[#1D493E] hover:opacity-80 transition-all duration-300 cursor-pointer group"
              >
                <span className="h-[25px] flex items-center justify-center font-sans font-medium text-sm sm:text-base md:text-[20px] leading-none">
                  Explore all destinations
                </span>
                <svg 
                  style={{ width: '32px', height: '32px' }}
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.25" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  <path d="M7 17l2.5-2.5" />
                  <path d="M12.5 11.5L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </Link>
            </div>
          </div>

        </div>
      </section>


      {/* 5. TOP PRODUCT CATEGORIES */}
      <section className="bg-white relative z-10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 pt-2 pb-[32px] flex flex-col gap-[32px]">
          
          {/* Header Row (Flow Horizontal, Justify space-between, Width Fill 1280px, Height Hug 134px) */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100 text-left">
            <div className="space-y-3.5 text-left max-w-4xl">
              <div>
                <span className="inline-block text-[#FF5A36] bg-[#FF5A36]/10 px-2.5 py-1 rounded-[4px] text-xs font-bold uppercase tracking-wider">
                  The Collection
                </span>
              </div>
              <h2 className="text-3xl md:text-[38px] font-serif font-semibold text-[#1D493E] leading-none">
                Shop from our <span className="text-[#FF5A36]">Top Product Categories</span>
              </h2>
              <p className="text-gray-500 text-sm md:text-[18px] font-medium">
                A hand-picked map of the corners of India
              </p>
            </div>
            <div className="shrink-0 pb-1">
              <Link 
                href="/shop"
                className="inline-flex items-center justify-center w-full max-w-[275px] h-[68px] pt-[18px] pr-[36px] pb-[18px] pl-[36px] gap-[8px] rounded-[4px] bg-transparent text-[#1D493E] hover:opacity-80 transition-all duration-300 cursor-pointer group"
              >
                <span className="h-[25px] flex items-center justify-center font-sans font-medium text-sm sm:text-base md:text-[20px] leading-none">
                  View all products
                </span>
                <svg 
                  style={{ width: '32px', height: '32px' }}
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.25" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  <path d="M7 17l2.5-2.5" />
                  <path d="M12.5 11.5L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-left">
            {badges.map((prod) => {
              // Mock product object for cart action
              const mockProduct = {
                id: prod.id,
                name: prod.name,
                price: prod.price,
                image: prod.image,
                category: prod.category,
                rating: prod.rating,
                reviewsCount: 120,
                description: "Featured product"
              };

              const resolvedImg = prod.image || (prod.images && prod.images[0]) || "/naturally_nomad_badge.png";
              const resolvedImages = prod.images || [resolvedImg];

              return (
                <div 
                  key={prod.id} 
                  className="bg-white rounded-[4px] w-full h-auto pb-4 flex flex-col justify-between gap-[16px] hover:shadow-xs transition duration-300 overflow-hidden"
                >
                  {/* Image Container with Dots (Width: 339px, Height: 254px, Radius: 4px) */}
                  <div className="relative w-full h-[254px] rounded-[4px] overflow-hidden shrink-0">
                    <img 
                      src={resolvedImages[activeImageIndices[prod.id] || 0]} 
                      alt={prod.name} 
                      className="w-full h-full object-cover"
                      style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)' }}
                    />
                    {/* Dots indicator */}
                    {resolvedImages.length > 1 && (
                      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                        {resolvedImages.map((_: string, dotIdx: number) => {
                          const isActive = (activeImageIndices[prod.id] || 0) === dotIdx;
                          return (
                            <button
                              key={dotIdx}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setActiveImageIndices(prev => ({ ...prev, [prod.id]: dotIdx }));
                              }}
                              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                                isActive ? 'bg-[#1D493E] scale-110' : 'bg-gray-300 hover:bg-gray-400'
                              }`}
                              aria-label={`Go to slide ${dotIdx + 1}`}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Details Block */}
                  <div className="w-full h-auto flex flex-col justify-between text-left gap-3 px-4">
                    {/* Category Tag */}
                    <span className="inline-flex items-center justify-center h-[24px] rounded-[4px] px-[8px] py-[2px] text-[12px] font-sans font-medium text-[#FF623E] bg-[#FF623E]/8 self-start">
                      {prod.category}
                    </span>
                    
                    {/* Title & Price Row */}
                    <div className="w-full h-auto min-h-[35px] flex justify-between items-center gap-2">
                      <h4 className="text-[16px] font-sans font-semibold text-[#2B2B2B] truncate">{prod.name}</h4>
                      <div className="flex items-center gap-2.5 shrink-0">
                        {prod.originalPrice && prod.originalPrice > prod.price && (
                          <span className="text-gray-400 line-through text-xs font-medium">₹{prod.originalPrice}</span>
                        )}
                        <span className="text-[16px] font-sans font-semibold text-[#2B2B2B]">₹{prod.price}</span>
                      </div>
                    </div>

                    {/* Rating Row */}
                    <div className="flex items-center gap-[12px] h-[20px] shrink-0">
                      <div className="flex text-amber-400 gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </div>
                      <span className="text-xs font-sans font-medium text-[#2B2B2B] leading-none">
                        ({prod.reviewsCount || 120})
                      </span>
                    </div>

                    {/* Bought statistics */}
                    <p className="font-sans font-medium text-xs leading-none text-[#8D8D8D] h-[20px] flex items-center shrink-0">
                      {prod.boughtText || "200+ bought in past month"}
                    </p>

                    {/* Delivery text */}
                    <p className="font-sans font-medium text-[11px] leading-[18px]">
                      <span className="text-[#8D8D8D]">FREE delivery as soon as </span>
                      <span className="text-[#2B2B2B]">Thu, 9 Apr</span>
                    </p>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleProductAdd(mockProduct)}
                      className="w-full h-[44px] py-[8px] px-[16px] gap-[8px] rounded-[4px] border-2 border-[#1D493E] hover:bg-[#1D493E] hover:text-white text-[#1D493E] text-xs font-bold transition flex items-center justify-center cursor-pointer group"
                    >
                      <span>{addedProductId === prod.id ? 'Added to Cart!' : 'Add to cart'}</span>
                      <svg 
                        style={{ width: '18px', height: '18px' }} 
                        viewBox="0 0 28 28" 
                        fill="none" 
                        strokeWidth="1.75" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="shrink-0"
                      >
                        <path 
                          d="M4 5h3l2 11h11l2.5-9H14" 
                          className="stroke-[#1D493E] group-hover:stroke-white transition-colors duration-300"
                        />
                        <path 
                          d="M7.8 8.5H9.5" 
                          className="stroke-[#1D493E] group-hover:stroke-white transition-colors duration-300"
                        />
                        <circle 
                          cx="10.5" 
                          cy="21.5" 
                          r="2" 
                          className="stroke-[#1D493E] group-hover:stroke-white transition-colors duration-300"
                        />
                        <circle 
                          cx="17.5" 
                          cy="21.5" 
                          r="2" 
                          className="stroke-[#1D493E] group-hover:stroke-white transition-colors duration-300"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom active state indicator line */}
          <div className="w-full h-[3px] bg-gray-200 relative rounded overflow-hidden mt-6">
            <div className="absolute left-0 top-0 h-full w-[33.3%] bg-[#1D493E] rounded" />
          </div>

        </div>
      </section>

      <div className="bg-[#FFFF80] text-[#1D493E] border-t border-b border-[#1D493E]/15 h-[78px] flex items-center overflow-hidden select-none relative z-10 py-[24px]">
        <div className="flex items-center whitespace-nowrap gap-[10px] animate-marquee font-serif text-[24px] font-semibold uppercase leading-none tracking-[0px]">
          <span>✦</span><span>BOOK YOUR NEXT TRIP</span>
          <span>✦</span><span>SHOP TRAVEL GEAR</span>
          <span>✦</span><span>DARE TO TRAVEL</span>
          <span>✦</span><span>STICKERS</span>
          <span>✦</span><span>MODERN NOMAD</span>
          <span>✦</span><span>BADGES</span>
          <span>✦</span><span>BOOK YOUR NEXT TRIP</span>
          <span>✦</span><span>SHOP TRAVEL GEAR</span>
          <span>✦</span><span>DARE TO TRAVEL</span>
          <span>✦</span><span>STICKERS</span>
          <span>✦</span><span>MODERN NOMAD</span>
          <span>✦</span><span>BADGES</span>
          <span>✦</span><span>BOOK YOUR NEXT TRIP</span>
          <span>✦</span><span>SHOP TRAVEL GEAR</span>
          <span>✦</span><span>DARE TO TRAVEL</span>
          <span>✦</span><span>STICKERS</span>
          <span>✦</span><span>MODERN NOMAD</span>
          <span>✦</span><span>BADGES</span>
        </div>
      </div>

      {/* 7. TODAY'S BEST DEALS FOR YOU */}
      <section className="bg-white relative z-10">
        <div className="max-w-[1440px] w-full mx-auto pt-[20px] pb-[20px] px-6 md:px-[80px] flex flex-col gap-[32px]">
          
          {/* Header Container */}
          <div className="w-full max-w-[1280px] h-auto mx-auto flex flex-col justify-between items-center bg-white rounded-[4px] text-center gap-4">
            {/* Tag */}
            <div className="flex items-center justify-center h-[18px]">
              <span className="inline-flex items-center justify-center text-[#FF623E] bg-[#FF623E]/8 px-2.5 py-0.5 rounded-[4px] text-[14px] font-semibold uppercase tracking-[1.2px] leading-none">
                Most People Like
              </span>
            </div>
            
            {/* Title */}
            <h2 className="w-full max-w-[1280px] h-auto flex items-center justify-center text-[32px] md:text-[42px] font-serif font-semibold text-[#1D493E] leading-none text-center">
              {pageContent.dealsTitle.includes("best deals") ? (
                <>Today's{" "}<span className="text-[#FF5A36]">best deals</span>{" "}for you</>
              ) : (
                pageContent.dealsTitle
              )}
            </h2>
            
            {/* Subtitle */}
            <p className="w-full max-w-[1280px] h-auto flex items-center justify-center text-[#2B2B2B] text-base md:text-[24px] md:leading-[32px] font-medium text-center">
              A hand-picked map of the corners of India our community keeps coming back to
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[32px] w-full max-w-[1280px] mx-auto">
            {[
              resolveProduct("naturally-nomad-badge-1", "Naturally Nomad", "Badges", "/naturally_nomad_badge.png", 139, 199),
              resolveProduct("explore-more-keychain-1", "Explore more", "Key Chains", "/explore_more_keychain.png", 149, 193),
              resolveProduct("go-banjara-tshirt-1", "Go Banjara", "T-Shirts", "/go_banjara_tshirt.jpg", 399, 599),
              resolveProduct("prod-badge-around", "Naturally Nomad", "Badges", "/around_the_world_sticker.jpg", 139, 199)
            ].map((deal, idx) => {
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
                <div 
                  key={deal.id} 
                  className={`bg-white rounded-[4px] w-full h-auto pb-4 flex flex-col justify-between gap-[16px] hover:shadow-xs transition duration-300 overflow-hidden ${
                    idx >= 3 ? 'hidden md:flex' : 'flex'
                  }`}
                >
                  {/* Image Container with Dots (Width: 339px, Height: 254px, Radius: 4px) */}
                  <div className="relative w-full md:h-[254px] rounded-[4px] overflow-hidden shrink-0">
                    <img 
                      src={deal.images[activeImageIndices[deal.id] || 0]} 
                      alt={deal.name} 
                      className="w-full h-full object-cover"
                      style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)' }}
                    />
                    {/* Dots indicator */}
                    <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                      {deal.images.map((_: string, dotIdx: number) => {
                        const isActive = (activeImageIndices[deal.id] || 0) === dotIdx;
                        return (
                          <button
                            key={dotIdx}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setActiveImageIndices(prev => ({ ...prev, [deal.id]: dotIdx }));
                            }}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                              isActive ? 'bg-[#1D493E] scale-110' : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                            aria-label={`Go to slide ${dotIdx + 1}`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Details Block */}
                  <div className="w-full h-auto flex flex-col justify-between text-left gap-3 px-4">
                    {/* Category Tag */}
                    <span className="inline-flex items-center justify-center h-[28px] rounded-[4px] px-[8px] py-[4px] text-[13px] font-sans font-medium text-[#FF623E] bg-[#FF623E]/8 self-start">
                      {deal.category}
                    </span>
                    
                    {/* Title & Price Row */}
                    <div className="w-full h-auto min-h-[35px] flex justify-between items-center gap-2">
                      <h4 className="text-[15px] md:text-[17px] font-sans font-semibold text-[#2B2B2B] truncate">{deal.name}</h4>
                      <div className="flex items-center gap-2.5 shrink-0">
                        <span className="text-gray-400 line-through text-xs font-medium">₹{deal.originalPrice}</span>
                        <span className="text-[15px] md:text-[17px] font-sans font-semibold text-[#2B2B2B]">₹{deal.price}</span>
                      </div>
                    </div>

                    {/* Rating Row */}
                    <div className="flex items-center gap-[12px] h-[20px] shrink-0">
                      <div className="flex text-amber-400 gap-0.5">
                        <Star className="w-3.5 h-3.5 md:w-[18px] md:h-[18px] fill-current" />
                        <Star className="w-3.5 h-3.5 md:w-[18px] md:h-[18px] fill-current" />
                        <Star className="w-3.5 h-3.5 md:w-[18px] md:h-[18px] fill-current" />
                        <Star className="w-3.5 h-3.5 md:w-[18px] md:h-[18px] fill-current" />
                        <Star className="w-3.5 h-3.5 md:w-[18px] md:h-[18px] fill-current" />
                      </div>
                      <span className="text-xs md:text-sm font-sans font-medium text-[#2B2B2B] leading-none">({deal.reviews})</span>
                    </div>

                    {/* Bought statistics */}
                    <p className="font-sans font-medium text-xs md:text-sm leading-none text-[#8D8D8D] h-[25px] flex items-center shrink-0">{deal.boughtText}</p>

                    {/* Delivery text */}
                    <p className="font-sans font-medium text-[11px] md:text-xs md:leading-[20px]">
                      <span className="text-[#8D8D8D]">FREE delivery as soon as </span>
                      <span className="text-[#2B2B2B]">Thu, 9 Apr, 7 am - 10 pm</span>
                    </p>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleProductAdd(mockProduct)}
                      className="w-full h-[48px] py-[10px] px-[20px] gap-[8px] rounded-[4px] border-2 border-[#1D493E] hover:bg-[#1D493E] hover:text-white text-[#1D493E] text-xs md:text-sm font-bold transition flex items-center justify-center cursor-pointer group"
                    >
                      <span>{addedProductId === deal.id ? 'Added to Cart!' : 'Add to cart'}</span>
                      <svg 
                        style={{ width: '20px', height: '20px' }} 
                        viewBox="0 0 28 28" 
                        fill="none" 
                        strokeWidth="1.75" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="shrink-0"
                      >
                        <path 
                          d="M4 5h3l2 11h11l2.5-9H14" 
                          className="stroke-[#2B2B2B] group-hover:stroke-white transition-colors duration-300"
                        />
                        <path 
                          d="M7.8 8.5H9.5" 
                          className="stroke-[#2B2B2B] group-hover:stroke-white transition-colors duration-300"
                        />
                        <circle 
                          cx="10.5" 
                          cy="21.5" 
                          r="2" 
                          className="stroke-[#1D493E] group-hover:stroke-white transition-colors duration-300"
                        />
                        <circle 
                          cx="17.5" 
                          cy="21.5" 
                          r="2" 
                          className="stroke-[#1D493E] group-hover:stroke-white transition-colors duration-300"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom active state indicator line */}
          <div className="w-full h-[4px] bg-gray-200 relative rounded-full overflow-hidden mt-6">
            <div className="absolute left-0 top-0 h-full w-[40%] bg-[#1D493E] rounded-full" />
          </div>

          {/* View all products footer */}
          <div className="text-center pt-4">
            <Link 
              href="/shop" 
              className="inline-flex items-center justify-center w-[275px] h-[68px] pt-[18px] pr-[36px] pb-[18px] pl-[36px] gap-[8px] rounded-[4px] bg-transparent text-[#1D493E] hover:opacity-80 transition-all duration-300 cursor-pointer group"
            >
              <span className="w-[163px] h-[25px] flex items-center justify-center font-sans font-medium text-[20px] leading-none">
                View all products
              </span>
              <svg 
                style={{ width: '32px', height: '32px' }}
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.25" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="shrink-0"
              >
                <path d="M7 17l2.5-2.5" />
                <path d="M12.5 11.5L17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </Link>
          </div>

        </div>
      </section>

      {/* 8. MOST SELLING PRODUCTS */}
      <section className="bg-white pt-[20px] pb-[20px] text-left relative z-10 border-t border-gray-100">
        <div className="max-w-[1440px] mx-auto px-6 md:px-[80px] flex flex-col gap-[32px]">
          
          {/* Header Row (Flow Horizontal, Justify space-between, Width Fill, items-end) */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 text-left">
            <div className="space-y-3.5 text-left max-w-4xl">
              <h2 className="text-3xl md:text-[42px] font-serif font-semibold text-[#1D493E] leading-none">
                {pageContent.sellingTitle.includes("Selling Products") ? (
                  <>Most <span className="text-[#FF5A36]">Selling Products</span></>
                ) : (
                  pageContent.sellingTitle
                )}
              </h2>
              <p className="text-gray-500 text-base md:text-[24px] md:leading-8 font-medium">
                {pageContent.sellingSub}
              </p>
            </div>
            <div className="shrink-0 pb-1">
              <Link 
                href="/shop"
                className="inline-flex items-center justify-center w-[275px] h-[68px] pt-[18px] pr-[36px] pb-[18px] pl-[36px] gap-[8px] rounded-[4px] bg-transparent text-[#1D493E] hover:opacity-80 transition-all duration-300 cursor-pointer group"
              >
                <span className="w-[163px] h-[25px] flex items-center justify-center font-sans font-medium text-[20px] leading-none">
                  View all products
                </span>
                <svg 
                  style={{ width: '32px', height: '32px' }}
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.25" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  <path d="M7 17l2.5-2.5" />
                  <path d="M12.5 11.5L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[32px] w-full max-w-[1280px] mx-auto">
            {[
              resolveProduct("naturally-nomad-badge-1", "Naturally Nomad", "Badges", "/naturally_nomad_badge.png", 139, 199),
              resolveProduct("banjara-blue-slides-png", "Blue Mavin", "Slippers", "/blue_mavin_slides.jpg", 399, 599),
              resolveProduct("explore-more-keychain-1", "Explore more", "Key Chains", "/explore_more_keychain.png", 149, 193),
              resolveProduct("banjara-slides-1", "Banjara Slides", "Slippers", "/banjara_slides.jpg", 399, 599),
              resolveProduct("wakefit-pillow-1", "Wakefit Pillows", "Travel Pillows", "/wakefit_pillow.jpg", 139, 199),
              resolveProduct("fur-jaden-backpack-1", "Fur Jaden C/W", "Backpacks", "/fur_jaden_backpack.jpg", 149, 193),
              resolveProduct("go-passport-cover-1", "Go Passport Cover", "Passport Covers", "/go_passport_cover.jpg", 399, 599),
              resolveProduct("banjara-luggage-tag-1", "Banjara Luggage Tag", "Luggage Tags", "/banjara_luggage_tag.jpg", 139, 199)
            ].map((prod, idx) => {
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
                <div 
                  key={prod.id} 
                  className={`bg-white rounded-[4px] w-full h-auto pb-4 flex flex-col justify-between gap-[16px] hover:shadow-xs transition duration-300 overflow-hidden ${
                    idx >= 3 ? 'hidden md:flex' : 'flex'
                  }`}
                >
                  {/* Image Container with Dots (Width: 339px, Height: 254px, Radius: 4px) */}
                  <div className="relative w-full md:h-[254px] rounded-[4px] overflow-hidden shrink-0">
                    <img 
                      src={prod.images[activeImageIndices[prod.id] || 0]} 
                      alt={prod.name} 
                      className="w-full h-full object-cover"
                      style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)' }}
                    />
                    {/* Dots indicator */}
                    <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                      {prod.images.map((_: string, dotIdx: number) => {
                        const isActive = (activeImageIndices[prod.id] || 0) === dotIdx;
                        return (
                          <button
                            key={dotIdx}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setActiveImageIndices(prev => ({ ...prev, [prod.id]: dotIdx }));
                            }}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                              isActive ? 'bg-[#1D493E] scale-110' : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                            aria-label={`Go to slide ${dotIdx + 1}`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Details Block */}
                  <div className="w-full h-auto flex flex-col justify-between text-left gap-3 px-4">
                    {/* Category Tag */}
                    <span className="inline-flex items-center justify-center h-[28px] rounded-[4px] px-[8px] py-[4px] text-[13px] font-sans font-medium text-[#FF623E] bg-[#FF623E]/8 self-start">
                      {prod.category}
                    </span>
                    
                    {/* Title & Price Row */}
                    <div className="w-full h-auto min-h-[35px] flex justify-between items-center gap-2">
                      <h4 className="text-[15px] md:text-[17px] font-sans font-semibold text-[#2B2B2B] truncate">{prod.name}</h4>
                      <div className="flex items-center gap-2.5 shrink-0">
                        <span className="text-gray-400 line-through text-xs font-medium">₹{prod.originalPrice}</span>
                        <span className="text-[15px] md:text-[17px] font-sans font-semibold text-[#2B2B2B]">₹{prod.price}</span>
                      </div>
                    </div>

                    {/* Rating Row */}
                    <div className="flex items-center gap-[12px] h-[20px] shrink-0">
                      <div className="flex text-amber-400 gap-0.5">
                        <Star className="w-3.5 h-3.5 md:w-[18px] md:h-[18px] fill-current" />
                        <Star className="w-3.5 h-3.5 md:w-[18px] md:h-[18px] fill-current" />
                        <Star className="w-3.5 h-3.5 md:w-[18px] md:h-[18px] fill-current" />
                        <Star className="w-3.5 h-3.5 md:w-[18px] md:h-[18px] fill-current" />
                        <Star className="w-3.5 h-3.5 md:w-[18px] md:h-[18px] fill-current" />
                      </div>
                      <span className="text-xs md:text-sm font-sans font-medium text-[#2B2B2B] leading-none">({prod.reviews})</span>
                    </div>

                    {/* Bought statistics */}
                    <p className="font-sans font-medium text-xs md:text-sm leading-none text-[#8D8D8D] h-[25px] flex items-center shrink-0">{prod.boughtText}</p>

                    {/* Delivery text */}
                    <p className="font-sans font-medium text-[11px] md:text-xs md:leading-[20px]">
                      <span className="text-[#8D8D8D]">FREE delivery as soon as </span>
                      <span className="text-[#2B2B2B]">Thu, 9 Apr, 7 am - 10 pm</span>
                    </p>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleProductAdd(mockProduct)}
                      className="w-full h-[48px] py-[10px] px-[20px] gap-[8px] rounded-[4px] border-2 border-[#1D493E] hover:bg-[#1D493E] hover:text-white text-[#1D493E] text-xs md:text-sm font-bold transition flex items-center justify-center cursor-pointer group"
                    >
                      <span>{addedProductId === prod.id ? 'Added to Cart!' : 'Add to cart'}</span>
                      <svg 
                        style={{ width: '20px', height: '20px' }} 
                        viewBox="0 0 28 28" 
                        fill="none" 
                        strokeWidth="1.75" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="shrink-0"
                      >
                        <path 
                          d="M4 5h3l2 11h11l2.5-9H14" 
                          className="stroke-[#2B2B2B] group-hover:stroke-white transition-colors duration-300"
                        />
                        <path 
                          d="M7.8 8.5H9.5" 
                          className="stroke-[#2B2B2B] group-hover:stroke-white transition-colors duration-300"
                        />
                        <circle 
                          cx="10.5" 
                          cy="21.5" 
                          r="2" 
                          className="stroke-[#1D493E] group-hover:stroke-white transition-colors duration-300"
                        />
                        <circle 
                          cx="17.5" 
                          cy="21.5" 
                          r="2" 
                          className="stroke-[#1D493E] group-hover:stroke-white transition-colors duration-300"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 8.5 ORANGE HIGHLIGHT MARQUEE BANNER */}
      <div className="bg-[#FF623E] text-white h-[78px] flex items-center overflow-hidden select-none relative z-10 w-full py-[24px]">
        <div className="flex whitespace-nowrap gap-[10px] animate-marquee font-serif font-semibold text-[24px] leading-none uppercase text-white tracking-[0px]">
          <span>✦ ESCAPE THE ORDINARY ✦ SHOP TRAVEL GEAR ✦ DARE TO TRAVEL ✦ ADVENTURE AWAITS ✦ MODERN NOMAD ✦ SHOP TRAVEL GEAR ✦ ESCAPE THE ORDINARY ✦ SHOP TRAVEL GEAR ✦ DARE TO TRAVEL ✦ ADVENTURE AWAITS ✦ MODERN NOMAD ✦ SHOP TRAVEL GEAR ✦ ESCAPE THE ORDINARY ✦ SHOP TRAVEL GEAR ✦ DARE TO TRAVEL ✦ ADVENTURE AWAITS ✦ MODERN NOMAD ✦ SHOP TRAVEL GEAR</span>
        </div>
      </div>

      {/* 9. MEET BONJO SECTION (Brand story) */}
      <section className="max-w-[1440px] w-full mx-auto px-6 md:px-[80px] pt-[28px] pb-[28px] bg-white relative overflow-visible">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px] items-center w-full">
          {/* Left Column: Image with slight rotation and glow */}
          <div className="relative">
            {/* Soft glow background */}
            <div 
              className="absolute -top-[40px] -left-[40px] w-[192px] h-[192px] pointer-events-none" 
              style={{
                background: 'radial-gradient(circle, rgba(224, 84, 52, 0.3) 0%, rgba(224, 84, 52, 0) 70%)'
              }}
            />
            <div className="relative hover:rotate-2 transition-transform duration-500 w-full max-w-[584px] aspect-square mx-auto md:mx-0 bg-transparent">
              <img 
                src="/llama_mascot.png" 
                alt="Bonjo Mascot" 
                className="w-full h-full object-cover filter drop-shadow-[0_25px_30px_rgba(0,0,0,0.18)]"
                style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)' }}
              />
            </div>
          </div>

          {/* Right Column: Text & Content */}
          <div className="flex flex-col gap-[24px] md:gap-[32px] w-full max-w-[644px] h-auto text-left justify-center py-6 md:py-0">
            <div className="flex flex-col gap-[12px]">
              <span className="inline-flex items-center justify-center text-[#FF623E] bg-[#FF623E]/8 px-2.5 py-0.5 rounded-[4px] text-[14px] font-semibold uppercase tracking-[1.2px] leading-none self-start">
                The Banjara Soul
              </span>
              <h2 className="text-4xl md:text-[62px] font-serif font-bold text-[#1D493E] leading-none w-full max-w-[644px] h-auto flex items-center py-2">
                Meet Bonjo.
              </h2>
            </div>
            <div className="flex flex-col gap-[16px] md:gap-[32px] w-full max-w-[644px] h-auto text-[#2B2B2B]/80 text-base md:text-[20px] font-sans font-medium leading-relaxed md:leading-[32px]">
              <p>
                Go Banjara was born from a frustration travel in India had become a checklist. Same cafés, same photo spots, same three-day Goa loop. We wanted something slower, closer to the ground, and honest about the places it visited.
              </p>
              <p>
                So we built a hybrid platform: curated small-group journeys, a shop of honest gear made by artisans we know by name, and a community of travelers who share notes from the road instead of just photos.
              </p>
              <p>
                Travel. Lifestyle. Community. Commerce. Under one roof because we don't think they were ever supposed to live apart.
              </p>
            </div>
            <div className="pt-2">
              <Link 
                href="/about" 
                className="inline-flex items-center justify-center w-[204px] h-[68px] pt-[18px] pr-[36px] pb-[18px] pl-[36px] gap-[8px] rounded-[4px] bg-[#1D493E] hover:bg-[#15342c] text-white font-sans font-bold transition-all duration-300 shadow-sm cursor-pointer"
              >
                <span>Our Story</span>
                <svg 
                  style={{ width: '32px', height: '32px' }}
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.25" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  <path d="M7 17l2.5-2.5" />
                  <path d="M12.5 11.5L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 9.5 REVIEWS SECTION (3-column grid matching Figma design) */}
      <section className="bg-white pt-[28px] pb-0 text-left relative z-10 border-t border-gray-100 w-full">
        <div className="max-w-[1440px] w-full mx-auto flex flex-col gap-[32px]">
          
          {/* Header Row */}
          <div className="w-full max-w-[1440px] h-auto px-6 md:px-[80px] flex flex-col gap-2 text-left shrink-0">
            <div>
              <span className="w-[153px] h-[18px] flex items-center font-sans font-semibold text-[14px] leading-none tracking-[1.2px] text-[#FF623E] uppercase">
                Real Experiences
              </span>
            </div>
            <h2 className="text-3xl md:text-[42px] font-serif font-semibold text-[#1D493E] leading-none w-full max-w-[1280px] h-auto flex items-center py-2">
              What <span className="text-[#FF623E]">people say</span> about products
            </h2>
          </div>
          {/* 3-column Testimonial Grid matching Figma design */}
          <div className="relative w-full max-w-[1440px] h-auto overflow-visible px-6 md:px-[80px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 h-auto relative z-10">
              {/* Column 1 (Faded) */}
              <div className="space-y-8 md:opacity-40 hover:opacity-100 transition duration-300">
                {[
                  {
                    id: "rev-1",
                    name: "Kiran Makwan",
                    subtitle: "Verified Wanderer",
                    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
                    text: "Exploring Spiti Valley with Go Banjara was a life-changing journey. Flawless planning, cozy homestays, and a wonderful group of fellow travelers. Highly recommended!",
                    stars: 5
                  },
                  {
                    id: "rev-4",
                    name: "Priyanka Sen",
                    subtitle: "Slow Traveler",
                    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
                    text: "The double-walled thermal flask keeps my tea steaming hot even at 14,000 feet in Ladakh. Truly premium travel gear built for real mountain conditions.",
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
                        <h4 className="text-sm font-extrabold text-gray-850">{review.name}</h4>
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
                    text: "I bought the waterproof stickers for my laptop and helmet. They've survived rain, dust, and countless rugged camping trips without peeling or fading!",
                    stars: 5
                  },
                  {
                    id: "rev-6",
                    name: "Priya Nair",
                    subtitle: "Solo Backpacker",
                    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
                    text: "The Kerala Backwaters & Munnar Hills trip was breathtaking. The coordination was flawless, and the local guides showed us hidden trails away from all the tourists!",
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
                        <h4 className="text-sm font-black text-gray-888">{review.name}</h4>
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
                    id: "rev-5",
                    name: "Arjun Mehta",
                    subtitle: "Weekend Explorer",
                    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80",
                    text: "Super clean design on the T-shirts! The fit is perfect, the fabric is extremely soft and breathable, and the graphics represent the soul of adventure travel.",
                    stars: 5
                  },
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
                        <h4 className="text-sm font-bold text-gray-850">{review.name}</h4>
                        <p className="text-xs text-gray-400 font-semibold">{review.subtitle}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Edge fade overlay */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1542px] h-[639px] pointer-events-none z-20 hidden lg:block"
              style={{
                background: 'linear-gradient(90deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 12%, rgba(255, 255, 255, 0) 88%, #FFFFFF 100%)'
              }}
            />
          </div>

        </div>
      </section>

      {/* 10. TRAVEL DIARIES / STORIES */}
      <section className="bg-white pt-[28px] pb-[16px] text-left relative z-10 border-t border-gray-100 w-full">
        <div className="w-full max-w-[1280px] mx-auto px-6 md:px-0 flex flex-col gap-[32px]">
          
          {/* Header Container */}
          <div className="w-full max-w-[1280px] h-auto flex flex-col justify-center items-center gap-[12px] text-center shrink-0">
            <div className="h-[18px] flex items-center justify-center">
              <span style={{ fontFamily: "'Faktum', 'Outfit', sans-serif", fontWeight: 600, fontSize: "14px", lineHeight: "100%", letterSpacing: "1.2px", color: "rgba(255, 98, 62, 1)", background: "rgba(255, 98, 62, 0.1)", borderRadius: "4px", textTransform: "uppercase", width: "53px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                BLOGS
              </span>
            </div>
            <h2 className="text-3xl md:text-[42px] font-serif font-semibold text-[#2B2B2B] leading-none h-auto flex items-center justify-center py-2">
              Travel Tales from the curious Explorer
            </h2>
            <p className="text-[#2B2B2B] text-sm sm:text-base md:text-[24px] font-medium leading-relaxed md:leading-[32px] h-auto flex items-center justify-center">
              Follow my voices to discover unique voices, breathtaking landscapes & unforgettable experiences
            </p>
          </div>

          {/* Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 md:gap-x-[32px] md:gap-y-[42px] shrink-0">
            {BLOG_POSTS.slice(0, 4).map((post) => (
              <Link 
                key={post.id} 
                href={`/blog`}
                className="w-full max-w-[624px] h-auto flex flex-col gap-[24px] group block text-left shrink-0"
              >
                {/* Image Wrapper */}
                <div className="relative w-full h-auto aspect-[16/10] overflow-hidden rounded-t-[4px] rounded-b-none bg-gray-100 border border-gray-150 shrink-0">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)' }}
                  />
                </div>
                {/* Text Content */}
                <div className="w-full h-auto flex flex-col gap-[4px] shrink-0">
                  <h3 className="w-full h-auto flex items-start overflow-hidden font-serif font-semibold text-xl sm:text-2xl md:text-[32px] leading-snug tracking-[0px] text-[#2B2B2B] group-hover:text-[#FF5A36] transition-colors">
                    {post.title}
                  </h3>
                  <p className="w-full h-auto flex items-center font-sans font-medium text-sm sm:text-base md:text-[20px] leading-[32px] tracking-[0px] text-[#2B2B2B]/80">
                    {post.date}  •  {post.readTime}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* View all footer */}
          <div className="text-center h-[68px] flex items-center justify-center shrink-0">
            <Link 
              href="/blog" 
              className="inline-flex items-center justify-center w-[185px] h-[68px] pt-[18px] pr-[36px] pb-[18px] pl-[36px] gap-[8px] rounded-[4px] bg-transparent text-[#1D493E] hover:opacity-80 transition-all duration-300 cursor-pointer group"
            >
              <span className="font-sans font-medium text-sm sm:text-base md:text-[20px] leading-none whitespace-nowrap">
                View all
              </span>
              <ArrowUpRight className="w-[24px] h-[24px] shrink-0" strokeWidth={2} />
            </Link>
          </div>

        </div>
      </section>

      {/* 11. FAQ ACCORDION SECTION (Matching Shop page design) */}
      <section className="w-full max-w-[1440px] h-auto bg-white rounded-[4px] pt-[28px] pb-[28px] md:px-[80px] px-6 flex flex-col gap-[32px] mx-auto">
        {/* Header */}
        <div className="w-full max-w-[1280px] h-auto flex flex-col gap-[12px] justify-center text-left">
          <div className="w-[54px] h-[26px] flex items-center justify-center bg-[#FFEBE5] rounded-[4px]">
            <span className="w-[46px] h-[18px] flex items-center justify-center font-sans font-semibold text-[14px] leading-none tracking-[1.2px] text-[#FF623E] uppercase">
              FAQ'S
            </span>
          </div>
          <h2 className="w-full max-w-[541px] h-auto flex items-center font-serif font-semibold text-3xl md:text-[42px] leading-[1] tracking-[0px] text-[#2B2B2B] py-2">
            Frequently asked questions
          </h2>
        </div>

        {/* Accordion List */}
        <div className="w-full border-t border-slate-200 divide-y divide-slate-200">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="py-5 text-left border-b border-slate-200">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex justify-between items-center text-left gap-4 cursor-pointer group"
                >
                  <span className="w-full h-auto py-2 flex items-center font-sans font-medium text-sm sm:text-base md:text-[20px] leading-normal tracking-[0px] text-[#2B2B2B]">
                    {item.question}
                  </span>
                  <span className="text-xl font-medium text-[#1D493E] shrink-0 leading-none select-none">
                    {isOpen ? '—' : '+'}
                  </span>
                </button>
                {/* Expandable answer */}
                {isOpen && (
                  <p className="mt-3 w-full h-auto py-1 font-sans font-medium text-sm sm:text-base md:text-[20px] leading-normal tracking-[0px] text-[#8D8D8D] animate-fade-in">
                    {item.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>



      {/* 12. SERVICES TO HELP YOU SHOP */}
      <section className="w-full max-w-[1440px] bg-white pt-[28px] pb-[28px] md:px-[80px] px-6 flex flex-col gap-[32px] mx-auto">
        {/* Header */}
        <div className="w-full max-w-[1280px] h-auto flex flex-col gap-[12px] justify-center text-left mx-auto">
          <div className="w-[54px] h-[26px] flex items-center justify-center bg-[#FFEBE5] rounded-[4px]">
            <span className="font-sans font-semibold text-[14px] leading-none tracking-[1.2px] text-[#FF623E] uppercase">
              Real
            </span>
          </div>
          <h2 className="font-serif font-semibold text-3xl md:text-[42px] leading-[1] tracking-[0px] text-[#2B2B2B] py-2">
            Services to help you <span className="text-[#FF623E]">shop</span>
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="w-full max-w-[1280px] h-auto grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row gap-[32px] mx-auto">

          {/* Card 1: FAQ */}
          <div className="w-full lg:w-[296px] h-auto flex flex-col gap-[24px] rounded-[4px] bg-white">
            <div className="w-full h-[250px] rounded-tl-[4px] rounded-tr-[4px] overflow-hidden">
              <img src="/service-faq.png" alt="FAQ illustration" className="w-full h-full object-cover" />
            </div>
            <div className="w-full h-auto flex flex-col gap-[12px]">
              <h3 className="font-sans font-semibold text-lg sm:text-xl md:text-[28px] leading-snug tracking-[0px] text-[#2B2B2B]">Frequently Asked Questions (FAQ)</h3>
              <p className="w-full h-auto font-sans font-medium text-sm sm:text-base md:text-[20px] leading-normal tracking-[0px] text-[rgba(43,43,43,0.8)]">See what are the commonly asked questions by our costumers</p>
            </div>
          </div>

          {/* Card 2: Home Delivery */}
          <div className="w-full lg:w-[296px] h-auto flex flex-col gap-[24px] rounded-[4px] bg-white">
            <div className="w-full h-[250px] rounded-tl-[4px] rounded-tr-[4px] overflow-hidden">
              <img src="/service-delivery.png" alt="Home delivery illustration" className="w-full h-full object-cover" />
            </div>
            <div className="w-full h-auto flex flex-col gap-[12px]">
              <h3 className="font-sans font-semibold text-lg sm:text-xl md:text-[28px] leading-snug tracking-[0px] text-[#2B2B2B]">Home Delivery Options available</h3>
              <p className="w-full h-auto font-sans font-medium text-sm sm:text-base md:text-[20px] leading-normal tracking-[0px] text-[rgba(43,43,43,0.8)]">Pay with multiple cards seamlessly and without interruption</p>
            </div>
          </div>

          {/* Card 3: Secure Payment */}
          <div className="w-full lg:w-[296px] h-auto flex flex-col gap-[24px] rounded-[4px] bg-white">
            <div className="w-full h-[250px] rounded-tl-[4px] rounded-tr-[4px] overflow-hidden">
              <img src="/service-payment.png" alt="Secure payment illustration" className="w-full h-full object-cover" />
            </div>
            <div className="w-full h-auto flex flex-col gap-[12px]">
              <h3 className="font-sans font-semibold text-lg sm:text-xl md:text-[28px] leading-snug tracking-[0px] text-[#2B2B2B]">Secure Online Payment Process</h3>
              <p className="w-full h-auto font-sans font-medium text-sm sm:text-base md:text-[20px] leading-normal tracking-[0px] text-[rgba(43,43,43,0.8)]">Pay with multiple cards seamlessly and without interruption</p>
            </div>
          </div>

          {/* Card 4: Open Box Delivery */}
          <div className="w-full lg:w-[296px] h-auto flex flex-col gap-[24px] rounded-[4px] bg-white">
            <div className="w-full h-[250px] rounded-tl-[4px] rounded-tr-[4px] overflow-hidden">
              <img src="/service-openbox.png" alt="Open box delivery illustration" className="w-full h-full object-cover" />
            </div>
            <div className="w-full h-auto flex flex-col gap-[12px]">
              <h3 className="font-sans font-semibold text-lg sm:text-xl md:text-[28px] leading-snug tracking-[0px] text-[#2B2B2B]">Open Box Delivery</h3>
              <p className="w-full h-auto font-sans font-medium text-sm sm:text-base md:text-[20px] leading-normal tracking-[0px] text-[rgba(43,43,43,0.8)]">Pay with multiple cards seamlessly and without interruption</p>
            </div>
          </div>

        </div>
      </section>

      {/* 13. NEWSLETTER / CTA SECTION — 1440×337, py-42, px-80, gap-32 */}
      <section className="w-full py-[42px] px-6 md:px-[80px] bg-white">
        <div
          style={{
            maxWidth: "1440px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "32px",
            textAlign: "center",
          }}
        >
          {/* Text block */}
          <div className="flex flex-col items-center gap-[12px] w-full">
            {/* Heading: Fraunces SemiBold 42px, lh 100%, #2B2B2B */}
            <h2
              className="text-3xl md:text-[42px] font-serif font-semibold text-center text-[#2B2B2B] max-w-[1280px] m-0"
              style={{
                lineHeight: "120%",
                letterSpacing: "0px",
              }}
            >
              The{" "}
              <span style={{ color: "#FF5A36" }}>best adventures</span>{" "}
              find their way to your inbox.
            </h2>
            {/* Subtitle: Faktum Medium 24px, lh 32px, rgba(43,43,43,1) */}
            <p
              className="text-base sm:text-lg md:text-[24px] font-sans font-medium text-center text-[rgba(43,43,43,0.8)] max-w-[1280px] m-0"
              style={{
                lineHeight: "1.4",
                letterSpacing: "0px",
              }}
            >
              Hidden places, exclusive trip drops, curated gear, and stories from the road delivered before anyone else hears about them.
            </p>
          </div>

          {/* Buttons row */}
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-[584px] justify-center items-center">
            {/* Book Now */}
            <Link
              href="/travel"
              style={{
                paddingTop: "16px",
                paddingBottom: "16px",
                paddingLeft: "32px",
                paddingRight: "32px",
                gap: "8px",
                background: "rgba(29, 73, 62, 1)",
                color: "#FFFFFF",
                fontFamily: "'Faktum','Outfit',sans-serif",
                fontWeight: 500,
                fontSize: "18px",
                lineHeight: "100%",
                letterSpacing: "0px",
                verticalAlign: "middle",
                textDecoration: "none",
                transition: "opacity 0.2s",
              }}
              className="w-full sm:w-[286px] h-[55px] flex items-center justify-center rounded-[4px] hover:opacity-90"
            >
              Book Now
            </Link>
            {/* Explore collection */}
            <Link
              href="/shop"
              style={{
                paddingTop: "16px",
                paddingBottom: "16px",
                paddingLeft: "32px",
                paddingRight: "32px",
                gap: "8px",
                border: "2px solid rgba(29, 73, 62, 1)",
                background: "transparent",
                color: "rgba(29, 73, 62, 1)",
                fontFamily: "'Faktum','Outfit',sans-serif",
                fontWeight: 500,
                fontSize: "18px",
                lineHeight: "100%",
                letterSpacing: "0px",
                textDecoration: "none",
                transition: "background 0.2s",
              }}
              className="w-full sm:w-[286px] h-[55px] flex items-center justify-center rounded-[4px] hover:bg-[#1D493E]/5"
            >
              Explore collection
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
