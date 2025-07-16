const aiService = require('../services/ai_service');

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

module.exports = {
  rate
};
