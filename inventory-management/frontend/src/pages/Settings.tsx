// src/pages/Settings.tsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  TextField,
  Grid,
  Alert,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

interface SettingsState {
  emailNotifications: boolean;
  lowStockAlerts: boolean;
  darkMode: boolean;
  itemsPerPage: number;
  companyName: string;
  emailContact: string;
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>({
    emailNotifications: true,
    lowStockAlerts: true,
    darkMode: false,
    itemsPerPage: 10,
    companyName: 'My Company',
    emailContact: 'contact@example.com',
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = event.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setSaved(false);
  };

  const handleSave = () => {
    // Simulate saving settings
    setTimeout(() => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 500);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      {saved && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Settings saved successfully!
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              General Settings
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Company Name"
                name="companyName"
                value={settings.companyName}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Contact Email"
                name="emailContact"
                value={settings.emailContact}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Items Per Page"
                name="itemsPerPage"
                type="number"
                value={settings.itemsPerPage}
                onChange={handleChange}
                fullWidth
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Notifications
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.emailNotifications}
                    onChange={handleChange}
                    name="emailNotifications"
                  />
                }
                label="Email Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.lowStockAlerts}
                    onChange={handleChange}
                    name="lowStockAlerts"
                  />
                }
                label="Low Stock Alerts"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.darkMode}
                    onChange={handleChange}
                    name="darkMode"
                  />
                }
                label="Dark Mode"
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
            >
              Save Settings
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;