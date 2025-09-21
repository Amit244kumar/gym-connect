import React, { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  requireAuth?: boolean;
}
import {  useSelector } from "react-redux";
import {  RootState } from '../store/index';

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireAuth = true }) => {
  const { isLoading, isAuthenticated} = useSelector((state: RootState) => state.gymOwnerAuth);
  const slug=localStorage.getItem("gymOwnerSlug")
  const location = useLocation();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If route requires auth but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route does not require auth but user is already logged in
  if (!requireAuth && isAuthenticated) {
  
    return <Navigate to={`/owner/dashboard/${slug}`} replace />;
  }

  return <Outlet />;
};


export default ProtectedRoute;
