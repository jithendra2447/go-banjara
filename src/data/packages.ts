// Define the Package Type
export interface HolidayPackage {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  duration: string;
  durationDays: number;
  rating: number;
  ratingCount: number;
  hotelStars: string;
  hotelClass: '3' | '4' | '5';
  route: string;
  routeList: string[];
  description: string;
  inclusions: ('flights' | 'hotel' | 'transfers' | 'meals' | 'sightseeing' | string)[];
  highlights: string[];
  image: string;
  themes: ('Beach' | 'Mountain' | 'Romantic' | 'Adventure' | 'Heritage')[];
  destination: 'Kashmir' | 'Kerala' | 'Goa' | 'Rajasthan' | 'Himachal' | 'Andaman';
  detailsAvailable: boolean;
  link: string;
  category?: 'Weekend' | 'Trek' | 'Road Trip' | 'Camping';
  difficulty?: 'Easy' | 'Moderate' | 'Challenging';
  groupType?: string;
  nextDeparture?: string;
  startPoint?: string;
  isBestSeller?: boolean;

  // New detailed fields matching Srinagar-to-Leh design
  images?: string[];
  exclusions?: string[];
  packingList?: string[];
  faqs?: { q: string; a: string; }[];
  reviews?: { name: string; date: string; avatar: string; comment: string; rating: number; }[];
  guide?: { name: string; role: string; image: string; rating: number; trips: number; bio: string; };
  departures?: { value: string; label: string; seats: string; }[];
  itinerary?: {
    day: string;
    title: string;
    location: string;
    places: string[];
    offering: string;
    activities: string[];
    insiderTip: string;
    image?: string;
  }[];
}

// Holiday Packages Data
export const HOLIDAY_PACKAGES: HolidayPackage[] = [
  {
    id: 'pkg-kashmir-classic',
    name: 'Srinagar to Leh',
    price: 22900,
    originalPrice: 29500,
    duration: '8 Days / 7 Nights',
    durationDays: 8,
    rating: 5.0,
    ratingCount: 450,
    hotelStars: '4★ Premium Stays',
    hotelClass: '4',
    route: 'Srinagar → Kargil → Leh',
    routeList: ['Srinagar', 'Kargil', 'Leh'],
    description: 'Experience the iconic highway journey crossing high mountain passes and sapphire lakes.',
    inclusions: ['flights', 'hotel', 'transfers', 'meals', 'sightseeing'],
    highlights: [
      'Drive through Zoji La & Namika La passes',
      'Visit the ancient Alchi & Lamayuru monasteries',
      'Pangong Tso lake camping and stargazing',
      'Acclimatize and relax in Leh town'
    ],
    image: '/travel-leh-6.jpg',
    themes: ['Mountain', 'Romantic', 'Adventure'],
    destination: 'Kashmir',
    detailsAvailable: true,
    link: '/travel/srinagar-to-leh',
    category: 'Road Trip',
    difficulty: 'Moderate',
    groupType: 'Curated group Trip',
    nextDeparture: 'Aug, 2026',
    startPoint: 'Srinagar',
    isBestSeller: true,
    
    // Detailed fields
    images: [
      '/travel-leh-6.jpg',
      '/travel-leh-1.jpg',
      '/travel-leh-2.jpg',
      '/travel-leh-4.jpg',
      '/travel-leh-5.jpg',
      '/ladakh-hero.jpg'
    ],
    exclusions: [
      'Flights or travel expenses to Srinagar and from Leh',
      'Mandatory travel insurance (highly recommended)',
      'Lunch meals, personal snacks, and bottled mineral water',
      'Tips for guides, driver, hotel staff, and camel handlers',
      'Any personal expenses, souvenir shopping, or laundry services'
    ],
    packingList: [
      'Heavy fleece jackets, windbreaker, and thermal base layers',
      'Sturdy water-resistant hiking boots with good grip',
      'Polarized sunglasses and high SPF sunscreen',
      'Reusable thermos water bottle for hot water',
      'Personal altitude medication (like Diamox)',
      'High capacity power bank (extreme cold drains batteries)'
    ],
    faqs: [
      {
        q: 'What standard are the accommodations? (Hotels, homestays, tents)',
        a: 'We use premium 3-star boutique hotels in Srinagar and Leh, a comfortable local hotel in Kargil, deluxe desert tents in Hunder (Nubra), and high-quality lakeside dome tents with attached bathrooms at Pangong Tso.'
      },
      {
        q: 'Is AMS (Altitude Mountain Sickness) a concern?',
        a: 'Yes, because Leh is at 3,500m. We include 24 hours of rest in Leh on Day 4 and Day 5 for acclimatization. Our vehicles carry medical oxygen cylinders, and our coordinators are certified in Wilderness First Aid.'
      },
      {
        q: 'What is the group size for the trip?',
        a: 'We keep our groups small and intimate, typically between 8 to 12 travelers per batch, to ensure safety, comfort, and a personalized experience.'
      }
    ],
    reviews: [
      {
        name: 'Rohan Malhotra',
        date: 'July, 02nd, 2026',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80',
        comment: '“An absolute dream road trip! Driving through Zoji La was thrilling, and the view of Pangong Tso at sunset is something I will never forget. Vikram Aditya was the perfect guide—super knowledgeable and kept us safe all along.”',
        rating: 5
      },
      {
        name: 'Sarah Jenkins',
        date: 'June, 28th, 2026',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80',
        comment: '“Everything was incredibly well-organized. The acclimatization days in Leh were crucial and handled perfectly. Camping at Pangong Tso under a sky full of stars was magical. 10/10 recommendation!”',
        rating: 5
      }
    ],
    guide: {
      name: 'Vikram Aditya',
      role: 'Lead Expedition Coordinator',
      image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=120&h=120&fit=crop&q=60',
      rating: 5.0,
      trips: 143,
      bio: 'Vikram is a native Himalayan guide with 12+ years of experience leading high-altitude road trips and treks across Ladakh, Zanskar, and Kashmir. Certified in Wilderness Advanced First Aid (WAFA).'
    },
    departures: [
      { value: '2026-08-14', label: '14 Aug, 2026', seats: '4 Seats' },
      { value: '2026-08-21', label: '21 Aug, 2026', seats: '8 Seats' },
      { value: '2026-09-04', label: '4 Sep, 2026', seats: '12 Seats' }
    ],
    itinerary: [
      {
        day: 'Day 01',
        title: 'Arrival in Srinagar & Houseboat Check-in',
        location: 'Srinagar',
        places: ['Srinagar Airport', 'Dal Lake Houseboat'],
        offering: 'Arrive at Srinagar Airport. Transfer in a private heated luxury 4x4 SUV to your heritage cedar houseboat on Dal Lake. Enjoy a warm welcoming cup of Kashmiri Kahwa, followed by a relaxing sunset Shikara cruise.',
        activities: ['Private heated 4x4 SUV transfer', 'Heritage cedar houseboat stay', 'Welcome Kashmiri Kahwa session', 'Sunset Shikara cruise on Dal Lake'],
        insiderTip: 'Kashmiri Kahwa is brewed with green tea, saffron, cardamom, and cinnamon, served with crushed almonds. Enjoy it hot on the deck!',
        image: '/travel-leh-day1.jpg'
      },
      {
        day: 'Day 02',
        title: 'Srinagar Mughal Gardens & Royal Heritage',
        location: 'Srinagar',
        places: ['Shalimar Bagh', 'Nishat Bagh', 'Pari Mahal Ruins'],
        offering: 'Spend the day exploring Srinagar\'s royal heritage. Walk through the sprawling terraces of Shalimar and Nishat Mughal Gardens, and visit the historic Pari Mahal ruins overlooking the lake.',
        activities: ['Mughal Gardens entry tickets', 'Local guide & audio stories', 'Traditional Pheran costume photo shoot', 'Saffron tea & snacks in Srinagar old city'],
        insiderTip: 'Wear the traditional Kashmiri Pheran for your photo shoot at Pari Mahal for stunning contrast against the ancient stone ruins.',
        image: 'https://images.unsplash.com/photo-1598324421714-235f4980c749?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 03',
        title: 'Crossing Zoji La Pass to Kargil',
        location: 'Srinagar to Kargil',
        places: ['Sonamarg Meadows', 'Zoji La Pass', 'Drass War Memorial', 'Kargil'],
        offering: 'Leave Srinagar early for Kargil. Traverse the scenic Sonamarg meadows before scaling the thrilling Zoji La pass. Pay respect at the Drass War Memorial before checking into your Kargil hotel.',
        activities: ['High altitude highway driving', 'Base camp stop in Sonamarg', 'Visit Drass (second coldest inhabited place)', 'Overnight premium stay in Kargil'],
        insiderTip: 'Keep your camera ready as you approach Zoji La; the transformation from green valley to stark rocky mountains is dramatic.',
        image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 04',
        title: 'Lunar Landscapes & Monasteries to Leh',
        location: 'Kargil to Leh',
        places: ['Mulbekh Giant Buddha', 'Namika La', 'Lamayuru Moonland', 'Alchi', 'Leh'],
        offering: 'Drive from Kargil to Leh. Stop at Mulbekh to see the giant rock-cut Buddha, cross Namika La pass, marvel at the Moonland of Lamayuru, and visit the 1,000-year-old wood carving work at Alchi Monastery.',
        activities: ['Mulbekh Monastery visit', 'Lamayuru Moonland landscape walk', 'Guided tour of Alchi Monastery', 'Leh boutique hotel check-in'],
        insiderTip: 'Alchi is famous for its unique Kashmiri-style Buddhist wall paintings that date back to the 10th century. Flash photography is prohibited inside to protect them.',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 05',
        title: 'Leh Monasteries & Sunset Shanti Stupa',
        location: 'Leh',
        places: ['Leh Palace', 'Thiksey Monastery', 'Shanti Stupa', 'Hall of Fame'],
        offering: 'Explore Leh town and its surrounding culture. Climb the multi-story Thiksey Monastery, tour the ruins of Leh Palace, and watch the sunset paint the mountains pink from Shanti Stupa.',
        activities: ['Thiksey Monastery morning tour', 'Leh Palace entry ticket', 'Panoramic sunset at Shanti Stupa', 'Stroll through Leh Main Market'],
        insiderTip: 'Try to visit Thiksey early in the morning. Hearing the monks chant and blow the traditional copper horns is a mystical experience.',
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 06',
        title: 'Khardung La Pass to Nubra Valley',
        location: 'Leh to Nubra Valley',
        places: ['Khardung La Pass', 'Diskit Monastery', 'Hunder Sand Dunes'],
        offering: 'Scale one of the world\'s highest motorable roads at Khardung La (5,359m). Descent into the Nubra Valley to see the giant Buddha at Diskit and ride Bactrian camels in the sand dunes of Hunder.',
        activities: ['Khardung La summit photo stop', 'Diskit Monastery walk', 'Bactrian double-humped camel safari', 'Luxury desert camping stay'],
        insiderTip: 'Do not stay at the Khardung La summit for more than 15-20 minutes due to the thin air. Hydrate constantly with water and local butter tea.',
        image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 07',
        title: 'Nubra Valley to Turquoise Pangong Tso Lake',
        location: 'Nubra to Pangong Tso',
        places: ['Shyok River Road', 'Pangong Tso Lake', 'Lakeside Camp'],
        offering: 'Drive along the rugged Shyok River road to reach Pangong Tso Lake. Marvel at the lake shifting colors from turquoise to deep indigo, and sleep in lakeside camps under the clear sky.',
        activities: ['Scenic Shyok river highway drive', 'Lakeside sunset photography walk', 'Traditional Ladakhi dinner', 'Lakeside stargazing under clear skies'],
        insiderTip: 'Pangong Tso is situated at 4,250m. Nights are extremely cold even in summer, so keep your heavy thermal wear and windproof jacket handy.',
        image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 08',
        title: 'Return to Leh & Departure',
        location: 'Pangong to Leh & Out',
        places: ['Chang La Pass', 'Leh Main Bazaar', 'Leh Airport'],
        offering: 'Cross the Chang La pass back to Leh. Do last-minute shopping for local apricots, sea buckthorn juice, and prayer wheels, before transferring to Leh Airport for your flight.',
        activities: ['Chang La pass crossing', 'Apricot and souvenir shopping', 'Private airport departure transfer'],
        insiderTip: 'Leh airport is heavily secured. Arrive at least 2.5 hours early, and keep your cabin bags ready for security scanning.',
        image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=500&q=80'
      }
    ]
  },
  {
    id: 'pkg-kashmir-gulmarg',
    name: 'Gulmarg Skiing',
    price: 26900,
    originalPrice: 32000,
    duration: '7 Days / 6 Nights',
    durationDays: 7,
    rating: 4.9,
    ratingCount: 312,
    hotelStars: '5★ Luxury Chalet',
    hotelClass: '5',
    route: 'Srinagar → Gulmarg → Srinagar',
    routeList: ['Srinagar', 'Gulmarg Chalet', 'Srinagar Houseboat'],
    description: 'Ascend Asia\'s highest cable car to ski Apharwat Peak with expert coaching and cozy chalets.',
    inclusions: ['flights', 'hotel', 'transfers', 'meals', 'sightseeing'],
    highlights: [
      'Certified ski instruction on pristine powder slopes',
      'Phase 1 & 2 Gondola tickets to Apharwat Peak summit',
      'Apres-ski steam therapy, sauna & traditional Wazwan feast'
    ],
    image: 'https://images.unsplash.com/photo-1615966650071-855b15f29ad1?auto=format&fit=crop&w=800&q=80',
    themes: ['Mountain', 'Adventure'],
    destination: 'Kashmir',
    detailsAvailable: true,
    link: '/travel/package/pkg-kashmir-gulmarg',
    category: 'Camping',
    difficulty: 'Challenging',
    groupType: 'Curated group Trip',
    nextDeparture: 'Aug, 2026',
    startPoint: 'Srinagar',
    
    // Detailed fields
    images: [
      'https://images.unsplash.com/photo-1615966650071-855b15f29ad1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598324421714-235f4980c749?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595815729819-abdec427f70b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80'
    ],
    exclusions: [
      'Flights or travel expenses to Srinagar',
      'Ski gear insurance against damage',
      'Lunch meals and premium beverages',
      'Tips for ski coaches, guides, and hotel staff',
      'Personal shopping and laundry services'
    ],
    packingList: [
      'Fleece jackets, heavy winter coats, and thermal base layers',
      'Waterproof ski trousers and snow gloves',
      'UV sunglasses or ski goggles',
      'High SPF sunscreen & lip balm',
      'Woolen socks & thermal caps'
    ],
    faqs: [
      {
        q: 'Is ski coaching included for beginners?',
        a: 'Yes! We include 2 days of certified group ski instruction at the Gulmarg Ski slopes, which covers all basics and safety guidelines.'
      },
      {
        q: 'Are Gondola Phase 1 & 2 tickets pre-booked?',
        a: 'Yes, tickets for both phases are included in your package. Please keep your physical ID cards ready at the ticket counters.'
      }
    ],
    reviews: [
      {
        name: 'Aditya Vardhan',
        date: 'June, 15th, 2026',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80',
        comment: '“Go Banjāra nailed the itinerary. The blend of adventure skiing, Gondola tickets, and the traditional Wazwan feast made it unforgettable.”',
        rating: 5
      }
    ],
    guide: {
      name: 'Vikram Aditya',
      role: 'Lead Expedition Coordinator',
      image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=120&h=120&fit=crop&q=60',
      rating: 5.0,
      trips: 143,
      bio: 'Vikram coordinates high-altitude adventures and skiing excursions across Kashmir.'
    },
    departures: [
      { value: '2026-08-15', label: '15 Aug, 2026', seats: '5 Seats' },
      { value: '2026-08-25', label: '25 Aug, 2026', seats: '8 Seats' }
    ],
    itinerary: [
      {
        day: 'Day 01',
        title: 'Arrival & Snowy Gulmarg Pass Drive',
        location: 'Srinagar to Gulmarg',
        places: ['Srinagar Airport', 'Gulmarg Chalet'],
        offering: 'Private transfer in a 4x4 SUV equipped with mountain snow chains, check-in to a heated alpine chalet, and local ski gear selection and fitting session.',
        activities: ['4x4 SUV snow chain drive', 'Chalet check-in', 'Ski equipment fitting'],
        insiderTip: 'Let the ski boots sit in the heated room overnight to make them easier to slip on tomorrow morning.',
        image: 'https://images.unsplash.com/photo-1615966650071-855b15f29ad1?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 02',
        title: 'First Skiing Lesson & Slope Training',
        location: 'Gulmarg',
        places: ['Gulmarg Ski Resort', 'Beginner Slope 1'],
        offering: 'High-end ski equipment rental (skis, boots, poles), private certified ski instructor for 4 hours, and beginner drag-lift passes.',
        activities: ['4-hour ski coaching session', 'Basic balancing and snow walking training'],
        insiderTip: 'Do not lean backward when skiing downhill; lean forward over your shins to maintain control.',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 03',
        title: 'Gondola Ride to Kongdori Valley (Phase 1)',
        location: 'Gulmarg',
        places: ['Kongdori Station (2,600m)', 'Pine Forest Runs'],
        offering: 'Phase 1 Gondola ticket, intermediate ski guide, warm packed coffee thermos, and mountain slope safety briefing.',
        activities: ['Gondola Phase 1 ride', 'Pine forest trail walking', 'Intermediate slopes ski run'],
        insiderTip: 'Keep your ticket card safe in a sleeve; you need it scanned at multiple gates.',
        image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 04',
        title: 'Apharwat Peak Summit Gondola (Phase 2)',
        location: 'Gulmarg',
        places: ['Apharwat Peak (3,979m)', 'Summit Ridge'],
        offering: 'Ride the second phase of the Gondola to Apharwat Peak at nearly 4,000 meters. Explore the majestic frozen ridge overlooking the line of control.',
        activities: ['Phase 2 Gondola ascent', 'Guided ridge walk', 'Panoramic photography'],
        insiderTip: 'Due to the thin air at Apharwat Peak, walk slowly and take small sips of water regularly.',
        image: 'https://images.unsplash.com/photo-1598324421714-235f4980c749?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 05',
        title: 'Free Exploration & Snowshoe Trek',
        location: 'Gulmarg',
        places: ['Strawberry Valley', 'Baba Reshi Shrine'],
        offering: 'Spend the day at leisure. Join our optional guided snowshoe trek to Strawberry Valley or visit the local heritage shrine at Baba Reshi.',
        activities: ['Guided snowshoe trek', 'Baba Reshi shrine visit'],
        insiderTip: 'Try the traditional Kashmiri Harrisa dish for breakfast at a local cafe to stay warm all day.',
        image: 'https://images.unsplash.com/photo-1595815729819-abdec427f70b?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 06',
        title: 'Return to Srinagar & Houseboat Stays',
        location: 'Gulmarg to Srinagar',
        places: ['Tangmarg Pine Woods', 'Dal Lake Houseboat'],
        offering: 'Drive back to Srinagar and check in to a traditional hand-carved cedar houseboat. Relax with evening Shikara rides and a traditional Wazwan feast.',
        activities: ['Houseboat checking', 'Sunset Shikara ride', 'Traditional Wazwan banquet'],
        insiderTip: 'The sunset colors reflecting off the waters of Dal Lake are a photographer\'s paradise.',
        image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 07',
        title: 'Airport Departure Transfer',
        location: 'Srinagar Out',
        places: ['Srinagar Airport'],
        offering: 'After a cozy breakfast, transfer to Srinagar Airport for your return flight home, loaded with memories of snow-laden slopes.',
        activities: ['Airport transfer', 'Souvenir shopping assistance'],
        insiderTip: 'Security checks at Srinagar airport are rigorous. Make sure to arrive at least 3 hours before your flight.',
        image: '/travel-leh-day1.jpg'
      }
    ]
  },
  {
    id: 'pkg-kerala-4in1',
    name: 'Kerala Couple Spl',
    price: 24999,
    originalPrice: 39999,
    duration: '5 Days / 4 Nights',
    durationDays: 5,
    rating: 4.8,
    ratingCount: 142,
    hotelStars: '3★ / 4★ Premium',
    hotelClass: '4',
    route: 'Kochi → Munnar → Thekkady → Alleppey → Kochi',
    routeList: ['Kochi', 'Munnar', 'Thekkady', 'Alleppey'],
    description: 'A curated couple & family getaway exploring Munnar hills, Periyar wildlife, and Alleppey backwaters.',
    inclusions: ['hotel', 'transfers', 'meals', 'sightseeing'],
    highlights: [
      'Private AC Sedan transport with friendly driver',
      'Premium hotel stays in Munnar & Thekkady',
      'Houseboat Stay with all meals in Alleppey backwaters',
      'Spice plantation guided walk'
    ],
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
    themes: ['Romantic', 'Beach', 'Heritage'],
    destination: 'Kerala',
    detailsAvailable: true,
    link: '/travel/package/pkg-kerala-4in1',
    category: 'Road Trip',
    difficulty: 'Easy',
    groupType: 'Private Tour',
    nextDeparture: 'Aug, 2026',
    startPoint: 'Kochi',
    isBestSeller: true,
    
    // Detailed fields
    images: [
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517462964-21fdcec3f25b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1593693411515-c202e97424b6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    ],
    exclusions: [
      'Flights or train tickets to Kochi',
      'Entrance tickets to monuments or national parks',
      'Lunch meals, personal water, and drinks',
      'Tips for driver and hotel workers',
      'Optional activities (boating, elephant rides)'
    ],
    packingList: [
      'Lightweight cotton and linen outfits',
      'Comfortable walking shoes/sandals',
      'Sun hat and UV sunglasses',
      'High SPF sunscreen lotion',
      'Umbrella or light raincoat (tropical rain)',
      'Mosquito repellent spray'
    ],
    faqs: [
      {
        q: 'Is the houseboat stay private or shared?',
        a: 'The houseboat stay is 100% private for your family or couple booking, including a dedicated chef and captain.'
      },
      {
        q: 'What type of food is served on the houseboat?',
        a: 'Traditional Kerala meals (breakfast, lunch, and dinner) are cooked fresh on-board by your private chef. Vegetarian options are available upon request.'
      }
    ],
    reviews: [
      {
        name: 'Vipin Das',
        date: 'July, 05th, 2026',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80',
        comment: '“Unbelievable trip! Munnar was misty and cool, and the backwaters in Alleppey were serene. The private driver was extremely polite and drove safely.”',
        rating: 5
      }
    ],
    guide: {
      name: 'Anand Nair',
      role: 'Tropical Tour Director',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&fit=crop&q=60',
      rating: 4.8,
      trips: 186,
      bio: 'Anand is a seasoned Kerala travel director who knows every scenic viewpoint, tea shop, and local story across Munnar, Alleppey, and Thekkady.'
    },
    departures: [
      { value: '2026-08-10', label: '10 Aug, 2026', seats: 'Private slots' },
      { value: '2026-08-20', label: '20 Aug, 2026', seats: 'Private slots' }
    ],
    itinerary: [
      {
        day: 'Day 01',
        title: 'Arrival in Kochi & Drive to Munnar Hills',
        location: 'Kochi to Munnar',
        places: ['Kochi Airport', 'Cheeyappara Waterfalls', 'Munnar Tea Hills'],
        offering: 'Pick up from Kochi airport or station. Travel by private sedan up the winding Munnar hills, passing beautiful spice valleys and the spectacular Cheeyappara waterfalls.',
        activities: ['Airport pickup', 'Mountain scenic drive', 'Cheeyappara waterfall photo stop'],
        insiderTip: 'Keep a light jacket handy; temperature drops noticeably once you reach the altitude of Munnar.',
        image: 'https://images.unsplash.com/photo-1517462964-21fdcec3f25b?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 02',
        title: 'Munnar Tea Plantations & Eravikulam National Park',
        location: 'Munnar',
        places: ['Eravikulam National Park', 'Mattupetty Dam', 'Echo Point'],
        offering: 'Spend the day sightseeing in Munnar. Spot the rare Nilgiri Tahr at Eravikulam, take beautiful photos at Mattupetty Dam, and enjoy the natural echo at Echo Point.',
        activities: ['National Park safari', 'Munnar tea gardens walk', 'Lake boating excursion'],
        insiderTip: 'Book Eravikulam tickets online to skip the long entry queues.',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 03',
        title: 'Travel to Thekkady & Spice Gardens Guided Tour',
        location: 'Munnar to Thekkady',
        places: ['Periyar Wildlife Sanctuary', 'Spice Plantations'],
        offering: 'Drive to Thekkady, the spice center of Kerala. Take a guided walk through lush plantations of green cardamom, black pepper, and cinnamon, followed by an evening wildlife boat safari.',
        activities: ['Spice plantation guided tour', 'Periyar lake boat safari'],
        insiderTip: 'Buy authentic vanilla and cardamom directly from the farming cooperative shops in Thekkady.',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 04',
        title: 'Check-in to Private Alleppey Houseboat',
        location: 'Thekkady to Alleppey',
        places: ['Vembanad Lake backwaters', 'Alleppey Canal Grid'],
        offering: 'Transfer to Alleppey. Board your luxury private wood-and-bamboo houseboat. Sail along palm-fringed lagoons while your personal chef prepares a classic lunch and dinner.',
        activities: ['Houseboat cruise', 'Fresh toddy shop visit', 'Lagoon sunset cruise'],
        insiderTip: 'Request the chef to cook local Pearl Spot fish (Karimeen Pollichathu) for dinner—it is prepared in banana leaves and is delicious.',
        image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 05',
        title: 'Houseboat Check-out & Kochi Departure',
        location: 'Alleppey to Kochi',
        places: ['Fort Kochi Chinese Fishing Nets', 'Kochi Airport'],
        offering: 'Enjoy breakfast on board the houseboat. Disembark and drive back to Kochi. Take a brief heritage tour of Fort Kochi before transferring to the airport.',
        activities: ['Fort Kochi walk', 'Kochi airport drop-off'],
        insiderTip: 'Arrive at the fishing nets around noon to watch the fishermen haul in their catch.',
        image: 'https://images.unsplash.com/photo-1593693411515-c202e97424b6?auto=format&fit=crop&w=500&q=80'
      }
    ]
  },
  {
    id: 'pkg-kerala-classic3',
    name: 'Kerala Classic Tour',
    price: 19999,
    originalPrice: 29999,
    duration: '4 Days / 3 Nights',
    durationDays: 4,
    rating: 4.7,
    ratingCount: 98,
    hotelStars: '3★ Standard',
    hotelClass: '3',
    route: 'Kochi → Munnar → Alleppey → Kochi',
    routeList: ['Kochi', 'Munnar', 'Alleppey'],
    description: 'Classic 3-night private getaway covering Munnar hills and Alleppey houseboats. Perfect for couples and families looking for a short refreshing break.',
    inclusions: ['hotel', 'transfers', 'meals', 'sightseeing'],
    highlights: [
      'Private transport in AC sedan with local driver',
      'Munnar tea garden sightseeing and mist valleys',
      'Alleppey private houseboat stay with onboard dining'
    ],
    image: 'https://images.unsplash.com/photo-1517462964-21fdcec3f25b?auto=format&fit=crop&w=800&q=80',
    themes: ['Romantic', 'Beach'],
    destination: 'Kerala',
    detailsAvailable: true,
    link: '/travel/package/pkg-kerala-classic3',
    category: 'Weekend',
    difficulty: 'Easy',
    groupType: 'Private Tour',
    nextDeparture: 'Aug, 2026',
    startPoint: 'Kochi',
    
    // Detailed fields
    images: [
      'https://images.unsplash.com/photo-1517462964-21fdcec3f25b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1593693411515-c202e97424b6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    ],
    exclusions: [
      'Flights or train tickets',
      'National park entry and activity fees',
      'Lunch meals and premium beverages',
      'Tips for driver and hotel workers',
      'Souvenirs and personal laundry'
    ],
    packingList: [
      'Light comfortable cotton wear',
      'Flat walking shoes or sandals',
      'Sun visor and sunglasses',
      'Sunscreen lotion',
      'Compact umbrella'
    ],
    faqs: [
      {
        q: 'Is this tour suitable for senior citizens?',
        a: 'Yes! It is a private, relaxed trip with minimal walking and direct door-to-door vehicle transfers, making it very comfortable for seniors.'
      }
    ],
    reviews: [
      {
        name: 'Manoj Kumar',
        date: 'June, 22nd, 2026',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80',
        comment: '“Extremely cozy and pleasant. We had a great time in Munnar and the houseboat was very clean. Driver was friendly.”',
        rating: 4.7
      }
    ],
    guide: {
      name: 'Anand Nair',
      role: 'Tropical Tour Director',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&fit=crop&q=60',
      rating: 4.8,
      trips: 186,
      bio: 'Anand coordinates family retreats and honeymoon getaways across Kerala.'
    },
    departures: [
      { value: '2026-08-12', label: '12 Aug, 2026', seats: 'Private slots' }
    ],
    itinerary: [
      {
        day: 'Day 01',
        title: 'Kochi Arrival & Drive to Munnar Tea Country',
        location: 'Kochi to Munnar',
        places: ['Kochi Airport', 'Valara Waterfalls', 'Munnar Town'],
        offering: 'Pick up from Kochi. Scenic climb to Munnar hill station through valleys and waterfalls.',
        activities: ['Scenic valley drive', 'Waterfalls photography'],
        insiderTip: 'Grab a hot cup of cardamom tea at the Valara falls viewpoint shop.',
        image: 'https://images.unsplash.com/photo-1517462964-21fdcec3f25b?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 02',
        title: 'Munnar Valleys & Tea Museum Heritage',
        location: 'Munnar',
        places: ['Tea Museum', 'Eravikulam National Park', 'Mattupetty Lake'],
        offering: 'Tour the heritage tea museum, stroll through scenic tea rows, and explore the wildlife park.',
        activities: ['Tea museum tour', 'Tea garden walk', 'Eravikulam safari'],
        insiderTip: 'The Tea Museum sells rare green tea varieties. Perfect for buying gifts.',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 03',
        title: 'Alleppey Private Backwaters Houseboat Stay',
        location: 'Munnar to Alleppey',
        places: ['Vembanad Lake canals', 'Houseboat Deck'],
        offering: 'Transfer to Alleppey. Board your wood-crafted private houseboat. Enjoy tropical backwater sailing with all meals prepared on-board.',
        activities: ['Houseboat cruise', 'Sunset viewing on deck', 'Traditional dining'],
        insiderTip: 'Sit on the open front deck during sunset; the reflections on the canal are gorgeous.',
        image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 04',
        title: 'Checkout & Kochi Transfer Out',
        location: 'Alleppey to Kochi',
        places: ['Lulu Mall Kochi', 'Kochi Airport'],
        offering: 'Enjoy morning houseboat cruising, check out, and transfer to Kochi airport with shopping stops.',
        activities: ['Souvenir shopping', 'Airport departure drop-off'],
        insiderTip: 'Buy banana chips fried in coconut oil at local shops on the way to the airport.',
        image: 'https://images.unsplash.com/photo-1593693411515-c202e97424b6?auto=format&fit=crop&w=500&q=80'
      }
    ]
  },
  {
    id: 'pkg-kerala-highlights',
    name: 'Kerala Highlights',
    price: 29999,
    originalPrice: 39999,
    duration: '6 Days / 5 Nights',
    durationDays: 6,
    rating: 4.9,
    ratingCount: 186,
    hotelStars: '4★ Premium',
    hotelClass: '4',
    route: 'Kochi → Munnar → Thekkady → Alleppey → Kochi',
    routeList: ['Kochi', 'Munnar', 'Thekkady', 'Alleppey'],
    description: 'Comprehensive 6-day highlight tour of Kerala. Take in the colonial charm of Fort Kochi, tea estates of Munnar, spice gardens of Thekkady, and serene backwater houseboats.',
    inclusions: ['hotel', 'transfers', 'meals', 'sightseeing'],
    highlights: [
      'Premium accommodations with breakfast included',
      'Private AC SUV for transfers and tours',
      'Guided spice plantation walk in Thekkady',
      'Heritage tour of colonial Fort Kochi'
    ],
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    themes: ['Romantic', 'Adventure', 'Heritage'],
    destination: 'Kerala',
    detailsAvailable: true,
    link: '/travel/package/pkg-kerala-highlights',
    category: 'Road Trip',
    difficulty: 'Easy',
    groupType: 'Private Tour',
    nextDeparture: 'Aug, 2026',
    startPoint: 'Kochi',
    
    // Detailed fields
    images: [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517462964-21fdcec3f25b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1593693411515-c202e97424b6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    ],
    exclusions: [
      'Flights or train tickets to Kochi',
      'Entry tickets, safari tickets, and boating tickets',
      'Lunch meals and dinner meals at hotels',
      'Tips for driver and hotel workers',
      'Personal shopping and laundry'
    ],
    packingList: [
      'Lightweight cotton shirts & trousers',
      'Sturdy sneakers or sandals',
      'Sunglasses, sunscreen, & sun hat',
      'Umbrella or light windproof jacket',
      'Mosquito repellent cream'
    ],
    faqs: [
      {
        q: 'What is included in the Kochi heritage tour?',
        a: 'We cover the Chinese Fishing Nets, Santa Cruz Cathedral Basilica, St. Francis Church, Jewish Town, and the Dutch Palace.'
      }
    ],
    reviews: [
      {
        name: 'Pradeep Shenoy',
        date: 'May, 18th, 2026',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80',
        comment: '“The absolute best tour in Kerala. 6 days gave us enough time to relax and explore Munnar and the houseboats. Strongly recommend.”',
        rating: 5
      }
    ],
    guide: {
      name: 'Anand Nair',
      role: 'Tropical Tour Director',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&fit=crop&q=60',
      rating: 4.8,
      trips: 186,
      bio: 'Anand knows all the hidden viewpoints and tea-stalls in Munnar.'
    },
    departures: [
      { value: '2026-08-08', label: '8 Aug, 2026', seats: 'Private slots' }
    ],
    itinerary: [
      {
        day: 'Day 01',
        title: 'Arrive in Kochi & Historic Fort Kochi Tour',
        location: 'Kochi',
        places: ['Fort Kochi', 'Dutch Palace', 'Jewish Synagogue'],
        offering: 'Pick up from Kochi airport. Explore colonial Fort Kochi, check out the Dutch Palace, Jewish Synagogue, and view Chinese Fishing nets.',
        activities: ['Kochi heritage tour', 'Monuments walking walk'],
        insiderTip: 'Visit the small spice shops in Jewish town for high-quality spices.',
        image: 'https://images.unsplash.com/photo-1593693411515-c202e97424b6?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 02',
        title: 'Drive to Munnar & Tea Estate Check-in',
        location: 'Kochi to Munnar',
        places: ['Cheeyappara Falls', 'Munnar Tea Estates'],
        offering: 'Drive up the winding Western Ghats through pine valleys. Check in to a premium tea estate resort.',
        activities: ['Scenic hill driving', 'Resort welcome dinner'],
        insiderTip: 'Munnar gets chilly at night. Bring a light pullover or shawl.',
        image: 'https://images.unsplash.com/photo-1517462964-21fdcec3f25b?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 03',
        title: 'Munnar Sightseeing & Kundala Lake Boating',
        location: 'Munnar',
        places: ['Eravikulam National Park', 'Kundala Lake', 'Echo Point'],
        offering: 'Visit Eravikulam to spot the Nilgiri Tahr. Enjoy pedal-boating on Kundala Lake and hear your voice echo at Echo Point.',
        activities: ['National Park safari', 'Kundala lake boating'],
        insiderTip: 'Row-boating at Kundala Lake during the afternoon is highly romantic.',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 04',
        title: 'Travel to Thekkady & Wildlife Boat Cruise',
        location: 'Munnar to Thekkady',
        places: ['Periyar Sanctuary', 'Cardamom Plantations'],
        offering: 'Travel to Thekkady. Take a wildlife boat cruise on Periyar Lake and watch elephants bathing in the river.',
        activities: ['Periyar boat cruise', 'Spice garden tour'],
        insiderTip: 'Stand on the upper deck of the Periyar boat for the best views of wild birds.',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 05',
        title: 'Alleppey Private Backwaters Houseboat',
        location: 'Thekkady to Alleppey',
        places: ['Alleppey canals', 'Vembanad Lake'],
        offering: 'Board your private luxury houseboat and cruise the tranquil backwaters of Vembanad Lake. Traditional Kerala lunch and dinner served on deck.',
        activities: ['Houseboat cruising', 'Coconut water sipping', 'Traditional dinner'],
        insiderTip: 'The sunset over Vembanad Lake is truly spectacular. Keep your camera ready.',
        image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 06',
        title: 'Disembark & Transfer to Kochi Airport',
        location: 'Alleppey to Kochi',
        places: ['Kochi Airport'],
        offering: 'Checkout from houseboat after breakfast and transfer to Kochi airport for departure flight.',
        activities: ['Airport transfer drop-off'],
        insiderTip: 'Get some fresh jackfruit chips packed to eat on the flight.',
        image: 'https://images.unsplash.com/photo-1593693411515-c202e97424b6?auto=format&fit=crop&w=500&q=80'
      }
    ]
  },
  {
    id: 'pkg-kerala-vibe',
    name: 'Kerala Vibe Special',
    price: 24999,
    originalPrice: 39999,
    duration: '5 Days / 4 Nights',
    durationDays: 5,
    rating: 4.8,
    ratingCount: 112,
    hotelStars: '3★ / 4★ Premium',
    hotelClass: '4',
    route: 'Thiruvananthapuram → Kovalam → Varkala → Alleppey',
    routeList: ['Thiruvananthapuram', 'Kovalam', 'Varkala', 'Alleppey'],
    description: 'Soak in the southern vibes of Kerala starting from Thiruvananthapuram. Explore Kovalam and Varkala beaches and wind down in the backwaters of Alleppey.',
    inclusions: ['hotel', 'transfers', 'meals'],
    highlights: [
      'Beachfront resort stays in Kovalam & Varkala',
      'Trivandrum heritage sightseeing tour',
      'Alleppey backwaters day cruise with lunch'
    ],
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
    themes: ['Romantic', 'Beach'],
    destination: 'Kerala',
    detailsAvailable: true,
    link: '/travel/package/pkg-kerala-vibe',
    category: 'Weekend',
    difficulty: 'Easy',
    groupType: 'Private Tour',
    nextDeparture: 'Aug, 2026',
    startPoint: 'Trivandrum',
    
    // Detailed fields
    images: [
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517462964-21fdcec3f25b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1593693411515-c202e97424b6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80'
    ],
    exclusions: [
      'Flights or train tickets to Trivandrum',
      'Activity charges (scuba, surfing, temple entry)',
      'Lunch and dinner meals at hotels',
      'Tips for driver and local helpers',
      'Personal items and drinks'
    ],
    packingList: [
      'Comfortable beachwear and cotton shirts',
      'Sandals or flip-flops',
      'Sun hat and UV sunglasses',
      'Sunscreen cream & mosquito spray'
    ],
    faqs: [
      {
        q: 'Is temple entry included in Trivandrum?',
        a: 'We cover the vehicle transfers. Entry dress codes must be followed (sari/dhoti) for Sree Padmanabhaswamy Temple.'
      }
    ],
    reviews: [
      {
        name: 'Ramesh Krishnan',
        date: 'July, 01st, 2026',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80',
        comment: '“Amazing beaches! Varkala cliff resort views were beautiful and the Alleppey day cruise was peaceful. Great private sedan transfers.”',
        rating: 4.8
      }
    ],
    guide: {
      name: 'Anand Nair',
      role: 'Tropical Tour Director',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&fit=crop&q=60',
      rating: 4.8,
      trips: 186,
      bio: 'Anand is a seasoned Kerala travel coordinator.'
    },
    departures: [
      { value: '2026-08-18', label: '18 Aug, 2026', seats: 'Private slots' }
    ],
    itinerary: [
      {
        day: 'Day 01',
        title: 'Trivandrum Arrival & Kovalam Beach Resort',
        location: 'Trivandrum to Kovalam',
        places: ['Trivandrum Airport', 'Kovalam Beach Resort'],
        offering: 'Pick up from Trivandrum. Drive to Kovalam and check in to your premium beachfront resort. Spend the evening walking on the sandy beach.',
        activities: ['Beach resort check-in', 'Lighthouse beach walk'],
        insiderTip: 'Walk to the red-and-white lighthouse at Kovalam beach for a stunning sunset view.',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 02',
        title: 'Trivandrum Heritage Tour & Padmanabhaswamy Temple',
        location: 'Kovalam',
        places: ['Sree Padmanabhaswamy Temple', 'Napier Museum'],
        offering: 'Take a heritage tour of Trivandrum, visiting the famous Padmanabhaswamy Temple and Napier Museum.',
        activities: ['Temple architectural walk', 'Museum tour'],
        insiderTip: 'Traditional attire (dhoti for men, sari/salwar for women) is mandatory inside the Padmanabhaswamy temple.',
        image: 'https://images.unsplash.com/photo-1593693411515-c202e97424b6?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 03',
        title: 'Drive to Varkala & Cliff Sunset Walks',
        location: 'Kovalam to Varkala',
        places: ['Varkala Cliff', 'Papanasam Beach'],
        offering: 'Drive to Varkala. Check in to a resort on the edge of Varkala Cliff. Walk along the cliff overlooking the Arabian Sea and dine at local cafes.',
        activities: ['Cliff walking', 'Cafe dining'],
        insiderTip: 'Dine at the Clafouti cafe on Varkala cliff for amazing wood-fired pizzas.',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 04',
        title: 'Alleppey Backwaters Day Cruise & Canal Sailing',
        location: 'Varkala to Alleppey',
        places: ['Alleppey canals', 'Day Houseboat'],
        offering: 'Drive to Alleppey. Board a houseboat for a private 5-hour day cruise with on-board lunch, sailing through palm-lined backwaters.',
        activities: ['5-hour private backwater cruise', 'Kerala lunch on deck'],
        insiderTip: 'Grab a fresh coconut directly from a lakeside stall while sailing.',
        image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 05',
        title: 'Departure drop at Trivandrum Airport',
        location: 'Alleppey to Trivandrum',
        places: ['Trivandrum Airport'],
        offering: 'Checkout and drive back to Trivandrum airport/station for departure.',
        activities: ['Airport departure drop-off'],
        insiderTip: 'Leave Alleppey early to avoid highway traffic near Kollam.',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=500&q=80'
      }
    ]
  },
  {
    id: 'pkg-goa-beach',
    name: 'Goa Beach Escape',
    price: 12500,
    originalPrice: 17500,
    duration: '5 Days / 4 Nights',
    durationDays: 5,
    rating: 4.7,
    ratingCount: 220,
    hotelStars: '3★ Beachside Resort',
    hotelClass: '3',
    route: 'Panaji → Candolim Beach (2N) → Palolem Beach (2N)',
    routeList: ['Panaji Heritage Walk', 'Candolim Beach (2N)', 'Palolem Beach (2N)'],
    description: 'Immerse yourself in the old-world Portuguese charm of Panaji\'s Latin Quarter before lounging on the golden sands of Candolim and Palolem. Enjoy scuba diving, fresh seafood, and tranquil beach sunrises.',
    inclusions: ['hotel', 'transfers', 'meals'],
    highlights: [
      'Historical Latin Quarter (Fontainhas) guided walking tour',
      'Scuba diving & snorkeling lesson at Grand Island',
      'Lakeside sunset drinks & traditional Goan fish curry cooking class'
    ],
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    themes: ['Beach', 'Adventure'],
    destination: 'Goa',
    detailsAvailable: true,
    link: '/travel/package/pkg-goa-beach',
    category: 'Weekend',
    difficulty: 'Easy',
    groupType: 'Curated group Trip',
    nextDeparture: 'Sep, 2026',
    startPoint: 'Panaji',
    
    // Detailed fields
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1614082242765-7c99bc0f3df8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=800&q=80'
    ],
    exclusions: [
      'Flights or train tickets to Goa',
      'Extra water sports charges not specified',
      'Personal beverages and dinners',
      'Tips for guides and boat operators',
      'Laundry and camera entry fees'
    ],
    packingList: [
      'Light beachwear, shorts & swimwear',
      'Sandals, flip-flops, & light sneakers',
      'Sunglasses and high-factor sunscreen',
      'Waterproof phone case',
      'Mosquito repellent'
    ],
    faqs: [
      {
        q: 'Is scuba diving safe for non-swimmers?',
        a: 'Yes, our certified PADI divers guide you individually in shallow waters with life jackets, making it completely safe for non-swimmers.'
      }
    ],
    reviews: [
      {
        name: 'Karan Sharma',
        date: 'July, 08th, 2026',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80',
        comment: '“Goa was beautiful! The Fontainhas walking tour felt like being in Portugal. Loved Grand Island scuba diving.”',
        rating: 4.7
      }
    ],
    guide: {
      name: 'Anand Nair',
      role: 'Tropical Tour Director',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&fit=crop&q=60',
      rating: 4.8,
      trips: 186,
      bio: 'Anand knows all the beach side shacks and heritage spots across Goa.'
    },
    departures: [
      { value: '2026-09-05', label: '5 Sep, 2026', seats: '10 Seats' }
    ],
    itinerary: [
      {
        day: 'Day 01',
        title: 'Arrival in Panaji & Fontainhas Heritage Walk',
        location: 'Panaji',
        places: ['Mopa Airport', 'Fontainhas Latin Quarter'],
        offering: 'Pick up from Goa Airport. Check in to your heritage stay in Panaji. Join our evening guided walk through the colorful Portuguese houses of Fontainhas.',
        activities: ['Airport pickup', 'Guided heritage walk', 'Welcome Goan dinner'],
        insiderTip: 'Dine at Viva Panjim in Fontainhas for the most authentic pork vindaloo or fish recheado.',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 02',
        title: 'Grand Island Scuba & Snorkeling Excursion',
        location: 'Grand Island',
        places: ['Grand Island Reefs', 'Coco Beach boat base'],
        offering: 'Early morning boat cruise to Grand Island. Enjoy underwater snorkeling, spotting dolphins, and a beginner-friendly guided scuba dive with certified coaches.',
        activities: ['Grand Island boat cruise', 'Dolphin spotting', 'Scuba diving & beach BBQ'],
        insiderTip: 'Eat a very light breakfast before the boat ride as seas can get slightly choppy.',
        image: 'https://images.unsplash.com/photo-1614082242765-7c99bc0f3df8?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 03',
        title: 'North Goa Beaches & Fort Aguada',
        location: 'Panaji to Candolim',
        places: ['Fort Aguada', 'Candolim Beach', 'Baga Beach'],
        offering: 'Check out and drive to Candolim. Visit the 17th-century Portuguese Fort Aguada lighthouse, and relax on the sands of Candolim beach.',
        activities: ['Fort Aguada entry', 'Beach lounging', 'Shack dinner'],
        insiderTip: 'Walk to the lower fort walls of Aguada for direct, unobstructed views of the Arabian Sea.',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 04',
        title: 'South Goa Escape & Palolem Beach Sunset',
        location: 'Candolim to Palolem',
        places: ['Palolem Beach crescent', 'Margao Town'],
        offering: 'Drive down to South Goa\'s peaceful Palolem Beach. Stay in cozy beachfront wood cottages. Enjoy kayaking at sunset and a quiet beachside dinner.',
        activities: ['Beach cottage check-in', 'Sunset kayaking', 'Quiet beachfront dining'],
        insiderTip: 'Rent a kayak and paddle out to the small Monkey Island just off the Palolem shore.',
        image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 05',
        title: 'Dudhsagar Waterfall Hike & Departure',
        location: 'Palolem to Airport',
        places: ['Dudhsagar Waterfalls', 'Goa Airport'],
        offering: 'Take a morning jungle jeep safari to the mighty Dudhsagar Waterfalls. Transfer to Goa Airport for your return flight.',
        activities: ['Jungle jeep safari', 'Dudhsagar falls hike', 'Airport drop-off'],
        insiderTip: 'Dudhsagar pools are filled with fish; carry some biscuits to feed them.',
        image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=500&q=80'
      }
    ]
  },
  {
    id: 'pkg-rajasthan-royal',
    name: 'Rajasthan Royal Tour',
    price: 21500,
    originalPrice: 28000,
    duration: '8 Days / 7 Nights',
    durationDays: 8,
    rating: 4.9,
    ratingCount: 198,
    hotelStars: '5★ Royal Heritage Palace',
    hotelClass: '5',
    route: 'Jaipur (2N) → Jodhpur (2N) → Jaisalmer Camp (3N)',
    routeList: ['Jaipur Palace (2N)', 'Jodhpur Blue City (2N)', 'Jaisalmer Camp (3N)'],
    description: 'Experience the grandeur of Rajput royalty. Stay in authentic heritage palace hotels, traverse the blue streets of Jodhpur, and sleep under a canopy of stars in the Thar Desert.',
    inclusions: ['hotel', 'transfers', 'meals', 'sightseeing'],
    highlights: [
      'Private heritage palace stays & luxury desert glamping',
      'Guided Amber Fort tour & camel sunset desert safari',
      'Stargazing dinner over the Thar desert dunes with Rajasthani folk music'
    ],
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    themes: ['Heritage', 'Romantic'],
    destination: 'Rajasthan',
    detailsAvailable: true,
    link: '/travel/package/pkg-rajasthan-royal',
    category: 'Road Trip',
    difficulty: 'Easy',
    groupType: 'Curated group Trip',
    nextDeparture: 'Oct, 2026',
    startPoint: 'Jaipur',
    
    // Detailed fields
    images: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1603258843180-2a818318b76c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590050752117-238cb0612b1b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80'
    ],
    exclusions: [
      'Flights or train tickets to Jaipur',
      'Monument entry tickets and guide fees',
      'Lunch meals and personal drinks',
      'Tips for drivers, safari staff, and camel handlers',
      'Shopping or laundry expenses'
    ],
    packingList: [
      'Light colored cotton outfits',
      'Flat walking shoes for fort exploring',
      'Sunglasses, sunscreen, & sun hat',
      'Light jacket (desert nights get chilly)',
      'Hydration bottle'
    ],
    faqs: [
      {
        q: 'Are the desert tents air-conditioned?',
        a: 'Yes, our luxury Jaisalmer glamping tents are equipped with modern air conditioning and attached concrete bathrooms.'
      }
    ],
    reviews: [
      {
        name: 'Megha Singhal',
        date: 'June, 12th, 2026',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80',
        comment: '“Staying in real heritage palaces was amazing! The desert camp in Jaisalmer was the highlight—the stargazing dinner was magical.”',
        rating: 4.9
      }
    ],
    guide: {
      name: 'Anand Nair',
      role: 'Heritage Tour Director',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&fit=crop&q=60',
      rating: 4.8,
      trips: 186,
      bio: 'Anand leads historical and royal heritage tours across Rajasthan.'
    },
    departures: [
      { value: '2026-10-10', label: '10 Oct, 2026', seats: '6 Seats' }
    ],
    itinerary: [
      {
        day: 'Day 01',
        title: 'Arrival in Jaipur & Chokhi Dhani Cultural Feast',
        location: 'Jaipur',
        places: ['Jaipur Airport', 'Heritage Hotel', 'Chokhi Dhani'],
        offering: 'Pick up and check in to your royal heritage hotel. Join our evening excursion to Chokhi Dhani for traditional folk dance and an authentic Rajasthani thali feast.',
        activities: ['Jaipur pickup', 'Chokhi Dhani heritage resort dinner'],
        insiderTip: 'Sit cross-legged for the traditional dining experience; the hosts will lovingly serve you multiple helpings of Dal Baati Churma.',
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 02',
        title: 'Amer Fort & Hawa Mahal Sightseeing',
        location: 'Jaipur',
        places: ['Amer Fort', 'Hawa Mahal', 'City Palace'],
        offering: 'Guided exploration of Amer Fort, exploring the beautiful Sheesh Mahal (mirror hall). Stroll past Hawa Mahal and tour the City Palace museum.',
        activities: ['Amer Fort guided walk', 'City Palace tour', 'Hawa Mahal photography'],
        insiderTip: 'Visit Amer Fort early in the morning to beat the midday sun and enjoy clean photography lighting.',
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0612b1b?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 03',
        title: 'Drive to Jodhpur & Mehrangarh Fort Walk',
        location: 'Jaipur to Jodhpur',
        places: ['Mehrangarh Fort', 'Jaswant Thada'],
        offering: 'Drive to the blue city of Jodhpur. Tour the massive Mehrangarh Fort, which sits on a cliff overlooking the blue painted houses below.',
        activities: ['Mehrangarh Fort entry', 'Jaswant Thada cenotaph visit'],
        insiderTip: 'Visit Mehrangarh Fort’s museum; it has an incredible collection of royal palanquins and armory.',
        image: 'https://images.unsplash.com/photo-1603258843180-2a818318b76c?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 04',
        title: 'Jodhpur Blue Streets & Bishnoi Village Safari',
        location: 'Jodhpur',
        places: ['Blue Streets of old Jodhpur', 'Bishnoi Village'],
        offering: 'Walk through the blue alleys of old Jodhpur. Take a jeep safari to the Bishnoi villages to witness local wildlife and traditional clay pottery crafts.',
        activities: ['Jeep safari', 'Clay pottery workshop', 'Blue street walk'],
        insiderTip: 'Dine at a rooftop restaurant near the Clock Tower for a stunning view of Mehrangarh lit up at night.',
        image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 05',
        title: 'Drive to Jaisalmer & Thar Desert Camp Check-in',
        location: 'Jodhpur to Jaisalmer',
        places: ['Thar Desert dunes', 'Luxury Glamping Camp'],
        offering: 'Drive across the desert to Jaisalmer. Check in to your luxury air-conditioned desert camp. Enjoy sunset camel rides on the sand dunes.',
        activities: ['Desert camp check-in', 'Sunset camel safari'],
        insiderTip: 'Hold on tight to the saddle when the camel rises; they stand up back-legs first.',
        image: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 06',
        title: 'Golden Fort & Havelis of Jaisalmer',
        location: 'Jaisalmer',
        places: ['Jaisalmer Golden Fort', 'Patwon ki Haveli'],
        offering: 'Tour the living Jaisalmer Fort where local families still reside. Explore the intricate yellow-stone carvings at Patwon ki Haveli.',
        activities: ['Living Golden Fort walk', 'Haveli guided tour'],
        insiderTip: 'Buy authentic desert handloom blankets made from local camel wool inside the fort shops.',
        image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 07',
        title: 'Desert Dune Bashing & Stargazing Dinner',
        location: 'Jaisalmer',
        places: ['Sam Sand Dunes', 'Stargazing Camp'],
        offering: 'Thrill yourself with 4x4 dune bashing over the sand dunes. Relish a traditional stargazing campfire dinner with live folk musicians.',
        activities: ['4x4 Dune bashing', 'Live Rajasthani folk music', 'Stargazing campfire dinner'],
        insiderTip: 'Desert skies are extremely clear; bring a tripod to capture long-exposure photos of the Milky Way.',
        image: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 08',
        title: 'Departure Drop at Jodhpur Airport',
        location: 'Jaisalmer to Jodhpur Out',
        places: ['Jodhpur Airport'],
        offering: 'Drive back to Jodhpur airport/station for departure, loaded with golden memories of Rajasthan.',
        activities: ['Airport departure drop-off'],
        insiderTip: 'Stop at Pokhran on the highway for a quick tea and local clay craft display.',
        image: 'https://images.unsplash.com/photo-1603258843180-2a818318b76c?auto=format&fit=crop&w=500&q=80'
      }
    ]
  },
  {
    id: 'pkg-himachal-trek',
    name: 'Manali Valley Trek',
    price: 15900,
    originalPrice: 21000,
    duration: '6 Days / 5 Nights',
    durationDays: 6,
    rating: 4.8,
    ratingCount: 184,
    hotelStars: '4★ Riverview Resort',
    hotelClass: '4',
    route: 'Delhi → Shimla (2N) → Manali (3N) → Delhi',
    routeList: ['Shimla Heritage (2N)', 'Manali River View (3N)'],
    description: 'Breath in the crisp pine-scented air of the Himalayas. Walk through old wood sanctuaries in Shimla, trek along rushing glacial rivers in Manali, and enjoy thrilling adventure sports.',
    inclusions: ['hotel', 'transfers', 'meals'],
    highlights: [
      'Riverside cottage stays with snowy balcony views',
      'Paragliding at Solang Valley & Rohtang Pass excursion',
      'Guided cedar forest trek and hot sulfur spring bath in Vashisht'
    ],
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80',
    themes: ['Mountain', 'Adventure'],
    destination: 'Himachal',
    detailsAvailable: true,
    link: '/travel/package/pkg-himachal-trek',
    category: 'Trek',
    difficulty: 'Moderate',
    groupType: 'Curated group Trip',
    nextDeparture: 'Aug, 2026',
    startPoint: 'Manali',
    
    // Detailed fields
    images: [
      'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517462964-21fdcec3f25b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80'
    ],
    exclusions: [
      'Flights or train to Delhi/Chandigarh',
      'Adventure sport gear hire or licenses',
      'Dinner and lunch meals',
      'Tips for mountain guides and drivers',
      'Optional Rohtang Pass vehicle upgrades'
    ],
    packingList: [
      'Fleece jacket and warm windproof layer',
      'Hiking shoes with thick rubber sole',
      'Sunscreen & lip balm',
      'Thermos flask',
      'First-aid supplies'
    ],
    faqs: [
      {
        q: 'Is Solang Valley paragliding included?',
        a: 'We provide transport and safety coordinator. Paragliding flight cost is paid directly to certified local pilots.'
      }
    ],
    reviews: [
      {
        name: 'Varun Joshi',
        date: 'June, 26th, 2026',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80',
        comment: '“Loved the Solang trek! Balcony view from our Manali resort was lovely. Perfect group trip layout.”',
        rating: 4.8
      }
    ],
    guide: {
      name: 'Vikram Aditya',
      role: 'Lead Expedition Coordinator',
      image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=120&h=120&fit=crop&q=60',
      rating: 5.0,
      trips: 143,
      bio: 'Vikram guides high-altitude Himalayan treks across Himachal and Kashmir.'
    },
    departures: [
      { value: '2026-08-16', label: '16 Aug, 2026', seats: '6 Seats' }
    ],
    itinerary: [
      {
        day: 'Day 01',
        title: 'Delhi to Shimla Volvo Drive',
        location: 'Delhi to Shimla',
        places: ['Delhi Volvo Stand', 'Shimla Mall Road'],
        offering: 'Board your premium overnight Volvo bus from Delhi. Climb through beautiful pine forests and check in to your heritage hotel in Shimla.',
        activities: ['Overnight AC Volvo ride', 'Hotel check-in'],
        insiderTip: 'Pick a window seat on the left side of the Volvo for the best sunrise views as the bus enters the hills.',
        image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 02',
        title: 'Shimla Ridge & Kufri Snow View',
        location: 'Shimla',
        places: ['Kufri Adventure Park', 'Shimla Ridge', 'Jakhoo Temple'],
        offering: 'Drive to Kufri for breathtaking snowy mountain views. Hike up to the historic Jakhoo temple and walk along Shimla Ridge mall road.',
        activities: ['Kufri mountain walk', 'Jakhoo temple monkey forest walk', 'Mall road heritage walk'],
        insiderTip: 'Keep all snacks and items zipped inside your bag; the monkeys at Jakhoo temple are very clever at grabbing things.',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 03',
        title: 'Scenic Drive to Manali & River Valley Stay',
        location: 'Shimla to Manali',
        places: ['Kullu Valley', 'Beas River', 'Manali Resort'],
        offering: 'Drive from Shimla to Manali, passing through Kullu valley alongside the Beas River. Check in to your riverview resort.',
        activities: ['Scenic Beas river drive', 'Riverview check-in'],
        insiderTip: 'Stop at the Kullu handloom cooperative to buy authentic wool shawls and caps.',
        image: 'https://images.unsplash.com/photo-1517462964-21fdcec3f25b?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 04',
        title: 'Solang Valley Paragliding & Adventure',
        location: 'Manali',
        places: ['Solang Valley slopes', 'Anjani Mahadev Temple'],
        offering: 'Spend the day at Solang Valley. Enjoy thrilling adventure activities like paragliding, zorbing, and hike to the hidden Anjani Mahadev waterfall.',
        activities: ['Paragliding and adventure sports', 'Waterfall hike'],
        insiderTip: 'Opt for the long paragliding flight from the top cable car station for the ultimate thrill.',
        image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 05',
        title: 'Jogini Waterfall Trek & Vashisht Hot Springs',
        location: 'Manali',
        places: ['Jogini Waterfalls', 'Vashisht Temple Springs', 'Old Manali cafes'],
        offering: 'Take a guided nature trek through cedar woods to the scenic Jogini Waterfalls. Soak in the therapeutic hot sulfur baths at Vashisht Temple.',
        activities: ['Cedar forest trek', 'Hot sulfur bath', 'Old Manali cafe exploration'],
        insiderTip: 'Dine at the Lazy Dog cafe in Old Manali; they have great live music and food.',
        image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 06',
        title: 'Manali Mall Road & Volvo Return to Delhi',
        location: 'Manali to Delhi Out',
        places: ['Hadimba Temple', 'Delhi Airport'],
        offering: 'Visit the historic Hadimba Temple. Do souvenir shopping at Mall Road, before boarding the overnight Volvo bus back to Delhi.',
        activities: ['Hadimba temple walk', 'Souvenir shopping', 'Overnight Volvo ride'],
        insiderTip: 'Arrive at the Volvo stand early; evening departures are busy.',
        image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=500&q=80'
      }
    ]
  },
  {
    id: 'pkg-andaman-island',
    name: 'Andaman Island Getaway',
    price: 28900,
    originalPrice: 36500,
    duration: '6 Days / 5 Nights',
    durationDays: 6,
    rating: 4.9,
    ratingCount: 156,
    hotelStars: '5★ Beach Resort',
    hotelClass: '5',
    route: 'Port Blair (1N) → Havelock Island (3N) → Neil Island (1N)',
    routeList: ['Port Blair (1N)', 'Havelock Island (3N)', 'Neil Island (1N)'],
    description: 'Escape to India\'s premier tropical paradise. Swim in the turquoise waters of Radhanagar Beach, snorkel among vibrant coral reefs, and ride in private inter-island cruises.',
    inclusions: ['hotel', 'transfers', 'meals', 'sightseeing'],
    highlights: [
      'Premium beachfront villa stay with private deck access',
      'Snorkeling at Elephant Beach & scuba dive lesson in Havelock',
      'Private cruise ferry transfers between islands'
    ],
    image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80',
    themes: ['Beach', 'Adventure', 'Romantic'],
    destination: 'Andaman',
    detailsAvailable: true,
    link: '/travel/package/pkg-andaman-island',
    category: 'Weekend',
    difficulty: 'Easy',
    groupType: 'Private Tour',
    nextDeparture: 'Nov, 2026',
    startPoint: 'Port Blair',
    
    // Detailed fields
    images: [
      'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1614082242765-7c99bc0f3df8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&w=800&q=80'
    ],
    exclusions: [
      'Flights to and from Port Blair',
      'Extra water sports and boat rentals',
      'Lunch meals and personal drinks',
      'Tips for boat crew and resort staff',
      'Camera entry tickets at Cellular Jail'
    ],
    packingList: [
      'Light summer garments and swimwear',
      'Water shoes/sandals',
      'Sunglasses and waterproof sunscreen',
      'Waterproof dry-bag',
      'Mosquito repellent'
    ],
    faqs: [
      {
        q: 'Are cruise transfers confirmed in advance?',
        a: 'Yes, all inter-island transfers (Port Blair to Havelock and Neil) are pre-booked in luxury AC cruises like Makruzz or Nautika.'
      }
    ],
    reviews: [
      {
        name: 'Sneha Reddy',
        date: 'July, 03rd, 2026',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80',
        comment: '“Incredible experience! The Radhanagar beach was so clean and the snorkeling was unforgettable. Cruise transfers were smooth.”',
        rating: 5
      }
    ],
    guide: {
      name: 'Anand Nair',
      role: 'Tropical Tour Director',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&fit=crop&q=60',
      rating: 4.8,
      trips: 186,
      bio: 'Anand guides tropical and beach side getaways across Kerala and Andaman.'
    },
    departures: [
      { value: '2026-11-10', label: '10 Nov, 2026', seats: 'Private slots' }
    ],
    itinerary: [
      {
        day: 'Day 01',
        title: 'Arrival in Port Blair & Cellular Jail Light Show',
        location: 'Port Blair',
        places: ['Port Blair Airport', 'Cellular Jail Museum'],
        offering: 'Pick up from Port Blair airport. Check in to your premium hotel. Visit the historic Cellular Jail museum and watch the evening light and sound show.',
        activities: ['Airport pickup', 'Cellular Jail entry tickets & light show'],
        insiderTip: 'Sit in the center seats of the gallery for the best sound dispersion during the light show.',
        image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 02',
        title: 'Private Cruise to Havelock Island & Radhanagar Beach',
        location: 'Port Blair to Havelock',
        places: ['Luxury Cruise Ferry', 'Radhanagar Beach Beachfront Resort'],
        offering: 'Board your private luxury AC cruise ferry to Havelock Island. Check in to your beachfront resort. Spend the afternoon lounging on the famous white sands of Radhanagar Beach.',
        activities: ['Luxury cruise transfer', 'Radhanagar beach walk'],
        insiderTip: 'Radhanagar beach is rated one of the cleanest in Asia. Keep food items sealed in bags; crabs are active.',
        image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 03',
        title: 'Elephant Beach Snorkeling & Water Sports',
        location: 'Havelock Island',
        places: ['Elephant Beach reef', 'Speedboat base'],
        offering: 'Take a speedboat to Elephant Beach. Enjoy a complimentary snorkeling session, exploring vibrant shallow coral reefs and marine life with certified guides.',
        activities: ['Speedboat ride', 'Complimentary snorkeling session', 'Jet-ski/Boating options'],
        insiderTip: 'Wear water shoes or sandals; the entry reef can have sharp shells.',
        image: 'https://images.unsplash.com/photo-1614082242765-7c99bc0f3df8?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 04',
        title: 'Cruise to Neil Island & Natural Bridge sunset',
        location: 'Havelock to Neil Island',
        places: ['Neil Island Beach Resort', 'Howrah Natural Bridge'],
        offering: 'Cruise to Neil Island, the quiet eco-haven. Check in to your beach resort. Tour the unique Natural Coral Bridge formations during low tide.',
        activities: ['Neil Island cruise ferry', 'Natural bridge walk', 'Sunset stroll at Laxmanpur Beach'],
        insiderTip: 'The bridge path is rocky; watch your footing and wear good grip shoes.',
        image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 05',
        title: 'Return Cruise to Port Blair',
        location: 'Neil to Port Blair',
        places: ['Port Blair Boutique Hotel', 'Samudrika Museum'],
        offering: 'Cruise back to Port Blair. Enjoy local shopping at Sagarika emporium and visit the Samudrika Marine Museum.',
        activities: ['Return cruise ferry', 'Museum visit', 'Souvenir shopping'],
        insiderTip: 'Buy authentic coconut-shell items and pearl jewelry at Sagarika govt emporium.',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80'
      },
      {
        day: 'Day 06',
        title: 'Airport Drop & Departure',
        location: 'Port Blair Out',
        places: ['Port Blair Airport'],
        offering: 'Checkout and transfer to Port Blair airport for your flight back home, carrying tropical island vibes in your soul.',
        activities: ['Airport departure drop-off'],
        insiderTip: 'Pack shells in check-in bags; airport security confiscates shells found in cabin bags.',
        image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&w=500&q=80'
      }
    ]
  }
];
