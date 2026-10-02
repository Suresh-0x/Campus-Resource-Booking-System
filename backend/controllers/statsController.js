const Resource = require('../models/Resource');
const Booking = require('../models/Booking');
const User = require('../models/User');

// @desc    Get dashboard metrics & statistics
// @route   GET /api/stats
// @access  Private (Admin & Faculty)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalResources = await Resource.countDocuments();
    const activeResources = await Resource.countDocuments({ status: 'active' });
    const maintenanceResources = await Resource.countDocuments({ status: 'maintenance' });

    const totalUsers = await User.countDocuments();
    const studentCount = await User.countDocuments({ role: 'student' });
    const facultyCount = await User.countDocuments({ role: 'faculty' });

    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const approvedBookings = await Booking.countDocuments({ status: 'approved' });
    const rejectedBookings = await Booking.countDocuments({ status: 'rejected' });

    // Today's bookings
    const todayStr = new Date().toISOString().split('T')[0];
    const todayBookingsCount = await Booking.countDocuments({
      date: todayStr,
      status: 'approved',
    });

    // Breakdown by resource type
    const resourcesByType = await Resource.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    // Breakdown of bookings by resource type
    const bookingsByResourceType = await Booking.aggregate([
      {
        $lookup: {
          from: 'resources',
          localField: 'resource',
          foreignField: '_id',
          as: 'resourceDetails',
        },
      },
      { $unwind: '$resourceDetails' },
      {
        $group: {
          _id: '$resourceDetails.type',
          total: { $sum: 1 },
          approved: {
            $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] },
          },
        },
      },
    ]);

    // Recent 5 bookings
    const recentBookings = await Booking.find()
      .populate('resource', 'name type code')
      .populate('user', 'name role department')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      stats: {
        totalResources,
        activeResources,
        maintenanceResources,
        totalUsers,
        studentCount,
        facultyCount,
        totalBookings,
        pendingBookings,
        approvedBookings,
        rejectedBookings,
        todayBookingsCount,
        resourcesByType,
        bookingsByResourceType,
        recentBookings,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
