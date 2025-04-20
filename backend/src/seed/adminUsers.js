import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import sequelize from '../config/postgresql.js';
import User from '../models/postgresql/User.js';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../../.env') });

const adminUsers = [
  {
    firstName: 'Super',
    lastName: 'Admin',
    email: 'admin@diner.com',
    password: 'Admin@123',
    phoneNumber: '+1234567890',
    role: 'admin',
    isActive: true
  },
  {
    firstName: 'Restaurant',
    lastName: 'Manager',
    email: 'manager@diner.com',
    password: 'Manager@123',
    phoneNumber: '+0987654321',
    role: 'admin',
    isActive: true
  }
];

const seedAdminUsers = async () => {
  try {
    // Connect to PostgreSQL
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL');

    // Sync the database
    await sequelize.sync();
    console.log('Database synced');

    // Clear existing admin users
    await User.destroy({
      where: { role: 'admin' }
    });
    console.log('Cleared existing admin users');

    // Hash passwords and create admin users
    const hashedUsers = await Promise.all(
      adminUsers.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return {
          ...user,
          password: hashedPassword
        };
      })
    );

    // Insert admin users
    await User.bulkCreate(hashedUsers);
    console.log('Created admin users:', adminUsers.map(user => user.email));

    // Close the database connection
    await sequelize.close();
    console.log('Disconnected from PostgreSQL');
  } catch (error) {
    console.error('Error seeding admin users:', error);
    process.exit(1);
  }
};

seedAdminUsers(); 