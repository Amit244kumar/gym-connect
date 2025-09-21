// Gym Owner Types
export interface GymOwner {
  id: string;
  ownerName: string;
  gymName: string;
  phoneNumber: string;
  emailId: string;
  isVerified: boolean;
  phoneVerified: boolean;
  emailVerified: boolean;
  subscriptionStatus: "trial" | "active" | "expired";
  trialEndDate?: Date;
  subscriptionEndDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface GymOwnerRegister {
  ownerName: string;
  gymName: string;
  phoneNumber: string;
  emailId: string;
  password: string;
}

export interface GymOwnerLogin {
  emailOrPhone: string;
  password: string;
}

// Member Types
export interface GymMember {
  id: string;
  gymOwnerId: string;
  name: string;
  phoneNumber: string;
  emailId: string;
  membershipType: "trial" | "monthly" | "quarterly" | "yearly";
  dateOfJoining: Date;
  membershipEndDate: Date;
  isActive: boolean;
  phoneVerified: boolean;
  emailVerified: boolean;
  profilePhoto?: string;
  qrCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemberRegister {
  gymOwnerId: string;
  name: string;
  phoneNumber: string;
  emailId: string;
  membershipType: string;
  password: string;
  profilePhoto?: string;
}

export interface MemberLogin {
  emailOrPhone: string;
  password: string;
}

// Entry Tracking
export interface GymEntry {
  id: string;
  memberId: string;
  gymOwnerId: string;
  entryTime: Date;
  exitTime?: Date;
  date: string; // YYYY-MM-DD format
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface LoginResponse {
  token: string;
  user: GymOwner | GymMember;
  userType: "owner" | "member";
}

export interface DashboardStats {
  totalMembers: number;
  todaysCheckins: number;
  expiringSoon: number;
  monthlyRevenue: number;
  recentEntries: GymEntry[];
}

// Subscription Types
export interface SubscriptionPlan {
  id: string;
  name: string;
  duration: number; // in months
  price: number;
  features: string[];
  maxMembers: number;
}

export interface PaymentRequest {
  planId: string;
  gymOwnerId: string;
  amount: number;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  userType: "owner" | "member";
  type: "membership_expiry" | "subscription_expiry" | "payment_due" | "general";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}
