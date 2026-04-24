const Bazar = require('../models/Bazar');

const addBazarItem = async (req, res, next) => {
  try {
    const { date, itemName, price } = req.body;
    if (!date || !itemName || price == null) {
      res.status(400);
      throw new Error('Date, item name, and price are required');
    }

    const bazar = await Bazar.create({ date, itemName, price });
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
