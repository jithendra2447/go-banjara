'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/* ─────────────────── DATA ─────────────────── */
interface BlogPost {
  id: string;
  title: string;
  date: string;
  readTime: string;
  image: string;
  category: 'Travel Guide' | 'Tour Guide' | 'Most Popular' | 'Customer Stories';
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: 'customer-story-khardung-la-group',
    title: 'Conquering Khardung La & Pangong Tso: How 8 Strangers Became a Lifelong Go Banjara Tribe',
    date: 'Wednesday, March 12, 2024',
    readTime: '7 min read',
    image: '/ladakh-chadar-trek.jpg',
    category: 'Customer Stories',
  },
  {
    id: 'customer-story-spiti-valley-solo',
    title: 'From Corporate Burnout to Spiti Valley Monasteries: Priya’s 9-Day Journey with Go Banjara',
    date: 'Thursday, April 18, 2024',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=800&auto=format&fit=crop',
    category: 'Customer Stories',
  },
  {
    id: 'customer-story-meghalaya-root-bridges',
    title: 'Trekking 3,500 Steps to the Double Decker Root Bridge: Rohan’s Meghalaya Group Story',
    date: 'Monday, May 20, 2024',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
    category: 'Customer Stories',
  },
  {
    id: 'ladakh-bike-trip-guide',
    title: 'Ladakh Bike Trip Guide: Routes, Budget & Essential Tips for Riders',
    date: 'Sunday, August 12, 2023',
    readTime: '5 min read',
    image: '/ladakh-chadar-trek.jpg',
    category: 'Travel Guide',
  },
  {
    id: '7-day-leh-ladakh-itinerary-1',
    title: '7-Day Leh Ladakh Itinerary for First-Time Travelers',
    date: 'Sunday, August 12, 2023',
    readTime: '5 min read',
    image: '/ladakh-chadar-trek.jpg',
    category: 'Tour Guide',
  },
  {
    id: '7-day-leh-ladakh-itinerary-2',
    title: '7-Day Leh Ladakh Itinerary for First-Time Travelers',
    date: 'Sunday, August 12, 2023',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=800&auto=format&fit=crop',
    category: 'Most Popular',
  },
  {
    id: 'ultimate-ladakh-travel-guide',
    title: 'Ultimate Ladakh Travel Guide: Plan Your Perfect Himalayan Adventure',
    date: 'Sunday, August 12, 2023',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop',
    category: 'Travel Guide',
  },
  {
    id: 'leh-ladakh-travel-guide-2026-1',
    title: 'Leh Ladakh Travel Guide 2026: Best Time, Places & Complete Trip Planning',
    date: 'Sunday, August 12, 2023',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=800&auto=format&fit=crop',
    category: 'Tour Guide',
  },
  {
    id: 'leh-ladakh-travel-guide-2026-2',
    title: 'Leh Ladakh Travel Guide 2026: Best Time, Places & Complete Trip Planning',
    date: 'Sunday, August 12, 2023',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=800&auto=format&fit=crop',
    category: 'Most Popular',
  },
  {
    id: '7-day-leh-ladakh-first-time-1',
    title: '7-Day Leh Ladakh Itinerary for First-Time Travelers',
    date: 'Sunday, August 12, 2023',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=800&auto=format&fit=crop',
    category: 'Travel Guide',
  },
  {
    id: 'ladakh-bike-trip-routes-2',
    title: 'Ladakh Bike Trip Guide: Routes, Budget & Essential Tips for Riders',
    date: 'Sunday, August 12, 2023',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=800&auto=format&fit=crop',
    category: 'Tour Guide',
  },
  {
    id: '7-day-leh-first-time-2',
    title: '7-Day Leh Ladakh Itinerary for First-Time Travelers',
    date: 'Sunday, August 12, 2023',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=800&auto=format&fit=crop',
    category: 'Most Popular',
  },
  {
    id: 'spiti-valley-travel-guide',
    title: 'Spiti Valley Travel Guide: The Ultimate Road Trip Through Cold Desert',
    date: 'Monday, September 4, 2023',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=800&auto=format&fit=crop',
    category: 'Travel Guide',
  },
  {
    id: 'kashmir-great-lakes-trek',
    title: "Kashmir Great Lakes Trek: A Complete Trekker's Guide",
    date: 'Tuesday, October 10, 2023',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=800&auto=format&fit=crop',
    category: 'Travel Guide',
  },
  {
    id: 'manali-to-leh-highway',
    title: 'Manali to Leh Highway: Everything You Need to Know Before You Go',
    date: 'Friday, November 3, 2023',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=800&auto=format&fit=crop',
    category: 'Travel Guide',
  },
  {
    id: 'coorg-travel-guide',
    title: "Coorg Travel Guide: India's Scotland of the East",
    date: 'Saturday, December 2, 2023',
    readTime: '5 min read',
    image: '/coorg-coffee-estate.jpg',
    category: 'Travel Guide',
  },
  {
    id: 'rajasthan-road-trip',
    title: 'Rajasthan Road Trip: Forts, Deserts & Camel Safaris',
    date: 'Sunday, January 7, 2024',
    readTime: '7 min read',
    image: '/rajasthan-heritage-fort.jpg',
    category: 'Travel Guide',
  },
  {
    id: 'andaman-islands-guide',
    title: 'Andaman Islands: Hidden Beaches & Underwater Adventures',
    date: 'Monday, February 5, 2024',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    category: 'Travel Guide',
  },
];

const FAQ_ITEMS = [
  {
    question: 'What materials are the badges made from? Zinc alloy with glossy enamel fill.',
    answer: 'Our collectible badges are stamped from premium zinc alloy with glossy enamel fill. They are lightweight, durable, and safe to pin on bags, jackets, or backpacks without damaging fabric.',
  },
  {
    question: 'How big are the stickers?',
    answer: 'Our stickers come in two sizes: 5cm × 5cm (standard) and 8cm × 8cm (large). Both are printed on premium weatherproof vinyl.',
  },
  {
    question: 'Do you ship across India?',
    answer: 'Yes! We offer free standard shipping across all major cities and towns in India. Delivery typically takes 4–7 business days.',
  },
  {
    question: 'Can I return a product if I don\'t like it?',
    answer: 'Absolutely. We offer a 30-day hassle-free return policy on all unused products in their original packaging. Just raise a return request from your profile page.',
  },
  {
    question: 'I have no reviews on this product. Is it safe to buy?',
    answer: 'Yes! Every product we sell is quality-checked by our team. Newer products may not have reviews yet, but they go through the same rigorous testing as our bestsellers.',
  },
];

const POSTS_PER_PAGE = 9;

/* ─────────────────── COMPONENT ─────────────────── */
export default function BlogPage() {
  const [activeTab, setActiveTab] = useState<'Travel Guide' | 'Tour Guide' | 'Most Popular' | 'Customer Stories'>('Travel Guide');
  const [email, setEmail] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const tabs: ('Travel Guide' | 'Tour Guide' | 'Most Popular' | 'Customer Stories')[] = ['Travel Guide', 'Tour Guide', 'Most Popular', 'Customer Stories'];

  const filtered = BLOG_POSTS.filter((p) => p.category === activeTab);
  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div
      style={{
        width: '100%',
        background: 'rgba(255, 255, 255, 1)',
        paddingBottom: '62px',
      }}
    >
      {/* ── HERO SECTION ── */}
      {/* Figma: 1440×308, pt:62 pr:80 pb:24 pl:80, gap:32 */}
      <section
        style={{
          width: '100%',
          maxWidth: '1440px',
          minHeight: '308px',
          height: 'auto',
          background: 'rgba(255, 255, 255, 1)',
          paddingTop: '62px',
          paddingRight: '80px',
          paddingBottom: '24px',
          paddingLeft: '80px',
          boxSizing: 'border-box',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '32px',
          textAlign: 'center',
        }}
        className="px-6 md:px-[80px]"
      >
        {/* Text block — Figma: 1280×134, justify-content: space-between */}
        <div
          style={{
            width: '100%',
            maxWidth: '1280px',
            height: 'auto',
            minHeight: '134px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '4px',
            background: 'rgba(255, 255, 255, 1)',
            gap: '8px',
          }}
        >
          {/* BLOGS label — Figma: Faktum 600 14px uppercase, color: rgba(255,98,62,1), background: rgba(255,98,62,0.08) */}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '32px',
              padding: '6px 16px',
              fontFamily: 'Faktum, var(--font-sans), sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              lineHeight: '100%',
              letterSpacing: '1.2px',
              color: 'rgba(255, 98, 62, 1)',
              background: 'rgba(255, 98, 62, 0.08)',
              borderRadius: '100px',
              textTransform: 'uppercase',
              textAlign: 'center',
              verticalAlign: 'middle',
              boxSizing: 'border-box',
            }}
          >
            BLOGS
          </span>

          {/* Title — Figma: 1280×52, Fraunces 600 42px lh:100% rgba(43,43,43,1) */}
          <h1
            style={{
              width: '100%',
              maxWidth: '1280px',
              height: '52px',
              fontFamily: 'Fraunces, Georgia, serif',
              fontWeight: 600,
              fontSize: '42px',
              lineHeight: '100%',
              letterSpacing: '0px',
              color: 'rgba(43, 43, 43, 1)',
              margin: 0,
              textAlign: 'center',
              verticalAlign: 'middle',
            }}
          >
            Insights &amp; Updates
          </h1>

          {/* Subtitle — Figma: 1280×32, Faktum 500 24px lh:32px rgba(43,43,43,1) */}
          <p
            style={{
              width: '100%',
              maxWidth: '1280px',
              height: '32px',
              fontFamily: 'Faktum, var(--font-sans), sans-serif',
              fontWeight: 500,
              fontSize: '24px',
              lineHeight: '32px',
              letterSpacing: '0px',
              color: 'rgba(43, 43, 43, 1)',
              margin: 0,
              textAlign: 'center',
              verticalAlign: 'middle',
            }}
          >
            Follow my voices to discover unique voices, breathtaking landscapes &amp; unforgettable experiences
          </p>
        </div>

        {/* Subscribe form — Figma: 546×56, gap:8px, white bg */}
        <form
          onSubmit={(e) => { e.preventDefault(); alert(`Subscribed: ${email}`); }}
          style={{
            width: '546px',
            maxWidth: '100%',
            height: '56px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 1)',
            border: '1px solid rgba(200, 200, 200, 1)',
            borderRadius: '6px',
            boxSizing: 'border-box',
            overflow: 'hidden',
            padding: '0 0 0 0',
          }}
        >
            {/* Input — Figma: 398×25, Faktum 500 20px lh:100% rgba(141,141,141,1) placeholder */}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              style={{
                width: '398px',
                flex: 1,
                height: '25px',
                border: 'none',
                outline: 'none',
                paddingLeft: '16px',
                paddingRight: '8px',
                fontFamily: 'Faktum, var(--font-sans), sans-serif',
                fontWeight: 500,
                fontSize: '20px',
                lineHeight: '100%',
                letterSpacing: '0px',
                verticalAlign: 'middle',
                color: 'rgba(43, 43, 43, 1)',
                background: 'transparent',
              }}
              className="placeholder:text-[rgba(141,141,141,1)] placeholder:font-[500] placeholder:text-[20px]"
            />
            {/* Subscribe button — Figma: 124×47, pt:12 pr:24 pb:12 pl:24, radius:4, bg:rgba(29,73,62,1) */}
            <button
              type="submit"
              style={{
                width: '124px',
                height: '47px',
                paddingTop: '12px',
                paddingBottom: '12px',
                paddingLeft: '24px',
                paddingRight: '24px',
                gap: '8px',
                borderRadius: '4px',
                background: 'rgba(29, 73, 62, 1)',
                color: 'rgba(255, 255, 255, 1)',
                border: 'none',
                fontFamily: 'Faktum, var(--font-sans), sans-serif',
                fontWeight: 500,
                fontSize: '16px',
                lineHeight: '100%',
                letterSpacing: '0px',
                verticalAlign: 'middle',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
              }}
            >
              {/* Label — Figma: 76×20, Faktum 500 16px lh:100% rgba(255,255,255,1) */}
              <span
                style={{
                  width: '76px',
                  height: '20px',
                  fontFamily: 'Faktum, var(--font-sans), sans-serif',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '100%',
                  letterSpacing: '0px',
                  verticalAlign: 'middle',
                  color: 'rgba(255, 255, 255, 1)',
                  textAlign: 'center',
                }}
              >
                Subscribe
              </span>
            </button>
        </form>
      </section>

      {/* ── TABS + GRID SECTION ── */}
      {/* Figma: 1440×1590, pt:42 pr:80 pb:42 pl:80, gap:32, white */}
      <section
        style={{
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          paddingTop: '42px',
          paddingRight: '80px',
          paddingBottom: '42px',
          paddingLeft: '80px',
          gap: '32px',
          background: 'rgba(255, 255, 255, 1)',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}
        className="px-6 md:px-[80px]"
      >
        {/* Tab Bar — Native Go Banjara Theme */}
        <div
          style={{
            width: '100%',
            maxWidth: '1280px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
            gap: '16px',
            borderBottom: '2px solid rgba(204, 204, 204, 0.6)',
            background: 'rgba(255, 255, 255, 1)',
            boxSizing: 'border-box',
            overflowX: 'auto',
          }}
          className="no-scrollbar"
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              style={{
                width: 'auto',
                padding: '12px 16px',
                background: 'none',
                border: 'none',
                fontFamily: 'Faktum, var(--font-sans), sans-serif',
                fontWeight: 600,
                fontSize: '20px',
                lineHeight: '120%',
                color: activeTab === tab ? 'rgba(29, 73, 62, 1)' : 'rgba(43, 43, 43, 0.6)',
                cursor: 'pointer',
                borderBottom: activeTab === tab
                  ? '3px solid rgba(29, 73, 62, 1)'
                  : '3px solid transparent',
                marginBottom: '-2px',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 3-Column Card Grid */}
        <div
          style={{
            width: '100%',
            maxWidth: '1280px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px',
            marginBottom: '32px',
          }}
          className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        >
          {paginated.map((post) => (
            <Link
              href={`/blog/${post.id}`}
              key={post.id}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {/* Card */}
              <article
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  cursor: 'pointer',
                }}
                className="group"
              >
                {/* Image — 16:10 aspect ratio */}
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '16/10',
                    overflow: 'hidden',
                    background: '#e5e5e5',
                    borderRadius: '6px',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={post.image}
                    alt={`Go Banjara Blog - ${post.title}`}
                    title={`Go Banjara Blog - ${post.title}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                    }}
                    className="group-hover:scale-105"
                  />
                </div>

                {/* Text block */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1, justifyContent: 'space-between' }}>
                  {/* Title — Fraunces 600, fluid line height, no hardcoded height overlap */}
                  <h3
                    style={{
                      width: '100%',
                      fontFamily: 'Fraunces, Georgia, serif',
                      fontWeight: 600,
                      fontSize: '22px',
                      lineHeight: '1.35',
                      color: 'rgba(43, 43, 43, 1)',
                      margin: 0,
                    }}
                    className="group-hover:text-[#1D493E] transition-colors line-clamp-3"
                  >
                    {post.title}
                  </h3>

                  {/* Meta — Date & Read Time */}
                  <p
                    style={{
                      width: '100%',
                      fontFamily: 'Faktum, var(--font-sans), sans-serif',
                      fontWeight: 500,
                      fontSize: '14px',
                      lineHeight: '1.4',
                      color: 'rgba(43, 43, 43, 0.65)',
                      margin: 0,
                    }}
                  >
                    {post.date} &nbsp;•&nbsp; {post.readTime}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Pagination Bar — Native Go Banjara Theme */}
        {totalPages > 0 && (
          <div className="w-full max-w-[1280px] py-4 border-t border-gray-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Page info label */}
            <span style={{ fontFamily: 'Faktum, var(--font-sans), sans-serif' }} className="text-sm md:text-base font-medium text-[#2B2B2B]">
              Page {currentPage} of {totalPages}
            </span>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1.5">
              {/* Prev Button */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center rounded-[6px] border border-gray-200 bg-white text-[#1D493E] hover:bg-[#FAF9F6] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4 text-[#1D493E]" />
              </button>

              {/* Page Number Buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 flex items-center justify-center rounded-[6px] font-sans font-medium text-sm transition cursor-pointer ${
                    currentPage === page
                      ? 'bg-[#1D493E] text-white border border-[#1D493E] shadow-xs'
                      : 'bg-white text-[#2B2B2B] border border-gray-200 hover:border-[#1D493E] hover:text-[#1D493E]'
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-[6px] border border-gray-200 bg-white text-[#1D493E] hover:bg-[#FAF9F6] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4 text-[#1D493E]" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ── FAQ SECTION (matches shop page exactly) ── */}
      <section
        style={{
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          paddingTop: '42px',
          paddingBottom: '42px',
          paddingLeft: '80px',
          paddingRight: '80px',
          background: 'rgba(255, 255, 255, 1)',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Label */}
          <span
            style={{
              fontFamily: 'Faktum, var(--font-sans), sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              lineHeight: '100%',
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              color: 'rgba(255, 98, 62, 1)',
              background: 'rgba(255, 98, 62, 0.1)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '28px',
              padding: '0 16px',
              borderRadius: '4px',
              width: 'fit-content',
            }}
          >
            FAQ&apos;S
          </span>

          {/* Title */}
          <h2
            style={{
              fontFamily: 'Fraunces, Georgia, serif',
              fontWeight: 600,
              fontSize: '42px',
              lineHeight: '100%',
              letterSpacing: '0px',
              color: 'rgba(43, 43, 43, 1)',
              margin: 0,
            }}
          >
            Frequently asked questions
          </h2>
        </div>

        {/* Accordion */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', borderTop: '1px solid rgba(204, 204, 204, 1)' }}>
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                style={{
                  width: '100%',
                  borderBottom: '1px solid rgba(204, 204, 204, 1)',
                }}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px 0',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    gap: '16px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Faktum, var(--font-sans), sans-serif',
                      fontWeight: 500,
                      fontSize: '20px',
                      lineHeight: '32px',
                      color: 'rgba(43, 43, 43, 1)',
                      flex: 1,
                      maxWidth: '1196px',
                    }}
                  >
                    {item.question}
                  </span>
                  {isOpen ? (
                    <span style={{ fontSize: '24px', fontWeight: 600, color: 'rgba(255, 98, 62, 1)', flexShrink: 0, lineHeight: 1 }}>−</span>
                  ) : (
                    <span style={{ fontSize: '24px', fontWeight: 600, color: 'rgba(29, 73, 62, 1)', flexShrink: 0, lineHeight: 1 }}>+</span>
                  )}
                </button>
                {isOpen && (
                  <p
                    style={{
                      fontFamily: 'Faktum, var(--font-sans), sans-serif',
                      fontWeight: 500,
                      fontSize: '20px',
                      lineHeight: '32px',
                      color: 'rgba(141, 141, 141, 1)',
                      margin: 0,
                      maxWidth: '1196px',
                      paddingBottom: '20px',
                    }}
                  >
                    {item.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA SECTION (matches screenshot) ── */}
      <section
        style={{
          width: '100%',
          background: 'rgba(255, 255, 255, 1)',
          borderTop: '1px solid rgba(204, 204, 204, 1)',
          paddingTop: '80px',
          paddingBottom: '80px',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          {/* Heading */}
          <h2
            style={{
              fontFamily: 'Fraunces, Georgia, serif',
              fontWeight: 600,
              fontSize: '42px',
              lineHeight: '100%',
              letterSpacing: '0px',
              color: 'rgba(43, 43, 43, 1)',
              margin: 0,
              textAlign: 'center',
            }}
          >
            The{' '}
            <span style={{ color: 'rgba(255, 98, 62, 1)', fontStyle: 'italic' }}>best adventures</span>{' '}
            find their way to your inbox.
          </h2>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: 'Faktum, var(--font-sans), sans-serif',
              fontWeight: 500,
              fontSize: '18px',
              lineHeight: '28px',
              color: 'rgba(43, 43, 43, 0.7)',
              margin: 0,
              textAlign: 'center',
              maxWidth: '640px',
            }}
          >
            Hidden places, exclusive trip drops, curated gear, and stories from the road delivered before anyone else hears about them.
          </p>

          {/* Button */}
          <Link
            href="/travel"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(29, 73, 62, 1)',
              color: 'rgba(255, 255, 255, 1)',
              padding: '14px 32px',
              borderRadius: '6px',
              fontFamily: 'Faktum, var(--font-sans), sans-serif',
              fontWeight: 500,
              fontSize: '16px',
              lineHeight: '100%',
              letterSpacing: '0px',
              textDecoration: 'none',
              marginTop: '8px',
              transition: 'background 0.2s',
            }}
            className="hover:bg-[#163d33]"
          >
            Reserve your tour now ↗
          </Link>
        </div>
      </section>
    </div>
  );
}
