const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');
const { LoginPass, UserDetails, Users, sequelize } = require('../models');
const { getLinkedInClient } = require('../services/linkedin_oidc');

router.post('/register', authController.register);

router.post('/login', authController.login);

router.get('/users', authController.getAllUsers);

router.get('/linkedin', async (req, res) => {
  try {
    const client = await getLinkedInClient();
    const authorizationUrl = client.authorizationUrl({
      scope: 'openid profile email',
    });
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

router.get('/linkedin/callback', async (req, res) => {
  try {
    const client = await getLinkedInClient();
    const callbackParams = client.callbackParams(req);
    console.log('🔄 Processing LinkedIn callback with params:', callbackParams);

    const tokenSet = await client.callback(
        'http://localhost:5000/auth/linkedin/callback',
        callbackParams
    );
    console.log('✅ Successfully received access token from LinkedIn');

    const userInfo = await client.userinfo(tokenSet.access_token);
    console.log('👤 LinkedIn user information received:', {
      id: userInfo.sub,
      email: userInfo.email,
      name: userInfo.name
    });

    let existingUser = await LoginPass.findOne({ where: { email: userInfo.email } });
    let userId;

    if (existingUser) {
      userId = existingUser.id;
      console.log(`📋 Existing LinkedIn user found with ID: ${userId}`);
    } else {
      const allUsers = await LoginPass.findAll({
        order: [['id', 'DESC']],
        attributes: ['id']
      });

      let highestId = 0;
      for (const user of allUsers) {
        const numericId = parseInt(user.id);
        if (!isNaN(numericId) && numericId > highestId) {
          highestId = numericId;
        }
      }

      userId = Math.max(1000, highestId + 1);
      console.log(`🆕 Generated new integer ID for LinkedIn user: ${userId}`);
    }

    const linkedinOriginalId = userInfo.sub;

    const loginData = {
      email: userInfo.email,
      pass_hash: 'linkedin_auth',
      id: userId,
      is_manager: false
    };

    const userData = {
      user_id: userId,
      role: 'user',
      seniority: 'junior',
      english_name: userInfo.name || `${userInfo.given_name} ${userInfo.family_name}`
    };

    const userDetailsData = {
      user_id: userId,
      hebrew_name: null,
      phone: null,
      email: userInfo.email,
      city: userInfo.locale?.country || null,
      years_of_xp: null,
      linkedin_url: userInfo.profile || `https://linkedin.com/in/${linkedinOriginalId}`,
      facebook_url: null,
      description: userInfo.bio || `LinkedIn user (Original ID: ${linkedinOriginalId})`
    };

    await Promise.all([
      LoginPass.upsert(loginData, { conflictFields: ['email'] }),
      Users.upsert(userData, { conflictFields: ['user_id'] }),
      UserDetails.upsert(userDetailsData, { conflictFields: ['user_id'] })
    ]);

    console.log('✅ User data successfully stored in all database tables');

    const [verifyLogin, verifyUser, verifyDetails] = await Promise.all([
      LoginPass.findOne({ where: { email: userInfo.email } }),
      Users.findOne({ where: { user_id: userId } }),
      UserDetails.findOne({ where: { user_id: userId } })
    ]);

    console.log('🔍 Data verification results:');
    console.log(`- LoginPass record: ${verifyLogin ? '✅ Saved' : '❌ Missing'}`);
    console.log(`- Users record: ${verifyUser ? '✅ Saved' : '❌ Missing'}`);
    console.log(`- UserDetails record: ${verifyDetails ? '✅ Saved' : '❌ Missing'}`);

    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
    console.log(`🚀 Redirecting to: ${FRONTEND_URL}/user-dashboard`);
    res.redirect(`${FRONTEND_URL}/user-dashboard`);

  } catch (error) {
    console.error('❌ LinkedIn callback processing failed:', error);
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${FRONTEND_URL}/login?error=${encodeURIComponent(error.message || 'LinkedIn authentication failed')}`);
  }
});

router.get('/user/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    const isEmail = identifier.includes('@');
    console.log(`🔍 Looking up user by ${isEmail ? 'email' : 'ID'}: ${identifier}`);

    let loginRecord, userProfile, userDetails;

    if (isEmail) {
      [loginRecord, userDetails] = await Promise.all([
        LoginPass.findOne({ where: { email: identifier } }),
        UserDetails.findOne({ where: { email: identifier } })
      ]);

      const userId = loginRecord?.id || userDetails?.user_id;

      if (userId) {
        userProfile = await Users.findOne({ where: { user_id: userId } });
      }

    } else {
      [loginRecord, userProfile, userDetails] = await Promise.all([
        LoginPass.findOne({ where: { id: identifier } }),
        Users.findOne({ where: { user_id: identifier } }),
        UserDetails.findOne({ where: { user_id: identifier } })
      ]);
    }

    if (!loginRecord && !userProfile && !userDetails) {
      return res.status(404).json({
        success: false,
        message: `User not found with identifier: ${identifier}`
      });
    }

    console.log('✅ User data retrieved successfully');

    res.json({
      success: true,
      user: {
        authentication: loginRecord,
        profile: userProfile,
        details: userDetails
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

router.get('/users-detailed', async (req, res) => {
  try {
    console.log('📊 Retrieving all users with detailed information');

    const usersWithDetails = await Users.findAll({
      include: [
        {
          model: UserDetails,
          required: false
        }
      ],
      order: [['user_id', 'ASC']]
    });

    let allUserData = [];

    if (usersWithDetails.length === 0) {
      console.log('🔄 No users found in users table, checking user_details table');

      const userDetails = await UserDetails.findAll({
        order: [['user_id', 'ASC']]
      });

      for (const detail of userDetails) {
        const [user, loginRecord] = await Promise.all([
          Users.findOne({ where: { user_id: detail.user_id } }),
          LoginPass.findOne({ where: { id: detail.user_id } })
        ]);

        allUserData.push({
          user_id: detail.user_id,
          role: user?.role || 'user',
          seniority: user?.seniority || null,
          english_name: user?.english_name || 'Unknown',
          user_detail: detail,
          authentication: loginRecord ? {
            email: loginRecord.email,
            is_manager: loginRecord.is_manager
          } : null
        });
      }
    } else {
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

router.get('/user-by-email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    console.log(`🔍 Looking up user by email (primary key): ${email}`);

    const loginRecord = await LoginPass.findByPk(email);

    if (!loginRecord) {
      return res.status(404).json({
        success: false,
        message: `User not found with email: ${email}`
      });
    }

    const userId = loginRecord.id;

    const [userProfile, userDetails] = await Promise.all([
      Users.findOne({ where: { user_id: userId } }),
      UserDetails.findOne({ where: { email: email } })
    ]);

    console.log('✅ User data retrieved successfully by primary key');

    res.json({
      success: true,
      lookup_method: 'primary_key_email',
      user: {
        authentication: loginRecord,
        profile: userProfile,
        details: userDetails
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