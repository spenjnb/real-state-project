import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { AxiosError } from 'axios';

interface Property {
  id: number;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  lot_size: number;
  year_built: number;
}

interface NewProperty {
  address: string;
  city: string;
  state: string;
  zip_code: string;
  property_type: string;
  bedrooms: string;
  bathrooms: string;
  square_feet: string;
}

const PropertyList = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProperty, setNewProperty] = useState<NewProperty>({
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
    setLoading(true);
    try {
      const response = await client.get<Property[]>('/api/properties/');
      setProperties(response.data);
    } catch (err) {
      const error = err as AxiosError;
      setError('Error fetching properties');
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProperty(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const propertyData = {
        ...newProperty,
        bedrooms: parseInt(newProperty.bedrooms, 10),
        bathrooms: parseFloat(newProperty.bathrooms),
        square_feet: parseInt(newProperty.square_feet, 10),
        current_value: 0,
        purchase_price: 0,
        lot_size: 0,
        year_built: 2024
      };
      await client.post<Property>('/api/properties/', propertyData);
      fetchProperties();
      setIsModalOpen(false);
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
      const error = err as AxiosError;
      setError('Error adding property');
      console.error('Error details:', error.response?.data);
    }
  };

  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto p-4 mb-16">
      <h1 className="text-2xl font-bold mb-4">Properties</h1>

      {/* Add Property Button */}
      <div className="mb-8 p-4 border rounded">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Add New Property
          </button>
        </div>

        {loading ? (
          <div className="text-center">Loading properties...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(property => (
              <div key={property.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg text-gray-800">{property.address}</h3>
                <p className="text-gray-600">{property.city}, {property.state} {property.zip_code}</p>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500"><span className="font-semibold">Type:</span> {property.property_type}</p>
                  <p className="text-sm text-gray-500"><span className="font-semibold">Beds:</span> {property.bedrooms}</p>
                  <p className="text-sm text-gray-500"><span className="font-semibold">Baths:</span> {property.bathrooms}</p>
                  <p className="text-sm text-gray-500"><span className="font-semibold">SqFt:</span> {property.square_feet}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
              <h2 className="text-2xl font-bold mb-6">Add New Property</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  {/* Form inputs */}
                  <input type="text" name="address" placeholder="Address" value={newProperty.address} onChange={handleInputChange} className="border p-2 rounded w-full col-span-2" required />
                  <input type="text" name="city" placeholder="City" value={newProperty.city} onChange={handleInputChange} className="border p-2 rounded w-full" required />
                  <input type="text" name="state" placeholder="State" value={newProperty.state} onChange={handleInputChange} className="border p-2 rounded w-full" required />
                  <input type="text" name="zip_code" placeholder="ZIP Code" value={newProperty.zip_code} onChange={handleInputChange} className="border p-2 rounded w-full" required />
                  <input type="text" name="property_type" placeholder="Property Type" value={newProperty.property_type} onChange={handleInputChange} className="border p-2 rounded w-full" required />
                  <input type="number" name="bedrooms" placeholder="Bedrooms" value={newProperty.bedrooms} onChange={handleInputChange} className="border p-2 rounded w-full" min="0" step="1" required />
                  <input type="number" name="bathrooms" placeholder="Bathrooms" value={newProperty.bathrooms} onChange={handleInputChange} className="border p-2 rounded w-full" min="0" step="0.5" required />
                  <input type="number" name="square_feet" placeholder="Square Feet" value={newProperty.square_feet} onChange={handleInputChange} className="border p-2 rounded w-full col-span-2" min="0" required />
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
                    Cancel
                  </button>
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                    Add Property
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyList; 