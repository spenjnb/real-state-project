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
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Chart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

interface MarketTrend {
  month: string;
  avg_price: number;
}

interface SalesVolume {
  month: string;
  sales_count: number;
}

interface ROIDistribution {
  property_type: string;
  avg_roi: number;
}

interface Analytics {
  avg_sale_price: number;
  avg_days_on_market: number;
  total_sales: number;
  roi_by_property_type: ROIDistribution[];
  market_trends: {
    monthly_avg_prices: MarketTrend[];
    monthly_sales_volume: SalesVolume[];
  };
}

const SalesAnalytics = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await client.get<Analytics>('/api/analytics/sales');
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

  const roiData = {
    labels: analytics.roi_by_property_type.map(item => item.property_type),
    datasets: [
      {
        label: 'Average ROI (%)',
        data: analytics.roi_by_property_type.map(item => item.avg_roi),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const marketTrendsData = {
    labels: analytics.market_trends.monthly_avg_prices.map(item => item.month),
    datasets: [
      {
        label: 'Average Price',
        data: analytics.market_trends.monthly_avg_prices.map(item => item.avg_price),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        yAxisID: 'y',
        type: 'line' as const,
      },
      {
        label: 'Sales Volume',
        data: analytics.market_trends.monthly_sales_volume.map(item => item.sales_count),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        yAxisID: 'y1',
        type: 'bar' as const,
      },
    ],
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sales Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Metrics */}
        <div className="border rounded p-4 bg-white shadow">
          <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">Average Sale Price</div>
              <div className="text-2xl font-bold">${analytics.avg_sale_price.toLocaleString()}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">Average Days on Market</div>
              <div className="text-2xl font-bold">{analytics.avg_days_on_market.toFixed(1)}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">Total Sales</div>
              <div className="text-2xl font-bold">{analytics.total_sales}</div>
            </div>
          </div>
        </div>

        {/* ROI by Property Type */}
        <div className="border rounded p-4 bg-white shadow">
          <h2 className="text-xl font-semibold mb-4">ROI by Property Type</h2>
          <div className="h-80">
            <Bar data={roiData} options={{
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
            }} />
          </div>
        </div>

        {/* Market Trends */}
        <div className="border rounded p-4 bg-white shadow col-span-2">
          <h2 className="text-xl font-semibold mb-4">Market Trends</h2>
          <div className="h-80">
            <Chart type="line" data={marketTrendsData} options={{
              responsive: true,
              maintainAspectRatio: false,
              interaction: {
                mode: 'index' as const,
                intersect: false,
              },
              scales: {
                y: {
                  type: 'linear' as const,
                  display: true,
                  position: 'left' as const,
                  title: {
                    display: true,
                    text: 'Average Price ($)',
                  },
                  ticks: {
                    callback(this, value: string | number) {
                      if (typeof value === 'number') {
                        return `$${value.toLocaleString()}`;
                      }
                      const num = Number(value);
                      return isNaN(num) ? value : `$${num.toLocaleString()}`;
                    }
                  },
                },
                y1: {
                  type: 'linear' as const,
                  display: true,
                  position: 'right' as const,
                  title: {
                    display: true,
                    text: 'Sales Volume',
                  },
                  grid: {
                    drawOnChartArea: false,
                  },
                },
              },
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics; 