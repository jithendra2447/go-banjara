import React from 'react';

interface BonjoMascotProps {
  className?: string;
  width?: number;
  height?: number;
  withGoggles?: boolean;
  withHat?: boolean;
  interactive?: boolean;
}

export const BonjoMascot: React.FC<BonjoMascotProps> = ({
  className = '',
  width = 120,
  height = 120,
  withGoggles = true,
  withHat = true,
  interactive = true,
}) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center select-none ${interactive ? 'hover:scale-105 transition-transform duration-300 cursor-pointer' : ''} ${className}`}
      style={{ width, height }}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        {/* Background Circle */}
        <circle cx="100" cy="100" r="90" fill="#F3FFEF" stroke="#1D493E" strokeWidth="4" />

        {/* Neck */}
        <path
          d="M85 130 L85 190 L115 190 L115 130 Z"
          fill="#ECE7D8"
          stroke="#1D493E"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        {/* Neck Fluff details */}
        <path d="M90 145 C95 145 95 150 90 155" stroke="#1D493E" strokeWidth="3" strokeLinecap="round" />
        <path d="M105 160 C110 160 110 165 105 170" stroke="#1D493E" strokeWidth="3" strokeLinecap="round" />
        <path d="M92 175 C97 175 97 180 92 185" stroke="#1D493E" strokeWidth="3" strokeLinecap="round" />

        {/* Ears */}
        {/* Left Ear */}
        <g className={interactive ? 'origin-[80px_60px] hover:rotate-[-5deg] transition-transform duration-200' : ''}>
          <path
            d="M72 65 L60 30 C58 25 65 20 70 25 L85 58 Z"
            fill="#ECE7D8"
            stroke="#1D493E"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d="M71 58 L64 35 C63 32 67 30 69 33 L79 53 Z"
            fill="#DFD9C5"
          />
        </g>

        {/* Right Ear */}
        <g className={interactive ? 'origin-[120px_60px] hover:rotate-[5deg] transition-transform duration-200' : ''}>
          <path
            d="M128 65 L140 30 C142 25 135 20 130 25 L115 58 Z"
            fill="#ECE7D8"
            stroke="#1D493E"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d="M129 58 L136 35 C137 32 133 30 131 33 L121 53 Z"
            fill="#DFD9C5"
          />
        </g>

        {/* Llama Head/Face */}
        <path
          d="M75 60 C75 50 125 50 125 60 L125 125 C125 135 75 135 75 125 Z"
          fill="#ECE7D8"
          stroke="#1D493E"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* Snout */}
        <path
          d="M85 105 C85 98 115 98 115 105 L110 125 C110 130 90 130 90 125 Z"
          fill="#DFD9C5"
          stroke="#1D493E"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Nose & Mouth */}
        <path
          d="M95 110 L105 110 L100 115 Z"
          fill="#1D493E"
        />
        <path
          d="M100 114 L100 121 C97 121 95 120 95 120 M100 121 C103 121 105 120 105 120"
          stroke="#1D493E"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Eyes (if goggles are off) */}
        {!withGoggles && (
          <>
            <circle cx="88" cy="80" r="5" fill="#1D493E" />
            <circle cx="86" cy="78" r="1.5" fill="#FFFFFF" />
            <circle cx="112" cy="80" r="5" fill="#1D493E" />
            <circle cx="110" cy="78" r="1.5" fill="#FFFFFF" />
            {/* Cute Cheeks */}
            <circle cx="82" cy="90" r="6" fill="#F8AFA6" opacity="0.6" />
            <circle cx="118" cy="90" r="6" fill="#F8AFA6" opacity="0.6" />
          </>
        )}

        {/* Goggles/Sunglasses */}
        {withGoggles && (
          <g className={interactive ? 'origin-[100px_80px] hover:scale-[1.03] transition-transform duration-300' : ''}>
            {/* Glasses Strap */}
            <path
              d="M72 80 L128 80"
              stroke="#1D493E"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Left Lens Frame */}
            <circle cx="86" cy="80" r="17" fill="#E05434" stroke="#1D493E" strokeWidth="4" />
            <circle cx="86" cy="80" r="13" fill="#1D493E" />
            {/* Reflection */}
            <path
              d="M78 76 A 10 10 0 0 1 92 72 L90 76 A 6 6 0 0 0 82 78 Z"
              fill="#FFFFFF"
              opacity="0.5"
            />
            
            {/* Bridge */}
            <path
              d="M97 80 L103 80"
              stroke="#1D493E"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Right Lens Frame */}
            <circle cx="114" cy="80" r="17" fill="#E05434" stroke="#1D493E" strokeWidth="4" />
            <circle cx="114" cy="80" r="13" fill="#1D493E" />
            {/* Reflection */}
            <path
              d="M106 76 A 10 10 0 0 1 120 72 L118 76 A 6 6 0 0 0 110 78 Z"
              fill="#FFFFFF"
              opacity="0.5"
            />
          </g>
        )}

        {/* Explorer Hat */}
        {withHat && (
          <g className={interactive ? 'origin-[100px_45px] hover:translate-y-[-2px] transition-transform duration-300' : ''}>
            {/* Hat Crown */}
            <path
              d="M76 48 L80 30 C81 24 88 20 95 20 L105 20 C112 20 119 24 120 30 L124 48 Z"
              fill="#1D493E"
              stroke="#1D493E"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Hat Band (Yellow) */}
            <path
              d="M77 43 L123 43"
              stroke="#FFFF80"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Hat Brim */}
            <path
              d="M62 48 C70 48 130 48 138 48 C145 48 145 53 138 53 C120 53 80 53 62 53 C55 53 55 48 62 48 Z"
              fill="#1D493E"
              stroke="#1D493E"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </g>
        )}
      </svg>

      {/* Floating Animated Crown Tag for interactivity */}
      {interactive && (
        <span className="absolute -top-1 -right-1 text-[10px] bg-brand-orange text-white px-1.5 py-0.5 rounded-full font-black scale-0 hover:scale-100 group-hover:scale-100 transition-all origin-bottom-left shadow-sm z-10">
          HI!
        </span>
      )}
    </div>
  );
};
