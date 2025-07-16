const axios = require('axios');
const conf = require('./config');


const getCompatibilityScores = (managerPrompt, userList) => {
  console.log('Sending prompt to AI backend...');
  console.log('Prompt:', managerPrompt);
  console.log(`Users count: ${userList.length}`);

  return axios.post(conf.AI_API_URL, {
      manager_prompt: managerPrompt,
      user_list: userList
  })
  .then(response => {
      console.log('Received response from AI backend');

      const scores = response.data; // [{ user_id: 101, score: 85 }, ...]
      console.log('Raw scores from AI:', scores);

      // Create a lookup for scores
      const scoreMap = {};
      for (const item of scores) {
        scoreMap[item.user_id] = item.score;
      }

      // Merge scores into user list
      const merged = userList.map(user => ({
        ...user,
        score: scoreMap[user.user_id] ?? 0
      }));

      // Sort by score descending
      merged.sort((a, b) => b.score - a.score);

      console.log('Final merged and sorted user list');
      return merged;
  })
  .catch(err => {
      console.error('AI service error:', err.response?.data || err.message);
      throw new Error('Failed to get compatibility scores from AI');
  });
};


module.exports = {
  getCompatibilityScores
};
