import React from 'react';

const TRUST_ITEMS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] text-[#1D493E]">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    label: "Check your order status"
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] text-[#1D493E]">
        <path d="M3 7v6h6" />
        <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
      </svg>
    ),
    label: "30 Days Free Returns"
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] text-[#1D493E]">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    label: "Free Delivery"
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] text-[#1D493E]">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    label: "Secure Payments"
  }
];

export function TrustBanner() {
  const marqueeItems = [...TRUST_ITEMS, ...TRUST_ITEMS, ...TRUST_ITEMS, ...TRUST_ITEMS];

  return (
    <div 
      className="w-full relative z-10 overflow-hidden bg-[#FFFF80] border-y border-[#1D493E]/15 h-[56px] sm:h-[78px] flex items-center mt-8 sm:mt-12 md:mt-16 mb-4 md:mb-8"
    >
      {/* Edge Vignette Masks */}
      <div 
        className="absolute inset-y-0 left-0 w-[40px] sm:w-[80px] pointer-events-none z-20"
        style={{ background: 'linear-gradient(90deg, #FFFF80 0%, rgba(255,255,128,0) 100%)' }}
      />
      <div 
        className="absolute inset-y-0 right-0 w-[40px] sm:w-[80px] pointer-events-none z-20"
        style={{ background: 'linear-gradient(270deg, #FFFF80 0%, rgba(255,255,128,0) 100%)' }}
      />

      {/* Infinite Marquee Ticker Track */}
      <div className="flex gap-8 sm:gap-16 w-max animate-marquee hover:[animation-play-state:paused] items-center">
        {marqueeItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2.5 shrink-0 select-none">
            {item.icon}
            <span className="font-serif font-semibold text-xs sm:text-[16px] tracking-[0.5px] text-[#1D493E] uppercase whitespace-nowrap">
              {item.label}
            </span>
            <span className="text-[#1D493E]/40 font-bold ml-4 sm:ml-8">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
