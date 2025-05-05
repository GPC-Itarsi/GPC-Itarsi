const express = require('express');
const router = express.Router();
const ChatbotFAQ = require('../models/ChatbotFAQ');
const { authenticateToken, authorize } = require('../middleware/auth');

// Get all chatbot FAQs
router.get('/faqs', async (req, res) => {
  try {
    const faqs = await ChatbotFAQ.find().sort({ category: 1, createdAt: -1 });
    res.json(faqs);
  } catch (error) {
    console.error('Error fetching chatbot FAQs:', error);
    res.status(500).json({ message: 'Failed to fetch chatbot FAQs' });
  }
});

// Get chatbot FAQ by ID
router.get('/faqs/:id', async (req, res) => {
  try {
    const faq = await ChatbotFAQ.findById(req.params.id);
    
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    
    res.json(faq);
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    res.status(500).json({ message: 'Failed to fetch FAQ' });
  }
});

// Add a new chatbot FAQ (admin only)
router.post('/faqs', authenticateToken, authorize(['admin']), async (req, res) => {
  try {
    const { question, answer, keywords, category } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: 'Question and answer are required' });
    }

    // Create new FAQ
    const faq = new ChatbotFAQ({
      question,
      answer,
      keywords: keywords || [],
      category: category || 'general'
    });

    await faq.save();
    
    res.status(201).json(faq);
  } catch (error) {
    console.error('Error adding FAQ:', error);
    res.status(500).json({ message: 'Failed to add FAQ', error: error.message });
  }
});

// Update chatbot FAQ (admin only)
router.put('/faqs/:id', authenticateToken, authorize(['admin']), async (req, res) => {
  try {
    const faq = await ChatbotFAQ.findById(req.params.id);
    
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    // Update fields
    const fieldsToUpdate = ['question', 'answer', 'keywords', 'category'];
    
    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        faq[field] = req.body[field];
      }
    });

    faq.updatedAt = Date.now();
    await faq.save();
    
    res.json(faq);
  } catch (error) {
    console.error('Error updating FAQ:', error);
    res.status(500).json({ message: 'Failed to update FAQ', error: error.message });
  }
});

// Delete chatbot FAQ (admin only)
router.delete('/faqs/:id', authenticateToken, authorize(['admin']), async (req, res) => {
  try {
    const faq = await ChatbotFAQ.findById(req.params.id);
    
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    await ChatbotFAQ.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    res.status(500).json({ message: 'Failed to delete FAQ' });
  }
});

// Get chatbot response for a query
router.post('/query', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ message: 'Query is required' });
    }

    // Simple keyword matching algorithm
    const faqs = await ChatbotFAQ.find();
    let bestMatch = null;
    let highestScore = 0;

    // Convert query to lowercase for case-insensitive matching
    const lowerQuery = query.toLowerCase();

    // Check each FAQ for keyword matches
    for (const faq of faqs) {
      let score = 0;
      
      // Check if query contains the question
      if (lowerQuery.includes(faq.question.toLowerCase())) {
        score += 10;
      }
      
      // Check if query contains any keywords
      for (const keyword of faq.keywords) {
        if (lowerQuery.includes(keyword.toLowerCase())) {
          score += 5;
        }
      }
      
      // Check if query contains words from the question
      const questionWords = faq.question.toLowerCase().split(/\s+/);
      for (const word of questionWords) {
        if (word.length > 3 && lowerQuery.includes(word)) {
          score += 2;
        }
      }
      
      // Update best match if this FAQ has a higher score
      if (score > highestScore) {
        highestScore = score;
        bestMatch = faq;
      }
    }

    // If no good match found, return a default response
    if (highestScore < 2) {
      return res.json({
        answer: "I'm sorry, I don't have information about that. Please contact the college office for more details.",
        confidence: 0
      });
    }

    // Return the best matching FAQ
    res.json({
      answer: bestMatch.answer,
      confidence: Math.min(highestScore / 20, 1) // Normalize confidence score between 0 and 1
    });
  } catch (error) {
    console.error('Error processing chatbot query:', error);
    res.status(500).json({ message: 'Failed to process chatbot query' });
  }
});

module.exports = router;
