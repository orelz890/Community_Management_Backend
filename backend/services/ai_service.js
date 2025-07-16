const axios = require('axios');
const conf = require('./config');


const getCompatibilityScores = async (managerPrompt, userList) => {
  try {
    const response = await axios.post(conf.AI_API_URL, {
      manager_prompt: managerPrompt,
      user_list: userList
    });

    return response.data;
  } catch (err) {
    console.error('❌ AI service error:', err.response?.data || err.message);
    throw new Error('Failed to get compatibility scores from AI');
  }
};

module.exports = {
  getCompatibilityScores
};
