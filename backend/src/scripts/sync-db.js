import sequelize from '../config/database.js';
import Order from '../models/Order.js';

async function syncDatabase() {
  try {
    // Test the database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync all models
    await sequelize.sync({ force: true }); // force: true will drop existing tables
    console.log('Database tables have been created successfully.');

    process.exit(0);
  } catch (error) {
    console.error('Unable to sync database:', error);
    process.exit(1);
  }
}

syncDatabase(); 