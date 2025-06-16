export interface Property {
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
  current_value: number;
  purchase_price: number;
  purchase_date: string;
  last_sale_price: number;
  last_sale_date: string;
  created_at: string;
  updated_at: string;
}
