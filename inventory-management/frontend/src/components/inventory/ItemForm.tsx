// src/components/inventory/ItemForm.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Paper,
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  MenuItem,
  Alert,
  LinearProgress,
} from '@mui/material';
import { useNotification } from '../../context/NotificationContext';
import { apiService, Category, Location } from '../../services/api';
import { ItemFormData } from '../../types/inventory';
import { useApi } from '../../hooks/useApi';

const INITIAL_FORM_DATA: ItemFormData = {
  name: '',
  sku: '',
  description: '',
  category: '',
  location: '',
  quantity: 0,
  minimum_stock: 0,
  maximum_stock: 0,
  unit_price: 0,
  barcode: '',
  expiration_date: '',
};

const ItemForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { loading, error, callApi } = useApi();
  const [formData, setFormData] = useState<ItemFormData>(INITIAL_FORM_DATA);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    // Load categories and locations
    await Promise.all([
      callApi(
        () => apiService.getCategories(),
        {
          onSuccess: (data) => setCategories(data),
          errorMessage: 'Failed to load categories',
        }
      ),
      callApi(
        () => apiService.getLocations(),
        {
          onSuccess: (data) => setLocations(data),
          errorMessage: 'Failed to load locations',
        }
      ),
    ]);

    // Load item data if editing
    if (id) {
      await callApi(
        () => apiService.getItem(id),
        {
          onSuccess: (data: ItemFormData) => setFormData(data),
          errorMessage: 'Failed to load item',
        }
      );
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' || name === 'unit_price' || 
              name === 'minimum_stock' || name === 'maximum_stock' 
              ? Number(value) 
              : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (id) {
      await callApi(
        () => apiService.updateItem(id, formData),
        {
          onSuccess: () => {
            showNotification('Item updated successfully', 'success');
            navigate('/inventory');
          },
          errorMessage: 'Failed to update item',
        }
      );
    } else {
      await callApi(
        () => apiService.createItem(formData),
        {
          onSuccess: () => {
            showNotification('Item created successfully', 'success');
            navigate('/inventory');
          },
          errorMessage: 'Failed to create item',
        }
      );
    }
  };

  if (loading && !formData.name) {
    return <LinearProgress />;
  }

  return (
    <Paper sx={{ p: 3 }}>
      {/* ... rest of the component remains the same ... */}
    </Paper>
  );
};

export default ItemForm;