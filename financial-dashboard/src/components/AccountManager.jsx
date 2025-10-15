import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { storageApi } from '@/lib/storage';
import { accountsApi } from '@/services/api';
import { useToast } from '@/components/ui/Toast';

export function AccountManager() {
  const [accounts, setAccounts] = useState([]);
  const [refreshing, setRefreshing] = useState(null);
  const toast = useToast();

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = () => {
    const storedAccounts = storageApi.getAccounts();
    setAccounts(storedAccounts);
  };

  const refreshAccount = async (accountId) => {
    setRefreshing(accountId);
    try {
      const accountData = await accountsApi.getAccount(accountId);
      storageApi.saveAccount(accountData);
      loadAccounts();
      toast.success(`Account ${accountId} refreshed successfully`);
    } catch (error) {
      toast.error(`Failed to refresh account: ${error.message}`);
    } finally {
      setRefreshing(null);
    }
  };

  const deleteAccount = (accountId) => {
    if (window.confirm(`Are you sure you want to remove Account ${accountId} from your list?`)) {
      storageApi.deleteAccount(accountId);
      loadAccounts();
      toast.info(`Account ${accountId} removed from list`);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Account Manager</CardTitle>
        <CardDescription>
          Manage your saved accounts ({accounts.length} account{accounts.length !== 1 ? 's' : ''})
        </CardDescription>
      </CardHeader>
      <CardContent>
        {accounts.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No accounts</h3>
            <p className="mt-1 text-sm text-gray-500">
              Create or view accounts to see them here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {accounts.map((account) => (
              <div
                key={account.account_id}
                className="p-4 rounded-lg border border-gray-200 bg-white hover:border-blue-400 hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 shadow-sm">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-semibold text-gray-900 truncate">
                          Account #{account.account_id}
                        </h3>
                        <p className="text-xs text-gray-500 break-words">
                          Last updated: {formatDate(account.last_updated)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-baseline gap-2 pl-0 sm:pl-14">
                      <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        ${parseFloat(account.balance).toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-500 whitespace-nowrap">current balance</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col flex-row gap-2 w-full sm:w-auto">
                    <Button
                      onClick={() => refreshAccount(account.account_id)}
                      disabled={refreshing === account.account_id}
                      className="bg-blue-600 hover:bg-blue-700 text-xs px-3 py-1.5 flex-1 sm:flex-none whitespace-nowrap"
                    >
                      {refreshing === account.account_id ? (
                        <span className="flex items-center justify-center gap-1">
                          <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="hidden sm:inline">Refreshing...</span>
                          <span className="sm:hidden">...</span>
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Refresh
                        </span>
                      )}
                    </Button>
                    <Button
                      onClick={() => deleteAccount(account.account_id)}
                      disabled={refreshing === account.account_id}
                      className="bg-red-600 hover:bg-red-700 text-xs px-3 py-1.5 flex-1 sm:flex-none whitespace-nowrap"
                    >
                      <span className="flex items-center justify-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

