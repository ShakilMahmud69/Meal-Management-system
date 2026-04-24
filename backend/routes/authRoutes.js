const express = require('express');
const router = express.Router();
const { signup, login, getProfile, getUsers } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getProfile);
router.get('/users', protect, adminOnly, getUsers);

module.exports = router;
