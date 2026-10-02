const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/statsController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin', 'faculty'), getDashboardStats);

module.exports = router;
