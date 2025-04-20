import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Divider,
  Chip,
  Alert
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { selectCurrentOrder } from '../store/slices/orderSlice';

function OrderConfirmation() {
  const navigate = useNavigate();
  const order = useSelector(selectCurrentOrder);

  if (!order) {
    return (
      <Box textAlign="center" mt={4}>
        <Alert severity="error" sx={{ mb: 2 }}>
          No order found. Please place an order first.
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
        >
          Back to Menu
        </Button>
      </Box>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Ensure totalAmount is a number
  const totalAmount = typeof order.totalAmount === 'string' 
    ? parseFloat(order.totalAmount) 
    : order.totalAmount;

  return (
    <Box>
      <Box textAlign="center" mb={4}>
        <CheckCircleIcon color="success" sx={{ fontSize: 60 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Order Confirmed!
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Thank you for your order
        </Typography>
        <Typography variant="body1" color="text.secondary">
          We'll notify you when your order is ready for pickup
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Order #{order._id?.slice(0, 8) || 'N/A'}
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
                color="success"
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
            <Box key={index} sx={{ mb: 1 }}>
              <Typography>
                {item.quantity}x {item.name} - ${(item.price * item.quantity).toFixed(2)}
              </Typography>
            </Box>
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

      <Box mt={4} display="flex" justifyContent="center" gap={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
        >
          Back to Menu
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate('/order-history')}
        >
          View Order History
        </Button>
      </Box>
    </Box>
  );
}

export default OrderConfirmation; 