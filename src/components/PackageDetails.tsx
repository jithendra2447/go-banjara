'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Calendar, Users, Check, ShoppingBag,
  Star, Compass, MapPin, Tag,
  Sun, Wind, ArrowLeft, Lock, ArrowUpRight,
  ChevronDown
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

      let foundPkg = list.find((p) => p.id === id);

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
  const recommendedProducts = productsList.filter((p) =>
    ['fur-jaden-backpack-1', 'go-passport-cover-1', 'nomad-leather-journal-1', 'banjara-luggage-tag-1'].includes(p.id)
  ).slice(0, 2);

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
    <div className="bg-[#FAF9F6] text-[#1D493E] min-h-screen font-sans relative overflow-x-hidden pb-12">
      {/* Dynamic ambient particles */}
      <AmbientVibe effect={ambientEffect} />

      {/* Breadcrumbs */}
      <div className="max-w-6xl mx-auto px-6 pt-6 pb-4 text-left">
        <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
          <Link href="/" className="hover:text-[#1D493E]">Home</Link>
          <span>/</span>
          <Link href="/travel" className="hover:text-[#1D493E]">Travel</Link>
          <span>/</span>
          <span className="text-gray-400">{pkg.destination}</span>
          <span>/</span>
          <span className="text-gray-400 truncate max-w-[200px]">{pkg.name}</span>
        </div>
      </div>

      {/* 6-Image Grid Collage Showcase */}
      <div className="max-w-6xl mx-auto px-6 mb-10">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 rounded-[24px] overflow-hidden">
          {galleryImages.map((img: string, idx: number) => (
            <div
              key={idx}
              className="relative aspect-[3/2] overflow-hidden rounded-2xl border border-[#1D493E]/10 bg-slate-900 group cursor-pointer"
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

      {/* Dual Column Layout Spread */}
      <section className="relative z-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN: Travel package details */}
          <div className="lg:col-span-8 space-y-10 text-left">
            
            {/* Header Title Row */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-black uppercase font-mono">
                <span className="bg-[#FFF0EB] text-[#FF623E] tracking-wider px-2.5 py-1 rounded">
                  {pkg.category || 'Road Trip'}
                </span>
                <span className="text-gray-500">{pkg.duration}</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between sm:items-start border-b border-[#1D493E]/10 pb-5 gap-3">
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1D493E] leading-tight">
                  {pkg.name}
                </h1>
                <div className="text-left sm:text-right space-y-1">
                  <span className="text-2xl font-serif font-black text-[#E05434]">
                    ₹{pkg.price.toLocaleString('en-IN')}/Person
                  </span>
                  <span className="text-[10px] text-gray-400 block font-mono">Permits & Transport included</span>
                </div>
              </div>
            </div>

            {/* General Overview Paragraph */}
            <p className="text-base md:text-lg text-gray-700 leading-relaxed font-normal">
              {pkg.description}
            </p>

            {/* Key Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#1D493E]/20 flex items-center justify-center shrink-0 shadow-xs">
                  <MapPin className="w-5 h-5 text-[#1D493E]" />
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-800">Starts: {pkg.startPoint || 'Srinagar'}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#1D493E]/20 flex items-center justify-center shrink-0 shadow-xs">
                  <Users className="w-5 h-5 text-[#1D493E]" />
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-800">{pkg.groupType || 'Curated group Trip'}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#1D493E]/20 flex items-center justify-center shrink-0 shadow-xs">
                  <Compass className="w-5 h-5 text-[#1D493E]" />
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-800">{pkg.difficulty || 'Moderate'} Difficulty</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#1D493E]/20 flex items-center justify-center shrink-0 shadow-xs">
                  <Calendar className="w-5 h-5 text-[#1D493E]" />
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-800">Next: {pkg.nextDeparture || 'Aug, 2026'}</span>
                </div>
              </div>
            </div>

            {/* Rating summary */}
            <div className="flex flex-col gap-1 items-start">
              <div className="flex items-center gap-2">
                <div className="flex text-[#E05434] gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 fill-[#E05434] stroke-none ${
                        i < Math.floor(pkg.rating) ? 'fill-[#E05434]' : 'fill-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-500">({pkg.ratingCount} reviews)</span>
              </div>
              <span className="text-xs font-semibold text-gray-400">
                100+ bought in past month
              </span>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-8 border-b border-gray-200">
              {(['overview', 'itinerary', 'reviews'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-sm font-bold uppercase tracking-wider transition-all cursor-pointer border-b-2 ${
                    activeTab === tab
                      ? 'border-[#1D493E] text-[#1D493E]'
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TAB CONTENT: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-10 animate-in fade-in duration-300">
                
                {/* Route stops map block */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-mono text-[#1D493E]/60 uppercase font-black tracking-wider block">
                    Expedition Route Map
                  </span>
                  <div className="flex flex-wrap items-center gap-2 bg-[#f3faf5] border border-[#1D493E]/8 p-3.5 rounded-2xl">
                    {pkg.routeList.map((node: string, i: number) => (
                      <React.Fragment key={i}>
                        <span className="text-[10px] font-sans font-extrabold text-[#1D493E] bg-white border border-[#1D493E]/10 px-2.5 py-1.5 rounded-xl shadow-sm">
                          {node}
                        </span>
                        {i < pkg.routeList.length - 1 && (
                          <span className="text-[#E05434] text-xs font-black">→</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#E05434] bg-[#FFF0EB] px-2.5 py-1 rounded font-black uppercase">
                      Critical Highlights
                    </span>
                  </div>
                  <h3 className="text-2xl font-serif font-light text-[#1D493E]">Highlights</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {pkg.highlights.map((hl: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 bg-white border border-[#1D493E]/10 p-3.5 rounded-2xl shadow-xs">
                        <Check className="w-4 h-4 text-[#E05434] shrink-0 mt-0.5" />
                        <span className="text-sm text-[#1D493E] font-medium leading-relaxed">{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Narrow Brand Banner 1 */}
                <div className="bg-[#E05434]/5 border border-[#E05434]/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-10 h-10 rounded-xl bg-[#E05434]/10 border border-[#E05434]/20 flex items-center justify-center text-[#E05434] shrink-0">
                      <Users className="w-5 h-5 text-[#E05434]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#1D493E] uppercase tracking-wider">Intimate Group Batches</h4>
                      <p className="text-[11px] text-gray-500 font-semibold mt-0.5">We limit every batch to 12 travelers to ensure premium hospitality, flexibility, and group safety.</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono font-black text-[#E05434] uppercase tracking-wider bg-white border border-[#E05434]/15 px-3 py-1.5 rounded-lg shrink-0">
                    12 Spots Max
                  </span>
                </div>

                {/* What's Included & Not Included Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#1D493E]/10 pt-8">
                  {/* Included */}
                  <div className="space-y-4 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[#1D493E] bg-[#f3faf5] px-2.5 py-1 rounded font-black uppercase">
                        Free
                      </span>
                    </div>
                    <h3 className="text-2xl font-serif font-light text-[#1D493E]">
                      What's <span className="text-[#1D493E] font-serif font-normal">Included</span>
                    </h3>
                    <ul className="space-y-2.5">
                      {pkg.inclusions.map((inc: string, i: number) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 font-normal leading-relaxed capitalize">
                          <span className="text-[#1D493E] font-bold text-sm">•</span>
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Excluded */}
                  <div className="space-y-4 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[#E05434] bg-[#FFF0EB] px-2.5 py-1 rounded font-black uppercase">
                        Costs
                      </span>
                    </div>
                    <h3 className="text-2xl font-serif font-light text-[#1D493E]">
                      <span className="text-[#E05434] font-serif font-normal">Not</span> Included
                    </h3>
                    <ul className="space-y-2.5">
                      {exclusions.map((exc: string, i: number) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 font-normal leading-relaxed">
                          <span className="text-[#E05434] font-bold text-sm">•</span>
                          <span>{exc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Packing List */}
                <div className="space-y-4 border-t border-[#1D493E]/10 pt-8 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#E05434] bg-[#FFF0EB] px-2.5 py-1 rounded font-black uppercase">
                      Gears
                    </span>
                  </div>
                  <h3 className="text-2xl font-serif font-light text-[#1D493E]">
                    <span className="text-[#E05434] font-serif font-normal">Packing</span> List
                  </h3>
                  <ul className="space-y-2.5 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
                    {packingList.map((pk: string, i: number) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 font-normal leading-relaxed">
                        <span className="text-[#1D493E] font-bold text-sm">•</span>
                        <span>{pk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Narrow Brand Banner 2 */}
                <div className="bg-[#1D493E] text-white rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm border border-white/5">
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-10 h-10 rounded-xl bg-[#FFFF80] flex items-center justify-center shrink-0">
                      <Compass className="w-5 h-5 text-[#1D493E]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#FFFF80] uppercase tracking-wider">Community-Led Tourism</h4>
                      <p className="text-[11px] text-slate-200 font-medium mt-0.5">85% of your tour expenses are directly funneled to local homestays, native guides, and remote monasteries.</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono font-black text-[#FFFF80] uppercase tracking-wider bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg shrink-0">
                    Support Local
                  </span>
                </div>

                {/* Know your Guide */}
                <div className="space-y-4 border-t border-[#1D493E]/10 pt-8 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#E05434] bg-[#FFF0EB] px-2.5 py-1 rounded font-black uppercase">
                      Support Team
                    </span>
                  </div>
                  <h3 className="text-2xl font-serif font-light text-[#1D493E]">
                    Know your <span className="text-[#E05434] font-serif font-normal">Guide</span>
                  </h3>
                  <div className="bg-white border border-[#1D493E]/15 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-xs">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-slate-100 border border-[#1D493E]/15">
                      <img
                        src={guide.image}
                        alt={`${guide.name} Guide`}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2 text-center sm:text-left flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div>
                          <span className="text-[9px] font-mono text-[#E05434] uppercase font-black tracking-widest block">
                            {guide.role}
                          </span>
                          <h4 className="text-xl font-serif font-bold text-[#1D493E]">{guide.name}</h4>
                        </div>
                        <div className="flex items-center gap-1.5 justify-center sm:justify-end text-[#E05434]">
                          <div className="flex text-[#E05434] gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-[#E05434] stroke-none" />
                            ))}
                          </div>
                          <span className="text-xs font-black text-gray-600">
                            {guide.rating.toFixed(1)} ({guide.trips} Trips)
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed font-normal">
                        {guide.bio}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Itinerary */}
            {activeTab === 'itinerary' && pkg.itinerary && (
              <div className="space-y-6 text-left animate-in fade-in duration-300">
                <h3 className="text-2xl font-serif font-light text-[#E05434] leading-snug mb-6 max-w-xl">
                  A day-by-day breakdown of what to expect. Every day is designed to balance discovery, culture, and recovery.
                </h3>

                <div className="space-y-4">
                  {pkg.itinerary.map((step: any, idx: number) => {
                    const isOpen = expandedDayIdx === idx;
                    const numStr = String(idx + 1).padStart(2, '0');
                    return (
                      <div key={idx} className="border border-[#1D493E]/10 rounded-2xl overflow-hidden bg-white shadow-xs">
                        <button
                          type="button"
                          onClick={() => setExpandedDayIdx(isOpen ? null : idx)}
                          className="w-full p-6 flex justify-between items-center text-left hover:bg-gray-50 transition cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-[#E05434] font-black text-sm font-mono shrink-0">
                              {numStr}
                            </span>
                            <span className="text-sm font-extrabold text-[#1D493E] leading-snug">
                              Day {idx + 1}: {step.title}
                            </span>
                          </div>
                          <span className="text-[#1D493E] text-xs font-bold font-mono transition-transform duration-300">
                            {isOpen ? '▲' : '▼'}
                          </span>
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-6 pt-4 border-t border-[#1D493E]/5 text-sm text-gray-600 font-normal leading-relaxed space-y-4 text-left">
                            <p>{step.offering}</p>

                            {/* Route stops path */}
                            {step.places && step.places.length > 0 && (
                              <div className="space-y-1.5 pt-2 border-t border-[#1D493E]/5">
                                <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block">
                                  Key Route Stops:
                                </span>
                                <div className="flex flex-wrap items-center gap-1.5">
                                  {step.places.map((place: string, i: number) => (
                                    <React.Fragment key={i}>
                                      <span className="text-[9px] font-sans font-extrabold text-[#1D493E] bg-[#FAF9F6] border border-gray-150/60 px-2.5 py-1 rounded-xl">
                                        {place}
                                      </span>
                                      {i < step.places.length - 1 && (
                                        <span className="text-gray-300 text-[9px]">➔</span>
                                      )}
                                    </React.Fragment>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Today's inclusions */}
                            {step.activities && step.activities.length > 0 && (
                              <div className="space-y-2 pt-2 border-t border-[#1D493E]/5">
                                <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block">
                                  Today's Experiences:
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {step.activities.map((act: string, i: number) => (
                                    <div key={i} className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                      <Check className="w-3.5 h-3.5 text-[#E05434]" />
                                      <span>{act}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Insider Tip box */}
                            {step.insiderTip && (
                              <div className="bg-[#FAF9F6] border border-[#1D493E]/10 rounded-xl p-4 mt-2 flex items-start gap-3">
                                <Compass className="w-4 h-4 text-[#E05434] shrink-0 mt-0.5" />
                                <div>
                                  <span className="text-[9px] font-mono font-black text-[#E05434] uppercase tracking-wider block">
                                    Banjāra Tip
                                  </span>
                                  <p className="text-xs text-gray-500 font-medium leading-relaxed mt-0.5">
                                    {step.insiderTip}
                                  </p>
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

            {/* TAB CONTENT: Reviews */}
            {activeTab === 'reviews' && (
              <div className="space-y-6 text-left animate-in fade-in duration-300">
                {/* Big Score Summary card */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white border border-[#1D493E]/10 p-6 rounded-2xl items-center shadow-xs">
                  <div className="text-center space-y-1.5 border-r border-[#1D493E]/10 pr-6">
                    <span className="text-5xl font-black text-[#1D493E] font-serif">{pkg.rating.toFixed(1)}</span>
                    <div className="flex justify-center text-[#E05434] gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#E05434] stroke-none" />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-400 block font-mono">{pkg.ratingCount} Reviews</span>
                  </div>
                  <div className="sm:col-span-2 space-y-2.5 text-xs font-semibold text-gray-600 pl-2">
                    {[
                      { label: '05', width: 'w-[92%]' },
                      { label: '04', width: 'w-[68%]' },
                      { label: '03', width: 'w-[55%]' },
                      { label: '02', width: 'w-[30%]' },
                      { label: '01', width: 'w-[12%]' },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center gap-3.5">
                        <span className="w-5 font-mono text-gray-500">{row.label}</span>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full bg-[#E05434] rounded-full ${row.width}`} />
                        </div>
                        <Star className="w-3.5 h-3.5 fill-[#FFFF80] text-[#E05434] shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews card list */}
                <div className="space-y-4">
                  {reviews.map((rev: any, i: number) => (
                    <div key={i} className="bg-white border border-[#1D493E]/10 p-6 rounded-2xl space-y-4 shadow-xs">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-slate-100 border border-gray-150">
                            <img src={rev.avatar} alt={rev.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-extrabold text-[#1D493E]">{rev.name}</h4>
                              <span className="text-[8px] bg-green-50 text-green-600 border border-green-200/50 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                                Verified
                              </span>
                            </div>
                            <span className="text-[10px] text-gray-400 font-mono block mt-0.5">{rev.date}</span>
                          </div>
                        </div>
                        <div className="flex text-[#E05434] gap-0.5">
                          {[...Array(rev.rating || 5)].map((_, j) => (
                            <Star key={j} className="w-3.5 h-3.5 fill-[#E05434] stroke-none" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 font-semibold leading-relaxed italic">
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Booking Sidebar Panel */}
          <div className="lg:col-span-4 sticky top-6 space-y-6">
            
            {/* Live Weather Widget */}
            <div className="bg-[#1D493E] text-white p-5 rounded-[24px] border border-white/10 shadow-md space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#FFFF80] flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#E05434] animate-ping" />
                  Live Weather
                </span>
                <span className="text-[9px] text-slate-300 font-mono">Base Camp</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-baseline text-4xl font-light text-slate-100 font-serif">
                  {liveTemp.temp}
                  <span className="text-2xl font-serif">°C</span>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="text-left space-y-0.5">
                  <p className="text-xs font-bold text-white">{liveTemp.condition}</p>
                  <p className="text-[9px] text-slate-300 font-mono">Wind: {liveTemp.wind}</p>
                </div>
              </div>
            </div>

            {/* Exclusive Offers Widget */}
            <div className="bg-white border border-[#1D493E]/10 rounded-[24px] p-5 shadow-xs space-y-3">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#E05434] font-black flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#E05434]" />
                Exclusive Offers
              </span>
              <div className="space-y-2 text-[11px] text-gray-500 font-semibold">
                <p className="leading-normal flex items-start gap-1">
                  <span className="text-[#E05434] font-bold">•</span>
                  <span><strong>BANJARACOZY:</strong> Complimentary welcome dinner.</span>
                </p>
                <p className="leading-normal flex items-start gap-1">
                  <span className="text-[#E05434] font-bold">•</span>
                  <span>Free local guide and cultural experience.</span>
                </p>
              </div>
            </div>

            {/* Secure Booking Board Card */}
            <div className="bg-white border-2 border-[#1D493E] p-6 rounded-[28px] shadow-[4px_4px_0px_0px_#1D493E] space-y-5 text-left">
              <div>
                <span className="text-[11px] font-bold text-gray-400 block">Tour Package Price</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black font-sans text-[#1D493E]">₹{pkg.price.toLocaleString('en-IN')}</span>
                  <span className="text-xs text-gray-500 font-semibold">/ per person</span>
                  {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                    <>
                      <span className="text-xs text-gray-400 line-through font-semibold">₹{pkg.originalPrice.toLocaleString('en-IN')}</span>
                      <span className="bg-[#f0faf2] text-green-700 font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border border-green-200/50">
                        {discountPercent}% off
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Next Departures */}
              <div className="space-y-2 border-t border-gray-100 pt-4">
                <span className="text-xs font-bold text-gray-500 block">Next Departures</span>
                <div className="space-y-2">
                  {departures.map((dept: any) => {
                    const isSelected = bookingDate === dept.value;
                    return (
                      <button
                        key={dept.value}
                        type="button"
                        onClick={() => setBookingDate(dept.value)}
                        className={`w-full flex justify-between items-center text-xs font-semibold py-1 transition cursor-pointer ${
                          isSelected ? 'text-[#1D493E] font-extrabold' : 'text-gray-600 hover:text-[#1D493E]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-[#1D493E] bg-[#1D493E]/5' : 'border-gray-300'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#1D493E]" />}
                          </div>
                          <span>{dept.label}</span>
                        </div>
                        <span className="text-gray-400 font-mono text-[11px]">{dept.seats}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <form onSubmit={handleBook} className="pt-2 border-t border-gray-100 space-y-4">
                {/* Guests Selector */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-500">Number of Guests</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center font-bold hover:bg-gray-50 transition text-gray-600 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-mono font-bold text-[#1D493E]">{guests}</span>
                    <button
                      type="button"
                      onClick={() => setGuests(guests + 1)}
                      className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center font-bold hover:bg-gray-50 transition text-gray-600 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Estimate Cost & Submit */}
                <div className="space-y-3 pt-2 border-t border-gray-50">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-500">Estimated Total</span>
                    <span className="font-mono font-black text-lg text-[#E05434]">
                      ₹{(pkg.price * guests).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={bookedSuccess}
                    className="w-full bg-[#1D493E] hover:bg-[#16372f] text-white py-3.5 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    {bookedSuccess ? (
                      <>
                        <Check className="w-4 h-4" />
                        Added to Cart!
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4" />
                        Book this experience
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Save for later button */}
              <button
                type="button"
                className="w-full border border-gray-200 text-gray-700 py-3.5 rounded-xl font-bold text-sm hover:bg-gray-50 hover:border-gray-400 transition cursor-pointer text-center block"
              >
                Save for later
              </button>

              {/* Inclusions features badge lists */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100 text-center text-[9px] font-bold text-gray-400 uppercase font-mono">
                <div className="flex flex-col items-center gap-1.5">
                  <Lock className="w-4 h-4 text-gray-400" />
                  <span>Safe & Secure</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span>24/7 Support</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <Star className="w-4 h-4 text-gray-400" />
                  <span>{pkg.rating.toFixed(1)}/5 Rating</span>
                </div>
              </div>

              {/* Free Cancellation text */}
              <span className="text-[10px] text-gray-400 font-semibold block text-center pt-1">
                Free cancellation • 14 days before departure
              </span>
            </div>

            {/* Boutique Gear recommendations card in sidebar */}
            {recommendedProducts.length > 0 && (
              <div className="bg-white border border-[#1D493E]/10 p-5 rounded-[24px] shadow-sm text-left space-y-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-[#E05434] uppercase font-black tracking-widest block">
                    Boutique Gear
                  </span>
                  <h4 className="text-sm font-serif font-bold text-[#1D493E]">
                    {pkg.destination} Essentials
                  </h4>
                </div>

                <div className="space-y-3">
                  {recommendedProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="flex gap-3 items-center border-b border-gray-50 pb-3 last:border-b-0 last:pb-0"
                    >
                      <Link href={`/shop/product/${prod.id}`} className="w-14 h-14 rounded-xl overflow-hidden bg-[#FAF9F6] border border-[#1D493E]/5 shrink-0 block hover:opacity-90 transition-opacity">
                        <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-1">
                          <Link href={`/shop/product/${prod.id}`} className="truncate hover:text-[#E05434] transition-colors block">
                            <h5 className="text-[11px] font-extrabold text-[#1D493E] truncate">{prod.name}</h5>
                          </Link>
                          <span className="text-[8px] font-bold text-gray-500 shrink-0">
                            ★ {prod.rating.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs font-black text-[#E05434] font-serif">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleProductAdd(prod)}
                            className={`px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-wider transition ${
                              productAddedSuccess === prod.id
                                ? 'bg-[#1D493E] text-white border-[#1D493E]'
                                : 'bg-[#1D493E]/5 hover:bg-[#1D493E]/10 border-[#1D493E]/10 text-[#1D493E]'
                            }`}
                          >
                            {productAddedSuccess === prod.id ? 'Added' : 'Add'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Travel Advisory Card */}
            <div className="bg-[#FFF0EB] border border-[#E05434]/15 p-5 rounded-[24px] text-left space-y-3">
              <div className="flex items-center gap-2 text-[#E05434]">
                <Compass className="w-4 h-4 shrink-0" />
                <span className="text-[10px] font-mono font-black uppercase tracking-widest">
                  Advisory Note
                </span>
              </div>
              <h4 className="text-xs font-serif font-bold text-[#1D493E]">
                {isColdPlace ? 'Himalayan Acclimatization' : 'Tropical Travel Advice'}
              </h4>
              <p className="text-[11px] text-gray-600 font-semibold leading-relaxed">
                {isColdPlace
                  ? 'This route crosses high passes up to 13,478 ft. We recommend starting hydration 48 hours prior. All our support vehicles carry oxygen cylinders and first-aid kits.'
                  : 'Prepare for warm tropical weather. Stay hydrated, carry sun protection, insect repellent, and lightweight breathable clothing. Safety kits are available with our drivers.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended gear products bottom row */}
      {recommendedProducts.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 mt-16 pt-16 border-t border-[#1D493E]/10 text-left space-y-8">
          <div className="text-center space-y-3">
            <span className="inline-block bg-[#1D493E]/5 text-[#1D493E] border border-[#1D493E]/15 font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-widest">
              Boutique Gear Recommendations
            </span>
            <h2 className="text-3xl font-light font-serif text-[#1D493E] tracking-wide text-center">
              Prepare For Your Journey
            </h2>
            <p className="text-xs text-[#1D493E]/75 max-w-sm mx-auto leading-relaxed text-center">
              Shop recommended travel gear and clothing items handpicked for your destination.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {recommendedProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white border border-[#1D493E]/10 rounded-2xl p-5 hover:border-[#1D493E]/20 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div className="space-y-4">
                  <Link href={`/shop/product/${prod.id}`} className="relative h-56 w-full rounded-xl overflow-hidden border border-[#1D493E]/5 bg-[#FAF9F6] block hover:opacity-95 transition-opacity">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                  </Link>
                  <div>
                    <Link href={`/shop/product/${prod.id}`} className="hover:text-[#E05434] transition-colors block">
                      <h4 className="text-xs font-black uppercase text-[#1D493E] tracking-wider truncate">
                        {prod.name}
                      </h4>
                    </Link>
                    <p className="text-[10px] text-gray-500 font-semibold leading-relaxed mt-1">
                      {prod.description}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm font-black text-[#1D493E]">₹{prod.price.toLocaleString('en-IN')}</span>
                  <button
                    onClick={() => handleProductAdd(prod)}
                    className="px-4 py-2 bg-[#1D493E] text-white text-[9.5px] font-black uppercase tracking-widest rounded-xl hover:bg-[#E05434] transition shadow-xs cursor-pointer"
                  >
                    {productAddedSuccess === prod.id ? 'Added!' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 11. FAQ ACCORDION SECTION (Matching Home/Shop page design) */}
      <section className="w-full md:w-[1440px] bg-white rounded-[4px] py-16 md:px-[80px] px-6 flex flex-col gap-[32px] mx-auto border-t border-gray-100 relative z-10">
        {/* Header (Width: 1280px, Height: 90px, Gap: 12px) */}
        <div className="w-full md:w-[1280px] md:h-[90px] flex flex-col gap-[12px] justify-center text-left mx-auto">
          <div className="w-[54px] h-[26px] flex items-center justify-center bg-[#FFEBE5] rounded-[4px]">
            <span className="w-[46px] h-[18px] flex items-center justify-center font-sans font-semibold text-[14px] leading-none tracking-[1.2px] text-[#FF623E] uppercase font-mono">
              FAQ'S
            </span>
          </div>
          <h2 className="w-full md:w-[541px] md:h-[52px] flex items-center font-serif font-semibold text-[42px] leading-[1] tracking-[0px] text-[#2B2B2B]">
            Frequently asked questions
          </h2>
        </div>

        {/* Accordion List */}
        <div className="w-full md:w-[1280px] border-t border-slate-200 divide-y divide-slate-200 mx-auto">
          {faqs.map((faq: any, idx: number) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div key={idx} className="py-5 text-left border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full flex justify-between items-center text-left gap-4 cursor-pointer group"
                >
                  <span className="w-full md:w-[1196px] h-[32px] flex items-center font-sans font-medium text-[20px] leading-[32px] tracking-[0px] text-[#2B2B2B]">
                    {faq.q}
                  </span>
                  <span className="text-xl font-medium text-[#1D493E] shrink-0 leading-none select-none">
                    {isOpen ? '—' : '+'}
                  </span>
                </button>
                {/* Expandable answer */}
                {isOpen && (
                  <p className="mt-3 w-full md:w-[1196px] font-sans font-medium text-[20px] leading-[32px] tracking-[0px] text-[#8D8D8D] animate-fade-in">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Newsletter / Booking CTA Banner (Matching Home page section design) */}
      <section
        style={{
          width: "100%",
          paddingTop: "42px",
          paddingBottom: "42px",
          paddingLeft: "80px",
          paddingRight: "80px",
          background: "#FFFFFF",
          borderTop: "1px solid rgba(29, 73, 62, 0.1)",
        }}
        className="relative z-10"
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
                fontSize: "42px",
                lineHeight: "100%",
                letterSpacing: "0px",
                textAlign: "center",
                color: "#2B2B2B",
                maxWidth: "1280px",
                margin: 0,
              }}
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
                fontSize: "24px",
                lineHeight: "32px",
                letterSpacing: "0px",
                textAlign: "center",
                color: "rgba(43, 43, 43, 1)",
                maxWidth: "1280px",
                margin: 0,
              }}
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
              width: "286px",
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
            className="hover:opacity-90 inline-flex items-center gap-2"
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
