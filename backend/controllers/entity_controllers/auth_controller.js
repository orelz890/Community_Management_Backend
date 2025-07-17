const authService = require('../../services/entities_services/auth_service');

// Get all users (simple endpoint for testing)
const getAllUsers = async (req, res) => {
  try {
    const result = await authService.getAllUsers();
    res.status(result.status).json(result.response);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get users', error: error.message });
  }
};

const register = async (req, res) => {
  try {
    console.log('Registering user with data:', req.body);


    const result = await authService.registerUser(req.body);

    console.log('Registration result:', result);

    res.status(result.status).json(result.response);
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
};


const login = async (req, res) => {
  try {
    // Support both POST (body) and GET (query) login
    const { email, password } = req.method === 'GET' ? req.query : req.body;
    const result = await authService.loginUser({ email, password });
    res.status(result.status).json(result.response);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
};

module.exports = {register, login, getAllUsers};