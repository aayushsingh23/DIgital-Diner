import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  ShoppingCart as CartIcon,
  Receipt as OrderIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { fetchMenuItems } from '../../store/slices/menuSlice';
import { fetchOrders, selectOrders, selectOrdersStatus } from '../../store/slices/orderSlice';
import { logout } from '../../store/slices/authSlice';

const StatCard = ({ title, value, icon, color }) => (
  <Card>
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
        {icon}
        <Typography variant="h6" component="div" sx={{ ml: 1 }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" color={color}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: menuItems, status: menuStatus } = useSelector((state) => state.menu);
  const orders = useSelector(selectOrders);
  const ordersStatus = useSelector(selectOrdersStatus);

  useEffect(() => {
    dispatch(fetchMenuItems());
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/admin/login');
  };

  if (menuStatus === 'loading' || ordersStatus === 'loading') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  const stats = [
    {
      title: 'Total Menu Items',
      value: menuItems.length,
      icon: <RestaurantIcon color="primary" />,
      color: 'primary',
    },
    {
      title: 'Total Orders',
      value: orders.length,
      icon: <OrderIcon color="secondary" />,
      color: 'secondary',
    },
    {
      title: 'Active Orders',
      value: orders.filter((order) => order.status === 'pending').length,
      icon: <CartIcon color="success" />,
      color: 'success',
    },
  ];

  return (
    <Box>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <IconButton
            color="inherit"
            onClick={handleLogout}
            sx={{ ml: 2 }}
            title="Logout"
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box p={3}>
        <Grid container spacing={3} mb={4}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <StatCard {...stat} />
            </Grid>
          ))}
        </Grid>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                startIcon={<RestaurantIcon />}
                onClick={() => navigate('/admin/menu-items')}
              >
                Manage Menu Items
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<OrderIcon />}
                onClick={() => navigate('/admin/orders')}
              >
                View Orders
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard; 