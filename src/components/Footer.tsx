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
        height: "606px",
        boxSizing: "border-box",
        background: "rgba(29, 73, 62, 1)",
        paddingTop: "42px",
        paddingBottom: "42px",
        paddingLeft: "80px",
        paddingRight: "80px",
      }}
      className="text-slate-200 border-t border-white/5 font-sans"
    >
      <div
        style={{ width: "100%", maxWidth: "1280px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "32px" }}
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
          {/* Logo — Figma Export */}
          <img
            src="/logo-footer.png"
            alt="go banjāra"
            style={{ width: "220px", height: "auto" }}
          />
          {/* Description — 273×168, Faktum 500 20px 42lh */}
          <p
            style={{
              width: "273px",
              height: "168px",
              fontFamily: "'Faktum', 'Outfit', sans-serif",
              fontWeight: 500,
              fontSize: "20px",
              lineHeight: "42px",
              letterSpacing: "0px",
              color: "rgba(255, 255, 255, 1)",
              margin: 0,
            }}
          >
            Crafting high-end editorial travel experience and gear for the modern nomad. Escape the ordinary with us.
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
          <h4 style={{ fontFamily: "'Faktum', 'Outfit', sans-serif", fontWeight: 500, fontSize: "18px", lineHeight: "26px", letterSpacing: "-0.1px", color: "rgba(255,255,255,0.8)", margin: 0 }}>Important Links</h4>
          <ul
            style={{
              width: "153px",
              height: "168px",
              display: "flex",
              flexDirection: "column",
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {[{ label: "Home", href: "/" }, { label: "Travel Packages", href: "/travel" }, { label: "About us", href: "/about" }, { label: "Shop", href: "/shop" }].map((item) => (
              <li key={item.href}
                style={{
                  fontFamily: "'Faktum', 'Outfit', sans-serif",
                  fontWeight: 500,
                  fontSize: "20px",
                  lineHeight: "42px",
                  letterSpacing: "0px",
                  color: "rgba(255, 255, 255, 1)",
                }}
              >
                <Link href={item.href} className="hover:text-[#FFF080] transition-colors">{item.label}</Link>
              </li>
            ))}
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
          <h4 style={{ fontFamily: "'Faktum', 'Outfit', sans-serif", fontWeight: 500, fontSize: "18px", lineHeight: "26px", letterSpacing: "-0.1px", color: "rgba(255,255,255,0.8)", margin: 0 }}>Let us help</h4>
          <ul
            style={{
              display: "flex",
              flexDirection: "column",
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {[
              { label: "Your Account", href: "/profile" },
              { label: "Your Orders", href: "/profile" },
              { label: "Returns & Replacements", href: "/contact" },
              { label: "Refund & Returns Policy", href: "/contact" },
              { label: "Privacy Policy", href: "/about" },
              { label: "Help Center", href: "/contact" },
            ].map((item) => (
              <li key={item.label}
                style={{
                  fontFamily: "'Faktum', 'Outfit', sans-serif",
                  fontWeight: 500,
                  fontSize: "20px",
                  lineHeight: "42px",
                  letterSpacing: "0px",
                  color: "rgba(255, 255, 255, 1)",
                }}
              >
                <Link href={item.href} className="hover:text-[#FFF080] transition-colors">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

          {/* Contact us — 439px × 290px, gap-12 */}
          <div style={{ width: "439px", height: "290px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <h4 style={{ fontFamily: "'Faktum', 'Outfit', sans-serif", fontWeight: 500, fontSize: "18px", lineHeight: "26px", letterSpacing: "-0.1px", color: "rgba(255,255,255,0.8)", margin: 0 }}>Contact us</h4>
            <ul style={{ width: "439px", height: "220px", display: "flex", flexDirection: "column", gap: "12px", listStyle: "none", padding: 0, margin: 0 }}>
              <li className="flex items-center gap-3">
                <img src="/icon-location.png" alt="Location" style={{ width: "42px", height: "42px", flexShrink: 0 }} />
                <span style={{ fontFamily: "'Faktum','Outfit',sans-serif", fontWeight: 500, fontSize: "20px", lineHeight: "100%", letterSpacing: "0px", color: "rgba(255,255,255,1)" }}>HITEC City, Hyderabad, Telangana, India</span>
              </li>
              <li className="flex items-center gap-3">
                <div style={{ width: "42px", height: "42px", background: "rgba(29,73,62,1)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <img src="/icon-email.png" alt="Email" style={{ width: "22px", height: "22px" }} />
                </div>
                <a href="mailto:services@gobanjara.com" style={{ fontFamily: "'Faktum','Outfit',sans-serif", fontWeight: 500, fontSize: "20px", lineHeight: "100%", letterSpacing: "0px", color: "rgba(255,255,255,1)" }} className="hover:text-[#FFF080] transition-colors">services@gobanjara.com</a>
              </li>
              <li className="flex items-center gap-3">
                <img src="/icon-phone.png" alt="Phone" style={{ width: "42px", height: "42px", flexShrink: 0 }} />
                <a href="tel:+910123456789" style={{ fontFamily: "'Faktum','Outfit',sans-serif", fontWeight: 500, fontSize: "20px", lineHeight: "100%", letterSpacing: "0px", color: "rgba(255,255,255,1)" }} className="hover:text-[#FFF080] transition-colors">+91 0123456789</a>
              </li>
              <li className="flex items-center gap-3">
                <img src="/icon-clock.png" alt="Hours" style={{ width: "42px", height: "42px", flexShrink: 0 }} />
                <span style={{ fontFamily: "'Faktum','Outfit',sans-serif", fontWeight: 500, fontSize: "20px", lineHeight: "100%", letterSpacing: "0px", color: "rgba(255,255,255,1)" }}>Mon–Sat, 10:00–19:00 IST</span>
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
            <span style={{ fontFamily: "'Faktum','Outfit',sans-serif", fontWeight: 500, fontSize: "18px", lineHeight: "100%", letterSpacing: "-0.1px", color: "rgba(255,255,255,1)" }}>Follow us on:</span>
            {/* Icons row — 204×42, gap 12 */}
            <div style={{ width: "204px", height: "42px", display: "flex", flexDirection: "row", alignItems: "center", gap: "12px" }}>
              {/* Facebook */}
              <a href="#" style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#3B5998", display: "flex", alignItems: "center", justifyContent: "center", color: "white", flexShrink: 0 }} className="hover:scale-105 transition-transform duration-200">
                <svg style={{ width: "20px", height: "20px" }} className="fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </a>
              {/* Instagram */}
              <a href="#" style={{ width: "42px", height: "42px", borderRadius: "10px", background: "linear-gradient(135deg, #FFB900, #D1016A, #8F00FF)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", flexShrink: 0 }} className="hover:scale-105 transition-transform duration-200">
                <svg style={{ width: "20px", height: "20px" }} className="fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
              </a>
              {/* LinkedIn */}
              <a href="#" style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#0077B5", display: "flex", alignItems: "center", justifyContent: "center", color: "white", flexShrink: 0 }} className="hover:scale-105 transition-transform duration-200">
                <svg style={{ width: "20px", height: "20px" }} className="fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </a>
              {/* X (Twitter) */}
              <a href="#" style={{ width: "42px", height: "42px", borderRadius: "10px", background: "white", display: "flex", alignItems: "center", justifyContent: "center", color: "black", flexShrink: 0 }} className="hover:scale-105 transition-transform duration-200">
                <svg style={{ width: "20px", height: "20px" }} className="fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
            </div>
          </div>

          {/* Newsletter — 439px to align with Contact us column */}
          <div className="flex flex-col gap-2" style={{ width: "439px" }}>
            <span style={{ fontFamily: "'Faktum','Outfit',sans-serif", fontWeight: 500, fontSize: "18px", lineHeight: "100%", letterSpacing: "0px", textAlign: "left", color: "rgba(255,255,255,1)" }}>Stay connected by subscribe newsletter</span>
            <form
              onSubmit={(e) => { e.preventDefault(); alert("Subscribed!"); }}
              style={{
                width: "439px",
                height: "56px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "8px",
                borderRadius: "4px",
                padding: "8px",
                background: "white",
                border: "1px solid rgba(141, 141, 141, 1)",
                boxSizing: "border-box",
              }}
            >
              <input
                type="email"
                required
                placeholder="Enter your email address"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontFamily: "'Faktum','Outfit',sans-serif",
                  fontWeight: 500,
                  fontSize: "20px",
                  lineHeight: "100%",
                  letterSpacing: "0px",
                  color: "#1a2e29",
                  paddingLeft: "8px",
                  verticalAlign: "middle",
                }}
                className="placeholder-[rgba(141,141,141,1)]"
              />
              <button
                type="submit"
                style={{ height: "40px", padding: "0 20px", background: "#1D493E", color: "white", borderRadius: "6px", fontFamily: "'Faktum','Outfit',sans-serif", fontWeight: 600, fontSize: "14px", border: "none", cursor: "pointer", flexShrink: 0 }}
              >
                Subscribe
              </button>
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
        >
          <span
            style={{
              fontFamily: "'Faktum', 'Outfit', sans-serif",
              fontWeight: 500,
              fontSize: "20px",
              lineHeight: "100%",
              letterSpacing: "0px",
              color: "rgba(255, 255, 255, 1)",
            }}
          >
            Copyrights © 2026 Go Banjara. All Rights Reserved.
          </span>
          <div className="flex items-center gap-2">
            <span
              style={{
                fontFamily: "'Faktum', 'Outfit', sans-serif",
                fontWeight: 500,
                fontSize: "20px",
                lineHeight: "100%",
                letterSpacing: "0px",
                color: "rgba(255, 255, 255, 1)",
              }}
            >
              Handmade with love ❤️ by TRD Studios
            </span>
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
