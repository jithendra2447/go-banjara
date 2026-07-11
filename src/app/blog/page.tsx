'use client';

import React from 'react';
import Link from 'next/link';
import { Hammer, ArrowLeft } from 'lucide-react';

export default function BlogPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#F3FFEF] px-6 py-20 font-sans">
      <div className="max-w-md w-full bg-white border border-[#1D493E]/10 rounded-[32px] p-8 md:p-10 text-center space-y-6 shadow-sm">
        
        {/* Animated Building Icon */}
        <div className="w-16 h-16 rounded-full bg-[#FF5A36]/10 text-[#FF5A36] flex items-center justify-center mx-auto border border-[#FF5A36]/20 animate-bounce">
          <Hammer className="w-8 h-8" />
        </div>

        {/* Header Text */}
        <div className="space-y-3">
          <span className="inline-block text-[#FF5A36] bg-[#FF5A36]/10 px-2.5 py-1 rounded-[4px] text-xs font-bold uppercase tracking-wider">
            Coming Soon
          </span>
          <h1 className="text-3xl font-serif font-black text-[#1D493E] leading-tight">
            Still Building.
          </h1>
          <p className="text-gray-500 text-sm font-semibold leading-relaxed">
            Our team of nomads is currently on the road, weaving this experience together. Check back soon for the next drop!
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="pt-4 flex flex-col gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[#1D493E] hover:bg-[#15342c] text-white px-6 py-3 rounded-lg font-bold text-sm transition-all shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back Home</span>
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center border border-[#1D493E] text-[#1D493E] hover:bg-[#1D493E]/5 px-6 py-3 rounded-lg font-bold text-sm transition-all cursor-pointer"
          >
            Explore Shop
          </Link>
        </div>

      </div>
    </div>
  );
}
