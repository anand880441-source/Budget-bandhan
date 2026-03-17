import mongoose from 'mongoose';

const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add artist name'],
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['singer', 'band', 'dj', 'choreographer', 'anchor', 'photographer', 'videographer', 'makeup', 'mehendi']
  },
  subCategory: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add description']
  },
  experience: {
    type: Number,
    min: 0,
    max: 50
  },
  basedIn: {
    city: {
      type: String,
      enum: ['Mumbai', 'Delhi', 'Jaipur', 'Bangalore', 'Udaipur', 'Chennai', 'Kolkata', 'Hyderabad', 'Lucknow', 'Ahmedabad', 'Pan-India']
    },
    travelAvailable: {
      type: Boolean,
      default: true
    },
    travelCharges: {
      type: String,
      enum: ['included', 'extra', 'negotiable'],
      default: 'extra'
    }
  },
  priceRange: {
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
  pricingUnit: {
    type: String,
    enum: ['per_event', 'per_hour', 'per_person', 'fixed'],
    default: 'per_event'
  },
  images: [{
    url: String,
    publicId: String,
    isPrimary: Boolean
  }],
  portfolio: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['image', 'video']
    }
  }],
  languages: [{
    type: String,
    enum: [
      'Hindi', 'English', 'Punjabi', 'Gujarati', 'Marathi', 
      'Bengali', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 
      'Urdu', 'Rajasthani', 'Bhojpuri', 'Haryanvi', 'Assamese',
      'Odia', 'Sindhi', 'Nepali', 'Konkani', 'Sanskrit'
    ]
  }],
  genres: [String],
  packages: [{
    name: String,
    description: String,
    price: Number,
    includes: [String],
    duration: String
  }],
  availability: [{
    date: Date,
    status: {
      type: String,
      enum: ['available', 'booked', 'hold']
    }
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
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

// Indexes for faster queries
artistSchema.index({ category: 1, 'basedIn.city': 1 });
artistSchema.index({ priceRange: 1 });
artistSchema.index({ isFeatured: 1, rating: -1 });

const Artist = mongoose.model('Artist', artistSchema);
export default Artist;