const express = require('express');
const {
  getPlans,
  getAllPlans,
  createPlan,
  updatePlan,
  deletePlan,
  subscribe,
} = require('../controllers/membershipController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.get('/', getPlans);
router.post('/:id/subscribe', protect, subscribe);

router.get('/admin/all', protect, admin, getAllPlans);
router.post('/admin', protect, admin, createPlan);
router.put('/admin/:id', protect, admin, updatePlan);
router.delete('/admin/:id', protect, admin, deletePlan);

module.exports = router;
