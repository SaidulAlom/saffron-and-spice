export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  spiceLevel: number;
  isSignature?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  review: string;
  image: string;
}

export interface GalleryImage {
  url: string;
  title: string;
}

export const FALLBACK_MENU_ITEMS: MenuItem[] = [
  {
    id: 'fallback-menu-1',
    name: 'Butter Chicken (Murgh Makhani)',
    description: 'Tender chicken simmered in a rich tomato, cream, and butter gravy finished with aromatic spices.',
    price: 545,
    category: 'Non-Vegetarian',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=800',
    spiceLevel: 1,
    isSignature: true,
  },
  {
    id: 'fallback-menu-2',
    name: 'Paneer Tikka Masala',
    description: 'Grilled cottage cheese cubes cooked in a spiced tomato-based gravy with charred peppers.',
    price: 425,
    category: 'Vegetarian',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=800',
    spiceLevel: 2,
  },
  {
    id: 'fallback-menu-3',
    name: 'Awadhi Lamb Biryani',
    description: 'Fragrant basmati rice layered with saffron, tender lamb, and traditional Awadhi spices.',
    price: 675,
    category: 'Biryanis & Pulaos',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=800',
    spiceLevel: 2,
    isSignature: true,
  },
  {
    id: 'fallback-menu-4',
    name: 'Kashmiri Rogan Josh',
    description: 'A signature Kashmiri lamb curry with a deep red gravy scented with dry ginger and whole spices.',
    price: 625,
    category: 'Non-Vegetarian',
    image: 'https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&q=80&w=800',
    spiceLevel: 3,
  },
  {
    id: 'fallback-menu-5',
    name: 'Dal Makhani',
    description: 'Black lentils slow-cooked overnight with cream and butter for a velvety finish.',
    price: 385,
    category: 'Vegetarian',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800',
    spiceLevel: 1,
  },
  {
    id: 'fallback-menu-6',
    name: 'Galouti Kebab',
    description: 'Melt-in-your-mouth minced lamb kebabs inspired by the royal kitchens of Lucknow.',
    price: 495,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800',
    spiceLevel: 2,
    isSignature: true,
  },
  {
    id: 'fallback-menu-7',
    name: 'Garlic Naan',
    description: 'Traditional clay-oven flatbread topped with garlic, butter, and fresh coriander.',
    price: 95,
    category: 'Breads',
    image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&q=80&w=800',
    spiceLevel: 0,
  },
  {
    id: 'fallback-menu-8',
    name: 'Gulab Jamun with Rabri',
    description: 'Warm milk dumplings soaked in saffron syrup, served with chilled rabri.',
    price: 245,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&q=80&w=800',
    spiceLevel: 0,
  },
  {
    id: 'fallback-menu-9',
    name: 'Saffron Mango Lassi',
    description: 'A refreshing Alphonso mango yogurt drink finished with a hint of saffron.',
    price: 195,
    category: 'Beverages & Mocktails',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800',
    spiceLevel: 0,
  },
  {
    id: 'fallback-menu-10',
    name: 'Tandoori Malai Broccoli',
    description: 'Broccoli florets marinated in cheese, cream, and cardamom, then grilled in a tandoor.',
    price: 375,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=800',
    spiceLevel: 1,
  },
  {
    id: 'fallback-menu-11',
    name: 'Prawn Pulao',
    description: 'Coastal-style rice cooked with fresh prawns, coconut milk, and gentle warming spices.',
    price: 595,
    category: 'Biryanis & Pulaos',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=800',
    spiceLevel: 2,
  },
  {
    id: 'fallback-menu-12',
    name: 'Shahi Tukda',
    description: 'Royal bread pudding soaked in saffron milk and finished with nuts and silver leaf.',
    price: 275,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&q=80&w=800',
    spiceLevel: 0,
  },
  {
    id: 'fallback-menu-13',
    name: 'Masala Chai',
    description: 'Traditional Indian tea brewed with ginger, cardamom, and a house spice blend.',
    price: 125,
    category: 'Beverages & Mocktails',
    image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&q=80&w=800',
    spiceLevel: 1,
  },
  {
    id: 'fallback-menu-14',
    name: 'Palak Paneer',
    description: 'Fresh spinach puree folded around cottage cheese cubes and tempered with garlic.',
    price: 415,
    category: 'Vegetarian',
    image: 'https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?auto=format&fit=crop&q=80&w=800',
    spiceLevel: 1,
  },
  {
    id: 'fallback-menu-15',
    name: 'Chicken Tikka',
    description: 'Boneless chicken marinated in yogurt and spices, then roasted over charcoal in a tandoor.',
    price: 465,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=800',
    spiceLevel: 2,
  },
];

export const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: 'fallback-1',
    name: 'Ananya Sharma',
    location: 'Mumbai',
    rating: 5,
    review: 'The most authentic Awadhi Biryani I have had outside of Lucknow. The ambiance is truly royal.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'fallback-2',
    name: 'Vikram Singh',
    location: 'Delhi',
    rating: 5,
    review: 'Saffron & Spice is a masterclass in fine dining. The Galouti Kebabs are a must-try!',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'fallback-3',
    name: 'Sarah Jenkins',
    location: 'London',
    rating: 5,
    review: 'Incredible flavors and impeccable service. The saffron-infused dishes are out of this world.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'fallback-4',
    name: 'Rohan Mehra',
    location: 'New York',
    rating: 5,
    review: "Authentic Indian flavors in a contemporary setting. The Chef's Table experience was outstanding.",
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'fallback-5',
    name: 'Priya Patel',
    location: 'Toronto',
    rating: 5,
    review: 'The attention to detail in every dish is remarkable. A perfect place for special occasions.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
  },
];

export const FALLBACK_GALLERY_IMAGES: GalleryImage[] = [
  {
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000',
    title: 'Main Dining Hall',
  },
  {
    url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1000',
    title: "Chef's Table",
  },
  {
    url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1000',
    title: 'Royal Interior',
  },
  {
    url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=1000',
    title: 'Signature Thali',
  },
  {
    url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1000',
    title: 'Spice Blending',
  },
  {
    url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=1000',
    title: 'Tandoori Specialties',
  },
  {
    url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=1000',
    title: 'Samosa Platter',
  },
  {
    url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&q=80&w=1000',
    title: 'Dessert Selection',
  },
];
