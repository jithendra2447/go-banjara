import React from 'react';

interface SteamerTrunkProps {
  isOpen: boolean;
  outfit: 'kerala' | 'ladakh' | 'hyderabad';
  className?: string;
}

export const SteamerTrunk: React.FC<SteamerTrunkProps> = ({
  isOpen,
  outfit,
  className = '',
}) => {
  return (
    <div className={`relative transition-all duration-700 select-none ${className}`}>
      {/* SVG Container */}
      <svg
        viewBox="0 0 200 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.4)]"
      >
        <defs>
          <linearGradient id="trunk-body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#255C4F" />
            <stop offset="50%" stopColor="#1D493E" />
            <stop offset="100%" stopColor="#112C25" />
          </linearGradient>
          <linearGradient id="brass-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE066" />
            <stop offset="40%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>
          <linearGradient id="wood-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E05434" />
            <stop offset="100%" stopColor="#B83A1C" />
          </linearGradient>
          <linearGradient id="interior-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFEE5" />
            <stop offset="100%" stopColor="#FFFF80" />
          </linearGradient>
          <linearGradient id="strap-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#854D0E" />
            <stop offset="100%" stopColor="#451A03" />
          </linearGradient>
        </defs>

        {/* Shadow base */}
        <ellipse cx="100" cy="225" rx="70" ry="10" fill="rgba(0, 0, 0, 0.4)" />

        {/* CLOSED STATE TRUNK */}
        <g
          id="trunk-closed"
          className="transition-all duration-700"
          style={{
            opacity: isOpen ? 0 : 1,
            transform: isOpen ? 'translateY(20px) scale(0.9)' : 'none',
            transformOrigin: '100px 180px',
          }}
        >
          {/* Main Box */}
          <rect x="25" y="70" width="150" height="130" rx="12" fill="url(#trunk-body-grad)" stroke="#112C25" strokeWidth="3" />
          
          {/* Lid Split line */}
          <line x1="25" y1="110" x2="175" y2="110" stroke="#112C25" strokeWidth="2" strokeDasharray="4 2" />
          <line x1="25" y1="111" x2="175" y2="111" stroke="#D97706" strokeWidth="1" opacity="0.3" />

          {/* Wooden Slats (Horizontal reinforcement slats of Goyard style) */}
          <rect x="35" y="90" width="130" height="8" rx="2" fill="url(#wood-grad)" opacity="0.8" />
          <rect x="35" y="130" width="130" height="8" rx="2" fill="url(#wood-grad)" opacity="0.8" />
          <rect x="35" y="170" width="130" height="8" rx="2" fill="url(#wood-grad)" opacity="0.8" />

          {/* Vertical Leather Straps */}
          {/* Left Strap */}
          <rect x="55" y="66" width="16" height="138" rx="2" fill="url(#strap-grad)" stroke="#112C25" strokeWidth="1" />
          <circle cx="63" cy="80" r="2" fill="#D97706" />
          <circle cx="63" cy="100" r="2" fill="#D97706" />
          <circle cx="63" cy="125" r="2" fill="#D97706" />
          <circle cx="63" cy="150" r="2" fill="#D97706" />
          <circle cx="63" cy="175" r="2" fill="#D97706" />
          <circle cx="63" cy="195" r="2" fill="#D97706" />
          {/* Left Buckle */}
          <rect x="52" y="115" width="22" height="14" rx="2" fill="url(#brass-grad)" stroke="#112C25" strokeWidth="1" />
          <line x1="63" y1="115" x2="63" y2="129" stroke="#112C25" strokeWidth="2" />

          {/* Right Strap */}
          <rect x="129" y="66" width="16" height="138" rx="2" fill="url(#strap-grad)" stroke="#112C25" strokeWidth="1" />
          <circle cx="137" cy="80" r="2" fill="#D97706" />
          <circle cx="137" cy="100" r="2" fill="#D97706" />
          <circle cx="137" cy="125" r="2" fill="#D97706" />
          <circle cx="137" cy="150" r="2" fill="#D97706" />
          <circle cx="137" cy="175" r="2" fill="#D97706" />
          <circle cx="137" cy="195" r="2" fill="#D97706" />
          {/* Right Buckle */}
          <rect x="126" y="115" width="22" height="14" rx="2" fill="url(#brass-grad)" stroke="#112C25" strokeWidth="1" />
          <line x1="137" y1="115" x2="137" y2="129" stroke="#112C25" strokeWidth="2" />

          {/* Brass Corner Brackets */}
          {/* Top Left */}
          <path d="M25 85 V70 H40 C40 70 30 70 25 85 Z" fill="url(#brass-grad)" stroke="#112C25" />
          <circle cx="32" cy="77" r="1.5" fill="#451A03" />
          {/* Top Right */}
          <path d="M175 85 V70 H160 C160 70 170 70 175 85 Z" fill="url(#brass-grad)" stroke="#112C25" />
          <circle cx="168" cy="77" r="1.5" fill="#451A03" />
          {/* Bottom Left */}
          <path d="M25 185 V200 H40 C40 200 30 200 25 185 Z" fill="url(#brass-grad)" stroke="#112C25" />
          <circle cx="32" cy="193" r="1.5" fill="#451A03" />
          {/* Bottom Right */}
          <path d="M175 185 V200 H160 C160 200 170 200 175 185 Z" fill="url(#brass-grad)" stroke="#112C25" />
          <circle cx="168" cy="193" r="1.5" fill="#451A03" />

          {/* Heavy Central Brass Lock */}
          <rect x="88" y="102" width="24" height="24" rx="4" fill="url(#brass-grad)" stroke="#112C25" strokeWidth="1.5" />
          <circle cx="100" cy="110" r="3" fill="#112C25" />
          <path d="M100 113 V120" stroke="#112C25" strokeWidth="2" strokeLinecap="round" />

          {/* Monogram branding */}
          <text x="100" y="152" fill="#FFFF80" fontSize="12" fontFamily="var(--font-serif)" fontWeight="bold" textAnchor="middle" letterSpacing="2" opacity="0.7">GB</text>

          {/* Leather Handle on Top */}
          <path d="M80 70 C80 50 120 50 120 70" stroke="url(#strap-grad)" strokeWidth="8" strokeLinecap="round" />
          <rect x="76" y="65" width="10" height="10" rx="1" fill="url(#brass-grad)" stroke="#112C25" />
          <rect x="114" y="65" width="10" height="10" rx="1" fill="url(#brass-grad)" stroke="#112C25" />
        </g>

        {/* OPEN STATE TRUNK */}
        <g
          id="trunk-open"
          className="transition-all duration-700"
          style={{
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? 'none' : 'translateY(-20px) scale(0.95)',
            transformOrigin: '100px 180px',
          }}
        >
          {/* Opened Lid (flipped back / up top) */}
          <g id="trunk-open-lid">
            <rect x="25" y="20" width="150" height="50" rx="8" fill="url(#trunk-body-grad)" stroke="#112C25" strokeWidth="2" />
            {/* Lid interior backboard */}
            <rect x="29" y="24" width="142" height="42" rx="4" fill="url(#interior-grad)" opacity="0.9" />
            <text x="100" y="48" fill="#1D493E" fontSize="9" fontFamily="var(--font-serif)" fontWeight="extrabold" textAnchor="middle" letterSpacing="3" opacity="0.3">GO BANJĀRA</text>
            
            {/* Hanging elastic pocket in lid */}
            <path d="M35 50 C35 50 60 55 100 55 C140 55 165 50 165 50 V62 H35 Z" fill="#1D493E" opacity="0.15" />
            <line x1="35" y1="50" x2="165" y2="50" stroke="#1D493E" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
          </g>

          {/* Lid Hinge connectors */}
          <rect x="45" y="68" width="10" height="6" fill="#D97706" />
          <rect x="145" y="68" width="10" height="6" fill="#D97706" />

          {/* Main Lower Compartment (standing open) */}
          <rect x="25" y="72" width="150" height="130" rx="8" fill="url(#trunk-body-grad)" stroke="#112C25" strokeWidth="3" />
          <rect x="29" y="76" width="142" height="122" rx="4" fill="url(#interior-grad)" />

          {/* Stitched quilting inside */}
          <path d="M29 76 L171 198 M171 76 L29 198" stroke="rgba(29, 73, 62, 0.04)" strokeWidth="1" />
          <path d="M29 110 L171 110 M29 150 L171 150 M75 76 L75 198 M125 76 L125 198" stroke="rgba(29, 73, 62, 0.04)" strokeWidth="1" />

          {/* Inside Items (Outfit Specific) */}
          {/* KERALA ITEMS INSIDE TRUNK */}
          <g id="interior-kerala" className="transition-opacity duration-500" style={{ opacity: outfit === 'kerala' ? 1 : 0 }}>
            {/* Kasavu Mundu (Folded Gold-Cream Fabric) */}
            <rect x="40" y="90" width="65" height="40" rx="3" fill="#FBFBF9" stroke="#1D493E" strokeWidth="1.5" />
            <rect x="40" y="100" width="65" height="10" fill="#D97706" opacity="0.9" />
            <line x1="45" y1="95" x2="100" y2="95" stroke="#E6E3DB" strokeWidth="1" />
            <line x1="45" y1="115" x2="100" y2="115" stroke="#E6E3DB" strokeWidth="1" />

            {/* Glass Jar of Cardamom Spices */}
            <rect x="118" y="88" width="30" height="42" rx="6" fill="rgba(255,255,255,0.7)" stroke="#1D493E" strokeWidth="1.5" />
            {/* Green cardamom seeds inside */}
            <circle cx="126" cy="112" r="3" fill="#01B99F" opacity="0.8" />
            <circle cx="134" cy="116" r="3.5" fill="#01B99F" opacity="0.8" />
            <circle cx="138" cy="108" r="2.5" fill="#1D493E" opacity="0.6" />
            {/* Lid of jar */}
            <rect x="122" y="84" width="22" height="5" rx="1.5" fill="url(#brass-grad)" stroke="#112C25" />
            <text x="133" y="102" fill="#1C473C" fontSize="5" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">SPICE</text>

            {/* Travel pillow */}
            <path d="M50 148 C50 135 110 135 110 148 C110 158 90 162 80 162 C70 162 50 158 50 148 Z" fill="#E05434" stroke="#1D493E" strokeWidth="1.5" />
            <circle cx="80" cy="148" r="10" fill="url(#interior-grad)" />

            {/* Little tags */}
            <rect x="120" y="145" width="24" height="14" rx="2" fill="url(#brass-grad)" transform="rotate(15 120 145)" stroke="#1D493E" />
            <text x="132" y="154" fill="#1D493E" fontSize="5" fontWeight="black" textAnchor="middle" transform="rotate(15 120 145)">KER</text>
          </g>

          {/* LADAKH ITEMS INSIDE TRUNK */}
          <g id="interior-ladakh" className="transition-opacity duration-500" style={{ opacity: outfit === 'ladakh' ? 1 : 0 }}>
            {/* Insulated Puffer Coat (folded) */}
            <rect x="38" y="86" width="60" height="50" rx="6" fill="#1C473C" stroke="#1D493E" strokeWidth="1.5" />
            <line x1="38" y1="102" x2="98" y2="102" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
            <line x1="38" y1="118" x2="98" y2="118" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
            {/* Gold Zipper */}
            <line x1="68" y1="86" x2="68" y2="136" stroke="#D97706" strokeWidth="1.5" />

            {/* Waxed Canvas Backpack (compacted/folded) */}
            <rect x="110" y="90" width="42" height="52" rx="4" fill="#5E6759" stroke="#1D493E" strokeWidth="1.5" />
            <rect x="116" y="100" width="30" height="34" rx="2" fill="#451A03" opacity="0.3" />
            {/* Buckle straps */}
            <line x1="122" y1="90" x2="122" y2="142" stroke="#451A03" strokeWidth="2" />
            <line x1="140" y1="90" x2="140" y2="142" stroke="#451A03" strokeWidth="2" />

            {/* Orange beanie */}
            <path d="M50 145 C50 135 90 135 90 145 Z" fill="#E05434" stroke="#1D493E" strokeWidth="1.5" />
            <rect x="47" y="145" width="46" height="7" rx="2" fill="#E05434" stroke="#1D493E" />
            <circle cx="70" cy="131" r="4" fill="#FBFBF9" />

            {/* Leather gloves */}
            <path d="M110 152 C110 152 118 145 125 152 L128 170 H107 Z" fill="#854D0E" stroke="#1D493E" />
            <path d="M125 152 C125 152 133 145 140 152 L143 170 H122 Z" fill="#854D0E" stroke="#1D493E" />
          </g>

          {/* HYDERABAD ITEMS INSIDE TRUNK */}
          <g id="interior-hyderabad" className="transition-opacity duration-500" style={{ opacity: outfit === 'hyderabad' ? 1 : 0 }}>
            {/* Khadi Cotton Shirt */}
            <path d="M40 92 L55 82 L70 92 V132 H40 Z" fill="#E6E3DB" stroke="#1D493E" strokeWidth="1.5" />
            {/* Collar */}
            <path d="M48 82 L55 92 L62 82" stroke="#1D493E" strokeWidth="1.5" fill="none" />
            {/* Buttons */}
            <circle cx="55" cy="100" r="1.5" fill="#1C473C" />
            <circle cx="55" cy="112" r="1.5" fill="#1C473C" />
            <circle cx="55" cy="124" r="1.5" fill="#1C473C" />

            {/* Pearl Necklace on velvet display */}
            <rect x="114" y="86" width="42" height="42" rx="4" fill="#451A03" stroke="#1D493E" strokeWidth="1.5" />
            <ellipse cx="135" cy="105" rx="14" ry="10" stroke="#FAF9F6" strokeWidth="2.5" fill="none" strokeDasharray="3 3" />
            <ellipse cx="135" cy="105" rx="10" ry="7" stroke="#FAF9F6" strokeWidth="2" fill="none" strokeDasharray="2.5 2.5" />

            {/* Coffee beans bag */}
            <path d="M45 142 L52 138 H78 L85 142 L80 172 H50 Z" fill="#E05434" stroke="#1D493E" strokeWidth="1.5" />
            <ellipse cx="65" cy="155" rx="10" ry="6" fill="#F3FFEF" />
            <text x="65" y="157" fill="#1D493E" fontSize="5" fontWeight="bold" textAnchor="middle">COFFEE</text>

            {/* Stickers pack */}
            <rect x="105" y="140" width="30" height="28" rx="2" fill="rgba(255,255,255,0.8)" stroke="#1D493E" transform="rotate(-10 105 140)" />
            {/* Llama face silhouette in sticker */}
            <circle cx="118" cy="152" r="6" fill="#AE99FF" transform="rotate(-10 105 140)" />
            <text x="118" y="154" fill="#FFFF80" fontSize="5" fontWeight="black" textAnchor="middle" transform="rotate(-10 105 140)">BONJO</text>
          </g>

          {/* Brass Corner Brackets for Open Base */}
          {/* Bottom Left */}
          <path d="M25 185 V200 H40 C40 200 30 200 25 185 Z" fill="url(#brass-grad)" stroke="#112C25" />
          <circle cx="32" cy="193" r="1.5" fill="#451A03" />
          {/* Bottom Right */}
          <path d="M175 185 V200 H160 C160 200 170 200 175 185 Z" fill="url(#brass-grad)" stroke="#112C25" />
          <circle cx="168" cy="193" r="1.5" fill="#451A03" />
        </g>
      </svg>
    </div>
  );
};
