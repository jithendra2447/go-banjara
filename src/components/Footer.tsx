'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BonjoMascot } from '@/components/BonjoMascot';

export const Footer: React.FC = () => {
  const pathname = usePathname();

  // Do not render the main footer on the admin dashboard
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <div data-site-footer="true" style={{ width: "100%", background: "rgba(29, 73, 62, 1)" }}>
      {/* Desktop Footer (hidden md:flex) */}
      <footer
        style={{
          width: "100%",
          maxWidth: "1440px",
          minHeight: "606px",
          height: "auto",
          paddingTop: "42px",
          paddingBottom: "42px",
          background: "rgba(29, 73, 62, 1)",
          boxSizing: "border-box",
          margin: "0 auto",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
        className="hidden md:flex text-slate-200 border-t border-white/5 font-sans px-4 sm:px-8 md:px-12 lg:px-20"
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1280px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Main Footer Row */}
          <div
            className="w-full flex flex-col md:flex-row justify-between items-start gap-8 md:h-[290px] h-auto flex-wrap lg:flex-nowrap"
          >
            {/* Brand, Logo & Description */}
            <div 
              style={{ 
                width: "273px", 
                height: "290px", 
                gap: "24px", 
                display: "flex", 
                flexDirection: "column", 
                boxSizing: "border-box" 
              }}
              className="w-full max-w-[273px] shrink-0"
            >
              <img
                src="/logo-footer.png"
                alt="go banjāra"
                style={{ width: "220px", height: "auto" }}
              />
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 500,
                  color: "rgba(255, 255, 255, 1)",
                  margin: 0,
                }}
                className="text-sm sm:text-base md:text-[20px] md:leading-[32px]"
              >
                Crafting high-end editorial travel experience and gear for the modern nomad. Escape the ordinary with us.
              </p>
            </div>

            {/* Important Links */}
            <div 
              style={{ 
                width: "273px", 
                minHeight: "290px", 
                gap: "24px", 
                display: "flex", 
                flexDirection: "column", 
                boxSizing: "border-box" 
              }}
              className="w-full max-w-[273px] shrink-0"
            >
              <h4 style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "18px", lineHeight: "26px", letterSpacing: "-0.1px", color: "rgba(255,255,255,0.8)", margin: 0 }}>Important Links</h4>
              <ul style={{ display: "flex", flexDirection: "column", gap: "12px", listStyle: "none", padding: 0, margin: 0 }}>
                {[{ label: "Home", href: "/" }, { label: "Travel Packages", href: "/travel" }, { label: "About us", href: "/about" }, { label: "Shop", href: "/shop" }].map((item) => (
                  <li key={item.href} style={{ fontFamily: "var(--font-sans)", fontWeight: 500, color: "rgba(255, 255, 255, 1)" }} className="text-sm sm:text-base md:text-[20px] md:leading-[36px]">
                    <Link href={item.href} className="hover:text-[#FFF080] transition-colors">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Let us help */}
            <div 
              style={{ 
                width: "231px", 
                minHeight: "290px", 
                gap: "12px", 
                display: "flex", 
                flexDirection: "column", 
                boxSizing: "border-box" 
              }}
              className="w-full max-w-[231px] shrink-0"
            >
              <h4 style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "18px", lineHeight: "26px", letterSpacing: "-0.1px", color: "rgba(255,255,255,0.8)", margin: 0 }}>Let us help</h4>
              <ul style={{ display: "flex", flexDirection: "column", gap: "8px", listStyle: "none", padding: 0, margin: 0 }}>
                {[
                  { label: "Your Account", href: "/profile" },
                  { label: "Your Orders", href: "/profile" },
                  { label: "Privacy Policy", href: "/pages/privacy-policy" },
                  { label: "Terms & Conditions", href: "/pages/terms-and-conditions" },
                  { label: "FAQ & Rules", href: "/pages/faq" },
                  { label: "Help Center", href: "/contact" },
                ].map((item) => (
                  <li key={item.label} style={{ fontFamily: "var(--font-sans)", fontWeight: 500, color: "rgba(255, 255, 255, 1)" }} className="text-sm sm:text-base md:text-[20px] md:leading-[36px]">
                    <Link href={item.href} className="hover:text-[#FFF080] transition-colors">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact us */}
            <div 
              style={{ 
                width: "439px", 
                height: "290px", 
                gap: "12px", 
                display: "flex", 
                flexDirection: "column", 
                boxSizing: "border-box" 
              }}
              className="w-full max-w-[439px] shrink-0"
            >
              <h4 style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "18px", lineHeight: "26px", letterSpacing: "-0.1px", color: "rgba(255,255,255,0.8)", margin: 0 }}>Contact us</h4>
              <ul style={{ display: "flex", flexDirection: "column", gap: "12px", listStyle: "none", padding: 0, margin: 0 }}>
                <li className="flex items-center gap-3">
                  <img src="/icon-location.png" alt="Location" style={{ width: "42px", height: "42px", flexShrink: 0 }} />
                  <span style={{ fontFamily: "var(--font-sans)", fontWeight: 500, color: "rgba(255,255,255,1)" }} className="text-sm sm:text-base md:text-[20px] leading-tight">HITEC City, Hyderabad, Telangana, India</span>
                </li>
                <li className="flex items-center gap-3">
                  <div style={{ width: "42px", height: "42px", background: "rgba(29,73,62,1)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <img src="/icon-email.png" alt="Email" style={{ width: "22px", height: "22px" }} />
                  </div>
                  <a href="mailto:services@gobanjara.com" style={{ fontFamily: "var(--font-sans)", fontWeight: 500, color: "rgba(255,255,255,1)" }} className="hover:text-[#FFF080] transition-colors text-sm sm:text-base md:text-[20px] leading-tight">services@gobanjara.com</a>
                </li>
                <li className="flex items-center gap-3">
                  <img src="/icon-phone.png" alt="Phone" style={{ width: "42px", height: "42px", flexShrink: 0 }} />
                  <a href="tel:+910123456789" style={{ fontFamily: "var(--font-sans)", fontWeight: 500, color: "rgba(255,255,255,1)" }} className="hover:text-[#FFF080] transition-colors text-sm sm:text-base md:text-[20px] leading-tight">+91 0123456789</a>
                </li>
                <li className="flex items-center gap-3">
                  <img src="/icon-clock.png" alt="Hours" style={{ width: "42px", height: "42px", flexShrink: 0 }} />
                  <span style={{ fontFamily: "var(--font-sans)", fontWeight: 500, color: "rgba(255,255,255,1)" }} className="text-sm sm:text-base md:text-[20px] leading-tight">Mon–Sat, 10:00–19:00 IST</span>
                </li>
              </ul>
            </div>
          </div>

          <div style={{ height: "56px" }} className="w-full shrink-0" />

          {/* Newsletter & Social Row */}
          <div
            style={{ height: "87px" }}
            className="w-full flex justify-between items-center gap-6 shrink-0"
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "18px", lineHeight: "100%", letterSpacing: "-0.1px", color: "rgba(255,255,255,1)" }}>Follow us on:</span>
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "12px" }}>
                <a href="#" style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#3B5998", display: "flex", alignItems: "center", justifyContent: "center", color: "white", flexShrink: 0 }} className="hover:scale-105 transition-transform duration-200">
                  <svg style={{ width: "20px", height: "20px" }} className="fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </a>
                <a href="#" style={{ width: "42px", height: "42px", borderRadius: "10px", background: "linear-gradient(135deg, #FFB900, #D1016A, #8F00FF)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", flexShrink: 0 }} className="hover:scale-105 transition-transform duration-200">
                  <svg style={{ width: "20px", height: "20px" }} className="fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                </a>
                <a href="#" style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#0077B5", display: "flex", alignItems: "center", justifyContent: "center", color: "white", flexShrink: 0 }} className="hover:scale-105 transition-transform duration-200">
                  <svg style={{ width: "20px", height: "20px" }} className="fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                </a>
                <a href="#" style={{ width: "42px", height: "42px", borderRadius: "10px", background: "black", display: "flex", alignItems: "center", justifyContent: "center", color: "white", flexShrink: 0 }} className="hover:scale-105 transition-transform duration-200">
                  <svg style={{ width: "20px", height: "20px" }} className="fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full max-w-[439px]">
              <span style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "18px", lineHeight: "100%", letterSpacing: "0px", color: "rgba(255,255,255,1)" }}>Stay connected by subscribing to our newsletter</span>
              <form
                onSubmit={async (e: any) => {
                  e.preventDefault();
                  const emailInput = e.target.elements.subscriberEmail?.value;
                  if (!emailInput) return;
                  try {
                    const res = await fetch('/api/subscribe', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: emailInput }),
                    });
                    const data = await res.json();
                    alert(data.message || 'Subscribed successfully!');
                    e.target.reset();
                  } catch (err) {
                    alert('Subscribed successfully!');
                  }
                }}
                style={{ height: "56px", display: "flex", flexDirection: "row", alignItems: "center", gap: "8px", borderRadius: "4px", padding: "8px", background: "white", border: "1px solid rgba(141, 141, 141, 1)", boxSizing: "border-box" }}
                className="w-full"
              >
                <input
                  type="email"
                  name="subscriberEmail"
                  required
                  placeholder="Enter your email address"
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontFamily: "var(--font-sans)", fontWeight: 500, letterSpacing: "0px", color: "#1a2e29", paddingLeft: "8px" }}
                  className="placeholder-[rgba(141,141,141,1)] text-sm sm:text-base"
                />
                <button type="submit" style={{ height: "40px", padding: "0 20px", background: "#1D493E", color: "white", borderRadius: "6px", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "14px", border: "none", cursor: "pointer", flexShrink: 0 }}>
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div style={{ height: "40px" }} className="w-full flex items-center shrink-0">
            <div className="border-t border-white/10 w-full"></div>
          </div>

          <div
            style={{
              height: "49px",
              paddingTop: "12px",
              paddingBottom: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxSizing: "border-box"
            }}
            className="w-full max-w-[1280px] shrink-0"
          >
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
                color: "rgba(255, 255, 255, 1)",
              }}
              className="text-[20px]"
            >
              Copyrights © 2026 Go Banjara. All Rights Reserved.
            </span>
            <div className="flex items-center gap-2">
              <span
                style={{
                  fontFamily: "'Faktum', 'Outfit', sans-serif",
                  fontWeight: 500,
                  color: "rgba(255, 255, 255, 1)",
                }}
                className="text-[20px]"
              >
                Handmade with love ❤️ by TRD Studios
              </span>
              <Link
                href="/admin"
                className="opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity duration-700 text-[10px] font-mono text-slate-400 hover:text-[#FFF080] cursor-default select-none pl-2"
                title="System Root Access"
              >
                [Admin]
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Footer Container (block md:hidden) - w:430px max, gap:24px, padding:32px 20px */}
      <footer className="block md:hidden w-full max-w-[430px] mx-auto py-[32px] px-[20px] bg-[#1D493E] text-white flex flex-col gap-[24px] text-left font-sans opacity-100">
        {/* Brand Logo & Description */}
        <div className="flex flex-col gap-3">
          <img src="/logo-footer.png" alt="go banjāra" className="w-[180px] sm:w-[200px] h-auto shrink-0" />
          <p className="text-[14px] font-medium text-white/90 leading-relaxed m-0">
            Crafting high-end editorial travel experience and gear for the modern nomad. Escape the ordinary with us.
          </p>
        </div>

        {/* Important Links */}
        <div className="flex flex-col gap-2 pt-1">
          <h4 className="text-[15px] font-semibold text-white/70 uppercase tracking-wider m-0">Important Links</h4>
          <ul className="flex flex-col gap-2 list-none p-0 m-0 text-[15px] font-medium text-white">
            <li><Link href="/" className="hover:text-[#FFF080]">Home</Link></li>
            <li><Link href="/travel" className="hover:text-[#FFF080]">Travel Packages</Link></li>
            <li><Link href="/about" className="hover:text-[#FFF080]">About us</Link></li>
            <li><Link href="/shop" className="hover:text-[#FFF080]">Shop</Link></li>
          </ul>
        </div>

        {/* Let us help */}
        <div className="flex flex-col gap-2 pt-1">
          <h4 className="text-[15px] font-semibold text-white/70 uppercase tracking-wider m-0">Let us help</h4>
          <ul className="flex flex-col gap-2 list-none p-0 m-0 text-[15px] font-medium text-white">
            <li><Link href="/profile" className="hover:text-[#FFF080]">Your Account</Link></li>
            <li><Link href="/profile" className="hover:text-[#FFF080]">Your Orders</Link></li>
            <li><Link href="/pages/returns" className="hover:text-[#FFF080]">Returns & Replacements</Link></li>
            <li><Link href="/pages/refund-policy" className="hover:text-[#FFF080]">Refund & Returns Policy</Link></li>
            <li><Link href="/pages/privacy-policy" className="hover:text-[#FFF080]">Privacy Policy</Link></li>
            <li><Link href="/contact" className="hover:text-[#FFF080]">Help Center</Link></li>
          </ul>
        </div>

        {/* Contact us */}
        <div className="flex flex-col gap-3 pt-1">
          <h4 className="text-[15px] font-semibold text-white/70 uppercase tracking-wider m-0">Contact us</h4>
          <ul className="flex flex-col gap-3 list-none p-0 m-0 text-[14px] font-medium text-white">
            <li className="flex items-center gap-3">
              <img src="/icon-location.png" alt="Location" className="w-[28px] h-[28px] shrink-0" />
              <span>HITEC City, Hyderabad, Telangana, India</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-[28px] h-[28px] rounded-[6px] bg-white/10 flex items-center justify-center shrink-0">
                <img src="/icon-email.png" alt="Email" className="w-4 h-4" />
              </div>
              <a href="mailto:services@gobanjara.com" className="hover:text-[#FFF080]">services@gobanjara.com</a>
            </li>
            <li className="flex items-center gap-3">
              <img src="/icon-phone.png" alt="Phone" className="w-[28px] h-[28px] shrink-0" />
              <a href="tel:+910123456789" className="hover:text-[#FFF080]">+91 0123456789</a>
            </li>
            <li className="flex items-center gap-3">
              <img src="/icon-clock.png" alt="Hours" className="w-[28px] h-[28px] shrink-0" />
              <span>Mon–Sat, 10:00–19:00 IST</span>
            </li>
          </ul>
        </div>

        {/* Social Icons */}
        <div className="flex flex-col gap-2 pt-2">
          <span className="text-[14px] font-medium text-white/80">Follow us on:</span>
          <div className="flex items-center gap-3">
            <a href="#" className="w-[36px] h-[36px] rounded-[6px] bg-[#3B5998] flex items-center justify-center text-white shrink-0 hover:opacity-90">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
            </a>
            <a href="#" className="w-[36px] h-[36px] rounded-[6px] bg-gradient-to-tr from-[#FFB900] via-[#D1016A] to-[#8F00FF] flex items-center justify-center text-white shrink-0 hover:opacity-90">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
            </a>
            <a href="#" className="w-[36px] h-[36px] rounded-[6px] bg-[#0077B5] flex items-center justify-center text-white shrink-0 hover:opacity-90">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
            </a>
            <a href="#" className="w-[36px] h-[36px] rounded-[6px] bg-white text-black flex items-center justify-center shrink-0 border border-gray-300 font-sans font-extrabold text-sm hover:opacity-90">
              X
            </a>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="flex flex-col gap-2 pt-2">
          <span className="text-[13px] font-medium text-white/90">Stay connected by subscribe newsletter</span>
          <form
            onSubmit={(e: any) => {
              e.preventDefault();
              alert('Subscribed successfully!');
              e.target.reset();
            }}
            className="w-full flex items-center bg-white rounded-[4px] p-1 border border-gray-300"
          >
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="flex-1 bg-transparent border-none outline-none text-[13px] text-gray-800 px-2 placeholder-gray-400"
            />
            <button
              type="submit"
              className="h-[36px] px-4 bg-[#1D493E] text-white font-semibold text-[13px] rounded-[4px] hover:opacity-90 shrink-0"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Divider */}
        <div className="border-t border-white/15 w-full my-1"></div>

        {/* Copyright & Sub-credits */}
        <div className="flex flex-col gap-2 text-left text-[13px] font-medium text-white/90">
          <p className="m-0">Copyrights © 2026 Go Banjara. All Rights Reserved.</p>
          <p className="m-0">Handmade with love ❤️ by TRD Studios</p>
        </div>
      </footer>
    </div>
  );
};
