'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  const { addToCart, setCartOpen, wishlist, toggleWishlist } = useCart();
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

  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const startDatePickerRef = useRef<HTMLInputElement>(null);
  const endDatePickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setShowFiltersDropdown(false);
      }
    };
    if (showFiltersDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFiltersDropdown]);

  // Booking Form Modal State
  const [bookingForm, setBookingForm] = useState({ name: '', phone: '', countryCode: '+91', travelers: '02', pickupLocation: '', message: '' });
  const [bookingFormSuccess, setBookingFormSuccess] = useState(false);

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

  // Handle booking form modal opening
  const handleOpenBookingDrawer = (pkg: HolidayPackage) => {
    setActiveBookPkg(pkg);
    setBookingForm({ name: '', phone: '', countryCode: '+91', travelers: String(Number(travelersInput) || 2).padStart(2, '0'), pickupLocation: '', message: '' });
    setBookingFormSuccess(false);
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
    <div className="min-h-screen bg-white text-[#1D493E] font-sans antialiased pb-0 relative">
      
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
        className="px-4 sm:px-6 md:px-20 pt-6 sm:pt-[62px] pb-4 sm:pb-[24px]"
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
            gap: "12px",
          }}
        >
          <span className="inline-flex items-center justify-center h-[24px] sm:h-[26px] w-fit text-[10px] sm:text-[12px] font-bold uppercase tracking-[0.12em] text-[#FF5B37] bg-[#FFEBE5] px-2.5 sm:px-3 rounded-[4px]">
            CAPTURED MEMORIES
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
            className="text-xl sm:text-3xl md:text-[42px] leading-tight"
          >
            Capture your adventurous travel&nbsp;<span style={{ color: "rgba(255, 98, 62, 1)", fontWeight: 600 }}>Forever</span>
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
            className="hidden sm:block text-xs sm:text-base md:text-[20px] leading-relaxed md:leading-[32px]"
          >
            Curated journeys for the modern nomad, designed to push boundaries and discover India's hidden heart
          </p>
        </div>
      </div>

      {/* 1. AVAILABLE PACKAGES CONTENT SECTION */}
      <section id="available-packages" className="max-w-[1440px] mx-auto px-3 sm:px-6 md:px-[80px] pt-1 sm:pt-10 pb-6 sm:pb-12 space-y-3 sm:space-y-10">

        {/* SEARCH WIDGET CARD */}
        <div 
          style={{
            width: "100%",
            maxWidth: "1280px",
            borderRadius: "12px",
            border: "1px solid rgba(255, 98, 62, 1)",
            boxShadow: "0px 4px 12px 0px rgba(255, 98, 62, 0.24)",
            background: "rgba(255, 255, 255, 1)",
            boxSizing: "border-box",
            marginLeft: "auto",
            marginRight: "auto",
          }}
          className="hidden md:block text-left relative z-30 h-auto p-3.5 sm:p-6"
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
                  placeholder="eg. Kerala, Manali"
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

            {/* Field 2: Date */}
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
                Date
              </label>
              <div 
                className="w-full h-[56px] border border-[rgba(141,141,141,0.5)] rounded-[8px] px-3 sm:px-4 flex items-center gap-2 sm:gap-3 bg-white relative"
              >
                <Calendar 
                  className="w-5 h-5 sm:w-6 sm:h-6 text-[rgba(141,141,141,1)] shrink-0 cursor-pointer hover:text-[#1D493E] transition-colors" 
                  onClick={() => {
                    try {
                      startDatePickerRef.current?.showPicker();
                    } catch (err) {}
                  }}
                />
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
                    lineHeight: "100%", 
                    letterSpacing: "0px", 
                    color: "rgba(43, 43, 43, 1)",
                    padding: 0,
                  }}
                  className="placeholder-[rgba(141,141,141,1)] text-sm sm:text-base md:text-[20px] w-full"
                />
                <input 
                  ref={startDatePickerRef}
                  type="date"
                  className="sr-only opacity-0 absolute w-0 h-0 pointer-events-none"
                  onChange={(e) => {
                    if (e.target.value) {
                      const [y, m, d] = e.target.value.split('-');
                      setStartDate(`${d}/${m}/${y}`);
                    }
                  }}
                />
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
          }}
          className="overflow-x-auto scrollbar-none pb-1 mt-0 sm:mt-8"
        >
          <div className="flex flex-row gap-2 sm:gap-3 items-center min-w-max p-1">
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
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    border: isActive ? "1px solid #1D493E" : "1px solid rgba(141, 141, 141, 0.4)",
                    background: isActive ? "#1D493E" : "#FFFFFF",
                    color: isActive ? "#FFFFFF" : "#2B2B2B",
                    boxShadow: isActive ? "0px 4px 12px rgba(29, 73, 62, 0.22)" : "none",
                  }}
                  className={`h-auto px-3.5 py-1.5 sm:px-8 sm:py-3.5 text-xs sm:text-lg md:text-[24px] font-semibold select-none transition-all duration-300 ease-in-out active:scale-95 ${
                    isActive
                      ? 'hover:bg-[#15342c] hover:border-[#15342c]'
                      : 'hover:border-[#1D493E] hover:text-[#1D493E] hover:bg-[#1D493E]/5 hover:shadow-sm hover:scale-[1.02]'
                  }`}
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
          }}
          className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mt-3 sm:mt-12"
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
          <div className="relative hidden md:block" ref={filterDropdownRef}>
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
                className="absolute right-0 top-full mt-2 z-40 text-left flex flex-col animate-in fade-in slide-in-from-top-2 duration-300 w-screen max-w-[912px] md:w-[912px] bg-white rounded-[4px] border border-[#CCCCCC]/60 shadow-[0px_8px_24px_rgba(0,0,0,0.15)] overflow-hidden"
              >
                {/* 3 Columns Row */}
                <div className="flex flex-col md:flex-row items-stretch w-full bg-white">
                  {/* Column 1: Duration */}
                  <div className="w-full md:w-1/3 p-2 bg-white flex flex-col gap-1 border-b md:border-b-0 md:border-r border-[#CCCCCC]/40">
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
                  <div className="w-full md:w-1/3 p-2 bg-white flex flex-col gap-1 border-b md:border-b-0 md:border-r border-[#CCCCCC]/40">
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
                  <div className="w-full md:w-1/3 p-2 bg-white flex flex-col gap-1">
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

                {/* Apply Button Row */}
                <div className="w-full bg-white border-t border-[#CCCCCC]/40 px-5 py-3.5 flex justify-end gap-3 items-center">
                  {/* Clear All */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDurations([]);
                      setSelectedTravelTypes([]);
                      setSelectedInclusions([]);
                    }}
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "#1D493E",
                      background: "transparent",
                      border: "1px solid #1D493E",
                      borderRadius: "4px",
                      padding: "8px 20px",
                      cursor: "pointer",
                      letterSpacing: "0.3px",
                    }}
                    className="hover:bg-[#1D493E] hover:text-white active:scale-95 transition-all duration-300 shadow-sm"
                  >
                    Clear All
                  </button>
                  {/* Apply */}
                  <button
                    type="button"
                    onClick={() => setShowFiltersDropdown(false)}
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 700,
                      fontSize: "14px",
                      color: "#FFFFFF",
                      background: "#1D493E",
                      border: "none",
                      borderRadius: "4px",
                      padding: "8px 28px",
                      cursor: "pointer",
                      letterSpacing: "0.3px",
                    }}
                    className="hover:bg-[#15342c] hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-300"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3-COLUMN CARD GRID (Full width layout with increased sizes) */}
        {filteredAndSortedPackages.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-[12px] p-16 text-center max-w-2xl mx-auto space-y-5">
            <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto text-gray-400">
              <Info className="w-8 h-8" />
            </div>
            <h3
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "22px",
                fontWeight: 600,
                color: "#1D493E",
                margin: 0,
              }}
            >
              No experiences match your search
            </h3>
            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "15px",
                fontWeight: 400,
                color: "rgba(43, 43, 43, 0.6)",
                lineHeight: "1.6",
                margin: 0,
              }}
            >
              Try typing a different destination name or changing your category tab.
            </p>
            <button
              type="button"
              onClick={() => {
                setDestinationSearch('');
                setActiveCategory('All');
                setSortBy('recommended');
              }}
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "14px",
                fontWeight: 700,
                background: "#1D493E",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "4px",
                padding: "10px 28px",
                cursor: "pointer",
                letterSpacing: "0.3px",
              }}
              className="hover:bg-[#15342c] transition"
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
            className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8 justify-items-center"
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
                  className="group h-auto min-h-0 sm:min-h-[695px] pb-0"
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
                      alt={`Go Banjara Travel Package - ${pkg.name}`} 
                      title={`Go Banjara Travel Package - ${pkg.name}`}
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

                    {/* Wishlist Button (Top Right) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist({ id: pkg.id, name: pkg.name, price: pkg.price, image: pkg.image, type: 'travel' });
                      }}
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(4px)",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        zIndex: 20,
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
                      }}
                      className="hover:scale-110 active:scale-95 group transition"
                      title={Array.isArray(wishlist) && wishlist.some((w: any) => w.id === pkg.id) ? "Remove from wishlist" : "Add to wishlist"}
                      aria-label="Wishlist package"
                    >
                      <Heart 
                        className={`w-4 h-4 transition-colors ${
                          Array.isArray(wishlist) && wishlist.some((w: any) => w.id === pkg.id)
                            ? 'text-red-500 fill-red-500' 
                            : 'text-slate-700 group-hover:text-red-500'
                        }`} 
                      />
                    </button>
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
                          display: "flex", 
                          flexDirection: "row", 
                          justifyContent: "space-between", 
                          alignItems: "center" 
                        }}
                        className="h-auto min-h-[24px] sm:h-[28px]"
                      >
                        <span 
                          style={{
                            borderRadius: "4px",
                            fontFamily: "'Faktum', 'Outfit', sans-serif",
                            fontWeight: 600,
                            color: "rgba(255, 98, 62, 1)",
                            background: "rgba(255, 98, 62, 0.1)",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                          className="px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs"
                        >
                          {displayCategory}
                        </span>
                        <span 
                          style={{
                            borderRadius: "4px",
                            fontFamily: "'Faktum', 'Outfit', sans-serif",
                            fontWeight: 600,
                            color: "rgba(29, 73, 62, 1)",
                            background: "rgba(29, 73, 62, 0.1)",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                          className="px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs"
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
                        className="group h-auto gap-2"
                      >
                        <h3 
                          style={{
                            flex: 1,
                            fontFamily: "'Faktum', 'Outfit', sans-serif",
                            fontWeight: 600,
                            letterSpacing: "0px",
                            color: "rgba(43, 43, 43, 1)",
                            margin: 0,
                          }}
                          className="text-xs sm:text-lg md:text-[24px] truncate block leading-tight hover:whitespace-normal transition-all duration-300"
                          title={pkg.name}
                        >
                          {pkg.name}
                        </h3>
                        <span 
                          style={{
                            flexShrink: 0,
                            fontFamily: "'Faktum', 'Outfit', sans-serif",
                            fontWeight: 600,
                            letterSpacing: "0px",
                            color: "rgba(43, 43, 43, 1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                          }}
                          className="text-xs sm:text-lg md:text-[28px]"
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
                          color: "rgba(141, 141, 141, 1)",
                          margin: 0,
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          textOverflow: "ellipsis",
                        }}
                        className="text-xs sm:text-sm md:text-[18px] leading-snug sm:leading-[28px] hover:line-clamp-none hover:overflow-visible transition-all duration-300 cursor-pointer"
                        title={pkg.description}
                      >
                        {pkg.description}
                      </p>
                    </div>

                    {/* 2x2 Details Grid (Hidden on Mobile) */}
                    <div 
                      style={{ 
                        width: "100%",
                        maxWidth: "405.33px",
                        boxSizing: "border-box"
                      }}
                      className="hidden sm:grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-2"
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
                        display: "flex", 
                        gap: "6px",
                        boxSizing: "border-box"
                      }}
                      className="h-[36px] sm:h-[55px]"
                    >
                      <button
                        type="button"
                        onClick={() => handleOpenBookingDrawer(pkg)}
                        style={{
                          flex: 1,
                          borderRadius: "4px",
                          background: "rgba(29, 73, 62, 1)",
                          color: "white",
                          fontFamily: "'Faktum', 'Outfit', sans-serif",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          border: "none",
                          cursor: "pointer",
                        }}
                        className="h-full text-[10px] sm:text-[16px] whitespace-nowrap px-1 hover:bg-[#15342c] transition-colors duration-300 flex items-center justify-center"
                      >
                        Book Now
                      </button>
                      
                      <Link 
                        href={pkg.link || `/travel/package/${pkg.id}`}
                        style={{
                          flex: 1,
                          borderRadius: "4px",
                          border: "1px solid rgba(29, 73, 62, 1)",
                          fontFamily: "'Faktum', 'Outfit', sans-serif",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textDecoration: "none",
                        }}
                        className="h-full text-[10px] sm:text-[16px] whitespace-nowrap px-1 bg-white text-[#1D493E] hover:bg-[#EEF2F1] transition-colors duration-300"
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
          <div className="pt-3 sm:pt-8 text-center">
            <button
              type="button"
              onClick={() => setVisiblePackagesCount(prev => prev + 6)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                border: "1px solid #1D493E",
                fontFamily: "'Faktum', 'Outfit', sans-serif",
                fontWeight: 600,
                cursor: "pointer",
              }}
              className="bg-white text-[#1D493E] hover:bg-[#1D493E] hover:text-white px-5 py-2 sm:px-8 sm:py-3.5 text-xs sm:text-base md:text-[18px] transition-all duration-300 shadow-xs"
            >
              Load more
            </button>
          </div>
        )}

      </section>

      {/* 2. HOW TO BOOK YOUR TOUR SECTION */}
      <section 
        style={{
          width: "100%",
          maxWidth: "1440px",
          backgroundColor: "rgba(255, 255, 255, 1)",
          boxSizing: "border-box",
          margin: "0 auto",
          position: "relative",
          zIndex: 10
        }}
        className="py-8 sm:py-[42px] px-4 sm:px-8 md:px-[80px] flex flex-col gap-6 sm:gap-8 h-auto min-h-fit"
      >
        <div 
          style={{
            width: "100%",
            maxWidth: "1280px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box"
          }}
          className="gap-6 sm:gap-8 h-auto"
        >
          
          {/* Header block */}
          <div 
            style={{
              width: "100%",
              maxWidth: "1280px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "0 auto",
              boxSizing: "border-box"
            }}
            className="gap-2 sm:gap-4 h-auto text-center"
          >
            <span className="inline-flex items-center justify-center h-[24px] sm:h-[26px] w-fit text-[10px] sm:text-[12px] font-bold uppercase tracking-[0.12em] text-[#FF5B37] bg-[#FFEBE5] px-2.5 sm:px-3 rounded-[4px]">
              DISCOVER YOUR PATH
            </span>
            <h2 
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 600,
                letterSpacing: "0px",
                color: "#1D493E",
                margin: 0,
              }}
              className="text-xl sm:text-3xl md:text-[42px] leading-tight text-center w-full"
            >
              How to book your <span style={{ color: "rgba(255, 98, 62, 1)", fontWeight: 600 }}>Tour</span>
            </h2>
            <p 
              style={{
                fontFamily: "'Faktum', 'Outfit', sans-serif",
                color: "rgba(43, 43, 43, 1)",
                margin: 0,
                fontWeight: 500,
              }}
              className="text-xs sm:text-base md:text-[24px] leading-relaxed text-center w-full max-w-[1280px]"
            >
              Curated journeys for the modern nomad, designed to push boundaries and discover India's hidden heart
            </p>
          </div>

          <div 
            style={{
              width: "100%",
              maxWidth: "1280px",
              boxSizing: "border-box"
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center h-auto"
          >
            
            {/* Left side: Large featured Srinagar to Leh Card */}
            <Link 
              href="/travel/srinagar-to-leh" 
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.1)",
                position: "relative",
                boxSizing: "border-box"
              }}
              className="group relative w-full max-w-[624px] h-[340px] sm:h-[450px] md:h-[556px] shadow-md mx-auto block text-left"
            >
              <img 
                src="/travel-leh-2.jpg" 
                alt="Srinagar to Leh Camels Nubra" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.01] transition duration-700 opacity-95"
              />

              {/* Best Seller red badge */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-[#FF623E] text-white font-bold text-[9px] sm:text-[10px] px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-xs shadow-md uppercase tracking-wider z-10">
                Best Seller
              </div>

               {/* Card overlay details */}
              <div 
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  borderRadius: "4px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxSizing: "border-box",
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.4)",
                }}
                className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3 sm:p-4 flex flex-col gap-1.5 sm:gap-2 text-left"
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
                      lineHeight: "1",
                      margin: 0,
                    }}
                    className="text-base sm:text-xl md:text-[24px]"
                  >
                    Srinagar to Leh
                  </h3>
                  <span 
                    style={{
                      fontFamily: "'Faktum', 'Outfit', sans-serif",
                      fontWeight: 600,
                      lineHeight: "1",
                    }}
                    className="text-sm sm:text-xl md:text-[24px]"
                  >
                    ₹22,900/Person
                  </span>
                </div>
                <p 
                  style={{
                    fontFamily: "'Faktum', 'Outfit', sans-serif",
                    fontWeight: 500,
                    color: "#FFFFFF",
                    margin: 0,
                  }}
                  className="text-xs sm:text-base md:text-[18px] leading-snug sm:leading-[26px]"
                >
                  Experience the iconic highway journey crossing high mountain passes and sapphire lakes.
                </p>
              </div>
            </Link>

            {/* Right side: 4 step list */}
            <div 
              style={{
                width: "100%",
                maxWidth: "624px",
                boxSizing: "border-box"
              }}
              className="text-left flex flex-col gap-4 sm:gap-6 justify-between h-auto"
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
                    width: "100%",
                    boxSizing: "border-box"
                  }}
                  className="flex flex-row items-start gap-3 sm:gap-6"
                >
                  <div 
                    style={{
                      backgroundColor: "#FAF9F6",
                      border: "1px solid rgba(0,0,0,0.06)",
                      borderRadius: "4px",
                      boxSizing: "border-box"
                    }}
                    className="w-11 h-11 sm:w-[88px] sm:h-[86px] p-2 sm:p-6 flex items-center justify-center shrink-0"
                  >
                    <span
                      style={{
                        fontFamily: "'Fragment Mono SC', 'Fragment Mono', 'Courier New', monospace",
                        fontWeight: 400,
                        color: "rgba(43, 43, 43, 1)",
                      }}
                      className="text-base sm:text-[32px] leading-none"
                    >
                      {step.num}
                    </span>
                  </div>
                  <div 
                    style={{
                      boxSizing: "border-box"
                    }}
                    className="flex-1 flex flex-col justify-between gap-1 sm:gap-2"
                  >
                    <h4 
                      style={{
                        fontFamily: "'Fraunces', serif",
                        fontWeight: 600,
                        color: "rgba(43, 43, 43, 1)",
                        margin: 0,
                      }}
                      className="text-base sm:text-2xl md:text-[32px] leading-tight"
                    >
                      {step.title}
                    </h4>
                    <p 
                      style={{
                        fontFamily: "'Faktum', 'Outfit', sans-serif",
                        fontWeight: 500,
                        color: "rgba(43, 43, 43, 1)",
                        margin: 0,
                      }}
                      className="text-xs sm:text-base md:text-[20px] leading-relaxed"
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

      {/* 3. CAPTURED MEMORIES TESTIMONIALS SECTION */}
      <section 
        style={{
          width: "100%",
          maxWidth: "1440px",
          backgroundColor: "rgba(255, 255, 255, 1)",
          boxSizing: "border-box",
          margin: "0 auto",
          position: "relative",
          zIndex: 10
        }}
        className="py-8 sm:py-[42px] px-4 sm:px-8 md:px-[80px] flex flex-col gap-6 sm:gap-8 h-auto min-h-fit"
      >
        <div 
          style={{
            width: "100%",
            maxWidth: "1280px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box"
          }}
          className="gap-4 sm:gap-8 h-auto"
        >
          
          {/* Header block */}
          <div 
            style={{
              width: "100%",
              maxWidth: "1280px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              margin: "0 auto",
              boxSizing: "border-box"
            }}
            className="gap-2 sm:gap-4 h-auto text-left"
          >
            <span className="inline-flex items-center justify-center h-[24px] sm:h-[26px] w-fit text-[10px] sm:text-[12px] font-bold uppercase tracking-[0.12em] text-[#FF5B37] bg-[#FFEBE5] px-2.5 sm:px-3 rounded-[4px]">
              CAPTURED MEMORIES
            </span>
            <h2 
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 600,
                letterSpacing: "0px",
                color: "#1D493E",
                margin: 0,
              }}
              className="text-xl sm:text-3xl md:text-[42px] leading-tight text-left w-full"
            >
              Capture your adventurous travel <span style={{ color: "rgba(255, 98, 62, 1)", fontWeight: 600 }}>Forever</span>
            </h2>
            <p 
              style={{
                fontFamily: "'Faktum', 'Outfit', sans-serif",
                color: "rgba(43, 43, 43, 1)",
                margin: 0,
                fontWeight: 500,
              }}
              className="text-xs sm:text-base md:text-[24px] leading-relaxed text-left w-full max-w-[1280px]"
            >
              Curated journeys for the modern nomad, designed to push boundaries and discover India's hidden heart
            </p>
          </div>

          {/* Reviews Container Wrapper */}
          <div 
            style={{
              width: "100%",
              maxWidth: "1558px",
              position: "relative",
              overflow: "hidden",
              margin: "0 auto"
            }}
            className="py-2 h-auto min-h-fit"
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
            <div className="flex flex-col gap-3 sm:gap-6 py-2">
              {/* Row 1 (Left Scrolling) */}
              <div className="flex gap-3 sm:gap-8 py-2 w-max animate-marquee hover:[animation-play-state:paused]">
                {[...TESTIMONIALS, ...TESTIMONIALS].map((test, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white border border-gray-200 p-3.5 sm:p-6 rounded-[8px] flex flex-col justify-between space-y-2.5 sm:space-y-4 shadow-2xs hover:shadow-xl hover:border-[#FF623E] hover:scale-105 transition-all duration-300 w-[260px] sm:w-[380px] shrink-0 cursor-pointer text-left"
                  >
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex text-amber-400 text-xs sm:text-sm gap-0.5 sm:gap-1">
                        {Array.from({ length: test.rating }).map((_, s) => (
                          <Star key={s} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-gray-700 font-medium italic text-xs sm:text-[15px] leading-snug sm:leading-relaxed">
                        {test.quote}
                      </p>
                    </div>
                    <div className="flex items-center gap-2.5 sm:gap-3 pt-2 sm:pt-3 border-t border-gray-100">
                      <img src={test.avatar} alt={test.author} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shrink-0" />
                      <div>
                        <h4 className="text-xs sm:text-[15px] font-bold text-gray-800 leading-none">{test.author}</h4>
                        <p className="text-[10px] sm:text-xs text-gray-400 font-medium mt-0.5">{test.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 2 (Right Reverse Scrolling) */}
              <div className="flex gap-3 sm:gap-8 py-2 w-max animate-marquee-reverse hover:[animation-play-state:paused]">
                {[...TESTIMONIALS.slice().reverse(), ...TESTIMONIALS.slice().reverse()].map((test, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white border border-gray-200 p-3.5 sm:p-6 rounded-[8px] flex flex-col justify-between space-y-2.5 sm:space-y-4 shadow-2xs hover:shadow-xl hover:border-[#FF623E] hover:scale-105 transition-all duration-300 w-[260px] sm:w-[380px] shrink-0 cursor-pointer text-left"
                  >
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex text-amber-400 text-xs sm:text-sm gap-0.5 sm:gap-1">
                        {Array.from({ length: test.rating }).map((_, s) => (
                          <Star key={s} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-gray-700 font-medium italic text-xs sm:text-[15px] leading-snug sm:leading-relaxed">
                        {test.quote}
                      </p>
                    </div>
                    <div className="flex items-center gap-2.5 sm:gap-3 pt-2 sm:pt-3 border-t border-gray-100">
                      <img src={test.avatar} alt={test.author} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shrink-0" />
                      <div>
                        <h4 className="text-xs sm:text-[15px] font-bold text-gray-800 leading-none">{test.author}</h4>
                        <p className="text-[10px] sm:text-xs text-gray-400 font-medium mt-0.5">{test.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3.5 FAQ ACCORDION SECTION */}
      <section
        style={{
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          background: 'rgba(255, 255, 255, 1)',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}
        className="py-6 sm:py-10 md:py-14 px-4 sm:px-8 md:px-[80px] gap-4 sm:gap-6 border-t border-slate-200/60"
      >
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Label */}
          <span
            style={{
              fontFamily: 'Faktum, var(--font-sans), sans-serif',
              fontWeight: 600,
              fontSize: '10px',
              lineHeight: '100%',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: 'rgba(255, 98, 62, 1)',
              background: 'rgba(255, 98, 62, 0.1)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '24px',
              padding: '0 10px',
              borderRadius: '2px',
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
              letterSpacing: '0px',
              color: 'rgba(43, 43, 43, 1)',
              margin: 0,
            }}
            className="text-lg sm:text-2xl md:text-[42px] font-semibold text-[#2B2B2B]"
          >
            Frequently asked questions
          </h2>
        </div>

        {/* Accordion */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', borderTop: '1px solid rgba(204, 204, 204, 0.6)' }}>
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="py-3 sm:py-4 border-b border-slate-200/60 w-full flex flex-col"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    textAlign: 'left',
                    gap: '12px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Faktum, var(--font-sans), sans-serif',
                      color: 'rgba(43, 43, 43, 1)',
                    }}
                    className="text-xs sm:text-base md:text-[20px] font-medium leading-snug flex-1"
                  >
                    {item.question}
                  </span>
                  {isOpen ? (
                    <span style={{ fontWeight: 600, color: 'rgba(255, 98, 62, 1)', flexShrink: 0, lineHeight: 1 }} className="text-base sm:text-2xl">−</span>
                  ) : (
                    <span style={{ fontWeight: 600, color: 'rgba(29, 73, 62, 1)', flexShrink: 0, lineHeight: 1 }} className="text-base sm:text-2xl">+</span>
                  )}
                </button>
                {isOpen && (
                  <p
                    style={{
                      fontFamily: 'Faktum, var(--font-sans), sans-serif',
                      color: 'rgba(141, 141, 141, 1)',
                    }}
                    className="text-xs sm:text-sm md:text-[20px] leading-relaxed mt-2"
                  >
                    {item.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 3.7 NEWSLETTER / CTA SECTION */}
      <section
        style={{
          width: "100%",
          background: "#FFFFFF",
          borderTop: "1px solid rgba(29, 73, 62, 0.1)",
        }}
        className="relative z-10 py-6 sm:py-10 md:py-14 px-4 sm:px-8 md:px-20 text-center"
      >
        <div
          style={{
            maxWidth: "1440px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
          className="gap-4 sm:gap-7 w-full"
        >
          {/* Text block */}
          <div className="flex flex-col items-center gap-2 sm:gap-3 w-full">
            {/* Heading */}
            <h2
              style={{
                fontFamily: "Fraunces, serif",
                letterSpacing: "0px",
                textAlign: "center",
                color: "#2B2B2B",
                maxWidth: "1280px",
                margin: 0,
              }}
              className="text-lg sm:text-2xl md:text-[42px] font-semibold leading-tight"
            >
              The{" "}
              <span style={{ color: "#FF5A36" }}>best adventures</span>{" "}
              find their way to your inbox.
            </h2>
            {/* Subtitle */}
            <p
              style={{
                fontFamily: "Faktum, sans-serif",
                letterSpacing: "0px",
                textAlign: "center",
                color: "rgba(43, 43, 43, 0.8)",
                maxWidth: "1280px",
                margin: 0,
              }}
              className="text-xs sm:text-sm md:text-[20px] leading-relaxed"
            >
              Hidden places, exclusive trip drops, curated gear, and stories from the road delivered before anyone else hears about them.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              const bookingEl = document.getElementById('available-packages');
              if (bookingEl) {
                bookingEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="w-full max-w-[280px] h-10 sm:h-[55px] rounded-[4px] bg-[#1D493E] text-white flex items-center justify-center gap-2 hover:bg-[#15342c] transition-all duration-300 text-xs sm:text-base font-semibold shadow-xs border-none cursor-pointer group"
          >
            <span>Reserve your tour now</span>
            <span className="text-sm sm:text-lg font-sans group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">↗</span>
          </button>
        </div>
      </section>

      {/* BOOKING FORM MODAL */}
      {activeBookPkg && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}
          onClick={() => setActiveBookPkg(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '778px',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: 'rgba(255,255,255,1)',
              borderRadius: '4px',
              border: '1px solid rgba(204,204,204,1)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              boxSizing: 'border-box',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            }}
          >
            {bookingFormSuccess ? (
              /* Success State */
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                <h3 style={{ fontFamily: '"Fraunces", Georgia, serif', fontWeight: 700, fontSize: '24px', color: '#1D493E', margin: '0 0 12px' }}>
                  Enquiry Submitted!
                </h3>
                <p style={{ fontFamily: '"Outfit", sans-serif', fontSize: '15px', color: 'rgba(43,43,43,0.7)', margin: '0 0 28px', lineHeight: 1.6 }}>
                  We&apos;ve received your booking request for <strong>{activeBookPkg.name}</strong>. Our team will contact you shortly.
                </p>
                <button
                  onClick={() => setActiveBookPkg(null)}
                  style={{ height: '48px', padding: '0 36px', background: '#1D493E', color: '#fff', border: 'none', borderRadius: '4px', fontFamily: '"Outfit", sans-serif', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                {/* Title */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <h2 style={{ fontFamily: '"Fraunces", Georgia, serif', fontWeight: 700, fontSize: '28px', color: 'rgba(43,43,43,1)', margin: 0 }}>
                    {activeBookPkg.name} Booking
                  </h2>
                  <p style={{ fontFamily: '"Outfit", sans-serif', fontSize: '14px', color: 'rgba(43,43,43,0.55)', margin: 0 }}>
                    You can reach us anytime
                  </p>
                </div>

                {/* Full Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 500, fontSize: '14px', color: 'rgba(43,43,43,1)' }}>Full Name</label>
                  <input
                    type="text"
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Enter your full name"
                    style={{
                      height: '48px', padding: '0 14px', border: '1px solid rgba(204,204,204,1)',
                      borderRadius: '4px', fontFamily: '"Outfit", sans-serif', fontSize: '14px',
                      color: 'rgba(43,43,43,1)', outline: 'none', boxSizing: 'border-box', width: '100%',
                    }}
                  />
                </div>

                {/* Contact Number */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 500, fontSize: '14px', color: 'rgba(43,43,43,1)' }}>Contact Number</label>
                  <div style={{ display: 'flex', gap: '0', border: '1px solid rgba(204,204,204,1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <select
                      value={bookingForm.countryCode}
                      onChange={(e) => setBookingForm(p => ({ ...p, countryCode: e.target.value }))}
                      style={{
                        height: '48px', padding: '0 8px', border: 'none', borderRight: '1px solid rgba(204,204,204,1)',
                        background: 'rgba(248,248,248,1)', fontFamily: '"Outfit", sans-serif', fontSize: '13px',
                        color: 'rgba(43,43,43,1)', outline: 'none', cursor: 'pointer', minWidth: '80px',
                      }}
                    >
                      <option value="+91">+91</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+61">+61</option>
                      <option value="+971">+971</option>
                      <option value="+65">+65</option>
                    </select>
                    <input
                      type="tel"
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm(p => ({ ...p, phone: e.target.value }))}
                      placeholder="Your phone number"
                      style={{
                        flex: 1, height: '48px', padding: '0 14px', border: 'none',
                        fontFamily: '"Outfit", sans-serif', fontSize: '14px',
                        color: 'rgba(43,43,43,1)', outline: 'none',
                      }}
                    />
                  </div>
                </div>

                {/* No of Travelers */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 500, fontSize: '14px', color: 'rgba(43,43,43,1)' }}>No of Travelers</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={bookingForm.travelers}
                    onChange={(e) => setBookingForm(p => ({ ...p, travelers: e.target.value }))}
                    style={{
                      height: '48px', padding: '0 14px', border: '1px solid rgba(204,204,204,1)',
                      borderRadius: '4px', fontFamily: '"Outfit", sans-serif', fontSize: '14px',
                      color: 'rgba(43,43,43,1)', outline: 'none', boxSizing: 'border-box', width: '100%',
                    }}
                  />
                </div>

                {/* Pick up location */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 500, fontSize: '14px', color: 'rgba(43,43,43,1)' }}>Pick up location</label>
                  <select
                    value={bookingForm.pickupLocation}
                    onChange={(e) => setBookingForm(p => ({ ...p, pickupLocation: e.target.value }))}
                    style={{
                      height: '48px', padding: '0 14px', border: '1px solid rgba(204,204,204,1)',
                      borderRadius: '4px', fontFamily: '"Outfit", sans-serif', fontSize: '14px',
                      color: bookingForm.pickupLocation ? 'rgba(43,43,43,1)' : 'rgba(43,43,43,0.4)',
                      outline: 'none', background: '#fff', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
                    }}
                  >
                    <option value="" disabled>Ex: Telangana</option>
                    {['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh'].map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 500, fontSize: '14px', color: 'rgba(43,43,43,1)' }}>Message</label>
                  <textarea
                    value={bookingForm.message}
                    onChange={(e) => setBookingForm(p => ({ ...p, message: e.target.value }))}
                    placeholder="Tell us about your requirements"
                    rows={4}
                    style={{
                      padding: '12px 14px', border: '1px solid rgba(204,204,204,1)',
                      borderRadius: '4px', fontFamily: '"Outfit", sans-serif', fontSize: '14px',
                      color: 'rgba(43,43,43,1)', outline: 'none', resize: 'vertical',
                      boxSizing: 'border-box', width: '100%', lineHeight: 1.6,
                    }}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (!bookingForm.name || !bookingForm.phone) return;
                    setBookingFormSuccess(true);
                  }}
                  style={{
                    width: '100%', height: '52px',
                    background: 'rgba(29,73,62,1)', color: '#fff',
                    border: 'none', borderRadius: '4px',
                    fontFamily: '"Outfit", sans-serif', fontWeight: 700,
                    fontSize: '16px', cursor: 'pointer', letterSpacing: '0.02em',
                    transition: 'background 0.2s',
                  }}
                  className="hover:bg-[#15342c]"
                >
                  Submit Enquiry
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
