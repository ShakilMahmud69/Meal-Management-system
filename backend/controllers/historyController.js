const History = require('../models/History');

const getHistory = async (req, res, next) => {
  try {
    const history = await History.find()
      .populate('modifierId', 'name email')
      .populate('targetUserId', 'name email')
      .sort({ date: -1 })
      .limit(100); // Limit to last 100 entries

    res.json(history);
  } catch (error) {
    next(error);
  }
};

const addHistoryEntry = async (action, description, modifierId, modifierName, targetUserId = null, targetUserName = null, details = {}) => {
  try {
    const historyEntry = new History({
      action,
      description,
      modifierId,
      modifierName,
      targetUserId,
      targetUserName,
      details
    });
    await historyEntry.save();
  } catch (error) {
    console.error('Error saving history:', error);
  }
};

module.exports = {
  getHistory,
  addHistoryEntry
};