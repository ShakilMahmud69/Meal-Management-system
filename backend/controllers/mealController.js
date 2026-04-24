const Meal = require('../models/Meal');
const User = require('../models/User');

const createOrUpdateMeal = async (req, res, next) => {
  try {
    const { date, lunch, dinner, userId: requestedUserId } = req.body;
    const userId = req.user.isAdmin && requestedUserId ? requestedUserId : req.user._id;

    const meal = await Meal.findOneAndUpdate(
      { userId, date },
      { lunch, dinner },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json(meal);
  } catch (error) {
    next(error);
  }
};

const createDateMeals = async (req, res, next) => {
  try {
    const { date } = req.body;
    if (!date) {
      res.status(400);
      throw new Error('Date is required');
    }

    const users = await User.find().select('_id');
    await Promise.all(
      users.map((user) =>
        Meal.findOneAndUpdate(
          { userId: user._id, date },
          { lunch: 0, dinner: 0 },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        )
      )
    );

    const meals = await Meal.find({ date }).populate('userId', 'name');
    res.status(201).json(meals);
  } catch (error) {
    next(error);
  }
};

const getMeals = async (req, res, next) => {
  try {
    const meals = await Meal.find({ userId: req.user._id }).sort({ date: 1 });
    res.json(meals);
  } catch (error) {
    next(error);
  }
};

const getAllMeals = async (req, res, next) => {
  try {
    const filter = req.user.isAdmin ? {} : { userId: req.user._id };
    const meals = await Meal.find(filter).populate('userId', 'name email').sort({ date: 1 });
    res.json(meals);
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrUpdateMeal, createDateMeals, getMeals, getAllMeals };
