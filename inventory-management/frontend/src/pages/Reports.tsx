// src/pages/Reports.tsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  BarChart,
  AssessmentOutlined,
  TrendingUp,
  Receipt,
} from '@mui/icons-material';

const Reports: React.FC = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(false);
  const currentDate = new Date('2025-01-05T17:05:02Z');

  const generateReport = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>

      <Grid container spacing={3}>
        {/* Report Controls */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Time Range</InputLabel>
                <Select
                  value={timeRange}
                  label="Time Range"
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <MenuItem value="day">Last 24 Hours</MenuItem>
                  <MenuItem value="week">Last Week</MenuItem>
                  <MenuItem value="month">Last Month</MenuItem>
                  <MenuItem value="year">Last Year</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                onClick={generateReport}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <AssessmentOutlined />}
              >
                Generate Report
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Report Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BarChart color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Inventory Summary</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Last updated: {currentDate.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Stock Trends</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Last updated: {currentDate.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Receipt color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">Transaction History</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Last updated: {currentDate.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Report Area */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, minHeight: 400 }}>
            <Typography variant="h6" gutterBottom>
              Report Details
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Typography>Select parameters and generate a report to view details</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;