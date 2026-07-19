'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Star, Compass, Users, MapPin, Sparkles, ArrowUpRight, HeartHandshake, Hammer 
} from 'lucide-react';
import { TrustBanner } from '@/components/TrustBanner';

export default function AboutPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

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

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-[#2B2B2B] overflow-x-hidden">
      
      {/* 1. Header Section (1440x252px spec) */}
      <header 
        style={{
          width: "100%",
          maxWidth: "1440px",
          minHeight: "252px",
          background: "rgba(255, 255, 255, 1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          boxSizing: "border-box",
          paddingTop: "62px",
          paddingBottom: "24px",
        }}
        className="mx-auto px-6 md:px-[80px] border-b border-gray-100 shrink-0 w-full"
      >
        {/* Label Tag */}
        <div style={{ height: "26px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#FFEBE5", borderRadius: "4px", padding: "4px 10px" }} className="shrink-0">
          <span style={{ fontFamily: "Faktum, sans-serif", fontWeight: 600, fontSize: "14px", letterSpacing: "1.2px", color: "#FF623E", textTransform: "uppercase" }}>
            ABOUT GO BANJARA
          </span>
        </div>

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
          We don't sell trips. We hand you back a country you forgot.
        </h1>

        {/* Subtitle */}
        <p 
          style={{ 
            fontFamily: "Faktum, sans-serif", 
            fontWeight: 500, 
            color: "rgba(43, 43, 43, 1)", 
            textAlign: "center",
            margin: 0,
            fontSize: "24px",
            lineHeight: "32px",
          }} 
          className="text-lg md:text-[24px] w-full max-w-[1280px]"
        >
          Go Banjara is a small collective of travelers, writers, makers and local guides quietly rebuilding what travel across India was supposed to feel like
        </p>
      </header>

      {/* 2. Meet Bonjo Section (1440x774px spec) */}
      <section 
        style={{ 
          width: "100%", 
          maxWidth: "1440px", 
          minHeight: "774px", 
          paddingTop: "62px", 
          paddingBottom: "62px", 
          background: "rgba(255, 255, 255, 1)",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center"
        }}
        className="mx-auto px-6 md:px-[80px] w-full"
      >
        <div style={{ gap: "32px" }} className="grid grid-cols-1 md:grid-cols-2 items-center w-full max-w-[1280px] mx-auto">
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
                href="/travel" 
                className="inline-flex items-center justify-center w-[230px] h-[68px] pt-[18px] pr-[36px] pb-[18px] pl-[36px] gap-[8px] rounded-[4px] bg-[#1D493E] hover:bg-[#15342c] text-white font-sans font-bold transition-all duration-300 shadow-sm cursor-pointer"
              >
                <span>Explore with Bonjo</span>
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

      {/* 3. Stats Bar Section (1440x145px spec) */}
      <section 
        style={{
          width: "100%",
          maxWidth: "1440px",
          height: "145px",
          paddingTop: "24px",
          paddingRight: "80px",
          paddingBottom: "24px",
          paddingLeft: "80px",
          background: "rgba(255, 255, 255, 1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box"
        }}
        className="mx-auto w-full shrink-0"
      >
        <div 
          style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            gap: "47px",
            width: "100%",
            maxWidth: "1280px"
          }}
          className="flex-wrap md:flex-nowrap justify-between md:justify-center w-full"
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

      {/* 4. Overlapping Sticker Cards Strip Section (1440x556px spec) */}
      <section 
        style={{ 
          width: "100%", 
          maxWidth: "1440px",
          height: "556px", 
          background: "rgba(255, 255, 255, 1)", 
          position: "relative",
          overflow: "hidden",
          boxSizing: "border-box"
        }}
        className="mx-auto w-full shrink-0"
      >
        {/* Cards Container */}
        <div 
          style={{ 
            width: "1709.57px", 
            height: "418.33px", 
            display: "flex", 
            alignItems: "center", 
            overflowX: "auto",
            scrollbarWidth: "none",
            boxSizing: "border-box",
            position: "absolute",
            top: "68px",
            left: "50%",
            transform: "translateX(-50%)"
          }}
          className="scrollbar-none"
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
              backgroundImage: "url('https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=600&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
              boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
              transform: "rotate(8deg)",
              opacity: 1,
              zIndex: 10,
              flexShrink: 0,
              overflow: "hidden"
            }}
          >
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />
            <div style={{ position: "absolute", bottom: "35px", left: "20px", transform: "rotate(-4deg)" }}>
              <span style={{ fontFamily: "Faktum, sans-serif", fontWeight: 800, fontSize: "48px", color: "#FFFF80", letterSpacing: "-1.5px", lineHeight: "1" }}>
                go banjara
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Two Large Story/Mission Cards Section */}
      <section className="w-full bg-[#FFFFFF] py-[62px] px-6 md:px-[80px] mx-auto max-w-[1440px] shrink-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[1280px] mx-auto">
          {/* Card 1: Story */}
          <div 
            style={{ height: "450px", borderRadius: "16px" }} 
            className="relative overflow-hidden group shadow-md"
          >
            <img 
              src="https://images.unsplash.com/photo-1533240332313-0db49b439ad3?auto=format&fit=crop&w=800&q=80" 
              alt="Hikers on mountains" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-8 text-left">
              <span className="bg-[#FF623E] text-white text-[12px] font-bold px-3 py-1 rounded-[4px] self-start mb-3 uppercase tracking-wider">
                STORY
              </span>
              <h3 className="font-serif font-semibold text-2xl sm:text-3xl text-white mb-2 leading-tight">
                "We wanted something slower, closer to the ground, and honest about the places we visited."
              </h3>
              <p className="text-white/80 text-sm sm:text-base font-sans font-medium">
                Our journeys are designed around raw human experiences, local hospitality, and respect for native communities.
              </p>
            </div>
          </div>

          {/* Card 2: Trips */}
          <div 
            style={{ height: "450px", borderRadius: "16px" }} 
            className="relative overflow-hidden group shadow-md"
          >
            <img 
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80" 
              alt="Camels in desert" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-8 text-left">
              <span className="bg-[#FF623E] text-white text-[12px] font-bold px-3 py-1 rounded-[4px] self-start mb-3 uppercase tracking-wider">
                MISSION
              </span>
              <h3 className="font-serif font-semibold text-2xl sm:text-3xl text-white mb-2 leading-tight">
                Curated small-group journeys led by local experts.
              </h3>
              <p className="text-white/80 text-sm sm:text-base font-sans font-medium">
                Unlocking unseen terrains of India with small traveler circles, ensuring minimal footprint and maximum connection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Alternating Sticker Grid Section */}
      <section className="w-full bg-white py-[62px] px-6 md:px-[80px] mx-auto max-w-[1440px] flex flex-col gap-12 shrink-0">
        {/* Header */}
        <div className="w-full text-center flex flex-col gap-2">
          <span className="text-[14px] font-semibold text-[#FF623E] bg-[#FFEBE5] px-3 py-1 rounded-[4px] self-center uppercase tracking-widest">
            OUR STORY
          </span>
          <h2 className="text-3xl md:text-[42px] font-serif font-bold text-[#1D493E]">
            How We Build Experiences
          </h2>
        </div>

        {/* 4 Rows of 3-Column Grid */}
        <div className="flex flex-col gap-12 w-full max-w-[1280px] mx-auto">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-center">
            {/* Col 1 */}
            <div className="flex justify-center">
              <div 
                style={{ 
                  width: "302px", 
                  height: "380px", 
                  borderTopRightRadius: "4px",
                  borderBottomRightRadius: "4px",
                  borderBottomLeftRadius: "4px",
                  borderTopLeftRadius: "0px",
                  backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  position: "relative",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                  transform: "rotate(-2deg)"
                }}
              >
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />
                <div style={{ position: "absolute", bottom: "35px", left: "20px", transform: "rotate(-4deg)" }}>
                  <span style={{ fontFamily: "Faktum, sans-serif", fontWeight: 800, fontSize: "48px", color: "#FFFF80", letterSpacing: "-1.5px", lineHeight: "1" }}>
                    go banjara
                  </span>
                </div>
              </div>
            </div>

            {/* Col 2: Text Card */}
            <div className="flex justify-center">
              <div className="flex flex-col items-center justify-center p-8 bg-white border border-gray-150 rounded-2xl text-center w-[302px] h-[380px] shadow-xs">
                <span className="text-[12px] font-bold text-[#FF623E] bg-[#FFEBE5] px-3 py-1 rounded-[4px] mb-6 uppercase tracking-wider">
                  01 / PHILOSOPHY
                </span>
                <p className="font-serif font-semibold text-xl md:text-2xl text-[#1D493E] leading-relaxed">
                  We don't sell trips. We hand you back a country you forgot.
                </p>
              </div>
            </div>

            {/* Col 3 */}
            <div className="flex justify-center">
              <div 
                style={{ 
                  width: "302px", 
                  height: "380px", 
                  borderTopRightRadius: "4px",
                  borderBottomRightRadius: "4px",
                  borderBottomLeftRadius: "4px",
                  borderTopLeftRadius: "0px",
                  background: "#F4FBF4",
                  position: "relative",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                  transform: "rotate(3deg)"
                }}
                className="p-6 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <h3 style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: "36px", lineHeight: "105%", color: "#1D493E", margin: 0, transform: "rotate(-2deg)" }}>
                    Humps down,<br />surfs up!
                  </h3>
                </div>
                <div style={{ position: "absolute", bottom: "-10px", right: "-10px", width: "240px", height: "240px" }}>
                  <svg viewBox="0 0 200 200" fill="none" style={{ width: "100%", height: "100%" }}>
                    <path d="M60,200 C60,140 70,120 70,100 C70,70 60,60 80,50 C100,40 130,40 140,60 C150,75 145,100 140,110 C130,125 130,150 130,200 Z" fill="#FF623E" />
                    <path d="M72,52 L62,35 C60,32 65,30 68,34 L78,48 Z" fill="#FF623E" />
                    <path d="M132,58 L146,42 C148,39 152,43 148,46 L136,58 Z" fill="#FF623E" />
                    <path d="M125,100 C125,120 100,125 95,120 C90,115 90,100 95,95 Z" fill="#E24C28" opacity="0.6" />
                    <g transform="rotate(4, 105, 80)">
                      <path d="M70,78 C70,70 88,68 98,72 C108,76 102,96 88,96 C74,96 70,86 70,78 Z" fill="#1D493E" stroke="#FFFFFF" strokeWidth="4" />
                      <path d="M102,82 C102,74 120,72 130,76 C140,80 134,100 120,100 C106,100 102,90 102,82 Z" fill="#1D493E" stroke="#FFFFFF" strokeWidth="4" />
                      <rect x="94" y="74" width="12" height="4" fill="#FFFFFF" rx="2" />
                      <circle cx="92" cy="78" r="4" fill="#FFFFFF" opacity="0.8" />
                      <circle cx="124" cy="82" r="4" fill="#FFFFFF" opacity="0.8" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-center">
            {/* Col 1 */}
            <div className="flex justify-center">
              <div 
                style={{ 
                  width: "302px", 
                  height: "380px", 
                  borderTopRightRadius: "4px",
                  borderBottomRightRadius: "4px",
                  borderBottomLeftRadius: "4px",
                  borderTopLeftRadius: "0px",
                  background: "#1D493E",
                  position: "relative",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                  transform: "rotate(-3deg)"
                }}
                className="overflow-hidden"
              >
                <svg viewBox="0 0 302 380" fill="none" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
                  <path d="M-20,320 Q90,260 90,140 Q90,50 180,90 Q220,110 240,40 Q250,10 280,-20" fill="none" stroke="#FF623E" strokeWidth="28" strokeLinecap="round" />
                  <path d="M240,40 Q260,110 290,180" fill="none" stroke="#FF623E" strokeWidth="28" strokeLinecap="round" />
                </svg>
                <span style={{ position: "absolute", top: "45px", left: "30px", fontFamily: "Fraunces, serif", fontStyle: "italic", fontWeight: 500, fontSize: "36px", color: "#FAF9F6", transform: "rotate(-5deg)" }}>explore</span>
                <span style={{ position: "absolute", top: "140px", right: "25px", fontFamily: "Fraunces, serif", fontStyle: "italic", fontWeight: 500, fontSize: "36px", color: "#FAF9F6", transform: "rotate(-6deg)" }}>adventure</span>
                <span style={{ position: "absolute", bottom: "100px", left: "35px", fontFamily: "Fraunces, serif", fontStyle: "italic", fontWeight: 500, fontSize: "36px", color: "#FAF9F6", transform: "rotate(-4deg)" }}>wild</span>
                <span style={{ position: "absolute", bottom: "40px", right: "30px", fontFamily: "Fraunces, serif", fontStyle: "italic", fontWeight: 500, fontSize: "36px", color: "#FAF9F6", transform: "rotate(-6deg)" }}>journey</span>
              </div>
            </div>

            {/* Col 2: Text Card */}
            <div className="flex justify-center">
              <div className="flex flex-col items-center justify-center p-8 bg-white border border-gray-150 rounded-2xl text-center w-[302px] h-[380px] shadow-xs">
                <span className="text-[12px] font-bold text-[#FF623E] bg-[#FFEBE5] px-3 py-1 rounded-[4px] mb-6 uppercase tracking-wider">
                  02 / EXPLORATION
                </span>
                <p className="font-serif font-semibold text-xl md:text-2xl text-[#1D493E] leading-relaxed">
                  Slower exploration. Closer to the soil. Honest connections with the land.
                </p>
              </div>
            </div>

            {/* Col 3 */}
            <div className="flex justify-center">
              <div 
                style={{ 
                  width: "302px", 
                  height: "380px", 
                  borderTopRightRadius: "4px",
                  borderBottomRightRadius: "4px",
                  borderBottomLeftRadius: "4px",
                  borderTopLeftRadius: "0px",
                  background: "#FFFF80",
                  position: "relative",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                  transform: "rotate(2deg)"
                }}
                className="overflow-hidden"
              >
                <div style={{ position: "absolute", top: "45px", left: "20px", width: "120px", height: "120px", borderRadius: "50%", background: "#FF623E", transform: "rotate(-12deg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: "100px", height: "100px", borderRadius: "50%", border: "1px dashed #FFFF80", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <img src="/logo.png" alt="Mascot" style={{ width: "38px", height: "auto" }} />
                    <span style={{ fontSize: "7px", fontWeight: 800, fontFamily: "Faktum, sans-serif", color: "#FFFF80", marginTop: "4px" }}>Go Banjara</span>
                  </div>
                </div>
                <div style={{ position: "absolute", top: "30px", right: "15px", background: "#59D3F3", padding: "8px 12px", borderRadius: "4px", border: "3.5px solid #FFFFFF", transform: "rotate(6deg)", display: "flex", flexDirection: "column" }}>
                  <span style={{ fontFamily: "Faktum, sans-serif", fontWeight: 800, fontSize: "14px", color: "#FF623E", lineHeight: "1" }}>explore</span>
                  <span style={{ fontFamily: "Faktum, sans-serif", fontWeight: 800, fontSize: "14px", color: "#FFFFFF", lineHeight: "1" }}>MORE!</span>
                </div>
                <div style={{ position: "absolute", bottom: "20px", right: "15px", background: "#02B3A6", width: "115px", height: "170px", borderRadius: "6px", border: "3.5px solid #FFFFFF", transform: "rotate(4deg)", padding: "10px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", justifyContent: "center", gap: "2px" }}><div className="w-6 h-2 bg-[#FFFF80] rounded-xs" /><div className="w-6 h-2 bg-[#FF623E] rounded-xs" /></div>
                  <span style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", fontWeight: 600, fontSize: "20px", color: "#FFFF80", lineHeight: "1" }}>I travel to read.</span>
                </div>
                <div style={{ position: "absolute", bottom: "-10px", left: "15px", background: "#AE99FF", padding: "6px 20px 14px", borderRadius: "20px 20px 4px 4px", border: "3.5px solid #FFFFFF", transform: "rotate(-10deg) translateY(5px)" }}>
                  <span style={{ fontFamily: "Fraunces, serif", fontWeight: 700, fontSize: "16px", color: "#FFFFFF" }}>GOA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-center">
            {/* Col 1 */}
            <div className="flex justify-center">
              <div 
                style={{ 
                  width: "302px", 
                  height: "380px", 
                  borderTopRightRadius: "4px",
                  borderBottomRightRadius: "4px",
                  borderBottomLeftRadius: "4px",
                  borderTopLeftRadius: "0px",
                  background: "#F4FBF4",
                  position: "relative",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                  transform: "rotate(-2deg)"
                }}
                className="p-6 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <h3 style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: "36px", lineHeight: "105%", color: "#1D493E", margin: 0, transform: "rotate(-2deg)" }}>
                    Humps down,<br />surfs up!
                  </h3>
                </div>
                <div style={{ position: "absolute", bottom: "-10px", right: "-10px", width: "240px", height: "240px" }}>
                  <svg viewBox="0 0 200 200" fill="none" style={{ width: "100%", height: "100%" }}>
                    <path d="M60,200 C60,140 70,120 70,100 C70,70 60,60 80,50 C100,40 130,40 140,60 C150,75 145,100 140,110 C130,125 130,150 130,200 Z" fill="#FF623E" />
                    <path d="M72,52 L62,35 C60,32 65,30 68,34 L78,48 Z" fill="#FF623E" />
                    <path d="M132,58 L146,42 C148,39 152,43 148,46 L136,58 Z" fill="#FF623E" />
                    <path d="M125,100 C125,120 100,125 95,120 C90,115 90,100 95,95 Z" fill="#E24C28" opacity="0.6" />
                    <g transform="rotate(4, 105, 80)">
                      <path d="M70,78 C70,70 88,68 98,72 C108,76 102,96 88,96 C74,96 70,86 70,78 Z" fill="#1D493E" stroke="#FFFFFF" strokeWidth="4" />
                      <path d="M102,82 C102,74 120,72 130,76 C140,80 134,100 120,100 C106,100 102,90 102,82 Z" fill="#1D493E" stroke="#FFFFFF" strokeWidth="4" />
                      <rect x="94" y="74" width="12" height="4" fill="#FFFFFF" rx="2" />
                      <circle cx="92" cy="78" r="4" fill="#FFFFFF" opacity="0.8" />
                      <circle cx="124" cy="82" r="4" fill="#FFFFFF" opacity="0.8" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>

            {/* Col 2: Text Card */}
            <div className="flex justify-center">
              <div className="flex flex-col items-center justify-center p-8 bg-white border border-gray-150 rounded-2xl text-center w-[302px] h-[380px] shadow-xs">
                <span className="text-[12px] font-bold text-[#FF623E] bg-[#FFEBE5] px-3 py-1 rounded-[4px] mb-6 uppercase tracking-wider">
                  03 / CRAFTSMANSHIP
                </span>
                <p className="font-serif font-semibold text-xl md:text-2xl text-[#1D493E] leading-relaxed">
                  Curating gear made by artisans we know by name, built to last.
                </p>
              </div>
            </div>

            {/* Col 3 */}
            <div className="flex justify-center">
              <div 
                style={{ 
                  width: "302px", 
                  height: "380px", 
                  borderTopRightRadius: "4px",
                  borderBottomRightRadius: "4px",
                  borderBottomLeftRadius: "4px",
                  borderTopLeftRadius: "0px",
                  backgroundImage: "url('https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=600&q=80')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  position: "relative",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                  transform: "rotate(3deg)"
                }}
              >
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />
                <div style={{ position: "absolute", bottom: "35px", left: "20px", transform: "rotate(-4deg)" }}>
                  <span style={{ fontFamily: "Faktum, sans-serif", fontWeight: 800, fontSize: "48px", color: "#FFFF80", letterSpacing: "-1.5px", lineHeight: "1" }}>
                    go banjara
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-center">
            {/* Col 1 */}
            <div className="flex justify-center">
              <div 
                style={{ 
                  width: "302px", 
                  height: "380px", 
                  borderTopRightRadius: "4px",
                  borderBottomRightRadius: "4px",
                  borderBottomLeftRadius: "4px",
                  borderTopLeftRadius: "0px",
                  background: "#FFFF80",
                  position: "relative",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                  transform: "rotate(-2deg)"
                }}
                className="overflow-hidden"
              >
                <div style={{ position: "absolute", top: "45px", left: "20px", width: "120px", height: "120px", borderRadius: "50%", background: "#FF623E", transform: "rotate(-12deg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: "100px", height: "100px", borderRadius: "50%", border: "1px dashed #FFFF80", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <img src="/logo.png" alt="Mascot" style={{ width: "38px", height: "auto" }} />
                    <span style={{ fontSize: "7px", fontWeight: 800, fontFamily: "Faktum, sans-serif", color: "#FFFF80", marginTop: "4px" }}>Go Banjara</span>
                  </div>
                </div>
                <div style={{ position: "absolute", top: "30px", right: "15px", background: "#59D3F3", padding: "8px 12px", borderRadius: "4px", border: "3.5px solid #FFFFFF", transform: "rotate(6deg)", display: "flex", flexDirection: "column" }}>
                  <span style={{ fontFamily: "Faktum, sans-serif", fontWeight: 800, fontSize: "14px", color: "#FF623E", lineHeight: "1" }}>explore</span>
                  <span style={{ fontFamily: "Faktum, sans-serif", fontWeight: 800, fontSize: "14px", color: "#FFFFFF", lineHeight: "1" }}>MORE!</span>
                </div>
                <div style={{ position: "absolute", bottom: "20px", right: "15px", background: "#02B3A6", width: "115px", height: "170px", borderRadius: "6px", border: "3.5px solid #FFFFFF", transform: "rotate(4deg)", padding: "10px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", justifyContent: "center", gap: "2px" }}><div className="w-6 h-2 bg-[#FFFF80] rounded-xs" /><div className="w-6 h-2 bg-[#FF623E] rounded-xs" /></div>
                  <span style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", fontWeight: 600, fontSize: "20px", color: "#FFFF80", lineHeight: "1" }}>I travel to read.</span>
                </div>
                <div style={{ position: "absolute", bottom: "-10px", left: "15px", background: "#AE99FF", padding: "6px 20px 14px", borderRadius: "20px 20px 4px 4px", border: "3.5px solid #FFFFFF", transform: "rotate(-10deg) translateY(5px)" }}>
                  <span style={{ fontFamily: "Fraunces, serif", fontWeight: 700, fontSize: "16px", color: "#FFFFFF" }}>GOA</span>
                </div>
              </div>
            </div>

            {/* Col 2: Text Card */}
            <div className="flex justify-center">
              <div className="flex flex-col items-center justify-center p-8 bg-white border border-gray-150 rounded-2xl text-center w-[302px] h-[380px] shadow-xs">
                <span className="text-[12px] font-bold text-[#FF623E] bg-[#FFEBE5] px-3 py-1 rounded-[4px] mb-6 uppercase tracking-wider">
                  04 / COMMUNITY
                </span>
                <p className="font-serif font-semibold text-xl md:text-2xl text-[#1D493E] leading-relaxed">
                  A community of travelers who share raw notes from the road.
                </p>
              </div>
            </div>

            {/* Col 3 */}
            <div className="flex justify-center">
              <div 
                style={{ 
                  width: "302px", 
                  height: "380px", 
                  borderTopRightRadius: "4px",
                  borderBottomRightRadius: "4px",
                  borderBottomLeftRadius: "4px",
                  borderTopLeftRadius: "0px",
                  background: "#1D493E",
                  position: "relative",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                  transform: "rotate(4deg)"
                }}
                className="overflow-hidden"
              >
                <svg viewBox="0 0 302 380" fill="none" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
                  <path d="M-20,320 Q90,260 90,140 Q90,50 180,90 Q220,110 240,40 Q250,10 280,-20" fill="none" stroke="#FF623E" strokeWidth="28" strokeLinecap="round" />
                  <path d="M240,40 Q260,110 290,180" fill="none" stroke="#FF623E" strokeWidth="28" strokeLinecap="round" />
                </svg>
                <span style={{ position: "absolute", top: "45px", left: "30px", fontFamily: "Fraunces, serif", fontStyle: "italic", fontWeight: 500, fontSize: "36px", color: "#FAF9F6", transform: "rotate(-5deg)" }}>explore</span>
                <span style={{ position: "absolute", top: "140px", right: "25px", fontFamily: "Fraunces, serif", fontStyle: "italic", fontWeight: 500, fontSize: "36px", color: "#FAF9F6", transform: "rotate(-6deg)" }}>adventure</span>
                <span style={{ position: "absolute", bottom: "100px", left: "35px", fontFamily: "Fraunces, serif", fontStyle: "italic", fontWeight: 500, fontSize: "36px", color: "#FAF9F6", transform: "rotate(-4deg)" }}>wild</span>
                <span style={{ position: "absolute", bottom: "40px", right: "30px", fontFamily: "Fraunces, serif", fontStyle: "italic", fontWeight: 500, fontSize: "36px", color: "#FAF9F6", transform: "rotate(-6deg)" }}>journey</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Six Card Core Values Grid (What We Live By) */}
      <section className="w-full bg-white py-[62px] px-6 md:px-[80px] border-t border-b border-gray-150 mx-auto max-w-[1440px] shrink-0">
        <div className="w-full max-w-[1280px] mx-auto text-center flex flex-col gap-12">
          <div className="space-y-3">
            <span className="text-[14px] font-semibold text-[#FF623E] bg-[#FFEBE5] px-3 py-1 rounded-[4px] inline-block uppercase tracking-widest">
              OUR VALUES
            </span>
            <h2 className="text-3xl md:text-[42px] font-serif font-semibold text-[#1D493E]">
              What we live by
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="p-8 bg-[#F3FFEF]/40 rounded-2xl border border-[#1D493E]/10 text-left space-y-4 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-[#1D493E]/10 text-[#1D493E] flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#1D493E]">01 / Off the Map</h3>
              <p className="text-gray-500 text-sm font-semibold leading-relaxed">
                We design routes and experiences that skip the commercial hotspots for authentic wilderness.
              </p>
            </div>

            {/* Value 2 */}
            <div className="p-8 bg-[#F3FFEF]/40 rounded-2xl border border-[#1D493E]/10 text-left space-y-4 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-[#1D493E]/10 text-[#1D493E] flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#1D493E]">02 / Community First</h3>
              <p className="text-gray-500 text-sm font-semibold leading-relaxed">
                We employ local guides, stay in family-run homestays, and ensure tourism directly benefits local ecosystems.
              </p>
            </div>

            {/* Value 3 */}
            <div className="p-8 bg-[#F3FFEF]/40 rounded-2xl border border-[#1D493E]/10 text-left space-y-4 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-[#1D493E]/10 text-[#1D493E] flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#1D493E]">03 / Native Roots</h3>
              <p className="text-gray-500 text-sm font-semibold leading-relaxed">
                All our designs, badges, and travel collectibles are inspired by local folk legends and terrains.
              </p>
            </div>

            {/* Value 4 */}
            <div className="p-8 bg-[#F3FFEF]/40 rounded-2xl border border-[#1D493E]/10 text-left space-y-4 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-[#1D493E]/10 text-[#1D493E] flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#1D493E]">04 / Built to Last</h3>
              <p className="text-gray-500 text-sm font-semibold leading-relaxed">
                Whether it's an adventure or a sticker, we craft for durability and timeless aesthetic quality.
              </p>
            </div>

            {/* Value 5 */}
            <div className="p-8 bg-[#F3FFEF]/40 rounded-2xl border border-[#1D493E]/10 text-left space-y-4 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-[#1D493E]/10 text-[#1D493E] flex items-center justify-center">
                <Hammer className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#1D493E]">05 / Handcrafted Gear</h3>
              <p className="text-gray-500 text-sm font-semibold leading-relaxed">
                Made directly by skilled craftspeople using traditional methods, ensuring top quality stitchwork.
              </p>
            </div>

            {/* Value 6 */}
            <div className="p-8 bg-[#F3FFEF]/40 rounded-2xl border border-[#1D493E]/10 text-left space-y-4 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-[#1D493E]/10 text-[#1D493E] flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#1D493E]">06 / Direct Local Benefit</h3>
              <p className="text-gray-500 text-sm font-semibold leading-relaxed">
                More than 70% of booking fees flow directly back into regional jobs and sustainability programs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Customer Reviews / Feedback Section */}
      <section className="w-full bg-[#FFFFFF] py-[62px] px-6 md:px-[80px] mx-auto max-w-[1440px] shrink-0">
        <div className="w-full max-w-[1280px] mx-auto flex flex-col gap-12 text-left">
          <div className="space-y-2">
            <span className="text-[14px] font-semibold text-[#FF623E] bg-[#FFEBE5] px-3 py-1 rounded-[4px] inline-block uppercase tracking-widest">
              REAL EXPERIENCES
            </span>
            <h2 className="text-3xl md:text-[42px] font-serif font-semibold text-[#1D493E]">
              What our travelers <span className="text-[#FF623E]">say about us</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {REVIEWS.map((review) => (
              <div key={review.id} className="bg-gray-50 border border-gray-150 p-8 rounded-2xl flex flex-col justify-between space-y-6 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="space-y-4">
                  <div className="flex text-amber-400 text-sm gap-0.5">
                    {Array.from({ length: review.stars }).map((_, s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 font-medium italic text-[15px] leading-relaxed">
                    “{review.text}”
                  </p>
                </div>
                <div className="flex items-center gap-3.5 pt-4 border-t border-gray-100">
                  <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                  <div>
                    <h4 className="text-[15px] font-bold text-gray-800 leading-none">{review.name}</h4>
                    <p className="text-xs text-gray-400 font-semibold mt-1">{review.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQ Accordion Section */}
      <section className="w-full bg-white py-[62px] px-6 md:px-[80px] mx-auto max-w-[1440px] border-t border-b border-gray-150 shrink-0">
        <div className="w-full max-w-[1280px] mx-auto flex flex-col gap-12 text-left">
          <div className="space-y-2">
            <span className="text-[14px] font-semibold text-[#FF623E] bg-[#FFEBE5] px-3 py-1 rounded-[4px] inline-block uppercase tracking-widest">
              FAQ'S
            </span>
            <h2 className="text-3xl md:text-[42px] font-serif font-semibold text-[#2B2B2B]">
              Frequently asked questions
            </h2>
          </div>

          <div className="w-full border-t border-gray-200 divide-y divide-gray-200">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="py-6">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex justify-between items-center text-left gap-4 cursor-pointer group"
                  >
                    <span className="font-sans font-medium text-lg md:text-[20px] text-[#2B2B2B] group-hover:text-[#FF623E] transition-colors">
                      {item.question}
                    </span>
                    <span className="text-2xl font-bold text-[#1D493E] shrink-0 leading-none">
                      {isOpen ? '—' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <p className="mt-4 font-sans font-medium text-base md:text-[18px] text-gray-500 leading-relaxed animate-fade-in">
                      {item.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. Newsletter / CTA Banner Section */}
      <section className="w-full bg-white py-[62px] px-6 md:px-[80px] mx-auto max-w-[1440px] text-center shrink-0">
        <div className="max-w-[1280px] mx-auto flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-3xl md:text-[42px] font-serif font-bold text-[#2B2B2B] leading-tight">
              The <span className="text-[#FF5A36]">best adventures</span> find their way to your inbox.
            </h2>
            <p className="text-base sm:text-lg md:text-[22px] font-sans font-medium text-[rgba(43,43,43,0.8)] max-w-[900px] leading-relaxed">
              Hidden places, exclusive trip drops, curated gear, and stories from the road delivered before anyone else hears about them.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[580px] justify-center">
            <Link
              href="/travel"
              className="w-full sm:w-[280px] h-[55px] flex items-center justify-center rounded-[4px] bg-[#1D493E] hover:bg-[#15342c] text-white font-sans font-bold text-[18px] transition-all cursor-pointer shadow-sm"
            >
              Book Now
            </Link>
            <Link
              href="/shop"
              className="w-full sm:w-[280px] h-[55px] flex items-center justify-center rounded-[4px] border-2 border-[#1D493E] bg-transparent text-[#1D493E] hover:bg-[#1D493E]/5 font-sans font-bold text-[18px] transition-all cursor-pointer"
            >
              Explore collection
            </Link>
          </div>
        </div>
      </section>

      {/* 11. Trust Banner */}
      <TrustBanner />
    </div>
  );
}
