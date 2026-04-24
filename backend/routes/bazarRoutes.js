const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { addBazarItem, getBazarItems } = require('../controllers/bazarController');

router.get('/', protect, getBazarItems);
router.post('/', protect, adminOnly, addBazarItem);

module.exports = router;
