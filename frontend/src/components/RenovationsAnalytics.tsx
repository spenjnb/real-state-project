import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { AxiosError } from 'axios';

interface RenovationsAnalytics {
  total_renovations: number;
  total_cost: number;
  avg_cost: number;
  renovation_type_distribution: {
    renovation_type: string;
    count: number;
    avg_cost: number;
  }[];
  status_distribution: {
    status: string;
    count: number;
  }[];
  monthly_renovations: {
    month: string;
    count: number;
    total_cost: number;
  }[];
  property_type_impact: {
    property_type: string;
    renovation_count: number;
    avg_cost: number;
    avg_value_increase: number;
  }[];
  top_contractors: {
    contractor_name: string;
    renovation_count: number;
    total_cost: number;
  }[];
}

const RenovationsAnalytics = () => {
  const [analytics, setAnalytics] = useState<RenovationsAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await client.get<RenovationsAnalytics>('/api/renovations/analytics');
      setAnalytics(response.data);
      setLoading(false);
    } catch (err) {
      const error = err as AxiosError;
      setError('Error fetching renovation analytics');
      console.error('Error details:', error.response?.data);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!analytics) return <div>No analytics data available</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Renovation Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Overview Cards */}
        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Total Renovations</h2>
          <p className="text-3xl font-bold">{analytics.total_renovations}</p>
        </div>
        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Total Cost</h2>
          <p className="text-3xl font-bold">${analytics.total_cost.toLocaleString()}</p>
        </div>
        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Average Cost</h2>
          <p className="text-3xl font-bold">${analytics.avg_cost.toLocaleString()}</p>
        </div>

        {/* Renovation Type Distribution */}
        <div className="border rounded p-4 col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Renovation Types</h2>
          <div className="space-y-2">
            {analytics.renovation_type_distribution.map(item => (
              <div key={item.renovation_type} className="flex justify-between">
                <span>{item.renovation_type}</span>
                <div className="space-x-4">
                  <span>{item.count} renovations</span>
                  <span>${item.avg_cost.toLocaleString()} avg</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Status Distribution</h2>
          <div className="space-y-2">
            {analytics.status_distribution.map(item => (
              <div key={item.status} className="flex justify-between">
                <span>{item.status}</span>
                <span>{item.count} renovations</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Renovations */}
        <div className="border rounded p-4 col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Monthly Renovations</h2>
          <div className="space-y-2">
            {analytics.monthly_renovations.map(item => (
              <div key={item.month} className="flex justify-between">
                <span>{item.month}</span>
                <div className="space-x-4">
                  <span>{item.count} renovations</span>
                  <span>${item.total_cost.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Property Type Impact */}
        <div className="border rounded p-4 col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Property Type Impact</h2>
          <div className="space-y-2">
            {analytics.property_type_impact.map(item => (
              <div key={item.property_type} className="flex justify-between">
                <span>{item.property_type}</span>
                <div className="space-x-4">
                  <span>{item.renovation_count} renovations</span>
                  <span>${item.avg_cost.toLocaleString()} avg cost</span>
                  <span>${item.avg_value_increase.toLocaleString()} avg increase</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Contractors */}
        <div className="border rounded p-4 col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Top Contractors</h2>
          <div className="space-y-2">
            {analytics.top_contractors.map(contractor => (
              <div key={contractor.contractor_name} className="flex justify-between">
                <span>{contractor.contractor_name}</span>
                <div className="space-x-4">
                  <span>{contractor.renovation_count} renovations</span>
                  <span>${contractor.total_cost.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenovationsAnalytics; 