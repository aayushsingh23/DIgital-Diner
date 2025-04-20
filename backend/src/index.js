import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';

// Import database connections
import './config/mongodb.js';
import sequelize from './config/database.js';
import Order from './models/Order.js';
import User from './models/User.js';

// Import routes
import menuRoutes from './routes/menu.routes.js';
import orderRoutes from './routes/order.routes.js';
import menuItemRoutes from './routes/menuItem.routes.js';
import adminRoutes from './routes/admin.routes.js';
import authRoutes from './routes/auth.routes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    '',
    ''
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sync PostgreSQL database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('PostgreSQL database synchronized successfully');
    
    // Create admin user if it doesn't exist
    const adminUser = await User.findOne({ where: { email: 'manager@resturant.com' } });
    if (!adminUser) {
      await User.create({
        email: 'manager@resturant.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isActive: true
      });
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error synchronizing PostgreSQL database:', error);
  }
};

// Routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/menu-items', menuItemRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, async () => {
  await syncDatabase();
  console.log(`Server is running on port ${PORT}`);
}); 