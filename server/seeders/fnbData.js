import mongoose from 'mongoose';
import dotenv from 'dotenv';
import FnBPackage from '../models/FnBPackage.js';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();

const fnbPackages = [
  {
    name: 'Royal North Indian Wedding Dinner',
    category: 'meal',
    mealType: 'dinner',
    cuisineType: ['North Indian', 'Mughlai', 'Punjabi'],
    description: 'A lavish North Indian spread perfect for wedding dinners',
    pricePerPerson: {
      low: 1200,
      medium: 1800,
      high: 2500
    },
    includes: [
      'Welcome drink',
      '6 starters (3 veg, 3 non-veg)',
      '4 main course options',
      'Indian breads basket',
      '2 rice dishes',
      '3 desserts',
      'Unlimited soft drinks'
    ],
    menuItems: [
      { category: 'starter', name: 'Paneer Tikka', isVeg: true, isJain: true },
      { category: 'starter', name: 'Chicken Malai Tikka', isVeg: false, isJain: false },
      { category: 'starter', name: 'Veg Spring Rolls', isVeg: true, isJain: false },
      { category: 'main', name: 'Butter Chicken', isVeg: false, isJain: false },
      { category: 'main', name: 'Dal Makhani', isVeg: true, isJain: true },
      { category: 'main', name: 'Paneer Lababdar', isVeg: true, isJain: true },
      { category: 'bread', name: 'Butter Naan', isVeg: true, isJain: true },
      { category: 'bread', name: 'Garlic Naan', isVeg: true, isJain: true },
      { category: 'rice', name: 'Veg Biryani', isVeg: true, isJain: true },
      { category: 'dessert', name: 'Gulab Jamun', isVeg: true, isJain: true },
      { category: 'dessert', name: 'Rasmalai', isVeg: true, isJain: true }
    ],
    minimumGuests: 100,
    staffingRequired: 2,
    isFeatured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=500&auto=format',
        isPrimary: true
      }
    ]
  },
  {
    name: 'South Indian Feast',
    category: 'meal',
    mealType: 'dinner',
    cuisineType: ['South Indian'],
    description: 'Authentic South Indian spread served on banana leaves',
    pricePerPerson: {
      low: 800,
      medium: 1200,
      high: 1800
    },
    includes: [
      'Sambhar',
      'Rasam',
      '3 vegetable dishes',
      'Papad',
      'Pickle',
      'Payasam',
      'Curd rice'
    ],
    menuItems: [
      { category: 'starter', name: 'Medu Vada', isVeg: true, isJain: false },
      { category: 'starter', name: 'Masala Dosa', isVeg: true, isJain: true },
      { category: 'main', name: 'Sambhar', isVeg: true, isJain: true },
      { category: 'main', name: 'Rasam', isVeg: true, isJain: true },
      { category: 'main', name: 'Avial', isVeg: true, isJain: true },
      { category: 'rice', name: 'Lemon Rice', isVeg: true, isJain: true },
      { category: 'rice', name: 'Coconut Rice', isVeg: true, isJain: true },
      { category: 'dessert', name: 'Payasam', isVeg: true, isJain: true }
    ],
    minimumGuests: 50,
    staffingRequired: 1,
    isFeatured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format',
        isPrimary: true
      }
    ]
  },
  {
    name: 'Premium Bar Package',
    category: 'bar',
    mealType: 'all',
    cuisineType: [],
    description: 'Premium open bar with international and local brands',
    pricePerPerson: {
      low: 800,
      medium: 1500,
      high: 2500
    },
    includes: [
      'Premium whiskey',
      'Vodka',
      'Rum',
      'Gin',
      'Wine selection',
      'Signature cocktails',
      'Mocktails',
      'Soft drinks',
      'Mixers'
    ],
    menuItems: [
      { category: 'beverage', name: 'Single Malt Whiskey', isVeg: true, isJain: false },
      { category: 'beverage', name: 'Vodka', isVeg: true, isJain: false },
      { category: 'beverage', name: 'Red Wine', isVeg: true, isJain: false },
      { category: 'beverage', name: 'White Wine', isVeg: true, isJain: false },
      { category: 'beverage', name: 'Signature Cocktails', isVeg: true, isJain: false },
      { category: 'beverage', name: 'Fresh Lime Soda', isVeg: true, isJain: true },
      { category: 'beverage', name: 'Mocktails', isVeg: true, isJain: true }
    ],
    minimumGuests: 50,
    staffingRequired: 3,
    isFeatured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=500&auto=format',
        isPrimary: true
      }
    ]
  },
  {
    name: 'Chaat Counter',
    category: 'counter',
    mealType: 'snacks',
    cuisineType: ['North Indian'],
    description: 'Live chaat counter with popular Indian street food',
    pricePerPerson: {
      low: 250,
      medium: 400,
      high: 600
    },
    includes: [
      'Panipuri',
      'Dahi Puri',
      'Sev Puri',
      'Bhel Puri',
      'Papdi Chaat',
      'Aloo Tikki',
      'Dahi Bhalla'
    ],
    menuItems: [
      { category: 'starter', name: 'Panipuri', isVeg: true, isJain: true },
      { category: 'starter', name: 'Dahi Puri', isVeg: true, isJain: true },
      { category: 'starter', name: 'Sev Puri', isVeg: true, isJain: true },
      { category: 'starter', name: 'Aloo Tikki', isVeg: true, isJain: false }
    ],
    minimumGuests: 100,
    staffingRequired: 2,
    isFeatured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1567186937675-a8731c3a33f4?w=500&auto=format',
        isPrimary: true
      }
    ]
  },
  {
    name: 'Live Pasta Counter',
    category: 'counter',
    mealType: 'snacks',
    cuisineType: ['Continental'],
    description: 'Live pasta station with multiple sauces and toppings',
    pricePerPerson: {
      low: 300,
      medium: 450,
      high: 650
    },
    includes: [
      '3 pasta types',
      '4 sauces',
      'Vegetable toppings',
      'Chicken toppings',
      'Cheese options',
      'Garlic bread'
    ],
    menuItems: [
      { category: 'starter', name: 'White Sauce Pasta', isVeg: true, isJain: true },
      { category: 'starter', name: 'Red Sauce Pasta', isVeg: true, isJain: true },
      { category: 'starter', name: 'Pink Sauce Pasta', isVeg: true, isJain: true },
      { category: 'starter', name: 'Chicken Pasta', isVeg: false, isJain: false }
    ],
    minimumGuests: 100,
    staffingRequired: 2,
    isFeatured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=500&auto=format',
        isPrimary: true
      }
    ]
  },
  {
    name: 'Traditional Indian Desserts',
    category: 'dessert',
    mealType: 'dinner',
    cuisineType: ['North Indian', 'South Indian'],
    description: 'Extensive Indian dessert spread',
    pricePerPerson: {
      low: 200,
      medium: 350,
      high: 500
    },
    includes: [
      'Gulab Jamun',
      'Rasmalai',
      'Jalebi',
      'Kulfi',
      'Gajar Ka Halwa',
      'Moong Dal Halwa',
      'Ice cream counter'
    ],
    menuItems: [
      { category: 'dessert', name: 'Gulab Jamun', isVeg: true, isJain: true },
      { category: 'dessert', name: 'Rasmalai', isVeg: true, isJain: true },
      { category: 'dessert', name: 'Jalebi', isVeg: true, isJain: true },
      { category: 'dessert', name: 'Kulfi', isVeg: true, isJain: true },
      { category: 'dessert', name: 'Gajar Ka Halwa', isVeg: true, isJain: true }
    ],
    minimumGuests: 100,
    staffingRequired: 2,
    isFeatured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6?w=500&auto=format',
        isPrimary: true
      }
    ]
  },
  {
    name: 'Mocktail Bar',
    category: 'beverage',
    mealType: 'all',
    cuisineType: [],
    description: 'Creative non-alcoholic beverages for all ages',
    pricePerPerson: {
      low: 150,
      medium: 250,
      high: 400
    },
    includes: [
      'Fresh fruit mocktails',
      'Mojitos',
      'Smoothies',
      'Fresh juices',
      'Soft drinks',
      'Specialty teas',
      'Specialty coffees'
    ],
    menuItems: [
      { category: 'beverage', name: 'Virgin Mojito', isVeg: true, isJain: true },
      { category: 'beverage', name: 'Blue Lagoon', isVeg: true, isJain: true },
      { category: 'beverage', name: 'Strawberry Daiquiri', isVeg: true, isJain: true },
      { category: 'beverage', name: 'Fresh Lime Soda', isVeg: true, isJain: true },
      { category: 'beverage', name: 'Mango Smoothie', isVeg: true, isJain: true }
    ],
    minimumGuests: 50,
    staffingRequired: 1,
    isFeatured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1514361892630-6b4e3e99b9a3?w=500&auto=format',
        isPrimary: true
      }
    ]
  },
  {
    name: 'Sangeet Night Buffet',
    category: 'meal',
    mealType: 'dinner',
    cuisineType: ['North Indian', 'Chinese', 'Continental'],
    description: 'Fusion buffet perfect for sangeet night celebrations',
    pricePerPerson: {
      low: 1500,
      medium: 2200,
      high: 3000
    },
    includes: [
      'Live grill station',
      'Chinese counter',
      'Indian main course',
      'Pasta counter',
      'Dessert station',
      'Unlimited drinks'
    ],
    menuItems: [
      { category: 'starter', name: 'Paneer Tikka', isVeg: true, isJain: true },
      { category: 'starter', name: 'Chicken Tikka', isVeg: false, isJain: false },
      { category: 'starter', name: 'Veg Spring Rolls', isVeg: true, isJain: false },
      { category: 'main', name: 'Veg Manchurian', isVeg: true, isJain: false },
      { category: 'main', name: 'Chilli Chicken', isVeg: false, isJain: false },
      { category: 'main', name: 'Butter Chicken', isVeg: false, isJain: false },
      { category: 'main', name: 'Dal Makhani', isVeg: true, isJain: true },
      { category: 'main', name: 'Paneer Lababdar', isVeg: true, isJain: true },
      { category: 'rice', name: 'Veg Biryani', isVeg: true, isJain: true },
      { category: 'rice', name: 'Chicken Biryani', isVeg: false, isJain: false },
      { category: 'dessert', name: 'Gulab Jamun', isVeg: true, isJain: true },
      { category: 'dessert', name: 'Brownie with Ice Cream', isVeg: true, isJain: true }
    ],
    minimumGuests: 100,
    staffingRequired: 3,
    isFeatured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=500&auto=format',
        isPrimary: true
      }
    ]
  }
];

const seedFnB = async () => {
  try {
    await connectDB();
    
    const user = await User.findOne();
    
    if (!user) {
      console.error('❌ No users found. Please create a user first.');
      process.exit(1);
    }

    console.log(`✅ Found user: ${user.name} (${user._id})`);

    const packagesWithUser = fnbPackages.map(item => ({
      ...item,
      createdBy: user._id
    }));

    await FnBPackage.deleteMany({});
    console.log('🗑️ Existing F&B packages cleared');

    const inserted = await FnBPackage.insertMany(packagesWithUser);
    console.log(`✅ Seeded ${inserted.length} F&B packages successfully`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding F&B packages:', error);
    process.exit(1);
  }
};

seedFnB();