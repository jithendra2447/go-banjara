'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Users, ArrowLeft, Check, ShoppingBag, CloudSnow, Wind, Tag, Star, Compass } from 'lucide-react';
import { useCart } from '@/components/providers';
import { AmbientVibe } from '@/components/AmbientVibe';
import { PRODUCTS } from '@/data/products';
import { HOLIDAY_PACKAGES } from '@/data/packages';

const KASHMIR_PACKAGES = [
  {
    id: 'pkg-kashmir-classic',
    name: 'Kashmir Classic Heritage & Dal Lake Tour',
    tabName: 'Dal Lake Tour',
    price: 18900,
    duration: '7 Days / 6 Nights',
    rating: 5.0,
    hotelStars: '4★ Premium Stays',
    route: ['Srinagar Houseboat (3N)', 'Sonamarg Day Trip', 'Yusmarg Offbeat (1N)', 'Srinagar Hotel (2N)'],
    description: 'Reside in a masterfully carved cedar houseboat on the quiet waters of Dal Lake. Experience floating vegetable markets at dawn, stroll through saffron fields, visit the royal Mughal Gardens, and discover the hidden pine meadows of Yusmarg.',
    inclusions: ['4-Star Stays', 'Sunrise Shikara Cruise', 'Private Heated Cab', 'Breakfast & Dinner'],
    image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80',
    itinerary: [
      {
        day: 'DAY 01',
        title: 'Arrival in Srinagar & Heritage Houseboat Check-in',
        places: 'Srinagar Airport, Dal Lake Houseboat',
        offering: 'Private transfer in a heated luxury 4x4 SUV, check-in to a hand-carved heritage cedar houseboat, welcoming Kashmiri Kahwa on deck, and slow evening sunset Shikara cruise around Nehru Park.'
      },
      {
        day: 'DAY 02',
        places: 'Ganderbal Valley, Sindh River, Thajiwas Glacier base',
        offering: 'Full-day return heated private cab, snow boot and heavy winter coat hire, guided pony ride to the glacier base, and hot lunch in a rustic mountain logging cabin.'
      },
      {
        day: 'DAY 04',
        title: 'Floating Market at Dawn & Srinagar Old City Walk',
        places: 'Dal Lake Water Canals, Pampore Saffron Fields, Jamia Masjid',
        offering: '5:00 AM early morning Shikara ride to the floating vegetable market, local deckside breakfast, drive to Pampore saffron farming cooperative, and heritage walking tour.'
      },
      {
        day: 'DAY 05',
        title: 'Offbeat Meadow Journey to Yusmarg',
        places: 'Doodh Ganga River, Yusmarg Pine Valleys, Alpine Trails',
        offering: 'Private heated cab to the quiet meadows of Yusmarg, local mountain cottage picnic lunch, and a guided nature walk along the rushing Doodh Ganga river.'
      },
      {
        day: 'DAY 06',
        title: 'Kashmiri Handloom Tour & Carpet Weaving Workshop',
        places: 'Lal Chowk Craft Cooperatives, Local Weaving Studios',
        offering: 'Exclusive access to family-owned handloom workshops, meeting master Pashmina weavers and carpet knotters, and high tea with Kashmiri bakery treats.'
      },
      {
        day: 'DAY 07',
        title: 'Souvenir Craft Showcase & Airport Transfer',
        places: 'Srinagar Craft Bazaar, Srinagar Airport',
        offering: 'Assisted souvenir shopping and packing, private airport departure transfer in SUV, and complimentary pack of grade-A saffron.'
      }
    ]
  },
  {
    id: 'pkg-kashmir-gulmarg',
    name: 'Gulmarg Winter Skiing & Gondola Adventure',
    tabName: 'Gulmarg Skiing',
    price: 26900,
    duration: '7 Days / 6 Nights',
    rating: 4.9,
    hotelStars: '5★ Luxury Chalet',
    route: ['Srinagar (1N)', 'Gulmarg Chalet (4N)', 'Srinagar Houseboat (1N)'],
    description: 'Ascend the highest cable car in Asia to the pristine powder slopes of Apharwat Peak. Enjoy certified ski instruction, snug lodging in heated alpine chalets, and hot cups of local cardamom tea.',
    inclusions: ['Luxury Chalet', 'Gondola Tickets', 'Ski Gear & Private Coach', 'All Meals included'],
    image: 'https://images.unsplash.com/photo-1615966650071-855b15f29ad1?auto=format&fit=crop&w=800&q=80',
    itinerary: [
      {
        day: 'DAY 01',
        title: 'Arrival & Snowy Gulmarg Pass Drive',
        places: 'Srinagar Airport, Tangmarg Pine Forest, Gulmarg Chalet',
        offering: 'Private transfer in a 4x4 SUV equipped with mountain snow chains, check-in to a heated alpine chalet, and local ski gear selection and fitting session.'
      },
      {
        day: 'DAY 02',
        title: 'First Skiing Lesson & Slope Training',
        places: 'Gulmarg Ski Resort, Beginner Slope 1 & 2',
        offering: 'High-end ski equipment rental (skis, boots, poles), private certified ski instructor for 4 hours, and beginner drag-lift passes.'
      },
      {
        day: 'DAY 03',
        title: 'Gondola Ride to Kongdori Valley (Phase 1)',
        places: 'Kongdori Station (2,600m), Pine Forest Runs',
        offering: 'Phase 1 Gondola ticket, intermediate ski guide, warm packed coffee thermos, and mountain slope safety briefing.'
      },
      {
        day: 'DAY 04',
        title: 'Apharwat Peak High-Altitude Ridge Run (Phase 2)',
        places: 'Apharwat Peak Summit (3,979m), High Alpine Bowls',
        offering: 'Phase 2 Gondola pass, professional freeride guide, avalanche safety tracker checkout, and peak summit photo shoot.'
      },
      {
        day: 'DAY 05',
        title: 'Snowshoeing to Ancient Baba Reshi Shrine',
        places: 'Baba Reshi Forest Trails, Wooden Shrine Complex',
        offering: 'Technical snowshoe rentals, local historical guide, and traditional forest lunch at a local wooden homestay.'
      },
      {
        day: 'DAY 06',
        title: 'Apres-Ski Steam Therapy & Wazwan Feast',
        places: 'Resort Luxury Spa, Fireside Dining Room',
        offering: 'Post-ski steam sauna session, firewood replenishment, and a grand 7-course traditional Wazwan celebratory dinner.'
      },
      {
        day: 'DAY 07',
        title: 'Return to Srinagar & Airport Departure',
        places: 'Gulmarg Meadows, Srinagar Airport',
        offering: 'Private transfer back to Srinagar airport, and a complimentary pack of organic Kashmiri walnuts and saffron.'
      }
    ]
  },
  {
    id: 'pkg-kashmir-complete',
    name: 'Kashmir Complete Valley Slow-Travel Discovery',
    tabName: 'Complete Valley',
    price: 32500,
    duration: '7 Days / 6 Nights',
    rating: 5.0,
    hotelStars: '4★ Premium Stays',
    route: ['Srinagar Houseboat (2N)', 'Gulmarg (2N)', 'Pahalgam (2N)'],
    description: 'The ultimate slow-paced exploration of Kashmir. Experience the peaceful houseboats, the skiing slopes of Gulmarg, and the stunning pine-bordered Lidder river valley in Pahalgam.',
    inclusions: ['Premium Hotels', 'Local Guides', 'Heated Transfers', 'Gondola Phase 1 Pass'],
    image: 'https://images.unsplash.com/photo-1595815729819-abdec427f70b?auto=format&fit=crop&w=800&q=80',
    itinerary: [
      {
        day: 'DAY 01',
        title: 'Arrival in Srinagar & Houseboat Check-in',
        places: 'Srinagar Airport, Dal Lake Houseboat',
        offering: 'Private transfer in a heated 4x4 SUV, check-in to hand-carved heritage cedar houseboat, and welcoming Kashmiri Kahwa.'
      },
      {
        day: 'DAY 02',
        title: 'Mughal Royal Gardens & Tulip Walk',
        places: 'Shalimar Bagh, Nishat Bagh, Pari Mahal',
        offering: 'Garden entrance tickets, professional historical guides, and sunset Shikara cruise around Dal Lake.'
      },
      {
        day: 'DAY 03',
        title: 'Drive to Pahalgam (Lidder River Valley)',
        places: 'Saffron Fields, Martand Sun Temple, Pahalgam Hotel',
        offering: 'En-route saffron field walk and saffron tea, hotel check-in in Pahalgam, and riverside evening campfire.'
      },
      {
        day: 'DAY 04',
        title: 'Aru Valley & Betaab Valley Meadows',
        places: 'Aru Valley, Betaab Valley, Chandanwari',
        offering: 'Local Eco-Cab transfer, entrance passes to the valleys, and guided horse ride through pine forests.'
      },
      {
        day: 'DAY 05',
        title: 'Transfer to Snowy Gulmarg',
        places: 'Pahalgam, Tangmarg Forests, Gulmarg Chalet',
        offering: 'Scenic private drive, heated alpine chalet check-in, and local fireside dinner with Kashmiri Kahwa.'
      },
      {
        day: 'DAY 06',
        title: 'Gulmarg Gondola Ride & Ski Trial',
        places: 'Kongdori Valley (Phase 1), Gulmarg Meadows',
        offering: 'Gondola Phase 1 pass, certified ski guide for beginners, and ski rental equipment included.'
      },
      {
        day: 'DAY 07',
        title: 'Return to Srinagar & Departure',
        places: 'Gulmarg, Srinagar Airport',
        offering: 'Private airport drop-off in SUV, and complimentary Go Banjara walnut gift box.'
      }
    ]
  }
];

const KASHMIR_NEWS = [
  "Dal Lake freezes as Srinagar temperatures drop to -3°C; winter tourism at its peak.",
  "Gulmarg Gondola welcomes record snow enthusiasts for the annual winter ski festival.",
  "Pampore saffron harvest yields record Grade A+ quality organic kesar.",
  "Famous Mughal Gardens covered in a pristine blanket of white snow.",
  "Local weavers showcase signature warm Pashmina shawls for the boutique season."
];

export default function KashmirDetails() {
  const { addToCart } = useCart();
  const [packages, setPackages] = useState<any[]>(KASHMIR_PACKAGES);
  const [activePkg, setActivePkg] = useState<any>(KASHMIR_PACKAGES[0]);
  const [bookingDate, setBookingDate] = useState('');
  const [guests, setGuests] = useState(2);
  const [bookedSuccess, setBookedSuccess] = useState(false);
  const [productAddedSuccess, setProductAddedSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'reviews'>('overview');
  const [expandedDayIdx, setExpandedDayIdx] = useState<number | null>(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gb_admin_packages');
      let parsed = saved ? JSON.parse(saved) : [];
      const hasAllFields = HOLIDAY_PACKAGES.every(hp => {
        const found = parsed.find((p: any) => p.id === hp.id);
        return found && found.price !== undefined && found.link && found.routeList && found.itinerary;
      });
      const isStale = !saved || parsed.length !== HOLIDAY_PACKAGES.length || !hasAllFields;

      if (isStale) {
        parsed = HOLIDAY_PACKAGES;
        localStorage.setItem('gb_admin_packages', JSON.stringify(HOLIDAY_PACKAGES));
      }

      if (parsed) {
        const filtered = parsed.filter((pkg: any) => {
          const destLower = pkg.destination ? pkg.destination.toLowerCase() : '';
          const nameLower = pkg.name ? pkg.name.toLowerCase() : '';
          const routeLower = pkg.route ? (Array.isArray(pkg.route) ? pkg.route.join(' ').toLowerCase() : pkg.route.toLowerCase()) : '';
          
          return (
            destLower.includes('kashmir') || 
            destLower.includes('ladakh') || 
            nameLower.includes('kashmir') || 
            nameLower.includes('srinagar') || 
            nameLower.includes('leh') ||
            routeLower.includes('srinagar') ||
            routeLower.includes('leh') ||
            pkg.id === 'pkg-kashmir-classic' ||
            pkg.id === 'pkg-kashmir-gulmarg'
          );
        });

        const mapped = filtered.map((pkg: any) => {
          if (!pkg.tabName) {
            pkg.tabName = pkg.name.split(' ')[0] + ' ' + (pkg.durationDays ? `${pkg.durationDays}D` : 'Trip');
          }
          if (!pkg.duration) {
            pkg.duration = `${pkg.durationDays || 6} Days / ${pkg.durationDays ? pkg.durationDays - 1 : 5} Nights`;
          }
          if (!pkg.hotelStars) {
            pkg.hotelStars = pkg.hotelStars || '4★ Premium Stays';
          }
          
          // Normalize Route array
          let finalRoute: string[] = [];
          if (typeof pkg.route === 'string') {
            finalRoute = pkg.route.split(',').map((r: string) => r.trim()).filter(Boolean);
          } else if (Array.isArray(pkg.route)) {
            finalRoute = pkg.route;
          } else if (typeof pkg.routePath === 'string') {
            finalRoute = pkg.routePath.split(',').map((r: string) => r.trim()).filter(Boolean);
          } else if (Array.isArray(pkg.routePath)) {
            finalRoute = pkg.routePath;
          }
          pkg.route = finalRoute.length > 0 ? finalRoute : ['Srinagar', 'Kashmir'];

          // Normalize Inclusions array
          let finalInclusions: string[] = [];
          if (typeof pkg.inclusions === 'string') {
            finalInclusions = pkg.inclusions.split(',').map((i: string) => i.trim()).filter(Boolean);
          } else if (Array.isArray(pkg.inclusions)) {
            finalInclusions = pkg.inclusions;
          } else if (typeof pkg.highlights === 'string') {
            finalInclusions = pkg.highlights.split(',').map((i: string) => i.trim()).filter(Boolean);
          } else if (Array.isArray(pkg.highlights)) {
            finalInclusions = pkg.highlights;
          }
          pkg.inclusions = finalInclusions.length > 0 ? finalInclusions : ['Stays & Transport', 'Sightseeing'];

          if (!pkg.itinerary) {
            pkg.itinerary = [
              {
                day: 'DAY 01',
                title: 'Arrival',
                places: pkg.destination || 'Kashmir',
                offering: pkg.description || 'Welcome!'
              }
            ];
          }
          return pkg;
        });

        if (mapped.length > 0) {
          setPackages(mapped);
          setActivePkg((prev: any) => {
            const exists = mapped.find((p: any) => p.id === prev.id);
            return exists || mapped[0];
          });
        }
      }
    } catch (e) {
      console.error('Error loading admin packages:', e);
    }
  }, []);

  // Live weather status state
  const [liveTemp, setLiveTemp] = useState({ temp: -2.4, condition: 'Light Snowfall', wind: '14 km/h', humidity: '82%' });
  const [newsIdx, setNewsIdx] = useState(0);
  const [imgError, setImgError] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Weather simulation
    const weatherInterval = setInterval(() => {
      setLiveTemp(prev => {
        const change = Math.random() > 0.5 ? 0.3 : -0.3;
        const nextTemp = parseFloat((prev.temp + change).toFixed(1));
        return {
          ...prev,
          temp: nextTemp < -4 ? -4 : nextTemp > 1 ? 1 : nextTemp
        };
      });
    }, 12000);

    // News rotation
    const newsInterval = setInterval(() => {
      setNewsIdx(prev => (prev + 1) % KASHMIR_NEWS.length);
    }, 6000);

    return () => {
      clearInterval(weatherInterval);
      clearInterval(newsInterval);
    };
  }, []);

  const handleTabChange = (pkg: any) => {
    setActivePkg(pkg);
    setBookingDate('');
    setGuests(2);
    setBookedSuccess(false);
    setActiveTab('overview');
    setExpandedDayIdx(0);
  };

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDate) {
      alert('Please select a travel date.');
      return;
    }
    const finalItem = {
      id: activePkg.id,
      name: activePkg.name,
      price: activePkg.price,
      image: activePkg.image,
    };
    addToCart(finalItem, 'travel', bookingDate, guests);
    setBookedSuccess(true);
    setTimeout(() => {
      setBookedSuccess(false);
    }, 3000);
  };

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

  // Filter recommended products for Kashmir (Jacket & Gloves only)
  const kashmirProducts = PRODUCTS.filter(p => 
    ['prod-jacket', 'prod-gloves'].includes(p.id)
  );

  return (
    <div className="bg-[#FAF9F6] text-[#1D493E] min-h-screen font-sans relative overflow-x-hidden">
      {/* Falling snow canvas particle effect */}
      <AmbientVibe effect="snowfall" />

      {/* Immersive Header (High-contrast layout, with Weather & Special Offers Widgets) */}
      <section className="relative h-[65vh] flex items-end overflow-hidden bg-slate-950 text-white border-b border-[#FFFF80]/15">
        <img 
          src="/ladakh-hero.jpg" 
          alt="Kashmir Dal Lake" 
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
          <div className="md:col-span-8 space-y-4">
            <span className="badge bg-brand-orange/20 text-[#E05434] border border-[#E05434]/30 font-black text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              Paradise on Earth • Kashmir
            </span>
            <h1 className="text-4xl md:text-7xl font-light font-serif text-slate-100 leading-tight">
              Misty Shikaras & Snow
            </h1>
            <p className="text-sm md:text-base text-slate-300 max-w-xl font-normal leading-relaxed">
              Glide on peaceful Shikaras, walk through saffron fields, and experience the cozy winter warmth of wooden houseboats. Scroll down to discover our local travel packages.
            </p>
          </div>

          {/* Right: Live Temperature Widget & Special Offers Widget */}
          <div className="md:col-span-4 space-y-4">
            {/* Live Weather Widget (Highly Prominent Srinagar Weather) */}
            <div className="bg-[#1D493E] border border-[#FFFF80]/20 rounded-2xl p-4 shadow-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#FFFF80] flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-brand-orange animate-ping" />
                  Live Srinagar Weather
                </span>
                <span className="text-[10px] text-slate-300 font-mono">1,585M Elevation</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-baseline text-4xl font-light text-slate-100 font-serif">
                  {liveTemp.temp}
                  <span className="text-2xl font-serif">°C</span>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="text-left space-y-0.5">
                  <p className="text-xs font-bold text-white flex items-center gap-1">
                    <CloudSnow className="w-3.5 h-3.5 text-brand-blue" />
                    {liveTemp.condition}
                  </p>
                  <p className="text-[10px] text-slate-300 font-mono flex items-center gap-1">
                    <Wind className="w-3 h-3 text-[#FFFF80]" />
                    Wind: {liveTemp.wind}
                  </p>
                </div>
              </div>
            </div>

            {/* Exclusive Stays & Offers Widget */}
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 shadow-lg space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-brand-orange font-bold flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-brand-orange" />
                Exclusive Valley Offers
              </span>
              <div className="space-y-1.5 text-xs text-slate-300">
                <p className="leading-normal flex items-start gap-1">
                  <span className="text-[#FFFF80] font-bold">•</span>
                  <span><strong>COZYWINTER:</strong> Flat ₹3,000 off on ski tours.</span>
                </p>
                <p className="leading-normal flex items-start gap-1">
                  <span className="text-[#FFFF80] font-bold">•</span>
                  <span>Free sunrise Shikara cruise with any Houseboat booking.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: WHITE BACKGROUND - Curated Expeditions Editorial Spread */}
      <section className="bg-[#FAF9F6] text-[#1D493E] py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          
          <div className="text-center space-y-3">
            <span className="inline-block bg-[#1D493E]/5 text-[#1D493E] border border-[#1D493E]/15 font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-widest">
              Signature Travel Selector
            </span>
            <h2 className="text-4xl md:text-5xl font-light font-serif text-[#1D493E] tracking-wide">
              Kashmir Curated Expeditions
            </h2>
            <p className="text-sm text-[#1D493E]/70 max-w-lg mx-auto leading-relaxed">
              Explore our slow-travel journeys. Toggle between our signature packages below to view specifications and book your custom slot.
            </p>
          </div>

          {/* Luxury Horizontal Tab Selector */}
          <div className="flex justify-center border-b border-[#1D493E]/10 pb-px max-w-2xl mx-auto">
            <div className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar scroll-smooth w-full justify-between py-2">
              {packages.map((pkg, idx) => {
                const isActive = activePkg.id === pkg.id;
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => handleTabChange(pkg)}
                    className="relative pb-3 flex flex-col items-center gap-1 group whitespace-nowrap flex-shrink-0 focus:outline-none cursor-pointer"
                  >
                    <span className="text-[9px] font-mono font-black text-[#E05434] tracking-widest">
                      0{idx + 1} / {pkg.duration.split(' ')[0]}D
                    </span>
                    <span className={`text-xs font-sans font-black uppercase tracking-wider transition-colors duration-300 ${
                      isActive ? 'text-[#1D493E]' : 'text-[#1D493E]/55 group-hover:text-[#1D493E]'
                    }`}>
                      {pkg.tabName}
                    </span>
                    {isActive && (
                      <span className="absolute bottom-0 w-full h-0.5 bg-[#E05434] rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Double-Column Editorial Spread */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start max-w-6xl mx-auto">
            
            {/* LEFT COLUMN: Travel package details (lg:col-span-8) */}
            <div className="lg:col-span-8 space-y-8 text-left">
              
              {/* Header Title Row */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-black uppercase font-mono">
                  <span className="bg-[#FFF0EB] text-[#FF623E] tracking-wider px-2.5 py-1 rounded">
                    {activePkg.duration}
                  </span>
                  <span className="text-[#1D493E] bg-[#FAF9F6] border border-[#1D493E]/10 px-2.5 py-1 rounded">
                    {activePkg.hotelStars}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between sm:items-start border-b border-[#1D493E]/10 pb-5 gap-3">
                  <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1D493E] leading-tight">
                    {activePkg.name}
                  </h1>
                  <div className="text-left sm:text-right space-y-1">
                    <span className="text-2xl font-serif font-black text-[#E05434]">
                      ₹{activePkg.price.toLocaleString('en-IN')}/Person
                    </span>
                    <span className="text-[10px] text-gray-400 block font-mono">Permits & Transport included</span>
                  </div>
                </div>
              </div>

              {/* Visual Showcase Frame */}
              <div className="relative aspect-[16/9] overflow-hidden rounded-[24px] border border-[#1D493E]/10 bg-slate-900 shadow-md group">
                {imgError[activePkg.id] ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1D493E] via-[#081821] to-[#AE99FF]/20 flex flex-col items-center justify-center p-8 text-center select-none z-0">
                    <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#FAF9F6_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
                    <Compass className="w-10 h-10 text-[#FFFF80] mb-2 animate-spin-slow" />
                    <span className="text-[9px] font-mono tracking-widest text-[#FFFF80] uppercase">Go Banjāra Journal</span>
                  </div>
                ) : (
                  <img 
                    src={activePkg.image} 
                    alt={activePkg.name} 
                    onError={() => setImgError(prev => ({ ...prev, [activePkg.id]: true }))}
                    className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
                  />
                )}
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-[#E05434] shadow-xs">
                  <Star className="w-3.5 h-3.5 fill-[#E05434] stroke-none" />
                  <span className="text-xs font-black">{activePkg.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Tab Selector */}
              <div className="flex gap-6 border-b border-[#1D493E]/10 pb-2">
                {['overview', 'itinerary', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab as any)}
                    className={`pb-2 text-xs font-black uppercase tracking-wider relative transition-colors cursor-pointer ${
                      activeTab === tab ? 'text-[#1D493E]' : 'text-gray-400 hover:text-[#1D493E]'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#E05434] rounded-full animate-fade-in" />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Contents: Overview */}
              {activeTab === 'overview' && (
                <div className="space-y-6 text-left animate-in fade-in duration-300">
                  <p className="text-sm text-gray-600 font-semibold leading-relaxed">
                    {activePkg.description}
                  </p>
                  
                  {/* Route Stops */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-mono text-[#1D493E]/60 uppercase font-black tracking-wider block">Expedition Route Map</span>
                    <div className="flex flex-wrap items-center gap-2 bg-[#f3faf5] border border-[#1D493E]/8 p-3 rounded-2xl">
                      {Array.isArray(activePkg.route) && activePkg.route.map((node: string, i: number) => (
                        <React.Fragment key={i}>
                          <span className="text-[10px] font-sans font-extrabold text-[#1D493E] bg-white border border-[#1D493E]/10 px-2.5 py-1.5 rounded-xl shadow-sm">
                            {node}
                          </span>
                          {i < activePkg.route.length - 1 && (
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
                      {Array.isArray(activePkg.inclusions) && activePkg.inclusions.map((inc: string, i: number) => (
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
              {activeTab === 'itinerary' && (
                <div className="space-y-6 text-left animate-in fade-in duration-300">
                  <h3 className="text-xl font-serif font-light text-[#E05434] leading-snug mb-4">
                    A day-by-day breakdown of what to expect.
                  </h3>
                  <div className="space-y-4">
                    {Array.isArray(activePkg.itinerary) && activePkg.itinerary.map((step: any, idx: number) => {
                      const isOpen = expandedDayIdx === idx;
                      const numStr = String(idx + 1).padStart(2, '0');
                      return (
                        <div key={idx} className="border border-[#1D493E]/10 rounded-2xl overflow-hidden bg-white shadow-xs">
                          <button
                            type="button"
                            onClick={() => setExpandedDayIdx(isOpen ? null : idx)}
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
              {activeTab === 'reviews' && (
                <div className="space-y-6 text-left animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white border border-[#1D493E]/10 p-6 rounded-2xl items-center shadow-xs">
                    <div className="text-center space-y-1.5 border-r border-[#1D493E]/10 pr-6">
                      <span className="text-5xl font-black text-[#1D493E] font-serif">{activePkg.rating.toFixed(1)}</span>
                      <div className="flex justify-center text-[#E05434] gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 stroke-none ${i < Math.floor(activePkg.rating) ? 'fill-[#E05434]' : 'fill-gray-200'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] text-gray-400 block font-mono">Verified Reviews</span>
                    </div>
                    <div className="sm:col-span-2 space-y-2.5 text-xs font-semibold text-gray-600 pl-2">
                      <p className="italic leading-relaxed">&ldquo;An unforgettable slow-travel trip with Go Banjara. Exquisite stays and highly knowledgeable coordinators!&rdquo;</p>
                      <span className="block text-[9px] font-mono text-gray-400">— Jithendra V., July 2026</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT COLUMN: Weather & Integrated Booking Form (lg:col-span-4) */}
            <div className="lg:col-span-4 space-y-6 text-left">
              
              {/* Weather Status Widget */}
              <div className="bg-[#1D493E] text-white p-5 rounded-[24px] border border-white/10 shadow-md space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#FFFF80] flex items-center gap-1.5 font-bold">
                    <span className="w-2 h-2 rounded-full bg-brand-orange animate-ping" />
                    Live Weather
                  </span>
                  <span className="text-[9px] text-slate-300 font-mono">Valley Base</span>
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

              {/* Exclusive Offers Widget */}
              <div className="bg-white border border-[#1D493E]/10 rounded-[24px] p-5 shadow-xs space-y-3">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#E05434] font-black flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#E05434]" />
                  Exclusive Offers
                </span>
                <div className="space-y-2 text-[11px] text-gray-500 font-semibold">
                  <p className="leading-normal flex items-start gap-1">
                    <span className="text-[#E05434] font-bold">•</span>
                    <span><strong>COZYWINTER:</strong> Flat ₹3,000 off on ski tours.</span>
                  </p>
                  <p className="leading-normal flex items-start gap-1">
                    <span className="text-[#E05434] font-bold">•</span>
                    <span>Free sunrise Shikara cruise with any booking.</span>
                  </p>
                </div>
              </div>

              {/* Booking Board Form Card */}
              <div className="bg-white border-2 border-[#1D493E] p-6 rounded-[28px] shadow-[4px_4px_0px_0px_#1D493E] space-y-4">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-black border-b border-gray-100 pb-2">
                  Secure Your Booking
                </span>
                <form onSubmit={handleBook} className="space-y-4">
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
                      className="w-full p-3 rounded-xl border border-[#1D493E]/20 bg-white text-xs text-[#1D493E] focus:outline-none focus:ring-2 focus:ring-[#1D493E]/10 font-bold"
                    />
                  </div>

                  {/* Guests Count Selection */}
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-mono tracking-wider text-[#1D493E] uppercase font-black flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#E05434]" />
                      Number of Guests
                    </label>
                    <div className="flex items-center justify-between p-1 rounded-xl border border-[#1D493E]/20 bg-white">
                      <button
                        type="button"
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        className="w-7 h-7 rounded-lg border border-[#1D493E]/15 flex items-center justify-center font-extrabold hover:bg-gray-50 transition text-[#1D493E]"
                      >
                        -
                      </button>
                      <span className="text-xs font-mono font-bold text-[#1D493E]">{guests} Guests</span>
                      <button
                        type="button"
                        onClick={() => setGuests(guests + 1)}
                        className="w-7 h-7 rounded-lg border border-[#1D493E]/15 flex items-center justify-center font-extrabold hover:bg-gray-50 transition text-[#1D493E]"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Total price cost block */}
                  <div className="p-3.5 rounded-xl bg-[#f3faf5] border border-[#1D493E]/8 flex flex-col gap-1 text-center">
                    <span className="text-[8px] font-mono tracking-wider text-[#1D493E]/50 font-black uppercase">TOTAL PACKAGE COST</span>
                    <p className="text-2xl font-black text-[#E05434] font-serif">
                      ₹{(activePkg.price * guests).toLocaleString('en-IN')}
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={bookedSuccess}
                    className="w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 shadow-[3px_3px_0px_0px_#1D493E] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none bg-[#E05434] hover:bg-[#c94527] text-white border border-[#1D493E]"
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
       </section>

      {/* SECTION 2: BRAND GREEN BACKGROUND - News Ticker & Shades of Kashmir Gallery */}
      <section className="bg-[#1D493E] text-white py-20 relative z-10 border-t border-b border-[#D97706]/15">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          
          {/* Valley Live News Updates Scrolling Ticker */}
          <div className="max-w-5xl mx-auto border border-white/10 bg-white/5 p-4 rounded-2xl flex items-center gap-4">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#FFFF80] font-black flex items-center gap-1.5 flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#FFFF80] animate-pulse" />
              Live news updates:
            </span>
            <div className="flex-1 overflow-hidden h-6 relative flex items-center">
              <p className="text-xs text-[#FAF9F6] italic leading-none transition-opacity duration-300">
                &ldquo;{KASHMIR_NEWS[newsIdx]}&rdquo;
              </p>
            </div>
          </div>

          {/* Shades of Kashmir Photo Gallery */}
          <div className="space-y-12">
            <div className="text-center space-y-3">
              <span className="inline-block bg-white/10 text-[#FFFF80] border border-white/10 font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-wider">
                Visual Journal
              </span>
              <h2 className="text-4xl md:text-5xl font-light font-serif text-[#FAF9F6] tracking-wide">
                Shades of Kashmir
              </h2>
              <p className="text-sm text-[#F3FFEF]/75 max-w-md mx-auto leading-relaxed">
                A slow photographic look into Srinagar houseboats, snowy pine forests, and alpine ski slopes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-auto md:h-[500px]">
              {/* Main large portrait: Dal Lake */}
              <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-3xl border border-white/10 bg-[#0b0f19]/30 shadow-lg min-h-[280px]">
                <img 
                  src="/ladakh-hero.jpg" 
                  alt="Dal Lake Srinagar" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D493E] via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 text-left">
                  <span className="text-[10px] font-black uppercase text-[#FFFF80] tracking-wider block mb-1">Scenic Srinagar</span>
                  <h3 className="text-2xl font-serif font-light text-slate-100">Dal Lake Shikara Morning</h3>
                  <p className="text-xs text-slate-200 mt-1 leading-relaxed max-w-sm">
                    Traditional wooden houseboats and yellow shikaras floating peacefully under snowy peaks.
                  </p>
                </div>
              </div>

              {/* Top Right: Gulmarg Snow Mountains */}
              <div className="md:col-span-2 relative group overflow-hidden rounded-3xl border border-white/10 bg-[#0b0f19]/30 shadow-lg min-h-[180px]">
                <img 
                  src="https://images.unsplash.com/photo-1615966650071-855b15f29ad1?auto=format&fit=crop&w=800&q=80" 
                  alt="Gulmarg Snow Peaks" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D493E]/95 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 text-left">
                  <span className="text-[10px] font-black uppercase text-[#FFFF80] tracking-wider block mb-1">Ski Slopes</span>
                  <h3 className="text-xl font-serif font-light text-slate-100">Misty Gulmarg Slopes</h3>
                  <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                    Deep winter snow covers the tall pine trees of Gulmarg ski meadows.
                  </p>
                </div>
              </div>

              {/* Bottom Middle: Srinagar Tulip Gardens */}
              <div className="relative group overflow-hidden rounded-3xl border border-white/10 bg-[#0b0f19]/30 shadow-lg min-h-[140px]">
                <img 
                  src="https://images.unsplash.com/photo-1595815729819-abdec427f70b?auto=format&fit=crop&w=800&q=80" 
                  alt="Srinagar Tulip Garden" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D493E]/95 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <span className="text-[9px] font-black uppercase text-[#FFFF80] tracking-wider block mb-0.5">Srinagar</span>
                  <h4 className="text-sm font-serif font-light text-slate-100">Tulip Blooms</h4>
                </div>
              </div>

              {/* Bottom Right: Autumn Saffron Fields */}
              <div className="relative group overflow-hidden rounded-3xl border border-white/10 bg-[#0b0f19]/30 shadow-lg min-h-[140px]">
                <img 
                  src="https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80" 
                  alt="Saffron Pampore" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D493E]/95 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <span className="text-[9px] font-black uppercase text-[#FFFF80] tracking-wider block mb-0.5">Pampore</span>
                  <h4 className="text-sm font-serif font-light text-slate-100">Saffron Fields</h4>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: WHITE BACKGROUND - Go Banjāra Boutique Essentials */}
      <section className="bg-[#FAF9F6] text-[#1D493E] py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-6 space-y-10">
          <div className="text-center space-y-3">
            <span className="inline-block bg-[#1D493E]/5 text-[#1D493E] border border-[#1D493E]/15 font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-widest">
              Go Banjāra Boutique Essentials
            </span>
            <h2 className="text-3xl md:text-4xl font-light font-serif text-[#1D493E] tracking-wide">
              Gear Up for the Valley
            </h2>
            <p className="text-xs text-[#1D493E]/75 max-w-sm mx-auto leading-relaxed">
              Shop premium cold-weather technical apparel and hand-knit woolen accessories recommended for Kashmir.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {kashmirProducts.map((prod) => (
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
                  <div className="space-y-1.5 text-left">
                    <span className="text-[9px] font-black text-[#E05434] uppercase tracking-wider">Authentic Apparel</span>
                    <h3 className="font-bold text-base text-[#1D493E] font-serif">{prod.name}</h3>
                    <p className="text-xs text-[#1D493E]/70 leading-relaxed">{prod.description}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#1D493E]/8">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-[#1D493E]/60 font-bold uppercase tracking-wider">Price</span>
                    <span className="text-lg font-black text-[#E05434] font-serif">₹{prod.price.toLocaleString('en-IN')}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleProductAdd(prod)}
                    className={`w-full py-3 rounded-xl border text-xs font-black tracking-widest uppercase transition duration-300 flex items-center justify-center gap-1.5 ${
                      productAddedSuccess === prod.id
                        ? 'bg-brand-seaweed text-white border-brand-seaweed'
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
