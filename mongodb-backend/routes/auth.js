const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const MockUser = require('../models/MockUser');
const { authenticateToken } = require('../middleware/auth');

// Always use the real User model since we're connected to MongoDB Atlas
const UserModel = User;

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt:', { username });

    let user;

    // First, try to find user by roll number (for students)
    console.log('Searching by roll number:', username);
    user = await UserModel.findOne({
      rollNumber: { $regex: new RegExp('^' + username + '$', 'i') }
    });

    // If not found by roll number, try by username
    if (!user) {
      console.log('User not found by roll number, trying username:', username);
      user = await UserModel.findOne({
        username: { $regex: new RegExp('^' + username + '$', 'i') }
      });
    }

    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('Login failed: User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    console.log('Verifying password for user:', username);
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Login failed: Invalid password');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Login successful for user:', username);

    // Create a user object without the password
    const userWithoutPassword = {
      _id: user._id,
      username: user.username,
      name: user.name,
      role: user.role,
      email: user.email,
      profilePicture: user.profilePicture,
      department: user.department,
      subjects: user.subjects,
      rollNumber: user.rollNumber,
      class: user.class,
      branch: user.branch,
      attendance: user.attendance,
      title: user.title,
      profileComplete: user.profileComplete
    };

    // Generate JWT token
    let token;
    try {
      console.log('Generating JWT token for user:', user._id);

      // Create a payload with only the essential information
      const payload = {
        id: user._id,
        username: user.username,
        role: user.role,
        name: user.name,
        profileComplete: user.profileComplete
      };

      // Log the payload structure (without sensitive values)
      console.log('Token payload structure:', Object.keys(payload));

      // Sign the token with the JWT secret
      token = jwt.sign(
        payload,
        process.env.JWT_SECRET || 'your-jwt-secret-key',
        { expiresIn: '24h' }
      );

      console.log('JWT token generated successfully');
    } catch (error) {
      console.error('Error generating JWT token:', error);
      return res.status(500).json({ message: 'Error generating authentication token' });
    }

    res.json({
      token,
      user: userWithoutPassword
    });

    console.log('Login response sent:', { token: token.substring(0, 20) + '...', user: { ...userWithoutPassword, password: undefined } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get current user route
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        _id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
        email: user.email,
        profilePicture: user.profilePicture,
        department: user.department,
        subjects: user.subjects,
        rollNumber: user.rollNumber,
        class: user.class,
        branch: user.branch,
        attendance: user.attendance,
        title: user.title,
        profileComplete: user.profileComplete
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
