import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { AxiosError } from 'axios';

interface PropertyTypeDistribution {
  property_type: string;
  count: number;
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
      const response = await client.get<Analytics>('/properties/analytics');
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Property Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Property Type Distribution */}
        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Property Type Distribution</h2>
          <div className="space-y-2">
            {analytics.property_type_distribution.map(item => (
              <div key={item.property_type} className="flex justify-between">
                <span>{item.property_type}</span>
                <span>{item.count} properties</span>
              </div>
            ))}
          </div>
        </div>

        {/* Average Bedrooms and Bathrooms */}
        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Average Rooms</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Bedrooms</span>
              <span>{analytics.avg_bedrooms.toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span>Bathrooms</span>
              <span>{analytics.avg_bathrooms.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Square Footage Statistics */}
        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Square Footage</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Average</span>
              <span>{analytics.avg_square_feet.toFixed(0)} sq ft</span>
            </div>
            <div className="flex justify-between">
              <span>Min</span>
              <span>{analytics.min_square_feet} sq ft</span>
            </div>
            <div className="flex justify-between">
              <span>Max</span>
              <span>{analytics.max_square_feet} sq ft</span>
            </div>
          </div>
        </div>

        {/* Location Distribution */}
        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Location Distribution</h2>
          <div className="space-y-2">
            {analytics.location_distribution.map(item => (
              <div key={item.city} className="flex justify-between">
                <span>{item.city}, {item.state}</span>
                <span>{item.count} properties</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyAnalytics; 