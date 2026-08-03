export interface CustomPage {
  id: string;
  title: string;
  slug: string;
  status: 'published' | 'draft';
  showInHeader: boolean;
  showInFooter: boolean;
  heroImage?: string;
  metaDescription?: string;
  content: string; // Markdown or HTML format
  createdAt: string;
  updatedAt: string;
}

export interface PackageProductLink {
  packageId: string;
  productId: string;
  perkType: 'included' | 'addon';
  discountPercent?: number;
  note?: string;
}

export interface GlobalSiteSettings {
  siteName: string;
  logoUrl: string;
  faviconUrl: string;
  announcementText: string;
  announcementEnabled: boolean;
  announcementLink?: string;
  supportPhone: string;
  supportEmail: string;
  whatsappNumber: string;
  currencySymbol: string;
  copyrightText: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  twitterUrl: string;
  address: string;
}

export interface CustomHomeSection {
  id: string;
  type?: 'product-grid' | 'banner';
  position?: 'bottom' | 'hero' | 'dual_cta' | 'destinations' | 'deals' | 'bestselling' | 'categories' | 'reviews' | 'blog' | 'faq' | 'values';
  displayMode?: 'grid' | 'carousel';
  buttonStyle?: 'view_all' | 'load_more' | 'drag_carousel' | 'drag' | 'solid';
  title: string;
  subtitle: string;
  tag?: string;
  categoryFilter?: string;
  limitCount?: number;
  image?: string;
  videoUrl?: string;
  content?: string;
  buttonText?: string;
  buttonLink?: string;
  visible: boolean;
}

export interface SiteCMSContent {
  // Global Site Config
  global: GlobalSiteSettings;

  // Home Page Section Visibility Toggles (Keep / Hide)
  showHeroSection?: boolean;
  showDualCtaBanners?: boolean;
  showDestinationsSection?: boolean;
  showDealsSection?: boolean;
  showBestSellingSection?: boolean;
  showCategoriesSection?: boolean;
  showReviewsSection?: boolean;
  showBlogSection?: boolean;
  showFaqSection?: boolean;
  showValuesSection?: boolean;
  showCtaBannerSection?: boolean;

  // Home Page Hero Section (Media & Copy)
  homeHeroVideoUrl?: string;
  homeHeroPosterUrl?: string;
  homeHeroTitleLine1: string;
  homeHeroTitleLine2: string;
  homeHeroTitleLine3: string;
  homeHeroSubtitle: string;
  homeHeroShopBtn: string;
  homeHeroTravelBtn: string;
  homeMascotText: string;

  // Dual CTA Banners (Shop Gear + Book Trip cards)
  homeCtaBanner1Title: string;
  homeCtaBanner1Desc: string;
  homeCtaBanner1BtnText: string;
  homeCtaBanner1BtnLink: string;
  homeCtaBanner1Image?: string;
  homeCtaBanner2Title: string;
  homeCtaBanner2Desc: string;
  homeCtaBanner2BtnText: string;
  homeCtaBanner2BtnLink: string;
  homeCtaBanner2Image?: string;

  // Destinations Section
  homeDestinationsTag: string;
  homeDestinationsTitle: string;
  homeDestinationsSub: string;

  // Deals & Selling
  homeDealsTag?: string;
  homeDealsTitle: string;
  homeDealsSub: string;
  homeSellingTag?: string;
  homeSellingTitle: string;
  homeSellingSub: string;

  // Collections / Categories Section
  homeCollectionsTag?: string;
  homeCollectionsTitle: string;
  homeCollectionsSub: string;
  homeCategories?: Array<{ name: string; price: string; image: string; link: string; }>;

  // Reviews Section
  homeReviewsTag?: string;
  homeReviewsTitle: string;
  homeReviewsSub: string;
  homeReviews?: Array<{ id: string; name: string; subtitle: string; avatar: string; text: string; stars: number; }>;

  // Blog / Travel Diaries Section
  homeBlogTag?: string;
  homeBlogTitle: string;
  homeBlogSub: string;
  homeBlogPosts?: Array<{ id: string; title: string; excerpt: string; image: string; readTime: string; date: string; author: string; }>;

  // FAQ Section
  homeFaqTag?: string;
  homeFaqTitle: string;
  homeFaqHelpDesk: string;
  homeFaqs?: Array<{ question: string; answer: string; }>;

  // Values / Services Section
  homeValuesTag?: string;
  homeValuesTitle: string;
  homeValuesSub: string;
  homeServicesCards?: Array<{ image: string; title: string; desc: string; }>;

  // Meet Bonjo Section
  homeBonjoTag?: string;
  homeBonjoTitle?: string;
  homeBonjoText1?: string;
  homeBonjoText2?: string;
  homeBonjoText3?: string;
  homeBonjoBtnText?: string;
  homeBonjoBtnLink?: string;
  homeBonjoImage?: string;

  // Marquee Banners Section
  homeMarquee1Items?: string[];
  homeMarquee2Items?: string[];

  // Bottom CTA Banner
  homeCtaTitle: string;
  homeCtaSub: string;
  homeCtaBtnText: string;
  homeCtaBtnLink: string;
  homeCtaBgImage?: string;


  // Dynamic Custom Sections
  homeCustomSections?: CustomHomeSection[];

  // About Us Page Sections
  aboutHeroTitle: string;
  aboutHeroSubtitle: string;
  aboutMissionTitle: string;
  aboutMissionText: string;
  aboutStoryTitle: string;
  aboutStoryText: string;
  aboutTeamTitle: string;
  aboutTeamSubtitle: string;

  // Contact Us Page Sections
  contactHeroTitle: string;
  contactHeroSubtitle: string;
  contactAddress: string;
  contactPhone: string;
  contactEmail: string;
  contactHours: string;
  contactMapUrl: string;

  // Shop Page Sections
  shopHeroTitle: string;
  shopHeroSubtitle: string;
  shopPromoBannerText: string;
  shopPromoBannerButton: string;

  // Travel Packages Page Sections
  travelHeroTitle: string;
  travelHeroSubtitle: string;
  travelSupportBannerText: string;
  travelSupportPhone: string;

  // Blog Page Sections
  blogHeroTitle: string;
  blogHeroSubtitle: string;
  blogNewsletterTitle: string;
  blogNewsletterSub: string;
}

export const DEFAULT_CMS_CONTENT: SiteCMSContent = {
  global: {
    siteName: 'Go Banjara',
    logoUrl: '/logo.png',
    faviconUrl: '/favicon.ico',
    announcementText: '🎉 MONSOON TREK SALE: Get up to 40% OFF on Kashmir & Himachal Packages!',
    announcementEnabled: true,
    announcementLink: '/travel',
    supportPhone: '+91 98765 43210',
    supportEmail: 'support@gobanjara.com',
    whatsappNumber: '+919876543210',
    currencySymbol: '₹',
    copyrightText: '© 2026 Go Banjara Experiences Pvt. Ltd. All rights reserved.',
    facebookUrl: 'https://facebook.com/gobanjara',
    instagramUrl: 'https://instagram.com/gobanjara',
    youtubeUrl: 'https://youtube.com/gobanjara',
    twitterUrl: 'https://twitter.com/gobanjara',
    address: 'Banjara Hills, Road No. 12, Hyderabad, Telangana, 500034',
  },

  // Home Page Section Visibility Toggles (Keep / Hide)
  showHeroSection: true,
  showDualCtaBanners: true,
  showDestinationsSection: true,
  showDealsSection: true,
  showBestSellingSection: true,
  showCategoriesSection: true,
  showReviewsSection: true,
  showBlogSection: true,
  showFaqSection: true,
  showValuesSection: true,
  showCtaBannerSection: true,

  // Home Page Hero Section (Media & Copy)
  homeHeroVideoUrl: '/hero-video.mp4',
  homeHeroPosterUrl: '/hero-poster.jpg',
  homeHeroTitleLine1: "Hey! Let’s Escape from",
  homeHeroTitleLine2: 'the Ordinary',
  homeHeroTitleLine3: '',
  homeHeroSubtitle: 'We bridge the gap between soulful Indian travel and high end gear. curated for those who find home in the dust of the road',
  homeHeroShopBtn: 'Shop Now',
  homeHeroTravelBtn: 'See Travel Packages',
  homeMascotText: 'Hey Nomad! Ready to explore Kashmir backwaters, Spiti valleys, or grab our signature nomad hoodie?',

  // Dual CTA Banners
  homeCtaBanner1Title: 'Shop Travel Gear for Nomads',
  homeCtaBanner1Desc: 'Explore our collection of hand-picked journals, weather-proof stickers and artisanal badges designed for the road',
  homeCtaBanner1BtnText: 'Explore Collections',
  homeCtaBanner1BtnLink: '/shop',
  homeCtaBanner1Image: '/shop_gear_cta.jpg',
  homeCtaBanner2Title: 'Book a Trip',
  homeCtaBanner2Desc: 'Explore our collection of hand-picked journals, weather-proof stickers and artisanal badges designed for the road',
  homeCtaBanner2BtnText: 'Find the Route',
  homeCtaBanner2BtnLink: '/travel',
  homeCtaBanner2Image: '/book_trip_cta.jpg',

  // Destinations
  homeDestinationsTag: 'DESTINATIONS',
  homeDestinationsTitle: 'Place worth the detour',
  homeDestinationsSub: 'A hand-picked map of the corners of India our community keeps coming back to',

  // Deals & Selling
  homeDealsTag: 'LIMITED TIME OFFERS',
  homeDealsTitle: 'Trending Adventure Deals',
  homeDealsSub: 'Handpicked apparel & gear for your next mountain trek or beach getaway.',
  homeSellingTag: 'MOST POPULAR',
  homeSellingTitle: 'Best Selling Banjara Essentials',
  homeSellingSub: 'Top rated gear loved by 10,000+ happy travelers across India.',

  // Collections
  homeCollectionsTag: 'THE COLLECTION',
  homeCollectionsTitle: 'Top Product Categories',
  homeCollectionsSub: 'Browse our curated collections of travel essentials and outdoor gear',
  homeCategories: [
    { name: "Stickers", price: "Starts from ₹93", image: "/around_the_world_sticker.jpg", link: "/shop?category=Stickers" },
    { name: "Badges", price: "Starts from ₹199", image: "/around_the_world_sticker.jpg", link: "/shop?category=Badges" },
    { name: "Fridge Magnets", price: "Starts from ₹199", image: "/around_the_world_sticker.jpg", link: "/shop?category=Magnets" },
    { name: "Journals", price: "Starts from ₹299", image: "/around_the_world_sticker.jpg", link: "/shop?category=Journals" },
    { name: "Patches", price: "Starts from ₹120", image: "/around_the_world_sticker.jpg", link: "/shop?category=Patches" },
    { name: "Pins", price: "Starts from ₹85", image: "/around_the_world_sticker.jpg", link: "/shop?category=Pins" },
    { name: "Keychains", price: "Starts from ₹99", image: "/around_the_world_sticker.jpg", link: "/shop?category=Keychains" },
    { name: "T-Shirts", price: "Starts from ₹499", image: "/around_the_world_sticker.jpg", link: "/shop?category=Apparel" },
  ],

  // Reviews
  homeReviewsTag: 'COMMUNITY REVIEWS',
  homeReviewsTitle: 'What people say about products',
  homeReviewsSub: 'Real reviews from our community of happy travelers',
  homeReviews: [
    { id: 'rev-1', name: 'Kiran Makwan', subtitle: 'Verified Wanderer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80', text: 'Exploring Spiti Valley with Go Banjara was a life-changing journey. Flawless planning, cozy homestays, and a wonderful group of fellow travelers. Highly recommended!', stars: 5 },
    { id: 'rev-2', name: 'Ananya Roy', subtitle: 'Himalayan Backpacker', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80', text: "I bought the waterproof stickers for my laptop and helmet. They've survived rain, dust, and countless rugged camping trips without peeling or fading!", stars: 5 },
    { id: 'rev-3', name: 'Rohan Sharma', subtitle: 'Motorcycle Nomad', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80', text: 'The Kashmir Road Trip package was pure magic. Extremely well-planned with authentic local homestays and off-the-beaten-path trails. Will book again!', stars: 5 },
    { id: 'rev-4', name: 'Priyanka Sen', subtitle: 'Slow Traveler', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80', text: 'The double-walled thermal flask keeps my tea steaming hot even at 14,000 feet in Ladakh. Truly premium travel gear built for real mountain conditions.', stars: 5 },
    { id: 'rev-5', name: 'Arjun Mehta', subtitle: 'Weekend Explorer', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80', text: 'Super clean design on the T-shirts! The fit is perfect, the fabric is extremely soft and breathable, and the graphics represent the soul of adventure travel.', stars: 5 },
    { id: 'rev-6', name: 'Priya Nair', subtitle: 'Solo Backpacker', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80', text: 'The Kerala Backwaters & Munnar Hills trip was breathtaking. The coordination was flawless, and the local guides showed us hidden trails away from all the tourists!', stars: 5 },
  ],

  // Blog
  homeBlogTag: 'THE JOURNAL',
  homeBlogTitle: 'Travel Tales from the curious Explorer',
  homeBlogSub: 'Follow my voices to discover unique voices, breathtaking landscapes & unforgettable experiences',
  homeBlogPosts: [
    { id: 'post-ladakh-guide-1', title: 'Ultimate Ladakh Travel Guide: Plan Your Perfect Himalayan Adventure', excerpt: 'Detailed packing list, fuel planning, and safety pointers for solo adventurers tackling the high passes alone.', image: '/travel-leh-1.jpg', readTime: '5 min read', date: 'Sunday, August 12, 2023', author: 'Kiran Makwan' },
    { id: 'post-ladakh-guide-2', title: 'Leh Ladakh Travel Guide 2026: Best Time, Places & Complete Trip Planning', excerpt: 'Detailed packing list, fuel planning, and safety pointers for solo adventurers tackling the high passes alone.', image: '/travel-leh-2.jpg', readTime: '5 min read', date: 'Sunday, August 12, 2023', author: 'Kiran Makwan' },
    { id: 'post-ladakh-guide-3', title: 'Ladakh Bike Trip Guide: Routes, Budget & Essential Tips for Riders', excerpt: 'Detailed packing list, fuel planning, and safety pointers for solo adventurers tackling the high passes alone.', image: '/travel-leh-3.jpg', readTime: '5 min read', date: 'Sunday, August 12, 2023', author: 'Kiran Makwan' },
    { id: 'post-ladakh-guide-4', title: '7-Day Leh Ladakh Itinerary for First-Time Travelers', excerpt: 'Detailed packing list, fuel planning, and safety pointers for solo adventurers tackling the high passes alone.', image: '/travel-leh-4.jpg', readTime: '5 min read', date: 'Sunday, August 12, 2023', author: 'Kiran Makwan' },
  ],

  // FAQ
  homeFaqTag: 'GOT QUESTIONS?',
  homeFaqTitle: 'Frequently Asked Questions',
  homeFaqHelpDesk: 'Help Desk',
  homeFaqs: [
    { question: 'What is Go Banjara?', answer: 'Go Banjara is a slow-travel community and premium outdoor boutique brand. We craft immersive road trips, treks, and beach escapes, alongside durable, highly styled travel gear like waterproof backpacks, passport covers, iron-on badges, and premium journals.' },
    { question: 'How do I book a travel package?', answer: "Browse our curated packages under the Travel section. Choose your travel date and group size, then click 'Book Now' to submit an inquiry. Our community guides will reach out within 24 hours to confirm your details and add the package to your cart." },
    { question: 'What is your gear return policy?', answer: 'We offer a 15-day hassle-free return window for all boutique gear and apparel in unused, original packaging. All products also carry a 6-month warranty against manufacturing defects.' },
    { question: 'Do you support local communities?', answer: 'Yes, 85% of your travel package expenses go directly to supporting local homestays, native guides, remote monasteries, and local micro-economies. Our gear is also sourced responsibly from local artisans.' },
    { question: 'What materials are the badges made from?', answer: 'Zinc alloy with glossy enamel fill. Lightweight, durable, and safe to pin on bags, jackets, or backpacks without damaging fabric.' },
  ],

  // Values / Services
  homeValuesTag: 'THE BANJARA TRIBE',
  homeValuesTitle: 'Join the Banjara Tribe',
  homeValuesSub: 'Services to help you shop',
  homeServicesCards: [
    { image: '/service-faq.png', title: 'Frequently Asked Questions (FAQ)', desc: 'See what are the commonly asked questions by our customers' },
    { image: '/service-delivery.png', title: 'Home Delivery Options available', desc: 'Pay with multiple cards seamlessly and without interruption' },
    { image: '/service-payment.png', title: 'Secure Online Payment Process', desc: 'Pay with multiple cards seamlessly and without interruption' },
    { image: '/service-openbox.png', title: 'Open Box Delivery', desc: 'Pay with multiple cards seamlessly and without interruption' }
  ],

  // Meet Bonjo
  homeBonjoTag: 'The Banjara Soul',
  homeBonjoTitle: 'Meet Bonjo.',
  homeBonjoText1: "Go Banjara was born from a frustration travel in India had become a checklist. Same cafés, same photo spots, same three-day Goa loop. We wanted something slower, closer to the ground, and honest about the places it visited.",
  homeBonjoText2: "So we built a hybrid platform: curated small-group journeys, a shop of honest gear made by artisans we know by name, and a community of travelers who share notes from the road instead of just photos.",
  homeBonjoText3: "Travel. Lifestyle. Community. Commerce. Under one roof because we don't think they were ever supposed to live apart.",
  homeBonjoBtnText: 'Our Story',
  homeBonjoBtnLink: '/about',
  homeBonjoImage: '/llama_mascot.png',

  // Marquee Banners
  homeMarquee1Items: [
    'BOOK YOUR NEXT TRIP',
    'SHOP TRAVEL GEAR',
    'DARE TO TRAVEL',
    'STICKERS',
    'MODERN NOMAD',
    'BADGES'
  ],
  homeMarquee2Items: [
    'ESCAPE THE ORDINARY',
    'SHOP TRAVEL GEAR',
    'DARE TO TRAVEL',
    'ADVENTURE AWAITS',
    'MODERN NOMAD',
    'SHOP TRAVEL GEAR'
  ],

  // Bottom CTA Banner
  homeCtaTitle: 'The best adventures find their way to your inbox.',
  homeCtaSub: 'Hidden places, exclusive trip drops, curated gear, and stories from the road delivered before anyone else hears about them.',
  homeCtaBtnText: 'Book Now',
  homeCtaBtnLink: '/travel',
  homeCtaBgImage: '/newsletter_bg.jpg',


  // Dynamic Custom Sections
  homeCustomSections: [],

  // About Us
  aboutHeroTitle: 'We Are Go Banjara',
  aboutHeroSubtitle: 'A community of passionate storytellers, trekkers, and culture explorers.',
  aboutMissionTitle: 'Our Sacred Mission',
  aboutMissionText: 'To connect wanderers with authentic regional cultures, breathtaking wilderness, and eco-friendly travel gear that empowers every journey.',
  aboutStoryTitle: 'How It All Started',
  aboutStoryText: 'Founded in the heart of Hyderabad, Go Banjara began as a small group of friends organizing weekend treks. Today, we are India’s leading experiential travel and outdoor lifestyle brand.',
  aboutTeamTitle: 'Meet the Nomads Behind the Magic',
  aboutTeamSubtitle: 'Our experienced trek leaders, local guides, and gear designers.',

  // Contact Us
  contactHeroTitle: 'Get in Touch with Bonjo & Team',
  contactHeroSubtitle: 'Have a question about a trip booking, order status, or custom corporate package? We are here 24/7!',
  contactAddress: 'Go Banjara HQ, Road No. 12, Banjara Hills, Hyderabad, TS 500034',
  contactPhone: '+91 98765 43210',
  contactEmail: 'hello@gobanjara.com',
  contactHours: 'Mon - Sat: 9:00 AM - 8:00 PM',
  contactMapUrl: 'https://maps.google.com',

  // Shop Page
  shopHeroTitle: 'Outdoor Gear & Banjara Store',
  shopHeroSubtitle: 'Authentic merchandise, trekking apparel, organic spices, and travel accessories.',
  shopPromoBannerText: 'Get a free Go Banjara Nomad Sticker Pack with orders above ₹1,499!',
  shopPromoBannerButton: 'Claim Gift Now',

  // Travel Packages
  travelHeroTitle: 'Curated Travel Experiences',
  travelHeroSubtitle: 'From Himalayan summits to Malabar backwaters, find your perfect trip.',
  travelSupportBannerText: 'Need customized group bookings or private family itineraries?',
  travelSupportPhone: '+91 98765 43210',

  // Blog Page
  blogHeroTitle: 'The Banjara Wanderer Journal',
  blogHeroSubtitle: 'Trek guides, packing tips, cultural stories, and hidden gem recommendations.',
  blogNewsletterTitle: 'Subscribe to Nomad Dispatch',
  blogNewsletterSub: 'Get weekly travel secrets and exclusive member discounts delivered straight to your inbox.',
};

export const DEFAULT_CUSTOM_PAGES: CustomPage[] = [
  {
    id: 'page-privacy',
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    status: 'published',
    showInHeader: false,
    showInFooter: true,
    heroImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    metaDescription: 'Read how Go Banjara protects and manages your personal information and trip data.',
    content: `
# Privacy Policy

Welcome to **Go Banjara Experiences Pvt. Ltd.** ("Go Banjara", "we", "us", or "our"). We respect your privacy and are committed to protecting your personal data.

### 1. Information We Collect
We collect personal information that you voluntarily provide to us when registering an account, booking a travel package, or purchasing products from our store:
- **Personal Identification Details**: Name, email address, mobile number, emergency contact details.
- **Payment Information**: Processed securely via PCI-DSS compliant gateways like Razorpay. We do not store raw card numbers or CVVs on our servers.
- **Trip Preferences**: Dietary restrictions, medical conditions disclosed for trekking safety, passport details for flight/permit bookings.

### 2. How We Use Your Information
- To fulfill and manage your travel bookings, hotel vouchers, and product deliveries.
- To send instant WhatsApp/Email booking confirmations, invoice receipts, and trip itineraries.
- To improve our website performance, customer support, and tailored travel recommendations.

### 3. Data Protection & Security
We implement SSL encryption, role-based database access, and regular security audits to prevent unauthorized access, alteration, or disclosure of your data.

### 4. Contact Us
For any privacy concerns or data access requests, please email us at **privacy@gobanjara.com**.
`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'page-terms',
    title: 'Terms & Conditions',
    slug: 'terms-and-conditions',
    status: 'published',
    showInHeader: false,
    showInFooter: true,
    heroImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
    metaDescription: 'Terms of service, trip cancellation guidelines, and store policies for Go Banjara.',
    content: `
# Terms & Conditions

Please read these Terms & Conditions carefully before booking any tour packages or purchasing merchandise on Go Banjara.

### 1. Booking & Payments
- A minimum 30% advance payment is required to confirm your seat on any group trip or package.
- The remaining balance must be cleared 7 days prior to departure date.

### 2. Cancellation & Refund Policy
- **30+ days prior to departure**: 90% refund of total trip cost.
- **15 to 29 days prior**: 50% refund.
- **0 to 14 days prior**: No refund due to upfront hotel & transport reservations.
- Store products can be returned or exchanged within 7 days of delivery in unused condition with tags intact.

### 3. Code of Conduct on Trips
Go Banjara promotes friendly, inclusive, and eco-responsible travel. Zero tolerance is maintained for harassment, illegal drug use, or damage to natural ecosystems.
`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'page-faq',
    title: 'Frequently Asked Questions',
    slug: 'faq',
    status: 'published',
    showInHeader: true,
    showInFooter: true,
    heroImage: 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&w=1200&q=80',
    metaDescription: 'Find answers to popular questions about trip bookings, gear shipping, and cancellation rules.',
    content: `
# Frequently Asked Questions (FAQ)

### Q1: Are solo travelers welcome on group trips?
**Yes!** Over 60% of Go Banjara wanderers travel solo. Our group trips are designed to foster warm friendships and memorable group bonding.

### Q2: What is included in the travel package cost?
Each package clearly lists inclusions such as accommodation, meals, internal transport, certified trip leads, and sightseeing passes. Check the specific package page for detailed lists.

### Q3: How long does merchandise delivery take?
Orders are dispatched within 24 hours. Standard shipping across India takes 3 to 5 business days.

### Q4: How do I link merchandise perks to my trip?
When booking select premium packages, complimentary gear (like our Nomad Keychain or Badge) will be automatically added to your booking confirmation!
`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const DEFAULT_PACKAGE_PRODUCT_LINKS: PackageProductLink[] = [
  { packageId: 'pkg-kashmir-summer', productId: 'prod-saffron', perkType: 'included', note: 'Complimentary Kashmiri Organic Saffron Sample Pack' },
  { packageId: 'pkg-kashmir-summer', productId: 'prod-jacket', perkType: 'addon', discountPercent: 20, note: 'Recommended Mountain Windcheater' },
  { packageId: 'pkg-leh-expedition', productId: 'prod-backpack', perkType: 'addon', discountPercent: 15, note: 'Trekker 45L Waterproof Backpack' },
  { packageId: 'pkg-kerala-backwaters', productId: 'prod-cardamom', perkType: 'included', note: 'Wayanad Fresh Cardamom Pouch' },
  { packageId: 'pkg-goa-beach', productId: 'prod-stickers', perkType: 'included', note: 'Go Banjara Nomad Sticker Set' },
];

// LOCAL STORAGE PERSISTENCE HELPERS
const CMS_STORAGE_KEY = 'gb_admin_page_content_v2';
const CUSTOM_PAGES_STORAGE_KEY = 'gb_admin_custom_pages';
const PACKAGE_PRODUCT_LINKS_KEY = 'gb_admin_package_products';

export function getStoredCMSContent(): SiteCMSContent {
  if (typeof window === 'undefined') return DEFAULT_CMS_CONTENT;
  try {
    const raw = localStorage.getItem(CMS_STORAGE_KEY);
    if (!raw) return DEFAULT_CMS_CONTENT;
    const parsed = JSON.parse(raw);
    if (parsed.homeHeroTitleLine1 === 'YOUR PASSPORT TO') {
      parsed.homeHeroTitleLine1 = DEFAULT_CMS_CONTENT.homeHeroTitleLine1;
      parsed.homeHeroTitleLine2 = DEFAULT_CMS_CONTENT.homeHeroTitleLine2;
      parsed.homeHeroTitleLine3 = DEFAULT_CMS_CONTENT.homeHeroTitleLine3;
      parsed.homeHeroSubtitle = DEFAULT_CMS_CONTENT.homeHeroSubtitle;
      parsed.homeHeroShopBtn = DEFAULT_CMS_CONTENT.homeHeroShopBtn;
      parsed.homeHeroTravelBtn = DEFAULT_CMS_CONTENT.homeHeroTravelBtn;
    }
    if (!parsed.homeCtaTitle || parsed.homeCtaTitle === 'Ready for Your Next Big Journey?') {
      parsed.homeCtaTitle = DEFAULT_CMS_CONTENT.homeCtaTitle;
      parsed.homeCtaSub = DEFAULT_CMS_CONTENT.homeCtaSub;
      parsed.homeCtaBtnText = DEFAULT_CMS_CONTENT.homeCtaBtnText;
    }
    return {
      ...DEFAULT_CMS_CONTENT,
      ...parsed,
      global: {
        ...DEFAULT_CMS_CONTENT.global,
        ...(parsed.global || {}),
      }
    };
  } catch (e) {
    console.error('Failed to parse CMS content from storage', e);
    return DEFAULT_CMS_CONTENT;
  }
}

export function saveStoredCMSContent(content: SiteCMSContent): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(content));
    window.dispatchEvent(new CustomEvent('gb_cms_updated', { detail: content }));
  } catch (e) {
    console.error('Failed to save CMS content to storage', e);
  }
}

export function getStoredCustomPages(): CustomPage[] {
  if (typeof window === 'undefined') return DEFAULT_CUSTOM_PAGES;
  try {
    const raw = localStorage.getItem(CUSTOM_PAGES_STORAGE_KEY);
    if (!raw) return DEFAULT_CUSTOM_PAGES;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse Custom Pages from storage', e);
    return DEFAULT_CUSTOM_PAGES;
  }
}

export function saveStoredCustomPages(pages: CustomPage[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CUSTOM_PAGES_STORAGE_KEY, JSON.stringify(pages));
    window.dispatchEvent(new CustomEvent('gb_pages_updated', { detail: pages }));
  } catch (e) {
    console.error('Failed to save Custom Pages to storage', e);
  }
}

export function getStoredPackageProductLinks(): PackageProductLink[] {
  if (typeof window === 'undefined') return DEFAULT_PACKAGE_PRODUCT_LINKS;
  try {
    const raw = localStorage.getItem(PACKAGE_PRODUCT_LINKS_KEY);
    if (!raw) return DEFAULT_PACKAGE_PRODUCT_LINKS;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse Package Product Links from storage', e);
    return DEFAULT_PACKAGE_PRODUCT_LINKS;
  }
}

export function saveStoredPackageProductLinks(links: PackageProductLink[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PACKAGE_PRODUCT_LINKS_KEY, JSON.stringify(links));
    window.dispatchEvent(new CustomEvent('gb_package_products_updated', { detail: links }));
  } catch (e) {
    console.error('Failed to save Package Product Links to storage', e);
  }
}
