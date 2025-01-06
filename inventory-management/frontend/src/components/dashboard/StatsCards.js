// src/components/dashboard/StatsCards.js
import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import {
  Inventory,
  Warning,
  TrendingUp,
  AttachMoney,
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color }) => (
  <Paper
    sx={{
      p: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    <Box>
      <Typography variant="h6" color="textSecondary">
        {title}
      </Typography>
      <Typography variant="h4">{value}</Typography>
    </Box>
    <Box
      sx={{
        backgroundColor: `${color}20`,
        borderRadius: '50%',
        p: 1,
      }}
    >
      {icon}
    </Box>
  </Paper>
);

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Items',
      value: stats.totalItems,
      icon: <Inventory sx={{ fontSize: 40, color: '#1976d2' }} />,
      color: '#1976d2',
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockItems,
      icon: <Warning sx={{ fontSize: 40, color: '#dc004e' }} />,
      color: '#dc004e',
    },
    {
      title: 'Weekly Movements',
      value: stats.weeklyMovements,
      icon: <TrendingUp sx={{ fontSize: 40, color: '#4caf50' }} />,
      color: '#4caf50',
    },
    {
      title: 'Total Value',
      value: `$${stats.totalValue.toLocaleString()}`,
      icon: <AttachMoney sx={{ fontSize: 40, color: '#f9a825' }} />,
      color: '#f9a825',
    },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <StatCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
};

export default StatsCards;