'use client';

import React from 'react';
import ProductCard from '@/components/ProductCard';
import { PRODUCTS } from '@/data/products';
import { useCart } from '@/components/providers';

export const RecentlyViewed: React.FC = () => {
  const { addToCart, wishlist } = useCart();
  
  // Dynamic items based on wishlist/clicked products, fallback to PRODUCTS
  const displayItems = wishlist && wishlist.length > 0 
    ? Array.from(new Set([...wishlist, ...PRODUCTS])).slice(0, 4) 
    : PRODUCTS.slice(0, 4);

  return (
    <div 
      style={{
        width: "100%",
        maxWidth: "1440px",
        margin: "0 auto",
        padding: "42px 80px",
        backgroundColor: "rgba(255, 255, 255, 1)",
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        boxSizing: "border-box",
      }}
    >
      <div className="flex flex-col gap-2">
        {/* Top Tag Pill */}
        <span 
          style={{
            display: "inline-flex",
            alignItems: "center",
            width: "fit-content",
            height: "24px",
            padding: "0 10px",
            borderRadius: "4px",
            backgroundColor: "rgba(255, 235, 232, 1)",
            color: "rgba(255, 90, 54, 1)",
            fontFamily: '"Faktum", sans-serif',
            fontWeight: 600,
            fontSize: "12px",
            lineHeight: "100%",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          I KNOW YOU VIEWED THESE
        </span>

        {/* Section Title */}
        <h2 
          style={{
            fontFamily: '"Fraunces", Georgia, serif',
            fontWeight: 600,
            fontSize: "36px",
            lineHeight: "110%",
            color: "rgba(43, 43, 43, 1)",
            margin: "4px 0 0 0",
          }}
        >
          Recently <span style={{ color: "rgba(255, 98, 62, 1)" }}>Viewed</span>
        </h2>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayItems.map((prod, idx) => (
          <ProductCard 
            key={prod.id || idx} 
            product={prod} 
            onAddToCart={(item) => addToCart(item, 'shop')} 
          />
        ))}
      </div>

      {/* Progress Bar Indicator */}
      <div className="w-full bg-[#EAEAEA] h-[4px] rounded-full overflow-hidden">
        <div className="bg-[#1D493E] h-full w-1/3 rounded-full" />
      </div>
    </div>
  );
};
