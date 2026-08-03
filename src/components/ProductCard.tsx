'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, Heart } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/components/providers';
import { useDeliveryDate } from '@/utils/dateUtils';
import { CartIcon } from '@/components/CartIcon';

interface ProductCardProps {
  product: Product;
  onAddToCart: (prod: any) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { wishlist, toggleWishlist, addRecentlyViewed } = useCart();
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const deliveryDate = useDeliveryDate(6);

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
    <>
      {/* 1. MOBILE COMPACT CARD VIEW (sm:hidden) - Exact Most Selling design from Homepage */}
      <div className="flex sm:hidden flex-col w-full bg-white rounded-[4px] border border-gray-100/80 shadow-2xs overflow-hidden text-left relative group">
        <Link href={`/shop/product/${product.id}`} onClick={() => addRecentlyViewed(mockProduct)} className="w-full block">
          <div className="relative w-full h-[130px] rounded-t-[4px] overflow-hidden bg-gray-50 shrink-0">
            <img 
              src={images[activeImgIdx]} 
              alt={product.name} 
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              style={{ imageRendering: '-webkit-optimize-contrast' }}
            />
            {/* Wishlist Heart */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(mockProduct);
              }}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center border-none shadow-xs z-10"
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart 
                className={`w-3.5 h-3.5 transition-colors ${
                  isWishlisted 
                    ? 'text-red-500 fill-red-500' 
                    : 'text-slate-600'
                }`} 
              />
            </button>
          </div>

          <div className="flex flex-col gap-[4px] py-2 px-0 bg-white">
            <span className="bg-[#FF5A36] text-white px-1.5 py-0.5 rounded-[3px] text-[9px] font-bold self-start leading-none uppercase">
              {product.category || 'Badges'}
            </span>

            <h4 className="text-[12px] font-bold text-[#2B2B2B] leading-tight line-clamp-1 m-0">
              {product.name}
            </h4>

            <div className="flex items-baseline gap-1 pt-0.5">
              {product.originalPrice && (
                <span className="line-through text-gray-400 text-[9px]">₹{product.originalPrice}</span>
              )}
              <span className="text-[11px] font-bold text-[#2B2B2B]">₹{product.price}</span>
              <span className="text-[#FF5A36] text-[9px] font-semibold whitespace-nowrap">30% off</span>
            </div>

            <div className="flex items-center gap-1 text-[10px]">
              <div className="flex text-amber-400 gap-0.5">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} className="w-2.5 h-2.5 fill-current" />
                ))}
              </div>
              <span className="text-gray-500 font-medium text-[9px]">({reviewsCount})</span>
            </div>

            <p className="text-[9px] text-[#8D8D8D] font-medium m-0 truncate">
              {boughtText}
            </p>

            <p className="text-[9px] leading-tight m-0 truncate">
              <span className="text-[#8D8D8D]">FREE delivery </span>
              <span className="font-bold text-[#2B2B2B]">{deliveryDate}</span>
            </p>
          </div>
        </Link>

        {/* Compact Add to Cart Button */}
        <div className="px-0 pb-0 pt-0 bg-white">
          <button
            onClick={() => {
              onAddToCart(mockProduct);
              setIsAdded(true);
              setTimeout(() => setIsAdded(false), 2000);
            }}
            className="w-full h-[32px] rounded-[4px] border border-[#1D493E] text-[#1D493E] hover:bg-[#1D493E] hover:text-white text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>{isAdded ? 'Added!' : 'Add to cart'}</span>
            <CartIcon size={14} className="shrink-0" />
          </button>
        </div>
      </div>

      {/* 2. DESKTOP CARD VIEW (hidden sm:flex) - Full standard specs */}
      <div 
        style={{
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 1)",
          borderRadius: "4px",
          boxSizing: "border-box",
        }}
        className="hidden sm:flex min-h-[560px] h-full flex-col justify-between gap-4 p-0 border-none rounded-none shadow-none group cursor-pointer"
      >
        {/* Image Container */}
        <div 
          style={{
            position: "relative",
            width: "100%",
            borderRadius: "4px",
            flexShrink: 0,
            backgroundColor: "rgba(245, 245, 245, 1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="h-[254px] overflow-hidden"
        >
          <Link 
            href={`/shop/product/${product.id}`}
            onClick={() => addRecentlyViewed(mockProduct)}
            style={{ width: "100%", height: "100%", display: "block", overflow: "hidden" }}
          >
            <img 
              src={images[activeImgIdx]} 
              alt={product.name} 
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
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
            className="w-[34px] h-[34px] hover:scale-110 active:scale-95 group"
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart 
              className={`w-4 h-4 transition-colors ${
                isWishlisted 
                  ? 'text-red-500 fill-red-500' 
                  : 'text-slate-600 group-hover:text-red-500'
              }`} 
            />
          </button>
        </div>

        {/* Details Block - 0px horizontal padding */}
        <div className="w-full flex flex-col justify-between gap-3 text-left flex-1 h-[350px] px-0">
          
          {/* Top Header: Category Tag & Price */}
          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex items-center justify-between gap-2 w-full">
              <span 
                style={{
                  height: "28px",
                  borderRadius: "4px",
                  padding: "4px 10px",
                  fontFamily: "Faktum, sans-serif",
                  fontWeight: 500,
                  color: "rgba(255, 98, 62, 1)",
                  backgroundColor: "rgba(255, 98, 62, 0.08)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxSizing: "border-box",
                }}
                className="text-xs sm:text-sm whitespace-nowrap"
              >
                {product.category}
              </span>

              <div className="flex items-center gap-1.5 shrink-0">
                {product.originalPrice && (
                  <span style={{ color: "rgba(141, 141, 141, 1)", textDecoration: "line-through" }} className="text-[18px] font-medium font-sans">
                    ₹{product.originalPrice}
                  </span>
                )}
                <span style={{ color: "rgba(43, 43, 43, 1)" }} className="text-[24px] font-semibold font-sans">
                  ₹{product.price}
                </span>
              </div>
            </div>

            <h4 className="m-0 text-[20px] font-semibold text-slate-800 line-clamp-1 truncate font-sans">
              <Link href={`/shop/product/${product.id}`} className="hover:text-[#1D493E] transition-colors">
                {product.name}
              </Link>
            </h4>
          </div>

          {/* Rating Row */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex gap-0.5">
              <Star className="w-5 h-5 fill-[#FFC72C] text-transparent" />
              <Star className="w-5 h-5 fill-[#FFC72C] text-transparent" />
              <Star className="w-5 h-5 fill-[#FFC72C] text-transparent" />
              <Star className="w-5 h-5 fill-[#FFC72C] text-transparent" />
              <Star className="w-5 h-5 fill-[#FFC72C] text-transparent" />
            </div>
            <span style={{ color: "rgba(43, 43, 43, 1)" }} className="text-[18px] font-medium font-sans leading-none">
              ({reviewsCount})
            </span>
          </div>

          {/* Bought statistics */}
          <p style={{ margin: 0, color: "rgba(141, 141, 141, 1)" }} className="flex text-[20px] font-medium items-center shrink-0">
            {boughtText}
          </p>

          {/* Delivery text */}
          <p style={{ margin: 0 }} className="text-[18px] leading-relaxed font-medium">
            <span style={{ color: "rgba(141, 141, 141, 1)" }}>FREE delivery as soon as </span>
            <span style={{ color: "rgba(43, 43, 43, 1)", fontWeight: 700 }}>{deliveryDate}</span>
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
            className="h-[60px] py-4 px-4 text-base mt-auto shrink-0"
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
            <CartIcon size={28} className="shrink-0" />
          </button>
        </div>
      </div>
    </>
  );
}
