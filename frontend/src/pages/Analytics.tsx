import React from 'react';
import PropertyAnalytics from '../components/PropertyAnalytics';
import SalesAnalytics from '../components/SalesAnalytics';
import RenovationsAnalytics from '../components/RenovationsAnalytics';

const Analytics = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Real Estate Analytics Dashboard</h1>

        <div className="space-y-8">
          <section>
            <PropertyAnalytics />
          </section>

          <section>
            <SalesAnalytics />
          </section>

          <section>
            <RenovationsAnalytics />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 