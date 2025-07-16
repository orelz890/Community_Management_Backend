require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize, initModels } = require('./models/entities');
const managerRoutes = require('./routes/entities_routes/manager_routes');
const authRoutes = require('./routes/entities_routes/auth_routes');
const communityRoutes = require('./routes/entities_routes/community_routes');
const communityMembersRoutes = require('./routes/entities_routes/community_members_routes');
const usersRoutes = require('./routes/entities_routes/users_routes');
const eventsRoutes = require('./routes/entities_routes/events_routes');
const userDetailsRoutes = require('./routes/entities_routes/user_details_routes');
const jobHistoryRoutes = require('./routes/entities_routes/job_history_routes');
const messageRoutes = require('./routes/entities_routes/message_routes');
const aiRoutes = require('./routes/ai_routes');



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
app.use('/ai', aiRoutes);


sequelize.authenticate()
  .then(() => {
    console.log('✅ DB connected');
    return initModels();
  })
  .then(() => {
    app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));
  })
  .catch((err) => console.error('❌ DB error:', err));