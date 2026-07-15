'use client';

import React from 'react';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '@/components/providers';
import { PRODUCTS } from '@/data/products';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';

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
    <div className="bg-white min-h-screen pb-24 flex flex-col items-center">
      {/* Header Section (Width: 1440px, Padding: 62px 80px 0px 80px) */}
      <header className="w-full max-w-[1440px] mx-auto px-6 md:px-[80px] pt-[62px] pb-[10px] flex justify-center bg-white">
        {/* Inner header container (Width: 1280px, Height: 166px, Gap: 12px, Background: white) */}
        <div className="w-full max-w-[1280px] md:h-[166px] flex flex-col justify-between items-center gap-[12px] bg-white">
          {/* Tag (Width: 222px, Height: 18px, Font: Faktum 14px, Weight: 600, Color: #FF623E background, text uppercase, tracking 1.2px) */}
          <div className="flex items-center justify-center h-[18px]">
            <span className="inline-flex items-center justify-center text-[#FF623E] bg-[#FF623E]/8 px-2.5 py-0.5 rounded-[4px] text-[14px] font-semibold uppercase tracking-[1.2px] leading-none h-full w-[222px]">
              Experience the Shopping
            </span>
          </div>

          {/* Heading (Width: 1280px, Height: 52px, Font: Fraunces 42px, Weight: 600, Line-height: 100%, Color: #2B2B2B) */}
          <h1 className="w-full md:h-[52px] flex items-center justify-center text-[28px] md:text-[42px] font-serif font-semibold text-[#2B2B2B] leading-none text-center">
            Some journeys change where you go. Others change who you are.
          </h1>

          {/* Subtitle (Width: 1280px, Height: 64px, Font: Faktum 24px, Weight: 500, Line-height: 32px, Color: #2B2B2B) */}
          <p className="w-full md:h-[64px] flex items-center justify-center text-[#2B2B2B] text-base md:text-[24px] md:leading-[32px] font-sans font-medium text-center">
            Discover curated travel experiences, gear that keeps up with you, and a community of free-spirited explorers across India.
          </p>
        </div>
      </header>

      {/* Main Sections Container (Width: 1440px, Side Padding: 80px) */}
      <main className="w-full max-w-[1440px] mx-auto mt-0 px-6 md:px-[80px]">
        
        {/* Main 4x2 product grid directly below the EXPERIENCE THE SHOPPING header (Gap inside section: 62px, Padding Tightened) */}
        <section className="bg-white pt-[32px] pb-[24px] flex flex-col gap-[62px] w-full">
          {renderProductGrid(mainGridProducts.slice(0, 4))}
          {renderProductGrid(mainGridProducts.slice(4, 8))}

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
        </section>
        
        {/* Section 1: New Arrivals (Padding: pt-[42px] pb-[24px]) */}
        <section className="bg-white pt-[42px] pb-[24px] flex flex-col gap-[32px] w-full">
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

          {/* Grid */}
          {renderProductGrid(newArrivals)}

          {/* Progress / Scroll Indicator */}
          <div className="w-full max-w-xs mx-auto mt-4 h-[3px] bg-[#E2E8F0] rounded-full overflow-hidden">
            <div className="w-[40%] h-full bg-[#1D493E] rounded-full"></div>
          </div>
        </section>

        {/* Section 2: Travels Essentials (Padding: pt-[42px] pb-[24px]) */}
        <section className="bg-white pt-[42px] pb-[24px] flex flex-col gap-[62px] w-full">
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

          {/* Grid Rows */}
          {renderProductGrid(travelsEssentials.slice(0, 4))}
          {renderProductGrid(travelsEssentials.slice(4, 8))}

          {/* Centered Load More Button */}
          <div className="flex justify-center pt-0">
            <Link 
              href="/shop/travels-essentials" 
              className="px-8 py-3 border border-slate-200 hover:border-[#1D493E] hover:text-[#1D493E] text-slate-500 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-300 inline-block text-center"
            >
              Load more
            </Link>
          </div>
        </section>

        {/* Section 3: Limited Edition (Padding: pt-[42px] pb-[24px]) */}
        <section className="bg-white pt-[42px] pb-[24px] flex flex-col gap-[32px] w-full">
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

          {/* Grid */}
          {renderProductGrid(limitedEdition)}

          {/* Progress / Scroll Indicator */}
          <div className="w-full max-w-xs mx-auto mt-4 h-[3px] bg-[#E2E8F0] rounded-full overflow-hidden">
            <div className="w-[40%] h-full bg-[#1D493E] rounded-full"></div>
          </div>
        </section>

        {/* Section 4: 25% to 50% Discount Sale (Padding: pt-[42px] pb-[24px]) */}
        <section className="bg-white pt-[42px] pb-[24px] flex flex-col gap-[62px] w-full">
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

          {/* Grid Rows */}
          {renderProductGrid(travelsEssentials.slice(0, 4))}
          {renderProductGrid(travelsEssentials.slice(4, 8))}

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
        </section>

        {/* Testimonials Section (Captured Memories) (Padding: pt-[42px] pb-[24px]) */}
        <section className="bg-white pt-[42px] pb-[24px] flex flex-col gap-[32px] w-full border-t border-slate-100 mt-8">
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
        </section>

        {/* FAQ Section (Padding: pt-[42px] pb-[24px]) */}
        <section className="bg-white pt-[42px] pb-[24px] flex flex-col gap-[32px] w-full border-t border-slate-100 mt-8">
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
              const isOpen = openFaqIdx === idx;
              return (
                <div key={idx} className="py-5 text-left">
                  <button
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
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


      </main>
    </div>
  );
}
