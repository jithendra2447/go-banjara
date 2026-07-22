'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, Trash2, Heart, X } from 'lucide-react';
import { useCart } from '@/components/providers';
import { SuggestedProducts } from '@/components/SuggestedProducts';
import { RecentlyViewed } from '@/components/RecentlyViewed';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal, setCheckoutOpen, wishlist, toggleWishlist } = useCart();
  const totalCount = cartCount || cart.length;

  // Unique key generator for each item instance in the cart
  const getItemKey = (item: any, idx: number) => `${item.id}-${item.size || ''}-${idx}`;

  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [initialized, setInitialized] = useState(false);
  const [deleteModalItem, setDeleteModalItem] = useState<any | null>(null);
  const [isBulkRemove, setIsBulkRemove] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-dismiss toast notification after 4 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Initialize all items as selected on initial load or cart change
  useEffect(() => {
    if (cart.length > 0) {
      const allKeys = cart.map((item, idx) => getItemKey(item, idx));
      if (!initialized) {
        setSelectedKeys(new Set(allKeys));
        setInitialized(true);
      } else {
        // Keep valid keys, filter out removed ones
        setSelectedKeys((prev) => {
          const next = new Set<string>();
          allKeys.forEach((key) => {
            if (prev.has(key)) next.add(key);
          });
          if (next.size === 0 && prev.size === 0) {
            return new Set(allKeys);
          }
          return next;
        });
      }
    } else {
      setSelectedKeys(new Set());
      setInitialized(false);
    }
  }, [cart, initialized]);

  const allKeys = cart.map((item, idx) => getItemKey(item, idx));
  const isAllSelected = cart.length > 0 && selectedKeys.size === cart.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedKeys(new Set());
    } else {
      setSelectedKeys(new Set(allKeys));
    }
  };

  const handleToggleItem = (key: string) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleAttemptDelete = (item: any) => {
    setDeleteModalItem(item);
  };

  const handleRemoveSelected = () => {
    if (selectedKeys.size === 0) return;
    // Show modal in bulk mode using first selected item for display
    const firstSelected = cart.find((item: any, idx: number) => selectedKeys.has(getItemKey(item, idx)));
    if (firstSelected) {
      setIsBulkRemove(true);
      setDeleteModalItem(firstSelected);
    }
  };

  const handleMoveToWishlist = (item: any) => {
    const isWishlisted = Array.isArray(wishlist) && wishlist.some((w: any) => w.id === item.id);
    if (!isWishlisted) {
      toggleWishlist(item);
    }
    removeFromCart(item.id);
    setToastMessage(`🎒 Saved ${item.name} to your Wishlist! Bonjo is keeping it ready for your next trip.`);
  };

  // Filter ONLY selected items dynamically
  const selectedItems = cart.filter((item: any, idx: number) => selectedKeys.has(getItemKey(item, idx)));

  // Calculate dynamic subtotal based ONLY on selected items
  const selectedSubtotal = selectedItems.reduce((acc: number, item: any) => {
    const price = item.price || 0;
    const qty = item.quantity || 1;
    return acc + (price * qty);
  }, 0);

  const selectedOriginalSubtotal = selectedItems.reduce((acc: number, item: any) => {
    const origPrice = item.originalPrice || Math.round((item.price || 0) * 1.25);
    const qty = item.quantity || 1;
    return acc + (origPrice * qty);
  }, 0);

  return (
    <div className="w-full min-h-screen bg-white" style={{ background: 'rgba(255, 255, 255, 1)' }}>
      {/* Cute Go Banjara Toast Notification */}
      {toastMessage && (
        <div 
          className="fixed bottom-6 right-6 z-[99999] flex items-center gap-3 bg-[#1D493E] text-white px-5 py-3.5 rounded-lg shadow-2xl border border-[#D3FFBF]/30 animate-fade-in max-w-md"
          style={{ fontFamily: '"Faktum", sans-serif' }}
        >
          <span className="text-xl">🎒</span>
          <span className="text-sm font-medium flex-1 leading-snug">{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-white/70 hover:text-white transition p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Item Deletion Prompt Modal with Go Banjara Theme */}
      {deleteModalItem && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none animate-fade-in">
          <div 
            style={{
              width: "100%",
              maxWidth: "460px",
              backgroundColor: "#FFFFFF",
              borderRadius: "8px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              boxShadow: "0px 16px 40px rgba(0, 0, 0, 0.25)",
              border: "1px solid rgba(225, 223, 218, 1)",
            }}
          >
            {/* Modal Header with Bonjo Mascot Badge */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-lg bg-[#F0F4F2] flex items-center justify-center text-[#1D493E] shrink-0 border border-[#D3FFBF]">
                  <span className="text-2xl">🎒</span>
                  <span 
                    className="absolute -bottom-1 -right-1 bg-[#FF5A36] text-white text-[9px] font-black uppercase px-1.5 py-0.2 rounded tracking-wider shadow-xs"
                    style={{ transform: "rotate(-6deg)" }}
                  >
                    BONJO
                  </span>
                </div>
                <div>
                  <h3 
                    style={{
                      fontFamily: '"Fraunces", Georgia, serif',
                      fontWeight: 600,
                      fontSize: "20px",
                      lineHeight: "120%",
                      color: "#2B2B2B",
                      margin: 0,
                    }}
                  >
                    Leaving gear behind?
                  </h3>
                  <p 
                    style={{
                      fontFamily: '"Faktum", sans-serif',
                      fontWeight: 500,
                      fontSize: "13px",
                      lineHeight: "140%",
                      color: "#8D8D8D",
                      margin: "4px 0 0 0",
                    }}
                  >
                    Save <strong className="text-[#2B2B2B]">{deleteModalItem.name}</strong> to your Wishlist so Bonjo keeps it safe for your next adventure!
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setDeleteModalItem(null)}
                className="text-gray-400 hover:text-gray-600 transition cursor-pointer p-1"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Item preview card */}
            <div className="flex items-center gap-3 p-3 bg-[#FAF9F6] rounded-[6px] border border-[#E1DFDA]">
              <img 
                src={deleteModalItem.image || '/nomad_pro_canvas_pack.jpg'} 
                alt={deleteModalItem.name}
                className="w-14 h-14 object-cover rounded-[4px] shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-sm text-[#2B2B2B] truncate">{deleteModalItem.name}</span>
                <span className="text-xs text-[#1D493E] font-bold">₹{deleteModalItem.price?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  handleMoveToWishlist(deleteModalItem);
                  setIsBulkRemove(false);
                  setDeleteModalItem(null);
                }}
                style={{
                  height: "46px",
                  backgroundColor: "#1D493E",
                  color: "#FFFFFF",
                  fontFamily: '"Faktum", sans-serif',
                  fontWeight: 600,
                  fontSize: "15px",
                  borderRadius: "4px",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  cursor: "pointer",
                }}
                className="hover:bg-[#15342c] active:scale-95 transition cursor-pointer shadow-sm"
              >
                <Heart className="w-4 h-4 fill-white text-white" />
                <span>Move to Wishlist Instead</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (isBulkRemove) {
                      // Remove all selected items
                      const selectedItems = cart.filter((item: any, idx: number) => selectedKeys.has(getItemKey(item, idx)));
                      selectedItems.forEach((item: any) => removeFromCart(item.id));
                      setToastMessage(`Removed ${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''} from cart.`);
                      setSelectedKeys(new Set());
                      setIsBulkRemove(false);
                    } else {
                      removeFromCart(deleteModalItem.id);
                      setToastMessage(`Removed ${deleteModalItem.name} from cart.`);
                    }
                    setDeleteModalItem(null);
                  }}
                  style={{
                    flex: 1,
                    height: "40px",
                    backgroundColor: "rgba(253, 242, 242, 1)",
                    color: "rgba(239, 68, 68, 1)",
                    fontFamily: '"Faktum", sans-serif',
                    fontWeight: 600,
                    fontSize: "13px",
                    borderRadius: "4px",
                    border: "1px solid rgba(254, 226, 226, 1)",
                    cursor: "pointer",
                  }}
                  className="hover:bg-red-100 transition cursor-pointer"
                >
                  Remove Permanently
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteModalItem(null)}
                  style={{
                    flex: 1,
                    height: "40px",
                    backgroundColor: "#FFFFFF",
                    color: "#2B2B2B",
                    fontFamily: '"Faktum", sans-serif',
                    fontWeight: 500,
                    fontSize: "13px",
                    borderRadius: "4px",
                    border: "1px solid #CCCCCC",
                    cursor: "pointer",
                  }}
                  className="hover:bg-gray-50 transition cursor-pointer"
                >
                  Keep in Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Container matching exact Figma Specs */}
      <div 
        className="w-full bg-white select-none"
        style={{
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '40px 80px 32px 80px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
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
          EXPERIENCE THE SHOPPING
        </span>

        {/* Title & Items in Cart Row */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 w-full">
          <h1 
            style={{
              fontFamily: '"Fraunces", Georgia, serif',
              fontWeight: 600,
              fontSize: '36px',
              lineHeight: '110%',
              color: '#2B2B2B',
              margin: 0,
            }}
          >
            Shop Product in all <span style={{ color: "rgba(255, 98, 62, 1)" }}>Categories</span>
          </h1>

          <span 
            style={{
              fontFamily: '"Faktum", "Outfit", sans-serif',
              fontWeight: 500,
              fontSize: '18px',
              lineHeight: '100%',
              color: '#3B82F6',
            }}
          >
            {selectedKeys.size} {selectedKeys.size === 1 ? 'Item' : 'Items'} selected ({totalCount} in cart)
          </span>
        </div>

        {/* Breadcrumb path */}
        <div className="flex items-center gap-2 text-sm font-sans mt-1">
          <Link 
            href="/" 
            className="hover:text-slate-800 transition cursor-pointer"
            style={{ 
              fontFamily: '"Faktum", sans-serif',
              fontWeight: 500,
              fontSize: '16px',
              lineHeight: '22px',
              color: 'rgba(141, 141, 141, 1)',
            }}
          >
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-[#8D8D8D] inline" />
          <span 
            style={{ 
              fontFamily: '"Faktum", sans-serif',
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: '22px',
              color: 'rgba(43, 43, 43, 1)',
            }}
          >
            Shopping cart
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div 
        style={{
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 80px 48px 80px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>
          {cart.length === 0 ? (
            <div 
              style={{
                width: "100%",
                maxWidth: "1440px",
                minHeight: "395px",
                padding: "42px 80px",
                backgroundColor: "rgba(255, 255, 255, 1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "24px",
                boxSizing: "border-box",
                border: "1px solid rgba(225, 223, 218, 1)",
                borderRadius: "4px",
              }}
            >
              {/* Icon Box with Bonjo Tag */}
              <div 
                className="relative flex items-center justify-center"
                style={{
                  width: "110px",
                  height: "110px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(240, 244, 242, 1)",
                }}
              >
                <svg className="w-14 h-14 text-[#1D493E]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span 
                  className="absolute -bottom-1 -right-2 bg-[#1D493E] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-sm tracking-wider"
                  style={{ transform: "rotate(-6deg)" }}
                >
                  BONJO
                </span>
              </div>

              {/* Text Content */}
              <div className="flex flex-col items-center gap-2 text-center">
                <h2 
                  style={{
                    fontFamily: '"Fraunces", Georgia, serif',
                    fontWeight: 600,
                    fontSize: "26px",
                    lineHeight: "120%",
                    color: "rgba(43, 43, 43, 1)",
                    margin: 0,
                  }}
                >
                  Your cart is currently empty
                </h2>
                <p 
                  style={{
                    fontFamily: '"Faktum", sans-serif',
                    fontWeight: 500,
                    fontSize: "16px",
                    lineHeight: "140%",
                    color: "rgba(141, 141, 141, 1)",
                    margin: 0,
                  }}
                >
                  Looks like Bonjo hasn't packed your bag yet. Let's start an adventure!
                </p>
              </div>

              {/* Browse Button */}
              <button 
                onClick={() => router.push('/shop')}
                style={{
                  height: "48px",
                  padding: "0 28px",
                  borderRadius: "4px",
                  backgroundColor: "#1D493E",
                  color: "#FFFFFF",
                  fontFamily: '"Faktum", sans-serif',
                  fontWeight: 600,
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                className="hover:bg-[#15342c] active:scale-95 cursor-pointer shadow-sm"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Browse All Products</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6 w-full items-start">
              {/* Left Side: Cart Items Container Box matching Figma Specs (903px max-width, rgba(204,204,204,1) borders) */}
              <div 
                style={{
                  width: "100%",
                  maxWidth: "903px",
                  borderRadius: "4px",
                  border: "1px solid rgba(204, 204, 204, 1)",
                  background: "rgba(255, 255, 255, 1)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  boxSizing: "border-box",
                }}
                className="flex-1"
              >
                {/* Top Control Row: Select All & Remove All */}
                <div 
                  style={{ borderBottom: "1px solid rgba(204, 204, 204, 1)" }}
                  className="w-full flex items-center justify-between px-6 py-4 bg-white select-none"
                >
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleToggleSelectAll}
                      className="w-5 h-5 accent-[#1D493E] rounded cursor-pointer"
                    />
                    <span 
                      style={{
                        fontFamily: '"Faktum", sans-serif',
                        fontWeight: 600,
                        fontSize: "16px",
                        color: "#2B2B2B",
                      }}
                    >
                      Select All
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={handleRemoveSelected}
                    style={{
                      fontFamily: '"Faktum", sans-serif',
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "rgba(255, 90, 54, 1)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    className="hover:opacity-80 transition"
                  >
                    Remove Selected ({selectedKeys.size})
                  </button>
                </div>

                {/* Products List */}
                <div className="flex flex-col w-full">
                  {cart.map((item: any, idx: number) => {
                    const itemKey = getItemKey(item, idx);
                    const itemImg = item.image || '/nomad_pro_canvas_pack.jpg';
                    const isLast = idx === cart.length - 1;
                    const isSelected = selectedKeys.has(itemKey);
                    const originalPrice = item.originalPrice || Math.round((item.price || 0) * 1.25);
                    const discountPct = item.discount || (originalPrice > item.price ? Math.round(((originalPrice - item.price) / originalPrice) * 100) : 20);

                    return (
                      <div 
                        key={itemKey}
                        style={{
                          width: "100%",
                          padding: "16px 20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "16px",
                          borderBottom: isLast ? "none" : "1px solid rgba(204, 204, 204, 1)",
                          background: isSelected ? "#FFFFFF" : "#FAF9F6",
                          boxSizing: "border-box",
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        {/* Checkbox */}
                        <input 
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleItem(itemKey)}
                          className="w-5 h-5 accent-[#1D493E] rounded cursor-pointer shrink-0"
                        />

                        {/* Product Thumbnail & Description */}
                        <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1, minWidth: 0 }}>
                          <img 
                            src={itemImg} 
                            alt={item.name}
                            style={{
                              width: "140px",
                              height: "90px",
                              borderRadius: "4px",
                              objectFit: "cover",
                              flexShrink: 0,
                              opacity: isSelected ? 1 : 0.65,
                            }}
                          />
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: 0 }}>
                            <h3 
                              style={{ 
                                fontFamily: '"Faktum", sans-serif', 
                                fontWeight: 600, 
                                fontSize: "18px", 
                                lineHeight: "120%",
                                color: isSelected ? "rgba(43, 43, 43, 1)" : "rgba(141, 141, 141, 1)", 
                                margin: 0 
                              }}
                            >
                              {item.name}
                            </h3>
                            <p 
                              style={{ 
                                fontFamily: '"Faktum", sans-serif', 
                                fontWeight: 500, 
                                fontSize: "13px", 
                                color: "rgba(141, 141, 141, 1)", 
                                margin: 0 
                              }}
                            >
                              {item.size ? `Olive Drab / ${item.size}` : item.type === 'travel' ? `Guests: ${item.guests || 1}` : "Olive Drab / 45L"}
                            </p>
                            <span 
                              style={{
                                display: "inline-block",
                                width: "fit-content",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                backgroundColor: isSelected ? "rgba(230, 244, 234, 1)" : "rgba(240, 240, 240, 1)",
                                color: isSelected ? "rgba(19, 115, 51, 1)" : "rgba(120, 120, 120, 1)",
                                fontFamily: '"Faktum", sans-serif',
                                fontWeight: 600,
                                fontSize: "12px",
                              }}
                            >
                              {discountPct}% off
                            </span>
                          </div>
                        </div>

                        {/* Stepper [- | qty | +] */}
                        <div 
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 1fr",
                            width: "114px",
                            height: "38px",
                            backgroundColor: "#F7F6F2",
                            borderRadius: "6px",
                            border: "1px solid rgba(225, 223, 218, 1)",
                            overflow: "hidden",
                            userSelect: "none",
                            flexShrink: 0,
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              if ((item.quantity || 1) <= 1) {
                                handleAttemptDelete(item);
                              } else {
                                updateQuantity(item.id, (item.quantity || 1) - 1);
                              }
                            }}
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "transparent",
                              border: "none",
                              borderRight: "1px solid rgba(220, 220, 215, 0.8)",
                              cursor: "pointer",
                              color: "#2B2B2B",
                              fontSize: "18px",
                              fontWeight: 500,
                            }}
                            className="hover:bg-black/5 active:scale-95 transition cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <div 
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontFamily: '"Faktum", sans-serif',
                              fontWeight: 600,
                              fontSize: "15px",
                              color: "#2B2B2B",
                            }}
                          >
                            {item.quantity || 1}
                          </div>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "transparent",
                              border: "none",
                              borderLeft: "1px solid rgba(220, 220, 215, 0.8)",
                              cursor: "pointer",
                              color: "#2B2B2B",
                              fontSize: "18px",
                              fontWeight: 500,
                            }}
                            className="hover:bg-black/5 active:scale-95 transition cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* Price section */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", flexShrink: 0, minWidth: "90px" }}>
                          <span 
                            style={{ 
                              fontFamily: '"Faktum", sans-serif', 
                              fontWeight: 700, 
                              fontSize: "22px", 
                              color: isSelected ? "rgba(43, 43, 43, 1)" : "rgba(141, 141, 141, 1)" 
                            }}
                          >
                            ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                          </span>
                          <span 
                            style={{ 
                              fontFamily: '"Faktum", sans-serif', 
                              fontWeight: 400, 
                              fontSize: "13px", 
                              textDecoration: "line-through",
                              color: "rgba(141, 141, 141, 1)" 
                            }}
                          >
                            ₹{(originalPrice * (item.quantity || 1)).toLocaleString('en-IN')}
                          </span>
                        </div>

                        {/* Action Buttons: Move to Wishlist + Trash Delete */}
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                          <button
                            type="button"
                            onClick={() => handleMoveToWishlist(item)}
                            style={{
                              height: "36px",
                              padding: "0 10px",
                              borderRadius: "4px",
                              backgroundColor: "rgba(255, 235, 232, 1)",
                              border: "1px solid rgba(255, 200, 190, 1)",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              cursor: "pointer",
                              color: "rgba(255, 90, 54, 1)",
                              fontFamily: '"Faktum", sans-serif',
                              fontWeight: 600,
                              fontSize: "12px",
                              whiteSpace: "nowrap",
                            }}
                            className="hover:bg-red-100 active:scale-95 transition cursor-pointer"
                            title="Move to Wishlist"
                          >
                            <Heart style={{ width: "14px", height: "14px", fill: "rgba(255, 90, 54, 1)", color: "rgba(255, 90, 54, 1)" }} />
                            <span className="hidden md:inline">Move to Wishlist</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleAttemptDelete(item)}
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "4px",
                              backgroundColor: "rgba(253, 242, 242, 1)",
                              border: "1px solid rgba(254, 226, 226, 1)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              flexShrink: 0,
                            }}
                            className="hover:bg-red-100 active:scale-95 transition cursor-pointer"
                            title="Remove from Cart"
                          >
                            <Trash2 style={{ width: "16px", height: "16px", color: "rgba(239, 68, 68, 1)" }} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Side: Sticky Order Summary Card matching Figma Specs */}
              <div 
                style={{
                  position: "sticky",
                  top: "110px",
                  width: "100%",
                  maxWidth: "353px",
                  minHeight: "348px",
                  borderRadius: "4px",
                  border: "1px solid rgba(204, 204, 204, 1)",
                  background: "rgba(255, 255, 255, 1)",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "32px",
                  boxSizing: "border-box",
                }}
                className="shrink-0 sticky top-[110px] self-start z-10"
              >
                <div className="flex flex-col gap-6 w-full">
                  <h2 
                    style={{
                      fontFamily: '"Fraunces", Georgia, serif',
                      fontWeight: 600,
                      fontSize: "24px",
                      lineHeight: "100%",
                      color: "rgba(43, 43, 43, 1)",
                      margin: 0,
                    }}
                  >
                    Order Summary
                  </h2>

                  <div className="flex flex-col gap-4 w-full">
                    <div 
                      style={{ borderTop: "1px solid rgba(204, 204, 204, 1)", paddingTop: "16px" }}
                      className="flex justify-between items-center text-base"
                    >
                      <span style={{ fontFamily: '"Faktum", sans-serif', color: "#8D8D8D", fontWeight: 500 }}>
                        Items Subtotal
                      </span>
                      <div className="flex items-center gap-2">
                        <span style={{ fontFamily: '"Faktum", sans-serif', fontWeight: 700, fontSize: "20px", color: "#2B2B2B" }}>
                          ₹{selectedSubtotal.toLocaleString('en-IN')}
                        </span>
                        {selectedOriginalSubtotal > selectedSubtotal && (
                          <span style={{ fontFamily: '"Faktum", sans-serif', textDecoration: "line-through", color: "#8D8D8D", fontSize: "14px" }}>
                            ₹{selectedOriginalSubtotal.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div 
                      style={{ borderTop: "1px solid rgba(204, 204, 204, 1)", paddingTop: "16px" }}
                      className="flex justify-between items-center text-base"
                    >
                      <span style={{ fontFamily: '"Faktum", sans-serif', color: "#8D8D8D", fontWeight: 500 }}>
                        Shipping Fee
                      </span>
                      <span style={{ fontFamily: '"Faktum", sans-serif', fontWeight: 700, fontSize: "18px", color: selectedSubtotal > 0 ? "#2B2B2B" : "#8D8D8D" }}>
                        {selectedSubtotal > 0 ? "Free" : "₹0"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 w-full">
                  <button
                    type="button"
                    disabled={selectedSubtotal === 0}
                    onClick={() => setCheckoutOpen(true)}
                    style={{
                      width: "100%",
                      height: "48px",
                      backgroundColor: selectedSubtotal > 0 ? "#1D493E" : "#CCCCCC",
                      color: "#FFFFFF",
                      fontFamily: '"Faktum", sans-serif',
                      fontWeight: 600,
                      fontSize: "16px",
                      borderRadius: "4px",
                      border: "none",
                      cursor: selectedSubtotal > 0 ? "pointer" : "not-allowed",
                      transition: "all 0.2s ease",
                    }}
                    className={selectedSubtotal > 0 ? "hover:bg-[#15342c] active:scale-95 shadow-sm" : ""}
                  >
                    {selectedSubtotal > 0 ? "Proceed to Checkout" : "Select Items to Checkout"}
                  </button>

                  <p 
                    style={{
                      fontFamily: '"Faktum", sans-serif',
                      fontWeight: 500,
                      fontSize: "12px",
                      lineHeight: "140%",
                      color: "#8D8D8D",
                      textAlign: "center",
                      margin: 0,
                    }}
                  >
                    Congratulations! Your order qualifies for <strong style={{ color: "#2B2B2B" }}>Free Nomad Delivery</strong>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Suggested Products Section */}
      <div className="w-full max-w-[1440px] mx-auto px-20">
        <SuggestedProducts />
      </div>

      {/* Recently Viewed Section */}
      <div className="w-full max-w-[1440px] mx-auto">
        <RecentlyViewed />
      </div>

      {/* Newsletter / Adventure Inbox Banner */}
      <section className="w-full bg-white py-16 px-4 md:px-8 border-t border-gray-100 select-none">
        <div className="max-w-[1440px] mx-auto text-center flex flex-col items-center gap-6">
          <h2 
            style={{
              fontFamily: '"Fraunces", Georgia, serif',
              fontWeight: 600,
              fontSize: "36px",
              lineHeight: "120%",
              color: "rgba(43, 43, 43, 1)",
              margin: 0,
            }}
          >
            The <span style={{ color: "rgba(255, 98, 62, 1)" }}>best adventures</span> find their way to your inbox.
          </h2>
          <p 
            style={{
              fontFamily: '"Faktum", sans-serif',
              fontWeight: 500,
              fontSize: "18px",
              lineHeight: "140%",
              color: "rgba(141, 141, 141, 1)",
              margin: 0,
              maxWidth: "800px",
            }}
          >
            Hidden places, exclusive trip drops, curated gear, and stories from the road delivered before anyone else hears about them.
          </p>
          <Link 
            href="/travel" 
            style={{
              height: "48px",
              padding: "0 28px",
              borderRadius: "4px",
              backgroundColor: "#1D493E",
              color: "#FFFFFF",
              fontFamily: '"Faktum", sans-serif',
              fontWeight: 600,
              fontSize: "16px",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            className="hover:bg-[#15342c] active:scale-95 cursor-pointer shadow-sm mt-2"
          >
            <span>Reserve your tour now</span>
            <span className="text-lg">↗</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
