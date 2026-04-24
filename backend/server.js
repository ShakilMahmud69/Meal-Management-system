const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const mealRoutes = require('./routes/mealRoutes');
const bazarRoutes = require('./routes/bazarRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config({ path: path.join(__dirname, '.env') });
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send({ message: 'Meal Management API is running' }));
app.use('/api/auth', authRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/bazar', bazarRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5000;

const server = app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please stop the process using this port and restart the server.`);
  } else {
    console.error('Server failed to start:', error);
  }
  process.exit(1);
});
