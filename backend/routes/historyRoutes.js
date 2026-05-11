const express = require('express');
const { getHistory } = require('../controllers/historyController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, adminOnly, getHistory);

module.exports = router;