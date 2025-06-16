import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PropertyList from './components/PropertyList';
import SaleList from './components/SaleList';
import RenovationList from './components/RenovationList';
import PropertyAnalytics from './components/PropertyAnalytics';
import SalesAnalytics from './components/SalesAnalytics';
import RenovationsAnalytics from './components/RenovationsAnalytics';
import Home from './pages/Home';
import About from './pages/About';
import Footer from './components/Footer';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Navigation */}
        <nav className="bg-blue-600 text-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-8">
                <Link to="/" className="text-xl font-bold">
                  Real Estate Analytics
                </Link>
                <div className="hidden md:flex space-x-4">
                  <Link to="/properties" className="hover:text-gray-200 transition-colors">
                    Properties
                  </Link>
                  <Link to="/sales" className="hover:text-gray-200 transition-colors">
                    Sales
                  </Link>
                  <Link to="/renovations" className="hover:text-gray-200 transition-colors">
                    Renovations
                  </Link>
                  <div className="relative group">
                    <button className="hover:text-gray-200 transition-colors flex items-center">
                      Analytics
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    <div className="absolute left-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out z-50">
                      <Link
                        to="/analytics"
                        className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                      >
                        Property Analytics
                      </Link>
                      <Link
                        to="/sales/analytics"
                        className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                      >
                        Sales Analytics
                      </Link>
                      <Link
                        to="/renovations/analytics"
                        className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                      >
                        Renovation Analytics
                      </Link>
                    </div>
                  </div>
                  <Link to="/about" className="hover:text-gray-200 transition-colors">
                    About
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<PropertyList />} />
            <Route path="/sales" element={<SaleList />} />
            <Route path="/renovations" element={<RenovationList />} />
            <Route path="/analytics" element={<PropertyAnalytics />} />
            <Route path="/sales/analytics" element={<SalesAnalytics />} />
            <Route path="/renovations/analytics" element={<RenovationsAnalytics />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;