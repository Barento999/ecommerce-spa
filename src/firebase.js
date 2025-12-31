// Firebase v9+ modular SDK
import { initializeApp, getApps, getApp } from "firebase/app";
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
import { getAnalytics, isSupported } from "firebase/analytics";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBuL9BRapc8CaLzCkny0oMLxsv24A3Kuio",
  authDomain: "ecommerce-55491.firebaseapp.com",
  projectId: "ecommerce-55491",
  storageBucket: "ecommerce-55491.firebasestorage.app",
  messagingSenderId: "578501587024",
  appId: "1:578501587024:web:9458f4710b13dc6eb52155",
  measurementId: "G-4ZXWQWK5XP",
};

// Client-side only Firebase initialization
let app;
let analytics;
let functions;
let auth;
let db;

// This function initializes Firebase services
const initializeFirebase = () => {
  if (typeof window === "undefined") {
    return {
      app: null,
      auth: null,
      db: null,
      functions: null,
      analytics: null,
    };
  }

  try {
    // Initialize Firebase app if not already initialized
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }

    // Initialize services
    const authService = getAuth(app);
    const firestore = getFirestore(app);
    const functionsService = getFunctions(app);

    // Initialize analytics if supported
    let analyticsService = null;
    isSupported().then((yes) => {
      if (yes) {
        analyticsService = getAnalytics(app);
      }
    });

    // Use the emulator in development
    if (process.env.NODE_ENV === "development") {
      connectFunctionsEmulator(functionsService, "localhost", 5001);
    }

    // Update module-level variables
    auth = authService;
    db = firestore;
    functions = functionsService;
    analytics = analyticsService;

    return {
      app,
      auth: authService,
      db: firestore,
      functions: functionsService,
      analytics: analyticsService,
    };
  } catch (error) {
    console.error("Firebase initialization error:", error);
    return {
      app: null,
      auth: null,
      db: null,
      functions: null,
      analytics: null,
    };
  }
};

// Initialize Firebase services
const firebase = initializeFirebase();

export const getFirebaseAuth = () => firebase.auth || auth;
export const getFirestoreDb = () => firebase.db || db;
export const getFirebaseFunctions = () => firebase.functions || functions;

// Order related functions
export const createOrder = async (orderData) => {
  try {
    console.log("Creating order with data:", orderData);

    // Ensure required fields are present
    if (!orderData.userId) {
      throw new Error("User ID is required");
    }
    if (!orderData.items || orderData.items.length === 0) {
      throw new Error("Order must contain at least one item");
    }

    const orderWithTimestamp = {
      ...orderData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      status: orderData.status || "processing", // processing, shipped, delivered, cancelled
    };

    console.log("Saving order to Firestore...");
    const orderRef = await addDoc(collection(db, "orders"), orderWithTimestamp);

    console.log("Order created successfully with ID:", orderRef.id);
    return orderRef.id;
  } catch (error) {
    console.error("Error in createOrder:", {
      error: error.message,
      stack: error.stack,
      orderData: {
        ...orderData,
        items: orderData.items?.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    });
    throw new Error(`Failed to create order: ${error.message}`);
  }
};

export const getUserOrders = async (userId) => {
  try {
    const ordersQuery = query(
      collection(db, "orders"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(ordersQuery);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore timestamp to JavaScript Date
      createdAt: doc.data().createdAt?.toDate
        ? doc.data().createdAt.toDate().toISOString()
        : doc.data().createdAt,
    }));
  } catch (error) {
    console.error("Error getting orders: ", error);
    throw error;
  }
};

// Export Firebase auth functions
export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
  getFirebaseAuth as auth,
};

// Export Firestore functions
export {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  deleteDoc,
  getFirestoreDb as db,
};

// Export other utilities
export { getFirebaseFunctions as functions };

export default app;
