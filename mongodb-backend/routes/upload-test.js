const express = require('express');
const router = express.Router();
const { upload, cloudinary } = require('../middleware/cloudinaryUpload-simple');
const { authenticateToken, authorize } = require('../middleware/auth');

// Simple test route for file uploads
router.post('/test', upload.single('file'), (req, res) => {
  try {
    console.log('Test upload route called');
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    console.log('File uploaded successfully:', req.file);
    
    return res.status(200).json({
      message: 'File uploaded successfully',
      file: req.file
    });
  } catch (error) {
    console.error('Error in test upload route:', error);
    return res.status(500).json({
      message: 'Server error during upload',
      error: error.message
    });
  }
});

// Test route with authentication
router.post('/test-auth', authenticateToken, authorize(['admin', 'teacher']), upload.single('file'), (req, res) => {
  try {
    console.log('Authenticated test upload route called');
    console.log('User:', req.user);
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    console.log('File uploaded successfully:', req.file);
    
    return res.status(200).json({
      message: 'File uploaded successfully',
      file: req.file,
      user: {
        id: req.user.id,
        name: req.user.name,
        role: req.user.role
      }
    });
  } catch (error) {
    console.error('Error in authenticated test upload route:', error);
    return res.status(500).json({
      message: 'Server error during upload',
      error: error.message
    });
  }
});

module.exports = router;
