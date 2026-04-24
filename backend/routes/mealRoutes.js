const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createOrUpdateMeal, createDateMeals, getMeals, getAllMeals } = require('../controllers/mealController');

router.get('/', protect, getMeals);
router.get('/all', protect, getAllMeals);
router.post('/update', protect, createOrUpdateMeal);
router.post('/date', protect, createDateMeals);

module.exports = router;
