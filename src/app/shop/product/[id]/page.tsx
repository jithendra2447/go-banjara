'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Star, ShoppingCart, Check, Shield, Truck, Box } from 'lucide-react';
import { useCart } from '@/components/providers';
import { PRODUCTS } from '@/data/products';
import { Product } from '@/types';

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
  const [activeImgIdx, setActiveImgIdx] = useState<number>(2); // Defaults to index 2 (centered flat badge view)
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeMessage, setPincodeMessage] = useState<string | null>(null);
  const [addedToCartSuccess, setAddedToCartSuccess] = useState(false);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'desc' | 'reviews'>('desc');

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
    addToCart(finalItem, 'shop');
    router.push('/shop');
    setTimeout(() => {
      const checkoutBtn = document.getElementById('checkout-cta-btn') || document.querySelector('[data-checkout-trigger]');
      if (checkoutBtn) (checkoutBtn as any).click();
    }, 300);
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
            <img src={mainImg} style={{ width: "70%", height: "70%", objectFit: "contain" }} />
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
            <img src={mainImg} style={{ width: "80%", height: "80%", objectFit: "contain" }} />
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
            <img src={mainImg} style={{ width: "75%", height: "75%", objectFit: "contain", filter: isThumbnail ? "none" : "drop-shadow(0 8px 16px rgba(0,0,0,0.06))" }} />
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
    <div className="bg-white min-h-screen pb-24 flex flex-col items-center font-sans text-[#2B2B2B]">
      {/* Page Header (Width: 1440px, Height: 284px, pt-62, pb-24, px-80, Background: white) */}
      <header 
        style={{
          width: "100%",
          maxWidth: "1440px",
          minHeight: "284px",
          paddingTop: "62px",
          paddingBottom: "24px",
          background: "rgba(255, 255, 255, 1)",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          boxSizing: "border-box"
        }}
        className="px-6 md:px-[80px]"
      >
        {/* Text Block (Label, Title, Subtitle) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", textAlign: "left" }}>
          {/* Label: EXPERIENCE THE SHOPPING */}
          <div className="w-max">
            <span 
              style={{
                fontFamily: "Faktum, sans-serif",
                fontWeight: 600,
                fontSize: "14px",
                letterSpacing: "1.2px",
                color: "rgba(255, 98, 62, 1)",
                backgroundColor: "rgba(255, 98, 62, 0.1)",
                padding: "4px 10px",
                borderRadius: "4px",
                textTransform: "uppercase",
              }}
            >
              Experience the Shopping
            </span>
          </div>

          {/* Title: Shop Product in all Categories */}
          <h1
            style={{
              fontFamily: "Fraunces, serif",
              fontWeight: 600,
              fontSize: "42px",
              lineHeight: "100%",
              letterSpacing: "0px",
              color: "#2B2B2B",
              margin: 0,
            }}
            className="text-3xl md:text-[42px]"
          >
            Shop Product in all <span style={{ color: "rgba(255, 98, 62, 1)" }}>Categories</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: "Faktum, sans-serif",
              fontWeight: 500,
              fontSize: "24px",
              lineHeight: "32px",
              letterSpacing: "0px",
              color: "rgba(43, 43, 43, 1)",
              margin: 0,
            }}
            className="text-lg md:text-[24px]"
          >
            Curated gear for the modern nomad. From durable journal covers to the stickers that tell your story
          </p>
        </div>

        {/* Breadcrumbs Row */}
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "12px", textAlign: "left" }}>
          <Link
            href="/"
            style={{
              fontFamily: "Faktum, sans-serif",
              fontWeight: 500,
              fontSize: "24px",
              lineHeight: "32px",
              letterSpacing: "0px",
              color: "rgba(141, 141, 141, 1)",
              textDecoration: "none",
            }}
            className="text-base md:text-[24px] hover:text-[#1D493E] transition-colors"
          >
            Home
          </Link>
          <span 
            style={{
              fontFamily: "Faktum, sans-serif",
              fontWeight: 500,
              fontSize: "24px",
              lineHeight: "32px",
              color: "rgba(141, 141, 141, 1)",
            }}
            className="text-base md:text-[24px]"
          >
            ›
          </span>
          <Link
            href="/shop"
            style={{
              fontFamily: "Faktum, sans-serif",
              fontWeight: 500,
              fontSize: "24px",
              lineHeight: "32px",
              letterSpacing: "0px",
              color: "rgba(141, 141, 141, 1)",
              textDecoration: "none",
            }}
            className="text-base md:text-[24px] hover:text-[#1D493E] transition-colors"
          >
            Shop Page
          </Link>
          <span 
            style={{
              fontFamily: "Faktum, sans-serif",
              fontWeight: 500,
              fontSize: "24px",
              lineHeight: "32px",
              color: "rgba(141, 141, 141, 1)",
            }}
            className="text-base md:text-[24px]"
          >
            ›
          </span>
          <Link
            href="/shop/all"
            style={{
              fontFamily: "Faktum, sans-serif",
              fontWeight: 500,
              fontSize: "24px",
              lineHeight: "32px",
              letterSpacing: "0px",
              color: "rgba(141, 141, 141, 1)",
              textDecoration: "none",
            }}
            className="text-base md:text-[24px] hover:text-[#1D493E] transition-colors"
          >
            Product Categories
          </Link>
          <span 
            style={{
              fontFamily: "Faktum, sans-serif",
              fontWeight: 500,
              fontSize: "24px",
              lineHeight: "32px",
              color: "rgba(141, 141, 141, 1)",
            }}
            className="text-base md:text-[24px]"
          >
            ›
          </span>
          <span
            style={{
              fontFamily: "Faktum, sans-serif",
              fontWeight: 500,
              fontSize: "24px",
              lineHeight: "32px",
              letterSpacing: "0px",
              color: "rgba(63, 136, 255, 1)",
              textDecoration: "underline",
            }}
            className="text-base md:text-[24px]"
          >
            {product.name}
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main 
        style={{
          width: "100%",
          maxWidth: "1440px",
          paddingTop: "24px",
          paddingBottom: "42px",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          boxSizing: "border-box"
        }}
        className="w-full mx-auto px-6 md:px-[80px]"
      >
        
        {/* Product Details Section (Width: 1280px, gap: 32px, Background: white) */}
        <div 
          style={{
            display: "grid",
            gap: "32px",
            width: "100%",
            backgroundColor: "rgba(255, 255, 255, 1)",
            boxSizing: "border-box"
          }}
          className="grid grid-cols-1 md:grid-cols-2 items-start"
        >
          
          {/* LEFT COLUMN: Main Showcase & Thumbnails (Width: 624px, Height: 1050.68px, gap: 24px) */}
          <div 
            style={{
              width: "100%",
              maxWidth: "624px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              boxSizing: "border-box"
            }}
            className="w-full"
          >
            {/* Main Showcase Box (Width: 624px, Height: 934.68px on desktop, aspect-square on mobile) */}
            <div 
              style={{
                position: "relative",
                width: "100%",
                borderRadius: "4px",
                border: "1.05px solid rgba(204, 204, 204, 1)",
                backgroundColor: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                boxSizing: "border-box"
              }}
              className="w-full aspect-square md:aspect-auto h-auto md:h-[934.6888427734375px]"
            >
              {renderMediaContent(activeImgIdx, false)}
            </div>
            
            {/* Thumbnails Row (Width: 624px, Height: 92px, gap: 12px) */}
            <div 
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
                width: "100%",
                height: "92px",
                boxSizing: "border-box"
              }}
              className="w-full overflow-x-auto md:overflow-visible"
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

          {/* RIGHT COLUMN: Buying Dashboard (Width: 624px, Height: 1050.68px on desktop, auto-height on mobile) */}
          <div 
            style={{
              width: "100%",
              maxWidth: "624px",
              padding: "24px",
              borderRadius: "4px",
              border: "1px solid rgba(204, 204, 204, 1)",
              backgroundColor: "rgba(255, 255, 255, 1)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxSizing: "border-box",
              opacity: 1,
            }}
            className="w-full h-auto md:h-[1050.6888427734375px] text-left font-sans text-[#2B2B2B] gap-6 md:gap-0"
          >
            {/* Title & Tag Row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontFamily: "Faktum, sans-serif", fontSize: "28px", fontWeight: 600, color: "rgba(43, 43, 43, 1)", margin: 0 }}>
                {product.name}
              </h2>
              <span 
                style={{
                  fontFamily: "Faktum, sans-serif",
                  fontWeight: 600,
                  fontSize: "12px",
                  color: "rgba(255, 98, 62, 1)",
                  backgroundColor: "rgba(255, 98, 62, 0.08)",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  textTransform: "uppercase"
                }}
              >
                {product.category}
              </span>
            </div>

            {/* Price & Rating Row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
              {/* Left: Price & Discount */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "32px", fontFamily: "Faktum, sans-serif", fontWeight: 600, color: "rgba(43, 43, 43, 1)" }}>
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span style={{ fontSize: "14px", fontFamily: "Faktum, sans-serif", fontWeight: 500, color: "rgba(141, 141, 141, 1)", textDecoration: "line-through" }}>
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span 
                  style={{
                    fontSize: "12px",
                    fontFamily: "Faktum, sans-serif",
                    fontWeight: 600,
                    color: "rgba(22, 163, 74, 1)",
                    backgroundColor: "rgba(22, 163, 74, 0.08)",
                    padding: "2px 6px",
                    borderRadius: "2px"
                  }}
                >
                  {discountPercent}% off
                </span>
              </div>

              {/* Right: Stars & Reviews */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ display: "flex", gap: "2px" }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} style={{ width: "16px", height: "16px", fill: "#FFC72C", color: "transparent" }} />
                    ))}
                  </div>
                  <span style={{ fontSize: "14px", fontFamily: "Faktum, sans-serif", fontWeight: 500, color: "rgba(43, 43, 43, 1)" }}>
                    ({product.reviewsCount || 120} Reviews)
                  </span>
                </div>
                <span style={{ fontSize: "12px", fontFamily: "Faktum, sans-serif", fontWeight: 500, color: "rgba(141, 141, 141, 1)", marginTop: "4px" }}>
                  {product.boughtCount || '200+ bought in past month'}
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "left" }}>
              <span style={{ fontFamily: "Faktum, sans-serif", fontSize: "14px", fontWeight: 500, color: "rgba(141, 141, 141, 1)" }}>Quantity</span>
              <div 
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid rgba(204, 204, 204, 0.54)",
                  borderRadius: "4px",
                  width: "max-content",
                  height: "40px",
                  backgroundColor: "#FFFFFF"
                }}
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    width: "40px",
                    height: "100%",
                    border: "none",
                    background: "none",
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "rgba(43, 43, 43, 1)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRight: "1px solid rgba(204, 204, 204, 0.54)"
                  }}
                  className="hover:bg-slate-50 transition"
                >
                  −
                </button>
                <span style={{ minWidth: "48px", textAlign: "center", fontFamily: "Faktum, sans-serif", fontSize: "16px", fontWeight: 500, color: "rgba(43, 43, 43, 1)" }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    width: "40px",
                    height: "100%",
                    border: "none",
                    background: "none",
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "rgba(43, 43, 43, 1)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderLeft: "1px solid rgba(204, 204, 204, 0.54)"
                  }}
                  className="hover:bg-slate-50 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", width: "100%" }}>
              <button
                onClick={handleAddToCart}
                style={{
                  width: "100%",
                  height: "50px",
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
                  <path 
                    d="M4 5h3l2 11h11l2.5-9H14" 
                    className="stroke-[#2B2B2B] group-hover:stroke-white transition-colors duration-300"
                  />
                  <path 
                    d="M7.8 8.5H9.5" 
                    className="stroke-[#2B2B2B] group-hover:stroke-white transition-colors duration-300"
                  />
                  <circle 
                    cx="10.5" 
                    cy="21.5" 
                    r="2" 
                    className="stroke-[#1D493E] group-hover:stroke-white transition-colors duration-300"
                  />
                  <circle 
                    cx="17.5" 
                    cy="21.5" 
                    r="2" 
                    className="stroke-[#1D493E] group-hover:stroke-white transition-colors duration-300"
                  />
                </svg>
              </button>
              <button
                onClick={handleBuyNow}
                style={{
                  width: "100%",
                  height: "50px",
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
                <span style={{ fontSize: "16px" }}>↗</span>
              </button>
            </div>

            {addedToCartSuccess && (
              <p className="text-xs font-bold text-emerald-600 animate-pulse" style={{ margin: 0 }}>
                ✓ Product successfully added to your cart!
              </p>
            )}

            {/* Delivery option checks */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "left" }}>
              <span style={{ fontFamily: "Faktum, sans-serif", fontSize: "14px", fontWeight: 500, color: "rgba(141, 141, 141, 1)" }}>
                Delivery options
              </span>
              <div style={{ position: "relative", display: "flex", alignItems: "center", width: "100%" }}>
                <input
                  type="text"
                  placeholder="Enter the pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  style={{
                    width: "100%",
                    height: "40px",
                    paddingLeft: "12px",
                    paddingRight: "70px",
                    border: "1px solid rgba(204, 204, 204, 1)",
                    borderRadius: "4px",
                    fontSize: "14px",
                    fontFamily: "Faktum, sans-serif",
                    color: "rgba(43, 43, 43, 1)",
                    boxSizing: "border-box"
                  }}
                  className="placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCheckPincode as any}
                  style={{
                    position: "absolute",
                    right: "12px",
                    color: "rgba(63, 136, 255, 1)",
                    border: "none",
                    background: "none",
                    fontSize: "14px",
                    fontFamily: "Faktum, sans-serif",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                  className="hover:text-blue-600 transition"
                >
                  Check
                </button>
              </div>
              <span style={{ fontFamily: "Faktum, sans-serif", fontSize: "12px", color: "rgba(141, 141, 141, 1)", fontWeight: 500 }}>
                Enter the pin code to know when it got delivered to our door step
              </span>
              {pincodeMessage ? (
                <span style={{ fontFamily: "Faktum, sans-serif", fontSize: "14px", fontWeight: 600, color: pincodeMessage.startsWith('✓') ? "#10B981" : "#EF4444" }}>
                  {pincodeMessage}
                </span>
              ) : (
                <span style={{ fontFamily: "Faktum, sans-serif", fontSize: "14px", color: "rgba(141, 141, 141, 1)", fontWeight: 500 }}>
                  FREE delivery as soon as <span style={{ color: "rgba(43, 43, 43, 1)", fontWeight: 600 }}>Thu, 9 Apr, 7am - 10pm</span>
                </span>
              )}
            </div>

            {/* Product Specifications Table */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <span style={{ fontFamily: "Faktum, sans-serif", fontSize: "14px", fontWeight: 600, color: "rgba(43, 43, 43, 1)", textAlign: "left" }}>
                Product Details
              </span>
              <div style={{ width: "100%", display: "flex", flexDirection: "column", borderTop: "1px solid rgba(204, 204, 204, 0.54)" }}>
                {productSpecs.map((sp) => (
                  <div 
                    key={sp.label} 
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 0",
                      borderBottom: "1px solid rgba(204, 204, 204, 0.54)",
                      fontSize: "14px",
                      fontFamily: "Faktum, sans-serif"
                    }}
                  >
                    <span style={{ color: "rgba(141, 141, 141, 1)", fontWeight: 500 }}>{sp.label}</span>
                    <span style={{ color: "rgba(43, 43, 43, 1)", fontWeight: 600 }}>{sp.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div 
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
                paddingTop: "16px",
                borderTop: "1px solid rgba(204, 204, 204, 0.54)",
                boxSizing: "border-box"
              }}
              className="text-center font-semibold"
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "8px", backgroundColor: "#F8F9FA", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Shield className="w-6 h-6 text-[#1D493E] stroke-[1.5]" />
                </div>
                <span style={{ fontSize: "10px", fontFamily: "Faktum, sans-serif", fontWeight: 500, color: "rgba(141, 141, 141, 1)" }}>
                  Safe Payment
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "8px", backgroundColor: "#F8F9FA", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Truck className="w-6 h-6 text-[#1D493E] stroke-[1.5]" />
                </div>
                <span style={{ fontSize: "10px", fontFamily: "Faktum, sans-serif", fontWeight: 500, color: "rgba(141, 141, 141, 1)" }}>
                  Free & fast Shipping
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "8px", backgroundColor: "#F8F9FA", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Box className="w-6 h-6 text-[#1D493E] stroke-[1.5]" />
                </div>
                <span style={{ fontSize: "10px", fontFamily: "Faktum, sans-serif", fontWeight: 500, color: "rgba(141, 141, 141, 1)" }}>
                  2 - 5 days Delivery
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Tab Selection */}
        <section className="border-b border-[#F6F3EE] w-full pt-10 font-sans">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all cursor-pointer relative ${
                activeTab === 'desc' ? 'text-[#1D493E]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span>Product Description</span>
              {activeTab === 'desc' && (
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#3B82F6] rounded-t-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all cursor-pointer relative ${
                activeTab === 'reviews' ? 'text-[#1D493E]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span>Reviews</span>
              {activeTab === 'reviews' && (
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#3B82F6] rounded-t-full"></div>
              )}
            </button>
          </div>
        </section>

        {activeTab === 'desc' ? (
          <>
            {/* Overview of Product */}
            <section className="space-y-4 text-left pt-2 font-sans">
              <h2 className="text-3xl font-sans font-bold text-[#2B2B2B]">
                Overview of the <span className="text-[#FF623E]">Product</span>
              </h2>
              <p className="text-sm md:text-base font-sans text-slate-600 leading-relaxed font-normal pt-1">
                {product.description}
              </p>
              <p className="text-xs md:text-sm font-sans text-slate-500 leading-relaxed font-normal">
                Designed for the digital nomads and the barefoot explorers, the Naturally Nomad badge is more than just an accessory it's a mark of identity. Whether you're working from a cafe in Dharamshala or hitchhiking through the Spiti Valley, this badge represents the freedom to move and the courage to belong nowhere and everywhere at once.
              </p>
              <p className="text-xs md:text-sm font-sans text-slate-500 leading-relaxed font-normal">
                Crafted with high-grade hard enamel, the colors are deep and durable, reflecting the rugged nature of travel. The minimalist aesthetic ensures it pairs perfectly with your denim jacket, your trusty rucksack, or even your camera strap. Every stroke in the design is inspired by the rolling hills of the Western Ghats and the clear skies of the Himalayas.
              </p>
            </section>

            {/* Product Highlights checklist */}
            <section className="space-y-4 text-left pt-6 font-sans">
              <div className="w-max">
                <span className="inline-block text-[9px] font-black uppercase tracking-[0.15em] text-[#FF623E] bg-[#FFEBE5] px-2.5 py-1 rounded-sm">
                  SPECIFICATIONS
                </span>
              </div>
              <h2 className="text-3xl font-sans font-bold text-[#2B2B2B]">
                Product <span className="text-[#FF623E]">Highlights</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-3">
                {highlights.map((hl, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#2B2B2B] shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold text-[#2B2B2B] leading-relaxed">{hl}</span>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <section className="space-y-6 text-left py-4 font-sans">
            <h2 className="text-2xl font-sans font-bold text-[#2B2B2B]">Customer Reviews</h2>
            <div className="space-y-6 divide-y divide-[#F6F3EE]">
              {[
                { author: "Karan S.", rating: 5, date: "May 12, 2026", text: "Amazing quality badge! It has a premium gloss and the clasp holds very strong on my backpack. Will buy more variants." },
                { author: "Sneha M.", rating: 5, date: "April 28, 2026", text: "Looks exactly like the photo. High-quality details and very vibrant colors. Highly recommended!" }
              ].map((rev, i) => (
                <div key={i} className={`pt-4 ${i === 0 ? 'pt-0' : ''}`}>
                  <div className="flex items-center justify-between font-sans">
                    <span className="font-bold text-sm text-[#2B2B2B]">{rev.author}</span>
                    <span className="text-xs text-slate-400 font-semibold">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-[#FFB95E] my-1.5">
                    {[...Array(rev.rating)].map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-[#FFB95E] stroke-none" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-655 font-normal leading-relaxed">{rev.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar Products */}
        <section className="space-y-6 border-t border-[#F6F3EE] pt-16 text-left font-sans">
          <div className="flex items-center gap-2">
            <span className="inline-block text-[9px] font-black uppercase tracking-[0.15em] text-[#FF623E] bg-[#FFEBE5] px-2.5 py-1 rounded-sm font-sans">
              YOU MAY ALSO LIKE
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-sans font-bold text-[#2B2B2B]">
            Similar <span className="text-[#FF623E]">Products</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-2">
            {fallbackSimilarProducts.map((prod, idx) => (
              <div key={`${prod.id}-${idx}`} className="bg-white flex flex-col justify-between text-left group">
                <div className="relative w-full h-[250px] bg-[#F5F5F5] rounded-xl overflow-hidden flex items-center justify-center border border-[#F6F3EE]">
                  <Link href={`/shop/product/${prod.id}`} className="w-full h-full">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-555"
                    />
                  </Link>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1D493E]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E2E8F0]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E2E8F0]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E2E8F0]"></span>
                  </div>
                </div>

                <div className="pt-6 flex flex-col gap-6 text-left font-sans">
                  <div className="space-y-2">
                    <span className="inline-block text-[10px] font-black uppercase tracking-wider text-[#FF623E] bg-[#FFEBE5] px-2 py-0.5 rounded-sm">
                      {prod.category}
                    </span>

                    <div className="flex justify-between items-baseline pt-0.5">
                      <h3 className="font-sans font-bold text-sm sm:text-base text-[#2B2B2B] line-clamp-1">
                        <Link href={`/shop/product/${prod.id}`} className="hover:text-[#FF623E] transition-colors">
                          {prod.name}
                        </Link>
                      </h3>
                      <div className="flex items-center gap-1.5 shrink-0 pl-2">
                        {prod.originalPrice && (
                          <span className="text-xs line-through text-slate-400 font-normal">
                            ₹{prod.originalPrice}
                          </span>
                        )}
                        <span className="text-sm sm:text-base font-extrabold text-[#2B2B2B]">
                          ₹{prod.price}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 font-sans">
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-3.5 h-3.5 fill-[#FFB95E] text-[#FFB95E]" />
                        ))}
                      </div>
                      <span className="text-xs text-slate-500 font-medium font-sans">
                        ({prod.reviewsCount === 1000 ? '1k' : prod.reviewsCount} Reviews)
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(prod, 'shop')}
                    className="w-full py-2.5 border border-[#1D493E] text-[#1D493E] hover:bg-[#1D493E] hover:text-white rounded-md font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm bg-white group"
                  >
                    <span>Add to cart</span>
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
                        className="stroke-[#2B2B2B] group-hover:stroke-white transition-colors duration-300"
                      />
                      <path 
                        d="M7.8 8.5H9.5" 
                        className="stroke-[#2B2B2B] group-hover:stroke-white transition-colors duration-300"
                      />
                      <circle 
                        cx="10.5" 
                        cy="21.5" 
                        r="2" 
                        className="stroke-[#1D493E] group-hover:stroke-white transition-colors duration-300"
                      />
                      <circle 
                        cx="17.5" 
                        cy="21.5" 
                        r="2" 
                        className="stroke-[#1D493E] group-hover:stroke-white transition-colors duration-300"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recently Viewed Products */}
        {recentlyViewed.length > 0 && (
          <section className="space-y-6 border-t border-[#F6F3EE] pt-16 text-left font-sans animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="inline-block text-[9px] font-black uppercase tracking-[0.15em] text-[#FF623E] bg-[#FFEBE5] px-2.5 py-1 rounded-sm font-sans">
                YOUR HISTORY
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-sans font-bold text-[#2B2B2B]">
              Recently <span className="text-[#FF623E]">viewed products</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-2">
              {recentlyViewed.map((prod, idx) => (
                <div key={`${prod.id}-${idx}`} className="bg-white flex flex-col justify-between text-left group">
                  <div className="relative w-full h-[250px] bg-[#F5F5F5] rounded-xl overflow-hidden flex items-center justify-center border border-[#F6F3EE]">
                    <Link href={`/shop/product/${prod.id}`} className="w-full h-full">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-555"
                      />
                    </Link>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1D493E]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E2E8F0]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E2E8F0]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E2E8F0]"></span>
                    </div>
                  </div>

                  <div className="pt-6 flex flex-col gap-6 text-left font-sans">
                    <div className="space-y-2">
                      <span className="inline-block text-[10px] font-black uppercase tracking-wider text-[#FF623E] bg-[#FFEBE5] px-2 py-0.5 rounded-sm">
                        {prod.category}
                      </span>

                      <div className="flex justify-between items-baseline pt-0.5">
                        <h3 className="font-sans font-bold text-sm sm:text-base text-[#2B2B2B] line-clamp-1">
                          <Link href={`/shop/product/${prod.id}`} className="hover:text-[#FF623E] transition-colors">
                            {prod.name}
                          </Link>
                        </h3>
                        <div className="flex items-center gap-1.5 shrink-0 pl-2">
                          {prod.originalPrice && (
                            <span className="text-xs line-through text-slate-400 font-normal">
                              ₹{prod.originalPrice}
                            </span>
                          )}
                          <span className="text-sm sm:text-base font-extrabold text-[#2B2B2B]">
                            ₹{prod.price}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 font-sans">
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="w-3.5 h-3.5 fill-[#FFB95E] text-[#FFB95E]" />
                          ))}
                        </div>
                        <span className="text-xs text-slate-500 font-medium font-sans">
                          ({prod.reviewsCount === 1000 ? '1k' : prod.reviewsCount} Reviews)
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(prod, 'shop')}
                      className="w-full py-2.5 border border-[#1D493E] text-[#1D493E] hover:bg-[#1D493E] hover:text-white rounded-md font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm bg-white group"
                    >
                      <span>Add to cart</span>
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
                          className="stroke-[#2B2B2B] group-hover:stroke-white transition-colors duration-300"
                        />
                        <path 
                          d="M7.8 8.5H9.5" 
                          className="stroke-[#2B2B2B] group-hover:stroke-white transition-colors duration-300"
                        />
                        <circle 
                          cx="10.5" 
                          cy="21.5" 
                          r="2" 
                          className="stroke-[#1D493E] group-hover:stroke-white transition-colors duration-300"
                        />
                        <circle 
                          cx="17.5" 
                          cy="21.5" 
                          r="2" 
                          className="stroke-[#1D493E] group-hover:stroke-white transition-colors duration-300"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section className="space-y-4 border-t border-[#F6F3EE] pt-16 text-left font-sans">
          <div className="flex items-center gap-2">
            <span className="inline-block text-[9px] font-black uppercase tracking-[0.15em] text-[#FF623E] bg-[#FFEBE5] px-2.5 py-1 rounded-sm font-sans">
              FAQ'S
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-sans font-bold text-[#2B2B2B]">
            Frequently asked <span className="text-[#FF623E]">questions</span>
          </h2>
          
          <div className="w-full border-t border-[#F6F3EE] divide-y divide-[#F6F3EE] pt-2 font-sans">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div key={idx} className="py-5 text-left">
                  <button
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full flex justify-between items-start text-left gap-4 font-sans text-sm sm:text-base font-bold text-[#2B2B2B] hover:text-[#1D493E] transition-colors cursor-pointer group"
                  >
                    <span>{item.question}</span>
                    <span className="text-xl font-medium text-[#1D493E] shrink-0 leading-none select-none">
                      {isOpen ? '—' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <p className="mt-3 text-xs sm:text-sm text-slate-450 font-medium leading-relaxed animate-fade-in font-sans">
                      {item.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>


      </main>
    </div>
  );
}
