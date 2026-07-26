import React from 'react';

interface CartIconProps {
  className?: string;
  style?: React.CSSProperties;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function CartIcon({ 
  className = "w-5 h-5", 
  style, 
  size = 20, 
  color = "currentColor", 
  strokeWidth = 2 
}: CartIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      <circle cx="10" cy="20.5" r="1.5" />
      <circle cx="18" cy="20.5" r="1.5" />
    </svg>
  );
}

export default CartIcon;
