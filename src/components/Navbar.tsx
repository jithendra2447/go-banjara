'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Menu, X, Phone, Mail, MapPin, User, Heart, Package, LogOut, Check
} from 'lucide-react';
import { useCart } from '@/components/providers';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isTravelHovered, setIsTravelHovered] = useState(false);
  const [isShopHovered, setIsShopHovered] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>('profile');
  const pathname = usePathname();
  const { cartCount, setCartOpen, wishlist, setWishlistOpen, user, logout, setAuthOpen } = useCart();
  const [searchVal, setSearchVal] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (pathname !== '/') {
      setIsScrolled(false);
      return;
    }
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // run once initially
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const isHomepage = pathname === '/';
  const isTransparent = isHomepage && !isScrolled;

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
    <header className={`w-full z-50 flex flex-col fixed top-0 left-0 transition-all duration-300 ${
      isTransparent
        ? 'bg-transparent border-b border-white/10'
        : 'bg-white backdrop-blur-[12px] border-b border-[#CCCCCC]'
    }`}>
      {/* 2. MAIN NAV BAR */}
      <nav className="h-[90px] flex items-center w-full">
        <div className="max-w-[1440px] mx-auto px-4 md:px-[42px] py-4 w-full flex items-center justify-between h-full flex-nowrap">
          
          <div className="flex items-center gap-4 lg:gap-8 xl:gap-10 shrink-0">
            {/* Logo */}
            <Link href="/" className="flex items-center group shrink-0">
              <img
                src={isTransparent ? "/logo-footer.png" : "/logo.png"}
                alt="go banjāra logo"
                className="h-[38px] sm:h-[46px] w-auto max-w-[150px] sm:max-w-[200px] object-contain transition-transform duration-300 group-hover:scale-102"
              />
            </Link>

            {/* Desktop Menu Links */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2.5 h-[49px] flex-nowrap">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                
                const activeClass = active
                  ? (isTransparent ? 'bg-white/10 text-white' : 'bg-[#1D493E]/8 text-[#1D493E]')
                  : (isTransparent ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-[#535352] hover:text-[#1D493E] hover:bg-gray-50');

                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`flex items-center justify-center px-3 xl:px-4 py-2.5 h-[42px] rounded-[4px] transition-all duration-200 shrink-0 ${activeClass}`}
                  >
                    <span
                      className="flex items-center justify-center text-center whitespace-nowrap"
                      style={{ fontFamily: "'Faktum','Outfit',sans-serif", fontWeight: 500, fontSize: "15px", lineHeight: "100%", letterSpacing: "0px" }}
                    >
                      {link.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right actions: Search Bar, Cart & Login */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 lg:gap-4 h-[47px] shrink-0 flex-nowrap">
            
            {/* Search Input Box */}
            <div className={`hidden md:flex items-center w-[215px] h-[47px] gap-[8px] rounded-[4px] p-[12px] transition-all duration-300 ${
              isTransparent
                ? 'bg-black/20 border border-white/20 text-white'
                : 'bg-white border border-[#CCCCCC] text-slate-800'
            }`}>
              <button
                onClick={triggerSearch}
                className={`focus:outline-none shrink-0 transition-colors ${
                  isTransparent ? 'text-white/80 hover:text-white' : 'text-[#8D8D8D] hover:text-[#1D493E]'
                }`}
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
                className={`w-[163px] h-[23px] bg-transparent text-[18px] leading-none focus:outline-none font-sans font-normal ${
                  isTransparent ? 'placeholder-white/60 text-white' : 'placeholder-[#8D8D8D] text-slate-800'
                }`}
              />
            </div>

            {/* Wishlist Button (Hidden to match Figma mockup) */}
            <button
              onClick={() => router.push('/profile?tab=wishlist')}
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
              onClick={() => router.push('/cart')}
              className={`relative p-2.5 rounded-full transition-all duration-300 flex items-center justify-center hover:scale-105 cursor-pointer h-[47px] w-[47px] shrink-0 ${
                isTransparent ? 'text-white hover:bg-white/10' : 'text-[#1D493E] hover:bg-gray-50'
              }`}
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
                  className={`hidden sm:flex items-center gap-2 py-1.5 pl-2 pr-4 rounded-full border transition-all duration-300 text-xs font-black uppercase tracking-wider cursor-pointer h-[47px] ${
                    isTransparent
                      ? 'border-white/20 bg-white/10 hover:bg-white/20 text-white'
                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-[#1D493E]'
                  }`}
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
                  <div
                    className="absolute right-0 mt-2 z-50 flex flex-col select-none animate-fade-in"
                    style={{
                      width: '309px',
                      height: 'auto',
                      padding: '8px',
                      gap: '4px',
                      borderRadius: '4px',
                      background: 'rgba(255, 255, 255, 1)',
                      border: '1px solid rgba(204, 204, 204, 1)',
                      boxShadow: '0px 4px 12px 0px rgba(43, 43, 43, 0.25)',
                      boxSizing: 'border-box',
                    }}
                  >
                    {/* Item 1: My Profile */}
                    {(() => {
                      const isProfileActive = pathname === '/profile' && (!selectedMenuItem || selectedMenuItem === 'profile');
                      return (
                        <Link
                          href="/profile"
                          onClick={() => {
                            setSelectedMenuItem('profile');
                            setIsProfileOpen(false);
                          }}
                          className="flex items-center justify-between transition cursor-pointer"
                          style={{
                            width: '293px',
                            height: '48px',
                            padding: '12px',
                            gap: '10px',
                            borderRadius: '4px',
                            background: isProfileActive ? 'rgba(29, 73, 62, 0.08)' : '#FFFFFF',
                            textDecoration: 'none',
                            boxSizing: 'border-box',
                          }}
                        >
                          <div className="flex items-center gap-[10px]">
                            <User className="w-5 h-5 text-[#1D493E]" />
                            <span 
                              style={{ 
                                fontFamily: '"Faktum", "Outfit", sans-serif', 
                                fontWeight: 500, 
                                fontSize: '18px', 
                                color: '#1D493E' 
                              }}
                            >
                              My Profile
                            </span>
                          </div>
                          {isProfileActive && (
                            <Check className="w-5 h-5 text-[#1D493E]" />
                          )}
                        </Link>
                      );
                    })()}

                    {/* Item 2: My Orders */}
                    {(() => {
                      const isOrdersActive = selectedMenuItem === 'orders';
                      return (
                        <Link
                          href="/profile?tab=orders"
                          onClick={() => {
                            setSelectedMenuItem('orders');
                            setIsProfileOpen(false);
                          }}
                          className="flex items-center justify-between transition cursor-pointer"
                          style={{
                            width: '293px',
                            height: '48px',
                            padding: '12px',
                            gap: '10px',
                            borderRadius: '4px',
                            background: isOrdersActive ? 'rgba(29, 73, 62, 0.08)' : '#FFFFFF',
                            textDecoration: 'none',
                            boxSizing: 'border-box',
                          }}
                        >
                          <div className="flex items-center gap-[10px]">
                            <Package className="w-5 h-5 text-[#2B2B2B]" />
                            <span 
                              style={{ 
                                fontFamily: '"Faktum", "Outfit", sans-serif', 
                                fontWeight: 500, 
                                fontSize: '18px', 
                                color: isOrdersActive ? '#1D493E' : 'rgba(43, 43, 43, 1)' 
                              }}
                            >
                              My Orders
                            </span>
                          </div>
                          {isOrdersActive && <Check className="w-5 h-5 text-[#1D493E]" />}
                        </Link>
                      );
                    })()}

                    {/* Item 3: Saved Addresses */}
                    {(() => {
                      const isAddressesActive = selectedMenuItem === 'addresses';
                      return (
                        <Link
                          href="/profile?tab=addresses"
                          onClick={() => {
                            setSelectedMenuItem('addresses');
                            setIsProfileOpen(false);
                          }}
                          className="flex items-center justify-between transition cursor-pointer"
                          style={{
                            width: '293px',
                            height: '48px',
                            padding: '12px',
                            gap: '10px',
                            borderRadius: '4px',
                            background: isAddressesActive ? 'rgba(29, 73, 62, 0.08)' : '#FFFFFF',
                            textDecoration: 'none',
                            boxSizing: 'border-box',
                          }}
                        >
                          <div className="flex items-center gap-[10px]">
                            <MapPin className="w-5 h-5 text-[#2B2B2B]" />
                            <span 
                              style={{ 
                                fontFamily: '"Faktum", "Outfit", sans-serif', 
                                fontWeight: 500, 
                                fontSize: '18px', 
                                color: isAddressesActive ? '#1D493E' : 'rgba(43, 43, 43, 1)' 
                              }}
                            >
                              Saved Addresses
                            </span>
                          </div>
                          {isAddressesActive && <Check className="w-5 h-5 text-[#1D493E]" />}
                        </Link>
                      );
                    })()}

                    {/* Item 4: My Wishlist */}
                    <button
                      onClick={() => {
                        setSelectedMenuItem('wishlist');
                        setIsProfileOpen(false);
                        router.push('/profile?tab=wishlist');
                      }}
                      className="flex items-center justify-between transition w-full text-left cursor-pointer border-none"
                      style={{
                        width: '293px',
                        height: '48px',
                        padding: '12px',
                        gap: '10px',
                        borderRadius: '4px',
                        background: selectedMenuItem === 'wishlist' ? 'rgba(29, 73, 62, 0.08)' : '#FFFFFF',
                        boxSizing: 'border-box',
                      }}
                    >
                      <div className="flex items-center gap-[10px]">
                        <Heart className="w-5 h-5 text-[#2B2B2B]" />
                        <span 
                          style={{ 
                            fontFamily: '"Faktum", "Outfit", sans-serif', 
                            fontWeight: 500, 
                            fontSize: '18px', 
                            color: selectedMenuItem === 'wishlist' ? '#1D493E' : 'rgba(43, 43, 43, 1)' 
                          }}
                        >
                          My Wishlist
                        </span>
                      </div>
                      {selectedMenuItem === 'wishlist' && <Check className="w-5 h-5 text-[#1D493E]" />}
                    </button>

                    {/* Item 5: My Cart */}
                    <button
                      onClick={() => {
                        setSelectedMenuItem('cart');
                        setIsProfileOpen(false);
                        router.push('/cart');
                      }}
                      className="flex items-center justify-between transition w-full text-left cursor-pointer border-none"
                      style={{
                        width: '293px',
                        height: '48px',
                        padding: '12px',
                        gap: '10px',
                        borderRadius: '4px',
                        background: selectedMenuItem === 'cart' ? 'rgba(29, 73, 62, 0.08)' : '#FFFFFF',
                        boxSizing: 'border-box',
                      }}
                    >
                      <div className="flex items-center gap-[10px]">
                        <Package className="w-5 h-5 text-[#2B2B2B]" />
                        <span 
                          style={{ 
                            fontFamily: '"Faktum", "Outfit", sans-serif', 
                            fontWeight: 500, 
                            fontSize: '18px', 
                            color: selectedMenuItem === 'cart' ? '#1D493E' : 'rgba(43, 43, 43, 1)' 
                          }}
                        >
                          My Cart
                        </span>
                      </div>
                      {selectedMenuItem === 'cart' && <Check className="w-5 h-5 text-[#1D493E]" />}
                    </button>

                    {/* Item 5: Logout */}
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        setShowLogoutModal(true);
                      }}
                      className="flex items-center justify-between transition w-full text-left cursor-pointer border-none mt-auto hover:opacity-90"
                      style={{
                        width: '293px',
                        height: '48px',
                        padding: '12px',
                        gap: '10px',
                        borderRadius: '4px',
                        background: 'rgba(255, 235, 235, 0.6)',
                        boxSizing: 'border-box',
                      }}
                    >
                      <div className="flex items-center gap-[10px]">
                        <LogOut className="w-5 h-5 text-[#FF3B30]" />
                        <span 
                          style={{ 
                            fontFamily: '"Faktum", "Outfit", sans-serif', 
                            fontWeight: 500, 
                            fontSize: '18px', 
                            color: '#FF3B30' 
                          }}
                        >
                          Logout
                        </span>
                      </div>
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
              className={`lg:hidden p-2 rounded-full transition-all duration-300 cursor-pointer ${
                isTransparent 
                  ? 'hover:bg-white/10 text-white' 
                  : 'hover:bg-gray-50 text-[#1D493E]'
              }`}
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
          className="lg:hidden border-t border-gray-100 absolute left-0 w-full shadow-xl transition-all duration-300 z-50 top-[90px]"
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
                      setShowLogoutModal(true);
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

      {/* Account Logout Confirmation Modal */}
      {showLogoutModal && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm select-none"
          onClick={() => setShowLogoutModal(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "460px",
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: "12px",
              border: "1px solid rgba(204, 204, 204, 1)",
              backgroundColor: "#FFFFFF",
              padding: "32px 28px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              boxSizing: "border-box",
              boxShadow: "0px 20px 60px rgba(0, 0, 0, 0.18)",
            }}
            className="text-left"
          >
            {/* Icon + Title */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{
                width: "48px", height: "48px",
                borderRadius: "50%",
                background: "rgba(255, 40, 0, 0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,40,0,1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </div>
              <h3 style={{
                fontFamily: '"Fraunces", Georgia, serif',
                fontWeight: 700,
                fontSize: "22px",
                color: "rgba(43, 43, 43, 1)",
                margin: 0,
              }}>
                Log out of your account?
              </h3>
            </div>

            {/* Body text */}
            <p style={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 400,
              fontSize: "15px",
              lineHeight: "1.6",
              color: "rgba(43, 43, 43, 0.7)",
              margin: 0,
            }}>
              You&apos;ll be returned to the Home screen after logging out. Any unsaved changes may be lost.
            </p>

            {/* Action Buttons Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
              {/* Logout Red Button */}
              <button
                type="button"
                onClick={() => {
                  setShowLogoutModal(false);
                  logout();
                  router.push('/shop');
                }}
                style={{
                  width: "100%",
                  height: "48px",
                  borderRadius: "6px",
                  backgroundColor: "rgba(255, 40, 0, 1)",
                  color: "#FFFFFF",
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 700,
                  fontSize: "15px",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  letterSpacing: "0.01em",
                }}
                className="hover:opacity-90 active:scale-[0.98] transition cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Yes, Log Out
              </button>

              {/* Cancel Button */}
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                style={{
                  width: "100%",
                  height: "48px",
                  borderRadius: "6px",
                  backgroundColor: "rgba(255, 241, 239, 1)",
                  color: "rgba(255, 40, 0, 1)",
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 600,
                  fontSize: "15px",
                  border: "1px solid rgba(255, 200, 195, 1)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                className="hover:bg-[#FFE5E0] active:scale-[0.98] transition cursor-pointer"
              >
                Cancel, Stay Logged In
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
