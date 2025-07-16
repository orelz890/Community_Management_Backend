const aiService = require('../services/ai_service');
const usersService = require('../services/entities_services/users_service');

const rate = async (req, res) => {
  const { manager_prompt, user_list } = req.body;

  try {
      const result = await aiService.getCompatibilityScores(manager_prompt, user_list);
      res.json(result);
  } catch (err) {
      console.error('Controller error:', err.message);
      res.status(500).json({ error: 'AI scoring failed.' });
  }
};

const rateAll = (req, res) => {
  const { manager_prompt } = req.body;

  console.log('📥 Received /rate_all request with prompt:', manager_prompt);

  if (!manager_prompt) {
      console.warn('Missing manager_prompt in request body');
      return res.status(400).json({ error: 'Missing manager_prompt' });
  }

  console.log('🔍 Fetching all users with details...');
  usersService.getAllWithDetails()
  .then(allUsers => {
      console.log(`Retrieved ${allUsers.length} users from DB`);
      console.log('Sending data to AI for scoring...');
      return aiService.getCompatibilityScores(manager_prompt, allUsers);
  })
  .then(result => {
      console.log('Received compatibility scores from AI');
      res.json(result);
  })
  .catch(err => {
      console.error('Controller error in /rate_all:', err.message);
      res.status(500).json({ error: 'AI scoring for all users failed.' });
  });
};


module.exports = {
  rate,
  rateAll
};
