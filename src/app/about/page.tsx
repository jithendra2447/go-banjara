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

      {/* 4. Overlapping Sticker Cards Section (Images Row - 1709.57px x 418.33px) */}
      <section 
        style={{ 
          width: "100%", 
          height: "380px", 
          background: "rgba(255, 255, 255, 1)", 
          position: "relative",
          overflow: "hidden",
          boxSizing: "border-box",
          zIndex: 10
        }}
        className="w-full shrink-0"
      >
        {/* Cards Container (Static 1709.57px x 418.33px centered) */}
        <div 
          style={{ 
            width: "1709.5738525390625px", 
            height: "418.3321228027344px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            overflow: "hidden",
            pointerEvents: "none",
            userSelect: "none",
            boxSizing: "border-box",
            position: "absolute",
            top: "0px",
            left: "50%",
            transform: "translateX(-50%)",
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
              boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
              transform: "rotate(-8deg)",
              opacity: 1,
              zIndex: 10,
              flexShrink: 0,
              overflow: "hidden"
            }}
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
              boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
              transform: "rotate(-3deg)",
              opacity: 1,
              zIndex: 11,
              marginLeft: "-45px",
              flexShrink: 0,
              overflow: "hidden"
            }}
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
              boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
              transform: "rotate(-4deg)",
              opacity: 1,
              zIndex: 12,
              marginLeft: "-45px",
              flexShrink: 0,
              overflow: "hidden"
            }}
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
              boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
              transform: "rotate(-3deg)",
              opacity: 1,
              zIndex: 13,
              marginLeft: "-45px",
              flexShrink: 0,
              overflow: "hidden"
            }}
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
              boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
              transform: "rotate(-4deg)",
              opacity: 1,
              zIndex: 14,
              marginLeft: "-45px",
              flexShrink: 0,
              overflow: "hidden"
            }}
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
              boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
              transform: "rotate(-3deg)",
              opacity: 1,
              zIndex: 15,
              marginLeft: "-45px",
              flexShrink: 0,
              overflow: "hidden"
            }}
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
              boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
              transform: "rotate(-4deg)",
              opacity: 1,
              zIndex: 16,
              marginLeft: "-45px",
              flexShrink: 0,
              overflow: "hidden"
            }}
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
              boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
              transform: "rotate(-3deg)",
              opacity: 1,
              zIndex: 17,
              marginLeft: "-45px",
              flexShrink: 0,
              overflow: "hidden"
            }}
          >
            <img 
              src="/card-8-full.png" 
              alt="Yellow Stickers Card 8" 
              className="w-full h-full object-cover pointer-events-none select-none"
            />
          </div>
        </div>
      </section>

      {/* 5. Two Large Mission/Vision Cards Section (Interactive Animated Accordion Hover) */}
      <section 
        style={{ 
          marginTop: "0px", 
          position: "relative", 
          zIndex: 20,
          width: "100%",
          maxWidth: "1440px",
          height: "783px",
          paddingTop: "42px",
          paddingRight: "80px",
          paddingBottom: "42px",
          paddingLeft: "80px",
          background: "rgba(255, 255, 255, 1)",
          boxSizing: "border-box"
        }}
        className="mx-auto w-full shrink-0 flex items-center justify-center"
      >
        <div 
          style={{ gap: "32px", width: "100%", maxWidth: "1280px", height: "699px" }}
          className="flex flex-col md:flex-row items-center justify-between mx-auto"
        >
          {/* Card 1: OUR MISSION (Animates between 843px and 405px) */}
          <div 
            style={{ 
              width: activeCard === 'mission' ? "843px" : "405px", 
              height: "699px", 
              borderRadius: "4px",
              boxSizing: "border-box",
              transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s ease",
              cursor: "pointer"
            }} 
            onMouseEnter={() => setActiveCard('mission')}
            className="relative overflow-hidden shadow-md shrink-0 w-full"
          >
            <img 
              src="/mission-vision-full.png" 
              alt="Nomads on camels in snowy mountain valley" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-103"
            />

            {/* Translucent Glass Text Box (Visible when activeCard === 'mission') */}
            <div 
              style={{
                position: "absolute",
                bottom: "16px",
                left: "16px",
                width: "811px",
                maxWidth: "calc(100% - 32px)",
                height: "230px",
                background: "rgba(43, 43, 43, 0.55)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "4px",
                padding: "12px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "12px",
                opacity: activeCard === 'mission' ? 1 : 0,
                transform: activeCard === 'mission' ? "translateY(0)" : "translateY(12px)",
                pointerEvents: activeCard === 'mission' ? "auto" : "none",
                transition: "opacity 0.4s ease, transform 0.4s ease"
              }}
            >
              <span 
                style={{
                  width: "117px",
                  height: "26px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  background: "#FF623E",
                  color: "#FFFFFF",
                  fontFamily: "Faktum, sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                  lineHeight: "14px",
                  letterSpacing: "1.2px",
                  borderRadius: "4px",
                  textTransform: "uppercase"
                }}
              >
                OUR MISSION
              </span>
              <p 
                style={{
                  width: "787px",
                  maxWidth: "100%",
                  height: "168px",
                  fontFamily: "Faktum, sans-serif",
                  fontWeight: 500,
                  fontSize: "24px",
                  lineHeight: "42px",
                  color: "rgba(255, 255, 255, 1)",
                  letterSpacing: "0px",
                  margin: 0
                }}
              >
                We exist to bridge the gap between the life people are living and the adventures they are dreaming about. Every experience we curate, every product we build, and every story we tell is in service of one thing: helping people go further.
              </p>
            </div>

            {/* Compact Badge (Visible when activeCard !== 'mission') */}
            <div 
              style={{
                position: "absolute",
                bottom: "24px",
                left: "24px",
                opacity: activeCard === 'mission' ? 0 : 1,
                pointerEvents: activeCard === 'mission' ? "none" : "auto",
                transition: "opacity 0.4s ease"
              }}
            >
              <span 
                style={{
                  width: "117px",
                  height: "26px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  background: "#FF623E",
                  color: "#FFFFFF",
                  fontFamily: "Faktum, sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                  lineHeight: "14px",
                  letterSpacing: "1.2px",
                  borderRadius: "4px",
                  textTransform: "uppercase"
                }}
              >
                OUR MISSION
              </span>
            </div>
          </div>

          {/* Card 2: OUR VISION (Animates between 843px and 405px) */}
          <div 
            style={{ 
              width: activeCard === 'vision' ? "843px" : "405px",
              height: "699px", 
              borderRadius: "4px",
              boxSizing: "border-box",
              transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s ease",
              cursor: "pointer"
            }} 
            onMouseEnter={() => setActiveCard('vision')}
            className="relative overflow-hidden shadow-md shrink-0 w-full"
          >
            <img 
              src="/mission-vision-full.png" 
              alt="Nomads on camels in snowy mountain valley" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-103"
            />

            {/* Translucent Glass Text Box (Visible when activeCard === 'vision') */}
            <div 
              style={{
                position: "absolute",
                bottom: "16px",
                left: "16px",
                width: "811px",
                maxWidth: "calc(100% - 32px)",
                height: "230px",
                background: "rgba(43, 43, 43, 0.55)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "4px",
                padding: "12px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "12px",
                opacity: activeCard === 'vision' ? 1 : 0,
                transform: activeCard === 'vision' ? "translateY(0)" : "translateY(12px)",
                pointerEvents: activeCard === 'vision' ? "auto" : "none",
                transition: "opacity 0.4s ease, transform 0.4s ease"
              }}
            >
              <span 
                style={{
                  width: "117px",
                  height: "26px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  background: "#FF623E",
                  color: "#FFFFFF",
                  fontFamily: "Faktum, sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                  lineHeight: "14px",
                  letterSpacing: "1.2px",
                  borderRadius: "4px",
                  textTransform: "uppercase"
                }}
              >
                OUR VISION
              </span>
              <p 
                style={{
                  width: "787px",
                  maxWidth: "100%",
                  height: "168px",
                  fontFamily: "Faktum, sans-serif",
                  fontWeight: 500,
                  fontSize: "24px",
                  lineHeight: "42px",
                  color: "rgba(255, 255, 255, 1)",
                  letterSpacing: "0px",
                  margin: 0
                }}
              >
                To build India's most loved travel & nomadic lifestyle brand, empowering travelers to explore without boundaries while respecting local culture, heritage, and nature.
              </p>
            </div>

            {/* Compact Badge (Visible when activeCard !== 'vision') */}
            <div 
              style={{
                position: "absolute",
                bottom: "24px",
                left: "24px",
                opacity: activeCard === 'vision' ? 0 : 1,
                pointerEvents: activeCard === 'vision' ? "none" : "auto",
                transition: "opacity 0.4s ease"
              }}
            >
              <span 
                style={{
                  width: "117px",
                  height: "26px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  background: "#FF623E",
                  color: "#FFFFFF",
                  fontFamily: "Faktum, sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                  lineHeight: "14px",
                  letterSpacing: "1.2px",
                  borderRadius: "4px",
                  textTransform: "uppercase"
                }}
              >
                OUR VISION
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. OUR JOURNEY TIMELINE / ABOUT GO BANJARA Section (1440x2146px spec) */}
      <section 
        style={{
          width: "100%",
          maxWidth: "1440px",
          minHeight: "2146px",
          paddingTop: "42px",
          paddingRight: "80px",
          paddingBottom: "42px",
          paddingLeft: "80px",
          background: "rgba(255, 255, 255, 1)",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "32px"
        }}
        className="mx-auto w-full shrink-0"
      >
        {/* Header (Exact Figma specs) */}
        <div style={{ width: "1280px", maxWidth: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "12px" }} className="mx-auto">
          {/* Orange Badge (Single line 195px x 26px) */}
          <span 
            style={{
              minWidth: "195px",
              height: "26px",
              paddingLeft: "12px",
              paddingRight: "12px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              background: "rgba(255, 98, 62, 1)",
              color: "#FFFFFF",
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
            OUR JOURNEY TIMELINE
          </span>

          {/* Main Title (Single line 1280px x 52px, Fraunces 600, 42px) */}
          <h2 
            style={{
              width: "1280px",
              maxWidth: "100%",
              minHeight: "52px",
              fontFamily: "Fraunces, serif",
              fontWeight: 600,
              fontSize: "42px",
              lineHeight: "42px",
              color: "rgba(43, 43, 43, 1)",
              letterSpacing: "0px",
              margin: 0,
              whiteSpace: "nowrap"
            }}
          >
            From a scribbled notebook to a <span style={{ color: "#FF623E", fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: "42px", lineHeight: "42px", letterSpacing: "0px", whiteSpace: "nowrap" }}>travelling tribe</span>
          </h2>

          {/* Subtitle (1280px x 32px, Faktum 500, 24px, line-height 32px) */}
          <p 
            style={{
              width: "1280px",
              maxWidth: "100%",
              minHeight: "32px",
              fontFamily: "Faktum, sans-serif",
              fontWeight: 500,
              fontSize: "24px",
              lineHeight: "32px",
              color: "rgba(43, 43, 43, 1)",
              letterSpacing: "0px",
              margin: 0
            }}
          >
            Curated gear for the modern nomad. From durable journal covers to the stickers that tell your story
          </p>
        </div>

        {/* 4 Rows of 3-Column Grid (1280px x 450px spec per row, justifyContent: space-between) */}
        <div style={{ gap: "32px" }} className="flex flex-col w-full max-w-[1280px] mx-auto mt-4">
          
          {/* Row 1 (1280px x 450px, justifyContent: space-between) */}
          <div 
            style={{
              width: "1280px",
              maxWidth: "100%",
              height: "450px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(255, 255, 255, 1)",
              boxSizing: "border-box"
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
                boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
                flexShrink: 0
              }}
            >
              <img src="/card-1-full.png" alt="Go Banjara Traveler Card 1" className="w-full h-full object-cover" />
            </div>

            {/* Col 2: Center Text Card (482px x 334px spec, gap: 12px) */}
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
                boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
                flexShrink: 0
              }}
            >
              <img src="/card-3-full.png" alt="Humps Down Surf's Up Card 3" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Row 2 (1280px x 450px, justifyContent: space-between) */}
          <div 
            style={{
              width: "1280px",
              maxWidth: "100%",
              height: "450px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(255, 255, 255, 1)",
              boxSizing: "border-box"
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
                boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
                flexShrink: 0
              }}
            >
              <img src="/card-2-full.png" alt="Explore Adventure Card 2" className="w-full h-full object-cover" />
            </div>

            {/* Col 2: Center Text Card (482px x 334px spec, gap: 12px) */}
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
                ABOUT GO BANJARA
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

            {/* Col 3: Card 4 (Yellow Stickers - 302px x 380px) */}
            <div 
              style={{ 
                width: "302px", 
                height: "380px", 
                borderRadius: "4px",
                overflow: "hidden",
                boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
                flexShrink: 0
              }}
            >
              <img src="/card-4-full.png" alt="Yellow Stickers Card 4" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Row 3 (1280px x 450px, justifyContent: space-between) */}
          <div 
            style={{
              width: "1280px",
              maxWidth: "100%",
              height: "450px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(255, 255, 255, 1)",
              boxSizing: "border-box"
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
                boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
                flexShrink: 0
              }}
            >
              <img src="/card-7-full.png" alt="Humps Down Surf's Up Card 7" className="w-full h-full object-cover" />
            </div>

            {/* Col 2: Center Text Card (482px x 334px spec, gap: 12px) */}
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
                ABOUT GO BANJARA
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

            {/* Col 3: Card 5 (Hikers - 302px x 380px) */}
            <div 
              style={{ 
                width: "302px", 
                height: "380px", 
                borderRadius: "4px",
                overflow: "hidden",
                boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
                flexShrink: 0
              }}
            >
              <img src="/card-5-full.png" alt="Go Banjara Traveler Card 5" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Row 4 (1280px x 450px, justifyContent: space-between) */}
          <div 
            style={{
              width: "1280px",
              maxWidth: "100%",
              height: "450px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(255, 255, 255, 1)",
              boxSizing: "border-box"
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
                boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
                flexShrink: 0
              }}
            >
              <img src="/card-8-full.png" alt="Yellow Stickers Card 8" className="w-full h-full object-cover" />
            </div>

            {/* Col 2: Center Text Card (482px x 334px spec, gap: 12px) */}
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
                ABOUT GO BANJARA
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

            {/* Col 3: Card 6 (Green Explore - 302px x 380px) */}
            <div 
              style={{ 
                width: "302px", 
                height: "380px", 
                borderRadius: "4px",
                overflow: "hidden",
                boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
                flexShrink: 0
              }}
            >
              <img src="/card-6-full.png" alt="Explore Adventure Card 6" className="w-full h-full object-cover" />
            </div>
          </div>

        </div>
      </section>

      {/* 7. BRAND PHILOSOPHY / SIX WORDS WE LIVE BY Section (1440x1168px spec) */}
      <section 
        style={{
          width: "100%",
          maxWidth: "1440px",
          minHeight: "1168px",
          paddingTop: "42px",
          paddingRight: "80px",
          paddingBottom: "42px",
          paddingLeft: "80px",
          background: "rgba(255, 255, 255, 1)",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "32px"
        }}
        className="mx-auto w-full shrink-0"
      >
        {/* Header Box (1280px x 166px spec, space-between, borderRadius 4px) */}
        <div 
          style={{ 
            width: "1280px", 
            maxWidth: "100%", 
            height: "166px", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "space-between",
            borderRadius: "4px",
            boxSizing: "border-box"
          }} 
          className="mx-auto text-center"
        >
          <span 
            style={{
              minWidth: "165px",
              height: "26px",
              paddingLeft: "12px",
              paddingRight: "12px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              background: "#FFEBE5",
              color: "#FF623E",
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
            BRAND PHILOSOPHY
          </span>

          <h2 
            style={{
              fontFamily: "Fraunces, serif",
              fontWeight: 600,
              fontSize: "42px",
              lineHeight: "42px",
              color: "rgba(43, 43, 43, 1)",
              letterSpacing: "0px",
              margin: 0
            }}
          >
            <span style={{ color: "#FF623E" }}>Six words</span> we live by.
          </h2>

          <p 
            style={{
              width: "1280px",
              maxWidth: "100%",
              fontFamily: "Faktum, sans-serif",
              fontWeight: 500,
              fontSize: "20px",
              lineHeight: "30px",
              color: "rgba(43, 43, 43, 0.75)",
              margin: 0,
              textAlign: "center"
            }}
          >
            Not a mission statement. Not a poster on the wall. Just six things we've earned the right to say after seven years on the road.
          </p>
        </div>

        {/* 6 Value Cards Grid Container (1280px x 886px spec, gap: 32px) */}
        <div 
          style={{
            width: "1280px",
            maxWidth: "100%",
            height: "886px",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
            boxSizing: "border-box"
          }}
          className="mx-auto"
        >
          {/* Row 1 (1280px x 427px spec, gap: 32px) */}
          <div 
            style={{
              width: "1280px",
              maxWidth: "100%",
              height: "427px",
              display: "flex",
              flexDirection: "row",
              gap: "32px",
              boxSizing: "border-box"
            }}
          >
            {[
              {
                title: "Explore - Never Stop Being Curious",
                body: "We believe the best version of you lives just beyond your comfort zone. Every trip is a permission slip to discover something new",
                footer: "Brand Philosophy"
              },
              {
                title: "Explore - Never Stop Being Curious",
                body: "We believe the best version of you lives just beyond your comfort zone. Every trip is a permission slip to discover something new",
                footer: "Brand Philosophy"
              },
              {
                title: "Explore - Never Stop Being Curious",
                body: "We believe the best version of you lives just beyond your comfort zone. Every trip is a permission slip to discover something new",
                footer: "Brand Philosophy"
              }
            ].map((card, idx) => (
              <div 
                key={idx}
                style={{
                  width: "405.33px",
                  maxWidth: "100%",
                  height: "427px",
                  background: "rgba(248, 248, 248, 1)",
                  borderRadius: "4px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                  textAlign: "center",
                  boxSizing: "border-box"
                }}
                className="hover:shadow-md transition-shadow duration-300"
              >
                {/* Top Stack Container (357.33px x 282px spec, gap: 24px) */}
                <div 
                  style={{
                    width: "357.33px",
                    maxWidth: "100%",
                    height: "282px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "24px",
                    boxSizing: "border-box"
                  }}
                >
                  {/* Top Icon Emblem: White square box */}
                  <div className="w-12 h-12 rounded-[8px] bg-white flex items-center justify-center border border-gray-100 shadow-2xs shrink-0">
                    <Compass className="w-6 h-6 text-[#FF623E]" />
                  </div>

                  {/* Title */}
                  <h3 
                    style={{
                      fontFamily: "Faktum, sans-serif",
                      fontWeight: 700,
                      fontSize: "20px",
                      lineHeight: "28px",
                      color: "rgba(43, 43, 43, 1)",
                      margin: 0,
                      maxWidth: "320px",
                      textAlign: "center"
                    }}
                  >
                    {card.title}
                  </h3>

                  {/* Body */}
                  <p 
                    style={{
                      width: "357.33px",
                      maxWidth: "100%",
                      height: "128px",
                      fontFamily: "Faktum, sans-serif",
                      fontWeight: 500,
                      fontSize: "20px",
                      lineHeight: "32px",
                      letterSpacing: "0px",
                      textAlign: "center",
                      color: "rgba(43, 43, 43, 0.7)",
                      margin: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {card.body}
                  </p>
                </div>

                {/* Footer (357.33px x 25px spec) */}
                <span 
                  style={{
                    width: "357.33px",
                    maxWidth: "100%",
                    height: "25px",
                    fontFamily: "Faktum, sans-serif",
                    fontWeight: 500,
                    fontSize: "20px",
                    lineHeight: "25px",
                    letterSpacing: "0px",
                    textAlign: "center",
                    color: "rgba(43, 43, 43, 0.8)",
                    display: "block"
                  }}
                >
                  {card.footer}
                </span>
              </div>
            ))}
          </div>

          {/* Row 2 (1280px x 427px spec, gap: 32px) */}
          <div 
            style={{
              width: "1280px",
              maxWidth: "100%",
              height: "427px",
              display: "flex",
              flexDirection: "row",
              gap: "32px",
              boxSizing: "border-box"
            }}
          >
            {[
              {
                title: "Explore - Never Stop Being Curious",
                body: "We believe the best version of you lives just beyond your comfort zone. Every trip is a permission slip to discover something new",
                footer: "Brand Philosophy"
              },
              {
                title: "Explore - Never Stop Being Curious",
                body: "We believe the best version of you lives just beyond your comfort zone. Every trip is a permission slip to discover something new",
                footer: "Brand Philosophy"
              },
              {
                title: "Explore - Never Stop Being Curious",
                body: "We believe the best version of you lives just beyond your comfort zone. Every trip is a permission slip to discover something new",
                footer: "Brand Philosophy"
              }
            ].map((card, idx) => (
              <div 
                key={idx}
                style={{
                  width: "405.33px",
                  maxWidth: "100%",
                  height: "427px",
                  background: "rgba(248, 248, 248, 1)",
                  borderRadius: "4px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                  textAlign: "center",
                  boxSizing: "border-box"
                }}
                className="hover:shadow-md transition-shadow duration-300"
              >
                {/* Top Stack Container (357.33px x 282px spec, gap: 24px) */}
                <div 
                  style={{
                    width: "357.33px",
                    maxWidth: "100%",
                    height: "282px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "24px",
                    boxSizing: "border-box"
                  }}
                >
                  {/* Top Icon Emblem: White square box */}
                  <div className="w-12 h-12 rounded-[8px] bg-white flex items-center justify-center border border-gray-100 shadow-2xs shrink-0">
                    <Compass className="w-6 h-6 text-[#FF623E]" />
                  </div>

                  {/* Title */}
                  <h3 
                    style={{
                      fontFamily: "Faktum, sans-serif",
                      fontWeight: 700,
                      fontSize: "20px",
                      lineHeight: "28px",
                      color: "rgba(43, 43, 43, 1)",
                      margin: 0,
                      maxWidth: "320px",
                      textAlign: "center"
                    }}
                  >
                    {card.title}
                  </h3>

                  {/* Body */}
                  <p 
                    style={{
                      width: "357.33px",
                      maxWidth: "100%",
                      height: "128px",
                      fontFamily: "Faktum, sans-serif",
                      fontWeight: 500,
                      fontSize: "20px",
                      lineHeight: "32px",
                      letterSpacing: "0px",
                      textAlign: "center",
                      color: "rgba(43, 43, 43, 0.7)",
                      margin: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {card.body}
                  </p>
                </div>

                {/* Footer (357.33px x 25px spec) */}
                <span 
                  style={{
                    width: "357.33px",
                    maxWidth: "100%",
                    height: "25px",
                    fontFamily: "Faktum, sans-serif",
                    fontWeight: 500,
                    fontSize: "20px",
                    lineHeight: "25px",
                    letterSpacing: "0px",
                    textAlign: "center",
                    color: "rgba(43, 43, 43, 0.8)",
                    display: "block"
                  }}
                >
                  {card.footer}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Customer Reviews / Captured Memories Section */}
      <section className="w-full bg-[#FFFFFF] py-[62px] px-6 md:px-[80px] mx-auto max-w-[1440px] shrink-0">
        <div className="w-full max-w-[1280px] mx-auto flex flex-col gap-10 text-left">
          {/* Header Box (1440px x 134px spec, space-between, padding 0 80px) */}
          <div 
            style={{
              width: "1440px",
              maxWidth: "100%",
              height: "134px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              borderRadius: "4px",
              background: "rgba(255, 255, 255, 1)",
              boxSizing: "border-box"
            }}
            className="text-left"
          >
            <span 
              style={{
                width: "165px",
                height: "26px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                background: "#FFEBE5",
                color: "#FF623E",
                fontFamily: "Faktum, sans-serif",
                fontWeight: 600,
                fontSize: "14px",
                lineHeight: "14px",
                letterSpacing: "1.2px",
                borderRadius: "4px",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                alignSelf: "flex-start"
              }}
            >
              CAPTURED MEMORIES
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
              Capture your adventurous travel <span style={{ color: "#FF623E" }}>Forever</span>
            </h2>

            <p 
              style={{
                fontFamily: "Faktum, sans-serif",
                fontWeight: 500,
                fontSize: "20px",
                lineHeight: "30px",
                color: "rgba(43, 43, 43, 0.75)",
                margin: 0
              }}
            >
              Curated journeys for the modern nomad, designed to push boundaries and discover India's hidden heart
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                id: 1,
                name: "Kiran Makwan",
                subtitle: "Verified Wanderer",
                text: "The quality of the journal is incredible. It feels like a piece of art that I can actually take on my treks. Bonjo's personality shines through the brand!",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
              },
              {
                id: 2,
                name: "Kiran Makwan",
                subtitle: "Verified Wanderer",
                text: "The quality of the journal is incredible. It feels like a piece of art that I can actually take on my treks. Bonjo's personality shines through the brand!",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop"
              },
              {
                id: 3,
                name: "Kiran Makwan",
                subtitle: "Verified Wanderer",
                text: "The quality of the journal is incredible. It feels like a piece of art that I can actually take on my treks. Bonjo's personality shines through the brand!",
                avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=256&auto=format&fit=crop"
              },
              {
                id: 4,
                name: "Kiran Makwan",
                subtitle: "Verified Wanderer",
                text: "The quality of the journal is incredible. It feels like a piece of art that I can actually take on my treks. Bonjo's personality shines through the brand!",
                avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=256&auto=format&fit=crop"
              },
              {
                id: 5,
                name: "Kiran Makwan",
                subtitle: "Verified Wanderer",
                text: "The quality of the journal is incredible. It feels like a piece of art that I can actually take on my treks. Bonjo's personality shines through the brand!",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop"
              },
              {
                id: 6,
                name: "Kiran Makwan",
                subtitle: "Verified Wanderer",
                text: "The quality of the journal is incredible. It feels like a piece of art that I can actually take on my treks. Bonjo's personality shines through the brand!",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
              }
            ].map((review) => (
              <div 
                key={review.id} 
                className="bg-white border border-gray-200 p-8 rounded-[8px] flex flex-col justify-between space-y-6 shadow-2xs hover:shadow-md transition-shadow"
              >
                <div className="space-y-4">
                  <div className="flex text-amber-400 text-base gap-1">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 font-medium italic text-[16px] leading-relaxed">
                    “{review.text}”
                  </p>
                </div>
                <div className="flex items-center gap-3.5 pt-4 border-t border-gray-100">
                  <img src={review.avatar} alt={review.name} className="w-11 h-11 rounded-full object-cover shrink-0" />
                  <div>
                    <h4 className="text-[16px] font-bold text-gray-800 leading-none">{review.name}</h4>
                    <p className="text-xs text-gray-400 font-medium mt-1">{review.subtitle}</p>
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
