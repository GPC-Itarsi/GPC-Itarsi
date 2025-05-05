const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateToken, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get all users (admin only)
router.get('/', authenticateToken, authorize(['admin']), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Get user by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    // Only allow users to access their own data unless they're an admin
    if (req.user.role !== 'admin' && req.params.id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

// Create a new user (admin only)
router.post('/', authenticateToken, authorize(['admin']), async (req, res) => {
  try {
    const { username, password, name, role, email } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create new user
    const user = new User({
      username: username.toLowerCase(),
      password,
      name,
      role,
      email
    });

    // Add role-specific fields
    if (role === 'teacher') {
      user.department = req.body.department;
      user.subjects = req.body.subjects || [];
    } else if (role === 'student') {
      user.rollNumber = req.body.rollNumber;
      user.class = req.body.class;
      user.branch = req.body.branch;
    } else if (role === 'developer') {
      user.title = req.body.title;
    }

    await user.save();

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user', error: error.message });
  }
});

// Update user (admin or self)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    // Only allow users to update their own data unless they're an admin
    if (req.user.role !== 'admin' && req.params.id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Don't allow role changes unless admin
    if (req.body.role && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Cannot change role' });
    }

    // Update fields
    const fieldsToUpdate = ['name', 'email'];
    
    // Admin can update any field
    if (req.user.role === 'admin') {
      fieldsToUpdate.push('role', 'username');
    }
    
    // Update basic fields
    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    // Update password if provided
    if (req.body.password) {
      user.password = req.body.password;
    }

    // Update role-specific fields
    if (user.role === 'teacher') {
      if (req.body.department) user.department = req.body.department;
      if (req.body.subjects) user.subjects = req.body.subjects;
    } else if (user.role === 'student') {
      if (req.body.rollNumber) user.rollNumber = req.body.rollNumber;
      if (req.body.class) user.class = req.body.class;
      if (req.body.branch) user.branch = req.body.branch;
      if (req.body.attendance !== undefined) user.attendance = req.body.attendance;
    } else if (user.role === 'developer') {
      if (req.body.title) user.title = req.body.title;
    }

    user.updatedAt = Date.now();
    await user.save();

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json(userResponse);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
});

// Update profile picture
router.put('/:id/profile-picture', authenticateToken, upload.single('profilePicture'), async (req, res) => {
  try {
    // Only allow users to update their own profile picture unless they're an admin
    if (req.user.role !== 'admin' && req.params.id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profilePicture = req.file.filename;
    user.updatedAt = Date.now();
    await user.save();

    res.json({ 
      message: 'Profile picture updated successfully',
      profilePicture: user.profilePicture
    });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ message: 'Failed to update profile picture' });
  }
});

// Delete user (admin only)
router.delete('/:id', authenticateToken, authorize(['admin']), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

module.exports = router;
