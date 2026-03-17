import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Artist from '../models/Artist.js';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();

const artistItems = [
  {
    name: 'Arijit Singh',
    category: 'singer',
    subCategory: 'playback',
    description: 'Renowned playback singer known for soulful romantic melodies',
    experience: 15,
    basedIn: {
      city: 'Mumbai',
      travelAvailable: true,
      travelCharges: 'extra'
    },
    priceRange: {
      low: 1500000,
      medium: 2500000,
      high: 4000000
    },
    pricingUnit: 'per_event',
    languages: ['Hindi', 'Bengali', 'English'],
    genres: ['Bollywood', 'Romantic', 'Sufi'],
    packages: [
      {
        name: 'Basic Performance',
        description: '3 songs performance',
        price: 1500000,
        includes: ['3 songs', '30 minutes', 'Sound check'],
        duration: '30 mins'
      },
      {
        name: 'Extended Performance',
        description: '5 songs with audience interaction',
        price: 2500000,
        includes: ['5 songs', '45 minutes', 'Sound check', 'Meet & greet'],
        duration: '45 mins'
      }
    ],
    rating: 4.9,
    reviewCount: 1250,
    isVerified: true,
    isFeatured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format',
        isPrimary: true
      }
    ]
  },
  {
    name: 'Neha Kakkar',
    category: 'singer',
    subCategory: 'playback',
    description: 'Energetic playback singer popular for party anthems',
    experience: 12,
    basedIn: {
      city: 'Mumbai',
      travelAvailable: true,
      travelCharges: 'extra'
    },
    priceRange: {
      low: 1200000,
      medium: 2000000,
      high: 3500000
    },
    pricingUnit: 'per_event',
    languages: ['Hindi', 'Punjabi', 'English'],
    genres: ['Bollywood', 'Party', 'Romantic'],
    packages: [
      {
        name: 'Party Performance',
        description: 'High energy party songs',
        price: 2000000,
        includes: ['5 songs', '40 minutes', 'Sound check'],
        duration: '40 mins'
      }
    ],
    rating: 4.7,
    reviewCount: 850,
    isVerified: true,
    isFeatured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format',
        isPrimary: true
      }
    ]
  },
  {
    name: 'DJ Chetas',
    category: 'dj',
    description: 'Famous Bollywood DJ known for amazing mashups',
    experience: 10,
    basedIn: {
      city: 'Mumbai',
      travelAvailable: true,
      travelCharges: 'extra'
    },
    priceRange: {
      low: 500000,
      medium: 800000,
      high: 1200000
    },
    pricingUnit: 'per_event',
    languages: ['Hindi', 'English', 'Punjabi'],
    genres: ['EDM', 'Bollywood', 'House'],
    packages: [
      {
        name: 'Club Night',
        description: '4 hours DJ set',
        price: 800000,
        includes: ['DJ setup', 'Lighting', '4 hours'],
        duration: '4 hours'
      }
    ],
    rating: 4.8,
    reviewCount: 620,
    isVerified: true,
    isFeatured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?w=500&auto=format',
        isPrimary: true
      }
    ]
  },
  {
    name: 'Rajasthan Folk Band',
    category: 'band',
    subCategory: 'folk',
    description: 'Traditional Rajasthani folk musicians with live instruments',
    experience: 20,
    basedIn: {
      city: 'Jaipur',
      travelAvailable: true,
      travelCharges: 'included'
    },
    priceRange: {
      low: 150000,
      medium: 250000,
      high: 400000
    },
    pricingUnit: 'per_event',
    languages: ['Hindi'], // Changed from Rajasthani
    genres: ['Folk', 'Traditional', 'Cultural'],
    packages: [
      {
        name: 'Welcome Performance',
        description: 'Traditional welcome music',
        price: 150000,
        includes: ['6 members', '2 hours', 'Traditional instruments'],
        duration: '2 hours'
      }
    ],
    rating: 4.6,
    reviewCount: 180,
    isVerified: true,
    isFeatured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&auto=format',
        isPrimary: true
      }
    ]
  },
  {
    name: 'Rashmi & Rajat',
    category: 'anchor',
    description: 'Popular anchor duo for weddings and events',
    experience: 8,
    basedIn: {
      city: 'Delhi',
      travelAvailable: true,
      travelCharges: 'extra'
    },
    priceRange: {
      low: 200000,
      medium: 350000,
      high: 500000
    },
    pricingUnit: 'per_event',
    languages: ['Hindi', 'English', 'Punjabi'],
    genres: ['Wedding', 'Corporate', 'Comedy'],
    packages: [
      {
        name: 'Full Wedding',
        description: 'Complete wedding hosting',
        price: 350000,
        includes: ['Mehendi', 'Sangeet', 'Wedding', 'Reception'],
        duration: '3 days'
      }
    ],
    rating: 4.7,
    reviewCount: 95,
    isVerified: true,
    isFeatured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=500&auto=format',
        isPrimary: true
      }
    ]
  },
  {
    name: 'Bollywood Dance Group',
    category: 'choreographer',
    description: 'Professional dance group for sangeet performances',
    experience: 12,
    basedIn: {
      city: 'Mumbai',
      travelAvailable: true,
      travelCharges: 'extra'
    },
    priceRange: {
      low: 100000,
      medium: 180000,
      high: 300000
    },
    pricingUnit: 'per_event',
    languages: ['Hindi', 'English'],
    genres: ['Bollywood', 'Contemporary', 'Folk'],
    packages: [
      {
        name: 'Sangeet Performance',
        description: '4 dance performances',
        price: 180000,
        includes: ['8 dancers', 'Choreography', 'Costumes', '2 hours'],
        duration: '2 hours'
      }
    ],
    rating: 4.5,
    reviewCount: 67,
    isVerified: true,
    isFeatured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format',
        isPrimary: true
      }
    ]
  },
  {
    name: 'Mehendi Artist - Sofia',
    category: 'mehendi',
    description: 'Award-winning mehendi artist for bridal and event mehendi',
    experience: 14,
    basedIn: {
      city: 'Jaipur',
      travelAvailable: true,
      travelCharges: 'included'
    },
    priceRange: {
      low: 50000,
      medium: 100000,
      high: 200000
    },
    pricingUnit: 'per_event',
    languages: ['Hindi', 'English', 'Urdu'],
    genres: ['Traditional', 'Arabic', 'Rajasthani'],
    packages: [
      {
        name: 'Bridal Package',
        description: 'Complete bridal mehendi',
        price: 100000,
        includes: ['Bridal design', 'Both hands & feet', '2 assistants', '6 hours'],
        duration: '6 hours'
      },
      {
        name: 'Family Package',
        description: 'Mehendi for bride + 10 family members',
        price: 180000,
        includes: ['Bridal design', '10 family members', '3 artists', '8 hours'],
        duration: '8 hours'
      }
    ],
    rating: 4.9,
    reviewCount: 320,
    isVerified: true,
    isFeatured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1598974345679-9ba6b4f9f7d3?w=500&auto=format',
        isPrimary: true
      }
    ]
  },
  {
    name: 'Wedding Photographer - Joseph',
    category: 'photographer',
    description: 'Luxury wedding photographer capturing candid moments',
    experience: 16,
    basedIn: {
      city: 'Mumbai',
      travelAvailable: true,
      travelCharges: 'extra'
    },
    priceRange: {
      low: 300000,
      medium: 500000,
      high: 800000
    },
    pricingUnit: 'per_event',
    languages: ['Hindi', 'English', 'Marathi'],
    genres: ['Candid', 'Traditional', 'Fine Art'],
    packages: [
      {
        name: 'Complete Wedding',
        description: 'Full wedding coverage',
        price: 500000,
        includes: ['2 photographers', 'All events', 'Edited photos', 'Photobook', 'Pre-wedding shoot'],
        duration: '3 days'
      }
    ],
    rating: 4.8,
    reviewCount: 210,
    isVerified: true,
    isFeatured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=500&auto=format',
        isPrimary: true
      }
    ]
  }
];

const seedArtists = async () => {
  try {
    await connectDB();
    
    const user = await User.findOne();
    
    if (!user) {
      console.error('❌ No users found. Please create a user first.');
      process.exit(1);
    }

    console.log(`✅ Found user: ${user.name} (${user._id})`);

    const artistsWithUser = artistItems.map(item => ({
      ...item,
      createdBy: user._id
    }));

    await Artist.deleteMany({});
    console.log('🗑️ Existing artists cleared');

    const inserted = await Artist.insertMany(artistsWithUser);
    console.log(`✅ Seeded ${inserted.length} artists successfully`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding artists:', error);
    process.exit(1);
  }
};

seedArtists();