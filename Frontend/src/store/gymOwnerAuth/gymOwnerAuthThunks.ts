import { createAsyncThunk } from '@reduxjs/toolkit';
import api from "../../axios/index"
import {
  RegisterUserData,
  LoginCredentials,
  ProfileUpdateData,
  PasswordChangeData,
  ApiResponse,
  LoginResponse,
  ProfileResponse,
  ThunkApiConfig,
  RegisterResponse,
  GymOwner,
  checkInStats,
} from '../../type/gymOwnerTypes'
import { toast } from 'sonner';

// Register Gym Owner
export const registerGymOwnerFeth = createAsyncThunk<any,RegisterUserData,ThunkApiConfig>(
  'registerGymOwnerFeth',
  async (userData:RegisterUserData, { rejectWithValue }) => {
    try {
      const response = await api.gymOnwerAuth.registerGymOwner(userData);
      if (response.success) {
        toast.success(response.message)
        return response.data;
      } else {
        toast.error(response.response?.data?.message)
        return rejectWithValue(response.message || 'Registration failed');
      }
    } catch (error: any) {
      toast.error(error.message || error.response?.data?.message || 'Registration failed');
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      return rejectWithValue(errorMessage);
    } 
  }
);
export const isGymNameAvailableFeth = createAsyncThunk<any,string,ThunkApiConfig>(
  'isGymNameAvailableFeth',
  async (gymName:string, { rejectWithValue }) => {
    try {
      const response = await api.gymOnwerAuth.isGymNameAvailable(gymName);
      if (response.success) {
        return response.data;
      } else {
        toast.error(response.response?.data?.message)
        return rejectWithValue(response.message || 'Gym name check failed');
      }
    }
    catch (error: any) {
      toast.error(error.message || error.response?.data?.message || 'Gym name check failed');
      const errorMessage = error.response?.data?.message || error.message || 'Gym name check failed';
      return rejectWithValue(errorMessage);
    }
  }
)

// Login Gym Owner
export const loginGymOwnerFeth = createAsyncThunk<any,LoginCredentials,ThunkApiConfig>(
  'loginGymOwnerFeth/login',
  async (LoginCredentials:LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await api.gymOnwerAuth.loginGymOwner(LoginCredentials);
      if (response.success) {
        toast.success(response.message)
        return response;
      } else {
        toast.error(response.response?.data?.message)
        return rejectWithValue(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      return rejectWithValue(errorMessage);
    }
  }
);

// // Get Profile
export const getProfilefeth = createAsyncThunk<any,void,ThunkApiConfig>(
  'getProfilefeth/getProfile',
  async (_:void,{ rejectWithValue}) => {
    try {
      const response = await api.gymOnwerAuth.getProfile();
      if (response.success) {
        return response.data;
      } else {
        console.log("Failed to get profile:",response)
        return rejectWithValue(response.data.message || 'Failed to get profile');
      }
    } catch (error: any) {
      console.log("Error in getProfilefeth:", error);
      toast.error(error.response?.data?.message)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to get profile';
      return rejectWithValue(errorMessage);
    } 
  }
);

// // Logout
export const logoutGymOwnerFeth = createAsyncThunk<{ success: boolean; message: string },void,ThunkApiConfig>(
  'logoutGymOwnerfeth/logout',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.gymOnwerAuth.logout();
      if (response.success) {
         toast.success(response.message)
         return response;
      } else {
        toast.error(response.response?.data?.message)
        return rejectWithValue(response.data.message || 'Failed to get profile');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to get profile';
      return rejectWithValue(errorMessage);
    } 
  }
);

export const forgetPasswordFeth = createAsyncThunk<{ success: boolean; message: string },any,ThunkApiConfig>(
  'forgetPasswordFeth/forgetPassword',
  async (payload, {  rejectWithValue }) => {
    try {
      const response = await api.gymOnwerAuth.forgetPassword(payload);
      console.log("Forget password response:",response)
      if (response.success) {
         toast.success(response.message)
         return response?.data;
      } else {
        console.log("Forget password failed:",response)
        toast.error(response.response?.data?.message)
        return rejectWithValue(response.data.message || 'fail to send email');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send email';
      return rejectWithValue(errorMessage);
    } 
  }
);
export const verifyResetPasswordTokenFeth = createAsyncThunk<{ success: boolean; message: string,isVerifyingToken:boolean },any,ThunkApiConfig>(
  'verifyResetPasswordTokenFeth/verifyResetPasswordToken',
  async (payload, {  rejectWithValue }) => {
    try { 
      const response = await api.gymOnwerAuth.verifyResetPasswordToken(payload);
      console.log("Verify reset token response:",response)  
      if (response.success) {
          toast.success(response.message)
          return response?.data;
      } else {
        toast.error(response.response?.data?.message)
        return rejectWithValue(response.data.message || 'Invalid or expired token');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Invalid or expired token';
      return rejectWithValue(errorMessage);
    }
});
export const resetPasswordFeth = createAsyncThunk<{ success: boolean; message: string },any,ThunkApiConfig>(
  'resetPasswordFeth/resetPassword',
  async (payload, {  rejectWithValue }) => {
    try {
      const response = await api.gymOnwerAuth.resetPassword(payload);
      if (response.success) {
         toast.success(response.message)
         return response;
      } else {
        toast.error(response.response?.data?.message)
        return rejectWithValue(response.data.message || 'fail to send email');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send email';
      return rejectWithValue(errorMessage);
    } 
  }
);

export const resendEmailVerificationFeth = createAsyncThunk<{ success: boolean; message: string },void,ThunkApiConfig>(
  'resendEmailVerificationFeth/resendEmailVerification',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.gymOnwerAuth.resendEmailVerification();
      console.log("Resend email verification response:",response)
      if (response.success) {
         toast.success(response.message)
         return response;
      } else {
        toast.error(response.response?.data?.message)
        return rejectWithValue(response.data.message || 'fail to resend email');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to resend email';
      return rejectWithValue(errorMessage);
    }
  }
);

export const verifyEmailFeth = createAsyncThunk<{ success: boolean; message: string },any,ThunkApiConfig>(
  'verifyEmailFeth/verifyEmail',
  async (payload, {  rejectWithValue }) => {
    try {
      const response = await api.gymOnwerAuth.verifyEmail(payload);
      console.log("Verify email response:",response)
      if (response.success) {
         toast.success(response.message)
         return response;
      } else {
        toast.error(response.response?.data?.message)
        return rejectWithValue(response.data.message || 'fail to verify email');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to verify email';
      return rejectWithValue(errorMessage);
    }
  }
);

export const getCheckInStatsFeth = createAsyncThunk<ApiResponse<checkInStats>,void,ThunkApiConfig>(
  'getCheckInStatsFeth/getCheckInStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.gymOnwerAuth.getCheckInStats();
      if (response.success) {
        return response;
      } else {
        toast.error(response.response?.data?.message)
        return rejectWithValue(response?.data?.message || 'Failed to fetch check-in stats');
      }
    } catch (error: any) {
      return rejectWithValue(error .response?.data?.message || error.message || 'Failed to fetch check-in stats');
    }
  }
);
// Update Profile
export const updateGymOwnerProfileFeth = createAsyncThunk<
{ success: boolean; message: string; data: GymOwner },
  ProfileUpdateData,
  ThunkApiConfig
>(
  'updateGymOwnerProfileFeth/updateGymOwnerProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.gymOnwerAuth.updateGymOwnerProfile(profileData);
      console.log("Update profile response:",response)
      if (response.success) {
        toast.success(response.message)
        return response
      } else {
        toast.error(response.response?.data?.message)
        return rejectWithValue(response?.data?.message || 'Failed to update profile');
      }
    } catch (error: any) {
      return rejectWithValue(error .response?.data?.message || error.message || 'Failed to update profile');
    }
  }
);



// // Refresh Token
// export const refreshToken = createAsyncThunk<
//   { success: boolean; token: string },
//   void,
//   ThunkApiConfig
// >(
//   'gymOwnerAuth/refreshToken',
//   async (_, { dispatch, rejectWithValue, getState }) => {
//     try {
//       dispatch(setLoading(true));
//       dispatch(clearError());
      
//       const response = await api.post<ApiResponse<{ token: string }>>('/gym-owner/refresh-token');
      
//       if (response.data.success) {
//         const { token } = response.data.data;
        
//         // Update token in store
//         const state = getState();
//         dispatch(setCredentials({ token, owner: state.gymOwnerAuth.owner }));
        
//         return { success: true, token };
//       } else {
//         return rejectWithValue(response.data.message || 'Failed to refresh token');
//       }
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || error.message || 'Failed to refresh token';
//       dispatch(setError(errorMessage));
//       return rejectWithValue(errorMessage);
//     } finally {
//       dispatch(setLoading(false));
//     }
//   }
// );

