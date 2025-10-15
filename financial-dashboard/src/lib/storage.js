// LocalStorage utility for managing accounts and transactions

const STORAGE_KEYS = {
  ACCOUNTS: 'financial_dashboard_accounts',
  TRANSACTIONS: 'financial_dashboard_transactions',
};

// Account Management
export const storageApi = {
  // Get all stored accounts
  getAccounts: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading accounts from localStorage:', error);
      return [];
    }
  },

  // Add or update an account
  saveAccount: (account) => {
    try {
      const accounts = storageApi.getAccounts();
      const existingIndex = accounts.findIndex(
        (a) => a.account_id === account.account_id
      );

      if (existingIndex >= 0) {
        // Update existing account
        accounts[existingIndex] = {
          ...accounts[existingIndex],
          ...account,
          last_updated: new Date().toISOString(),
        };
      } else {
        // Add new account
        accounts.push({
          ...account,
          created_at: new Date().toISOString(),
          last_updated: new Date().toISOString(),
        });
      }

      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
      return true;
    } catch (error) {
      console.error('Error saving account to localStorage:', error);
      return false;
    }
  },

  // Get a specific account by ID
  getAccountById: (accountId) => {
    const accounts = storageApi.getAccounts();
    return accounts.find((a) => a.account_id === parseInt(accountId));
  },

  // Delete an account
  deleteAccount: (accountId) => {
    try {
      const accounts = storageApi.getAccounts();
      const filtered = accounts.filter(
        (a) => a.account_id !== parseInt(accountId)
      );
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error deleting account from localStorage:', error);
      return false;
    }
  },

  // Get all account IDs for suggestions
  getAccountIds: () => {
    const accounts = storageApi.getAccounts();
    return accounts.map((a) => a.account_id).sort((a, b) => a - b);
  },

  // Transaction Management
  getTransactions: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading transactions from localStorage:', error);
      return [];
    }
  },

  // Add a new transaction
  saveTransaction: (transaction) => {
    try {
      const transactions = storageApi.getTransactions();
      const newTransaction = {
        ...transaction,
        id: Date.now(), // Simple ID based on timestamp
        timestamp: new Date().toISOString(),
      };
      transactions.unshift(newTransaction); // Add to beginning
      
      // Keep only last 100 transactions to avoid localStorage limits
      const limited = transactions.slice(0, 100);
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(limited));
      return newTransaction;
    } catch (error) {
      console.error('Error saving transaction to localStorage:', error);
      return null;
    }
  },

  // Get transactions for a specific account
  getTransactionsByAccount: (accountId) => {
    const transactions = storageApi.getTransactions();
    return transactions.filter(
      (t) =>
        t.source_account_id === parseInt(accountId) ||
        t.destination_account_id === parseInt(accountId)
    );
  },

  // Clear all data
  clearAll: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.ACCOUNTS);
      localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },

  // Get statistics
  getStats: () => {
    const accounts = storageApi.getAccounts();
    const transactions = storageApi.getTransactions();
    
    const totalMoved = transactions.reduce((sum, t) => {
      return sum + parseFloat(t.amount || 0);
    }, 0);

    return {
      totalAccounts: accounts.length,
      totalTransactions: transactions.length,
      totalMoneyMoved: totalMoved,
    };
  },
};

export default storageApi;

