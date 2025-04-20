import { DataTypes } from 'sequelize';
import sequelize from '../../config/postgresql.js';

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Orders',
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
    defaultValue: 'pending'
  },
  paymentMethod: {
    type: DataTypes.ENUM('credit_card', 'debit_card', 'cash'),
    allowNull: false
  },
  transactionId: {
    type: DataTypes.STRING,
    unique: true
  },
  paymentDetails: {
    type: DataTypes.JSONB,
    allowNull: true
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['orderId']
    },
    {
      fields: ['transactionId']
    },
    {
      fields: ['status']
    }
  ]
});

// Define associations
Payment.associate = (models) => {
  Payment.belongsTo(models.Order, {
    foreignKey: 'orderId',
    as: 'order'
  });
};

export default Payment; 