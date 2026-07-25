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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero Banner Header */}
      <div className="relative bg-[#11241E] text-white py-20 px-4 overflow-hidden">
        {pageData.heroImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{ backgroundImage: `url(${pageData.heroImage})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#11241E] via-[#11241E]/80 to-transparent" />

        <div className="relative max-w-5xl mx-auto space-y-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-emerald-300/80 font-bold uppercase tracking-wider">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>Pages</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">{pageData.title}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            {pageData.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/10 text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-emerald-300 font-bold">
                <FileText className="w-3.5 h-3.5" /> Go Banjara Official Document
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Updated {new Date(pageData.updatedAt).toLocaleDateString()}
              </span>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition cursor-pointer text-xs font-bold"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              {copied ? 'Link Copied!' : 'Share Page'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Page Content Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-12">
        <div className="bg-white border border-slate-200 rounded-[32px] p-6 sm:p-12 shadow-sm space-y-8">
          {pageData.metaDescription && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-900 text-sm font-semibold leading-relaxed">
              💡 {pageData.metaDescription}
            </div>
          )}

          <div className="prose prose-slate max-w-none space-y-6 text-slate-700 leading-relaxed font-normal">
            {pageData.content.split('\n').map((line, idx) => {
              const trimmed = line.trim();
              if (!trimmed) return <div key={idx} className="h-2" />;

              if (trimmed.startsWith('# ')) {
                return (
                  <h1 key={idx} className="text-2xl sm:text-3xl font-black text-slate-900 pt-4 border-b border-slate-100 pb-3">
                    {trimmed.replace('# ', '')}
                  </h1>
                );
              }
              if (trimmed.startsWith('## ')) {
                return (
                  <h2 key={idx} className="text-xl sm:text-2xl font-black text-slate-800 pt-4 border-b border-slate-100 pb-2">
                    {trimmed.replace('## ', '')}
                  </h2>
                );
              }
              if (trimmed.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-lg font-bold text-[#1D493E] pt-3">
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
                <p key={idx} className="text-sm sm:text-base font-normal text-slate-600 leading-relaxed">
                  {trimmed}
                </p>
              );
            })}
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
            >
              <ArrowLeft className="w-4 h-4" /> Go Back
            </button>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF5A36] hover:bg-[#e04a29] text-white text-xs font-bold rounded-xl transition shadow-sm"
            >
              Have Questions? Contact Support
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
