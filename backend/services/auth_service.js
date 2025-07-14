const bcrypt = require('bcrypt');
const LoginPass = require('../models/login_pass');

// Get all users (simple endpoint for testing)
const getAllUsers = async () => {
  try {
    const users = await LoginPass.findAll({
      attributes: ['id', 'email', 'is_manager']
    });
    return {
      status: 200,
      response: {
        success: true,
        count: users.length,
        users
      }
    };
  } catch (error) {
    return {
      status: 500,
      response: {
        success: false,
        message: 'Failed to get users',
        error: error.message
      }
    };
  }
};

const registerUser = async ({ email, password, id, is_manager }) => {
  if (!email || !password || typeof id === 'undefined' || typeof is_manager === 'undefined') {
    return {
      status: 400,
      response: { success: false, message: 'Email, password, id, and is_manager are required' }
    };
  }
  const existingUser = await LoginPass.findOne({ where: { email } });
  if (existingUser) {
    return {
      status: 400,
      response: { success: false, message: 'User already exists with this email' }
    };
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await LoginPass.create({
    email,
    pass_hash: hashedPassword,
    id,
    is_manager
  });
  return {
    status: 201,
    response: {
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        is_manager: newUser.is_manager
      }
    }
  };
};

const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    return {
      status: 400,
      response: { success: false, message: 'Email and password are required' }
    };
  }
  const user = await LoginPass.findOne({ where: { email } });
  if (!user) {
    return {
      status: 401,
      response: { success: false, message: 'Invalid email or password' }
    };
  }
  const isValidPassword = await bcrypt.compare(password, user.pass_hash);
  if (!isValidPassword) {
    return {
      status: 401,
      response: { success: false, message: 'Invalid email or password' }
    };
  }
  return {
    status: 200,
    response: {
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        is_manager: user.is_manager
      }
    }
  };
};

module.exports = { getAllUsers, registerUser, loginUser };