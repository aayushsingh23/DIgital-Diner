import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import { toast } from 'react-toastify';
import { fetchOrderHistory } from '../store/slices/orderSlice';
import { selectOrderHistory, selectOrdersStatus, selectOrderError } from '../store/slices/orderSlice';

function OrderHistory() {
  const dispatch = useDispatch();
  const [phoneNumber, setPhoneNumber] = useState('');
  const orders = useSelector(selectOrderHistory);
  const status = useSelector(selectOrdersStatus);
  const error = useSelector(selectOrderError);

  const handleSearch = async () => {
    if (!phoneNumber) {
      toast.error('Please enter your phone number');
      return;
    }
    try {
      await dispatch(fetchOrderHistory(phoneNumber)).unwrap();
    } catch (error) {
      toast.error('Failed to fetch order history');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'info';
      case 'ready':
        return 'success';
      case 'completed':
        return 'primary';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Order History
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter the phone number used for ordering"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSearch}
                disabled={!phoneNumber}
              >
                Search Orders
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {status === 'loading' && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {orders.length === 0 && status === 'succeeded' && (
        <Alert severity="info" sx={{ mb: 4 }}>
          No orders found for this phone number
        </Alert>
      )}

      {orders.map((order, orderIndex) => {
        // Ensure totalAmount is a number
        const totalAmount = typeof order.totalAmount === 'string' 
          ? parseFloat(order.totalAmount) 
          : order.totalAmount;

        // Use _id if available, otherwise use id or create a unique key
        const orderId = order._id || order.id || `order-${orderIndex}-${Date.now()}`;

        return (
          <div key={orderId}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Order #{orderId.slice(0, 8)}
                    </Typography>
                    <Typography color="text.secondary">
                      Placed on: {formatDate(order.createdAt)}
                    </Typography>
                    <Typography color="text.secondary">
                      Customer: {order.customerName}
                    </Typography>
                    <Typography color="text.secondary">
                      Phone: {order.phoneNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6} container justifyContent="flex-end">
                    <Chip
                      label={order.status?.toUpperCase() || 'PENDING'}
                      color={getStatusColor(order.status)}
                      sx={{ mb: 2 }}
                    />
                    <Typography variant="h6">
                      Total: ${totalAmount?.toFixed(2) || '0.00'}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1" gutterBottom>
                  Order Items:
                </Typography>
                {order.items?.map((item, index) => (
                  <div key={`${orderId}-item-${index}`}>
                    <Typography>
                      {item.quantity}x {item.name} - ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </div>
                ))}

                {order.specialInstructions && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" gutterBottom>
                      Special Instructions:
                    </Typography>
                    <Typography color="text.secondary">
                      {order.specialInstructions}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        );
      })}
    </Box>
  );
}

export default OrderHistory; 