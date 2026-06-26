'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Users, ArrowLeft, Check, ShoppingBag, CloudSnow, Wind, Thermometer, ExternalLink } from 'lucide-react';
import { useCart } from '@/components/providers';
import { AmbientVibe } from '@/components/AmbientVibe';
import { PRODUCTS } from '@/data/products';

const KASHMIR_PACKAGES = [
  {
    id: 'pkg-kashmir-houseboat',
    name: 'Dal Lake Heritage Houseboat Luxury',
    price: 21500,
    duration: '4 Days / 3 Nights',
    rating: 5.0,
    description: 'Sleep in a masterfully carved cedar houseboat on the serene waters of Dal Lake. Experience traditional Wazwan meals, shikara rides at sunrise, and stargazing from a wooden deck.',
    highlights: ['Heritage Wooden Houseboat', 'Sunrise Shikara Cruise', 'Traditional Wazwan Feast', 'Local Tour Guide'],
    image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'pkg-kashmir-gulmarg',
    name: 'Gulmarg Winter Skiing & Gondola',
    price: 26900,
    duration: '5 Days / 4 Nights',
    rating: 4.9,
    description: 'Ascend the highest cable car in Asia to the snow-covered slopes of Apharwat Peak. Enjoy private ski instruction, snug lodging in heated alpine chalets, and hot cups of Kashmiri Kahwa.',
    highlights: ['Gulmarg Gondola Pass', 'Private Ski Instructor', 'Heated Luxury Alpine Chalet', 'Daily Kahwa Tea & Snacks'],
    image: 'https://images.unsplash.com/photo-1615966650071-855b15f29ad1?auto=format&fit=crop&w=800&q=80',
  }
];

export default function KashmirDetails() {
  const { addToCart } = useCart();
  const [selectedPkg, setSelectedPkg] = useState(KASHMIR_PACKAGES[0]);
  const [bookingDate, setBookingDate] = useState('');
  const [guests, setGuests] = useState(2);
  const [bookedSuccess, setBookedSuccess] = useState(false);
  const [productAddedSuccess, setProductAddedSuccess] = useState<string | null>(null);

  // Live weather status state
  const [liveTemp, setLiveTemp] = useState({ temp: -2.4, condition: 'Light Snowfall', wind: '14 km/h', humidity: '82%' });

  // Live news ticker state
  const KASHMIR_NEWS = [
    "Dal Lake freezes as Srinagar temperatures drop to -3°C; winter tourism at its peak.",
    "Gulmarg Gondola welcomes record snow enthusiasts for the annual winter ski festival.",
    "Pampore saffron harvest yields record Grade A+ quality organic kesar.",
    "Famous Mughal Gardens covered in a pristine blanket of white snow.",
    "Local weavers showcase signature warm Pashmina shawls for the boutique season."
  ];
  const [newsIdx, setNewsIdx] = useState(0);

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

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDate) {
      alert('Please select a travel date.');
      return;
    }
    const finalItem = {
      id: selectedPkg.id,
      name: selectedPkg.name,
      price: selectedPkg.price,
      image: selectedPkg.image,
    };
    addToCart(finalItem, 'travel', bookingDate, guests);
    setBookedSuccess(true);
    setTimeout(() => setBookedSuccess(false), 3000);
  };

  const handleProductAdd = (prod: any) => {
    const cartItem = {
      id: prod.id,
      name: prod.name,
      price: prod.price,
      image: prod.image,
    };
    addToCart(cartItem, 'product', undefined, 1);
    setProductAddedSuccess(prod.id);
    setTimeout(() => setProductAddedSuccess(null), 2500);
  };

  // Filter recommended products for Kashmir
  const kashmirProducts = PRODUCTS.filter(p => 
    ['prod-saffron', 'prod-jacket', 'prod-backpack', 'prod-tea'].includes(p.id)
  );

  return (
    <div className="bg-[#0b0f19] text-white min-h-screen font-sans relative overflow-x-hidden">
      {/* Falling snow canvas particle effect */}
      <AmbientVibe effect="snowfall" />

      {/* Immersive Header */}
      <section className="relative h-[65vh] flex items-end overflow-hidden bg-slate-950 text-white border-b border-[#D97706]/15">
        <img 
          src="/ladakh-hero.jpg" 
          alt="Kashmir Dal Lake" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] to-transparent" />
        
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
              Glide on peaceful Shikaras, walk through saffron fields, and experience the cozy winter warmth of houseboats. Scroll down to discover our local travel packages.
            </p>
          </div>

          {/* Right: Live Widgets (Weather & News) */}
          <div className="md:col-span-4 space-y-4">
            {/* Live Weather Widget */}
            <div className="glass border border-white/10 rounded-2xl p-4 bg-slate-950/40 backdrop-blur-md space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[9px] uppercase font-black tracking-widest text-[#FFFF80] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E05434] animate-ping" />
                  Live Srinagar Weather
                </span>
                <span className="text-xs text-slate-400 font-bold">21:00 Local</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-3xl font-light text-slate-100 font-serif">
                  <Thermometer className="w-6 h-6 text-brand-orange" />
                  {liveTemp.temp}°C
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="text-left space-y-0.5">
                  <p className="text-xs font-extrabold text-white flex items-center gap-1">
                    <CloudSnow className="w-3.5 h-3.5 text-blue-400" />
                    {liveTemp.condition}
                  </p>
                  <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                    <Wind className="w-3 h-3 text-teal-400" />
                    Wind: {liveTemp.wind}
                  </p>
                </div>
              </div>
            </div>

            {/* Live News Ticker Widget */}
            <div className="glass border border-white/10 rounded-2xl p-4 bg-slate-950/40 backdrop-blur-md space-y-2 overflow-hidden h-24 flex flex-col justify-between">
              <span className="text-[9px] uppercase font-black tracking-widest text-slate-400 block">
                📰 Valley News Feed
              </span>
              <div className="relative flex-1 flex items-center">
                <p className="text-xs text-slate-300 italic leading-relaxed transition-all duration-500">
                  &ldquo;{KASHMIR_NEWS[newsIdx]}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kashmir Photo Gallery (New Bento Grid Section) */}
      <section className="max-w-7xl mx-auto px-6 py-16 space-y-8">
        <div className="space-y-2">
          <span className="badge bg-brand-orange/20 text-[#E05434] border border-[#E05434]/30 font-black text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Visual Journal
          </span>
          <h2 className="text-3xl md:text-5xl font-light font-serif text-slate-100">Shades of Kashmir</h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-md">
            A curated look into Srinagar houseboats, snow-clad pine valleys, and winter ski slopes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-auto md:h-[600px]">
          {/* Main large portrait: Dal Lake */}
          <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-lg min-h-[300px]">
            <img 
              src="/ladakh-hero.jpg" 
              alt="Dal Lake Srinagar" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[10px] font-black uppercase text-[#FFFF80] tracking-wider block mb-1">Scenic Srinagar</span>
              <h3 className="text-xl md:text-2xl font-serif font-light text-slate-100">Dal Lake Shikara Morning</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-sm">
                Traditional wooden houseboats and yellow shikaras floating peacefully under snowy peaks.
              </p>
            </div>
          </div>

          {/* Top Right: Gulmarg Snow Mountains */}
          <div className="md:col-span-2 relative group overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-lg min-h-[200px]">
            <img 
              src="https://images.unsplash.com/photo-1615966650071-855b15f29ad1?auto=format&fit=crop&w=800&q=80" 
              alt="Gulmarg Snow Peaks" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[10px] font-black uppercase text-[#FFFF80] tracking-wider block mb-1">Ski Slopes</span>
              <h3 className="text-lg md:text-xl font-serif font-light text-slate-100">Misty Gulmarg Slopes</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Deep winter snow covers the tall pine trees of Gulmarg.
              </p>
            </div>
          </div>

          {/* Bottom Middle: Srinagar Tulip Gardens */}
          <div className="relative group overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-lg min-h-[150px]">
            <img 
              src="https://images.unsplash.com/photo-1595815729819-abdec427f70b?auto=format&fit=crop&w=800&q=80" 
              alt="Srinagar Tulip Garden" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[9px] font-black uppercase text-[#FFFF80] tracking-wider block mb-0.5">Srinagar</span>
              <h4 className="text-sm font-serif font-light text-slate-100">Tulip Blooms</h4>
            </div>
          </div>

          {/* Bottom Right: Autumn Saffron Fields */}
          <div className="relative group overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-lg min-h-[150px]">
            <img 
              src="https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80" 
              alt="Saffron Pampore" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[9px] font-black uppercase text-[#FFFF80] tracking-wider block mb-0.5">Pampore</span>
              <h4 className="text-sm font-serif font-light text-slate-100">Saffron Harvest</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Package Selection & Booking Configurator */}
      <section className="max-w-7xl mx-auto px-6 border-t border-white/10 pt-16 pb-20">
        <div className="text-center space-y-3 mb-16">
          <span className="badge bg-brand-orange/15 text-brand-orange border border-brand-orange/20 font-black text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Explore Kashmir Packages
          </span>
          <h2 className="text-3xl md:text-5xl font-light font-serif text-slate-100">Plan Your Valley Discovery</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Choose your custom itinerary. All tours feature heated local transport, heritage rooms, and personal local guides.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start relative z-10">
          
          {/* Packages Radio Selection */}
          <div className="lg:col-span-7 space-y-4">
            {KASHMIR_PACKAGES.map((pkg) => (
              <button
                key={pkg.id}
                type="button"
                onClick={() => setSelectedPkg(pkg)}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 flex gap-4 bg-slate-900/60 backdrop-blur-md ${
                  selectedPkg.id === pkg.id
                    ? 'border-brand-orange ring-2 ring-brand-orange/10 shadow-md'
                    : 'border-white/5 hover:border-white/20'
                }`}
              >
                <img 
                  src={pkg.image} 
                  alt={pkg.name} 
                  className="w-20 h-20 md:w-28 md:h-28 rounded-xl object-cover border border-white/10 flex-shrink-0"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap justify-between items-start gap-1">
                    <h3 className="font-extrabold text-white text-base md:text-lg font-serif">{pkg.name}</h3>
                    <span className="text-[10px] font-black uppercase text-brand-yellow bg-brand-yellow/10 px-2 py-0.5 rounded border border-brand-yellow/20">
                      {pkg.duration}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{pkg.description}</p>
                  
                  {/* Highlights Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {pkg.highlights.map((hl, i) => (
                      <span key={i} className="text-[9px] font-bold text-slate-300 bg-white/5 border border-white/5 px-2 py-0.5 rounded">
                        {hl}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Booking Configurator Form */}
          <div className="lg:col-span-5">
            <div className="glass border border-white/10 p-6 rounded-3xl bg-slate-950/60 backdrop-blur-md shadow-lg space-y-6">
              <div>
                <h3 className="text-xl font-black font-serif text-white">Configure Booking</h3>
                <p className="text-xs text-slate-400 mt-1">Book your custom travel slot instantly</p>
              </div>

              {/* Price Banner */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">Total Cost</span>
                <div className="text-right">
                  <p className="text-2xl font-black text-brand-yellow">
                    ₹{(selectedPkg.price * guests).toLocaleString('en-IN')}
                  </p>
                  <p className="text-[9px] font-bold text-slate-500">
                    ₹{selectedPkg.price.toLocaleString('en-IN')} × {guests} Traveler(s)
                  </p>
                </div>
              </div>

              <form onSubmit={handleBook} className="space-y-4">
                {/* Travel Date */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                    Select Departure Date
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-white/10 bg-slate-900 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
                  />
                </div>

                {/* Travelers Count */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-brand-orange" />
                    Number of Guests
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center font-extrabold hover:bg-white/10 transition text-white"
                    >
                      -
                    </button>
                    <span className="text-lg font-black text-white w-8 text-center">{guests}</span>
                    <button
                      type="button"
                      onClick={() => setGuests(guests + 1)}
                      className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center font-extrabold hover:bg-white/10 transition text-white"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={bookedSuccess}
                  className={`w-full py-4 rounded-xl font-extrabold flex items-center justify-center gap-2 shadow-md transition-all duration-300 ${
                    bookedSuccess
                      ? 'bg-brand-seaweed text-white'
                      : 'bg-brand-orange hover:bg-brand-bright-orange text-white hover:scale-[1.01]'
                  }`}
                >
                  {bookedSuccess ? (
                    <>
                      <Check className="w-5 h-5" />
                      Added to Bag!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      Add Booking to Bag
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* Boutique Recommendations Section */}
      <section className="max-w-7xl mx-auto px-6 border-t border-white/10 pt-16 pb-24 space-y-12">
        <div className="text-center space-y-3">
          <span className="badge bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20 font-black text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Kashmir Boutique recommendations
          </span>
          <h2 className="text-3xl md:text-5xl font-light font-serif text-slate-100">Gear Up for the Valley</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Shop authentic Grade-A Kashmiri products and cold-weather gear recommended for your travels.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {kashmirProducts.map((prod) => (
            <div 
              key={prod.id} 
              className="glass border border-white/10 rounded-2xl p-4 bg-slate-950/40 hover:border-white/20 transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="relative h-48 w-full rounded-xl overflow-hidden border border-white/5 bg-slate-900">
                  <img 
                    src={prod.image} 
                    alt={prod.name} 
                    className="w-full h-full object-cover" 
                  />
                  <span className="absolute top-2 right-2 text-[9px] font-black bg-brand-yellow/90 text-slate-950 px-2 py-0.5 rounded shadow">
                    ★ {prod.rating.toFixed(1)}
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm text-white font-serif">{prod.name}</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">{prod.description}</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Price</span>
                  <span className="text-base font-black text-brand-yellow font-serif">₹{prod.price.toLocaleString('en-IN')}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleProductAdd(prod)}
                  className={`w-full py-2.5 rounded-xl border text-xs font-black tracking-wider uppercase transition duration-300 flex items-center justify-center gap-1.5 ${
                    productAddedSuccess === prod.id
                      ? 'bg-brand-seaweed text-white border-brand-seaweed'
                      : 'bg-white/5 hover:bg-white/15 border-white/10 text-[#FFFF80]'
                  }`}
                >
                  {productAddedSuccess === prod.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Added to Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Quick Add to Bag
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
