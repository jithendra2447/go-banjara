'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Calendar, Clock, ArrowRight } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: 'Travel Logs' | 'Gear & Craft' | 'Guides' | 'Culture';
  author: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: 'zanskar-autumn-traverse',
    title: 'Crossing Zanskar in Autumn: Cold Rivers & Warm Kitchens',
    excerpt: 'As September closes the high passes, we walked 120km across frozen stream beds to document the ancient homestays of Padum.',
    category: 'Travel Logs',
    author: 'Bonjo & Team',
    date: 'Oct 14, 2025',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop',
    featured: true
  },
  {
    id: 'heritage-compass-design',
    title: 'How We Designed the Heritage Brass Compass',
    excerpt: 'Four prototypes, antique patina testing, and a magnetic needle calibrated for high-altitude accuracy in Ladakh.',
    category: 'Gear & Craft',
    author: 'Bonjo',
    date: 'Nov 02, 2025',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'spiti-packing-guide',
    title: 'What Survives 3 Weeks in High-Altitude Spiti',
    excerpt: 'Sub-zero nights, dust storms, and zero cellular signal. Here is our field-tested packing checklist for rugged Himalayan road trips.',
    category: 'Guides',
    author: 'Aarav Mehta',
    date: 'Dec 18, 2025',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'kerala-backwater-crafts',
    title: 'Coir, Teak & Quiet Waters: The Artisans of Alleppey',
    excerpt: 'Spending a week with master wooden boatbuilders whose family craft has remained unchanged for three generations.',
    category: 'Culture',
    author: 'Priya Sharma',
    date: 'Jan 05, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'stargazing-at-chandratal',
    title: 'Stargazing at 14,100 Feet: A Night at Lake Chandratal',
    excerpt: 'Watching the Milky Way arch over moonlit turquoise waters when the temperature hits negative ten degrees.',
    category: 'Travel Logs',
    author: 'Rohan Deshmukh',
    date: 'Feb 12, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'journaling-on-the-trail',
    title: 'Why Keeping a Physical Travel Journal Changes How You Remember',
    excerpt: 'In an era of instant phone snaps, taking ten minutes to ink a sketch and write down trail notes preserves real memory.',
    category: 'Guides',
    author: 'Ananya Iyer',
    date: 'Mar 01, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop'
  }
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Travel Logs', 'Gear & Craft', 'Guides', 'Culture'];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0];

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen text-[#2B2B2B]">
      {/* Header Banner */}
      <section className="w-full bg-white border-b border-gray-200 py-16 px-6 md:px-20 text-center">
        <div className="max-w-[1280px] mx-auto space-y-4">
          <span 
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#FFEBE5",
              color: "#FF623E",
              fontFamily: "Faktum, sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              lineHeight: "14px",
              letterSpacing: "1.2px",
              padding: "6px 12px",
              borderRadius: "4px",
              textTransform: "uppercase"
            }}
          >
            STORIES & DISPATCHES
          </span>

          <h1 
            style={{
              fontFamily: "Fraunces, serif",
              fontWeight: 600,
              fontSize: "48px",
              lineHeight: "56px",
              color: "rgba(43, 43, 43, 1)",
              margin: 0
            }}
          >
            Tales from the Open Trail
          </h1>

          <p 
            style={{
              fontFamily: "Faktum, sans-serif",
              fontWeight: 500,
              fontSize: "20px",
              lineHeight: "30px",
              color: "rgba(43, 43, 43, 0.75)",
              maxWidth: "760px",
              margin: "0 auto"
            }}
          >
            Real expedition notes, artisan deep-dives, gear design stories, and field guides written by our collective of nomads.
          </p>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="w-full bg-white border-b border-gray-150 sticky top-[70px] z-20 py-4 px-6 md:px-20 shadow-2xs">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#1D493E] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-[320px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search stories & guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-gray-50 border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#1D493E] focus:bg-white transition-all"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-[1280px] mx-auto px-6 md:px-20 py-12 space-y-12">
        {/* Featured Post */}
        {selectedCategory === 'All' && !searchQuery && (
          <div className="w-full bg-white border border-gray-200 rounded-[12px] overflow-hidden shadow-xs hover:shadow-md transition-shadow group grid grid-cols-1 md:grid-cols-12 gap-0">
            <div className="md:col-span-7 h-[340px] md:h-[450px] overflow-hidden relative">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-4 left-4 bg-[#FF623E] text-white font-semibold text-xs px-3 py-1 rounded-[4px] uppercase tracking-wider">
                FEATURED DISPATCH
              </span>
            </div>

            <div className="md:col-span-5 p-8 md:p-12 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <span className="text-[#1D493E] bg-[#EBF7ED] px-2.5 py-1 rounded-[4px]">
                    {featuredPost.category}
                  </span>
                  <span>•</span>
                  <span>{featuredPost.date}</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#2B2B2B] leading-tight group-hover:text-[#FF623E] transition-colors">
                  {featuredPost.title}
                </h2>

                <p className="text-gray-600 text-base font-medium leading-relaxed">
                  {featuredPost.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#1D493E] text-white text-xs font-bold flex items-center justify-center">
                    B
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{featuredPost.author}</span>
                </div>

                <Link
                  href={`/blog/${featuredPost.id}`}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1D493E] hover:text-[#FF623E] transition-colors"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white border border-gray-200 rounded-[12px] overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow duration-300 group"
            >
              <div className="space-y-4">
                <div className="h-[220px] overflow-hidden relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[#1D493E] font-semibold text-xs px-2.5 py-1 rounded-[4px] shadow-xs">
                    {post.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-xs font-semibold text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-[#2B2B2B] leading-snug group-hover:text-[#FF623E] transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 text-sm font-medium leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between border-t border-transparent">
                <span className="text-xs font-semibold text-gray-500">By {post.author}</span>
                <Link
                  href={`/blog/${post.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#1D493E] group-hover:text-[#FF623E] transition-colors"
                >
                  <span>Read story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20 bg-white border border-gray-200 rounded-[12px] space-y-4">
            <h3 className="text-xl font-bold text-gray-700">No stories found</h3>
            <p className="text-gray-500 text-sm">Try searching for different keywords or select another category.</p>
          </div>
        )}
      </main>
    </div>
  );
}
