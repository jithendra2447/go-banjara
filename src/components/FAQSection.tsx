'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  items: FAQItem[];
  title?: string;
  badgeText?: string;
  className?: string;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  items,
  title = "Frequently asked questions",
  badgeText = "FAQ'S",
  className = "",
}) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className={`w-full max-w-[1280px] mx-auto py-8 md:py-12 px-5 md:px-0 text-left ${className}`}>
      {/* Header Badge & Title */}
      <div className="space-y-1.5 md:space-y-2.5 mb-6 md:mb-8 text-left">
        {badgeText && (
          <span className="inline-flex items-center justify-center h-[26px] w-fit text-[12px] font-bold uppercase tracking-[0.12em] text-[#FF5B37] bg-[#FFEBE5] px-3 rounded-[4px]">
            {badgeText}
          </span>
        )}
        <h2
          style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontWeight: 600,
            letterSpacing: "0px",
            color: "#2B2B2B",
            margin: 0,
          }}
          className="text-xl sm:text-3xl md:text-[42px] leading-tight md:leading-[1.2]"
        >
          {title}
        </h2>
      </div>

      {/* Accordion Divider List */}
      <div className="w-full flex flex-col border-t border-gray-200">
        {items.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="w-full border-b border-gray-200 py-4 sm:py-5 flex flex-col text-left transition-colors duration-200"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex justify-between items-center text-left focus:outline-none cursor-pointer gap-4 bg-transparent border-none p-0"
              >
                <span
                  style={{
                    fontFamily: "Faktum, Outfit, sans-serif",
                    fontWeight: 600,
                    color: "#2B2B2B",
                  }}
                  className="text-xs sm:text-base md:text-[18px] leading-snug md:leading-[26px]"
                >
                  {item.question}
                </span>
                {isOpen ? (
                  <Minus className="w-5 h-5 md:w-6 md:h-6 shrink-0 text-[#FF5B37]" />
                ) : (
                  <Plus className="w-5 h-5 md:w-6 md:h-6 shrink-0 text-[#1D493E]" />
                )}
              </button>
              {isOpen && (
                <p
                  style={{
                    fontFamily: "Faktum, Outfit, sans-serif",
                    fontWeight: 500,
                    color: "#666666",
                    margin: 0,
                  }}
                  className="text-[11px] sm:text-sm leading-relaxed md:leading-[22px] pt-2 sm:pt-3 text-left animate-fade-in-up"
                >
                  {item.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
