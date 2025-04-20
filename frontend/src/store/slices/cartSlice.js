import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  total: 0
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { item, quantity = 1 } = action.payload;
      
      // Get the item ID (support both _id and id)
      const itemId = item._id || item.id;
      
      if (!item || !itemId || !item.name || typeof item.price !== 'number') {
        console.error('Invalid item data:', action.payload);
        return;
      }

      const existingItem = state.items.find(cartItem => cartItem.id === itemId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id: itemId,
          name: item.name,
          price: item.price,
          quantity,
          specialInstructions: item.specialInstructions
        });
      }

      state.total = calculateTotal(state.items);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.total = calculateTotal(state.items);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item && typeof quantity === 'number' && quantity > 0) {
        item.quantity = quantity;
        state.total = calculateTotal(state.items);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    }
  }
});

// Helper function to calculate total
const calculateTotal = (items) => {
  return items.reduce((total, item) => {
    const itemPrice = typeof item.price === 'number' ? item.price : 0;
    const itemQuantity = typeof item.quantity === 'number' ? item.quantity : 0;
    return total + (itemPrice * itemQuantity);
  }, 0);
};

// Memoized selectors
const selectCartState = (state) => state.cart;

export const selectCartItems = createSelector(
  [selectCartState],
  (cart) => cart.items
);

export const selectCartTotal = createSelector(
  [selectCartItems],
  (items) => {
    return items.reduce((total, item) => {
      const itemPrice = typeof item.price === 'number' ? item.price : 0;
      const itemQuantity = typeof item.quantity === 'number' ? item.quantity : 0;
      return total + (itemPrice * itemQuantity);
    }, 0);
  }
);

export const selectCartItemCount = createSelector(
  [selectCartItems],
  (items) => {
    return items.reduce((count, item) => {
      const itemQuantity = typeof item.quantity === 'number' ? item.quantity : 0;
      return count + itemQuantity;
    }, 0);
  }
);

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer; 