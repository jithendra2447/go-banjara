'use client';

import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/components/providers';
import { BonjoMascot } from '@/components/BonjoMascot';
import { Product } from '@/types';

export const WishlistDrawer: React.FC = () => {
  const {
    wishlist,
    isWishlistOpen,
    setWishlistOpen,
    toggleWishlist,
    addToCart,
  } = useCart();

  if (!isWishlistOpen) return null;

  const handleMoveToBag = (item: Product) => {
    // Determine default size if available
    const defaultSize = item.sizes && item.sizes.length > 0 ? item.sizes[0] : undefined;
    
    // Add to cart
    addToCart(item, 'shop', undefined, undefined, defaultSize);
    
    // Remove from wishlist
    toggleWishlist(item);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 animate-[fadeIn_0.2s_ease-out]"
        onClick={() => setWishlistOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md transform transition-all duration-300 ease-in-out bg-white border-l border-primary-dark/10 flex flex-col h-full shadow-2xl animate-[slideInRight_0.3s_cubic-bezier(0.16,1,0.3,1)]">
          {/* Header */}
          <div className="p-6 border-b border-primary-dark/8 flex items-center justify-between">
            <h2 className="text-xl font-bold font-serif text-primary-dark flex items-center gap-2">
              <Heart className="w-5 h-5 text-brand-orange fill-brand-orange" />
              Your Wishlist
            </h2>
            <button 
              onClick={() => setWishlistOpen(false)}
              className="p-2 rounded-full hover:bg-primary-dark/5 text-primary-dark/60 hover:text-primary-dark transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlist.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                <div className="relative group">
                  <BonjoMascot width={130} height={130} withHat={false} withGoggles={true} interactive={true} />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-black text-primary-dark">Wishlist is empty</h3>
                  <p className="text-sm text-primary-dark/70 max-w-xs mx-auto">
                    Favorite items that catch your eye to keep track of them here!
                  </p>
                </div>
                <button 
                  onClick={() => setWishlistOpen(false)}
                  className="px-6 py-3 bg-primary-dark hover:bg-brand-orange text-white rounded-xl font-bold shadow-md hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  Explore Shop
                </button>
              </div>
            ) : (
              wishlist.map((item) => (
                <div 
                  key={item.id}
                  className="flex gap-4 p-4 rounded-2xl bg-white border border-primary-dark/5 shadow-sm hover:shadow-md transition-all"
                >
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-20 h-20 rounded-xl object-cover border border-primary-dark/5"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-extrabold text-primary-dark text-sm leading-snug line-clamp-1">
                          {item.name}
                        </h4>
                        <button 
                          onClick={() => toggleWishlist(item)}
                          className="text-primary-dark/40 hover:text-[#E05434] p-1 transition cursor-pointer"
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <span className="inline-block text-[8px] uppercase font-black tracking-widest px-2.5 py-0.5 rounded-full mt-1.5 bg-[#F3FFEF] text-primary-dark border border-[#1D493E]/8">
                        {item.category}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-primary-dark/5">
                      <span className="text-sm font-extrabold text-primary-dark">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                      
                      <button
                        onClick={() => handleMoveToBag(item)}
                        className="flex items-center gap-1.5 py-1.5 px-3 bg-primary-dark text-white text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-brand-orange transition cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Bag</span>
                      </button>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
