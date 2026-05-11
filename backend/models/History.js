const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  action: { type: String, required: true }, // e.g., 'meal_update', 'user_removed', 'bazar_added'
  description: { type: String, required: true },
  modifierId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  modifierName: { type: String, required: true },
  targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional, for user-related actions
  targetUserName: { type: String }, // optional
  date: { type: Date, default: Date.now },
  details: { type: mongoose.Schema.Types.Mixed } // additional data like old/new values
});

module.exports = mongoose.model('History', historySchema);