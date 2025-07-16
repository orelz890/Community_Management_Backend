/**
 * Authentication Routes
 * 
 * This file handles all authentication-related endpoints including:
 * - Traditional email/password authentication
 * - LinkedIn OAuth integration
 * - User data retrieval and management
 * 
 * Routes Overview:
 * - POST /auth/register - Register new user
 * - POST /auth/login - Authenticate user
 * - GET /auth/users - List all users
 * - GET /auth/linkedin - Start LinkedIn OAuth
 * - GET /auth/linkedin/callback - Handle LinkedIn response
 * - GET /auth/user/:identifier - Get user by ID or email
 * - GET /auth/users-detailed - Get all users with full details
 * - GET /auth/user-by-email/:email - Get user by email (optimized)
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');
const { LoginPass_T, UserDetails, Users, sequelize } = require('../models');
const { getLinkedInClient } = require('../services/linkedin_oidc');

// ================================
// TRADITIONAL AUTHENTICATION ROUTES
// ================================

/**
 * Register new user with email and password
 * POST /auth/register
 */
router.post('/register', authController.register);

/**
 * Login user with email and password
 * POST /auth/login
 */
router.post('/login', authController.login);

/**
 * Get all registered users (simple list)
 * GET /auth/users
 */
router.get('/users', authController.getAllUsers);

// ================================
// LINKEDIN OAUTH INTEGRATION
// ================================

/**
 * Initiate LinkedIn OAuth flow
 * GET /auth/linkedin
 * 
 * Redirects user to LinkedIn authorization page
 */
router.get('/linkedin', async (req, res) => {
    try {
        const client = await getLinkedInClient();
        const authorizationUrl = client.authorizationUrl({
            scope: 'openid profile email',
        });
        
        console.log('🔗 Initiating LinkedIn OAuth flow');
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
 * Handle LinkedIn OAuth callback
 * GET /auth/linkedin/callback
 * 
 * Processes LinkedIn response and creates/updates user in database
 * Demonstrates the complete integration flow with all 3 tables
 */
router.get('/linkedin/callback', async (req, res) => {
    try {
        // ==================
        // 1. PROCESS LINKEDIN RESPONSE
        // ==================
        const client = await getLinkedInClient();
        const callbackParams = client.callbackParams(req);
        console.log('🔄 Processing LinkedIn callback...');

        // Exchange code for access token
        const tokenSet = await client.callback(
            'http://localhost:5000/auth/linkedin/callback',
            callbackParams
        );
        console.log('✅ Successfully received access token from LinkedIn');

        // Get user information from LinkedIn
        const userInfo = await client.userinfo(tokenSet.access_token);
        console.log('👤 LinkedIn user information received:', {
            id: userInfo.sub,
            email: userInfo.email,
            name: userInfo.name
        });

        // ==================
        // 2. CHECK IF USER EXISTS
        // ==================
        let existingUser = await LoginPass_T.findOne({ where: { email: userInfo.email } });
        let userId;

        if (existingUser) {
            // User already exists - use existing ID
            userId = existingUser.id;
            console.log(`📋 Existing LinkedIn user found with ID: ${userId}`);
        } else {
            // New user - generate unique integer ID
            userId = await generateNextUserId();
            console.log(`🆕 Generated new integer ID for LinkedIn user: ${userId}`);
        }

        // ==================
        // 3. PREPARE DATA FOR ALL TABLES
        // ==================
        const linkedinOriginalId = userInfo.sub;

        // LoginPass table data (authentication)
        const loginData = {
            email: userInfo.email,
            pass_hash: 'linkedin_auth', // Special marker for LinkedIn users
            id: userId,
            is_manager: false
        };

        // Users table data (basic profile)
        const userData = {
            user_id: userId,
            role: 'user',
            seniority: 'junior',
            english_name: userInfo.name || `${userInfo.given_name} ${userInfo.family_name}`
        };

        // UserDetails table data (extended profile)
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

        // ==================
        // 4. SAVE TO DATABASE (ALL 3 TABLES)
        // ==================
        await Promise.all([
            LoginPass_T.upsert(loginData, { conflictFields: ['email'] }),
            Users.upsert(userData, { conflictFields: ['user_id'] }),
            UserDetails.upsert(userDetailsData, { conflictFields: ['user_id'] })
        ]);

        console.log('✅ User data successfully stored in all database tables');

        // ==================
        // 5. VERIFY DATA WAS SAVED CORRECTLY
        // ==================
        const [verifyLogin, verifyUser, verifyDetails] = await Promise.all([
            LoginPass_T.findOne({ where: { email: userInfo.email } }),
            Users.findOne({ where: { user_id: userId } }),
            UserDetails.findOne({ where: { user_id: userId } })
        ]);

        // Display beautiful verification summary
        displayLinkedInLoginSummary(userInfo, userId, verifyLogin, verifyUser, verifyDetails);

        // ==================
        // 6. REDIRECT TO FRONTEND
        // ==================
        const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
        console.log(`🚀 Redirecting to: ${FRONTEND_URL}/user-dashboard`);
        res.redirect(`${FRONTEND_URL}/user-dashboard?userId=${userId}`);

    } catch (error) {
        console.error('❌ LinkedIn callback processing failed:', error);
        const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${FRONTEND_URL}/login?error=${encodeURIComponent(error.message || 'LinkedIn authentication failed')}`);
    }
});

// ================================
// USER DATA RETRIEVAL ROUTES
// ================================

/**
 * Get user by ID or email (flexible lookup)
 * GET /auth/user/:identifier
 * 
 * Can search by:
 * - user_id (numeric)
 * - email address (contains @)
 */
router.get('/user/:identifier', async (req, res) => {
    try {
        const { identifier } = req.params;
        const isEmail = identifier.includes('@');
        console.log(`🔍 Looking up user by ${isEmail ? 'email' : 'ID'}: ${identifier}`);

        let loginRecord, userProfile, userDetails;

        if (isEmail) {
            // Search by email across tables
            [loginRecord, userDetails] = await Promise.all([
                LoginPass_T.findOne({ where: { email: identifier } }),
                UserDetails.findOne({ where: { email: identifier } })
            ]);

            // Get user_id from either table
            const userId = loginRecord?.id || userDetails?.user_id;
            if (userId) {
                userProfile = await Users.findOne({ where: { user_id: userId } });
            }
        } else {
            // Search by user_id across all tables
            [loginRecord, userProfile, userDetails] = await Promise.all([
                LoginPass_T.findOne({ where: { id: identifier } }),
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

/**
 * Get all users with detailed information (comprehensive list)
 * GET /auth/users-detailed
 * 
 * Returns all users with data from all 3 tables:
 * - LoginPass (authentication)
 * - Users (basic profile)
 * - UserDetails (extended profile)
 */
router.get('/users-detailed', async (req, res) => {
    try {
        console.log('📊 Retrieving all users with detailed information');

        // Try to get users with join first (primary approach)
        const usersWithDetails = await Users.findAll({
            include: [
                {
                    model: UserDetails,
                    required: false // LEFT JOIN - include users even without details
                }
            ],
            order: [['user_id', 'ASC']]
        });

        let allUserData = [];

        if (usersWithDetails.length === 0) {
            // Fallback: No users in Users table, check UserDetails directly
            console.log('🔄 No users found in users table, checking user_details table');
            allUserData = await getUsersFromDetailsTable();
        } else {
            // Primary path: Build user data from Users table
            allUserData = await buildUserDataFromUsersTable(usersWithDetails);
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
 * Get user by email (optimized lookup using primary key)
 * GET /auth/user-by-email/:email
 * 
 * Uses email as primary key for fastest lookup
 */
router.get('/user-by-email/:email', async (req, res) => {
    try {
        const { email } = req.params;
        console.log(`🔍 Looking up user by email (primary key): ${email}`);

        // Use primary key lookup for best performance
        const loginRecord = await LoginPass_T.findByPk(email);

        if (!loginRecord) {
            return res.status(404).json({
                success: false,
                message: `User not found with email: ${email}`
            });
        }

        const userId = loginRecord.id;

        // Get related data from other tables
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

// ================================
// HELPER FUNCTIONS
// ================================

/**
 * Generate next available user ID for LinkedIn users
 * Ensures IDs start from 1000 and are unique
 */
async function generateNextUserId() {
    const allUsers = await LoginPass_T.findAll({
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

    return Math.max(1000, highestId + 1);
}

/**
 * Display formatted LinkedIn login summary for easy presentation
 */
function displayLinkedInLoginSummary(userInfo, userId, verifyLogin, verifyUser, verifyDetails) {
    console.log('\n' + '='.repeat(60));
    console.log('🎯 LINKEDIN LOGIN RESULT SUMMARY:');
    console.log('='.repeat(60));
    console.log(`📧 User Email: ${userInfo.email}`);
    console.log(`🆔 Generated ID: ${userId}`);
    console.log(`👤 LinkedIn Name: ${userInfo.name}`);
    
    console.log('\n📊 DATABASE VERIFICATION:');
    console.log(`   LoginPass Table: ${verifyLogin ? '✅ SAVED' : '❌ MISSING'}`);
    console.log(`   Users Table: ${verifyUser ? '✅ SAVED' : '❌ MISSING'}`);
    console.log(`   UserDetails Table: ${verifyDetails ? '✅ SAVED' : '❌ MISSING'}`);
    
    if (verifyLogin && verifyUser && verifyDetails) {
        console.log('\n🎉 SUCCESS: LinkedIn user fully integrated into database!');
    } else {
        console.log('\n⚠️  WARNING: Some database records missing!');
    }
    console.log('='.repeat(60) + '\n');
}

/**
 * Build user data array from UserDetails table (fallback method)
 */
async function getUsersFromDetailsTable() {
    const userDetails = await UserDetails.findAll({
        order: [['user_id', 'ASC']]
    });

    const userData = [];
    for (const detail of userDetails) {
        const [user, loginRecord] = await Promise.all([
            Users.findOne({ where: { user_id: detail.user_id } }),
            LoginPass_T.findOne({ where: { id: detail.user_id } })
        ]);

        userData.push({
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
    return userData;
}

/**
 * Build user data array from Users table (primary method)
 */
async function buildUserDataFromUsersTable(usersWithDetails) {
    const userData = [];
    for (const user of usersWithDetails) {
        const loginRecord = await LoginPass_T.findOne({ where: { id: user.user_id } });

        userData.push({
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
    return userData;
}

module.exports = router;