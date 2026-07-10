export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  rating: number;
  inStock: boolean;
  gender?: 'men' | 'women' | 'unisex';
  subcategory?: 'topwear' | 'bottomwear' | 'accessories' | 'personal-care' | 'footwear' | 'lifestyle';
  itemType?: string;
  originalPrice?: number;
  sizes?: string[];
  brand?: string;
  color?: string;
  reviewsCount?: number;
  boughtCount?: string;
}

export interface TravelPackage {
  id: string;
  name: string;
  price: number; // base price per person
  description: string;
  image: string;
  duration: string;
  highlights: string[];
  location: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  type: 'shop' | 'travel';
  quantity: number;
  date?: string; // for travel packages
  guests?: number; // for travel packages
  size?: string; // selected apparel/footwear size
}
