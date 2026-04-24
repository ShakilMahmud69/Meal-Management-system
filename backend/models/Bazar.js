const mongoose = require('mongoose');

const bazarSchema = new mongoose.Schema({
  date: { type: String, required: true },
  itemName: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
});

module.exports = mongoose.model('Bazar', bazarSchema);
