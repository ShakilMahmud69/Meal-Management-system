const Bazar = require('../models/Bazar');
const { addHistoryEntry } = require('./historyController');

const addBazarItem = async (req, res, next) => {
  try {
    const { date, itemName, price } = req.body;
    if (!date || !itemName || price == null) {
      res.status(400);
      throw new Error('Date, item name, and price are required');
    }

    const bazar = await Bazar.create({ date, itemName, price });

    // Track history
    await addHistoryEntry(
      'bazar_added',
      `Added bazar item: ${itemName} (${price} Taka) for ${date}`,
      req.user._id,
      req.user.name,
      null,
      null,
      { date, itemName, price }
    );

    res.status(201).json(bazar);
  } catch (error) {
    next(error);
  }
};

const getBazarItems = async (req, res, next) => {
  try {
    const bazar = await Bazar.find().sort({ date: 1 });
    res.json(bazar);
  } catch (error) {
    next(error);
  }
};

module.exports = { addBazarItem, getBazarItems };
