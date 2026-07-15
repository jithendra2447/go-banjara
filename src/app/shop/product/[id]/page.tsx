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

  return (
    <div className="bg-white min-h-screen pb-24 flex flex-col items-center font-sans text-[#2B2B2B]">
      {/* Breadcrumbs Header */}
      <header className="max-w-[1440px] w-full text-left px-6 md:px-[80px] pt-[30px] pb-[10px]">
        <div className="flex items-center gap-2 text-xs font-sans text-slate-400 font-semibold">
          <Link href="/" className="hover:text-[#1D493E] transition-colors">Home</Link>
          <span className="text-slate-350">&gt;</span>
          <Link href="/shop" className="hover:text-[#1D493E] transition-colors">Shop Page</Link>
          <span className="text-slate-350">&gt;</span>
          <Link href="/shop/all" className="hover:text-[#1D493E] transition-colors">Product Categories</Link>
          <span className="text-slate-350">&gt;</span>
          <span className="text-[#2B2B2B] font-bold">{product.name}</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-[1440px] mx-auto px-6 md:px-[80px] mt-6 flex flex-col gap-16">
        
        {/* Product Details Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start w-full">
          
          {/* LEFT COLUMN: Main Showcase & Thumbnails */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative w-full aspect-square bg-[#FFFFFF] rounded-3xl overflow-hidden flex items-center justify-center border border-[#F6F3EE] p-8 shadow-xs">
              <img
                src={activeImg || product.image}
                alt={product.name}
                className="w-full h-full object-contain rounded-2xl"
              />
            </div>
            
            {/* Thumbnails grid */}
            <div className="grid grid-cols-6 gap-3">
              {/* Thumbnail 1: Main Image */}
              <button
                onClick={() => setActiveImg(product.image)}
                className={`aspect-square bg-[#FFFFFF] rounded-xl overflow-hidden border-2 transition-all p-1.5 ${
                  activeImg === product.image ? 'border-[#01B99F]' : 'border-[#F6F3EE] hover:border-slate-300'
                }`}
              >
                <img
                  src={product.image}
                  alt={`${product.name} main view`}
                  className="w-full h-full object-contain rounded-lg"
                />
              </button>

              {/* Other dummy variants of the product */}
              {[...Array(5)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(product.image)} // default variants fallback to main image
                  className={`aspect-square bg-[#FFFFFF] rounded-xl overflow-hidden border-2 transition-all p-1.5 ${
                    i === 1 ? 'border-[#01B99F]' : 'border-[#F6F3EE] hover:border-slate-300' // active outline match
                  }`}
                >
                  <img
                    src={product.image}
                    alt={`${product.name} variant view ${i}`}
                    className="w-full h-full object-contain rounded-lg opacity-85 hover:opacity-100"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Buying Dashboard */}
          <div className="lg:col-span-6 space-y-7 text-left font-sans text-[#2B2B2B]">
            <div className="space-y-3">
              <div className="flex justify-between items-start gap-4">
                <h1 className="text-3xl font-sans font-bold text-[#2B2B2B] leading-tight">
                  {product.name}
                </h1>
                <span className="inline-block text-[10px] font-black uppercase tracking-wider text-[#FF623E] bg-[#FFEBE5] px-2.5 py-1 rounded-sm shrink-0">
                  {product.category}
                </span>
              </div>

              {/* Price & Discount Info */}
              <div className="flex justify-between items-start flex-wrap gap-4 pt-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-[#2B2B2B]">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice ? (
                    <span className="text-sm line-through text-slate-400 font-normal">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  ) : (
                    <span className="text-sm line-through text-slate-400 font-normal">
                      ₹{(product.price + 100).toLocaleString('en-IN')}
                    </span>
                  )}
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm">
                    {discountPercent}% off
                  </span>
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="flex items-center gap-0.5 text-[#FFB95E]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#FFB95E] stroke-none" />
                      ))}
                    </div>
                    <span className="text-xs text-slate-500 font-bold">
                      ({product.reviewsCount || 120} Reviews)
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium mt-1 block">
                    {product.boughtCount || '200+ bought in past month'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2.5 pt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Quantity</span>
              <div className="flex items-center border border-[#F6F3EE] rounded-lg w-max bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-1.5 hover:bg-slate-50 text-slate-600 font-bold transition cursor-pointer select-none"
                >
                  −
                </button>
                <span className="px-5 text-sm font-bold text-[#2B2B2B] select-none">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-1.5 hover:bg-slate-50 text-slate-600 font-bold transition cursor-pointer select-none"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <button
                onClick={handleAddToCart}
                className="w-full py-4 border border-[#1D493E] text-[#1D493E] hover:bg-[#1D493E]/5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs bg-white"
              >
                <span>Add to Cart</span>
                <svg 
                  className="w-4 h-4 shrink-0" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M3 3h2l.4 2" />
                  <path d="M7 13h10l4-8H5.4" />
                  <path d="M7 13L5.4 5" />
                </svg>
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full py-4 bg-[#1D493E] hover:bg-[#15342c] text-white rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>Buy Now</span>
                <span className="text-sm font-sans">↗</span>
              </button>
            </div>

            {addedToCartSuccess && (
              <p className="text-xs font-bold text-emerald-600 animate-pulse">
                ✓ Product successfully added to your cart!
              </p>
            )}

            {/* Delivery option checks */}
            <div className="space-y-2 pt-2 text-[#2B2B2B]">
              <span className="text-xs font-bold uppercase tracking-wider block text-slate-500">Delivery options</span>
              <div className="relative flex items-center w-full">
                <input
                  type="text"
                  placeholder="Enter the pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full pl-3.5 pr-20 py-2.5 border border-[#F6F3EE] rounded-lg bg-white text-xs font-semibold focus:outline-none placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={handleCheckPincode as any}
                  className="absolute right-2 text-sky-500 hover:text-sky-600 rounded-lg text-xs font-bold transition cursor-pointer px-3 py-1.5"
                >
                  Check
                </button>
              </div>
              <p className="text-[10px] text-slate-450 font-semibold tracking-wide">
                Enter the pin code to know when it got delivered to our door step
              </p>
              {pincodeMessage ? (
                <p className={`text-xs font-bold ${pincodeMessage.startsWith('✓') ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {pincodeMessage}
                </p>
              ) : (
                <p className="text-xs font-semibold text-slate-500 pt-1">
                  FREE delivery as soon as <span className="font-bold text-[#2B2B2B]">Thu, 9 Apr, 7 am - 10 pm</span>
                </p>
              )}
            </div>

            {/* Product Specifications Table */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Product Details</h3>
              <div className="border border-[#F6F3EE] rounded-xl overflow-hidden divide-y divide-[#F6F3EE] bg-white shadow-xs">
                {productSpecs.map((sp) => (
                  <div key={sp.label} className="grid grid-cols-2 p-4 text-xs font-semibold items-center">
                    <span className="text-slate-400 font-sans">{sp.label}</span>
                    <span className="text-[#2B2B2B] text-right font-bold font-sans capitalize">{sp.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#F6F3EE] text-center font-semibold">
              <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl space-y-1.5">
                <Shield className="w-5 h-5 text-[#1D493E] stroke-[1.5]" />
                <span className="text-[10px] text-slate-500 tracking-tight font-sans">Safe Payment</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl space-y-1.5">
                <Truck className="w-5 h-5 text-[#1D493E] stroke-[1.5]" />
                <span className="text-[10px] text-slate-500 tracking-tight font-sans">Free & fast Shipping</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl space-y-1.5">
                <Box className="w-5 h-5 text-[#1D493E] stroke-[1.5]" />
                <span className="text-[10px] text-slate-500 tracking-tight font-sans">2 - 5 days Delivery</span>
              </div>
            </div>

          </div>
        </section>

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
                    className="w-full py-2.5 border border-[#1D493E] text-[#1D493E] hover:bg-[#1D493E] hover:text-white rounded-md font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm bg-white"
                  >
                    <span>Add to cart</span>
                    <svg 
                      className="w-3.5 h-3.5 shrink-0" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M3 3h2l.4 2" />
                      <path d="M7 13h10l4-8H5.4" />
                      <path d="M7 13L5.4 5" />
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
                      className="w-full py-2.5 border border-[#1D493E] text-[#1D493E] hover:bg-[#1D493E] hover:text-white rounded-md font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm bg-white"
                    >
                      <span>Add to cart</span>
                      <svg 
                        className="w-3.5 h-3.5 shrink-0" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="M3 3h2l.4 2" />
                        <path d="M7 13h10l4-8H5.4" />
                        <path d="M7 13L5.4 5" />
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
