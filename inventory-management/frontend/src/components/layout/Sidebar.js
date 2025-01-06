// src/components/layout/Sidebar.js
import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import {
  Dashboard,
  Inventory,
  Notifications,
  Assessment,
  People,
  Settings,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
  { title: 'Dashboard', icon: <Dashboard />, path: '/' },
  { title: 'Inventory', icon: <Inventory />, path: '/inventory' },
  { title: 'Alerts', icon: <Notifications />, path: '/alerts' },
  { title: 'Reports', icon: <Assessment />, path: '/reports' },
  { title: 'Users', icon: <People />, path: '/users', adminOnly: true },
  { title: 'Settings', icon: <Settings />, path: '/settings' },
];

const Sidebar = ({ open }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = true; // Replace with actual admin check from auth context

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#1a237e',
          color: 'white',
        },
      }}
      open={open}
    >
      <Box sx={{ p: 2, mt: 1 }}>
        <Typography variant="h6" sx={{ color: 'white' }}>
          Inventory System
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          {new Date('2025-01-05 07:15:33').toLocaleString()}
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
      <List>
        {menuItems.map(
          (item) =>
            (!item.adminOnly || isAdmin) && (
              <ListItem
                button
                key={item.title}
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255,255,255,0.08)',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.12)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItem>
            )
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;