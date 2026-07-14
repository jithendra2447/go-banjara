'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Users, 
  ArrowLeft, 
  Check, 
  ShoppingBag, 
  CloudRain, 
  Wind, 
  Star, 
  SlidersHorizontal, 
  Heart, 
  X, 
  ChevronDown, 
  Sliders
} from 'lucide-react';
import { useCart } from '@/components/providers';
import { AmbientVibe } from '@/components/AmbientVibe';
import { PRODUCTS } from '@/data/products';
import { HOLIDAY_PACKAGES } from '@/data/packages';

export interface KeralaPackage {
  id: string;
  name: string;
  tabName: string;
  price: number;
  originalPrice?: number;
  duration: string;
  durationDays: number;
  rating: number;
  ratingCount: number;
  hotelStars: string;
  route: string[];
  description: string;
  inclusions: string[];
  images: string[];
  image: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  freeCancellation: boolean;
  category: string;
  itinerary: {
    day: string;
    title: string;
    places: string;
    offering: string;
  }[];
}

const KERALA_PACKAGES: KeralaPackage[] = [
  {
    id: 'pkg-kerala-4in1',
    name: 'KERALA COUPLE SPL',
    tabName: '4in1 Private',
    price: 24999,
    originalPrice: 39999,
    duration: '5 Days / 4 Nights',
    durationDays: 5,
    rating: 4.8,
    ratingCount: 142,
    hotelStars: '3★ / 4★ Premium',
    route: ['Kochi', 'Munnar', 'Thekkady', 'Alleppey', 'Kochi'],
    description: '4in1 Couple & Family Special Private Trip to Kerala. Experience the best of Munnar hills, Thekkady wildlife, and Alleppey backwaters in a single curated journey.',
    inclusions: ['Private AC Sedan', 'Premium Hotels', 'Houseboat Stay with all meals', 'Sightseeing & Tolls'],
    images: [
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    ],
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
    timeOfDay: 'morning',
    freeCancellation: true,
    category: 'Houseboat',
    itinerary: [
      {
        day: 'Info',
        title: 'Detailed Itinerary Coming Soon',
        places: 'Kerala',
        offering: 'Detailed itinerary and information about this package will be provided later.'
      }
    ]
  },
  {
    id: 'pkg-kerala-classic3',
    name: 'KERALA COUPLE & FAMILY SPL – PRIVATE TRIP- CLASSIC 3 – 4Days/3Nights',
    tabName: 'Classic 3',
    price: 19999,
    originalPrice: 29999,
    duration: '4 Days / 3 Nights',
    durationDays: 4,
    rating: 4.7,
    ratingCount: 98,
    hotelStars: '3★ Standard',
    route: ['Kochi', 'Munnar', 'Alleppey', 'Kochi'],
    description: 'Classic 3-night private getaway covering Munnar hills and Alleppey houseboats. Perfect for couples and families looking for a short refreshing break.',
    inclusions: ['Private Transport (AC Sedan)', 'Selected Stays', 'Backwater Cruise', 'Breakfast Included'],
    images: [
      'https://images.unsplash.com/photo-1517462964-21fdcec3f25b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80'
    ],
    image: 'https://images.unsplash.com/photo-1517462964-21fdcec3f25b?auto=format&fit=crop&w=800&q=80',
    timeOfDay: 'morning',
    freeCancellation: true,
    category: 'Resort',
    itinerary: [
      {
        day: 'Info',
        title: 'Detailed Itinerary Coming Soon',
        places: 'Kerala',
        offering: 'Detailed itinerary and information about this package will be provided later.'
      }
    ]
  },
  {
    id: 'pkg-kerala-highlights',
    name: 'KERALA HIGHLIGHTS TRIP – COUPLE & FAMILY SPL PRIVATE TRIP – 6 Days/5 Nights',
    tabName: 'Kerala Highlights',
    price: 29999,
    originalPrice: 39999,
    duration: '6 Days / 5 Nights',
    durationDays: 6,
    rating: 4.9,
    ratingCount: 186,
    hotelStars: '4★ Premium',
    route: ['Kochi', 'Munnar', 'Thekkady', 'Alleppey', 'Kochi'],
    description: 'Comprehensive 6-day highlight tour of Kerala. Take in the colonial charm of Fort Kochi, tea estates of Munnar, spice gardens of Thekkady, and serene backwater houseboats.',
    inclusions: ['AC SUV Transfer', 'Premium Accommodations', 'Houseboat Stay with meals', 'Sightseeing Tours'],
    images: [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=800&q=80'
    ],
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    timeOfDay: 'morning',
    freeCancellation: true,
    category: 'Adventure',
    itinerary: [
      {
        day: 'Info',
        title: 'Detailed Itinerary Coming Soon',
        places: 'Kerala',
        offering: 'Detailed itinerary and information about this package will be provided later.'
      }
    ]
  },
  {
    id: 'pkg-kerala-vibe',
    name: 'KERALA VIBE SPL – COUPLE & FAMILY SPL PRIVATE TRIP – 5Days/4Nights',
    tabName: 'Kerala Vibe',
    price: 24999,
    originalPrice: 39999,
    duration: '5 Days / 4 Nights',
    durationDays: 5,
    rating: 4.8,
    ratingCount: 112,
    hotelStars: '3★ / 4★ Premium',
    route: ['Thiruvananthapuram', 'Kovalam', 'Varkala', 'Alleppey'],
    description: 'Soak in the southern vibes of Kerala starting from Thiruvananthapuram. Explore Kovalam and Varkala beaches and wind down in the backwaters of Alleppey.',
    inclusions: ['Airport/Station Transfers', 'Beachside Resort Stays', 'Alleppey Houseboat day cruise', 'Daily breakfast & dinner'],
    images: [
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?auto=format&fit=crop&w=800&q=80'
    ],
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
    timeOfDay: 'afternoon',
    freeCancellation: true,
    category: 'Cultural',
    itinerary: [
      {
        day: 'Info',
        title: 'Detailed Itinerary Coming Soon',
        places: 'Kerala',
        offering: 'Detailed itinerary and information about this package will be provided later.'
      }
    ]
  }
];

const KERALA_NEWS = [
  "Vembanad Lake houseboats prepare for the annual Nehru Trophy Boat Race.",
  "Munnar tea plantations report lush green blooms after gentle tropical showers.",
  "Ayurvedic wellness retreats in Kumarakom open for the monsoon rejuvenation season.",
  "Alleppey coir cooperatives showcase new sustainable organic fiber home decor.",
  "Local spice farms in Cardamom Hills harvest premium grade Tellicherry black pepper."
];

export default function KeralaDetails() {
  const { addToCart } = useCart();
  const [packages, setPackages] = useState<KeralaPackage[]>(KERALA_PACKAGES);
  const [bookingDate, setBookingDate] = useState('');
  const [guests, setGuests] = useState(2);
  const [bookedSuccess, setBookedSuccess] = useState(false);
  const [productAddedSuccess, setProductAddedSuccess] = useState<string | null>(null);

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

      if (!saved || needsSave) {
        localStorage.setItem('gb_admin_packages', JSON.stringify(merged));
      }
      parsed = merged;

      if (parsed) {
        const filtered = parsed.filter((pkg: any) => {
          const destLower = pkg.destination ? pkg.destination.toLowerCase() : '';
          const nameLower = pkg.name ? pkg.name.toLowerCase() : '';
          
          return (
            destLower.includes('kerala') || 
            nameLower.includes('kerala') || 
            nameLower.includes('munnar') || 
            nameLower.includes('alleppey') ||
            pkg.id.startsWith('pkg-kerala')
          );
        });

        const mapped = filtered.map((pkg: any) => {
          if (!pkg.tabName) {
            pkg.tabName = pkg.name.split(' ')[0] + ' ' + (pkg.durationDays ? `${pkg.durationDays}D` : 'Trip');
          }
          if (!pkg.duration) {
            pkg.duration = `${pkg.durationDays || 5} Days / ${pkg.durationDays ? pkg.durationDays - 1 : 4} Nights`;
          }
          if (!pkg.hotelStars) {
            pkg.hotelStars = pkg.hotelStars || '3★ / 4★ Premium';
          }
          if (!pkg.route) {
            pkg.route = pkg.routePath || [];
          }
          if (!pkg.timeOfDay) {
            pkg.timeOfDay = 'morning';
          }
          if (pkg.freeCancellation === undefined) {
            pkg.freeCancellation = true;
          }
          if (!pkg.category) {
            pkg.category = 'Houseboat';
          }
          if (!pkg.images) {
            pkg.images = [pkg.image];
          }
          return pkg;
        });

        if (mapped.length > 0) {
          setPackages(mapped);
        }
      }
    } catch (e) {
      console.error('Error loading admin packages:', e);
    }
  }, []);

  // Live weather status state
  const [liveTemp, setLiveTemp] = useState({ temp: 28.2, condition: 'Tropical Showers', wind: '18 km/h', humidity: '89%' });
  const [newsIdx, setNewsIdx] = useState(0);

  // Viator filter states
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [adults, setAdults] = useState<number>(2);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [priceRange, setPriceRange] = useState<number>(40000);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [activeDetailPkg, setActiveDetailPkg] = useState<KeralaPackage | null>(null);
  const [modalActiveTab, setModalActiveTab] = useState<'overview' | 'itinerary' | 'reviews'>('overview');
  const [modalExpandedDayIdx, setModalExpandedDayIdx] = useState<number | null>(0);
  const [carouselIndexes, setCarouselIndexes] = useState<Record<string, number>>({});

  // Dropdown/Modal UI open states
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [travelersOpen, setTravelersOpen] = useState(false);
  const [filtersDrawerOpen, setFiltersDrawerOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Calendar UI states
  const [calendarYear, setCalendarYear] = useState(2026);
  const [calendarMonth, setCalendarMonth] = useState(5); // June (0-indexed is 5)
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(27); // June 27 as default

  useEffect(() => {
    // Weather simulation
    const weatherInterval = setInterval(() => {
      setLiveTemp(prev => {
        const change = Math.random() > 0.5 ? 0.2 : -0.2;
        const nextTemp = parseFloat((prev.temp + change).toFixed(1));
        return {
          ...prev,
          temp: nextTemp < 25 ? 25 : nextTemp > 33 ? 33 : nextTemp
        };
      });
    }, 12000);

    // News rotation
    const newsInterval = setInterval(() => {
      setNewsIdx(prev => (prev + 1) % KERALA_NEWS.length);
    }, 6000);

    return () => {
      clearInterval(weatherInterval);
      clearInterval(newsInterval);
    };
  }, []);

  const handleProductAdd = (prod: typeof PRODUCTS[number]) => {
    const cartItem = {
      id: prod.id,
      name: prod.name,
      price: prod.price,
      image: prod.image,
    };
    addToCart(cartItem, 'shop', undefined, 1);
    setProductAddedSuccess(prod.id);
    setTimeout(() => setProductAddedSuccess(null), 2500);
  };

  // Filter recommended products for Kerala (Kasavu Mundu & Cardamom)
  const keralaProducts = PRODUCTS.filter(p => 
    ['prod-mundu', 'prod-cardamom'].includes(p.id)
  );

  // Filtering and sorting logic
  const filteredAndSortedPackages = React.useMemo(() => {
    let result = [...packages];

    // Filter by Price
    result = result.filter(pkg => pkg.price <= priceRange);

    // Filter by Time of Day
    if (selectedTimes.length > 0) {
      result = result.filter(pkg => selectedTimes.includes(pkg.timeOfDay));
    }

    // Filter by Duration
    if (selectedDurations.length > 0) {
      result = result.filter(pkg => {
        const days = pkg.durationDays;
        return selectedDurations.some(dur => {
          if (dur === 'short') return days < 1; // less than 1 day
          if (dur === 'medium') return days >= 1 && days <= 3; // 1-3 days
          if (dur === 'long') return days > 3; // 4+ days
          return false;
        });
      });
    }

    // Filter by Category
    if (selectedCategories.length > 0) {
      result = result.filter(pkg => selectedCategories.includes(pkg.category));
    }

    // Sort logic
    if (sortBy === 'featured') {
      // Keep original order
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'duration_asc') {
      result.sort((a, b) => a.durationDays - b.durationDays);
    } else if (sortBy === 'duration_desc') {
      result.sort((a, b) => b.durationDays - a.durationDays);
    }

    return result;
  }, [priceRange, selectedTimes, selectedDurations, selectedCategories, sortBy]);

  return (
    <div className="bg-[#FAF9F6] text-[#1D493E] min-h-screen font-sans relative overflow-x-hidden">
      {/* Gentle monsoon rainfall canvas particle effect */}
      <AmbientVibe effect="monsoon" />

      {/* Immersive Header (High-contrast layout, with Weather Widget) */}
      <section className="relative h-[65vh] flex items-end overflow-hidden bg-slate-950 text-white border-b border-[#FFFF80]/15">
        <img 
          src="https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1600&q=80" 
          alt="Kerala Backwaters" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1D19] via-[#0A1D19]/45 to-transparent" />
        
        {/* Floating Back button */}
        <Link 
          href="/travel"
          className="absolute top-8 left-8 glass p-3.5 rounded-full flex items-center justify-center text-white hover:scale-105 transition duration-300 border border-white/10 bg-white/5 z-20"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 pb-12 grid md:grid-cols-12 gap-8 items-end">
          {/* Left: Titles & description */}
          <div className="md:col-span-8 space-y-4 text-left">
            <span className="badge bg-[#E05434]/20 text-[#E05434] border border-[#E05434]/30 font-black text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider inline-block">
              God&apos;s Own Country • Kerala
            </span>
            <h1 className="text-4xl md:text-7xl font-light font-serif text-slate-100 leading-tight">
              Emerald Canals & Spices
            </h1>
            <p className="text-sm md:text-base text-slate-300 max-w-xl font-normal leading-relaxed">
              Glide past tropical palms on authentic bamboo houseboats, explore below-sea-level rice fields, and savor fresh local cuisines. Scroll down to discover our local travel packages.
            </p>
          </div>

          {/* Right: Live Temperature Widget (Exclusive Offers Removed) */}
          <div className="md:col-span-4 space-y-4">
            {/* Live Weather Widget (Highly Prominent Alappuzha Weather) */}
            <div className="bg-[#1D493E] border border-[#FFFF80]/20 rounded-2xl p-4 shadow-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#FFFF80] flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#E05434] animate-ping" />
                  Live Alappuzha Weather
                </span>
                <span className="text-[10px] text-slate-300 font-mono">1M Elevation</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-baseline text-4xl font-light text-slate-100 font-serif">
                  {liveTemp.temp}
                  <span className="text-2xl font-serif">°C</span>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="text-left space-y-0.5">
                  <p className="text-xs font-bold text-white flex items-center gap-1">
                    <CloudRain className="w-3.5 h-3.5 text-sky-400 animate-bounce" />
                    {liveTemp.condition}
                  </p>
                  <p className="text-[10px] text-slate-300 font-mono flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-[#FFFF80]" />
                    Wind: {liveTemp.wind}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Viator-Style Tours & Activities Packages Section */}
      <section className="bg-[#FAF9F6] text-[#1D493E] py-16 relative z-10 border-t border-[#1D493E]/10">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          
          {/* Section Header */}
          <div className="text-left space-y-2">
            <h2 className="text-3xl font-bold font-sans tracking-tight text-[#1C2C26]">
              Kerala Tours & Activities
            </h2>
            <p className="text-sm text-[#1D493E]/75">
              Explore handpicked, high-rated immersive slow-travel experiences.
            </p>
          </div>

          {/* Viator-Style Filter & Sort Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1D493E]/10 pb-6 relative font-sans">
            
            {/* Left: Interactive Filter Buttons */}
            <div className="flex flex-wrap items-center gap-3 font-sans">
              
              {/* 1. Select Dates Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setDatePickerOpen(!datePickerOpen);
                    setTravelersOpen(false);
                    setSortDropdownOpen(false);
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    selectedDate 
                      ? 'bg-[#1D493E] text-white border-[#1D493E]' 
                      : 'bg-white text-[#1D493E] border-[#1D493E]/20 hover:border-[#1D493E]/50'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>{selectedDate ? selectedDate : 'Select Dates'}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {/* Calendar Dropdown Panel */}
                {datePickerOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-white border border-[#1D493E]/15 rounded-2xl shadow-xl p-5 z-40 w-[320px] md:w-[360px]">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-bold text-sm text-[#1D493E]">When are you traveling?</span>
                      <button 
                        type="button" 
                        onClick={() => setDatePickerOpen(false)} 
                        className="p-1 rounded-full hover:bg-gray-100 text-[#1D493E]/50 hover:text-[#1D493E] cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* June 2026 Calendar Grid */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs font-bold text-[#1D493E]/70 px-1">
                        <button 
                          type="button" 
                          onClick={() => {
                            if (calendarMonth === 5) {
                              setCalendarMonth(4); // May
                            } else {
                              setCalendarMonth(5); // June
                              setCalendarYear(2026);
                            }
                          }}
                          className="p-1 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          &lt;
                        </button>
                        <span>{calendarMonth === 5 ? 'June 2026' : calendarMonth === 4 ? 'May 2026' : 'July 2026'}</span>
                        <button 
                          type="button"
                          onClick={() => {
                            if (calendarMonth === 5) {
                              setCalendarMonth(6); // July
                            } else {
                              setCalendarMonth(5); // June
                              setCalendarYear(2026);
                            }
                          }}
                          className="p-1 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          &gt;
                        </button>
                      </div>

                      {/* Calendar Days */}
                      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-[#1D493E]/80">
                        {/* Days of week */}
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                          <div key={d} className="font-bold text-[#1D493E]/45 py-1">{d}</div>
                        ))}

                        {/* Month Days */}
                        {calendarMonth === 5 ? (
                          <>
                            {/* Empty cell for Sunday */}
                            <div />
                            {Array.from({ length: 30 }).map((_, i) => {
                              const dayNum = i + 1;
                              const isToday = dayNum === 27;
                              const isSelected = selectedCalendarDay === dayNum;
                              return (
                                <button
                                  key={dayNum}
                                  type="button"
                                  onClick={() => setSelectedCalendarDay(dayNum)}
                                  className={`py-2 rounded-lg text-center transition cursor-pointer ${
                                    isSelected 
                                      ? 'bg-[#008266] text-white font-bold' 
                                      : isToday
                                        ? 'border border-[#008266] text-[#008266] font-bold'
                                        : 'hover:bg-gray-100 text-[#1D493E]'
                                  }`}
                                >
                                  {dayNum}
                                </button>
                              );
                            })}
                          </>
                        ) : calendarMonth === 4 ? (
                          <>
                            {/* May 2026 starts on Friday (5 empty cells) */}
                            <div /><div /><div /><div /><div />
                            {Array.from({ length: 31 }).map((_, i) => {
                              const dayNum = i + 1;
                              const isSelected = selectedCalendarDay === dayNum;
                              return (
                                <button
                                  key={dayNum}
                                  type="button"
                                  onClick={() => setSelectedCalendarDay(dayNum)}
                                  className={`py-2 rounded-lg text-center transition cursor-pointer ${
                                    isSelected ? 'bg-[#008266] text-white font-bold' : 'hover:bg-gray-100 text-[#1D493E]'
                                  }`}
                                >
                                  {dayNum}
                                </button>
                              );
                            })}
                          </>
                        ) : (
                          <>
                            {/* July 2026 starts on Wednesday (3 empty cells) */}
                            <div /><div /><div />
                            {Array.from({ length: 31 }).map((_, i) => {
                              const dayNum = i + 1;
                              const isSelected = selectedCalendarDay === dayNum;
                              return (
                                <button
                                  key={dayNum}
                                  type="button"
                                  onClick={() => setSelectedCalendarDay(dayNum)}
                                  className={`py-2 rounded-lg text-center transition cursor-pointer ${
                                    isSelected ? 'bg-[#008266] text-white font-bold' : 'hover:bg-gray-100 text-[#1D493E]'
                                  }`}
                                >
                                  {dayNum}
                                </button>
                              );
                            })}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Calendar Footer */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCalendarDay(null);
                          setSelectedDate('');
                          setBookingDate('');
                          setDatePickerOpen(false);
                        }}
                        className="text-xs font-bold text-[#1C2C26] hover:underline cursor-pointer"
                      >
                        Reset
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedCalendarDay) {
                            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                            setSelectedDate(`${months[calendarMonth]} ${selectedCalendarDay}, ${calendarYear}`);
                            const formattedMonth = String(calendarMonth + 1).padStart(2, '0');
                            const formattedDay = String(selectedCalendarDay).padStart(2, '0');
                            setBookingDate(`${calendarYear}-${formattedMonth}-${formattedDay}`);
                          }
                          setDatePickerOpen(false);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#008266] text-white text-xs font-bold shadow-sm hover:bg-[#006e56] transition cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Travelers Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setTravelersOpen(!travelersOpen);
                    setDatePickerOpen(false);
                    setSortDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full border bg-white text-[#1D493E] border-[#1D493E]/20 hover:border-[#1D493E]/50 text-xs font-semibold tracking-wide transition-all cursor-pointer"
                >
                  <Users className="w-4 h-4" />
                  <span>{adults + childrenCount} {adults + childrenCount === 1 ? 'Traveler' : 'Travelers'}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {/* Travelers Dropdown Panel */}
                {travelersOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-white border border-[#1D493E]/15 rounded-2xl shadow-xl p-5 z-40 w-[280px]">
                    <span className="text-[11px] text-gray-500 block mb-4 text-left font-medium">You can select up to 15 travelers in total.</span>
                    
                    <div className="space-y-4 font-sans">
                      {/* Adults Row */}
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <span className="font-bold text-sm text-[#1D493E] block">Adult (18+)</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setAdults(Math.max(1, adults - 1))}
                            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-sm font-bold font-mono w-4 text-center">{adults}</span>
                          <button
                            type="button"
                            onClick={() => {
                              if (adults + childrenCount < 15) setAdults(adults + 1);
                            }}
                            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Children Row */}
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <span className="font-bold text-sm text-[#1D493E] block">Child (0-17)</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-sm font-bold font-mono w-4 text-center">{childrenCount}</span>
                          <button
                            type="button"
                            onClick={() => {
                              if (adults + childrenCount < 15) setChildrenCount(childrenCount + 1);
                            }}
                            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Travelers Footer */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-5">
                      <button
                        type="button"
                        onClick={() => {
                          setAdults(2);
                          setChildrenCount(0);
                          setGuests(2);
                          setTravelersOpen(false);
                        }}
                        className="text-xs font-bold text-[#1C2C26] hover:underline cursor-pointer"
                      >
                        Reset
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setGuests(adults + childrenCount);
                          setTravelersOpen(false);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#008266] text-white text-xs font-bold shadow-sm hover:bg-[#006e56] transition cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. More Filters Button */}
              <button
                type="button"
                onClick={() => {
                  setFiltersDrawerOpen(true);
                  setDatePickerOpen(false);
                  setTravelersOpen(false);
                  setSortDropdownOpen(false);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  selectedTimes.length > 0 || selectedDurations.length > 0 || selectedCategories.length > 0 || priceRange < 40000
                    ? 'bg-[#1D493E] text-white border-[#1D493E]'
                    : 'bg-white text-[#1D493E] border-[#1D493E]/20 hover:border-[#1D493E]/50'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
                {(selectedTimes.length + selectedDurations.length + selectedCategories.length + (priceRange < 40000 ? 1 : 0)) > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#E05434] text-white text-[9px] flex items-center justify-center font-bold">
                    {selectedTimes.length + selectedDurations.length + selectedCategories.length + (priceRange < 40000 ? 1 : 0)}
                  </span>
                )}
              </button>

            </div>

            {/* Right: Results Count & Sort Dropdown */}
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="text-gray-500 font-semibold">{filteredAndSortedPackages.length} Results</span>
              
              <div className="relative font-sans">
                <button
                  type="button"
                  onClick={() => {
                    setSortDropdownOpen(!sortDropdownOpen);
                    setDatePickerOpen(false);
                    setTravelersOpen(false);
                  }}
                  className="flex items-center gap-1.5 font-semibold text-[#1D493E] cursor-pointer hover:underline"
                >
                  <span>Sort by: </span>
                  <span className="font-bold text-[#008266]">
                    {sortBy === 'featured' && 'Featured'}
                    {sortBy === 'rating' && 'Traveler Rating'}
                    {sortBy === 'price_asc' && 'Price (Low to High)'}
                    {sortBy === 'price_desc' && 'Price (High to Low)'}
                    {sortBy === 'duration_asc' && 'Duration (Short to Long)'}
                    {sortBy === 'duration_desc' && 'Duration (Long to Short)'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {/* Sort Dropdown List */}
                {sortDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white border border-[#1D493E]/15 rounded-xl shadow-xl p-2 z-40 w-[200px] text-left">
                    {[
                      { val: 'featured', label: 'Featured' },
                      { val: 'rating', label: 'Traveler Rating' },
                      { val: 'price_asc', label: 'Price (Low to High)' },
                      { val: 'price_desc', label: 'Price (High to Low)' },
                      { val: 'duration_asc', label: 'Duration (Short to Long)' },
                      { val: 'duration_desc', label: 'Duration (Long to Short)' }
                    ].map(opt => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => {
                          setSortBy(opt.val);
                          setSortDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          sortBy === opt.val 
                            ? 'bg-[#f3faf5] text-[#008266] font-bold' 
                            : 'hover:bg-gray-50 text-[#1D493E]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Viator-Style Package Card Grid */}
          {filteredAndSortedPackages.length === 0 ? (
            <div className="bg-white border border-[#1D493E]/10 rounded-[32px] p-12 text-center max-w-xl mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto text-gray-400">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1D493E]">No tours match your filters</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                Try widening your price range, clearing some checkboxes, or resetting your filters to explore Kerala&apos;s slow-travel packages.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedTimes([]);
                  setSelectedDurations([]);
                  setSelectedCategories([]);
                  setPriceRange(40000);
                  setSelectedDate('');
                  setBookingDate('');
                  setAdults(2);
                  setChildrenCount(0);
                  setGuests(2);
                }}
                className="px-5 py-2.5 rounded-full bg-[#1D493E] text-white text-xs font-bold shadow hover:bg-[#15342c] transition cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredAndSortedPackages.map((pkg) => {
                // Find original rank index in KERALA_PACKAGES (to keep the ranking number stable!)
                const originalRank = KERALA_PACKAGES.findIndex(p => p.id === pkg.id) + 1;
                const isFav = !!favorites[pkg.id];
                const activeImgIdx = carouselIndexes[pkg.id] || 0;

                return (
                  <div 
                    key={pkg.id}
                    className="bg-white rounded-[24px] border border-[#1D493E]/10 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
                  >
                    
                    {/* Image Area */}
                    <div className="relative h-60 w-full overflow-hidden bg-slate-900">
                      
                      {/* Image Slider */}
                      <img 
                        src={pkg.images[activeImgIdx]} 
                        alt={pkg.name} 
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 opacity-95"
                      />
                      
                      {/* Couple Spl Badge overlay */}
                      <div className="absolute top-4 left-4 bg-blue-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-sm shadow-md uppercase tracking-wider z-10">
                        Couple Spl
                      </div>
                      
                      {/* Rank Number Badge (Reference UI style) */}
                      <div className="absolute bottom-4 left-5 select-none font-sans font-black text-white text-6xl leading-none opacity-85 tracking-tighter drop-shadow-[0_4px_6px_rgba(0,0,0,0.45)]">
                        {originalRank}
                      </div>

                      {/* Heart Button (Favorite) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFavorites(prev => ({ ...prev, [pkg.id]: !prev[pkg.id] }));
                        }}
                        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition cursor-pointer z-10 text-[#1D493E]"
                      >
                        <Heart 
                          className={`w-4 h-4 transition-colors ${
                            isFav ? 'fill-[#E05434] stroke-[#E05434]' : 'stroke-[#1D493E] hover:stroke-[#E05434]'
                          }`} 
                        />
                      </button>

                      {/* Carousel Dots Center Overlay */}
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
                        {pkg.images.map((_, dotIdx) => (
                          <button
                            key={dotIdx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCarouselIndexes(prev => ({ ...prev, [pkg.id]: dotIdx }));
                            }}
                            className={`w-1.5 h-1.5 rounded-full transition cursor-pointer ${
                              activeImgIdx === dotIdx ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'
                            }`}
                          />
                        ))}
                      </div>

                    </div>

                    {/* Text Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between text-left space-y-3 font-sans">
                      
                      <div className="space-y-1.5">
                        
                        {/* Rating Row */}
                        <div className="flex items-center gap-1 text-[11px] text-[#1D493E]/60 font-bold">
                          <div className="flex items-center text-amber-500 gap-0.5">
                            <Star className="w-3.5 h-3.5 fill-amber-500 stroke-none" />
                            <span className="text-xs text-[#1D493E]">{pkg.rating.toFixed(1)}</span>
                          </div>
                          <span>({pkg.ratingCount})</span>
                          <span className="mx-1">•</span>
                          <span className="uppercase tracking-wider text-[#008266] font-extrabold">{pkg.category}</span>
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-base text-[#1C2C26] leading-snug group-hover:text-[#008266] transition-colors font-sans">
                          {pkg.name}
                        </h3>

                        {/* Duration & Cancellation */}
                        <p className="text-[11px] text-[#1D493E]/65 font-semibold flex items-center gap-1.5">
                          <span>{pkg.duration}</span>
                          {pkg.freeCancellation && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className="text-[#008266] font-bold">Free Cancellation</span>
                            </>
                          )}
                        </p>

                      </div>

                      {/* Bottom price row and button */}
                      <div className="pt-4 border-t border-[#1D493E]/5 flex justify-between items-end">
                        <div className="text-left">
                          {pkg.originalPrice && (
                            <span className="text-[10px] text-gray-400 line-through block font-medium">
                              From ₹{pkg.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                          {!pkg.originalPrice && (
                            <span className="text-[9px] font-mono uppercase tracking-widest text-[#1D493E]/50 block">From</span>
                          )}
                          <span className="text-lg font-extrabold text-[#1D493E]">
                            ₹{pkg.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[9px] text-[#1D493E]/50 font-medium block">per traveler</span>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => {
                            setActiveDetailPkg(pkg);
                            setModalActiveTab('overview');
                            setModalExpandedDayIdx(0);
                          }}
                          className="px-4 py-2 rounded-xl border border-[#1D493E]/20 text-[#1D493E] hover:bg-[#1D493E] hover:text-white text-xs font-bold tracking-wide transition duration-300 cursor-pointer"
                        >
                          Explore Tour
                        </button>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* Sliding Filter Drawer Overlay */}
      {filtersDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end font-sans">
          
          {/* Backdrop */}
          <div 
            onClick={() => setFiltersDrawerOpen(false)}
            className="absolute inset-0 bg-black/45 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10 transition-transform duration-300 transform translate-x-0">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-[#1C2C26]">Filter</h3>
              <button 
                type="button" 
                onClick={() => setFiltersDrawerOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-[#1D493E]/50 hover:text-[#1D493E] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left">
              
              {/* 1. Tour Types (Categories) */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-[#1C2C26]">Categories</h4>
                <div className="grid grid-cols-2 gap-3">
                  {['Houseboat', 'Resort', 'Adventure', 'Cultural'].map(cat => {
                    const isChecked = selectedCategories.includes(cat);
                    return (
                      <label 
                        key={cat} 
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer transition ${
                          isChecked 
                            ? 'bg-[#f3faf5] border-[#008266] text-[#008266]' 
                            : 'bg-white border-gray-200 hover:border-[#1D493E]/30 text-[#1D493E]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-[#008266] focus:ring-[#008266] w-4 h-4 cursor-pointer"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setSelectedCategories(selectedCategories.filter(c => c !== cat));
                            } else {
                              setSelectedCategories([...selectedCategories, cat]);
                            }
                          }}
                        />
                        <span>{cat}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 2. Price Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-[#1C2C26]">Price</span>
                  <span className="font-extrabold text-[#008266]">₹{priceRange.toLocaleString('en-IN')}+</span>
                </div>
                <div className="space-y-1">
                  <input
                    type="range"
                    min="4000"
                    max="40000"
                    step="1000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#008266]"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                    <span>₹4,000</span>
                    <span>₹40,000+</span>
                  </div>
                </div>
              </div>

              {/* 3. Time of Day */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-[#1C2C26]">Time of Day</h4>
                <div className="space-y-2">
                  {[
                    { val: 'morning', label: 'Morning', desc: 'Starts before 12pm' },
                    { val: 'afternoon', label: 'Afternoon', desc: 'Starts after 12pm' },
                    { val: 'evening', label: 'Evening and night', desc: 'Starts after 5pm' }
                  ].map(time => {
                    const isChecked = selectedTimes.includes(time.val);
                    const count = KERALA_PACKAGES.filter(p => p.timeOfDay === time.val).length;
                    return (
                      <label 
                        key={time.val}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-semibold cursor-pointer transition ${
                          isChecked 
                            ? 'bg-[#f3faf5] border-[#008266] text-[#008266]' 
                            : 'bg-white border-gray-200 hover:border-[#1D493E]/30 text-[#1D493E]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-[#008266] focus:ring-[#008266] w-4.5 h-4.5 cursor-pointer"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setSelectedTimes(selectedTimes.filter(t => t !== time.val));
                              } else {
                                setSelectedTimes([...selectedTimes, time.val]);
                              }
                            }}
                          />
                          <div className="text-left">
                            <span className="font-bold text-[#1C2C26] block">{time.label} ({count})</span>
                            <span className="text-[10px] text-gray-400 font-normal block">{time.desc}</span>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 4. Duration */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-[#1C2C26]">Duration</h4>
                <div className="space-y-2">
                  {[
                    { val: 'short', label: 'Up to 1 day', count: KERALA_PACKAGES.filter(p => p.durationDays < 1).length },
                    { val: 'medium', label: '1 to 3 days', count: KERALA_PACKAGES.filter(p => p.durationDays >= 1 && p.durationDays <= 3).length },
                    { val: 'long', label: '4+ days', count: KERALA_PACKAGES.filter(p => p.durationDays > 3).length }
                  ].map(dur => {
                    const isChecked = selectedDurations.includes(dur.val);
                    return (
                      <label 
                        key={dur.val}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-semibold cursor-pointer transition ${
                          isChecked 
                            ? 'bg-[#f3faf5] border-[#008266] text-[#008266]' 
                            : 'bg-white border-gray-200 hover:border-[#1D493E]/30 text-[#1D493E]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-[#008266] focus:ring-[#008266] w-4.5 h-4.5 cursor-pointer"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setSelectedDurations(selectedDurations.filter(d => d !== dur.val));
                              } else {
                                setSelectedDurations([...selectedDurations, dur.val]);
                              }
                            }}
                          />
                          <span className="font-bold text-[#1C2C26]">{dur.label} ({dur.count})</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="border-t border-gray-100 p-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setSelectedTimes([]);
                  setSelectedDurations([]);
                  setSelectedCategories([]);
                  setPriceRange(40000);
                }}
                className="text-xs font-bold text-[#1C2C26] hover:underline cursor-pointer"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={() => setFiltersDrawerOpen(false)}
                className="px-6 py-3 rounded-xl bg-[#008266] hover:bg-[#006e56] text-white text-xs font-bold shadow-md transition cursor-pointer"
              >
                See {filteredAndSortedPackages.length} results
              </button>
            </div>

          </div>

        </div>
      )}

      {/* Immersive Tour Details Modal */}
      {activeDetailPkg && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 md:p-10 font-sans">
          
          {/* Backdrop */}
          <div 
            onClick={() => setActiveDetailPkg(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-5xl bg-white rounded-[32px] overflow-hidden shadow-2xl border border-[#1D493E]/20 flex flex-col md:flex-row h-[85vh] z-10 animate-fade-in">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveDetailPkg(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/30 backdrop-blur-xs flex items-center justify-center text-white hover:bg-black/50 transition cursor-pointer z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Column: Visual Showcase, Tabs, Details (w-full md:w-[65%] - Scrollable) */}
            <div className="w-full md:w-[65%] h-[55vh] md:h-full overflow-y-auto p-6 md:p-8 space-y-6 text-left border-r border-[#1D493E]/10">
              
              {/* Header Title Row */}
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2 text-[9px] font-black uppercase font-mono">
                  <span className="bg-[#FFF0EB] text-[#FF623E] tracking-wider px-2.5 py-1 rounded">
                    {activeDetailPkg.duration}
                  </span>
                  <span className="text-[#1D493E] bg-[#FAF9F6] border border-[#1D493E]/10 px-2.5 py-1 rounded">
                    {activeDetailPkg.hotelStars}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between sm:items-start border-b border-[#1D493E]/10 pb-5 gap-3">
                  <h3 className="text-2xl font-serif font-bold text-[#1D493E] leading-tight">
                    {activeDetailPkg.name}
                  </h3>
                  <div className="text-left sm:text-right space-y-1">
                    <span className="text-xl font-serif font-black text-[#E05434]">
                      ₹{activeDetailPkg.price.toLocaleString('en-IN')}/Person
                    </span>
                    <span className="text-[10px] text-gray-400 block font-mono">Stays & Transfers included</span>
                  </div>
                </div>
              </div>

              {/* Visual Showcase Frame */}
              <div className="relative aspect-[16/9] overflow-hidden rounded-[24px] border border-[#1D493E]/10 bg-slate-900 shadow-md">
                <img 
                  src={activeDetailPkg.images[0]} 
                  alt={activeDetailPkg.name} 
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[#E05434] shadow-xs">
                  <Star className="w-3.5 h-3.5 fill-[#E05434] stroke-none" />
                  <span className="text-xs font-black">{activeDetailPkg.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Tab Selector */}
              <div className="flex gap-6 border-b border-[#1D493E]/10 pb-2">
                {['overview', 'itinerary', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setModalActiveTab(tab as any)}
                    className={`pb-2 text-xs font-black uppercase tracking-wider relative transition-colors cursor-pointer ${
                      modalActiveTab === tab ? 'text-[#1D493E]' : 'text-gray-400 hover:text-[#1D493E]'
                    }`}
                  >
                    {tab}
                    {modalActiveTab === tab && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#E05434] rounded-full animate-fade-in" />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Contents: Overview */}
              {modalActiveTab === 'overview' && (
                <div className="space-y-6 text-left animate-in fade-in duration-300">
                  <p className="text-sm text-gray-600 font-semibold leading-relaxed">
                    {activeDetailPkg.description}
                  </p>
                  
                  {/* Route Map */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-mono text-[#1D493E]/60 uppercase font-black tracking-wider block">Expedition Route Map</span>
                    <div className="flex flex-wrap items-center gap-2 bg-[#f3faf5] border border-[#1D493E]/8 p-3 rounded-2xl">
                      {Array.isArray(activeDetailPkg.route) && activeDetailPkg.route.map((node: string, i: number) => (
                        <React.Fragment key={i}>
                          <span className="text-[10px] font-sans font-extrabold text-[#1D493E] bg-white border border-[#1D493E]/10 px-2.5 py-1.5 rounded-xl shadow-sm">
                            {node}
                          </span>
                          {i < activeDetailPkg.route.length - 1 && (
                            <span className="text-[#E05434] text-xs font-black">→</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Inclusions */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-mono text-[#1D493E]/60 uppercase font-black tracking-wider block">Package Inclusions</span>
                    <div className="grid grid-cols-2 gap-3">
                      {Array.isArray(activeDetailPkg.inclusions) && activeDetailPkg.inclusions.map((inc: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 bg-white border border-[#1D493E]/10 p-2.5 rounded-xl">
                          <Check className="w-4 h-4 text-[#E05434] flex-shrink-0" />
                          <span className="text-xs font-bold text-[#1D493E]">{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Contents: Itinerary Accordion */}
              {modalActiveTab === 'itinerary' && (
                <div className="space-y-6 text-left animate-in fade-in duration-300">
                  <h3 className="text-lg font-serif font-light text-[#E05434] leading-snug mb-4">
                    A day-by-day breakdown of what to expect.
                  </h3>
                  <div className="space-y-4">
                    {Array.isArray(activeDetailPkg.itinerary) && activeDetailPkg.itinerary.map((step: any, idx: number) => {
                      const isOpen = modalExpandedDayIdx === idx;
                      const numStr = String(idx + 1).padStart(2, '0');
                      return (
                        <div key={idx} className="border border-[#1D493E]/10 rounded-2xl overflow-hidden bg-white shadow-xs">
                          <button
                            type="button"
                            onClick={() => setModalExpandedDayIdx(isOpen ? null : idx)}
                            className="w-full p-5 flex justify-between items-center text-left hover:bg-gray-50 transition cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-[#E05434] font-black text-sm font-mono shrink-0">
                                {numStr}
                              </span>
                              <span className="text-sm font-extrabold text-[#1D493E] leading-snug">
                                {step.day || `Day ${idx + 1}`}: {step.title}
                              </span>
                            </div>
                            <span className="text-[#1D493E] text-xs font-bold font-mono">
                              {isOpen ? '▲' : '▼'}
                            </span>
                          </button>
                          {isOpen && (
                            <div className="px-5 pb-5 pt-3 border-t border-[#1D493E]/5 text-xs text-gray-600 font-semibold leading-relaxed space-y-4 text-left">
                              <p>{step.offering}</p>
                              
                              {step.places && (
                                <div className="space-y-1.5 pt-2 border-t border-[#1D493E]/5">
                                  <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block">Key Route Stops:</span>
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    {(typeof step.places === 'string' ? step.places.split(',') : step.places).map((place: string, i: number) => (
                                      <React.Fragment key={i}>
                                        <span className="text-[9px] font-sans font-extrabold text-[#1D493E] bg-[#FAF9F6] border border-gray-150/60 px-2.5 py-1 rounded-xl">
                                          {place.trim()}
                                        </span>
                                        {i < (typeof step.places === 'string' ? step.places.split(',') : step.places).length - 1 && (
                                          <span className="text-gray-300 text-[9px]">➔</span>
                                        )}
                                      </React.Fragment>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab Contents: Reviews */}
              {modalActiveTab === 'reviews' && (
                <div className="space-y-6 text-left animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white border border-[#1D493E]/10 p-6 rounded-2xl items-center shadow-xs">
                    <div className="text-center space-y-1.5 border-r border-[#1D493E]/10 pr-6">
                      <span className="text-5xl font-black text-[#1D493E] font-serif">{activeDetailPkg.rating.toFixed(1)}</span>
                      <div className="flex justify-center text-[#E05434] gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 stroke-none ${i < Math.floor(activeDetailPkg.rating) ? 'fill-[#E05434]' : 'fill-gray-200'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] text-gray-400 block font-mono">Verified Reviews</span>
                    </div>
                    <div className="sm:col-span-2 space-y-2.5 text-xs font-semibold text-gray-600 pl-2">
                      <p className="italic leading-relaxed">&ldquo;Fantastic itinerary! Go Banjara did a marvellous job arranging the private houseboats and activities.&rdquo;</p>
                      <span className="block text-[9px] font-mono text-gray-400">— Jithendra V., July 2026</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Right Column: Weather & Booking form (w-full md:w-[35%] - Scrollable) */}
            <div className="w-full md:w-[35%] h-[30vh] md:h-full overflow-y-auto p-6 bg-[#FAF9F6] space-y-6 text-left">
              
              {/* Weather status Widget */}
              <div className="bg-[#1D493E] text-white p-5 rounded-[24px] border border-white/10 shadow-md space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#FFFF80] flex items-center gap-1.5 font-bold">
                    <span className="w-2 h-2 rounded-full bg-brand-orange animate-ping" />
                    Live Weather
                  </span>
                  <span className="text-[9px] text-slate-300 font-mono">Kerala Base</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-baseline text-4xl font-light text-slate-100 font-serif">
                    {liveTemp.temp}
                    <span className="text-2xl font-serif">°C</span>
                  </div>
                  <div className="h-8 w-px bg-white/10" />
                  <div className="text-left space-y-0.5">
                    <p className="text-xs font-bold text-white">
                      {liveTemp.condition}
                    </p>
                    <p className="text-[9px] text-slate-300 font-mono">
                      Wind: {liveTemp.wind}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking board Form card */}
              <div className="bg-white border-2 border-[#1D493E] p-6 rounded-[28px] shadow-[4px_4px_0px_0px_#1D493E] space-y-4">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-black border-b border-gray-100 pb-2">
                  Secure Your Booking
                </span>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!bookingDate) {
                      alert('Please select a travel date.');
                      return;
                    }
                    const finalItem = {
                      id: activeDetailPkg.id,
                      name: activeDetailPkg.name,
                      price: activeDetailPkg.price,
                      image: activeDetailPkg.images[0],
                    };
                    addToCart(finalItem, 'travel', bookingDate, guests);
                    setBookedSuccess(true);
                    setTimeout(() => {
                      setBookedSuccess(false);
                      setActiveDetailPkg(null); // Close modal on success!
                    }, 2000);
                  }}
                  className="space-y-4"
                >
                  {/* Date Selection */}
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-mono tracking-wider text-[#1D493E] uppercase font-black flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#E05434]" />
                      Select Departure
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full p-3 rounded-xl border border-[#1D493E]/20 bg-white text-xs text-[#1D493E] focus:outline-none focus:ring-2 focus:ring-[#1D493E]/10 font-bold cursor-pointer"
                    />
                  </div>

                  {/* Guests Selection */}
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-mono tracking-wider text-[#1D493E] uppercase font-black flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#E05434]" />
                      Number of Guests
                    </label>
                    <div className="flex items-center justify-between p-1 rounded-xl border border-[#1D493E]/20 bg-white">
                      <button
                        type="button"
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        className="w-7 h-7 rounded-lg border border-[#1D493E]/15 flex items-center justify-center font-extrabold hover:bg-gray-50 transition text-[#1D493E] cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-xs font-mono font-bold text-[#1D493E]">{guests} Guests</span>
                      <button
                        type="button"
                        onClick={() => setGuests(guests + 1)}
                        className="w-7 h-7 rounded-lg border border-[#1D493E]/15 flex items-center justify-center font-extrabold hover:bg-gray-50 transition text-[#1D493E] cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Total price cost block */}
                  <div className="p-3.5 rounded-2xl bg-[#f3faf5] border border-[#1D493E]/8 flex flex-col gap-1 text-center">
                    <span className="text-[8px] font-mono tracking-wider text-[#1D493E]/50 font-black uppercase">TOTAL PACKAGE COST</span>
                    <p className="text-2xl font-black text-[#E05434] font-serif">
                      ₹{(activeDetailPkg.price * guests).toLocaleString('en-IN')}
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={bookedSuccess}
                    className="w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 shadow-[3px_3px_0px_0px_#1D493E] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none bg-[#E05434] hover:bg-[#c94527] text-white border border-[#1D493E] cursor-pointer"
                  >
                    {bookedSuccess ? (
                      <span className="flex items-center justify-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Added to Bookings!
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-1">
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Book Journey
                      </span>
                    )}
                  </button>
                </form>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* SECTION 3: BRAND GREEN BACKGROUND - News Ticker & Shades of Kerala Gallery */}
      <section className="bg-[#1D493E] text-white py-20 relative z-10 border-t border-b border-[#D97706]/15">
        <div className="max-w-7xl mx-auto px-6 space-y-16 text-left">
          
          {/* Canal Live News Updates Scrolling Ticker */}
          <div className="max-w-5xl mx-auto border border-white/10 bg-white/5 p-4 rounded-2xl flex items-center gap-4">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#FFFF80] font-black flex items-center gap-1.5 flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#FFFF80] animate-pulse" />
              Live news updates:
            </span>
            <div className="flex-1 overflow-hidden h-6 relative flex items-center">
              <p className="text-xs text-[#FAF9F6] italic leading-none transition-opacity duration-300">
                &ldquo;{KERALA_NEWS[newsIdx]}&rdquo;
              </p>
            </div>
          </div>

          {/* Shades of Kerala Photo Gallery */}
          <div className="space-y-12">
            <div className="text-center space-y-3">
              <span className="inline-block bg-white/10 text-[#FFFF80] border border-white/10 font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-wider">
                Visual Journal
              </span>
              <h2 className="text-4xl md:text-5xl font-light font-serif text-[#FAF9F6] tracking-wide">
                Shades of Kerala
              </h2>
              <p className="text-sm text-[#F3FFEF]/75 max-w-md mx-auto leading-relaxed font-medium">
                A slow photographic look into traditional backwater houseboats, emerald green rice fields, and coastal sea breezes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-auto md:h-[500px]">
              {/* Main large portrait: Alleppey Houseboat */}
              <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-3xl border border-white/10 bg-[#0b0f19]/30 shadow-lg min-h-[280px]">
                <img 
                  src="https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80" 
                  alt="Alleppey Houseboat Cruise" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D493E] via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 text-left">
                  <span className="text-[10px] font-black uppercase text-[#FFFF80] tracking-wider block mb-1">Alleppey</span>
                  <h3 className="text-2xl font-serif font-light text-slate-100">Kettuvallam Canal Cruise</h3>
                  <p className="text-xs text-slate-200 mt-1 leading-relaxed max-w-sm font-semibold">
                    Stately wooden houseboats cruising down palm-bordered rivers under sunny skies.
                  </p>
                </div>
              </div>

              {/* Top Right: Munnar Tea Gardens */}
              <div className="md:col-span-2 relative group overflow-hidden rounded-3xl border border-white/10 bg-[#0b0f19]/30 shadow-lg min-h-[180px]">
                <img 
                  src="https://images.unsplash.com/photo-1545224372-7a8f30690af0?auto=format&fit=crop&w=800&q=80" 
                  alt="Munnar Tea Gardens" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D493E]/95 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 text-left">
                  <span className="text-[10px] font-black uppercase text-[#FFFF80] tracking-wider block mb-1">Munnar</span>
                  <h3 className="text-xl font-serif font-light text-slate-100">Lush Tea Hill Estates</h3>
                  <p className="text-xs text-slate-200 mt-1 leading-relaxed font-semibold">
                    Immaculately contoured emerald tea estates blanketed in misty mountain air.
                  </p>
                </div>
              </div>

              {/* Bottom Middle: Athirappilly Waterfalls */}
              <div className="relative group overflow-hidden rounded-3xl border border-white/10 bg-[#0b0f19]/30 shadow-lg min-h-[140px]">
                <img 
                  src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80" 
                  alt="Athirappilly Waterfalls" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D493E]/95 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <span className="text-[9px] font-black uppercase text-[#FFFF80] tracking-wider block mb-0.5 font-sans">Vazhachal</span>
                  <h4 className="text-sm font-serif font-light text-slate-100">Athirappilly Falls</h4>
                </div>
              </div>

              {/* Bottom Right: Wayanad Bamboo Forests */}
              <div className="relative group overflow-hidden rounded-3xl border border-white/10 bg-[#0b0f19]/30 shadow-lg min-h-[140px]">
                <img 
                  src="https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?auto=format&fit=crop&w=800&q=80" 
                  alt="Wayanad Lakes" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D493E]/95 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <span className="text-[9px] font-black uppercase text-[#FFFF80] tracking-wider block mb-0.5 font-sans">Wayanad</span>
                  <h4 className="text-sm font-serif font-light text-slate-100">Forest Foothills</h4>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 4: WHITE BACKGROUND - Go Banjāra Boutique Essentials */}
      <section className="bg-[#FAF9F6] text-[#1D493E] py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-6 space-y-10">
          <div className="text-center space-y-3">
            <span className="inline-block bg-[#1D493E]/5 text-[#1D493E] border border-[#1D493E]/15 font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-widest">
              Go Banjāra Boutique Essentials
            </span>
            <h2 className="text-3xl md:text-4xl font-light font-serif text-[#1D493E] tracking-wide">
              Gear Up for the Tropics
            </h2>
            <p className="text-xs text-[#1D493E]/75 max-w-sm mx-auto leading-relaxed font-medium">
              Shop premium traditional cotton apparel and aromatic spices recommended during your Kerala backwaters journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 font-sans">
            {keralaProducts.map((prod) => (
              <div 
                key={prod.id} 
                className="bg-white border border-[#1D493E]/10 rounded-2xl p-5 hover:border-[#1D493E]/20 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div className="space-y-4">
                  <div className="relative h-56 w-full rounded-xl overflow-hidden border border-[#1D493E]/5 bg-[#FAF9F6]">
                    <img 
                      src={prod.image} 
                      alt={prod.name} 
                      className="w-full h-full object-cover" 
                    />
                    <span className="absolute top-3 right-3 text-[10px] font-black bg-[#FFFF80] text-slate-950 px-2.5 py-1 rounded shadow-sm border border-[#1D493E]/10">
                      ★ {prod.rating.toFixed(1)}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-left font-sans">
                    <span className="text-[9px] font-black text-[#E05434] uppercase tracking-wider">Heritage Craft</span>
                    <h3 className="font-bold text-base text-[#1D493E] font-serif">{prod.name}</h3>
                    <p className="text-xs text-[#1D493E]/70 leading-relaxed font-semibold">{prod.description}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#1D493E]/8 font-sans">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-[#1D493E]/60 font-bold uppercase tracking-wider">Price</span>
                    <span className="text-lg font-black text-[#E05434] font-serif">₹{prod.price.toLocaleString('en-IN')}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleProductAdd(prod)}
                    className={`w-full py-3 rounded-xl border text-xs font-black tracking-widest uppercase transition duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                      productAddedSuccess === prod.id
                        ? 'bg-[#1D493E] text-white border-[#1D493E]'
                        : 'bg-[#1D493E]/5 hover:bg-[#1D493E]/10 border-[#1D493E]/10 text-[#1D493E]'
                    }`}
                  >
                    {productAddedSuccess === prod.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        Added to Bag
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        Add Gear to Bag
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
