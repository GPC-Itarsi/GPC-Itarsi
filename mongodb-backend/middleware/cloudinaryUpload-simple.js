const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');
const fs = require('fs');

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Simple storage configuration for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'gpc-itarsi/study-materials',
    resource_type: 'auto',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'csv', 'zip', 'rar'],
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      return file.fieldname + '-' + uniqueSuffix;
    }
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  console.log('Checking file type for simple Cloudinary upload:', file.originalname);
  console.log('File mimetype:', file.mimetype);

  // Get file extension from original name
  const fileExtension = file.originalname.split('.').pop().toLowerCase();
  console.log('File extension:', fileExtension);

  // List of allowed extensions
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'csv', 'zip', 'rar'];

  // Accept based on extension
  const isAllowedExtension = allowedExtensions.includes(fileExtension);

  // Accept images, documents, and PDFs based on mimetype
  const isAllowedMimetype = file.mimetype.startsWith('image/') ||
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/msword' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.mimetype === 'application/vnd.ms-excel' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.mimetype === 'application/vnd.ms-powerpoint' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
      file.mimetype === 'text/plain' ||
      file.mimetype === 'application/octet-stream'; // Accept binary files

  if (isAllowedMimetype || isAllowedExtension) {
    console.log('File type accepted for simple Cloudinary upload:', file.originalname);
    cb(null, true);
  } else {
    console.error('Unsupported file type rejected for simple Cloudinary upload:', file.mimetype, 'for file:', file.originalname);
    cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed file types are: images, PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, RTF, CSV, ZIP, RAR.`), false);
  }
};

// Create multer upload instance with Cloudinary storage
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB file size limit
  }
});

// Import local upload middleware as fallback
const localUpload = require('./upload');

// Simple middleware for handling file uploads
const handleUpload = (fieldName) => {
  return (req, res, next) => {
    console.log(`Starting simple upload for field: ${fieldName}`);

    // Log Cloudinary configuration for debugging
    console.log('Cloudinary configuration for simple upload:');
    console.log('- Cloud name:', process.env.CLOUDINARY_CLOUD_NAME ? process.env.CLOUDINARY_CLOUD_NAME : 'Not set');
    console.log('- API key configured:', process.env.CLOUDINARY_API_KEY ? 'Yes (hidden)' : 'No');
    console.log('- API secret configured:', process.env.CLOUDINARY_API_SECRET ? 'Yes (hidden)' : 'No');

    const uploadSingle = upload.single(fieldName);

    uploadSingle(req, res, (err) => {
      if (err) {
        console.error('Cloudinary simple upload error:', err);

        // Handle file size limit error
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            message: 'File too large. Maximum size is 50MB.',
            error: 'LIMIT_FILE_SIZE',
            details: 'Please upload a smaller file (maximum 50MB)'
          });
        }

        // Handle file type error
        if (err.message && err.message.includes('file type')) {
          console.log('File type error in simple upload - trying local fallback');
        } else {
          console.log('Unknown error in simple upload - trying local fallback');
        }

        // Fall back to local storage
        console.log('Falling back to local storage...');
        const localUploadSingle = localUpload.single(fieldName);

        localUploadSingle(req, res, (localErr) => {
          if (localErr) {
            console.error('Local upload error:', localErr);

            // Now return error after both methods failed
            if (localErr.code === 'LIMIT_FILE_SIZE') {
              return res.status(400).json({
                message: 'File too large. Maximum size is 50MB.',
                error: 'LIMIT_FILE_SIZE',
                details: 'Please upload a smaller file (maximum 50MB)'
              });
            }

            if (localErr.message && localErr.message.includes('file type')) {
              return res.status(400).json({
                message: 'Unsupported file format',
                error: 'UNSUPPORTED_FILE_TYPE',
                details: 'Please ensure you are uploading a supported file format: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, RTF, CSV, JPG, PNG, GIF, ZIP, RAR'
              });
            }

            return res.status(400).json({
              message: 'File upload error',
              error: localErr.message || 'Unknown error',
              details: 'There was a problem uploading your file. Please try again with a different file.'
            });
          }

          // Modify the file object to mimic Cloudinary response
          if (req.file) {
            // Create a path property that mimics Cloudinary URL format
            const relativePath = req.file.path.replace(/\\/g, '/').split('uploads/')[1];
            req.file.path = `/uploads/${relativePath}`;
            req.file.filename = path.basename(req.file.path);

            console.log('Successfully uploaded to local storage:', req.file.path);
          }

          next();
        });

        return;
      }

      console.log('File uploaded successfully to Cloudinary:', req.file ? req.file.path : 'No file');
      next();
    });
  };
};

module.exports = {
  upload,
  cloudinary,
  handleUpload
};
