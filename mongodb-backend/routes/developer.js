const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateToken, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

// Get developer profile (authenticated)
router.get('/profile', authenticateToken, authorize(['developer']), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching developer profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get developer profile (public - no authentication)
router.get('/profile-public', async (req, res) => {
  try {
    // Find a user with developer role
    const developer = await User.findOne({ role: 'developer' }).select('-password');
    
    if (!developer) {
      return res.status(404).json({ message: 'Developer not found' });
    }
    
    res.json(developer);
  } catch (error) {
    console.error('Error fetching public developer profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update developer profile (authenticated)
router.put('/profile', authenticateToken, authorize(['developer']), async (req, res) => {
  try {
    const { name, title, bio, education, experience, socialLinks } = req.body;
    
    // Build profile object
    const profileFields = {};
    if (name) profileFields.name = name;
    if (title) profileFields.title = title;
    if (bio) profileFields.bio = bio;
    if (education) profileFields.education = education;
    if (experience) profileFields.experience = experience;
    if (socialLinks) {
      try {
        profileFields.socialLinks = JSON.parse(socialLinks);
      } catch (e) {
        profileFields.socialLinks = socialLinks;
      }
    }
    
    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    console.error('Error updating developer profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update developer profile (public - no authentication)
router.put('/profile-public', async (req, res) => {
  try {
    const { name, title, bio, education, experience, socialLinks } = req.body;
    
    // Build profile object
    const profileFields = {};
    if (name) profileFields.name = name;
    if (title) profileFields.title = title;
    if (bio) profileFields.bio = bio;
    if (education) profileFields.education = education;
    if (experience) profileFields.experience = experience;
    if (socialLinks) {
      try {
        profileFields.socialLinks = JSON.parse(socialLinks);
      } catch (e) {
        profileFields.socialLinks = socialLinks;
      }
    }
    
    // Find and update developer user
    const developer = await User.findOne({ role: 'developer' });
    
    if (!developer) {
      return res.status(404).json({ message: 'Developer not found' });
    }
    
    // Update user
    const user = await User.findByIdAndUpdate(
      developer._id,
      { $set: profileFields },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    console.error('Error updating public developer profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update profile picture (authenticated)
router.put('/profile-picture', authenticateToken, authorize(['developer']), upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Delete old profile picture if exists
    if (user.profilePicture) {
      const oldPicturePath = path.join(__dirname, '..', 'uploads', user.profilePicture);
      if (fs.existsSync(oldPicturePath)) {
        fs.unlinkSync(oldPicturePath);
      }
    }
    
    // Update user with new profile picture
    user.profilePicture = req.file.filename;
    await user.save();
    
    res.json({ message: 'Profile picture updated successfully', filename: req.file.filename });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update profile picture (public - no authentication)
router.put('/profile-picture-public', upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Find developer user
    const user = await User.findOne({ role: 'developer' });
    
    if (!user) {
      return res.status(404).json({ message: 'Developer not found' });
    }
    
    // Delete old profile picture if exists
    if (user.profilePicture) {
      const oldPicturePath = path.join(__dirname, '..', 'uploads', user.profilePicture);
      if (fs.existsSync(oldPicturePath)) {
        fs.unlinkSync(oldPicturePath);
      }
    }
    
    // Update user with new profile picture
    user.profilePicture = req.file.filename;
    await user.save();
    
    res.json({ message: 'Profile picture updated successfully', filename: req.file.filename });
  } catch (error) {
    console.error('Error updating public profile picture:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
