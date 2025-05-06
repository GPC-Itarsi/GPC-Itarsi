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

// Disable CORS completely by adding direct headers to every response
app.use((req, res, next) => {
  // Log request information for debugging
  console.log('Request from origin:', req.headers.origin);
  console.log('Request method:', req.method);
  console.log('Request path:', req.path);

  // Set CORS headers directly
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    return res.status(204).send();
  }

  next();
});

console.log('CORS configured with both local and production origins');

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

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/teacher-profile', teacherProfileRoutes);
app.use('/api/teacher-dashboard', teacherDashboardRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/notices', noticeRoutes);
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
