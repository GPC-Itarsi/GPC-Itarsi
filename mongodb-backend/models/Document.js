const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  type: {
    type: String,
    enum: ['file', 'drive_link'],
    required: true
  },
  category: {
    type: String,
    enum: ['form', 'syllabus', 'timetable', 'result', 'notice', 'other'],
    default: 'other'
  },
  file: {
    type: String
  },
  driveUrl: {
    type: String
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Validate that either file or driveUrl is provided based on type
DocumentSchema.pre('validate', function(next) {
  if (this.type === 'file' && !this.file) {
    this.invalidate('file', 'File is required for type "file"');
  } else if (this.type === 'drive_link' && !this.driveUrl) {
    this.invalidate('driveUrl', 'Drive URL is required for type "drive_link"');
  }
  next();
});

module.exports = mongoose.model('Document', DocumentSchema);
