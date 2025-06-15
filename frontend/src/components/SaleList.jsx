import React, { useState, useEffect } from 'react';
import client from '../api/client';

const SaleList = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSale, setNewSale] = useState({
    property_id: '',
    sale_price: '',
    sale_date: '',
    buyer_name: '',
    buyer_email: '',
    buyer_phone: '',
    agent_name: '',
    agent_email: '',
    agent_phone: ''
  });

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await client.get('/api/sales/');
      setSales(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching sales');
      console.error('Error details:', err.response?.data);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSale(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const saleData = {
        ...newSale,
        property_id: parseInt(newSale.property_id),
        sale_price: parseFloat(newSale.sale_price)
      };
      await client.post('/api/sales/', saleData);
      fetchSales();
      setNewSale({
        property_id: '',
        sale_price: '',
        sale_date: '',
        buyer_name: '',
        buyer_email: '',
        buyer_phone: '',
        agent_name: '',
        agent_email: '',
        agent_phone: ''
      });
    } catch (err) {
      setError('Error adding sale');
      console.error('Error details:', err.response?.data);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sales</h1>
      
      {/* Add Sale Form */}
      <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-4">Add New Sale</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="property_id"
            placeholder="Property ID"
            value={newSale.property_id}
            onChange={handleInputChange}
            className="border p-2 rounded"
            min="1"
            step="1"
            required
          />
          <input
            type="number"
            name="sale_price"
            placeholder="Sale Price"
            value={newSale.sale_price}
            onChange={handleInputChange}
            className="border p-2 rounded"
            min="0"
            step="0.01"
            required
          />
          <input
            type="date"
            name="sale_date"
            value={newSale.sale_date}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="buyer_name"
            placeholder="Buyer Name"
            value={newSale.buyer_name}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="email"
            name="buyer_email"
            placeholder="Buyer Email"
            value={newSale.buyer_email}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="tel"
            name="buyer_phone"
            placeholder="Buyer Phone"
            value={newSale.buyer_phone}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="agent_name"
            placeholder="Agent Name"
            value={newSale.agent_name}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="email"
            name="agent_email"
            placeholder="Agent Email"
            value={newSale.agent_email}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="tel"
            name="agent_phone"
            placeholder="Agent Phone"
            value={newSale.agent_phone}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Sale
        </button>
      </form>

      {/* Sales List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sales.map(sale => (
          <div key={sale.id} className="border rounded p-4">
            <h3 className="font-semibold">Property ID: {sale.property_id}</h3>
            <p>Sale Price: ${sale.sale_price.toLocaleString()}</p>
            <p>Sale Date: {new Date(sale.sale_date).toLocaleDateString()}</p>
            <div className="mt-2">
              <h4 className="font-medium">Buyer Information</h4>
              <p>Name: {sale.buyer_name}</p>
              <p>Email: {sale.buyer_email}</p>
              <p>Phone: {sale.buyer_phone}</p>
            </div>
            <div className="mt-2">
              <h4 className="font-medium">Agent Information</h4>
              <p>Name: {sale.agent_name}</p>
              <p>Email: {sale.agent_email}</p>
              <p>Phone: {sale.agent_phone}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SaleList; 