'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/components/providers';

interface ProductCardProps {
  product: Product;
  onAddToCart: (prod: any) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { wishlist, toggleWishlist } = useCart();
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const isWishlisted = Array.isArray(wishlist) && wishlist.some((w: any) => w.id === product.id);

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
    <div 
      style={{
        width: "100%",
        backgroundColor: "rgba(255, 255, 255, 1)",
        borderRadius: "4px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
      }}
      className="min-h-0 sm:min-h-[560px] h-full gap-3 sm:gap-4 p-2 sm:p-0 border sm:border-none border-slate-100 rounded-lg sm:rounded-none shadow-xs sm:shadow-none"
    >
      {/* Image Container */}
      <div 
        style={{
          position: "relative",
          width: "100%",
          borderRadius: "4px",
          overflow: "hidden",
          flexShrink: 0,
          backgroundColor: "rgba(245, 245, 245, 1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        className="h-[170px] sm:h-[254px]"
      >
        <Link 
          href={`/shop/product/${product.id}`}
          style={{ width: "100%", height: "100%", display: "block" }}
        >
          <img 
            src={images[activeImgIdx]} 
            alt={product.name} 
            loading="lazy"
            decoding="async"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              imageRendering: '-webkit-optimize-contrast',
            }}
          />
        </Link>
        {/* Wishlist Button (Top Right) */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(mockProduct);
          }}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(4px)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 20,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
            transition: "all 0.2s ease",
          }}
          className="w-7 h-7 sm:w-[34px] sm:h-[34px] hover:scale-110 active:scale-95 group"
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart 
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
              isWishlisted 
                ? 'text-red-500 fill-red-500' 
                : 'text-slate-600 group-hover:text-red-500'
            }`} 
          />
        </button>

      </div>

      {/* Details Block */}
      <div className="w-full flex flex-col justify-between gap-2 sm:gap-3 text-left flex-1 h-auto sm:h-[350px]">
        
        {/* Top Header: Category Tag & Price */}
        <div className="flex flex-col gap-1.5 w-full">
          <div className="flex items-center justify-between gap-2 w-full">
            <span 
              style={{
                borderRadius: "4px",
                fontFamily: "Faktum, sans-serif",
                fontWeight: 500,
                color: "rgba(255, 98, 62, 1)",
                backgroundColor: "rgba(255, 98, 62, 0.08)",
              }}
              className="inline-flex items-center px-2 py-0.5 text-xs sm:text-sm h-6 sm:h-[28px]"
            >
              {product.category}
            </span>

            <div className="flex items-center gap-1.5 shrink-0">
              {product.originalPrice && (
                <span style={{ color: "rgba(141, 141, 141, 1)", textDecoration: "line-through" }} className="text-xs sm:text-[18px] font-medium font-sans">
                  ₹{product.originalPrice}
                </span>
              )}
              <span style={{ color: "rgba(43, 43, 43, 1)" }} className="text-base sm:text-[24px] font-semibold font-sans">
                ₹{product.price}
              </span>
            </div>
          </div>

          <h4 className="m-0 text-sm sm:text-[20px] font-semibold text-slate-800 line-clamp-1 truncate font-sans">
            <Link href={`/shop/product/${product.id}`} className="hover:text-[#1D493E] transition-colors">
              {product.name}
            </Link>
          </h4>
        </div>

        {/* Rating Row */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <div className="flex gap-0.5">
            <Star className="w-3.5 h-3.5 sm:w-5 sm:h-5 fill-[#FFC72C] text-transparent" />
            <Star className="w-3.5 h-3.5 sm:w-5 sm:h-5 fill-[#FFC72C] text-transparent" />
            <Star className="w-3.5 h-3.5 sm:w-5 sm:h-5 fill-[#FFC72C] text-transparent" />
            <Star className="w-3.5 h-3.5 sm:w-5 sm:h-5 fill-[#FFC72C] text-transparent" />
            <Star className="w-3.5 h-3.5 sm:w-5 sm:h-5 fill-[#FFC72C] text-transparent" />
          </div>
          <span style={{ color: "rgba(43, 43, 43, 1)" }} className="text-xs sm:text-[18px] font-medium font-sans leading-none">
            ({reviewsCount})
          </span>
        </div>

        {/* Bought statistics (Hidden on Mobile to keep card compact) */}
        <p style={{ margin: 0, color: "rgba(141, 141, 141, 1)" }} className="hidden sm:flex text-sm sm:text-[20px] font-medium items-center shrink-0">
          {boughtText}
        </p>

        {/* Delivery text (Hidden on Mobile to keep card compact) */}
        <p style={{ margin: 0 }} className="hidden sm:block text-xs sm:text-[18px] leading-relaxed font-medium">
          <span style={{ color: "rgba(141, 141, 141, 1)" }}>FREE delivery as soon as </span>
          <span style={{ color: "rgba(43, 43, 43, 1)" }}>Thu, 9 Apr</span>
        </p>

        {/* Add to Cart Button */}
        <button
          onClick={() => {
            onAddToCart(mockProduct);
            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 2000);
          }}
          style={{
            width: "100%",
            borderRadius: "4px",
            border: "2px solid rgba(29, 73, 62, 1)",
            backgroundColor: "transparent",
            color: "rgba(29, 73, 62, 1)",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          className="h-[42px] sm:h-[60px] py-2 sm:py-4 px-3 sm:px-8 text-xs sm:text-base mt-auto shrink-0"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(29, 73, 62, 1)";
            e.currentTarget.style.color = "white";
            const paths = e.currentTarget.querySelectorAll('path, circle');
            paths.forEach((p: any) => p.style.stroke = 'white');
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "rgba(29, 73, 62, 1)";
            const paths = e.currentTarget.querySelectorAll('path, circle');
            paths.forEach((p: any) => p.style.stroke = 'rgba(29, 73, 62, 1)');
          }}
        >
          <span>{isAdded ? 'Added!' : 'Add to cart'}</span>
          <svg 
            viewBox="0 0 28 28" 
            fill="none" 
            strokeWidth="1.75" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="w-4 h-4 sm:w-7 sm:h-7 shrink-0"
          >
            <path 
              d="M4 5h3l2 11h11l2.5-9H14" 
              style={{ stroke: "rgba(29, 73, 62, 1)", transition: "stroke 0.2s ease" }}
            />
            <path 
              d="M7.8 8.5H9.5" 
              style={{ stroke: "rgba(29, 73, 62, 1)", transition: "stroke 0.2s ease" }}
            />
            <circle 
              cx="10.5" 
              cy="21.5" 
              r="2" 
              style={{ stroke: "rgba(29, 73, 62, 1)", transition: "stroke 0.2s ease" }}
            />
            <circle 
              cx="17.5" 
              cy="21.5" 
              r="2" 
              style={{ stroke: "rgba(29, 73, 62, 1)", transition: "stroke 0.2s ease" }}
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
