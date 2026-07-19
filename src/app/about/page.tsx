'use client';

import React from 'react';
import Link from 'next/link';
import { TrustBanner } from '@/components/TrustBanner';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F3FFEF] font-sans text-[#2B2B2B]">
      
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
        className="mx-auto px-6 md:px-[80px] border-b border-gray-100"
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
            color: "rgba(43, 43, 43, 0.8)", 
            textAlign: "center",
            margin: 0
          }} 
          className="text-sm sm:text-base md:text-[20px] leading-relaxed md:leading-[28px] w-full max-w-[950px]"
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
          background: "#F3FFEF",
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
          minHeight: "145px",
          background: "rgba(255, 255, 255, 1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
          paddingTop: "24px",
          paddingBottom: "24px",
        }}
        className="mx-auto px-6 md:px-[80px] w-full border-t border-b border-gray-100"
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
          <div className="flex flex-col items-center text-center gap-1.5 flex-1 min-w-[120px]">
            <span style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: "36px", lineHeight: "100%", color: "#2B2B2B" }}>
              10+
            </span>
            <span style={{ fontFamily: "Faktum, sans-serif", fontWeight: 500, fontSize: "16px", lineHeight: "100%", color: "rgba(43, 43, 43, 0.8)" }}>
              Travel Packages
            </span>
          </div>

          <div className="w-[1px] h-[55px] bg-[#2B2B2B]/10 shrink-0 hidden md:block" />

          {/* Stat 2 */}
          <div className="flex flex-col items-center text-center gap-1.5 flex-1 min-w-[120px]">
            <span style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: "36px", lineHeight: "100%", color: "#2B2B2B" }}>
              15k+
            </span>
            <span style={{ fontFamily: "Faktum, sans-serif", fontWeight: 500, fontSize: "16px", lineHeight: "100%", color: "rgba(43, 43, 43, 0.8)" }}>
              Nomads Joined
            </span>
          </div>

          <div className="w-[1px] h-[55px] bg-[#2B2B2B]/10 shrink-0 hidden md:block" />

          {/* Stat 3 */}
          <div className="flex flex-col items-center text-center gap-1.5 flex-1 min-w-[120px]">
            <span style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: "36px", lineHeight: "100%", color: "#2B2B2B" }}>
              24/7
            </span>
            <span style={{ fontFamily: "Faktum, sans-serif", fontWeight: 500, fontSize: "16px", lineHeight: "100%", color: "rgba(43, 43, 43, 0.8)" }}>
              On-road Support
            </span>
          </div>

          <div className="w-[1px] h-[55px] bg-[#2B2B2B]/10 shrink-0 hidden md:block" />

          {/* Stat 4 */}
          <div className="flex flex-col items-center text-center gap-1.5 flex-1 min-w-[120px]">
            <span style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: "36px", lineHeight: "100%", color: "#2B2B2B" }}>
              7+
            </span>
            <span style={{ fontFamily: "Faktum, sans-serif", fontWeight: 500, fontSize: "16px", lineHeight: "100%", color: "rgba(43, 43, 43, 0.8)" }}>
              Shop Products
            </span>
          </div>

          <div className="w-[1px] h-[55px] bg-[#2B2B2B]/10 shrink-0 hidden md:block" />

          {/* Stat 5 */}
          <div className="flex flex-col items-center text-center gap-1.5 flex-1 min-w-[120px]">
            <span style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: "36px", lineHeight: "100%", color: "#2B2B2B" }}>
              4.5+
            </span>
            <span style={{ fontFamily: "Faktum, sans-serif", fontWeight: 500, fontSize: "16px", lineHeight: "100%", color: "rgba(43, 43, 43, 0.8)" }}>
              Average trip rating
            </span>
          </div>
        </div>
      </section>

      {/* 4. Overlapping Sticker Cards Strip (1440x556px spec) */}
      <section 
        style={{ 
          width: "100%", 
          height: "556px", 
          background: "#FFFFFF", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          position: "relative", 
          overflow: "hidden",
          boxSizing: "border-box"
        }}
        className="w-full"
      >
        <div 
          style={{ 
            width: "100%",
            maxWidth: "1709.57px", 
            height: "418.33px", 
            display: "flex", 
            alignItems: "center", 
            overflowX: "auto",
            scrollbarWidth: "none",
            boxSizing: "border-box",
            paddingLeft: "135px",
            paddingRight: "135px"
          }}
          className="scrollbar-none"
        >
          {/* Card 1: Traveler (tilted left) */}
          <div 
            style={{ 
              width: "300px", 
              height: "418.33px", 
              borderRadius: "24px", 
              backgroundImage: "url('https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=600&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
              transform: "rotate(-3deg)",
              zIndex: 10,
              flexShrink: 0
            }}
          >
            <div style={{ position: "absolute", bottom: "24px", left: "24px" }}>
              <span style={{ fontFamily: "Faktum, sans-serif", fontWeight: 800, fontSize: "28px", color: "#FFFF80", letterSpacing: "-0.5px" }}>
                go banjara
              </span>
            </div>
          </div>

          {/* Card 2: Green Card (tilted right) */}
          <div 
            style={{ 
              width: "300px", 
              height: "418.33px", 
              borderRadius: "24px", 
              background: "#1D493E",
              position: "relative",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
              transform: "rotate(4deg)",
              zIndex: 11,
              marginLeft: "-40px",
              flexShrink: 0,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "32px",
              boxSizing: "border-box"
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", fontSize: "36px", color: "#F3FFEF", opacity: 0.9 }}>
                explore
              </span>
            </div>
            
            <svg 
              viewBox="0 0 100 100" 
              style={{ 
                position: "absolute", 
                top: "40%", 
                left: "10%", 
                width: "80%", 
                height: "40%", 
                color: "#FF623E" 
              }}
            >
              <path d="M10,80 Q50,0 90,80" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            </svg>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", zIndex: 2 }}>
              <span style={{ fontFamily: "Fraunces, serif", fontWeight: 700, fontSize: "40px", color: "#F3FFEF" }}>
                wild
              </span>
              <span style={{ fontFamily: "Faktum, sans-serif", fontSize: "20px", color: "#F3FFEF", opacity: 0.3 }}>
                journey
              </span>
            </div>
          </div>

          {/* Card 3: Cream Card (tilted left) */}
          <div 
            style={{ 
              width: "300px", 
              height: "418.33px", 
              borderRadius: "24px", 
              background: "#FAF9F6",
              position: "relative",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
              transform: "rotate(-2deg)",
              zIndex: 12,
              marginLeft: "-40px",
              flexShrink: 0,
              padding: "32px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <h3 style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: "32px", lineHeight: "110%", color: "#1D493E", margin: 0 }}>
                Humps do<br />surfs up!
              </h3>
            </div>

            <div 
              style={{ 
                alignSelf: "center",
                width: "120px", 
                height: "120px", 
                borderRadius: "50%", 
                background: "#FF623E", 
                border: "3px dashed #FFFF80",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                transform: "rotate(5deg)"
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#FFFF80" strokeWidth="2" style={{ width: "60px", height: "60px" }}>
                <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4 4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z" />
                <path d="M18 8h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2" />
                <path d="M6 8H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2" />
                <path d="M12 12v6m0 0H9m3 0h3" />
              </svg>
            </div>

            <div>
              <span style={{ fontFamily: "Faktum, sans-serif", fontWeight: 600, fontSize: "14px", color: "#FF623E", letterSpacing: "1px" }}>
                BONJO ADVENTURES
              </span>
            </div>
          </div>

          {/* Card 4: Yellow Card (tilted right) */}
          <div 
            style={{ 
              width: "300px", 
              height: "418.33px", 
              borderRadius: "24px", 
              background: "#FFFF80",
              position: "relative",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
              transform: "rotate(3deg)",
              zIndex: 13,
              marginLeft: "-40px",
              flexShrink: 0,
              padding: "32px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              overflow: "hidden"
            }}
          >
            <div 
              style={{ 
                alignSelf: "center",
                width: "140px", 
                height: "140px", 
                borderRadius: "50%", 
                background: "#FF623E", 
                display: "flex", 
                flexDirection: "column",
                alignItems: "center", 
                justifyContent: "center",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                padding: "10px",
                boxSizing: "border-box",
                color: "#FFFF80",
                transform: "rotate(-5deg)",
                marginTop: "20px"
              }}
            >
              <span style={{ fontSize: "9px", fontWeight: 700, fontFamily: "Faktum, sans-serif", textAlign: "center", lineHeight: "110%" }}>
                LIVE LIFE
              </span>
              <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "#FFFF80", margin: "4px 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src="/logo.png" alt="Mascot" style={{ width: "35px", height: "auto" }} />
              </div>
              <span style={{ fontSize: "9px", fontWeight: 700, fontFamily: "Faktum, sans-serif", textAlign: "center", lineHeight: "110%" }}>
                GO BANJARA!
              </span>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "auto", position: "relative" }}>
              <div 
                style={{ 
                  background: "#80E7ED", 
                  color: "#1D493E", 
                  fontFamily: "Faktum, sans-serif", 
                  fontWeight: 700, 
                  fontSize: "12px", 
                  padding: "6px 12px", 
                  borderRadius: "4px",
                  transform: "rotate(-10deg) translateY(5px)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.08)"
                }}
              >
                EXPLORE
              </div>
              <div 
                style={{ 
                  background: "#AE99FF", 
                  color: "#1D493E", 
                  fontFamily: "Fraunces, serif", 
                  fontWeight: 700, 
                  fontSize: "14px", 
                  padding: "6px 12px", 
                  borderRadius: "4px",
                  transform: "rotate(5deg) translateY(-5px)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.08)"
                }}
              >
                GOA
              </div>
            </div>
          </div>

          {/* Card 5: Traveler (tilted left) */}
          <div 
            style={{ 
              width: "300px", 
              height: "418.33px", 
              borderRadius: "24px", 
              backgroundImage: "url('https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=600&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
              transform: "rotate(-4deg)",
              zIndex: 14,
              marginLeft: "-40px",
              flexShrink: 0
            }}
          >
            <div style={{ position: "absolute", bottom: "24px", left: "24px" }}>
              <span style={{ fontFamily: "Faktum, sans-serif", fontWeight: 800, fontSize: "28px", color: "#FFFF80", letterSpacing: "-0.5px" }}>
                go banjara
              </span>
            </div>
          </div>

          {/* Card 6: Green Card (tilted right) */}
          <div 
            style={{ 
              width: "300px", 
              height: "418.33px", 
              borderRadius: "24px", 
              background: "#1D493E",
              position: "relative",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
              transform: "rotate(2deg)",
              zIndex: 15,
              marginLeft: "-40px",
              flexShrink: 0,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "32px",
              boxSizing: "border-box"
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", fontSize: "36px", color: "#F3FFEF", opacity: 0.9 }}>
                explore
              </span>
            </div>
            
            <svg 
              viewBox="0 0 100 100" 
              style={{ 
                position: "absolute", 
                top: "40%", 
                left: "10%", 
                width: "80%", 
                height: "40%", 
                color: "#FF623E" 
              }}
            >
              <path d="M10,80 Q50,0 90,80" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            </svg>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", zIndex: 2 }}>
              <span style={{ fontFamily: "Fraunces, serif", fontWeight: 700, fontSize: "40px", color: "#F3FFEF" }}>
                wild
              </span>
              <span style={{ fontFamily: "Faktum, sans-serif", fontSize: "20px", color: "#F3FFEF", opacity: 0.3 }}>
                journey
              </span>
            </div>
          </div>

          {/* Card 7: Cream Card (tilted left) */}
          <div 
            style={{ 
              width: "300px", 
              height: "418.33px", 
              borderRadius: "24px", 
              background: "#FAF9F6",
              position: "relative",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
              transform: "rotate(-3deg)",
              zIndex: 16,
              marginLeft: "-40px",
              flexShrink: 0,
              padding: "32px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <h3 style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: "32px", lineHeight: "110%", color: "#1D493E", margin: 0 }}>
                Humps do<br />surfs up!
              </h3>
            </div>

            <div 
              style={{ 
                alignSelf: "center",
                width: "120px", 
                height: "120px", 
                borderRadius: "50%", 
                background: "#FF623E", 
                border: "3px dashed #FFFF80",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                transform: "rotate(5deg)"
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#FFFF80" strokeWidth="2" style={{ width: "60px", height: "60px" }}>
                <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4 4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z" />
                <path d="M18 8h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2" />
                <path d="M6 8H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2" />
                <path d="M12 12v6m0 0H9m3 0h3" />
              </svg>
            </div>

            <div>
              <span style={{ fontFamily: "Faktum, sans-serif", fontWeight: 600, fontSize: "14px", color: "#FF623E", letterSpacing: "1px" }}>
                BONJO ADVENTURES
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Trust Banner */}
      <TrustBanner />
    </div>
  );
}
