import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { storageApi } from '@/lib/storage';

export function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filterAccountId, setFilterAccountId] = useState('');

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [filterAccountId, transactions]);

  const loadTransactions = () => {
    const storedTransactions = storageApi.getTransactions();
    setTransactions(storedTransactions);
  };

  const applyFilter = () => {
    if (!filterAccountId.trim()) {
      setFilteredTransactions(transactions);
      return;
    }

    const accountId = parseInt(filterAccountId);
    const filtered = transactions.filter(
      (t) =>
        t.source_account_id === accountId ||
        t.destination_account_id === accountId
    );
    setFilteredTransactions(filtered);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all transaction history?')) {
      localStorage.removeItem('financial_dashboard_transactions');
      loadTransactions();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              View all completed transactions ({filteredTransactions.length} shown)
            </CardDescription>
          </div>
          {transactions.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
            >
              Clear History
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 && (
          <div className="mb-4">
            <Label htmlFor="filter-account">Filter by Account ID</Label>
            <Input
              id="filter-account"
              type="text"
              placeholder="Enter account ID to filter"
              value={filterAccountId}
              onChange={(e) => setFilterAccountId(e.target.value)}
            />
          </div>
        )}

        {filteredTransactions.length === 0 ? (
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {filterAccountId ? 'No transactions found' : 'No transaction history'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filterAccountId
                ? `No transactions found for Account ${filterAccountId}`
                : 'Execute transactions to see them here'}
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-3 rounded-lg border border-gray-200 bg-white hover:border-purple-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-500">
                    {formatDate(transaction.timestamp)}
                  </span>
                  <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                    ID: {transaction.id}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Source Account */}
                  <div className="flex-1 bg-orange-50 border border-orange-200 rounded-lg p-2">
                    <p className="text-xs text-orange-600 font-medium mb-0.5">
                      FROM
                    </p>
                    <p className="text-sm font-bold text-orange-700">
                      #{transaction.source_account_id}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-purple-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>

                  {/* Destination Account */}
                  <div className="flex-1 bg-teal-50 border border-teal-200 rounded-lg p-2">
                    <p className="text-xs text-teal-600 font-medium mb-0.5">
                      TO
                    </p>
                    <p className="text-sm font-bold text-teal-700">
                      #{transaction.destination_account_id}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="flex-shrink-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-2 min-w-[100px] shadow-sm">
                    <p className="text-xs text-white font-medium mb-0.5">AMOUNT</p>
                    <p className="text-base font-bold text-white">
                      ${parseFloat(transaction.amount).toFixed(2)}
                    </p>
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

