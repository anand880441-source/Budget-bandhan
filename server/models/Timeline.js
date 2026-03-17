import mongoose from 'mongoose';

const timelineItemSchema = new mongoose.Schema({
  function: {
    type: String,
    required: true,
    enum: ['mehendi', 'sangeet', 'wedding', 'reception', 'haldi', 'cocktail', 'other']
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  venue: String,
  assignedVendors: [{
    vendorType: {
      type: String,
      enum: ['decor', 'artist', 'catering', 'photographer', 'other']
    },
    vendorId: mongoose.Schema.Types.ObjectId,
    vendorName: String
  }],
  checklist: [{
    task: String,
    completed: { type: Boolean, default: false },
    assignedTo: String
  }],
  notes: String,
  status: {
    type: String,
    enum: ['planned', 'confirmed', 'completed', 'cancelled'],
    default: 'planned'
  }
});

const timelineSchema = new mongoose.Schema({
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
  items: [timelineItemSchema],
  notes: String
}, {
  timestamps: true
});

const Timeline = mongoose.model('Timeline', timelineSchema);
export default Timeline;