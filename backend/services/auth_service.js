const bcrypt = require('bcrypt');
const Login_Pass_T = require('../models/login_pass');

// Get all users (simple endpoint for testing)
const getAllUsers = async () => {
  try {
    const users = await Login_Pass_T.findAll({
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
  if (!email || !password) {
    return {
      status: 400,
      response: { success: false, message: 'Email, password, id, and is_manager are required' }
    };
  }
  console.log('Registering user with email:', email);

  const existingUser = await Login_Pass_T.findOne({ where: { email } });

  console.log('Checking for existing user:', existingUser ? 'User exists' : 'No existing user found');

  if (existingUser) {
    return {
      status: 400,
      response: { success: false, message: 'User already exists with this email' }
    };
  }

  console.log('password:', password);
  const pass_hash = await bcrypt.hash(password, 10);
  const newUser = await Login_Pass_T.create({
    email,
    pass_hash,
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
  const user = await Login_Pass_T.findOne({ where: { email } });
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
