/**
 * ExcelController
 * Handles Excel file upload and extracts user data as list of dictionaries.
 * Stops at data extraction - does NOT create users in database.
 */

const BaseController = require('./base_controller');
const excelService = require('../services/excel_service');
const fs = require('fs');

class ExcelController extends BaseController {
  constructor() {
    super(excelService);
    
    // Bind custom methods
    this.uploadAndExtract = this.uploadAndExtract.bind(this);
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
      console.log('[ExcelController] Processing Excel upload for data extraction...');
      
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
      console.error('[ExcelController] Error in uploadAndExtract:', error.message);
      
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
}

module.exports = new ExcelController();
