'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { HOLIDAY_PACKAGES } from '@/data/packages';

interface PackageDetailsProps {
  customId?: string;
}

export default function PackageDetails({ customId }: PackageDetailsProps) {
  const params = useParams() as { id?: string };
  const id = customId || params?.id || 'pkg-kashmir-classic';
  const [pkg, setPkg] = useState<any>(null);

  useEffect(() => {
    try {
      const staticPkg = HOLIDAY_PACKAGES.find((p) => p.id === id);
      let foundPkg = staticPkg || null;

      if (!foundPkg) {
        const saved = localStorage.getItem('gb_admin_packages');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const matched = parsed.find((p) => p.id === id);
              if (matched) {
                foundPkg = matched;
              }
            }
          } catch (e) {
            console.error('Error parsing admin packages:', e);
          }
        }
      }

      if (foundPkg) {
        setPkg(foundPkg);
      }
    } catch (e) {
      console.error(e);
    }
  }, [id]);

  const galleryImages = (pkg?.images && pkg.images.length >= 6)
    ? pkg.images.slice(0, 6)
    : [
        pkg?.image || '/travel-leh-6.jpg',
        '/travel-leh-1.jpg',
        '/travel-leh-2.jpg',
        '/travel-leh-4.jpg',
        '/travel-leh-5.jpg',
        '/ladakh-hero.jpg'
      ];

  return (
    <div 
      style={{
        backgroundColor: "rgba(255, 255, 255, 1)",
        paddingBottom: "62px",
      }}
      className="text-[#1D493E] min-h-screen font-sans relative overflow-x-hidden w-full"
    >
      {/* Breadcrumbs */}
      <div 
        style={{
          width: "100%",
          maxWidth: "1440px",
          height: "118px",
          paddingTop: "62px",
          paddingBottom: "24px",
          paddingLeft: "80px",
          paddingRight: "80px",
          boxSizing: "border-box",
        }}
        className="w-full max-w-[1440px] mx-auto text-left flex items-center"
      >
        <div className="flex items-center gap-[12px]">
          <Link 
            href="/" 
            className="hover:opacity-80 transition-opacity"
            style={{
              fontFamily: "'Faktum', 'Outfit', sans-serif",
              fontWeight: 500,
              fontSize: "24px",
              lineHeight: "32px",
              letterSpacing: "0px",
              color: "rgba(141, 141, 141, 1)",
              textDecoration: "none",
            }}
          >
            Home
          </Link>
          <span 
            style={{
              fontFamily: "'Faktum', 'Outfit', sans-serif",
              fontWeight: 500,
              fontSize: "24px",
              lineHeight: "32px",
              color: "rgba(141, 141, 141, 1)",
            }}
          >
            &gt;
          </span>
          <Link 
            href="/travel" 
            className="hover:opacity-80 transition-opacity"
            style={{
              fontFamily: "'Faktum', 'Outfit', sans-serif",
              fontWeight: 500,
              fontSize: "24px",
              lineHeight: "32px",
              letterSpacing: "0px",
              color: "rgba(141, 141, 141, 1)",
              textDecoration: "none",
            }}
          >
            Travel Page
          </Link>
          <span 
            style={{
              fontFamily: "'Faktum', 'Outfit', sans-serif",
              fontWeight: 500,
              fontSize: "24px",
              lineHeight: "32px",
              color: "rgba(141, 141, 141, 1)",
            }}
          >
            &gt;
          </span>
          <span 
            style={{
              fontFamily: "'Faktum', 'Outfit', sans-serif",
              fontWeight: 500,
              fontSize: "24px",
              lineHeight: "32px",
              letterSpacing: "0px",
              color: "rgba(63, 136, 255, 1)",
              textDecoration: "underline",
            }}
            className="truncate max-w-[400px]"
          >
            {pkg?.name || "Spiti Valley Traverse"}
          </span>
        </div>
      </div>

      {/* 6-Image Grid Collage Showcase */}
      <div 
        style={{
          width: "100%",
          maxWidth: "1280px",
          height: "527px",
          boxSizing: "border-box",
          background: "rgba(255, 255, 255, 1)",
        }}
        className="w-full max-w-[1280px] mx-auto"
      >
        <div 
          style={{
            gap: "32px",
          }}
          className="grid grid-cols-3 grid-rows-2 w-full h-full"
        >
          {galleryImages.map((img: string, idx: number) => (
            <div
              key={idx}
              style={{ borderRadius: "4px" }}
              className="relative overflow-hidden w-full h-full bg-slate-100"
            >
              <img
                src={img}
                alt={`${pkg?.name || "Package"} gallery image ${idx + 1}`}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
