import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { AxiosError } from 'axios';

interface Renovation {
  id: number;
  property_id: number;
  renovation_type: string;
  description: string;
  cost: number;
  start_date: string;
  end_date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
}

interface NewRenovation {
  property_id: string;
  renovation_type: string;
  description: string;
  cost: string;
  start_date: string;
  end_date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
}

const RenovationList = () => {
  const [renovations, setRenovations] = useState<Renovation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newRenovation, setNewRenovation] = useState<NewRenovation>({
    property_id: '',
    renovation_type: '',
    description: '',
    cost: '',
    start_date: '',
    end_date: '',
    status: 'pending'
  });

  useEffect(() => {
    fetchRenovations();
  }, []);

  const fetchRenovations = async () => {
    try {
      const response = await client.get<Renovation[]>('/api/renovations/');
      setRenovations(response.data);
      setLoading(false);
    } catch (err) {
      const error = err as AxiosError;
      setError('Error fetching renovations');
      console.error('Error details:', error.response?.data);
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewRenovation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const renovationData = {
        ...newRenovation,
        property_id: parseInt(newRenovation.property_id),
        cost: parseFloat(newRenovation.cost)
      };
      await client.post<Renovation>('/api/renovations/', renovationData);
      fetchRenovations();
      setNewRenovation({
        property_id: '',
        renovation_type: '',
        description: '',
        cost: '',
        start_date: '',
        end_date: '',
        status: 'pending'
      });
    } catch (err) {
      const error = err as AxiosError;
      setError('Error adding renovation');
      console.error('Error details:', error.response?.data);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4 mb-16">
      <h1 className="text-2xl font-bold mb-4">Renovations</h1>

      {/* Add Renovation Form */}
      <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-4">Add New Renovation</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="property_id"
            placeholder="Property ID"
            value={newRenovation.property_id}
            onChange={handleInputChange}
            className="border p-2 rounded"
            min="1"
            step="1"
            required
          />
          <input
            type="text"
            name="renovation_type"
            placeholder="Renovation Type"
            value={newRenovation.renovation_type}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={newRenovation.description}
            onChange={handleInputChange}
            className="border p-2 rounded col-span-2"
            required
          />
          <input
            type="number"
            name="cost"
            placeholder="Cost"
            value={newRenovation.cost}
            onChange={handleInputChange}
            className="border p-2 rounded"
            min="0"
            step="0.01"
            required
          />
          <input
            type="date"
            name="start_date"
            value={newRenovation.start_date}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="date"
            name="end_date"
            value={newRenovation.end_date}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
          <select
            name="status"
            value={newRenovation.status}
            onChange={handleInputChange}
            className="border p-2 rounded col-span-2"
            required
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Renovation
        </button>
      </form>

      {/* Renovations List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {renovations.map(renovation => (
          <div key={renovation.id} className="border rounded p-4">
            <h3 className="font-semibold">Property ID: {renovation.property_id}</h3>
            <p>Type: {renovation.renovation_type}</p>
            <p>Description: {renovation.description}</p>
            <p>Cost: ${renovation.cost}</p>
            <p>Start Date: {new Date(renovation.start_date).toLocaleDateString()}</p>
            <p>End Date: {new Date(renovation.end_date).toLocaleDateString()}</p>
            <p>Status: {renovation.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RenovationList; 