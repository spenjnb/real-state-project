import { Property } from "../types/property";

interface PropertyFilters {
  propertyType?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minSqft?: number;
  maxSqft?: number;
}

const API_BASE_URL = "http://localhost:8000/api";

export const fetchProperties = async (
  filters: PropertyFilters = {}
): Promise<Property[]> => {
  const queryParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      queryParams.append(key, value.toString());
    }
  });

  const response = await fetch(
    `${API_BASE_URL}/properties?${queryParams.toString()}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch properties");
  }
  return response.json();
};

export const fetchPropertyTypes = async (): Promise<string[]> => {
  const response = await fetch(`${API_BASE_URL}/properties/types`);
  if (!response.ok) {
    throw new Error("Failed to fetch property types");
  }
  return response.json();
};

export const fetchCities = async (): Promise<string[]> => {
  const response = await fetch(`${API_BASE_URL}/properties/cities`);
  if (!response.ok) {
    throw new Error("Failed to fetch cities");
  }
  return response.json();
};
