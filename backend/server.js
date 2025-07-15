require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize, initModels } = require('./models');
const managerRoutes = require('./routes/manager_routes');
const authRoutes = require('./routes/auth_routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const session = require('express-session');
app.use(session({ 
  secret: process.env.LINKEDIN_CLIENT_SECRET || 'fallback-secret', 
  resave: false, 
  saveUninitialized: true 
}));

// Routes
app.use('/managers', managerRoutes);
app.use('/auth', authRoutes);

// Database connection and server startup
sequelize.authenticate()
  .then(() => {
    console.log('✅ DB connected');
    return initModels();
  })
  .then(() => {
    app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));
  })
  .catch((err) => console.error('❌ DB error:', err));
