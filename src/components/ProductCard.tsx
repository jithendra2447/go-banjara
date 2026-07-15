'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (prod: any) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  let img = product.image;
  if (!img || img === 'undefined' || img.trim() === '') {
    img = '/around_the_world_sticker.jpg';
  }

  // Clean up absolute paths or local storage entries to make sure they are relative to the public folder
  if (img.includes('explore_more_keychain.png')) {
    img = '/explore_more_keychain.png';
  } else if (img.includes('go_banjara_tshirt.jpg')) {
    img = '/go_banjara_tshirt.jpg';
  } else if (img.includes('naturally_nomad_badge.png')) {
    img = '/naturally_nomad_badge.png';
  } else if (img.includes('around_the_world_sticker.jpg')) {
    img = '/around_the_world_sticker.jpg';
  } else if (img.includes('blue_mavin_slides.jpg')) {
    img = '/blue_mavin_slides.jpg';
  } else if (img.includes('banjara_slides.jpg')) {
    img = '/banjara_slides.jpg';
  } else if (img.includes('wakefit_pillow.jpg')) {
    img = '/wakefit_pillow.jpg';
  } else if (img.includes('fur_jaden_backpack.jpg')) {
    img = '/fur_jaden_backpack.jpg';
  } else if (img.includes('go_passport_cover.jpg')) {
    img = '/go_passport_cover.jpg';
  } else if (img.includes('banjara_luggage_tag.jpg')) {
    img = '/banjara_luggage_tag.jpg';
  } else if (img.includes('banjara_blue_slides.png')) {
    img = '/banjara_blue_slides.png';
  } else if (!img.startsWith('/') && !img.startsWith('http')) {
    img = '/' + img;
  }

  // Setup a list of 5 fallback images for indicators
  const images = [
    img,
    img.includes('badge') ? '/around_the_world_sticker.jpg' : (img.includes('keychain') ? '/explore_more_keychain.png?v=1' : (img.includes('tshirt') ? '/go_banjara_tshirt.jpg?v=1' : (img.includes('slides') || img.includes('mavin') ? '/blue_mavin_slides.jpg' : img + '?v=1'))),
    img.includes('slides') || img.includes('mavin') ? '/banjara_blue_slides.png' : img + '?v=2',
    img.includes('badge') ? '/around_the_world_sticker.jpg?v=2' : (img.includes('keychain') ? '/explore_more_keychain.png?v=2' : (img.includes('tshirt') ? '/go_banjara_tshirt.jpg?v=2' : (img.includes('slides') || img.includes('mavin') ? '/blue_mavin_slides.jpg?v=2' : img + '?v=3'))),
    img + '?v=4'
  ];

  const rating = product.rating || 5;
  const reviewsCount = product.reviewsCount || 120;
  const boughtText = product.boughtCount || "200+ bought in past month";

  const mockProduct = {
    id: product.id,
    name: product.name,
    price: product.price,
    image: img,
    category: product.category,
    rating: rating,
    reviewsCount: reviewsCount,
    description: product.description || "Deal of the day product"
  };

  return (
    <div className="bg-white rounded-[4px] w-full md:h-[627.68px] flex flex-col justify-between gap-[24px] hover:shadow-xs transition duration-300 overflow-hidden">
      {/* Image Container with Dots (Width: 339px, Height: 254px, Radius: 4px) */}
      <div className="relative w-full md:h-[254px] rounded-[4px] overflow-hidden shrink-0">
        <img 
          src={images[activeImgIdx]} 
          alt={product.name} 
          className="w-full h-full object-cover"
          style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)' }}
        />
        {/* Dots indicator */}
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_: string, dotIdx: number) => {
            const isActive = activeImgIdx === dotIdx;
            return (
              <button
                key={dotIdx}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setActiveImgIdx(dotIdx);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                  isActive ? 'bg-[#1D493E] scale-110' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${dotIdx + 1}`}
              />
            );
          })}
        </div>
      </div>

      {/* Details Block (Width: 339px, Height: 350px) */}
      <div className="w-full md:h-[349.68px] flex flex-col justify-between text-left">
        {/* Category Tag (Height: 28px, Radius: 4px, Padding: 4px vertical, 8px horizontal, Background: #FF623E/8, Text: #FF623E) */}
        <span className="inline-flex items-center justify-center h-[28px] rounded-[4px] px-[8px] py-[4px] text-[14px] font-sans font-medium text-[#FF623E] bg-[#FF623E]/8 self-start">
          {product.category}
        </span>
        
        {/* Title & Price Row (Width: 339px, Height: 35px, Justify: space-between, Font: Faktum 20px, Weight: 600, Color: #2B2B2B) */}
        <div className="w-full h-[35px] flex justify-between items-center gap-2">
          <h4 className="text-[20px] font-sans font-semibold text-[#2B2B2B] truncate hover:text-[#FF5A36] transition-colors">
            <Link href={`/shop/product/${product.id}`}>
              {product.name}
            </Link>
          </h4>
          <div className="flex items-center gap-2.5 shrink-0">
            {product.originalPrice && (
              <span className="text-gray-400 line-through text-base font-medium">₹{product.originalPrice}</span>
            )}
            <span className="text-[20px] font-sans font-semibold text-[#2B2B2B]">₹{product.price}</span>
          </div>
        </div>

        {/* Rating Row (Gap: 12px, Stars: 20px, Reviews: 20px Faktum Medium) */}
        <div className="flex items-center gap-[12px] h-[20px] shrink-0">
          <div className="flex text-amber-400 gap-0.5">
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
          </div>
          <span className="text-[20px] font-sans font-medium text-[#2B2B2B] leading-none">
            ({reviewsCount} Reviews)
          </span>
        </div>

        {/* Bought statistics (Height: 25px, Font: Faktum 20px, Weight: 500, Color: #8D8D8D) */}
        <p className="font-sans font-medium text-[20px] leading-none text-[#8D8D8D] h-[25px] flex items-center shrink-0">{boughtText}</p>

        {/* Delivery text (Font: Faktum 20px, Weight: 500, Line-height: 28px, Color split) */}
        <p className="font-sans font-medium text-[20px] leading-[28px]">
          <span className="text-[#8D8D8D]">FREE delivery as soon as </span>
          <span className="text-[#2B2B2B]">Thu, 9 Apr, 7 am - 10 pm</span>
        </p>

        {/* Add to Cart Button (Width: 296px, Height: 60px, Padding: 16px vertical, 32px horizontal, Border: 2px, Radius: 4px, Gap: 8px) */}
        <button
          onClick={() => {
            onAddToCart(mockProduct);
            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 2000);
          }}
          className="w-full h-[60px] pt-[16px] pr-[32px] pb-[16px] pl-[32px] gap-[8px] rounded-[4px] border-2 border-[#1D493E] hover:bg-[#1D493E] hover:text-white text-[#1D493E] text-[16px] font-bold transition flex items-center justify-center cursor-pointer"
        >
          <span>{isAdded ? 'Added to Cart!' : 'Add to cart'}</span>
          <svg 
            style={{ width: '28px', height: '28px' }} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.75" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="shrink-0"
          >
            <path d="M3 3h2l.4 2" />
            <path d="M7 13h10l4-8H5.4" />
            <path d="M7 13L5.4 5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
