import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { clearCart } from './cartSlice';

const API_URL = import.meta.env.VITE_API_URL;

// Admin order management
export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async () => {
    const response = await axios.get(`${API_URL}/api/orders`);
    return response.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  'order/updateOrderStatus',
  async ({ orderId, status }) => {
    const response = await axios.patch(`${API_URL}/api/orders/${orderId}/status`, { status });
    return response.data;
  }
);

// Customer order management
export const placeOrder = createAsyncThunk(
  'order/placeOrder',
  async ({ orderData }, { dispatch }) => {
    const response = await axios.post(`${API_URL}/api/orders`, orderData);
    dispatch(clearCart());
    return response.data;
  }
);

export const fetchOrderHistory = createAsyncThunk(
  'order/fetchOrderHistory',
  async (phoneNumber) => {
    const response = await axios.get(`${API_URL}/api/orders/phone/${phoneNumber}`);
    return response.data;
  }
);

export const cancelOrder = createAsyncThunk(
  'order/cancelOrder',
  async (orderId) => {
    const response = await axios.post(`${API_URL}/api/orders/${orderId}/cancel`);
    return response.data;
  }
);

const initialState = {
  orders: [], // For admin view
  currentOrder: null,
  orderHistory: [],
  status: 'idle',
  error: null
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Admin order management
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        state.orders = state.orders.map(order =>
          order.id === updatedOrder.id ? updatedOrder : order
        );
      })
      // Customer order management
      .addCase(placeOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentOrder = action.payload;
        state.error = null;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.orderHistory = action.payload;
      })
      .addCase(fetchOrderHistory.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const cancelledOrder = action.payload;
        state.orders = state.orders.map(order =>
          order.id === cancelledOrder.id ? cancelledOrder : order
        );
        state.orderHistory = state.orderHistory.map(order =>
          order.id === cancelledOrder.id ? cancelledOrder : order
        );
      });
  }
});

export const { clearCurrentOrder } = orderSlice.actions;

// Admin selectors
export const selectOrders = (state) => state.order.orders;
export const selectOrdersStatus = (state) => state.order.status;

// Customer selectors
export const selectCurrentOrder = (state) => state.order.currentOrder;
export const selectOrderHistory = (state) => state.order.orderHistory;
export const selectOrderError = (state) => state.order.error;

export default orderSlice.reducer; 