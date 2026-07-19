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
    quote: "“The quality of the journal is incredible. It feels like a piece of art that I can actually take on my treks. Bonjo’s personality shines through the brand!”",
    author: "Kiran Makwan",
    role: "Verified Wanderer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    rating: 5,
    quote: "“The quality of the journal is incredible. It feels like a piece of art that I can actually take on my treks. Bonjo’s personality shines through the brand!”",
    author: "Kiran Makwan",
    role: "Verified Wanderer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    rating: 5,
    quote: "“The quality of the journal is incredible. It feels like a piece of art that I can actually take on my treks. Bonjo’s personality shines through the brand!”",
    author: "Kiran Makwan",
    role: "Verified Wanderer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    rating: 5,
    quote: "“The quality of the journal is incredible. It feels like a piece of art that I can actually take on my treks. Bonjo’s personality shines through the brand!”",
    author: "Kiran Makwan",
    role: "Verified Wanderer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    rating: 5,
    quote: "“The quality of the journal is incredible. It feels like a piece of art that I can actually take on my treks. Bonjo’s personality shines through the brand!”",
    author: "Kiran Makwan",
    role: "Verified Wanderer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    rating: 5,
    quote: "“The quality of the journal is incredible. It feels like a piece of art that I can actually take on my treks. Bonjo’s personality shines through the brand!”",
    author: "Kiran Makwan",
    role: "Verified Wanderer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
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

          {/* Testimonial grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Column 1 (Faded) */}
            <div className="space-y-8 md:opacity-40 hover:opacity-100 transition duration-300">
              {[TESTIMONIALS[0], TESTIMONIALS[3]].map((test, i) => (
                <div key={i} className="bg-gray-50 border border-gray-100 p-8 rounded-2xl space-y-5 text-left shadow-2xs">
                  <div className="flex gap-0.5">
                    {Array.from({ length: test.rating }).map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-[#FFB95E] text-[#FFB95E]" />
                    ))}
                  </div>
                  <p className="text-xs md:text-sm text-gray-505 font-medium italic leading-relaxed">
                    {test.quote}
                  </p>
                  <div className="flex items-center gap-3.5 pt-2">
                    <img src={test.avatar} alt={test.author} className="w-12 h-12 rounded-full object-cover shrink-0" />
                    <div>
                      <h4 className="text-sm font-extrabold text-gray-800">{test.author}</h4>
                      <p className="text-xs text-gray-400 font-semibold">{test.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Column 2 (Active/Sharp) */}
            <div className="space-y-8">
              {[TESTIMONIALS[1], TESTIMONIALS[4]].map((test, i) => (
                <div key={i} className="bg-white border border-gray-200 p-8 rounded-2xl space-y-5 text-left shadow-xs scale-102">
                  <div className="flex gap-0.5">
                    {Array.from({ length: test.rating }).map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-[#FFB95E] text-[#FFB95E]" />
                    ))}
                  </div>
                  <p className="text-xs md:text-sm text-gray-700 font-bold italic leading-relaxed">
                    {test.quote}
                  </p>
                  <div className="flex items-center gap-3.5 pt-2">
                    <img src={test.avatar} alt={test.author} className="w-12 h-12 rounded-full object-cover shrink-0" />
                    <div>
                      <h4 className="text-sm font-black text-gray-800">{test.author}</h4>
                      <p className="text-xs text-[#1D493E]/60 font-black">{test.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Column 3 (Faded) */}
            <div className="space-y-8 md:opacity-40 hover:opacity-100 transition duration-300">
              {[TESTIMONIALS[2], TESTIMONIALS[5]].map((test, i) => (
                <div key={i} className="bg-gray-50 border border-gray-100 p-8 rounded-2xl space-y-5 text-left shadow-2xs">
                  <div className="flex gap-0.5">
                    {Array.from({ length: test.rating }).map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-[#FFB95E] text-[#FFB95E]" />
                    ))}
                  </div>
                  <p className="text-xs md:text-sm text-gray-505 font-medium italic leading-relaxed">
                    {test.quote}
                  </p>
                  <div className="flex items-center gap-3.5 pt-2">
                    <img src={test.avatar} alt={test.author} className="w-12 h-12 rounded-full object-cover shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">{test.author}</h4>
                      <p className="text-xs text-gray-400 font-semibold">{test.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* 12. FAQ Section */}
        <div
          style={{
            width: "100%",
            maxWidth: "1440px",
            paddingTop: "42px",
            paddingBottom: "42px",
            background: "#FFFFFF",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: "24px"
          }}
          className="mx-auto text-left"
        >
          <div className="w-full max-w-[1280px] mx-auto flex flex-col gap-6">
            {/* Header */}
            <div className="space-y-2">
              <span 
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#FFEBE5",
                  color: "#FF623E",
                  fontFamily: "Faktum, sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                  lineHeight: "14px",
                  letterSpacing: "1.2px",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap"
                }}
              >
                FAQ'S
              </span>

              <h2 
                style={{
                  fontFamily: "Fraunces, serif",
                  fontWeight: 600,
                  fontSize: "42px",
                  lineHeight: "42px",
                  color: "rgba(43, 43, 43, 1)",
                  margin: 0
                }}
              >
                Frequently asked questions
              </h2>
            </div>

            {/* Accordion Rows */}
            <div className="w-full border-t border-gray-200 divide-y divide-gray-200">
              {[
                {
                  question: "What materials are the badges made from?",
                  boldAnswer: "Zinc alloy with glossy enamel fill.",
                  descAnswer: "Lightweight, durable, and safe to pin on bags, jackets, or backpacks without damaging fabric."
                },
                {
                  question: "How big are the stickers?",
                  boldAnswer: "",
                  descAnswer: "Our premium die-cut vinyl stickers range from 2.5 to 3.5 inches, with weatherproof UV matte lamination."
                },
                {
                  question: "Do you ship across India?",
                  boldAnswer: "",
                  descAnswer: "Yes! We offer express shipping across all states and union territories in India with tracking numbers provided via SMS & email."
                },
                {
                  question: "Can I return a product if I don't like it?",
                  boldAnswer: "",
                  descAnswer: "We offer a hassle-free 7-day return and exchange policy for any unused products in original packaging."
                },
                {
                  question: "I have no reviews on this product. Is it safe to buy?",
                  boldAnswer: "",
                  descAnswer: "Absolutely. All our gear is thoroughly field-tested by our collective of guides before listing, and backed by our quality guarantee."
                }
              ].map((item, idx) => {
                const isOpen = openFaqIdx === idx || (openFaqIdx === null && idx === 0);
                return (
                  <div key={idx} className="py-5">
                    <button
                      onClick={() => setOpenFaqIdx(isOpen && openFaqIdx === idx ? -1 : idx)}
                      className="w-full flex justify-between items-center text-left gap-4 cursor-pointer group"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span 
                          style={{
                            fontFamily: "Faktum, sans-serif",
                            fontWeight: 600,
                            fontSize: "18px",
                            lineHeight: "26px",
                            color: "rgba(43, 43, 43, 1)"
                          }}
                          className="group-hover:text-[#FF623E] transition-colors"
                        >
                          {item.question}
                        </span>
                        {item.boldAnswer && (
                          <span 
                            style={{
                              fontFamily: "Faktum, sans-serif",
                              fontWeight: 600,
                              fontSize: "18px",
                              lineHeight: "26px",
                              color: "rgba(43, 43, 43, 1)"
                            }}
                          >
                            {item.boldAnswer}
                          </span>
                        )}
                      </div>
                      <span 
                        style={{
                          fontSize: "24px",
                          fontWeight: 300,
                          color: "#1D493E"
                        }}
                        className="shrink-0 leading-none select-none"
                      >
                        {isOpen ? '—' : '+'}
                      </span>
                    </button>
                    {isOpen && (
                      <p 
                        style={{
                          fontFamily: "Faktum, sans-serif",
                          fontWeight: 400,
                          fontSize: "16px",
                          lineHeight: "26px",
                          color: "rgba(43, 43, 43, 0.65)"
                        }}
                        className="mt-2 animate-fade-in"
                      >
                        {item.descAnswer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
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
