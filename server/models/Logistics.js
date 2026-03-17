import mongoose from 'mongoose';

const logisticsSchema = new mongoose.Schema({
  weddingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wedding',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transportation: {
    guestTransfer: {
      required: { type: Boolean, default: false },
      vehicleType: String,
      vehicleCount: Number,
      totalKms: Number,
      cost: Number
    },
    baraat: {
      hasGhodi: { type: Boolean, default: false },
      ghodiType: String,
      ghodiCost: Number,
      hasDholi: { type: Boolean, default: false },
      dholiCount: Number,
      dholiHours: Number,
      dholiCost: Number,
      hasSFX: { type: Boolean, default: false },
      sfxType: String,
      sfxCost: Number
    }
  },
  accommodation: {
    roomBlocks: [{
      roomType: String,
      roomCount: Number,
      nights: Number,
      pricePerRoom: Number,
      totalCost: Number
    }],
    totalRooms: Number,
    totalCost: Number
  },
  staffing: {
    coordinators: { count: Number, totalCost: Number },
    volunteers: { count: Number, totalCost: Number },
    security: { count: Number, totalCost: Number }
  },
  totalCost: { type: Number, default: 0 }
}, {
  timestamps: true
});

const Logistics = mongoose.model('Logistics', logisticsSchema);
export default Logistics;