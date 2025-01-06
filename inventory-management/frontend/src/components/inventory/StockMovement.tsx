// /components/inventory/StockMovement.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
} from '@mui/material';

interface StockMovementProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: StockMovementData) => void;
  itemName: string;
}

interface StockMovementData {
  quantity_changed: number;
  movement_type: 'in' | 'out';
  reason: string;
}

const INITIAL_MOVEMENT_DATA: StockMovementData = {
  quantity_changed: 0,
  movement_type: 'in',
  reason: '',
};

const StockMovement: React.FC<StockMovementProps> = ({
  open,
  onClose,
  onSubmit,
  itemName,
}) => {
  const [movement, setMovement] = useState<StockMovementData>(INITIAL_MOVEMENT_DATA);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMovement((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(movement);
    setMovement(INITIAL_MOVEMENT_DATA);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Record Stock Movement - {itemName}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              name="movement_type"
              label="Movement Type"
              value={movement.movement_type}
              onChange={handleChange}
            >
              <MenuItem value="in">Stock In</MenuItem>
              <MenuItem value="out">Stock Out</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              name="quantity_changed"
              label="Quantity"
              value={movement.quantity_changed}
              onChange={handleChange}
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="reason"
              label="Reason"
              value={movement.reason}
              onChange={handleChange}
              multiline
              rows={2}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!movement.quantity_changed}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StockMovement;