import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.POSTGRES_URI) {
  console.error('POSTGRES_URI environment variable is not set');
  process.exit(1);
}

console.log('Attempting to connect to PostgreSQL with URI:', process.env.POSTGRES_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  dialect: 'postgres',
  logging: console.log, // Enable SQL query logging
  dialectOptions: {
    ssl: false
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  retry: {
    match: [
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeHostNotFoundError/,
      /SequelizeHostNotReachableError/,
      /SequelizeInvalidConnectionError/,
      /SequelizeConnectionTimedOutError/,
      /TimeoutError/
    ],
    max: 3
  }
});

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL successfully');
    
    // Test a simple query
    const result = await sequelize.query('SELECT current_database()');
    console.log('Current database:', result[0][0].current_database);
  } catch (error) {
    console.error('PostgreSQL connection error:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    console.error('Please ensure PostgreSQL is running and the connection string is correct');
    process.exit(1);
  }
};

testConnection();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  try {
    await sequelize.close();
    console.log('PostgreSQL connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error closing PostgreSQL connection:', error);
    process.exit(1);
  }
});

export default sequelize; 