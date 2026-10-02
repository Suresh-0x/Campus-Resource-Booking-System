const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Resource name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Resource code or room number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    type: {
      type: String,
      required: [true, 'Resource type is required'],
      enum: ['classroom', 'lab', 'seminar_hall', 'sports', 'equipment'],
      default: 'classroom',
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1'],
    },
    amenities: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'maintenance', 'inactive'],
      default: 'active',
    },
    operationalHours: {
      start: {
        type: String,
        default: '08:00',
      },
      end: {
        type: String,
        default: '20:00',
      },
    },
    requiresApproval: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', resourceSchema);
