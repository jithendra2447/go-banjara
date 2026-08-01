'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Calendar, Users, Check, ShoppingBag, Clock,
  Star, Compass, MapPin, Tag,
  Sun, Wind, ArrowLeft, Lock, ArrowUpRight,
  ChevronDown, Edit3, Upload, Save
} from 'lucide-react';
import { useCart } from '@/components/providers';
import { AmbientVibe } from '@/components/AmbientVibe';
import { PRODUCTS } from '@/data/products';
import { HOLIDAY_PACKAGES } from '@/data/packages';
import { CartIcon } from '@/components/CartIcon';
import { PackageEditorModal } from '@/components/PackageEditorModal';
import { getFutureDeliveryString } from '@/utils/dateUtils';
import ProductCard from '@/components/ProductCard';
import { InteractiveProgressBar } from '@/components/InteractiveProgressBar';

interface PackageDetailsProps {
  customId?: string;
}

export default function PackageDetails({ customId }: PackageDetailsProps) {
  const params = useParams() as { id?: string };
  const router = useRouter();
  const { addToCart, toggleWishlist, wishlist } = useCart();

  const id = customId || params?.id || 'pkg-kashmir-classic';

  const [pkg, setPkg] = useState<any>(null);
  const [productsList, setProductsList] = useState<any[]>(PRODUCTS);
  const [bookingDate, setBookingDate] = useState('');
  const [guests, setGuests] = useState(2);
  const [bookedSuccess, setBookedSuccess] = useState(false);
  const [productAddedSuccess, setProductAddedSuccess] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'reviews'>('overview');
  const [expandedDayIdx, setExpandedDayIdx] = useState<number | null>(0);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
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
  const [isSubmittingEnquiry, setIsSubmittingEnquiry] = useState(false);
  const [addedProductIds, setAddedProductIds] = useState<string[]>([]);
  const [activeJourneySlide, setActiveJourneySlide] = useState(0);

  const saved = wishlist.some((i) => i.id === pkg?.id);

  const handleSaveForLater = () => {
    if (!pkg) return;
    toggleWishlist({
      id: pkg.id,
      name: pkg.name,
      price: pkg.price || 15000,
      image: pkg.image || (pkg.images && pkg.images[0]) || '/hero-image.jpg',
      type: 'travel',
      category: 'Travel Package',
      destination: pkg.destination || 'India',
      duration: pkg.duration || '5 Days',
    });
  };

  const [isEditingPkg, setIsEditingPkg] = useState(false);
  const [editingPkgData, setEditingPkgData] = useState<any>(null);

  const handleSaveEditedPackageOnDetails = (updatedPkgData: any) => {
    if (!updatedPkgData) return;

    let currentList: any[] = [];
    const saved = localStorage.getItem('gb_admin_packages');
    if (saved) {
      try {
        currentList = JSON.parse(saved);
      } catch (err) {}
    }
    if (!Array.isArray(currentList) || currentList.length === 0) {
      currentList = [...HOLIDAY_PACKAGES];
    }

    const idx = currentList.findIndex((p: any) => p.id === updatedPkgData.id);
    if (idx !== -1) {
      currentList[idx] = updatedPkgData;
    } else {
      currentList = [updatedPkgData, ...currentList];
    }

    localStorage.setItem('gb_admin_packages', JSON.stringify(currentList));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('gb_packages_updated', { detail: currentList }));
    }
    setPkg(updatedPkgData);
    setIsEditingPkg(false);
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

      // Check admin list first, then fallback to static list
      const matchedPkg = list.find((p: any) => 
        p.id === id || 
        p.id?.toLowerCase() === id?.toLowerCase() ||
        p.name?.toLowerCase().replace(/\s+/g, '-') === id?.toLowerCase()
      ) || HOLIDAY_PACKAGES.find((p: any) => 
        p.id === id || 
        p.id?.toLowerCase() === id?.toLowerCase() ||
        p.name?.toLowerCase().replace(/\s+/g, '-') === id?.toLowerCase()
      ) || null;
      
      let foundPkg = matchedPkg;

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

    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem('gb_admin_packages');
        if (!saved) return;
        const list = JSON.parse(saved);
        if (!Array.isArray(list)) return;
        const updatedPkg = list.find((p: any) => 
          p.id === id || 
          p.id?.toLowerCase() === id?.toLowerCase() ||
          p.name?.toLowerCase().replace(/\s+/g, '-') === id?.toLowerCase()
        );
        if (updatedPkg) {
          setPkg(updatedPkg);
        }
      } catch (e) {
        console.error('Error handling live package update:', e);
      }
    };

    window.addEventListener('gb_packages_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('gb_packages_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
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

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const packageName = pkg?.name || 'Travel Expedition';
    const enquiryData = {
      packageName,
      date: bookingDate || 'Flexible',
      name: enquiryName,
      phone: `${phonePrefix} ${enquiryPhone}`,
      guests: enquiryGuests,
      pickup: pickupLocation,
      message: enquiryMessage,
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage (local backup)
    try {
      const existing = JSON.parse(localStorage.getItem('gb_booking_enquiries') || '[]');
      existing.push(enquiryData);
      localStorage.setItem('gb_booking_enquiries', JSON.stringify(existing));
    } catch (e) {
      console.warn('LocalStorage save notice:', e);
    }

    // Save to Database + Admin via /api/contact
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: enquiryName || 'Traveler',
          email: `booking@gobanjara.com`,
          mobile: `${phonePrefix} ${enquiryPhone}`,
          message: `[TRAVEL BOOKING - ${packageName}] Pickup: ${pickupLocation || 'N/A'}, Guests: ${enquiryGuests || '01'}, Date: ${bookingDate || 'Flexible'}. Message: ${enquiryMessage || 'None'}`,
        }),
      });
    } catch (err) {
      console.warn('Enquiry save notice:', err);
    }

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

  const recommendedGear = [
    {
      id: 'naturally-nomad-badge-1',
      name: 'Naturally Nomad',
      category: 'Badges',
      originalPrice: 199,
      price: 139,
      rating: 5,
      reviewsCount: 120,
      boughtCount: '200+ bought in past month',
      image: '/naturally_nomad_badge.png',
    },
    {
      id: 'blue-mavin-slides-1',
      name: 'Blue Mavin',
      category: 'Slippers',
      originalPrice: 599,
      price: 399,
      rating: 5,
      reviewsCount: 1000,
      boughtCount: '500+ bought in past month',
      image: '/blue_mavin_slides.jpg',
    },
    {
      id: 'explore-more-keychain-1',
      name: 'Explore more',
      category: 'Key Chains',
      originalPrice: 193,
      price: 149,
      rating: 5,
      reviewsCount: 200,
      boughtCount: '100+ bought in past month',
      image: '/explore_more_keychain.png',
    },
    {
      id: 'blue-mavin-slides-2',
      name: 'Blue Mavin',
      category: 'Slippers',
      originalPrice: 599,
      price: 399,
      rating: 5,
      reviewsCount: 1000,
      boughtCount: '500+ bought in past month',
      image: '/banjara_blue_slides.png',
    },
  ];

  const handleAddRecommendedToCart = (prod: any) => {
    addToCart({
      id: prod.id,
      name: prod.title,
      price: prod.price,
      image: prod.image,
      category: prod.category,
      rating: prod.rating,
    }, 'shop', undefined, 1);

    setAddedProductIds((prev) => [...prev, prod.id]);
    setTimeout(() => {
      setAddedProductIds((prev) => prev.filter((id) => id !== prod.id));
    }, 2500);
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
  const rawImages = Array.isArray(pkg.images) && pkg.images.length > 0 ? pkg.images : [pkg.image || '/travel-leh-6.jpg'];
  const galleryImages = rawImages.length >= 6 
    ? rawImages.slice(0, 6) 
    : [...rawImages, ...Array(6 - rawImages.length).fill(rawImages[0] || pkg.image || '/travel-leh-6.jpg')];
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

  const defaultFaqs = isColdPlace 
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
        },
        {
          q: 'What is the cancellation and refund policy?',
          a: 'We offer flexible cancellation policies with 100% refund or trip transfer up to 14 days before your scheduled departure.'
        },
        {
          q: 'Is medical emergency support provided on the trip?',
          a: 'Yes, all our expedition leads are certified in Wilderness First Aid and carry full emergency medical kits and first-aid support.'
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
        },
        {
          q: 'What is the cancellation and refund policy?',
          a: 'We offer flexible cancellation policies with 100% refund or trip transfer up to 14 days before your scheduled departure.'
        },
        {
          q: 'Is medical emergency support provided on the trip?',
          a: 'Yes, all our guides are certified in Wilderness First Aid and carry full emergency medical kits and first-aid support.'
        }
      ];

  const supplementaryFaqs = [
    {
      q: 'What is the cancellation and refund policy?',
      a: 'We offer flexible cancellation policies with 100% refund or trip transfer up to 14 days before your scheduled departure date.'
    },
    {
      q: 'What is the standard group size for this tour?',
      a: 'We focus on highly curated, small-group experiences. Typical group size is between 6 to 12 travelers per batch to ensure care.'
    },
    {
      q: 'Is medical emergency support provided on the trip?',
      a: 'Yes, all our guides are certified in Wilderness First Aid, and our support team carries full medical emergency kits and first-aid support.'
    }
  ];

  let initialFaqs = (pkg.faqs && pkg.faqs.length > 0) ? pkg.faqs : defaultFaqs;
  if (initialFaqs.length < 4) {
    const existingQ = new Set(initialFaqs.map((f: any) => f.q.toLowerCase()));
    for (const sup of supplementaryFaqs) {
      if (!existingQ.has(sup.q.toLowerCase())) {
        initialFaqs = [...initialFaqs, sup];
        existingQ.add(sup.q.toLowerCase());
      }
      if (initialFaqs.length >= 5) break;
    }
  }
  const faqs = initialFaqs;

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
      }}
      className="text-[#1D493E] min-h-screen font-sans relative overflow-x-clip w-full pb-0"
    >
      {/* Dynamic ambient particles removed for solid white background */}

      {/* Ambient particle glow removed */}

      {/* Main Container */}
      <div 
        style={{
          width: "100%",
          maxWidth: "1440px",
          backgroundColor: "rgba(255, 255, 255, 1)",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          paddingTop: "32px",
          paddingBottom: "0px",
        }}
        className="relative z-10 mx-auto w-full px-4 md:px-[80px] pt-6 md:pt-8 pb-0 gap-4 sm:gap-6"
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
                className="relative overflow-hidden bg-slate-900 group cursor-pointer w-full h-full aspect-[3/2] md:aspect-auto rounded-[4px]"
                onClick={() => setActivePhotoIdx(idx)}
              >
                <img
                  src={img}
                  alt={`${pkg.name} gallery image ${idx + 1}`}
                  loading="lazy"
                  style={{ borderRadius: "4px" }}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 opacity-90 rounded-[4px]"
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
          className="w-full grid grid-cols-1 lg:grid-cols-[1fr_411px] gap-6 lg:gap-[32px] items-start"
        >
          
          {/* LEFT COLUMN: Travel package details */}
          <div className="text-left space-y-4 w-full">
            
            {/* Main Details content container with compact gap */}
            <div 
              style={{
                width: "100%",
                maxWidth: "837px",
                display: "flex",
                flexDirection: "column",
              }}
              className="text-left gap-3.5 sm:gap-4"
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
                <div className="flex items-center gap-3 flex-wrap">
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
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPkgData({ ...pkg });
                      setIsEditingPkg(true);
                    }}
                    className="px-3 py-1.5 bg-[#1D493E]/10 hover:bg-[#1D493E] text-[#1D493E] hover:text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
                    title="Edit Package Details"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Package</span>
                  </button>
                </div>
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
                className="text-left grid grid-cols-2 gap-2 sm:gap-4"
              >
                {/* Fact 1 */}
                <div 
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxSizing: "border-box",
                  }}
                  className="w-full py-1 h-auto min-h-[38px] sm:h-[46px]"
                >
                  <div 
                    style={{ 
                      backgroundColor: "rgba(246, 243, 238, 1)",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                    className="w-8 h-8 sm:w-[46px] sm:h-[46px]"
                  >
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#2B2B2B]" />
                  </div>
                  <span 
                    style={{
                      fontFamily: "'Faktum', 'Outfit', sans-serif",
                      fontWeight: 500,
                      color: "rgba(43, 43, 43, 1)",
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                    className="flex-1 text-xs sm:text-base md:text-[20px] leading-tight truncate"
                  >
                    {pkg.startPoint || 'Srinagar'}, {pkg.destination || 'Kashmir'}
                  </span>
                </div>

                {/* Fact 2 */}
                <div 
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxSizing: "border-box",
                  }}
                  className="w-full py-1 h-auto min-h-[38px] sm:h-[46px]"
                >
                  <div 
                    style={{ 
                      backgroundColor: "rgba(246, 243, 238, 1)",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                    className="w-8 h-8 sm:w-[46px] sm:h-[46px]"
                  >
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#2B2B2B]" />
                  </div>
                  <span 
                    style={{
                      fontFamily: "'Faktum', 'Outfit', sans-serif",
                      fontWeight: 500,
                      color: "rgba(43, 43, 43, 1)",
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                    className="flex-1 text-xs sm:text-base md:text-[20px] leading-tight truncate"
                  >
                    {pkg.groupType || 'Curated group Trip'}
                  </span>
                </div>

                {/* Fact 3 */}
                <div 
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxSizing: "border-box",
                  }}
                  className="w-full py-1 h-auto min-h-[38px] sm:h-[46px]"
                >
                  <div 
                    style={{ 
                      backgroundColor: "rgba(246, 243, 238, 1)",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                    className="w-8 h-8 sm:w-[46px] sm:h-[46px]"
                  >
                    <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-[#2B2B2B]" />
                  </div>
                  <span 
                    style={{
                      fontFamily: "'Faktum', 'Outfit', sans-serif",
                      fontWeight: 500,
                      color: "rgba(43, 43, 43, 1)",
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                    className="flex-1 text-xs sm:text-base md:text-[20px] leading-tight truncate"
                  >
                    {pkg.difficulty || 'Moderate'} Difficulty
                  </span>
                </div>

                {/* Fact 4 */}
                <div 
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxSizing: "border-box",
                  }}
                  className="w-full py-1 h-auto min-h-[38px] sm:h-[46px]"
                >
                  <div 
                    style={{ 
                      backgroundColor: "rgba(246, 243, 238, 1)",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                    className="w-8 h-8 sm:w-[46px] sm:h-[46px]"
                  >
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#2B2B2B]" />
                  </div>
                  <span 
                    style={{
                      fontFamily: "'Faktum', 'Outfit', sans-serif",
                      fontWeight: 500,
                      color: "rgba(43, 43, 43, 1)",
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                    className="flex-1 text-xs sm:text-base md:text-[20px] leading-tight truncate"
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
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
                className="text-left gap-2.5 sm:gap-3.5 h-auto py-1 mt-1 sm:mt-2"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex text-[#E05434] gap-0.5 sm:gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#E05434] stroke-none ${
                          i < Math.floor(pkg.rating) ? 'fill-[#E05434]' : 'fill-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span 
                    style={{
                      fontFamily: "'Faktum', 'Outfit', sans-serif",
                      fontWeight: 500,
                      color: "rgba(43, 43, 43, 1)",
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                    className="leading-normal text-xs sm:text-base md:text-[20px]"
                  >
                    ({pkg.ratingCount || 312} reviews)
                  </span>
                </div>
                 <span 
                  style={{
                    width: "100%",
                    maxWidth: "837px",
                    fontFamily: "'Faktum', 'Outfit', sans-serif",
                    fontWeight: 500,
                    color: "rgba(141, 141, 141, 1)",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                  className="leading-normal text-xs sm:text-base md:text-[20px]"
                >
                  200+ bought in past month
                </span>
              </div>
            </div>

            {/* Navigation Tabs Container */}
            <div 
              style={{
                width: "100%",
                maxWidth: "837px",
                position: "relative",
              }}
              className="text-left w-full"
            >
              {/* Full-width Gray Base Line */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#CCCCCC]/60 z-0" />

              {/* Buttons flex row */}
              <div className="flex items-center w-full overflow-x-auto whitespace-nowrap scrollbar-none gap-6 md:gap-[40px] relative z-10">
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
                        boxSizing: "border-box",
                        background: "transparent",
                        border: "none",
                        padding: "8px 0",
                        cursor: "pointer",
                        position: "relative",
                      }}
                      className="transition-all capitalize whitespace-nowrap"
                    >
                      <span
                        style={{
                          fontFamily: "'Faktum', 'Outfit', sans-serif",
                          fontWeight: 500,
                          color: isSelected ? "rgba(28, 68, 140, 1)" : "rgba(43, 43, 43, 1)",
                          display: "inline-flex",
                          alignItems: "center",
                          transition: "color 0.2s ease",
                        }}
                        className="text-xs sm:text-lg md:text-[24px]"
                      >
                        {label}
                      </span>
                      {isSelected && (
                        <span
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: "3px",
                            backgroundColor: "rgba(28, 68, 140, 1)",
                            zIndex: 20,
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
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

                {/* Highlights Section */}
                <div
                  style={{
                    width: "100%",
                    maxWidth: "837px",
                    background: "rgba(255, 255, 255, 1)",
                    boxSizing: "border-box",
                  }}
                  className="text-left justify-center w-full max-w-[837px] h-auto bg-white flex flex-col gap-6"
                >
                  <div className="flex flex-col gap-[12px]">
                    <span className="inline-block w-fit self-start text-[12px] font-bold uppercase tracking-[0.12em] text-[#FF5B37] bg-[#FFEBE5] px-3 py-1.5 rounded-sm">
                      DISCOVER YOUR PATH
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

                  {/* What's Included */}
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "837px",
                      background: "rgba(255, 255, 255, 1)",
                      display: "flex",
                      flexDirection: "column",
                    }}
                    className="text-left w-full gap-2 sm:gap-3"
                  >
                    <span 
                      style={{
                        backgroundColor: "rgba(0, 160, 35, 0.08)",
                        color: "rgba(0, 160, 35, 1)",
                        fontFamily: "Faktum, sans-serif",
                        fontWeight: 600,
                        lineHeight: "100%",
                        letterSpacing: "1.2px",
                        textTransform: "uppercase",
                        alignSelf: "flex-start",
                      }}
                      className="text-[11px] sm:text-xs px-2.5 py-1 rounded-[4px]"
                    >
                      DO'S
                    </span>
                    <h3 
                      style={{
                        fontFamily: "Fraunces, serif",
                        fontWeight: 600,
                        color: "rgba(43, 43, 43, 1)",
                      }}
                      className="leading-tight mb-1 font-sans text-xl sm:text-2xl md:text-[36px]"
                    >
                      What's Included
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 sm:space-y-1.5">
                      {richInclusions.map((inc: string, i: number) => (
                        <li 
                          key={i} 
                          style={{
                            fontFamily: "Faktum, sans-serif",
                            fontWeight: 500,
                            color: "rgba(43, 43, 43, 1)",
                          }}
                          className="leading-relaxed font-sans text-xs sm:text-sm md:text-[18px] md:leading-[28px]"
                        >
                          {inc}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Not Included */}
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "837px",
                      background: "rgba(255, 255, 255, 1)",
                      display: "flex",
                      flexDirection: "column",
                    }}
                    className="text-left w-full gap-2 sm:gap-3"
                  >
                    <span 
                      style={{
                        backgroundColor: "rgba(255, 98, 62, 0.08)",
                        color: "rgba(255, 98, 62, 1)",
                        fontFamily: "Faktum, sans-serif",
                        fontWeight: 600,
                        lineHeight: "100%",
                        letterSpacing: "1.2px",
                        textTransform: "uppercase",
                        alignSelf: "flex-start",
                      }}
                      className="text-[11px] sm:text-xs px-2.5 py-1 rounded-[4px]"
                    >
                      DON'TS
                    </span>
                    <h3 
                      style={{
                        fontFamily: "Fraunces, serif",
                        fontWeight: 600,
                        color: "rgba(43, 43, 43, 1)",
                      }}
                      className="leading-tight mb-1 font-sans text-xl sm:text-2xl md:text-[36px]"
                    >
                      Not Included
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 sm:space-y-1.5">
                      {exclusions.map((exc: string, i: number) => (
                        <li 
                          key={i} 
                          style={{
                            fontFamily: "Faktum, sans-serif",
                            fontWeight: 500,
                            color: "rgba(43, 43, 43, 1)",
                          }}
                          className="leading-relaxed font-sans text-xs sm:text-sm md:text-[18px] md:leading-[28px]"
                        >
                          {exc}
                        </li>
                      ))}
                    </ul>
                  </div>

                   {/* Packing List */}
                   <div 
                     style={{
                       width: "100%",
                       maxWidth: "837px",
                       background: "rgba(255, 255, 255, 1)",
                       display: "flex",
                       flexDirection: "column",
                     }}
                     className="text-left w-full gap-2 sm:gap-3"
                   >
                     <h3 
                       style={{
                         fontFamily: "Fraunces, serif",
                         fontWeight: 600,
                       }}
                       className="leading-tight mb-1 font-sans text-xl sm:text-2xl md:text-[36px]"
                     >
                       <span style={{ color: "rgba(255, 98, 62, 1)" }}>Packing</span>{" "}
                       <span style={{ color: "rgba(43, 43, 43, 1)" }}>List</span>
                     </h3>
                     <ul className="list-disc pl-5 space-y-1 sm:space-y-1.5">
                       {packingList.map((pk: string, i: number) => (
                         <li 
                           key={i} 
                           style={{
                             fontFamily: "Faktum, sans-serif",
                             fontWeight: 500,
                             color: "rgba(43, 43, 43, 1)",
                           }}
                           className="leading-relaxed font-sans text-xs sm:text-sm md:text-[18px] md:leading-[28px]"
                         >
                           {pk}
                         </li>
                       ))}
                     </ul>
                   </div>

                  {/* Know your Guide */}
                  <div 
                    style={{
                      width: "100%",
                      maxWidth: "837px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                    className="text-left w-full gap-2 sm:gap-3"
                  >
                    <h3 
                      style={{
                        fontFamily: "Fraunces, serif",
                        fontWeight: 600,
                      }}
                      className="leading-tight mb-1 font-sans text-xl sm:text-2xl md:text-[36px]"
                    >
                      <span style={{ color: "rgba(43, 43, 43, 1)" }}>Know your</span>{" "}
                      <span style={{ color: "rgba(255, 98, 62, 1)" }}>Guide</span>
                    </h3>
                    
                    {/* Badge & Rating Row */}
                    <div className="flex flex-wrap justify-between items-center gap-3 mt-1">
                      <span 
                        style={{
                          backgroundColor: "rgba(255, 240, 235, 1)",
                          color: "rgba(255, 98, 62, 1)",
                          fontFamily: "Faktum, sans-serif",
                          fontWeight: 600,
                          lineHeight: "100%",
                          letterSpacing: "1.2px",
                          textTransform: "uppercase",
                        }}
                        className="text-[11px] sm:text-xs px-2.5 py-1 rounded-[4px]"
                      >
                        Your Lead Guide
                      </span>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className="flex text-[#FF623E] gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#FF623E] stroke-none" />
                          ))}
                        </div>
                        <span 
                          style={{
                            fontFamily: "Faktum, sans-serif",
                            fontWeight: 500,
                            color: "rgba(43, 43, 43, 1)",
                          }}
                          className="text-xs sm:text-sm md:text-[16px]"
                        >
                          {guide.rating.toFixed(2)} ({guide.trips} Trips)
                        </span>
                      </div>
                    </div>

                    {/* Guide details panel */}
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-2 items-start w-full">
                      <div 
                        style={{
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                        className="w-[120px] h-[120px] sm:w-[180px] sm:h-[180px] shrink-0 bg-slate-100 mx-auto sm:mx-0"
                      >
                        <img
                          src={guide.image}
                          alt={`${guide.name} Guide`}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-2 w-full">
                        <h4 
                          style={{
                            fontFamily: "Faktum, sans-serif",
                            fontWeight: 600,
                            lineHeight: "120%",
                            color: "rgba(43, 43, 43, 1)",
                          }}
                          className="text-center sm:text-left text-lg sm:text-2xl md:text-[28px]"
                        >
                          {guide.name}
                        </h4>
                        <p 
                          style={{
                            fontFamily: "Faktum, sans-serif",
                            fontWeight: 500,
                            color: "rgba(43, 43, 43, 1)",
                          }}
                          className="text-xs sm:text-sm md:text-[18px] md:leading-[28px] text-center sm:text-left"
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
                      borderTop: "1px solid rgba(204, 204, 204, 0.8)",
                      opacity: 1,
                    }}
                    className="block my-4 sm:my-6"
                  />

                  {/* Commonly asked questions Section */}
                  <div 
                    style={{
                      width: "100%",
                      maxWidth: "837px",
                      display: "flex",
                      flexDirection: "column",
                      opacity: 1,
                      borderRadius: "4px",
                    }}
                    className="flex text-left w-full mt-2 sm:mt-4 gap-4 sm:gap-8"
                  >
                    <div className="flex flex-col gap-2 sm:gap-3">
                      <span 
                        style={{
                          backgroundColor: "rgba(255, 240, 235, 1)",
                          color: "rgba(255, 98, 62, 1)",
                          fontFamily: "Faktum, sans-serif",
                          fontWeight: 600,
                          fontSize: "12px",
                          lineHeight: "100%",
                          letterSpacing: "1.2px",
                          textTransform: "uppercase",
                          padding: "4px 10px",
                          borderRadius: "4px",
                          alignSelf: "flex-start",
                        }}
                      >
                        CAQ'S
                      </span>
                      <h3 
                        style={{
                          fontFamily: "Fraunces, serif",
                          fontWeight: 600,
                        }}
                        className="leading-tight text-xl sm:text-3xl md:text-[42px]"
                      >
                        <span style={{ color: "rgba(43, 43, 43, 1)" }}>Commonly asked</span>{" "}
                        <span style={{ color: "rgba(255, 98, 62, 1)" }}>questions</span>
                      </h3>
                    </div>

                    {/* Accordion container */}
                    <div className="flex flex-col border-t border-gray-200/80 w-full">
                      {faqs.map((faq: any, idx: number) => {
                        const isOpen = openFaqIdx === idx;
                        return (
                          <div key={idx} className="border-b border-gray-200/80 py-3 sm:py-4.5 w-full">
                            <button
                              type="button"
                              onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                              className="w-full flex justify-between items-center text-left py-1.5 sm:py-2 hover:opacity-90 transition cursor-pointer gap-2"
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
                              <span className="text-[#2B2B2B] text-xl sm:text-2xl font-light pl-2 select-none shrink-0">
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
                                className="mt-1.5 sm:mt-2 text-xs sm:text-sm md:text-[18px] md:leading-[28px]"
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
                  className="shadow-xs w-full h-auto p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 text-left"
                >
                  {/* Left Column: Score */}
                  <div 
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                    className="w-full sm:w-[145.69px] items-center sm:items-start pl-0 sm:pl-6 gap-2 sm:gap-4"
                  >
                    <span 
                      style={{
                        fontFamily: "Faktum, sans-serif",
                        fontWeight: 500,
                        color: "rgba(43, 43, 43, 1)",
                        display: "flex",
                        alignItems: "center",
                      }}
                      className="text-3xl sm:text-[42px] leading-none"
                    >
                      {pkg.rating.toFixed(1)}
                    </span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 sm:w-[20px] sm:h-[20px] fill-[#FFC72C] stroke-none" />
                      ))}
                    </div>
                    <span 
                      style={{
                        fontFamily: "Faktum, sans-serif",
                        fontWeight: 500,
                        color: "rgba(141, 141, 141, 1)",
                        display: "flex",
                        alignItems: "center",
                      }}
                      className="text-xs sm:text-base md:text-[20px] leading-none"
                    >
                      {pkg.ratingCount || 98} Reviews
                    </span>
                  </div>

                  {/* Right Column: Bars */}
                  <div 
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                    className="flex-1 w-full pr-0 sm:pr-6 gap-2 sm:gap-4"
                  >
                    {[
                      { label: '05', width: '92%' },
                      { label: '04', width: '68%' },
                      { label: '03', width: '55%' },
                      { label: '02', width: '30%' },
                      { label: '01', width: '12%' },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center gap-2 sm:gap-4 w-full">
                        <span 
                          style={{
                            fontFamily: "Faktum, sans-serif",
                            fontWeight: 500,
                            color: "rgba(43, 43, 43, 0.7)",
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                          className="w-5 sm:w-6 text-xs sm:text-[20px] leading-none"
                        >
                          {row.label}
                        </span>
                        <div className="flex-1 h-3 sm:h-[19px] bg-gray-100 rounded-[4px] overflow-hidden">
                          <div style={{ height: "100%", width: row.width, backgroundColor: "rgba(255, 98, 62, 1)", borderRadius: "4px" }} />
                        </div>
                        <Star className="w-3.5 h-3.5 sm:w-[20px] sm:h-[20px] fill-[#FFC72C] stroke-none shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews card list */}
                <div style={{ display: "flex", flexDirection: "column" }} className="w-full gap-3 sm:gap-6">
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
                      }}
                      className="w-full p-4 sm:p-[24px] gap-3 sm:gap-6"
                    >
                      <div className="flex justify-between items-start w-full gap-2">
                        <div className="flex items-center gap-2.5 sm:gap-4 flex-1 min-w-0">
                          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-[4px] overflow-hidden shrink-0">
                            <img src={rev.avatar} alt={rev.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 
                                style={{ margin: 0, fontFamily: "Faktum, sans-serif" }} 
                                className="text-sm sm:text-xl md:text-[24px] font-semibold text-[#2B2B2B] leading-tight truncate"
                              >
                                {rev.name}
                              </h4>
                              <span 
                                style={{
                                  fontFamily: "Faktum, sans-serif",
                                  fontWeight: 600,
                                  letterSpacing: "0.5px",
                                  textTransform: "uppercase",
                                  color: "rgba(46, 125, 50, 1)",
                                  backgroundColor: "rgba(46, 125, 50, 0.08)",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  borderRadius: "2px",
                                }}
                                className="text-[9px] sm:text-xs px-1.5 py-0.5"
                              >
                                Verified
                              </span>
                            </div>
                            <span 
                              style={{ fontFamily: "Faktum, sans-serif" }}
                              className="text-xs sm:text-base text-gray-400 italic font-medium"
                            >
                              {rev.date}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-0.5 sm:gap-1 shrink-0">
                          {[...Array(Math.floor(Number(rev.rating)) || 5)].map((_, j) => (
                            <Star key={j} className="w-3.5 h-3.5 sm:w-[20px] sm:h-[20px] fill-[#FFC72C] stroke-none" />
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
                        className="w-full text-xs sm:text-base md:text-[20px] leading-relaxed"
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
                justifyContent: "flex-start",
              }}
              className="text-left w-full p-4 sm:p-5 gap-3.5 sm:gap-4"
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  boxSizing: "border-box",
                }}
                className="w-full h-auto"
              >
                <span 
                  style={{
                    fontFamily: "Faktum, sans-serif",
                    fontWeight: 500,
                    color: "rgba(141, 141, 141, 1)",
                  }}
                  className="w-full inline-block text-xs sm:text-sm"
                >
                  Tour Package Price
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <span 
                    style={{
                      fontFamily: "Faktum, sans-serif",
                      fontWeight: 700,
                      color: "rgba(43, 43, 43, 1)",
                    }}
                    className="inline-block text-2xl sm:text-3xl"
                  >
                    ₹{pkg.price.toLocaleString('en-IN')}
                  </span>
                  <span
                    style={{
                      fontFamily: "Faktum, sans-serif",
                      fontWeight: 500,
                      color: "rgba(141, 141, 141, 1)",
                    }}
                    className="inline-block text-xs sm:text-sm"
                  >
                    / per person
                  </span>
                  {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                    <>
                      <span
                        style={{
                          fontFamily: "Faktum, sans-serif",
                          fontWeight: 500,
                          color: "rgba(141, 141, 141, 1)",
                          textDecoration: "line-through",
                        }}
                        className="inline-block text-xs sm:text-sm"
                      >
                        ₹{pkg.originalPrice.toLocaleString('en-IN')}
                      </span>
                      <span 
                        style={{
                          backgroundColor: "rgba(0, 160, 35, 0.08)",
                          color: "rgba(0, 160, 35, 1)",
                          fontFamily: "Faktum, sans-serif",
                          fontWeight: 600,
                          borderRadius: "4px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          whiteSpace: "nowrap",
                        }}
                        className="text-xs px-2 py-0.5"
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
                  gap: "6px",
                  boxSizing: "border-box",
                }}
                className="w-full h-auto"
              >
                <span 
                  style={{
                    fontFamily: "Faktum, sans-serif",
                    fontWeight: 500,
                    color: "rgba(141, 141, 141, 1)",
                  }}
                  className="w-full inline-block text-xs sm:text-sm"
                >
                  Next Departures
                </span>
                <div 
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
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
                        className="w-full flex justify-between items-center transition cursor-pointer hover:bg-slate-50 p-1 rounded-sm"
                        style={{
                          border: "none",
                          background: isSelected ? "rgba(246, 243, 238, 0.6)" : "transparent",
                        }}
                      >
                        <span 
                          style={{
                            fontFamily: "Faktum, sans-serif",
                            fontWeight: isSelected ? 600 : 500,
                            color: "rgba(43, 43, 43, 1)",
                            textAlign: "left",
                          }}
                          className="inline-block text-sm sm:text-base"
                        >
                          {dept.label}
                        </span>
                        <span 
                          style={{
                            fontFamily: "Faktum, sans-serif",
                            fontWeight: isSelected ? 600 : 500,
                            color: "rgba(43, 43, 43, 1)",
                            textAlign: "right",
                          }}
                          className="inline-block text-sm sm:text-base font-semibold"
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
                      borderRadius: "4px",
                      border: "none",
                      color: "#FFFFFF",
                      boxSizing: "border-box",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    className="w-full h-[46px] sm:h-[50px] px-4 hover:opacity-95 transition-opacity cursor-pointer flex items-center justify-center gap-2"
                  >
                    {bookedSuccess ? (
                      <span
                        style={{
                          fontFamily: "Faktum, sans-serif",
                          fontWeight: 600,
                        }}
                        className="text-sm sm:text-base"
                      >
                        Added to Cart!
                      </span>
                    ) : (
                      <>
                        <Calendar className="w-5 h-5 shrink-0" />
                        <span
                          style={{
                            fontFamily: "Faktum, sans-serif",
                            fontWeight: 600,
                            color: "rgba(255, 255, 255, 1)",
                          }}
                          className="inline-block text-sm sm:text-base"
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
                    borderRadius: "4px",
                    border: "2px solid rgba(29, 73, 62, 1)",
                    boxSizing: "border-box",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  className="w-full h-[42px] sm:h-[46px] px-4 hover:bg-[#1D493E]/5 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span
                    style={{
                      fontFamily: "Faktum, sans-serif",
                      fontWeight: 600,
                      color: "rgba(29, 73, 62, 1)",
                    }}
                    className="inline-block text-center text-sm sm:text-base"
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
                }}
                className="w-full flex justify-between items-center gap-1 mt-1 pt-2 border-t border-gray-100"
              >
                <div className="flex flex-col items-center gap-1 flex-1">
                  <div 
                    style={{ 
                      borderRadius: "4px", 
                      backgroundColor: "rgba(246, 243, 238, 1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    className="w-9 h-9 sm:w-10 sm:h-10 shrink-0"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2B2B2B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                    className="text-[10px] sm:text-xs text-center inline-block"
                  >
                    Safe & Secure
                  </span>
                </div>

                <div className="flex flex-col items-center gap-1 flex-1">
                  <div 
                    style={{ 
                      borderRadius: "4px", 
                      backgroundColor: "rgba(246, 243, 238, 1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    className="w-9 h-9 sm:w-10 sm:h-10 shrink-0"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2B2B2B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                    className="text-[10px] sm:text-xs text-center inline-block"
                  >
                    24/7 Support
                  </span>
                </div>

                <div className="flex flex-col items-center gap-1 flex-1">
                  <div 
                    style={{ 
                      borderRadius: "4px", 
                      backgroundColor: "rgba(246, 243, 238, 1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    className="w-9 h-9 sm:w-10 sm:h-10 shrink-0"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2B2B2B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                    className="text-[10px] sm:text-xs text-center inline-block"
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
                }}
                className="w-full text-center inline-block text-[11px] sm:text-xs mt-0.5"
              >
                Free cancellation • 14 days before departure
              </span>
            </div>


          </div>
        </div>
      </div>

      {/* Prepare for your Journey Section - Web Desktop Version Only */}
      <section
        style={{
          width: "100%",
          maxWidth: "1440px",
          padding: "42px 80px",
          margin: "0 auto",
          opacity: 1,
          boxSizing: "border-box",
        }}
        className="hidden md:flex flex-col gap-8 bg-white relative z-10"
      >
        {/* Header Row */}
        <div className="flex flex-col gap-1.5 text-left w-full">
          <h2 className="text-[36px] font-semibold leading-tight font-serif">
            <span style={{ color: "#2B2B2B", fontFamily: "Fraunces, serif" }}>Prepare for your</span>{" "}
            <span style={{ color: "#FF623E", fontFamily: "Fraunces, serif" }}>Journey</span>
          </h2>
          <p 
            style={{ fontFamily: "Faktum, sans-serif" }}
            className="text-[18px] font-medium text-[#2B2B2B]/80"
          >
            Shop recommended travel gear and clothing items handpicked for your destination
          </p>
        </div>

        {/* 4 Product Cards Grid using ProductCard component */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-2">
          {recommendedGear.map((prod, idx) => (
            <div key={prod.id} onMouseEnter={() => setActiveJourneySlide(idx)}>
              <ProductCard 
                product={prod as any} 
                onAddToCart={(item) => addToCart(item, 'shop', undefined, 1)} 
              />
            </div>
          ))}
        </div>

        {/* Interactive Full-Width Progress Bar */}
        <InteractiveProgressBar
          totalSlides={recommendedGear.length}
          activeSlide={activeJourneySlide}
          onSlideChange={(newIdx) => setActiveJourneySlide(newIdx)}
          className="w-full mt-6 mb-2"
          title="Click or drag to switch active product"
        />

        {/* View All Products Interaction Button (Exact homepage footer button) */}
        <div className="text-center pt-2">
          <Link 
            href="/shop" 
            className="inline-flex items-center justify-center w-[275px] h-[68px] pt-[18px] pr-[36px] pb-[18px] pl-[36px] gap-[8px] rounded-[8px] bg-transparent hover:bg-[#1D493E]/[0.08] text-[#1D493E] transition-all duration-300 cursor-pointer group"
          >
            <span className="w-[163px] h-[25px] flex items-center justify-center font-sans font-medium text-[20px] leading-none">
              View all products
            </span>
            <svg 
              style={{ width: '32px', height: '32px' }}
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.25" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
            >
              <path d="M7 17l2.5-2.5" />
              <path d="M12.5 11.5L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Newsletter / Booking CTA Banner (Matching Home page section design) */}
      <section
        style={{
          width: "100%",
          background: "#FFFFFF",
        }}
        className="relative z-10 w-full px-4 md:px-[80px] py-4 sm:py-8 bg-white"
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
          className="gap-4 sm:gap-6"
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

          {/* Button: Compact sleek CTA */}
          <button
            type="button"
            onClick={() => {
              const bookingEl = document.querySelector('form');
              if (bookingEl) {
                bookingEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            style={{
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
            className="hover:opacity-90 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1D493E] text-white h-[44px] sm:h-[50px] px-6 sm:px-8 rounded-[4px] font-semibold text-sm sm:text-base group cursor-pointer"
          >
            <span>Reserve your tour now</span>
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.25" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="w-5 h-5 shrink-0 transform transition-transform duration-300 ease-out group-hover:translate-x-1.5 group-hover:-translate-y-1.5"
            >
              <path d="M7 17l2.5-2.5" />
              <path d="M12.5 11.5L17 7" />
              <path d="M7 7h10v10" />
            </svg>
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
      {/* EDIT PACKAGE MODAL ON DETAILS PAGE */}
      <PackageEditorModal
        isOpen={isEditingPkg}
        onClose={() => setIsEditingPkg(false)}
        packageData={editingPkgData || pkg}
        onSave={handleSaveEditedPackageOnDetails}
      />
    </div>
  );
}
