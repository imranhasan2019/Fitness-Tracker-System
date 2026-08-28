const express = require('express');
const { getProfile, updateProfile, calculateBMI } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/bmi', calculateBMI);

module.exports = router;
