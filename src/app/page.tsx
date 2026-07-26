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
  const { addToCart, setCartOpen, wishlist, toggleWishlist } = useCart();

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

    // 3. Load dynamic page content from cPanel CMS Engine
    const loadCms = () => {
      try {
        const v2Cms = localStorage.getItem('gb_admin_page_content_v2');
        if (v2Cms) {
          const parsed = JSON.parse(v2Cms);
          setPageContent(prev => ({
            ...prev,
            heroTitleLine1: parsed.homeHeroTitleLine1 || prev.heroTitleLine1,
            heroTitleLine2: parsed.homeHeroTitleLine2 || prev.heroTitleLine2,
            heroTitleLine3: parsed.homeHeroTitleLine3 || prev.heroTitleLine3,
            heroSubtitle: parsed.homeHeroSubtitle || prev.heroSubtitle,
            heroShopBtn: parsed.homeHeroShopBtn || prev.heroShopBtn,
            heroTravelBtn: parsed.homeHeroTravelBtn || prev.heroTravelBtn,
            mascotText: parsed.homeMascotText || prev.mascotText,
            dealsTitle: parsed.homeDealsTitle || prev.dealsTitle,
            dealsSub: parsed.homeDealsSub || prev.dealsSub,
            sellingTitle: parsed.homeSellingTitle || prev.sellingTitle,
            sellingSub: parsed.homeSellingSub || prev.sellingSub,
            valuesTitle: parsed.homeValuesTitle || prev.valuesTitle,
            valuesSub: parsed.homeValuesSub || prev.valuesSub,
          }));
          return;
        }

        const savedContent = localStorage.getItem('gb_admin_page_content');
        if (savedContent) {
          const parsed = JSON.parse(savedContent);
          setPageContent(prev => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        console.error('Error loading page content:', e);
      }
    };

    loadCms();

    const handleCmsUpdate = (e: any) => {
      if (e.detail) {
        setPageContent(prev => ({
          ...prev,
          heroTitleLine1: e.detail.homeHeroTitleLine1 || prev.heroTitleLine1,
          heroTitleLine2: e.detail.homeHeroTitleLine2 || prev.heroTitleLine2,
          heroTitleLine3: e.detail.homeHeroTitleLine3 || prev.heroTitleLine3,
          heroSubtitle: e.detail.homeHeroSubtitle || prev.heroSubtitle,
          heroShopBtn: e.detail.homeHeroShopBtn || prev.heroShopBtn,
          heroTravelBtn: e.detail.homeHeroTravelBtn || prev.heroTravelBtn,
          mascotText: e.detail.homeMascotText || prev.mascotText,
          dealsTitle: e.detail.homeDealsTitle || prev.dealsTitle,
          dealsSub: e.detail.homeDealsSub || prev.dealsSub,
          sellingTitle: e.detail.homeSellingTitle || prev.sellingTitle,
          sellingSub: e.detail.homeSellingSub || prev.sellingSub,
          valuesTitle: e.detail.homeValuesTitle || prev.valuesTitle,
          valuesSub: e.detail.homeValuesSub || prev.valuesSub,
        }));
      }
    };

    window.addEventListener('gb_cms_updated', handleCmsUpdate);
    return () => window.removeEventListener('gb_cms_updated', handleCmsUpdate);
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
  const [activeOfferSlide, setActiveOfferSlide] = useState(0);
  const [activeCategorySlide, setActiveCategorySlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 30) {
      setActiveOfferSlide(1);
    } else if (diff < -30) {
      setActiveOfferSlide(0);
    }
    setTouchStartX(null);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white text-[#1D493E] font-sans antialiased relative -mt-[90px]">
      
      {/* 1. HERO VIDEO BACKGROUND LAYER (z-20, sits behind metrics bar z-35) */}
      <div className="relative hero-banner-height w-full z-20 overflow-hidden">
        {/* HTML5 Video Element with Instant Poster & Preload */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/hero-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover scale-[1.08] brightness-[0.75] contrast-[1.05]"
          style={{ transform: 'scale(1.08) translateZ(0)' }}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay to make white text highly readable */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none z-10" />

        {/* 2. HERO CONTENT SECTION (Overlay on top of video, z-20) */}
        <div className="absolute inset-0 flex flex-col justify-end pb-4 sm:pb-8 md:pb-16 lg:pb-20 z-20 bg-transparent animate-fade-in">
          <div className="max-w-full sm:max-w-[390px] md:max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 w-full flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-[18px] md:gap-10 text-left">
            
            {/* Left side: Heading & Subtitle */}
            <div className="flex flex-col gap-2 sm:gap-[18px] md:gap-6 max-w-full sm:max-w-[390px] md:max-w-[850px] text-left">
              <h1 
                style={{
                  fontFamily: "'Faktum','Outfit',sans-serif",
                  fontWeight: 600,
                  letterSpacing: "-0.2px",
                }}
                className="text-[32px] md:text-[54px] xl:text-[62px] leading-[100%] text-white"
              >
                Hey! Let’s Escape from <br className="hidden md:inline" />
                the Ordinary
              </h1>
              <p 
                style={{
                  fontFamily: "'Faktum','Outfit',sans-serif",
                  fontWeight: 500,
                  letterSpacing: "0px",
                }}
                className="text-[14px] md:text-[18px] lg:text-[20px] leading-[24px] md:leading-[28px] lg:leading-[32px] text-white/95 max-w-full sm:max-w-[650px]"
              >
                We bridge the gap between soulful Indian travel and high end gear. <br className="hidden md:inline" />
                curated for those who find home in the dust of the road
              </p>
            </div>

            {/* Right side: Two Buttons side-by-side (gap: 12px, w: 125px / 202px) */}
            <div className="flex flex-row items-center gap-[12px] justify-start shrink-0 pb-1 w-full sm:w-auto overflow-x-auto no-scrollbar">
              <Link 
                href="/shop"
                className="hover:scale-[1.02] active:scale-[0.98] text-[#2B2B2B] bg-white hover:bg-white/90 transition-all duration-300 cursor-pointer flex items-center justify-center w-[125px] sm:w-[150px] md:w-[177px] h-[40px] sm:h-[55px] shrink-0"
                style={{
                  borderRadius: "4px",
                  fontFamily: "'Faktum','Outfit',sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
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
                className="hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center justify-center w-[202px] sm:w-[190px] md:w-[215px] h-[40px] sm:h-[55px] border border-white/30 text-white shrink-0"
                style={{
                  borderRadius: "4px",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(4px)",
                  fontFamily: "'Faktum','Outfit',sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
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
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-20 pt-[20px] pb-[20px] bg-white relative z-35">
        {/* Desktop View (Side-by-side 2 columns, unchanged) */}
        <div className="hidden md:grid md:grid-cols-2 gap-8">
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
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-[4px] bg-white/10 hover:bg-white/15 transition-all duration-300 cursor-pointer text-center"
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
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-[4px] bg-white/15 hover:bg-white/25 transition-all duration-300 cursor-pointer text-center"
                style={{ color: "rgba(255,255,255,1)", fontFamily: "'Faktum','Outfit',sans-serif", fontWeight: 500, fontSize: "16px", lineHeight: "100%", letterSpacing: "0px", verticalAlign: "middle", textDecoration: "none" }}
              >
                <span>Find the Route</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile View (Figma specs: w-390, h-282, padding 20px, gap 18px, rounded 4px + 2 dots below) */}
        <div className="block md:hidden w-full max-w-[390px] mx-auto px-[20px]">
          {/* Card Frame with Touch Swipe Support */}
          <div 
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className={`w-full h-[282px] rounded-[4px] p-[20px] flex flex-col justify-between gap-[18px] text-left transition-all duration-300 shadow-md select-none touch-pan-y ${
              activeOfferSlide === 0 ? 'bg-[#1D493E] text-white' : 'bg-[#FF5A36] text-white'
            }`}
            style={{ boxSizing: 'border-box' }}
          >
            {activeOfferSlide === 0 ? (
              <>
                <div className="flex flex-col gap-[18px] text-left w-full h-[180px]">
                  <h2 
                    style={{
                      width: "100%",
                      fontFamily: "'Faktum','Outfit',sans-serif",
                      fontWeight: 600,
                      fontSize: "22px",
                      lineHeight: "120%",
                      letterSpacing: "0px",
                      color: "#FFFFFF",
                      margin: 0,
                    }}
                  >
                    Shop Travel Gear for Nomads
                  </h2>
                  <p 
                    style={{
                      fontFamily: "'Faktum','Outfit',sans-serif",
                      fontWeight: 500,
                      fontSize: "15px",
                      lineHeight: "26px",
                      letterSpacing: "0px",
                      color: "rgba(255, 255, 255, 0.85)",
                      margin: 0,
                    }}
                  >
                    Explore our collection of hand-picked journals, weather-proof stickers and artisanal badges designed for the road
                  </p>
                </div>
                <Link 
                  href="/shop" 
                  className="inline-flex items-center gap-2 text-white font-sans font-bold text-[16px] hover:opacity-80 transition cursor-pointer text-left mt-auto"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-5 h-5 text-white" />
                </Link>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-[18px] text-left w-full h-[180px]">
                  <h2 
                    style={{
                      width: "100%",
                      fontFamily: "'Faktum','Outfit',sans-serif",
                      fontWeight: 600,
                      fontSize: "22px",
                      lineHeight: "120%",
                      letterSpacing: "0px",
                      color: "#FFFFFF",
                      margin: 0,
                    }}
                  >
                    Book a Trip
                  </h2>
                  <p 
                    style={{
                      fontFamily: "'Faktum','Outfit',sans-serif",
                      fontWeight: 500,
                      fontSize: "15px",
                      lineHeight: "26px",
                      letterSpacing: "0px",
                      color: "rgba(255, 255, 255, 0.90)",
                      margin: 0,
                    }}
                  >
                    Explore our collection of hand-picked journals, weather-proof stickers and artisanal badges designed for the road
                  </p>
                </div>
                <Link 
                  href="/travel" 
                  className="inline-flex items-center gap-2 text-white font-sans font-bold text-[16px] hover:opacity-80 transition cursor-pointer text-left mt-auto"
                >
                  <span>See Travel Packages</span>
                  <ArrowRight className="w-5 h-5 text-white" />
                </Link>
              </>
            )}
          </div>

          {/* Dots Pagination Below Card */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              type="button"
              onClick={() => setActiveOfferSlide(0)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                activeOfferSlide === 0 ? 'w-6 h-2 bg-[#1D493E]' : 'w-2 h-2 bg-slate-300'
              }`}
              aria-label="Offer slide 1: Shop Travel Gear"
            />
            <button
              type="button"
              onClick={() => setActiveOfferSlide(1)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                activeOfferSlide === 1 ? 'w-6 h-2 bg-[#FF5A36]' : 'w-2 h-2 bg-slate-300'
              }`}
              aria-label="Offer slide 2: Book a Trip"
            />
          </div>
        </div>
      </section>

      {/* 4. DESTINATIONS SECTION */}
      <section className="bg-white pt-[20px] pb-0 relative z-10">
        <div className="hidden md:flex max-w-[1440px] mx-auto px-6 md:px-[80px] flex-col gap-[62px] text-center">
          
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
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist({ id: pkg1.id, name: pkg1.name, price: pkg1.price, image: pkg1.image, type: 'travel' });
                      }}
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(4px)",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        zIndex: 20,
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
                      }}
                      className="hover:scale-110 active:scale-95 group transition"
                      title={Array.isArray(wishlist) && wishlist.some((w: any) => w.id === pkg1.id) ? "Remove from wishlist" : "Add to wishlist"}
                      aria-label="Wishlist package"
                    >
                      <Heart 
                        className={`w-4 h-4 transition-colors ${
                          Array.isArray(wishlist) && wishlist.some((w: any) => w.id === pkg1.id)
                            ? 'text-red-500 fill-red-500' 
                            : 'text-slate-700 group-hover:text-red-500'
                        }`} 
                      />
                    </button>
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
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWishlist({ id: pkg.id, name: pkg.name, price: pkg.price, image: pkg.image, type: 'travel' });
                        }}
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          backdropFilter: "blur(4px)",
                          border: "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          zIndex: 20,
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
                        }}
                        className="hover:scale-110 active:scale-95 group transition"
                        title={Array.isArray(wishlist) && wishlist.some((w: any) => w.id === pkg.id) ? "Remove from wishlist" : "Add to wishlist"}
                        aria-label="Wishlist package"
                      >
                        <Heart 
                          className={`w-4 h-4 transition-colors ${
                            Array.isArray(wishlist) && wishlist.some((w: any) => w.id === pkg.id)
                              ? 'text-red-500 fill-red-500' 
                              : 'text-slate-700 group-hover:text-red-500'
                          }`} 
                        />
                      </button>
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

        {/* Mobile Section 4 Container (Reduced side padding px-[12px], card w:[185px] so next card is more visible) */}
        <div className="block md:hidden w-full max-w-[430px] mx-auto py-[12px] px-[12px] bg-white">
          {/* Header Row */}
          <div className="flex items-center justify-between w-full mb-[12px] px-[4px]">
            <h2 className="text-[22px] font-serif font-bold text-[#1D493E] leading-tight m-0">
              Place worth the <span className="text-[#FF5A36]">detour</span>
            </h2>
            <Link 
              href="/travel" 
              className="w-10 h-10 rounded-full bg-[#1D493E] text-white flex items-center justify-center hover:opacity-90 transition shrink-0"
              aria-label="Explore all destinations"
            >
              <ArrowRight className="w-5 h-5 text-white" />
            </Link>
          </div>

          {/* Horizontal Card Carousel */}
          <div className="flex gap-[12px] overflow-x-auto pb-3 scrollbar-none snap-x snap-mandatory px-[4px]">
            {(() => {
              const displayPkgs = packagesList && packagesList.length > 0 ? packagesList : HOLIDAY_PACKAGES;
              return displayPkgs.map((pkg) => (
                <Link 
                  key={pkg.id} 
                  href={`/travel/package/${pkg.id}`}
                  className="snap-start shrink-0 w-[185px] sm:w-[200px] bg-white rounded-[6px] overflow-hidden flex flex-col justify-between text-left select-none border border-gray-100/80 shadow-xs group cursor-pointer"
                  style={{ boxSizing: 'border-box' }}
                >
                  {/* Image Container with Wishlist Button (h: 190px) */}
                  <div className="relative w-full h-[190px] rounded-t-[6px] overflow-hidden shrink-0">
                    <img 
                      src={pkg.image} 
                      alt={pkg.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)' }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist({ id: pkg.id, name: pkg.name, price: pkg.price, image: pkg.image, type: 'travel' });
                      }}
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(4px)",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        zIndex: 20,
                      }}
                      className="hover:scale-110 active:scale-95 group transition"
                    >
                      <Heart 
                        className={`w-3.5 h-3.5 transition-colors ${
                          Array.isArray(wishlist) && wishlist.some((w: any) => w.id === pkg.id)
                            ? 'text-red-500 fill-red-500' 
                            : 'text-slate-700 group-hover:text-red-500'
                        }`} 
                      />
                    </button>
                  </div>

                  {/* Content Container (Fluid height, no text clipping) */}
                  <div className="flex flex-col gap-[6px] p-2.5 flex-1 justify-between bg-white">
                    {/* Category Tag + Duration Tag */}
                    <div className="flex items-center justify-between w-full">
                      <span className="bg-[#FF5A36] text-white px-2 py-0.5 rounded-[4px] text-[10px] font-bold tracking-tight">
                        {pkg.category || 'Road Trip'}
                      </span>
                      <span className="bg-[#1D493E] text-white px-2 py-0.5 rounded-[4px] text-[10px] font-bold tracking-tight">
                        {pkg.durationDays || 5} Days
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-[14px] font-bold font-sans text-[#1D493E] leading-snug line-clamp-1 m-0 pt-0.5" title={pkg.name}>
                      {pkg.name}
                    </h3>

                    {/* Short Description */}
                    <p className="text-[11px] font-sans font-normal text-gray-500 leading-snug line-clamp-2 m-0">
                      {pkg.description || 'Explore royal palaces and shimmering lakeside vistas.'}
                    </p>

                    {/* Metadata Badges */}
                    <div className="flex items-center gap-1 flex-wrap pt-0.5">
                      <span className="bg-gray-100 text-gray-600 text-[9px] px-1.5 py-0.5 rounded-[2px] font-medium">
                        {pkg.startPoint || 'Jaipur'}
                      </span>
                      <span className="bg-gray-100 text-gray-600 text-[9px] px-1.5 py-0.5 rounded-[2px] font-medium">
                        {pkg.groupType || 'Private Trip'}
                      </span>
                      <span className="bg-gray-100 text-gray-600 text-[9px] px-1.5 py-0.5 rounded-[2px] font-medium">
                        Next: {pkg.nextDeparture || 'Aug, 2026'}
                      </span>
                    </div>

                    {/* Pricing */}
                    <div className="flex flex-col gap-0.5 mt-1 pt-1 border-t border-gray-100 w-full text-left">
                      <div className="flex items-baseline justify-between w-full">
                        <div className="flex items-baseline gap-1">
                          <span className="line-through text-gray-400 text-[10px] font-normal">
                            ₹{Math.round((pkg.price ?? 24500) * 1.4).toLocaleString('en-IN')}
                          </span>
                          <span className="text-[12px] font-bold font-sans text-[#1D493E]">
                            ₹{(pkg.price ?? 24500).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <span className="text-[#FF5A36] text-[10px] font-bold whitespace-nowrap">
                          30% off
                        </span>
                      </div>
                      <span className="text-[#8D8D8D] text-[9px] font-medium leading-none">
                        per person
                      </span>
                    </div>
                  </div>
                </Link>
              ));
            })()}
          </div>
        </div>
      </section>


      {/* 5. TOP PRODUCT CATEGORIES */}
      <section className="bg-white relative z-10">
        {/* Desktop View (100% untouched) */}
        <div className="hidden md:flex max-w-[1440px] mx-auto px-6 md:px-20 pt-2 pb-[32px] flex-col gap-[32px]">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100 text-left">
            <div className="space-y-3.5 text-left max-w-4xl">
              <div>
                <span className="inline-block text-[#FF5A36] bg-[#FF5A36]/10 px-2.5 py-1 rounded-[4px] text-xs font-bold uppercase tracking-wider">
                  The Collection
                </span>
              </div>
              <h2 className="text-3xl md:text-[42px] font-serif font-semibold text-[#1D493E] leading-none">
                Shop from our <span className="text-[#FF5A36]">Top Product Categories</span>
              </h2>
              <p className="text-gray-500 text-base md:text-[24px] md:leading-8 font-medium">
                A hand-picked map of the corners of India our community keeps coming back to
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

          <div 
            style={{ width: "100%", maxWidth: "1280px", gap: "32px" }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mx-auto text-left"
          >
            {/* Category 1: Stickers */}
            <Link 
              href="/shop?category=Stickers" 
              style={{ width: "100%", maxWidth: "405.33px", height: "328.63px", display: "flex", flexDirection: "column", textDecoration: "none" }}
              className="group mx-auto"
            >
              <div 
                style={{ height: "237.63px", width: "100%", borderRadius: "4px", overflow: "hidden", backgroundColor: "#FAF9F6", border: "1px solid rgba(229, 231, 235, 0.5)" }}
              >
                <img 
                  src="/around_the_world_sticker.jpg" 
                  alt="Stickers" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)' }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingTop: "24px", height: "91px", boxSizing: "border-box" }}>
                <h4 style={{ fontFamily: "Faktum, sans-serif", fontWeight: 600, fontSize: "24px", height: "30px", lineHeight: "100%", color: "rgba(43, 43, 43, 1)", margin: 0, display: "flex", alignItems: "center" }}>
                  Stickers
                </h4>
                <p style={{ fontFamily: "Faktum, sans-serif", fontWeight: 500, fontSize: "20px", lineHeight: "100%", color: "#8D8D8D", margin: 0, display: "flex", alignItems: "center" }}>
                  Starts from ₹93
                </p>
              </div>
            </Link>

            {/* Category 2: Badges */}
            <Link 
              href="/shop?category=Badges" 
              style={{ width: "100%", maxWidth: "405.33px", height: "328.63px", display: "flex", flexDirection: "column", textDecoration: "none" }}
              className="group mx-auto"
            >
              <div 
                style={{ height: "237.63px", width: "100%", borderRadius: "4px", overflow: "hidden", backgroundColor: "#FAF9F6", border: "1px solid rgba(229, 231, 235, 0.5)" }}
              >
                <img 
                  src="/around_the_world_sticker.jpg" 
                  alt="Badges" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)' }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingTop: "24px", height: "91px", boxSizing: "border-box" }}>
                <h4 style={{ fontFamily: "Faktum, sans-serif", fontWeight: 600, fontSize: "24px", height: "30px", lineHeight: "100%", color: "rgba(43, 43, 43, 1)", margin: 0, display: "flex", alignItems: "center" }}>
                  Badges
                </h4>
                <p style={{ fontFamily: "Faktum, sans-serif", fontWeight: 500, fontSize: "20px", lineHeight: "100%", color: "#8D8D8D", margin: 0, display: "flex", alignItems: "center" }}>
                  Starts from ₹199
                </p>
              </div>
            </Link>

            {/* Category 3: Fridge Magnets */}
            <Link 
              href="/shop?category=Magnets" 
              style={{ width: "100%", maxWidth: "405.33px", height: "328.63px", display: "flex", flexDirection: "column", textDecoration: "none" }}
              className="group mx-auto"
            >
              <div 
                style={{ height: "237.63px", width: "100%", borderRadius: "4px", overflow: "hidden", backgroundColor: "#FAF9F6", border: "1px solid rgba(229, 231, 235, 0.5)" }}
              >
                <img 
                  src="/around_the_world_sticker.jpg" 
                  alt="Fridge Magnets" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)' }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingTop: "24px", height: "91px", boxSizing: "border-box" }}>
                <h4 style={{ fontFamily: "Faktum, sans-serif", fontWeight: 600, fontSize: "24px", height: "30px", lineHeight: "100%", color: "rgba(43, 43, 43, 1)", margin: 0, display: "flex", alignItems: "center" }}>
                  Fridge Magnets
                </h4>
                <p style={{ fontFamily: "Faktum, sans-serif", fontWeight: 500, fontSize: "20px", lineHeight: "100%", color: "#8D8D8D", margin: 0, display: "flex", alignItems: "center" }}>
                  Starts from ₹199
                </p>
              </div>
            </Link>
          </div>

          {/* Bottom active state indicator line */}
          <div className="w-full h-[3px] bg-gray-200 relative rounded overflow-hidden mt-6">
            <div className="absolute left-0 top-0 h-full w-[33.3%] bg-[#1D493E] rounded" />
          </div>
        </div>

        {/* Mobile View (Figma Specs: w-430, height 311, padding 12px 20px, gap 12px, 8 dots below) */}
        <div className="block md:hidden w-full max-w-[430px] mx-auto py-[12px] px-[20px] bg-white">
          {/* Header */}
          <div className="flex items-center justify-between w-full mb-[12px]">
            <h2 className="text-[22px] font-serif font-bold text-[#1D493E] leading-tight m-0">
              Top <span className="text-[#FF5A36]">Products</span>
            </h2>
            <Link 
              href="/shop" 
              className="w-10 h-10 rounded-full bg-[#1D493E] text-white flex items-center justify-center hover:opacity-90 transition shrink-0"
              aria-label="View all products"
            >
              <ArrowRight className="w-5 h-5 text-white" />
            </Link>
          </div>

          {/* Main Mobile Category Card with Image & Gradient Overlay */}
          {(() => {
            const categories = [
              { name: "Stickers", price: "Starts from ₹93", image: "/around_the_world_sticker.jpg", link: "/shop?category=Stickers" },
              { name: "Badges", price: "Starts from ₹199", image: "/around_the_world_sticker.jpg", link: "/shop?category=Badges" },
              { name: "Fridge Magnets", price: "Starts from ₹199", image: "/around_the_world_sticker.jpg", link: "/shop?category=Magnets" },
              { name: "Journals", price: "Starts from ₹299", image: "/around_the_world_sticker.jpg", link: "/shop?category=Journals" },
              { name: "Patches", price: "Starts from ₹120", image: "/around_the_world_sticker.jpg", link: "/shop?category=Patches" },
              { name: "Pins", price: "Starts from ₹85", image: "/around_the_world_sticker.jpg", link: "/shop?category=Pins" },
              { name: "Keychains", price: "Starts from ₹99", image: "/around_the_world_sticker.jpg", link: "/shop?category=Keychains" },
              { name: "T-Shirts", price: "Starts from ₹499", image: "/around_the_world_sticker.jpg", link: "/shop?category=Apparel" },
            ];
            const current = categories[activeCategorySlide % categories.length];
            return (
              <div>
                <Link 
                  href={current.link} 
                  className="relative w-full h-[230px] rounded-[6px] overflow-hidden block group shadow-sm text-left"
                >
                  <img 
                    src={current.image} 
                    alt={current.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)' }}
                  />
                  {/* Bottom Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
                    <h4 className="text-[20px] font-bold font-sans leading-tight text-white m-0">
                      {current.name}
                    </h4>
                    <p className="text-[13px] font-medium font-sans text-white/80 leading-tight m-0 mt-1">
                      {current.price}
                    </p>
                  </div>
                </Link>

                {/* 8 Pagination Dots Below */}
                <div className="flex items-center justify-center gap-1.5 mt-3">
                  {categories.map((cat, idx) => (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setActiveCategorySlide(idx)}
                      className={`transition-all duration-300 rounded-full cursor-pointer ${
                        activeCategorySlide === idx ? 'w-4 h-1.5 bg-[#1D493E]' : 'w-1.5 h-1.5 bg-slate-300'
                      }`}
                      aria-label={`Category ${cat.name}`}
                    />
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* 6. MARQUEE BANNER (Figma specs: w:430, h:31px, padding 8px 20px, gap 10px) */}
      <div className="bg-[#FFFF80] text-[#1D493E] border-t border-b border-[#1D493E]/15 h-[31px] sm:h-[78px] flex items-center overflow-hidden select-none relative z-10 py-[8px] sm:py-[24px] px-[20px]">
        <div className="flex items-center whitespace-nowrap gap-[10px] animate-marquee font-serif text-[12px] sm:text-[24px] font-semibold uppercase leading-none tracking-[0px]">
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
      <section className="bg-white text-left relative z-10 border-t border-gray-100 w-full">
        {/* Desktop Container (hidden md:flex) */}
        <div className="hidden md:flex max-w-[1440px] w-full mx-auto pt-[20px] pb-[20px] px-6 md:px-[80px] flex-col gap-[32px]">
          
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
                    <Link href={`/shop/product/${deal.id}`} className="w-full h-full block cursor-pointer">
                      <img 
                        src={deal.images[activeImageIndices[deal.id] || 0]} 
                        alt={deal.name} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)' }}
                      />
                    </Link>
                    {/* Wishlist Button (Top Right) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(mockProduct);
                      }}
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        width: "34px",
                        height: "34px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(4px)",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        zIndex: 20,
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
                      }}
                      className="hover:scale-110 active:scale-95 group transition"
                      title={Array.isArray(wishlist) && wishlist.some((w: any) => w.id === deal.id) ? "Remove from wishlist" : "Add to wishlist"}
                      aria-label="Wishlist product"
                    >
                      <Heart 
                        className={`w-4 h-4 transition-colors ${
                          Array.isArray(wishlist) && wishlist.some((w: any) => w.id === deal.id)
                            ? 'text-red-500 fill-red-500' 
                            : 'text-slate-600 group-hover:text-red-500'
                        }`} 
                      />
                    </button>

                  </div>

                  {/* Details Block */}
                  <div className="w-full h-auto flex flex-col justify-between text-left gap-3 px-4">
                    {/* Category Tag */}
                    <span className="inline-flex items-center justify-center h-[28px] rounded-[4px] px-[8px] py-[4px] text-[13px] font-sans font-medium text-[#FF623E] bg-[#FF623E]/8 self-start">
                      {deal.category}
                    </span>
                    
                    {/* Title & Price Row */}
                    <div className="w-full h-auto min-h-[35px] flex justify-between items-center gap-2">
                      <Link href={`/shop/product/${deal.id}`} className="truncate hover:text-[#1D493E] transition">
                        <h4 className="text-[15px] md:text-[17px] font-sans font-semibold text-[#2B2B2B] truncate">{deal.name}</h4>
                      </Link>
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

          {/* View all products footer */}
          <div className="text-center pt-4">
            <Link 
              href="/shop" 
              className="inline-flex items-center justify-center w-[275px] h-[68px] pt-[18px] pr-[36px] pb-[18px] pl-[36px] gap-[8px] rounded-[4px] bg-transparent text-[#1D493E] hover:opacity-80 transition-all duration-300 cursor-pointer group"
            >
              <span className="w-[163px] h-[25px] flex items-center justify-center font-sans font-medium text-[20px] leading-none">
                View all products
              </span>
              <ArrowRight className="w-6 h-6 text-[#1D493E] shrink-0" />
            </Link>
          </div>
        </div>

        {/* Mobile Figma Spec Container (block md:hidden) - w:430px max, gap:12px, padding:12px 20px */}
        <div className="block md:hidden w-full max-w-[430px] mx-auto py-[12px] px-[20px] bg-white flex flex-col gap-[12px]">
          {/* Header Row: Title + Round Green Arrow Button */}
          <div className="flex items-center justify-between w-full h-auto min-h-[30px]">
            <h2 className="text-[22px] sm:text-[26px] font-serif font-semibold text-[#1D493E] leading-tight m-0">
              Today's <span className="text-[#FF5A36]">best deals</span>
            </h2>
            <Link 
              href="/shop"
              aria-label="View all products"
              className="w-[30px] h-[30px] rounded-full bg-[#1D493E] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition shrink-0"
            >
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
          </div>

          {/* 2x2 Product Card Grid matching exact Figma screenshot */}
          <div className="grid grid-cols-2 gap-[12px] w-full">
            {[
              resolveProduct("naturally-nomad-badge-1", "Naturally Nomad", "Badges", "/naturally_nomad_badge.png", 250, 300),
              resolveProduct("naturally-nomad-badge-2", "Naturally Nomad", "Badges", "/naturally_nomad_badge.png", 250, 300),
              resolveProduct("naturally-nomad-badge-3", "Naturally Nomad", "Badges", "/naturally_nomad_badge.png", 250, 300),
              resolveProduct("naturally-nomad-badge-4", "Naturally Nomad", "Badges", "/naturally_nomad_badge.png", 250, 300)
            ].map((deal, idx) => (
              <Link
                key={idx}
                href={`/shop/product/${deal.id}`}
                className="w-full bg-white rounded-[4px] flex flex-col gap-[6px] text-left overflow-hidden border border-gray-100/80 shadow-2xs group cursor-pointer"
              >
                <div className="relative w-full h-[130px] rounded-[4px] overflow-hidden bg-gray-50 shrink-0">
                  <img 
                    src={deal.images[0] || "/naturally_nomad_badge.png"} 
                    alt={deal.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                </div>
                <div className="flex flex-col gap-[4px] px-1.5 pb-2">
                  <span className="bg-[#FF5A36] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-[3px] self-start uppercase">
                    Badges
                  </span>
                  <h4 className="text-[12px] font-bold text-[#2B2B2B] leading-tight m-0 truncate">
                    {deal.name}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] pt-0.5">
                    <span className="text-gray-400 line-through text-[9px]">₹300</span>
                    <span className="font-bold text-[#2B2B2B]">₹250</span>
                    <span className="text-[#FF5A36] text-[9px] font-semibold whitespace-nowrap">30% off</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px]">
                    <div className="flex text-amber-400 gap-0.5">
                      {[...Array(5)].map((_, s) => (
                        <Star key={s} className="w-2.5 h-2.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-gray-500 font-medium text-[9px]">(120 Reviews)</span>
                  </div>
                  <p className="text-[9px] text-[#8D8D8D] font-medium m-0 truncate">
                    200+ bought in past month
                  </p>
                  <p className="text-[9px] leading-tight m-0 truncate">
                    <span className="text-[#8D8D8D]">FREE delivery </span>
                    <span className="font-bold text-[#2B2B2B]">Thu, 9 Apr</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. MOST SELLING PRODUCTS */}
      <section className="bg-white text-left relative z-10 border-t border-gray-100 w-full">
        {/* Desktop Container (hidden md:flex) */}
        <div className="hidden md:flex max-w-[1440px] mx-auto pt-[20px] pb-[20px] px-6 md:px-[80px] flex-col gap-[32px]">
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
              resolveProduct("banjara-slides-1", "Banjara Slides", "Slippers", "/banjara_slides.jpg", 399, 599)
            ].map((prod) => {
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
                  className="bg-white rounded-[4px] w-full h-auto pb-4 flex flex-col justify-between gap-[16px] hover:shadow-xs transition duration-300 overflow-hidden flex"
                >
                  <div className="relative w-full md:h-[254px] rounded-[4px] overflow-hidden shrink-0">
                    <img 
                      src={prod.images[activeImageIndices[prod.id] || 0]} 
                      alt={prod.name} 
                      className="w-full h-full object-cover"
                      style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)' }}
                    />
                  </div>

                  <div className="w-full h-auto flex flex-col justify-between text-left gap-3 px-4">
                    <span className="inline-flex items-center justify-center h-[28px] rounded-[4px] px-[8px] py-[4px] text-[13px] font-sans font-medium text-[#FF623E] bg-[#FF623E]/8 self-start">
                      {prod.category}
                    </span>
                    
                    <div className="w-full h-auto min-h-[35px] flex justify-between items-center gap-2">
                      <h4 className="text-[15px] md:text-[17px] font-sans font-semibold text-[#2B2B2B] truncate">{prod.name}</h4>
                      <div className="flex items-center gap-2.5 shrink-0">
                        <span className="text-gray-400 line-through text-xs font-medium">₹{prod.originalPrice}</span>
                        <span className="text-[15px] md:text-[17px] font-sans font-semibold text-[#2B2B2B]">₹{prod.price}</span>
                      </div>
                    </div>

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

                    <p className="font-sans font-medium text-xs md:text-sm leading-none text-[#8D8D8D] h-[25px] flex items-center shrink-0">{prod.boughtText}</p>

                    <p className="font-sans font-medium text-[11px] md:text-xs md:leading-[20px]">
                      <span className="text-[#8D8D8D]">FREE delivery as soon as </span>
                      <span className="text-[#2B2B2B]">Thu, 9 Apr, 7 am - 10 pm</span>
                    </p>

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

        {/* Mobile Figma Spec Container (block md:hidden) - w:430px max, gap:12px, padding:12px 20px */}
        <div className="block md:hidden w-full max-w-[430px] mx-auto py-[12px] px-[20px] bg-white flex flex-col gap-[12px]">
          {/* Header Row: Title + Round Green Arrow Button */}
          <div className="flex items-center justify-between w-full h-auto min-h-[30px]">
            <h2 className="text-[22px] sm:text-[26px] font-serif font-semibold text-[#1D493E] leading-tight m-0">
              Most <span className="text-[#FF5A36]">Selling</span>
            </h2>
            <Link 
              href="/shop"
              aria-label="View all most selling products"
              className="w-[30px] h-[30px] rounded-full bg-[#1D493E] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition shrink-0"
            >
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
          </div>

          {/* 2x2 Product Grid */}
          <div className="grid grid-cols-2 gap-[12px] w-full">
            {[
              resolveProduct("naturally-nomad-badge-1", "Naturally Nomad", "Badges", "/naturally_nomad_badge.png", 139, 199),
              resolveProduct("explore-more-keychain-1", "Naturally Nomad", "Badges", "/naturally_nomad_badge.png", 139, 199),
              resolveProduct("go-banjara-tshirt-1", "Naturally Nomad", "Badges", "/naturally_nomad_badge.png", 139, 199),
              resolveProduct("prod-badge-around", "Naturally Nomad", "Badges", "/around_the_world_sticker.jpg", 139, 199)
            ].map((prod, idx) => (
              <Link 
                key={`${prod.id}-${idx}`}
                href={`/shop/product/${prod.id}`}
                className="w-full bg-white rounded-[4px] flex flex-col gap-[8px] text-left overflow-hidden border border-gray-100/80 shadow-2xs group cursor-pointer"
                style={{ boxSizing: 'border-box' }}
              >
                {/* Product Image */}
                <div className="relative w-full h-[130px] rounded-[4px] overflow-hidden bg-gray-50 shrink-0">
                  <img 
                    src={prod.images[0] || prod.image} 
                    alt={prod.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    style={{ imageRendering: '-webkit-optimize-contrast' }}
                  />
                </div>

                {/* Card Info Content */}
                <div className="flex flex-col gap-[4px] px-1.5 pb-2">
                  {/* Tag */}
                  <span className="bg-[#FF5A36] text-white px-1.5 py-0.5 rounded-[3px] text-[9px] font-bold self-start leading-none">
                    Badges
                  </span>

                  {/* Title */}
                  <h4 className="text-[12px] font-bold text-[#2B2B2B] leading-tight line-clamp-1 m-0">
                    {prod.name || "Naturally Nomad"}
                  </h4>

                  {/* Price Row */}
                  <div className="flex items-baseline gap-1 pt-0.5">
                    <span className="line-through text-gray-400 text-[9px]">₹300</span>
                    <span className="text-[11px] font-bold text-[#2B2B2B]">₹250</span>
                    <span className="text-[#FF5A36] text-[9px] font-semibold">30% off</span>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1">
                    <div className="flex text-amber-400 gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[8px] text-gray-500 font-medium">(120 Reviews)</span>
                  </div>

                  {/* Subtext */}
                  <p className="text-[8px] text-gray-400 font-medium m-0 leading-tight">
                    200+ bought in past month
                  </p>

                  {/* Delivery Info */}
                  <p className="text-[8px] text-gray-500 m-0 leading-tight line-clamp-1">
                    FREE delivery as soon as <span className="font-bold text-[#2B2B2B]">Thu, 9 Apr, 7am - 10 pm</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8.5 ORANGE HIGHLIGHT MARQUEE BANNER */}
      <div className="bg-[#FF623E] text-white h-[39px] md:h-[78px] flex items-center overflow-hidden select-none relative z-10 w-full py-[12px] px-[20px] md:py-[24px] md:px-[80px]">
        <div className="flex whitespace-nowrap gap-[10px] animate-marquee font-serif font-semibold text-[14px] md:text-[24px] leading-none uppercase text-white tracking-[0px]">
          <span>✦ ESCAPE THE ORDINARY ✦ SHOP TRAVEL GEAR ✦ DARE TO TRAVEL ✦ ADVENTURE AWAITS ✦ MODERN NOMAD ✦ SHOP TRAVEL GEAR ✦ ESCAPE THE ORDINARY ✦ SHOP TRAVEL GEAR ✦ DARE TO TRAVEL ✦ ADVENTURE AWAITS ✦ MODERN NOMAD ✦ SHOP TRAVEL GEAR ✦ ESCAPE THE ORDINARY ✦ SHOP TRAVEL GEAR ✦ DARE TO TRAVEL ✦ ADVENTURE AWAITS ✦ MODERN NOMAD ✦ SHOP TRAVEL GEAR</span>
        </div>
      </div>

      {/* 9. MEET BONJO SECTION (Brand story) */}
      <section className="bg-white relative overflow-visible">
        {/* Desktop Container (hidden md:grid) */}
        <div className="hidden md:grid grid-cols-2 gap-[32px] items-center w-full max-w-[1440px] mx-auto px-6 md:px-[80px] pt-[28px] pb-[28px]">
          {/* Left Column: Image with slight rotation and glow */}
          <div className="relative">
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

        {/* Mobile Figma Spec Container (block md:hidden) - w:430px max, gap:24px, padding:12px 20px */}
        <div className="block md:hidden w-full max-w-[430px] mx-auto py-[12px] px-[20px] bg-white flex flex-col gap-[24px]">
          {/* Top Text Content */}
          <div className="flex flex-col gap-[12px] text-left">
            <span className="inline-flex items-center text-[#FF623E] bg-[#FF623E]/8 px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-[1px] self-start leading-none">
              THE BANJARA SOUL
            </span>
            <h2 className="text-[32px] font-serif font-semibold text-[#1D493E] leading-none m-0">
              Meet Bonjo.
            </h2>
            <p className="text-[13px] text-[#2B2B2B] leading-relaxed font-sans font-medium m-0">
              Go Banjara was born from a frustration travel in India had become a checklist. Same cafés, same photo spots, same three-day Goa loop. We wanted something slower, closer to the ground, and honest about the places it visited.
            </p>
            <div className="pt-1">
              <Link 
                href="/about" 
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[4px] bg-[#1D493E] hover:bg-[#15342c] text-white font-sans font-bold text-[14px] transition shrink-0 self-start"
              >
                <span>Our Story</span>
                <ArrowUpRight className="w-4 h-4 text-white" />
              </Link>
            </div>
          </div>

          {/* Bottom Image Content with Glow */}
          <div className="relative w-full flex justify-center items-center">
            <div 
              className="absolute -top-4 -left-2 w-[160px] h-[160px] pointer-events-none" 
              style={{
                background: 'radial-gradient(circle, rgba(224, 84, 52, 0.35) 0%, rgba(224, 84, 52, 0) 70%)'
              }}
            />
            <img 
              src="/llama_mascot.png" 
              alt="Bonjo Mascot" 
              className="relative z-10 w-full max-w-[320px] aspect-square object-cover rounded-[12px] shadow-lg hover:rotate-2 transition duration-500"
              style={{ imageRendering: '-webkit-optimize-contrast' }}
            />
          </div>
        </div>
      </section>

      {/* 9.5 REVIEWS SECTION (3-column grid matching Figma design) */}
      <section className="bg-white text-left relative z-10 border-t border-gray-100 w-full">
        {/* Desktop Container (hidden md:block) */}
        <div className="hidden md:flex max-w-[1440px] w-full mx-auto pt-[28px] flex-col gap-[32px]">
          
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
          
          {/* Marquee Reviews Container with Fade Masks */}
          <div className="relative w-full overflow-hidden py-2">
            {/* Edge fade overlay — white vignette bleeding in from left & right */}
            <div 
              className="absolute inset-y-0 left-0 w-[100px] sm:w-[180px] pointer-events-none z-30"
              style={{ background: 'linear-gradient(90deg, #FFFFFF 0%, rgba(255,255,255,0) 100%)' }}
            />
            <div 
              className="absolute inset-y-0 right-0 w-[100px] sm:w-[180px] pointer-events-none z-30"
              style={{ background: 'linear-gradient(270deg, #FFFFFF 0%, rgba(255,255,255,0) 100%)' }}
            />

            {/* 2 Stacked Scrolling Marquee Rows */}
            <div className="flex flex-col gap-6 py-2">
              {/* Row 1 (Left Infinite Scrolling) */}
              <div className="flex gap-6 py-2 w-max animate-marquee hover:[animation-play-state:paused]">
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
                    id: "rev-2",
                    name: "Ananya Roy",
                    subtitle: "Himalayan Backpacker",
                    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
                    text: "I bought the waterproof stickers for my laptop and helmet. They've survived rain, dust, and countless rugged camping trips without peeling or fading!",
                    stars: 5
                  },
                  {
                    id: "rev-3",
                    name: "Rohan Sharma",
                    subtitle: "Motorcycle Nomad",
                    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
                    text: "The Kashmir Road Trip package was pure magic. Extremely well-planned with authentic local homestays and off-the-beaten-path trails. Will book again!",
                    stars: 5
                  },
                  {
                    id: "rev-1-b",
                    name: "Kiran Makwan",
                    subtitle: "Verified Wanderer",
                    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
                    text: "Exploring Spiti Valley with Go Banjara was a life-changing journey. Flawless planning, cozy homestays, and a wonderful group of fellow travelers. Highly recommended!",
                    stars: 5
                  },
                  {
                    id: "rev-2-b",
                    name: "Ananya Roy",
                    subtitle: "Himalayan Backpacker",
                    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
                    text: "I bought the waterproof stickers for my laptop and helmet. They've survived rain, dust, and countless rugged camping trips without peeling or fading!",
                    stars: 5
                  },
                  {
                    id: "rev-3-b",
                    name: "Rohan Sharma",
                    subtitle: "Motorcycle Nomad",
                    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
                    text: "The Kashmir Road Trip package was pure magic. Extremely well-planned with authentic local homestays and off-the-beaten-path trails. Will book again!",
                    stars: 5
                  }
                ].map((review, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm hover:shadow-xl hover:border-[#FF623E] hover:scale-105 transition-all duration-300 w-[360px] shrink-0 cursor-pointer text-left">
                    <div className="flex text-amber-400 text-sm gap-1">
                      {Array.from({ length: review.stars }).map((_, s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 font-medium italic text-xs md:text-sm leading-relaxed">
                      "{review.text}"
                    </p>
                    <div className="flex items-center gap-3.5 pt-3 border-t border-gray-100">
                      <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-gray-800 leading-none">{review.name}</h4>
                        <p className="text-xs text-[#1D493E] font-semibold mt-0.5">{review.subtitle}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 2 (Right Reverse Infinite Scrolling) */}
              <div className="flex gap-6 py-2 w-max animate-marquee-reverse hover:[animation-play-state:paused]">
                {[
                  {
                    id: "rev-4",
                    name: "Priyanka Sen",
                    subtitle: "Slow Traveler",
                    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
                    text: "The double-walled thermal flask keeps my tea steaming hot even at 14,000 feet in Ladakh. Truly premium travel gear built for real mountain conditions.",
                    stars: 5
                  },
                  {
                    id: "rev-5",
                    name: "Arjun Mehta",
                    subtitle: "Weekend Explorer",
                    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80",
                    text: "Super clean design on the T-shirts! The fit is perfect, the fabric is extremely soft and breathable, and the graphics represent the soul of adventure travel.",
                    stars: 5
                  },
                  {
                    id: "rev-6",
                    name: "Priya Nair",
                    subtitle: "Solo Backpacker",
                    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
                    text: "The Kerala Backwaters & Munnar Hills trip was breathtaking. The coordination was flawless, and the local guides showed us hidden trails away from all the tourists!",
                    stars: 5
                  },
                  {
                    id: "rev-4-b",
                    name: "Priyanka Sen",
                    subtitle: "Slow Traveler",
                    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
                    text: "The double-walled thermal flask keeps my tea steaming hot even at 14,000 feet in Ladakh. Truly premium travel gear built for real mountain conditions.",
                    stars: 5
                  },
                  {
                    id: "rev-5-b",
                    name: "Arjun Mehta",
                    subtitle: "Weekend Explorer",
                    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80",
                    text: "Super clean design on the T-shirts! The fit is perfect, the fabric is extremely soft and breathable, and the graphics represent the soul of adventure travel.",
                    stars: 5
                  },
                  {
                    id: "rev-6-b",
                    name: "Priya Nair",
                    subtitle: "Solo Backpacker",
                    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
                    text: "The Kerala Backwaters & Munnar Hills trip was breathtaking. The coordination was flawless, and the local guides showed us hidden trails away from all the tourists!",
                    stars: 5
                  }
                ].map((review, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm hover:shadow-xl hover:border-[#FF623E] hover:scale-105 transition-all duration-300 w-[360px] shrink-0 cursor-pointer text-left">
                    <div className="flex text-amber-400 text-sm gap-1">
                      {Array.from({ length: review.stars }).map((_, s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 font-medium italic text-xs md:text-sm leading-relaxed">
                      "{review.text}"
                    </p>
                    <div className="flex items-center gap-3.5 pt-3 border-t border-gray-100">
                      <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-gray-800 leading-none">{review.name}</h4>
                        <p className="text-xs text-[#1D493E] font-semibold mt-0.5">{review.subtitle}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View Container with Infinite Marquee Scrolling (block md:hidden) */}
        <div className="block md:hidden w-full py-[16px] bg-white flex flex-col gap-[12px] overflow-hidden">
          <div className="flex flex-col gap-1 text-left px-5">
            <span className="text-[#FF623E] text-[10px] font-bold uppercase tracking-[1px]">
              REAL EXPERIENCES
            </span>
            <h2 className="text-[22px] font-serif font-semibold text-[#1D493E] leading-tight m-0">
              What <span className="text-[#FF623E]">people say</span>
            </h2>
          </div>
          
          {/* Infinite Marquee Ticker Track for Mobile */}
          <div className="w-full overflow-hidden py-1">
            <div className="flex gap-4 w-max animate-marquee hover:[animation-play-state:paused]">
              {[
                {
                  name: "Kiran Makwan",
                  subtitle: "Verified Wanderer",
                  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
                  text: "Exploring Spiti Valley with Go Banjara was a life-changing journey. Flawless planning, cozy homestays, and a wonderful group of fellow travelers!",
                  stars: 5
                },
                {
                  name: "Rohan & Sneha",
                  subtitle: "Honeymoon Travelers",
                  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
                  text: "The Meghalaya Caving & Waterfalls tour was pure magic! Everything was pre-arranged smoothly.",
                  stars: 5
                },
                {
                  name: "Vikramaditya S.",
                  subtitle: "Motorcycle Expeditioner",
                  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
                  text: "Riding from Srinagar to Leh with Go Banjara back-up support was the best adventure of my life!",
                  stars: 5
                },
                {
                  name: "Priyanka Sen",
                  subtitle: "Slow Traveler",
                  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
                  text: "The double-walled thermal flask keeps my tea steaming hot even at 14,000 feet in Ladakh.",
                  stars: 5
                },
                {
                  name: "Kiran Makwan",
                  subtitle: "Verified Wanderer",
                  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
                  text: "Exploring Spiti Valley with Go Banjara was a life-changing journey. Flawless planning, cozy homestays, and a wonderful group of fellow travelers!",
                  stars: 5
                },
                {
                  name: "Rohan & Sneha",
                  subtitle: "Honeymoon Travelers",
                  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
                  text: "The Meghalaya Caving & Waterfalls tour was pure magic! Everything was pre-arranged smoothly.",
                  stars: 5
                },
                {
                  name: "Vikramaditya S.",
                  subtitle: "Motorcycle Expeditioner",
                  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
                  text: "Riding from Srinagar to Leh with Go Banjara back-up support was the best adventure of my life!",
                  stars: 5
                },
                {
                  name: "Priyanka Sen",
                  subtitle: "Slow Traveler",
                  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
                  text: "The double-walled thermal flask keeps my tea steaming hot even at 14,000 feet in Ladakh.",
                  stars: 5
                }
              ].map((review, idx) => (
                <div key={idx} className="bg-gray-50 border border-gray-100 p-4 rounded-[4px] flex flex-col justify-between gap-2.5 text-left w-[280px] shrink-0 shadow-xs">
                  <div className="flex text-amber-400 gap-0.5">
                    {[...Array(review.stars)].map((_, s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 font-medium italic text-xs leading-relaxed m-0 line-clamp-3">
                    "{review.text}"
                  </p>
                  <div className="flex items-center gap-2.5 pt-2 border-t border-gray-200/60 mt-auto">
                    <img src={review.avatar} alt={review.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-gray-800 m-0 leading-none">{review.name}</h4>
                      <p className="text-[10px] text-[#1D493E] font-semibold m-0 mt-0.5">{review.subtitle}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 10. TRAVEL DIARIES / STORIES */}
      <section className="bg-white text-left relative z-10 border-t border-gray-100 w-full">
        {/* Desktop Container (hidden md:block) */}
        <div className="hidden md:flex max-w-[1280px] mx-auto pt-[28px] pb-[16px] px-6 md:px-0 flex-col gap-[32px]">
          
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
                <div className="relative w-full h-auto aspect-[16/10] overflow-hidden rounded-t-[4px] rounded-b-none bg-gray-100 border border-gray-150 shrink-0">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)' }}
                  />
                </div>
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

        {/* Mobile Figma Spec Container (block md:hidden) - w:430px max, gap:12px, padding:12px 20px */}
        <div className="block md:hidden w-full max-w-[430px] mx-auto py-[12px] px-[20px] bg-white flex flex-col gap-[12px]">
          {/* Header Row: Title + Round Green Arrow Button */}
          <div className="flex items-center justify-between w-full h-[30px]">
            <h2 className="text-[32px] font-serif font-semibold text-[#1D493E] leading-none m-0">
              Blogs
            </h2>
            <Link 
              href="/blog"
              aria-label="View all blogs"
              className="w-[30px] h-[30px] rounded-full bg-[#1D493E] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition shrink-0"
            >
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
          </div>

          {/* 2 Horizontal Blog Cards */}
          <div className="flex flex-col gap-[12px] w-full">
            {BLOG_POSTS.slice(0, 2).map((post) => (
              <Link 
                key={post.id}
                href="/blog"
                className="flex flex-row gap-[12px] items-center w-full bg-white rounded-[6px] overflow-hidden text-left group cursor-pointer"
              >
                <div className="w-[130px] h-[130px] rounded-[8px] overflow-hidden bg-gray-100 shrink-0">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    style={{ imageRendering: '-webkit-optimize-contrast' }}
                  />
                </div>
                <div className="flex flex-col justify-between h-[130px] py-1 text-left flex-1 min-w-0">
                  <h3 className="text-[14px] font-serif font-bold text-[#2B2B2B] leading-tight line-clamp-3 group-hover:text-[#FF5A36] transition-colors m-0">
                    {post.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium m-0">
                    {post.date} - {post.readTime}
                  </p>
                  <span className="text-[13px] text-[#4A85FF] font-semibold hover:underline">
                    Read more
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FAQ ACCORDION SECTION (Matching Shop page design) */}
      <section className="bg-white text-left relative z-10 border-t border-gray-100 w-full">
        {/* Desktop Container (hidden md:block) */}
        <div className="hidden md:flex w-full max-w-[1440px] h-auto bg-white rounded-[4px] pt-[28px] pb-[28px] md:px-[80px] px-6 flex-col gap-[32px] mx-auto">
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
                  {isOpen && (
                    <p className="mt-3 w-full h-auto py-1 font-sans font-medium text-sm sm:text-base md:text-[20px] leading-normal tracking-[0px] text-[#8D8D8D] animate-fade-in">
                      {item.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Figma Spec Container (block md:hidden) - w:430px max, gap:12px, padding:12px 20px */}
        <div className="block md:hidden w-full max-w-[430px] mx-auto py-[12px] px-[20px] bg-white flex flex-col gap-[12px]">
          <h2 className="text-[32px] font-serif font-semibold text-[#1D493E] leading-none text-left m-0">
            FAQ’s
          </h2>

          <div className="w-full flex flex-col divide-y divide-gray-100">
            {[
              {
                q: "What materials are the badges made from? Zinc alloy with glossy enamel fill.",
                a: "Lightweight, durable, and safe to pin on bags, jackets, or backpacks without damaging fabric."
              },
              { q: "How big are the stickers?", a: "Our vinyl stickers range between 3 to 4 inches in size, ideal for laptops, water bottles, and helmets." },
              { q: "Do you ship across India?", a: "Yes, we provide free express shipping all across India on orders above ₹499." },
              { q: "Can I return a product if I don't like it?", a: "We offer a 7-day hassle-free return and exchange policy for all unused products." },
              { q: "I have no reviews on this product. Is it safe to buy?", a: "All Go Banjara products undergo strict quality checks and come with 100% verified customer guarantee." }
            ].map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="py-3 text-left">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex justify-between items-center text-left gap-3 cursor-pointer"
                  >
                    <span className="text-[14px] font-medium text-[#2B2B2B] leading-snug">
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#1D493E] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#1D493E] shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <p className="mt-2 text-[12px] font-medium text-gray-400 leading-relaxed m-0 animate-fade-in">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 12. SERVICES TO HELP YOU SHOP */}
      <section className="bg-white text-left relative z-10 border-t border-gray-100 w-full">
        {/* Desktop Container (hidden md:flex) */}
        <div className="hidden md:flex w-full max-w-[1440px] bg-white pt-[28px] pb-[28px] md:px-[80px] px-6 flex-col gap-[32px] mx-auto">
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
        </div>

        {/* Mobile Figma Spec Container (block md:hidden) - w:430px max, gap:12px, padding:12px 20px */}
        <div className="block md:hidden w-full max-w-[430px] mx-auto py-[12px] px-[20px] bg-white flex flex-col gap-[12px]">
          <h2 className="text-[32px] font-serif font-semibold text-[#1D493E] leading-none text-left m-0">
            Services to help you <span className="text-[#FF5A36]">shop</span>
          </h2>

          <div className="grid grid-cols-2 gap-[12px] w-full">
            {[
              {
                title: "Frequently Asked Questions (FAQ)",
                desc: "See commonly asked questions",
                img: "/service-faq.png"
              },
              {
                title: "Home Delivery Options",
                desc: "Multiple payment cards seamlessly",
                img: "/service-delivery.png"
              },
              {
                title: "Secure Online Payment",
                desc: "100% encrypted checkout process",
                img: "/service-payment.png"
              },
              {
                title: "Open Box Delivery",
                desc: "Verify before you receive",
                img: "/service-openbox.png"
              }
            ].map((srv, idx) => (
              <div 
                key={idx}
                className="w-full bg-white border border-gray-100 rounded-[8px] overflow-hidden flex flex-col gap-2 text-left shadow-2xs"
              >
                <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                  <img src={srv.img} alt={srv.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-2.5 flex flex-col gap-1">
                  <h4 className="text-[13px] font-sans font-bold text-[#2B2B2B] leading-tight m-0">
                    {srv.title}
                  </h4>
                  <p className="text-[11px] font-sans font-medium text-gray-400 leading-snug m-0">
                    {srv.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. NEWSLETTER / CTA SECTION */}
      <section className="bg-white text-left relative z-10 border-t border-gray-100 w-full">
        {/* Desktop Container (hidden md:block) */}
        <div className="hidden md:flex w-full py-[42px] px-6 md:px-[80px] bg-white">
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
            <div className="flex flex-col items-center gap-[12px] w-full">
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

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-[584px] justify-center items-center">
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
                  verticalAlign: "middle",
                  textDecoration: "none",
                  transition: "opacity 0.2s",
                }}
                className="w-full sm:w-[286px] h-[55px] flex items-center justify-center rounded-[4px] hover:opacity-90"
              >
                Explore collection
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Figma Spec Container (block md:hidden) - w:430px max, h:180px, gap:12px, padding:12px 20px 62px 20px */}
        <div className="block md:hidden w-full max-w-[430px] mx-auto pt-[12px] px-[20px] pb-[62px] bg-white flex flex-col gap-[12px] items-center text-center">
          <h2 className="text-[24px] font-serif font-bold text-[#1D493E] leading-snug m-0 max-w-[390px]">
            The <span className="text-[#FF5A36]">best adventures</span> find their way to you inbox
          </h2>

          {/* Buttons Row */}
          <div className="flex items-center justify-center gap-[12px] pt-1">
            <Link
              href="/travel"
              className="w-[125px] h-[40px] bg-[#1D493E] text-white font-sans font-bold text-[14px] rounded-[4px] flex items-center justify-center hover:opacity-90 transition"
            >
              Book Now
            </Link>
            <Link
              href="/shop"
              className="w-[160px] h-[40px] border border-[#1D493E] text-[#1D493E] font-sans font-medium text-[14px] rounded-[4px] flex items-center justify-center bg-transparent hover:bg-[#1D493E]/5 transition"
            >
              Explore collection
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
