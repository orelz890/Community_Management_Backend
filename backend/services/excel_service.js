/**
 * ExcelService
 * Handles Excel file parsing and validation for user data extraction.
 * Simplified service - only extracts data, no database operations.
 */

const XLSX = require('xlsx');

class ExcelService {
  constructor() {
    // Simple service - no BaseService inheritance needed
  }

  /**
   * Parse Excel file buffer into JSON array
   * @param {Buffer} buffer - Excel file buffer from multer
   * @param {string} filename - Original filename
   * @returns {Promise<Object>} Parsed data with users array
   */
  async parseExcelFile(buffer, filename) {
    try {
      console.log(`[ExcelService] Parsing Excel file: ${filename}`);
      
      // Read Excel file from buffer
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      
      // Get the first worksheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      console.log(`[ExcelService] Parsed ${jsonData.length} rows from Excel`);
      
      return {
        success: true,
        users: jsonData,
        totalRows: jsonData.length,
        sheetName: sheetName
      };
      
    } catch (error) {
      console.error('[ExcelService] Error parsing Excel file:', error.message);
      throw new Error(`Failed to parse Excel file: ${error.message}`);
    }
  }

  /**
   * Validate Excel structure has required columns
   * @param {Array} userData - Parsed Excel data
   * @returns {Object} Validation result
   */
  async validateExcelStructure(userData) {
    try {
      console.log('[ExcelService] Validating Excel structure');
      
      if (!userData || userData.length === 0) {
        return {
          valid: false,
          error: 'Excel file is empty or no data found'
        };
      }

      // Required columns (case-insensitive)
      const requiredColumns = ['name', 'email'];
      const optionalColumns = ['linkedin_url', 'linkedin url', 'linkedin'];
      
      // Get first row to check column headers
      const firstRow = userData[0];
      const availableColumns = Object.keys(firstRow).map(col => col.toLowerCase());
      
      console.log('[ExcelService] Available columns:', availableColumns);
      
      // Check required columns
      const missingColumns = [];
      for (const required of requiredColumns) {
        if (!availableColumns.includes(required.toLowerCase())) {
          missingColumns.push(required);
        }
      }
      
      if (missingColumns.length > 0) {
        return {
          valid: false,
          error: `Missing required columns: ${missingColumns.join(', ')}`,
          missingColumns: missingColumns
        };
      }
      
      // Check if LinkedIn column exists (optional)
      const hasLinkedIn = optionalColumns.some(col => 
        availableColumns.includes(col.toLowerCase())
      );
      
      console.log(`[ExcelService] Structure validation passed. LinkedIn column: ${hasLinkedIn ? 'Yes' : 'No'}`);
      
      return {
        valid: true,
        hasLinkedInColumn: hasLinkedIn,
        totalRows: userData.length,
        availableColumns: availableColumns
      };
      
    } catch (error) {
      console.error('[ExcelService] Error validating structure:', error.message);
      return {
        valid: false,
        error: `Validation error: ${error.message}`
      };
    }
  }

  /**
   * Normalize and prepare user data for your existing user schema
   * @param {Array} rawData - Raw Excel data
   * @returns {Array} Normalized user data matching your schema
   */
  normalizeUserData(rawData) {
    return rawData.map((row, index) => {
      const normalized = {};
      
      // Handle name variations (maps to english_name in Users table)
      normalized.english_name = row.name || row.Name || row['English Name'] || row.english_name;
      
      // Handle email (required)
      normalized.email = (row.email || row.Email)?.toLowerCase();
      
      // Handle LinkedIn URL variations (optional)
      normalized.linkedin_url = row.linkedin_url || row['linkedin url'] || 
                               row.linkedin || row.LinkedIn || row['LinkedIn URL'] || null;
      
      // Set default values for fields that will be filled later
      normalized.role = 'user'; // Default role
      normalized.seniority = 'junior'; // Default seniority
      normalized.is_manager = false; // Default manager status
      
      // Add row number for error tracking
      normalized._rowNumber = index + 2; // Excel rows start at 2 (after header)
      
      return normalized;
    });
  }
}

module.exports = new ExcelService();
