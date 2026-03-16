import mongoose from 'mongoose';

const fnbPackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add package name'],
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['meal', 'bar', 'counter', 'dessert', 'beverage']
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snacks', 'all']
  },
  cuisineType: [{
    type: String,
    enum: ['North Indian', 'South Indian', 'Chinese', 'Continental', 'Mughlai', 'Rajasthani', 'Gujarati', 'Punjabi', 'Bengali', 'Maharashtrian', 'Fusion']
  }],
  description: {
    type: String,
    required: [true, 'Please add description']
  },
  pricePerPerson: {
    low: {
      type: Number,
      required: true,
      min: 0
    },
    medium: {
      type: Number,
      required: true,
      min: 0
    },
    high: {
      type: Number,
      required: true,
      min: 0
    }
  },
  includes: [{
    type: String,
    trim: true
  }],
  menuItems: [{
    category: {
      type: String,
      enum: ['starter', 'main', 'bread', 'rice', 'dessert', 'beverage']
    },
    name: String,
    description: String,
    isVeg: Boolean,
    isJain: Boolean
  }],
  images: [{
    url: String,
    publicId: String
  }],
  minimumGuests: {
    type: Number,
    default: 50
  },
  staffingRequired: {
    type: Number,
    default: 1 // staff per 50 guests
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes
fnbPackageSchema.index({ category: 1, mealType: 1 });
fnbPackageSchema.index({ cuisineType: 1 });

const FnBPackage = mongoose.model('FnBPackage', fnbPackageSchema);
export default FnBPackage;