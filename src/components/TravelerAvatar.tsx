import React from 'react';

interface TravelerAvatarProps {
  outfit: 'kerala' | 'ladakh' | 'hyderabad';
  className?: string;
  width?: number;
  height?: number;
}

export const TravelerAvatar: React.FC<TravelerAvatarProps> = ({
  outfit,
  className = '',
  width = 240,
  height = 320,
}) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width, height }}
    >
      <svg
        viewBox="0 0 200 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFF80" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="ivory-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FBFBF9" />
            <stop offset="100%" stopColor="#E6E3DB" />
          </linearGradient>
          <linearGradient id="skin-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF1E5" />
            <stop offset="100%" stopColor="#F3D5C0" />
          </linearGradient>
        </defs>

        {/* Global base shadow */}
        <ellipse cx="100" cy="265" rx="45" ry="5" fill="rgba(29, 73, 62, 0.08)" />

        {/* Slender legs and chic designer boots */}
        <g id="slender-legs">
          {/* Left leg */}
          <path d="M86 210 L86 250" stroke="#1D493E" strokeWidth="2" strokeLinecap="round" />
          <path d="M82 250 H90 L88 258 H78 L82 250" fill="#1D493E" stroke="#1D493E" strokeWidth="1.5" strokeLinejoin="round" />
          {/* Right leg */}
          <path d="M114 210 L114 250" stroke="#1D493E" strokeWidth="2" strokeLinecap="round" />
          <path d="M110 250 H118 L122 258 H112 L110 250" fill="#1D493E" stroke="#1D493E" strokeWidth="1.5" strokeLinejoin="round" />
        </g>

        {/* Chic minimalist Face and Hair */}
        <g id="minimalist-portrait">
          {/* Slender Neck */}
          <path d="M94 75 C94 75 92 90 92 95 C98 98 102 98 108 95 C108 90 106 75 106 75" fill="url(#skin-grad)" stroke="#1D493E" strokeWidth="1.5" />
          
          {/* Elegant Face Line */}
          <path d="M82 55 C82 38 118 38 118 55 C118 72 108 78 100 78 C92 78 82 72 82 55 Z" fill="url(#skin-grad)" stroke="#1D493E" strokeWidth="1.5" />
          
          {/* High fashion closed eyes (sleeping beauty style) */}
          <path d="M88 56 C90 58 94 58 96 56" stroke="#1D493E" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M104 56 C106 58 110 58 112 56" stroke="#1D493E" strokeWidth="1.5" strokeLinecap="round" />
          {/* Minimal lip stroke */}
          <path d="M97 67 H103" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" />

          {/* Hair (Sleek minimalist high bun) */}
          <path
            d="M80 50 C76 42 124 42 120 50 C122 36 112 30 100 30 C88 30 78 36 80 50 Z"
            fill="#1D493E"
          />
          {/* The Bun */}
          <circle cx="100" cy="22" r="8.5" fill="#1D493E" stroke="#D97706" strokeWidth="1.5" />
        </g>

        {/* OUTFIT 1: KERALA (Boutique gold-cream handloom saree dress) */}
        <g 
          id="outfit-kerala" 
          className="transition-opacity duration-500 ease-in-out" 
          style={{ opacity: outfit === 'kerala' ? 1 : 0, pointerEvents: outfit === 'kerala' ? 'auto' : 'none' }}
        >
          {/* Blouse */}
          <path
            d="M82 92 C82 92 100 96 118 92 L120 125 H80 Z"
            fill="url(#ivory-grad)"
            stroke="#1D493E"
            strokeWidth="1.8"
          />

          {/* Saree Pleat Draping */}
          <path
            d="M80 125 L65 215 C75 220 125 220 135 215 L120 125 Z"
            fill="url(#ivory-grad)"
            stroke="#1D493E"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />

          {/* Saree Pallu (Sash draped across body) */}
          <path
            d="M82 92 Q90 135 125 200 L132 195 Q96 130 86 92 Z"
            fill="url(#gold-grad)"
            opacity="0.9"
            stroke="#1D493E"
            strokeWidth="1"
          />

          {/* Gold details on borders */}
          <path d="M68 208 L132 208" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M67 212 L133 212" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />

          {/* Graceful flower decorations on hair */}
          <circle cx="88" cy="30" r="3.5" fill="#FAF9F6" stroke="#D97706" strokeWidth="0.8" />
          <circle cx="94" cy="27" r="3.5" fill="#FAF9F6" stroke="#D97706" strokeWidth="0.8" />
          <circle cx="106" cy="27" r="3.5" fill="#FAF9F6" stroke="#D97706" strokeWidth="0.8" />
          <circle cx="112" cy="30" r="3.5" fill="#FAF9F6" stroke="#D97706" strokeWidth="0.8" />
        </g>

        {/* OUTFIT 2: LADAKH (Premium designer insulated puffer coat & chic yellow scarf) */}
        <g 
          id="outfit-ladakh" 
          className="transition-opacity duration-500 ease-in-out" 
          style={{ opacity: outfit === 'ladakh' ? 1 : 0, pointerEvents: outfit === 'ladakh' ? 'auto' : 'none' }}
        >
          {/* Cozy Mountain Beanie */}
          <path
            d="M78 46 C78 30 122 30 122 46 Z"
            fill="#D97706"
            stroke="#1D493E"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <rect x="75" y="42" width="50" height="7" rx="3" fill="#D97706" stroke="#1D493E" strokeWidth="1.5" />
          <circle cx="100" cy="26" r="5" fill="#FAF9F6" stroke="#1D493E" strokeWidth="1.5" />

          {/* Designer Oversized Puffer Jacket */}
          <path
            d="M74 90 C70 120 70 175 72 205 C75 212 125 212 128 205 C130 175 130 120 126 90 Z"
            fill="#1D493E"
            stroke="#1D493E"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Aesthetic Curved Puffer Ribs */}
          <path d="M73 115 Q100 120 127 115" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
          <path d="M72 138 Q100 143 128 138" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
          <path d="M72 161 Q100 166 128 161" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
          <path d="M72 184 Q100 189 128 184" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />

          {/* Gold Zipper line */}
          <line x1="100" y1="90" x2="100" y2="205" stroke="#D97706" strokeWidth="2" />

          {/* Chic Saffron Wool Scarf */}
          <path
            d="M84 82 Q100 88 116 82 L118 96 Q100 102 82 96 Z"
            fill="url(#gold-grad)"
            stroke="#1D493E"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M104 94 L114 135 H102 L96 94 Z"
            fill="url(#gold-grad)"
            stroke="#1D493E"
            strokeWidth="1"
          />

          {/* Insulated sleeves */}
          <path
            d="M74 90 Q60 115 64 165 L74 162 Q70 120 78 95"
            fill="#1D493E"
            stroke="#1D493E"
            strokeWidth="1.5"
          />
          <path
            d="M126 90 Q140 115 136 165 L126 162 Q130 120 122 95"
            fill="#1D493E"
            stroke="#1D493E"
            strokeWidth="1.5"
          />
        </g>

        {/* OUTFIT 3: HYDERABAD (Modern urban street fashion, linen vest & pearl details) */}
        <g 
          id="outfit-hyderabad" 
          className="transition-opacity duration-500 ease-in-out" 
          style={{ opacity: outfit === 'hyderabad' ? 1 : 0, pointerEvents: outfit === 'hyderabad' ? 'auto' : 'none' }}
        >
          {/* Orange crop tank-top */}
          <path
            d="M84 94 H116 L118 135 H82 Z"
            fill="#E05434"
            stroke="#1D493E"
            strokeWidth="1.5"
          />

          {/* Linen Drape Vest (draped over shoulders) */}
          <path
            d="M75 92 C72 108 72 145 78 175 L86 172 C80 130 82 105 82 92"
            fill="url(#ivory-grad)"
            stroke="#1D493E"
            strokeWidth="1.5"
          />
          <path
            d="M125 92 C128 108 128 145 122 175 L114 172 C120 130 118 105 118 92"
            fill="url(#ivory-grad)"
            stroke="#1D493E"
            strokeWidth="1.5"
          />

          {/* High waisted urban khaki trousers */}
          <path
            d="M80 135 L68 215 H98 V170 H102 V215 H132 L120 135 Z"
            fill="#5E6759"
            stroke="#1D493E"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />

          {/* Triple-strand Pearl Necklace */}
          <ellipse cx="100" cy="88" rx="14" ry="4" stroke="#FAF9F6" strokeWidth="2.5" opacity="0.9" />
          <ellipse cx="100" cy="91" rx="10" ry="3" stroke="#FAF9F6" strokeWidth="2.5" opacity="0.9" />
        </g>
      </svg>
    </div>
  );
};
