'use client';

import React from 'react';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';

const BLOG_POSTS = [
  {
    id: 'post-cardamom',
    title: 'The Queen of Spices: A Journey into Kerala’s Cardamom Hills',
    excerpt: 'Deep inside the Western Ghats, local farmers harvest green cardamom by hand. Discover the traditional sorting and sun-curing processes that give this spice its unmatched aroma.',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=500&q=80',
    date: 'June 24, 2026',
    author: 'Aarav Nair',
    readTime: '5 min read',
  },
  {
    id: 'post-houseboat',
    title: 'Anatomy of a Kettuvallam: The Art of Wooden Boatbuilding',
    excerpt: 'No nails, only coir rope, bamboo poles, and cashew husk oil. Learn how Kerala artisans construct colossal, luxury houseboats that float seamlessly on water without harming the ecosystem.',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=500&q=80',
    date: 'June 18, 2026',
    author: 'Meera Kutty',
    readTime: '6 min read',
  },
  {
    id: 'post-khadi',
    title: 'Spinning Stories: Why Indigo Khadi Remains Eternally Modern',
    excerpt: 'Indigo is more than a color; it is a live organic entity. Step inside rural hand-spinning workshops and find out why this traditional breathing fabric is the ultimate choice for sustainable fashion.',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=500&q=80',
    date: 'May 29, 2026',
    author: 'Vikram Joshi',
    readTime: '4 min read',
  }
];

export default function BlogPage() {
  const [posts, setPosts] = React.useState<any[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem('gb_admin_blogs');
    if (saved) {
      setPosts(JSON.parse(saved));
    } else {
      setPosts(BLOG_POSTS);
      localStorage.setItem('gb_admin_blogs', JSON.stringify(BLOG_POSTS));
    }
  }, []);

  return (
    <div className="space-y-16 pb-24 font-sans">
      {/* Header */}
      <section className="bg-brand-yellow/15 border-b border-primary-dark/8 py-24 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-3">
          <span className="text-xs font-black uppercase text-brand-orange tracking-widest">Banjara Journal</span>
          <h1 className="text-4xl md:text-6xl font-black font-serif text-primary-dark">Stories & Chronicles</h1>
          <p className="text-primary-dark/65 max-w-lg mx-auto text-sm md:text-base">
            Read about local spice fields, traditional craftsmen, and travel logs from the remotest corners of India.
          </p>
        </div>
      </section>

      {/* Posts grid */}
      <section className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article 
            key={post.id}
            className="group bg-white border border-primary-dark/8 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div className="relative overflow-hidden aspect-[16/10] bg-brand-beige">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                {/* Meta details */}
                <div className="flex items-center gap-3 text-[10px] text-primary-dark/50 font-black uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="text-lg font-black font-serif text-primary-dark leading-snug group-hover:text-brand-orange transition line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-primary-dark/70 text-xs leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-xs font-bold">
                <span className="flex items-center gap-1.5 text-primary-dark/75">
                  <User className="w-3.5 h-3.5 text-brand-orange" />
                  {post.author}
                </span>
                <span className="text-primary-dark font-black flex items-center gap-0.5 group-hover:text-brand-orange transition">
                  Read Article
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
