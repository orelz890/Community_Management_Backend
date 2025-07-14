// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./db/conn');
const Manager = require('./models/manager');

const app = express();
app.use(cors());
app.use(express.json());

// Test DB connection
sequelize.authenticate()
  .then(() => console.log('✅ Connected to MySQL'))
  .catch(err => console.error('❌ DB connection error:', err));

// CRUD Routes
app.get('/managers', async (req, res) => {
  const managers = await Manager.findAll();
  res.json(managers);
});

app.post('/managers', async (req, res) => {
  const newManager = await Manager.create(req.body);
  res.json(newManager);
});

app.put('/managers/:id', async (req, res) => {
  const { id } = req.params;
  await Manager.update(req.body, { where: { manager_id: id } });
  res.json({ message: 'Updated' });
});

app.delete('/managers/:id', async (req, res) => {
  const { id } = req.params;
  await Manager.destroy({ where: { manager_id: id } });
  res.json({ message: 'Deleted' });
});

// Start server
app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));
