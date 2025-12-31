import axios from "axios";

const BASE_URL = "https://dummyjson.com";

// Create axios instance with base URL and common headers
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for adding auth token if available
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle different HTTP status codes
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          console.error("Unauthorized access. Please log in.");
          break;
        case 404:
          console.error("The requested resource was not found.");
          break;
        case 500:
          console.error("Internal server error. Please try again later.");
          break;
        default:
          console.error("An error occurred. Please try again.");
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response from server. Please check your connection.");
    } else {
      // Something happened in setting up the request
      console.error("Error setting up the request.", error.message);
    }
    return Promise.reject(error);
  }
);

// API functions
export const fetchProducts = async (
  category = "",
  searchQuery = "",
  limit = 0
) => {
  try {
    let url = "/products";
    const params = new URLSearchParams();

    if (category) params.append("category", category);
    if (searchQuery) params.append("q", searchQuery);
    // Set limit to 0 to fetch all products, or use a high number like 200
    if (limit > 0) params.append("limit", limit);
    else params.append("limit", 200); // Fetch all available products

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    console.log("Fetching products from:", url);
    const response = await api.get(url);
    console.log("API response:", response.data);
    console.log(
      "Total products fetched:",
      response.data?.products?.length || 0
    );

    // Return the entire response data which includes products array and other metadata
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    // Return an object with empty products array to prevent crashes
    return { products: [] };
  }
};

export const fetchProduct = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    console.log("fetchProduct API response:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await api.get("/products/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Cart related API calls
export const addToCart = async (userId, productId, quantity = 1) => {
  try {
    const response = await api.post("/carts/add", {
      userId,
      products: [
        {
          id: productId,
          quantity,
        },
      ],
    });
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

export const fetchCart = async (cartId) => {
  try {
    const response = await api.get(`/carts/${cartId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

export const updateCart = async (cartId, products) => {
  try {
    const response = await api.put(`/carts/${cartId}`, {
      merge: false, // Set to true if you want to merge with existing cart
      products,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating cart:", error);
    throw error;
  }
};

export const deleteFromCart = async (cartId, productId) => {
  try {
    const response = await api.delete(`/carts/${cartId}/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting from cart:", error);
    throw error;
  }
};

export default api;
