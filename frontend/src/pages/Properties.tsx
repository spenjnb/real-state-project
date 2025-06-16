import React, { useState, useEffect } from 'react';
import { Property } from '../types/property';
import { fetchProperties, fetchPropertyTypes, fetchCities } from '../api/propertyAPI';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Button,
  Paper,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

const Properties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [newProperty, setNewProperty] = useState({
    address: '',
    city: '',
    state: '',
    zip_code: '',
    property_type: '',
    bedrooms: 0,
    bathrooms: 0,
    square_feet: 0,
    lot_size: 0,
    year_built: new Date().getFullYear(),
    current_value: 0,
    purchase_price: 0,
  });
  const [filters, setFilters] = useState({
    propertyType: '',
    city: '',
    minPrice: 0,
    maxPrice: 5000000,
    minBedrooms: 0,
    maxBedrooms: 10,
    minBathrooms: 0,
    maxBathrooms: 10,
    minSqft: 0,
    maxSqft: 10000,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [types, citiesList] = await Promise.all([
          fetchPropertyTypes(),
          fetchCities(),
        ]);
        setPropertyTypes(types);
        setCities(citiesList);
      } catch (error) {
        console.error('Error loading filter options:', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const data = await fetchProperties(filters);
        setProperties(data);
      } catch (error) {
        console.error('Error loading properties:', error);
      }
    };
    loadProperties();
  }, [filters]);

  const handleFilterChange = (field: string, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      propertyType: '',
      city: '',
      minPrice: 0,
      maxPrice: 5000000,
      minBedrooms: 0,
      maxBedrooms: 10,
      minBathrooms: 0,
      maxBathrooms: 10,
      minSqft: 0,
      maxSqft: 10000,
    });
  };

  const handleNewPropertyChange = (field: string, value: any) => {
    setNewProperty(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors([]);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/properties/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProperty),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        if (errorData.detail) {
          const errors = Array.isArray(errorData.detail)
            ? errorData.detail.map((err: any) => err.msg || JSON.stringify(err))
            : [errorData.detail];
          setFormErrors(errors);
          console.error('Validation errors:', errors);
        }
        return;
      }

      const data = await response.json();
      setProperties(prev => [...prev, data]);
      setOpenDialog(false);
      setNewProperty({
        address: '',
        city: '',
        state: '',
        zip_code: '',
        property_type: '',
        bedrooms: 0,
        bathrooms: 0,
        square_feet: 0,
        lot_size: 0,
        year_built: new Date().getFullYear(),
        current_value: 0,
        purchase_price: 0,
      });
    } catch (error) {
      console.error('Error creating property:', error);
      setFormErrors(['An unexpected error occurred. Please try again.']);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Properties
        </Typography>
        <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
          Add Property
        </Button>
      </Box>

      {/* Add Property Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Property</DialogTitle>
        <DialogContent>
          {formErrors.length > 0 && (
            <Box sx={{ mt: 2, mb: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
              {formErrors.map((error, index) => (
                <Typography key={index} color="error" variant="body2">
                  {error}
                </Typography>
              ))}
            </Box>
          )}
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
              <Box>
                <TextField
                  fullWidth
                  label="Address"
                  value={newProperty.address}
                  onChange={(e) => handleNewPropertyChange('address', e.target.value)}
                  required
                  error={formErrors.some(err => err.toLowerCase().includes('address'))}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  label="City"
                  value={newProperty.city}
                  onChange={(e) => handleNewPropertyChange('city', e.target.value)}
                  required
                  error={formErrors.some(err => err.toLowerCase().includes('city'))}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  label="State"
                  value={newProperty.state}
                  onChange={(e) => handleNewPropertyChange('state', e.target.value)}
                  required
                  error={formErrors.some(err => err.toLowerCase().includes('state'))}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  label="ZIP Code"
                  value={newProperty.zip_code}
                  onChange={(e) => handleNewPropertyChange('zip_code', e.target.value)}
                  required
                  error={formErrors.some(err => err.toLowerCase().includes('zip'))}
                />
              </Box>
              <Box>
                <FormControl fullWidth required error={formErrors.some(err => err.toLowerCase().includes('property type'))}>
                  <InputLabel>Property Type</InputLabel>
                  <Select
                    value={newProperty.property_type}
                    onChange={(e) => handleNewPropertyChange('property_type', e.target.value)}
                    label="Property Type"
                  >
                    {propertyTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <TextField
                  fullWidth
                  type="number"
                  label="Bedrooms"
                  value={newProperty.bedrooms}
                  onChange={(e) => handleNewPropertyChange('bedrooms', parseFloat(e.target.value))}
                  required
                  error={formErrors.some(err => err.toLowerCase().includes('bedrooms'))}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  type="number"
                  label="Bathrooms"
                  value={newProperty.bathrooms}
                  onChange={(e) => handleNewPropertyChange('bathrooms', parseFloat(e.target.value))}
                  required
                  error={formErrors.some(err => err.toLowerCase().includes('bathrooms'))}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  type="number"
                  label="Square Feet"
                  value={newProperty.square_feet}
                  onChange={(e) => handleNewPropertyChange('square_feet', parseInt(e.target.value))}
                  required
                  error={formErrors.some(err => err.toLowerCase().includes('square feet'))}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  type="number"
                  label="Lot Size (acres)"
                  value={newProperty.lot_size}
                  onChange={(e) => handleNewPropertyChange('lot_size', parseFloat(e.target.value))}
                  error={formErrors.some(err => err.toLowerCase().includes('lot size'))}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  type="number"
                  label="Year Built"
                  value={newProperty.year_built}
                  onChange={(e) => handleNewPropertyChange('year_built', parseInt(e.target.value))}
                  error={formErrors.some(err => err.toLowerCase().includes('year built'))}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  type="number"
                  label="Current Value"
                  value={newProperty.current_value}
                  onChange={(e) => handleNewPropertyChange('current_value', parseFloat(e.target.value))}
                  required
                  error={formErrors.some(err => err.toLowerCase().includes('current value'))}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  type="number"
                  label="Purchase Price"
                  value={newProperty.purchase_price}
                  onChange={(e) => handleNewPropertyChange('purchase_price', parseFloat(e.target.value))}
                  required
                  error={formErrors.some(err => err.toLowerCase().includes('purchase price'))}
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenDialog(false);
            setFormErrors([]);
          }}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Add Property
          </Button>
        </DialogActions>
      </Dialog>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3 }}>
          <Box>
            <FormControl fullWidth>
              <InputLabel>Property Type</InputLabel>
              <Select
                value={filters.propertyType}
                onChange={(e: SelectChangeEvent) => handleFilterChange('propertyType', e.target.value)}
                label="Property Type"
              >
                <MenuItem value="">All</MenuItem>
                {propertyTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box>
            <FormControl fullWidth>
              <InputLabel>City</InputLabel>
              <Select
                value={filters.city}
                onChange={(e: SelectChangeEvent) => handleFilterChange('city', e.target.value)}
                label="City"
              >
                <MenuItem value="">All</MenuItem>
                {cities.map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box>
            <Typography gutterBottom>Price Range</Typography>
            <Slider
              value={[filters.minPrice, filters.maxPrice]}
              onChange={(_: Event, value: number | number[]) => {
                const [min, max] = value as number[];
                handleFilterChange('minPrice', min);
                handleFilterChange('maxPrice', max);
              }}
              valueLabelDisplay="auto"
              min={0}
              max={5000000}
              step={100000}
              valueLabelFormat={(value: number) => `$${value.toLocaleString()}`}
            />
          </Box>

          <Box>
            <Typography gutterBottom>Bedrooms</Typography>
            <Slider
              value={[filters.minBedrooms, filters.maxBedrooms]}
              onChange={(_: Event, value: number | number[]) => {
                const [min, max] = value as number[];
                handleFilterChange('minBedrooms', min);
                handleFilterChange('maxBedrooms', max);
              }}
              valueLabelDisplay="auto"
              min={0}
              max={10}
              step={0.5}
            />
          </Box>

          <Box>
            <Typography gutterBottom>Bathrooms</Typography>
            <Slider
              value={[filters.minBathrooms, filters.maxBathrooms]}
              onChange={(_: Event, value: number | number[]) => {
                const [min, max] = value as number[];
                handleFilterChange('minBathrooms', min);
                handleFilterChange('maxBathrooms', max);
              }}
              valueLabelDisplay="auto"
              min={0}
              max={10}
              step={0.5}
            />
          </Box>

          <Box>
            <Typography gutterBottom>Square Footage</Typography>
            <Slider
              value={[filters.minSqft, filters.maxSqft]}
              onChange={(_: Event, value: number | number[]) => {
                const [min, max] = value as number[];
                handleFilterChange('minSqft', min);
                handleFilterChange('maxSqft', max);
              }}
              valueLabelDisplay="auto"
              min={0}
              max={10000}
              step={100}
              valueLabelFormat={(value: number) => `${value} sqft`}
            />
          </Box>

          <Box>
            <Button
              variant="outlined"
              onClick={handleResetFilters}
              sx={{ mt: 2 }}
            >
              Reset Filters
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Property Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
        {properties.map((property) => (
          <Card key={property.id}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {property.address}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                {property.city}, {property.state}
              </Typography>
              <Typography variant="h5" color="primary" gutterBottom>
                ${property.current_value.toLocaleString()}
              </Typography>
              <Typography variant="body2">
                {property.property_type} • {property.bedrooms} beds • {property.bathrooms} baths
              </Typography>
              <Typography variant="body2">
                {property.square_feet.toLocaleString()} sqft
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default Properties; 