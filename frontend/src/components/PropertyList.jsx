import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newProperty, setNewProperty] = useState({
    address: '',
    city: '',
    state: '',
    zip_code: '',
    property_type: '',
    bedrooms: '',
    bathrooms: '',
    square_feet: '',
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${API_URL}/properties`);
      setProperties(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching properties');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProperty(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/properties`, newProperty);
      fetchProperties();
      setNewProperty({
        address: '',
        city: '',
        state: '',
        zip_code: '',
        property_type: '',
        bedrooms: '',
        bathrooms: '',
        square_feet: '',
      });
    } catch (err) {
      setError('Error adding property');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Properties</h1>
      
      {/* Add Property Form */}
      <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-4">Add New Property</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={newProperty.address}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={newProperty.city}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={newProperty.state}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="zip_code"
            placeholder="ZIP Code"
            value={newProperty.zip_code}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="property_type"
            placeholder="Property Type"
            value={newProperty.property_type}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            name="bedrooms"
            placeholder="Bedrooms"
            value={newProperty.bedrooms}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            name="bathrooms"
            placeholder="Bathrooms"
            value={newProperty.bathrooms}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            name="square_feet"
            placeholder="Square Feet"
            value={newProperty.square_feet}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Property
        </button>
      </form>

      {/* Properties List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map(property => (
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
    </div>
  );
};

export default PropertyList; 