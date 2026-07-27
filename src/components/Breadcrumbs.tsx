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
        paddingTop: "16px",
        paddingBottom: "12px",
        boxSizing: "border-box",
      }}
      className={`w-full max-w-[1440px] mx-auto text-left flex items-center px-4 md:px-[80px] ${className}`}
    >
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 sm:gap-3">
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
                  className="text-sm sm:text-base md:text-[20px] select-none"
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
                    color: "rgba(141, 141, 141, 1)",
                    textDecoration: "none",
                  }}
                  className="hover:opacity-80 transition-opacity text-sm sm:text-base md:text-[20px] leading-normal"
                >
                  {item.label}
                </Link>
              ) : (
                <span 
                  style={{
                    fontFamily: "'Faktum', 'Outfit', sans-serif",
                    fontWeight: 600,
                    color: "rgba(63, 136, 255, 1)",
                    textDecoration: "underline",
                    textUnderlineOffset: "3px",
                  }}
                  className="truncate max-w-[250px] sm:max-w-[450px] text-sm sm:text-base md:text-[20px] leading-normal"
                >
                  {item.label}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </div>
  );
}
