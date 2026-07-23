'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Share2, 
  Bookmark, 
  CheckCircle2, 
  MapPin, 
  Compass, 
  ChevronRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap,
  HelpCircle,
  ShoppingBag
} from 'lucide-react';

interface ArticleData {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  heroImage: string;
  excerpt: string;
  toc: { id: string; title: string }[];
  sections: {
    id: string;
    title: string;
    content: string[];
    highlight?: string;
    image?: string;
    imageCaption?: string;
    bullets?: string[];
    backlink?: { label: string; url: string };
  }[];
  faqs?: { q: string; a: string }[];
}

const ARTICLES_DATABASE: Record<string, ArticleData> = {
  'ladakh-bike-trip-guide': {
    id: 'ladakh-bike-trip-guide',
    title: 'Ladakh Bike Trip Guide: Routes, Budget & Essential Tips for Riders',
    category: 'Travel Guide',
    date: 'Sunday, August 12, 2023',
    readTime: '8 min read',
    author: {
      name: 'Rohan Sharma',
      role: 'Senior Expedition Lead & Motorcycling Specialist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    },
    heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1400&auto=format&fit=crop',
    excerpt: 'The ultimate SEO guide for motorcycling across Khardung La, Pangong Tso, and the Trans-Himalayan passes. Discover route comparisons, exact budget breakdowns, required permits, and gear packing essentials.',
    toc: [
      { id: 'overview', title: '1. Why Ride to Ladakh? (The Ultimate Himalayan Dream)' },
      { id: 'routes-comparison', title: '2. Route Comparison: Manali-Leh vs Srinagar-Leh' },
      { id: 'best-time', title: '3. Best Season & Weather Guidelines' },
      { id: 'permits-inner-line', title: '4. Inner Line Permits (ILP) & Documentation 2026' },
      { id: 'ams-acclimatization', title: '5. Altitude Sickness (AMS) Prevention & Health Safety' },
      { id: 'best-bikes', title: '6. Choosing the Best Bike & Mechanical Gear' },
      { id: 'budget-breakdown', title: '7. Complete Trip Budget & Expense Breakdown' },
      { id: 'faqs', title: '8. Frequently Asked Questions (Rider FAQs)' },
    ],
    sections: [
      {
        id: 'overview',
        title: '1. Why Ride to Ladakh? (The Ultimate Himalayan Dream)',
        content: [
          'Riding a motorcycle through the Trans-Himalayan desert of Ladakh is a badge of honor for motorcycling enthusiasts worldwide. Spanning elevations above 11,000 feet, this adventure tests physical endurance, mental resilience, and riding skills against breathtaking mountain scenery.',
          'Whether you choose to navigate the hairpin bends of the Gata Loops, conquer Khardung La (17,582 ft), or watch the crystal waters of Pangong Tso change shade under the alpine sun, a Ladakh motorcycle expedition is a life-changing journey.'
        ],
        highlight: 'Go Banjara Tip: Planning ahead with proper gear and acclimatization guarantees an unforgettable Himalayan ride. Explore our curated Travel Packages for fully supported group motorcycle expeditions.',
        backlink: { label: 'Explore Go Banjara Himalayan Travel Packages', url: '/travel' }
      },
      {
        id: 'routes-comparison',
        title: '2. Route Comparison: Manali-Leh vs Srinagar-Leh',
        content: [
          'Two main highway arterial routes connect mainland India to Leh. Selecting the right route depends on your departure point, total travel days, and altitude tolerance.'
        ],
        bullets: [
          'Manali to Leh Highway (474 km): High-thrill, rapid altitude climb via Rohtang Tunnel, Keylong, Baralacha La (16,040 ft), Lachung La, and Tanglang La (17,480 ft). Ideal for experienced mountain riders seeking pure adventure.',
          'Srinagar to Leh Highway (418 km): Gradual altitude ascension via Sonamarg, Zoji La pass, Drass (the 2nd coldest inhabited place on earth), Kargil, and Magnetic Hill. Highly recommended for first-timers to minimize Acute Mountain Sickness (AMS).'
        ],
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop',
        imageCaption: 'The winding tarmac of the Srinagar-Leh highway cut into the rugged cliffside of Kashmir.',
        backlink: { label: 'View Srinagar to Leh Fixed Departure Itinerary', url: '/travel/srinagar-to-leh' }
      },
      {
        id: 'best-time',
        title: '3. Best Season & Weather Guidelines',
        content: [
          'The motorcycling season in Ladakh runs from June to October when mountain passes are cleared of heavy snowdrift.',
          'June to July: High excitement with snow walls along Baralacha La and water crossings (gushing nalas). Days are bright and cool.',
          'August: Monsoon period in lower Himalayas (Manali/Srinagar side), requiring extra caution on slippery mountain stretches.',
          'September to Mid-October: Pristine autumn weather with crystal-clear skies, vibrant fall colors in Nubra Valley, and optimal dry tarmac traction.'
        ]
      },
      {
        id: 'permits-inner-line',
        title: '4. Inner Line Permits (ILP) & Documentation 2026',
        content: [
          'All travelers visiting inner border areas—including Nubra Valley, Pangong Lake, Hanle, and Tso Moriri—must possess an official Inner Line Permit (ILP) issued by the LAHDC (Leh Autonomous Hill Development Council).',
          'You can apply for the official permit online directly at the Leh District Official Portal (leh.nic.in). Make sure to carry 6 to 8 hard copies of your ILP, original Driving License, Vehicle Registration (RC), Pollution Certificate (PUC), and valid Government Photo ID (Aadhaar or Passport).'
        ],
        highlight: 'Requirement Note: Self-driven non-local rental bikes (from Delhi or Manali) are NOT permitted inside Nubra Valley or Pangong. You must rent a Leh-registered motorcycle or travel with a licensed tour operator.',
        backlink: { label: 'Apply on Official Leh District Permit Portal (leh.nic.in)', url: 'https://leh.nic.in' }
      },
      {
        id: 'ams-acclimatization',
        title: '5. Altitude Sickness (AMS) Prevention & Health Safety',
        content: [
          'Leh is situated at 11,500 feet above sea level. Ascending rapidly into high altitudes reduces atmospheric oxygen pressure. Adequate rest during the first 36 hours in Leh is non-negotiable.',
          'Review the National Health Authority Advisory on AMS (nhm.gov.in) before riding to high mountain passes like Khardung La (17,582 ft).'
        ],
        bullets: [
          'Stay Hydrated: Drink 4 to 5 liters of fluids (water, ORS, herbal tea) daily.',
          'Pacing: Avoid heavy exertion or rapid climbing during the first two days.',
          'Medical Kit: Carry Diamox (after medical consultation), Painkillers, Oximeter, and Bandages.',
          'Oxygen Cylinder: Carry a portable oxygen canister for high passes like Khardung La or Chang La.'
        ],
        backlink: { label: 'Check Live Himalayan Road Status on BRO Official Site (bro.gov.in)', url: 'https://bro.gov.in' }
      },
      {
        id: 'best-bikes',
        title: '6. Choosing the Best Bike & Mechanical Gear',
        content: [
          'Choosing a reliable machine ensures smooth navigation through water crossings and steep gradients.',
          'Top Recommended Bikes: Royal Enfield Himalayan 450, BMW GS 310, Hero XPulse 200 4V, or Royal Enfield Classic 350.',
          'Essential Bike Spares: Clutch wire, accelerator cable, spare tube, puncture repair kit, foot pump, spark plug, and chain lube.'
        ],
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
        imageCaption: 'Riders pausing at a high mountain pass in Ladakh.',
        backlink: { label: 'Shop Essential Outdoor Gear & Bags at Go Banjara Shop', url: '/shop' }
      },
      {
        id: 'budget-breakdown',
        title: '7. Complete Trip Budget & Expense Breakdown',
        content: [
          'Here is an estimated budget breakdown per rider for a 10-Day Ladakh Bike Expedition:'
        ],
        bullets: [
          'Bike Rental: ₹1,500 – ₹2,200 / day (₹15,000 – ₹22,000 total)',
          'Fuel: Approx. ₹6,000 – ₹8,000 (depending on mileage and route)',
          'Accommodation & Food: ₹1,200 – ₹2,500 / day (₹12,000 – ₹25,000 total)',
          'Permits & Wildlife Fees: ₹800 – ₹1,200',
          'Total Estimated Expense: ₹35,000 to ₹55,000 per rider'
        ],
        backlink: { label: 'Check India Meteorological Department Weather Forecast (mausam.imd.gov.in)', url: 'https://mausam.imd.gov.in' }
      }
    ],
    faqs: [
      {
        q: 'Is a Ladakh bike trip suitable for beginners?',
        a: 'While beginners can undertake the trip, prior experience with long-distance highway riding and mountain hairpin bends is strongly recommended.'
      },
      {
        q: 'Can I take my personal private bike to Ladakh?',
        a: 'Yes! Personal bikes registered in your name (or family name with NOC) can be driven across all routes in Ladakh, including Nubra Valley and Pangong.'
      },
      {
        q: 'Which mobile network works best in Ladakh?',
        a: 'Only POSTPAID mobile connections work in Ladakh. BSNL offers the widest coverage across remote areas, followed by Jio and Airtel in Leh town.'
      }
    ]
  }
};

const DEFAULT_ARTICLE: ArticleData = {
  id: 'general-guide',
  title: 'Himalayan Wanderlust: The Complete Travel & Packing Guide',
  category: 'Travel Guide',
  date: 'Sunday, August 12, 2023',
  readTime: '5 min read',
  author: {
    name: 'Go Banjara Team',
    role: 'Destination Curators',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
  },
  heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1400&auto=format&fit=crop',
  excerpt: 'Everything you need to know to plan a seamless, safe, and breathtaking journey across mountain landscapes.',
  toc: [
    { id: 'overview', title: '1. Destination Overview & Highlights' },
    { id: 'packing', title: '2. Essential Gear & Equipment List' },
    { id: 'safety', title: '3. Altitude & Safety Preparation' },
  ],
  sections: [
    {
      id: 'overview',
      title: '1. Destination Overview & Highlights',
      content: [
        'Traveling across mountain corridors is an unforgettable experience. From pristine alpine lakes to high altitude monastery trails, every corner offers a story of natural beauty and cultural heritage.',
        'Proper preparation is key to ensuring a smooth, rewarding adventure.'
      ],
      highlight: 'Go Banjara Tip: Pack light, respect local community guidelines, and leave no trace behind.'
    },
    {
      id: 'packing',
      title: '2. Essential Gear & Equipment List',
      content: [
        'Layering is crucial when traveling in high altitudes where temperatures fluctuate rapidly between day and night.'
      ],
      bullets: [
        'Thermal base layers & windproof fleece jackets',
        'Waterproof trekking boots with sturdy ankle support',
        'UV400 polarized sunglasses & high-SPF sunblock',
        'Portable power bank and thermal insulated water bottle'
      ]
    },
    {
      id: 'safety',
      title: '3. Altitude & Safety Preparation',
      content: [
        'Take your time to acclimatize when ascending above 8,000 feet. Hydrate regularly and listen to your body at every step of the trail.'
      ]
    }
  ]
};

export default function BlogPostDetail() {
  const params = useParams();
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  const rawId = (params?.id as string) || 'ladakh-bike-trip-guide';
  const article = ARTICLES_DATABASE[rawId] || {
    ...DEFAULT_ARTICLE,
    id: rawId,
    title: rawId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div 
      style={{
        width: '100%',
        background: 'rgba(255, 255, 255, 1)',
        minHeight: '100vh',
        fontFamily: 'Faktum, var(--font-sans), sans-serif',
        paddingBottom: '62px',
      }}
      className="w-full select-none"
    >
      {/* SEO Schema Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: article.title,
            description: article.excerpt,
            image: article.heroImage,
            author: {
              '@type': 'Person',
              name: article.author.name,
            },
            publisher: {
              '@type': 'Organization',
              name: 'Go Banjara',
              logo: {
                '@type': 'ImageObject',
                url: 'https://go-banjara.com/logo.png',
              },
            },
            datePublished: article.date,
          }),
        }}
      />

      {/* ── BREADCRUMB BAR (Matching Go Banjara Shop/Product Breadcrumb Spec) ── */}
      <div className="w-full bg-white border-b border-gray-200 py-3.5 px-6 md:px-[80px]">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-4 flex-wrap">
          <nav className="flex items-center gap-2 text-sm font-sans font-medium">
            <Link 
              href="/" 
              style={{
                fontFamily: "Faktum, sans-serif",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "20px",
                color: "rgba(141, 141, 141, 1)",
              }}
              className="hover:text-[#1D493E] transition-colors"
            >
              Home
            </Link>
            <span style={{ color: "rgba(141, 141, 141, 1)", fontSize: "14px" }}>›</span>
            <Link 
              href="/blog" 
              style={{
                fontFamily: "Faktum, sans-serif",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "20px",
                color: "rgba(141, 141, 141, 1)",
              }}
              className="hover:text-[#1D493E] transition-colors"
            >
              Blogs
            </Link>
            <span style={{ color: "rgba(141, 141, 141, 1)", fontSize: "14px" }}>›</span>
            <span 
              style={{
                fontFamily: "Faktum, sans-serif",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "20px",
                color: "rgba(141, 141, 141, 1)",
              }}
            >
              {article.category}
            </span>
            <span style={{ color: "rgba(141, 141, 141, 1)", fontSize: "14px" }}>›</span>
            <span 
              style={{
                fontFamily: "Faktum, sans-serif",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "20px",
                color: "rgba(29, 73, 62, 1)",
              }}
              className="font-semibold line-clamp-1 max-w-[280px] sm:max-w-none"
            >
              {article.title}
            </span>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-2 rounded-full border transition cursor-pointer ${
                bookmarked ? 'bg-[#1D493E] text-white border-[#1D493E]' : 'bg-white text-[#1D493E] border-[#E5E0D5] hover:bg-[#FAF9F6]'
              }`}
              title={bookmarked ? 'Saved to bookmarks' : 'Bookmark article'}
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-[#1D493E] border border-[#E5E0D5] hover:bg-[#FAF9F6] text-xs font-semibold transition cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied!' : 'Share Article'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── ARTICLE HEADER ── */}
      <header className="max-w-4xl mx-auto px-6 pt-10 pb-6 text-center">
        {/* Category Pill — Native Go Banjara Pill */}
        <div className="w-[120px] min-w-[120px] h-[26px] flex items-center justify-center bg-[#FFEBE5] rounded-[4px] mb-4 mx-auto">
          <span className="font-sans font-semibold text-[14px] leading-none tracking-[1.2px] text-[#FF623E] uppercase px-2">
            {article.category}
          </span>
        </div>

        {/* Title — Native Go Banjara Serif Heading */}
        <h1 
          style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 600, color: 'rgba(43, 43, 43, 1)' }}
          className="text-3xl md:text-5xl leading-tight md:leading-snug mb-6"
        >
          {article.title}
        </h1>

        {/* Author & Meta Row */}
        <div className="flex items-center justify-center gap-4 text-xs md:text-sm text-[#2B2B2B]/70 font-medium border-y border-gray-200 py-3.5">
          <div className="flex items-center gap-2">
            <img 
              src={article.author.avatar} 
              alt={`${article.author.name} | Go Banjara Travel Specialist`}
              title={`${article.author.name} | Go Banjara Team`}
              className="w-7 h-7 rounded-full object-cover border border-gray-200"
            />
            <span className="font-semibold text-[#2B2B2B]">{article.author.name}</span>
          </div>
          <span>•</span>
          <span>{article.date}</span>
          <span>•</span>
          <span>{article.readTime}</span>
        </div>
      </header>

      {/* ── HERO COVER IMAGE WITH CAPTION ── */}
      <div className="max-w-5xl mx-auto px-6 mb-12">
        <div className="w-full h-[320px] md:h-[500px] rounded-[4px] overflow-hidden bg-gray-100 border border-gray-150">
          <img 
            src={article.heroImage} 
            alt={`${article.title} | Go Banjara Himalayan Travel Guide`}
            title={`${article.title} - Go Banjara Photography`}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-center text-xs text-[#2B2B2B]/60 italic mt-3 font-medium">
          Riding through the majestic mountain corridors of Ladakh. Photo: Go Banjara Explorers
        </p>
      </div>

      {/* ── ARTICLE CONTENT & SIDEBAR ── */}
      <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row gap-12 items-start">
        
        {/* Table of Contents Sidebar (Native Go Banjara Theme) */}
        {article.toc.length > 0 && (
          <aside 
            style={{
              background: 'rgba(255, 255, 255, 1)',
              border: '1px solid rgba(204, 204, 204, 1)',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
            className="w-full lg:w-80 p-6 sticky top-28 shrink-0 select-none"
          >
            <h4 
              style={{
                fontFamily: 'Fraunces, Georgia, serif',
                fontWeight: 600,
                fontSize: '20px',
                color: 'rgba(43, 43, 43, 1)',
                borderBottom: '1px solid rgba(204, 204, 204, 1)',
              }}
              className="pb-3 mb-4"
            >
              Table of Contents
            </h4>
            <nav className="space-y-2.5 text-sm font-medium">
              {article.toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  style={{
                    fontFamily: 'Faktum, var(--font-sans), sans-serif',
                    color: 'rgba(43, 43, 43, 0.8)',
                  }}
                  className="block py-1 hover:text-[#FF5A36] transition"
                >
                  {item.title}
                </a>
              ))}
            </nav>
          </aside>
        )}

        {/* Main Article Body */}
        <main className="flex-1 space-y-10 text-[#2B2B2B] leading-relaxed">
          {/* Excerpt Lead */}
          <p 
            style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'rgba(43, 43, 43, 1)' }}
            className="text-xl md:text-[22px] font-medium leading-relaxed italic border-l-4 border-[#1D493E] pl-4 py-1"
          >
            &ldquo;{article.excerpt}&rdquo;
          </p>

          {/* Sections */}
          {article.sections.map((section) => (
            <section key={section.id} id={section.id} className="space-y-4 pt-2">
              <h2 
                style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 600, color: 'rgba(43, 43, 43, 1)' }}
                className="text-2xl border-b border-gray-200 pb-2"
              >
                {section.title}
              </h2>

              {section.content.map((paragraph, pIdx) => (
                <p 
                  key={pIdx} 
                  style={{ fontFamily: 'Faktum, var(--font-sans), sans-serif', color: 'rgba(43, 43, 43, 0.9)' }}
                  className="text-base leading-relaxed font-normal"
                >
                  {paragraph}
                </p>
              ))}

              {/* Highlight Callout Box — Native Go Banjara Accent */}
              {section.highlight && (
                <div 
                  style={{
                    background: 'rgba(255, 235, 232, 0.5)',
                    borderLeft: '4px solid rgba(255, 98, 62, 1)',
                    borderRadius: '0 4px 4px 0',
                    color: 'rgba(43, 43, 43, 1)',
                  }}
                  className="p-5 my-5 text-sm font-semibold space-y-2"
                >
                  <p>{section.highlight}</p>
                  {section.backlink && (
                    section.backlink.url.startsWith('http') ? (
                      <a 
                        href={section.backlink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1D493E] underline hover:text-[#FF5A36] transition cursor-pointer"
                      >
                        <span>{section.backlink.label}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <Link 
                        href={section.backlink.url}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1D493E] underline hover:text-[#FF5A36] transition cursor-pointer"
                      >
                        <span>{section.backlink.label}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    )
                  )}
                </div>
              )}

              {/* Standalone Backlink if no highlight box */}
              {!section.highlight && section.backlink && (
                <div className="my-3">
                  {section.backlink.url.startsWith('http') ? (
                    <a 
                      href={section.backlink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1D493E] hover:text-[#FF5A36] transition cursor-pointer"
                    >
                      <span>{section.backlink.label}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#FF5A36]" />
                    </a>
                  ) : (
                    <Link 
                      href={section.backlink.url}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1D493E] hover:text-[#FF5A36] transition cursor-pointer"
                    >
                      <span>{section.backlink.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#1D493E]" />
                    </Link>
                  )}
                </div>
              )}

              {/* Bullets List */}
              {section.bullets && section.bullets.length > 0 && (
                <ul className="space-y-2.5 my-4">
                  {section.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2.5 text-sm font-medium text-[#2B2B2B]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1D493E] shrink-0 mt-2" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Inline Section Image */}
              {section.image && (
                <div className="space-y-2 my-6">
                  <div className="w-full h-80 rounded-[4px] overflow-hidden border border-gray-150 shadow-sm">
                    <img 
                      src={section.image} 
                      alt={`${section.title} | Go Banjara Travel Guide`}
                      title={`${section.title} - Go Banjara Photography`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {section.imageCaption && (
                    <p className="text-center text-xs text-[#2B2B2B]/60 italic font-medium">
                      {section.imageCaption}
                    </p>
                  )}
                </div>
              )}
            </section>
          ))}

          {/* FAQs Section — Matching Go Banjara Accordion Theme */}
          {article.faqs && article.faqs.length > 0 && (
            <section id="faqs" className="w-full pt-8 border-t border-gray-200">
              <div className="mb-6">
                <div className="w-[54px] h-[26px] flex items-center justify-center bg-[#FFEBE5] rounded-[4px] mb-2">
                  <span className="font-sans font-semibold text-[14px] leading-none tracking-[1.2px] text-[#FF623E] uppercase">
                    FAQ'S
                  </span>
                </div>
                <h2 className="font-serif font-semibold text-2xl md:text-[36px] text-[#2B2B2B]">
                  Frequently asked questions
                </h2>
              </div>

              <div className="w-full border-t border-gray-200 divide-y divide-gray-200">
                {article.faqs.map((faq, fIdx) => (
                  <div key={fIdx} className="py-5 text-left border-b border-gray-200 space-y-2">
                    <h4 className="font-sans font-medium text-lg md:text-[20px] text-[#2B2B2B]">
                      {faq.q}
                    </h4>
                    <p className="font-sans font-medium text-base md:text-[18px] text-[#8D8D8D] leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Author Signature Line — Minimal Native Style */}
          <div className="pt-8 border-t border-gray-200 flex items-center gap-4 mt-12">
            <img 
              src={article.author.avatar} 
              alt={`${article.author.name} | Go Banjara Travel Author`}
              title={`${article.author.name} | Go Banjara Team`}
              className="w-12 h-12 rounded-full object-cover border border-gray-200"
            />
            <div>
              <h4 style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 600, color: 'rgba(43, 43, 43, 1)' }} className="text-base">
                Written by {article.author.name}
              </h4>
              <p style={{ fontFamily: 'Faktum, var(--font-sans), sans-serif', color: 'rgba(43, 43, 43, 0.6)' }} className="text-xs font-medium">
                {article.author.role}
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* ── RELATED ARTICLES RECOMMENDATION (Go Banjara Home Grid Spec) ── */}
      <section className="max-w-6xl mx-auto px-6 mt-20 pt-12 border-t border-gray-200">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'rgba(43, 43, 43, 1)' }} className="text-2xl md:text-3xl font-semibold">
              Related Travel Guides
            </h3>
            <p className="text-xs md:text-sm text-[#2B2B2B]/70 font-medium mt-1">Explore more curated stories &amp; itineraries</p>
          </div>
          <Link 
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#1D493E] hover:text-[#FF5A36] transition cursor-pointer"
          >
            <span>View All Stories</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              id: '7-day-leh-ladakh-itinerary-1',
              title: '7-Day Leh Ladakh Itinerary for First-Time Travelers',
              date: 'August 12, 2023',
              readTime: '5 min read',
              image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop',
            },
            {
              id: 'spiti-valley-travel-guide',
              title: 'Spiti Valley Travel Guide: Cold Desert Adventure',
              date: 'September 4, 2023',
              readTime: '6 min read',
              image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&auto=format&fit=crop',
            },
            {
              id: 'kashmir-great-lakes-trek',
              title: "Kashmir Great Lakes Trek: Complete Trekker's Guide",
              date: 'October 10, 2023',
              readTime: '7 min read',
              image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&auto=format&fit=crop',
            },
          ].map((item) => (
            <Link key={item.id} href={`/blog/${item.id}`} className="w-full flex flex-col gap-3 group block text-left">
              <div className="relative w-full aspect-[16/10] overflow-hidden rounded-t-[4px] bg-gray-100 border border-gray-150">
                <img 
                  src={item.image} 
                  alt={`${item.title} | Go Banjara Blog`}
                  title={`${item.title} - Go Banjara Story`}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-serif font-semibold text-lg text-[#2B2B2B] group-hover:text-[#FF5A36] transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="font-sans font-medium text-xs text-[#2B2B2B]/60">
                  {item.date} • {item.readTime}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
