const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: String, // Stored as YYYY-MM-DD for straightforward matching and timezone safety
      required: [true, 'Booking date is required'],
    },
    startTime: {
      type: String, // Stored as HH:MM in 24-hr format, e.g. "09:00"
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String, // Stored as HH:MM in 24-hr format, e.g. "11:00"
      required: [true, 'End time is required'],
    },
    purpose: {
      type: String,
      required: [true, 'Purpose of booking is required'],
      trim: true,
    },
    expectedAttendees: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled'],
      default: 'pending',
    },
    adminRemarks: {
      type: String,
      default: '',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
