const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');

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
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'],
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      return file.fieldname + '-' + uniqueSuffix;
    }
  }
});

// Create multer upload instance with Cloudinary storage
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB file size limit
  }
});

// Simple middleware for handling file uploads
const handleUpload = (fieldName) => {
  return (req, res, next) => {
    console.log(`Starting simple upload for field: ${fieldName}`);
    
    const uploadSingle = upload.single(fieldName);
    
    uploadSingle(req, res, (err) => {
      if (err) {
        console.error('Upload error:', err);
        return res.status(400).json({
          message: 'File upload error',
          error: err.message || 'Unknown error'
        });
      }
      
      console.log('File uploaded successfully:', req.file ? req.file.path : 'No file');
      next();
    });
  };
};

module.exports = {
  upload,
  cloudinary,
  handleUpload
};
