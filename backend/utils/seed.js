require('node:dns').setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Resource = require('../models/Resource');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campus_resource_booking';

const seedDatabase = async () => {
  try {
    const primaryUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    const localUri = 'mongodb://127.0.0.1:27017/campus_resource_booking';
    
    let connected = false;
    if (primaryUri) {
      try {
        console.log('Attempting to connect to MongoDB Atlas...');
        await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 5000 });
        console.log('✓ Connected to MongoDB Atlas for Seeding!');
        connected = true;
      } catch (atlasErr) {
        console.warn('⚠️ Atlas connection failed (IP not whitelisted or offline). Using local MongoDB on 127.0.0.1:27017...');
      }
    }

    if (!connected) {
      await mongoose.connect(localUri);
      console.log('✓ Connected to Local MongoDB on 127.0.0.1:27017 for Seeding!');
    }

    // Clear old data
    await User.deleteMany({});
    await Resource.deleteMany({});
    await Booking.deleteMany({});
    await Notification.deleteMany({});
    console.log('Cleared existing collections.');

    // 1. Create Users
    const users = await User.create([
      {
        name: 'Dr. Ramesh Kumar (Admin)',
        email: 'admin@campus.edu',
        password: 'admin123',
        role: 'admin',
        rollNoOrId: 'ADM-001',
        department: 'Campus Administration',
        phone: '+91 98765 43210',
      },
      {
        name: 'Prof. N. Pavan (Faculty)',
        email: 'faculty@campus.edu',
        password: 'faculty123',
        role: 'faculty',
        rollNoOrId: '25A81A43H7',
        department: 'Computer Science & Engineering',
        phone: '+91 98765 43211',
      },
      {
        name: 'J. Suresh (Student)',
        email: 'student@campus.edu',
        password: 'student123',
        role: 'student',
        rollNoOrId: '24A81A0578',
        department: 'Information Technology',
        phone: '+91 98765 43212',
      },
      {
        name: 'P. Nirish (Student)',
        email: 'nirish@campus.edu',
        password: 'student123',
        role: 'student',
        rollNoOrId: '25A81A61H1',
        department: 'Electronics & Communication',
        phone: '+91 98765 43213',
      },
      {
        name: 'SK. Naseem (Student)',
        email: 'naseem@campus.edu',
        password: 'student123',
        role: 'student',
        rollNoOrId: 'IT-253',
        department: 'Information Technology',
        phone: '+91 98765 43214',
      },
    ]);
    console.log(`Seeded ${users.length} users.`);

    const adminUser = users[0];
    const facultyUser = users[1];
    const studentUser = users[2];

    // 2. Create Resources
    const resources = await Resource.create([
      {
        name: 'APJ Abdul Kalam Grand Auditorium',
        code: 'AUD-01',
        type: 'seminar_hall',
        location: 'Central Academic Block - Ground Floor',
        capacity: 350,
        amenities: ['4K Projector', 'Surround Sound', 'Stage Lighting', 'Central AC', 'Green Rooms', 'High-Speed Wi-Fi'],
        description: 'Primary auditorium for guest lectures, national conferences, cultural fests, and campus orientations.',
        status: 'active',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
        operationalHours: { start: '08:00', end: '21:00' },
      },
      {
        name: 'Advanced AI & Data Analytics Lab',
        code: 'LAB-301',
        type: 'lab',
        location: 'CS Block - 3rd Floor, Room 301',
        capacity: 50,
        amenities: ['45 RTX 4080 GPU Workstations', 'Gigabit Ethernet', 'Interactive Smart Screen', 'Dual AC', 'UPS Backup'],
        description: 'Dedicated computing laboratory for Machine Learning, Data Analytics, and specialized competitive programming.',
        status: 'active',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
        operationalHours: { start: '08:30', end: '20:00' },
      },
      {
        name: 'Ramanujan Seminar Hall',
        code: 'SEM-102',
        type: 'seminar_hall',
        location: 'Science & Math Wing - 1st Floor',
        capacity: 120,
        amenities: ['Dual HD Projectors', 'Wireless Podium Mic', 'Acoustic Soundproofing', 'Air Conditioned', 'Whiteboard'],
        description: 'Ideal for department symposiums, student presentations, workshops, and faculty meetings.',
        status: 'active',
        image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=80',
        operationalHours: { start: '08:00', end: '19:00' },
      },
      {
        name: 'Smart Lecture Hall 204',
        code: 'CR-204',
        type: 'classroom',
        location: 'Engineering Block B - 2nd Floor',
        capacity: 70,
        amenities: ['Interactive Smart Board', 'Ceiling Speakers', 'High-Speed Wi-Fi', 'AC', 'Tiered Seating'],
        description: 'Modern stepped classroom configured for multimedia lectures, group quizzes, and review sessions.',
        status: 'active',
        image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80',
        operationalHours: { start: '08:00', end: '18:00' },
      },
      {
        name: 'IoT & Robotics Research Lab',
        code: 'LAB-202',
        type: 'lab',
        location: 'Electronics Block - 2nd Floor',
        capacity: 35,
        amenities: ['Digital Oscilloscopes', '3D Printers', 'Microcontroller Toolkits', 'Soldering Benches', 'AC'],
        description: 'Hardware prototyping facility equipped with precision instruments for embedded engineering.',
        status: 'active',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
        operationalHours: { start: '09:00', end: '19:00' },
      },
      {
        name: 'Indoor Badminton Arena',
        code: 'SP-BD01',
        type: 'sports',
        location: 'Student Activity & Sports Center',
        capacity: 25,
        amenities: ['Synthetic Wooden Court', 'Anti-Glare LED Floodlights', 'Locker Rooms', 'Equipment Rental Counter'],
        description: 'Two competition-grade indoor badminton courts available for student tournaments and recreation.',
        status: 'active',
        image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80',
        operationalHours: { start: '06:00', end: '21:00' },
      },
      {
        name: 'Campus Turf Ground & Pavilion',
        code: 'SP-GR01',
        type: 'sports',
        location: 'East Campus Grounds',
        capacity: 150,
        amenities: ['All-Weather Artificial Turf', 'Match Floodlights', 'Scoreboard', 'Player Dugouts'],
        description: 'Regulation-size multi-sport turf for football matches, cricket nets, and athletics.',
        status: 'active',
        image: 'https://images.unsplash.com/photo-1529900241454-97c9b83b3815?w=800&auto=format&fit=crop&q=80',
        operationalHours: { start: '06:00', end: '20:00' },
      },
      {
        name: 'Sony 4K Portable Laser Projector Kit',
        code: 'EQ-PRJ01',
        type: 'equipment',
        location: 'AV Central Inventory - Room 12',
        capacity: 1,
        amenities: ['4K UHD Laser Projector', '120-inch Folding Screen', '30m HDMI / Type-C cables', 'Carry Case'],
        description: 'High-lumen portable cinema projector kit for outdoor movie nights, exhibitions, or temporary halls.',
        status: 'active',
        image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80',
        operationalHours: { start: '08:00', end: '18:00' },
      },
      {
        name: 'Yamaha 8-Ch PA Audio & Wireless Mic Kit',
        code: 'EQ-MIC02',
        type: 'equipment',
        location: 'AV Central Inventory - Room 12',
        capacity: 1,
        amenities: ['4 UHF Handheld & Lapel Mics', 'Powered 8-Channel Mixer', '2 Active Speaker Stands'],
        description: 'Complete mobile sound reinforcement setup for outdoor gatherings and hall ceremonies.',
        status: 'maintenance',
        image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80',
        operationalHours: { start: '08:00', end: '18:00' },
      },
    ]);
    console.log(`Seeded ${resources.length} resources.`);

    // 3. Create Sample Bookings (Some Approved, Some Pending)
    const today = new Date();
    const formatDate = (offsetDays) => {
      const d = new Date(today);
      d.setDate(d.getDate() + offsetDays);
      return d.toISOString().split('T')[0];
    };

    const dateToday = formatDate(0);
    const dateTomorrow = formatDate(1);
    const dateDayAfter = formatDate(2);

    const bookings = await Booking.create([
      {
        resource: resources[0]._id, // Auditorium
        user: facultyUser._id,
        date: dateTomorrow,
        startTime: '10:00',
        endTime: '13:00',
        purpose: 'Annual IEEE Technical Symposium & Paper Presentation',
        expectedAttendees: 200,
        status: 'approved',
        adminRemarks: 'Approved. AV technician will be assigned on duty.',
        reviewedBy: adminUser._id,
        reviewedAt: new Date(),
      },
      {
        resource: resources[1]._id, // AI Lab
        user: studentUser._id,
        date: dateTomorrow,
        startTime: '14:00',
        endTime: '17:00',
        purpose: 'Hackathon Practice: Training YOLOv8 & PyTorch Models',
        expectedAttendees: 30,
        status: 'pending',
      },
      {
        resource: resources[2]._id, // Ramanujan Seminar Hall
        user: studentUser._id,
        date: dateDayAfter,
        startTime: '09:30',
        endTime: '11:30',
        purpose: 'Developer Student Club Inaugural Workshop',
        expectedAttendees: 80,
        status: 'pending',
      },
      {
        resource: resources[3]._id, // Smart Classroom 204
        user: facultyUser._id,
        date: dateToday,
        startTime: '11:00',
        endTime: '12:30',
        purpose: 'Remedial Class on Database Management Systems',
        expectedAttendees: 40,
        status: 'approved',
        adminRemarks: 'Granted.',
        reviewedBy: adminUser._id,
        reviewedAt: new Date(),
      },
    ]);
    console.log(`Seeded ${bookings.length} bookings.`);

    // 4. Create Notifications
    await Notification.create([
      {
        user: studentUser._id,
        title: 'Booking Request Submitted',
        message: `Your booking request for ${resources[1].name} on ${dateTomorrow} (14:00 - 17:00) is awaiting review.`,
        type: 'booking_created',
        booking: bookings[1]._id,
        isRead: false,
      },
      {
        user: facultyUser._id,
        title: 'Booking Approved! 🎉',
        message: `Your booking for ${resources[0].name} on ${dateTomorrow} (10:00 - 13:00) has been approved.`,
        type: 'booking_approved',
        booking: bookings[0]._id,
        isRead: true,
      },
      {
        user: adminUser._id,
        title: 'New Booking Request Pending',
        message: `${studentUser.name} submitted a request for ${resources[1].name} on ${dateTomorrow} (14:00 - 17:00).`,
        type: 'booking_created',
        booking: bookings[1]._id,
        isRead: false,
      },
    ]);
    console.log('Seeded initial notifications.');

    console.log('=== Database Seeding Completed Successfully! ===');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
