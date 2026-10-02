const Resource = require('../models/Resource');
const Booking = require('../models/Booking');

// Helper to convert "HH:MM" to minutes from midnight
const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

// Check if two time intervals overlap: [s1, e1) and [s2, e2)
const isOverlap = (start1, end1, start2, end2) => {
  const s1 = timeToMinutes(start1);
  const e1 = timeToMinutes(end1);
  const s2 = timeToMinutes(start2);
  const e2 = timeToMinutes(end2);
  return Math.max(s1, s2) < Math.min(e1, e2);
};

// @desc    Get all resources with optional filtering & search
// @route   GET /api/resources
// @access  Public
exports.getAllResources = async (req, res) => {
  try {
    const { search, type, status, minCapacity, date, startTime, endTime } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { amenities: { $regex: search, $options: 'i' } },
      ];
    }

    if (type && type !== 'all') {
      query.type = type;
    }

    if (status && status !== 'all') {
      query.status = status;
    } else {
      // By default for general users, hide inactive unless requested
      if (!req.user || req.user.role !== 'admin') {
        query.status = { $in: ['active', 'maintenance'] };
      }
    }

    if (minCapacity) {
      query.capacity = { $gte: Number(minCapacity) };
    }

    let resources = await Resource.find(query).sort({ name: 1 });

    // If date and times are specified, check availability for each
    if (date && startTime && endTime) {
      const activeBookings = await Booking.find({
        date,
        status: { $in: ['pending', 'approved'] },
      });

      resources = resources.map((resItem) => {
        const itemObj = resItem.toObject();
        if (itemObj.status === 'maintenance' || itemObj.status === 'inactive') {
          itemObj.isAvailable = false;
          itemObj.unavailabilityReason = `Resource is currently under ${itemObj.status}`;
          return itemObj;
        }

        const conflicting = activeBookings.filter(
          (b) =>
            b.resource.toString() === itemObj._id.toString() &&
            isOverlap(startTime, endTime, b.startTime, b.endTime)
        );

        itemObj.isAvailable = conflicting.length === 0;
        itemObj.conflictingBookings = conflicting;
        return itemObj;
      });
    }

    res.json({ success: true, count: resources.length, resources });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single resource with schedule for a date
// @route   GET /api/resources/:id
// @access  Public
exports.getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    const date = req.query.date || new Date().toISOString().split('T')[0];

    // Find bookings for this resource on the chosen date
    const bookings = await Booking.find({
      resource: resource._id,
      date,
      status: { $in: ['approved', 'pending'] },
    })
      .populate('user', 'name role department')
      .sort({ startTime: 1 });

    res.json({
      success: true,
      resource,
      date,
      bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Check resource slot availability
// @route   POST /api/resources/:id/check-availability
// @access  Public
exports.checkSlotAvailability = async (req, res) => {
  try {
    const { date, startTime, endTime, excludeBookingId } = req.body;
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    if (resource.status !== 'active') {
      return res.json({
        available: false,
        message: `Resource is currently ${resource.status}`,
      });
    }

    let filter = {
      resource: resource._id,
      date,
      status: { $in: ['pending', 'approved'] },
    };

    if (excludeBookingId) {
      filter._id = { $ne: excludeBookingId };
    }

    const existingBookings = await Booking.find(filter);

    const conflicts = existingBookings.filter((b) =>
      isOverlap(startTime, endTime, b.startTime, b.endTime)
    );

    const available = conflicts.length === 0;

    res.json({
      success: true,
      available,
      conflicts,
      message: available
        ? 'Time slot is available for booking'
        : 'Time slot overlaps with an existing booking',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new resource
// @route   POST /api/resources
// @access  Private (Admin)
exports.createResource = async (req, res) => {
  try {
    const resource = await Resource.create(req.body);
    res.status(201).json({ success: true, resource });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update resource
// @route   PUT /api/resources/:id
// @access  Private (Admin)
exports.updateResource = async (req, res) => {
  try {
    let resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, resource });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete resource
// @route   DELETE /api/resources/:id
// @access  Private (Admin)
exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    // Check if there are active bookings
    const activeBookings = await Booking.find({
      resource: resource._id,
      status: { $in: ['pending', 'approved'] },
    });

    if (activeBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete resource with active or pending bookings. Mark as inactive instead.',
      });
    }

    await resource.deleteOne();
    res.json({ success: true, message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
