/**
 * ExcelController
 * Handles Excel file upload and extracts user data as list of dictionaries.
 * Stops at data extraction - does NOT create users in database.
 */

const BaseController = require('./base_controller');
const excelService = require('../services/excel_service');
const usersService = require('../services/users_service');
const userDetailsService = require('../services/user_details_service');
const fs = require('fs');

class ExcelController extends BaseController {
  constructor() {
    super(excelService);
    
    // Bind custom methods
    this.uploadAndExtract = this.uploadAndExtract.bind(this);
    this.createUsersFromData = this.createUsersFromData.bind(this);
    this.getUploadHistory = this.getUploadHistory.bind(this);
  }

  /**
   * Handle Excel file upload and extract user data as dictionaries
   * @param {Object} req - Express request object (contains uploaded file)
   * @param {Object} res - Express response object
   * @returns {Promise<void>} Sends JSON response with extracted user data
   */
  async uploadAndExtract(req, res) {
    try {
      console.log('🚀 [ExcelController] STARTING Excel extraction process...');
      
      // File should be available from middleware
      if (!req.uploadedFile) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded'
        });
      }
      
      // Read file buffer
      const fileBuffer = fs.readFileSync(req.uploadedFile.filepath);
      
      // Parse Excel file
      const parseResult = await excelService.parseExcelFile(fileBuffer, req.uploadedFile.originalName);
      
      if (!parseResult.success) {
        // Clean up uploaded file
        fs.unlinkSync(req.uploadedFile.filepath);
        return res.status(400).json({
          success: false,
          error: 'Failed to parse Excel file',
          details: parseResult.error
        });
      }
      
      console.log(`⚡ [ExcelController] MID-PROCESS: Parsed ${parseResult.totalRows} rows, validating structure...`);
      
      // Validate Excel structure
      const validationResult = await excelService.validateExcelStructure(parseResult.users);
      
      if (!validationResult.valid) {
        // Clean up uploaded file
        fs.unlinkSync(req.uploadedFile.filepath);
        return res.status(400).json({
          success: false,
          error: 'Invalid Excel format',
          details: validationResult.error,
          missingColumns: validationResult.missingColumns || []
        });
      }
      
      // Normalize data to match your existing user schema
      const normalizedUsers = excelService.normalizeUserData(parseResult.users);
      
      // Clean up uploaded file (we don't need it anymore)
      fs.unlinkSync(req.uploadedFile.filepath);
      
      // 📋 EXCEL EXTRACTION SUMMARY
      console.log('\n' + '='.repeat(50));
      console.log('📊 EXCEL EXTRACTION COMPLETED');
      console.log('='.repeat(50));
      console.log(`📁 File: ${req.uploadedFile.originalName}`);
      console.log(`📈 Total Users Extracted: ${normalizedUsers.length}`);
      console.log(`🔗 LinkedIn Data Available: ${validationResult.hasLinkedInColumn ? 'YES' : 'NO'}`);
      
      if (normalizedUsers.length > 0) {
        console.log('\n📝 SAMPLE USER EXTRACTED:');
        const sampleUser = normalizedUsers[0];
        console.log(`   Name: ${sampleUser.english_name}`);
        console.log(`   Email: ${sampleUser.email}`);
        console.log(`   Role: ${sampleUser.role}`);
        console.log(`   Seniority: ${sampleUser.seniority}`);
        console.log(`   LinkedIn: ${sampleUser.linkedin_url || 'Not provided'}`);
      }
      console.log('='.repeat(50) + '\n');
      
      console.log(`✅ [ExcelController] FINISHED: Successfully extracted ${normalizedUsers.length} users from ${req.uploadedFile.originalName}`);
      
      // Return the extracted user data as list of dictionaries (normalized for your schema)
      res.status(200).json({
        success: true,
        message: 'Excel file processed successfully',
        filename: req.uploadedFile.originalName,
        totalUsers: parseResult.totalRows,
        userData: normalizedUsers, // List of dictionaries matching your schema
        columns: validationResult.availableColumns,
        hasLinkedInData: validationResult.hasLinkedInColumn,
        note: 'Data normalized to match existing user schema'
      });
      
    } catch (error) {
      console.error('💥 [ExcelController] FAILED: Excel extraction error -', error.message);
      
      // Clean up file if it exists
      if (req.uploadedFile && fs.existsSync(req.uploadedFile.filepath)) {
        fs.unlinkSync(req.uploadedFile.filepath);
      }
      
      res.status(500).json({
        success: false,
        error: 'Upload processing failed',
        details: error.message
      });
    }
  }

  /**
   * Get simple upload history (just file names and dates)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>} Sends JSON response with basic history
   */
  async getUploadHistory(req, res) {
    try {
      // For now, just return a simple response
      // You can implement actual history tracking later if needed
      res.status(200).json({
        success: true,
        message: 'Upload history feature - implement as needed',
        uploads: [] // Empty for now
      });
      
    } catch (error) {
      console.error('[ExcelController] Error in getUploadHistory:', error.message);
      res.status(500).json({
        success: false,
        error: 'Failed to get upload history',
        details: error.message
      });
    }
  }

  /**
   * Create users in database from extracted Excel data using existing endpoints
   * @param {Object} req - Express request object (expects userData array in body)
   * @param {Object} res - Express response object
   * @returns {Promise<void>} Sends JSON response with creation results
   */
  async createUsersFromData(req, res) {
    try {
      console.log('🚀 [ExcelController] STARTING database user creation...');
      
      const { userData } = req.body;
      
      // Validation
      if (!userData || !Array.isArray(userData)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid request body. Expected userData array.'
        });
      }
      
      if (userData.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No user data provided.'
        });
      }
      
      // Get next available user_id starting from 10000
      const nextUserId = await this.getNextUserId();
      
      const results = {
        successful: [],
        failed: [],
        duplicates: [],
        totalProcessed: userData.length
      };
      
      console.log(`⚡ [ExcelController] MID-PROCESS: Processing ${userData.length} users starting from ID ${nextUserId}...`);
      
      // Process each user
      for (let i = 0; i < userData.length; i++) {
        const user = userData[i];
        const currentUserId = nextUserId + i;
        
        try {
          // Check for duplicate email
          const existingUser = await userDetailsService.getAll();
          const duplicate = existingUser.find(existing => 
            existing.email && existing.email.toLowerCase() === user.email?.toLowerCase()
          );
          
          if (duplicate) {
            results.duplicates.push({
              email: user.email,
              reason: 'Email already exists',
              existingUserId: duplicate.user_id
            });
            continue;
          }
          
          // Create Users record
          const usersData = {
            user_id: currentUserId,
            english_name: user.english_name || 'Unknown',
            role: user.role || 'user',
            seniority: user.seniority || 'junior'
          };
          
          await usersService.create(usersData);
          
          // Create UserDetails record with defaults for missing fields
          const userDetailsData = {
            user_id: currentUserId,
            email: user.email?.toLowerCase() || null,
            linkedin_url: user.linkedin_url || null,
            hebrew_name: null, // To be filled later
            phone: null, // To be filled later
            city: null, // To be filled later
            years_of_xp: '0', // Default to '0'
            facebook_url: null, // To be filled later
            description: null // To be filled later
          };
          
          await userDetailsService.create(userDetailsData);
          
          results.successful.push({
            user_id: currentUserId,
            english_name: user.english_name,
            email: user.email,
            rowNumber: user._rowNumber
          });
          
        } catch (userError) {
          results.failed.push({
            data: user,
            error: userError.message,
            rowNumber: user._rowNumber
          });
        }
      }
      
      // Response
      const response = {
        success: true,
        message: `Processed ${results.totalProcessed} users`,
        results: results,
        nextAvailableId: nextUserId + userData.length,
        loginPassNote: 'Users can manually register later using their email to create login credentials'
      };
      
      // Add warnings if there were issues
      if (results.failed.length > 0) {
        response.warning = `${results.failed.length} users failed to create`;
      }
      
      if (results.duplicates.length > 0) {
        response.warning = (response.warning ? response.warning + ', ' : '') + 
                          `${results.duplicates.length} duplicate emails skipped`;
      }
      
      console.log(`✅ [ExcelController] FINISHED: Created ${results.successful.length}/${results.totalProcessed} users successfully`);
      
      res.status(200).json(response);
      
    } catch (error) {
      console.error('💥 [ExcelController] FAILED: Database creation error -', error.message);
      
      res.status(500).json({
        success: false,
        error: 'Failed to create users from data',
        details: error.message
      });
    }
  }
  
  /**
   * Get next available user_id starting from 10000
   * @returns {Promise<number>} Next available user ID
   */
  async getNextUserId() {
    try {
      console.log('🔍 [ExcelController] Fetching existing users to determine next ID...');
      const allUsers = await usersService.getAll();
      
      if (!allUsers || allUsers.length === 0) {
        console.log('📋 [ExcelController] No existing users found - starting from ID 10000');
        return 10000; // Start from 10000 if no users exist
      }
      
      console.log(`📊 [ExcelController] Found ${allUsers.length} existing users in database`);
      
      // Find max user_id
      const maxId = Math.max(...allUsers.map(user => user.user_id || 0));
      console.log(`🔢 [ExcelController] Current maximum user ID: ${maxId}`);
      
      // Return next ID, but ensure it's at least 10000
      const nextId = Math.max(maxId + 1, 10000);
      console.log(`✅ [ExcelController] Next available user ID calculated: ${nextId}`);
      
      return nextId;
      
    } catch (error) {
      console.error('❌ [ExcelController] Error getting next user ID:', error.message);
      console.log('⚠️  [ExcelController] Falling back to default ID: 10000');
      return 10000; // Fallback to 10000
    }
  }
}

module.exports = new ExcelController();
