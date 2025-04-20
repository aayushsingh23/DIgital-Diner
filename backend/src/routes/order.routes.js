import express from 'express';
import { body, param } from 'express-validator';
import Order from '../models/Order.js';
import { validateRequest } from '../middleware/validate.js';

const router = express.Router();

// Create a new order
router.post('/', [
  body('customerName').trim().notEmpty(),
  body('phoneNumber').trim().notEmpty(),
  body('items').isArray({ min: 1 }),
  body('items.*.id').isString(),
  body('items.*.quantity').isInt({ min: 1 }),
  body('totalAmount').isFloat({ min: 0 }),
  validateRequest
], async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get all orders (for admin)
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all orders...');
    const orders = await Order.findAll({
      order: [['createdAt', 'DESC']]
    });
    console.log('Orders fetched successfully:', orders.length);
    res.json(orders);
  } catch (error) {
    console.error('Detailed error fetching orders:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      error: 'Failed to fetch orders',
      details: error.message 
    });
  }
});

// Get orders by phone number
router.get('/phone/:phoneNumber', async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const orders = await Order.findAll({
      where: { phoneNumber },
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders by phone number:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get a specific order
router.get('/:id', [
  param('id').isString(),
  validateRequest
], async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status
router.patch('/:id/status', [
  param('id').isString(),
  body('status').isIn(['pending', 'confirmed', 'ready', 'completed', 'cancelled']),
  validateRequest
], async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    await order.update({ status: req.body.status });
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Cancel an order
router.post('/:id/cancel', [
  param('id').isString(),
  validateRequest
], async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    await order.update({ status: 'cancelled' });
    res.json(order);
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

export default router; 