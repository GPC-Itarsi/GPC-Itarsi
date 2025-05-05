const mongoose = require('mongoose');

const ChatbotFAQSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true
  },
  keywords: {
    type: [String],
    default: []
  },
  category: {
    type: String,
    enum: ['admission', 'academic', 'facility', 'general', 'other'],
    default: 'general'
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

module.exports = mongoose.model('ChatbotFAQ', ChatbotFAQSchema);
