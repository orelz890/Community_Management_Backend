const axios = require('axios');
const conf = require('./config');

const getCompatibilityScores = async (managerPrompt, userList) => {
    console.log('[AIService] Calling AI server with prompt and user list...');

    return axios.post(conf.AI_API_URL, {
        manager_prompt: managerPrompt,
        user_list: userList
    }, {
        timeout: 5000 // 5 seconds
    })
    .then(response => {
        console.log('[AIService] Received response from AI');
        const scores = response.data;

        const scoreMap = {};
        for (const item of scores) {
            scoreMap[item.user_id] = item.score;
        }

        const merged = userList.map(user => ({
            ...user,
            score: scoreMap[user.user_id] || 0
        }));

        merged.sort((a, b) => b.score - a.score);
        return merged;
    })
    .catch(err => {
        if (err.code === 'ECONNABORTED') {
            console.error('[AIService] Request to AI server timed out');
        } else {
            console.error('[AIService] Error response:', err.response?.data || err.message);
        }
          throw new Error('Failed to get compatibility scores from AI');
    });
};


module.exports = {
  getCompatibilityScores
};
