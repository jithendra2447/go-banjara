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
    quote: "“Exploring Spiti Valley with Go Banjara was a life-changing journey. Flawless planning, cozy homestays, and a wonderful group of fellow travelers. Highly recommended!”",
    author: "Kiran Makwan",
    role: "Verified Wanderer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    rating: 5,
    quote: "“The Kerala Backwaters & Munnar Hills trip was breathtaking. The coordination was flawless, and the local guides showed us hidden trails away from all the tourists!”",
    author: "Priya Nair",
    role: "Solo Backpacker",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
  },
  {
    rating: 5,
    quote: "“The Kashmir Road Trip package was pure magic. Extremely well-planned with authentic local homestays and off-the-beaten-path trails. Will book again!”",
    author: "Rohan Sharma",
    role: "Motorcycle Nomad",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    rating: 5,
    quote: "“The Meghalaya backpacking trip exceeded all expectations. Exploring the living root bridges and walking behind waterfalls with Go Banjara's guides felt like a dream!”",
    author: "Amit Verma",
    role: "Adventure Enthusiast",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    rating: 5,
    quote: "“Laka Glacier and Triund trek was my first ever trek. The trek leaders were so patient, encouraging, and made sure everyone made it to the top safely. Incredible vibe!”",
    author: "Divya Hegde",
    role: "Mountain Trekker",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    rating: 5,
    quote: "“Rajasthan Heritage Tour was a perfect blend of slow-travel and rich historical exploration. Boutique heritage stays and tasting authentic local food was absolute bliss!”",
    author: "Kabir Sen",
    role: "Cultural Explorer",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80"
  }
];

const FAQ_ITEMS = [
  {
    question: "What is Go Banjara?",
    answer: "Go Banjara is a premium adventure and outdoor lifestyle brand. We design highly curated slow-travel experiences and manufacture high-quality heritage outdoor gear, apparel, and collectible badges for modern nomads and explorers."
  },
  {
    question: "How do I book a travel package?",
    answer: "Browse our Curated Journeys, choose your package, check availability, and submit an inquiry or book directly. Our travel coordinators will handle all permits, boutique stays, and local transportation."
  },
  {
    question: "What is your gear return policy?",
    answer: "We offer a 30-day hassle-free return policy on all unworn clothing and unused gear in original packaging. Travel package bookings have separate cancellation policies detailed during checkout."
  },
  {
    question: "Do you support local communities?",
    answer: "Yes, community empowerment is at our core. 15% of all travel package revenues go directly to supporting local family homestays, native mountain guides, and indigenous craft cooperatives in Kashmir and Kerala."
  },
  {
    question: "What materials are the badges made from? Zinc alloy with glossy enamel fill.",
    answer: "All our collectible badges are stamped from premium zinc alloy with glossy enamel fill and butterfly clutch backings, built to last a lifetime of rugged exploration."
  }
];

export default function HolidaysPortal() {
  const { addToCart, setCartOpen } = useCart();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

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
          // Always sync the name, description, category, and other layout-critical fields from default packages
          const item = merged[foundIdx];
          if (
            item.name !== hp.name || 
            item.description !== hp.description || 
            item.price === undefined || 
            !item.routeList || 
            !item.itinerary
          ) {
            merged[foundIdx] = {
              ...item,
              name: hp.name,
              description: hp.description,
              category: hp.category,
              durationDays: hp.durationDays,
              duration: hp.duration
            };
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
      
      {/* Header Section wrapper */}
      <div
        style={{
          width: "100%",
          maxWidth: "1440px",
          background: "rgba(255, 255, 255, 1)",
          boxSizing: "border-box",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
        className="px-6 md:px-20 pt-10 pb-6"
      >
        {/* Header Title block */}
        <div 
          style={{
            width: "100%",
            maxWidth: "1280px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "0 auto",
            gap: "16px",
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
              letterSpacing: "0px",
              textAlign: "center",
              color: "rgba(29, 73, 62, 1)",
              margin: 0,
            }}
            className="text-3xl md:text-[42px] leading-tight"
          >
            Available <span style={{ color: "rgba(255, 98, 62, 1)", fontWeight: 600 }}>Packages</span>
          </h1>
          <p 
            style={{
              width: "100%",
              maxWidth: "1280px",
              fontFamily: "'Faktum', 'Outfit', sans-serif",
              fontWeight: 500,
              letterSpacing: "0px",
              textAlign: "center",
              color: "rgba(43, 43, 43, 1)",
              margin: 0,
            }}
            className="text-sm sm:text-base md:text-[24px] leading-relaxed md:leading-[32px]"
          >
            Curated journeys for the modern nomad, designed to push boundaries and discover India's hidden heart
          </p>
        </div>
      </div>

      {/* 1. AVAILABLE PACKAGES CONTENT SECTION */}
      <section id="available-packages" className="max-w-[1440px] mx-auto px-5 md:px-[80px] pt-10 pb-12 space-y-10">

        {/* SEARCH WIDGET CARD (Spans full width, styled to match exact Figma specs) */}
        <div 
          style={{
            width: "100%",
            maxWidth: "1280px",
            borderRadius: "12px",
            border: "1px solid rgba(255, 98, 62, 1)",
            boxShadow: "0px 4px 12px 0px rgba(255, 98, 62, 0.24)",
            padding: "24px",
            background: "rgba(255, 255, 255, 1)",
            boxSizing: "border-box",
            marginLeft: "auto",
            marginRight: "auto",
          }}
          className="text-left relative z-30 h-auto"
        >
          <div className="w-full flex flex-col md:flex-row gap-6 items-stretch md:items-center">
            
            {/* Field 1: Destination */}
            <div className="flex-1 md:flex-[1] flex flex-col gap-2">
              <label style={{ 
                fontFamily: "'Faktum', 'Outfit', sans-serif", 
                fontWeight: 500, 
                lineHeight: "100%", 
                letterSpacing: "0px", 
                color: "rgba(43, 43, 43, 1)",
                margin: 0,
                textAlign: "left",
              }} className="text-sm sm:text-base md:text-[20px]">
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
                    lineHeight: "100%", 
                    letterSpacing: "0px", 
                    color: "rgba(43, 43, 43, 1)",
                    padding: 0
                  }}
                  className="placeholder-[rgba(141,141,141,1)] text-sm sm:text-base md:text-[20px]"
                />
              </div>
            </div>

            {/* Field 2: Date Range */}
            <div className="flex-1 md:flex-[1.8] flex flex-col gap-2">
              <label style={{ 
                fontFamily: "'Faktum', 'Outfit', sans-serif", 
                fontWeight: 500, 
                lineHeight: "100%", 
                letterSpacing: "0px", 
                color: "rgba(43, 43, 43, 1)",
                margin: 0,
                textAlign: "left",
              }} className="text-sm sm:text-base md:text-[20px]">
                Date
              </label>
              <div className="w-full flex flex-col sm:flex-row gap-3">
                <div 
                  className="flex-1 h-[56px] border border-[rgba(141,141,141,0.5)] rounded-[8px] px-3 sm:px-4 flex items-center gap-2 sm:gap-3 bg-white"
                >
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-[rgba(141,141,141,1)] shrink-0" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    onClick={(e) => {
                      try {
                        e.currentTarget.showPicker();
                      } catch (err) {}
                    }}
                    onFocus={(e) => {
                      try {
                        e.currentTarget.showPicker();
                      } catch (err) {}
                    }}
                    placeholder="dd/mm/yyyy"
                    style={{ 
                      flex: 1, 
                      background: "transparent", 
                      border: "none", 
                      outline: "none", 
                      fontFamily: "'Faktum', 'Outfit', sans-serif", 
                      fontWeight: 500, 
                      lineHeight: "100%", 
                      letterSpacing: "0px", 
                      color: "rgba(43, 43, 43, 1)",
                      padding: 0,
                      cursor: "pointer",
                      textAlign: "center"
                    }}
                    className="placeholder-[rgba(141,141,141,1)] hide-calendar-picker-icon text-sm sm:text-base md:text-[20px] w-full text-center"
                  />
                </div>
                <div 
                  className="flex-1 h-[56px] border border-[rgba(141,141,141,0.5)] rounded-[8px] px-3 sm:px-4 flex items-center gap-2 sm:gap-3 bg-white"
                >
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-[rgba(141,141,141,1)] shrink-0" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    onClick={(e) => {
                      try {
                        e.currentTarget.showPicker();
                      } catch (err) {}
                    }}
                    onFocus={(e) => {
                      try {
                        e.currentTarget.showPicker();
                      } catch (err) {}
                    }}
                    placeholder="dd/mm/yyyy"
                    style={{ 
                      flex: 1, 
                      background: "transparent", 
                      border: "none", 
                      outline: "none", 
                      fontFamily: "'Faktum', 'Outfit', sans-serif", 
                      fontWeight: 500, 
                      lineHeight: "100%", 
                      letterSpacing: "0px", 
                      color: "rgba(43, 43, 43, 1)",
                      padding: 0,
                      cursor: "pointer",
                      textAlign: "center"
                    }}
                    className="placeholder-[rgba(141,141,141,1)] hide-calendar-picker-icon text-sm sm:text-base md:text-[20px] w-full text-center"
                  />
                </div>
              </div>
            </div>

            {/* Field 3: No of Travelers */}
            <div className="flex-1 md:flex-[1] flex flex-col gap-2">
              <label style={{ 
                fontFamily: "'Faktum', 'Outfit', sans-serif", 
                fontWeight: 500, 
                lineHeight: "100%", 
                letterSpacing: "0px", 
                color: "rgba(43, 43, 43, 1)",
                margin: 0,
                textAlign: "left",
              }} className="text-sm sm:text-base md:text-[20px]">
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
                    lineHeight: "100%", 
                    letterSpacing: "0px", 
                    color: "rgba(43, 43, 43, 1)",
                    padding: 0
                  }}
                  className="placeholder-[rgba(141,141,141,1)] text-sm sm:text-base md:text-[20px]"
                />
              </div>
            </div>

          </div>
        </div>

        {/* CATEGORY FILTER TABS ROW */}
        <div 
          style={{
            width: "100%",
            maxWidth: "1280px",
            boxSizing: "border-box",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "32px",
          }}
          className="overflow-x-auto scrollbar-none pb-2"
        >
          <div className="flex flex-row gap-3 items-center min-w-max">
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
                    borderRadius: "4px",
                    fontFamily: "'Faktum', 'Outfit', sans-serif",
                    fontWeight: 500,
                    letterSpacing: "0px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease-in-out",
                    border: isActive ? "none" : "1px solid rgba(141, 141, 141, 0.5)",
                    background: isActive ? "rgba(29, 73, 62, 1)" : "rgba(255, 255, 255, 1)",
                    color: isActive ? "rgba(255, 255, 255, 1)" : "rgba(43, 43, 43, 1)",
                  }}
                  className="hover:scale-[1.02] active:scale-[0.98] h-auto px-5 py-2.5 sm:px-8 sm:py-3.5 text-base sm:text-lg md:text-[24px]"
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* RESULTS HEADER & FILTER DROPDOWN */}
        <div 
          style={{
            width: "100%",
            maxWidth: "1280px",
            boxSizing: "border-box",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "48px",
          }}
          className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center"
        >
          <div 
            style={{ 
              width: "100%",
              maxWidth: "1154px",
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
              letterSpacing: "0px",
              color: "rgba(43, 43, 43, 1)",
              margin: 0,
            }} className="text-xl sm:text-2xl md:text-[32px] leading-tight">
              {filteredAndSortedPackages.length} Experiences across india
            </h2>
            <p style={{
              fontFamily: "'Faktum', 'Outfit', sans-serif",
              fontWeight: 500,
              letterSpacing: "0px",
              color: "rgba(43, 43, 43, 1)",
              margin: 0,
            }} className="text-sm sm:text-base md:text-[20px] leading-relaxed">
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
              <div 
                className="absolute right-0 top-full mt-2 z-40 text-left flex flex-col animate-in fade-in slide-in-from-top-2 duration-300 w-screen max-w-[912px] md:w-[912px] bg-transparent"
              >
                {/* 3 Columns Row */}
                <div 
                  style={{
                    boxShadow: "0px 4px 12px 0px rgba(0, 0, 0, 0.25)",
                    borderRadius: "4px",
                  }}
                  className="flex flex-col md:flex-row items-stretch w-full h-auto md:h-[286px] bg-transparent overflow-hidden"
                >
                  {/* Column 1: Duration */}
                  <div 
                    style={{
                      width: "304px",
                      height: "286px",
                      padding: "8px",
                      background: "#FFFFFF",
                      borderColor: "rgba(204, 204, 204, 0.54)",
                      borderStyle: "solid",
                      borderWidth: "1px 0px 1px 1px",
                      borderTopLeftRadius: "4px",
                      borderBottomLeftRadius: "4px",
                      boxSizing: "border-box",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    <span 
                      style={{ 
                        fontFamily: "'Faktum', 'Outfit', sans-serif",
                        color: "rgba(141, 141, 141, 1)",
                        fontSize: "18px",
                        fontWeight: 500,
                        paddingLeft: "16px",
                        paddingTop: "12px",
                        paddingBottom: "4px",
                      }} 
                      className="tracking-wide block"
                    >
                      Duration
                    </span>
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
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-[4px] cursor-pointer transition ${
                              isChecked ? 'bg-[#1D493E]/5 text-[#1D493E] font-bold' : 'hover:bg-gray-50 text-[#2B2B2B]'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-[2px] border ${isChecked ? 'bg-[#1D493E] border-[#1D493E]' : 'border-gray-300 bg-white'} flex items-center justify-center shrink-0 transition-colors`}>
                              {isChecked && (
                                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span 
                              style={{ 
                                fontFamily: "Faktum, sans-serif",
                                fontWeight: 500,
                                fontSize: "18px",
                                lineHeight: "100%",
                              }} 
                              className="leading-none text-[#2B2B2B]"
                            >
                              {dur}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Column 2: Travel Type */}
                  <div 
                    style={{
                      width: "304px",
                      height: "286px",
                      padding: "8px",
                      background: "#FFFFFF",
                      borderColor: "rgba(204, 204, 204, 0.54)",
                      borderStyle: "solid",
                      borderWidth: "1px 0px 1px 1px",
                      boxSizing: "border-box",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    <span 
                      style={{ 
                        fontFamily: "'Faktum', 'Outfit', sans-serif",
                        color: "rgba(141, 141, 141, 1)",
                        fontSize: "18px",
                        fontWeight: 500,
                        paddingLeft: "16px",
                        paddingTop: "12px",
                        paddingBottom: "4px",
                      }} 
                      className="tracking-wide block"
                    >
                      Travel Type
                    </span>
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
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-[4px] cursor-pointer transition ${
                              isChecked ? 'bg-[#1D493E]/5 text-[#1D493E] font-bold' : 'hover:bg-gray-50 text-[#2B2B2B]'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-[2px] border ${isChecked ? 'bg-[#1D493E] border-[#1D493E]' : 'border-gray-300 bg-white'} flex items-center justify-center shrink-0 transition-colors`}>
                              {isChecked && (
                                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span 
                              style={{ 
                                fontFamily: "Faktum, sans-serif",
                                fontWeight: 500,
                                fontSize: "18px",
                                lineHeight: "100%",
                              }} 
                              className="leading-none text-[#2B2B2B]"
                            >
                              {type}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Column 3: Includes */}
                  <div 
                    style={{
                      width: "304px",
                      height: "286px",
                      padding: "8px",
                      background: "#FFFFFF",
                      borderColor: "rgba(204, 204, 204, 0.54)",
                      borderStyle: "solid",
                      borderWidth: "1px 1px 1px 1px",
                      borderTopRightRadius: "4px",
                      borderBottomRightRadius: "4px",
                      boxSizing: "border-box",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    <span 
                      style={{ 
                        fontFamily: "'Faktum', 'Outfit', sans-serif",
                        color: "rgba(141, 141, 141, 1)",
                        fontSize: "18px",
                        fontWeight: 500,
                        paddingLeft: "16px",
                        paddingTop: "12px",
                        paddingBottom: "4px",
                      }} 
                      className="tracking-wide block"
                    >
                      Includes
                    </span>
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
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-[4px] cursor-pointer transition ${
                              isChecked ? 'bg-[#1D493E]/5 text-[#1D493E] font-bold' : 'hover:bg-gray-50 text-[#2B2B2B]'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-[2px] border ${isChecked ? 'bg-[#1D493E] border-[#1D493E]' : 'border-gray-300 bg-white'} flex items-center justify-center shrink-0 transition-colors`}>
                              {isChecked && (
                                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span 
                              style={{ 
                                fontFamily: "Faktum, sans-serif",
                                fontWeight: 500,
                                fontSize: "18px",
                                lineHeight: "100%",
                              }} 
                              className="leading-none text-[#2B2B2B]"
                            >
                              {incl}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
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
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center"
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
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                    borderRadius: "4px",
                    background: "rgba(255, 255, 255, 1)",
                    boxSizing: "border-box",
                    position: "relative",
                  }}
                  className="group h-auto min-h-[695px] pb-4"
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
                      boxSizing: "border-box",
                      gap: "20px"
                    }}
                  >
                    
                    {/* Upper block with badges, title, description */}
                    <div 
                      style={{ 
                        width: "100%",
                        maxWidth: "405.33px",
                        display: "flex", 
                        flexDirection: "column", 
                        gap: "12px",
                        boxSizing: "border-box"
                      }}
                      className="h-auto md:h-[183px]"
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
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          textDecoration: "none",
                        }}
                        className="group h-auto min-h-[35px]"
                      >
                        <h3 
                          style={{
                            flex: 1,
                            fontFamily: "'Faktum', 'Outfit', sans-serif",
                            fontWeight: 600,
                            fontSize: "24px",
                            lineHeight: "30px",
                            letterSpacing: "0px",
                            color: "rgba(43, 43, 43, 1)",
                            margin: 0,
                          }}
                          className="truncate block"
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
                          fontFamily: "'Faktum', 'Outfit', sans-serif",
                          fontWeight: 500,
                          fontSize: "18px",
                          lineHeight: "28px",
                          letterSpacing: "0px",
                          color: "rgba(141, 141, 141, 1)",
                          margin: 0,
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          textOverflow: "ellipsis",
                        }}
                        className="h-auto min-h-[84px]"
                      >
                        {pkg.description}
                      </p>
                    </div>

                    {/* 2x2 Details Grid */}
                    <div 
                      style={{ 
                        width: "100%",
                        maxWidth: "405.33px",
                        boxSizing: "border-box"
                      }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-2"
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", height: "56px", boxSizing: "border-box" }}>
                        <div style={{ width: "46px", height: "46px", borderRadius: "4px", background: "rgba(246, 243, 238, 1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <MapPin style={{ width: "28px", height: "28px", color: "rgba(43, 43, 43, 1)" }} />
                        </div>
                        <span style={{ fontFamily: "'Faktum', 'Outfit', sans-serif", fontWeight: 500, color: "rgba(43, 43, 43, 1)", lineHeight: "24px", display: "inline-block", verticalAlign: "middle" }} className="text-sm md:text-[16px]">
                          Starts from {pkg.startPoint || 'Srinagar'}
                        </span>
                      </div>
                      
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", height: "56px", boxSizing: "border-box" }}>
                        <div style={{ width: "46px", height: "46px", borderRadius: "4px", background: "rgba(246, 243, 238, 1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Users style={{ width: "28px", height: "28px", color: "rgba(43, 43, 43, 1)" }} />
                        </div>
                        <span style={{ fontFamily: "'Faktum', 'Outfit', sans-serif", fontWeight: 500, color: "rgba(43, 43, 43, 1)", lineHeight: "24px", display: "inline-block", verticalAlign: "middle" }} className="text-sm md:text-[16px]">
                          {pkg.groupType || 'Curated group Trip'}
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "12px", height: "56px", boxSizing: "border-box" }}>
                        <div style={{ width: "46px", height: "46px", borderRadius: "4px", background: "rgba(246, 243, 238, 1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <ArrowUpRight style={{ width: "28px", height: "28px", color: "rgba(43, 43, 43, 1)" }} />
                        </div>
                        <span style={{ fontFamily: "'Faktum', 'Outfit', sans-serif", fontWeight: 500, color: "rgba(43, 43, 43, 1)", lineHeight: "24px", display: "inline-block", verticalAlign: "middle" }} className="text-sm md:text-[16px]">
                          {pkg.difficulty || 'Moderate'} Difficulty
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "12px", height: "56px", boxSizing: "border-box" }}>
                        <div style={{ width: "46px", height: "46px", borderRadius: "4px", background: "rgba(246, 243, 238, 1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Calendar style={{ width: "28px", height: "28px", color: "rgba(43, 43, 43, 1)" }} />
                        </div>
                        <span style={{ fontFamily: "'Faktum', 'Outfit', sans-serif", fontWeight: 500, color: "rgba(43, 43, 43, 1)", lineHeight: "24px", display: "inline-block", verticalAlign: "middle" }} className="text-sm md:text-[16px]">
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
              style={{
                width: "258px",
                height: "68px",
                paddingTop: "18px",
                paddingRight: "36px",
                paddingBottom: "18px",
                paddingLeft: "36px",
                gap: "8px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
                borderRadius: "4px",
                border: "2px solid rgba(204, 204, 204, 1)",
                backgroundColor: "rgba(255, 255, 255, 1)",
                fontFamily: "'Faktum', 'Outfit', sans-serif",
                fontWeight: 600,
                fontSize: "20px",
                lineHeight: "28px",
                color: "rgba(29, 73, 62, 1)",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
              }}
              className="hover:bg-gray-50 active:scale-95"
            >
              Load more
            </button>
          </div>
        )}

      </section>

      {/* 2. HOW TO BOOK YOUR TOUR SECTION (1440x806px) */}
      <section 
        style={{
          width: "100%",
          maxWidth: "1440px",
          height: "806px",
          paddingTop: "42px",
          paddingRight: "80px",
          paddingBottom: "42px",
          paddingLeft: "80px",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          backgroundColor: "rgba(255, 255, 255, 1)",
          boxSizing: "border-box",
          margin: "0 auto",
          position: "relative",
          zIndex: 10
        }}
      >
        <div 
          style={{
            width: "100%",
            maxWidth: "1280px",
            height: "100%",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
            boxSizing: "border-box"
          }}
        >
          
          {/* Header block (1280x134px, space-between) */}
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
              boxSizing: "border-box"
            }}
          >
            <span 
              style={{
                width: "176px",
                height: "18px",
                fontFamily: "'Faktum', 'Outfit', sans-serif",
                color: "rgba(255, 98, 62, 1)",
                fontWeight: 600,
                fontSize: "14px",
                lineHeight: "18px",
                textTransform: "uppercase",
                letterSpacing: "1.2px",
                textAlign: "center",
                margin: 0,
                display: "block",
                boxSizing: "border-box"
              }}
            >
              Discover Your Path
            </span>
            <h2 
              style={{
                width: "100%",
                maxWidth: "1280px",
                height: "52px",
                fontFamily: "'Fraunces', serif",
                fontWeight: 600,
                fontSize: "42px",
                lineHeight: "52px",
                letterSpacing: "0px",
                color: "#1D493E",
                textAlign: "center",
                margin: 0,
                boxSizing: "border-box"
              }}
            >
              How to book your <span style={{ color: "rgba(255, 98, 62, 1)", fontWeight: 600 }}>Tour</span>
            </h2>
            <p 
              style={{
                width: "100%",
                maxWidth: "1280px",
                height: "32px",
                fontFamily: "'Faktum', 'Outfit', sans-serif",
                fontSize: "24px",
                lineHeight: "32px",
                color: "rgba(43, 43, 43, 1)",
                margin: 0,
                fontWeight: 500,
                textAlign: "center",
                boxSizing: "border-box"
              }}
            >
              Curated journeys for the modern nomad, designed to push boundaries and discover India's hidden heart
            </p>
          </div>

          <div 
            style={{
              width: "100%",
              maxWidth: "1280px",
              height: "556px",
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "32px",
              alignItems: "center",
              boxSizing: "border-box"
            }}
          >
            
            {/* Left side: Large featured Srinagar to Leh Card matching Figma */}
            <Link 
              href="/travel/srinagar-to-leh" 
              style={{
                display: "block",
                width: "100%",
                maxWidth: "624px",
                height: "556px",
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.1)",
                position: "relative",
                boxSizing: "border-box"
              }}
              className="group"
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
              <div 
                style={{
                  position: "absolute",
                  bottom: "16px",
                  left: "16px",
                  width: "592px",
                  height: "135px",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  borderRadius: "4px",
                  padding: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxSizing: "border-box",
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.4)",
                }}
                className="text-left"
              >
                <div 
                  style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    color: "#FFFFFF",
                  }}
                >
                  <h3 
                    style={{
                      fontFamily: "'Faktum', 'Outfit', sans-serif",
                      fontWeight: 600,
                      fontSize: "24px",
                      lineHeight: "1",
                      margin: 0,
                    }}
                  >
                    Srinagar to Leh
                  </h3>
                  <span 
                    style={{
                      fontFamily: "'Faktum', 'Outfit', sans-serif",
                      fontWeight: 600,
                      fontSize: "24px",
                      lineHeight: "1",
                    }}
                  >
                    ₹22,900/Person
                  </span>
                </div>
                <p 
                  style={{
                    fontFamily: "'Faktum', 'Outfit', sans-serif",
                    fontWeight: 500,
                    fontSize: "18px",
                    lineHeight: "26px",
                    color: "#FFFFFF",
                    margin: 0,
                  }}
                >
                  Experience the iconic highway journey crossing high mountain passes and sapphire lakes.
                </p>
              </div>
            </Link>

            {/* Right side: 4 step list matching Figma */}
            <div 
              style={{
                width: "100%",
                maxWidth: "624px",
                height: "556px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxSizing: "border-box"
              }}
              className="text-left"
            >
              {[
                { num: '01', title: 'Choose a package', desc: 'Select the best tour package that matches your schedule and lifestyle' },
                { num: '02', title: 'Check availability', desc: 'Select the best tour package that matches your schedule and lifestyle' },
                { num: '03', title: 'Make a reservation', desc: 'Select the best tour package that matches your schedule and lifestyle' },
                { num: '04', title: 'Enjoy your experience', desc: 'Select the best tour package that matches your schedule and lifestyle' }
              ].map((step) => (
                <div 
                  key={step.num} 
                  style={{
                    width: "624px",
                    height: "115px",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    gap: "24px",
                    boxSizing: "border-box"
                  }}
                >
                  <div 
                    style={{
                      width: "88px",
                      height: "86px",
                      backgroundColor: "#FAF9F6",
                      border: "1px solid rgba(0,0,0,0.06)",
                      borderRadius: "4px",
                      padding: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      boxSizing: "border-box"
                    }}
                  >
                    <span
                      style={{
                        width: "40px",
                        height: "38px",
                        fontFamily: "'Fragment Mono SC', 'Fragment Mono', 'Courier New', monospace",
                        fontWeight: 400,
                        fontSize: "32px",
                        lineHeight: "32px",
                        color: "rgba(43, 43, 43, 1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {step.num}
                    </span>
                  </div>
                  <div 
                    style={{
                      width: "512px",
                      height: "115px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      boxSizing: "border-box"
                    }}
                  >
                    <h4 
                      style={{
                        width: "512px",
                        height: "39px",
                        fontFamily: "'Fraunces', serif",
                        fontWeight: 600,
                        fontSize: "32px",
                        lineHeight: "39px",
                        color: "rgba(43, 43, 43, 1)",
                        margin: 0,
                      }}
                    >
                      {step.title}
                    </h4>
                    <p 
                      style={{
                        width: "512px",
                        height: "64px",
                        fontFamily: "'Faktum', 'Outfit', sans-serif",
                        fontWeight: 500,
                        fontSize: "20px",
                        lineHeight: "32px",
                        color: "rgba(43, 43, 43, 1)",
                        margin: 0,
                      }}
                    >
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* 3. CAPTURED MEMORIES TESTIMONIALS SECTION (1440x912.5px) */}
      <section 
        style={{
          width: "100%",
          maxWidth: "1440px",
          height: "912.5px",
          paddingTop: "42px",
          paddingRight: "80px",
          paddingBottom: "42px",
          paddingLeft: "80px",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          backgroundColor: "rgba(255, 255, 255, 1)",
          boxSizing: "border-box",
          margin: "0 auto",
          position: "relative",
          zIndex: 10
        }}
      >
        <div 
          style={{
            width: "100%",
            maxWidth: "1280px",
            height: "100%",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
            boxSizing: "border-box"
          }}
        >
          
          {/* Header block (1280x134px, space-between, left-aligned) */}
          <div 
            style={{
              width: "100%",
              maxWidth: "1280px",
              height: "134px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-start",
              margin: "0 auto",
              boxSizing: "border-box"
            }}
          >
            <div 
              style={{
                width: "185px",
                height: "26px",
                backgroundColor: "rgba(255, 98, 62, 0.08)",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
                flexShrink: 0
              }}
            >
              <span 
                style={{
                  width: "177px",
                  height: "18px",
                  fontFamily: "'Faktum', 'Outfit', sans-serif",
                  color: "rgba(255, 98, 62, 1)",
                  fontWeight: 600,
                  fontSize: "14px",
                  lineHeight: "18px",
                  textTransform: "uppercase",
                  letterSpacing: "1.2px",
                  textAlign: "center",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxSizing: "border-box"
                }}
              >
                Captured Memories
              </span>
            </div>
            <h2 
              style={{
                width: "100%",
                maxWidth: "1280px",
                height: "52px",
                fontFamily: "'Fraunces', serif",
                fontWeight: 600,
                fontSize: "42px",
                lineHeight: "52px",
                letterSpacing: "0px",
                color: "#1D493E",
                textAlign: "left",
                margin: 0,
                boxSizing: "border-box"
              }}
            >
              Capture your adventurous travel <span style={{ color: "rgba(255, 98, 62, 1)", fontWeight: 600 }}>Forever</span>
            </h2>
            <p 
              style={{
                width: "100%",
                maxWidth: "1280px",
                height: "32px",
                fontFamily: "'Faktum', 'Outfit', sans-serif",
                fontSize: "24px",
                lineHeight: "32px",
                color: "rgba(43, 43, 43, 1)",
                margin: 0,
                fontWeight: 500,
                textAlign: "left",
                boxSizing: "border-box"
              }}
            >
              Curated journeys for the modern nomad, designed to push boundaries and discover India's hidden heart
            </p>
          </div>

          {/* Reviews Container Wrapper (1558px x 662.5px spec with Linear Gradient Overlay & 2 Stacked Marquees) */}
          <div 
            style={{
              width: "1558px",
              maxWidth: "100%",
              minHeight: "662.5px",
              position: "relative",
              overflow: "hidden",
              margin: "0 auto"
            }}
          >
            {/* Linear Gradient Fade Overlay */}
            <div 
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                zIndex: 10,
                background: "linear-gradient(90.01deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 20%, rgba(255, 255, 255, 0) 80%, #FFFFFF 100%)"
              }}
            />

            {/* 2 Stacked Marquee Rows (Row 1 Left, Row 2 Right, Pauses on Hover) */}
            <div className="flex flex-col gap-6 py-2">
              {/* Row 1 (Left Scrolling) */}
              <div className="flex gap-8 py-2 w-max animate-marquee hover:[animation-play-state:paused]">
                {[...TESTIMONIALS, ...TESTIMONIALS].map((test, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white border border-gray-200 p-6 rounded-[8px] flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-xl hover:border-[#FF623E] hover:scale-105 transition-all duration-300 w-[380px] shrink-0 cursor-pointer text-left"
                  >
                    <div className="space-y-3">
                      <div className="flex text-amber-400 text-sm gap-1">
                        {Array.from({ length: test.rating }).map((_, s) => (
                          <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-gray-700 font-medium italic text-[15px] leading-relaxed">
                        {test.quote}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                      <img src={test.avatar} alt={test.author} className="w-10 h-10 rounded-full object-cover shrink-0" />
                      <div>
                        <h4 className="text-[15px] font-bold text-gray-800 leading-none">{test.author}</h4>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">{test.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 2 (Right Reverse Scrolling) */}
              <div className="flex gap-8 py-2 w-max animate-marquee-reverse hover:[animation-play-state:paused]">
                {[...TESTIMONIALS.slice().reverse(), ...TESTIMONIALS.slice().reverse()].map((test, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white border border-gray-200 p-6 rounded-[8px] flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-xl hover:border-[#FF623E] hover:scale-105 transition-all duration-300 w-[380px] shrink-0 cursor-pointer text-left"
                  >
                    <div className="space-y-3">
                      <div className="flex text-amber-400 text-sm gap-1">
                        {Array.from({ length: test.rating }).map((_, s) => (
                          <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-gray-700 font-medium italic text-[15px] leading-relaxed">
                        {test.quote}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                      <img src={test.avatar} alt={test.author} className="w-10 h-10 rounded-full object-cover shrink-0" />
                      <div>
                        <h4 className="text-[15px] font-bold text-gray-800 leading-none">{test.author}</h4>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">{test.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3.5 FAQ ACCORDION SECTION (Matching Blog page fonts and styles) */}
      <section
        style={{
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          paddingTop: '42px',
          paddingBottom: '42px',
          paddingLeft: '80px',
          paddingRight: '80px',
          background: 'rgba(255, 255, 255, 1)',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Label */}
          <span
            style={{
              fontFamily: 'Faktum, var(--font-sans), sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              lineHeight: '100%',
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              color: 'rgba(255, 98, 62, 1)',
              background: 'rgba(255, 98, 62, 0.1)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '28px',
              padding: '0 16px',
              borderRadius: '4px',
              width: 'fit-content',
            }}
          >
            FAQ&apos;S
          </span>

          {/* Title */}
          <h2
            style={{
              fontFamily: 'Fraunces, Georgia, serif',
              fontWeight: 600,
              fontSize: '42px',
              lineHeight: '100%',
              letterSpacing: '0px',
              color: 'rgba(43, 43, 43, 1)',
              margin: 0,
            }}
          >
            Frequently asked questions
          </h2>
        </div>

        {/* Accordion */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', borderTop: '1px solid rgba(204, 204, 204, 1)' }}>
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                style={{
                  width: '100%',
                  borderBottom: '1px solid rgba(204, 204, 204, 1)',
                }}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px 0',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    gap: '16px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Faktum, var(--font-sans), sans-serif',
                      fontWeight: 500,
                      fontSize: '20px',
                      lineHeight: '32px',
                      color: 'rgba(43, 43, 43, 1)',
                      flex: 1,
                      maxWidth: '1196px',
                    }}
                  >
                    {item.question}
                  </span>
                  {isOpen ? (
                    <span style={{ fontSize: '24px', fontWeight: 600, color: 'rgba(255, 98, 62, 1)', flexShrink: 0, lineHeight: 1 }}>−</span>
                  ) : (
                    <span style={{ fontSize: '24px', fontWeight: 600, color: 'rgba(29, 73, 62, 1)', flexShrink: 0, lineHeight: 1 }}>+</span>
                  )}
                </button>
                {isOpen && (
                  <p
                    style={{
                      fontFamily: 'Faktum, var(--font-sans), sans-serif',
                      fontWeight: 500,
                      fontSize: '20px',
                      lineHeight: '32px',
                      color: 'rgba(141, 141, 141, 1)',
                      margin: 0,
                      maxWidth: '1196px',
                      paddingBottom: '20px',
                    }}
                  >
                    {item.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 3.7 NEWSLETTER / CTA SECTION (Matching Home page fonts and styles) */}
      <section
        style={{
          width: "100%",
          paddingTop: "42px",
          paddingBottom: "42px",
          background: "#FFFFFF",
          borderTop: "1px solid rgba(29, 73, 62, 0.1)",
        }}
        className="relative z-10 px-6 md:px-20"
      >
        <div
          style={{
            maxWidth: "1440px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "32px",
            textAlign: "center",
          }}
        >
          {/* Text block */}
          <div className="flex flex-col items-center gap-[12px] w-full">
            {/* Heading */}
            <h2
              style={{
                fontFamily: "Fraunces, serif",
                fontWeight: 600,
                lineHeight: "1.2",
                letterSpacing: "0px",
                textAlign: "center",
                color: "#2B2B2B",
                maxWidth: "1280px",
                margin: 0,
              }}
              className="text-2xl sm:text-3xl md:text-[42px]"
            >
              The{" "}
              <span style={{ color: "#FF5A36" }}>best adventures</span>{" "}
              find their way to your inbox.
            </h2>
            {/* Subtitle */}
            <p
              style={{
                fontFamily: "Faktum, sans-serif",
                fontWeight: 500,
                letterSpacing: "0px",
                textAlign: "center",
                color: "rgba(43, 43, 43, 1)",
                maxWidth: "1280px",
                margin: 0,
              }}
              className="text-sm sm:text-base md:text-[24px] leading-relaxed md:leading-[32px]"
            >
              Hidden places, exclusive trip drops, curated gear, and stories from the road delivered before anyone else hears about them.
            </p>
          </div>

          {/* Button */}
          <button
            type="button"
            onClick={() => {
              const bookingEl = document.getElementById('available-packages');
              if (bookingEl) {
                bookingEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            style={{
              height: "55px",
              paddingTop: "16px",
              paddingBottom: "16px",
              paddingLeft: "32px",
              paddingRight: "32px",
              borderRadius: "4px",
              background: "rgba(29, 73, 62, 1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontFamily: "'Faktum','Outfit',sans-serif",
              fontWeight: 500,
              fontSize: "18px",
              lineHeight: "100%",
              letterSpacing: "0px",
              border: "none",
              transition: "opacity 0.2s",
              cursor: "pointer",
            }}
            className="hover:opacity-90 inline-flex items-center gap-2 w-full max-w-[286px]"
          >
            <span>Reserve your tour now</span>
            <span className="text-lg font-sans">↗</span>
          </button>
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
                      onClick={(e) => {
                        try {
                          e.currentTarget.showPicker();
                        } catch (err) {}
                      }}
                      onFocus={(e) => {
                        try {
                          e.currentTarget.showPicker();
                        } catch (err) {}
                      }}
                      style={{ textAlign: "center" }}
                      className="w-full px-4 py-3 rounded-xl border-2 border-[#1D493E] bg-white text-xs font-bold text-[#1D493E] focus:outline-none text-center cursor-pointer hide-calendar-picker-icon"
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
