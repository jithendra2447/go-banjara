'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, X, Phone, Mail, MapPin, User, Heart 
} from 'lucide-react';
import { useCart } from '@/components/providers';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTravelHovered, setIsTravelHovered] = useState(false);
  const [isShopHovered, setIsShopHovered] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const { cartCount, setCartOpen, wishlist, setWishlistOpen, user, logout, setAuthOpen } = useCart();
  const [searchVal, setSearchVal] = useState('');

  const triggerSearch = () => {
    if (searchVal.trim()) {
      window.location.href = `/shop/all?search=${encodeURIComponent(searchVal.trim())}`;
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      triggerSearch();
    }
  };

  const navLinks = [
    { name: 'Travel Packages', path: '/travel' },
    { name: 'Shop', path: '/shop' },
    { name: 'About us', path: '/about' },
    { name: 'Blogs', path: '/blog' },
    { name: 'Contact us', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/shop') {
      return pathname.startsWith('/shop');
    }
    if (path === '/travel') {
      return pathname.startsWith('/travel');
    }
    return pathname.startsWith(path);
  };

  return (
    <header className="w-full z-50 flex flex-col fixed top-0 left-0 bg-white backdrop-blur-[12px] border-b border-[#CCCCCC]">
      {/* 2. MAIN NAV BAR */}
      <nav className="h-[90px] flex items-center w-full">
        <div className="max-w-[1440px] mx-auto px-4 md:px-[42px] pt-[20px] pb-[20px] w-full flex items-center justify-between h-full">
          
          <div className="flex items-center gap-10">
            {/* Logo (Direct Image from Figma Mockup) */}
            <Link href="/" className="flex items-center group shrink-0">
              <img
                src="/logo.png"
                alt="go banjāra logo"
                className="h-[40px] sm:h-[48px] w-auto max-w-[160px] sm:max-w-[217px] object-contain transition-transform duration-300 group-hover:scale-102"
              />
            </Link>

            {/* Desktop Menu Links */}
            <div className="hidden xl:flex items-center gap-[10px] lg:gap-[16px] h-[49px]">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                
                const activeClass = active
                  ? 'bg-[#1D493E]/8 text-[#1D493E]'
                  : 'text-[#535352] hover:text-[#1D493E] hover:bg-gray-50';

                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`flex items-center justify-center px-[16px] py-[12px] h-[49px] rounded-[4px] transition-all duration-300 w-auto ${activeClass}`}
                  >
                    <span
                      className="flex items-center justify-center h-[25px] text-center w-auto whitespace-nowrap"
                      style={{ fontFamily: "'Faktum','Outfit',sans-serif", fontWeight: 500, fontSize: "20px", lineHeight: "100%", letterSpacing: "0px", verticalAlign: "middle" }}
                    >
                      {link.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right actions: Search Bar, Cart & Login */}
          <div className="flex items-center justify-end gap-3 md:gap-[16px] xl:gap-[24px] h-[47px] shrink-0">
            
            {/* Search Input Box */}
            <div className="hidden md:flex items-center w-[215px] h-[47px] gap-[8px] rounded-[4px] p-[12px] bg-white border border-[#CCCCCC]">
              <button
                onClick={triggerSearch}
                className="focus:outline-none shrink-0 text-[#8D8D8D] hover:text-[#1D493E] transition-colors"
                aria-label="Search"
              >
                <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <input
                type="text"
                placeholder="Search by products"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-[163px] h-[23px] bg-transparent text-[18px] leading-none focus:outline-none font-sans font-normal placeholder-[#8D8D8D] text-slate-800"
              />
            </div>

            {/* Wishlist Button (Hidden to match Figma mockup) */}
            <button
              onClick={() => setWishlistOpen(true)}
              className="hidden relative p-2.5 rounded-full transition-all duration-300 items-center justify-center hover:scale-105 cursor-pointer hover:bg-gray-50 text-[#1D493E]"
              aria-label="Wishlist"
            >
              <Heart className="w-5.5 h-5.5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#FF5A36] text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white">
                  {wishlist.length < 10 ? `0${wishlist.length}` : wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Bag (Redesigned with SVG cart from Figma mockup) */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 rounded-full transition-all duration-300 flex items-center justify-center hover:scale-105 cursor-pointer hover:bg-gray-50 text-[#1D493E] h-[47px] w-[47px] shrink-0"
              aria-label="Shopping Cart"
            >
              <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-[2px] right-[2px] min-w-[18px] h-[18px] px-1 bg-[#FF5A36] text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white">
                  {cartCount < 10 ? `0${cartCount}` : cartCount}
                </span>
              )}
            </button>

            {/* Login & User Profile Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="hidden sm:flex items-center gap-2 py-1.5 pl-2 pr-4 rounded-full border transition-all duration-300 text-xs font-black uppercase tracking-wider cursor-pointer border-gray-200 bg-gray-50 hover:bg-gray-100 text-[#1D493E] h-[47px]"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover border border-white/20" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#FF5B37] text-white flex items-center justify-center font-extrabold text-[10px]">
                      {user.name[0]}
                    </div>
                  )}
                  <span>{user.name.split(' ')[0]}</span>
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-100 rounded-2xl shadow-xl p-3.5 z-50 text-slate-800 space-y-2 text-xs font-semibold animate-fade-in">
                    <div className="pb-2.5 border-b border-slate-100">
                      <p className="font-black text-primary-dark uppercase text-[10px] tracking-wider">Account</p>
                      <p className="text-primary-dark/85 font-extrabold truncate mt-0.5">{user.name}</p>
                      {user.email && <p className="text-[10px] text-slate-400 font-semibold truncate">{user.email}</p>}
                      {user.phone && <p className="text-[10px] text-slate-400 font-semibold truncate">+91 {user.phone}</p>}
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="w-full text-left p-2 hover:bg-slate-50 text-primary-dark rounded-xl transition font-black uppercase tracking-wider text-[10px] block"
                    >
                      View Profile
                    </Link>
                    {(user.role === 'ADMIN' || user.email?.toLowerCase().includes('admin')) && (
                      <Link
                        href="/admin"
                        onClick={() => setIsProfileOpen(false)}
                        className="w-full text-left p-2 hover:bg-slate-50 text-[#FF5B37] rounded-xl transition font-black uppercase tracking-wider text-[10px] block font-bold"
                      >
                        Admin Portal
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left p-2 hover:bg-rose-50 text-rose-600 rounded-xl transition font-black uppercase tracking-wider text-[10px] cursor-pointer block"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                style={{
                  width: "90px",
                  height: "47px",
                  paddingTop: "12px",
                  paddingBottom: "12px",
                  paddingLeft: "24px",
                  paddingRight: "24px",
                  gap: "8px",
                  borderRadius: "4px",
                  background: "rgba(29, 73, 62, 1)",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  border: "none",
                  flexShrink: 0,
                  transition: "background 0.2s",
                }}
                className="hidden sm:flex hover:opacity-90"
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(22,55,47,1)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(29,73,62,1)")}
              >
                <span style={{ fontFamily: "'Faktum','Outfit',sans-serif", fontWeight: 500, fontSize: "16px", lineHeight: "100%", letterSpacing: "0px", color: "#FFFFFF" }}>Login</span>
              </button>
            )}

            {/* Mobile menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="xl:hidden p-2 rounded-full transition-all duration-300 cursor-pointer hover:bg-gray-50 text-[#1D493E]"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mega Dropdown for Shop */}
      {isShopHovered && (
        <div 
          className="absolute top-24 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-[1440px] bg-white border border-[#1D493E]/10 rounded-[32px] p-8 shadow-2xl z-50 flex gap-12 text-[#1D493E] animate-fade-in text-left"
          onMouseEnter={() => setIsShopHovered(true)}
          onMouseLeave={() => setIsShopHovered(false)}
        >
          {/* Columns */}
          <div className="flex-1 grid grid-cols-3 gap-8">
             {/* Column 1: Apparel & Footwear */}
             <div className="space-y-4">
                <Link 
                  href="/shop" 
                  onClick={() => setIsShopHovered(false)}
                  className="group block border-b border-[#1D493E]/5 pb-2"
                >
                  <h4 className="font-sans text-xs font-black uppercase tracking-wider text-[#FF5A36] group-hover:underline">
                    Apparel & Footwear
                  </h4>
                  <span className="text-[9px] text-gray-400 block font-medium mt-0.5">Premium comfort built for the open road</span>
                </Link>
                <ul className="space-y-3 pl-1">
                   <li>
                     <Link 
                       href="/shop" 
                       onClick={() => setIsShopHovered(false)} 
                       className="group block"
                     >
                       <span className="text-xs font-black group-hover:text-[#FF5A36] transition">Banjara T-Shirts</span>
                       <span className="text-[10px] text-gray-400 block font-medium mt-0.5">100% organic cotton graphic tees with custom nomad art</span>
                     </Link>
                   </li>
                   <li>
                     <Link 
                       href="/shop" 
                       onClick={() => setIsShopHovered(false)} 
                       className="group block"
                     >
                       <span className="text-xs font-black group-hover:text-[#FF5A36] transition">Adventure Slides & Sandals</span>
                       <span className="text-[10px] text-gray-400 block font-medium mt-0.5">Waterproof, lightweight, and durable footwear</span>
                     </Link>
                   </li>
                </ul>
             </div>
             
             {/* Column 2: Nomad Accessories */}
             <div className="space-y-4">
                <Link 
                  href="/shop" 
                  onClick={() => setIsShopHovered(false)}
                  className="group block border-b border-[#1D493E]/5 pb-2"
                >
                  <h4 className="font-sans text-xs font-black uppercase tracking-wider text-[#FF5A36] group-hover:underline">
                    Nomad Accessories
                  </h4>
                  <span className="text-[9px] text-gray-400 block font-medium mt-0.5">Small details that carry the spirit of travel</span>
                </Link>
                <ul className="space-y-3 pl-1">
                   <li>
                     <Link 
                       href="/shop" 
                       onClick={() => setIsShopHovered(false)} 
                       className="group block"
                     >
                       <span className="text-xs font-black group-hover:text-[#FF5A36] transition">Badges & Keychains</span>
                       <span className="text-[10px] text-gray-400 block font-medium mt-0.5">Collectibles, pins, and custom keychains</span>
                     </Link>
                   </li>
                   <li>
                     <Link 
                       href="/shop" 
                       onClick={() => setIsShopHovered(false)} 
                       className="group block"
                     >
                       <span className="text-xs font-black group-hover:text-[#FF5A36] transition">Sticker Packs</span>
                       <span className="text-[10px] text-gray-400 block font-medium mt-0.5">Waterproof vinyl stickers for flasks, laptops, and bikes</span>
                     </Link>
                   </li>
                </ul>
             </div>

             {/* Column 3: Featured Collections */}
             <div className="space-y-4">
                <Link 
                  href="/shop" 
                  onClick={() => setIsShopHovered(false)}
                  className="group block border-b border-[#1D493E]/5 pb-2"
                >
                  <h4 className="font-sans text-xs font-black uppercase tracking-wider text-[#FF5A36] group-hover:underline">
                    Featured Collections
                  </h4>
                  <span className="text-[9px] text-gray-400 block font-medium mt-0.5">Curated releases and seasonal selections</span>
                </Link>
                <ul className="space-y-3 pl-1">
                   <li>
                     <Link 
                       href="/shop/travels-essentials" 
                       onClick={() => setIsShopHovered(false)} 
                       className="group block"
                     >
                       <span className="text-xs font-black group-hover:text-[#FF5A36] transition">Travel Essentials</span>
                       <span className="text-[10px] text-gray-400 block font-medium mt-0.5">Flasks, gear, and tools built for real conditions</span>
                     </Link>
                   </li>
                   <li>
                     <Link 
                       href="/shop/discount-sale" 
                       onClick={() => setIsShopHovered(false)} 
                       className="group block"
                     >
                       <span className="text-xs font-black group-hover:text-[#FF5A36] transition">Discount Sale</span>
                       <span className="text-[10px] text-gray-400 block font-medium mt-0.5">Limited-time deals on community favorites</span>
                     </Link>
                   </li>
                   <li>
                     <Link 
                       href="/shop/all" 
                       onClick={() => setIsShopHovered(false)} 
                       className="group block"
                     >
                       <span className="text-xs font-black group-hover:text-[#FF5A36] transition">View All Products</span>
                       <span className="text-[10px] text-gray-400 block font-medium mt-0.5">Browse the complete Go Banjara travel bazaar</span>
                     </Link>
                   </li>
                </ul>
             </div>
          </div>
        </div>
      )}

      {/* Mega Dropdown for Travel Packages */}
      {isTravelHovered && (
        <div 
          className="absolute top-24 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-[1440px] bg-white border border-[#1D493E]/10 rounded-[32px] p-8 shadow-2xl z-50 flex gap-12 text-[#1D493E] animate-fade-in text-left"
          onMouseEnter={() => setIsTravelHovered(true)}
          onMouseLeave={() => setIsTravelHovered(false)}
        >
          {/* Columns */}
          <div className="flex-1 grid grid-cols-3 gap-8">
             {/* Column 1: Kashmir */}
             <div className="space-y-4">
                <Link 
                  href="/travel/kashmir" 
                  onClick={() => setIsTravelHovered(false)}
                  className="group block border-b border-[#1D493E]/5 pb-2"
                >
                  <h4 className="font-sans text-xs font-black uppercase tracking-wider text-[#FF5B37] group-hover:underline">
                    Kashmir
                  </h4>
                  <span className="text-[9px] text-gray-400 block font-medium mt-0.5">Explore the paradise valley & alpine meadows</span>
                </Link>
                <ul className="space-y-3 pl-1">
                   <li>
                     <Link 
                       href="/travel/package/pkg-kashmir-classic" 
                       onClick={() => setIsTravelHovered(false)} 
                       className="group block"
                     >
                       <span className="text-xs font-black group-hover:text-[#FF5B37] transition">Kashmir Valley Classic</span>
                       <span className="text-[10px] text-gray-400 block font-medium mt-0.5">Houseboat stays, Srinagar Dal Lake & Pahalgam</span>
                     </Link>
                   </li>
                   <li>
                     <Link 
                       href="/travel/package/pkg-kashmir-gulmarg" 
                       onClick={() => setIsTravelHovered(false)} 
                       className="group block"
                     >
                       <span className="text-xs font-black group-hover:text-[#FF5B37] transition">Gulmarg Snow Skiing</span>
                       <span className="text-[10px] text-gray-400 block font-medium mt-0.5">Gondola phase 1 passes, ski rentals & snow trials</span>
                     </Link>
                   </li>
                   <li>
                     <Link 
                       href="/travel/srinagar-to-leh" 
                       onClick={() => setIsTravelHovered(false)} 
                       className="group block"
                     >
                       <span className="text-xs font-black group-hover:text-[#FF5B37] transition">Srinagar to Leh Highway</span>
                       <span className="text-[10px] text-gray-400 block font-medium mt-0.5">Epic 8-day road trip crossing Zoji La pass & Leh Ladakh</span>
                     </Link>
                   </li>
                </ul>
             </div>
             
             {/* Column 2: Kerala */}
             <div className="space-y-4">
                <Link 
                  href="/travel/kerala" 
                  onClick={() => setIsTravelHovered(false)}
                  className="group block border-b border-[#1D493E]/5 pb-2"
                >
                  <h4 className="font-sans text-xs font-black uppercase tracking-wider text-[#FF5B37] group-hover:underline">
                    Kerala
                  </h4>
                  <span className="text-[9px] text-gray-400 block font-medium mt-0.5">Unwind in green backwaters & tropical hills</span>
                </Link>
                <ul className="space-y-3 pl-1">
                   <li>
                     <Link 
                       href="/travel/package/pkg-kerala-4in1" 
                       onClick={() => setIsTravelHovered(false)} 
                       className="group block"
                     >
                       <span className="text-xs font-black group-hover:text-[#FF5B37] transition">4IN1 Private Trip</span>
                       <span className="text-[10px] text-gray-400 block font-medium mt-0.5">Munnar hills, Thekkady wildlife & Alleppey houseboat</span>
                     </Link>
                   </li>
                   <li>
                     <Link 
                       href="/travel/package/pkg-kerala-classic3" 
                       onClick={() => setIsTravelHovered(false)} 
                       className="group block"
                     >
                       <span className="text-xs font-black group-hover:text-[#FF5B37] transition">Classic 3 Getaway</span>
                       <span className="text-[10px] text-gray-400 block font-medium mt-0.5">Short refreshing private break around Munnar & Alleppey</span>
                     </Link>
                   </li>
                   <li>
                     <Link 
                       href="/travel/package/pkg-kerala-vibe" 
                       onClick={() => setIsTravelHovered(false)} 
                       className="group block"
                     >
                       <span className="text-xs font-black group-hover:text-[#FF5B37] transition">Kerala Vibe Specials</span>
                       <span className="text-[10px] text-gray-400 block font-medium mt-0.5">Kovalam, Varkala cliff beaches & backwater cruises</span>
                     </Link>
                   </li>
                </ul>
             </div>

             {/* Column 3: Rajasthan */}
             <div className="space-y-4">
                <div className="border-b border-[#1D493E]/5 pb-2 cursor-default">
                  <h4 className="font-sans text-xs font-black uppercase tracking-wider text-[#FF5B37]">
                    Rajasthan
                  </h4>
                  <span className="text-[9px] text-gray-400 block font-medium mt-0.5">Explore royal deserts & majestic heritage</span>
                </div>
                <ul className="space-y-3 pl-1">
                   <li className="cursor-default">
                     <span className="text-xs font-black text-gray-300 block">Jaisalmer Desert Camps</span>
                     <span className="text-[10px] text-gray-300 block font-medium mt-0.5">Sunset camel safaris & local folk musical evenings</span>
                   </li>
                   <li className="cursor-default">
                     <span className="text-xs font-black text-gray-300 block">Royal Mewar Heritage</span>
                     <span className="text-[10px] text-gray-300 block font-medium mt-0.5">Udaipur lake palaces & Jaipur historic forts</span>
                   </li>
                   <li>
                     <Link href="/travel" onClick={() => setIsTravelHovered(false)} className="text-[10px] font-black uppercase text-[#FF5B37] hover:underline block mt-2">
                       View All Destinations →
                     </Link>
                   </li>
                </ul>
             </div>
          </div>

          {/* Banner Promo Card */}
          <div className="w-64 bg-[#FFF0EB] rounded-[24px] p-6 border border-[#FF5B37]/8 flex flex-col justify-between items-center text-center">
             <div className="space-y-2">
                <span className="text-[9px] font-black uppercase text-[#FF5B37] tracking-widest bg-white py-1 px-3.5 rounded-full shadow-sm border border-[#FF5B37]/5">Featured Trip</span>
                <h5 className="font-serif font-black text-sm text-[#1D493E] mt-3">Ladakh Expedition</h5>
                <p className="text-[10px] text-[#1D493E]/70 leading-relaxed">Join our next highway road trip departure starting from Srinagar.</p>
             </div>
             <Link 
               href="/travel/srinagar-to-leh" 
               onClick={() => setIsTravelHovered(false)} 
               className="mt-4 w-full py-2 bg-[#1D493E] hover:bg-[#FF5B37] text-white text-[9.5px] font-black uppercase tracking-widest rounded-xl transition shadow-sm text-center font-bold"
             >
               Explore Route
             </Link>
          </div>
        </div>
      )}

      {/* Mobile Sidebar/Menu */}
      {isOpen && (
        <div 
          className="xl:hidden border-t border-gray-100 absolute left-0 w-full shadow-xl transition-all duration-300 z-50 top-[90px]"
          style={{ backgroundColor: 'rgba(255, 255, 255, 1)' }}
        >
          <div className="px-6 py-8 flex flex-col gap-8">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-[20px] font-sans font-medium tracking-[-0.2px] leading-[100%] transition-all duration-300 ${
                    active ? 'text-[#1D493E]' : 'text-[#535352] hover:text-[#1D493E]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
             {/* Mobile Login / User Profile */}
            {user ? (
              <div className="w-full mt-2 p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#FF5B37] text-white flex items-center justify-center font-extrabold text-xs">
                        {user.name[0]}
                      </div>
                    )}
                    <div>
                      <p className="font-extrabold text-xs text-primary-dark">{user.name}</p>
                      <p className="text-[9px] text-slate-400 font-semibold">{user.email || `+91 ${user.phone}`}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      logout();
                    }}
                    className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-xl text-[9px] font-black uppercase tracking-wider cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 bg-primary-dark text-white rounded-xl text-[10px] font-black uppercase tracking-wider block"
                >
                  View Profile Account
                </Link>
                {(user.role === 'ADMIN' || user.email?.toLowerCase().includes('admin')) && (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center py-2.5 bg-[#FF5B37] text-white rounded-xl text-[10px] font-black uppercase tracking-wider block"
                  >
                    Admin Portal
                  </Link>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false);
                  setAuthOpen(true);
                }}
                className="mt-2 flex items-center justify-center gap-2.5 w-full py-4 bg-[#1D493E] text-white text-[20px] font-sans font-medium tracking-[-0.2px] leading-[100%] rounded-lg transition-all hover:bg-[#16372f] cursor-pointer"
              >
                <User className="w-5 h-5" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
