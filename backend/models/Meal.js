const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  lunch: { type: Number, required: true, enum: [0, 1], default: 0 },
  dinner: { type: Number, required: true, enum: [0, 1], default: 0 },
});

mealSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Meal', mealSchema);
