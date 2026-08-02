'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Star, Compass, Users, MapPin, Sparkles, ArrowUpRight, HeartHandshake, Hammer 
} from 'lucide-react';
import { TrustBanner } from '@/components/TrustBanner';

export default function AboutPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activeCard, setActiveCard] = useState<'mission' | 'vision'>('mission');

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };




  const FAQ_ITEMS = [
    {
      question: "How do I book a travel package?",
      answer: "Browse our travel packages, select your preferred date and group size, and click 'Book Now' to submit an inquiry. Our community guide will contact you within 24 hours to confirm your details."
    },
    {
      question: "What is your refund and cancellation policy?",
      answer: "We offer free cancellations and full refunds up to 15 days before departure for travel packages. For store products, we offer a 30-day free return window."
    },
    {
      question: "What makes your travel gear premium?",
      answer: "All our products are co-designed with outdoor experts and handcrafted using premium materials like heavy-knit combed cotton, high-grade hard enamel, and heavy-duty canvas."
    },
    {
      question: "What is the average group size for trips?",
      answer: "We keep our explorer circles small—typically between 6 to 12 travelers. This ensures personalized attention, closer community bonding, and minimal impact on native habitats."
    },
    {
      question: "Do you ship travel gear worldwide?",
      answer: "Yes, we ship our premium travel collectibles, badges, and apparel to adventurers all across the globe. Standard shipping is free on domestic orders."
    }
  ];

  const REVIEWS = [
    {
      id: "about-rev-1",
      name: "Kiran Makwan",
      subtitle: "Verified Explorer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
      text: "Exploring Spiti Valley with Go Banjara was a life-changing journey. Flawless planning, cozy homestays, and a wonderful group of fellow travelers.",
      stars: 5
    },
    {
      id: "about-rev-2",
      name: "Priyanka Sen",
      subtitle: "Slow Traveler",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
      text: "The double-walled thermal flask keeps my tea steaming hot even at 14,000 feet in Ladakh. Truly premium travel gear built for real mountain conditions.",
      stars: 5
    },
    {
      id: "about-rev-3",
      name: "Ananya Roy",
      subtitle: "Himalayan Backpacker",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
      text: "I bought the waterproof stickers for my laptop and helmet. They've survived rain, dust, and countless rugged camping trips without peeling or fading!",
      stars: 5
    },
    {
      id: "about-rev-4",
      name: "Rohan Verma",
      subtitle: "Nomad Artisan",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
      text: "I love the heavy-knit t-shirt. The texture is extremely premium, and the graphics represent the raw soul of travel and adventure across India.",
      stars: 5
    },
    {
      id: "about-rev-5",
      name: "Meera Nair",
      subtitle: "Solo Wanderer",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
      text: "Traveling alone can be intimidating, but Go Banjara made it feel like exploring with close friends. The local guides were knowledgeable and super friendly.",
      stars: 5
    },
    {
      id: "about-rev-6",
      name: "Vikram Seth",
      subtitle: "Outdoor Enthusiast",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
      text: "Top-notch customer service! My package had a slight shipping delay, and they immediately upgraded me to express shipping and added some free stickers.",
      stars: 5
    }
  ];

  const row1 = [REVIEWS[0], REVIEWS[1], REVIEWS[2], REVIEWS[0], REVIEWS[1], REVIEWS[2]];
  const row2 = [REVIEWS[3], REVIEWS[4], REVIEWS[5], REVIEWS[3], REVIEWS[4], REVIEWS[5]];

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-[#2B2B2B] overflow-x-clip">
      
      {/* 1. Header Section (Mobile 430x166 | Desktop 1440x252px spec) */}
      <header 
        style={{
          width: "100%",
          height: "252px",
          background: "rgba(255, 255, 255, 1)",
          boxSizing: "border-box",
          opacity: 1,
        }}
        className="mx-auto w-full max-w-[1440px] px-[20px] md:px-[80px] pt-[62px] pb-[24px] shrink-0 flex flex-col items-center justify-center gap-[10px]"
      >
        <span className="inline-flex items-center justify-center h-[26px] w-fit text-[12px] font-bold uppercase tracking-[0.12em] text-[#FF5B37] bg-[#FFEBE5] px-3 rounded-[4px]">
          ABOUT GO BANJARA
        </span>

        {/* Heading */}
        <h1 
          style={{ 
            fontFamily: "Fraunces, serif", 
            fontWeight: 600, 
            color: "rgba(43, 43, 43, 1)", 
            textAlign: "center",
            margin: 0
          }} 
          className="text-2xl sm:text-3xl md:text-[42px] leading-tight md:leading-[1.2] w-full max-w-[1280px]"
        >
          We don't sell trips. We hand you back a country you forgot
        </h1>

        {/* Subtitle */}
        <p 
          style={{ 
            fontFamily: "Faktum, sans-serif", 
            fontWeight: 500, 
            color: "rgba(43, 43, 43, 1)", 
            textAlign: "center",
            margin: 0,
          }} 
          className="text-xs sm:text-base md:text-[24px] leading-relaxed md:leading-[32px] w-full max-w-[1280px]"
        >
          Go Banjara is a small collective of travelers, writers, makers and local guides quietly rebuilding what travel across India was supposed to feel like
        </p>
      </header>

      {/* 2. Meet Bonjo Section (Mobile 430x869 | Desktop 1440x774px spec) */}
      <section 
        style={{ 
          width: "100%", 
          height: "774px",
          background: "rgba(255, 255, 255, 1)",
          boxSizing: "border-box",
          opacity: 1,
        }}
        className="mx-auto w-full max-w-[1440px] px-[20px] md:px-[80px] pt-[62px] pb-[62px] flex flex-col justify-center items-center shrink-0"
      >
        <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-[32px] items-center w-full max-w-[1280px] mx-auto">
          
          {/* Text & Content Column (Order 1 on Mobile, Order 2 on Desktop) */}
          <div className="flex flex-col gap-4 md:gap-[32px] w-full max-w-[644px] h-auto text-left justify-center py-2 md:py-0 order-1 md:order-2">
            <div className="flex flex-col gap-2 md:gap-[12px]">
              <span className="inline-flex items-center justify-center text-[#FF623E] bg-[#FFEBE5] px-3 py-1 rounded-[4px] text-[12px] font-bold uppercase tracking-[0.12em] leading-none self-start">
                The Banjara Soul
              </span>
              <h2 className="text-3xl md:text-[62px] font-serif font-bold text-[#1D493E] leading-tight md:leading-none w-full max-w-[644px] h-auto flex items-center py-1 md:py-2">
                Meet Bonjo.
              </h2>
            </div>
            <div className="flex flex-col gap-3 md:gap-[32px] w-full max-w-[644px] h-auto text-[#2B2B2B]/85 text-xs sm:text-base md:text-[20px] font-sans font-medium leading-relaxed md:leading-[32px] text-left">
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
            <div className="pt-1 md:pt-2">
              <Link 
                href="/travel" 
                className="inline-flex items-center justify-center h-[44px] md:h-[68px] px-5 md:px-[36px] gap-2 rounded-[4px] bg-[#1D493E] hover:bg-[#15342c] text-white font-sans font-bold text-xs sm:text-sm md:text-base transition-all duration-300 shadow-sm cursor-pointer group"
              >
                <span className="md:hidden">Our Story</span>
                <span className="hidden md:inline">Explore with Bonjo</span>
                <span className="text-base md:text-xl font-sans group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">↗</span>
              </Link>
            </div>
          </div>

          {/* Mascot Image Card (Order 2 on Mobile, Order 1 on Desktop) */}
          <div className="relative order-2 md:order-1 w-full max-w-[390px] md:max-w-[584px] aspect-square mx-auto md:mx-0 mt-2 md:mt-0">
            {/* Soft glow background */}
            <div 
              className="absolute -top-[40px] -left-[40px] w-[192px] h-[192px] pointer-events-none" 
              style={{
                background: 'radial-gradient(circle, rgba(224, 84, 52, 0.35) 0%, rgba(224, 84, 52, 0) 70%)'
              }}
            />
            <div className="relative hover:rotate-2 transition-transform duration-500 w-full h-full bg-transparent rounded-[12px] overflow-hidden">
              <img 
                src="/llama_mascot.png" 
                alt="Bonjo Mascot" 
                className="w-full h-full object-cover filter drop-shadow-[0_25px_30px_rgba(0,0,0,0.18)] rounded-[12px]"
                style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)', borderRadius: '12px' }}
              />
            </div>
          </div>

        </div>
      </section>

      {/* 3. Stats Bar Section (Mobile 430x208 2x2 Grid | Desktop 1440x145px spec) */}
      <section 
        style={{
          width: "100%",
          height: "145px",
          background: "rgba(255, 255, 255, 1)",
          boxSizing: "border-box",
          opacity: 1,
        }}
        className="mx-auto w-full max-w-[1440px] px-[20px] md:px-[80px] py-[12px] md:py-[24px] shrink-0 flex items-center justify-center"
      >
        {/* Mobile 2x2 Grid Layout (Figma Spec 430x208) */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-0 w-full md:hidden relative py-1">
          {/* Horizontal divider line */}
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gray-200 -translate-y-1/2 pointer-events-none" />
          
          {/* Stat 1 */}
          <div className="flex flex-col items-center justify-center py-2 px-1 text-center border-r border-gray-200">
            <span style={{ fontFamily: "Faktum, sans-serif" }} className="text-2xl font-bold text-[#2B2B2B] leading-tight">10+</span>
            <span style={{ fontFamily: "Faktum, sans-serif" }} className="text-xs font-medium text-[#2B2B2B] mt-1">Travel Packages</span>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col items-center justify-center py-2 px-1 text-center">
            <span style={{ fontFamily: "Faktum, sans-serif" }} className="text-2xl font-bold text-[#2B2B2B] leading-tight">15k+</span>
            <span style={{ fontFamily: "Faktum, sans-serif" }} className="text-xs font-medium text-[#2B2B2B] mt-1">Nomads Joined</span>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col items-center justify-center py-2 px-1 text-center border-r border-gray-200">
            <span style={{ fontFamily: "Faktum, sans-serif" }} className="text-2xl font-bold text-[#2B2B2B] leading-tight">24/7</span>
            <span style={{ fontFamily: "Faktum, sans-serif" }} className="text-xs font-medium text-[#2B2B2B] mt-1">On-road Support</span>
          </div>

          {/* Stat 4 */}
          <div className="flex flex-col items-center justify-center py-2 px-1 text-center">
            <span style={{ fontFamily: "Faktum, sans-serif" }} className="text-2xl font-bold text-[#2B2B2B] leading-tight">7+</span>
            <span style={{ fontFamily: "Faktum, sans-serif" }} className="text-xs font-medium text-[#2B2B2B] mt-1">Shop Products</span>
          </div>
        </div>

        {/* Desktop Single Row Bar (Untouched) */}
        <div 
          style={{ 
            gap: "47px",
            width: "100%",
            maxWidth: "1280px"
          }}
          className="hidden md:flex items-center justify-center flex-nowrap w-full mx-auto"
        >
          {/* Stat 1 */}
          <div className="flex flex-col items-center text-center flex-1 min-w-[120px]" style={{ gap: "10px" }}>
            <span style={{ fontFamily: "Faktum, sans-serif", fontWeight: 600, fontSize: "32px", lineHeight: "40px", height: "40px", color: "rgba(43, 43, 43, 1)", display: "block" }}>
              10+
            </span>
            <span style={{ fontFamily: "Faktum, sans-serif", fontWeight: 500, fontSize: "20px", lineHeight: "25px", height: "25px", color: "rgba(43, 43, 43, 1)", display: "block" }}>
              Travel Packages
            </span>
          </div>

          <div className="w-[1px] h-[55px] bg-[#2B2B2B]/10 shrink-0 hidden md:block" />

          {/* Stat 2 */}
          <div className="flex flex-col items-center text-center flex-1 min-w-[120px]" style={{ gap: "10px" }}>
            <span style={{ fontFamily: "Faktum, sans-serif", fontWeight: 600, fontSize: "32px", lineHeight: "40px", height: "40px", color: "rgba(43, 43, 43, 1)", display: "block" }}>
              15k+
            </span>
            <span style={{ fontFamily: "Faktum, sans-serif", fontWeight: 500, fontSize: "20px", lineHeight: "25px", height: "25px", color: "rgba(43, 43, 43, 1)", display: "block" }}>
              Nomads Joined
            </span>
          </div>

          <div className="w-[1px] h-[55px] bg-[#2B2B2B]/10 shrink-0 hidden md:block" />

          {/* Stat 3 */}
          <div className="flex flex-col items-center text-center flex-1 min-w-[120px]" style={{ gap: "10px" }}>
            <span style={{ fontFamily: "Faktum, sans-serif", fontWeight: 600, fontSize: "32px", lineHeight: "40px", height: "40px", color: "rgba(43, 43, 43, 1)", display: "block" }}>
              24/7
            </span>
            <span style={{ fontFamily: "Faktum, sans-serif", fontWeight: 500, fontSize: "20px", lineHeight: "25px", height: "25px", color: "rgba(43, 43, 43, 1)", display: "block" }}>
              On-road Support
            </span>
          </div>

          <div className="w-[1px] h-[55px] bg-[#2B2B2B]/10 shrink-0 hidden md:block" />

          {/* Stat 4 */}
          <div className="flex flex-col items-center text-center flex-1 min-w-[120px]" style={{ gap: "10px" }}>
            <span style={{ fontFamily: "Faktum, sans-serif", fontWeight: 600, fontSize: "32px", lineHeight: "40px", height: "40px", color: "rgba(43, 43, 43, 1)", display: "block" }}>
              7+
            </span>
            <span style={{ fontFamily: "Faktum, sans-serif", fontWeight: 500, fontSize: "20px", lineHeight: "25px", height: "25px", color: "rgba(43, 43, 43, 1)", display: "block" }}>
              Shop Products
            </span>
          </div>

          <div className="w-[1px] h-[55px] bg-[#2B2B2B]/10 shrink-0 hidden md:block" />

          {/* Stat 5 */}
          <div className="flex flex-col items-center text-center flex-1 min-w-[120px]" style={{ gap: "10px" }}>
            <span style={{ fontFamily: "Faktum, sans-serif", fontWeight: 600, fontSize: "32px", lineHeight: "40px", height: "40px", color: "rgba(43, 43, 43, 1)", display: "block" }}>
              4.5+
            </span>
            <span style={{ fontFamily: "Faktum, sans-serif", fontWeight: 500, fontSize: "20px", lineHeight: "25px", height: "25px", color: "rgba(43, 43, 43, 1)", display: "block" }}>
              Average trip rating
            </span>
          </div>
        </div>
      </section>

      {/* 5. Two Mission/Vision Cards Section (Mobile 430x436 | Desktop 1440x783px spec) */}
      <section 
        style={{ 
          marginTop: "0px", 
          position: "relative", 
          zIndex: 20,
          width: "100%",
          background: "rgba(255, 255, 255, 1)",
          boxSizing: "border-box"
        }}
        className="w-full px-0 pt-[42px] pb-[42px] shrink-0 flex flex-col items-center justify-center min-h-auto md:min-h-[783px] gap-[32px] overflow-x-clip"
      >
        {/* Overlapping Sticker Cards nested inside Section 5 */}
        <div 
          className="flex items-center justify-center relative select-none scale-[0.42] sm:scale-[0.55] md:scale-100 origin-center transition-transform duration-300 pointer-events-auto z-0 mb-[-40px] md:mb-[-105px]"
          style={{ 
            width: "1709.5738525390625px", 
            height: "418.3321228027344px", 
            boxSizing: "border-box",
            opacity: 1
          }}
        >
          {/* Card 1: Traveler / Go Banjara Card */}
          <div 
            style={{ 
              width: "301.99999443948394px", 
              height: "379.99999300332416px", 
              borderTopRightRadius: "4px",
              borderBottomRightRadius: "4px",
              borderBottomLeftRadius: "4px",
              borderTopLeftRadius: "0px",
              position: "relative",
              transform: "rotate(-8deg)",
              opacity: 1,
              zIndex: 10,
              flexShrink: 0,
              overflow: "hidden"
            }}
            className="cursor-pointer transition-all duration-300 ease-out hover:-translate-y-8 hover:z-50"
          >
            <img 
              src="/card-1-full.png" 
              alt="Go Banjara Traveler Card 1" 
              className="w-full h-full object-cover pointer-events-none select-none"
            />
          </div>

          {/* Card 2: Green Explore/Adventure Card */}
          <div 
            style={{ 
              width: "301.99999443948394px", 
              height: "379.99999300332416px", 
              borderTopRightRadius: "4px",
              borderBottomRightRadius: "4px",
              borderBottomLeftRadius: "4px",
              borderTopLeftRadius: "0px",
              position: "relative",
              transform: "rotate(-3deg)",
              opacity: 1,
              zIndex: 11,
              marginLeft: "-45px",
              flexShrink: 0,
              overflow: "hidden"
            }}
            className="cursor-pointer transition-all duration-300 ease-out hover:-translate-y-8 hover:z-50"
          >
            <img 
              src="/card-2-full.png" 
              alt="Explore Adventure Card 2" 
              className="w-full h-full object-cover pointer-events-none select-none"
            />
          </div>

          {/* Card 3: Cream Camel Card */}
          <div 
            style={{ 
              width: "301.99999443948394px", 
              height: "379.99999300332416px", 
              borderTopRightRadius: "4px",
              borderBottomRightRadius: "4px",
              borderBottomLeftRadius: "4px",
              borderTopLeftRadius: "0px",
              position: "relative",
              transform: "rotate(-4deg)",
              opacity: 1,
              zIndex: 12,
              marginLeft: "-45px",
              flexShrink: 0,
              overflow: "hidden"
            }}
            className="cursor-pointer transition-all duration-300 ease-out hover:-translate-y-8 hover:z-50"
          >
            <img 
              src="/card-3-full.png" 
              alt="Humps Down Surf's Up Card 3" 
              className="w-full h-full object-cover pointer-events-none select-none"
            />
          </div>

          {/* Card 4: Yellow Stickers Card */}
          <div 
            style={{ 
              width: "301.99999443948394px", 
              height: "379.99999300332416px", 
              borderTopRightRadius: "4px",
              borderBottomRightRadius: "4px",
              borderBottomLeftRadius: "4px",
              borderTopLeftRadius: "0px",
              position: "relative",
              transform: "rotate(-3deg)",
              opacity: 1,
              zIndex: 13,
              marginLeft: "-45px",
              flexShrink: 0,
              overflow: "hidden"
            }}
            className="cursor-pointer transition-all duration-300 ease-out hover:-translate-y-8 hover:z-50"
          >
            <img 
              src="/card-4-full.png" 
              alt="Yellow Stickers Card 4" 
              className="w-full h-full object-cover pointer-events-none select-none"
            />
          </div>

          {/* Card 5: Traveler / Go Banjara Card (repeat) */}
          <div 
            style={{ 
              width: "301.99999443948394px", 
              height: "379.99999300332416px", 
              borderTopRightRadius: "4px",
              borderBottomRightRadius: "4px",
              borderBottomLeftRadius: "4px",
              borderTopLeftRadius: "0px",
              position: "relative",
              transform: "rotate(-4deg)",
              opacity: 1,
              zIndex: 14,
              marginLeft: "-45px",
              flexShrink: 0,
              overflow: "hidden"
            }}
            className="cursor-pointer transition-all duration-300 ease-out hover:-translate-y-8 hover:z-50"
          >
            <img 
              src="/card-5-full.png" 
              alt="Go Banjara Traveler Card 5" 
              className="w-full h-full object-cover pointer-events-none select-none"
            />
          </div>

          {/* Card 6: Green Explore/Adventure Card (repeat) */}
          <div 
            style={{ 
              width: "301.99999443948394px", 
              height: "379.99999300332416px", 
              borderTopRightRadius: "4px",
              borderBottomRightRadius: "4px",
              borderBottomLeftRadius: "4px",
              borderTopLeftRadius: "0px",
              position: "relative",
              transform: "rotate(-3deg)",
              opacity: 1,
              zIndex: 15,
              marginLeft: "-45px",
              flexShrink: 0,
              overflow: "hidden"
            }}
            className="cursor-pointer transition-all duration-300 ease-out hover:-translate-y-8 hover:z-50"
          >
            <img 
              src="/card-6-full.png" 
              alt="Explore Adventure Card 6" 
              className="w-full h-full object-cover pointer-events-none select-none"
            />
          </div>

          {/* Card 7: Cream Camel Card (repeat) */}
          <div 
            style={{ 
              width: "301.99999443948394px", 
              height: "379.99999300332416px", 
              borderTopRightRadius: "4px",
              borderBottomRightRadius: "4px",
              borderBottomLeftRadius: "4px",
              borderTopLeftRadius: "0px",
              position: "relative",
              transform: "rotate(-4deg)",
              opacity: 1,
              zIndex: 16,
              marginLeft: "-45px",
              flexShrink: 0,
              overflow: "hidden"
            }}
            className="cursor-pointer transition-all duration-300 ease-out hover:-translate-y-8 hover:z-50"
          >
            <img 
              src="/card-7-full.png" 
              alt="Humps Down Surf's Up Card 7" 
              className="w-full h-full object-cover pointer-events-none select-none"
            />
          </div>

          {/* Card 8: Yellow Stickers Card (repeat) */}
          <div 
            style={{ 
              width: "301.99999443948394px", 
              height: "379.99999300332416px", 
              borderTopRightRadius: "4px",
              borderBottomRightRadius: "4px",
              borderBottomLeftRadius: "4px",
              borderTopLeftRadius: "0px",
              position: "relative",
              transform: "rotate(-3deg)",
              opacity: 1,
              zIndex: 17,
              marginLeft: "-45px",
              flexShrink: 0,
              overflow: "hidden"
            }}
            className="cursor-pointer transition-all duration-300 ease-out hover:-translate-y-8 hover:z-50"
          >
            <img 
              src="/card-8-full.png" 
              alt="Yellow Stickers Card 8" 
              className="w-full h-full object-cover pointer-events-none select-none"
            />
          </div>
        </div>

        {/* Full-width Solid rgba(255, 255, 255, 1) Background Layer behind Mountain Cards */}
        <div 
          style={{ background: "rgba(255, 255, 255, 1)", minWidth: "2200px" }}
          className="w-full relative z-20 flex flex-col justify-center items-center pt-8 md:pt-12 pb-6 md:pb-8 px-4 md:px-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-[32px] w-full max-w-[1280px] h-auto md:h-[699px]">
            
            {/* Card 1: OUR MISSION */}
            <div 
              onClick={() => setActiveCard('mission')}
              onMouseEnter={() => setActiveCard('mission')}
              className={`relative overflow-hidden shadow-md shrink-0 w-full h-[200px] md:h-[699px] rounded-[4px] cursor-pointer transition-all duration-500 ease-in-out ${
                activeCard === 'mission' ? 'md:w-[843px]' : 'md:w-[405px]'
              }`}
            >
              <img 
                src="/mission-vision-full.png" 
                alt="Nomads on camels in snowy mountain valley" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />

              {/* Translucent Glass Text Box */}
              <div 
                className="absolute bottom-2 left-2 right-2 md:bottom-4 md:left-4 md:right-auto md:w-[811px] md:max-w-[calc(100%-32px)] bg-[#2B2B2B]/90 backdrop-blur-md border border-white/20 rounded-[4px] p-2.5 md:p-3 flex flex-col items-start gap-1.5 md:gap-3 transition-all duration-400 opacity-100 pointer-events-auto"
                style={{
                  opacity: typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : (activeCard === 'mission' ? 1 : 0),
                  transform: typeof window !== 'undefined' && window.innerWidth < 768 ? 'translateY(0)' : (activeCard === 'mission' ? 'translateY(0)' : 'translateY(12px)'),
                  pointerEvents: typeof window !== 'undefined' && window.innerWidth < 768 ? 'auto' : (activeCard === 'mission' ? 'auto' : 'none'),
                }}
              >
                <span className="inline-flex items-center justify-center bg-[#FF623E] text-white font-sans font-semibold text-[10px] md:text-[14px] leading-none px-2 py-1 rounded-[4px] uppercase tracking-wider">
                  OUR MISSION
                </span>
                <p className="font-sans font-medium text-[11px] sm:text-xs md:text-[24px] leading-relaxed md:leading-[42px] text-white m-0">
                  We exist to bridge the gap between the life people are living and the adventures they are dreaming about. Every experience we curate, every product we build, and every story we tell is in service of one thing: helping people go further.
                </p>
              </div>

              {/* Compact Badge (Desktop visible when inactive) */}
              <div className={`hidden md:block absolute bottom-6 left-6 transition-opacity duration-400 ${activeCard === 'mission' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <span className="inline-flex items-center justify-center bg-[#FF623E] text-white font-sans font-semibold text-[14px] leading-none px-3 py-1.5 rounded-[4px] uppercase tracking-wider">
                  OUR MISSION
                </span>
              </div>
            </div>

            {/* Card 2: OUR VISION */}
            <div 
              onClick={() => setActiveCard('vision')}
              onMouseEnter={() => setActiveCard('vision')}
              className={`relative overflow-hidden shadow-md shrink-0 w-full h-[200px] md:h-[699px] rounded-[4px] cursor-pointer transition-all duration-500 ease-in-out ${
                activeCard === 'vision' ? 'md:w-[843px]' : 'md:w-[405px]'
              }`}
            >
              <img 
                src="/mission-vision-full.png" 
                alt="Nomads on camels in snowy mountain valley" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />

              {/* Translucent Glass Text Box */}
              <div 
                className="absolute bottom-2 left-2 right-2 md:bottom-4 md:left-4 md:right-auto md:w-[811px] md:max-w-[calc(100%-32px)] bg-[#2B2B2B]/90 backdrop-blur-md border border-white/20 rounded-[4px] p-2.5 md:p-3 flex flex-col items-start gap-1.5 md:gap-3 transition-all duration-400 opacity-100 pointer-events-auto"
                style={{
                  opacity: typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : (activeCard === 'vision' ? 1 : 0),
                  transform: typeof window !== 'undefined' && window.innerWidth < 768 ? 'translateY(0)' : (activeCard === 'vision' ? 'translateY(0)' : 'translateY(12px)'),
                  pointerEvents: typeof window !== 'undefined' && window.innerWidth < 768 ? 'auto' : (activeCard === 'vision' ? 'auto' : 'none'),
                }}
              >
                <span className="inline-flex items-center justify-center bg-[#FF623E] text-white font-sans font-semibold text-[10px] md:text-[14px] leading-none px-2 py-1 rounded-[4px] uppercase tracking-wider">
                  OUR VISION
                </span>
                <p className="font-sans font-medium text-[11px] sm:text-xs md:text-[24px] leading-relaxed md:leading-[42px] text-white m-0">
                  We exist to bridge the gap between the life people are living and the adventures they are dreaming about. Every experience we curate, every product we build, and every story we tell is in service of one thing: helping people go further.
                </p>
              </div>

              {/* Compact Badge (Desktop visible when inactive) */}
              <div className={`hidden md:block absolute bottom-6 left-6 transition-opacity duration-400 ${activeCard === 'vision' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <span className="inline-flex items-center justify-center bg-[#FF623E] text-white font-sans font-semibold text-[14px] leading-none px-3 py-1.5 rounded-[4px] uppercase tracking-wider">
                  OUR VISION
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. OUR JOURNEY TIMELINE / ABOUT GO BANJARA Section */}
      <section 
        style={{
          width: "100%",
          background: "rgba(255, 255, 255, 1)",
          boxSizing: "border-box",
        }}
        className="mx-auto w-full max-w-[430px] md:max-w-[1440px] px-[20px] py-[12px] md:pt-[42px] md:pb-6 md:px-[80px] shrink-0 flex flex-col gap-3 md:gap-[32px] min-h-auto"
      >
        {/* Header (Exact Figma specs) */}
        <div className="w-full max-w-[1280px] mx-auto flex flex-col items-start gap-2 md:gap-[12px]">
          {/* Orange Badge */}
          <span className="inline-flex items-center justify-center h-[26px] w-fit text-[12px] font-bold uppercase tracking-[0.12em] text-[#FF5B37] bg-[#FFEBE5] px-3 rounded-[4px]">
            OUR JOURNEY TIMELINE
          </span>

          {/* Main Title */}
          <h2 className="text-2xl sm:text-3xl md:text-[42px] font-serif font-semibold text-[#2B2B2B] leading-tight md:leading-[42px] m-0 w-full">
            From a scribbled notebook to a <span className="text-[#FF623E] font-serif font-semibold">travelling tribe</span>
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-base md:text-[24px] font-sans font-medium text-[#2B2B2B] leading-relaxed md:leading-[32px] m-0 w-full">
            Curated gear for the modern nomad. From durable journal covers to the stickers that tell your story
          </p>
        </div>

        {/* Mobile Vertical Cards Stack with Sticky Overlay Stacking Effect */}
        <div className="flex flex-col gap-8 w-full md:hidden py-4">
          {/* Mobile Stack Row 1 */}
          <div 
            style={{
              position: "sticky",
              top: "70px",
              zIndex: 10,
            }}
            className="w-full bg-white rounded-[12px] p-3 shadow-lg border border-gray-100 flex flex-col gap-3 mb-6"
          >
            {/* Card 1 */}
            <div className="w-full h-[280px] rounded-[6px] overflow-hidden">
              <img src="/card-1-full.png" alt="Card 1" className="w-full h-full object-cover" />
            </div>

            {/* Center Text 1 */}
            <div className="w-full bg-[#F8F8F8] p-4 rounded-[6px] flex flex-col items-center text-center gap-2 border border-gray-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#00A63F] bg-[#EBF7ED] px-2.5 py-0.5 rounded">THE START</span>
              <h3 className="text-base font-serif font-bold text-[#2B2B2B] leading-snug m-0">We don't sell trips; we return a country you forgot.</h3>
              <p className="text-xs font-sans text-[#2B2B2B]/75 leading-relaxed m-0">Go Banjara is a collective of travelers and local guides rebuilding the essence of travel in India.</p>
            </div>

            {/* Card 3 */}
            <div className="w-full h-[280px] rounded-[6px] overflow-hidden">
              <img src="/card-3-full.png" alt="Card 3" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Mobile Stack Row 2 */}
          <div 
            style={{
              position: "sticky",
              top: "90px",
              zIndex: 20,
            }}
            className="w-full bg-white rounded-[12px] p-3 shadow-lg border border-gray-100 flex flex-col gap-3 mb-6"
          >
            {/* Card 2 */}
            <div className="w-full h-[280px] rounded-[6px] overflow-hidden">
              <img src="/card-2-full.png" alt="Card 2" className="w-full h-full object-cover" />
            </div>

            {/* Center Text 2 */}
            <div className="w-full bg-[#F8F8F8] p-4 rounded-[6px] flex flex-col items-center text-center gap-2 border border-gray-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#00A63F] bg-[#EBF7ED] px-2.5 py-0.5 rounded">OUR PHILOSOPHY</span>
              <h3 className="text-base font-serif font-bold text-[#2B2B2B] leading-snug m-0">Slower journeys, deeper roots, and stories that stay with you.</h3>
              <p className="text-xs font-sans text-[#2B2B2B]/75 leading-relaxed m-0">We take the backroads, stay with local hosts, and design expeditions that respect the land.</p>
            </div>

            {/* Card 4 */}
            <div className="w-full h-[280px] rounded-[6px] overflow-hidden">
              <img src="/card-4-full.png" alt="Card 4" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Mobile Stack Row 3 */}
          <div 
            style={{
              position: "sticky",
              top: "110px",
              zIndex: 30,
            }}
            className="w-full bg-white rounded-[12px] p-3 shadow-lg border border-gray-100 flex flex-col gap-3 mb-6"
          >
            {/* Card 7 */}
            <div className="w-full h-[280px] rounded-[6px] overflow-hidden">
              <img src="/card-7-full.png" alt="Card 7" className="w-full h-full object-cover" />
            </div>

            {/* Center Text 3 */}
            <div className="w-full bg-[#F8F8F8] p-4 rounded-[6px] flex flex-col items-center text-center gap-2 border border-gray-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#00A63F] bg-[#EBF7ED] px-2.5 py-0.5 rounded">ARTISANAL GEAR</span>
              <h3 className="text-base font-serif font-bold text-[#2B2B2B] leading-snug m-0">Crafted for modern nomads who live life on the move.</h3>
              <p className="text-xs font-sans text-[#2B2B2B]/75 leading-relaxed m-0">From weather-proof stickers to hand-bound expedition journals, every item is crafted with heritage quality.</p>
            </div>

            {/* Card 5 */}
            <div className="w-full h-[280px] rounded-[6px] overflow-hidden">
              <img src="/card-5-full.png" alt="Card 5" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Mobile Stack Row 4 */}
          <div 
            style={{
              position: "sticky",
              top: "130px",
              zIndex: 40,
            }}
            className="w-full bg-white rounded-[12px] p-3 shadow-lg border border-gray-100 flex flex-col gap-3 mb-6"
          >
            {/* Card 8 */}
            <div className="w-full h-[280px] rounded-[6px] overflow-hidden">
              <img src="/card-8-full.png" alt="Card 8" className="w-full h-full object-cover" />
            </div>

            {/* Center Text 4 */}
            <div className="w-full bg-[#F8F8F8] p-4 rounded-[6px] flex flex-col items-center text-center gap-2 border border-gray-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#00A63F] bg-[#EBF7ED] px-2.5 py-0.5 rounded">THE BANJARA TRIBE</span>
              <h3 className="text-base font-serif font-bold text-[#2B2B2B] leading-snug m-0">Join a growing collective of curious global explorers.</h3>
              <p className="text-xs font-sans text-[#2B2B2B]/75 leading-relaxed m-0">Connect with like-minded wanderers, share trail notes, and write your next chapter with Go Banjara.</p>
            </div>

            {/* Card 6 */}
            <div className="w-full h-[280px] rounded-[6px] overflow-hidden">
              <img src="/card-6-full.png" alt="Card 6" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* 4 Rows of Sticky Stacked Cards */}
        <div className="hidden md:flex flex-col w-full max-w-[1280px] mx-auto mt-6 pb-6">
          
          {/* Row 1 - Card Stack 1 */}
          <div 
            style={{
              position: "sticky",
              top: "100px",
              marginBottom: "0px",
              zIndex: 10,
              width: "1280px",
              maxWidth: "100%",
              height: "450px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#FFFFFF",
              boxSizing: "border-box",
            }}
            className="w-full mx-auto"
          >
            {/* Col 1: Card 1 (Hikers - 302px x 380px) */}
            <div 
              style={{ 
                width: "302px", 
                height: "380px", 
                borderRadius: "4px",
                overflow: "hidden",
                flexShrink: 0
              }}
            >
              <img src="/card-1-full.png" alt="Go Banjara Traveler Card 1" className="w-full h-full object-cover scale-[1.04] origin-center" />
            </div>

            {/* Col 2: Center Text Card */}
            <div 
              style={{ 
                width: "482px", 
                maxWidth: "100%",
                height: "334px", 
                borderRadius: "4px",
                background: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                gap: "12px",
                boxSizing: "border-box"
              }}
            >
              <span 
                style={{
                  width: "92px",
                  height: "26px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  background: "#EBF7ED",
                  color: "#00A63F",
                  fontFamily: "Faktum, sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                  lineHeight: "14px",
                  letterSpacing: "1.2px",
                  borderRadius: "4px",
                  textTransform: "uppercase"
                }}
              >
                THE START
              </span>
              <h3 
                style={{ 
                  width: "482px",
                  maxWidth: "100%",
                  height: "156px",
                  fontFamily: "Fraunces, serif", 
                  fontWeight: 600, 
                  fontSize: "42px", 
                  lineHeight: "50px", 
                  color: "rgba(43, 43, 43, 1)", 
                  letterSpacing: "0px",
                  textAlign: "center",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                We don't sell trips. We hand you back a country you forgot.
              </h3>
              <p 
                style={{ 
                  width: "482px",
                  maxWidth: "100%",
                  height: "128px",
                  fontFamily: "Faktum, sans-serif", 
                  fontWeight: 500, 
                  fontSize: "24px", 
                  lineHeight: "32px", 
                  color: "rgba(43, 43, 43, 1)", 
                  letterSpacing: "0px",
                  textAlign: "center",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                Go Banjara is a small collective of travelers, writers, makers and local guides quietly rebuilding what travel across India was supposed to feel like
              </p>
            </div>

            {/* Col 3: Card 3 (Cream Camel - 302px x 380px) */}
            <div 
              style={{ 
                width: "302px", 
                height: "380px", 
                borderRadius: "4px",
                overflow: "hidden",
                flexShrink: 0
              }}
            >
              <img src="/card-3-full.png" alt="Humps Down Surf's Up Card 3" className="w-full h-full object-cover scale-[1.04] origin-center" />
            </div>
          </div>

          {/* Row 2 - Card Stack 2 */}
          <div 

            style={{
              position: "sticky",
              top: "100px",
              marginBottom: "0px",
              zIndex: 20,
              width: "1280px",
              maxWidth: "100%",
              height: "450px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#FFFFFF",
              boxSizing: "border-box",
            }}
            className="w-full mx-auto"
          >
            {/* Col 1: Card 2 (Green Explore - 302px x 380px) */}
            <div 
              style={{ 
                width: "302px", 
                height: "380px", 
                borderRadius: "4px",
                overflow: "hidden",
                flexShrink: 0,
                position: "relative",
                transform: "translateZ(0)",
                WebkitTransform: "translateZ(0)"
              }}
            >
              <img src="/card-2-full.png" alt="Explore Adventure Card 2" className="w-full object-cover scale-[1.04] origin-center" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "560px", objectFit: "cover", objectPosition: "center bottom" }} />
            </div>

            {/* Col 2: Center Text Card */}
            <div 
              style={{ 
                width: "482px", 
                maxWidth: "100%",
                height: "334px", 
                borderRadius: "4px",
                background: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                gap: "12px",
                boxSizing: "border-box"
              }}
            >
              <span 
                style={{
                  minWidth: "155px",
                  height: "26px",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  background: "#EBF7ED",
                  color: "#00A63F",
                  fontFamily: "Faktum, sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                  lineHeight: "14px",
                  letterSpacing: "1.2px",
                  borderRadius: "4px",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap"
                }}
              >
                OUR PHILOSOPHY
              </span>
              <h3 
                style={{ 
                  width: "482px",
                  maxWidth: "100%",
                  height: "156px",
                  fontFamily: "Fraunces, serif", 
                  fontWeight: 600, 
                  fontSize: "42px", 
                  lineHeight: "50px", 
                  color: "rgba(43, 43, 43, 1)", 
                  letterSpacing: "0px",
                  textAlign: "center",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                Slower journeys, deeper roots, and stories that stay with you.
              </h3>
              <p 
                style={{ 
                  width: "482px",
                  maxWidth: "100%",
                  height: "128px",
                  fontFamily: "Faktum, sans-serif", 
                  fontWeight: 500, 
                  fontSize: "24px", 
                  lineHeight: "32px", 
                  color: "rgba(43, 43, 43, 1)", 
                  letterSpacing: "0px",
                  textAlign: "center",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                We take the backroads, stay with local hosts, and design expeditions that respect the land and its people.
              </p>
            </div>

            {/* Col 3: Card 4 (Yellow Stickers - 302px x 380px) */}
            <div 
              style={{ 
                width: "302px", 
                height: "380px", 
                borderRadius: "4px",
                overflow: "hidden",
                flexShrink: 0,
                position: "relative",
                transform: "translateZ(0)",
                WebkitTransform: "translateZ(0)"
              }}
            >
              <img src="/card-4-full.png" alt="Yellow Stickers Card 4" className="w-full object-cover scale-[1.04] origin-center" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "560px", objectFit: "cover", objectPosition: "center bottom" }} />
            </div>
          </div>

          {/* Row 3 - Card Stack 3 */}
          <div 

            style={{
              position: "sticky",
              top: "100px",
              marginBottom: "0px",
              zIndex: 30,
              width: "1280px",
              maxWidth: "100%",
              height: "450px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#FFFFFF",
              boxSizing: "border-box",
            }}
            className="w-full mx-auto"
          >
            {/* Col 1: Card 7 (Cream Camel - 302px x 380px) */}
            <div 
              style={{ 
                width: "302px", 
                height: "380px", 
                borderRadius: "4px",
                overflow: "hidden",
                flexShrink: 0
              }}
            >
              <img src="/card-7-full.png" alt="Humps Down Surf's Up Card 7" className="w-full h-full object-cover scale-[1.04] origin-center" />
            </div>

            {/* Col 2: Center Text Card */}
            <div 
              style={{ 
                width: "482px", 
                maxWidth: "100%",
                height: "334px", 
                borderRadius: "4px",
                background: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                gap: "12px",
                boxSizing: "border-box"
              }}
            >
              <span 
                style={{
                  minWidth: "155px",
                  height: "26px",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  background: "#EBF7ED",
                  color: "#00A63F",
                  fontFamily: "Faktum, sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                  lineHeight: "14px",
                  letterSpacing: "1.2px",
                  borderRadius: "4px",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap"
                }}
              >
                ARTISANAL GEAR
              </span>
              <h3 
                style={{ 
                  width: "482px",
                  maxWidth: "100%",
                  height: "156px",
                  fontFamily: "Fraunces, serif", 
                  fontWeight: 600, 
                  fontSize: "42px", 
                  lineHeight: "50px", 
                  color: "rgba(43, 43, 43, 1)", 
                  letterSpacing: "0px",
                  textAlign: "center",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                Crafted for modern nomads who live life on the move.
              </h3>
              <p 
                style={{ 
                  width: "482px",
                  maxWidth: "100%",
                  height: "128px",
                  fontFamily: "Faktum, sans-serif", 
                  fontWeight: 500, 
                  fontSize: "24px", 
                  lineHeight: "32px", 
                  color: "rgba(43, 43, 43, 1)", 
                  letterSpacing: "0px",
                  textAlign: "center",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                From weather-proof stickers to hand-bound expedition journals, every item is crafted with heritage quality.
              </p>
            </div>

            {/* Col 3: Card 5 (Hikers - 302px x 380px) */}
            <div 
              style={{ 
                width: "302px", 
                height: "380px", 
                borderRadius: "4px",
                overflow: "hidden",
                flexShrink: 0
              }}
            >
              <img src="/card-5-full.png" alt="Go Banjara Traveler Card 5" className="w-full h-full object-cover scale-[1.04] origin-center" />
            </div>
          </div>

          {/* Row 4 - Card Stack 4 */}
          <div 

            style={{
              position: "sticky",
              top: "100px",
              marginBottom: "0px",
              zIndex: 40,
              width: "1280px",
              maxWidth: "100%",
              height: "450px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#FFFFFF",
              boxSizing: "border-box",
            }}
            className="w-full mx-auto"
          >
            {/* Col 1: Card 8 (Yellow Stickers - 302px x 380px) */}
            <div 
              style={{ 
                width: "302px", 
                height: "380px", 
                borderRadius: "4px",
                overflow: "hidden",
                flexShrink: 0,
                position: "relative",
                transform: "translateZ(0)",
                WebkitTransform: "translateZ(0)"
              }}
            >
              <img src="/card-8-full.png" alt="Yellow Stickers Card 8" className="w-full object-cover scale-[1.04] origin-center" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "560px", objectFit: "cover", objectPosition: "center bottom" }} />
            </div>

            {/* Col 2: Center Text Card */}
            <div 
              style={{ 
                width: "482px", 
                maxWidth: "100%",
                height: "334px", 
                borderRadius: "4px",
                background: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                gap: "12px",
                boxSizing: "border-box"
              }}
            >
              <span 
                style={{
                  minWidth: "155px",
                  height: "26px",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  background: "#EBF7ED",
                  color: "#00A63F",
                  fontFamily: "Faktum, sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                  lineHeight: "14px",
                  letterSpacing: "1.2px",
                  borderRadius: "4px",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap"
                }}
              >
                THE BANJARA TRIBE
              </span>
              <h3 
                style={{ 
                  width: "482px",
                  maxWidth: "100%",
                  height: "156px",
                  fontFamily: "Fraunces, serif", 
                  fontWeight: 600, 
                  fontSize: "42px", 
                  lineHeight: "50px", 
                  color: "rgba(43, 43, 43, 1)", 
                  letterSpacing: "0px",
                  textAlign: "center",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                Join a growing collective of curious global explorers.
              </h3>
              <p 
                style={{ 
                  width: "482px",
                  maxWidth: "100%",
                  height: "128px",
                  fontFamily: "Faktum, sans-serif", 
                  fontWeight: 500, 
                  fontSize: "24px", 
                  lineHeight: "32px", 
                  color: "rgba(43, 43, 43, 1)", 
                  letterSpacing: "0px",
                  textAlign: "center",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                Connect with like-minded wanderers, share trail notes, and write your next chapter with Go Banjara.
              </p>
            </div>

            {/* Col 3: Card 6 (Green Explore - 302px x 380px) */}
            <div 
              style={{ 
                width: "302px", 
                height: "380px", 
                borderRadius: "4px",
                overflow: "hidden",
                flexShrink: 0,
                position: "relative",
                transform: "translateZ(0)",
                WebkitTransform: "translateZ(0)"
              }}
            >
              <img src="/card-6-full.png" alt="Explore Adventure Card 6" className="w-full object-cover scale-[1.04] origin-center" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "560px", objectFit: "cover", objectPosition: "center bottom" }} />
            </div>
          </div>

        </div>
      </section>

      {/* 7. BRAND PHILOSOPHY / SIX WORDS WE LIVE BY Section */}
      <section 
        style={{
          width: "100%",
          background: "rgba(255, 255, 255, 1)",
          boxSizing: "border-box",
        }}
        className="mx-auto w-full max-w-[430px] md:max-w-[1440px] px-[20px] py-[12px] md:py-10 md:px-[80px] shrink-0 flex flex-col gap-6 md:gap-[32px] min-h-auto"
      >
        {/* Header Box */}
        <div className="w-full max-w-[1280px] mx-auto text-left md:text-center flex flex-col items-start md:items-center gap-2 md:gap-3">
          <span className="inline-flex items-center justify-center h-[26px] w-fit text-[12px] font-bold uppercase tracking-[0.12em] text-[#FF623E] bg-[#FFEBE5] px-3 rounded-[4px]">
            BRAND PHILOSOPHY
          </span>

          <h2 className="text-2xl sm:text-3xl md:text-[42px] font-serif font-semibold text-[#2B2B2B] leading-tight m-0">
            <span className="text-[#FF623E]">Six words</span> we live by.
          </h2>

          <p className="text-xs sm:text-base md:text-[20px] font-sans font-medium text-[#2B2B2B]/75 leading-relaxed m-0 text-left md:text-center w-full max-w-[1280px]">
            Not a mission statement. Not a poster on the wall. Just six things we've earned the right to say after seven years on the road.
          </p>
        </div>

        {/* 6 Value Cards Grid Container */}
        <div className="w-full max-w-[1280px] mx-auto flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-[32px]">
          {[
            {
              title: "Explore - Never Stop Being Curious",
              body: "The best version of you lies beyond your comfort zone. Each trip allows you to discover something new.",
              footer: "Brand Philosophy"
            },
            {
              title: "Explore - Never Stop Being Curious",
              body: "The best version of you lies beyond your comfort zone. Each trip allows you to discover something new.",
              footer: "Brand Philosophy"
            },
            {
              title: "Explore - Never Stop Being Curious",
              body: "The best version of you lies beyond your comfort zone. Each trip allows you to discover something new.",
              footer: "Brand Philosophy"
            },
            {
              title: "Explore - Never Stop Being Curious",
              body: "The best version of you lies beyond your comfort zone. Each trip allows you to discover something new.",
              footer: "Brand Philosophy"
            },
            {
              title: "Explore - Never Stop Being Curious",
              body: "The best version of you lies beyond your comfort zone. Each trip allows you to discover something new.",
              footer: "Brand Philosophy"
            },
            {
              title: "Explore - Never Stop Being Curious",
              body: "The best version of you lies beyond your comfort zone. Each trip allows you to discover something new.",
              footer: "Brand Philosophy"
            }
          ].map((card, idx) => (
            <div 
              key={idx}
              className="w-full bg-[#F8F8F8] rounded-[6px] p-5 md:p-[24px] flex flex-col justify-between gap-4 border border-gray-100/80 shadow-2xs min-h-[220px] md:min-h-[427px]"
            >
              <div className="flex flex-col items-start gap-3 md:gap-[24px] w-full">
                {/* White square compass icon emblem */}
                <div className="w-9 h-9 md:w-12 md:h-12 rounded-[6px] md:rounded-[8px] bg-white flex items-center justify-center border border-gray-200/60 shadow-2xs shrink-0">
                  <Compass className="w-5 h-5 md:w-6 md:h-6 text-[#FF623E]" />
                </div>

                <h3 className="font-sans font-bold text-base md:text-[20px] text-[#2B2B2B] leading-snug md:leading-[28px] m-0 text-left">
                  {card.title}
                </h3>

                <p className="font-sans font-medium text-xs sm:text-sm md:text-[20px] text-[#2B2B2B]/75 leading-relaxed md:leading-[32px] m-0 text-left">
                  {card.body}
                </p>
              </div>

              <span className="font-sans font-medium text-xs md:text-[20px] text-[#2B2B2B]/60 text-left pt-2">
                {card.footer}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Customer Reviews / What people say (Mobile 430x726 | Desktop Spec) */}
      <section 
        style={{ background: "rgba(255, 255, 255, 1)" }}
        className="w-full mx-auto max-w-[430px] md:max-w-[1440px] px-[20px] py-[12px] md:py-[62px] md:px-[80px] shrink-0"
      >
        <div className="w-full max-w-[1280px] mx-auto flex flex-col gap-4 md:gap-10 text-left">
          
          {/* Section Title */}
          <h2 className="text-2xl sm:text-3xl md:text-[42px] font-serif font-bold text-[#2B2B2B] leading-tight m-0">
            What <span className="text-[#FF623E]">people</span> say
          </h2>

          {/* Mobile Vertical Cards Stack (Figma 430x726 Spec) */}
          <div className="flex flex-col gap-3 w-full md:hidden">
            {[1, 2, 3].map((_, idx) => (
              <div 
                key={idx}
                className="bg-white border border-gray-200 p-4 rounded-[8px] flex flex-col justify-between gap-3 shadow-2xs text-left"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex text-amber-400 gap-1">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-800 font-medium italic text-xs leading-relaxed m-0">
                    “The quality of the journal is incredible. It feels like a piece of art that I can actually take on my treks. Bonjo’s personality shines through the brand!”
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop" 
                    alt="Kiran Makwan" 
                    className="w-9 h-9 rounded-full object-cover shrink-0" 
                  />
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 leading-none m-0">Kiran Makwan</h4>
                    <p className="text-[11px] text-gray-400 italic font-medium mt-1 m-0">Verified Wanderer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Marquee Carousel */}
          <div className="hidden md:block w-full overflow-hidden relative">
            {/* Left and Right Fade Mask overlays */}
            <div 
              className="absolute inset-y-0 left-0 w-[100px] sm:w-[180px] pointer-events-none z-30"
              style={{ background: 'linear-gradient(90deg, #FFFFFF 0%, rgba(255,255,255,0) 100%)' }}
            />
            <div 
              className="absolute inset-y-0 right-0 w-[100px] sm:w-[180px] pointer-events-none z-30"
              style={{ background: 'linear-gradient(270deg, #FFFFFF 0%, rgba(255,255,255,0) 100%)' }}
            />

            <div className="flex flex-col gap-6 py-2">
              {/* Row 1 (Left Infinite Scrolling) */}
              <div className="flex gap-8 py-2 w-max animate-marquee hover:[animation-play-state:paused]">
                {row1.map((review, idx) => (
                  <div 
                    key={`r1-${idx}`} 
                    className="bg-white border border-gray-200 p-6 rounded-[8px] flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-xl hover:border-[#FF623E] hover:scale-105 transition-all duration-300 w-[380px] shrink-0 cursor-pointer text-left"
                  >
                    <div className="space-y-3">
                      <div className="flex text-amber-400 text-sm gap-1">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-gray-700 font-medium italic text-[15px] leading-relaxed">
                        “{review.text}”
                      </p>
                    </div>
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                      <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                      <div>
                        <h4 className="text-[15px] font-bold text-gray-800 leading-none">{review.name}</h4>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">{review.subtitle}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 2 (Right Reverse Infinite Scrolling) */}
              <div className="flex gap-8 py-2 w-max animate-marquee-reverse hover:[animation-play-state:paused]">
                {row2.map((review, idx) => (
                  <div 
                    key={`r2-${idx}`} 
                    className="bg-white border border-gray-200 p-6 rounded-[8px] flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-xl hover:border-[#FF623E] hover:scale-105 transition-all duration-300 w-[380px] shrink-0 cursor-pointer text-left"
                  >
                    <div className="space-y-3">
                      <div className="flex text-amber-400 text-sm gap-1">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-gray-700 font-medium italic text-[15px] leading-relaxed">
                        “{review.text}”
                      </p>
                    </div>
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                      <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                      <div>
                        <h4 className="text-[15px] font-bold text-gray-800 leading-none">{review.name}</h4>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">{review.subtitle}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 9. FAQ Accordion Section (Mobile 430x582 | Desktop Spec) */}
      <section 
        style={{ background: "rgba(255, 255, 255, 1)" }}
        className="mx-auto w-full max-w-[430px] md:max-w-[1440px] px-[20px] py-[12px] md:py-[42px] md:px-[80px] border-t border-gray-100 shrink-0 text-left"
      >
        <h2 className="text-2xl sm:text-3xl md:text-[42px] font-serif font-semibold text-[#2B2B2B] leading-tight m-0 mb-3">
          FAQ's
        </h2>

        <div className="w-full flex flex-col border-t border-gray-200">
          {[
            {
              question: "What materials are the badges made from? Zinc alloy with glossy enamel fill.",
              answer: "Lightweight, durable, and safe to pin on bags, jackets, or backpacks without damaging fabric."
            },
            {
              question: "How big are the stickers?",
              answer: "Our premium die-cut vinyl stickers range from 2.5 to 3.5 inches, with weatherproof UV matte lamination."
            },
            {
              question: "Do you ship across India?",
              answer: "Yes! We offer express shipping across all states and union territories in India with tracking numbers provided via SMS & email."
            },
            {
              question: "Can I return a product if I don't like it?",
              answer: "We offer a hassle-free 7-day return and exchange policy for any unused products in original packaging."
            },
            {
              question: "I have no reviews on this product. Is it safe to buy?",
              answer: "Absolutely. All our gear is thoroughly field-tested by our collective of guides before listing, and backed by our quality guarantee."
            }
          ].map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div 
                key={idx} 
                className="w-full border-b border-gray-200 py-3.5 flex flex-col text-left transition-colors duration-200"
              >
                <button 
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex justify-between items-center text-left focus:outline-none cursor-pointer gap-2"
                >
                  <span className="text-xs sm:text-base md:text-[18px] font-sans font-semibold text-[#2C2C2C] leading-snug">
                    {item.question}
                  </span>
                  {isOpen ? (
                    <span className="text-lg sm:text-2xl font-semibold text-[#FF623E] select-none shrink-0 ml-2">−</span>
                  ) : (
                    <span className="text-lg sm:text-2xl font-semibold text-[#1D493E] select-none shrink-0 ml-2">+</span>
                  )}
                </button>
                {isOpen && (
                  <p className="text-xs sm:text-sm font-sans font-medium text-gray-500 leading-relaxed m-0 pt-2 animate-fade-in-up">
                    {item.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. NEWSLETTER / CTA SECTION (Mobile 430x182 | Desktop Spec) */}
      <section className="w-full bg-white mx-auto max-w-[430px] md:max-w-[1440px] px-[20px] pt-[12px] pb-[62px] md:py-[42px] md:px-[80px] shrink-0">
        <div className="w-full max-w-[1280px] mx-auto flex flex-col items-center gap-4 md:gap-[32px] text-center">
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-xl sm:text-2xl md:text-[42px] font-serif font-semibold text-[#1D493E] leading-tight m-0">
              The <span className="text-[#FF5A36]">best adventures</span> find their way to your inbox.
            </h2>
            <p className="hidden md:block font-sans font-medium text-base md:text-[24px] text-[#2B2B2B] m-0">
              Hidden places, exclusive trip drops, curated gear, and stories from the road delivered before anyone else hears about them.
            </p>
          </div>

          <Link
            href="/travel"
            className="h-[44px] md:h-[55px] px-6 md:px-[36px] bg-[#1D493E] hover:bg-[#15342c] text-white font-sans font-medium text-xs sm:text-base rounded-[4px] inline-flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer group"
          >
            <span>Reserve your tour now</span>
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.25" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="w-5 h-5 shrink-0 transform transition-transform duration-300 ease-out group-hover:translate-x-1.5 group-hover:-translate-y-1.5"
            >
              <path d="M7 17l2.5-2.5" />
              <path d="M12.5 11.5L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </Link>
        </div>
      </section>

    </div>
  );
}
