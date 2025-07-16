const aiService = require('../services/ai_service');
const usersService = require('../services/entities_services/users_service');

const rate = async (req, res) => {
  const { manager_prompt, user_list } = req.body;

  try {
    const result = await aiService.getCompatibilityScores(manager_prompt, user_list);
    res.json(result);
  } catch (err) {
    console.error('❌ Controller error:', err.message);
    res.status(500).json({ error: 'AI scoring failed.' });
  }
};

const rateAll = async (req, res) => {
  const { manager_prompt } = req.body;

  if (!manager_prompt) {
      return res.status(400).json({ error: 'Missing manager_prompt' });
  }

  try {
      const allUsers = await usersService.getAllWithDetails();

      const result = await aiService.getCompatibilityScores(manager_prompt, allUsers);
      res.json(result);
  } catch (err) {
      console.error('❌ Controller error in /rate_all:', err.message);
      res.status(500).json({ error: 'AI scoring for all users failed.' });
  }
};

module.exports = {
  rate,
  rateAll
};
