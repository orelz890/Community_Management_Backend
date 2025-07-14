const authService = require('../services/auth_service');

const register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(result.status).json(result.response);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    res.status(result.status).json(result.response);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
};

module.exports = {register, login};