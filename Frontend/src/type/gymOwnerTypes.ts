
// Types
export interface GymOwner {
    id: number;
    ownerName: string;
    email: string;
    phone: string;
    gymName: string;
    slug: string;
    subscriptionPlanType: 'trial' | 'Premium Monthly' | 'Premium Quarterly';
    subscriptionStatus: 'active' | 'expired';
    trialStart: string;
    trialEnd: string;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
}

export interface GymOwnerAuthState {
    token: string | null;
    owner: GymOwner | object;
    isAuthenticated: boolean;
    isLoading: boolean;
    slug: string;
    isGymNameAvailable: boolean;
    isVerifyingToken: boolean;
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
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface ProfileUpdateData {
    ownerName?: string;
    phone?: string;
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