'use client';

import React from 'react';
import ProductCard from '@/components/ProductCard';
import { PRODUCTS } from '@/data/products';
import { useCart } from '@/components/providers';
import { DragCarousel } from '@/components/DragCarousel';

export const RecentlyViewed: React.FC = () => {
  const { addToCart, wishlist, cart, recentlyViewed } = useCart();
  
  // Smart items based on real recentlyViewed + wishlist + category match, fallback to PRODUCTS
  const displayItems = React.useMemo(() => {
    const rv = recentlyViewed || [];
    const wl = wishlist || [];
    const ct = cart || [];

    // Combined unique items from user activity
    const activityList = [...rv, ...wl];
    const seenIds = new Set<string>();
    const items: any[] = [];

    // 1. First add real recently viewed & wishlisted items
    activityList.forEach((item) => {
      const id = item.id || item.slug || item.title || item.name;
      if (id && !seenIds.has(id)) {
        seenIds.add(id);
        const full = PRODUCTS.find((p) => p.id === id) || item;
        items.push(full);
      }
    });

    // 2. Look for category keywords in cart/wishlist (e.g. t-shirt, slides)
    const activeKeywords = new Set<string>();
    [...ct, ...wl, ...rv].forEach((item) => {
      const name = (item.name || item.title || '').toLowerCase();
      if (name.includes('t-shirt') || name.includes('tshirt') || name.includes('tee')) activeKeywords.add('t-shirt');
      if (name.includes('slide') || name.includes('sandal')) activeKeywords.add('slides');
    });

    if (activeKeywords.has('t-shirt')) {
      PRODUCTS.filter((p) => (p.name || '').toLowerCase().includes('t-shirt')).forEach((p) => {
        if (!seenIds.has(p.id)) {
          seenIds.add(p.id);
          items.push(p);
        }
      });
    }

    // 3. Fallback to default PRODUCTS if fewer than 4 items
    if (items.length < 4) {
      PRODUCTS.forEach((p) => {
        if (!seenIds.has(p.id)) {
          seenIds.add(p.id);
          items.push(p);
        }
      });
    }

    return items.slice(0, 6);
  }, [recentlyViewed, wishlist, cart]);

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
