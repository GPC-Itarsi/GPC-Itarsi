const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'teacher', 'student', 'developer'],
    required: true
  },
  email: {
    type: String,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
    sparse: true
  },
  phone: {
    type: String,
    sparse: true
  },
  bio: {
    type: String,
    sparse: true
  },
  profilePicture: {
    type: String,
    default: 'default-profile.jpg'
  },
  cloudinaryPublicId: {
    type: String
  },
  // Fields for teacher role
  department: {
    type: String,
    required: function() { return this.role === 'teacher'; }
  },
  subjects: {
    type: [String],
    default: function() { return this.role === 'teacher' ? [] : undefined; }
  },
  // Fields for student role
  rollNumber: {
    type: String,
    required: function() { return this.role === 'student'; },
    unique: function() { return this.role === 'student'; },
    sparse: true
  },
  class: {
    type: String,
    required: function() { return this.role === 'student'; }
  },
  branch: {
    type: String,
    enum: ['CS', 'ME', 'ET', 'EE'],
    required: function() { return this.role === 'student'; }
  },
  attendance: {
    type: Number,
    min: 0,
    max: 100,
    default: function() { return this.role === 'student' ? 0 : undefined; }
  },
  // Fields for developer role
  title: {
    type: String,
    required: function() { return this.role === 'developer'; }
  },
  // Common fields
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to hash password
UserSchema.pre('save', async function(next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified('password')) return next();

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password along with the new salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
