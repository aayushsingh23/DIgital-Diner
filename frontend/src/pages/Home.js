import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: { xs: 6, md: 8 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ typography: { xs: 'h3', md: 'h2' } }}
          >
            The Digital Diner
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ typography: { xs: 'h6', md: 'h5' } }}
          >
           Explore our delicious menu items and find your favorites
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate('/menu')}
            sx={{ mt: 4 }}
          >
            Order Now
          </Button>
        </Container>
      </Box>


    </Box>
  );
};

export default Home; 