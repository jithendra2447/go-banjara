'use client';

import React from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { useCart } from '@/components/providers';
import { PRODUCTS } from '@/data/products';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { TrustBanner } from '@/components/TrustBanner';
import { InteractiveProgressBar } from '@/components/InteractiveProgressBar';
import Breadcrumbs from '@/components/Breadcrumbs';

const TESTIMONIALS = [
  {
    rating: 5,
    quote: "“The Zanskar expedition changed how I look at travel. Go Banjara didn't just organize a trek; they brought us into home-cooked meals with Himalayan villagers.”",
    author: "Aarav Mehta",
    role: "Kashmir Trekker",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    rating: 5,
    quote: "“The quality of the journal is incredible. It feels like a piece of art that I take on every expedition. Bonjo's personality shines through the brand!”",
    author: "Rohan Deshmukh",
    role: "Solo Nomad & Journaler",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80"
  },
  {
    rating: 5,
    quote: "“Finding a travel community that respects remote trails and local ecosystems is rare. Go Banjara's team handled every mountain pass with absolute care.”",
    author: "Priya Sharma",
    role: "Spiti Explorer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
  },
  {
    rating: 5,
    quote: "“The enamel badges and brass compass gear are heirloom-grade. You can tell every sticker and cover was designed by people who actually live on the road.”",
    author: "Vikram Sengupta",
    role: "Gear Enthusiast",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
  },
  {
    rating: 5,
    quote: "“Sailing the quiet backwaters with local boatmen gave me back a quiet peace I hadn't felt in years. Unforgettable, authentic Indian travel.”",
    author: "Ananya Iyer",
    role: "Kerala Backwaters Nomad",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80"
  },
  {
    rating: 5,
    quote: "“No commercial tourist traps, no rushed itineraries. Just raw landscapes, campfire conversations, and a tribe of genuine wanderers.”",
    author: "Devansh Verma",
    role: "Highland Photographer",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80"
  }
];

const FAQ_ITEMS = [
  {
    question: "What materials are the badges made from? Zinc alloy with glossy enamel fill.",
    answer: "Lightweight, durable, and safe to pin on bags, jackets, or backpacks without damaging fabric."
  },
  {
    question: "How big are the stickers?",
    answer: "Our stickers are standard 3x3 inches, printed on high-grade weatherproof vinyl with a matte finish."
  },
  {
    question: "Do you ship across India?",
    answer: "Yes, we ship to all pin codes across India with free standard delivery on all orders."
  },
  {
    question: "Can I return a product if I don't like it?",
    answer: "Yes, we offer a hassle-free 7-day return policy for unused items in their original packaging."
  },
  {
    question: "I have no reviews on this product. Is it safe to buy?",
    answer: "Absolutely! All our products go through strict quality control, and we offer secure payment gateways along with customer support to assist you at every step."
  }
];

export default function ShopPage() {
  const { addToCart } = useCart();

  const [productsList, setProductsList] = React.useState<Product[]>(PRODUCTS);
  const [openFaqIdx, setOpenFaqIdx] = React.useState<number | null>(0);
  const [activeMainGridSlide, setActiveMainGridSlide] = React.useState(0);
  const [activeNewArrivalsSlide, setActiveNewArrivalsSlide] = React.useState(0);
  const [activeTravelsEssentialsSlide, setActiveTravelsEssentialsSlide] = React.useState(0);
  const [activeLimitedEditionSlide, setActiveLimitedEditionSlide] = React.useState(0);
  const [activeDiscountSaleSlide, setActiveDiscountSaleSlide] = React.useState(0);

  React.useEffect(() => {
    const saved = localStorage.getItem('gb_admin_products_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProductsList(parsed);
        }
      } catch (e) {
        console.error('Error parsing admin products:', e);
      }
    } else {
      localStorage.setItem('gb_admin_products_v3', JSON.stringify(PRODUCTS));
    }
  }, []);

  // Filter products for the respective sections from local storage productsList
  const mainGridProducts = [
    productsList.find(p => p.id === 'naturally-nomad-badge-1') || productsList[0] || PRODUCTS[0],
    productsList.find(p => p.id === 'explore-more-keychain-1') || productsList[1] || PRODUCTS[1],
    productsList.find(p => p.id === 'go-banjara-tshirt-1') || productsList[2] || PRODUCTS[2],
    productsList.find(p => p.id === 'go-banjara-tshirt-2') || productsList[3] || productsList[3] || PRODUCTS[2],
    productsList.find(p => p.id === 'naturally-nomad-badge-2') || productsList[4] || productsList[0] || PRODUCTS[0],
    productsList.find(p => p.id === 'explore-more-keychain-2') || productsList[5] || productsList[1] || PRODUCTS[1],
    productsList.find(p => p.id === 'go-banjara-tshirt-3') || productsList[6] || productsList[2] || PRODUCTS[2],
    productsList.find(p => p.id === 'go-banjara-tshirt-4') || productsList[7] || productsList[3] || productsList[3] || PRODUCTS[2],
  ];

  const newArrivals = [
    productsList.find(p => p.id === 'naturally-nomad-badge-1') || productsList[0] || PRODUCTS[0],
    productsList.find(p => p.id === 'explore-more-keychain-1') || productsList[1] || PRODUCTS[1],
    productsList.find(p => p.id === 'go-banjara-tshirt-1') || productsList[2] || PRODUCTS[2],
    productsList.find(p => p.id === 'naturally-nomad-badge-2') || productsList[4] || productsList[0] || PRODUCTS[0],
  ];

  const travelsEssentials = [
    productsList.find(p => p.id === 'naturally-nomad-badge-1') || productsList[0] || PRODUCTS[0],
    productsList.find(p => p.id === 'blue-mavin-slides-1') || productsList[10] || PRODUCTS[10],
    productsList.find(p => p.id === 'explore-more-keychain-1') || productsList[1] || PRODUCTS[1],
    productsList.find(p => p.id === 'blue-mavin-slides-2') || productsList[11] || PRODUCTS[11],
    productsList.find(p => p.id === 'wakefit-pillow-1') || productsList[12] || PRODUCTS[12],
    productsList.find(p => p.id === 'fur-jaden-backpack-1') || productsList[14] || PRODUCTS[14],
    productsList.find(p => p.id === 'go-passport-cover-1') || productsList[15] || PRODUCTS[15],
    productsList.find(p => p.id === 'wakefit-pillow-2') || productsList[13] || PRODUCTS[13],
  ];

  const limitedEdition = [
    productsList.find(p => p.id === 'naturally-nomad-badge-1') || productsList[0] || PRODUCTS[0],
    productsList.find(p => p.id === 'explore-more-keychain-1') || productsList[1] || PRODUCTS[1],
    productsList.find(p => p.id === 'go-banjara-tshirt-1') || productsList[2] || PRODUCTS[2],
    productsList.find(p => p.id === 'naturally-nomad-badge-2') || productsList[4] || productsList[0] || PRODUCTS[0],
  ];

  const discountSaleProducts = React.useMemo(() => {
    const discounted = productsList.filter(p => p.originalPrice && p.originalPrice > p.price);
    return discounted.length >= 4 ? discounted : [...discounted, ...travelsEssentials].slice(0, 8);
  }, [productsList, travelsEssentials]);

  const renderProductGrid = (
    items: Product[],
    activeSlideSetter?: (idx: number) => void,
    activeSlideIndex: number = -1
  ) => (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 xl:gap-[32px] w-full max-w-[1280px] mx-auto">
      {items.map((prod, idx) => {
        const isActive = activeSlideIndex === idx;
        return (
          <div 
            key={prod.id} 
            onMouseEnter={() => activeSlideSetter && activeSlideSetter(idx)}
            onClick={() => activeSlideSetter && activeSlideSetter(idx)}
            className="transition-all duration-300 rounded-xl cursor-pointer"
          >
            <ProductCard
              product={prod}
              onAddToCart={(p) => addToCart(p, 'shop')}
            />
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="bg-white min-h-screen pb-0 flex flex-col items-center">
      {/* Header Section (Desktop Figma Specs: 1440x252px, pt:62px, pr:80px, pb:24px, pl:80px, gap:10px) */}
      <header 
        style={{ 
          width: "100%", 
          maxWidth: "1440px", 
          minHeight: "252px",
          display: "flex", 
          flexDirection: "column",
          justifyContent: "center", 
          alignItems: "center", 
          backgroundColor: "white", 
          boxSizing: "border-box",
          paddingTop: "62px",
          paddingRight: "80px",
          paddingBottom: "24px",
          paddingLeft: "80px",
          gap: "10px"
        }} 
        className="mx-auto hidden md:flex"
      >
        {/* Inner header container */}
        <div className="w-full max-w-[1280px] flex flex-col items-center gap-[10px] bg-white text-center shrink-0">
          <span className="inline-flex items-center justify-center h-[26px] w-fit text-[12px] font-bold uppercase tracking-[0.12em] text-[#FF5B37] bg-[#FFEBE5] px-3 rounded-[4px]">
            EXPERIENCE THE SHOPPING
          </span>

          {/* Heading */}
          <h1
            style={{
              margin: 0,
              fontFamily: "Fraunces, serif",
              fontWeight: 600,
              color: "rgba(43, 43, 43, 1)",
              textAlign: "center",
            }}
            className="text-lg sm:text-3xl md:text-[42px] leading-tight md:leading-[1.2] w-full max-w-[1280px]"
          >
            Some journeys change where you go. Others change who you are.
          </h1>

          {/* Subtitle */}
          <p
            style={{
              margin: 0,
              fontFamily: "Faktum, sans-serif",
              fontWeight: 500,
              color: "rgba(43, 43, 43, 1)",
              textAlign: "center",
            }}
            className="text-xs sm:text-base md:text-[20px] leading-relaxed md:leading-[32px] w-full max-w-[900px]"
          >
            Discover curated travel experiences, gear that keeps up with you, and a community of free-spirited explorers across India.
          </p>
        </div>
      </header>

      {/* Mobile Header (block md:hidden) */}
      <header className="flex md:hidden flex-col items-center gap-2 pt-4 pb-2 px-4 bg-white text-center">
        <span className="inline-flex items-center justify-center h-[24px] text-[10px] font-bold uppercase tracking-[0.12em] text-[#FF5B37] bg-[#FFEBE5] px-2.5 rounded-[4px]">
          EXPERIENCE THE SHOPPING
        </span>
        <h1 className="text-xl font-serif font-bold text-[#2B2B2B] leading-tight m-0">
          Some journeys change where you go. Others change who you are.
        </h1>
      </header>

      {/* Main Sections Container (Width: 1440px, Side Padding: 80px) */}
      <main className="w-full max-w-[430px] md:max-w-[1440px] mx-auto mt-0 px-[20px] md:px-[80px]">

        {/* Main 4x2 product grid (Figma Specs: 1440x1522px, pt:42px, pb:42px, gap:62px) */}
        <div style={{ backgroundColor: "white", paddingTop: "42px", paddingBottom: "42px" }} className="flex flex-col w-full">
          {renderProductGrid(mainGridProducts.slice(0, 4))}
          <div className="h-6 sm:h-[32px] shrink-0" />
          {renderProductGrid(mainGridProducts.slice(4, 8))}
          <div style={{ height: "62px" }} className="shrink-0" />

          {/* Centered View All Link */}
          <div className="flex justify-center pt-0">
            <Link
              href="/shop/all"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#1D493E] bg-transparent hover:bg-gray-100 rounded-[8px] px-6 py-3 transition-all duration-300 group"
            >
              <span>View all products</span>
              <span className="text-base font-semibold group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">↗</span>
            </Link>
          </div>
        </div>
        
        {/* Section 1: New Arrivals (Figma Specs: 1440x918px, pt:42px, pb:42px, gap:32px) */}
        <div style={{ paddingTop: "42px", paddingBottom: "42px", display: "flex", flexDirection: "column", width: "100%", backgroundColor: "white", gap: "32px" }}>
          {/* Header */}
          <div className="text-left space-y-1.5 md:space-y-2.5">
            <span className="inline-flex items-center justify-center h-[26px] w-fit text-[12px] font-bold uppercase tracking-[0.12em] text-[#FF5B37] bg-[#FFEBE5] px-3 rounded-[4px]">
              NEW STYLES
            </span>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, letterSpacing: '0px' }} className="text-2xl sm:text-3xl md:text-[42px] leading-tight md:leading-[100%]">
              <span className="text-[#FF5B37]">New</span> <span className="text-[#2B2B2B]">Arrivals</span>
            </h2>
            <p style={{ fontFamily: 'Faktum, sans-serif', fontWeight: 500, letterSpacing: '0px' }} className="hidden md:block text-sm md:text-[24px] text-[#2B2B2B]/80 leading-relaxed">
              Curated gear for the modern nomad. From durable journal covers to the stickers that tell your story
            </p>
          </div>

          {/* Grid */}
          {renderProductGrid(newArrivals, setActiveNewArrivalsSlide, activeNewArrivalsSlide)}

          {/* Progress Bar (Figma Specs: Width: 1280px, Height: 8px, Radius: 24px) */}
          <div className="w-full max-w-[1280px] mx-auto hidden md:block pt-2">
            <InteractiveProgressBar
              totalSlides={newArrivals.length}
              activeSlide={activeNewArrivalsSlide}
              onSlideChange={(idx) => setActiveNewArrivalsSlide(idx)}
              height={8}
              trackColor="#EAEAEA"
              barColor="#1D493E"
            />
          </div>
        </div>

        {/* Section 2: Travels Essentials (Figma Specs: 1440x1687px, pt:42px, pb:42px, gap:32px) */}
        <div style={{ paddingTop: "42px", paddingBottom: "42px", display: "flex", flexDirection: "column", width: "100%", backgroundColor: "white", gap: "32px" }}>
          {/* Header */}
          <div className="text-left space-y-1.5 md:space-y-2.5">
            <span className="inline-flex items-center justify-center h-[26px] w-fit text-[12px] font-bold uppercase tracking-[0.12em] text-[#FF5B37] bg-[#FFEBE5] px-3 rounded-[4px]">
              NEW STYLES
            </span>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, letterSpacing: '0px' }} className="text-2xl sm:text-3xl md:text-[42px] leading-tight md:leading-[100%]">
              <span className="text-[#FF5B37]">Travels</span> <span className="text-[#2B2B2B]">Essentials</span>
            </h2>
            <p style={{ fontFamily: 'Faktum, sans-serif', fontWeight: 500, letterSpacing: '0px' }} className="hidden md:block text-sm md:text-[24px] text-[#2B2B2B]/80 leading-relaxed">
              Curated gear for the modern nomad. From durable journal covers to the stickers that tell your story
            </p>
          </div>

          {/* Grid Rows */}
          <div className="flex flex-col gap-6 sm:gap-[32px] w-full">
            {renderProductGrid(travelsEssentials.slice(0, 4))}
            {renderProductGrid(travelsEssentials.slice(4, 8))}
          </div>

          {/* Centered Load More Button */}
          <div className="flex justify-center pt-2">
            <Link 
              href="/shop/travels-essentials" 
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-[12px] bg-transparent hover:bg-[#EEF2F1] text-[#1D493E] font-sans font-semibold text-base sm:text-lg md:text-[18px] transition-all duration-300 cursor-pointer"
            >
              Load more
            </Link>
          </div>
        </div>

        {/* Section 3: Limited Edition (Figma Specs: 1440x918px, pt:42px, pb:42px, gap:32px) */}
        <div style={{ paddingTop: "42px", paddingBottom: "42px", display: "flex", flexDirection: "column", width: "100%", backgroundColor: "white", gap: "32px" }}>
          {/* Header */}
          <div className="text-left space-y-1.5 md:space-y-2.5">
            <span className="inline-flex items-center justify-center h-[26px] w-fit text-[12px] font-bold uppercase tracking-[0.12em] text-[#FF5B37] bg-[#FFEBE5] px-3 rounded-[4px]">
              NEW STYLES
            </span>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, letterSpacing: '0px' }} className="text-2xl sm:text-3xl md:text-[42px] leading-tight md:leading-[100%]">
              <span className="text-[#FF5B37]">Limited</span> <span className="text-[#2B2B2B]">Edition</span>
            </h2>
            <p style={{ fontFamily: 'Faktum, sans-serif', fontWeight: 500, letterSpacing: '0px' }} className="hidden md:block text-sm md:text-[24px] text-[#2B2B2B]/80 leading-relaxed">
              Curated gear for the modern nomad. From durable journal covers to the stickers that tell your story
            </p>
          </div>

          {/* Grid */}
          {renderProductGrid(limitedEdition, setActiveLimitedEditionSlide, activeLimitedEditionSlide)}

          {/* Progress Bar (Figma Specs: Width: 1280px, Height: 8px, Radius: 24px) */}
          <div className="w-full max-w-[1280px] mx-auto hidden md:block pt-2">
            <InteractiveProgressBar
              totalSlides={limitedEdition.length}
              activeSlide={activeLimitedEditionSlide}
              onSlideChange={(idx) => setActiveLimitedEditionSlide(idx)}
              height={8}
              trackColor="#EAEAEA"
              barColor="#1D493E"
            />
          </div>
        </div>

        {/* Section 4: 25% to 50% Discount Sale (Figma Specs: 1440x1687px, pt:42px, pb:42px, gap:32px) */}
        <div style={{ paddingTop: "42px", paddingBottom: "42px", display: "flex", flexDirection: "column", width: "100%", backgroundColor: "white", gap: "32px" }}>
          {/* Header */}
          <div className="text-left space-y-1.5 md:space-y-2.5">
            <span className="inline-flex items-center justify-center h-[26px] w-fit text-[12px] font-bold uppercase tracking-[0.12em] text-[#FF5B37] bg-[#FFEBE5] px-3 rounded-[4px]">
              NEW STYLES
            </span>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, letterSpacing: '0px' }} className="text-2xl sm:text-3xl md:text-[42px] leading-tight md:leading-[100%]">
              <span className="text-[#FF5B37]">25% to 50% Discount</span> <span className="text-[#2B2B2B]">Sale</span>
            </h2>
            <p style={{ fontFamily: 'Faktum, sans-serif', fontWeight: 500, letterSpacing: '0px' }} className="hidden md:block text-sm md:text-[24px] text-[#2B2B2B]/80 leading-relaxed">
              Curated gear for the modern nomad. From durable journal covers to the stickers that tell your story
            </p>
          </div>

          {/* Grid Rows */}
          <div className="flex flex-col gap-6 sm:gap-[32px] w-full">
            {renderProductGrid(discountSaleProducts.slice(0, 4))}
            {renderProductGrid(discountSaleProducts.slice(4, 8))}
          </div>

          {/* Centered View All Link */}
          <div className="flex justify-center pt-2">
            <Link
              href="/shop/discount-sale"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#1D493E] bg-transparent hover:bg-gray-100 rounded-[8px] px-6 py-3 transition-all duration-300 group"
            >
              <span>View all products</span>
              <span className="text-base font-semibold group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">↗</span>
            </Link>
          </div>
        </div>

        {/* Testimonials Section (Captured Memories) (Figma Specs: 1440x912px, pt:42px, pb:42px, gap:32px) */}
        <div style={{ paddingTop: "42px", paddingBottom: "42px", display: "flex", flexDirection: "column", width: "100%", backgroundColor: "white", gap: "32px" }}>
          {/* Header */}
          <div className="text-left space-y-1.5 md:space-y-2.5">
            <span className="inline-flex items-center justify-center h-[26px] w-fit text-[12px] font-bold uppercase tracking-[0.12em] text-[#FF5B37] bg-[#FFEBE5] px-3 rounded-[4px]">
              CAPTURED MEMORIES
            </span>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, letterSpacing: '0px' }} className="text-2xl sm:text-3xl md:text-[42px] leading-tight md:leading-[100%]">
              Capture your adventurous travel <span className="text-[#FF5B37]">Forever</span>
            </h2>
            <p style={{ fontFamily: 'Faktum, sans-serif', fontWeight: 500, letterSpacing: '0px' }} className="hidden md:block text-sm md:text-[24px] text-[#2B2B2B]/80 leading-relaxed">
              Curated journeys for the modern nomad, designed to push boundaries and discover India's hidden heart
            </p>
          </div>

          {/* Continuous Marquee Wrapper with Linear Gradient Mask & Hover Pause */}
          <div className="w-full relative overflow-hidden">
            {/* Linear Gradient Fade Mask */}
            <div 
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                zIndex: 10,
                background: "linear-gradient(90.01deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 20%, rgba(255, 255, 255, 0) 80%, #FFFFFF 100%)"
              }}
            />

            {/* 2 Stacked Marquee Rows (Row 1 Left, Row 2 Right, Pauses on Hover) */}
            <div className="flex flex-col gap-4 sm:gap-6 py-2">
              {/* Row 1 (Left Scrolling) */}
              <div className="flex gap-4 sm:gap-8 py-2 w-max animate-marquee hover:[animation-play-state:paused]">
                {[...TESTIMONIALS, ...TESTIMONIALS].map((test, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white border border-gray-200 p-4 sm:p-6 rounded-2xl flex flex-col justify-between space-y-3 sm:space-y-4 shadow-xs hover:shadow-xl hover:border-[#FF5B37] hover:scale-105 transition-all duration-300 w-[270px] sm:w-[380px] shrink-0 cursor-pointer"
                  >
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex text-amber-400 text-xs sm:text-sm gap-1">
                        {Array.from({ length: test.rating }).map((_, s) => (
                          <Star key={s} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-gray-700 font-medium italic text-xs sm:text-[15px] leading-relaxed">
                        {test.quote}
                      </p>
                    </div>
                    <div className="flex items-center gap-2.5 sm:gap-3 pt-2.5 sm:pt-3 border-t border-gray-100">
                      <img src={test.avatar} alt={test.author} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shrink-0" />
                      <div>
                        <h4 className="text-xs sm:text-[15px] font-bold text-gray-800 leading-none">{test.author}</h4>
                        <p className="text-[10px] sm:text-xs text-[#1D493E] font-semibold mt-0.5">{test.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 2 (Right Reverse Scrolling) */}
              <div className="flex gap-4 sm:gap-8 py-2 w-max animate-marquee-reverse hover:[animation-play-state:paused]">
                {[...TESTIMONIALS.slice().reverse(), ...TESTIMONIALS.slice().reverse()].map((test, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white border border-gray-200 p-4 sm:p-6 rounded-2xl flex flex-col justify-between space-y-3 sm:space-y-4 shadow-xs hover:shadow-xl hover:border-[#FF5B37] hover:scale-105 transition-all duration-300 w-[270px] sm:w-[380px] shrink-0 cursor-pointer"
                  >
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex text-amber-400 text-xs sm:text-sm gap-1">
                        {Array.from({ length: test.rating }).map((_, s) => (
                          <Star key={s} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-gray-700 font-medium italic text-xs sm:text-[15px] leading-relaxed">
                        {test.quote}
                      </p>
                    </div>
                    <div className="flex items-center gap-2.5 sm:gap-3 pt-2.5 sm:pt-3 border-t border-gray-100">
                      <img src={test.avatar} alt={test.author} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shrink-0" />
                      <div>
                        <h4 className="text-xs sm:text-[15px] font-bold text-gray-800 leading-none">{test.author}</h4>
                        <p className="text-[10px] sm:text-xs text-[#1D493E] font-semibold mt-0.5">{test.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section (Figma Specs: 1440x642px, pt:42px, pb:42px, gap:32px) */}
        <section 
          style={{
            width: "100%",
            maxWidth: "1440px",
            background: "rgba(255, 255, 255, 1)",
            boxSizing: "border-box",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            paddingTop: "42px",
            paddingBottom: "42px",
            gap: "32px"
          }}
          className="text-left w-full"
        >
          <div className="space-y-1.5 md:space-y-2.5">
            <span className="inline-flex items-center justify-center h-[26px] w-fit text-[12px] font-bold uppercase tracking-[0.12em] text-[#FF5B37] bg-[#FFEBE5] px-3 rounded-[4px]">
              FAQ'S
            </span>
            <h2
              style={{
                fontFamily: "Fraunces, serif",
                fontWeight: 600,
                letterSpacing: "0px",
                color: "#2B2B2B",
                margin: 0
              }}
              className="text-xl sm:text-3xl md:text-[42px] leading-tight md:leading-[1.2]"
            >
              Frequently asked questions
            </h2>
          </div>

          <div className="w-full flex flex-col border-t border-gray-200 mt-1 sm:mt-2">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div 
                  key={idx} 
                  className="w-full border-b border-gray-200 py-3 sm:py-5 flex flex-col text-left transition-colors duration-200"
                >
                  <button 
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full flex justify-between items-center text-left focus:outline-none cursor-pointer gap-2"
                  >
                    <span 
                      style={{
                        fontFamily: "Faktum, Outfit, sans-serif",
                        fontWeight: 600,
                        color: "#2C2C2C"
                      }}
                      className="text-xs sm:text-base md:text-[18px] leading-snug md:leading-[26px]"
                    >
                      {item.question}
                    </span>
                    {isOpen ? (
                      <span className="text-lg sm:text-2xl font-semibold text-[#FF623E] select-none shrink-0 ml-2">−</span>
                    ) : (
                      <span className="text-lg sm:text-2xl font-semibold text-[#1D493E] select-none shrink-0 ml-2">+</span>
                    )}
                  </button>
                  {isOpen && (
                    <p 
                      style={{
                        fontFamily: "Faktum, Outfit, sans-serif",
                        fontWeight: 500,
                        color: "#666666",
                        margin: 0
                      }}
                      className="text-[11px] sm:text-sm leading-relaxed md:leading-[22px] pt-1.5 sm:pt-2 animate-fade-in-up"
                    >
                      {item.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Spacer */}
        <div className="h-4 sm:h-[62px] shrink-0" />

        {/* Section 12: Newsletter CTA Section (Figma Specs: 1440x342px, pt:42px, pb:42px, gap:32px) */}
        <section 
          style={{
            width: "100%",
            maxWidth: "1440px",
            minHeight: "342px",
            background: "rgba(255, 255, 255, 1)",
            boxSizing: "border-box",
            margin: "0 auto",
            paddingTop: "42px",
            paddingBottom: "42px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "32px"
          }}
          className="w-full text-center"
        >
          {/* Text block */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }} className="gap-2 sm:gap-[12px]">
            {/* Heading */}
            <h2
              style={{
                fontFamily: "Fraunces, serif",
                fontWeight: 600,
                letterSpacing: "0px",
                textAlign: "center",
                color: "#2B2B2B",
                maxWidth: "1280px",
                margin: 0,
              }}
              className="text-lg sm:text-3xl md:text-[42px] leading-tight md:leading-[1.2]"
            >
              The{" "}
              <span style={{ color: "#FF5A36" }}>best adventures</span>{" "}
              find their way to your inbox.
            </h2>
            {/* Subtitle */}
            <p
              style={{
                fontFamily: "Faktum, sans-serif",
                fontWeight: 500,
                textAlign: "center",
                color: "rgba(43, 43, 43, 0.8)",
                maxWidth: "900px",
                margin: 0,
              }}
              className="text-xs sm:text-base md:text-[20px] leading-relaxed md:leading-[32px]"
            >
              Hidden places, exclusive trip drops, curated gear, and stories from the road delivered before anyone else hears about them.
            </p>
          </div>

          {/* Button */}
          <Link
            href="/travel"
            style={{
              fontFamily: "Outfit, sans-serif",
              fontWeight: 600,
              lineHeight: "1",
              letterSpacing: "0px",
              textDecoration: "none",
            }}
            className="inline-flex items-center justify-center gap-2 text-sm sm:text-base bg-[#1D493E] hover:bg-[#15372e] text-white rounded-[6px] px-6 py-3.5 transition-all duration-300 shadow-sm group"
          >
            <span>Reserve your tour now</span>
            <span className="text-base font-semibold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">↗</span>
          </Link>
        </section>

      </main>
      <TrustBanner />
    </div>
  );
}
