import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { transactionsApi, accountsApi } from '@/services/api';

export function ExecuteTransaction() {
  const [sourceAccountId, setSourceAccountId] = useState('');
  const [destinationAccountId, setDestinationAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [transactionResult, setTransactionResult] = useState(null);
  const [accountBalances, setAccountBalances] = useState(null);

  const validateForm = () => {
    if (!sourceAccountId.trim()) {
      setMessage({ type: 'error', text: 'Source Account ID is required' });
      return false;
    }

    if (isNaN(sourceAccountId) || !Number.isInteger(Number(sourceAccountId))) {
      setMessage({ type: 'error', text: 'Source Account ID must be a valid integer' });
      return false;
    }

    if (!destinationAccountId.trim()) {
      setMessage({ type: 'error', text: 'Destination Account ID is required' });
      return false;
    }

    if (isNaN(destinationAccountId) || !Number.isInteger(Number(destinationAccountId))) {
      setMessage({ type: 'error', text: 'Destination Account ID must be a valid integer' });
      return false;
    }

    if (sourceAccountId === destinationAccountId) {
      setMessage({ type: 'error', text: 'Source and Destination accounts must be different' });
      return false;
    }

    if (!amount.trim()) {
      setMessage({ type: 'error', text: 'Amount is required' });
      return false;
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      setMessage({ type: 'error', text: 'Amount must be a valid positive number' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setTransactionResult(null);
    setAccountBalances(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const sourceId = parseInt(sourceAccountId);
      const destId = parseInt(destinationAccountId);
      const transferAmount = amount;

      // Execute the transaction
      const result = await transactionsApi.createTransaction({
        source_account_id: sourceId,
        destination_account_id: destId,
        amount: transferAmount,
      });

      // If transaction succeeds, set result (even if empty response, use our own data)
      setTransactionResult({
        source_account_id: result?.source_account_id || sourceId,
        destination_account_id: result?.destination_account_id || destId,
        amount: result?.amount || transferAmount,
      });

      // Fetch updated balances for both accounts
      try {
        const [sourceAccount, destAccount] = await Promise.all([
          accountsApi.getAccount(sourceId),
          accountsApi.getAccount(destId),
        ]);

        setAccountBalances({
          source: sourceAccount,
          destination: destAccount,
        });
      } catch (balanceError) {
        console.error('Failed to fetch updated balances:', balanceError);
        // Transaction was successful, just couldn't fetch balances
      }

      // Reset form
      setSourceAccountId('');
      setDestinationAccountId('');
      setAmount('');
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Transaction failed',
      });
      setTransactionResult(null);
      setAccountBalances(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Execute Transaction</CardTitle>
        <CardDescription>Transfer funds between two accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="source-account-id">Source Account ID</Label>
            <Input
              id="source-account-id"
              type="text"
              placeholder="Enter source account ID"
              value={sourceAccountId}
              onChange={(e) => setSourceAccountId(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination-account-id">Destination Account ID</Label>
            <Input
              id="destination-account-id"
              type="text"
              placeholder="Enter destination account ID"
              value={destinationAccountId}
              onChange={(e) => setDestinationAccountId(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="text"
              placeholder="Enter amount to transfer"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={loading}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Processing...' : 'Execute Transaction'}
          </Button>

          {transactionResult && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-purple-100 dark:bg-purple-900 border-2 border-purple-400 dark:border-purple-600 animate-slide-down shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-purple-700 dark:text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-semibold text-purple-900 dark:text-white">Transaction Successful!</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-purple-800 dark:text-purple-100">From Account:</span>
                    <span className="text-sm font-bold text-purple-900 dark:text-white">{transactionResult.source_account_id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-purple-800 dark:text-purple-100">To Account:</span>
                    <span className="text-sm font-bold text-purple-900 dark:text-white">{transactionResult.destination_account_id}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-purple-200 dark:border-purple-800">
                    <span className="text-sm font-medium text-purple-800 dark:text-purple-100">Amount Transferred:</span>
                    <span className="text-lg font-bold text-purple-700 dark:text-purple-200">${transactionResult.amount}</span>
                  </div>
                </div>
              </div>

              {accountBalances && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-down">
                  <div className="p-4 rounded-lg bg-orange-100 dark:bg-orange-900 border-2 border-orange-400 dark:border-orange-600 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-orange-700 dark:text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span className="text-xs font-semibold text-orange-900 dark:text-white uppercase">Source Account</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-orange-800 dark:text-orange-100">Account ID:</span>
                        <span className="text-sm font-bold text-orange-900 dark:text-white">{accountBalances.source.account_id}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-orange-800 dark:text-orange-100">Updated Balance:</span>
                        <span className="text-base font-bold text-orange-700 dark:text-orange-200">${accountBalances.source.balance}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-teal-100 dark:bg-teal-900 border-2 border-teal-400 dark:border-teal-600 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-teal-700 dark:text-teal-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span className="text-xs font-semibold text-teal-900 dark:text-white uppercase">Destination Account</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-teal-800 dark:text-teal-100">Account ID:</span>
                        <span className="text-sm font-bold text-teal-900 dark:text-white">{accountBalances.destination.account_id}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-teal-800 dark:text-teal-100">Updated Balance:</span>
                        <span className="text-base font-bold text-teal-700 dark:text-teal-200">${accountBalances.destination.balance}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {message.text && (
            <Alert variant="destructive" className="animate-slide-down">
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

