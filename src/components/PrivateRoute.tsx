import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'; // Ensure the path is correct

interface PrivateRouteProps {
  children: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const authContext = useContext(AuthContext);

  // Get user ID from local storage
  const storedUser = localStorage.getItem("user");
  const userId = storedUser ? JSON.parse(storedUser).id : null;

  // Get the current URL path and extract the user ID from it
  const currentPath = window.location.pathname.split('/'); // Get the current URL path
  const expectedUserId = currentPath[3]; // This assumes the URL format is /dashboard/profile/:id

  // If not authenticated or user ID does not match, redirect to login
  if (userId !== expectedUserId) {
    if (!authContext?.isAuthenticated) {
      console.log('Redirecting to login...'); // Debugging line
      return <Navigate to="/login" replace />;
    }
  }
  // If authenticated and user ID matches, render the children
  return children;
};

export default PrivateRoute;
