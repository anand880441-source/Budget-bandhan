import mongoose from 'mongoose';

const decorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add decor name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add description'],
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['mandap', 'stage', 'lighting', 'flowers', 'entrance', 'table', 'ceiling', '整体']
  },
  function: {
    type: String,
    required: true,
    enum: ['mehendi', 'sangeet', 'wedding', 'reception', 'haldi', 'cocktail', 'all']
  },
  style: {
    type: String,
    required: true,
    enum: ['traditional', 'contemporary', 'fusion', 'luxury', 'rustic', 'bohemian', 'minimalist']
  },
  images: [{
    url: String,
    publicId: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
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
  vendorName: {
    type: String,
    trim: true
  },
  vendorCity: {
    type: String,
    enum: ['Mumbai', 'Delhi', 'Jaipur', 'Bangalore', 'Udaipur', 'Chennai', 'Kolkata', 'Hyderabad', 'Lucknow', 'Ahmedabad', 'Pan-India']
  },
  includes: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true
  }],
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

// Index for faster queries
decorSchema.index({ category: 1, function: 1 });
decorSchema.index({ style: 1, priceRange: 1 });
decorSchema.index({ isFeatured: 1 });

const Decor = mongoose.model('Decor', decorSchema);
export default Decor;