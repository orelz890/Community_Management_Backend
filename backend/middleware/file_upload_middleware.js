/**
 * File Upload Middleware
 * Handles Excel file uploads using multer with validation and security checks.
 * Configured specifically for .xlsx and .xls files.
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads/temp');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, fileExtension);
    cb(null, `${baseName}-${uniqueSuffix}${fileExtension}`);
  }
});

// File filter for Excel files only
const fileFilter = function (req, file, cb) {
  console.log('[FileUpload] Checking file:', file.originalname, 'Type:', file.mimetype);
  
  // Check file extension
  const allowedExtensions = ['.xlsx', '.xls'];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  // Check MIME type
  const allowedMimeTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'application/octet-stream' // Sometimes Excel files come as this
  ];
  
  if (allowedExtensions.includes(fileExtension) && allowedMimeTypes.includes(file.mimetype)) {
    console.log('[FileUpload] File accepted:', file.originalname);
    cb(null, true);
  } else {
    console.log('[FileUpload] File rejected:', file.originalname, 'Extension:', fileExtension, 'MIME:', file.mimetype);
    cb(new Error('Only Excel files (.xlsx, .xls) are allowed'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1 // Only 1 file at a time
  }
});

// Middleware function with error handling
const uploadExcelFile = (req, res, next) => {
  console.log('[FileUpload] Processing file upload...');
  
  const singleUpload = upload.single('excel');
  
  singleUpload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.error('[FileUpload] Multer error:', err.message);
      
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          error: 'File too large. Maximum size is 10MB.'
        });
      }
      
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          success: false,
          error: 'Too many files. Please upload only one Excel file.'
        });
      }
      
      return res.status(400).json({
        success: false,
        error: `Upload error: ${err.message}`
      });
    } else if (err) {
      console.error('[FileUpload] General error:', err.message);
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No Excel file uploaded. Please select a .xlsx or .xls file.'
      });
    }
    
    console.log('[FileUpload] File uploaded successfully:', req.file.filename);
    console.log('[FileUpload] File details:', {
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
    
    // Add file info to request for controller use
    req.uploadedFile = {
      originalName: req.file.originalname,
      filename: req.file.filename,
      filepath: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype
    };
    
    next();
  });
};

module.exports = {
  uploadExcelFile
};
