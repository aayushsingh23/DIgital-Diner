import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Checkbox,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  IconButton
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import {
  fetchMenuItem,
  createMenuItem,
  updateMenuItem,
  selectMenuStatus,
  selectMenuError,
  selectCurrentMenuItem
} from '../../store/slices/menuSlice';

function MenuItemForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const status = useSelector(selectMenuStatus);
  const error = useSelector(selectMenuError);
  const currentItem = useSelector(selectCurrentMenuItem);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    ingredients: [],
    allergens: [],
    isAvailable: true,
    image: ''
  });

  const [newIngredient, setNewIngredient] = useState('');
  const [newAllergen, setNewAllergen] = useState('');

  // Load menu item data when editing
  useEffect(() => {
    if (id && id !== 'undefined') {
      dispatch(fetchMenuItem(id));
    }
  }, [dispatch, id]);

  // Update form data when currentItem changes
  useEffect(() => {
    if (currentItem) {
      setFormData({
        name: currentItem.name || '',
        description: currentItem.description || '',
        price: currentItem.price ? currentItem.price.toString() : '',
        category: currentItem.category || '',
        ingredients: currentItem.ingredients || [],
        allergens: currentItem.allergens || [],
        isAvailable: currentItem.isAvailable ?? true,
        image: currentItem.image || ''
      });
    }
  }, [currentItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'price', 'category'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Validate price
    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0) {
      toast.error('Please enter a valid price');
      return;
    }

    try {
      const data = {
        ...formData,
        price: price,
        ingredients: formData.ingredients || [],
        allergens: formData.allergens || [],
        isAvailable: Boolean(formData.isAvailable)
      };

      if (id && id !== 'undefined') {
        await dispatch(updateMenuItem({ id, data })).unwrap();
        toast.success('Menu item updated successfully');
      } else {
        await dispatch(createMenuItem(data)).unwrap();
        toast.success('Menu item created successfully');
      }
      navigate('/admin/menu-items');
    } catch (error) {
      toast.error(`Failed to save menu item: ${error.message || 'Unknown error'}`);
    }
  };

  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      setFormData({
        ...formData,
        ingredients: [...formData.ingredients, newIngredient.trim()]
      });
      setNewIngredient('');
    }
  };

  const handleRemoveIngredient = (ingredient) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter(i => i !== ingredient)
    });
  };

  const handleAddAllergen = () => {
    if (newAllergen.trim()) {
      setFormData({
        ...formData,
        allergens: [...formData.allergens, newAllergen.trim()]
      });
      setNewAllergen('');
    }
  };

  const handleRemoveAllergen = (allergen) => {
    setFormData({
      ...formData,
      allergens: formData.allergens.filter(a => a !== allergen)
    });
  };

  if (status === 'loading') {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {id ? 'Edit Menu Item' : 'Add New Menu Item'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={3}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                inputProps={{ min: 0, step: 0.01 }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Box mb={2}>
                <Typography variant="subtitle1" gutterBottom>
                  Ingredients
                </Typography>
                <Box display="flex" gap={1} mb={1}>
                  <TextField
                    size="small"
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    placeholder="Add ingredient"
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddIngredient}
                    startIcon={<AddIcon />}
                  >
                    Add
                  </Button>
                </Box>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {formData.ingredients.map((ingredient) => (
                    <Chip
                      key={ingredient}
                      label={ingredient}
                      onDelete={() => handleRemoveIngredient(ingredient)}
                    />
                  ))}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box mb={2}>
                <Typography variant="subtitle1" gutterBottom>
                  Allergens
                </Typography>
                <Box display="flex" gap={1} mb={1}>
                  <TextField
                    size="small"
                    value={newAllergen}
                    onChange={(e) => setNewAllergen(e.target.value)}
                    placeholder="Add allergen"
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddAllergen}
                    startIcon={<AddIcon />}
                  >
                    Add
                  </Button>
                </Box>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {formData.allergens.map((allergen) => (
                    <Chip
                      key={allergen}
                      label={allergen}
                      onDelete={() => handleRemoveAllergen(allergen)}
                    />
                  ))}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  />
                }
                label="Available"
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" gap={2}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={status === 'loading'}
                >
                  {id ? 'Update' : 'Create'} Menu Item
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/admin/menu-items')}
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}

export default MenuItemForm; 