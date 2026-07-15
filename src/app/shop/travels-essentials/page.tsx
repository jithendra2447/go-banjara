'use client';

import React from 'react';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '@/components/providers';
import { PRODUCTS } from '@/data/products';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { FilterDrawer } from '@/components/FilterDrawer';

const categoryGroupMap: Record<string, string[]> = {
  'Collectibles & Accessories': ['stickers', 'badges', 'badges / pins', 'bookmarks', 'fridge magnets', 'key chains', 'keychains', 'luggage tags'],
  'Collectibles & Accessorie': ['stickers', 'badges', 'badges / pins', 'bookmarks', 'fridge magnets', 'key chains', 'keychains', 'luggage tags'],
  'Lifestyle & Utility': ['journals', 'slippers', 'shot glasses', 'passport covers', 'wallets', 'travel pillows'],
  'Fashion & Apparel': ['t-shirts', 'slippers'],
  'Bags & Travel': ['backpacks', 'tote bags'],
};

export default function TravelsEssentialsPage() {
  const { addToCart } = useCart();
  const [productsList, setProductsList] = React.useState<Product[]>(PRODUCTS);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  // Filters State
  const [selectedGroup, setSelectedGroup] = React.useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = React.useState<string[]>([]);
  const [selectedTheme, setSelectedTheme] = React.useState<string>('All');
  const [selectedColor, setSelectedColor] = React.useState<string>('All');
  const [selectedSize, setSelectedSize] = React.useState<string>('All');
  const [sortBy, setSortBy] = React.useState<string>('default');

  React.useEffect(() => {
    const saved = localStorage.getItem('gb_admin_products_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProductsList(parsed);
        }
      } catch (e) {
        console.error('Error parsing admin products:', e);
      }
    } else {
      localStorage.setItem('gb_admin_products_v3', JSON.stringify(PRODUCTS));
    }
  }, []);

  // Calculate Selected Count
  const selectedCount = React.useMemo(() => {
    let count = 0;
    if (selectedGroup) count++;
    count += selectedTypes.length;
    if (selectedTheme !== 'All') count++;
    if (selectedColor !== 'All') count++;
    if (selectedSize !== 'All') count++;
    return count;
  }, [selectedGroup, selectedTypes, selectedTheme, selectedColor, selectedSize]);

  // Clear Filters
  const handleClear = () => {
    setSelectedGroup(null);
    setSelectedTypes([]);
    setSelectedTheme('All');
    setSelectedColor('All');
    setSelectedSize('All');
  };

  // Filter Products
  const filteredProducts = React.useMemo(() => {
    // Basic filter: only show travels essentials
    let list = productsList.filter(
      (prod) => ['slippers', 'travel pillows', 'backpacks', 'tote bags', 'passport covers', 'luggage tags', 'wallets'].includes(prod.category.toLowerCase())
    );

    // 1. Group Filter
    if (selectedGroup) {
      const allowed = categoryGroupMap[selectedGroup] || [];
      list = list.filter((p) => allowed.includes(p.category.toLowerCase()));
    }

    // 2. Type Filter
    if (selectedTypes.length > 0) {
      list = list.filter((p) => {
        const categoryLower = p.category.toLowerCase();
        const type = categoryLower === 'badges' || categoryLower === 'badges / pins' ? 'Badges / Pins'
                   : categoryLower === 'key chains' || categoryLower === 'keychains' ? 'Keychains'
                   : categoryLower === 'backpacks' ? 'Backpacks'
                   : categoryLower === 'tote bags' ? 'Tote Bags'
                   : categoryLower === 'travel pillows' ? 'Travel Pillows'
                   : categoryLower === 't-shirts' ? 'T-Shirts'
                   : categoryLower === 'slippers' ? 'Slippers'
                   : categoryLower === 'passport covers' ? 'Passport Covers'
                   : categoryLower === 'stickers' ? 'Stickers'
                   : categoryLower === 'bookmarks' ? 'Bookmarks'
                   : categoryLower === 'fridge magnets' ? 'Fridge Magnets'
                   : categoryLower === 'luggage tags' ? 'Luggage Tags'
                   : categoryLower === 'journals' ? 'Journals'
                   : categoryLower === 'shot glasses' ? 'Shot Glasses'
                   : categoryLower === 'wallets' ? 'Wallets'
                   : '';
        return selectedTypes.includes(type);
      });
    }

    // 3. Theme, Color & Size mock filters
    if (selectedTheme !== 'All') {
      const themeLower = selectedTheme.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(themeLower) || p.category.toLowerCase() === 'badges'
      );
    }
    if (selectedColor !== 'All') {
      const colorLower = selectedColor.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(colorLower) || p.category.toLowerCase() === 'slippers'
      );
    }
    if (selectedSize !== 'All') {
      list = list.filter((p) => p.category.toLowerCase() !== 'badges');
    }

    return list;
  }, [productsList, selectedGroup, selectedTypes, selectedTheme, selectedColor, selectedSize]);

  // Sort Products
  const sortedProducts = React.useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-asc') {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      return list.sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'reviews') {
      return list.sort((a, b) => (b.reviewsCount ?? 0) - (a.reviewsCount ?? 0));
    }
    return list;
  }, [filteredProducts, sortBy]);

  return (
    <div className="bg-white min-h-screen pb-24 flex flex-col items-center">
      {/* Header Section */}
      <header className="max-w-[1440px] w-full text-left space-y-6 px-6 md:px-[80px] pt-[62px] pb-[24px]">
        <div className="flex justify-start">
          <span className="inline-block text-[10px] font-black uppercase tracking-[0.18em] text-[#FF5B37] bg-[#FFEBE5] px-3.5 py-1.5 rounded-sm">
            EXPERIENCE THE SHOPPING
          </span>
        </div>

        <h1 className="text-4xl md:text-[44px] font-serif text-[#1A1A1A] tracking-tight leading-[1.15] max-w-none font-medium">
          Shop Product in travels <span className="text-[#FF5B37]">Essentials</span>
        </h1>

        <p className="text-sm md:text-base font-sans text-[#2D2D2D] leading-[1.6] max-w-none font-normal">
          Curated gear for the modern nomad. From durable journal covers to the stickers that tell your story
        </p>

        <div className="flex items-center gap-2 text-xs font-sans text-slate-400 font-medium pt-2">
          <Link href="/" className="hover:text-[#1D493E] transition-colors">Home</Link>
          <span className="text-slate-300">&gt;</span>
          <Link href="/shop" className="hover:text-[#1D493E] transition-colors">Shop Page</Link>
          <span className="text-slate-300">&gt;</span>
          <span className="text-[#2B2B2B] font-bold">Travels Essentials</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-[1440px] mx-auto mt-0 px-6 md:px-[80px] flex flex-col gap-10">
        
        {/* Filter and Sort Toolbar */}
        <div className="flex flex-row items-center justify-between gap-6 border-b border-slate-100 pb-8 pt-4 w-full">
          {/* Results count (Left) */}
          <div className="text-sm sm:text-base text-slate-800 font-medium">
            Showing all {sortedProducts.length} results
          </div>

          {/* Interactive Filters & Sort (Right) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Filters Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:border-slate-400 cursor-pointer transition-colors"
            >
              <span>Filters</span>
              {selectedCount > 0 && (
                <span className="text-xs text-[#3B82F6] font-semibold bg-[#EFF6FF] px-1.5 py-0.5 rounded-full">
                  {selectedCount}
                </span>
              )}
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Custom Sort Select dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pr-10 pl-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:border-slate-400 focus:outline-none cursor-pointer transition-colors"
              >
                <option value="default">Default sorting</option>
                <option value="price-asc">Sort by price: Low to High</option>
                <option value="price-desc">Sort by price: High to Low</option>
                <option value="reviews">Sort by: Popularity</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[32px] w-full max-w-[1280px] mx-auto">
            {sortedProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onAddToCart={(p) => addToCart(p, 'shop')}
              />
            ))}
          </div>
        ) : (
          <div className="w-full text-center py-20 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-4">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">No products found in this category</span>
            <button
              onClick={handleClear}
              className="text-xs font-extrabold uppercase tracking-widest text-[#1D493E] hover:text-[#FF5B37] transition-colors duration-300"
            >
              Reset Filters
            </button>
          </div>
        )}

      </main>

      {/* Filter Slide-out Drawer */}
      <FilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        selectedTheme={selectedTheme}
        setSelectedTheme={setSelectedTheme}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        selectedCount={selectedCount}
        onClear={handleClear}
      />
    </div>
  );
}
