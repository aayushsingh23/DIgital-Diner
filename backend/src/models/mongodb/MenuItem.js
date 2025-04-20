import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['appetizer', 'main', 'dessert', 'beverage']
  },
  ingredients: [{
    name: String,
    quantity: String
  }],
  allergens: [String],
  isAvailable: {
    type: Boolean,
    default: true
  },
  imageUrl: String,
  preparationTime: {
    type: Number, // in minutes
    required: true
  },
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  }
}, {
  timestamps: true
});

// Create indexes
menuItemSchema.index({ category: 1 });
menuItemSchema.index({ name: 'text', description: 'text' });
menuItemSchema.index({ isAvailable: 1 });

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

export default MenuItem; 