const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Environment variables
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://GPC:anmol4328@gpc-itarsi.puza0ta.mongodb.net/gpc-itarsi';

console.log('Server starting with PORT:', PORT);
console.log('JWT_SECRET configured:', JWT_SECRET ? 'Yes (value hidden)' : 'No');
console.log('MONGODB_URI configured:', MONGODB_URI ? 'Yes (value hidden)' : 'No');

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Continuing with mock data...');
  });

// Apply universal CORS middleware first - before any other middleware
const universalCors = require('./middleware/universal-cors');
app.use(universalCors);

console.log('CORS middleware applied');

// Log incoming requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Parse JSON request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  console.log('Creating uploads directory at:', uploadsDir);
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create subdirectories for different types of uploads
const uploadSubdirs = ['profiles', 'courses', 'gallery', 'notices', 'study-materials', 'forms', 'applications', 'newsletters'];
uploadSubdirs.forEach(dir => {
  const dirPath = path.join(uploadsDir, dir);
  if (!fs.existsSync(dirPath)) {
    console.log('Creating upload subdirectory:', dir);
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Ensure public directory exists
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  console.log('Creating public directory at:', publicDir);
  fs.mkdirSync(publicDir, { recursive: true });
}

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const studentRoutes = require('./routes/students');
const teacherRoutes = require('./routes/teachers');
const teacherProfileRoutes = require('./routes/teacherProfile');
const teacherDashboardRoutes = require('./routes/teacherDashboard');
const courseRoutes = require('./routes/courses');
const noticeRoutes = require('./routes/notices');
const galleryRoutes = require('./routes/gallery');
const studyMaterialRoutes = require('./routes/studyMaterials');
const documentRoutes = require('./routes/documents');
const overviewRoutes = require('./routes/overview');
const chatbotRoutes = require('./routes/chatbot');
const customButtonRoutes = require('./routes/custom-buttons');
const notificationRoutes = require('./routes/notifications');
const calendarEventRoutes = require('./routes/calendar-events');
const contactInfoRoutes = require('./routes/contact-info');
const adminRoutes = require('./routes/admin');
const developerRoutes = require('./routes/developer');
const admissionDetailsRoutes = require('./routes/admission-details');
const uploadTestRoutes = require('./routes/upload-test');

// Special handling for problematic routes
app.options('/api/contact-info', (req, res) => {
  console.log('Special handling for OPTIONS request to /api/contact-info');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.status(204).send();
});

app.options('/api/custom-buttons', (req, res) => {
  console.log('Special handling for OPTIONS request to /api/custom-buttons');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.status(204).send();
});

// Special handling for notices route - this is the most problematic one
app.options('/api/notices', (req, res) => {
  console.log('Special handling for OPTIONS request to /api/notices');
  // Allow the specific origin that's having issues
  res.header('Access-Control-Allow-Origin', 'https://gpc-itarsi-9cl7.onrender.com');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(204).send();
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/teacher-profile', teacherProfileRoutes);
app.use('/api/teacher-dashboard', teacherDashboardRoutes);
app.use('/api/courses', courseRoutes);
// Apply special CORS middleware for notices route
const noticesCorsMiddleware = require('./middleware/notices-cors');
app.use('/api/notices', noticesCorsMiddleware, noticeRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/study-materials', studyMaterialRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/overview', overviewRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/custom-buttons', customButtonRoutes);
app.use('/api/admin/custom-buttons', customButtonRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/calendar-events', calendarEventRoutes);
app.use('/api/contact-info', contactInfoRoutes);
app.use('/api/admission-details', admissionDetailsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/developer', developerRoutes);
app.use('/api/upload-test', uploadTestRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to GPC Itarsi MongoDB Backend API' });
});

// Test CORS route
app.get('/api/test-cors', (req, res) => {
  // Log all request headers for debugging
  console.log('Test CORS route - All headers:', req.headers);

  res.json({
    message: 'CORS is working!',
    origin: req.headers.origin || 'No origin header',
    headers: {
      'access-control-allow-origin': res.getHeader('Access-Control-Allow-Origin'),
      'access-control-allow-methods': res.getHeader('Access-Control-Allow-Methods'),
      'access-control-allow-headers': res.getHeader('Access-Control-Allow-Headers'),
      'access-control-allow-credentials': res.getHeader('Access-Control-Allow-Credentials')
    },
    time: new Date().toISOString()
  });
});

// Handle OPTIONS requests for all routes
app.options('*', (req, res) => {
  console.log('Catch-all OPTIONS handler for:', req.path);
  console.log('Request origin:', req.headers.origin);

  // Special handling for notices endpoint
  if (req.path.includes('/api/notices')) {
    console.log('Special handling for notices in catch-all OPTIONS handler');
    res.header('Access-Control-Allow-Origin', 'https://gpc-itarsi-9cl7.onrender.com');
  } else {
    // For all other routes
    res.header('Access-Control-Allow-Origin', '*');
  }

  res.header('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(204).send();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
