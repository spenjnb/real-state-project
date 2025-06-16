export interface CostByPropertyType {
  property_type: string;
  total_cost: number;
  avg_cost: number;
}

export interface ROIDistribution {
  renovation_type: string;
  avg_roi: number;
}

export interface Analytics {
  avg_cost: number;
  avg_duration: number;
  total_renovations: number;
  cost_by_property_type: CostByPropertyType[];
  roi_by_renovation_type: ROIDistribution[];
}
