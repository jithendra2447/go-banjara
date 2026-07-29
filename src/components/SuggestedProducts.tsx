'use client';

import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { PRODUCTS } from '@/data/products';
import { useCart } from '@/components/providers';
import { DragCarousel } from '@/components/DragCarousel';

interface SuggestedProductsProps {
  title?: string;
}

export const SuggestedProducts: React.FC<SuggestedProductsProps> = ({ title }) => {
  const { addToCart } = useCart();
  const suggestedItems = PRODUCTS.slice(0, 4);

  return (
    <div className="w-full select-none py-8">
      {/* Top Tag Pill */}
      <span 
        style={{
          display: "inline-flex",
          alignItems: "center",
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
        YOU MIGHT ALSO LIKE
      </span>

      {/* Section Title */}
      <h2 
        className="font-serif font-semibold text-2xl md:text-[36px] text-[#2B2B2B] leading-tight my-2"
      >
        Suggested <span style={{ color: "rgba(255, 98, 62, 1)" }}>Products</span> for you
      </h2>

      {/* Subtitle */}
      <p 
        className="font-sans font-medium text-xs sm:text-base md:text-[18px] text-[#8D8D8D] m-0"
      >
        Based upon your activities
      </p>

      {/* Products Carousel */}
      <DragCarousel totalItems={suggestedItems.length} itemWidth={320} className="mt-6 md:mt-8">
        {suggestedItems.map((prod) => (
          <div key={prod.id} className="w-[280px] sm:w-[300px] shrink-0 snap-start">
            <ProductCard 
              product={prod} 
              onAddToCart={(item) => addToCart(item, 'shop')} 
            />
          </div>
        ))}
      </DragCarousel>

      {/* View All Products Link */}
      <div className="flex justify-center mt-8">
        <Link 
          href="/shop"
          className="inline-flex items-center justify-center gap-2 font-sans font-medium text-base text-[#1D493E] bg-transparent hover:bg-gray-200/80 rounded-[8px] px-6 py-3 transition-all duration-300 group cursor-pointer"
        >
          <span>View all products</span>
          <span className="text-xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">↗</span>
        </Link>
      </div>
    </div>
  );
};
