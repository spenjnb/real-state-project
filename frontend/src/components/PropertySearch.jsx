import React, { useState } from 'react';
import client from '../api/client';

const PropertySearch = () => {
  const [searchParams, setSearchParams] = useState({
    city: '',
    state: '',
    property_type: '',
    min_bedrooms: '',
    max_bedrooms: '',
    min_bathrooms: '',
    max_bathrooms: '',
    min_square_feet: '',
    max_square_feet: '',
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Remove empty parameters
      const params = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '')
      );

      const response = await client.get('/properties/search', { params });
      setResults(response.data);
    } catch (err) {
      setError('Error searching properties');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Property Search</h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8 p-4 border rounded">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={searchParams.city}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={searchParams.state}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="property_type"
            placeholder="Property Type"
            value={searchParams.property_type}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
          <div className="flex gap-2">
            <input
              type="number"
              name="min_bedrooms"
              placeholder="Min Bedrooms"
              value={searchParams.min_bedrooms}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
            <input
              type="number"
              name="max_bedrooms"
              placeholder="Max Bedrooms"
              value={searchParams.max_bedrooms}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              name="min_bathrooms"
              placeholder="Min Bathrooms"
              value={searchParams.min_bathrooms}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
            <input
              type="number"
              name="max_bathrooms"
              placeholder="Max Bathrooms"
              value={searchParams.max_bathrooms}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              name="min_square_feet"
              placeholder="Min Square Feet"
              value={searchParams.min_square_feet}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
            <input
              type="number"
              name="max_square_feet"
              placeholder="Max Square Feet"
              value={searchParams.max_square_feet}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Search Results */}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map(property => (
          <div key={property.id} className="border rounded p-4">
            <h3 className="font-semibold">{property.address}</h3>
            <p>{property.city}, {property.state} {property.zip_code}</p>
            <p>Type: {property.property_type}</p>
            <p>Bedrooms: {property.bedrooms}</p>
            <p>Bathrooms: {property.bathrooms}</p>
            <p>Square Feet: {property.square_feet}</p>
          </div>
        ))}
      </div>
      {results.length === 0 && !loading && !error && (
        <div className="text-center text-gray-500">No properties found</div>
      )}
    </div>
  );
};

export default PropertySearch;