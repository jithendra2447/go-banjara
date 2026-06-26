'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Star, MapPin, Compass, ArrowRight, Sparkles, ArrowUpRight } from 'lucide-react';
import { useCart } from '@/components/providers';
import { PRODUCTS } from '@/data/products';
import { DESTINATIONS } from '@/data/destinations';

export default function Home() {
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredProducts = PRODUCTS.filter((prod) => {
    const matchesSearch =
      prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || prod.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-24 pb-32 bg-[#FAF9F6] text-[#1D493E]">
      
      {/* Editorial Split Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center bg-gradient-to-br from-[#1D493E] via-[#12312A] to-[#0A1D19] text-white py-20 border-b border-[#D97706]/15">
        {/* Fine gold lines and background grids */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(217,119,6,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(217,119,6,0.05)_1px,transparent_1px)] bg-[size:48px_48px] opacity-70" />
        <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-[#FFFF80]/8 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[550px] h-[550px] bg-[#E05434]/8 rounded-full blur-[160px] pointer-events-none" />
        
        {/* Horizontal decorative gold lines */}
        <div className="absolute top-12 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D97706]/20 to-transparent" />
        <div className="absolute bottom-12 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D97706]/20 to-transparent" />

        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-12 gap-16 relative z-10 items-center">
          {/* Left: Editorial content */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 bg-[#FFFF80]/10 border border-[#FFFF80]/20 text-[#FFFF80] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-sm">
              <Sparkles className="w-3.5 h-3.5 fill-[#FFFF80]" />
              The Art of Travel & Retro Retail
            </div>
            
            <h1 className="text-5xl md:text-7xl font-light font-serif leading-[1.05] tracking-wide text-[#FAF9F6]">
              Collect Memories, <br />
              <span className="font-serif italic font-normal text-[#FFFF80] drop-shadow-sm">Cherish Traditions.</span>
            </h1>
            
            <p className="text-base md:text-lg text-[#F3FFEF]/80 max-w-xl font-sans leading-relaxed">
              Go Banjāra blends curated adventure journeys with authentic street-inspired fashion. Explore local Indian spices, hand-spun Khadi wear, and book beautifully slow-paced voyages.
            </p>

            <div className="flex flex-wrap gap-5 pt-4">
              <Link 
                href="/travel"
                className="px-8 py-4 bg-[#E05434] hover:bg-[#FF623E] text-white font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2.5 border border-[#E05434]/30"
              >
                Explore Journeys
                <Compass className="w-4.5 h-4.5 animate-[spin_10s_linear_infinite]" />
              </Link>
              <a 
                href="#bazaar"
                className="px-8 py-4 border border-[#FAF9F6]/20 hover:border-[#FFFF80]/50 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl flex items-center gap-2.5 transition duration-300 backdrop-blur-md hover:bg-white/5"
              >
                Shop the Bazaar
                <ArrowRight className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* Right: Asymmetric Layered Showcase */}
          <div className="lg:col-span-5 relative h-[480px] hidden lg:block">
            {/* Background gold glow card */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#FFFF80]/5 to-[#E05434]/5 rounded-[40px] border border-[#D97706]/10 backdrop-blur-3xl -rotate-3 translate-x-3 translate-y-3" />
            
            {/* Upper Overlapping Destination Card */}
            <div className="absolute left-6 top-8 w-[240px] h-[300px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 -rotate-6 transition-all duration-500 hover:rotate-0 hover:scale-105 group">
              <img 
                src="https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80" 
                alt="Kerala Backwaters" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                <span className="text-[8px] font-black text-[#FFFF80] uppercase tracking-widest block">Tropical Kerala</span>
                <span className="font-serif text-lg font-bold block">The Emerald Cruise</span>
              </div>
            </div>

            {/* Lower Overlapping Product Card */}
            <div className="absolute right-6 bottom-8 w-[220px] h-[280px] rounded-3xl overflow-hidden shadow-2xl bg-[#FAF9F6] border border-[#1D493E]/10 rotate-6 transition-all duration-500 hover:rotate-0 hover:scale-105 group p-4 flex flex-col justify-between text-[#1D493E]">
              <div className="h-36 rounded-2xl overflow-hidden bg-[#FAF9F6]/50">
                <img 
                  src="https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=400&q=80" 
                  alt="Kasavu Saree" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="space-y-2 pt-2">
                <span className="text-[8px] font-black text-[#E05434] uppercase tracking-widest block">Authentic Apparel</span>
                <h4 className="font-serif text-sm font-bold truncate">Premium Handspun Khadi Shirt</h4>
                <div className="flex justify-between items-center pt-1 border-t border-[#1D493E]/5">
                  <span className="text-xs font-black">₹2,490</span>
                  <span className="text-[8px] uppercase tracking-wider font-extrabold text-[#1D493E]/60 flex items-center gap-0.5">
                    Shop Now <ArrowUpRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Travel Experiences */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12">
          <div>
            <span className="text-xs font-black uppercase text-[#E05434] tracking-[0.2em] block mb-2">Handcrafted Itineraries</span>
            <h2 className="text-4xl md:text-5xl font-light font-serif text-[#1D493E]">Featured Voyages</h2>
          </div>
          <Link 
            href="/travel"
            className="text-[#1D493E] font-black text-xs uppercase tracking-widest flex items-center gap-2 group hover:text-[#E05434] transition pb-1 border-b border-[#1D493E]/20 hover:border-[#E05434]/40"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {DESTINATIONS.slice(0, 2).map((dest) => (
            <div 
              key={dest.id}
              className="group bg-[#FAF9F6] rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#D97706]/20 transition-all duration-500 border border-[#1D493E]/10 flex flex-col md:flex-row h-full"
            >
              <div className="md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                <img 
                  src={dest.image} 
                  alt={dest.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute top-4 left-4 glass py-1.5 px-4 rounded-full flex items-center gap-1.5 text-xs font-extrabold text-[#1D493E] border border-[#1D493E]/10">
                  <MapPin className="w-3.5 h-3.5 text-[#E05434]" />
                  {dest.name}, India
                </div>
              </div>
              
              <div className="md:w-1/2 p-8 flex flex-col justify-between bg-[#FAF9F6]">
                <div className="space-y-4">
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#E05434] bg-[#E05434]/8 py-1.5 px-3 rounded-lg border border-[#E05434]/15 inline-block">
                    {dest.season}
                  </span>
                  <h3 className="text-2xl font-light text-[#1D493E] leading-snug group-hover:text-[#E05434] transition font-serif">
                    {dest.name} Cruise
                  </h3>
                  <p className="text-[#1D493E]/75 text-xs leading-relaxed line-clamp-3">
                    {dest.desc}
                  </p>
                  
                  {/* Highlights */}
                  <div className="space-y-2 pt-2">
                    {dest.attractions.slice(0, 2).map((hl, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-[#1D493E]/85 text-xs font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E05434]" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#1D493E]/8 mt-8 pt-5 flex justify-between items-center">
                  <div>
                    <span className="text-[9px] uppercase font-black text-[#1D493E]/45">Starting From</span>
                    <p className="text-xl font-extrabold text-[#1D493E]">
                      ₹{dest.id === 'kerala' ? '16,500' : '24,900'}
                      <span className="text-xs font-normal text-[#1D493E]/60">/pp</span>
                    </p>
                  </div>
                  <Link
                    href={`/travel/${dest.id}`}
                    className="px-5 py-3 bg-[#1D493E] hover:bg-[#E05434] text-white text-xs font-black uppercase tracking-wider rounded-xl transition duration-300 shadow-sm"
                  >
                    Book Trip
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Philosophy Banner */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-[#FFFF80]/15 border border-[#D97706]/20 rounded-[40px] p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden">
          <div className="space-y-5 max-w-2xl relative z-10">
            <span className="text-xs font-black uppercase text-[#E05434] tracking-[0.2em] flex items-center gap-2">
              <Sparkles className="w-4 h-4 fill-[#E05434] stroke-none" />
              Community Brand Philosophy
            </span>
            <h2 className="text-3xl md:text-4xl font-light font-serif text-[#1D493E]">
              Built for Nomads & Outdoor Seekers
            </h2>
            <p className="text-sm md:text-base text-[#1D493E]/80 leading-relaxed font-normal">
              We design casual lifestyle apparel that moves effortlessly with you. From journals and keychains to travel pillows and Khadi shirts, every piece is made to spark wanderlust and reflect a deep connection to local communities.
            </p>
          </div>
          <Link
            href="/about"
            className="px-7 py-4 bg-[#1D493E] hover:bg-[#E05434] text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition duration-300 shadow-md flex items-center gap-2 whitespace-nowrap self-stretch md:self-auto text-center justify-center relative z-10"
          >
            Meet the Tribe
            <ArrowRight className="w-4 h-4" />
          </Link>
          {/* Subtle background graphic */}
          <div className="absolute right-0 bottom-0 w-48 h-48 opacity-[0.03] bg-[radial-gradient(#1D493E_2px,transparent_2px)] [background-size:12px_12px] pointer-events-none" />
        </div>
      </section>

      {/* Shop Catalog */}
      <section id="bazaar" className="max-w-7xl mx-auto px-6 pt-8 scroll-mt-24">
        <div className="text-center space-y-4 mb-14">
          <span className="text-xs font-black uppercase text-[#E05434] tracking-[0.2em]">Banjara Bazaar</span>
          <h2 className="text-4xl md:text-5xl font-light font-serif text-[#1D493E]">Shop Local Traditions</h2>
          <p className="text-sm text-[#1D493E]/70 max-w-lg mx-auto leading-relaxed">
            Bring home authentic regional treasures, from fresh sun-cured Malabar spices to organic Khadi shirts and premium travel accessories.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white border border-[#1D493E]/8 p-4 rounded-[24px] mb-12 shadow-sm">
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {['all', 'spices', 'apparel', 'tea-coffee', 'handicrafts'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`py-2 px-5 rounded-xl font-black text-xs uppercase tracking-wider transition whitespace-nowrap ${
                  categoryFilter === cat
                    ? 'bg-[#1D493E] text-white shadow-sm'
                    : 'text-[#1D493E]/60 hover:bg-[#F3FFEF] hover:text-[#1D493E]'
                }`}
              >
                {cat === 'all' ? 'All Products' : cat.replace('-', ' & ')}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#1D493E]/40 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search spices, khadi, tea..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#1D493E]/10 focus:border-[#1D493E] transition text-sm text-[#1D493E] placeholder-[#1D493E]/45"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((prod) => (
            <div 
              key={prod.id}
              className="group bg-[#FAF9F6] rounded-[28px] overflow-hidden border border-[#1D493E]/10 hover:border-[#D97706]/40 hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
            >
              <div className="relative overflow-hidden aspect-[4/3] bg-[#FAF9F6]/50">
                <img 
                  src={prod.image} 
                  alt={prod.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#FAF9F6] text-[#1D493E] font-black text-[8px] uppercase tracking-widest px-2.5 py-1.5 rounded-md border border-[#1D493E]/8 shadow-sm">
                  {prod.category.replace('-', ' & ')}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-[#D97706] text-xs">
                    <Star className="w-3.5 h-3.5 fill-[#D97706] stroke-none" />
                    <span className="font-extrabold text-[#1D493E]">{prod.rating}</span>
                  </div>
                  <h3 className="font-bold text-[#1D493E] text-base leading-snug line-clamp-1 group-hover:text-[#E05434] transition font-serif">
                    {prod.name}
                  </h3>
                  <p className="text-[#1D493E]/70 text-xs leading-relaxed line-clamp-2">
                    {prod.description}
                  </p>
                </div>

                <div className="flex justify-between items-center border-t border-[#1D493E]/5 pt-4">
                  <div>
                    <span className="text-[9px] uppercase font-black text-[#1D493E]/45">Price</span>
                    <p className="text-base font-extrabold text-[#1D493E]">₹{prod.price.toLocaleString('en-IN')}</p>
                  </div>
                  <button
                    onClick={() => addToCart(prod, 'shop')}
                    className="p-3 bg-[#1D493E] text-white rounded-xl hover:bg-[#E05434] hover:scale-105 transition-all duration-300 flex items-center justify-center cursor-pointer"
                    aria-label="Add to cart"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
