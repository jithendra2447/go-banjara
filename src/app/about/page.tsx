'use client';

import React from 'react';
import { Shield, Heart, Compass, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-24 font-sans">
      {/* Banner */}
      <section className="bg-primary-dark text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-yellow/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4 relative z-10">
          <span className="badge bg-brand-orange/20 text-brand-orange border border-brand-orange/30 font-black text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Our Tribe&apos;s Story
          </span>
          <h1 className="text-4xl md:text-6xl font-black font-serif text-slate-100">The Banjāra Way</h1>
          <p className="text-brand-beige/80 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Go Banjara is born out of a desire to unite India’s exquisite localized crafts and spices with immersive, slow-paced cultural journeys.
          </p>
        </div>
      </section>

      {/* Philosophy cards */}
      <section className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8">
        <div className="p-8 bg-white border border-primary-dark/8 rounded-3xl space-y-4 hover:shadow-lg transition duration-300">
          <div className="w-12 h-12 bg-brand-yellow/20 rounded-xl flex items-center justify-center text-primary-dark border border-brand-yellow/30">
            <Heart className="w-6 h-6 text-brand-orange" />
          </div>
          <h3 className="text-xl font-black text-primary-dark font-serif">Artisan First</h3>
          <p className="text-primary-dark/70 text-xs md:text-sm leading-relaxed">
            Every product in our bazaar is sourced directly from cooperative farmers and weavers. We bypass middle channels to return maximum value to local communities.
          </p>
        </div>

        <div className="p-8 bg-white border border-primary-dark/8 rounded-3xl space-y-4 hover:shadow-lg transition duration-300">
          <div className="w-12 h-12 bg-brand-seaweed/10 rounded-xl flex items-center justify-center text-brand-seaweed border border-brand-seaweed/25">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-primary-dark font-serif">Slow Tourism</h3>
          <p className="text-primary-dark/70 text-xs md:text-sm leading-relaxed">
            Our itineraries respect regional paces. We favor traditional home-stays, organic farming cooperatives, and local guides over high-impact commercial tours.
          </p>
        </div>

        <div className="p-8 bg-white border border-primary-dark/8 rounded-3xl space-y-4 hover:shadow-lg transition duration-300">
          <div className="w-12 h-12 bg-brand-lavender/10 rounded-xl flex items-center justify-center text-brand-lavender border border-brand-lavender/25">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-primary-dark font-serif">Heritage Safeguard</h3>
          <p className="text-primary-dark/70 text-xs md:text-sm leading-relaxed">
            Whether it is protecting the ancient art of sorting spices or traditional wooden boatbuilding in Kerala, we actively document and support indigenous skills.
          </p>
        </div>
      </section>

      {/* Immersive detailed text */}
      <section className="max-w-4xl mx-auto px-4 bg-white border border-primary-dark/8 p-8 md:p-12 rounded-3xl flex flex-col md:flex-row gap-8 items-center">
        <img 
          src="https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=500&q=80" 
          alt="Weaver handloom" 
          className="w-full md:w-1/3 aspect-[4/5] object-cover rounded-2xl border border-primary-dark/5 shadow-sm"
        />
        <div className="space-y-4">
          <span className="text-brand-orange font-black uppercase tracking-widest text-xs flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 fill-brand-orange" />
            Direct Partnerships
          </span>
          <h2 className="text-3xl font-black font-serif text-primary-dark leading-snug">Empowering Rural Craftsmanship</h2>
          <p className="text-primary-dark/80 text-sm leading-relaxed">
            India is home to thousands of regional craft ecosystems that have endured for centuries. From the indigo dye vats of Rajasthan to the handlooms of Kerala, these art forms are highly sustainable, low-impact, and beautifully unique. 
          </p>
          <p className="text-primary-dark/80 text-sm leading-relaxed">
            Go Banjara serves as a bridge, giving you access to these genuine masterpieces while financing workshop upgrades and school initiatives in rural villages.
          </p>
        </div>
      </section>
    </div>
  );
}
