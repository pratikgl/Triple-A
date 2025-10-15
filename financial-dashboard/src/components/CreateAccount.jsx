import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { accountsApi } from '@/services/api';

export function CreateAccount() {
  const [accountId, setAccountId] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [createdAccount, setCreatedAccount] = useState(null);

  const validateForm = () => {
    if (!accountId.trim()) {
      setMessage({ type: 'error', text: 'Account ID is required' });
      return false;
    }

    if (isNaN(accountId) || !Number.isInteger(Number(accountId))) {
      setMessage({ type: 'error', text: 'Account ID must be a valid integer' });
      return false;
    }

    if (!initialBalance.trim()) {
      setMessage({ type: 'error', text: 'Initial balance is required' });
      return false;
    }

    if (isNaN(initialBalance) || Number(initialBalance) < 0) {
      setMessage({ type: 'error', text: 'Initial balance must be a valid positive number' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setCreatedAccount(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await accountsApi.createAccount({
        account_id: parseInt(accountId),
        initial_balance: initialBalance,
      });

      setCreatedAccount(result);

      // Reset form
      setAccountId('');
      setInitialBalance('');
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to create account',
      });
      setCreatedAccount(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Create a new financial account with an initial balance</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="account-id">Account ID</Label>
            <Input
              id="account-id"
              type="text"
              placeholder="Enter account ID (integer)"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="initial-balance">Initial Balance</Label>
            <Input
              id="initial-balance"
              type="text"
              placeholder="Enter initial balance"
              value={initialBalance}
              onChange={(e) => setInitialBalance(e.target.value)}
              disabled={loading}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating...' : 'Create Account'}
          </Button>

          {createdAccount && (
            <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900 border-2 border-green-400 dark:border-green-600 animate-slide-down shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-green-700 dark:text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-semibold text-green-900 dark:text-white">Account Created Successfully!</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-800 dark:text-green-100">Account ID:</span>
                  <span className="text-sm font-bold text-green-900 dark:text-white">{createdAccount.account_id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-800 dark:text-green-100">Initial Balance:</span>
                  <span className="text-lg font-bold text-green-700 dark:text-green-200">${createdAccount.balance}</span>
                </div>
              </div>
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

