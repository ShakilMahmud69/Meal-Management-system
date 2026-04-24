const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Meal = require('./models/Meal');
const Bazar = require('./models/Bazar');

dotenv.config();

const sampleUsers = [
  { name: 'Shakil', email: 'shakil@example.com', isAdmin: true },
  { name: 'Ayon', email: 'ayon@example.com' },
  { name: 'Roby', email: 'roby@example.com' },
  { name: 'Ahnaf', email: 'ahnaf@example.com' },
];

const sampleMeals = [
  { date: '2026-05-01', lunch: 1, dinner: 1 },
  { date: '2026-05-02', lunch: 0, dinner: 1 },
  { date: '2026-05-03', lunch: 1, dinner: 0 },
];

const sampleBazar = [
  { date: '2026-05-01', itemName: 'Rice', price: 1200 },
  { date: '2026-05-02', itemName: 'Vegetables', price: 650 },
  { date: '2026-05-03', itemName: 'Chicken', price: 950 },
];

const seed = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Meal.deleteMany();
    await Bazar.deleteMany();

    const password = await bcrypt.hash('password123', 10);
    const createdUsers = await Promise.all(
      sampleUsers.map((user) => User.create({ ...user, password }))
    );

    for (const user of createdUsers) {
      for (const meal of sampleMeals) {
        await Meal.create({ userId: user._id, ...meal });
      }
    }

    await Bazar.insertMany(sampleBazar);
    console.log('Seed data created successfully.');
    process.exit();
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
