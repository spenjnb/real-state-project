import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">About Real Estate Data Analytics</h1>

        {/* Project Overview */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Project Overview</h2>
          <p className="text-gray-600 mb-4">
            This project aims to revolutionize real estate decision-making by leveraging public real estate data
            to provide valuable insights and analytics. By analyzing patterns in property sales, renovations,
            and market trends, we help users make informed decisions about their real estate investments.
          </p>
          <p className="text-gray-600">
            Our platform processes real estate data to identify key factors that contribute to successful
            property sales, including optimal listing prices, effective renovations, and property features
            that drive value.
          </p>
        </div>

        {/* Key Features */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Comprehensive property data analysis</li>
            <li>Sales pattern identification</li>
            <li>Renovation impact assessment</li>
            <li>Market trend visualization</li>
            <li>Data-driven pricing suggestions</li>
            <li>Property feature analysis</li>
          </ul>
        </div>

        {/* About the Creator */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-4">About the Creator</h2>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <h3 className="text-xl font-medium mb-2">Spencer Navas</h3>
              <p className="text-gray-600">
                A passionate developer focused on creating data-driven solutions for the real estate industry.
                This project combines technical expertise with a deep understanding of real estate market dynamics
                to provide valuable insights for property owners, buyers, and investors.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 