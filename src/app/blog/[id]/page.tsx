'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Share2, 
  Bookmark, 
  CheckCircle2, 
  MapPin, 
  Compass, 
  ChevronRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap,
  HelpCircle,
  ShoppingBag
} from 'lucide-react';

interface ArticleData {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  heroImage: string;
  excerpt: string;
  toc: { id: string; title: string }[];
  sections: {
    id: string;
    title: string;
    content: string[];
    highlight?: string;
    image?: string;
    imageCaption?: string;
    bullets?: string[];
    backlink?: { label: string; url: string };
  }[];
  faqs?: { q: string; a: string }[];
}

const ARTICLES_DATABASE: Record<string, ArticleData> = {
  'ladakh-bike-trip-guide': {
    id: 'ladakh-bike-trip-guide',
    title: 'Ladakh Bike Trip Guide: Routes, Budget & Essential Tips for Riders',
    category: 'Travel Guide',
    date: 'Sunday, August 12, 2023',
    readTime: '8 min read',
    author: {
      name: 'Rohan Sharma',
      role: 'Senior Expedition Lead & Motorcycling Specialist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    },
    heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1400&auto=format&fit=crop',
    excerpt: 'The ultimate SEO guide for motorcycling across Khardung La, Pangong Tso, and the Trans-Himalayan passes. Discover route comparisons, exact budget breakdowns, required permits, and gear packing essentials.',
    toc: [
      { id: 'overview', title: '1. Why Ride to Ladakh? (The Ultimate Himalayan Dream)' },
      { id: 'routes-comparison', title: '2. Route Comparison: Manali-Leh vs Srinagar-Leh' },
      { id: 'best-time', title: '3. Best Season & Weather Guidelines' },
      { id: 'permits-inner-line', title: '4. Inner Line Permits (ILP) & Documentation 2026' },
      { id: 'ams-acclimatization', title: '5. Altitude Sickness (AMS) Prevention & Health Safety' },
      { id: 'best-bikes', title: '6. Choosing the Best Bike & Mechanical Gear' },
      { id: 'budget-breakdown', title: '7. Complete Trip Budget & Expense Breakdown' },
      { id: 'faqs', title: '8. Frequently Asked Questions (Rider FAQs)' },
    ],
    sections: [
      {
        id: 'overview',
        title: '1. Why Ride to Ladakh? (The Ultimate Himalayan Dream)',
        content: [
          'Riding a motorcycle through the Trans-Himalayan desert of Ladakh is a badge of honor for motorcycling enthusiasts worldwide. Spanning elevations above 11,000 feet, this adventure tests physical endurance, mental resilience, and riding skills against breathtaking mountain scenery.',
          'Whether you choose to navigate the hairpin bends of the Gata Loops, conquer Khardung La (17,582 ft), or watch the crystal waters of Pangong Tso change shade under the alpine sun, a Ladakh motorcycle expedition is a life-changing journey.'
        ],
        highlight: 'Go Banjara Tip: Planning ahead with proper gear and acclimatization guarantees an unforgettable Himalayan ride. Explore our curated Travel Packages for fully supported group motorcycle expeditions.',
        backlink: { label: 'Explore Go Banjara Himalayan Travel Packages', url: '/travel' }
      },
      {
        id: 'routes-comparison',
        title: '2. Route Comparison: Manali-Leh vs Srinagar-Leh',
        content: [
          'Two main highway arterial routes connect mainland India to Leh. Selecting the right route depends on your departure point, total travel days, and altitude tolerance.'
        ],
        bullets: [
          'Manali to Leh Highway (474 km): High-thrill, rapid altitude climb via Rohtang Tunnel, Keylong, Baralacha La (16,040 ft), Lachung La, and Tanglang La (17,480 ft). Ideal for experienced mountain riders seeking pure adventure.',
          'Srinagar to Leh Highway (418 km): Gradual altitude ascension via Sonamarg, Zoji La pass, Drass (the 2nd coldest inhabited place on earth), Kargil, and Magnetic Hill. Highly recommended for first-timers to minimize Acute Mountain Sickness (AMS).'
        ],
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop',
        imageCaption: 'The winding tarmac of the Srinagar-Leh highway cut into the rugged cliffside of Kashmir.',
        backlink: { label: 'View Srinagar to Leh Fixed Departure Itinerary', url: '/travel/srinagar-to-leh' }
      },
      {
        id: 'best-time',
        title: '3. Best Season & Weather Guidelines',
        content: [
          'The motorcycling season in Ladakh runs from June to October when mountain passes are cleared of heavy snowdrift.',
          'June to July: High excitement with snow walls along Baralacha La and water crossings (gushing nalas). Days are bright and cool.',
          'August: Monsoon period in lower Himalayas (Manali/Srinagar side), requiring extra caution on slippery mountain stretches.',
          'September to Mid-October: Pristine autumn weather with crystal-clear skies, vibrant fall colors in Nubra Valley, and optimal dry tarmac traction.'
        ]
      },
      {
        id: 'permits-inner-line',
        title: '4. Inner Line Permits (ILP) & Documentation 2026',
        content: [
          'All travelers visiting inner border areas—including Nubra Valley, Pangong Lake, Hanle, and Tso Moriri—must possess an official Inner Line Permit (ILP) issued by the LAHDC (Leh Autonomous Hill Development Council).',
          'You can apply for the official permit online directly at the Leh District Official Portal (leh.nic.in). Make sure to carry 6 to 8 hard copies of your ILP, original Driving License, Vehicle Registration (RC), Pollution Certificate (PUC), and valid Government Photo ID (Aadhaar or Passport).'
        ],
        highlight: 'Requirement Note: Self-driven non-local rental bikes (from Delhi or Manali) are NOT permitted inside Nubra Valley or Pangong. You must rent a Leh-registered motorcycle or travel with a licensed tour operator.',
        backlink: { label: 'Apply on Official Leh District Permit Portal (leh.nic.in)', url: 'https://leh.nic.in' }
      },
      {
        id: 'ams-acclimatization',
        title: '5. Altitude Sickness (AMS) Prevention & Health Safety',
        content: [
          'Leh is situated at 11,500 feet above sea level. Ascending rapidly into high altitudes reduces atmospheric oxygen pressure. Adequate rest during the first 36 hours in Leh is non-negotiable.',
          'Review the National Health Authority Advisory on AMS (nhm.gov.in) before riding to high mountain passes like Khardung La (17,582 ft).'
        ],
        bullets: [
          'Stay Hydrated: Drink 4 to 5 liters of fluids (water, ORS, herbal tea) daily.',
          'Pacing: Avoid heavy exertion or rapid climbing during the first two days.',
          'Medical Kit: Carry Diamox (after medical consultation), Painkillers, Oximeter, and Bandages.',
          'Oxygen Cylinder: Carry a portable oxygen canister for high passes like Khardung La or Chang La.'
        ],
        backlink: { label: 'Check Live Himalayan Road Status on BRO Official Site (bro.gov.in)', url: 'https://bro.gov.in' }
      },
      {
        id: 'best-bikes',
        title: '6. Choosing the Best Bike & Mechanical Gear',
        content: [
          'Choosing a reliable machine ensures smooth navigation through water crossings and steep gradients.',
          'Top Recommended Bikes: Royal Enfield Himalayan 450, BMW GS 310, Hero XPulse 200 4V, or Royal Enfield Classic 350.',
          'Essential Bike Spares: Clutch wire, accelerator cable, spare tube, puncture repair kit, foot pump, spark plug, and chain lube.'
        ],
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
        imageCaption: 'Riders pausing at a high mountain pass in Ladakh.',
        backlink: { label: 'Shop Essential Outdoor Gear & Bags at Go Banjara Shop', url: '/shop' }
      },
      {
        id: 'budget-breakdown',
        title: '7. Complete Trip Budget & Expense Breakdown',
        content: [
          'Here is an estimated budget breakdown per rider for a 10-Day Ladakh Bike Expedition:'
        ],
        bullets: [
          'Bike Rental: ₹1,500 – ₹2,200 / day (₹15,000 – ₹22,000 total)',
          'Fuel: Approx. ₹6,000 – ₹8,000 (depending on mileage and route)',
          'Accommodation & Food: ₹1,200 – ₹2,500 / day (₹12,000 – ₹25,000 total)',
          'Permits & Wildlife Fees: ₹800 – ₹1,200',
          'Total Estimated Expense: ₹35,000 to ₹55,000 per rider'
        ],
        backlink: { label: 'Check India Meteorological Department Weather Forecast (mausam.imd.gov.in)', url: 'https://mausam.imd.gov.in' }
      }
    ],
    faqs: [
      {
        q: 'Is a Ladakh bike trip suitable for beginners?',
        a: 'While beginners can undertake the trip, prior experience with long-distance highway riding and mountain hairpin bends is strongly recommended.'
      },
      {
        q: 'Can I take my personal private bike to Ladakh?',
        a: 'Yes! Personal bikes registered in your name (or family name with NOC) can be driven across all routes in Ladakh, including Nubra Valley and Pangong.'
      },
      {
        q: 'Which mobile network works best in Ladakh?',
        a: 'Only POSTPAID mobile connections work in Ladakh. BSNL offers the widest coverage across remote areas, followed by Jio and Airtel in Leh town.'
      }
    ]
  },

  /* ── CUSTOMER PERSPECTIVE STORY 1 ── */
  'customer-story-khardung-la-group': {
    id: 'customer-story-khardung-la-group',
    title: 'Conquering Khardung La & Pangong Tso: How 8 Strangers Became a Lifelong Go Banjara Tribe',
    category: 'Customer Stories',
    date: 'Wednesday, March 12, 2024',
    readTime: '7 min read',
    author: {
      name: 'Kiran Makwan',
      role: 'Verified Wanderer & Go Banjara Nomad',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    },
    heroImage: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1400&auto=format&fit=crop',
    excerpt: '“I flew out from Hyderabad to join the Srinagar to Leh group expedition as a solo rider with no mountain experience. 10 days later, I came back with 7 lifelong brothers, unforgettable campfire memories at Pangong Tso, and the sheer pride of standing at 17,582 feet.”',
    toc: [
      { id: 'the-decision', title: '1. The Solo Traveler’s Dilemma from Hyderabad' },
      { id: 'group-camaraderie', title: '2. Meeting the Go Banjara Convoy in Srinagar' },
      { id: 'khardung-la-climb', title: '3. The Summit Push: Khardung La at 17,582 Feet' },
      { id: 'pangong-night', title: '4. Campfires & Stargazing at Pangong Tso' },
      { id: 'key-takeaways', title: '5. Why Booking a Supported Group Expedition Changed Everything' },
    ],
    sections: [
      {
        id: 'the-decision',
        title: '1. The Solo Traveler’s Dilemma from Hyderabad',
        content: [
          'Riding through the Himalayas had been on my bucket list for over six years. But as a software engineer based in Hyderabad (Gachibowli), the logistics felt overwhelming: how would I arrange bike transport from Hyderabad, handle mountain breakdowns, or navigate altitude sickness alone?',
          'When I discovered Go Banjara’s Hyderabad fixed departure group, everything clicked. Their team coordinated my flight from Rajiv Gandhi International Airport (HYD) to Srinagar, walked me through altitude acclimatization, helped me select the Royal Enfield Himalayan 450, and equipped me with a Go Banjara Nomad Canvas duffel bag built for rugged luggage racks.'
        ],
        highlight: 'Hyderabad Traveler Insight: Booking a supported expedition with Go Banjara’s Hyderabad team gave me total peace of mind—knowing a backup vehicle with a dedicated mechanic and spare tires was trailing behind our convoy allowed us to focus purely on the ride.',
        backlink: { label: 'Explore Go Banjara Srinagar to Leh Fixed Departures', url: '/travel' }
      },
      {
        id: 'group-camaraderie',
        title: '2. Meeting the Go Banjara Convoy in Srinagar',
        content: [
          'Our group of 8 riders met over authentic Kashmiri Wazwan in Srinagar. We came from completely different cities—Hyderabad, Bengaluru, Mumbai, and Delhi—united by a passion for the open road.',
          'Under the guidance of our lead captain, Rohan, we established riding protocols, formation signals, and daily altitude health checks with pulse oximeters.'
        ],
        image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1200&auto=format&fit=crop',
        imageCaption: 'The Go Banjara group gather at Sonamarg before ascending the Zoji La pass.'
      },
      {
        id: 'khardung-la-climb',
        title: '3. The Summit Push: Khardung La at 17,582 Feet',
        content: [
          'On Day 4, we tackled the legendary ascent to Khardung La. As the tarmac gave way to loose gravel and sub-zero slush near South Pullu, the support mechanic tuned our carburetors and adjusted tire pressures on the spot.',
          'Reaching the top yellow summit sign, seeing the prayer flags fluttering in the freezing wind, and celebrating with high-fives and hot butter tea with my group was an emotion I will carry forever.'
        ],
        bullets: [
          'Direct flight & travel coordination from Hyderabad (HYD) to Srinagar basecamp',
          'Rode 1,200+ km of mountain roads across 5 high Himalayan passes',
          'Zero mechanical breakdowns left unassisted thanks to Go Banjara’s backup team',
          'Stayed in boutique homestays in Kargil, Leh, and Hunder Sand Dunes',
          'Lifetime friendship with 7 incredible fellow wanderers'
        ]
      },
      {
        id: 'pangong-night',
        title: '4. Campfires & Stargazing at Pangong Tso',
        content: [
          'Nothing compares to arriving at Pangong Tso as the afternoon sun turns the lake from turquoise to deep royal blue. That evening, wrapped in Go Banjara thermal fleece hoodies, our group sat around a roaring campfire singing old songs under the Milky Way canopy.'
        ],
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
        imageCaption: 'Pangong Tso lake illuminated under the high altitude night sky.'
      },
      {
        id: 'key-takeaways',
        title: '5. Why Booking a Supported Group Expedition Changed Everything',
        content: [
          'If you’re contemplating your first high-altitude mountain trip from Hyderabad or any major city, don’t let fear hold you back. Go Banjara doesn’t just book hotels—they build real communities of outdoor enthusiasts.'
        ],
        backlink: { label: 'Shop Authentic Go Banjara Travel Badges & Apparel', url: '/shop' }
      }
    ],
    faqs: [
      {
        q: 'How did you handle flight & bike logistics from Hyderabad?',
        a: 'Go Banjara coordinated our flights from Hyderabad (HYD) to Srinagar and arranged safe motorcycle delivery right to the Srinagar hotel basecamp.'
      },
      {
        q: 'Was it safe for solo travelers joining a group from Hyderabad?',
        a: '100% safe. More than half of our group joined solo from different cities like Hyderabad and Bengaluru, and by Day 2 everyone felt like family.'
      }
    ]
  },

  /* ── CUSTOMER PERSPECTIVE STORY 2 ── */
  'customer-story-spiti-valley-solo': {
    id: 'customer-story-spiti-valley-solo',
    title: 'From Corporate Burnout to Spiti Valley Monasteries: Priya’s 9-Day Journey with Go Banjara',
    category: 'Customer Stories',
    date: 'Thursday, April 18, 2024',
    readTime: '6 min read',
    author: {
      name: 'Priya Nair',
      role: 'Solo Backpacker & Go Banjara Community Member',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    },
    heroImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1400&auto=format&fit=crop',
    excerpt: '“After months of 60-hour corporate work weeks in Hyderabad’s HITEC City, I needed a complete reset. Booking Go Banjara’s Spiti Valley homestay circuit gave me the quiet, beauty, and female traveler safety I was searching for.”',
    toc: [
      { id: 'the-spark', title: '1. Escaping Hyderabad’s Corporate Grind' },
      { id: 'homestay-magic', title: '2. Authentic Spitian Homestays & Local Culture' },
      { id: 'key-monastery', title: '3. Tea Sessions with Monks at Key Monastery' },
      { id: 'dhankar-trek', title: '4. Trekking to Lake Dhankar at 13,500 Feet' },
      { id: 'my-advice', title: '5. My Advice for Solo Female Travelers' },
    ],
    sections: [
      {
        id: 'the-spark',
        title: '1. Escaping Hyderabad’s Corporate Grind',
        content: [
          'Working in tech in Hyderabad (HITEC City) often leaves little room for reflection. In March, I decided to take a leap and book my first solo journey to the cold desert of Spiti Valley.',
          'I flew from Hyderabad to Chandigarh, where Go Banjara’s trip coordinators met our small group of 6 like-minded slow travelers, led by an experienced female trip captain.'
        ],
        highlight: 'Priya’s Tip: Traveling with Go Banjara’s Hyderabad community means you get the freedom of solo exploration with the security of a verified local network.',
        backlink: { label: 'View Go Banjara Spiti Valley Packages', url: '/travel' }
      },
      {
        id: 'homestay-magic',
        title: '2. Authentic Spitian Homestays & Local Culture',
        content: [
          'Instead of commercial hotels, we stayed in traditional mud-brick homestays in Kibber and Langza. We ate fresh sea-buckthorn tea, homemade butter roti, and listened to village elders share ancient folklore around wood-fired bukhari stoves.'
        ],
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
        imageCaption: 'The snow-dusted peak of Mount Shilla towering over Langza village.'
      },
      {
        id: 'key-monastery',
        title: '3. Tea Sessions with Monks at Key Monastery',
        content: [
          'Sitting on the rooftop of 1,000-year-old Key Monastery overlooking the Spiti River while young monks chanted morning prayers was a spiritual awakening. It completely stripped away my corporate stress.'
        ]
      },
      {
        id: 'dhankar-trek',
        title: '4. Trekking to Lake Dhankar at 13,500 Feet',
        content: [
          'On Day 6, our group hiked up the steep trail from Dhankar Fort to the turquoise glacial waters of Dhankar Lake. Walking behind our local guide Tenzin, we reached the high-altitude lake just as the wind died down, creating a mirror reflection of the peaks.'
        ],
        bullets: [
          'Explored World’s Highest Post Office in Hikkim (sent 12 handwritten postcards)',
          'Trekking in high-altitude dry climate with zero phone network distraction',
          'Supported indigenous women-led homestay cooperatives in Kaza',
          'Equipped with Go Banjara weatherproof travel backpacks'
        ]
      },
      {
        id: 'my-advice',
        title: '5. My Advice for Solo Female Travelers',
        content: [
          'Don’t wait for friends’ schedules to align. Join a Go Banjara small group trip—it will redefine how you experience India.'
        ],
        backlink: { label: 'Explore Go Banjara Slow Travel Collections', url: '/travel' }
      }
    ],
    faqs: [
      {
        q: 'Is Spiti Valley safe for solo female travelers?',
        a: 'Extremely safe. Spitian people are gentle and warm. Traveling in a Go Banjara small group adds an extra layer of comfort.'
      },
      {
        q: 'What clothes did you pack for cold weather?',
        a: 'I packed 3 thermal base layers, a windproof fleece, heavy down jacket, woolen socks, and UV polarized sunglasses.'
      }
    ]
  },

  /* ── CUSTOMER PERSPECTIVE STORY 3 ── */
  'customer-story-meghalaya-root-bridges': {
    id: 'customer-story-meghalaya-root-bridges',
    title: 'Trekking 3,500 Steps to the Double Decker Root Bridge: Rohan’s Meghalaya Group Story',
    category: 'Customer Stories',
    date: 'Monday, May 20, 2024',
    readTime: '8 min read',
    author: {
      name: 'Amit Verma',
      role: 'Adventure Enthusiast & Go Banjara Nomad',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop',
    },
    heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1400&auto=format&fit=crop',
    excerpt: '“Hiking deep into the rainforests of Cherrapunji, crossing suspension bridges over crystal rivers, and swimming in hidden waterfalls. Here is how our Go Banjara group explored the abode of clouds.”',
    toc: [
      { id: 'into-the-clouds', title: '1. Entering the Abode of Clouds' },
      { id: 'the-3500-steps', title: '2. The 3,500-Step Descent to Nongriat' },
      { id: 'root-bridges', title: '3. Standing Under the Double Decker Root Bridge' },
      { id: 'dawki-waters', title: '4. Boating on the Crystal Waters of Dawki' },
      { id: 'final-thoughts', title: '5. Why Go Banjara Made the Expedition Unforgettable' },
    ],
    sections: [
      {
        id: 'into-the-clouds',
        title: '1. Entering the Abode of Clouds',
        content: [
          'Meghalaya has always intrigued me with its living architecture and mist-shrouded canyons. When Go Banjara announced their Northeast Monsoon Expedition, 10 of us signed up immediately.',
          'From Shillong’s vibrant cafe culture to the roaring Nohkalikai Falls in Sohra, every day revealed a new landscape.'
        ],
        highlight: 'Amit’s Highlight: Swimming in natural turquoise pools behind Wei Sawdong falls while our Khasi guides prepared fresh bamboo rice for the group.',
        backlink: { label: 'Check Go Banjara Northeast Packages', url: '/travel' }
      },
      {
        id: 'the-3500-steps',
        title: '2. The 3,500-Step Descent to Nongriat',
        content: [
          'The hike to Nongriat is a physical challenge: descending 3,500 steep concrete steps through dense jungle, crossing two high wire suspension bridges swaying over rushing turquoise rivers.'
        ],
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
        imageCaption: 'Crossing a wire suspension bridge deep in the Khasi hills.'
      },
      {
        id: 'root-bridges',
        title: '3. Standing Under the Double Decker Root Bridge',
        content: [
          'Reaching the Jingkieng Double Decker Root Bridge felt like stepping into an ancient fantasy world. Grown over 250 years by Khasi tribal ancestors using living Ficus elastica tree roots, it stands as a monument to human harmony with nature.'
        ]
      },
      {
        id: 'dawki-waters',
        title: '4. Boating on the Crystal Waters of Dawki',
        content: [
          'Our final stop was the Umngot River in Dawki. The water was so transparent that our wooden boats appeared to be floating on air over the pebble riverbed.'
        ],
        bullets: [
          'Hiked 3,500+ steps into deep rainforest canyons',
          'Swam in crystal-clear natural pools at Rainbow Falls',
          'Stayed in eco-bamboo cottages run by local Khasi families',
          'Equipped with Go Banjara waterproof gear and badges'
        ]
      },
      {
        id: 'final-thoughts',
        title: '5. Why Go Banjara Made the Expedition Unforgettable',
        content: [
          'Go Banjara’s focus on responsible eco-tourism and small group dynamics turns standard holidays into deep, transformative experiences.'
        ],
        backlink: { label: 'Shop Go Banjara Collectible Badges & Gear', url: '/shop' }
      }
    ],
    faqs: [
      {
        q: 'How difficult is the 3,500-step trek to Nongriat?',
        a: 'It requires moderate physical fitness. Going down takes 1.5 hours, and climbing back up takes 2 to 2.5 hours with rest stops.'
      },
      {
        q: 'What is the best month to visit Meghalaya?',
        a: 'October to April for crystal-clear Dawki river boating and pleasant treks; June to September for dramatic waterfall views.'
      }
    ]
  },

  /* ── 7-DAY LEH LADAKH ITINERARY 1 ── */
  '7-day-leh-ladakh-itinerary-1': {
    id: '7-day-leh-ladakh-itinerary-1',
    title: '7-Day Leh Ladakh Itinerary for First-Time Travelers',
    category: 'Tour Guide',
    date: 'Sunday, August 12, 2023',
    readTime: '5 min read',
    author: {
      name: 'Go Banjara Team',
      role: 'Destination Curators',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
    },
    heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1400&auto=format&fit=crop',
    excerpt: 'A perfectly paced 7-day day-by-day itinerary covering Leh Palace, Sham Valley, Khardung La, Nubra Valley, and Pangong Tso lake for first-time Himalayan travelers.',
    toc: [
      { id: 'day1', title: 'Day 1: Arrival in Leh & Mandatory Acclimatization' },
      { id: 'day2', title: 'Day 2: Sham Valley Exploration (Magnetic Hill & Sangam)' },
      { id: 'day3', title: 'Day 3: Leh to Nubra Valley via Khardung La (17,582 ft)' },
      { id: 'day4', title: 'Day 4: Nubra Valley to Pangong Tso Lake' },
      { id: 'day5', title: 'Day 5: Pangong Tso to Leh via Chang La' },
      { id: 'day6', title: 'Day 6: Monasteries & Souvenir Shopping in Leh' },
      { id: 'day7', title: 'Day 7: Departure from Leh Airport' },
    ],
    sections: [
      {
        id: 'day1',
        title: 'Day 1: Arrival in Leh & Mandatory Acclimatization',
        content: [
          'Fly into Kushok Bakula Rimpochee Airport (11,500 ft). Spend the entire day resting in your hotel to allow your body to adapt to low oxygen levels.'
        ],
        highlight: 'Crucial Rule: Do not climb stairs or exert yourself on Day 1. Drink plenty of warm fluids.',
        backlink: { label: 'Book Go Banjara Leh Acclimatization Package', url: '/travel' }
      },
      {
        id: 'day2',
        title: 'Day 2: Sham Valley Exploration (Magnetic Hill & Sangam)',
        content: [
          'Visit Hall of Fame, Magnetic Hill gravity spot, and Sangam (confluence of Zanskar & Indus Rivers). Stop at Gurudwara Pathar Sahib for prasad.'
        ]
      },
      {
        id: 'day3',
        title: 'Day 3: Leh to Nubra Valley via Khardung La (17,582 ft)',
        content: [
          'Drive across Khardung La, one of the highest motorable passes in the world. Descend into Nubra Valley and enjoy a Bactrian double-hump camel ride at Hunder Sand Dunes.'
        ]
      },
      {
        id: 'day4',
        title: 'Day 4: Nubra Valley to Pangong Tso Lake',
        content: [
          'Take the scenic Shyok River route to Pangong Lake. Check into deluxe lakeside camps and witness the sunset over the turquoise waters.'
        ]
      },
      {
        id: 'day5',
        title: 'Day 5: Pangong Tso to Leh via Chang La',
        content: [
          'Wake up for sunrise over Pangong Tso. Drive back to Leh crossing Chang La pass (17,590 ft), stopping at Thiksey Monastery.'
        ]
      },
      {
        id: 'day6',
        title: 'Day 6: Monasteries & Souvenir Shopping in Leh',
        content: [
          'Explore Shanti Stupa, Leh Palace, and local Tibetan markets for pashmina shawls, aprons, and Go Banjara outdoor badges.'
        ]
      },
      {
        id: 'day7',
        title: 'Day 7: Departure from Leh Airport',
        content: [
          'Transfer to Leh airport with unforgettable Himalayan memories.'
        ]
      }
    ],
    faqs: [
      {
        q: 'Are 7 days enough for a Leh trip?',
        a: 'Yes, 7 days is the optimal timeframe for a flight-based Leh itinerary covering all major sights without rushing.'
      }
    ]
  },

  /* ── 7-DAY LEH LADAKH ITINERARY 2 & ALIASES ── */
  '7-day-leh-ladakh-itinerary-2': {
    id: '7-day-leh-ladakh-itinerary-2',
    title: '7-Day Leh Ladakh Itinerary for First-Time Travelers',
    category: 'Most Popular',
    date: 'Sunday, August 12, 2023',
    readTime: '5 min read',
    author: {
      name: 'Go Banjara Team',
      role: 'Destination Curators',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
    },
    heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1400&auto=format&fit=crop',
    excerpt: 'Discover our top-rated 7-day Leh Ladakh travel circuit featuring Khardung La, Nubra Valley, Pangong Tso, and cultural monastries.',
    toc: [
      { id: 'overview', title: '1. Complete 7-Day Circuit Summary' },
      { id: 'highlights', title: '2. Top Trip Highlights & Permits' },
    ],
    sections: [
      {
        id: 'overview',
        title: '1. Complete 7-Day Circuit Summary',
        content: [
          'This popular 7-day itinerary balances adventure with proper rest, ensuring you visit Khardung La, Nubra Valley, and Pangong Lake safely.'
        ],
        backlink: { label: 'Explore Go Banjara Himalayan Travel Packages', url: '/travel' }
      },
      {
        id: 'highlights',
        title: '2. Top Trip Highlights & Permits',
        content: [
          'Ensure you register online for your Inner Line Permit (ILP) at leh.nic.in before embarking on the trip.'
        ]
      }
    ]
  },

  '7-day-leh-ladakh-first-time-1': {
    id: '7-day-leh-ladakh-first-time-1',
    title: '7-Day Leh Ladakh Itinerary for First-Time Travelers',
    category: 'Travel Guide',
    date: 'Sunday, August 12, 2023',
    readTime: '5 min read',
    author: {
      name: 'Go Banjara Team',
      role: 'Destination Curators',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
    },
    heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1400&auto=format&fit=crop',
    excerpt: 'Essential 7-day trip planning guide for first-time travelers to Ladakh.',
    toc: [{ id: 'guide', title: '1. First-Timer Travel Advice' }],
    sections: [
      {
        id: 'guide',
        title: '1. First-Timer Travel Advice',
        content: [
          'Pacing is everything in Ladakh. Take it slow, stay hydrated, and follow Go Banjara’s tested acclimatization advice.'
        ],
        backlink: { label: 'Check All Go Banjara Travel Packages', url: '/travel' }
      }
    ]
  },

  '7-day-leh-first-time-2': {
    id: '7-day-leh-first-time-2',
    title: '7-Day Leh Ladakh Itinerary for First-Time Travelers',
    category: 'Most Popular',
    date: 'Sunday, August 12, 2023',
    readTime: '5 min read',
    author: {
      name: 'Go Banjara Team',
      role: 'Destination Curators',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
    },
    heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1400&auto=format&fit=crop',
    excerpt: 'Detailed 7-day high altitude guide for exploring Ladakh.',
    toc: [{ id: 'guide', title: '1. Exploring Leh & Beyond' }],
    sections: [
      {
        id: 'guide',
        title: '1. Exploring Leh & Beyond',
        content: [
          'From high-altitude desert dunes to turquoise alpine lakes, discover why Leh is India’s ultimate mountain paradise.'
        ]
      }
    ]
  },

  /* ── ULTIMATE LADAKH TRAVEL GUIDE ── */
  'ultimate-ladakh-travel-guide': {
    id: 'ultimate-ladakh-travel-guide',
    title: 'Ultimate Ladakh Travel Guide: Plan Your Perfect Himalayan Adventure',
    category: 'Travel Guide',
    date: 'Sunday, August 12, 2023',
    readTime: '5 min read',
    author: {
      name: 'Rohan Sharma',
      role: 'Senior Expedition Lead',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    },
    heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1400&auto=format&fit=crop',
    excerpt: 'Comprehensive master guide for planning your trip to Leh Ladakh, covering transport, budget, packing, permits, and top sights.',
    toc: [
      { id: 'planning', title: '1. How to Plan Your Trip' },
      { id: 'gear', title: '2. Packing Essentials' },
    ],
    sections: [
      {
        id: 'planning',
        title: '1. How to Plan Your Trip',
        content: [
          'Planning a trip to Ladakh requires attention to acclimatization, permits, and season choices. June through September offers optimal weather.'
        ],
        backlink: { label: 'Explore Go Banjara Himalayan Travel Packages', url: '/travel' }
      },
      {
        id: 'gear',
        title: '2. Packing Essentials',
        content: [
          'Pack thermal base layers, windproof jacket, sturdy boots, sunglasses, power bank, and Go Banjara weatherproof travel gear.'
        ],
        backlink: { label: 'Shop Essential Outdoor Gear at Go Banjara Shop', url: '/shop' }
      }
    ]
  },

  /* ── LEH LADAKH TRAVEL GUIDE 2026 ── */
  'leh-ladakh-travel-guide-2026-1': {
    id: 'leh-ladakh-travel-guide-2026-1',
    title: 'Leh Ladakh Travel Guide 2026: Best Time, Places & Complete Trip Planning',
    category: 'Tour Guide',
    date: 'Sunday, August 12, 2023',
    readTime: '5 min read',
    author: {
      name: 'Go Banjara Team',
      role: 'Destination Curators',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
    },
    heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1400&auto=format&fit=crop',
    excerpt: 'Updated rules, digital ILP online permit guidelines, and road advisories for 2026 travelers to Ladakh.',
    toc: [{ id: 'updates', title: '1. 2026 Season Updates' }],
    sections: [
      {
        id: 'updates',
        title: '1. 2026 Season Updates',
        content: [
          'Inner Line Permits are now 100% digital via leh.nic.in. New paved roads connect Shyok to Hanle, making remote travel faster and smoother.'
        ],
        backlink: { label: 'Apply on Official Leh District Permit Portal (leh.nic.in)', url: 'https://leh.nic.in' }
      }
    ]
  },

  'leh-ladakh-travel-guide-2026-2': {
    id: 'leh-ladakh-travel-guide-2026-2',
    title: 'Leh Ladakh Travel Guide 2026: Best Time, Places & Complete Trip Planning',
    category: 'Most Popular',
    date: 'Sunday, August 12, 2023',
    readTime: '5 min read',
    author: {
      name: 'Go Banjara Team',
      role: 'Destination Curators',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
    },
    heroImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1400&auto=format&fit=crop',
    excerpt: '2026 travel trends and popular routes across Ladakh.',
    toc: [{ id: 'trends', title: '1. 2026 Route Trends' }],
    sections: [
      {
        id: 'trends',
        title: '1. 2026 Route Trends',
        content: [
          'Hanle astronomical observatory and Umling La (19,024 ft) have become top trending destinations for 2026 expeditions.'
        ]
      }
    ]
  },

  'ladakh-bike-trip-routes-2': {
    id: 'ladakh-bike-trip-routes-2',
    title: 'Ladakh Bike Trip Guide: Routes, Budget & Essential Tips for Riders',
    category: 'Tour Guide',
    date: 'Sunday, August 12, 2023',
    readTime: '5 min read',
    author: {
      name: 'Rohan Sharma',
      role: 'Senior Expedition Lead',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    },
    heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1400&auto=format&fit=crop',
    excerpt: 'Motorcycle route comparison and mechanical gear breakdown for Ladakh riders.',
    toc: [{ id: 'gear', title: '1. Mechanical Spares & Maintenance' }],
    sections: [
      {
        id: 'gear',
        title: '1. Mechanical Spares & Maintenance',
        content: [
          'Always carry spare clutch cables, foot pumps, puncture repair kits, and extra engine oil when riding remote mountain passes.'
        ]
      }
    ]
  },

  /* ── SPITI VALLEY ── */
  'spiti-valley-travel-guide': {
    id: 'spiti-valley-travel-guide',
    title: 'Spiti Valley Travel Guide: The Ultimate Road Trip Through Cold Desert',
    category: 'Travel Guide',
    date: 'Monday, September 4, 2023',
    readTime: '6 min read',
    author: {
      name: 'Priya Nair',
      role: 'Solo Backpacker & Destination Curator',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    },
    heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1400&auto=format&fit=crop',
    excerpt: 'Discover the mystical cold desert of Spiti Valley. Complete guide to Kaza, Key Monastery, Chandratal Lake, Hikkim highest post office, and homestays.',
    toc: [
      { id: 'overview', title: '1. Introduction to Spiti Valley' },
      { id: 'route', title: '2. Shimla vs Manali Route Comparison' },
      { id: 'places', title: '3. Top Places to Visit in Spiti' },
    ],
    sections: [
      {
        id: 'overview',
        title: '1. Introduction to Spiti Valley',
        content: [
          'Spiti Valley is a high-altitude cold desert mountain valley located in Himachal Pradesh. Known for ancient Tibetan monasteries, rugged gorges, and starry night skies, Spiti offers an authentic off-grid retreat.'
        ],
        highlight: 'Go Banjara Tip: Travel slow and stay in local village homestays in Kibber or Langza for an authentic cultural experience.',
        backlink: { label: 'Explore Go Banjara Spiti Travel Packages', url: '/travel' }
      },
      {
        id: 'route',
        title: '2. Shimla vs Manali Route Comparison',
        content: [
          'Shimla to Kaza via Kinnaur (Gradual Acclimatization): Open year-round. Passes through Sarahan, Kalpa, Nako, and Tabo.',
          'Manali to Kaza via Atal Tunnel & Kunzum Pass (High Adventure): Open June to October. Crosses Rohtang, Gramphu, and Kunzum La (14,931 ft).'
        ]
      },
      {
        id: 'places',
        title: '3. Top Places to Visit in Spiti',
        content: [
          'Key Monastery (1,000 year old cliffside monastery), Hikkim (World’s highest post office at 14,567 ft), Langza (Fossil village), and Chandratal Crescent Lake.'
        ],
        backlink: { label: 'Shop Weatherproof Duffel Bags for Spiti Road Trips', url: '/shop' }
      }
    ],
    faqs: [
      {
        q: 'When is the best time to visit Spiti Valley?',
        a: 'May to October for open roads and green valleys; January to March for the famous Winter Spiti Snow Leopard expedition.'
      }
    ]
  },

  /* ── KASHMIR GREAT LAKES ── */
  'kashmir-great-lakes-trek': {
    id: 'kashmir-great-lakes-trek',
    title: "Kashmir Great Lakes Trek: A Complete Trekker's Guide",
    category: 'Travel Guide',
    date: 'Tuesday, October 10, 2023',
    readTime: '8 min read',
    author: {
      name: 'Go Banjara Team',
      role: 'Trek Specialists',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
    },
    heroImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1400&auto=format&fit=crop',
    excerpt: 'Trek across 7 pristine alpine turquoise lakes in Kashmir. Complete guide covering route, fitness preparation, camps, and best month.',
    toc: [
      { id: 'overview', title: '1. Why KGL is India’s Prettiest Trek' },
      { id: 'itinerary', title: '2. Day-by-Day Route Overview' },
    ],
    sections: [
      {
        id: 'overview',
        title: '1. Why KGL is India’s Prettiest Trek',
        content: [
          'The Kashmir Great Lakes (KGL) trek takes you through pristine alpine meadows, snow-fed rivers, and 7 turquoise glacial lakes including Vishansar, Krishansar, Gadsar, Satsar, and Gangabal.'
        ],
        highlight: 'Go Banjara Tip: July to September is peak blooming season when the meadows of Sonamarg and Nichnai are covered in wild alpine flowers.',
        backlink: { label: 'View Go Banjara Kashmir Trekking Expeditions', url: '/travel' }
      },
      {
        id: 'itinerary',
        title: '2. Day-by-Day Route Overview',
        content: [
          'Starting at Shitkadi near Sonamarg, the 75-km trek crosses Nichnai Pass (13,500 ft) and Gadsar Pass (13,750 ft) before ending at Naranag ruins.'
        ]
      }
    ]
  },

  /* ── MANALI TO LEH HIGHWAY ── */
  'manali-to-leh-highway': {
    id: 'manali-to-leh-highway',
    title: 'Manali to Leh Highway: Everything You Need to Know Before You Go',
    category: 'Travel Guide',
    date: 'Friday, November 3, 2023',
    readTime: '6 min read',
    author: {
      name: 'Rohan Sharma',
      role: 'Motorcycling Specialist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    },
    heroImage: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1400&auto=format&fit=crop',
    excerpt: 'Detailed guide for driving or riding the iconic 474 km Manali-Leh highway, including high passes, night stops, and fuel stations.',
    toc: [{ id: 'highway', title: '1. Highway Stops & High Passes' }],
    sections: [
      {
        id: 'highway',
        title: '1. Highway Stops & High Passes',
        content: [
          'Covering 474 km across 5 high altitude passes (Rohtang, Baralacha La, Nakee La, Lachung La, Tanglang La), Jispa and Sarchu serve as popular night stopovers.'
        ],
        backlink: { label: 'Explore Supported Manali to Leh Expeditions', url: '/travel' }
      }
    ]
  },

  /* ── COORG ── */
  'coorg-travel-guide': {
    id: 'coorg-travel-guide',
    title: "Coorg Travel Guide: India's Scotland of the East",
    category: 'Travel Guide',
    date: 'Saturday, December 2, 2023',
    readTime: '5 min read',
    author: {
      name: 'Priya Nair',
      role: 'Slow Travel Curator',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    },
    heroImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1400&auto=format&fit=crop',
    excerpt: 'Escape to coffee plantations, misty hills, Abbey Falls, and Tibetan monasteries in Kodagu (Coorg).',
    toc: [{ id: 'coorg', title: '1. Highlights of Kodagu' }],
    sections: [
      {
        id: 'coorg',
        title: '1. Highlights of Kodagu',
        content: [
          'Coorg offers lush coffee estates, spice plantations, Tadiandamol peak trekking, and the serene Golden Temple at Namdroling Monastery Bylakuppe.'
        ],
        backlink: { label: 'Check South India Heritage Packages', url: '/travel' }
      }
    ]
  },

  /* ── RAJASTHAN ── */
  'rajasthan-road-trip': {
    id: 'rajasthan-road-trip',
    title: 'Rajasthan Road Trip: Forts, Deserts & Camel Safaris',
    category: 'Travel Guide',
    date: 'Sunday, January 7, 2024',
    readTime: '7 min read',
    author: {
      name: 'Go Banjara Team',
      role: 'Heritage Curators',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
    },
    heroImage: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1400&auto=format&fit=crop',
    excerpt: 'Explore the golden sands of Jaisalmer, blue alleys of Jodhpur, pink palaces of Jaipur, and serene lakes of Udaipur.',
    toc: [{ id: 'circuit', title: '1. The Royal Rajasthan Circuit' }],
    sections: [
      {
        id: 'circuit',
        title: '1. The Royal Rajasthan Circuit',
        content: [
          'A 10-day road trip through Jaipur, Pushkar, Jodhpur, Jaisalmer Sam Sand Dunes, and Udaipur offers an unforgettable glimpse into India’s royal history.'
        ],
        backlink: { label: 'View Rajasthan Heritage Packages', url: '/travel' }
      }
    ]
  },

  /* ── ANDAMAN ── */
  'andaman-islands-guide': {
    id: 'andaman-islands-guide',
    title: 'Andaman Islands: Hidden Beaches & Underwater Adventures',
    category: 'Travel Guide',
    date: 'Monday, February 5, 2024',
    readTime: '6 min read',
    author: {
      name: 'Go Banjara Team',
      role: 'Island Specialists',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
    },
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1400&auto=format&fit=crop',
    excerpt: 'White sand beaches, turquoise waters, scuba diving in Havelock, and historical walks in Port Blair.',
    toc: [{ id: 'andaman', title: '1. Island Hopping & Scuba Diving' }],
    sections: [
      {
        id: 'andaman',
        title: '1. Island Hopping & Scuba Diving',
        content: [
          'Visit Radhanagar Beach on Havelock Island (voted Asia’s best beach), scuba dive at Elephant Beach, and explore Ross Island coral reefs.'
        ],
        backlink: { label: 'Explore Andaman Island Packages', url: '/travel' }
      }
    ]
  }
};

const DEFAULT_ARTICLE: ArticleData = {
  id: 'general-guide',
  title: 'Himalayan Wanderlust: The Complete Travel & Packing Guide',
  category: 'Travel Guide',
  date: 'Sunday, August 12, 2023',
  readTime: '5 min read',
  author: {
    name: 'Go Banjara Team',
    role: 'Destination Curators',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
  },
  heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1400&auto=format&fit=crop',
  excerpt: 'Everything you need to know to plan a seamless, safe, and breathtaking journey across mountain landscapes.',
  toc: [
    { id: 'overview', title: '1. Destination Overview & Highlights' },
    { id: 'packing', title: '2. Essential Gear & Equipment List' },
    { id: 'safety', title: '3. Altitude & Safety Preparation' },
  ],
  sections: [
    {
      id: 'overview',
      title: '1. Destination Overview & Highlights',
      content: [
        'Traveling across mountain corridors is an unforgettable experience. From pristine alpine lakes to high altitude monastery trails, every corner offers a story of natural beauty and cultural heritage.',
        'Proper preparation is key to ensuring a smooth, rewarding adventure.'
      ],
      highlight: 'Go Banjara Tip: Pack light, respect local community guidelines, and leave no trace behind.'
    },
    {
      id: 'packing',
      title: '2. Essential Gear & Equipment List',
      content: [
        'Layering is crucial when traveling in high altitudes where temperatures fluctuate rapidly between day and night.'
      ],
      bullets: [
        'Thermal base layers & windproof fleece jackets',
        'Waterproof trekking boots with sturdy ankle support',
        'UV400 polarized sunglasses & high-SPF sunblock',
        'Portable power bank and thermal insulated water bottle'
      ]
    },
    {
      id: 'safety',
      title: '3. Altitude & Safety Preparation',
      content: [
        'Take your time to acclimatize when ascending above 8,000 feet. Hydrate regularly and listen to your body at every step of the trail.'
      ]
    }
  ]
};

export default function BlogPostDetail() {
  const params = useParams();
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  const rawId = (params?.id as string) || 'ladakh-bike-trip-guide';
  const article = ARTICLES_DATABASE[rawId] || {
    ...DEFAULT_ARTICLE,
    id: rawId,
    title: rawId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div 
      style={{
        width: '100%',
        background: 'rgba(255, 255, 255, 1)',
        minHeight: '100vh',
        fontFamily: 'Faktum, var(--font-sans), sans-serif',
        paddingBottom: '62px',
      }}
      className="w-full select-none"
    >
      {/* SEO Schema Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: article.title,
            description: article.excerpt,
            image: article.heroImage,
            author: {
              '@type': 'Person',
              name: article.author.name,
            },
            publisher: {
              '@type': 'Organization',
              name: 'Go Banjara',
              logo: {
                '@type': 'ImageObject',
                url: 'https://go-banjara.com/logo.png',
              },
            },
            datePublished: article.date,
          }),
        }}
      />

      {/* ── BREADCRUMB BAR (Matching Go Banjara Shop/Product Breadcrumb Spec) ── */}
      <div className="w-full bg-white border-b border-gray-200 py-3.5 px-6 md:px-[80px]">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-4 flex-wrap">
          <nav className="flex items-center gap-2 text-sm font-sans font-medium">
            <Link 
              href="/" 
              style={{
                fontFamily: "Faktum, sans-serif",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "20px",
                color: "rgba(141, 141, 141, 1)",
              }}
              className="hover:text-[#1D493E] transition-colors"
            >
              Home
            </Link>
            <span style={{ color: "rgba(141, 141, 141, 1)", fontSize: "14px" }}>›</span>
            <Link 
              href="/blog" 
              style={{
                fontFamily: "Faktum, sans-serif",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "20px",
                color: "rgba(141, 141, 141, 1)",
              }}
              className="hover:text-[#1D493E] transition-colors"
            >
              Blogs
            </Link>
            <span style={{ color: "rgba(141, 141, 141, 1)", fontSize: "14px" }}>›</span>
            <span 
              style={{
                fontFamily: "Faktum, sans-serif",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "20px",
                color: "rgba(141, 141, 141, 1)",
              }}
            >
              {article.category}
            </span>
            <span style={{ color: "rgba(141, 141, 141, 1)", fontSize: "14px" }}>›</span>
            <span 
              style={{
                fontFamily: "Faktum, sans-serif",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "20px",
                color: "rgba(29, 73, 62, 1)",
              }}
              className="font-semibold line-clamp-1 max-w-[280px] sm:max-w-none"
            >
              {article.title}
            </span>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-[#1D493E] border border-[#E5E0D5] hover:bg-[#FAF9F6] text-xs font-semibold transition cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied!' : 'Share Article'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── ARTICLE HEADER ── */}
      <header className="max-w-4xl mx-auto px-6 pt-10 pb-6 text-center">
        {/* Category Pill — Single-line Go Banjara Pill */}
        <div className="inline-flex items-center justify-center h-[26px] bg-[#FFEBE5] rounded-[4px] px-3.5 mb-4 mx-auto whitespace-nowrap">
          <span className="font-sans font-semibold text-[14px] leading-none tracking-[1.2px] text-[#FF623E] uppercase">
            {article.category}
          </span>
        </div>

        {/* Title — Native Go Banjara Serif Heading */}
        <h1 
          style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 600, color: 'rgba(43, 43, 43, 1)' }}
          className="text-3xl md:text-5xl leading-tight md:leading-snug mb-6"
        >
          {article.title}
        </h1>

        {/* Author & Meta Row */}
        <div className="flex items-center justify-center gap-4 text-xs md:text-sm text-[#2B2B2B]/70 font-medium border-y border-gray-200 py-3.5">
          <div className="flex items-center gap-2">
            <img 
              src={article.author.avatar} 
              alt={`${article.author.name} | Go Banjara Travel Specialist`}
              title={`${article.author.name} | Go Banjara Team`}
              className="w-7 h-7 rounded-full object-cover border border-gray-200"
            />
            <span className="font-semibold text-[#2B2B2B]">{article.author.name}</span>
          </div>
          <span>•</span>
          <span>{article.date}</span>
          <span>•</span>
          <span>{article.readTime}</span>
        </div>
      </header>

      {/* ── HERO COVER IMAGE WITH CAPTION ── */}
      <div className="max-w-5xl mx-auto px-6 mb-12">
        <div className="w-full h-[320px] md:h-[500px] rounded-[4px] overflow-hidden bg-gray-100 border border-gray-150">
          <img 
            src={article.heroImage} 
            alt={`${article.title} | Go Banjara Himalayan Travel Guide`}
            title={`${article.title} - Go Banjara Photography`}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-center text-xs text-[#2B2B2B]/60 italic mt-3 font-medium">
          Riding through the majestic mountain corridors of Ladakh. Photo: Go Banjara Explorers
        </p>
      </div>

      {/* ── ARTICLE CONTENT & SIDEBAR ── */}
      <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row gap-12 items-start">
        
        {/* Table of Contents Sidebar (Native Go Banjara Theme) */}
        {article.toc.length > 0 && (
          <aside 
            style={{
              background: 'rgba(255, 255, 255, 1)',
              border: '1px solid rgba(204, 204, 204, 1)',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
            className="w-full lg:w-80 p-6 sticky top-28 shrink-0 select-none"
          >
            <h4 
              style={{
                fontFamily: 'Fraunces, Georgia, serif',
                fontWeight: 600,
                fontSize: '20px',
                color: 'rgba(43, 43, 43, 1)',
                borderBottom: '1px solid rgba(204, 204, 204, 1)',
              }}
              className="pb-3 mb-4"
            >
              Table of Contents
            </h4>
            <nav className="space-y-2.5 text-sm font-medium">
              {article.toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  style={{
                    fontFamily: 'Faktum, var(--font-sans), sans-serif',
                    color: 'rgba(43, 43, 43, 0.8)',
                  }}
                  className="block py-1 hover:text-[#FF5A36] transition"
                >
                  {item.title}
                </a>
              ))}
            </nav>
          </aside>
        )}

        {/* Main Article Body */}
        <main className="flex-1 space-y-10 text-[#2B2B2B] leading-relaxed">
          {/* Excerpt Lead */}
          <p 
            style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'rgba(43, 43, 43, 1)' }}
            className="text-xl md:text-[22px] font-medium leading-relaxed italic border-l-4 border-[#1D493E] pl-4 py-1"
          >
            &ldquo;{article.excerpt}&rdquo;
          </p>

          {/* Sections */}
          {article.sections.map((section) => (
            <section key={section.id} id={section.id} className="space-y-4 pt-2">
              <h2 
                style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 600, color: 'rgba(43, 43, 43, 1)' }}
                className="text-2xl border-b border-gray-200 pb-2"
              >
                {section.title}
              </h2>

              {section.content.map((paragraph, pIdx) => (
                <p 
                  key={pIdx} 
                  style={{ fontFamily: 'Faktum, var(--font-sans), sans-serif', color: 'rgba(43, 43, 43, 0.9)' }}
                  className="text-base leading-relaxed font-normal"
                >
                  {paragraph}
                </p>
              ))}

              {/* Highlight Callout Box — Native Go Banjara Accent */}
              {section.highlight && (
                <div 
                  style={{
                    background: 'rgba(255, 235, 232, 0.5)',
                    borderLeft: '4px solid rgba(255, 98, 62, 1)',
                    borderRadius: '0 4px 4px 0',
                    color: 'rgba(43, 43, 43, 1)',
                  }}
                  className="p-5 my-5 text-sm font-semibold space-y-2"
                >
                  <p>{section.highlight}</p>
                  {section.backlink && (
                    section.backlink.url.startsWith('http') ? (
                      <a 
                        href={section.backlink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1D493E] underline hover:text-[#FF5A36] transition cursor-pointer"
                      >
                        <span>{section.backlink.label}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <Link 
                        href={section.backlink.url}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1D493E] underline hover:text-[#FF5A36] transition cursor-pointer"
                      >
                        <span>{section.backlink.label}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    )
                  )}
                </div>
              )}

              {/* Standalone Backlink if no highlight box */}
              {!section.highlight && section.backlink && (
                <div className="my-3">
                  {section.backlink.url.startsWith('http') ? (
                    <a 
                      href={section.backlink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1D493E] hover:text-[#FF5A36] transition cursor-pointer"
                    >
                      <span>{section.backlink.label}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#FF5A36]" />
                    </a>
                  ) : (
                    <Link 
                      href={section.backlink.url}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1D493E] hover:text-[#FF5A36] transition cursor-pointer"
                    >
                      <span>{section.backlink.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#1D493E]" />
                    </Link>
                  )}
                </div>
              )}

              {/* Bullets List */}
              {section.bullets && section.bullets.length > 0 && (
                <ul className="space-y-2.5 my-4">
                  {section.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2.5 text-sm font-medium text-[#2B2B2B]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1D493E] shrink-0 mt-2" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Inline Section Image */}
              {section.image && (
                <div className="space-y-2 my-6">
                  <div className="w-full h-80 rounded-[4px] overflow-hidden border border-gray-150 shadow-sm">
                    <img 
                      src={section.image} 
                      alt={`${section.title} | Go Banjara Travel Guide`}
                      title={`${section.title} - Go Banjara Photography`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {section.imageCaption && (
                    <p className="text-center text-xs text-[#2B2B2B]/60 italic font-medium">
                      {section.imageCaption}
                    </p>
                  )}
                </div>
              )}
            </section>
          ))}

          {/* FAQs Section — Matching Go Banjara Accordion Theme */}
          {article.faqs && article.faqs.length > 0 && (
            <section id="faqs" className="w-full pt-8 border-t border-gray-200">
              <div className="mb-6">
                <div className="w-[54px] h-[26px] flex items-center justify-center bg-[#FFEBE5] rounded-[4px] mb-2">
                  <span className="font-sans font-semibold text-[14px] leading-none tracking-[1.2px] text-[#FF623E] uppercase">
                    FAQ'S
                  </span>
                </div>
                <h2 className="font-serif font-semibold text-2xl md:text-[36px] text-[#2B2B2B]">
                  Frequently asked questions
                </h2>
              </div>

              <div className="w-full border-t border-gray-200 divide-y divide-gray-200">
                {article.faqs.map((faq, fIdx) => (
                  <div key={fIdx} className="py-5 text-left border-b border-gray-200 space-y-2">
                    <h4 className="font-sans font-medium text-lg md:text-[20px] text-[#2B2B2B]">
                      {faq.q}
                    </h4>
                    <p className="font-sans font-medium text-base md:text-[18px] text-[#8D8D8D] leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Author Signature Line — Minimal Native Style */}
          <div className="pt-8 border-t border-gray-200 flex items-center gap-4 mt-12">
            <img 
              src={article.author.avatar} 
              alt={`${article.author.name} | Go Banjara Travel Author`}
              title={`${article.author.name} | Go Banjara Team`}
              className="w-12 h-12 rounded-full object-cover border border-gray-200"
            />
            <div>
              <h4 style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 600, color: 'rgba(43, 43, 43, 1)' }} className="text-base">
                Written by {article.author.name}
              </h4>
              <p style={{ fontFamily: 'Faktum, var(--font-sans), sans-serif', color: 'rgba(43, 43, 43, 0.6)' }} className="text-xs font-medium">
                {article.author.role}
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* ── RELATED ARTICLES RECOMMENDATION (Go Banjara Home Grid Spec) ── */}
      <section className="max-w-6xl mx-auto px-6 mt-20 pt-12 border-t border-gray-200">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'rgba(43, 43, 43, 1)' }} className="text-2xl md:text-3xl font-semibold">
              Related Travel Guides
            </h3>
            <p className="text-xs md:text-sm text-[#2B2B2B]/70 font-medium mt-1">Explore more curated stories &amp; itineraries</p>
          </div>
          <Link 
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#1D493E] hover:text-[#FF5A36] transition cursor-pointer"
          >
            <span>View All Stories</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              id: '7-day-leh-ladakh-itinerary-1',
              title: '7-Day Leh Ladakh Itinerary for First-Time Travelers',
              date: 'August 12, 2023',
              readTime: '5 min read',
              image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop',
            },
            {
              id: 'spiti-valley-travel-guide',
              title: 'Spiti Valley Travel Guide: Cold Desert Adventure',
              date: 'September 4, 2023',
              readTime: '6 min read',
              image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&auto=format&fit=crop',
            },
            {
              id: 'kashmir-great-lakes-trek',
              title: "Kashmir Great Lakes Trek: Complete Trekker's Guide",
              date: 'October 10, 2023',
              readTime: '7 min read',
              image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&auto=format&fit=crop',
            },
          ].map((item) => (
            <Link key={item.id} href={`/blog/${item.id}`} className="w-full flex flex-col gap-3 group block text-left">
              <div className="relative w-full aspect-[16/10] overflow-hidden rounded-t-[4px] bg-gray-100 border border-gray-150">
                <img 
                  src={item.image} 
                  alt={`${item.title} | Go Banjara Blog`}
                  title={`${item.title} - Go Banjara Story`}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-serif font-semibold text-lg text-[#2B2B2B] group-hover:text-[#FF5A36] transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="font-sans font-medium text-xs text-[#2B2B2B]/60">
                  {item.date} • {item.readTime}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
