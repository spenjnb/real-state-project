import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <p className="text-gray-300">
              Real Estate Data Analytics helps you make informed decisions using data-driven insights
              from the real estate market.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/properties" className="text-gray-300 hover:text-white transition-colors">
                  Properties
                </Link>
              </li>
              <li>
                <Link to="/sales" className="text-gray-300 hover:text-white transition-colors">
                  Sales
                </Link>
              </li>
              <li>
                <Link to="/renovations" className="text-gray-300 hover:text-white transition-colors">
                  Renovations
                </Link>
              </li>
            </ul>
          </div>

          {/* Analytics Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Analytics</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/analytics" className="text-gray-300 hover:text-white transition-colors">
                  Property Analytics
                </Link>
              </li>
              <li>
                <Link to="/sales/analytics" className="text-gray-300 hover:text-white transition-colors">
                  Sales Analytics
                </Link>
              </li>
              <li>
                <Link to="/renovations/analytics" className="text-gray-300 hover:text-white transition-colors">
                  Renovation Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Created by Spencer Navas</li>
              <li>Real Estate Data Analytics</li>
              <li>© {new Date().getFullYear()} All rights reserved</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>
            © {new Date().getFullYear()} Real Estate Data Analytics. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 