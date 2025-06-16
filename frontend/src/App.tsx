import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import PropertyList from './components/PropertyList';
import SaleList from './components/SaleList';
import RenovationList from './components/RenovationList';
import Home from './pages/Home';
import About from './pages/About';
import Analytics from './pages/Analytics';
import Footer from './components/Footer';

const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-xl font-bold text-gray-900">Real Estate Analytics</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/properties"
              className={`text-sm font-medium transition-colors ${isActive('/properties')
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              Properties
            </Link>
            <Link
              to="/sales"
              className={`text-sm font-medium transition-colors ${isActive('/sales')
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              Sales
            </Link>
            <Link
              to="/renovations"
              className={`text-sm font-medium transition-colors ${isActive('/renovations')
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              Renovations
            </Link>
            <Link
              to="/analytics"
              className={`text-sm font-medium transition-colors ${isActive('/analytics')
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              Analytics
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium transition-colors ${isActive('/about')
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              About
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link
                to="/properties"
                className={`px-4 py-2 text-sm font-medium ${isActive('/properties')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                Properties
              </Link>
              <Link
                to="/sales"
                className={`px-4 py-2 text-sm font-medium ${isActive('/sales')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                Sales
              </Link>
              <Link
                to="/renovations"
                className={`px-4 py-2 text-sm font-medium ${isActive('/renovations')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                Renovations
              </Link>
              <Link
                to="/analytics"
                className={`px-4 py-2 text-sm font-medium ${isActive('/analytics')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                Analytics
              </Link>
              <Link
                to="/about"
                className={`px-4 py-2 text-sm font-medium ${isActive('/about')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                About
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<PropertyList />} />
            <Route path="/sales" element={<SaleList />} />
            <Route path="/renovations" element={<RenovationList />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;