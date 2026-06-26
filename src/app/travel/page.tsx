'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass, Sparkles, Volume2, VolumeX, ArrowLeftRight, ExternalLink } from 'lucide-react';
import { DESTINATIONS } from '@/data/destinations';
import { useCart } from '@/components/providers';

export default function TravelHub() {
  const { addToCart } = useCart();
  const [activeIdx, setActiveIdx] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [tiltProps, setTiltProps] = useState({ rotateX: 0, rotateY: 0, activeCard: '' });

  const currentPlace = DESTINATIONS[activeIdx];

  // Calculate 3D Mouse Tilt relative to the card's dimensions
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, cardId: string) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 15; // tilt max 15 degrees
    const rotateX = -((y - centerY) / centerY) * 15;

    setTiltProps({ rotateX, rotateY, activeCard: cardId });
  };

  const handleMouseLeave = () => {
    setTiltProps({ rotateX: 0, rotateY: 0, activeCard: '' });
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % DESTINATIONS.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + DESTINATIONS.length) % DESTINATIONS.length);
  };

  const handleQuickBook = (dest: typeof currentPlace) => {
    const mockPackage = {
      id: `pkg-${dest.id}`,
      name: `${dest.name} Discovery Package`,
      price: dest.id === 'kerala' ? 16500 : dest.id === 'kashmir' ? 24900 : 18500,
      image: dest.image,
    };
    addToCart(mockPackage, 'travel', '2026-10-12', 2);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col justify-between overflow-x-hidden relative py-12 font-sans space-y-16">
      
      {/* Dynamic Ambient Background Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none transition-all duration-1000">
        <div className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-r ${currentPlace.color} opacity-20 blur-[130px] transition-all duration-1000`} />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-900/10 rounded-full blur-[100px]" />
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:32px_32px] opacity-80" />
      </div>

      <div className="max-w-7xl mx-auto px-4 w-full relative z-10 space-y-16">
        
        {/* Header Controls */}
        <div className="flex justify-between items-start md:items-center">
          <div className="space-y-1">
            <span className="badge bg-brand-orange/20 text-brand-orange border border-brand-orange/30 flex items-center gap-1.5 w-fit px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
              India Places Showcase
            </span>
            <h1 className="text-3xl md:text-5xl font-black font-serif text-slate-100 mt-1.5">Go Banjāra Explorer</h1>
          </div>
          
          {/* Ambient Sound Toggle */}
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-3 rounded-full border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition duration-300 flex items-center gap-2 text-[10px] font-black tracking-widest"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-brand-yellow animate-bounce" />
                <span>SOUND ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-500" />
                <span>MUTED</span>
              </>
            )}
          </button>
        </div>



        {/* SECTION 2: 3D CARD DECK SHOWCASE */}
        <section className="grid lg:grid-cols-12 gap-12 items-center min-h-[420px]">
          
          {/* Left: Info Panel */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-brand-orange font-black uppercase tracking-[0.25em] text-xs block">
              {currentPlace.sub}
            </span>
            <h2 className="text-4xl md:text-6xl font-black font-serif leading-tight">
              {currentPlace.name}
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              {currentPlace.desc}
            </p>

            {/* Highlights */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs uppercase font-black text-slate-500 tracking-wider">Key Highlights</h4>
              <div className="flex flex-wrap gap-2.5">
                {currentPlace.attractions.map((att, i) => (
                  <span 
                    key={i} 
                    className="py-2 px-4 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/10 transition-colors"
                  >
                    {att}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {currentPlace.id === 'kerala' ? (
                <Link
                  href="/travel/kerala"
                  className="px-6 py-3.5 bg-brand-orange hover:bg-brand-bright-orange text-white font-extrabold text-sm rounded-xl shadow-lg shadow-brand-orange/20 hover:scale-[1.02] flex items-center justify-center gap-2 group transition-all duration-300 text-center"
                >
                  Start Backwater Cruise
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              ) : currentPlace.id === 'kashmir' ? (
                <Link
                  href="/travel/kashmir"
                  className="px-6 py-3.5 bg-brand-orange hover:bg-brand-bright-orange text-white font-extrabold text-sm rounded-xl shadow-lg shadow-brand-orange/20 hover:scale-[1.02] flex items-center justify-center gap-2 group transition-all duration-300 text-center"
                >
                  Explore Snowy Kashmir
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              ) : (
                <button
                  onClick={() => handleQuickBook(currentPlace)}
                  className="px-6 py-3.5 bg-brand-orange hover:bg-brand-bright-orange text-white font-extrabold text-sm rounded-xl shadow-lg shadow-brand-orange/20 hover:scale-[1.02] flex items-center justify-center gap-2 group transition-all duration-300 text-center"
                >
                  Book Discovery Trip
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
              {currentPlace.id !== 'kerala' && currentPlace.id !== 'ladakh' && currentPlace.id !== 'kashmir' && (
                <p className="text-[10px] text-slate-500 italic max-w-[200px] leading-tight">
                  *Only Kerala and Ladakh feature customized weather backdrops.
                </p>
              )}
              {currentPlace.id === 'ladakh' && (
                <Link
                  href="/travel/ladakh"
                  className="px-6 py-3.5 border-2 border-white/20 hover:border-white/50 text-white font-extrabold text-sm rounded-xl transition duration-300 text-center flex items-center justify-center gap-2"
                >
                  Explore Snowy Ladakh
                  <ExternalLink className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>

          {/* Right: 3D Card Deck Carousel */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[420px]">
            {/* Carousel navigation indicators */}
            <div className="flex gap-4 mb-6 z-10 absolute -top-8 right-0">
              <button 
                onClick={handlePrev}
                className="w-10 h-10 rounded-full border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition hover:scale-105"
                aria-label="Previous destination"
              >
                ←
              </button>
              <button 
                onClick={handleNext}
                className="w-10 h-10 rounded-full border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition hover:scale-105"
                aria-label="Next destination"
              >
                →
              </button>
            </div>

            {/* 3D Stack */}
            <div className="w-full max-w-sm h-[380px] relative perspective-1000 flex items-center justify-center">
              {DESTINATIONS.map((place, idx) => {
                let offset = idx - activeIdx;
                if (offset < -2) offset += DESTINATIONS.length;
                if (offset > 2) offset -= DESTINATIONS.length;
                
                const isActive = idx === activeIdx;
                const isVisible = Math.abs(offset) <= 1.5;

                if (!isVisible) return null;

                const rotateY = offset * 24;
                const translateZ = isActive ? 0 : -100;
                const translateX = offset * 130;
                const scale = isActive ? 1 : 0.85;
                const opacity = isActive ? 1 : 0.35;
                const zIndex = isActive ? 10 : 5;
                const filter = isActive ? 'none' : 'blur(6px)';

                const customStyle: React.CSSProperties = isActive && tiltProps.activeCard === place.id ? {
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY + tiltProps.rotateY}deg) rotateX(${tiltProps.rotateX}deg) scale(${scale})`,
                  transition: 'none',
                  zIndex,
                  opacity,
                  filter
                } : {
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  zIndex,
                  opacity,
                  filter
                };

                return (
                  <div
                    key={place.id}
                    onClick={() => {
                      if (isActive) {
                        if (place.id === 'kerala') {
                          window.location.href = '/travel/kerala';
                        } else if (place.id === 'ladakh') {
                          window.location.href = '/travel/ladakh';
                        } else if (place.id === 'kashmir') {
                          window.location.href = '/travel/kashmir';
                        } else {
                          handleQuickBook(place);
                        }
                      } else {
                        setActiveIdx(idx);
                      }
                    }}
                    onMouseMove={(e) => isActive && handleMouseMove(e, place.id)}
                    onMouseLeave={handleMouseLeave}
                    style={customStyle}
                    className={`absolute w-[290px] h-[360px] rounded-3xl overflow-hidden cursor-pointer shadow-2xl border ${
                      isActive ? 'border-white/20' : 'border-white/5'
                    } bg-[#111827] group`}
                  >
                    <div className="w-full h-full relative">
                      <img 
                        src={place.image} 
                        alt={place.name} 
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />
                      
                      {isActive && soundEnabled && (
                        <div className="absolute top-4 right-4 flex items-end gap-0.5 h-4">
                          <span className="w-0.5 bg-brand-yellow animate-[float_0.8s_infinite] h-3" />
                          <span className="w-0.5 bg-brand-yellow animate-[float_1.2s_infinite] h-4" />
                          <span className="w-0.5 bg-brand-yellow animate-[float_0.9s_infinite] h-2.5" />
                        </div>
                      )}

                      <div className="absolute bottom-0 left-0 w-full p-5 space-y-2">
                        <div className="flex items-center gap-1.5 text-[9px] text-brand-yellow font-black uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5 fill-brand-yellow" />
                          <span>{place.sub}</span>
                        </div>
                        <h3 className="text-2xl font-black font-serif text-white">{place.name}</h3>
                        <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                          {place.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Info footer */}
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p className="flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4" />
            Drag, click or navigate arrow buttons to rotate the 3D Sphere of destinations.
          </p>
          <p>© 2026 GO BANJARA. All region packages are fully verified.</p>
        </div>
      </div>
    </div>
  );
}
