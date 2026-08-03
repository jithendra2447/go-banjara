'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getStoredCustomPages, CustomPage } from '@/lib/cms';
import { ChevronRight, Calendar, ArrowLeft, FileText, Share2, Check } from 'lucide-react';

export default function DynamicCustomPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [pageData, setPageData] = useState<CustomPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const pages = getStoredCustomPages();
    const found = pages.find(p => p.slug === slug || p.id === slug);
    if (found) {
      setPageData(found);
    }
    setLoading(false);
  }, [slug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-32">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-10 h-10 border-4 border-[#1D493E] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-bold text-slate-500">Loading Page Content...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!pageData || pageData.status === 'draft') {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
          <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto text-3xl font-black">
            404
          </div>
          <h1 className="text-3xl font-black text-slate-900">Page Not Found</h1>
          <p className="text-slate-500 font-medium max-w-md mx-auto">
            The page you are looking for does not exist or has been set to draft mode by the admin.
          </p>
          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#1D493E] text-white font-bold text-xs uppercase tracking-wider rounded-full hover:bg-brand-orange transition shadow-md"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Clean Page Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 md:py-12">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 mb-6 md:mb-8 border-b border-slate-100 pb-4">
          {pageData.title}
        </h1>

        <div className="prose prose-slate max-w-none space-y-6 text-slate-700 leading-relaxed font-normal">
          {pageData.content.split('\n').map((line, idx) => {
            const trimmed = line.trim();
            if (!trimmed) return <div key={idx} className="h-2" />;

            if (trimmed.startsWith('# ')) {
              return (
                <h1 key={idx} className="text-xl md:text-2xl font-bold text-slate-900 pt-4 border-b border-slate-100 pb-2">
                  {trimmed.replace('# ', '')}
                </h1>
              );
            }
            if (trimmed.startsWith('## ')) {
              return (
                <h2 key={idx} className="text-lg md:text-xl font-bold text-slate-800 pt-3">
                  {trimmed.replace('## ', '')}
                </h2>
              );
            }
            if (trimmed.startsWith('### ')) {
              return (
                <h3 key={idx} className="text-base font-bold text-[#1D493E] pt-2">
                  {trimmed.replace('### ', '')}
                </h3>
              );
            }
            if (trimmed.startsWith('- ')) {
              return (
                <li key={idx} className="ml-4 list-disc text-sm font-medium text-slate-600">
                  {trimmed.replace('- ', '')}
                </li>
              );
            }
            return (
              <p key={idx} className="text-sm md:text-base font-normal text-slate-600 leading-relaxed">
                {trimmed}
              </p>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
