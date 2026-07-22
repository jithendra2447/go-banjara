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
        highlight: 'Go Banjara Tip: Planning ahead with proper gear and acclimatization guarantees an unforgettable Himalayan ride. Explore our curated [Travel Packages](/travel) for fully supported group motorcycle expeditions.',
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
          'Make sure to carry 6 to 8 hard copies of your ILP, original Driving License, Vehicle Registration (RC), Pollution Certificate (PUC), and valid Government Photo ID (Aadhaar or Passport).'
        ],
        highlight: 'Requirement Note: Self-driven non-local rental bikes (from Delhi or Manali) are NOT permitted inside Nubra Valley or Pangong. You must rent a Leh-registered motorcycle or travel with a licensed tour operator.'
      },
      {
        id: 'ams-acclimatization',
        title: '5. Altitude Sickness (AMS) Prevention & Health Safety',
        content: [
          'Leh is situated at 11,500 feet above sea level. Ascending rapidly into high altitudes reduces atmospheric oxygen pressure. Adequate rest during the first 36 hours in Leh is non-negotiable.'
        ],
        bullets: [
          'Stay Hydrated: Drink 4 to 5 liters of fluids (water, ORS, herbal tea) daily.',
          'Pacing: Avoid heavy exertion or rapid climbing during the first two days.',
          'Medical Kit: Carry Diamox (after medical consultation), Painkillers, Oximeter, and Bandages.',
          'Oxygen Cylinder: Carry a portable oxygen canister for high passes like Khardung La or Chang La.'
        ]
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
        ]
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
        backgroundColor: '#FFFFFF',
        minHeight: '100vh',
        fontFamily: '"Outfit", sans-serif',
      }}
      className="w-full pb-20 select-none"
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

      {/* ── BREADCRUMB & TOP NAV BAR ── */}
      <div className="w-full bg-[#FAF9F6] border-b border-[#E5E0D5] py-4 px-6 md:px-[80px]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1D493E] hover:opacity-80 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Blogs</span>
          </Link>

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
        {/* Category Pill */}
        <span 
          style={{
            backgroundColor: '#F4F1EA',
            color: '#1D493E',
            border: '1px solid #E5E0D5',
            fontFamily: '"Outfit", sans-serif',
          }}
          className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
        >
          {article.category}
        </span>

        {/* Title */}
        <h1 
          style={{ fontFamily: '"Fraunces", serif', color: '#1D493E' }}
          className="text-3xl md:text-5xl font-bold leading-tight md:leading-snug mb-6"
        >
          {article.title}
        </h1>

        {/* Author & Meta Row */}
        <div className="flex items-center justify-center gap-4 text-xs md:text-sm text-[#526E65] font-medium border-y border-[#E5E0D5] py-3.5">
          <div className="flex items-center gap-2">
            <img 
              src={article.author.avatar} 
              alt={article.author.name}
              className="w-8 h-8 rounded-full object-cover border border-[#1D493E]/20"
            />
            <span className="font-semibold text-[#1D493E]">{article.author.name}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-[#1D493E]" />
            <span>{article.date}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-[#1D493E]" />
            <span>{article.readTime}</span>
          </div>
        </div>
      </header>

      {/* ── HERO COVER IMAGE WITH CAPTION ── */}
      <div className="max-w-5xl mx-auto px-6 mb-12">
        <div className="w-full h-[320px] md:h-[500px] rounded-3xl overflow-hidden shadow-xl border border-[#E5E0D5]">
          <img 
            src={article.heroImage} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-center text-xs text-[#526E65] italic mt-3 font-medium">
          Riding through the majestic mountain corridors of Ladakh. Photo: Go Banjara Explorers
        </p>
      </div>

      {/* ── ARTICLE CONTENT & SIDEBAR ── */}
      <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row gap-12 items-start">
        
        {/* Table of Contents Sidebar (Sticky) */}
        {article.toc.length > 0 && (
          <aside 
            style={{
              backgroundColor: '#FAF9F6',
              border: '1px solid #E5E0D5',
              borderRadius: '20px',
            }}
            className="w-full lg:w-80 p-6 sticky top-28 shrink-0"
          >
            <h4 
              style={{ fontFamily: '"Fraunces", serif', color: '#1D493E' }}
              className="font-bold text-base mb-4 pb-2 border-b border-[#E5E0D5] flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-[#FF5A36]" />
              Quick Navigation (TOC)
            </h4>
            <nav className="space-y-2 text-xs font-semibold text-[#526E65]">
              {article.toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="block py-1 hover:text-[#1D493E] hover:underline transition line-clamp-1"
                >
                  {item.title}
                </a>
              ))}
            </nav>

            {/* CTA Promo Widget */}
            <div 
              style={{
                backgroundColor: '#1D493E',
                color: '#FFFFFF',
                borderRadius: '16px',
              }}
              className="p-5 mt-6 space-y-3"
            >
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D3FFBF]">
                <Zap className="w-4 h-4 text-[#FF5A36]" />
                <span>Go Banjara Travel</span>
              </div>
              <h5 style={{ fontFamily: '"Fraunces", serif' }} className="font-bold text-base leading-tight">
                Want a Fully Guided Ladakh Bike Expedition?
              </h5>
              <p className="text-xs text-white/80 leading-relaxed font-medium">
                Includes Royal Enfield 450, backup vehicle, mechanic, permits & 3-star stay.
              </p>
              <Link 
                href="/travel"
                className="inline-flex items-center gap-2 w-full justify-center bg-white text-[#1D493E] hover:bg-[#FAF9F6] py-2.5 rounded-xl font-bold text-xs transition cursor-pointer"
              >
                <span>View Ladakh Packages</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </aside>
        )}

        {/* Main Article Body */}
        <main className="flex-1 space-y-10 text-[#2B2B2B] leading-relaxed">
          {/* Excerpt Lead */}
          <p 
            style={{ fontFamily: '"Fraunces", serif', color: '#1D493E' }}
            className="text-xl font-medium leading-relaxed italic border-l-4 border-[#1D493E] pl-4 py-1"
          >
            &ldquo;{article.excerpt}&rdquo;
          </p>

          {/* Sections */}
          {article.sections.map((section) => (
            <section key={section.id} id={section.id} className="space-y-4 pt-2">
              <h2 
                style={{ fontFamily: '"Fraunces", serif', color: '#1D493E' }}
                className="text-2xl font-bold border-b border-[#E5E0D5] pb-2"
              >
                {section.title}
              </h2>

              {section.content.map((paragraph, pIdx) => (
                <p key={pIdx} className="text-base text-[#4A5568] leading-relaxed font-normal">
                  {paragraph}
                </p>
              ))}

              {/* Highlight Callout Box */}
              {section.highlight && (
                <div 
                  style={{
                    backgroundColor: '#F4F1EA',
                    borderLeft: '4px solid #1D493E',
                    borderRadius: '12px',
                  }}
                  className="p-5 my-4 text-sm font-semibold text-[#1D493E] flex items-start gap-3 shadow-sm"
                >
                  <Sparkles className="w-5 h-5 text-[#FF5A36] shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p>{section.highlight}</p>
                    {section.backlink && (
                      <Link 
                        href={section.backlink.url}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1D493E] underline hover:text-[#FF5A36] transition cursor-pointer"
                      >
                        <span>{section.backlink.label}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Bullets List */}
              {section.bullets && section.bullets.length > 0 && (
                <ul className="space-y-2.5 my-4">
                  {section.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2.5 text-sm font-medium text-[#2D3748]">
                      <CheckCircle2 className="w-4 h-4 text-[#1D493E] shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Inline Section Image */}
              {section.image && (
                <div className="space-y-2 my-6">
                  <div className="w-full h-80 rounded-2xl overflow-hidden border border-[#E5E0D5] shadow-md">
                    <img 
                      src={section.image} 
                      alt={section.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {section.imageCaption && (
                    <p className="text-center text-xs text-[#526E65] italic font-medium">
                      {section.imageCaption}
                    </p>
                  )}
                </div>
              )}
            </section>
          ))}

          {/* Rider FAQs Accordion (SEO Schema) */}
          {article.faqs && article.faqs.length > 0 && (
            <section id="faqs" className="space-y-4 pt-6">
              <h2 
                style={{ fontFamily: '"Fraunces", serif', color: '#1D493E' }}
                className="text-2xl font-bold border-b border-[#E5E0D5] pb-2 flex items-center gap-2"
              >
                <HelpCircle className="w-6 h-6 text-[#FF5A36]" />
                Frequently Asked Questions (Rider FAQs)
              </h2>

              <div className="space-y-3">
                {article.faqs.map((faq, fIdx) => (
                  <div 
                    key={fIdx}
                    style={{
                      backgroundColor: '#FAF9F6',
                      border: '1px solid #E5E0D5',
                      borderRadius: '16px',
                    }}
                    className="p-5 space-y-2"
                  >
                    <h4 style={{ fontFamily: '"Fraunces", serif', color: '#1D493E' }} className="font-bold text-base">
                      Q: {faq.q}
                    </h4>
                    <p className="text-sm text-[#4A5568] leading-relaxed font-medium">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Author Signature Box */}
          <div 
            style={{
              backgroundColor: '#FAF9F6',
              border: '1px solid #E5E0D5',
              borderRadius: '20px',
            }}
            className="p-6 flex items-center gap-4 mt-12"
          >
            <img 
              src={article.author.avatar} 
              alt={article.author.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#1D493E]"
            />
            <div>
              <h4 style={{ fontFamily: '"Fraunces", serif', color: '#1D493E' }} className="font-bold text-lg">
                Written by {article.author.name}
              </h4>
              <p className="text-xs text-[#526E65] font-medium mt-0.5">{article.author.role}</p>
              <p className="text-xs text-[#4A5568] mt-2">
                Passionate about high-altitude expeditions, mountain culture, and curating authentic travel experiences across India.
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* ── RELATED ARTICLES RECOMMENDATION ── */}
      <section className="max-w-6xl mx-auto px-6 mt-20 pt-12 border-t border-[#E5E0D5]">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 style={{ fontFamily: '"Fraunces", serif', color: '#1D493E' }} className="text-2xl md:text-3xl font-bold">
              Related Travel Guides
            </h3>
            <p className="text-xs md:text-sm text-[#526E65] font-medium mt-1">Explore more curated stories &amp; itineraries</p>
          </div>
          <Link 
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-bold text-[#1D493E] hover:text-[#FF5A36] transition cursor-pointer"
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
              image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop',
            },
            {
              id: 'spiti-valley-travel-guide',
              title: 'Spiti Valley Travel Guide: Cold Desert Adventure',
              date: 'September 4, 2023',
              image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&auto=format&fit=crop',
            },
            {
              id: 'kashmir-great-lakes-trek',
              title: "Kashmir Great Lakes Trek: Complete Trekker's Guide",
              date: 'October 10, 2023',
              image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&auto=format&fit=crop',
            },
          ].map((item) => (
            <Link key={item.id} href={`/blog/${item.id}`} className="group block">
              <div 
                style={{
                  backgroundColor: '#FAF9F6',
                  border: '1px solid #E5E0D5',
                  borderRadius: '20px',
                  overflow: 'hidden',
                }}
                className="transition duration-300 group-hover:shadow-lg group-hover:-translate-y-1"
              >
                <div className="w-full h-48 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-5 space-y-2">
                  <span className="text-[11px] font-bold text-[#526E65] uppercase tracking-wider">{item.date}</span>
                  <h4 
                    style={{ fontFamily: '"Fraunces", serif', color: '#1D493E' }}
                    className="font-bold text-base group-hover:text-[#FF5A36] transition line-clamp-2"
                  >
                    {item.title}
                  </h4>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
