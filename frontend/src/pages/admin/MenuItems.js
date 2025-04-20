import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { fetchMenuItems, deleteMenuItem } from '../../store/slices/menuSlice';

const MenuItems = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, status } = useSelector((state) => state.menu);

  useEffect(() => {
    dispatch(fetchMenuItems());
  }, [dispatch]);

  const handleAdd = () => {
    navigate('/admin/menu-items/new');
  };

  const handleEdit = (id) => {
    navigate(`/admin/menu-items/${id}/edit`);
  };

  const handleDelete = async (id) => {
    if (!id) {
      console.error('No ID provided for deletion');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await dispatch(deleteMenuItem(id)).unwrap();
        dispatch(fetchMenuItems());
      } catch (error) {
        console.error('Failed to delete menu item:', error);
      }
    }
  };

  if (status === 'loading') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Menu Items
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add Menu Item
        </Button>
      </Box>

      <Grid container spacing={4}>
        {items.map((item, index) => {
          // Get the correct ID (support both _id and id)
          const itemId = item._id || item.id;
          
          return (
            <Grid item xs={12} sm={6} md={4} key={`${itemId}-${index}`}>
              <Card>
                {item.image && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.image}
                    alt={item.name}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {item.description}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ${(typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0).toFixed(2)}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(itemId)}
                    aria-label="edit"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(itemId)}
                    aria-label="delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default MenuItems; 