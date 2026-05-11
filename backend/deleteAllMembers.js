const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Delete all users
const deleteAllUsers = async () => {
  try {
    const User = require('./models/User');
    const Meal = require('./models/Meal');
    const History = require('./models/History');

    // Delete all meals first (due to foreign key constraints)
    const mealResult = await Meal.deleteMany({});
    console.log(`Deleted ${mealResult.deletedCount} meals`);

    // Delete all history records
    const historyResult = await History.deleteMany({});
    console.log(`Deleted ${historyResult.deletedCount} history records`);

    // Delete all users
    const userResult = await User.deleteMany({});
    console.log(`Deleted ${userResult.deletedCount} users`);

    console.log('All users, meals, and history records have been deleted successfully!');
  } catch (error) {
    console.error('Error deleting data:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

// Run the script
connectDB().then(() => {
  deleteAllUsers();
});