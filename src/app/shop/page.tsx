'use client';

import React from 'react';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '@/components/providers';
import { PRODUCTS } from '@/data/products';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { TrustBanner } from '@/components/TrustBanner';

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

  const renderProductGrid = (items: Product[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[32px] w-full max-w-[1280px] mx-auto">
      {items.map((prod) => (
        <ProductCard
          key={prod.id}
          product={prod}
          onAddToCart={(p) => addToCart(p, 'shop')}
        />
      ))}
    </div>
  );

  return (
    <div className="bg-white min-h-screen pb-0 flex flex-col items-center">
      {/* Header Section */}
      <header style={{ width: "100%", maxWidth: "1440px", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "white", boxSizing: "border-box" }} className="mx-auto px-6 md:px-[80px] pt-[40px] md:pt-[62px] pb-[24px]">
        {/* Inner header container */}
        <div className="w-full max-w-[1280px] flex flex-col items-center gap-[16px] md:gap-[24px] bg-white rounded-[4px] py-4 text-center shrink-0">
          {/* Tag */}
          <div className="h-[26px] flex items-center justify-center shrink-0 bg-[#FFEBE5] rounded-[4px] px-2.5">
            <span className="font-sans font-semibold text-[14px] leading-none tracking-[1.2px] text-[#FF623E] uppercase whitespace-nowrap">
              Experience the Shopping
            </span>
          </div>

          {/* Heading */}
          <h1
            style={{
              margin: 0,
              fontFamily: "Fraunces, serif",
              fontWeight: 600,
              color: "rgba(43, 43, 43, 1)",
              textAlign: "center",
            }}
            className="text-2xl sm:text-3xl md:text-[42px] leading-tight md:leading-[1.2] w-full max-w-[1280px]"
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
            className="text-sm sm:text-base md:text-[24px] leading-relaxed md:leading-[32px] w-full max-w-[900px]"
          >
            Discover curated travel experiences, gear that keeps up with you, and a community of free-spirited explorers across India.
          </p>
        </div>
      </header>

      {/* Main Sections Container (Width: 1440px, Side Padding: 80px) */}
      <main className="w-full max-w-[1440px] mx-auto mt-0 px-6 md:px-[80px]">
        
        {/* Main 4x2 product grid directly below the EXPERIENCE THE SHOPPING header */}
        <div style={{ paddingTop: "42px", paddingBottom: "42px", display: "flex", flexDirection: "column", width: "100%", backgroundColor: "white" }}>
          {renderProductGrid(mainGridProducts.slice(0, 4))}
          <div style={{ height: "62px" }} className="shrink-0" />
          {renderProductGrid(mainGridProducts.slice(4, 8))}
          <div style={{ height: "62px" }} className="shrink-0" />

          {/* Centered View All Link */}
          <div className="flex justify-center pt-0">
            <Link
              href="/shop/all"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#1D493E] hover:text-[#FF5B37] transition-colors duration-300 group"
            >
              <span>View all products</span>
              <span className="text-base font-semibold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">↗</span>
            </Link>
          </div>
        </div>
        
        {/* Section 1: New Arrivals */}
        <div style={{ paddingTop: "42px", paddingBottom: "42px", display: "flex", flexDirection: "column", width: "100%", backgroundColor: "white" }}>
          {/* Header */}
          <div className="text-left space-y-2.5">
            <span className="inline-block text-[9px] font-black uppercase tracking-[0.15em] text-[#FF5B37] bg-[#FFEBE5] px-2.5 py-1 rounded-sm">
              NEW STYLES
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium">
              <span className="text-[#FF5B37]">New</span> <span className="text-[#2B2B2B]">Arrivals</span>
            </h2>
            <p className="text-xs sm:text-sm font-sans text-slate-500 max-w-3xl leading-relaxed">
              Curated gear for the modern nomad. From durable journal covers to the stickers that tell your story
            </p>
          </div>
          <div style={{ height: "62px" }} className="shrink-0" />

          {/* Grid */}
          {renderProductGrid(newArrivals)}
          <div style={{ height: "62px" }} className="shrink-0" />

          {/* Progress / Scroll Indicator */}
          <div className="w-full max-w-xs mx-auto h-[3px] bg-[#E2E8F0] rounded-full overflow-hidden">
            <div className="w-[40%] h-full bg-[#1D493E] rounded-full"></div>
          </div>
        </div>

        {/* Section 2: Travels Essentials */}
        <div style={{ paddingTop: "42px", paddingBottom: "42px", display: "flex", flexDirection: "column", width: "100%", backgroundColor: "white" }}>
          {/* Header */}
          <div className="text-left space-y-2.5">
            <span className="inline-block text-[9px] font-black uppercase tracking-[0.15em] text-[#FF5B37] bg-[#FFEBE5] px-2.5 py-1 rounded-sm">
              NEW STYLES
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium">
              <span className="text-[#FF5B37]">Travels</span> <span className="text-[#2B2B2B]">Essentials</span>
            </h2>
            <p className="text-xs sm:text-sm font-sans text-slate-500 max-w-3xl leading-relaxed">
              Curated gear for the modern nomad. From durable journal covers to the stickers that tell your story
            </p>
          </div>
          <div style={{ height: "62px" }} className="shrink-0" />

          {/* Grid Rows */}
          {renderProductGrid(travelsEssentials.slice(0, 4))}
          <div style={{ height: "62px" }} className="shrink-0" />
          {renderProductGrid(travelsEssentials.slice(4, 8))}
          <div style={{ height: "62px" }} className="shrink-0" />

          {/* Centered Load More Button */}
          <div className="flex justify-center pt-0">
            <Link 
              href="/shop/travels-essentials" 
              className="px-8 py-3 border border-slate-200 hover:border-[#1D493E] hover:text-[#1D493E] text-slate-500 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-300 inline-block text-center"
            >
              Load more
            </Link>
          </div>
        </div>

        {/* Section 3: Limited Edition */}
        <div style={{ paddingTop: "42px", paddingBottom: "42px", display: "flex", flexDirection: "column", width: "100%", backgroundColor: "white" }}>
          {/* Header */}
          <div className="text-left space-y-2.5">
            <span className="inline-block text-[9px] font-black uppercase tracking-[0.15em] text-[#FF5B37] bg-[#FFEBE5] px-2.5 py-1 rounded-sm">
              NEW STYLES
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium">
              <span className="text-[#FF5B37]">Limited</span> <span className="text-[#2B2B2B]">Edition</span>
            </h2>
            <p className="text-xs sm:text-sm font-sans text-slate-500 max-w-3xl leading-relaxed">
              Curated gear for the modern nomad. From durable journal covers to the stickers that tell your story
            </p>
          </div>
          <div style={{ height: "62px" }} className="shrink-0" />

          {/* Grid */}
          {renderProductGrid(limitedEdition)}
          <div style={{ height: "62px" }} className="shrink-0" />

          {/* Progress / Scroll Indicator */}
          <div className="w-full max-w-xs mx-auto h-[3px] bg-[#E2E8F0] rounded-full overflow-hidden">
            <div className="w-[40%] h-full bg-[#1D493E] rounded-full"></div>
          </div>
        </div>

        {/* Section 4: 25% to 50% Discount Sale */}
        <div style={{ paddingTop: "42px", paddingBottom: "42px", display: "flex", flexDirection: "column", width: "100%", backgroundColor: "white" }}>
          {/* Header */}
          <div className="text-left space-y-2.5">
            <span className="inline-block text-[9px] font-black uppercase tracking-[0.15em] text-[#FF5B37] bg-[#FFEBE5] px-2.5 py-1 rounded-sm">
              NEW STYLES
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium">
              <span className="text-[#FF5B37]">25% to 50% Discount</span> <span className="text-[#2B2B2B]">Sale</span>
            </h2>
            <p className="text-xs sm:text-sm font-sans text-slate-500 max-w-3xl leading-relaxed">
              Curated gear for the modern nomad. From durable journal covers to the stickers that tell your story
            </p>
          </div>
          <div style={{ height: "62px" }} className="shrink-0" />

          {/* Grid Rows */}
          {renderProductGrid(travelsEssentials.slice(0, 4))}
          <div style={{ height: "62px" }} className="shrink-0" />
          {renderProductGrid(travelsEssentials.slice(4, 8))}
          <div style={{ height: "62px" }} className="shrink-0" />

          {/* Centered View All Link */}
          <div className="flex justify-center pt-0">
            <Link
              href="/shop/discount-sale"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#1D493E] hover:text-[#FF5B37] transition-colors duration-300 group"
            >
              <span>View all products</span>
              <span className="text-base font-semibold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">↗</span>
            </Link>
          </div>
        </div>

        {/* Testimonials Section (Captured Memories) (Padding: pt-[42px] pb-[24px]) */}
        <div className="bg-white pt-[42px] pb-[24px] flex flex-col gap-[32px] w-full border-t border-slate-100 mt-8">
          {/* Header */}
          <div className="text-left space-y-2.5">
            <span className="inline-block text-[9px] font-black uppercase tracking-[0.15em] text-[#FF5B37] bg-[#FFEBE5] px-2.5 py-1 rounded-sm">
              CAPTURED MEMORIES
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium">
              Capture your adventurous travel <span className="text-[#FF5B37]">Forever</span>
            </h2>
            <p className="text-xs sm:text-sm font-sans text-slate-500 max-w-3xl leading-relaxed">
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

            {/* Continuous Marquee Track (Pauses on Hover) */}
            <div className="flex gap-8 py-4 w-max animate-marquee hover:[animation-play-state:paused]">
              {[...TESTIMONIALS, ...TESTIMONIALS].map((test, idx) => (
                <div 
                  key={idx} 
                  className="bg-white border border-gray-200 p-8 rounded-2xl flex flex-col justify-between space-y-5 shadow-xs hover:shadow-xl hover:border-[#FF5B37] hover:scale-105 transition-all duration-300 w-[380px] shrink-0 cursor-pointer"
                >
                  <div className="space-y-4">
                    <div className="flex text-amber-400 text-base gap-1">
                      {Array.from({ length: test.rating }).map((_, s) => (
                        <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 font-medium italic text-[15px] leading-relaxed">
                      {test.quote}
                    </p>
                  </div>
                  <div className="flex items-center gap-3.5 pt-4 border-t border-gray-100">
                    <img src={test.avatar} alt={test.author} className="w-11 h-11 rounded-full object-cover shrink-0" />
                    <div>
                      <h4 className="text-[15px] font-bold text-gray-800 leading-none">{test.author}</h4>
                      <p className="text-xs text-[#1D493E] font-semibold mt-1">{test.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section (Padding: pt-[42px] pb-[24px]) */}
        <div className="bg-white pt-[42px] pb-[24px] flex flex-col gap-[32px] w-full border-t border-slate-100 mt-8">
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
          <div className="w-full">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  style={{
                    width: "100%",
                    padding: "24px",
                    borderBottom: "2px solid rgba(204, 204, 204, 0.54)",
                    borderTop: idx === 0 ? "2px solid rgba(204, 204, 204, 0.54)" : "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    boxSizing: "border-box",
                  }}
                  className="text-left"
                >
                  <button
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                    className="group"
                  >
                    <span
                      style={{
                        fontFamily: "Faktum, sans-serif",
                        fontWeight: 500,
                        fontSize: "20px",
                        lineHeight: "32px",
                        color: "rgba(43, 43, 43, 1)",
                        margin: 0,
                      }}
                      className="text-base md:text-[20px]"
                    >
                      {item.question}
                    </span>
                    <span
                      style={{
                        fontSize: "24px",
                        fontWeight: 500,
                        color: "rgba(29, 73, 62, 1)",
                        lineHeight: "100%",
                        userSelect: "none",
                      }}
                      className="shrink-0"
                    >
                      {isOpen ? '—' : '+'}
                    </span>
                  </button>
                  {/* Expandable answer */}
                  {isOpen && (
                    <p
                      style={{
                        fontFamily: "Faktum, sans-serif",
                        fontWeight: 500,
                        fontSize: "20px",
                        lineHeight: "32px",
                        color: "rgba(141, 141, 141, 1)",
                        margin: 0,
                      }}
                      className="text-sm md:text-[20px]"
                    >
                      {item.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Spacer */}
        <div style={{ height: "62px" }} className="shrink-0" />

        {/* 13. NEWSLETTER / CTA SECTION — 1440×337, py-42, px-80, gap-32 */}
        <div
          style={{
            width: "100%",
            paddingTop: "42px",
            paddingBottom: "42px",
            background: "#FFFFFF",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "32px",
              textAlign: "center",
              boxSizing: "border-box",
            }}
          >
            {/* Text block */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
              {/* Heading: Fraunces SemiBold 42px, lh 100%, #2B2B2B */}
              <h2
                style={{
                  fontFamily: "Fraunces, serif",
                  fontWeight: 600,
                  fontSize: "42px",
                  lineHeight: "100%",
                  letterSpacing: "0px",
                  textAlign: "center",
                  color: "#2B2B2B",
                  maxWidth: "1280px",
                  margin: 0,
                }}
                className="text-[28px] md:text-[42px]"
              >
                The{" "}
                <span style={{ color: "#FF5A36" }}>best adventures</span>{" "}
                find their way to your inbox.
              </h2>
              {/* Subtitle: Faktum Medium 24px, lh 32px, rgba(43,43,43,1) */}
              <p
                style={{
                  fontFamily: "Faktum, sans-serif",
                  fontWeight: 500,
                  fontSize: "24px",
                  lineHeight: "32px",
                  letterSpacing: "0px",
                  textAlign: "center",
                  color: "rgba(43, 43, 43, 1)",
                  maxWidth: "1280px",
                  margin: 0,
                }}
                className="text-base md:text-[24px]"
              >
                Hidden places, exclusive trip drops, curated gear, and stories from the road delivered before anyone else hears about them.
              </p>
            </div>

            {/* Button: 286×55, pt-16 pr-32 pb-16 pl-32, radius-4, bg #1D493E */}
            <Link
              href="/travel"
              style={{
                width: "286px",
                height: "55px",
                paddingTop: "16px",
                paddingBottom: "16px",
                paddingLeft: "32px",
                paddingRight: "32px",
                borderRadius: "4px",
                background: "rgba(29, 73, 62, 1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontFamily: "'Faktum','Outfit',sans-serif",
                fontWeight: 500,
                fontSize: "18px",
                lineHeight: "100%",
                letterSpacing: "0px",
                textDecoration: "none",
                transition: "opacity 0.2s",
              }}
              className="hover:opacity-90 inline-flex items-center gap-2"
            >
              <span>Reserve your tour now</span>
              <span className="text-lg font-sans">↗</span>
            </Link>
          </div>
        </div>

      </main>
      <TrustBanner />
    </div>
  );
}
