require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize, initModels } = require('./models');
const managerRoutes = require('./routes/manager_routes');
const authRoutes = require('./routes/auth_routes');
// const communityRoutes = require('./routes/community_routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/managers', managerRoutes);
app.use('/auth', authRoutes);
// app.use('/communities', communityRoutes);


sequelize.authenticate()
  .then(() => {
    console.log('✅ DB connected');
    return initModels();
  })
  .then(() => {
    app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));
  })
  .catch((err) => console.error('❌ DB error:', err));
