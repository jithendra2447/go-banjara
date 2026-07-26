'use client';

import React from 'react';
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  return (
    <div 
      style={{
        width: "100%",
        maxWidth: "1440px",
        height: "auto",
        paddingTop: "12px",
        paddingBottom: "8px",
        boxSizing: "border-box",
      }}
      className={`w-full max-w-[1440px] mx-auto text-left flex items-center px-4 md:px-[80px] ${className}`}
    >
      <div className="flex flex-wrap items-center gap-1.5 md:gap-[12px]">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <span 
                  style={{
                    fontFamily: "'Faktum', 'Outfit', sans-serif",
                    fontWeight: 500,
                    color: "rgba(141, 141, 141, 1)",
                  }}
                  className="text-xs sm:text-sm md:text-[24px]"
                >
                  &gt;
                </span>
              )}
              {item.href && !isLast ? (
                <Link 
                  href={item.href} 
                  style={{
                    fontFamily: "'Faktum', 'Outfit', sans-serif",
                    fontWeight: 500,
                    letterSpacing: "0px",
                    color: "rgba(141, 141, 141, 1)",
                    textDecoration: "none",
                  }}
                  className="hover:opacity-80 transition-opacity text-xs sm:text-sm md:text-[24px] leading-relaxed"
                >
                  {item.label}
                </Link>
              ) : (
                <span 
                  style={{
                    fontFamily: "'Faktum', 'Outfit', sans-serif",
                    fontWeight: 500,
                    letterSpacing: "0px",
                    color: "rgba(63, 136, 255, 1)",
                    textDecoration: "underline",
                  }}
                  className="truncate max-w-[200px] sm:max-w-[400px] text-xs sm:text-sm md:text-[24px] leading-relaxed"
                >
                  {item.label}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
