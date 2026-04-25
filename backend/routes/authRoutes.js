const express = require('express');
const router = express.Router();
const { signup, login, getProfile, getUsers, createUser, deleteUser, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getProfile);
router.get('/users', protect, adminOnly, getUsers);
router.post('/users', protect, adminOnly, createUser);
router.delete('/users', protect, adminOnly, deleteAllUsers);
router.delete('/users/:id', protect, adminOnly, deleteUser);

module.exports = router;
