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
    <footer
      style={{
        width: "100%",
        background: "rgba(29, 73, 62, 1)",
        paddingTop: "32px",
        paddingBottom: "32px",
        paddingLeft: "80px",
        paddingRight: "80px",
      }}
      className="text-slate-200 border-t border-white/5 font-sans"
    >
      <div
        style={{ width: "100%", maxWidth: "1440px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}
      >
        {/* Main Footer Row — 1280×290, space-between */}
        <div
          style={{
            width: "100%",
            maxWidth: "1280px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
        
        {/* Brand, Logo & Description */}
        <div className="flex flex-col gap-4">
          {/* Logo Row — 273.5×51, gap-12 */}
          <div
            style={{
              width: "273.5px",
              height: "51px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div className="relative w-[51px] h-[51px] rounded-xl bg-[#FFF080]/10 flex items-center justify-center border border-[#FFF080]/20 shrink-0">
              <BonjoMascot width={36} height={36} interactive={false} />
            </div>
            <span className="font-serif font-black text-[28px] text-[#FFF080] tracking-tight leading-none">gobanjara</span>
          </div>
          {/* Description */}
          <p className="text-sm text-slate-200/90 max-w-xs leading-relaxed font-sans">
            Crafting high-end editorial travel experience and gear for the modern nomad.
            <br />
            Escape the ordinary with us.
          </p>
        </div>

        {/* Important Links — 153×290, gap-12 */}
        <div
          style={{
            width: "153px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300/80">Important Links</h4>
          <ul style={{ display: "flex", flexDirection: "column", gap: "12px" }} className="text-sm font-semibold">
            <li><Link href="/" className="hover:text-[#FFF080] transition-colors">Home</Link></li>
            <li><Link href="/travel" className="hover:text-[#FFF080] transition-colors">Travel Packages</Link></li>
            <li><Link href="/about" className="hover:text-[#FFF080] transition-colors">About us</Link></li>
            <li><Link href="/shop" className="hover:text-[#FFF080] transition-colors">Shop</Link></li>
          </ul>
        </div>

        {/* Let us help — 231px × 290px, gap-12 */}
        <div
          style={{
            width: "231px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300/80">Let us help</h4>
          <ul style={{ display: "flex", flexDirection: "column", gap: "12px" }} className="text-sm font-semibold">
            <li><Link href="/profile" className="hover:text-[#FFF080] transition-colors">Your Account</Link></li>
            <li><Link href="/profile" className="hover:text-[#FFF080] transition-colors">Your Orders</Link></li>
            <li><Link href="/contact" className="hover:text-[#FFF080] transition-colors">Returns &amp; Replacements</Link></li>
            <li><Link href="/contact" className="hover:text-[#FFF080] transition-colors">Refund &amp; Returns Policy</Link></li>
            <li><Link href="/about" className="hover:text-[#FFF080] transition-colors">Privacy Policy</Link></li>
            <li><Link href="/contact" className="hover:text-[#FFF080] transition-colors">Help Center</Link></li>
          </ul>
        </div>

          {/* Contact us — 439px × 290px, gap-12 */}
          <div style={{ width: "439px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300/80">Contact us</h4>
            <ul style={{ display: "flex", flexDirection: "column", gap: "12px" }} className="text-sm font-semibold">
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1D493E] border border-white/10 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span>HITEC City, Hyderabad, Telangana, India</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1D493E] border border-white/10 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <a href="mailto:services@gobanjara.com" className="hover:text-[#FFF080] transition-colors">services@gobanjara.com</a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1D493E] border border-white/10 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <a href="tel:+910123456789" className="hover:text-[#FFF080] transition-colors">+91 0123456789</a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1D493E] border border-white/10 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>Mon–Sat, 10:00–19:00 IST</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Socials + Newsletter Row — 1280×87, space-between */}
        <div
          style={{
            width: "100%",
            maxWidth: "1280px",
            height: "87px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-300 font-bold mr-1">Follow us on:</span>
            {/* Facebook */}
            <a href="#" className="w-8 h-8 rounded-lg bg-[#3B5998] flex items-center justify-center text-white hover:scale-105 transition-transform duration-200">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
            </a>
            {/* Instagram */}
            <a href="#" className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FFB900] via-[#D1016A] to-[#8F00FF] flex items-center justify-center text-white hover:scale-105 transition-transform duration-200">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
            </a>
            {/* LinkedIn */}
            <a href="#" className="w-8 h-8 rounded-lg bg-[#0077B5] flex items-center justify-center text-white hover:scale-105 transition-transform duration-200">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
            </a>
            {/* X (Twitter) */}
            <a href="#" className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black hover:scale-105 transition-transform duration-200">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-200">Stay connected by subscribe newsletter</span>
            <form onSubmit={(e) => { e.preventDefault(); alert("Subscribed!"); }} className="flex bg-white rounded-lg p-1 border border-slate-200">
              <input type="email" required placeholder="Enter your email address" className="w-[280px] bg-transparent px-3 py-2 text-slate-800 text-xs focus:outline-none placeholder-slate-400 font-sans font-medium" />
              <button type="submit" className="bg-[#1D493E] hover:bg-[#15342c] text-white px-5 py-2 rounded-md text-xs font-bold transition duration-300 cursor-pointer shadow-sm shrink-0">Subscribe</button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10"></div>

        {/* Copyrights Bar — 1280×49, pt/pb 12px, space-between */}
        <div
          style={{
            width: "100%",
            maxWidth: "1280px",
            height: "49px",
            paddingTop: "12px",
            paddingBottom: "12px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          className="text-xs font-medium text-slate-300/70"
        >
          <span>Copyrights © 2026 Go Banjara. All Rights Reserved.</span>
          <div className="flex items-center gap-2">
            <span>Handmade with love ❤️ by TRD Studios</span>
            {/* Secret Invisible Link to Admin Portal */}
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
  );
};
