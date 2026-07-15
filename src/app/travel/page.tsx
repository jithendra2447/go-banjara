'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  MapPin, Calendar, Users, Star, SlidersHorizontal, ArrowRight, X, Heart, Sparkles, 
  Check, CheckCircle2, Info, Plus, Minus, Map, ShieldCheck, ArrowUpDown, Globe, ChevronDown, ChevronUp, Compass, ArrowUpRight
} from 'lucide-react';
import { useCart } from '@/components/providers';

import { HOLIDAY_PACKAGES, HolidayPackage } from '@/data/packages';

const TESTIMONIALS = [
  {
    rating: 5,
    quote: "“The quality of the journal is incredible. It feels like a piece of art that I can actually take on my treks. Bonjo’s personality shines through the brand!”",
    author: "Kiran Makwan",
    role: "Verified Wanderer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    rating: 5,
    quote: "“The quality of the journal is incredible. It feels like a piece of art that I can actually take on my treks. Bonjo’s personality shines through the brand!”",
    author: "Kiran Makwan",
    role: "Verified Wanderer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    rating: 5,
    quote: "“The quality of the journal is incredible. It feels like a piece of art that I can actually take on my treks. Bonjo’s personality shines through the brand!”",
    author: "Kiran Makwan",
    role: "Verified Wanderer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    rating: 5,
    quote: "“The quality of the journal is incredible. It feels like a piece of art that I can actually take on my treks. Bonjo’s personality shines through the brand!”",
    author: "Kiran Makwan",
    role: "Verified Wanderer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    rating: 5,
    quote: "“The quality of the journal is incredible. It feels like a piece of art that I can actually take on my treks. Bonjo’s personality shines through the brand!”",
    author: "Kiran Makwan",
    role: "Verified Wanderer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    rating: 5,
    quote: "“The quality of the journal is incredible. It feels like a piece of art that I can actually take on my treks. Bonjo’s personality shines through the brand!”",
    author: "Kiran Makwan",
    role: "Verified Wanderer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  }
];

export default function HolidaysPortal() {
  const { addToCart, setCartOpen } = useCart();

  // Search and filter states
  const [destinationSearch, setDestinationSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelersInput, setTravelersInput] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [visiblePackagesCount, setVisiblePackagesCount] = useState(6);
  const [sortBy, setSortBy] = useState('recommended');
  
  // Interactive Panel/Modal states
  const [activeBookPkg, setActiveBookPkg] = useState<HolidayPackage | null>(null);
  const [activeInquiryPkg, setActiveInquiryPkg] = useState<HolidayPackage | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingGuests, setBookingGuests] = useState(2);
  const [bookedSuccess, setBookedSuccess] = useState(false);
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [selectedTravelTypes, setSelectedTravelTypes] = useState<string[]>([]);
  const [selectedInclusions, setSelectedInclusions] = useState<string[]>([]);

  // Inquiry Modal Form State
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', phone: '', notes: '' });
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);

  const [packages, setPackages] = useState<HolidayPackage[]>(HOLIDAY_PACKAGES);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gb_admin_packages');
      let parsed = saved ? JSON.parse(saved) : [];
      
      // Ensure all default packages exist in parsed
      let merged = [...parsed];
      let needsSave = false;
      HOLIDAY_PACKAGES.forEach(hp => {
        const foundIdx = merged.findIndex(p => p.id === hp.id);
        if (foundIdx === -1) {
          merged.push(hp);
          needsSave = true;
        } else {
          // If default package is missing critical fields, restore it
          const item = merged[foundIdx];
          if (item.price === undefined || !item.routeList || !item.itinerary) {
            merged[foundIdx] = hp;
            needsSave = true;
          }
        }
      });

      // Force update the link and image for the Srinagar-to-Leh package
      merged = merged.map((p: any) => {
        if (p.id === 'pkg-kashmir-classic') {
          if (p.link !== '/travel/srinagar-to-leh' || p.image !== '/travel-leh-6.jpg') {
            p.link = '/travel/srinagar-to-leh';
            p.image = '/travel-leh-6.jpg';
            needsSave = true;
          }
        }
        return p;
      });

      if (!saved || needsSave) {
        localStorage.setItem('gb_admin_packages', JSON.stringify(merged));
      }
      setPackages(merged);
    } catch (e) {
      console.error(e);
      setPackages(HOLIDAY_PACKAGES);
      localStorage.setItem('gb_admin_packages', JSON.stringify(HOLIDAY_PACKAGES));
    }
  }, []);

  // Filter & Sort Logic
  const filteredAndSortedPackages = useMemo(() => {
    let result = [...packages];

    // 1. Destination Search Filter
    if (destinationSearch) {
      const q = destinationSearch.toLowerCase();
      result = result.filter(pkg => 
        pkg.destination.toLowerCase().includes(q) || 
        pkg.name.toLowerCase().includes(q) ||
        (pkg.route && pkg.route.toLowerCase().includes(q))
      );
    }

    // 2. Active Tab Category
    if (activeCategory !== 'All') {
      const mapping: Record<string, string> = {
        'Weekends': 'Weekend',
        'Treks': 'Trek',
        'Road Trips': 'Road Trip',
        'Camping': 'Camping'
      };
      const targetCategory = mapping[activeCategory];
      if (targetCategory) {
        result = result.filter(pkg => pkg.category === targetCategory);
      }
    }

    // 3. Duration Filter
    if (selectedDurations.length > 0) {
      result = result.filter(pkg => {
        return selectedDurations.some(dur => {
          if (dur === '1-2 Days') return pkg.durationDays <= 2;
          if (dur === '3-5 Days') return pkg.durationDays >= 3 && pkg.durationDays <= 5;
          if (dur === '6-10 Days') return pkg.durationDays >= 6 && pkg.durationDays <= 10;
          if (dur === '10+ Days') return pkg.durationDays > 10;
          return false;
        });
      });
    }

    // 4. Travel Type Filter
    if (selectedTravelTypes.length > 0) {
      result = result.filter(pkg => {
        return selectedTravelTypes.some(type => {
          const themesLower = pkg.themes ? pkg.themes.map(t => t.toLowerCase()) : [];
          if (type === 'Solo Friendly') {
            return pkg.difficulty !== 'Challenging' || themesLower.includes('adventure') || themesLower.includes('solo');
          }
          if (type === 'Family') {
            return themesLower.includes('leisure') || themesLower.includes('romantic') || themesLower.includes('heritage') || themesLower.includes('family');
          }
          if (type === 'Group') {
            return pkg.category === 'Road Trip' || pkg.groupType === 'Group' || pkg.id.includes('classic') || themesLower.includes('group');
          }
          if (type === 'Corporate') {
            return themesLower.includes('corporate') || themesLower.includes('adventure') || pkg.durationDays <= 5;
          }
          return false;
        });
      });
    }

    // 5. Includes Filter
    if (selectedInclusions.length > 0) {
      result = result.filter(pkg => {
        const inclsLower = pkg.inclusions ? pkg.inclusions.map(i => i.toLowerCase()) : [];
        return selectedInclusions.some(incl => {
          if (incl === 'Meals') return inclsLower.some(i => i.includes('meals') || i.includes('breakfast') || i.includes('dinner'));
          if (incl === 'Accommodation') return inclsLower.some(i => i.includes('hotel') || i.includes('stay') || i.includes('houseboat') || i.includes('camp'));
          if (incl === 'Transport') return inclsLower.some(i => i.includes('transfers') || i.includes('cab') || i.includes('flight') || i.includes('suv'));
          if (incl === 'Guide') return inclsLower.some(i => i.includes('guide') || i.includes('sightseeing'));
          if (incl === 'Travel Gear') return inclsLower.some(i => i.includes('gear') || i.includes('permits') || i.includes('passes'));
          return false;
        });
      });
    }

    // 6. Sorting Logic
    if (sortBy === 'price-low-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high-low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [packages, destinationSearch, activeCategory, sortBy, selectedDurations, selectedTravelTypes, selectedInclusions]);

  // Handle checkout drawer opening
  const handleOpenBookingDrawer = (pkg: HolidayPackage) => {
    setActiveBookPkg(pkg);
    setBookingDate(startDate || '2026-07-15');
    setBookingGuests(Number(travelersInput) || 2);
    setBookedSuccess(false);
  };

  // Handle cart addition
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBookPkg) return;
    
    const finalItem = {
      id: activeBookPkg.id,
      name: activeBookPkg.name,
      price: activeBookPkg.price,
      image: activeBookPkg.image,
    };

    addToCart(finalItem, 'travel', bookingDate, bookingGuests);
    setBookedSuccess(true);
    
    setTimeout(() => {
      setActiveBookPkg(null);
      setBookedSuccess(false);
      setCartOpen(true);
    }, 1200);
  };

  // Handle custom inquiry modal
  const handleOpenInquiryModal = (pkg: HolidayPackage) => {
    setActiveInquiryPkg(pkg);
    setInquiryForm({ name: '', email: '', phone: '', notes: '' });
    setInquirySuccess(false);
  };

  // Handle inquiry submit
  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingInquiry(true);
    setTimeout(() => {
      setIsSubmittingInquiry(false);
      setInquirySuccess(true);
    }, 1500);
  };

  // Find the featured package for "How to book your Tour" (Srinagar to Leh)
  const featuredTour = packages.find(p => p.id === 'pkg-kashmir-classic') || packages[0];

  return (
    <div className="min-h-screen bg-white text-[#1D493E] font-sans antialiased pb-20 relative">
      
      {/* Header Section wrapper — styled to match exact Figma specifications */}
      <div
        style={{
          width: "100%",
          maxWidth: "1440px",
          height: "220px",
          paddingTop: "62px",
          paddingBottom: "24px",
          paddingLeft: "80px",
          paddingRight: "80px",
          gap: "10px",
          background: "rgba(255, 255, 255, 1)",
          boxSizing: "border-box",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Header Title block — styled to match exact Figma specifications */}
        <div 
          style={{
            width: "100%",
            maxWidth: "1280px",
            height: "134px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "0 auto",
          }}
        >
          <span 
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              justifyContent: "center",
              height: "28px",
              padding: "0 16px",
              borderRadius: "4px",
              fontFamily: "'Faktum', 'Outfit', sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              lineHeight: "100%",
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              color: "rgba(255, 98, 62, 1)",
              background: "rgba(255, 98, 62, 0.1)",
            }}
          >
            Discover Your Path
          </span>
          <h1 
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 600,
              fontSize: "42px",
              lineHeight: "100%",
              letterSpacing: "0px",
              textAlign: "center",
              color: "rgba(29, 73, 62, 1)",
              margin: 0,
            }}
          >
            Available <span style={{ color: "rgba(255, 98, 62, 1)", fontWeight: 600 }}>Packages</span>
          </h1>
          <p 
            style={{
              width: "100%",
              maxWidth: "1280px",
              fontFamily: "'Faktum', 'Outfit', sans-serif",
              fontWeight: 500,
              fontSize: "24px",
              lineHeight: "32px",
              letterSpacing: "0px",
              textAlign: "center",
              color: "rgba(43, 43, 43, 1)",
              margin: 0,
            }}
          >
            Curated journeys for the modern nomad, designed to push boundaries and discover India's hidden heart
          </p>
        </div>
      </div>

      {/* 1. AVAILABLE PACKAGES CONTENT SECTION */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-[80px] pt-10 pb-12 space-y-10">

        {/* SEARCH WIDGET CARD (Spans full width, styled to match exact Figma specs) */}
        <div 
          style={{
            width: "100%",
            maxWidth: "1280px",
            height: "137px",
            borderRadius: "12px",
            border: "1px solid rgba(255, 98, 62, 1)",
            boxShadow: "0px 4px 12px 0px rgba(255, 98, 62, 0.24)",
            padding: "24px",
            background: "rgba(255, 255, 255, 1)",
            boxSizing: "border-box",
            marginLeft: "auto",
            marginRight: "auto",
          }}
          className="text-left relative z-30"
        >
          <div style={{ display: "flex", flexDirection: "row", gap: "24px", width: "100%", height: "100%", alignItems: "center" }}>
            
            {/* Field 1: Destination */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ 
                fontFamily: "'Faktum', 'Outfit', sans-serif", 
                fontWeight: 500, 
                fontSize: "20px", 
                lineHeight: "100%", 
                letterSpacing: "0px", 
                color: "rgba(43, 43, 43, 1)",
                margin: 0,
                textAlign: "left",
              }}>
                Destination
              </label>
              <div 
                style={{ 
                  height: "56px", 
                  border: "1px solid rgba(141, 141, 141, 0.5)", 
                  borderRadius: "8px", 
                  padding: "0 16px", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "14px", 
                  background: "white" 
                }}
              >
                <Globe style={{ width: "24px", height: "24px", color: "rgba(141, 141, 141, 1)" }} className="shrink-0" />
                <input
                  type="text"
                  value={destinationSearch}
                  onChange={(e) => setDestinationSearch(e.target.value)}
                  placeholder="eg. kerala, manali, araku, ladakh"
                  style={{ 
                    flex: 1, 
                    background: "transparent", 
                    border: "none", 
                    outline: "none", 
                    fontFamily: "'Faktum', 'Outfit', sans-serif", 
                    fontWeight: 500, 
                    fontSize: "20px", 
                    lineHeight: "100%", 
                    letterSpacing: "0px", 
                    color: "rgba(43, 43, 43, 1)",
                    padding: 0
                  }}
                  className="placeholder-[rgba(141,141,141,1)]"
                />
              </div>
            </div>

            {/* Field 2: Date Range */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ 
                fontFamily: "'Faktum', 'Outfit', sans-serif", 
                fontWeight: 500, 
                fontSize: "20px", 
                lineHeight: "100%", 
                letterSpacing: "0px", 
                color: "rgba(43, 43, 43, 1)",
                margin: 0,
                textAlign: "left",
              }}>
                Date
              </label>
              <div style={{ display: "flex", flexDirection: "row", gap: "12px", width: "100%" }}>
                <div 
                  style={{ 
                    flex: 1,
                    height: "56px", 
                    border: "1px solid rgba(141, 141, 141, 0.5)", 
                    borderRadius: "8px", 
                    padding: "0 16px", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "14px", 
                    background: "white" 
                  }}
                >
                  <Calendar style={{ width: "24px", height: "24px", color: "rgba(141, 141, 141, 1)" }} className="shrink-0" />
                  <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="dd/mm/yyyy"
                    style={{ 
                      flex: 1, 
                      background: "transparent", 
                      border: "none", 
                      outline: "none", 
                      fontFamily: "'Faktum', 'Outfit', sans-serif", 
                      fontWeight: 500, 
                      fontSize: "20px", 
                      lineHeight: "100%", 
                      letterSpacing: "0px", 
                      color: "rgba(43, 43, 43, 1)",
                      padding: 0
                    }}
                    className="placeholder-[rgba(141,141,141,1)]"
                  />
                </div>
                <div 
                  style={{ 
                    flex: 1,
                    height: "56px", 
                    border: "1px solid rgba(141, 141, 141, 0.5)", 
                    borderRadius: "8px", 
                    padding: "0 16px", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "14px", 
                    background: "white" 
                  }}
                >
                  <Calendar style={{ width: "24px", height: "24px", color: "rgba(141, 141, 141, 1)" }} className="shrink-0" />
                  <input
                    type="text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="dd/mm/yyyy"
                    style={{ 
                      flex: 1, 
                      background: "transparent", 
                      border: "none", 
                      outline: "none", 
                      fontFamily: "'Faktum', 'Outfit', sans-serif", 
                      fontWeight: 500, 
                      fontSize: "20px", 
                      lineHeight: "100%", 
                      letterSpacing: "0px", 
                      color: "rgba(43, 43, 43, 1)",
                      padding: 0
                    }}
                    className="placeholder-[rgba(141,141,141,1)]"
                  />
                </div>
              </div>
            </div>

            {/* Field 3: No of Travelers */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ 
                fontFamily: "'Faktum', 'Outfit', sans-serif", 
                fontWeight: 500, 
                fontSize: "20px", 
                lineHeight: "100%", 
                letterSpacing: "0px", 
                color: "rgba(43, 43, 43, 1)",
                margin: 0,
                textAlign: "left",
              }}>
                No of Travelers
              </label>
              <div 
                style={{ 
                  height: "56px", 
                  border: "1px solid rgba(141, 141, 141, 0.5)", 
                  borderRadius: "8px", 
                  padding: "0 16px", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "14px", 
                  background: "white" 
                }}
              >
                <Users style={{ width: "24px", height: "24px", color: "rgba(141, 141, 141, 1)" }} className="shrink-0" />
                <input
                  type="text"
                  value={travelersInput}
                  onChange={(e) => setTravelersInput(e.target.value)}
                  placeholder="Enter no of visitors"
                  style={{ 
                    flex: 1, 
                    background: "transparent", 
                    border: "none", 
                    outline: "none", 
                    fontFamily: "'Faktum', 'Outfit', sans-serif", 
                    fontWeight: 500, 
                    fontSize: "20px", 
                    lineHeight: "100%", 
                    letterSpacing: "0px", 
                    color: "rgba(43, 43, 43, 1)",
                    padding: 0
                  }}
                  className="placeholder-[rgba(141,141,141,1)]"
                />
              </div>
            </div>

          </div>
        </div>

        {/* CATEGORY FILTER TABS ROW — styled to match exact Figma specs */}
        <div 
          style={{
            width: "100%",
            maxWidth: "1280px",
            height: "86px",
            paddingTop: "24px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            boxSizing: "border-box",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "32px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "row", gap: "12px", alignItems: "center" }}>
            {['All', 'Weekends', 'Treks', 'Road Trips', 'Camping'].map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat);
                    setVisiblePackagesCount(6); 
                  }}
                  style={{
                    height: "62px",
                    padding: "16px 32px",
                    borderRadius: "4px",
                    fontFamily: "'Faktum', 'Outfit', sans-serif",
                    fontWeight: 500,
                    fontSize: "24px",
                    lineHeight: "28px",
                    letterSpacing: "0px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease-in-out",
                    border: isActive ? "none" : "1px solid rgba(141, 141, 141, 0.5)",
                    background: isActive ? "rgba(29, 73, 62, 1)" : "rgba(255, 255, 255, 1)",
                    color: isActive ? "rgba(255, 255, 255, 1)" : "rgba(43, 43, 43, 1)",
                  }}
                  className="hover:scale-[1.02] active:scale-[0.98]"
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* RESULTS HEADER & FILTER DROPDOWN — styled to match exact Figma specs */}
        <div 
          style={{
            width: "100%",
            maxWidth: "1280px",
            height: "83px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            boxSizing: "border-box",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "48px",
          }}
        >
          <div 
            style={{ 
              width: "100%",
              maxWidth: "1154px",
              height: "83px",
              display: "flex", 
              flexDirection: "column", 
              gap: "4px", 
              justifyContent: "center", 
              textAlign: "left",
              boxSizing: "border-box",
            }}
          >
            <h2 style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 600,
              fontSize: "32px",
              lineHeight: "100%",
              letterSpacing: "0px",
              color: "rgba(43, 43, 43, 1)",
              margin: 0,
            }}>
              {filteredAndSortedPackages.length} Experiences across india
            </h2>
            <p style={{
              fontFamily: "'Faktum', 'Outfit', sans-serif",
              fontWeight: 500,
              fontSize: "20px",
              lineHeight: "32px",
              letterSpacing: "0px",
              color: "rgba(43, 43, 43, 1)",
              margin: 0,
            }}>
              Hand-picked by our team of seasoned travellers
            </p>
          </div>
          
          {/* Filters Toggle Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFiltersDropdown(!showFiltersDropdown)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                height: "46px",
                padding: "0 20px",
                borderRadius: "8px",
                border: "1px solid rgba(141, 141, 141, 0.5)",
                background: "white",
                fontFamily: "'Faktum', 'Outfit', sans-serif",
                fontWeight: 500,
                fontSize: "16px",
                color: "rgba(43, 43, 43, 1)",
                cursor: "pointer",
              }}
              className="hover:border-gray-400 transition-colors"
            >
              <span>Filters</span>
              <ChevronDown style={{ width: "16px", height: "16px", color: "rgba(141, 141, 141, 1)" }} />
            </button>

            {showFiltersDropdown && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200/80 rounded-[20px] shadow-xl p-6 z-40 w-[290px] sm:w-[500px] md:w-[680px] text-left animate-in fade-in slide-in-from-top-2 duration-300">
                
                {/* Clear Filters header */}
                <div className="flex justify-between items-center pb-3 mb-4 border-b border-gray-100">
                  <span className="text-[10px] font-mono font-black uppercase text-gray-400">
                    Filter Packages
                  </span>
                  {(selectedDurations.length > 0 || selectedTravelTypes.length > 0 || selectedInclusions.length > 0) && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDurations([]);
                        setSelectedTravelTypes([]);
                        setSelectedInclusions([]);
                      }}
                      className="text-[10px] font-sans font-extrabold text-[#FF623E] hover:underline cursor-pointer"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  
                  {/* Column 1: Duration */}
                  <div className="space-y-3.5 md:border-r md:border-gray-100 md:pr-4">
                    <span className="text-xs font-black text-gray-400 font-sans tracking-wide block">Duration</span>
                    <div className="space-y-1">
                      {['1-2 Days', '3-5 Days', '6-10 Days', '10+ Days'].map(dur => {
                        const isChecked = selectedDurations.includes(dur);
                        return (
                          <div 
                            key={dur} 
                            onClick={() => {
                              setSelectedDurations(prev => 
                                prev.includes(dur) ? prev.filter(d => d !== dur) : [...prev, dur]
                              );
                            }}
                            className={`flex items-center gap-3 px-2 py-1.5 rounded-lg cursor-pointer transition ${
                              isChecked ? 'bg-[#1D493E]/5 text-[#1D493E] font-bold' : 'hover:bg-gray-50 text-gray-600'
                            }`}
                          >
                            <input 
                              type="checkbox"
                              checked={isChecked}
                              readOnly
                              className="w-4 h-4 rounded border-gray-300 text-[#1D493E] focus:ring-[#1D493E]/20 cursor-pointer accent-[#1D493E]"
                            />
                            <span className="text-xs font-semibold leading-none">{dur}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Column 2: Travel Type */}
                  <div className="space-y-3.5 md:border-r md:border-gray-100 md:pr-4">
                    <span className="text-xs font-black text-gray-400 font-sans tracking-wide block">Travel Type</span>
                    <div className="space-y-1">
                      {['Solo Friendly', 'Family', 'Group', 'Corporate'].map(type => {
                        const isChecked = selectedTravelTypes.includes(type);
                        return (
                          <div 
                            key={type} 
                            onClick={() => {
                              setSelectedTravelTypes(prev => 
                                prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
                              );
                            }}
                            className={`flex items-center gap-3 px-2 py-1.5 rounded-lg cursor-pointer transition ${
                              isChecked ? 'bg-[#1D493E]/5 text-[#1D493E] font-bold' : 'hover:bg-gray-50 text-gray-600'
                            }`}
                          >
                            <input 
                              type="checkbox"
                              checked={isChecked}
                              readOnly
                              className="w-4 h-4 rounded border-gray-300 text-[#1D493E] focus:ring-[#1D493E]/20 cursor-pointer accent-[#1D493E]"
                            />
                            <span className="text-xs font-semibold leading-none">{type}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Column 3: Includes */}
                  <div className="space-y-3.5">
                    <span className="text-xs font-black text-gray-400 font-sans tracking-wide block">Includes</span>
                    <div className="space-y-1">
                      {['Meals', 'Accommodation', 'Transport', 'Guide', 'Travel Gear'].map(incl => {
                        const isChecked = selectedInclusions.includes(incl);
                        return (
                          <div 
                            key={incl} 
                            onClick={() => {
                              setSelectedInclusions(prev => 
                                prev.includes(incl) ? prev.filter(i => i !== incl) : [...prev, incl]
                              );
                            }}
                            className={`flex items-center gap-3 px-2 py-1.5 rounded-lg cursor-pointer transition ${
                              isChecked ? 'bg-[#1D493E]/5 text-[#1D493E] font-bold' : 'hover:bg-gray-50 text-gray-600'
                            }`}
                          >
                            <input 
                              type="checkbox"
                              checked={isChecked}
                              readOnly
                              className="w-4 h-4 rounded border-gray-300 text-[#1D493E] focus:ring-[#1D493E]/20 cursor-pointer accent-[#1D493E]"
                            />
                            <span className="text-xs font-semibold leading-none">{incl}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Sort Option & Actions */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-black uppercase text-gray-400">Sort By:</span>
                    <div className="flex gap-1.5">
                      {[
                        { val: 'recommended', label: 'Featured' },
                        { val: 'price-low-high', label: 'Price: Low-High' },
                        { val: 'price-high-low', label: 'Price: High-Low' },
                        { val: 'rating', label: 'Rating' }
                      ].map(opt => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => setSortBy(opt.val)}
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold border transition cursor-pointer ${
                            sortBy === opt.val 
                              ? 'bg-[#1D493E] text-white border-[#1D493E]' 
                              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setShowFiltersDropdown(false)}
                    className="bg-[#1D493E] hover:bg-[#16372f] text-white text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-lg transition cursor-pointer"
                  >
                    Apply Filters
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>

        {/* 3-COLUMN CARD GRID (Full width layout with increased sizes) */}
        {filteredAndSortedPackages.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-[20px] p-16 text-center max-w-2xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto text-gray-400">
              <Info className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#1D493E]">No experiences match your search</h3>
            <p className="text-sm text-gray-500 leading-relaxed font-semibold">
              Try typing a different destination name or changing your category tab.
            </p>
            <button
              type="button"
              onClick={() => {
                setDestinationSearch('');
                setActiveCategory('All');
                setSortBy('recommended');
              }}
              className="px-6 py-3 rounded-full bg-[#1D493E] text-white text-xs font-bold shadow hover:bg-[#15342c] transition cursor-pointer"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div 
            style={{
              width: "100%",
              maxWidth: "1280px",
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: "40px",
              gap: "52px",
            }}
            className="grid grid-cols-1 md:grid-cols-3"
          >
            {filteredAndSortedPackages.slice(0, visiblePackagesCount).map((pkg) => {
              const displayCategory = pkg.category === 'Weekend' ? 'Weekend' : 
                                      pkg.category === 'Trek' ? 'Trek' :
                                      pkg.category === 'Road Trip' ? 'Road Trip' :
                                      pkg.category === 'Camping' ? 'Camping' : 'Road Trip';

              return (
                <div 
                  key={pkg.id}
                  style={{
                    width: "100%",
                    maxWidth: "405.33px",
                    height: "695.44px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                    borderRadius: "4px",
                    background: "rgba(255, 255, 255, 1)",
                    boxSizing: "border-box",
                    position: "relative",
                  }}
                  className="group"
                >
                  {/* Card Image */}
                  <Link 
                    href={pkg.link || `/travel/package/${pkg.id}`} 
                    style={{ 
                      display: "block", 
                      position: "relative", 
                      width: "100%", 
                      height: "249.44px",
                      borderRadius: "4px",
                      overflow: "hidden"
                    }}
                  >
                    <img 
                      src={pkg.image} 
                      alt={pkg.name} 
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      className="group-hover:scale-[1.02] transition-transform duration-500"
                    />

                    {/* Best Seller Overlay */}
                    {pkg.isBestSeller && (
                      <div className="absolute top-4 left-4 bg-[#FF623E] text-white font-bold text-[10px] px-3.5 py-1.5 rounded-xs shadow-sm uppercase tracking-wider z-10">
                        Best Seller
                      </div>
                    )}
                  </Link>

                  {/* Card Content details */}
                  <div 
                    style={{ 
                      flex: 1, 
                      display: "flex", 
                      flexDirection: "column", 
                      justifyContent: "space-between", 
                      boxSizing: "border-box" 
                    }}
                  >
                    
                    {/* Upper block with badges, title, description */}
                    <div 
                      style={{ 
                        width: "100%",
                        maxWidth: "405.33px",
                        height: "183px",
                        display: "flex", 
                        flexDirection: "column", 
                        gap: "12px",
                        boxSizing: "border-box"
                      }}
                    >
                      {/* Category & Duration Row */}
                      <div 
                        style={{ 
                          width: "100%",
                          height: "28px",
                          display: "flex", 
                          flexDirection: "row", 
                          justifyContent: "space-between", 
                          alignItems: "center" 
                        }}
                      >
                        <span 
                          style={{
                            padding: "4px 12px",
                            borderRadius: "4px",
                            fontFamily: "'Faktum', 'Outfit', sans-serif",
                            fontWeight: 600,
                            fontSize: "14px",
                            color: "rgba(255, 98, 62, 1)",
                            background: "rgba(255, 98, 62, 0.1)",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            display: "inline-flex",
                            alignItems: "center",
                            height: "100%",
                          }}
                        >
                          {displayCategory}
                        </span>
                        <span 
                          style={{
                            padding: "4px 12px",
                            borderRadius: "4px",
                            fontFamily: "'Faktum', 'Outfit', sans-serif",
                            fontWeight: 600,
                            fontSize: "14px",
                            color: "rgba(29, 73, 62, 1)",
                            background: "rgba(29, 73, 62, 0.1)",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            display: "inline-flex",
                            alignItems: "center",
                            height: "100%",
                          }}
                        >
                          {pkg.durationDays} days
                        </span>
                      </div>

                       {/* Title & Price Row */}
                      <Link 
                        href={pkg.link || `/travel/package/${pkg.id}`} 
                        style={{ 
                          width: "100%",
                          height: "35px",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          textDecoration: "none",
                        }}
                        className="group"
                      >
                        <h3 
                          style={{
                            flex: 1,
                            height: "30px",
                            fontFamily: "'Faktum', 'Outfit', sans-serif",
                            fontWeight: 600,
                            fontSize: "24px",
                            lineHeight: "30px",
                            letterSpacing: "0px",
                            color: "rgba(43, 43, 43, 1)",
                            margin: 0,
                            display: "flex",
                            alignItems: "center",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={pkg.name}
                        >
                          {pkg.name}
                        </h3>
                        <span 
                          style={{
                            flexShrink: 0,
                            height: "35px",
                            fontFamily: "'Faktum', 'Outfit', sans-serif",
                            fontWeight: 600,
                            fontSize: "28px",
                            lineHeight: "35px",
                            letterSpacing: "0px",
                            color: "rgba(43, 43, 43, 1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            marginLeft: "16px",
                          }}
                        >
                          ₹{pkg.price.toLocaleString('en-IN')}/Person
                        </span>
                      </Link>

                      {/* Description */}
                      <p 
                        style={{
                          width: "100%",
                          maxWidth: "405.33px",
                          height: "96px",
                          fontFamily: "'Faktum', 'Outfit', sans-serif",
                          fontWeight: 500,
                          fontSize: "20px",
                          lineHeight: "32px",
                          letterSpacing: "0px",
                          color: "rgba(141, 141, 141, 1)",
                          margin: 0,
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {pkg.description}
                      </p>
                    </div>

                    {/* 2x2 Details Grid matching Figma spec */}
                    <div 
                      style={{ 
                        width: "100%",
                        maxWidth: "405.33px",
                        height: "136px",
                        display: "grid", 
                        gridTemplateColumns: "repeat(2, 1fr)", 
                        alignContent: "space-between",
                        paddingTop: "16px",
                        boxSizing: "border-box"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", height: "56px", boxSizing: "border-box" }}>
                        <div style={{ width: "46px", height: "46px", borderRadius: "4px", background: "rgba(246, 243, 238, 1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <MapPin style={{ width: "16px", height: "16px", color: "rgba(43, 43, 43, 1)" }} />
                        </div>
                        <span style={{ fontFamily: "'Faktum', 'Outfit', sans-serif", fontWeight: 500, fontSize: "20px", color: "rgba(43, 43, 43, 1)", lineHeight: "28px", display: "inline-block", verticalAlign: "middle" }}>
                          Starts from {pkg.startPoint || 'Srinagar'}
                        </span>
                      </div>
                      
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", height: "56px", boxSizing: "border-box" }}>
                        <div style={{ width: "46px", height: "46px", borderRadius: "4px", background: "rgba(246, 243, 238, 1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Users style={{ width: "16px", height: "16px", color: "rgba(43, 43, 43, 1)" }} />
                        </div>
                        <span style={{ fontFamily: "'Faktum', 'Outfit', sans-serif", fontWeight: 500, fontSize: "20px", color: "rgba(43, 43, 43, 1)", lineHeight: "28px", display: "inline-block", verticalAlign: "middle" }}>
                          {pkg.groupType || 'Curated group Trip'}
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "12px", height: "56px", boxSizing: "border-box" }}>
                        <div style={{ width: "46px", height: "46px", borderRadius: "4px", background: "rgba(246, 243, 238, 1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <ArrowUpRight style={{ width: "16px", height: "16px", color: "rgba(43, 43, 43, 1)" }} />
                        </div>
                        <span style={{ fontFamily: "'Faktum', 'Outfit', sans-serif", fontWeight: 500, fontSize: "20px", color: "rgba(43, 43, 43, 1)", lineHeight: "28px", display: "inline-block", verticalAlign: "middle" }}>
                          {pkg.difficulty || 'Moderate'} Difficulty
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "12px", height: "56px", boxSizing: "border-box" }}>
                        <div style={{ width: "46px", height: "46px", borderRadius: "4px", background: "rgba(246, 243, 238, 1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Calendar style={{ width: "16px", height: "16px", color: "rgba(43, 43, 43, 1)" }} />
                        </div>
                        <span style={{ fontFamily: "'Faktum', 'Outfit', sans-serif", fontWeight: 500, fontSize: "20px", color: "rgba(43, 43, 43, 1)", lineHeight: "28px", display: "inline-block", verticalAlign: "middle" }}>
                          Next: {pkg.nextDeparture || 'Aug, 2026'}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action buttons */}
                    <div 
                      style={{ 
                        width: "100%",
                        maxWidth: "405.33px",
                        height: "55px",
                        display: "flex", 
                        gap: "12px",
                        boxSizing: "border-box"
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleOpenBookingDrawer(pkg)}
                        style={{
                          flex: 1,
                          height: "55px",
                          borderRadius: "4px",
                          background: "rgba(29, 73, 62, 1)",
                          color: "white",
                          fontFamily: "'Faktum', 'Outfit', sans-serif",
                          fontWeight: 600,
                          fontSize: "16px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          border: "none",
                          cursor: "pointer",
                        }}
                        className="hover:bg-[#15342c] transition-colors"
                      >
                        Book Now
                      </button>
                      
                      <Link 
                        href={pkg.link || `/travel/package/${pkg.id}`}
                        style={{
                          flex: 1,
                          height: "55px",
                          borderRadius: "4px",
                          border: "1px solid rgba(29, 73, 62, 1)",
                          background: "white",
                          color: "rgba(29, 73, 62, 1)",
                          fontFamily: "'Faktum', 'Outfit', sans-serif",
                          fontWeight: 600,
                          fontSize: "16px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textDecoration: "none",
                        }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        Get details
                      </Link>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load more button */}
        {filteredAndSortedPackages.length > visiblePackagesCount && (
          <div className="pt-8 text-center">
            <button
              type="button"
              onClick={() => setVisiblePackagesCount(prev => prev + 3)}
              className="px-8 py-3 rounded-md border border-gray-300 bg-white hover:border-gray-400 text-xs font-bold text-gray-700 transition cursor-pointer"
            >
              Load more
            </button>
          </div>
        )}

      </section>

      {/* 2. HOW TO BOOK YOUR TOUR SECTION (max-w-[1440px]) */}
      <section className="bg-white border-t border-gray-200 py-24 relative z-10">
        <div className="max-w-[1440px] mx-auto px-5 md:px-[80px] space-y-16">
          
          <div className="text-center space-y-3">
            <span className="inline-block text-[#FF623E] font-extrabold text-xs uppercase tracking-[0.2em]">
              Discover Your Path
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-[#1D493E]">
              How to book your <span className="text-[#FF623E] font-serif font-normal">Tour</span>
            </h2>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto font-medium">
              Curated journeys for the modern nomad, designed to push boundaries and discover India's hidden heart
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            
            {/* Left side: Large featured Srinagar to Leh Card matching Figma */}
            <Link 
              href="/travel/srinagar-to-leh" 
              className="relative block h-[520px] rounded-[16px] overflow-hidden border border-gray-200 shadow-sm group"
            >
              <img 
                src="/travel-leh-2.jpg" 
                alt="Srinagar to Leh Camels Nubra" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.01] transition duration-700 opacity-95"
              />

              {/* Best Seller red badge */}
              <div className="absolute top-6 left-6 bg-[#FF623E] text-white font-bold text-[10px] px-3.5 py-1.5 rounded-xs shadow-md uppercase tracking-wider z-10">
                Best Seller
              </div>

              {/* Card overlay details with bottom container matching Figma */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-6 space-y-2 text-left">
                <div className="flex justify-between items-center text-white">
                  <h3 className="text-xl font-sans font-black tracking-wide">
                    Srinagar to Leh
                  </h3>
                  <span className="text-xl font-sans font-black">
                    ₹22,900/Person
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                  Experience the iconic highway journey crossing high mountain passes and sapphire lakes.
                </p>
              </div>
            </Link>

            {/* Right side: 4 step list matching Figma */}
            <div className="space-y-8 text-left">
              {[
                { num: '01', title: 'Choose a package', desc: 'Select the best tour package that matches your schedule and lifestyle' },
                { num: '02', title: 'Check availability', desc: 'Select the best tour package that matches your schedule and lifestyle' },
                { num: '03', title: 'Make a reservation', desc: 'Select the best tour package that matches your schedule and lifestyle' },
                { num: '04', title: 'Enjoy your experience', desc: 'Select the best tour package that matches your schedule and lifestyle' }
              ].map((step) => (
                <div key={step.num} className="flex gap-6 items-center">
                  <div className="w-[72px] h-[72px] bg-[#FAF9F6] border border-gray-150/40 rounded-lg flex items-center justify-center text-[#1D493E] font-serif text-2xl font-normal shrink-0">
                    {step.num}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-serif font-bold text-[#1D493E]">{step.title}</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* 3. CAPTURED MEMORIES TESTIMONIALS SECTION (max-w-[1440px]) */}
      <section className="bg-white border-t border-gray-200 py-24 relative z-10">
        <div className="max-w-[1440px] mx-auto px-5 md:px-[80px] space-y-16">
          
          <div className="text-center space-y-3">
            <span className="inline-block text-[#FF623E] font-bold text-xs uppercase tracking-widest">
              Captured Memories
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-[#1D493E]">
              Capture your adventurous travel <span className="text-[#FF623E] font-serif font-normal">Forever</span>
            </h2>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto font-semibold">
              Curated journeys for the modern nomad, designed to push boundaries and discover India's hidden heart
            </p>
          </div>

          {/* Testimonial grid (Increased text sizes) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Column 1 (Faded) */}
            <div className="space-y-8 md:opacity-40 hover:opacity-100 transition duration-300">
              {[TESTIMONIALS[0], TESTIMONIALS[3]].map((test, i) => (
                <div key={i} className="bg-gray-50 border border-gray-100 p-8 rounded-2xl space-y-5 text-left shadow-2xs">
                  <div className="flex gap-0.5 text-yellow-500">
                    {Array.from({ length: test.rating }).map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-yellow-500 stroke-none" />
                    ))}
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 font-medium italic leading-relaxed">
                    {test.quote}
                  </p>
                  <div className="flex items-center gap-3.5 pt-2">
                    <img src={test.avatar} alt={test.author} className="w-12 h-12 rounded-full object-cover shrink-0" />
                    <div>
                      <h4 className="text-sm font-extrabold text-gray-800">{test.author}</h4>
                      <p className="text-xs text-gray-400 font-semibold">{test.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Column 2 (Active/Sharp) */}
            <div className="space-y-8">
              {[TESTIMONIALS[1], TESTIMONIALS[4]].map((test, i) => (
                <div key={i} className="bg-white border border-gray-200 p-8 rounded-2xl space-y-5 text-left shadow-xs scale-102">
                  <div className="flex gap-0.5 text-yellow-500">
                    {Array.from({ length: test.rating }).map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-yellow-500 stroke-none" />
                    ))}
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 font-bold italic leading-relaxed">
                    {test.quote}
                  </p>
                  <div className="flex items-center gap-3.5 pt-2">
                    <img src={test.avatar} alt={test.author} className="w-12 h-12 rounded-full object-cover shrink-0" />
                    <div>
                      <h4 className="text-sm font-black text-gray-800">{test.author}</h4>
                      <p className="text-xs text-[#1D493E]/60 font-black">{test.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Column 3 (Faded) */}
            <div className="space-y-8 md:opacity-40 hover:opacity-100 transition duration-300">
              {[TESTIMONIALS[2], TESTIMONIALS[5]].map((test, i) => (
                <div key={i} className="bg-gray-50 border border-gray-100 p-8 rounded-2xl space-y-5 text-left shadow-2xs">
                  <div className="flex gap-0.5 text-yellow-500">
                    {Array.from({ length: test.rating }).map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-yellow-500 stroke-none" />
                    ))}
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 font-medium italic leading-relaxed">
                    {test.quote}
                  </p>
                  <div className="flex items-center gap-3.5 pt-2">
                    <img src={test.avatar} alt={test.author} className="w-12 h-12 rounded-full object-cover shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">{test.author}</h4>
                      <p className="text-xs text-gray-400 font-semibold">{test.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* 4. SLIDING CHECKOUT / BOOKING DRAWER */}
      {activeBookPkg && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            onClick={() => setActiveBookPkg(null)}
            className="absolute inset-0 bg-[#0A1D19]/40 backdrop-blur-md transition-opacity duration-500"
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[#FAF9F6] border-l-4 border-[#1D493E] shadow-2xl flex flex-col justify-between">
              
              <div className="p-6 border-b border-[#1D493E]/10 flex items-center justify-between bg-[#0A1D19] text-white">
                <div className="space-y-0.5 text-left">
                  <span className="text-[8px] font-mono text-[#FFFF80] uppercase tracking-widest font-black">Expedition Checkout</span>
                  <h3 className="text-lg font-serif font-bold text-white leading-tight">Configure Your Stay</h3>
                </div>
                <button 
                  onClick={() => setActiveBookPkg(null)}
                  className="p-2 rounded-full hover:bg-white/10 text-white/75 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left">
                <div className="flex gap-4 p-4 border border-[#1D493E]/10 bg-white rounded-2xl">
                  <img src={activeBookPkg.image} alt={activeBookPkg.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                  <div className="space-y-1 overflow-hidden">
                    <span className="text-[9px] font-mono font-black text-[#FF623E] uppercase">{activeBookPkg.destination} • {activeBookPkg.duration}</span>
                    <h4 className="font-serif font-bold text-sm text-[#1D493E] truncate">{activeBookPkg.name}</h4>
                    <span className="text-xs font-mono font-black text-[#1D493E]/70 block">₹{activeBookPkg.price.toLocaleString('en-IN')} <span className="text-[9px] text-gray-400 font-normal">/ person</span></span>
                  </div>
                </div>

                <form onSubmit={handleConfirmBooking} className="space-y-6">
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-mono font-black uppercase tracking-wider text-[#1D493E]/60 block flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#FF623E]" /> Confirm Travel Date
                    </label>
                    <input 
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-[#1D493E] bg-white text-xs font-bold text-[#1D493E] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[10px] font-mono font-black uppercase tracking-wider text-[#1D493E]/60 block flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#FF623E]" /> Number of Guests
                    </label>
                    <div className="flex items-center justify-between p-3 border-2 border-[#1D493E] bg-white rounded-xl">
                      <span className="text-xs font-bold">Total Travelers</span>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setBookingGuests(prev => Math.max(1, prev - 1))}
                          className="w-8 h-8 rounded-full border border-[#1D493E]/20 flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-black w-4 text-center">{bookingGuests}</span>
                        <button
                          type="button"
                          onClick={() => setBookingGuests(prev => Math.min(10, prev + 1))}
                          className="w-8 h-8 rounded-full border border-[#1D493E]/20 flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
                    <div className="flex items-start gap-2 text-[11px] text-gray-500">
                      <ShieldCheck className="w-4 h-4 text-[#1D493E] mt-0.5 shrink-0" />
                      <span>Flexible changes allowed up to 15 days before travel.</span>
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-[#1D493E]/10 bg-white space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-mono font-black text-gray-400 uppercase tracking-wider block">Estimated Cost</span>
                    <span className="text-[11px] text-gray-400 font-bold block">₹{activeBookPkg.price.toLocaleString('en-IN')} × {bookingGuests} guests</span>
                  </div>
                  <span className="text-2xl font-black font-mono text-[#1D493E]">
                    ₹{(activeBookPkg.price * bookingGuests).toLocaleString('en-IN')}
                  </span>
                </div>

                {bookedSuccess ? (
                  <div className="w-full py-3.5 rounded-xl bg-[#f3faf5] border-2 border-[#1D493E] flex items-center justify-center gap-2 text-[#1D493E] font-bold text-xs">
                    <CheckCircle2 className="w-5 h-5 text-[#1D493E] animate-bounce" />
                    <span>Added to Steamer Trunk!</span>
                  </div>
                ) : (
                  <button
                    onClick={handleConfirmBooking}
                    className="w-full py-4 rounded-xl bg-[#FF623E] hover:bg-[#c94527] border border-[#1D493E] text-white text-xs font-black uppercase tracking-widest transition shadow-[4px_4px_0px_0px_#1D493E] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[0px] active:translate-y-[0px] cursor-pointer"
                  >
                    Add to Steamer Trunk
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 5. BESPOKE INQUIRY MODAL (FOR DETAILED CONTENT INQUIRIES) */}
      {activeInquiryPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setActiveInquiryPkg(null)}
            className="absolute inset-0 bg-[#0A1D19]/40 backdrop-blur-md transition-opacity duration-500 animate-in fade-in"
          />

          <div className="relative w-full max-w-lg bg-[#FAF9F6] border-4 border-[#1D493E] p-8 md:p-10 rounded-[32px] shadow-[8px_8px_0px_0px_#1D493E] overflow-hidden z-10 animate-in zoom-in-95 duration-300 text-left">
            <button
              onClick={() => setActiveInquiryPkg(null)}
              className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 text-[#1D493E] transition border border-transparent hover:border-[#1D493E] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {inquirySuccess ? (
              <div className="py-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-[#f3faf5] border-2 border-[#1D493E] flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8 text-[#1D493E]" />
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] font-mono font-black uppercase tracking-wider text-[#FF623E] bg-[#FF623E]/10 px-3 py-1 rounded-full">
                    Inquiry Confirmed
                  </span>
                  <h3 className="text-3xl font-serif font-black text-[#1D493E]">Tribe Notification Sent</h3>
                  <p className="text-[#1D493E]/70 text-xs md:text-sm leading-relaxed max-w-sm mx-auto font-semibold">
                    We have received your custom slow-travel request for <strong className="text-[#1D493E]">{activeInquiryPkg.destination}</strong>. Our local curators will email you a hand-crafted bespoke itinerary draft within 24 hours.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <span className="text-[9px] font-mono font-black uppercase tracking-[0.2em] text-[#FF623E] bg-[#FF623E]/10 px-3 py-1 rounded-full">
                    Go Banjāra Bespoke
                  </span>
                  <h3 className="text-3xl font-serif font-bold text-[#1D493E] tracking-tight">
                    Custom {activeInquiryPkg.destination} Inquiry
                  </h3>
                  <p className="text-[#1D493E]/70 text-xs leading-relaxed max-w-sm mx-auto font-semibold">
                    Let our local coordinators design a slow, hand-crafted itinerary tailored strictly to your rhythm.
                  </p>
                </div>

                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono font-black text-[#1D493E]/65 uppercase block">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={inquiryForm.name}
                        onChange={(e) => setInquiryForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Rohan Dev"
                        className="w-full px-4 py-3 rounded-xl border-2 border-[#1D493E] bg-white text-xs font-bold text-[#1D493E]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono font-black text-[#1D493E]/65 uppercase block">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={inquiryForm.email}
                        onChange={(e) => setInquiryForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="e.g. rohan@domain.com"
                        className="w-full px-4 py-3 rounded-xl border-2 border-[#1D493E] bg-white text-xs font-bold text-[#1D493E]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono font-black text-[#1D493E]/65 uppercase block">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      value={inquiryForm.phone}
                      onChange={(e) => setInquiryForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl border-2 border-[#1D493E] bg-white text-xs font-bold text-[#1D493E]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono font-black text-[#1D493E]/65 uppercase block">Special Requests / Pace Preference</label>
                    <textarea 
                      value={inquiryForm.notes}
                      onChange={(e) => setInquiryForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="e.g. We prefer quiet nature walks, culinary sessions, and starting our excursions after 10:00 AM..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border-2 border-[#1D493E] bg-white text-xs font-medium text-[#1D493E] placeholder-gray-400 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingInquiry}
                    className="w-full py-4 rounded-2xl bg-[#FF623E] hover:bg-[#c94527] text-white text-[10px] font-black uppercase tracking-widest transition duration-300 shadow-[4px_4px_0px_0px_#1D493E] hover:translate-x-[-2px] hover:translate-y-[-2px] border border-[#1D493E] cursor-pointer"
                  >
                    {isSubmittingInquiry ? 'Sending to Curators...' : 'Submit Inquiry Request'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
