export interface Destination {
  id: string;
  name: string;
  sub: string;
  desc: string;
  image: string;
  color: string;
  season: string;
  attractions: string[];
  recommendedProductIds: string[];
}

export const DESTINATIONS: Destination[] = [
  {
    id: 'kerala',
    name: 'Kerala',
    sub: 'God’s Own Country',
    desc: 'Glide through shimmering backwaters lined with coconut palms, relax on luxury houseboats, and taste spices fresh from the vine.',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
    color: 'from-emerald-600 to-teal-800',
    season: 'Winter & Monsoon (Oct - Mar)',
    attractions: ['Alleppey Backwaters', 'Munnar Tea Estates', 'Wayanad Rain Forests'],
    recommendedProductIds: ['prod-cardamom', 'prod-mundu', 'prod-pepper', 'prod-pillow'],
  },
  {
    id: 'kashmir',
    name: 'Kashmir',
    sub: 'Paradise on Earth',
    desc: 'Breathe in the alpine air of snow-dusted mountains, reside in wooden houseboats on Dal Lake, and walk through fields of purple saffron.',
    image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80',
    color: 'from-blue-600 to-indigo-900',
    season: 'Spring & Winter (Sep - Apr)',
    attractions: ['Gulmarg Gondola', 'Dal Lake Shikaras', 'Pahalgam Valleys'],
    recommendedProductIds: ['prod-saffron', 'prod-jacket', 'prod-backpack', 'prod-tea'],
  },
  {
    id: 'goa',
    name: 'Goa',
    sub: 'Sun, Sand & Spices',
    desc: 'Bask under golden palms on sandy shores, explore Portuguese architecture, and visit tropical organic spice plantations.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    color: 'from-yellow-500 to-orange-700',
    season: 'Winter (Nov - Feb)',
    attractions: ['Palolem Beach', 'Basilica of Bom Jesus', 'Sahakari Spice Farm'],
    recommendedProductIds: ['prod-khadi', 'prod-stickers', 'prod-pillow', 'prod-coorg-coffee'],
  },

  {
    id: 'hyderabad',
    name: 'Hyderabad',
    sub: 'City of Pearls',
    desc: 'Unveil the grandeur of historical Nizam palaces, shop ancient pearl bazaars, and feast on the legendary slow-cooked Biryani.',
    image: 'https://images.unsplash.com/photo-1605007493699-af65834f8a00?auto=format&fit=crop&w=800&q=80',
    color: 'from-amber-600 to-red-800',
    season: 'Winter (Oct - Mar)',
    attractions: ['Charminar', 'Golconda Fort', 'Chowmahalla Palace'],
    recommendedProductIds: ['prod-coorg-coffee', 'prod-khadi', 'prod-tea', 'prod-stickers'],
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    sub: 'Land of Kings',
    desc: 'Ride camels across shifting desert dunes, explore towering sandstone hill-forts, and immerse in colors of folk music.',
    image: 'https://images.unsplash.com/photo-1477587458883-471a5ed94245?auto=format&fit=crop&w=800&q=80',
    color: 'from-orange-500 to-amber-800',
    season: 'Winter (Oct - Mar)',
    attractions: ['Amer Fort Jaipur', 'Thar Desert Dunes', 'Lake Palace Udaipur'],
    recommendedProductIds: ['prod-khadi', 'prod-backpack', 'prod-tea'],
  }
];
