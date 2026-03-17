import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Logistics from '../models/Logistics.js';
import User from '../models/User.js';
import Wedding from '../models/Wedding.js';
import connectDB from '../config/db.js';

dotenv.config();

const seedLogistics = async () => {
  try {
    await connectDB();
    
    const user = await User.findOne();
    const wedding = await Wedding.findOne();
    
    if (!user || !wedding) {
      console.error('❌ No user or wedding found');
      process.exit(1);
    }

    const sampleLogistics = {
      weddingId: wedding._id,
      createdBy: user._id,
      transportation: {
        guestTransfer: {
          required: true,
          vehicleType: 'tempo',
          vehicleCount: 5,
          totalKms: 50,
          cost: 25000,
          notes: 'Airport to venue transfers'
        },
        baraat: {
          hasGhodi: true,
          ghodiType: 'premium',
          ghodiCost: 35000,
          hasDholi: true,
          dholiCount: 4,
          dholiHours: 3,
          dholiCost: 24000,
          hasSFX: true,
          sfxType: 'both',
          sfxCost: 20000
        }
      },
      accommodation: {
        roomBlocks: [{
          hotelName: 'Grand Palace Hotel',
          roomType: 'deluxe',
          roomCount: 20,
          nights: 3,
          pricePerRoom: 7500,
          totalCost: 450000,
          checkIn: new Date('2026-12-20'),
          checkOut: new Date('2026-12-23')
        }],
        totalRooms: 20,
        totalCost: 450000
      },
      staffing: {
        coordinators: { count: 3, totalCost: 6000 },
        volunteers: { count: 10, totalCost: 10000 },
        security: { required: true, count: 5, totalCost: 12500 }
      },
      parking: {
        valet: true,
        carCount: 200,
        costPerCar: 500,
        totalCost: 100000
      },
      totalCost: 682500
    };

    await Logistics.deleteMany({});
    await Logistics.create(sampleLogistics);
    
    console.log('✅ Logistics seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding logistics:', error);
    process.exit(1);
  }
};

seedLogistics();