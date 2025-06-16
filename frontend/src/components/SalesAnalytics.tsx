import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { AxiosError } from 'axios';

interface SalesAnalytics {
  total_sales: number;
  total_revenue: number;
  avg_sale_price: number;
  price_distribution: {
    range: string;
    count: number;
  }[];
  monthly_sales: {
    month: string;
    count: number;
    revenue: number;
  }[];
  top_agents: {
    agent_name: string;
    sales_count: number;
    total_revenue: number;
  }[];
  property_type_performance: {
    property_type: string;
    avg_price: number;
    sales_count: number;
  }[];
}

const SalesAnalytics = () => {
  const [analytics, setAnalytics] = useState<SalesAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await client.get<SalesAnalytics>('/api/sales/analytics');
      setAnalytics(response.data);
      setLoading(false);
    } catch (err) {
      const error = err as AxiosError;
      setError('Error fetching sales analytics');
      console.error('Error details:', error.response?.data);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!analytics) return <div>No analytics data available</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sales Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Overview Cards */}
        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Total Sales</h2>
          <p className="text-3xl font-bold">{analytics.total_sales}</p>
        </div>
        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Total Revenue</h2>
          <p className="text-3xl font-bold">${analytics.total_revenue.toLocaleString()}</p>
        </div>
        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Average Sale Price</h2>
          <p className="text-3xl font-bold">${analytics.avg_sale_price.toLocaleString()}</p>
        </div>

        {/* Price Distribution */}
        <div className="border rounded p-4 col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Price Distribution</h2>
          <div className="space-y-2">
            {analytics.price_distribution.map(item => (
              <div key={item.range} className="flex justify-between">
                <span>{item.range}</span>
                <span>{item.count} sales</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Sales */}
        <div className="border rounded p-4 col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Monthly Sales</h2>
          <div className="space-y-2">
            {analytics.monthly_sales.map(item => (
              <div key={item.month} className="flex justify-between">
                <span>{item.month}</span>
                <div className="space-x-4">
                  <span>{item.count} sales</span>
                  <span>${item.revenue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Agents */}
        <div className="border rounded p-4 col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Top Performing Agents</h2>
          <div className="space-y-2">
            {analytics.top_agents.map(agent => (
              <div key={agent.agent_name} className="flex justify-between">
                <span>{agent.agent_name}</span>
                <div className="space-x-4">
                  <span>{agent.sales_count} sales</span>
                  <span>${agent.total_revenue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Property Type Performance */}
        <div className="border rounded p-4 col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Property Type Performance</h2>
          <div className="space-y-2">
            {analytics.property_type_performance.map(item => (
              <div key={item.property_type} className="flex justify-between">
                <span>{item.property_type}</span>
                <div className="space-x-4">
                  <span>${item.avg_price.toLocaleString()}</span>
                  <span>{item.sales_count} sales</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics; 