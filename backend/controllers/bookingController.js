const Booking = require('../models/Booking');
const Resource = require('../models/Resource');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendBookingConfirmation, sendBookingStatusUpdate } = require('../utils/emailService');

const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

const isOverlap = (start1, end1, start2, end2) => {
  const s1 = timeToMinutes(start1);
  const e1 = timeToMinutes(end1);
  const s2 = timeToMinutes(start2);
  const e2 = timeToMinutes(end2);
  return Math.max(s1, s2) < Math.min(e1, e2);
};

// @desc    Submit a new booking request
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    const { resourceId, date, startTime, endTime, purpose, expectedAttendees } = req.body;

    if (!resourceId || !date || !startTime || !endTime || !purpose) {
      return res.status(400).json({ success: false, message: 'Please provide all required booking fields' });
    }

    if (timeToMinutes(startTime) >= timeToMinutes(endTime)) {
      return res.status(400).json({ success: false, message: 'End time must be after start time' });
    }

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    if (resource.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: `Resource is currently ${resource.status} and cannot be booked`,
      });
    }

    // Check conflict against pending or approved bookings
    const existingBookings = await Booking.find({
      resource: resourceId,
      date,
      status: { $in: ['pending', 'approved'] },
    });

    const hasConflict = existingBookings.some((b) =>
      isOverlap(startTime, endTime, b.startTime, b.endTime)
    );

    if (hasConflict) {
      return res.status(409).json({
        success: false,
        message: 'This time slot conflicts with an existing reservation for this resource',
      });
    }

    const booking = await Booking.create({
      resource: resourceId,
      user: req.user._id,
      date,
      startTime,
      endTime,
      purpose,
      expectedAttendees: expectedAttendees || 1,
      status: 'pending',
    });

    // Create user notification
    await Notification.create({
      user: req.user._id,
      title: 'Booking Request Submitted',
      message: `Your booking request for ${resource.name} on ${date} (${startTime} - ${endTime}) has been received and is awaiting approval.`,
      type: 'booking_created',
      booking: booking._id,
    });

    // Notify all admins about new pending booking
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await Notification.create({
        user: admin._id,
        title: 'New Booking Request Pending',
        message: `${req.user.name} submitted a request for ${resource.name} on ${date} (${startTime} - ${endTime}).`,
        type: 'booking_created',
        booking: booking._id,
      });
    }

    const populatedBooking = await Booking.findById(booking._id)
      .populate('resource')
      .populate('user', 'name email role rollNoOrId department');

    // Asynchronously send email notification
    sendBookingConfirmation(req.user, booking, resource).catch(console.error);

    res.status(201).json({ success: true, booking: populatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get bookings of the logged in user
// @route   GET /api/bookings/my
// @access  Private
exports.getMyBookings = async (req, res) => {
  try {
    const { status, type } = req.query;
    let query = { user: req.user._id };

    if (status && status !== 'all') {
      query.status = status;
    }

    let bookings = await Booking.find(query)
      .populate('resource')
      .populate('reviewedBy', 'name role')
      .sort({ date: -1, startTime: -1 });

    if (type && type !== 'all') {
      bookings = bookings.filter((b) => b.resource && b.resource.type === type);
    }

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private (Admin)
exports.getAllBookings = async (req, res) => {
  try {
    const { status, resourceId, date } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (resourceId) {
      query.resource = resourceId;
    }

    if (date) {
      query.date = date;
    }

    const bookings = await Booking.find(query)
      .populate('resource')
      .populate('user', 'name email role rollNoOrId department phone')
      .populate('reviewedBy', 'name role')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve or Reject a booking (Admin only)
// @route   PUT /api/bookings/:id/status
// @access  Private (Admin)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, adminRemarks } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be approved or rejected' });
    }

    const booking = await Booking.findById(req.params.id)
      .populate('resource')
      .populate('user');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // If approving, double check conflict with other APPROVED bookings
    if (status === 'approved') {
      const conflict = await Booking.findOne({
        _id: { $ne: booking._id },
        resource: booking.resource._id,
        date: booking.date,
        status: 'approved',
      });

      if (conflict && isOverlap(booking.startTime, booking.endTime, conflict.startTime, conflict.endTime)) {
        return res.status(409).json({
          success: false,
          message: `Cannot approve: already conflicting with approved booking #${conflict._id} (${conflict.startTime}-${conflict.endTime})`,
        });
      }
    }

    booking.status = status;
    booking.adminRemarks = adminRemarks || '';
    booking.reviewedBy = req.user._id;
    booking.reviewedAt = new Date();
    await booking.save();

    // Create notification for the booking owner
    const title = status === 'approved' ? 'Booking Approved! 🎉' : 'Booking Rejected';
    const message =
      status === 'approved'
        ? `Your booking for ${booking.resource.name} on ${booking.date} (${booking.startTime} - ${booking.endTime}) has been approved.${adminRemarks ? ` Note: "${adminRemarks}"` : ''}`
        : `Your booking for ${booking.resource.name} on ${booking.date} was rejected.${adminRemarks ? ` Reason: "${adminRemarks}"` : ''}`;

    await Notification.create({
      user: booking.user._id,
      title,
      message,
      type: status === 'approved' ? 'booking_approved' : 'booking_rejected',
      booking: booking._id,
    });

    const updated = await Booking.findById(booking._id)
      .populate('resource')
      .populate('user', 'name email role rollNoOrId department')
      .populate('reviewedBy', 'name role');

    // Asynchronously send status update email
    sendBookingStatusUpdate(booking.user, booking, booking.resource, status, adminRemarks).catch(console.error);

    res.json({ success: true, booking: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel booking (Owner or Admin)
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('resource');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check ownership or admin
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    await Notification.create({
      user: booking.user,
      title: 'Booking Cancelled',
      message: `Reservation for ${booking.resource.name} on ${booking.date} (${booking.startTime}-${booking.endTime}) was cancelled.`,
      type: 'booking_cancelled',
      booking: booking._id,
    });

    res.json({ success: true, message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
