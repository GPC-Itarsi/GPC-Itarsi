const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Teacher = require('../models/Teacher');
const { authenticateToken, authorize } = require('../middleware/auth');

// Determine which model to use based on environment
const UserModel = User;
const TeacherModel = Teacher;

// Get all faculty members (public route)
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/faculty - Fetching all faculty members');
    
    // First try to get teachers from User model with role 'teacher'
    let faculty = await UserModel.find({ role: 'teacher' }).select('-password -plainTextPassword');
    
    // If no teachers found in User model, try the Teacher model
    if (!faculty || faculty.length === 0) {
      console.log('No teachers found in User model, trying Teacher model');
      faculty = await TeacherModel.find();
    }
    
    // Map the data to ensure consistent structure
    const mappedFaculty = faculty.map(teacher => ({
      _id: teacher._id,
      name: teacher.name,
      department: teacher.department,
      designation: teacher.designation,
      qualification: teacher.qualification,
      experience: teacher.experience,
      subjects: teacher.subjects || [],
      profilePicture: teacher.profilePicture || teacher.photo,
      email: teacher.email,
      phone: teacher.phone,
      bio: teacher.bio
    }));
    
    console.log(`Found ${mappedFaculty.length} faculty members`);
    res.json(mappedFaculty);
  } catch (error) {
    console.error('Error fetching faculty members:', error);
    res.status(500).json({ message: 'Failed to fetch faculty members', error: error.message });
  }
});

// Get faculty member by ID (public route)
router.get('/:id', async (req, res) => {
  try {
    console.log(`GET /api/faculty/${req.params.id} - Fetching faculty member by ID`);
    
    // First try to find in User model
    let faculty = await UserModel.findOne({ _id: req.params.id, role: 'teacher' }).select('-password -plainTextPassword');
    
    // If not found, try Teacher model
    if (!faculty) {
      console.log('Faculty member not found in User model, trying Teacher model');
      faculty = await TeacherModel.findById(req.params.id);
    }
    
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty member not found' });
    }
    
    // Map the data to ensure consistent structure
    const mappedFaculty = {
      _id: faculty._id,
      name: faculty.name,
      department: faculty.department,
      designation: faculty.designation,
      qualification: faculty.qualification,
      experience: faculty.experience,
      subjects: faculty.subjects || [],
      profilePicture: faculty.profilePicture || faculty.photo,
      email: faculty.email,
      phone: faculty.phone,
      bio: faculty.bio
    };
    
    console.log('Faculty member found:', mappedFaculty.name);
    res.json(mappedFaculty);
  } catch (error) {
    console.error('Error fetching faculty member:', error);
    res.status(500).json({ message: 'Failed to fetch faculty member', error: error.message });
  }
});

// Get faculty members by department (public route)
router.get('/department/:dept', async (req, res) => {
  try {
    const department = req.params.dept;
    console.log(`GET /api/faculty/department/${department} - Fetching faculty members by department`);
    
    // First try to get from User model
    let faculty = await UserModel.find({ role: 'teacher', department }).select('-password -plainTextPassword');
    
    // If no results, try Teacher model
    if (!faculty || faculty.length === 0) {
      console.log('No faculty members found in User model for department, trying Teacher model');
      faculty = await TeacherModel.find({ department });
    }
    
    // Map the data to ensure consistent structure
    const mappedFaculty = faculty.map(teacher => ({
      _id: teacher._id,
      name: teacher.name,
      department: teacher.department,
      designation: teacher.designation,
      qualification: teacher.qualification,
      experience: teacher.experience,
      subjects: teacher.subjects || [],
      profilePicture: teacher.profilePicture || teacher.photo,
      email: teacher.email,
      phone: teacher.phone,
      bio: teacher.bio
    }));
    
    console.log(`Found ${mappedFaculty.length} faculty members for department ${department}`);
    res.json(mappedFaculty);
  } catch (error) {
    console.error('Error fetching faculty members by department:', error);
    res.status(500).json({ message: 'Failed to fetch faculty members by department', error: error.message });
  }
});

module.exports = router;
