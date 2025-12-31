import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
} from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
} from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const auth = getAuth();

  // Function to check if user is admin
  const checkAdminStatus = async (user) => {
    if (!user) return false;
    try {
      await user.getIdToken(true);
      const idTokenResult = await user.getIdTokenResult();
      console.log("User claims:", idTokenResult.claims);
      return !!idTokenResult.claims.admin;
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  };

  // Auth state change handler
  useEffect(() => {
    console.log("AuthContext: Setting up auth state listener");

    const handleAuthStateChanged = async (user) => {
      console.log("Auth state changed, user:", user ? user.email : "No user");

      if (user) {
        try {
          // Force token refresh to get the latest claims
          await user.getIdToken(true);
          const idTokenResult = await user.getIdTokenResult();

          // Check for admin claim
          const adminStatus = !!idTokenResult.claims.admin;
          console.log(
            "Admin status for",
            user.email,
            ":",
            adminStatus,
            "Claims:",
            idTokenResult.claims
          );

          // Fetch user profile from Firestore to get additional data like name
          let userName = user.displayName || "";
          let userPhone = user.phoneNumber || "";
          try {
            const { getDoc, doc } = await import("firebase/firestore");
            const { getFirestoreDb } = await import("../firebase");
            const db = getFirestoreDb();
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              userName =
                userData.name || userData.displayName || user.displayName || "";
              userPhone =
                userData.phoneNumber ||
                userData.phone ||
                user.phoneNumber ||
                "";
            }
          } catch (err) {
            console.error("Error fetching user profile from Firestore:", err);
          }

          // Create a minimal user object with only the properties we need
          const userData = {
            uid: user.uid,
            email: user.email,
            emailVerified: user.emailVerified,
            displayName: user.displayName,
            name: userName,
            photoURL: user.photoURL,
            phoneNumber: userPhone,
            phone: userPhone,
            isAnonymous: user.isAnonymous,
            metadata: user.metadata,
            providerData: user.providerData,
            refreshToken: user.refreshToken,
            // Add our custom isAdmin flag
            isAdmin: adminStatus,
          };

          console.log("Setting current user with data:", userData);

          // Update both the currentUser and isAdmin state
          setCurrentUser(userData);
          setIsAdmin(adminStatus);
        } catch (error) {
          console.error("Error processing user:", error);
          setCurrentUser(null);
          setIsAdmin(false);
        }
      } else {
        console.log("No user, resetting auth state");
        setCurrentUser(null);
        setIsAdmin(false);
      }
      setIsLoading(false);
    };

    const unsubscribe = onAuthStateChanged(
      auth,
      handleAuthStateChanged,
      (error) => {
        console.error("Auth state change error:", error);
        setCurrentUser(null);
        setIsAdmin(false);
        setIsLoading(false);
      }
    );

    return () => {
      console.log("Cleaning up auth state listener");
      unsubscribe();
    };
  }, []);

  // Auth functions
  const login = async (email, password) => {
    try {
      console.log("Attempting login for:", email);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Login successful, user:", userCredential.user);
      const idTokenResult = await userCredential.user.getIdTokenResult();
      const adminStatus = !!idTokenResult.claims.admin;

      // Update last login time
      try {
        const { updateLastLogin } = await import("../services/customerService");
        await updateLastLogin(userCredential.user.uid);
      } catch (err) {
        console.error("Error updating last login:", err);
      }

      // Return both user and admin status
      return {
        user: userCredential.user,
        isAdmin: adminStatus,
      };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const signup = async (email, password, name = "") => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update profile with display name if provided
      if (name) {
        await updateProfile(userCredential.user, { displayName: name });
      }

      // Create customer profile in Firestore
      try {
        const { createCustomerProfile } = await import(
          "../services/customerService"
        );
        await createCustomerProfile(userCredential.user.uid, {
          name: name || "",
          displayName: name || "",
          email: email,
          emailVerified: false,
          phoneNumber: "",
          photoURL: null,
        });
      } catch (err) {
        console.error("Error creating customer profile:", err);
      }

      return userCredential;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const logout = () => {
    console.log("Logging out user");
    return signOut(auth);
  };

  const updateUserProfile = (profile) => {
    if (!auth.currentUser) {
      return Promise.reject(new Error("No user is currently signed in"));
    }
    return updateProfile(auth.currentUser, profile);
  };

  const sendVerificationEmail = () => {
    if (!auth.currentUser) {
      return Promise.reject(new Error("No user is currently signed in"));
    }
    return sendEmailVerification(auth.currentUser);
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const updateUserEmail = (email) => {
    if (!auth.currentUser) {
      return Promise.reject(new Error("No user is currently signed in"));
    }
    return updateEmail(auth.currentUser, email);
  };

  const updateUserPassword = (password) => {
    if (!auth.currentUser) {
      return Promise.reject(new Error("No user is currently signed in"));
    }
    return updatePassword(auth.currentUser, password);
  };

  // Memoize the context value
  const value = useMemo(() => {
    const adminStatus = isAdmin || currentUser?.isAdmin === true;
    console.log("🔄 AuthContext - Current State:", {
      hasUser: !!currentUser,
      userEmail: currentUser?.email,
      isAdmin: adminStatus,
      userIsAdmin: currentUser?.isAdmin,
      isLoading,
    });

    return {
      currentUser: currentUser
        ? { ...currentUser, isAdmin: adminStatus }
        : null,
      isAuthenticated: !!currentUser,
      isAdmin: adminStatus,
      isLoading,
      login,
      signup,
      logout,
      updateUserProfile,
      sendVerificationEmail,
      resetPassword,
      updateUserEmail,
      updateUserPassword,
    };
  }, [
    currentUser,
    isAdmin,
    isLoading,
    login,
    signup,
    logout,
    updateUserProfile,
    sendVerificationEmail,
    resetPassword,
    updateUserEmail,
    updateUserPassword,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
