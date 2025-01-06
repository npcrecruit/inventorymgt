// src/components/inventory/ItemList.tsx
import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Tooltip,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalShipping,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { InventoryItem } from '../../types/inventory';
import { useApi } from '../../hooks/useApi';
import StockMovement from './StockMovement';

interface StockMovementFormData {
  quantity_changed: number;
  movement_type: 'in' | 'out';
  reason: string;
}

interface MovementDialogState {
  open: boolean;
  itemId: string | null;
  itemName: string;
}

const ItemList: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [movementDialog, setMovementDialog] = useState<{
    open: boolean;
    itemId: string | null;
    itemName: string;
  }>({
    open: false,
    itemId: null,
    itemName: '',
  });

  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { loading, callApi } = useApi();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    await callApi(
      () => apiService.getItems(),
      {
        onSuccess: (data: InventoryItem[]) => setItems(data),
        errorMessage: 'Failed to load inventory items',
      }
    );
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await callApi(
        () => apiService.deleteItem(id),
        {
          onSuccess: () => {
            loadItems();
            showNotification('Item deleted successfully', 'success');
          },
          errorMessage: 'Failed to delete item',
        }
      );
    }
  };

  const handleMovement = async (data: StockMovementFormData) => {
    const { itemId } = movementDialog;
    
    if (!itemId) {
      showNotification('No item selected for stock movement', 'error');
      return;
    }

    await callApi(
      () => apiService.recordStockMovement({
        item_id: itemId, // Now TypeScript knows itemId is definitely a string
        ...data,
      }),
      {
        onSuccess: () => {
          loadItems();
          setMovementDialog({ open: false, itemId: null, itemName: '' });
          showNotification('Stock movement recorded successfully', 'success');
        },
        errorMessage: 'Failed to record stock movement',
      }
    );
  };

  return (
    <Paper sx={{ p: 3 }}>
      {/* ... other JSX ... */}
      <TableContainer>
        <Table>
          <TableHead>
            {/* ... table head ... */}
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                {/* ... other cells ... */}
                <TableCell>
                  <Tooltip title="Stock Movement">
                    <IconButton
                      onClick={() =>
                        setMovementDialog({
                          open: true,
                          itemId: item.id, // This is guaranteed to be a string
                          itemName: item.name,
                        })
                      }
                    >
                      <LocalShipping />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <StockMovement
        open={movementDialog.open}
        onClose={() => setMovementDialog({ open: false, itemId: null, itemName: '' })}
        onSubmit={handleMovement}
        itemName={movementDialog.itemName}
      />
    </Paper>
  );
};

export default ItemList;