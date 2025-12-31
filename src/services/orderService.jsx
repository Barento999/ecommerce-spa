// src/services/orderService.js
import {
  collection,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
} from "firebase/firestore";
import { getFirestoreDb } from "../firebase";

/**
 * Create a new order
 * @param {Object} orderData - Order data
 * @returns {Promise<string>} Order ID
 */
export const createOrder = async (orderData) => {
  try {
    const db = getFirestoreDb();

    // Get user's name from Firestore if not provided
    let userName = orderData.userName || "";
    if (!userName && orderData.userId) {
      try {
        const userDoc = await getDoc(doc(db, "users", orderData.userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          userName = userData.name || userData.displayName || "";
        }
      } catch (err) {
        console.error("Error fetching user name:", err);
      }
    }

    const order = {
      ...orderData,
      userName: userName,
      customerName: userName,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      status: orderData.status || "processing",
      paymentStatus: orderData.paymentStatus || "pending",
      trackingNumber: null,
      estimatedDelivery: null,
      notes: orderData.notes || "",
    };

    const orderRef = await addDoc(collection(db, "orders"), order);

    // Update user's order count and total spent
    if (orderData.userId) {
      try {
        const userRef = doc(db, "users", orderData.userId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          await updateDoc(userRef, {
            orders: (userData.orders || 0) + 1,
            totalSpent: (userData.totalSpent || 0) + (orderData.total || 0),
            lastOrder: Timestamp.now(),
            updatedAt: Timestamp.now(),
          });
        }
      } catch (err) {
        console.error("Error updating user stats:", err);
      }
    }

    return orderRef.id;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

/**
 * Get orders for a specific user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of orders
 */
export const getUserOrders = async (userId) => {
  try {
    const db = getFirestoreDb();
    const ordersQuery = query(
      collection(db, "orders"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(ordersQuery);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate
          ? data.createdAt.toDate().toISOString()
          : data.createdAt,
        updatedAt: data.updatedAt?.toDate
          ? data.updatedAt.toDate().toISOString()
          : data.updatedAt,
      };
    });
  } catch (error) {
    console.error("Error getting orders:", error);
    throw error;
  }
};

/**
 * Get all orders with pagination (admin)
 * @param {number} pageSize - Number of orders per page
 * @param {DocumentSnapshot} lastDoc - Last document from previous page
 * @param {Object} filters - Filter options
 * @returns {Promise<{orders: Array, lastVisible: DocumentSnapshot}>}
 */
export const getAllOrders = async (
  pageSize = 20,
  lastDoc = null,
  filters = {}
) => {
  try {
    console.log("getAllOrders called with filters:", filters);
    const db = getFirestoreDb();
    const ordersRef = collection(db, "orders");

    let constraints = [orderBy("createdAt", "desc"), limit(pageSize)];

    // Apply status filter - only if it's not "all"
    if (filters.status && filters.status !== "all") {
      console.log("Adding status filter:", filters.status);
      constraints.unshift(where("status", "==", filters.status));
    }

    // Apply date range filter
    if (filters.startDate) {
      console.log("Adding startDate filter:", filters.startDate);
      constraints.push(
        where("createdAt", ">=", Timestamp.fromDate(filters.startDate))
      );
    }
    if (filters.endDate) {
      console.log("Adding endDate filter:", filters.endDate);
      constraints.push(
        where("createdAt", "<=", Timestamp.fromDate(filters.endDate))
      );
    }

    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    console.log("Building query with constraints:", constraints.length);
    const q = query(ordersRef, ...constraints);

    console.log("Executing query...");
    const snapshot = await getDocs(q);
    console.log("Query returned", snapshot.size, "documents");

    const orders = snapshot.docs.map((doc) => {
      const data = doc.data();

      // Handle createdAt - check if it's a Firestore Timestamp or string
      let createdAt = new Date();
      if (data.createdAt) {
        if (typeof data.createdAt.toDate === "function") {
          createdAt = data.createdAt.toDate();
        } else {
          createdAt = new Date(data.createdAt);
        }
      }

      // Handle updatedAt - check if it's a Firestore Timestamp or string
      let updatedAt = new Date();
      if (data.updatedAt) {
        if (typeof data.updatedAt.toDate === "function") {
          updatedAt = data.updatedAt.toDate();
        } else {
          updatedAt = new Date(data.updatedAt);
        }
      }

      return {
        id: doc.id,
        ...data,
        createdAt,
        updatedAt,
      };
    });

    const lastVisible = snapshot.docs[snapshot.docs.length - 1];

    console.log("Returning", orders.length, "orders");
    return { orders, lastVisible };
  } catch (error) {
    console.error("Error fetching all orders:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    throw error;
  }
};

/**
 * Get a single order by ID
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Order data
 */
export const getOrderById = async (orderId) => {
  try {
    const db = getFirestoreDb();
    const orderRef = doc(db, "orders", orderId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
      throw new Error("Order not found");
    }

    const orderData = orderSnap.data();

    return {
      id: orderSnap.id,
      ...orderData,
      createdAt: orderData.createdAt?.toDate
        ? orderData.createdAt.toDate()
        : orderData.createdAt
        ? new Date(orderData.createdAt)
        : new Date(),
      updatedAt: orderData.updatedAt?.toDate
        ? orderData.updatedAt.toDate()
        : orderData.updatedAt
        ? new Date(orderData.updatedAt)
        : new Date(),
    };
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

/**
 * Update order status
 * @param {string} orderId - Order ID
 * @param {string} status - New status
 * @param {Object} additionalData - Additional data to update
 * @returns {Promise<void>}
 */
export const updateOrderStatus = async (
  orderId,
  status,
  additionalData = {}
) => {
  try {
    const db = getFirestoreDb();
    const orderRef = doc(db, "orders", orderId);

    const updateData = {
      status,
      updatedAt: Timestamp.now(),
      ...additionalData,
    };

    await updateDoc(orderRef, updateData);
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

/**
 * Get order statistics
 * @param {Object} filters - Filter options (dateRange, etc.)
 * @returns {Promise<Object>} Order statistics
 */
export const getOrderStats = async (filters = {}) => {
  try {
    const db = getFirestoreDb();
    const ordersRef = collection(db, "orders");

    let constraints = [];

    // Apply date range filter
    if (filters.startDate) {
      constraints.push(
        where("createdAt", ">=", Timestamp.fromDate(filters.startDate))
      );
    }
    if (filters.endDate) {
      constraints.push(
        where("createdAt", "<=", Timestamp.fromDate(filters.endDate))
      );
    }

    const q =
      constraints.length > 0 ? query(ordersRef, ...constraints) : ordersRef;

    const snapshot = await getDocs(q);

    let totalOrders = 0;
    let totalRevenue = 0;
    let statusCounts = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    snapshot.forEach((doc) => {
      const data = doc.data();
      totalOrders++;
      totalRevenue += data.total || 0;

      if (Object.prototype.hasOwnProperty.call(statusCounts, data.status)) {
        statusCounts[data.status]++;
      }
    });

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      statusCounts,
    };
  } catch (error) {
    console.error("Error fetching order stats:", error);
    throw error;
  }
};

/**
 * Search orders by order ID or customer email
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} Array of matching orders
 */
export const searchOrders = async (searchTerm) => {
  try {
    const db = getFirestoreDb();
    const ordersRef = collection(db, "orders");

    // Search by email
    const emailQuery = query(
      ordersRef,
      where("userEmail", "==", searchTerm.toLowerCase()),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(emailQuery);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    }));
  } catch (error) {
    console.error("Error searching orders:", error);
    throw error;
  }
};
