require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize, initModels } = require('./models');
const managerRoutes = require('./routes/manager_routes');
const authRoutes = require('./routes/auth_routes');
const communityRoutes = require('./routes/community_routes');
const communityMembersRoutes = require('./routes/community_members_routes');
const usersRoutes = require('./routes/users_routes');
const eventsRoutes = require('./routes/events_routes');
const userDetailsRoutes = require('./routes/user_details_routes');
const jobHistoryRoutes = require('./routes/job_history_routes');
const messageRoutes = require('./routes/message_routes');



const app = express();
app.use(cors());
app.use(express.json());

app.use('/managers', managerRoutes);
app.use('/auth', authRoutes);
app.use('/communities', communityRoutes);
app.use('/community-members', communityMembersRoutes);
app.use('/users', usersRoutes);
app.use('/user-details', userDetailsRoutes);
app.use('/events', eventsRoutes);
app.use('/job-history', jobHistoryRoutes);
app.use('/messages', messageRoutes);


sequelize.authenticate()
  .then(() => {
    console.log('✅ DB connected');
    return initModels();
  })
  .then(() => {
    app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));
  })
  .catch((err) => console.error('❌ DB error:', err));