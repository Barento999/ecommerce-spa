// src/services/customerService.js
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
} from "firebase/firestore";
import { getFirestoreDb } from "../firebase";

/**
 * Get all customers with pagination
 * @param {number} pageSize - Number of customers per page
 * @param {DocumentSnapshot} lastDoc - Last document from previous page
 * @returns {Promise<{customers: Array, lastVisible: DocumentSnapshot}>}
 */
export const getCustomers = async (pageSize = 10, lastDoc = null) => {
  try {
    const db = getFirestoreDb();
    const customersRef = collection(db, "users");

    let q = query(customersRef, orderBy("createdAt", "desc"), limit(pageSize));

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);
    const customers = [];

    for (const docSnap of snapshot.docs) {
      const userData = docSnap.data();

      // Get customer's orders to calculate stats
      const ordersRef = collection(db, "orders");
      const ordersQuery = query(
        ordersRef,
        where("userId", "==", docSnap.id),
        orderBy("createdAt", "desc")
      );
      const ordersSnapshot = await getDocs(ordersQuery);

      let totalSpent = 0;
      let lastOrderDate = null;

      ordersSnapshot.forEach((orderDoc) => {
        const orderData = orderDoc.data();
        totalSpent += orderData.total || 0;

        if (
          !lastOrderDate ||
          (orderData.createdAt && orderData.createdAt.toDate() > lastOrderDate)
        ) {
          lastOrderDate = orderData.createdAt?.toDate();
        }
      });

      customers.push({
        id: docSnap.id,
        name: userData.displayName || "Guest User",
        email: userData.email || "",
        phone: userData.phoneNumber || userData.phone || "",
        orders: ordersSnapshot.size,
        totalSpent,
        lastOrder: lastOrderDate,
        joined: userData.createdAt?.toDate() || new Date(),
        status: userData.status || "active",
        address: userData.shippingAddress || null,
        photoURL: userData.photoURL || null,
        emailVerified: userData.emailVerified || false,
      });
    }

    const lastVisible = snapshot.docs[snapshot.docs.length - 1];

    return { customers, lastVisible };
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};

/**
 * Get a single customer by ID
 * @param {string} customerId - Customer ID
 * @returns {Promise<Object>}
 */
export const getCustomerById = async (customerId) => {
  try {
    const db = getFirestoreDb();
    const customerRef = doc(db, "users", customerId);
    const customerSnap = await getDoc(customerRef);

    if (!customerSnap.exists()) {
      throw new Error("Customer not found");
    }

    const userData = customerSnap.data();

    // Get customer's orders
    const ordersRef = collection(db, "orders");
    const ordersQuery = query(
      ordersRef,
      where("userId", "==", customerId),
      orderBy("createdAt", "desc")
    );
    const ordersSnapshot = await getDocs(ordersQuery);

    const orders = [];
    let totalSpent = 0;

    ordersSnapshot.forEach((orderDoc) => {
      const orderData = orderDoc.data();
      orders.push({
        id: orderDoc.id,
        ...orderData,
        createdAt: orderData.createdAt?.toDate(),
      });
      totalSpent += orderData.total || 0;
    });

    return {
      id: customerSnap.id,
      name: userData.displayName || "Guest User",
      email: userData.email || "",
      phone: userData.phoneNumber || userData.phone || "",
      orders,
      orderCount: orders.length,
      totalSpent,
      joined: userData.createdAt?.toDate() || new Date(),
      status: userData.status || "active",
      shippingAddress: userData.shippingAddress || null,
      billingAddress: userData.billingAddress || null,
      photoURL: userData.photoURL || null,
      emailVerified: userData.emailVerified || false,
      lastLogin: userData.lastLogin?.toDate() || null,
    };
  } catch (error) {
    console.error("Error fetching customer:", error);
    throw error;
  }
};

/**
 * Update customer information
 * @param {string} customerId - Customer ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateCustomer = async (customerId, updates) => {
  try {
    const db = getFirestoreDb();
    const customerRef = doc(db, "users", customerId);

    const updateData = {
      ...updates,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(customerRef, updateData);
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
};

/**
 * Search customers by name or email
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>}
 */
export const searchCustomers = async (searchTerm) => {
  try {
    const db = getFirestoreDb();
    const customersRef = collection(db, "users");

    // Note: Firestore doesn't support full-text search natively
    // For production, consider using Algolia or Elasticsearch
    const snapshot = await getDocs(customersRef);

    const customers = [];
    const lowerSearchTerm = searchTerm.toLowerCase();

    for (const docSnap of snapshot.docs) {
      const userData = docSnap.data();
      const name = (userData.displayName || "").toLowerCase();
      const email = (userData.email || "").toLowerCase();

      if (name.includes(lowerSearchTerm) || email.includes(lowerSearchTerm)) {
        // Get order count
        const ordersRef = collection(db, "orders");
        const ordersQuery = query(ordersRef, where("userId", "==", docSnap.id));
        const ordersSnapshot = await getDocs(ordersQuery);

        let totalSpent = 0;
        ordersSnapshot.forEach((orderDoc) => {
          totalSpent += orderDoc.data().total || 0;
        });

        customers.push({
          id: docSnap.id,
          name: userData.displayName || "Guest User",
          email: userData.email || "",
          phone: userData.phoneNumber || userData.phone || "",
          orders: ordersSnapshot.size,
          totalSpent,
          joined: userData.createdAt?.toDate() || new Date(),
          status: userData.status || "active",
        });
      }
    }

    return customers;
  } catch (error) {
    console.error("Error searching customers:", error);
    throw error;
  }
};

/**
 * Get customer statistics
 * @returns {Promise<Object>}
 */
export const getCustomerStats = async () => {
  try {
    const db = getFirestoreDb();
    const customersRef = collection(db, "users");
    const snapshot = await getDocs(customersRef);

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    let totalCustomers = 0;
    let newCustomers = 0;
    let activeCustomers = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();
      totalCustomers++;

      if (data.createdAt && data.createdAt.toDate() >= thirtyDaysAgo) {
        newCustomers++;
      }

      if (data.status === "active") {
        activeCustomers++;
      }
    });

    return {
      totalCustomers,
      newCustomers,
      activeCustomers,
      inactiveCustomers: totalCustomers - activeCustomers,
    };
  } catch (error) {
    console.error("Error fetching customer stats:", error);
    throw error;
  }
};

/**
 * Create or update customer profile when they register
 * @param {string} userId - User ID
 * @param {Object} userData - User data
 * @returns {Promise<void>}
 */
export const createCustomerProfile = async (userId, userData) => {
  try {
    const db = getFirestoreDb();
    const userRef = doc(db, "users", userId);

    const profileData = {
      name: userData.displayName || "",
      displayName: userData.displayName || "",
      email: userData.email || "",
      phoneNumber: userData.phoneNumber || "",
      photoURL: userData.photoURL || null,
      emailVerified: userData.emailVerified || false,
      status: "active",
      orders: 0,
      totalSpent: 0,
      lastOrder: null,
      joined: Timestamp.now(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      lastLogin: Timestamp.now(),
      shippingAddress: null,
      billingAddress: null,
      preferences: {
        newsletter: true,
        notifications: true,
      },
    };

    await setDoc(userRef, profileData, { merge: true });
  } catch (error) {
    console.error("Error creating customer profile:", error);
    throw error;
  }
};

/**
 * Update customer's last login time
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export const updateLastLogin = async (userId) => {
  try {
    const db = getFirestoreDb();
    const userRef = doc(db, "users", userId);

    await updateDoc(userRef, {
      lastLogin: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating last login:", error);
    // Don't throw error for last login update
  }
};
