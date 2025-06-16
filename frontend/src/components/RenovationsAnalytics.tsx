import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import client from '../api/client';
import type { Analytics } from '../types/analytics.d';
import { AxiosError } from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

const RenovationsAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [costByPropertyTypeData, setCostByPropertyTypeData] = useState<ChartData | null>(null);
  const [roiByRenovationTypeData, setRoiByRenovationTypeData] = useState<ChartData | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await client.get<Analytics>('/api/analytics/renovations');
      const data = response.data;
      setAnalytics(data);

      // Check if we have data before setting up charts
      if (data.cost_by_property_type?.length > 0) {
        setCostByPropertyTypeData({
          labels: data.cost_by_property_type.map((item: any) => item.property_type),
          datasets: [{
            label: 'Average Cost by Property Type',
            data: data.cost_by_property_type.map((item: any) => item.avg_cost),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        });
      }

      if (data.roi_by_renovation_type?.length > 0) {
        setRoiByRenovationTypeData({
          labels: data.roi_by_renovation_type.map((item: any) => item.renovation_type),
          datasets: [{
            label: 'Average ROI by Renovation Type',
            data: data.roi_by_renovation_type.map((item: any) => item.avg_roi),
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        });
      }
    } catch (error) {
      console.error('Error fetching renovation analytics:', error);
      setError('Failed to load renovation analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!analytics) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>No data available</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Renovation Analytics
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Average Cost by Property Type
          </Typography>
          {costByPropertyTypeData ? (
            <Bar
              data={costByPropertyTypeData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  title: {
                    display: true,
                    text: 'Average Renovation Cost by Property Type',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function (this: any, value: string | number) {
                        if (typeof value === 'number') {
                          return `$${value.toLocaleString()}`;
                        }
                        const num = Number(value);
                        return isNaN(num) ? value : `$${num.toLocaleString()}`;
                      },
                    },
                  },
                },
              }}
            />
          ) : (
            <Typography>No cost data available</Typography>
          )}
        </Paper>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Average ROI by Renovation Type
          </Typography>
          {roiByRenovationTypeData ? (
            <Bar
              data={roiByRenovationTypeData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  title: {
                    display: true,
                    text: 'Average ROI by Renovation Type',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function (this: any, value: string | number) {
                        if (typeof value === 'number') {
                          return `${value.toFixed(1)}%`;
                        }
                        const num = Number(value);
                        return isNaN(num) ? value : `${num.toFixed(1)}%`;
                      },
                    },
                  },
                },
              }}
            />
          ) : (
            <Typography>No ROI data available</Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default RenovationsAnalytics; 