import React, { useState, useEffect } from 'react';
import type { ComponentType } from 'react';
import PropertyList from './components/PropertyList';
import SaleList from './components/SaleList';
import RenovationList from './components/RenovationList';

// Test component with obvious Tailwind styles
const TestComponent = () => {
  useEffect(() => {
    console.log('TestComponent mounted');
    // Log all applied styles
    const element = document.querySelector('.test-component');
    if (element) {
      const styles = window.getComputedStyle(element);
      console.log('Applied styles:', {
        backgroundColor: styles.backgroundColor,
        padding: styles.padding,
        margin: styles.margin,
        color: styles.color,
      });
    }
  }, []);

  return (
    <div className="test-component bg-red-500 p-8 m-4 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Test Component</h2>
      <p className="text-lg">If you can see this with red background and white text, Tailwind is working!</p>
    </div>
  );
};

type Tab = 'Properties' | 'Sales' | 'Renovations' | 'Test';

const tabComponents: Record<Tab, ComponentType> = {
  Properties: PropertyList,
  Sales: SaleList,
  Renovations: RenovationList,
  Test: TestComponent,
};

const App = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Test');

  useEffect(() => {
    console.log('App component mounted');
    // Check if Tailwind is loaded
    const styleSheets = Array.from(document.styleSheets);
    const hasTailwind = styleSheets.some(sheet => {
      try {
        return sheet.href?.includes('tailwind') ||
          Array.from(sheet.cssRules).some(rule =>
            rule.cssText.includes('tailwind'));
      } catch (e) {
        return false;
      }
    });
    console.log('Tailwind stylesheet detected:', hasTailwind);
  }, []);

  const ActiveComponent = tabComponents[activeTab];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Real Estate Analytics</h1>
            <nav className="hidden sm:flex sm:space-x-8">
              {(Object.keys(tabComponents) as Tab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ease-in-out ${activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <ActiveComponent />
      </main>
    </div>
  );
};

export default App;