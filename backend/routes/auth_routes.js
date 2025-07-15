/**
 * Authentication Routes
 * 
 * This file handles all authentication-related endpoints including:
 * - Traditional email/password registration and login
 * - LinkedIn OAuth integration for social login
 * - User data retrieval and management
 * 
 * Database Tables Used:
 * - login_pass: Stores authentication credentials and user IDs
 * - users: Stores basic user profile information
 * - user_details: Stores detailed user information (LinkedIn data, personal details)
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');
const { LoginPass, UserDetails, Users, sequelize } = require('../models');
const { getLinkedInClient } = require('../services/linkedin_oidc');

// ========================================
// TRADITIONAL AUTHENTICATION ENDPOINTS
// ========================================

/**
 * POST /auth/register
 * Register a new user with email and password
 */
router.post('/register', authController.register);

/**
 * POST /auth/login
 * Login with email and password
 */
router.post('/login', authController.login);

/**
 * GET /auth/users
 * Get all registered users (basic information)
 */
router.get('/users', authController.getAllUsers);

// ========================================
// LINKEDIN OAUTH INTEGRATION
// ========================================

/**
 * GET /auth/linkedin
 * 
 * Step 1 of LinkedIn OAuth flow: Redirect user to LinkedIn authorization page
 * 
 * Flow:
 * 1. User clicks "Login with LinkedIn" button
 * 2. This endpoint generates LinkedIn authorization URL
 * 3. User is redirected to LinkedIn to grant permissions
 * 4. LinkedIn redirects back to /auth/linkedin/callback
 */
router.get('/linkedin', async (req, res) => {
  try {
    // Initialize LinkedIn OpenID Connect client
    const client = await getLinkedInClient();
    
    // Generate authorization URL with required scopes
    // openid: Required for OpenID Connect
    // profile: Access to basic profile information (name, etc.)
    // email: Access to user's email address
    const authorizationUrl = client.authorizationUrl({
      scope: 'openid profile email',
    });
    
    // Redirect user to LinkedIn authorization page
    res.redirect(authorizationUrl);
  } catch (error) {
    console.error('❌ LinkedIn authorization redirect error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to initiate LinkedIn authentication',
      details: error.message 
    });
  }
});

/**
 * GET /auth/linkedin/callback
 * 
 * Step 2 of LinkedIn OAuth flow: Handle callback from LinkedIn
 * 
 * Flow:
 * 1. LinkedIn redirects here with authorization code
 * 2. Exchange authorization code for access token
 * 3. Use access token to fetch user information
 * 4. Store user data across three database tables
 * 5. Return success response with user data
 */
router.get('/linkedin/callback', async (req, res) => {
  try {
    // Initialize LinkedIn client
    const client = await getLinkedInClient();
    
    // Extract callback parameters (code, state) from LinkedIn
    const callbackParams = client.callbackParams(req);
    console.log('🔄 Processing LinkedIn callback with params:', callbackParams);
    
    // Exchange authorization code for access token
    const tokenSet = await client.callback(
      'http://localhost:5000/auth/linkedin/callback', 
      callbackParams
    );
    console.log('✅ Successfully received access token from LinkedIn');
    
    // Use access token to fetch user information from LinkedIn
    const userInfo = await client.userinfo(tokenSet.access_token);
    console.log('👤 LinkedIn user information received:', {
      id: userInfo.sub,
      email: userInfo.email,
      name: userInfo.name
    });

    // Generate integer user ID for LinkedIn users
    // Check if user already exists by email
    let existingUser = await LoginPass.findOne({ where: { email: userInfo.email } });
    let userId;
    
    if (existingUser) {
      // User exists, use their existing integer ID
      userId = existingUser.id;
      console.log(`📋 Existing LinkedIn user found with ID: ${userId}`);
    } else {
      // New user, generate next available integer ID
      // Get all users and find the highest numeric ID
      const allUsers = await LoginPass.findAll({
        order: [['id', 'DESC']],
        attributes: ['id']
      });
      
      // Filter for numeric IDs only and find the highest
      let highestId = 0;
      for (const user of allUsers) {
        const numericId = parseInt(user.id);
        if (!isNaN(numericId) && numericId > highestId) {
          highestId = numericId;
        }
      }
      
      // Generate next integer ID (start from 1000 for LinkedIn users to avoid conflicts)
      userId = Math.max(1000, highestId + 1);
      console.log(`🆕 Generated new integer ID for LinkedIn user: ${userId}`);
    }

    // Store LinkedIn's original ID for reference
    const linkedinOriginalId = userInfo.sub;

    // ========================================
    // PREPARE DATA FOR DATABASE STORAGE
    // ========================================

    // 1. Login/Authentication data for 'login_pass' table
    const loginData = {
      email: userInfo.email,
      pass_hash: 'linkedin_auth', // Special marker for LinkedIn users (no password)
      id: userId, // Generated integer ID
      is_manager: false // Default to regular user, can be updated later
    };

    // 2. Basic profile data for 'users' table
    const userData = {
      user_id: userId,
      role: 'user', // Default role
      seniority: 'junior', // Default seniority instead of null
      english_name: userInfo.name || `${userInfo.given_name} ${userInfo.family_name}`
    };

    // 3. Detailed user information for 'user_details' table
    const userDetailsData = {
      user_id: userId,
      hebrew_name: null, // To be filled later
      phone: null, // LinkedIn doesn't provide phone numbers in basic scope
      email: userInfo.email,
      city: userInfo.locale?.country || null, // Extract country from locale object
      years_of_xp: null, // To be filled later
      linkedin_url: userInfo.profile || `https://linkedin.com/in/${linkedinOriginalId}`,
      facebook_url: null, // To be filled later
      description: userInfo.bio || `LinkedIn user (Original ID: ${linkedinOriginalId})` // Include original LinkedIn ID for reference
    };

    // ========================================
    // STORE DATA IN DATABASE
    // ========================================

    // Use upsert to either insert new record or update existing one
    // This prevents duplicate users if they log in multiple times
    await Promise.all([
      LoginPass.upsert(loginData, { conflictFields: ['email'] }),
      Users.upsert(userData, { conflictFields: ['user_id'] }),
      UserDetails.upsert(userDetailsData, { conflictFields: ['user_id'] })
    ]);

    console.log('✅ User data successfully stored in all database tables');

    // ========================================
    // VERIFY DATA WAS SAVED CORRECTLY
    // ========================================
    
    // Double-check that data was actually saved
    const [verifyLogin, verifyUser, verifyDetails] = await Promise.all([
      LoginPass.findOne({ where: { email: userInfo.email } }),
      Users.findOne({ where: { user_id: userId } }),
      UserDetails.findOne({ where: { user_id: userId } })
    ]);

    console.log('🔍 Data verification results:');
    console.log(`- LoginPass record: ${verifyLogin ? '✅ Saved' : '❌ Missing'}`);
    console.log(`- Users record: ${verifyUser ? '✅ Saved' : '❌ Missing'}`);
    console.log(`- UserDetails record: ${verifyDetails ? '✅ Saved' : '❌ Missing'}`);

    // Return success response with user information
    res.json({ 
      success: true,
      message: 'LinkedIn authentication successful',
      user: {
        id: userId, // Integer ID
        email: userInfo.email,
        name: userInfo.name,
        linkedin_profile: userDetailsData.linkedin_url,
        linkedin_original_id: linkedinOriginalId // For debugging/reference
      },
      // For debugging: show what data was stored
      stored_data: {
        login_record: loginData,
        user_profile: userData,
        detailed_info: userDetailsData
      },
      // Verification results
      verification: {
        login_pass_saved: !!verifyLogin,
        users_saved: !!verifyUser,
        user_details_saved: !!verifyDetails,
        all_tables_populated: !!(verifyLogin && verifyUser && verifyDetails)
      }
    });

  } catch (error) {
    console.error('❌ LinkedIn callback processing failed:', error);
    res.status(500).json({ 
      success: false, 
      error: 'LinkedIn authentication failed',
      details: error.message 
    });
  }
});

// ========================================
// USER DATA RETRIEVAL ENDPOINTS
// ========================================

/**
 * GET /auth/user/:identifier
 * 
 * Get comprehensive user information by ID or email
 * 
 * @param identifier - Can be either user_id or email address
 * 
 * Returns data from all three tables:
 * - login_pass: Authentication info
 * - users: Basic profile
 * - user_details: Detailed information
 */
router.get('/user/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    
    // Determine if identifier is email or user ID
    const isEmail = identifier.includes('@');
    console.log(`🔍 Looking up user by ${isEmail ? 'email' : 'ID'}: ${identifier}`);
    
    let loginRecord, userProfile, userDetails;

    if (isEmail) {
      // For email searches: query login_pass and user_details by email
      // Then use the user_id to query the users table
      [loginRecord, userDetails] = await Promise.all([
        LoginPass.findOne({ where: { email: identifier } }),
        UserDetails.findOne({ where: { email: identifier } })
      ]);

      // Get user_id from either login_pass or user_details
      const userId = loginRecord?.id || userDetails?.user_id;
      
      if (userId) {
        // Query users table by user_id
        userProfile = await Users.findOne({ where: { user_id: userId } });
      }

    } else {
      // For ID searches: query all tables by their respective ID fields
      [loginRecord, userProfile, userDetails] = await Promise.all([
        LoginPass.findOne({ where: { id: identifier } }),
        Users.findOne({ where: { user_id: identifier } }),
        UserDetails.findOne({ where: { user_id: identifier } })
      ]);
    }

    // Check if user exists in any table
    if (!loginRecord && !userProfile && !userDetails) {
      return res.status(404).json({ 
        success: false, 
        message: `User not found with identifier: ${identifier}` 
      });
    }

    console.log('✅ User data retrieved successfully');

    // Return comprehensive user information
    res.json({
      success: true,
      user: {
        authentication: loginRecord,   // From login_pass table
        profile: userProfile,         // From users table
        details: userDetails         // From user_details table
      }
    });

  } catch (error) {
    console.error('❌ Error retrieving user details:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve user information',
      details: error.message 
    });
  }
});

/**
 * GET /auth/users-detailed
 * 
 * Get all users with their detailed information
 * Uses multiple approaches to ensure we get all user data
 * 
 * Useful for:
 * - Admin panels
 * - User management interfaces
 * - Analytics and reporting
 */
router.get('/users-detailed', async (req, res) => {
  try {
    console.log('📊 Retrieving all users with detailed information');

    // Approach 1: Try JOIN from users table (ideal case)
    const usersWithDetails = await Users.findAll({
      include: [
        {
          model: UserDetails,
          required: false // LEFT JOIN (include users without details)
        }
      ],
      order: [['user_id', 'ASC']] // Sort by user ID for consistent ordering
    });

    // Approach 2: If no users found, get all user_details and try to JOIN users
    let allUserData = [];
    
    if (usersWithDetails.length === 0) {
      console.log('🔄 No users found in users table, checking user_details table');
      
      const userDetails = await UserDetails.findAll({
        order: [['user_id', 'ASC']]
      });

      // For each user_detail, try to find corresponding user and login data
      for (const detail of userDetails) {
        const [user, loginRecord] = await Promise.all([
          Users.findOne({ where: { user_id: detail.user_id } }),
          LoginPass.findOne({ where: { id: detail.user_id } })
        ]);

        allUserData.push({
          user_id: detail.user_id,
          // From users table (may be null)
          role: user?.role || 'user',
          seniority: user?.seniority || null,
          english_name: user?.english_name || 'Unknown',
          // From user_details table
          user_detail: detail,
          // From login_pass table (may be null)
          authentication: loginRecord ? {
            email: loginRecord.email,
            is_manager: loginRecord.is_manager
          } : null
        });
      }
    } else {
      // Use the JOIN results and enhance with login data
      for (const user of usersWithDetails) {
        const loginRecord = await LoginPass.findOne({ where: { id: user.user_id } });
        
        allUserData.push({
          user_id: user.user_id,
          role: user.role,
          seniority: user.seniority,
          english_name: user.english_name,
          user_detail: user.user_detail,
          authentication: loginRecord ? {
            email: loginRecord.email,
            is_manager: loginRecord.is_manager
          } : null
        });
      }
    }

    console.log(`✅ Retrieved ${allUserData.length} users with detailed information`);

    res.json({
      success: true,
      count: allUserData.length,
      users: allUserData,
      source: usersWithDetails.length > 0 ? 'users_table_join' : 'user_details_table'
    });

  } catch (error) {
    console.error('❌ Error retrieving detailed user list:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve user list',
      details: error.message 
    });
  }
});

/**
 * GET /auth/user-by-email/:email
 * 
 * Get comprehensive user information by email (primary key)
 * Optimized for email-based lookups using the primary key
 * 
 * @param email - Email address (primary key in login_pass table)
 * 
 * Returns data from all three tables with enhanced performance
 */
router.get('/user-by-email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    console.log(`🔍 Looking up user by email (primary key): ${email}`);
    
    // Start with login_pass table since email is the primary key there
    const loginRecord = await LoginPass.findByPk(email);
    
    if (!loginRecord) {
      return res.status(404).json({ 
        success: false, 
        message: `User not found with email: ${email}` 
      });
    }

    // Use the user ID to get related data from other tables
    const userId = loginRecord.id;
    
    const [userProfile, userDetails] = await Promise.all([
      Users.findOne({ where: { user_id: userId } }),
      UserDetails.findOne({ where: { email: email } }) // Also search by email for redundancy
    ]);

    console.log('✅ User data retrieved successfully by primary key');

    // Return comprehensive user information
    res.json({
      success: true,
      lookup_method: 'primary_key_email',
      user: {
        authentication: loginRecord,   // From login_pass table (primary source)
        profile: userProfile,         // From users table
        details: userDetails         // From user_details table
      }
    });

  } catch (error) {
    console.error('❌ Error retrieving user by email (primary key):', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve user information',
      details: error.message 
    });
  }
});


module.exports = router;