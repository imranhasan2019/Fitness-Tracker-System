const express = require('express');
const {
  getDashboardStats,
  getAllMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.use(protect, admin);

router.get('/stats', getDashboardStats);
router.route('/members').get(getAllMembers).post(createMember);
router.route('/members/:id').get(getMember).put(updateMember).delete(deleteMember);

module.exports = router;
