'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

interface InteractiveProgressBarProps {
  /** Total number of slides (for index-based carousels) */
  totalSlides?: number;
  /** Currently active slide index */
  activeSlide?: number;
  /** Callback fired when user clicks or drags to change slide */
  onSlideChange?: (index: number) => void;

  /** React Ref to a horizontally scrollable container (for scroll-based carousels) */
  scrollRef?: React.RefObject<HTMLElement | null>;

  /** Optional track background color (default: #E5E7EB) */
  trackColor?: string;
  /** Optional progress bar color (default: #1D493E) */
  barColor?: string;
  /** Track height in px (default: 8) */
  height?: number;
  /** Custom wrapper CSS classes */
  className?: string;
  /** Title / tooltip text */
  title?: string;
}

export const InteractiveProgressBar: React.FC<InteractiveProgressBarProps> = ({
  totalSlides,
  activeSlide = 0,
  onSlideChange,
  scrollRef,
  trackColor = '#E5E7EB',
  barColor = '#1D493E',
  height = 8,
  className = '',
  title = 'Click or drag to scroll',
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [scrollRatio, setScrollRatio] = useState(0);
  const [thumbWidthRatio, setThumbWidthRatio] = useState(0.25);

  // Sync scroll progress if using scrollRef
  const updateScrollFromRef = useCallback(() => {
    if (!scrollRef || !scrollRef.current) return;
    const el = scrollRef.current;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll > 0) {
      setScrollRatio(el.scrollLeft / maxScroll);
      setThumbWidthRatio(Math.max(0.15, el.clientWidth / el.scrollWidth));
    } else {
      setScrollRatio(0);
      setThumbWidthRatio(1);
    }
  }, [scrollRef]);

  useEffect(() => {
    if (!scrollRef || !scrollRef.current) return;
    const el = scrollRef.current;
    updateScrollFromRef();

    el.addEventListener('scroll', updateScrollFromRef, { passive: true });
    window.addEventListener('resize', updateScrollFromRef);

    return () => {
      el.removeEventListener('scroll', updateScrollFromRef);
      window.removeEventListener('resize', updateScrollFromRef);
    };
  }, [scrollRef, updateScrollFromRef]);

  // Compute thumb dimensions and position
  let thumbWidthPercent = 25;
  let thumbLeftPercent = 0;

  if (scrollRef) {
    thumbWidthPercent = thumbWidthRatio * 100;
    thumbLeftPercent = scrollRatio * (100 - thumbWidthPercent);
  } else if (totalSlides && totalSlides > 0) {
    thumbWidthPercent = 100 / totalSlides;
    thumbLeftPercent = (activeSlide % totalSlides) * thumbWidthPercent;
  }

  // Calculate target position ratio from pointer event
  const getRatioFromPointer = useCallback((clientX: number) => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    return Math.max(0, Math.min(1, x / rect.width));
  }, []);

  // Handle position update
  const applyRatio = useCallback(
    (ratio: number) => {
      if (scrollRef && scrollRef.current) {
        const el = scrollRef.current;
        const maxScroll = el.scrollWidth - el.clientWidth;
        el.scrollLeft = ratio * maxScroll;
      } else if (totalSlides && onSlideChange) {
        const index = Math.min(totalSlides - 1, Math.floor(ratio * totalSlides));
        onSlideChange(index);
      }
    },
    [scrollRef, totalSlides, onSlideChange]
  );

  // Mouse Drag handling with global window listeners
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    const ratio = getRatioFromPointer(e.clientX);
    applyRatio(ratio);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const ratio = getRatioFromPointer(e.clientX);
    applyRatio(ratio);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) {
        // ignore
      }
    }
  };

  return (
    <div
      ref={trackRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        backgroundColor: trackColor,
        height: `${height}px`,
      }}
      className={`w-full max-w-[1280px] mx-auto relative rounded-full overflow-hidden cursor-pointer group transition-all duration-300 shadow-inner select-none ${
        isDragging ? 'cursor-grabbing h-[10px]' : 'hover:h-[10px] cursor-grab'
      } ${className}`}
      title={title}
      aria-label="Carousel scroll bar"
      role="slider"
      aria-valuenow={Math.round(thumbLeftPercent)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        style={{
          left: `${thumbLeftPercent}%`,
          width: `${thumbWidthPercent}%`,
          backgroundColor: barColor,
        }}
        className={`absolute top-0 h-full rounded-full transition-all ${
          isDragging ? 'duration-75 shadow-md scale-y-110' : 'duration-300 ease-out'
        } pointer-events-none`}
      />
    </div>
  );
};

export default InteractiveProgressBar;
