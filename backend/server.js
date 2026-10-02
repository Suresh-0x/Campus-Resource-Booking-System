require('node:dns').setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/stats', statsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Campus Resource Booking System API is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
const primaryUri = process.env.MONGO_URI || process.env.MONGODB_URI;
const localUri = 'mongodb://127.0.0.1:27017/campus_resource_booking';

async function startServer() {
  let connected = false;
  if (primaryUri) {
    try {
      console.log('Attempting connection to MongoDB Atlas...');
      await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 5000 });
      const maskedUri = primaryUri.replace(/:\/\/.*@/, '://***:***@');
      console.log(`✓ Connected to MongoDB Atlas at ${maskedUri}`);
      connected = true;
    } catch (atlasErr) {
      console.warn('⚠️ Atlas connection timed out (IP whitelist / network). Using local MongoDB on 127.0.0.1:27017...');
    }
  }

  if (!connected) {
    await mongoose.connect(localUri);
    console.log('✓ Connected to Local MongoDB on 127.0.0.1:27017');
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal database connection error:', err);
  process.exit(1);
});
