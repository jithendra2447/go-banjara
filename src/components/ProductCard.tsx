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
        height: "628px",
        backgroundColor: "rgba(255, 255, 255, 1)",
        borderRadius: "4px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "24px",
        boxSizing: "border-box",
      }}
    >
      {/* Image Container with Dots (Width: 339px, Height: 254px, Radius: 4px) */}
      <div 
        style={{
          position: "relative",
          width: "100%",
          height: "254px",
          borderRadius: "4px",
          overflow: "hidden",
          flexShrink: 0,
          backgroundColor: "rgba(245, 245, 245, 1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Link 
          href={`/shop/product/${product.id}`}
          style={{ width: "100%", height: "100%", display: "block" }}
        >
          <img 
            src={images[activeImgIdx]} 
            alt={product.name} 
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
            width: "34px",
            height: "34px",
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
          className="hover:scale-110 active:scale-95 group"
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

      {/* Details Block (Width: 339px, Height: 350px) */}
      <div style={{ width: "100%", height: "350px", display: "flex", flexDirection: "column", justifyContent: "space-between", textAlign: "left", boxSizing: "border-box" }}>
        {/* Category Tag */}
        <span 
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            height: "28px",
            borderRadius: "4px",
            padding: "4px 8px",
            fontFamily: "Faktum, sans-serif",
            fontWeight: 500,
            fontSize: "14px",
            color: "rgba(255, 98, 62, 1)",
            backgroundColor: "rgba(255, 98, 62, 0.08)",
            alignSelf: "flex-start",
          }}
        >
          {product.category}
        </span>
        
        {/* Title & Price Row */}
        <div style={{ width: "100%", height: "35px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
          <h4 style={{ margin: 0, fontSize: "20px", fontFamily: "Faktum, sans-serif", fontWeight: 600, color: "rgba(43, 43, 43, 1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            <Link href={`/shop/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
              {product.name}
            </Link>
          </h4>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
            {product.originalPrice && (
              <span style={{ color: "rgba(141, 141, 141, 1)", textDecoration: "line-through", fontSize: "18px", fontFamily: "Faktum, sans-serif", fontWeight: 500 }}>
                ₹{product.originalPrice}
              </span>
            )}
            <span style={{ fontSize: "24px", fontFamily: "Faktum, sans-serif", fontWeight: 600, color: "rgba(43, 43, 43, 1)" }}>
              ₹{product.price}
            </span>
          </div>
        </div>

        {/* Rating Row */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", height: "20px", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: "2px" }}>
            <Star style={{ width: "20px", height: "20px", fill: "#FFC72C", color: "transparent" }} />
            <Star style={{ width: "20px", height: "20px", fill: "#FFC72C", color: "transparent" }} />
            <Star style={{ width: "20px", height: "20px", fill: "#FFC72C", color: "transparent" }} />
            <Star style={{ width: "20px", height: "20px", fill: "#FFC72C", color: "transparent" }} />
            <Star style={{ width: "20px", height: "20px", fill: "#FFC72C", color: "transparent" }} />
          </div>
          <span style={{ fontSize: "20px", fontFamily: "Faktum, sans-serif", fontWeight: 500, color: "rgba(43, 43, 43, 1)", lineHeight: "100%" }}>
            ({reviewsCount} Reviews)
          </span>
        </div>

        {/* Bought statistics */}
        <p style={{ margin: 0, fontFamily: "Faktum, sans-serif", fontWeight: 500, fontSize: "20px", color: "rgba(141, 141, 141, 1)", height: "25px", display: "flex", alignItems: "center", flexShrink: 0 }}>
          {boughtText}
        </p>

        {/* Delivery text */}
        <p style={{ margin: 0, fontFamily: "Faktum, sans-serif", fontWeight: 500, fontSize: "20px", lineHeight: "28px" }}>
          <span style={{ color: "rgba(141, 141, 141, 1)" }}>FREE delivery as soon as </span>
          <span style={{ color: "rgba(43, 43, 43, 1)" }}>Thu, 9 Apr, 7 am - 10 pm</span>
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
            height: "60px",
            padding: "16px 32px",
            borderRadius: "4px",
            border: "2px solid rgba(29, 73, 62, 1)",
            backgroundColor: "transparent",
            color: "rgba(29, 73, 62, 1)",
            fontSize: "16px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
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
          <span>{isAdded ? 'Added to Cart!' : 'Add to cart'}</span>
          <svg 
            style={{ width: '28px', height: '28px' }} 
            viewBox="0 0 28 28" 
            fill="none" 
            strokeWidth="1.75" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="shrink-0"
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
