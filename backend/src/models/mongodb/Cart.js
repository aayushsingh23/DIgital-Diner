import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  menuItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  specialInstructions: String
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: String, // References PostgreSQL user ID
    required: true
  },
  items: [cartItemSchema],
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Cart expires after 24 hours
  }
}, {
  timestamps: true
});

// Create indexes
cartSchema.index({ userId: 1 });
cartSchema.index({ createdAt: 1 });

const Cart = mongoose.model('Cart', cartSchema);

export default Cart; 