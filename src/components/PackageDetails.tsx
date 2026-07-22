'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Calendar, Users, Check, ShoppingBag, Clock,
  Star, Compass, MapPin, Tag,
  Sun, Wind, ArrowLeft, Lock, ArrowUpRight,
  ChevronDown, ShoppingCart
} from 'lucide-react';
import { useCart } from '@/components/providers';
import { AmbientVibe } from '@/components/AmbientVibe';
import { PRODUCTS } from '@/data/products';
import { HOLIDAY_PACKAGES } from '@/data/packages';

interface PackageDetailsProps {
  customId?: string;
}

export default function PackageDetails({ customId }: PackageDetailsProps) {
  const params = useParams() as { id?: string };
  const router = useRouter();
  const { addToCart } = useCart();

  const id = customId || params?.id || 'pkg-kashmir-classic';

  const [pkg, setPkg] = useState<any>(null);
  const [productsList, setProductsList] = useState<any[]>(PRODUCTS);
  const [bookingDate, setBookingDate] = useState('');
  const [guests, setGuests] = useState(2);
  const [bookedSuccess, setBookedSuccess] = useState(false);
  const [productAddedSuccess, setProductAddedSuccess] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'reviews'>('overview');
  const [expandedDayIdx, setExpandedDayIdx] = useState<number | null>(0);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Live Simulated Weather State
  const [liveTemp, setLiveTemp] = useState({ temp: 24.5, condition: 'Mild Breeze', wind: '10 km/h', uv: 'Moderate' });

  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquiryName, setEnquiryName] = useState('');
  const [phonePrefix, setPhonePrefix] = useState('+020');
  const [enquiryPhone, setEnquiryPhone] = useState('');
  const [enquiryGuests, setEnquiryGuests] = useState<string | number>('02');
  const [pickupLocation, setPickupLocation] = useState('');
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveForLater = () => {
    setSaved(!saved);
  };

  useEffect(() => {
    try {
      let list = HOLIDAY_PACKAGES;
      const saved = localStorage.getItem('gb_admin_packages');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            list = parsed;
          }
        } catch (e) {
          console.error('Error parsing admin packages:', e);
        }
      }
      
      const savedProds = localStorage.getItem('gb_admin_products_v3');
      if (savedProds) {
        try {
          const parsedProds = JSON.parse(savedProds);
          if (Array.isArray(parsedProds) && parsedProds.length > 0) {
            setProductsList(parsedProds);
          }
        } catch (e) {
          console.error('Error parsing admin products:', e);
        }
      }

      const staticPkg = HOLIDAY_PACKAGES.find((p) => p.id === id);
      let foundPkg = staticPkg || null;

      if (!foundPkg) {
        const saved = localStorage.getItem('gb_admin_packages');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const matched = parsed.find((p) => p.id === id);
              if (matched) {
                foundPkg = matched;
              }
            }
          } catch (e) {
            console.error('Error parsing admin packages:', e);
          }
        }
      }

      if (foundPkg) {
        setPkg(foundPkg);
        
        // Setup initial booking date if departures exist
        if (foundPkg.departures && foundPkg.departures.length > 0) {
          setBookingDate(foundPkg.departures[0].value);
        } else {
          setBookingDate('2026-08-14');
        }

        // Setup Simulated Weather based on Destination
        const dest = (foundPkg.destination || '').toLowerCase();
        let initialTemp = 24.5;
        let cond = 'Mild Breeze';
        let windStr = '10 km/h';
        let uvStr = 'Moderate';

        if (dest.includes('kashmir') || dest.includes('himachal')) {
          initialTemp = 16.4;
          cond = 'Clear Sky';
          windStr = '8 km/h';
          uvStr = 'High (8)';
        } else if (dest.includes('kerala')) {
          initialTemp = 27.8;
          cond = 'Tropical Showers';
          windStr = '18 km/h';
          uvStr = 'Moderate (5)';
        } else if (dest.includes('goa') || dest.includes('andaman')) {
          initialTemp = 30.2;
          cond = 'Coastal Sunshine';
          windStr = '12 km/h';
          uvStr = 'Extreme (10)';
        } else if (dest.includes('rajasthan')) {
          initialTemp = 33.5;
          cond = 'Desert Wind';
          windStr = '15 km/h';
          uvStr = 'Very High (9)';
        }

        setLiveTemp({ temp: initialTemp, condition: cond, wind: windStr, uv: uvStr });
      }
    } catch (e) {
      console.error(e);
    }
  }, [id]);

  // Live Weather fluctuation
  useEffect(() => {
    if (!pkg) return;
    const weatherInterval = setInterval(() => {
      setLiveTemp((prev) => {
        const change = Math.random() > 0.5 ? 0.2 : -0.2;
        const nextTemp = parseFloat((prev.temp + change).toFixed(1));
        return {
          ...prev,
          temp: nextTemp < 4 ? 4 : nextTemp > 38 ? 38 : nextTemp,
        };
      });
    }, 10000);

    return () => clearInterval(weatherInterval);
  }, [pkg]);

  if (!pkg) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <Compass className="w-12 h-12 text-[#E05434] animate-spin mx-auto" />
          <p className="text-sm font-black uppercase text-[#1D493E] tracking-widest">Loading Package details...</p>
        </div>
      </div>
    );
  }

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDate) {
      alert('Please select a travel date.');
      return;
    }
    setEnquiryGuests(String(guests).padStart(2, '0'));
    setIsEnquiryModalOpen(true);
  };

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save to localStorage
    const newEnquiry = {
      packageName: pkg.name,
      date: bookingDate,
      name: enquiryName,
      phone: `${phonePrefix} ${enquiryPhone}`,
      guests: enquiryGuests,
      pickup: pickupLocation,
      message: enquiryMessage,
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem('gb_booking_enquiries') || '[]');
    existing.push(newEnquiry);
    localStorage.setItem('gb_booking_enquiries', JSON.stringify(existing));

    setEnquirySubmitted(true);
    setTimeout(() => {
      setIsEnquiryModalOpen(false);
      setEnquirySubmitted(false);

      const finalItem = {
        id: pkg.id,
        name: pkg.name,
        price: pkg.price,
        image: pkg.images?.[0] || pkg.image,
      };
      addToCart(finalItem, 'travel', bookingDate, Number(enquiryGuests) || 1);
      setBookedSuccess(true);
      setTimeout(() => setBookedSuccess(false), 3000);
    }, 2000);
  };

  const handleProductAdd = (prod: any) => {
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

  // Recommended products list
  const isColdPlace = ['kashmir', 'himachal'].includes((pkg.destination || '').toLowerCase());
  const targetProductIds = ['naturally-nomad-badge-1', 'blue-mavin-slides-1', 'explore-more-keychain-1', 'blue-mavin-slides-2'];
  const recommendedProducts = targetProductIds
    .map((id) => productsList.find((p) => p.id === id))
    .filter(Boolean);

  // Dynamic ambient effect selection
  const destLower = (pkg.destination || '').toLowerCase();
  const ambientEffect =
    destLower.includes('kashmir') || destLower.includes('himachal')
      ? 'snowfall'
      : destLower.includes('kerala') || destLower.includes('andaman')
      ? 'monsoon'
      : 'sun-breeze';

  // Fallback defaults for detailed package layouts
  const galleryImages = pkg.images || [pkg.image, pkg.image, pkg.image, pkg.image, pkg.image, pkg.image];
  const words = (pkg.name || '').split(' ');
  const mainPart = words.slice(0, -1).join(' ');
  const lastWord = words[words.length - 1] || '';
  const richInclusions = pkg.richInclusions || [
    'All accommodation (guesthouses, homestays, tented camp)',
    'All meals as specified in the itinerary',
    'Experienced local guide + assistant guide',
    'Private vehicle (Innova/Bolero) for all transfers',
    'Innerline Permit for restricted areas',
    'First aid kit + oxygen cylinder',
    'Go Banjara welcome kit (journal + map)'
  ];
  const exclusions = pkg.exclusions || [
    'Flights or train tickets to destination',
    'Mandatory travel insurance (highly recommended)',
    'Lunch meals, personal water, and drinks',
    'Tips for local guides, drivers, and resort helpers',
    'Personal shopping, souvenirs, and laundry services'
  ];
  const packingList = pkg.packingList || (isColdPlace 
    ? [
        'Heavy fleece jackets, windbreaker, and thermal base layers',
        'Sturdy water-resistant hiking boots with good grip',
        'Polarized sunglasses and high SPF sunscreen',
        'Reusable thermos water bottle for hot water',
        'Personal altitude medication (like Diamox)',
        'High capacity power bank (extreme cold drains batteries)'
      ]
    : [
        'Light cotton or linen clothing & sun protective hat',
        'Comfortable walking shoes, sneakers, or hiking sandals',
        'Polarized sunglasses and high SPF sunscreen',
        'Reusable water bottle to stay hydrated',
        'Mosquito repellent cream or spray',
        'Personal first-aid kit and light swimwear'
      ]);

  const faqs = pkg.faqs || (isColdPlace 
    ? [
        {
          q: 'What standard are the accommodations? (Hotels, homestays, tents)',
          a: 'We use premium 3-star boutique hotels, local homestays, and high-quality weatherproof camping tents with modern facilities depending on the exact route details.'
        },
        {
          q: 'Is AMS (Altitude Mountain Sickness) a concern?',
          a: 'Yes, for routes climbing above 3,000m. We design our itineraries with gradual ascents, keep rest days for acclimatization, and our backup vehicles always carry oxygen cylinders.'
        },
        {
          q: 'What is the standard group size for this tour?',
          a: 'We focus on highly curated, small-group experiences. Typical group size is between 8 to 12 travelers per batch.'
        }
      ]
    : [
        {
          q: 'What standard are the accommodations? (Hotels, resort, houseboat)',
          a: 'We use premium beachfront resorts, heritage estates, and traditional private houseboats equipped with modern air conditioning and dining facilities.'
        },
        {
          q: 'What clothes should I pack for this trip?',
          a: 'Light cotton or linen clothes, sunscreen, sunglasses, and comfortable footwear are recommended. Carry swimwear for coastal regions.'
        },
        {
          q: 'What is the group size for the trip?',
          a: 'Our tours are typically customized private slots or intimate small groups of 6 to 10 travelers to ensure comfort and care.'
        }
      ]);

  const reviews = pkg.reviews || [
    {
      name: 'Jithendra V.',
      date: 'July, 2026',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80',
      comment: '“Go Banjara did an extraordinary job mapping out our route. Highly recommend booking a curated tour! Every detail was well thought out and perfectly executed.”',
      rating: 5
    }
  ];

  const guide = pkg.guide || (isColdPlace 
    ? {
        name: 'Vikram Aditya',
        role: 'Lead Expedition Coordinator',
        image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=120&h=120&fit=crop&q=60',
        rating: 5.0,
        trips: 143,
        bio: 'Vikram is a native Himalayan guide with 12+ years of experience leading high-altitude road trips and treks across Ladakh, Zanskar, and Kashmir. Certified in Wilderness Advanced First Aid (WAFA).'
      }
    : {
        name: 'Anand Nair',
        role: 'Tropical Tour Director',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&fit=crop&q=60',
        rating: 4.8,
        trips: 186,
        bio: 'Anand has spent 10+ years guiding eco-tours and tropical journeys across the beaches and backwaters of Kerala, Goa, and Andaman. Fluent in English, Hindi, and Malayalam.'
      });

  const departures = pkg.departures || [
    { value: '2026-08-14', label: '14 Aug, 2026', seats: '4 Seats Available' },
    { value: '2026-08-21', label: '21 Aug, 2026', seats: '8 Seats Available' },
    { value: '2026-09-04', label: '04 Sep, 2026', seats: '12 Seats Available' }
  ];

  const discountPercent = pkg.originalPrice && pkg.originalPrice > pkg.price
    ? Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)
    : 0;

  return (
    <div 
      style={{
        backgroundColor: "rgba(255, 255, 255, 1)",
        paddingBottom: "62px",
      }}
      className="text-[#1D493E] min-h-screen font-sans relative overflow-x-clip w-full"
    >
      {/* Dynamic ambient particles removed for solid white background */}

      {/* Breadcrumbs */}
      <div 
        style={{
          width: "100%",
          maxWidth: "1440px",
          height: "auto",
          paddingTop: "42px",
          paddingBottom: "16px",
          boxSizing: "border-box",
        }}
        className="w-full max-w-[1440px] mx-auto text-left flex items-center px-4 md:px-[80px]"
      >
        <div className="flex flex-wrap items-center gap-1.5 md:gap-[12px]">
          <Link 
            href="/" 
            style={{
              fontFamily: "'Faktum', 'Outfit', sans-serif",
              fontWeight: 500,
              letterSpacing: "0px",
              color: "rgba(141, 141, 141, 1)",
              textDecoration: "none",
            }}
            className="hover:opacity-80 transition-opacity text-xs sm:text-sm md:text-[24px] leading-relaxed"
          >
            Home
          </Link>
          <span 
            style={{
              fontFamily: "'Faktum', 'Outfit', sans-serif",
              fontWeight: 500,
              color: "rgba(141, 141, 141, 1)",
            }}
            className="text-xs sm:text-sm md:text-[24px]"
          >
            &gt;
          </span>
          <Link 
            href="/travel" 
            style={{
              fontFamily: "'Faktum', 'Outfit', sans-serif",
              fontWeight: 500,
              letterSpacing: "0px",
              color: "rgba(141, 141, 141, 1)",
              textDecoration: "none",
            }}
            className="hover:opacity-80 transition-opacity text-xs sm:text-sm md:text-[24px] leading-relaxed"
          >
            Travel Page
          </Link>
          <span 
            style={{
              fontFamily: "'Faktum', 'Outfit', sans-serif",
              fontWeight: 500,
              color: "rgba(141, 141, 141, 1)",
            }}
            className="text-xs sm:text-sm md:text-[24px]"
          >
            &gt;
          </span>
          <span 
            style={{
              fontFamily: "'Faktum', 'Outfit', sans-serif",
              fontWeight: 500,
              letterSpacing: "0px",
              color: "rgba(63, 136, 255, 1)",
              textDecoration: "underline",
            }}
            className="truncate max-w-[200px] sm:max-w-[400px] text-xs sm:text-sm md:text-[24px] leading-relaxed"
          >
            {pkg?.name || "Spiti Valley Traverse"}
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div 
        style={{
          width: "100%",
          maxWidth: "1440px",
          paddingTop: "32px",
          paddingBottom: "42px",
          backgroundColor: "rgba(255, 255, 255, 1)",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        }}
        className="relative z-10 mx-auto w-full px-4 md:px-[80px]"
      >
        {/* Image Gallery */}
        <div 
          style={{
            width: "100%",
            boxSizing: "border-box",
          }}
          className="w-full h-auto md:h-[527px]"
        >
          <div 
            style={{
              background: "rgba(255, 255, 255, 1)",
            }}
            className="grid grid-cols-2 md:grid-cols-3 md:grid-rows-2 gap-4 md:gap-[32px] w-full h-full rounded-[4px] overflow-hidden"
          >
            {galleryImages.map((img: string, idx: number) => (
              <div
                key={idx}
                style={{ borderRadius: "4px" }}
                className="relative overflow-hidden border border-[#1D493E]/10 bg-slate-900 group cursor-pointer w-full h-full aspect-[3/2] md:aspect-auto"
                onClick={() => setActivePhotoIdx(idx)}
              >
                <img
                  src={img}
                  alt={`${pkg.name} gallery image ${idx + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-left opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white pointer-events-none">
                  <span className="text-[9px] font-mono tracking-widest text-[#FFFF80] uppercase block">
                    {pkg.destination} Gallery
                  </span>
                  <h4 className="text-xs font-serif font-bold mt-0.5">{pkg.routeList?.[idx % pkg.routeList.length] || pkg.destination}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Details Section */}
        <div 
          className="w-full grid grid-cols-1 lg:grid-cols-[1fr_411px] gap-8 lg:gap-[32px] items-start"
        >
          
          {/* LEFT COLUMN: Travel package details */}
          <div className="text-left space-y-[32px] w-full">
            
            {/* Main Details content container with exact 32px gap */}
            <div 
              style={{
                width: "100%",
                maxWidth: "837px",
                display: "flex",
                flexDirection: "column",
                gap: "32px",
              }}
              className="text-left"
            >
              {/* Category & Duration Row */}
              <div className="flex justify-between items-center text-[10px] font-black uppercase font-mono">
                <span 
                  style={{
                    backgroundColor: "rgba(255, 240, 235, 1)",
                    color: "rgba(255, 98, 62, 1)",
                    fontFamily: "Faktum, sans-serif",
                    fontWeight: 700,
                    fontSize: "12px",
                    padding: "4px 10px",
                    borderRadius: "4px",
                  }}
                  className="tracking-wider"
                >
                  {pkg.category || 'Road Trip'}
                </span>
                <span 
                  style={{
                    backgroundColor: "rgba(234, 245, 240, 1)",
                    color: "rgba(29, 73, 62, 1)",
                    fontFamily: "Faktum, sans-serif",
                    fontWeight: 700,
                    fontSize: "12px",
                    padding: "4px 10px",
                    borderRadius: "4px",
                  }}
                  className="tracking-wider text-right"
                >
                  {pkg.durationDays ? `${pkg.durationDays} days` : '8 days'}
                </span>
              </div>

              {/* Title & Price Row */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 
                  style={{
                    fontFamily: "'Faktum', 'Outfit', sans-serif",
                    fontWeight: 600,
                    color: "rgba(43, 43, 43, 1)",
                  }}
                  className="text-left text-xl sm:text-2xl md:text-[28px] leading-tight"
                >
                  {pkg.name}
                </h1>
                <span 
                  style={{
                    fontFamily: "'Faktum', 'Outfit', sans-serif",
                    fontWeight: 700,
                    color: "rgba(43, 43, 43, 1)",
                  }}
                  className="text-left sm:text-right shrink-0 text-xl sm:text-2xl md:text-[28px]"
                >
                  ₹{pkg.price.toLocaleString('en-IN')}/Person
                </span>
              </div>

              {/* General Overview Paragraph */}
              <p 
                style={{
                  fontFamily: "'Faktum', 'Outfit', sans-serif",
                  fontWeight: 500,
                  color: "rgba(141, 141, 141, 1)",
                  maxWidth: "837px",
                }}
                className="text-left leading-relaxed mt-2 text-sm sm:text-base md:text-[20px] md:leading-[32px]"
              >
                {pkg.description}
              </p>

              {/* Key Specs Grid */}
              <div 
                style={{
                  width: "100%",
                  maxWidth: "837px",
                  boxSizing: "border-box",
                }}
                className="text-left grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {/* Fact 1 */}
                <div 
                  style={{
                    height: "46px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxSizing: "border-box",
                  }}
                  className="w-full py-1"
                >
                  <div 
                    style={{ 
                      width: "46px", 
                      height: "46px", 
                      backgroundColor: "rgba(246, 243, 238, 1)",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <MapPin className="w-5 h-5 text-[#2B2B2B]" />
                  </div>
                  <span 
                    style={{
                      fontFamily: "'Faktum', 'Outfit', sans-serif",
                      fontWeight: 500,
                      color: "rgba(43, 43, 43, 1)",
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                    className="flex-1 text-sm sm:text-base md:text-[20px] leading-relaxed truncate"
                  >
                    {pkg.startPoint || 'Srinagar'}, {pkg.destination || 'Kashmir'}
                  </span>
                </div>

                {/* Fact 2 */}
                <div 
                  style={{
                    height: "46px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxSizing: "border-box",
                  }}
                  className="w-full py-1"
                >
                  <div 
                    style={{ 
                      width: "46px", 
                      height: "46px", 
                      backgroundColor: "rgba(246, 243, 238, 1)",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Users className="w-5 h-5 text-[#2B2B2B]" />
                  </div>
                  <span 
                    style={{
                      fontFamily: "'Faktum', 'Outfit', sans-serif",
                      fontWeight: 500,
                      color: "rgba(43, 43, 43, 1)",
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                    className="flex-1 text-sm sm:text-base md:text-[20px] leading-relaxed truncate"
                  >
                    {pkg.groupType || 'Curated group Trip'}
                  </span>
                </div>

                {/* Fact 3 */}
                <div 
                  style={{
                    height: "46px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxSizing: "border-box",
                  }}
                  className="w-full py-1"
                >
                  <div 
                    style={{ 
                      width: "46px", 
                      height: "46px", 
                      backgroundColor: "rgba(246, 243, 238, 1)",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Compass className="w-5 h-5 text-[#2B2B2B]" />
                  </div>
                  <span 
                    style={{
                      fontFamily: "'Faktum', 'Outfit', sans-serif",
                      fontWeight: 500,
                      color: "rgba(43, 43, 43, 1)",
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                    className="flex-1 text-sm sm:text-base md:text-[20px] leading-relaxed truncate"
                  >
                    {pkg.difficulty || 'Moderate'} Difficulty
                  </span>
                </div>

                {/* Fact 4 */}
                <div 
                  style={{
                    height: "46px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxSizing: "border-box",
                  }}
                  className="w-full py-1"
                >
                  <div 
                    style={{ 
                      width: "46px", 
                      height: "46px", 
                      backgroundColor: "rgba(246, 243, 238, 1)",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Calendar className="w-5 h-5 text-[#2B2B2B]" />
                  </div>
                  <span 
                    style={{
                      fontFamily: "'Faktum', 'Outfit', sans-serif",
                      fontWeight: 500,
                      color: "rgba(43, 43, 43, 1)",
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                    className="flex-1 text-sm sm:text-base md:text-[20px] leading-relaxed truncate"
                  >
                    Next: {pkg.nextDeparture || 'Aug, 2026'}
                  </span>
                </div>
              </div>

              {/* Rating summary */}
              <div 
                style={{
                  width: "100%",
                  maxWidth: "837px",
                  height: "67px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
                className="text-left"
              >
                <div className="flex items-center gap-3 h-[30px]">
                  <div className="flex text-[#E05434] gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 fill-[#E05434] stroke-none ${
                          i < Math.floor(pkg.rating) ? 'fill-[#E05434]' : 'fill-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span 
                    style={{
                      fontFamily: "'Faktum', 'Outfit', sans-serif",
                      fontWeight: 500,
                      fontSize: "20px",
                      lineHeight: "100%",
                      color: "rgba(43, 43, 43, 1)",
                      height: "30px",
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                    className="leading-none"
                  >
                    ({pkg.ratingCount || 312} reviews)
                  </span>
                </div>
                 <span 
                  style={{
                    width: "100%",
                    maxWidth: "837px",
                    height: "25px",
                    fontFamily: "'Faktum', 'Outfit', sans-serif",
                    fontWeight: 500,
                    fontSize: "20px",
                    lineHeight: "100%",
                    color: "rgba(141, 141, 141, 1)",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                  className="leading-none"
                >
                  200+ bought in past month
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div 
              style={{
                width: "100%",
                maxWidth: "837px",
                borderBottom: "2px solid rgba(204, 204, 204, 1)",
                background: "rgba(255, 255, 255, 1)",
                display: "flex",
                alignItems: "center",
              }}
              className="text-left flex border-b border-gray-200 w-full overflow-x-auto whitespace-nowrap scrollbar-none gap-6 md:gap-[40px]"
            >
              {(['overview', 'itinerary', 'reviews'] as const).map((tab) => {
                const isSelected = activeTab === tab;
                const label = tab === 'overview' ? 'Overview' : tab === 'itinerary' ? 'Itinerary' : 'Reviews';
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "54px",
                      padding: "12px",
                      boxSizing: "border-box",
                      borderBottom: isSelected ? "3px solid rgba(28, 68, 140, 1)" : "3px solid transparent",
                      marginBottom: "-2px",
                      cursor: "pointer",
                    }}
                    className="transition-all capitalize"
                  >
                    <span
                      style={{
                        fontFamily: "'Faktum', 'Outfit', sans-serif",
                        fontWeight: 500,
                        color: isSelected ? "rgba(28, 68, 140, 1)" : "rgba(43, 43, 43, 1)",
                        height: "30px",
                        display: "inline-flex",
                        alignItems: "center",
                      }}
                      className="text-sm sm:text-lg md:text-[24px]"
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT: Overview */}
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-[32px] w-full max-w-[837px] animate-in fade-in duration-300">
                
                {/* Introduction Section */}
                 <div
                  style={{
                    width: "100%",
                    maxWidth: "837px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    background: "rgba(255, 255, 255, 1)",
                    boxSizing: "border-box",
                  }}
                  className="text-left"
                >
                  <h2
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontFamily: "Fraunces, serif",
                      fontWeight: 600,
                      color: "rgba(43, 43, 43, 1)",
                      margin: 0,
                    }}
                    className="text-2xl md:text-[42px] font-serif font-semibold text-[#2B2B2B] m-0 py-2 h-auto"
                  >
                    {mainPart + " "}
                    <span style={{ color: "rgba(255, 98, 62, 1)" }}>{lastWord}</span>
                  </h2>
                  <p
                    style={{
                      fontFamily: "'Faktum', 'Outfit', sans-serif",
                      fontWeight: 500,
                      color: "rgba(43, 43, 43, 1)",
                      margin: 0,
                    }}
                    className="text-sm sm:text-base md:text-[20px] md:leading-[32px] font-sans font-medium text-[#2B2B2B] m-0 h-auto"
                  >
                    {pkg.description || `Spiti Valley sits at 12,500 feet in the cold desert of Himachal Pradesh...`}
                  </p>
                </div>

                {/* Separation Line */}
                <div
                  style={{
                    width: "100%",
                    maxWidth: "837px",
                    height: "0px",
                    borderTop: "2px solid rgba(204, 204, 204, 1)",
                    opacity: 1,
                  }}
                />

                {/* Highlights Section */}
                <div
                  style={{
                    width: "100%",
                    maxWidth: "837px",
                    background: "rgba(255, 255, 255, 1)",
                    borderRadius: "4px",
                    padding: "32px",
                    boxSizing: "border-box",
                  }}
                  className="text-left justify-center w-full max-w-[837px] h-auto bg-white border border-gray-200/60 rounded-[4px] p-6 flex flex-col gap-6"
                >
                  <div className="flex flex-col gap-[12px]">
                    <span 
                      style={{
                        backgroundColor: "rgba(255, 240, 235, 1)",
                        color: "rgba(255, 98, 62, 1)",
                        fontFamily: "Faktum, sans-serif",
                        fontWeight: 700,
                        fontSize: "12px",
                        padding: "4px 10px",
                        borderRadius: "4px",
                        alignSelf: "flex-start",
                      }}
                      className="tracking-wider uppercase"
                    >
                      Discover Your Path
                    </span>
                    <h3>
                      Highlights
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                      {pkg.highlights.slice(0, 4).map((hl: string, i: number) => (
                        <div key={i} className="flex items-center gap-3">
                          <div 
                            style={{ 
                              width: "32px", 
                              height: "32px", 
                              backgroundColor: "rgba(247, 245, 240, 1)", 
                              borderRadius: "4px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            className="shrink-0"
                          >
                            <Check className="w-4 h-4 text-[#2B2B2B]" />
                          </div>
                          <span 
                            style={{
                              fontFamily: "'Faktum', 'Outfit', sans-serif",
                              fontWeight: 500,
                              color: "rgba(43, 43, 43, 1)",
                            }}
                            className="leading-tight text-sm sm:text-base md:text-[20px]"
                          >
                            {hl}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Separation Line */}
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "837px",
                      height: "0px",
                      borderTop: "2px solid rgba(204, 204, 204, 1)",
                      opacity: 1,
                    }}
                  />

                  {/* What's Included */}
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "837px",
                      background: "rgba(255, 255, 255, 1)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                    className="text-left w-full"
                  >
                    <span 
                      style={{
                        backgroundColor: "rgba(0, 160, 35, 0.08)",
                        color: "rgba(0, 160, 35, 1)",
                        fontFamily: "Faktum, sans-serif",
                        fontWeight: 600,
                        fontSize: "14px",
                        lineHeight: "100%",
                        letterSpacing: "1.2px",
                        textTransform: "uppercase",
                        padding: "4px 10px",
                        borderRadius: "4px",
                        alignSelf: "flex-start",
                      }}
                    >
                      DO'S
                    </span>
                    <h3 
                      style={{
                        fontFamily: "Fraunces, serif",
                        fontWeight: 600,
                        color: "rgba(43, 43, 43, 1)",
                      }}
                      className="leading-none mb-2 font-sans text-2xl md:text-[42px]"
                    >
                      What's Included
                    </h3>
                    <ul className="list-disc pl-5">
                      {richInclusions.map((inc: string, i: number) => (
                        <li 
                          key={i} 
                          style={{
                            fontFamily: "Faktum, sans-serif",
                            fontWeight: 500,
                            color: "rgba(43, 43, 43, 1)",
                          }}
                          className="leading-relaxed font-sans text-sm sm:text-base md:text-[20px] md:leading-[32px]"
                        >
                          {inc}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Separation Line */}
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "837px",
                      height: "0px",
                      borderTop: "2px solid rgba(204, 204, 204, 1)",
                      opacity: 1,
                    }}
                  />

                  {/* Not Included */}
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "837px",
                      background: "rgba(255, 255, 255, 1)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                    className="text-left w-full"
                  >
                    <span 
                      style={{
                        backgroundColor: "rgba(255, 98, 62, 0.08)",
                        color: "rgba(255, 98, 62, 1)",
                        fontFamily: "Faktum, sans-serif",
                        fontWeight: 600,
                        fontSize: "14px",
                        lineHeight: "100%",
                        letterSpacing: "1.2px",
                        textTransform: "uppercase",
                        padding: "4px 10px",
                        borderRadius: "4px",
                        alignSelf: "flex-start",
                      }}
                    >
                      DON'TS
                    </span>
                    <h3 
                      style={{
                        fontFamily: "Fraunces, serif",
                        fontWeight: 600,
                        color: "rgba(43, 43, 43, 1)",
                      }}
                      className="leading-none mb-2 font-sans text-2xl md:text-[42px]"
                    >
                      Not Included
                    </h3>
                    <ul className="list-disc pl-5">
                      {exclusions.map((exc: string, i: number) => (
                        <li 
                          key={i} 
                          style={{
                            fontFamily: "Faktum, sans-serif",
                            fontWeight: 500,
                            color: "rgba(43, 43, 43, 1)",
                          }}
                          className="leading-relaxed font-sans text-sm sm:text-base md:text-[20px] md:leading-[32px]"
                        >
                          {exc}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Separation Line */}
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "837px",
                      height: "0px",
                      borderTop: "2px solid rgba(204, 204, 204, 1)",
                      opacity: 1,
                    }}
                  />

                   {/* Packing List */}
                   <div 
                     style={{
                       width: "100%",
                       maxWidth: "837px",
                       background: "rgba(255, 255, 255, 1)",
                       display: "flex",
                       flexDirection: "column",
                       gap: "12px",
                     }}
                     className="text-left w-full"
                   >
                     <h3 
                       style={{
                         fontFamily: "Fraunces, serif",
                         fontWeight: 600,
                       }}
                       className="leading-none mb-2 font-sans text-2xl md:text-[42px]"
                     >
                       <span style={{ color: "rgba(255, 98, 62, 1)" }}>Packing</span>{" "}
                       <span style={{ color: "rgba(43, 43, 43, 1)" }}>List</span>
                     </h3>
                     <ul className="list-disc pl-5">
                       {packingList.map((pk: string, i: number) => (
                         <li 
                           key={i} 
                           style={{
                             fontFamily: "Faktum, sans-serif",
                             fontWeight: 500,
                             color: "rgba(43, 43, 43, 1)",
                           }}
                           className="leading-relaxed font-sans text-sm sm:text-base md:text-[20px] md:leading-[32px]"
                         >
                           {pk}
                         </li>
                       ))}
                     </ul>
                   </div>

                  {/* Separation Line */}
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "837px",
                      height: "0px",
                      borderTop: "2px solid rgba(204, 204, 204, 1)",
                      opacity: 1,
                    }}
                  />

                  {/* Know your Guide */}
                  <div 
                    style={{
                      width: "100%",
                      maxWidth: "837px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                    className="text-left w-full"
                  >
                    <h3 
                      style={{
                        fontFamily: "Fraunces, serif",
                        fontWeight: 600,
                      }}
                      className="leading-none mb-2 font-sans text-2xl md:text-[42px]"
                    >
                      <span style={{ color: "rgba(43, 43, 43, 1)" }}>Know your</span>{" "}
                      <span style={{ color: "rgba(255, 98, 62, 1)" }}>Guide</span>
                    </h3>
                    
                    {/* Badge & Rating Row */}
                    <div className="flex flex-wrap justify-between items-center gap-4 mt-2">
                      <span 
                        style={{
                          backgroundColor: "rgba(255, 240, 235, 1)",
                          color: "rgba(255, 98, 62, 1)",
                          fontFamily: "Faktum, sans-serif",
                          fontWeight: 600,
                          fontSize: "14px",
                          lineHeight: "100%",
                          letterSpacing: "1.2px",
                          textTransform: "uppercase",
                          padding: "4px 10px",
                          borderRadius: "4px",
                        }}
                      >
                        Your Lead Guide
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="flex text-[#FF623E] gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-[#FF623E] stroke-none" />
                          ))}
                        </div>
                        <span 
                          style={{
                            fontFamily: "Faktum, sans-serif",
                            fontWeight: 500,
                            fontSize: "16px",
                            color: "rgba(43, 43, 43, 1)",
                          }}
                        >
                          {guide.rating.toFixed(2)} ({guide.trips} Trips)
                        </span>
                      </div>
                    </div>

                    {/* Guide details panel */}
                    <div className="flex flex-col md:flex-row gap-6 mt-4 items-start w-full">
                      <div 
                        style={{
                          width: "180px",
                          height: "180px",
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                        className="shrink-0 bg-slate-100 mx-auto md:mx-0"
                      >
                        <img
                          src={guide.image}
                          alt={`${guide.name} Guide`}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-3 w-full">
                        <h4 
                          style={{
                            fontFamily: "Faktum, sans-serif",
                            fontWeight: 600,
                            fontSize: "28px",
                            lineHeight: "120%",
                            color: "rgba(43, 43, 43, 1)",
                          }}
                          className="text-center md:text-left"
                        >
                          {guide.name}
                        </h4>
                        <p 
                          style={{
                            fontFamily: "Faktum, sans-serif",
                            fontWeight: 500,
                            color: "rgba(43, 43, 43, 1)",
                          }}
                          className="text-sm sm:text-base md:text-[20px] md:leading-[32px] text-center md:text-left"
                        >
                          {guide.bio}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Separation Line */}
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "837px",
                      height: "0px",
                      borderTop: "2px solid rgba(204, 204, 204, 1)",
                      opacity: 1,
                    }}
                  />

                  {/* Commonly asked questions */}
                  <div 
                    style={{
                      width: "100%",
                      maxWidth: "837px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                    className="text-left w-full"
                  >
                    <span 
                      style={{
                        backgroundColor: "rgba(255, 240, 235, 1)",
                        color: "rgba(255, 98, 62, 1)",
                        fontFamily: "Faktum, sans-serif",
                        fontWeight: 600,
                        fontSize: "14px",
                        lineHeight: "100%",
                        letterSpacing: "1.2px",
                        textTransform: "uppercase",
                        padding: "4px 10px",
                        borderRadius: "4px",
                        alignSelf: "flex-start",
                      }}
                    >
                      FAQs
                    </span>
                    <h3 
                      style={{
                        fontFamily: "Fraunces, serif",
                        fontWeight: 600,
                      }}
                      className="leading-none mb-4 font-sans text-2xl md:text-[42px]"
                    >
                      <span style={{ color: "rgba(43, 43, 43, 1)" }}>Commonly asked</span>{" "}
                      <span style={{ color: "rgba(255, 98, 62, 1)" }}>questions</span>
                    </h3>

                    {/* Accordion container */}
                    <div className="flex flex-col border-t border-gray-200 w-full">
                      {faqs.map((faq: any, idx: number) => {
                        const isOpen = openFaqIdx === idx;
                        return (
                          <div key={idx} className="border-b border-gray-200/60 py-4 w-full">
                            <button
                              type="button"
                              onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                              className="w-full flex justify-between items-center text-left py-2 hover:opacity-90 transition cursor-pointer"
                            >
                              <span 
                                style={{
                                  fontFamily: "Faktum, sans-serif",
                                  fontWeight: 600,
                                  color: "rgba(43, 43, 43, 1)",
                                }}
                                className="text-sm sm:text-base md:text-[20px] leading-[130%]"
                              >
                                {faq.q}
                              </span>
                              <span className="text-[#FF623E] text-2xl font-light pl-4 select-none shrink-0">
                                {isOpen ? '−' : '+'}
                              </span>
                            </button>
                            {isOpen && (
                              <p 
                                style={{
                                  fontFamily: "Faktum, sans-serif",
                                  fontWeight: 500,
                                  color: "rgba(141, 141, 141, 1)",
                                }}
                                className="mt-2 text-xs sm:text-sm md:text-[18px] md:leading-[28px]"
                              >
                                {faq.a}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: Itinerary */}
              {activeTab === 'itinerary' && pkg.itinerary && (
                <div className="space-y-4 text-left animate-in fade-in duration-300 w-full">
                  <h3 
                    style={{
                      height: "auto",
                      fontFamily: "Fraunces, serif",
                      fontWeight: 600,
                      color: "rgba(43, 43, 43, 1)",
                      margin: 0,
                      boxSizing: "border-box",
                    }}
                    className="text-left mb-3 text-2xl md:text-[42px] leading-tight w-full"
                  >
                    A day-by-day breakdown of what to expect. Every day is designed to balance discovery, culture, and recovery.
                  </h3>

                  <div 
                    style={{
                      height: "auto",
                      display: "flex",
                      flexDirection: "column",
                      gap: "32px",
                      backgroundColor: "rgba(255, 255, 255, 1)",
                      boxSizing: "border-box",
                    }}
                    className="w-full max-w-[837px]"
                  >
                    {pkg.itinerary.map((step: any, idx: number) => {
                    const isOpen = expandedDayIdx === idx;
                    const numStr = String(idx + 1).padStart(2, '0');
                    return (
                      <div 
                        key={idx} 
                        style={{
                          maxWidth: "837px",
                          height: "auto",
                          gap: isOpen ? "24px" : "0px",
                          borderWidth: "1px",
                          borderRadius: "4px",
                          backgroundColor: "rgba(255, 255, 255, 1)",
                          border: "1px solid rgba(204, 204, 204, 1)",
                          boxSizing: "border-box",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-start",
                        }}
                        className="w-full p-4 sm:p-[24px]"
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedDayIdx(isOpen ? null : idx)}
                          style={{
                            height: "29px",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            textAlign: "left",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: 0,
                            boxSizing: "border-box",
                          }}
                          className="w-full"
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            <span 
                              style={{
                                width: "29px",
                                height: "29px",
                                opacity: 1,
                                fontFamily: "Inter, sans-serif",
                                fontWeight: 700,
                                fontSize: "24px",
                                lineHeight: "100%",
                                letterSpacing: "0px",
                                verticalAlign: "middle",
                                color: "rgba(255, 98, 62, 1)",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {numStr}
                            </span>
                            <span 
                              style={{
                                opacity: 1,
                                fontFamily: "Faktum, sans-serif",
                                fontWeight: 600,
                                letterSpacing: "0px",
                                verticalAlign: "middle",
                                color: "rgba(43, 43, 43, 1)",
                                display: "inline-flex",
                                alignItems: "center",
                              }}
                              className="text-sm sm:text-base md:text-[20px] leading-[100%]"
                            >
                              Day {idx + 1}: {step.title}
                            </span>
                          </div>
                          <ChevronDown 
                            style={{
                              width: "24px",
                              height: "24px",
                              color: "rgba(43, 43, 43, 1)",
                              transform: isOpen ? "rotate(180deg)" : "none",
                              transition: "transform 0.2s ease",
                            }} 
                          />
                        </button>
                        {isOpen && (
                          <div 
                            style={{
                              height: "auto",
                              paddingTop: "16px",
                              borderTop: "1px solid rgba(204, 204, 204, 0.54)",
                              boxSizing: "border-box",
                            }}
                            className="w-full pl-4 sm:pl-[40px]"
                          >
                            <p 
                              style={{
                                height: "auto",
                                fontFamily: "Faktum, sans-serif",
                                fontWeight: 500,
                                color: "rgba(43, 43, 43, 0.8)",
                                margin: 0,
                              }}
                              className="w-full text-xs sm:text-sm md:text-base leading-relaxed"
                            >
                              {step.offering}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB CONTENT: Reviews */}
            {activeTab === 'reviews' && (
              <div className="space-y-6 text-left animate-in fade-in duration-300 w-full">
                {/* Big Score Summary card */}
                <div 
                  style={{
                    maxWidth: "837px",
                    border: "1px solid rgba(204, 204, 204, 1)",
                    borderRadius: "4px",
                    backgroundColor: "rgba(255, 255, 255, 1)",
                    boxSizing: "border-box",
                    alignItems: "center",
                  }}
                  className="shadow-xs w-full h-auto p-6 flex flex-col sm:flex-row gap-6 text-left"
                >
                  {/* Left Column: Score */}
                  <div 
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                    className="w-full sm:w-[145.69px] items-center sm:items-start pl-0 sm:pl-6"
                  >
                    <span 
                      style={{
                        height: "53px",
                        fontFamily: "Faktum, sans-serif",
                        fontWeight: 500,
                        fontSize: "42px",
                        lineHeight: "100%",
                        color: "rgba(43, 43, 43, 1)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {pkg.rating.toFixed(1)}
                    </span>
                    <div style={{ display: "flex", gap: "4px" }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-[20px] h-[20px] fill-[#FFC72C] stroke-none" />
                      ))}
                    </div>
                    <span 
                      style={{
                        height: "25px",
                        fontFamily: "Faktum, sans-serif",
                        fontWeight: 500,
                        fontSize: "20px",
                        lineHeight: "100%",
                        color: "rgba(141, 141, 141, 1)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {pkg.ratingCount} Reviews
                    </span>
                  </div>

                  {/* Right Column: Bars */}
                  <div 
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                    className="flex-1 w-full pr-0 sm:pr-6"
                  >
                    {[
                      { label: '05', width: '92%' },
                      { label: '04', width: '68%' },
                      { label: '03', width: '55%' },
                      { label: '02', width: '30%' },
                      { label: '01', width: '12%' },
                    ].map((row) => (
                      <div key={row.label} style={{ display: "flex", alignItems: "center", gap: "16px", width: "100%" }}>
                        <span 
                          style={{
                            width: "25px",
                            height: "25px",
                            fontFamily: "Faktum, sans-serif",
                            fontWeight: 500,
                            fontSize: "20px",
                            lineHeight: "100%",
                            color: "rgba(43, 43, 43, 0.7)",
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                        >
                          {row.label}
                        </span>
                        <div className="flex-1 h-[19px] bg-gray-250/24 rounded-[4px] overflow-hidden">
                          <div style={{ height: "100%", width: row.width, backgroundColor: "rgba(255, 98, 62, 1)", borderRadius: "4px" }} />
                        </div>
                        <Star className="w-[20px] h-[20px] fill-[#FFC72C] stroke-none shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews card list */}
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} className="w-full">
                  {reviews.map((rev: any, i: number) => (
                    <div 
                      key={i} 
                      style={{
                        maxWidth: "837px",
                        height: "auto",
                        borderRadius: "4px",
                        backgroundColor: "rgba(255, 255, 255, 1)",
                        border: "1px solid rgba(204, 204, 204, 1)",
                        boxSizing: "border-box",
                        display: "flex",
                        flexDirection: "column",
                        gap: "24px",
                      }}
                      className="w-full p-4 sm:p-[24px]"
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                          <div style={{ width: "56px", height: "56px", borderRadius: "4px", overflow: "hidden", flexShrink: 0 }}>
                            <img src={rev.avatar} alt={rev.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px", justifyContent: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }} className="flex-wrap">
                              <h4 style={{ margin: 0, fontFamily: "Faktum, sans-serif", fontWeight: 600, fontSize: "24px", lineHeight: "100%", color: "rgba(43, 43, 43, 1)" }}>{rev.name}</h4>
                              <span 
                                style={{
                                  width: "71px",
                                  height: "18px",
                                  fontFamily: "Faktum, sans-serif",
                                  fontWeight: 600,
                                  fontSize: "14px",
                                  lineHeight: "100%",
                                  letterSpacing: "1.2px",
                                  textTransform: "uppercase",
                                  color: "rgba(46, 125, 50, 1)",
                                  backgroundColor: "rgba(46, 125, 50, 0.08)",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  borderRadius: "2px",
                                }}
                              >
                                Verified
                              </span>
                            </div>
                            <span style={{ fontFamily: "Faktum, sans-serif", fontWeight: 500, fontStyle: "italic", fontSize: "18px", lineHeight: "100%", color: "rgba(141, 141, 141, 1)", display: "flex", alignItems: "center" }}>
                              {rev.date}
                            </span>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "4px" }}>
                          {[...Array(Math.floor(Number(rev.rating)) || 5)].map((_, j) => (
                            <Star key={j} className="w-[20px] h-[20px] fill-[#FFC72C] stroke-none" />
                          ))}
                        </div>
                      </div>
                      <p 
                        style={{
                          margin: 0,
                          height: "auto",
                          fontFamily: "Faktum, sans-serif",
                          fontWeight: 500,
                          color: "rgba(43, 43, 43, 1)",
                          fontStyle: "italic",
                        }}
                        className="w-full text-sm sm:text-base md:text-[24px] md:leading-[32px]"
                      >
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Booking Sidebar Panel (Floats and scrolls down with page) */}
          <div className="sticky top-[110px] self-start space-y-6 w-full lg:max-w-[411px] z-20">
            
            {/* Secure Booking Board Card */}
            <div 
              style={{
                maxWidth: "411px",
                height: "auto",
                background: "rgba(255, 255, 255, 1)",
                border: "1px solid rgba(204, 204, 204, 1)",
                borderRadius: "4px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: "32px",
                justifyContent: "flex-start",
              }}
              className="text-left w-full p-6"
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  boxSizing: "border-box",
                }}
                className="w-full h-auto"
              >
                <span 
                  style={{
                    fontFamily: "Faktum, sans-serif",
                    fontWeight: 500,
                    fontSize: "16px",
                    lineHeight: "20px",
                    color: "rgba(141, 141, 141, 1)",
                  }}
                  className="w-full inline-block"
                >
                  Tour Package Price
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <span 
                    style={{
                      fontFamily: "Faktum, sans-serif",
                      fontWeight: 700,
                      fontSize: "32px",
                      lineHeight: "40px",
                      color: "rgba(43, 43, 43, 1)",
                    }}
                    className="inline-block"
                  >
                    ₹{pkg.price.toLocaleString('en-IN')}
                  </span>
                  <span
                    style={{
                      fontFamily: "Faktum, sans-serif",
                      fontWeight: 500,
                      fontSize: "14px",
                      lineHeight: "20px",
                      color: "rgba(141, 141, 141, 1)",
                    }}
                    className="inline-block"
                  >
                    / per person
                  </span>
                  {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                    <>
                      <span
                        style={{
                          fontFamily: "Faktum, sans-serif",
                          fontWeight: 500,
                          fontSize: "14px",
                          lineHeight: "18px",
                          color: "rgba(141, 141, 141, 1)",
                          textDecoration: "line-through",
                        }}
                        className="inline-block"
                      >
                        ₹{pkg.originalPrice.toLocaleString('en-IN')}
                      </span>
                      <span 
                        style={{
                          width: "auto",
                          minWidth: "57px",
                          height: "20px",
                          paddingLeft: "8px",
                          paddingRight: "8px",
                          backgroundColor: "rgba(0, 160, 35, 0.08)",
                          color: "rgba(0, 160, 35, 1)",
                          fontFamily: "Faktum, sans-serif",
                          fontWeight: 500,
                          fontSize: "16px",
                          lineHeight: "20px",
                          borderRadius: "4px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {discountPercent}% off
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Next Departures */}
              <div 
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  boxSizing: "border-box",
                }}
                className="w-full h-auto"
              >
                <span 
                  style={{
                    fontFamily: "Faktum, sans-serif",
                    fontWeight: 500,
                    fontSize: "16px",
                    lineHeight: "23px",
                    color: "rgba(141, 141, 141, 1)",
                  }}
                  className="w-full inline-block"
                >
                  Next Departures
                </span>
                <div 
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    boxSizing: "border-box",
                  }}
                  className="w-full h-auto"
                >
                  {departures.map((dept: any) => {
                    const isSelected = bookingDate === dept.value;
                    const seatsText = dept.seats.replace(' Available', '');
                    return (
                      <button
                        key={dept.value}
                        type="button"
                        onClick={() => setBookingDate(dept.value)}
                        className="w-full flex justify-between items-center transition cursor-pointer"
                        style={{
                          height: "25px",
                          border: "none",
                          background: "transparent",
                          padding: 0,
                          margin: 0,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span 
                          style={{
                            fontFamily: "Faktum, sans-serif",
                            fontWeight: isSelected ? 600 : 500,
                            fontSize: "20px",
                            lineHeight: "25px",
                            color: "rgba(43, 43, 43, 1)",
                            textAlign: "left",
                          }}
                          className="inline-block"
                        >
                          {dept.label}
                        </span>
                        <span 
                          style={{
                            fontFamily: "Faktum, sans-serif",
                            fontWeight: isSelected ? 600 : 500,
                            fontSize: "20px",
                            lineHeight: "25px",
                            color: "rgba(43, 43, 43, 1)",
                            textAlign: "right",
                          }}
                          className="inline-block"
                        >
                          {seatsText}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons & Badges */}
              <div className="flex flex-col gap-2">
                <form onSubmit={handleBook}>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: "rgba(29, 73, 62, 1)",
                      height: "60px",
                      paddingTop: "16px",
                      paddingBottom: "16px",
                      paddingLeft: "32px",
                      paddingRight: "32px",
                      borderRadius: "4px",
                      border: "none",
                      color: "#FFFFFF",
                      boxSizing: "border-box",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    className="w-full hover:opacity-95 transition-opacity cursor-pointer flex items-center justify-center gap-2"
                  >
                    {bookedSuccess ? (
                      <span
                        style={{
                          fontFamily: "Faktum, sans-serif",
                          fontWeight: 500,
                          fontSize: "18px",
                          lineHeight: "23px",
                        }}
                      >
                        Added to Cart!
                      </span>
                    ) : (
                      <>
                        <Calendar style={{ width: "28px", height: "28px" }} className="shrink-0" />
                        <span
                          style={{
                            fontFamily: "Faktum, sans-serif",
                            fontWeight: 500,
                            fontSize: "18px",
                            lineHeight: "23px",
                            color: "rgba(255, 255, 255, 1)",
                          }}
                          className="inline-block"
                        >
                          Book this experience
                        </span>
                      </>
                    )}
                  </button>
                </form>

                <button
                  type="button"
                  onClick={handleSaveForLater}
                  style={{
                    backgroundColor: "transparent",
                    height: "55px",
                    paddingTop: "16px",
                    paddingBottom: "16px",
                    paddingLeft: "32px",
                    paddingRight: "32px",
                    borderRadius: "4px",
                    border: "2px solid rgba(29, 73, 62, 1)",
                    boxSizing: "border-box",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  className="w-full hover:bg-[#1D493E]/5 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span
                    style={{
                      fontFamily: "Faktum, sans-serif",
                      fontWeight: 500,
                      fontSize: "18px",
                      lineHeight: "23px",
                      color: "rgba(29, 73, 62, 1)",
                    }}
                    className="inline-block text-center"
                  >
                    {saved ? 'Saved' : 'Save for later'}
                  </span>
                </button>
              </div>

              {/* Inclusions features badge lists */}
              <div 
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxSizing: "border-box",
                  marginTop: "8px",
                }}
                className="w-full flex justify-between items-center gap-2 mt-2"
              >
                <div 
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    boxSizing: "border-box",
                  }}
                  className="flex flex-col items-center gap-2 flex-1"
                >
                  <div 
                    style={{ 
                      width: "46px", 
                      height: "46px", 
                      borderRadius: "4px", 
                      backgroundColor: "rgba(246, 243, 238, 1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    className="shrink-0"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2B2B2B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="11" width="14" height="9" rx="2" />
                      <path d="M16 11V7a4 4 0 0 0-8 0v2" />
                      <line x1="12" y1="14" x2="12" y2="17" />
                    </svg>
                  </div>
                  <span 
                    style={{
                      fontFamily: "Faktum, sans-serif",
                      fontWeight: 500,
                      color: "rgba(43, 43, 43, 1)",
                    }}
                    className="text-xs sm:text-sm text-center inline-block"
                  >
                    Safe & Secure
                  </span>
                </div>

                <div 
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    boxSizing: "border-box",
                  }}
                  className="flex flex-col items-center gap-2 flex-1"
                >
                  <div 
                    style={{ 
                      width: "46px", 
                      height: "46px", 
                      borderRadius: "4px", 
                      backgroundColor: "rgba(246, 243, 238, 1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    className="shrink-0"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2B2B2B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 4 A 8 8 0 1 1 4.5 13" />
                      <path d="M12 8v4l3 3" />
                    </svg>
                  </div>
                  <span 
                    style={{
                      fontFamily: "Faktum, sans-serif",
                      fontWeight: 500,
                      color: "rgba(43, 43, 43, 1)",
                    }}
                    className="text-xs sm:text-sm text-center inline-block"
                  >
                    24/7 Support
                  </span>
                </div>

                <div 
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    boxSizing: "border-box",
                  }}
                  className="flex flex-col items-center gap-2 flex-1"
                >
                  <div 
                    style={{ 
                      width: "46px", 
                      height: "46px", 
                      borderRadius: "4px", 
                      backgroundColor: "rgba(246, 243, 238, 1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    className="shrink-0"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2B2B2B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3l2.5 5.5H21l-3.5 3.5" />
                      <path d="M18.5 19.5l-6.5-4-6.5 4 1.5-6.5-5-5h6.5L12 3" />
                    </svg>
                  </div>
                  <span 
                    style={{
                      fontFamily: "Faktum, sans-serif",
                      fontWeight: 500,
                      color: "rgba(43, 43, 43, 1)",
                    }}
                    className="text-xs sm:text-sm text-center inline-block"
                  >
                    {pkg.rating.toFixed(1)}/5 Rating
                  </span>
                </div>
              </div>

              {/* Free Cancellation text */}
              <span 
                style={{
                  fontFamily: "Faktum, sans-serif",
                  fontWeight: 500,
                  color: "rgba(141, 141, 141, 1)",
                  boxSizing: "border-box",
                  marginTop: "0px",
                }}
                className="w-full text-center inline-block text-xs sm:text-sm mt-1"
              >
                Free cancellation • 14 days before departure
              </span>
            </div>


          </div>
        </div>
      </div>

      {/* Boutique Gear Recommendations section */}
      {recommendedProducts.length > 0 && (
        <section
          style={{
            width: "100%",
            maxWidth: "1440px",
            backgroundColor: "rgba(255, 255, 255, 1)",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
          }}
          className="relative z-10 mx-auto text-left w-full max-w-[1440px] px-4 md:px-[80px] py-[42px]"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end w-full gap-4">
             <div style={{ display: "flex", flexDirection: "column", gap: "12px" }} className="w-full max-w-[1029px]">
              <h2
                style={{
                  fontFamily: "Fraunces, serif",
                  fontWeight: 600,
                  color: "#2B2B2B",
                  margin: 0,
                }}
                className="text-2xl md:text-[42px] leading-tight"
              >
                Prepare for your <span style={{ color: "#FF5A36" }}>Journey</span>
              </h2>
              <p
                style={{
                  fontFamily: "Faktum, sans-serif",
                  fontWeight: 500,
                  color: "rgba(141, 141, 141, 1)",
                  margin: 0,
                }}
                className="text-sm sm:text-base md:text-[20px] leading-normal"
              >
                Shop recommended travel gear and clothing items handpicked for your destination
              </p>
            </div>
            <Link
              href="/shop"
              style={{
                height: "68px",
                paddingTop: "18px",
                paddingBottom: "18px",
                paddingLeft: "24px",
                paddingRight: "24px",
                borderRadius: "4px",
                color: "rgba(29, 73, 62, 1)",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                textDecoration: "none",
                boxSizing: "border-box",
              }}
              className="hover:opacity-80 transition-opacity w-full sm:w-auto justify-start sm:justify-end text-[#1D493E] font-medium py-3 px-4"
            >
              <span
                style={{
                  fontFamily: "Faktum, sans-serif",
                  fontWeight: 500,
                  display: "inline-block",
                }}
                className="inline-block text-sm sm:text-base md:text-[20px]"
              >
                View all products
              </span>
              <ArrowUpRight style={{ width: "32px", height: "32px" }} className="text-[#1D493E] shrink-0" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[32px] w-full mt-4">
            {recommendedProducts.map((prod: any) => (
              <div
                key={prod.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  boxSizing: "border-box",
                }}
                className="w-full text-left"
              >
                <div
                  style={{
                    height: "250px",
                    borderTopLeftRadius: "4px",
                    borderTopRightRadius: "4px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                  className="bg-slate-100 group cursor-pointer w-full"
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                  {/* Slider dots overlay */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "12px",
                      left: "0",
                      right: "0",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div style={{ width: "12px", height: "6px", borderRadius: "100px", backgroundColor: "#1D493E" }} />
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "rgba(255, 255, 255, 0.6)" }} />
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "rgba(255, 255, 255, 0.6)" }} />
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "rgba(255, 255, 255, 0.6)" }} />
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "rgba(255, 255, 255, 0.6)" }} />
                  </div>
                </div>

                 {/* Product Content Block */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "32px",
                    boxSizing: "border-box",
                  }}
                  className="w-full h-auto flex flex-col gap-6"
                >
                  {/* Category Badge */}
                  <span
                    style={{
                      backgroundColor: "rgba(255, 240, 235, 1)",
                      color: "rgba(255, 98, 62, 1)",
                      fontFamily: "Faktum, sans-serif",
                      fontWeight: 700,
                      fontSize: "12px",
                      padding: "4px 10px",
                      borderRadius: "4px",
                      alignSelf: "flex-start",
                    }}
                    className="tracking-wider uppercase"
                  >
                    {prod.category}
                  </span>

                  {/* Name & Price */}
                  <div 
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      boxSizing: "border-box",
                    }}
                    className="w-full flex justify-between items-center gap-2"
                  >
                    <span
                      style={{
                        fontFamily: "Faktum, sans-serif",
                        fontWeight: 600,
                        color: "rgba(43, 43, 43, 1)",
                      }}
                      className="truncate flex-1 text-sm sm:text-base md:text-[20px] font-semibold text-[#2B2B2B]"
                    >
                      {prod.name}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      {prod.originalPrice && (
                        <span
                          style={{
                            fontFamily: "Faktum, sans-serif",
                            fontWeight: 600,
                            color: "rgba(141, 141, 141, 1)",
                            textDecoration: "line-through",
                          }}
                          className="text-xs sm:text-sm text-gray-500 line-through inline-block font-semibold"
                        >
                          ₹{prod.originalPrice}
                        </span>
                      )}
                      <span
                        style={{
                          fontFamily: "Faktum, sans-serif",
                          fontWeight: 700,
                          color: "rgba(43, 43, 43, 1)",
                        }}
                        className="text-sm sm:text-lg md:text-[28px] font-bold text-[#2B2B2B] inline-block"
                      >
                        ₹{prod.price}
                      </span>
                    </div>
                  </div>

                  {/* Reviews & Bought count block */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                      boxSizing: "border-box",
                    }}
                    className="w-full h-auto flex flex-col gap-3"
                  >
                    {/* Reviews */}
                    <div className="flex items-center gap-2">
                      <div className="flex text-[#FF5A36] gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[#FF5A36] stroke-none" />
                        ))}
                      </div>
                      <span
                        style={{
                          fontFamily: "Faktum, sans-serif",
                          fontWeight: 500,
                          fontSize: "16px",
                          color: "rgba(141, 141, 141, 1)",
                        }}
                      >
                        ({prod.reviewsCount} Reviews)
                      </span>
                    </div>

                    {/* Bought count */}
                    <span
                      style={{
                        fontFamily: "Faktum, sans-serif",
                        fontWeight: 500,
                        fontSize: "16px",
                        color: "rgba(141, 141, 141, 1)",
                      }}
                    >
                      {prod.boughtCount}
                    </span>
                  </div>

                  {/* Delivery */}
                  <span
                    style={{
                      fontFamily: "Faktum, sans-serif",
                      fontWeight: 500,
                      color: "rgba(141, 141, 141, 1)",
                      boxSizing: "border-box",
                    }}
                    className="w-full text-xs sm:text-sm md:text-base text-gray-500 leading-normal block"
                  >
                    FREE delivery as soon as{" "}
                    <span style={{ color: "rgba(43, 43, 43, 1)", fontWeight: 500 }}>
                      Thu, 9 Apr, 7 am - 10 pm
                    </span>
                  </span>

                  {/* Add to Cart button */}
                  <button
                    onClick={() => handleProductAdd(prod)}
                    style={{
                      paddingTop: "16px",
                      paddingBottom: "16px",
                      paddingLeft: "32px",
                      paddingRight: "32px",
                      borderRadius: "4px",
                      boxSizing: "border-box",
                    }}
                    className="w-full h-[60px] hover:bg-[#1D493E] hover:text-white transition-colors flex items-center justify-center gap-2 border-2 border-[#1D493E] rounded-[4px] bg-white text-[#1D493E] text-sm sm:text-base font-semibold"
                  >
                    {productAddedSuccess === prod.id ? 'Added!' : 'Add to cart'}
                    <ShoppingCart className="w-[24px] h-[24px]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter / Booking CTA Banner (Matching Home page section design) */}
      <section
        style={{
          width: "100%",
          background: "#FFFFFF",
        }}
        className="relative z-10 w-full px-4 md:px-[80px] py-[42px] bg-white border-t border-[#1D493E]/10"
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
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            {/* Heading: Fraunces SemiBold 42px, lh 100%, #2B2B2B */}
            <h2
              style={{
                fontFamily: "Fraunces, serif",
                fontWeight: 600,
                letterSpacing: "0px",
                textAlign: "center",
                color: "#2B2B2B",
                maxWidth: "1280px",
                margin: 0,
              }}
              className="text-2xl sm:text-3xl md:text-[42px] leading-tight text-center font-serif font-semibold text-[#2B2B2B]"
            >
              The{" "}
              <span style={{ color: "#FF5A36" }}>best adventures</span>{" "}
              find their way to your inbox.
            </h2>
            {/* Subtitle: Faktum Medium 24px, lh 32px, rgba(43,43,43,1) */}
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
              className="text-sm sm:text-base md:text-[24px] md:leading-[32px] text-center text-[#2B2B2B] font-sans font-medium"
            >
              Hidden places, exclusive trip drops, curated gear, and stories from the road delivered before anyone else hears about them.
            </p>
          </div>

          {/* Button: 286×55, pt-16 pr-32 pb-16 pl-32, radius-4, bg #1D493E */}
          <button
            type="button"
            onClick={() => {
              const bookingEl = document.querySelector('form');
              if (bookingEl) {
                bookingEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            style={{
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
              border: "none",
              transition: "opacity 0.2s",
              cursor: "pointer",
            }}
            className="hover:opacity-90 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1D493E] text-white py-4 px-8 rounded-[4px] font-semibold text-sm sm:text-base"
          >
            <span>Reserve your tour now</span>
            <span className="text-lg font-sans">↗</span>
          </button>
        </div>
      </section>

      {isEnquiryModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs p-4 flex justify-center items-start">
          <div 
            style={{
              width: "100%",
              maxWidth: "778px",
              minHeight: "834px",
              background: "rgba(255, 255, 255, 1)",
              border: "1px solid rgba(204, 204, 204, 1)",
              borderRadius: "4px",
              padding: "24px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
            className="relative md:absolute md:top-[95px] md:left-1/2 md:-translate-x-1/2 shadow-2xl text-left animate-in fade-in duration-200"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsEnquiryModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition cursor-pointer text-lg font-bold"
            >
              ✕
            </button>

            {enquirySubmitted ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center animate-in fade-in duration-300 my-auto">
                <div className="w-16 h-16 bg-[#1D493E]/10 border-2 border-[#1D493E]/20 text-[#1D493E] rounded-full flex items-center justify-center animate-bounce">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-sans font-bold text-[#1D493E]">Enquiry Submitted!</h3>
                <p className="text-sm text-gray-550 font-medium max-w-xs leading-relaxed">
                  Thank you! We will reach out to you within 24 hours on your contact number.
                </p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="space-y-1">
                  <h3 className="font-sans font-bold text-[32px] text-[#2B2B2B] leading-none mb-1">
                    {pkg?.name || 'Srinagar to Leh'} Booking
                  </h3>
                  <p className="font-sans font-medium text-[18px] text-[#8D8D8D] leading-none">
                    You can reach us anytime
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleEnquirySubmit} className="flex flex-col gap-[24px]">
                  {/* Full Name */}
                  <div>
                    <label className="font-sans font-medium text-[16px] text-[#2B2B2B] block mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Kumar Sai Arja"
                      value={enquiryName}
                      onChange={(e) => setEnquiryName(e.target.value)}
                      style={{ borderColor: "rgba(204, 204, 204, 1)" }}
                      className="w-full p-4 rounded-[4px] border bg-white text-base text-[#2B2B2B] focus:outline-none focus:ring-1 focus:ring-[#1D493E] font-medium placeholder-[#CCCCCC]"
                    />
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label className="font-sans font-medium text-[16px] text-[#2B2B2B] block mb-2">
                      Contact Number
                    </label>
                    <div 
                      style={{ borderColor: "rgba(204, 204, 204, 1)" }} 
                      className="flex rounded-[4px] border bg-white overflow-hidden"
                    >
                      <div className="relative flex items-center border-r border-[#CCCCCC] bg-[#F4F6F5] px-4 cursor-pointer">
                        <select
                          value={phonePrefix}
                          onChange={(e) => setPhonePrefix(e.target.value)}
                          className="appearance-none bg-transparent pr-6 text-base font-medium text-[#2B2B2B] focus:outline-none cursor-pointer"
                        >
                          <option value="+020">+020</option>
                          <option value="+91">+91</option>
                          <option value="+1">+1</option>
                          <option value="+44">+44</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2 pointer-events-none" />
                      </div>
                      <input
                        type="tel"
                        required
                        placeholder="9492906356"
                        value={enquiryPhone}
                        onChange={(e) => setEnquiryPhone(e.target.value)}
                        className="flex-1 px-4 py-3.5 text-base text-[#2B2B2B] focus:outline-none font-medium placeholder-[#CCCCCC]"
                      />
                    </div>
                  </div>

                  {/* No of Travelers */}
                  <div>
                    <label className="font-sans font-medium text-[16px] text-[#2B2B2B] block mb-2">
                      No of Travelers
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="02"
                      value={enquiryGuests}
                      onChange={(e) => setEnquiryGuests(e.target.value)}
                      style={{ borderColor: "rgba(204, 204, 204, 1)" }}
                      className="w-full p-4 rounded-[4px] border bg-white text-base text-[#2B2B2B] focus:outline-none focus:ring-1 focus:ring-[#1D493E] font-medium placeholder-[#CCCCCC]"
                    />
                  </div>

                  {/* Pick up location */}
                  <div>
                    <label className="font-sans font-medium text-[16px] text-[#2B2B2B] block mb-2">
                      Pick up location
                    </label>
                    <div className="relative">
                      <select
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        style={{ borderColor: "rgba(204, 204, 204, 1)" }}
                        className="w-full p-4 pr-10 rounded-[4px] border bg-white text-base text-[#2B2B2B] appearance-none focus:outline-none focus:ring-1 focus:ring-[#1D493E] font-medium cursor-pointer"
                      >
                        <option value="">Ex: Telangana</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Karnataka">Karnataka</option>
                      </select>
                      <ChevronDown className="w-5 h-5 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="font-sans font-medium text-[16px] text-[#2B2B2B] block mb-2">
                      Message
                    </label>
                    <textarea
                      placeholder="Tell us about your requirements"
                      value={enquiryMessage}
                      onChange={(e) => setEnquiryMessage(e.target.value)}
                      rows={4}
                      style={{ borderColor: "rgba(204, 204, 204, 1)" }}
                      className="w-full p-4 rounded-[4px] border bg-white text-base text-[#2B2B2B] focus:outline-none focus:ring-1 focus:ring-[#1D493E] font-medium placeholder-[#CCCCCC] resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    style={{
                      backgroundColor: "rgba(29, 73, 62, 1)",
                      height: "55px",
                      borderRadius: "4px",
                      border: "none",
                      fontFamily: "'Faktum', 'Outfit', sans-serif",
                      fontWeight: 500,
                      fontSize: "18px",
                      lineHeight: "100%",
                      color: "#FFFFFF",
                    }}
                    className="w-full hover:opacity-95 transition-opacity cursor-pointer mt-2 flex items-center justify-center font-semibold"
                  >
                    Submit Enquiry
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
