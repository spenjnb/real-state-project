import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PropertyList from '../PropertyList';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock axios.create to return an object with the expected shape
const mockClient = {
  get: jest.fn(),
  post: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() }
  }
};
(axios.create as jest.Mock).mockReturnValue(mockClient);

describe.skip('PropertyList', () => {
  const mockProperties = [
    {
      id: 1,
      address: '123 Main St',
      price: 500000,
      bedrooms: 3,
      bathrooms: 2,
      square_feet: 2000,
      property_type: 'Residential',
      status: 'Available',
      year_built: 2000,
      location: 'Suburban',
      features: ['Garage', 'Pool'],
      last_updated: '2024-01-01T00:00:00Z'
    }
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockProperties });
    render(<PropertyList />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders properties after loading', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockProperties });
    render(<PropertyList />);

    await waitFor(() => {
      expect(screen.getByText('123 Main St')).toBeInTheDocument();
    });
  });

  it('renders error state when API call fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Failed to fetch'));
    render(<PropertyList />);

    await waitFor(() => {
      expect(screen.getByText('Error loading properties')).toBeInTheDocument();
    });
  });

  it('opens add property modal when clicking add button', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockProperties });
    render(<PropertyList />);

    const addButton = screen.getByText('Add Property');
    fireEvent.click(addButton);

    expect(screen.getByText('Add New Property')).toBeInTheDocument();
  });

  it('submits new property form successfully', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockProperties });
    mockedAxios.post.mockResolvedValueOnce({ data: { id: 2, address: '456 Oak St', price: 600000, bedrooms: 4, bathrooms: 3, square_feet: 2500, property_type: 'Residential', status: 'Available', year_built: 2010, location: 'Urban', features: ['Garage', 'Pool'], last_updated: '2024-01-01T00:00:00Z' } });

    render(<PropertyList />);

    // Open modal
    const addButton = screen.getByText('Add Property');
    fireEvent.click(addButton);

    // Fill form
    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '456 Oak St' } });
    fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '600000' } });
    fireEvent.change(screen.getByLabelText(/bedrooms/i), { target: { value: '4' } });
    fireEvent.change(screen.getByLabelText(/bathrooms/i), { target: { value: '3' } });
    fireEvent.change(screen.getByLabelText(/square feet/i), { target: { value: '2500' } });
    fireEvent.change(screen.getByLabelText(/property type/i), { target: { value: 'Residential' } });
    fireEvent.change(screen.getByLabelText(/status/i), { target: { value: 'Available' } });
    fireEvent.change(screen.getByLabelText(/year built/i), { target: { value: '2010' } });
    fireEvent.change(screen.getByLabelText(/location/i), { target: { value: 'Urban' } });

    // Submit form
    const submitButton = screen.getByText('Add Property');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/properties', expect.any(Object));
    });
  });
}); 