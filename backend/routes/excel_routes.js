/**
 * Excel Routes
 * Simple routes for Excel file upload and data extraction.
 * Just extracts data as list of dictionaries - no database operations.
 */

const express = require('express');
const router = express.Router();
const excelController = require('../controllers/excel_controller');
const { uploadExcelFile } = require('../middleware/file_upload_middleware');

// POST /excel/upload - Upload Excel file and get user data as list of dictionaries
router.post('/upload', 
  uploadExcelFile,  // Multer middleware for file upload
  excelController.uploadAndExtract  // Extract data only
);

// POST /excel/create-users - Create users in database from extracted Excel data
router.post('/create-users', excelController.createUsersFromData);

// GET /excel/history - Simple history endpoint (placeholder)
router.get('/history', excelController.getUploadHistory);

module.exports = router;
