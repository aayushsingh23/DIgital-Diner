import express from 'express';
import { body, param, query } from 'express-validator';
import MenuItem from '../models/MenuItem.js';
import { validateRequest } from '../middleware/validate.js';

const router = express.Router();

// Get all menu items (with optional category filter)
router.get('/', [
  query('category').optional().isIn(['Appetizers', 'Main Courses', 'Desserts', 'Drinks']),
  validateRequest
], async (req, res) => {
  try {
    const filter = req.query.category ? { category: req.query.category } : {};
    const menuItems = await MenuItem.find(filter).sort({ category: 1, name: 1 });
    res.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// Get menu items by category
router.get('/categories', async (req, res) => {
  try {
    const menuItems = await MenuItem.aggregate([
      { $match: { isAvailable: true } },
      {
        $group: {
          _id: '$category',
          items: { $push: '$$ROOT' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu categories:', error);
    res.status(500).json({ error: 'Failed to fetch menu categories' });
  }
});

// Get a specific menu item
router.get('/:id', [
  param('id').isMongoId(),
  validateRequest
], async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json(menuItem);
  } catch (error) {
    console.error('Error fetching menu item:', error);
    res.status(500).json({ error: 'Failed to fetch menu item' });
  }
});

// Create a new menu item (admin only)
router.post('/', [
  body('name').trim().notEmpty(),
  body('description').trim().notEmpty(),
  body('price').isFloat({ min: 0 }),
  body('category').isIn(['Appetizers', 'Main Courses', 'Desserts', 'Drinks']),
  validateRequest
], async (req, res) => {
  try {
    const menuItem = new MenuItem(req.body);
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ error: 'Failed to create menu item' });
  }
});

// Update a menu item (admin only)
router.put('/:id', [
  param('id').isMongoId(),
  body('name').optional().trim().notEmpty(),
  body('description').optional().trim().notEmpty(),
  body('price').optional().isFloat({ min: 0 }),
  body('category').optional().isIn(['Appetizers', 'Main Courses', 'Desserts', 'Drinks']),
  validateRequest
], async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json(menuItem);
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ error: 'Failed to update menu item' });
  }
});

// Delete a menu item (admin only)
router.delete('/:id', [
  param('id').isMongoId(),
  validateRequest
], async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});

export default router; 