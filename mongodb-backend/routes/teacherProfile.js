const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateToken, authorize } = require('../middleware/auth');
const { cloudinaryUpload, cloudinary } = require('../middleware/cloudinaryUpload');
const fs = require('fs');
const path = require('path');

// Update teacher profile picture with Cloudinary
router.put('/update-picture', authenticateToken, authorize(['teacher']), cloudinaryUpload.single('profilePicture'), async (req, res) => {
  try {
    console.log('Updating teacher profile picture with Cloudinary for user ID:', req.user.id);
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const teacher = await User.findById(req.user.id);
    
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // If the teacher has a previous Cloudinary profile picture, delete it
    if (teacher.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(teacher.cloudinaryPublicId);
        console.log(`Deleted previous teacher profile picture from Cloudinary: ${teacher.cloudinaryPublicId}`);
      } catch (err) {
        console.error('Error deleting previous teacher profile picture from Cloudinary:', err);
        // Continue with update even if Cloudinary deletion fails
      }
    }

    // Delete old local profile picture if exists
    if (teacher.profilePicture && !teacher.profilePicture.includes('cloudinary.com') && teacher.profilePicture !== 'default-profile.jpg') {
      try {
        const oldPicturePath = path.join(__dirname, '..', 'uploads', teacher.profilePicture);
        if (fs.existsSync(oldPicturePath)) {
          fs.unlinkSync(oldPicturePath);
          console.log(`Deleted old local profile picture: ${oldPicturePath}`);
        }
      } catch (err) {
        console.error('Error deleting old local profile picture:', err);
        // Continue with update even if local file deletion fails
      }
    }

    // Update teacher with new profile picture from Cloudinary
    teacher.profilePicture = req.file.path;
    teacher.cloudinaryPublicId = req.file.filename;
    teacher.updatedAt = Date.now();
    
    await teacher.save();
    
    console.log('Teacher profile picture updated successfully with Cloudinary:', {
      profilePicture: teacher.profilePicture,
      cloudinaryPublicId: teacher.cloudinaryPublicId
    });

    res.json({ 
      message: 'Profile picture updated successfully',
      profilePicture: teacher.profilePicture
    });
  } catch (error) {
    console.error('Error updating teacher profile picture with Cloudinary:', error);
    res.status(500).json({ 
      message: 'Failed to update profile picture', 
      error: error.message 
    });
  }
});

module.exports = router;
