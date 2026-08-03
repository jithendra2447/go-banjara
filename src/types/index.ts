export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductReview {
  id?: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
}

export interface ProductFaq {
  question: string;
  answer: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  rating: number;
  inStock: boolean;
  section?: string;
  sections?: string[];
  isBestDeal?: boolean;
  isMostSelling?: boolean;
  isNewArrival?: boolean;
  isTravelEssential?: boolean;
  isLimitedEdition?: boolean;
  isDiscountSale?: boolean;
  isFeatured?: boolean;
  showOnHome?: boolean;
  homeShowcaseSection?: 'hero' | 'deals' | 'most-selling' | 'featured' | 'none';
  gender?: 'men' | 'women' | 'unisex';
  subcategory?: 'topwear' | 'bottomwear' | 'accessories' | 'personal-care' | 'footwear' | 'lifestyle';
  itemType?: string;
  originalPrice?: number;
  sizes?: string[];
  brand?: string;
  color?: string;
  reviewsCount?: number;
  boughtCount?: string;
  specs?: ProductSpec[];
  reviewsList?: ProductReview[];
  faqsList?: ProductFaq[];
  galleryImages?: string[];
  highlights?: string[];
  hidden?: boolean;
  pageLocation?: 'home' | 'shop' | 'both';
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
  showOnHome?: boolean;
  isBestSeller?: boolean;
  homeShowcaseSection?: 'hero' | 'featured' | 'deals' | 'none';
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
