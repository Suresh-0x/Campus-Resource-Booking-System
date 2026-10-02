const express = require('express');
const router = express.Router();
const {
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  checkSlotAvailability,
} = require('../controllers/resourceController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAllResources);
router.get('/:id', getResourceById);
router.post('/:id/check-availability', checkSlotAvailability);

router.post('/', protect, authorize('admin'), createResource);
router.put('/:id', protect, authorize('admin'), updateResource);
router.delete('/:id', protect, authorize('admin'), deleteResource);

module.exports = router;
