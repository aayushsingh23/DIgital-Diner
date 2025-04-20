import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { Provider } from 'react-redux';
import store from './store';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Login from './pages/auth/Login';
import Dashboard from './pages/admin/Dashboard';
import MenuItems from './pages/admin/MenuItems';
import MenuItemForm from './pages/admin/MenuItemForm';
import Orders from './pages/admin/Orders';
import ProtectedRoute from './components/ProtectedRoute';
import OrderHistory from './pages/OrderHistory';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2B4570',
    },
    secondary: {
      main: '#A8D0DB',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ErrorBoundary>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <Box component="main" sx={{ flexGrow: 1, pt: 8 }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-confirmation" element={<OrderConfirmation />} />
                  <Route path="/order-history" element={<OrderHistory />} />
                  <Route path="/admin/login" element={<Login />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={<ProtectedRoute />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="menu-items" element={<MenuItems />} />
                    <Route path="menu-items/new" element={<MenuItemForm />} />
                    <Route path="menu-items/:id/edit" element={<MenuItemForm />} />
                    <Route path="orders" element={<Orders />} />
                  </Route>
                  
                  {/* Catch all route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Box>
            </Box>
          </ErrorBoundary>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App; 