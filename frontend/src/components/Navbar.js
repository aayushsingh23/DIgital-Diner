import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Drawer,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Restaurant as RestaurantIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  History as HistoryIcon,
  Menu as MenuIcon, // Hamburger icon
} from '@mui/icons-material';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import { selectCartItemCount } from '../store/slices/cartSlice';
import { logout } from '../store/slices/authSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const cartItemCount = useSelector(selectCartItemCount);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if the screen is mobile size

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await dispatch(logout());
    navigate('/admin/login');
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          {isMobile && ( // Only show hamburger icon on mobile size
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <RestaurantIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Digital Diner
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button color="inherit" onClick={() => navigate('/menu')}>
              Menu
            </Button>

            <Button
              color="inherit"
              startIcon={<HistoryIcon />}
              onClick={() => navigate('/order-history')}
            >
              Order History
            </Button>

            <IconButton
              color="inherit"
              onClick={() => navigate('/cart')}
              sx={{ mr: 1 }}
            >
              <Badge badgeContent={cartItemCount} color="error">
                <CartIcon />
              </Badge>
            </IconButton>

            {isAuthenticated ? (
              <>
                <Button color="inherit" onClick={() => navigate('/admin/dashboard')}>
                  Admin Dashboard
                </Button>
                <IconButton
                  color="inherit"
                  onClick={handleMenuOpen}
                  aria-label="account menu"
                >
                  <PersonIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button color="inherit" onClick={() => navigate('/admin/login')}>
                Admin Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer for hidden menu options */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          width: 240, 
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ width: 240, padding: 2 }}>
          <Typography variant="h6">Menu</Typography>
          <Button color="inherit" onClick={() => navigate('/menu')}>
            Menu
          </Button>
          <Button
            color="inherit"
            startIcon={<HistoryIcon />}
            onClick={() => navigate('/order-history')}
          >
            Order History
          </Button>
          {isAuthenticated ? (
            <>
              <Button color="inherit" onClick={() => navigate('/admin/dashboard')}>
                Admin Dashboard
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={() => navigate('/admin/login')}>
              Admin Login
            </Button>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
