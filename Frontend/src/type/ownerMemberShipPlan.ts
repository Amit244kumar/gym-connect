interface Feature {
  id?: number,
  featureName: string;
}

export interface Plan {
  planName: string;
  price: number;
  duration: number;
  features: Feature[];
  isPopular: boolean;
  isActive?: boolean; 
  id?: number;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: Plan[]
}

export interface OwnerMembershipPlanState {
  plans: Plan[];
  isLoading: boolean;
  isCreated: boolean;
}