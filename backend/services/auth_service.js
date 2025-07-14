const bcrypt = require('bcrypt');
const Login_Pass_T = require('../models/login_pass');

exports.registerUser = async ({ email, password, id, is_manager }) => {
  if (!email || !password || typeof id === 'undefined' || typeof is_manager === 'undefined') {
    return {
      status: 400,
      response: { success: false, message: 'Email, password, id, and is_manager are required' }
    };
  }
  console.log('Registering user with email:', email, 'and id:', id);

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

exports.loginUser = async ({ email, password }) => {
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
