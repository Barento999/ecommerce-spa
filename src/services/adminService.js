import { getFunctions, httpsCallable } from 'firebase/functions';
import { auth } from '../firebase';

export const makeAdmin = async (email) => {
  try {
    if (!email) {
      throw new Error('Email is required');
    }
    
    const functions = getFunctions();
    const addAdminRole = httpsCallable(functions, 'addAdminRole');
    
    // Ensure user is logged in
    if (!auth.currentUser) {
      throw new Error('You must be logged in to perform this action');
    }
    
    // Get and refresh the ID token to ensure we have the latest claims
    await auth.currentUser.getIdToken(true);
    
    const result = await addAdminRole({ email });
    return { 
      success: true, 
      message: result.data?.message || 'Admin role added successfully' 
    };
  } catch (error) {
    console.error('Error making user admin:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to add admin role' 
    };
  }
};

export const isAdmin = async (user) => {
  if (!user) return false;
  try {
    // Force token refresh to get the latest claims
    await user.getIdToken(true);
    const idTokenResult = await user.getIdTokenResult();
    return !!idTokenResult.claims.admin;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};
