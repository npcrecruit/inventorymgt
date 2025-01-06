// src/components/alerts/AlertCenter.js
import React, { useState, useEffect } from 'react';
import {
  Paper,
  Box,
  Typography,
  Tabs,
  Tab,
  Badge,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Notifications,
  CheckCircle,
  Error,
  Warning,
} from '@mui/icons-material';
import { fetchAlerts, updateAlert } from '../../services/api';

const AlertCenter = () => {
  const [alerts, setAlerts] = useState([]);
  const [tab, setTab] = useState('active');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, [tab]);

  const loadAlerts = async () => {
    try {
      const data = await fetchAlerts({ status: tab });
      setAlerts(data);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (alertId, newStatus) => {
    try {
      await updateAlert(alertId, { status: newStatus });
      await loadAlerts();
    } catch (error) {
      console.error('Error updating alert:', error);
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'low_stock':
        return <Warning sx={{ color: 'warning.main' }} />;
      case 'expiring':
        return <Error sx={{ color: 'error.main' }} />;
      default:
        return <Notifications sx={{ color: 'info.main' }} />;
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Notifications />
          Alert Center
          <Badge badgeContent={alerts.length} color="error" sx={{ ml: 2 }} />
        </Typography>
        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
          <Tab label="Active" value="active" />
          <Tab label="Resolved" value="resolved" />
        </Tabs>
      </Box>

      {loading ? (
        <Typography>Loading alerts...</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {alerts.map((alert) => (
            <Paper
              key={alert.id}
              elevation={1}
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'background.default',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {getAlertIcon(alert.alert_type)}
                <Box>
                  <Typography variant="subtitle1">{alert.message}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Created at: {new Date(alert.created_at).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={alert.alert_type.replace('_', ' ').toUpperCase()}
                  color={
                    alert.alert_type === 'low_stock'
                      ? 'warning'
                      : alert.alert_type === 'expiring'
                      ? 'error'
                      : 'info'
                  }
                  size="small"
                />
                {tab === 'active' && (
                  <IconButton
                    onClick={() => handleStatusChange(alert.id, 'resolved')}
                    title="Mark as resolved"
                  >
                    <CheckCircle color="success" />
                  </IconButton>
                )}
              </Box>
            </Paper>
          ))}
          {alerts.length === 0 && (
            <Typography color="text.secondary" align="center">
              No {tab} alerts
            </Typography>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default AlertCenter;