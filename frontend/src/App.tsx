import React, { useState } from 'react';
import PropertyList from './components/PropertyList';
import SaleList from './components/SaleList';
import RenovationList from './components/RenovationList';

export default function App() {
  const [activeTab, setActiveTab] = useState('properties');

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Real Estate Analytics</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <button
                  onClick={() => setActiveTab('properties')}
                  className={`${activeTab === 'properties'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Properties
                </button>
                <button
                  onClick={() => setActiveTab('sales')}
                  className={`${activeTab === 'sales'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Sales
                </button>
                <button
                  onClick={() => setActiveTab('renovations')}
                  className={`${activeTab === 'renovations'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Renovations
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'properties' && <PropertyList />}
        {activeTab === 'sales' && <SaleList />}
        {activeTab === 'renovations' && <RenovationList />}
      </main>
    </div>
  );
}