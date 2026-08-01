'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { InteractiveProgressBar } from './InteractiveProgressBar';

interface DragCarouselProps {
  children: React.ReactNode;
  totalItems: number;
  itemWidth?: number; // width of each card to calculate scroll offsets
  className?: string;
  progressBarColor?: string;
}

export const DragCarousel: React.FC<DragCarouselProps> = ({
  children,
  totalItems,
  itemWidth = 320,
  className = '',
  progressBarColor = '#1D493E',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  
  // Custom Floating Drag Tooltip State
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [isHoveringArrows, setIsHoveringArrows] = useState(false);

  // Scroll handler to sync active index and progress bar
  const handleScroll = () => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      setActiveSlide(0);
      return;
    }
    const ratio = el.scrollLeft / maxScroll;
    const computedActive = Math.min(totalItems - 1, Math.floor(ratio * totalItems));
    setActiveSlide(computedActive);
  };

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent drag initiating if clicking on a button or link
    if ((e.target as HTMLElement).closest('button, a, input, select')) return;
    
    setIsMouseDown(true);
    if (containerRef.current) {
      setStartX(e.pageX - containerRef.current.offsetLeft);
      setScrollLeftStart(containerRef.current.scrollLeft);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Hide floating 'Drag' chip when hovering over CTA buttons, links, or interactive controls
    const target = e.target as HTMLElement;
    const isInteractiveCTA = Boolean(target.closest('button, a, input, select, [role="button"], .no-drag'));

    if (isInteractiveCTA || isHoveringArrows) {
      setShowTooltip(false);
    } else {
      setShowTooltip(true);
    }

    // Track mouse position relative to container for the floating 'Drag' badge
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }

    if (!isMouseDown || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // scroll multiplier
    containerRef.current.scrollLeft = scrollLeftStart - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsMouseDown(false);
  };

  // Floating Arrow Scroll Actions
  const scrollPrev = () => {
    if (!containerRef.current) return;
    containerRef.current.scrollBy({ left: -itemWidth, behavior: 'smooth' });
  };

  const scrollNext = () => {
    if (!containerRef.current) return;
    containerRef.current.scrollBy({ left: itemWidth, behavior: 'smooth' });
  };

  return (
    <div className={`relative w-full group/carousel ${className}`}>
      
      {/* Floating Drag Tooltip */}
      {showTooltip && !isHoveringArrows && (
        <div
          style={{
            position: 'absolute',
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 100,
            fontFamily: "'Faktum', 'Outfit', sans-serif",
            backgroundColor: "#1D493E",
          }}
          className={`hidden md:flex items-center justify-center text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg transition-transform duration-150 select-none tracking-wide ${
            isMouseDown ? 'scale-95 bg-[#15342c]' : 'scale-100 bg-[#1D493E]'
          }`}
        >
          Drag
        </div>
      )}

      {/* Outer wrapper to manage hover listeners */}
      <div 
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => {
          setShowTooltip(false);
          handleMouseUpOrLeave();
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        className="relative w-full overflow-hidden"
      >
        {/* Horizontal Scroll Track */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className={`flex gap-6 overflow-x-auto scrollbar-none select-none py-2 px-1 scroll-smooth ${
            isMouseDown ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          {children}
        </div>

        {/* Floating Left Button */}
        <button
          type="button"
          onClick={scrollPrev}
          onMouseEnter={() => setIsHoveringArrows(true)}
          onMouseLeave={() => {
            setIsHoveringArrows(false)}
          }
          className="absolute left-4 top-1/2 -translate-y-1/2 z-40 bg-white/90 hover:bg-white text-[#1D493E] p-3 rounded-full shadow-md border border-slate-100 hover:scale-105 active:scale-95 transition opacity-0 group-hover/carousel:opacity-100 duration-300 hidden md:block cursor-pointer"
          aria-label="Previous items"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Floating Right Button */}
        <button
          type="button"
          onClick={scrollNext}
          onMouseEnter={() => setIsHoveringArrows(true)}
          onMouseLeave={() => setIsHoveringArrows(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-40 bg-white/90 hover:bg-white text-[#1D493E] p-3 rounded-full shadow-md border border-slate-100 hover:scale-105 active:scale-95 transition opacity-0 group-hover/carousel:opacity-100 duration-300 hidden md:block cursor-pointer"
          aria-label="Next items"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Linked Progress Bar */}
      <div className="w-full mt-4">
        <InteractiveProgressBar
          scrollRef={containerRef}
          totalSlides={totalItems}
          activeSlide={activeSlide}
          onSlideChange={(newIdx) => {
            if (!containerRef.current) return;
            const el = containerRef.current;
            const maxScroll = el.scrollWidth - el.clientWidth;
            if (maxScroll > 0 && totalItems > 1) {
              el.scrollLeft = (newIdx / (totalItems - 1)) * maxScroll;
            }
          }}
          barColor={progressBarColor}
        />
      </div>
    </div>
  );
};

export default DragCarousel;
