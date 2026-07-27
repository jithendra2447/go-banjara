'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Star, Check, Shield, Truck, Box, ArrowUpRight } from 'lucide-react';
import { useCart } from '@/components/providers';
import { PRODUCTS } from '@/data/products';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { TrustBanner } from '@/components/TrustBanner';
import { getFutureDeliveryString } from '@/utils/dateUtils';

const FAQ_ITEMS = [
  {
    question: "What materials are the products made from?",
    answer: "We source only premium-grade, durable materials. Badges are made of zinc-alloy with glossy enamel; apparel is 100% organic cotton; and bags/covers are made of rugged, weatherproof canvas and genuine leather."
  },
  {
    question: "Is cash on delivery (COD) available?",
    answer: "Yes, COD is available for all products across India. You can choose COD during checkout."
  },
  {
    question: "What is your return & exchange policy?",
    answer: "We offer a hassle-free 7-day return and exchange policy. Items must be unused, in their original packaging with tags intact."
  },
  {
    question: "How long does shipping take?",
    answer: "Standard shipping takes 3-5 business days. Express shipping options are available for major metro cities."
  }
];

export default function ProductDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { addToCart } = useCart();

  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImg, setActiveImg] = useState<string>('');
  const [activeImgIdx, setActiveImgIdx] = useState<number>(2);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [pincode, setPincode] = useState('');
  const [pincodeMessage, setPincodeMessage] = useState<string | null>(null);
  const [addedToCartSuccess, setAddedToCartSuccess] = useState(false);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'desc' | 'reviews'>('desc');
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySuccess, setNotifySuccess] = useState(false);

  // Load products list from LocalStorage/JSON on mount
  useEffect(() => {
    let list = PRODUCTS;
    const saved = localStorage.getItem('gb_admin_products_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          list = parsed;
          setProductsList(parsed);
        }
      } catch (e) {
        console.error('Error parsing admin products:', e);
      }
    }

    const found = list.find((p) => p.id === id);
    if (found) {
      setProduct(found);
      setActiveImg(found.image);
      
      // Update recently viewed in localStorage
      const rvSaved = localStorage.getItem('gb_recently_viewed_products');
      let rvList: string[] = [];
      if (rvSaved) {
        try {
          rvList = JSON.parse(rvSaved);
        } catch (e) {
          console.error(e);
        }
      }
      // Remove current id if exists, and push to front
      rvList = [id, ...rvList.filter((item) => item !== id)].slice(0, 8);
      localStorage.setItem('gb_recently_viewed_products', JSON.stringify(rvList));

      // Resolve recently viewed objects
      const rvObjects = rvList
        .filter((rvId) => rvId !== id) // exclude current product
        .map((rvId) => list.find((p) => p.id === rvId))
        .filter(Boolean) as Product[];
      setRecentlyViewed(rvObjects.slice(0, 4));
    }
  }, [id]);

  // Similar Products
  const similarProducts = useMemo(() => {
    if (!product) return [];
    return productsList
      .filter((p) => p.id !== product.id && p.category.toLowerCase() === product.category.toLowerCase())
      .slice(0, 4);
  }, [product, productsList]);

  // Fallback similar products if not enough same-category items
  const fallbackSimilarProducts = useMemo(() => {
    if (similarProducts.length >= 4) return similarProducts;
    const ids = new Set(similarProducts.map((p) => p.id));
    const extra = productsList.filter((p) => p.id !== product?.id && !ids.has(p.id));
    return [...similarProducts, ...extra].slice(0, 4);
  }, [similarProducts, productsList, product]);

  const handleAddToCart = () => {
    if (!product) return;
    const finalItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    };
    for (let i = 0; i < quantity; i++) {
      addToCart(finalItem, 'shop');
    }
    setAddedToCartSuccess(true);
    setTimeout(() => setAddedToCartSuccess(false), 3000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    const finalItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    };
    for (let i = 0; i < quantity; i++) {
      addToCart(finalItem, 'shop');
    }
    router.push('/cart');
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode.trim()) {
      setPincodeMessage(null);
      return;
    }
    if (/^\d{6}$/.test(pincode.trim())) {
      setPincodeMessage('✓ Delivery available! Free delivery within 3-4 days.');
    } else {
      setPincodeMessage('✗ Please enter a valid 6-digit PIN code.');
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-[#1D493E] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-black uppercase text-[#1D493E] tracking-widest">Loading Product Details...</p>
        </div>
      </div>
    );
  }

  // Specifications builder based on categories
  const getSpecs = () => {
    const cat = product.category.toLowerCase();
    if (cat.includes('badge') || cat.includes('pins')) {
      return [
        { label: 'Diameter', value: '1.25 Inches' },
        { label: 'Material', value: 'Premium Zinc Alloy' },
        { label: 'Clasp', value: 'Butterfly Clutch' },
        { label: 'Finish', value: 'Hard Enamel Gloss' }
      ];
    } else if (cat.includes('shirt') || cat.includes('apparel')) {
      return [
        { label: 'Material', value: '100% Organic Cotton' },
        { label: 'Fit', value: 'Relaxed Unisex Fit' },
        { label: 'GSM', value: '220 Heavyweight' },
        { label: 'Finish', value: 'Bio-Washed Soft' }
      ];
    } else if (cat.includes('bag') || cat.includes('travel')) {
      return [
        { label: 'Capacity', value: '25 Liters' },
        { label: 'Material', value: 'Waterproof Canvas & Leather' },
        { label: 'Compartments', value: '1 Main, 2 Quick Access' },
        { label: 'Strap', value: 'Adjustable Padded Shoulder' }
      ];
    } else if (cat.includes('journal') || cat.includes('utility')) {
      return [
        { label: 'Size', value: 'A5 (5.8 x 8.3 inches)' },
        { label: 'Pages', value: '160 Ruled Pages' },
        { label: 'Paper', value: '80 GSM Natural Shade' },
        { label: 'Binding', value: 'Lay-Flat Thread Bound' }
      ];
    } else {
      return [
        { label: 'Category', value: product.category },
        { label: 'Material', value: 'Premium Grade Travel Materials' },
        { label: 'Brand', value: product.brand || 'Banjāra Originals' },
        { label: 'Finish', value: product.color || 'Matte Textured Finish' }
      ];
    }
  };

  const productSpecs = getSpecs();

  // Highlights list - exact text match
  const highlights = [
    'Overnight camping under Milky Way at Chandratal Lake',
    'Overnight camping under Milky Way at Chandratal Lake',
    'Overnight camping under Milky Way at Chandratal Lake',
    'Overnight camping under Milky Way at Chandratal Lake',
    'Overnight camping under Milky Way at Chandratal Lake',
    'Overnight camping under Milky Way at Chandratal Lake'
  ];

  // Calculate discount percentage
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 16; 

  // Check if product is T-Shirt / Clothing / Apparel so size selector is shown ONLY for clothing
  const categoryLower = (product?.category || '').toLowerCase();
  const nameLower = (product?.name || '').toLowerCase();
  const itemTypeLower = ((product as any)?.itemType || '').toLowerCase();

  const isTShirtProduct = 
    /t-?shirt|tee|topwear|apparel|clothing|hoodie|top/i.test(categoryLower) ||
    /t-?shirt|tee|topwear|apparel|clothing|hoodie|top/i.test(nameLower) ||
    /t-?shirt|tee|topwear|apparel|clothing|hoodie|top/i.test(itemTypeLower);

  // Dynamic mock variant images based on selected index
  const renderMediaContent = (index: number, isThumbnail: boolean = false) => {
    const mainImg = product?.image || '';
    
    // Define layout and sizing tokens
    const rulerWidth = isThumbnail ? "12px" : "40px";
    const rulerTickMajor = isThumbnail ? "4px" : "12px";
    const rulerTickMinor = isThumbnail ? "2px" : "8px";
    const fontSizeLabel = isThumbnail ? "4px" : "10px";
    const fontSizeUnits = isThumbnail ? "3px" : "8px";
    const rulerOffset = isThumbnail ? "4px" : "16px";
    
    switch (index) {
      case 0: // 1st: Ruler Scale View
        return (
          <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF" }}>
            <img src={mainImg} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            {/* Ruler Overlay */}
            <div style={{ position: "absolute", left: rulerOffset, top: "15%", bottom: "15%", width: rulerWidth, borderRight: `${isThumbnail ? '0.5px' : '2px'} solid #2B2B2B`, display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end", paddingRight: isThumbnail ? "2px" : "6px", fontFamily: "Faktum, sans-serif", fontSize: fontSizeLabel, color: "#2B2B2B", fontWeight: 600 }}>
              <div style={{ display: "flex", alignItems: "center", gap: isThumbnail ? "1px" : "4px" }}><span>1</span><div style={{ width: rulerTickMajor, height: isThumbnail ? "0.5px" : "2px", backgroundColor: "#2B2B2B" }}></div></div>
              <div style={{ width: rulerTickMinor, height: isThumbnail ? "0.2px" : "1px", backgroundColor: "#8D8D8D" }}></div>
              <div style={{ display: "flex", alignItems: "center", gap: isThumbnail ? "1px" : "4px" }}><span>0.5</span><div style={{ width: rulerTickMajor, height: isThumbnail ? "0.5px" : "2px", backgroundColor: "#2B2B2B" }}></div></div>
              <div style={{ width: rulerTickMinor, height: isThumbnail ? "0.2px" : "1px", backgroundColor: "#8D8D8D" }}></div>
              <div style={{ display: "flex", alignItems: "center", gap: isThumbnail ? "1px" : "4px" }}><span>0</span><div style={{ width: rulerTickMajor, height: isThumbnail ? "0.5px" : "2px", backgroundColor: "#2B2B2B" }}></div></div>
              <span style={{ fontSize: fontSizeUnits, transform: "rotate(-90deg)", transformOrigin: "right bottom", marginTop: isThumbnail ? "2px" : "12px", color: "#8D8D8D" }}>Inches</span>
            </div>
          </div>
        );
      case 1: // 2nd: Close Up Detailed view
        return (
          <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF" }}>
            <img src={mainImg} style={{ width: "100%", height: "100%", objectFit: "cover", transform: isThumbnail ? "scale(1.8) rotate(15deg)" : "scale(2.2) rotate(15deg)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.15) 100%)", pointerEvents: "none" }} />
          </div>
        );
      case 2: // 3rd: Flat centered view (Normal view)
        return (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF" }}>
            <img src={mainImg} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        );
      case 3: // 4th: Front + Back Combo
        return (
          <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", gap: isThumbnail ? "4px" : "16px", backgroundColor: "#FFFFFF", padding: "4px" }}>
            <img src={mainImg} style={{ width: "42%", height: "42%", objectFit: "contain" }} />
            <div style={{ width: "42%", aspectRatio: "1", borderRadius: "50%", background: "radial-gradient(circle, #E2E8F0 0%, #CBD5E1 100%)", boxShadow: isThumbnail ? "inset 0 1px 2px rgba(0,0,0,0.15)" : "inset 0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <div style={{ width: "30%", height: "30%", borderRadius: "50%", backgroundColor: "#475569", border: `${isThumbnail ? '1px' : '2px'} solid #334155`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: "140%", height: isThumbnail ? "1.5px" : "6px", borderRadius: "3px", backgroundColor: "#334155", position: "absolute", transform: "rotate(25deg)" }}></div>
                <div style={{ width: "140%", height: isThumbnail ? "1.5px" : "6px", borderRadius: "3px", backgroundColor: "#334155", position: "absolute", transform: "rotate(-25deg)" }}></div>
              </div>
            </div>
          </div>
        );
      case 4: // 5th: Single Front view
        return (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#FCFAF6" }}>
            <img src={mainImg} style={{ width: "100%", height: "100%", objectFit: "cover", filter: isThumbnail ? "none" : "drop-shadow(0 8px 16px rgba(0,0,0,0.06))" }} />
          </div>
        );
      case 5: // 6th: Detailed back clasp view
        return (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF" }}>
            <div style={{ width: "65%", aspectRatio: "1", borderRadius: "50%", background: "radial-gradient(circle, #D1D5DB 0%, #9CA3AF 100%)", boxShadow: isThumbnail ? "inset 0 1px 2px rgba(0,0,0,0.15)" : "inset 0 4px 8px rgba(0,0,0,0.15), 0 10px 20px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <div style={{ width: "35%", height: "35%", borderRadius: "50%", backgroundColor: "#374151", border: `${isThumbnail ? '1px' : '3px'} solid #1F2937`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: "150%", height: isThumbnail ? "2px" : "8px", borderRadius: "4px", backgroundColor: "#1F2937", position: "absolute", transform: "rotate(35deg)" }}></div>
                <div style={{ width: "150%", height: isThumbnail ? "2px" : "8px", borderRadius: "4px", backgroundColor: "#1F2937", position: "absolute", transform: "rotate(-25deg)" }}></div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white min-h-screen pb-0 flex flex-col items-center font-sans text-[#2B2B2B]">
      {/* Page Header (Width: 1440px, dynamic height, Background: white) - Hidden on Mobile */}
      <header 
        style={{
          width: "100%",
          maxWidth: "1440px",
          paddingTop: "20px",
          paddingBottom: "16px",
          background: "rgba(255, 255, 255, 1)",
          flexDirection: "column",
          gap: "20px",
          boxSizing: "border-box"
        }}
        className="hidden md:flex px-4 sm:px-8 md:px-12 lg:px-20"
      >
        {/* Text Block (Label, Title, Subtitle) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", textAlign: "left" }}>


          {/* Title: Shop Product in all Categories */}
          <h1
            style={{
              fontFamily: "Fraunces, serif",
              fontWeight: 600,
              fontSize: "28px",
              lineHeight: "100%",
              letterSpacing: "0px",
              color: "#2B2B2B",
              margin: 0,
            }}
            className="text-2xl md:text-[28px]"
          >
            Shop Product in all <span style={{ color: "rgba(255, 98, 62, 1)" }}>Categories</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: "Faktum, sans-serif",
              fontWeight: 500,
              fontSize: "16px",
              lineHeight: "24px",
              letterSpacing: "0px",
              color: "rgba(43, 43, 43, 1)",
              margin: 0,
            }}
            className="text-base md:text-[16px]"
          >
            Curated gear for the modern nomad. From durable journal covers to the stickers that tell your story
          </p>
        </div>

      </header>

      {/* Main Container */}
      <main 
        style={{
          width: "100%",
          maxWidth: "1440px",
          paddingTop: "8px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          boxSizing: "border-box"
        }}
        className="w-full mx-auto px-3 sm:px-6 md:px-[80px] pb-0 md:pb-0"
      >
        
        {/* Product Details Section (Width: 1280px, gap: 24px, Background: white) */}
        <div 
          style={{
            display: "grid",
            gap: "24px",
            width: "100%",
            backgroundColor: "rgba(255, 255, 255, 1)",
            boxSizing: "border-box"
          }}
          className="grid grid-cols-1 md:grid-cols-2 items-stretch"
        >
          
          {/* LEFT COLUMN: Main Showcase & Thumbnails (Width: 624px, Height: 1050.68px, gap: 24px) */}
          <div 
            style={{
              width: "100%",
              maxWidth: "624px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "24px",
              boxSizing: "border-box",
              height: "100%"
            }}
            className="w-full"
          >
            {/* Desktop Single Image Showcase */}
            <div 
              style={{
                position: "relative",
                width: "100%",
                borderRadius: "4px",
                border: "1.05px solid rgba(204, 204, 204, 1)",
                backgroundColor: "#FFFFFF",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                boxSizing: "border-box"
              }}
              className="hidden md:flex w-full flex-1"
            >
              {renderMediaContent(activeImgIdx, false)}
            </div>

            {/* Mobile Swipeable Image Carousel (No border outline) */}
            <div className="block md:hidden relative w-full h-[210px] sm:h-[260px] rounded-[4px] border-0 bg-white overflow-hidden">
              <div 
                className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-none"
                onScroll={(e) => {
                  const scrollPos = e.currentTarget.scrollLeft;
                  const width = e.currentTarget.offsetWidth;
                  if (width > 0) {
                    const newIdx = Math.round(scrollPos / width);
                    if (newIdx !== activeImgIdx) setActiveImgIdx(newIdx);
                  }
                }}
              >
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-full h-full flex-shrink-0 snap-center flex items-center justify-center relative bg-white">
                    {renderMediaContent(i, false)}
                  </div>
                ))}
              </div>
              {/* Pagination Dots */}
              <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1.5 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeImgIdx === i ? "w-4 bg-[#1D493E]" : "w-1.5 bg-slate-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Thumbnails Row (Hidden on mobile, visible on desktop) */}
            <div 
              style={{
                justifyContent: "space-between",
                gap: "12px",
                width: "100%",
                height: "92px",
                boxSizing: "border-box"
              }}
              className="hidden md:flex w-full overflow-x-auto md:overflow-visible"
            >
              {[...Array(6)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImgIdx(i)}
                  style={{
                    width: "94px",
                    height: "92px",
                    flexShrink: 0,
                    borderRadius: "4px",
                    border: activeImgIdx === i 
                      ? "2px solid rgba(29, 73, 62, 1)" 
                      : "1.05px solid rgba(204, 204, 204, 1)",
                    backgroundColor: "#FFFFFF",
                    padding: "2px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s ease"
                  }}
                >
                  <div style={{ width: "100%", height: "100%", overflow: "hidden", borderRadius: "2px" }}>
                    {renderMediaContent(i, true)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Buying Dashboard & Specs Container */}
          <div 
            style={{
              width: "100%",
              maxWidth: "624px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              boxSizing: "border-box",
              height: "100%"
            }}
            className="w-full"
          >
            {/* Box 1: Buying Dashboard */}
            <div 
              style={{
                width: "100%",
                flex: 1,
                backgroundColor: "rgba(255, 255, 255, 1)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "16px",
                boxSizing: "border-box",
                opacity: 1,
              }}
              className="w-full text-left font-sans text-[#2B2B2B] p-4 sm:p-5 md:py-4 md:px-[24px] rounded-xl md:rounded-[4px] border border-slate-200/80 md:border-[rgba(204,204,204,1)] shadow-xs bg-white"
            >
              {/* Title & Category Tag Row */}
              <div className="flex items-start justify-between gap-3 w-full">
                <h2 style={{ fontFamily: "Faktum, sans-serif", margin: 0 }} className="text-lg sm:text-xl md:text-[28px] font-semibold text-[#2B2B2B] leading-snug">
                  {product.name}
                </h2>
                <span 
                  style={{
                    fontFamily: "Faktum, sans-serif",
                    fontWeight: 600,
                    fontSize: "11px",
                    color: "rgba(255, 98, 62, 1)",
                    backgroundColor: "rgba(255, 98, 62, 0.08)",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    textTransform: "uppercase"
                  }}
                  className="shrink-0 mt-0.5"
                >
                  {product.category}
                </span>
              </div>

              {/* Price & Discount Row (Positioned directly below Title & Badges Chip) */}
              <div className="flex items-center justify-start gap-2.5 w-full text-left">
                <span style={{ fontFamily: "Faktum, sans-serif" }} className="text-xl sm:text-2xl md:text-[28px] font-bold text-[#2B2B2B]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span style={{ fontFamily: "Faktum, sans-serif" }} className="text-xs sm:text-sm text-slate-400 line-through font-medium">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span 
                  style={{
                    fontFamily: "Faktum, sans-serif",
                    backgroundColor: "rgba(22, 163, 74, 0.08)",
                  }}
                  className="text-[10px] sm:text-xs font-bold text-emerald-700 px-1.5 py-0.5 rounded-[3px]"
                >
                  {discountPercent}% off
                </span>
              </div>

              {/* Rating & Social Proof Row */}
              <div className="flex items-center gap-2 flex-wrap text-xs font-sans">
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#FFC72C] text-transparent" />
                    ))}
                  </div>
                  <span className="font-semibold text-[#2B2B2B]">4.9</span>
                  <span className="text-slate-500 font-medium">({product.reviewsCount || 120} Reviews)</span>
                </div>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-medium">
                  {product.boughtCount || '200+ bought in past month'}
                </span>
              </div>

              {/* Quantity, Size & Delivery Pincode Row (Compact & Side-by-Side) */}
              <div className="flex items-end gap-3 w-full flex-wrap sm:flex-nowrap">
                {/* Quantity Selector (Compact height: 36px) */}
                <div className="flex flex-col gap-1 shrink-0">
                  <span className="font-sans text-xs font-medium text-slate-500">Quantity</span>
                  <div className="flex items-center border border-slate-200 rounded-[4px] h-9 bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-full flex items-center justify-center font-bold text-sm text-slate-700 border-r border-slate-200 hover:bg-slate-50 transition"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-semibold text-xs text-slate-800">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-full flex items-center justify-center font-bold text-sm text-slate-700 border-l border-slate-200 hover:bg-slate-50 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Size Selector (If T-Shirt / Apparel) */}
                {isTShirtProduct && (
                  <div className="flex flex-col gap-1 shrink-0 hidden md:flex">
                    <span className="font-sans text-xs font-medium text-slate-500">Select Size</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => {
                        const isSelected = selectedSize === size;
                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setSelectedSize(size)}
                            className={`w-9 h-9 rounded-[4px] text-xs font-bold transition ${
                              isSelected 
                                ? "bg-[#1D493E] text-white border-2 border-[#1D493E]" 
                                : "bg-white text-slate-700 border border-slate-200 hover:border-[#1D493E]"
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Delivery Options / Pincode Box (Fills remaining right space beside Quantity) */}
                <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
                  <span className="font-sans text-xs font-medium text-slate-500">Delivery options</span>
                  <div className="relative flex items-center w-full">
                    <input
                      type="text"
                      placeholder="Enter pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full h-9 pl-2.5 pr-14 border border-slate-200 rounded-[4px] text-xs font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1D493E]"
                    />
                    <button
                      type="button"
                      onClick={handleCheckPincode as any}
                      className="absolute right-2 text-xs font-bold text-blue-600 hover:text-blue-700"
                    >
                      Check
                    </button>
                  </div>
                </div>
              </div>

              {pincodeMessage && (
                <span className={`text-xs font-semibold ${pincodeMessage.startsWith('✓') ? "text-emerald-600" : "text-red-500"}`}>
                  {pincodeMessage}
                </span>
              )}

              {/* Action Buttons */}
              {product.inStock === false ? (
                /* Out of Stock — show Notify button */
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "rgba(239, 68, 68, 1)",
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}>
                    <span>✕</span>
                    <span>The Product is temporarily unavailable</span>
                  </div>
                  <button
                    onClick={() => { setNotifyEmail(''); setNotifySuccess(false); setNotifyModalOpen(true); }}
                    style={{
                      width: "100%",
                      height: "48px",
                      border: "1px solid rgba(29, 73, 62, 1)",
                      color: "rgba(29, 73, 62, 1)",
                      backgroundColor: "#FFFFFF",
                      borderRadius: "4px",
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 600,
                      fontSize: "14px",
                      cursor: "pointer",
                      boxSizing: "border-box",
                    }}
                    className="hover:bg-[#1D493E] hover:text-white transition-all duration-300"
                  >
                    Notify about availability
                  </button>
                </div>
              ) : (
                /* In Stock — normal Add to Cart + Buy Now */
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", width: "100%", height: "48px", boxSizing: "border-box" }} className="grid grid-cols-2 gap-3 w-full h-[48px]">
                  <button
                    onClick={handleAddToCart}
                    style={{
                      width: "100%",
                      height: "48px",
                      border: "1px solid rgba(29, 73, 62, 1)",
                      color: "rgba(29, 73, 62, 1)",
                      backgroundColor: "#FFFFFF",
                      borderRadius: "4px",
                      fontFamily: "Faktum, sans-serif",
                      fontWeight: 600,
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      cursor: "pointer",
                      boxSizing: "border-box"
                    }}
                    className="hover:bg-[#1D493E] hover:text-white transition-all duration-300 group"
                  >
                    <span>Add to Cart</span>
                    <svg
                      style={{ width: '28px', height: '28px' }}
                      viewBox="0 0 28 28"
                      fill="none"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0"
                    >
                      <path d="M4 5h3l2 11h11l2.5-9H14" className="stroke-[#1D493E] group-hover:stroke-white transition-colors duration-300" />
                      <path d="M7.8 8.5H9.5" className="stroke-[#1D493E] group-hover:stroke-white transition-colors duration-300" />
                      <circle cx="10.5" cy="21.5" r="2" className="stroke-[#1D493E] group-hover:stroke-white transition-colors duration-300" />
                      <circle cx="17.5" cy="21.5" r="2" className="stroke-[#1D493E] group-hover:stroke-white transition-colors duration-300" />
                    </svg>
                  </button>
                  <button
                    onClick={handleBuyNow}
                    style={{
                      width: "100%",
                      height: "48px",
                      backgroundColor: "rgba(29, 73, 62, 1)",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "4px",
                      fontFamily: "Faktum, sans-serif",
                      fontWeight: 600,
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      cursor: "pointer",
                      boxSizing: "border-box"
                    }}
                    className="hover:bg-[#15342c] transition-all duration-300"
                  >
                    <span>Buy Now</span>
                    <ArrowUpRight style={{ width: "18px", height: "18px" }} />
                  </button>
                </div>
              )}

              {addedToCartSuccess && (
                <p className="text-xs font-bold text-emerald-600 animate-pulse" style={{ margin: 0 }}>
                  ✓ Product successfully added to your cart!
                </p>
              )}

              {/* Trust Badges (Hidden on mobile) */}
              <div 
                style={{
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "12px",
                  paddingTop: "16px",
                  paddingBottom: "8px",
                  borderTop: "1px solid rgba(204, 204, 204, 0.4)",
                  boxSizing: "border-box",
                  marginTop: "8px"
                }}
                className="hidden md:grid w-full text-center"
              >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "46px", height: "46px", borderRadius: "4px", backgroundColor: "rgba(246, 243, 238, 1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Shield className="w-[14px] h-[14px] text-[#2B2B2B] stroke-[1.75]" />
                  </div>
                  <span style={{ fontSize: "12px", fontFamily: "Faktum, sans-serif", fontWeight: 500, color: "rgba(43, 43, 43, 1)" }}>
                    Safe Payment
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "46px", height: "46px", borderRadius: "4px", backgroundColor: "rgba(246, 243, 238, 1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Truck className="w-[14px] h-[14px] text-[#2B2B2B] stroke-[1.75]" />
                  </div>
                  <span style={{ fontSize: "12px", fontFamily: "Faktum, sans-serif", fontWeight: 500, color: "rgba(43, 43, 43, 1)" }}>
                    Free & fast Shipping
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "46px", height: "46px", borderRadius: "4px", backgroundColor: "rgba(246, 243, 238, 1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Box className="w-[14px] h-[14px] text-[#2B2B2B] stroke-[1.75]" />
                  </div>
                  <span style={{ fontSize: "12px", fontFamily: "Faktum, sans-serif", fontWeight: 500, color: "rgba(43, 43, 43, 1)" }}>
                    2 - 5 days Delivery
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Product Specifications Section */}
        <div
          style={{
            width: "100%",
            backgroundColor: "rgba(255, 255, 255, 1)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            boxSizing: "border-box",
            border: "1px solid rgba(204, 204, 204, 1)",
            borderRadius: "4px",
            marginTop: "0px"
          }}
          className="p-4 sm:p-6"
        >
          <span style={{ fontFamily: "Faktum, sans-serif", fontWeight: 600, color: "rgba(43, 43, 43, 1)" }} className="text-sm sm:text-base">
            Product Specifications
          </span>
          <div
            style={{
              width: "100%",
              borderTop: "1px solid rgba(204, 204, 204, 0.54)",
              paddingTop: "16px"
            }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
          >
            {productSpecs.map((sp) => (
              <div
                key={sp.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  fontFamily: "Faktum, sans-serif"
                }}
              >
                <span style={{ color: "rgba(141, 141, 141, 1)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }} className="text-[10px] sm:text-xs">{sp.label}</span>
                <span style={{ color: "rgba(43, 43, 43, 1)", fontWeight: 600 }} className="text-xs sm:text-base">{sp.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Bar */}
        <div
          style={{
            borderBottom: "2px solid rgba(204, 204, 204, 1)",
            backgroundColor: "rgba(255, 255, 255, 1)",
            boxSizing: "border-box"
          }}
          className="w-full h-10 sm:h-12 mt-1 sm:mt-4"
        >
          <div className="flex gap-4 sm:gap-8 md:gap-12 h-full items-end">

            {/* Product Description Tab */}
            <button
              onClick={() => setActiveTab('desc')}
              style={{
                cursor: "pointer",
                background: "none",
                border: "none",
                padding: "0 0 6px 0",
                borderBottom: activeTab === 'desc' ? "3px solid rgba(28, 68, 140, 1)" : "3px solid transparent",
                marginBottom: "-2px",
                transition: "border-color 0.2s"
              }}
            >
              <span style={{
                fontFamily: "Faktum, sans-serif",
                fontWeight: 500,
                lineHeight: "100%",
                color: activeTab === 'desc' ? "rgba(28, 68, 140, 1)" : "rgba(43, 43, 43, 1)",
                transition: "color 0.2s"
              }} className="text-sm sm:text-xl md:text-[24px]">Product Description</span>
            </button>

            {/* Reviews Tab */}
            <button
              onClick={() => setActiveTab('reviews')}
              style={{
                cursor: "pointer",
                background: "none",
                border: "none",
                padding: "0 0 6px 0",
                borderBottom: activeTab === 'reviews' ? "3px solid rgba(28, 68, 140, 1)" : "3px solid transparent",
                marginBottom: "-2px",
                transition: "border-color 0.2s"
              }}
            >
              <span style={{
                fontFamily: "Faktum, sans-serif",
                fontWeight: 500,
                lineHeight: "100%",
                color: activeTab === 'reviews' ? "rgba(28, 68, 140, 1)" : "rgba(43, 43, 43, 1)",
                transition: "color 0.2s"
              }} className="text-sm sm:text-xl md:text-[24px]">Reviews</span>
            </button>

          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'desc' ? (
          <div 
            style={{
              width: "100%",
              minHeight: "auto",
              boxSizing: "border-box",
            }}
            className="flex flex-col gap-2 sm:gap-5 md:gap-[32px] w-full pt-2"
          >

            {/* Overview of Product */}
            <section style={{
              width: "100%",
              height: "auto",
              display: "flex",
              flexDirection: "column",
              borderRadius: "4px",
              backgroundColor: "rgba(255, 255, 255, 1)",
              boxSizing: "border-box"
            }}>
              <h2 style={{
                fontFamily: "Fraunces, serif",
                fontWeight: 600,
                letterSpacing: "0px",
                color: "rgba(43, 43, 43, 1)",
                margin: "0 0 6px 0"
              }} className="text-base sm:text-2xl md:text-[32px]">
                Overview of the <span style={{ color: "rgba(255, 98, 62, 1)" }}>Product</span>
              </h2>
              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "6px", boxSizing: "border-box" }}>
                <p style={{
                  fontFamily: "Faktum, sans-serif",
                  fontWeight: 500,
                  color: "rgba(43, 43, 43, 1)",
                  margin: 0,
                }} className="text-xs sm:text-base md:text-[18px] leading-relaxed md:leading-[32px]">Designed for the digital nomads and the barefoot explorers, the Naturally Nomad badge is more than just an accessory it&apos;s a mark of identity. Whether you&apos;re working from a cafe in Dharamshala or hitchhiking through the Spiti Valley, this badge represents the freedom to move and the courage to belong nowhere and everywhere at once.
                </p>
                <p style={{
                  fontFamily: "Faktum, sans-serif",
                  fontWeight: 500,
                  color: "rgba(43, 43, 43, 1)",
                  margin: 0,
                }} className="hidden md:block text-sm sm:text-base md:text-[18px] leading-relaxed md:leading-[32px]">
                  Crafted with high-grade hard enamel, the colors are deep and durable, reflecting the rugged nature of travel. The minimalist aesthetic ensures it pairs perfectly with your denim jacket, your trusty rucksack, or even your camera strap. Every stroke in the design is inspired by the rolling hills of the Western Ghats and the clear skies of the Himalayas.
                </p>
              </div>
            </section>

            {/* Product Highlights */}
            <section style={{ display: "flex", flexDirection: "column", gap: "8px" }} className="mt-1 sm:mt-0">
              <div>
                <span style={{ display: "inline-block", fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255, 98, 62, 1)", backgroundColor: "rgba(255, 235, 229, 1)", padding: "2px 6px", borderRadius: "2px" }}>
                  SPECIFICATIONS
                </span>
              </div>
              <h2 style={{ fontFamily: "Fraunces, serif", fontWeight: 600, color: "rgba(43, 43, 43, 1)", margin: 0 }} className="text-base sm:text-2xl md:text-[28px]">
                Product <span style={{ color: "rgba(255, 98, 62, 1)" }}>Highlights</span>
              </h2>
              <div 
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4 md:gap-x-[32px] md:gap-y-[16px] w-full"
              >
                {highlights.map((hl, i) => (
                  <div key={i} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    width: "100%",
                    height: "auto",
                  }}>
                    {/* Checkbox */}
                    <div style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "4px",
                      backgroundColor: "rgba(246, 243, 238, 1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}>
                      <Check style={{ width: "12px", height: "12px", color: "rgba(43, 43, 43, 1)" }} />
                    </div>
                    {/* Text */}
                    <span style={{
                      fontFamily: "Faktum, sans-serif",
                      fontWeight: 500,
                      letterSpacing: "0px",
                      color: "rgba(43, 43, 43, 1)",
                      verticalAlign: "middle"
                    }} className="text-xs sm:text-sm md:text-[16px] leading-snug md:leading-[26px]">{hl}</span>
                  </div>
                ))}
              </div>
            </section>

          </div>
        ) : (
          <div style={{ width: "100%", minHeight: "auto", paddingTop: "16px", boxSizing: "border-box" }}>
            <section style={{ display: "flex", flexDirection: "column", gap: "0px" }}>

              {/* ── Rating Summary ── */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-10 p-4 sm:p-6 border border-gray-200 rounded-lg mb-4 w-full">
                {/* Left: big number */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "4px", minWidth: "90px" }}>
                  <span style={{ fontFamily: "'Fraunces', serif", fontSize: "36px", fontWeight: 700, color: "rgba(43,43,43,1)", lineHeight: 1 }} className="sm:text-[52px]">4.9</span>
                  <div style={{ display: "flex", gap: "3px" }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} style={{ width: "14px", height: "14px", fill: "#FF623E", color: "#FF623E" }} />
                    ))}
                  </div>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "11px", fontWeight: 500, color: "rgba(141,141,141,1)" }}>312 Reviews</span>
                </div>

                {/* Right: bar chart */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px", minWidth: "200px" }} className="w-full">
                  {[
                    { label: "05", pct: 98 },
                    { label: "04", pct: 78 },
                    { label: "03", pct: 55 },
                    { label: "02", pct: 28 },
                    { label: "01", pct: 10 },
                  ].map(row => (
                    <div key={row.label} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "12px", fontWeight: 500, color: "rgba(43,43,43,0.7)", width: "20px" }}>{row.label}</span>
                      <div style={{ flex: 1, height: "8px", background: "rgba(204,204,204,0.25)", borderRadius: "100px", overflow: "hidden" }}>
                        <div style={{ width: `${row.pct}%`, height: "100%", background: "#FF623E", borderRadius: "100px" }} />
                      </div>
                      <Star style={{ width: "12px", height: "12px", fill: "#FF623E", color: "#FF623E", flexShrink: 0 }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Individual Review Cards ── */}
              {[
                {
                  id: "1",
                  author: "Aditya Verma",
                  date: "2 weeks ago",
                  rating: 5,
                  title: "Exceptional quality and vibe!",
                  content: "Bought this for my last Spiti trip and it exceeded all expectations. Extremely high durability, looks super clean on my travel rucksack. Absolutely loved it!",
                  verified: true,
                },
                {
                  id: "2",
                  author: "Sneha Roy",
                  date: "1 month ago",
                  rating: 5,
                  title: "Perfect gift for travel lovers",
                  content: "The finish and color vibrance are top notch. Delivery was fast too. Will definitely purchase more products from Go Banjara!",
                  verified: true,
                },
                {
                  id: "3",
                  author: "Rohan K.",
                  date: "2 months ago",
                  rating: 4,
                  title: "Solid build & premium feel",
                  content: "Looks exactly like the pictures. Great metal backing, stays firmly attached on denim jackets. Worth every rupee.",
                  verified: true,
                }
              ].map((rev, i) => (
                <div key={rev.id} className={`p-3.5 sm:p-5 border-b border-gray-100 ${i >= 2 ? "hidden md:flex" : "flex"} flex-col gap-2`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#1D493E] text-white flex items-center justify-center text-xs font-bold">
                        {rev.author[0]}
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-slate-800" style={{ margin: 0 }}>{rev.author}</p>
                        <p className="text-[10px] sm:text-xs text-slate-400" style={{ margin: 0 }}>{rev.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(rev.rating)].map((_, r) => (
                        <Star key={r} className="w-3.5 h-3.5 fill-[#FF623E] text-[#FF623E]" />
                      ))}
                    </div>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800" style={{ margin: 0 }}>{rev.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed" style={{ margin: 0 }}>{rev.content}</p>
                </div>
              ))}

            </section>
          </div>
        )}

        {/* FAQ Section */}
        <section 
          style={{
            width: "100%",
            boxSizing: "border-box"
          }}
          className="py-6 sm:py-10 md:pt-[48px] border-t border-slate-200/60 mt-4 sm:mt-6 md:mt-[32px]"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px" }}>
            <div>
              <span style={{
                fontFamily: "Faktum, sans-serif",
                fontWeight: 600,
                fontSize: "10px",
                lineHeight: "100%",
                letterSpacing: "1px",
                color: "rgba(255, 98, 62, 1)",
                backgroundColor: "rgba(255, 235, 229, 1)",
                padding: "3px 8px",
                borderRadius: "2px",
                textTransform: "uppercase",
                display: "inline-block"
              }}>
                FAQ'S
              </span>
            </div>
            <h2 style={{
              fontFamily: "Fraunces, serif",
              margin: 0
            }} className="text-lg sm:text-2xl md:text-[32px] font-semibold text-[#2B2B2B]">
              Frequently asked questions
            </h2>
          </div>

          {/* Accordion container */}
          <div style={{ width: "100%", borderTop: "1px solid rgba(204, 204, 204, 0.54)", display: "flex", flexDirection: "column" }}>
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div 
                  key={idx} 
                  className="py-3 sm:py-4 border-b border-slate-200/60 w-full flex flex-col"
                >
                  <button
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      border: "none",
                      background: "none",
                      padding: 0,
                      cursor: "pointer",
                      textAlign: "left"
                    }}
                  >
                    <span style={{
                      fontFamily: "Faktum, sans-serif",
                      color: "rgba(43, 43, 43, 1)",
                    }} className="text-xs sm:text-base md:text-[18px] font-medium leading-snug flex-1">
                      {item.question}
                    </span>
                    <span style={{
                      fontFamily: "Faktum, sans-serif",
                      fontWeight: 500,
                      color: "rgba(29, 73, 62, 1)",
                      marginLeft: "12px",
                      flexShrink: 0
                    }} className="text-sm sm:text-lg">
                      {isOpen ? '—' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <p style={{
                      fontFamily: "Faktum, sans-serif",
                      color: "rgba(141, 141, 141, 1)",
                    }} className="text-xs sm:text-sm md:text-[16px] leading-relaxed mt-2">
                      {item.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Newsletter Section */}
        <section 
          style={{
            width: "100%",
            boxSizing: "border-box"
          }}
          className="pt-5 pb-3 sm:py-10 md:pt-14 text-center border-t border-slate-200/60 flex flex-col items-center gap-4 sm:gap-7 w-full px-2 sm:px-0"
        >
          {/* Text block */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <h2
              style={{
                fontFamily: "Fraunces, serif",
                letterSpacing: "0px",
                textAlign: "center",
                color: "#2B2B2B",
                maxWidth: "1000px",
                margin: 0,
              }}
              className="text-lg sm:text-2xl md:text-[36px] font-semibold leading-tight"
            >
              The{" "}
              <span style={{ color: "#FF5A36" }}>best adventures</span>{" "}
              find their way to your inbox.
            </h2>
            <p
              style={{
                fontFamily: "Faktum, sans-serif",
                letterSpacing: "0px",
                textAlign: "center",
                color: "rgba(43, 43, 43, 0.8)",
                maxWidth: "850px",
                margin: 0,
              }}
              className="text-xs sm:text-sm md:text-[18px] leading-relaxed"
            >
              Hidden places, exclusive trip drops, curated gear, and stories from the road delivered before anyone else hears about them.
            </p>
          </div>

          {/* Button */}
          <Link
            href="/travel"
            className="w-full max-w-[280px] h-10 sm:h-[52px] rounded-[4px] bg-[#1D493E] text-white flex items-center justify-center gap-2 hover:bg-[#15342c] transition-all duration-300 text-xs sm:text-base font-semibold shadow-xs no-underline"
          >
            <span>Reserve your tour now</span>
            <ArrowUpRight style={{ width: "16px", height: "16px" }} />
          </Link>
        </section>

      </main>

      {/* Notify When Availability Modal */}
      {notifyModalOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setNotifyModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              padding: '28px 24px',
              width: '100%',
              maxWidth: '420px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {notifySuccess ? (
              /* Success state */
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>✅</div>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '20px', color: '#1D493E', margin: '0 0 8px' }}>
                  You&apos;re on the list!
                </h3>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '14px', color: 'rgba(43,43,43,0.7)', margin: 0 }}>
                  We&apos;ll notify you at <strong>{notifyEmail}</strong> as soon as this product is back in stock.
                </p>
                <button
                  onClick={() => setNotifyModalOpen(false)}
                  style={{
                    marginTop: '20px',
                    width: '100%',
                    height: '46px',
                    background: '#1D493E',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '6px',
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    fontSize: '15px',
                    cursor: 'pointer',
                  }}
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                {/* Title */}
                <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '22px', color: '#1D493E', margin: 0 }}>
                  Notify when availability
                </h3>
                {/* Subtitle */}
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '14px', color: 'rgba(43,43,43,0.72)', margin: 0, lineHeight: 1.5 }}>
                  I want to receive a product availability notification by email
                </p>
                {/* Email Input */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  border: '1px solid #CCCCCC',
                  borderRadius: '6px',
                  padding: '0 14px',
                  height: '48px',
                }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="rgba(43,43,43,0.5)" strokeWidth="1.8">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m2 7 10 7 10-7" />
                  </svg>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                    style={{
                      border: 'none',
                      outline: 'none',
                      flex: 1,
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '14px',
                      color: '#2B2B2B',
                      background: 'transparent',
                    }}
                  />
                </div>
                {/* Notify Me Button */}
                <button
                  onClick={() => {
                    if (!notifyEmail.includes('@')) return;
                    setNotifySuccess(true);
                  }}
                  style={{
                    width: '100%',
                    height: '48px',
                    background: '#1D493E',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '6px',
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  className="hover:bg-[#15342c]"
                >
                  Notify me
                </button>
                {/* Cancel */}
                <button
                  onClick={() => setNotifyModalOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'rgba(43,43,43,0.6)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    padding: '4px',
                  }}
                  className="hover:text-[#1D493E] transition"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <TrustBanner />

    </div>
  );
}
