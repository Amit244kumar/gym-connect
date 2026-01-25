
// Types
interface trialInfo {
    totalTrialDays: number;
    daysLeft: number;
    trialStatus: 'active' | 'expired';
    isTrialActive: boolean;
}
export interface GymOwner {
    id: number;
    ownerName: string;
    email: string;
    phone: string;
    gymName: string;
    slug: string;
    subscriptionPlanType: 'trial' | 'basic' | 'premium';
    subscriptionStatus: 'active' | 'expired';
    trialStart: string;
    trialEnd: string;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    phoneVerificationCode?: string;
    emailVerificationCode?: string;
    ownerPhoto?: string;
    registrationUrl?: string;
    totalMembers: number;
    totalCheckInsToday: number;
    trialInfo:trialInfo; 
    recentMembers?: memeber
}

export interface GymOwnerAuthState<t=any> {
    token: string | null;
    owner: GymOwner;
    isAuthenticated: boolean;
    isLoading: boolean;
    slug: string;
    isGymNameAvailable: boolean;
    isVerifyingToken: boolean;
    checkInStats: t;
    memberDistribution?: { name: string; value: number; color: string }[];
}

export interface CredentialsPayload {
    token: string;
    owner: GymOwner;
}
export interface RegisterUserData {
    ownerName: string;
    gymName: string;
    phone: string;
    email: string;
    password: string;
    profileImage?: File | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface ProfileUpdateData {
    ownerName: string;
    gymName: string;
    profileImage: string;
    // Add other updatable fields
}

export interface PasswordChangeData {
    currentPassword: string;
    newPassword: string;
}

export interface RegisterResponse {
    owner?: GymOwner;
    token: string;
    registrationUrl?: string;
    trialEnd?: string;
}
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

export interface checkInStats {
    totalCheckIns: number;
    successfulCheckIns: number;
    failedCheckIns: number;
    checkIns:[checkIn]
    totalRecords: number;
    totalPages: number;
    currentPage: number;
}
interface checkIn{
    id:number;
    memberId:number;
    ownerId:number;
    checkInStatus:string;
    createdAt:string;
    updatedAt:string;
    member:members
} 
export interface members {
    id: number;
    name: string;
    email: string;
    phone: string;
    memberPhoto?: string;
    checkInDate: string;
}
export interface LoginResponse {
    token: string;
}

export interface ProfileResponse {
    owner: GymOwner;
}

export interface ThunkApiConfig {
    dispatch: any;
    getState: () => any;
    rejectWithValue: (value: any) => any;
}