'use client';

import React from 'react';
import ProductCard from '@/components/ProductCard';
import { PRODUCTS } from '@/data/products';
import { useCart } from '@/components/providers';
import { DragCarousel } from '@/components/DragCarousel';

export const RecentlyViewed: React.FC = () => {
  const { addToCart, wishlist } = useCart();
  
  // Dynamic items based on wishlist/clicked products, fallback to PRODUCTS
  const displayItems = wishlist && wishlist.length > 0 
    ? Array.from(new Set([...wishlist, ...PRODUCTS])).slice(0, 4) 
    : PRODUCTS.slice(0, 4);

  return (
    <div 
      className="w-full max-w-[430px] md:max-w-[1440px] mx-auto px-[20px] md:px-[80px] py-6 md:py-[42px] bg-white flex flex-col gap-4 md:gap-8 box-border"
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
          className="font-serif font-semibold text-2xl md:text-[36px] text-[#2B2B2B] leading-tight m-0 mt-1"
        >
          Recently <span style={{ color: "rgba(255, 98, 62, 1)" }}>Viewed</span>
        </h2>
      </div>

      {/* Products Carousel */}
      <DragCarousel totalItems={displayItems.length} itemWidth={320}>
        {displayItems.map((prod, idx) => (
          <div key={prod.id || idx} className="w-[280px] sm:w-[300px] shrink-0 snap-start">
            <ProductCard 
              product={prod} 
              onAddToCart={(item) => addToCart(item, 'shop')} 
            />
          </div>
        ))}
      </DragCarousel>
    </div>
  );
};
