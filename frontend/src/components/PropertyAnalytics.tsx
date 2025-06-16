import { useState, useEffect } from 'react';
import client from '../api/client';
import { AxiosError } from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface PropertyTypeDistribution {
  property_type: string;
  count: number;
  total_value: number;
  avg_value: number;
}

interface LocationDistribution {
  city: string;
  state: string;
  count: number;
}

interface Analytics {
  property_type_distribution: PropertyTypeDistribution[];
  avg_bedrooms: number;
  avg_bathrooms: number;
  avg_square_feet: number;
  avg_lot_size: number;
  min_square_feet: number;
  max_square_feet: number;
  location_distribution: LocationDistribution[];
}

const PropertyAnalytics = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await client.get<Analytics>('/api/analytics/properties');
      setAnalytics(response.data);
      setLoading(false);
    } catch (err) {
      const error = err as AxiosError;
      setError('Error fetching analytics');
      console.error('Error details:', error.response?.data);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!analytics) return <div>No analytics data available</div>;

  const propertyTypeData = {
    labels: analytics.property_type_distribution.map(item => item.property_type),
    datasets: [
      {
        label: 'Number of Properties',
        data: analytics.property_type_distribution.map(item => item.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const propertyValueData = {
    labels: analytics.property_type_distribution.map(item => item.property_type),
    datasets: [
      {
        label: 'Average Property Value ($)',
        data: analytics.property_type_distribution.map(item => item.avg_value),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Property Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Property Type Distribution Chart */}
        <div className="border rounded p-4 bg-white shadow">
          <h2 className="text-xl font-semibold mb-4">Property Type Distribution</h2>
          <div className="h-80">
            <Pie data={propertyTypeData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                },
              },
            }} />
          </div>
        </div>

        {/* Average Property Values Chart */}
        <div className="border rounded p-4 bg-white shadow">
          <h2 className="text-xl font-semibold mb-4">Average Property Values</h2>
          <div className="h-80">
            <Bar data={propertyValueData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: (value) => `$${value.toLocaleString()}`,
                  },
                },
              },
            }} />
          </div>
        </div>

        {/* Key Metrics */}
        <div className="border rounded p-4 bg-white shadow">
          <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">Average Bedrooms</div>
              <div className="text-2xl font-bold">{analytics.avg_bedrooms.toFixed(1)}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">Average Bathrooms</div>
              <div className="text-2xl font-bold">{analytics.avg_bathrooms.toFixed(1)}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">Average Square Feet</div>
              <div className="text-2xl font-bold">{analytics.avg_square_feet.toFixed(0)}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">Average Lot Size</div>
              <div className="text-2xl font-bold">{analytics.avg_lot_size.toFixed(2)} acres</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyAnalytics; 