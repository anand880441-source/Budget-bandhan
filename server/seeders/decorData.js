import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Decor from '../models/Decor.js';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();

const decorItems = [
  {
    name: 'Traditional Red & Gold Mandap',
    description: 'Beautiful traditional mandap with red and gold drapes, fresh marigolds, and elegant lighting',
    category: 'mandap',
    function: 'wedding',
    style: 'traditional',
    priceRange: {
      low: 150000,
      medium: 200000,
      high: 300000
    },
    vendorName: 'Shaadi Decorators',
    vendorCity: 'Jaipur',
    includes: [
      'Mandap structure',
      'Fresh flowers',
      'Drapes and fabric',
      'Lighting setup',
      'Cushions and seating'
    ],
    tags: ['traditional', 'red', 'gold', 'marigold', 'royal'],
    isFeatured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&auto=format',
        isPrimary: true
      }
    ]
  },
  {
    name: 'Modern Floral Sangeet Stage',
    description: 'Contemporary stage design with pastel flowers, geometric shapes, and mood lighting',
    category: 'stage',
    function: 'sangeet',
    style: 'contemporary',
    priceRange: {
      low: 80000,
      medium: 120000,
      high: 180000
    },
    vendorName: 'Modern Weddings',
    vendorCity: 'Mumbai',
    includes: [
      'Stage backdrop',
      'Floral arrangements',
      'LED lights',
      'Dance floor lighting',
      'Photo booth area'
    ],
    tags: ['modern', 'pastel', 'flowers', 'stage', 'sangeet'],
    isFeatured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&auto=format',
        isPrimary: true
      }
    ]
  },
  {
    name: 'Rustic Mehendi Setup',
    description: 'Bohemian style mehendi decor with jute, colorful cushions, and floor seating',
    category: '整体',
    function: 'mehendi',
    style: 'rustic',
    priceRange: {
      low: 50000,
      medium: 80000,
      high: 120000
    },
    vendorName: 'Rustic Roots',
    vendorCity: 'Bangalore',
    includes: [
      'Floor seating',
      'Colorful cushions',
      'Jute rugs',
      'Floral canopies',
      'DIY photo corners'
    ],
    tags: ['rustic', 'bohemian', 'mehendi', 'outdoor', 'colorful'],
    isFeatured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&auto=format',
        isPrimary: true
      }
    ]
  },
  {
    name: 'Luxury Crystal Chandelier Ceiling',
    description: 'Stunning ceiling decor with cascading crystals, fairy lights, and fresh flowers',
    category: 'ceiling',
    function: 'wedding',
    style: 'luxury',
    priceRange: {
      low: 200000,
      medium: 300000,
      high: 450000
    },
    vendorName: 'Luxury Events',
    vendorCity: 'Udaipur',
    includes: [
      'Crystal chandeliers',
      'Fairy lights',
      'Floral cascades',
      'Gold leaf details',
      'Mirror work'
    ],
    tags: ['luxury', 'crystal', 'chandelier', 'royal', 'premium'],
    isFeatured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=500&auto=format',
        isPrimary: true
      }
    ]
  },
  {
    name: 'Fusion Cocktail Bar',
    description: 'Modern cocktail bar setup with Indian fusion elements, neon lights, and lounge seating',
    category: '整体',
    function: 'cocktail',
    style: 'fusion',
    priceRange: {
      low: 60000,
      medium: 90000,
      high: 140000
    },
    vendorName: 'Fusion Events',
    vendorCity: 'Delhi',
    includes: [
      'Bar counter',
      'Lounge seating',
      'Neon signage',
      'Ambient lighting',
      'High-top tables'
    ],
    tags: ['cocktail', 'bar', 'fusion', 'modern', 'lounge'],
    isFeatured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=500&auto=format',
        isPrimary: true
      }
    ]
  },
  {
    name: 'Traditional Flower Entrance',
    description: 'Grand entrance with fresh flower toran, marigold garlands, and traditional lamps',
    category: 'entrance',
    function: 'all',
    style: 'traditional',
    priceRange: {
      low: 30000,
      medium: 50000,
      high: 80000
    },
    vendorName: 'Traditional Decor',
    vendorCity: 'Jaipur',
    includes: [
      'Flower toran',
      'Marigold garlands',
      'Traditional lamps',
      'Rangoli design',
      'Welcome signage'
    ],
    tags: ['entrance', 'traditional', 'flowers', 'welcome', 'rangoli'],
    isFeatured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&auto=format',
        isPrimary: true
      }
    ]
  }
];

const seedDecor = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Find an existing user
    const user = await User.findOne();
    
    if (!user) {
      console.error('❌ No users found. Please create a user first.');
      process.exit(1);
    }

    console.log(`✅ Found user: ${user.name} (${user._id})`);

    // Add createdBy to all decor items
    const decorWithUser = decorItems.map(item => ({
      ...item,
      createdBy: user._id
    }));

    // Clear existing decor
    await Decor.deleteMany({});
    console.log('🗑️ Existing decor cleared');

    // Insert new decor items
    const inserted = await Decor.insertMany(decorWithUser);
    console.log(`✅ Seeded ${inserted.length} decor items successfully`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding decor:', error);
    process.exit(1);
  }
};

seedDecor();