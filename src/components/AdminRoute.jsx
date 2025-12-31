import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "./ui/Spinner";

const AdminRoute = ({ children }) => {
  const { currentUser, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  // Debug: Log the current state
  useEffect(() => {
    console.log('🔒 AdminRoute - Current State:', {
      hasUser: !!currentUser,
      userEmail: currentUser?.email,
      isAdmin: isAdmin,
      userIsAdmin: currentUser?.isAdmin,
      isLoading: isLoading,
      currentPath: location.pathname,
      user: currentUser ? {
        uid: currentUser.uid,
        email: currentUser.email,
        emailVerified: currentUser.emailVerified,
        isAdmin: currentUser.isAdmin,
      } : null
    });
  }, [currentUser, isAdmin, isLoading, location.pathname]);

  // Show loading spinner while checking auth state
  if (isLoading) {
    console.log('🔄 AdminRoute: Loading user data...');
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Spinner size="lg" />
        <p className="text-gray-600">Verifying admin access...</p>
      </div>
    );
  }

  // If not authenticated, redirect to login with return URL
  if (!currentUser) {
    console.log('🔐 AdminRoute: No authenticated user, redirecting to login');
    return (
      <Navigate 
        to="/admin/login" 
        state={{ 
          from: location,
          message: 'Please log in to access the admin panel'
        }} 
        replace 
      />
    );
  }

  // Check both isAdmin from context and currentUser.isAdmin
  const userIsAdmin = isAdmin === true || currentUser?.isAdmin === true;
  
  // Debug log to help diagnose the issue
  console.log('🔍 AdminRoute - Admin Check:', {
    hasUser: !!currentUser,
    userEmail: currentUser?.email,
    contextIsAdmin: isAdmin,
    userIsAdmin: currentUser?.isAdmin,
    finalDecision: userIsAdmin ? 'GRANT ACCESS' : 'DENY ACCESS'
  });
  
  // If not admin, redirect to home or access denied
  if (!userIsAdmin) {
    console.warn(
      '⛔ AdminRoute: Access denied - User is not an admin',
      {
        userEmail: currentUser?.email,
        userId: currentUser?.uid,
        contextIsAdmin: isAdmin,
        userIsAdmin: currentUser?.isAdmin,
        path: location.pathname,
        timestamp: new Date().toISOString()
      }
    );
    
    return (
      <Navigate 
        to="/" 
        state={{ 
          error: 'access_denied',
          message: 'You do not have permission to access this page'
        }} 
        replace 
      />
    );
  }

  console.log('✅ AdminRoute: Granting access to admin route for user:', currentUser.email);
  
  // If authenticated and admin, render the protected content
  return children;
};

export default AdminRoute;
