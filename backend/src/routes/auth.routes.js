import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validate.js';
import User from '../models/User.js';

const router = express.Router();

// Admin login
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validateRequest
], async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    // Find admin user
    const user = await User.findOne({
      where: {
        email,
        role: 'admin',
        isActive: true
      }
    });

    if (!user) {
      console.log('User not found or not an admin');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('User found:', {
      id: user.id,
      email: user.email,
      role: user.role
    });

    // Check password using the instance method
    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful, token generated');

    // Return user info and token
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current admin user
router.get('/me', async (req, res) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find admin user
    const user = await User.findOne({
      where: {
        id: decoded.id,
        role: 'admin',
        isActive: true
      },
      attributes: ['id', 'email', 'firstName', 'lastName', 'role']
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Auth error:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    res.status(500).json({ error: 'Authentication failed' });
  }
});

export default router; 