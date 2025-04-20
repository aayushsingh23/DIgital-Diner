import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import User from '../models/postgresql/User.js';
import sequelize from './postgresql.js';

const initDb = async () => {
  try {
    // Check if tables exist
    const [ordersTable] = await sequelize.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Orders')"
    );
    const [usersTable] = await sequelize.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Users')"
    );

    console.log('Orders table exists:', ordersTable[0].exists);
    console.log('Users table exists:', usersTable[0].exists);

    // Sync tables if they don't exist
    if (!ordersTable[0].exists) {
      console.log('Creating Orders table...');
      await Order.sync({ force: true });
      console.log('Orders table created successfully');
    } else {
      console.log('Synchronizing Orders table...');
      await Order.sync({ alter: true });
      console.log('Orders table synchronized successfully');
    }

    if (!usersTable[0].exists) {
      console.log('Creating Users table...');
      await User.sync({ force: true });
      console.log('Users table created successfully');

      // Run the admin users seed after creating the table
      const { seedAdminUsers } = await import('../seed/adminUsers.js');
      await seedAdminUsers();
      console.log('Admin users seeded successfully');
    } else {
      console.log('Synchronizing Users table...');
      await User.sync({ alter: true });
      console.log('Users table synchronized successfully');
    }

    return true;
  } catch (error) {
    console.error('Error initializing database:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    throw error;
  }
};

export default initDb; 