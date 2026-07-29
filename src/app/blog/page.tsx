'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

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
    image: '/manali-hill-station.jpg',
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

const POSTS_PER_PAGE = 6;

/* ─────────────────── COMPONENT ─────────────────── */
export default function BlogPage() {
  type TabType = 'All' | 'Travel Guide' | 'Tour Guide' | 'Most Popular' | 'Customer Stories';
  const [activeTab, setActiveTab] = useState<TabType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const tabs: TabType[] = ['All', 'Travel Guide', 'Tour Guide', 'Most Popular', 'Customer Stories'];

  const filtered = BLOG_POSTS.filter((p) => {
    const matchesTab = activeTab === 'All' || p.category === activeTab;
    const matchesSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const element = document.getElementById('blog-grid');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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
      {/* Mobile: 430px max, pt:24 pr:20 pb:24 pl:20, gap:20 | Desktop: 1440x308, pt:62 pr:80 pb:24 pl:80, gap:32 */}
      <section
        style={{
          width: '100%',
          background: 'rgba(255, 255, 255, 1)',
          boxSizing: 'border-box',
        }}
        className="mx-auto w-full max-w-[430px] md:max-w-[1440px] px-[20px] md:px-[80px] pt-[24px] md:pt-[62px] pb-[24px] flex flex-col items-center gap-5 md:gap-[32px] text-center"
      >
        {/* Text block */}
        <div className="w-full max-w-[1280px] flex flex-col items-center justify-between gap-2 md:gap-[8px]">
          {/* BLOGS label */}
          <span className="inline-flex items-center justify-center h-[26px] w-fit text-[12px] font-bold uppercase tracking-[0.12em] text-[#FF5B37] bg-[#FFEBE5] px-3 rounded-[4px]">
            BLOGS
          </span>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-[42px] font-serif font-semibold text-[#2B2B2B] leading-tight md:leading-[100%] m-0 w-full text-center">
            Insights &amp; Updates
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-base md:text-[24px] font-sans font-medium text-[#2B2B2B] leading-relaxed md:leading-[32px] m-0 w-full text-center">
            Follow our stories to discover unique voices, breathtaking landscapes &amp; unforgettable experiences
          </p>
        </div>

        {/* Subscribe form */}
        <form
          onSubmit={(e) => { e.preventDefault(); alert(`Subscribed: ${email}`); }}
          className="w-full max-w-[390px] md:max-w-[546px] h-[48px] md:h-[56px] flex flex-row items-center gap-2 bg-white border border-gray-300 rounded-[6px] box-border overflow-hidden p-1"
        >
          {/* Input */}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 h-full border-none outline-none px-3 font-sans font-medium text-xs sm:text-sm md:text-[20px] text-[#2B2B2B] placeholder:text-[#8D8D8D] bg-transparent"
          />
          {/* Subscribe button */}
          <button
            type="submit"
            className="h-full px-4 md:px-6 bg-[#1D493E] text-white rounded-[4px] border-none font-sans font-medium text-xs md:text-[16px] cursor-pointer flex items-center justify-center shrink-0 hover:bg-[#163d33] transition-colors"
          >
            <span>Subscribe</span>
          </button>
        </form>
      </section>

      {/* ── TABS + GRID SECTION ── */}
      {/* Mobile: 430px max, pt:12 pr:20 pb:24 pl:20, gap:20 | Desktop: 1440x1590, pt:42 pr:80 pb:42 pl:80, gap:32 */}
      <section
        style={{
          width: '100%',
          background: 'rgba(255, 255, 255, 1)',
          boxSizing: 'border-box',
        }}
        className="mx-auto w-full max-w-[430px] md:max-w-[1440px] px-[20px] md:px-[80px] py-[12px] md:py-[42px] flex flex-col gap-5 md:gap-[32px]"
      >
        {/* Tab Bar — underline tab style (Product Description / Reviews style) */}
        <div
          className="w-full max-w-[1280px] flex flex-row items-end gap-0 bg-white box-border overflow-x-auto no-scrollbar"
          style={{ borderBottom: '1.5px solid #E5E7EB' }}
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              style={{
                borderRadius: 0,
                border: 'none',
                borderBottom: activeTab === tab ? '2.5px solid #1D493E' : '2.5px solid transparent',
                marginBottom: '-1.5px',
                background: 'transparent',
                outline: 'none',
                padding: '10px 20px',
                cursor: 'pointer',
                transition: 'color 0.18s ease, border-color 0.18s ease',
              }}
              className={`text-xs sm:text-sm md:text-[17px] font-sans font-semibold whitespace-nowrap ${
                activeTab === tab
                  ? 'text-[#1D493E]'
                  : 'text-[#6B7280] hover:text-[#1D493E]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 3-Column Card Grid */}
        <div
          id="blog-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-[32px] mb-4 md:mb-[32px] w-full max-w-[1280px]"
        >
          {paginated.map((post) => (
            <Link
              href={`/blog/${post.id}`}
              key={post.id}
              className="no-underline text-inherit block group"
            >
              {/* Card */}
              <article className="w-full h-full flex flex-col gap-3 md:gap-[16px] cursor-pointer">
                {/* Image — 16:10 aspect ratio */}
                <div className="w-full aspect-[16/10] overflow-hidden bg-gray-200 rounded-[6px] shrink-0">
                  <img
                    src={post.image}
                    alt={`Go Banjara Blog - ${post.title}`}
                    title={`Go Banjara Blog - ${post.title}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Text block */}
                <div className="flex flex-col gap-1.5 md:gap-[8px] flex-grow justify-between">
                  {/* Title */}
                  <h3 className="w-full font-serif font-semibold text-base sm:text-lg md:text-[22px] leading-snug md:leading-[1.35] text-[#2B2B2B] m-0 line-clamp-3">
                    {post.title}
                  </h3>

                  {/* Meta — Date & Read Time */}
                  <p className="w-full font-sans font-medium text-xs md:text-[15px] text-[#2B2B2B]/65 m-0">
                    {post.date} &nbsp;•&nbsp; {post.readTime}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Pagination Bar */}
        {totalPages > 0 && (
          <div className="w-full max-w-[1280px] py-4 border-t border-gray-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Page info label */}
            <span className="font-sans text-xs md:text-base font-medium text-[#2B2B2B]">
              Page {currentPage} of {totalPages}
            </span>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1.5">
              {/* Prev Button */}
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-[6px] border border-gray-200 bg-white text-[#1D493E] hover:bg-[#FAF9F6] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4 text-[#1D493E]" />
              </button>

              {/* Page Number Buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-[6px] font-sans font-medium text-xs md:text-sm transition cursor-pointer ${
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
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-[6px] border border-gray-200 bg-white text-[#1D493E] hover:bg-[#FAF9F6] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4 text-[#1D493E]" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ── FAQ SECTION ── */}
      {/* Mobile: 430px max, px:20 py:24, gap:12 | Desktop: 1440, px:80 py:42, gap:24 */}
      <section
        style={{
          width: '100%',
          background: 'rgba(255, 255, 255, 1)',
          boxSizing: 'border-box',
        }}
        className="mx-auto w-full max-w-[430px] md:max-w-[1440px] px-[20px] md:px-[80px] py-[24px] md:py-[42px] flex flex-col gap-3 md:gap-[24px]"
      >
        {/* Header */}
        <div className="flex flex-col gap-2 md:gap-[12px]">
          {/* Label */}
          <span className="inline-flex items-center justify-center h-[26px] w-fit text-[12px] font-bold uppercase tracking-[0.12em] text-[#FF5B37] bg-[#FFEBE5] px-3 rounded-[4px]">
            FAQ&apos;S
          </span>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl md:text-[42px] font-serif font-semibold text-[#2B2B2B] leading-tight md:leading-[100%] m-0">
            Frequently asked questions
          </h2>
        </div>

        {/* Accordion */}
        <div className="w-full flex flex-col border-t border-gray-300">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="w-full border-b border-gray-300">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex justify-between items-center py-4 md:py-[20px] bg-none border-none cursor-pointer text-left gap-4"
                >
                  <span className="font-sans font-medium text-sm sm:text-base md:text-[20px] leading-snug md:leading-[32px] text-[#2B2B2B] flex-1">
                    {item.question}
                  </span>
                  <ChevronDown 
                    className={`w-5 h-5 md:w-6 md:h-6 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#FF623E]' : 'text-[#1D493E]'
                    }`} 
                  />
                </button>
                {isOpen && (
                  <p className="font-sans font-medium text-xs sm:text-sm md:text-[20px] leading-relaxed md:leading-[32px] text-[#8D8D8D] m-0 pb-4 md:pb-[20px]">
                    {item.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section
        style={{
          width: '100%',
          background: 'rgba(255, 255, 255, 1)',
          boxSizing: 'border-box',
        }}
        className="mx-auto w-full max-w-[430px] md:max-w-[1440px] px-[20px] md:px-[80px] py-[32px] md:py-[80px] text-center border-t border-gray-200"
      >
        <div className="max-w-[760px] mx-auto flex flex-col items-center gap-3 md:gap-[20px]">
          {/* Heading */}
          <h2 className="text-xl sm:text-2xl md:text-[42px] font-serif font-semibold text-[#2B2B2B] leading-tight md:leading-[100%] m-0 text-center">
            The{' '}
            <span className="text-[#FF623E] font-serif font-semibold italic">best adventures</span>{' '}
            find their way to your inbox.
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-base md:text-[18px] font-sans font-medium text-[#2B2B2B]/70 leading-relaxed m-0 text-center max-w-[640px]">
            Hidden places, exclusive trip drops, curated gear, and stories from the road delivered before anyone else hears about them.
          </p>

          {/* Button */}
          <Link
            href="/travel"
            className="group inline-flex items-center justify-center gap-2 bg-[#1D493E] text-white px-6 md:px-8 py-3 md:py-[14px] rounded-[6px] font-sans font-medium text-xs md:text-[16px] no-underline mt-2 hover:bg-[#163d33] transition-all duration-300"
          >
            <span>Reserve your tour now</span>
            <span className="text-base md:text-lg group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">↗</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
