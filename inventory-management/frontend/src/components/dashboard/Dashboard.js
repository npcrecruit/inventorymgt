// src/components/dashboard/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Grid, Container } from '@mui/material';
import StatsCards from './StatsCards';
import Charts from './Charts';
import { fetchDashboardData } from '../../services/api';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StatsCards stats={dashboardData.stats} />
        </Grid>
        <Grid item xs={12}>
          <Charts data={dashboardData.charts} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;