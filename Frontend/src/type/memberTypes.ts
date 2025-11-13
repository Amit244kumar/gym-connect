export interface memberlogin {
    email:string
    password:string
}
export interface memberData{
    name: string
    email: string
    phone: string
    address: string
    dateOfBirth: string
    plan: string
    startDate:string
    profileImage: string
    
}
export interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  membershipType: string;
  membershipStartDate: string;
  membershipEndDate: string;
  membershipStatus: "active" | "expired" | "cancelled";
  membershipExpireInDays: number;
  lastVisit?: string;
  gender?: string;
  address?: string;
  dateOfBirth?: string;
  memberPhoto?: string;
  OwnerMembershipPlan:{
    planName:string
  }
}
export interface memberAuthState {
    memberData:Member[]
    token:string
    isAuthenticated:boolean
    isLoading:boolean
    isAdded:boolean
}
export interface CredentialsPayload{
    token:string
}
export interface ApiResponse {
  success: boolean;
  message: string;
  data?: {
    members: Member[];
    pagination?: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}
export interface MemberQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  membershipType?: string;
  membershipStatus?: string;
  gender?: string;
}
