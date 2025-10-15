import axios from 'axios';

const API_BASE_URL = 'http://localhost:8860';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const accountsApi = {
  // Create a new account
  createAccount: async (accountData) => {
    const response = await api.post('/accounts', accountData);
    return response.data;
  },

  // Get account balance by ID
  getAccount: async (accountId) => {
    const response = await api.get(`/accounts/${accountId}`);
    return response.data;
  },
};

export const transactionsApi = {
  // Execute a transaction
  createTransaction: async (transactionData) => {
    const response = await api.post('/transactions', transactionData);
    return response.data;
  },
};

export default api;

