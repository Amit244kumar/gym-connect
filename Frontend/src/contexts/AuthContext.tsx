import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../store/index';
import { registerGymOwnerFeth } from '../store/gymOwnerAuth/gymOwnerAuthThunks';
import {
  RegisterUserData,
  LoginCredentials,
  ProfileUpdateData,
  PasswordChangeData,
} from '../type/gymOwnerTypes';

// Types
interface AuthContextType {
  // State
  token: string | null;
  owner: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  register: (userData: RegisterUserData) => Promise<any>;
  login: (credentials: LoginCredentials) => Promise<any>;
  logout: () => void;
  getProfile: () => void;
  updateProfile: (profileData: ProfileUpdateData) => void;
  changePassword: (passwordData: PasswordChangeData) => void;
  refreshToken: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { token, owner, isAuthenticated, isLoading } = useAppSelector(
    (state: RootState) => state.gymOwnerAuth
  );

  // Auto-refresh token when needed
  useEffect(() => {
    if (token && isAuthenticated) {
      // Set up token refresh interval (every 23 hours)
      const interval = setInterval(() => {
        // refreshToken implementation would go here
      }, 23 * 60 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [token, isAuthenticated]);

  // Auto-get profile when authenticated
  useEffect(() => {
    if (isAuthenticated && !owner && token) {
      // getProfile implementation would go here
    }
  }, [isAuthenticated, owner, token]);

  const value: AuthContextType = {
    // State
    token,
    owner,
    isAuthenticated,
    isLoading,
    
    // Actions
    register: (userData: RegisterUserData) => dispatch(registerGymOwnerFeth(userData)),
    login: (credentials: LoginCredentials) => Promise.resolve(), // Placeholder
    logout: () => {}, // Placeholder
    getProfile: () => {}, // Placeholder
    updateProfile: (profileData: ProfileUpdateData) => {}, // Placeholder
    changePassword: (passwordData: PasswordChangeData) => {}, // Placeholder
    refreshToken: () => {}, // Placeholder
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
