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
    enum: ['Appetizers', 'Main Courses', 'Desserts', 'Drinks'],
    trim: true
  },
  image: {
    type: String,
    required: false
  },
  ingredients: {
    type: [String],
    required: true,
    default: []
  },
  allergens: {
    type: [String],
    required: true,
    default: []
  },
  isAvailable: {
    type: Boolean,
    required: true,
    default: true
  },
  customizationOptions: [{
    name: String,
    options: [{
      name: String,
      priceAdjustment: Number
    }]
  }]
}, {
  timestamps: true
});

// Create indexes for better query performance
menuItemSchema.index({ category: 1 });
menuItemSchema.index({ isAvailable: 1 });

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

export default MenuItem; 