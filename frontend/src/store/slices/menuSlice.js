import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Fetch all menu items
export const fetchMenuItems = createAsyncThunk(
  'menu/fetchMenuItems',
  async () => {
    // Uncomment the following line to fetch from the API
    // const response = await axios.get(`${API_URL}/api/menu`);
    const response = await axios.get('/menu.json');
    return response.data;
  }
);

// Fetch single menu item
export const fetchMenuItem = createAsyncThunk(
  'menu/fetchMenuItem',
  async (id) => {
    const response = await axios.get(`${API_URL}/api/menu/${id}`);
    return response.data;
  }
);

// Create menu item
export const createMenuItem = createAsyncThunk(
  'menu/createMenuItem',
  async (data) => {
    const response = await axios.post(`${API_URL}/api/menu`, data);
    return response.data;
  }
);

// Update menu item
export const updateMenuItem = createAsyncThunk(
  'menu/updateMenuItem',
  async ({ id, data }) => {
    const response = await axios.put(`${API_URL}/api/menu/${id}`, data);
    return response.data;
  }
);

// Delete menu item
export const deleteMenuItem = createAsyncThunk(
  'menu/deleteMenuItem',
  async (id, { rejectWithValue }) => {
    try {
      if (!id) {
        throw new Error('No ID provided for deletion');
      }
      await axios.delete(`${API_URL}/api/menu/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete menu item');
    }
  }
);

const initialState = {
  items: [],
  currentItem: null,
  status: 'idle',
  error: null
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    clearCurrentItem: (state) => {
      state.currentItem = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all menu items
      .addCase(fetchMenuItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Fetch single menu item
      .addCase(fetchMenuItem.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMenuItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentItem = action.payload;
        state.error = null;
      })
      .addCase(fetchMenuItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Create menu item
      .addCase(createMenuItem.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createMenuItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(createMenuItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Update menu item
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.currentItem = action.payload;
      })
      // Delete menu item
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  }
});

export const { clearCurrentItem } = menuSlice.actions;

export const selectMenuItems = (state) => state.menu.items;
export const selectCurrentMenuItem = (state) => state.menu.currentItem;
export const selectMenuStatus = (state) => state.menu.status;
export const selectMenuError = (state) => state.menu.error;

export default menuSlice.reducer; 