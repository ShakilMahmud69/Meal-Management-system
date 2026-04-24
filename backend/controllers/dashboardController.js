const Meal = require('../models/Meal');
const Bazar = require('../models/Bazar');
const User = require('../models/User');

const getDashboard = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    const meals = await Meal.find().populate('userId', 'name').sort({ date: 1 });
    const bazars = await Bazar.find().sort({ date: 1 });

    const totalMeals = meals.reduce((total, meal) => total + meal.lunch + meal.dinner, 0);
    const totalCost = bazars.reduce((total, item) => total + item.price, 0);
    const mealRate = totalMeals > 0 ? totalCost / totalMeals : 0;

    const userSummary = users.map((user) => {
      const userMeals = meals.filter((meal) => meal.userId._id.toString() === user._id.toString());
      const userTotalMeals = userMeals.reduce((sum, meal) => sum + meal.lunch + meal.dinner, 0);
      const cost = Number((userTotalMeals * mealRate).toFixed(2));
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        totalMeals: userTotalMeals,
        cost,
      };
    });

    res.json({
      users: userSummary,
      meals,
      bazars,
      totalMeals,
      totalCost,
      mealRate: Number(mealRate.toFixed(2)),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard };
