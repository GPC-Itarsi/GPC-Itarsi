const jwt = require('jsonwebtoken');
const User = require('../models/User');
const MockUser = require('../models/MockUser');

// Always use the real User model since we're connected to MongoDB Atlas
const UserModel = User;

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  console.log('Authentication check for path:', req.path);
  console.log('Request headers:', req.headers);
  const authHeader = req.headers['authorization'];
  console.log('Authorization header:', authHeader);
  const token = authHeader && authHeader.split(' ')[1];
  console.log('Extracted token:', token ? `${token.substring(0, 10)}...` : 'none');

  if (!token) {
    console.log('No token provided for path:', req.path);
    return res.status(401).json({ message: 'Authentication token required' });
  }
  console.log('Token found for path:', req.path);

  try {
    // Log token format for debugging (only first few characters)
    if (token) {
      console.log('Token format check:', token.substring(0, 10) + '...');
      console.log('Token length:', token.length);
    }

    // Check if token is malformed before verification
    let cleanToken = token;
    if (token.includes(' ') || token.includes('\n') || token.includes('\t')) {
      console.error('Token contains whitespace characters, cleaning...');
      cleanToken = token.trim().replace(/\s+/g, '');
    }

    console.log('Attempting to verify JWT token with secret');
    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET || 'your-jwt-secret-key');
    console.log('JWT token verified successfully');

    // Get the user from the database
    if (decoded && decoded.id) {
      console.log('Looking up user data for ID:', decoded.id);
      const user = await UserModel.findById(decoded.id);

      if (!user) {
        console.log('User not found for token ID:', decoded.id);
        return res.status(403).json({ message: 'User not found for token' });
      }

      console.log('User found:', user.name);
      req.user = {
        id: user._id.toString(), // Convert ObjectId to string for easier comparison
        _id: user._id.toString(), // Keep both id and _id for compatibility
        username: decoded.username || user.username || user.name.toLowerCase(),
        role: user.role,
        name: user.name,
        department: user.department,
        subjects: user.subjects,
        rollNumber: user.rollNumber,
        class: user.class,
        title: user.title
      };

      console.log('User ID set in request:', req.user.id, 'with role:', req.user.role);
    } else {
      console.log('No user ID in token, using decoded token data directly');
      req.user = decoded;

      // Ensure ID is set correctly and converted to string
      if (!req.user.id && req.user._id) {
        console.log('Setting req.user.id from req.user._id');
        req.user.id = req.user._id.toString();
      } else if (req.user.id && !req.user._id) {
        console.log('Setting req.user._id from req.user.id');
        req.user._id = req.user.id.toString();
      } else if (req.user.id) {
        // Make sure both are strings
        req.user.id = req.user.id.toString();
        req.user._id = req.user.id;
      }
    }

    next();
  } catch (error) {
    console.error('JWT verification error:', error.message);
    console.error('JWT Secret used:', process.env.JWT_SECRET ? 'Secret exists (hidden)' : 'No secret');
    console.error('Token length:', token ? token.length : 'N/A');

    // Check if token is malformed and provide more specific error
    if (error.name === 'JsonWebTokenError' && error.message === 'jwt malformed') {
      console.error('Token appears to be malformed. This could be due to:');
      console.error('1. Incorrect token format');
      console.error('2. Token corruption during transmission');
      console.error('3. Frontend not sending the token correctly');
    }

    return res.status(403).json({ message: 'Invalid or expired token', error: error.message });
  }
};

// Role-based authorization middleware
const authorize = (roles) => {
  return (req, res, next) => {
    console.log('Authorization check - User role:', req.user?.role, 'Required roles:', roles);

    // Make sure user and role exist
    if (!req.user || !req.user.role) {
      console.log('User or role not defined in request');
      return res.status(403).json({ message: 'Access denied - user role not defined' });
    }

    // Special case for admin role - admins should have access to everything
    if (req.user.role === 'admin') {
      console.log('Admin access granted for user:', req.user.username || req.user.id);
      return next();
    }

    // Check if user role is in the allowed roles
    if (roles.includes(req.user.role)) {
      console.log('Access granted for user:', req.user.username || req.user.id);
      return next();
    }

    console.log('Access denied for user:', req.user.username || req.user.id);
    return res.status(403).json({ message: 'Access denied - insufficient permissions' });
  };
};

module.exports = { authenticateToken, authorize };
