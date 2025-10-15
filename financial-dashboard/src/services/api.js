import axios from 'axios';

// Use proxy in development, direct URL in production
const API_BASE_URL = import.meta.env.DEV ? '/api' : 'http://localhost:8860';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Extract error message from various error response formats
 * @param {Error} error - The error object from axios
 * @returns {string} - A user-friendly error message
 */
export const getErrorMessage = (error) => {
  // If there's a response from the server
  if (error.response) {
    const { data, status, statusText } = error.response;
    
    // Try to extract error message from various possible formats
    if (data) {
      // Check for common error message fields
      if (typeof data === 'string') {
        return data;
      }
      
      if (data.message) {
        return data.message;
      }
      
      if (data.error) {
        return typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
      }
      
      if (data.detail) {
        return typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
      }
      
      if (data.errors) {
        // Handle validation errors array
        if (Array.isArray(data.errors)) {
          return data.errors.map(e => e.message || e).join(', ');
        }
        return JSON.stringify(data.errors);
      }
      
      // If data is an object but no recognized error field, stringify it
      if (typeof data === 'object') {
        return JSON.stringify(data);
      }
    }
    
    // Fallback to status-based message
    return `Request failed with status ${status}: ${statusText}`;
  }
  
  // If there's a request but no response (network error, timeout, etc.)
  if (error.request) {
    return 'Network error: Unable to reach the server. Please check your connection.';
  }
  
  // Something else happened
  return error.message || 'An unexpected error occurred';
};

// Add response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log the full error for debugging
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    
    // Reject with the original error so we can still access all information
    return Promise.reject(error);
  }
);

export const accountsApi = {
  // Create a new account
  createAccount: async (accountData) => {
    try {
      const response = await api.post('/accounts', accountData);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Get account balance by ID
  getAccount: async (accountId) => {
    try {
      const response = await api.get(`/accounts/${accountId}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};

export const transactionsApi = {
  // Execute a transaction
  createTransaction: async (transactionData) => {
    try {
      const response = await api.post('/transactions', transactionData);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};

export default api;

