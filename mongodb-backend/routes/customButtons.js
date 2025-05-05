const express = require('express');
const router = express.Router();
const CustomButton = require('../models/CustomButton');
const { authenticateToken, authorize } = require('../middleware/auth');

// Get all custom buttons (public)
router.get('/', async (req, res) => {
  try {
    const buttons = await CustomButton.find().sort({ displayOrder: 1 });
    res.json(buttons);
  } catch (error) {
    console.error('Error fetching custom buttons:', error);
    res.status(500).json({ message: 'Failed to fetch custom buttons' });
  }
});

// Get custom button by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const button = await CustomButton.findById(req.params.id);
    
    if (!button) {
      return res.status(404).json({ message: 'Custom button not found' });
    }
    
    res.json(button);
  } catch (error) {
    console.error('Error fetching custom button:', error);
    res.status(500).json({ message: 'Failed to fetch custom button' });
  }
});

// Admin routes
// Add a new custom button (admin only)
router.post('/', authenticateToken, authorize(['admin']), async (req, res) => {
  try {
    const { title, url, iconType, displayOrder, isActive } = req.body;

    if (!title || !url) {
      return res.status(400).json({ message: 'Title and URL are required' });
    }

    // Create new custom button
    const button = new CustomButton({
      title,
      url,
      iconType: iconType || 'lightning',
      displayOrder: displayOrder || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    await button.save();
    
    res.status(201).json(button);
  } catch (error) {
    console.error('Error adding custom button:', error);
    res.status(500).json({ message: 'Failed to add custom button', error: error.message });
  }
});

// Update custom button (admin only)
router.put('/:id', authenticateToken, authorize(['admin']), async (req, res) => {
  try {
    const { title, url, iconType, displayOrder, isActive } = req.body;
    
    if (!title || !url) {
      return res.status(400).json({ message: 'Title and URL are required' });
    }

    const button = await CustomButton.findById(req.params.id);
    
    if (!button) {
      return res.status(404).json({ message: 'Custom button not found' });
    }

    // Update button fields
    button.title = title;
    button.url = url;
    button.iconType = iconType || 'lightning';
    button.displayOrder = displayOrder !== undefined ? displayOrder : button.displayOrder;
    button.isActive = isActive !== undefined ? isActive : button.isActive;
    button.updatedAt = Date.now();

    await button.save();
    
    res.json(button);
  } catch (error) {
    console.error('Error updating custom button:', error);
    res.status(500).json({ message: 'Failed to update custom button', error: error.message });
  }
});

// Delete custom button (admin only)
router.delete('/:id', authenticateToken, authorize(['admin']), async (req, res) => {
  try {
    const button = await CustomButton.findById(req.params.id);
    
    if (!button) {
      return res.status(404).json({ message: 'Custom button not found' });
    }

    await CustomButton.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Custom button deleted successfully' });
  } catch (error) {
    console.error('Error deleting custom button:', error);
    res.status(500).json({ message: 'Failed to delete custom button' });
  }
});

module.exports = router;
