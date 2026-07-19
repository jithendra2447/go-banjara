import React from 'react';

export function TrustBanner() {
  return (
    <div 
      style={{ 
        width: "100%", 
        height: "78px", 
        background: "rgba(255, 255, 128, 1)", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        borderTop: "1px solid rgba(29, 73, 62, 0.15)",
        borderBottom: "1px solid rgba(29, 73, 62, 0.15)",
        boxSizing: "border-box",
        padding: "24px"
      }}
      className="w-full relative z-10 overflow-x-auto scrollbar-none"
    >
      <div 
        style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          gap: "34px",
          width: "100%",
          maxWidth: "1280px"
        }}
        className="whitespace-nowrap flex-wrap md:flex-nowrap justify-between md:justify-center px-4"
      >
        {/* Item 1: Order Status */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }} className="mx-auto md:mx-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "18px", height: "18px", color: "#1D493E" }}>
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
          <span style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: "16px", letterSpacing: "0.5px", color: "#1D493E", textTransform: "uppercase" }}>
            Check your order status
          </span>
        </div>

        {/* Item 2: Free Returns */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }} className="mx-auto md:mx-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "18px", height: "18px", color: "#1D493E" }}>
            <path d="M3 7v6h6" />
            <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
          </svg>
          <span style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: "16px", letterSpacing: "0.5px", color: "#1D493E", textTransform: "uppercase" }}>
            30 Days Free Returns
          </span>
        </div>

        {/* Item 3: Free Delivery */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }} className="mx-auto md:mx-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "18px", height: "18px", color: "#1D493E" }}>
            <rect x="1" y="3" width="15" height="13" />
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          <span style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: "16px", letterSpacing: "0.5px", color: "#1D493E", textTransform: "uppercase" }}>
            Free Delivery
          </span>
        </div>

        {/* Item 4: Secure Payments */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }} className="mx-auto md:mx-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "18px", height: "18px", color: "#1D493E" }}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: "16px", letterSpacing: "0.5px", color: "#1D493E", textTransform: "uppercase" }}>
            Secure Payments
          </span>
        </div>
      </div>
    </div>
  );
}
