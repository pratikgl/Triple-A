import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { accountsApi } from '@/services/api';

export function CreateAccount() {
  const [accountId, setAccountId] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

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

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await accountsApi.createAccount({
        account_id: parseInt(accountId),
        initial_balance: initialBalance,
      });

      setMessage({
        type: 'success',
        text: `Account created successfully! Account ID: ${result.account_id}, Balance: ${result.initial_balance}`,
      });

      // Reset form
      setAccountId('');
      setInitialBalance('');
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || error.message || 'Failed to create account',
      });
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

          {message.text && (
            <div
              className={`p-3 rounded-md text-sm animate-slide-down transition-all duration-300 ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

