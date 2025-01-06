// src/components/settings/Settings.js
import React, { useState, useEffect } from 'react';
import {
  Paper,
  Box,
  Typography,
  Tab,
  Tabs,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Grid,
  Divider,
} from '@mui/material';
import { useNotification } from '../../context/NotificationContext';
import { getSettings, updateSettings } from '../../services/api';

const Settings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { showNotification } = useNotification();
  const [settings, setSettings] = useState({
    general: {
      companyName: '',
      timezone: '',
      dateFormat: '',
      lowStockThreshold: 10,
    },
    notifications: {
      emailNotifications: true,
      lowStockAlerts: true,
      expiryAlerts: true,
      stockMovementAlerts: false,
    },
    security: {
      requireTwoFactor: false,
      passwordExpiryDays: 90,
      sessionTimeout: 30,
    },
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (error) {
      showNotification('Error loading settings', 'error');
    }
  };

  const handleSave = async (section) => {
    try {
      await updateSettings(section, settings[section]);
      showNotification('Settings saved successfully', 'success');
    } catch (error) {
      showNotification('Error saving settings', 'error');
    }
  };

  const renderGeneralSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Company Name"
          value={settings.general.companyName}
          onChange={(e) =>
            setSettings((prev) => ({
              ...prev,
              general: { ...prev.general, companyName: e.target.value },
            }))
          }
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Timezone"
          value={settings.general.timezone}
          onChange={(e) =>
            setSettings((prev) => ({
              ...prev,
              general: { ...prev.general, timezone: e.target.value },
            }))
          }
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Date Format"
          value={settings.general.dateFormat}
          onChange={(e) =>
            setSettings((prev) => ({
              ...prev,
              general: { ...prev.general, dateFormat: e.target.value },
            }))
          }
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="number"
          label="Low Stock Threshold"
          value={settings.general.lowStockThreshold}
          onChange={(e) =>
            setSettings((prev) => ({
              ...prev,
              general: {
                ...prev.general,
                lowStockThreshold: parseInt(e.target.value),
              },
            }))
          }
        />
      </Grid>
    </Grid>
  );

  const renderNotificationSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.notifications.emailNotifications}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  notifications: {
                    ...prev.notifications,
                    emailNotifications: e.target.checked,
                  },
                }))
              }
            />
          }
          label="Email Notifications"
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.notifications.lowStockAlerts}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  notifications: {
                    ...prev.notifications,
                    lowStockAlerts: e.target.checked,
                  },
                }))
              }
            />
          }
          label="Low Stock Alerts"
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.notifications.expiryAlerts}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  notifications: {
                    ...prev.notifications,
                    expiryAlerts: e.target.checked,
                  },
                }))
              }
            />
          }
          label="Expiry Alerts"
        />
      </Grid>
    </Grid>
  );

  const renderSecuritySettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.security.requireTwoFactor}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  security: {
                    ...prev.security,
                    requireTwoFactor: e.target.checked,
                  },
                }))
              }
            />
          }
          label="Require Two-Factor Authentication"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="number"
          label="Password Expiry (days)"
          value={settings.security.passwordExpiryDays}
          onChange={(e) =>
            setSettings((prev) => ({
              ...prev,
              security: {
                ...prev.security,
                passwordExpiryDays: parseInt(e.target.value),
              },
            }))
          }
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="number"
          label="Session Timeout (minutes)"
          value={settings.security.sessionTimeout}
          onChange={(e) =>
            setSettings((prev) => ({
              ...prev,
              security: {
                ...prev.security,
                sessionTimeout: parseInt(e.target.value),
              },
            }))
          }
        />
      </Grid>
    </Grid>
  );

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Settings
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="General" />
          <Tab label="Notifications" />
          <Tab label="Security" />
        </Tabs>
      </Box>

      <Box sx={{ mb: 3 }}>
        {activeTab === 0 && renderGeneralSettings()}
        {activeTab === 1 && renderNotificationSettings()}
        {activeTab === 2 && renderSecuritySettings()}
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={() => handleSave(Object.keys(settings)[activeTab])}
        >
          Save Changes
        </Button>
      </Box>
    </Paper>
  );
};

export default Settings;