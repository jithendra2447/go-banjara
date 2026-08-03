/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { CartItem } from '@/types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: any, type: 'shop' | 'travel', date?: string, guests?: number, size?: string, quantity?: number) => void;
  removeFromCart: (id: string, itemName?: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setCheckoutOpen: (open: boolean) => void;
  wishlist: any[];
  toggleWishlist: (item: any) => void;
  isWishlistOpen: boolean;
  setWishlistOpen: (open: boolean) => void;
  user: any;
  login: (userData: any) => void;
  logout: () => void;
  isAuthOpen: boolean;
  setAuthOpen: (open: boolean) => void;
  recentlyViewed: any[];
  addRecentlyViewed: (item: any) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isWishlistOpen, setWishlistOpen] = useState(false);
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAuthOpen, setAuthOpen] = useState(false);

  // Automatically close side drawers when navigating to a new page/route
  useEffect(() => {
    setCartOpen(false);
    setWishlistOpen(false);
    setCheckoutOpen(false);
  }, [pathname]);

  const [initialLoaded, setInitialLoaded] = useState(false);

  // Cookie helper utilities for 1-year session persistence
  const getCookie = (name: string) => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  };

  const setCookie = (name: string, value: string, days = 365) => {
    if (typeof document === 'undefined') return;
    const expires = new Date(Date.now() + days * 86400000).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  };

  const eraseCookie = (name: string) => {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  // Load cart, wishlist, and user from LocalStorage / Cookie on mount
  useEffect(() => {
    const savedUserStr = localStorage.getItem('gb_user') || getCookie('gb_user');
    let loadedUser = null;
    if (savedUserStr) {
      try {
        loadedUser = JSON.parse(savedUserStr);
        setUser(loadedUser);
        localStorage.setItem('gb_user', JSON.stringify(loadedUser));
        setCookie('gb_user', JSON.stringify(loadedUser));
      } catch (e) {
        console.error('Failed to parse user', e);
      }
    }

    const storageSuffix = loadedUser?.email ? `_${loadedUser.email}` : '_guest';
    const savedCart = localStorage.getItem(`gb_cart${storageSuffix}`);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) setCart(parsedCart);
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }

    const savedWishlist = localStorage.getItem(`gb_wishlist${storageSuffix}`);
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        if (Array.isArray(parsedWishlist)) setWishlist(parsedWishlist);
      } catch (e) {
        console.error('Failed to parse wishlist', e);
      }
    }

    const savedRecentlyViewed = localStorage.getItem(`gb_recently_viewed${storageSuffix}`);
    if (savedRecentlyViewed) {
      try {
        const parsedRV = JSON.parse(savedRecentlyViewed);
        if (Array.isArray(parsedRV)) setRecentlyViewed(parsedRV);
      } catch (e) {
        console.error('Failed to parse recently viewed', e);
      }
    }

    setMounted(true);
    setInitialLoaded(true);
  }, []);

  // Save cart to LocalStorage when it changes
  useEffect(() => {
    if (mounted && initialLoaded) {
      const key = user?.email ? `gb_cart_${user.email}` : 'gb_cart_guest';
      localStorage.setItem(key, JSON.stringify(cart));
    }
  }, [cart, mounted, initialLoaded, user?.email]);

  // Save wishlist to LocalStorage and sync to database when it changes
  useEffect(() => {
    if (mounted && initialLoaded) {
      const key = user?.email ? `gb_wishlist_${user.email}` : 'gb_wishlist_guest';
      localStorage.setItem(key, JSON.stringify(wishlist));

      if (user?.email) {
        fetch('/api/auth/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, wishlist }),
        }).catch((err) => console.warn('Wishlist DB sync notice:', err));
      }
    }
  }, [wishlist, mounted, initialLoaded, user?.email]);

  // Save recentlyViewed to LocalStorage when it changes
  useEffect(() => {
    if (mounted && initialLoaded) {
      const key = user?.email ? `gb_recently_viewed_${user.email}` : 'gb_recently_viewed_guest';
      localStorage.setItem(key, JSON.stringify(recentlyViewed));
    }
  }, [recentlyViewed, mounted, initialLoaded, user?.email]);

  const addRecentlyViewed = (item: any) => {
    if (!item) return;
    const itemId = item.id || item.slug || item.title || item.name;
    if (!itemId) return;

    setRecentlyViewed((prev) => {
      const filtered = prev.filter((i) => (i.id || i.slug || i.title || i.name) !== itemId);
      return [item, ...filtered].slice(0, 12);
    });
  };

  const login = (userData: any) => {
    setUser(userData);
    const userStr = JSON.stringify(userData);
    localStorage.setItem('gb_user', userStr);
    setCookie('gb_user', userStr);

    // Instantly load account-scoped cart, wishlist, and recently viewed for this user
    if (userData?.email) {
      try {
        const savedCart = localStorage.getItem(`gb_cart_${userData.email}`);
        if (savedCart) setCart(JSON.parse(savedCart));

        const savedWishlist = localStorage.getItem(`gb_wishlist_${userData.email}`);
        if (savedWishlist) {
          setWishlist(JSON.parse(savedWishlist));
        } else {
          const guestWishlist = localStorage.getItem('gb_wishlist_guest');
          if (guestWishlist) setWishlist(JSON.parse(guestWishlist));
        }

        const savedRV = localStorage.getItem(`gb_recently_viewed_${userData.email}`);
        if (savedRV) setRecentlyViewed(JSON.parse(savedRV));
      } catch (e) {
        console.error('Error hydrating user cart/wishlist on login:', e);
      }
    }
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    setWishlist([]);
    setRecentlyViewed([]);
    localStorage.removeItem('gb_user');
    eraseCookie('gb_user');
  };

  const addToCart = (item: any, type: 'shop' | 'travel', date?: string, guests?: number, size?: string, quantity: number = 1) => {
    setCart((prev) => {
      // Create a unique cart item ID for shop items if a size is selected
      const cartItemId = type === 'shop' && size ? `${item.id}-${size}` : item.id;

      // For travel packages, we check if package with same date is already added
      const existingIdx = prev.findIndex(
        (i) => i.id === cartItemId && (type === 'shop' || i.date === date)
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        if (type === 'shop') {
          updated[existingIdx].quantity += (quantity || 1);
        } else {
          // Update guests count for travel package
          updated[existingIdx].guests = (updated[existingIdx].guests || 0) + (guests || 1);
        }
        return updated;
      }

      // Add as new item
      const newItem: CartItem = {
        id: cartItemId,
        name: item.name,
        price: item.price,
        image: item.image,
        type,
        quantity: quantity || 1,
        date,
        guests: type === 'travel' ? guests : undefined,
        size: type === 'shop' ? size : undefined,
      };
      return [...prev, newItem];
    });
  };

  const [cartToast, setCartToast] = useState<string | null>(null);

  useEffect(() => {
    if (cartToast) {
      const timer = setTimeout(() => setCartToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [cartToast]);

  const removeFromCart = (id: string, customName?: string) => {
    setCart((prev) => {
      const itemToRemove = prev.find((i) => i.id === id);
      const itemName = customName || itemToRemove?.name || 'Item';
      setCartToast(`Removed ${itemName} from your cart.`);
      return prev.filter((i) => i.id !== id);
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (item: any) => {
    setWishlist((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      if (exists) {
        return prev.filter((i) => i.id !== item.id);
      }
      return [...prev, item];
    });
  };

  const cartCount = cart.reduce((acc, item) => {
    if (item.type === 'shop') {
      return acc + item.quantity;
    }
    return acc + 1; // Travel packages count as 1 item in listing
  }, 0);

  const cartTotal = cart.reduce((acc, item) => {
    if (item.type === 'shop') {
      return acc + item.price * item.quantity;
    }
    return acc + item.price * (item.guests || 1);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setCartOpen,
        isCheckoutOpen,
        setCheckoutOpen,
        wishlist,
        toggleWishlist,
        isWishlistOpen,
        setWishlistOpen,
        user,
        login,
        logout,
        isAuthOpen,
        setAuthOpen,
        recentlyViewed,
        addRecentlyViewed,
      }}
    >
      {/* Global Go Banjāra Cart Toast Notification */}
      {cartToast && (
        <div 
          className="fixed bottom-6 right-6 z-[999999] flex items-center gap-3 bg-[#1D493E] text-white px-5 py-3.5 rounded-lg shadow-2xl border border-[#D3FFBF]/30 animate-fade-in max-w-md"
          style={{ fontFamily: '"Faktum", "Outfit", sans-serif' }}
        >
          <span className="text-xl">🎒</span>
          <span className="text-sm font-medium flex-1 leading-snug">{cartToast}</span>
          <button 
            type="button"
            onClick={() => setCartToast(null)}
            className="text-white/70 hover:text-white transition p-1 cursor-pointer"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
