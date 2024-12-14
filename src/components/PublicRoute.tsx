import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

interface PublicRouteProps {
  children: React.ReactElement;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const authContext = useContext(AuthContext);
  
  // If authenticated, redirect to the home or dashboard
  if (authContext?.isAuthenticated) {
    return <Navigate to="/" replace />; // Change this to the desired route, e.g., "/dashboard"
  }

  return children; // If not authenticated, render the children
};

export default PublicRoute;
