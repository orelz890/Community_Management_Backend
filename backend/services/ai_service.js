const axios = require('axios');
const conf = require('./config');


const getCompatibilityScores = async (managerPrompt, userList) => {
  try {
        const response = await axios.post(conf.AI_API_URL, {
          manager_prompt: managerPrompt,
          user_list: userList
        });

        // Sort the result by score in descending order
        const sorted = response.data.sort((a, b) => b.score - a.score);
        return sorted;
  } 
  catch (err) {
      console.error('❌ AI service error:', err.response?.data || err.message);
      throw new Error('Failed to get compatibility scores from AI');
  }
};

module.exports = {
  getCompatibilityScores
};
