import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { accountsApi } from '@/services/api';

export function ViewAccount() {
  const [accountId, setAccountId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [accountData, setAccountData] = useState(null);

  const validateForm = () => {
    if (!accountId.trim()) {
      setMessage({ type: 'error', text: 'Account ID is required' });
      return false;
    }

    if (isNaN(accountId) || !Number.isInteger(Number(accountId))) {
      setMessage({ type: 'error', text: 'Account ID must be a valid integer' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setAccountData(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await accountsApi.getAccount(parseInt(accountId));

      setAccountData(result);
      setMessage({
        type: 'success',
        text: `Account found!`,
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to fetch account',
      });
      setAccountData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>View Account Balance</CardTitle>
        <CardDescription>Check the balance of an existing account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="view-account-id">Account ID</Label>
            <Input
              id="view-account-id"
              type="text"
              placeholder="Enter account ID to view"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              disabled={loading}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Fetching...' : 'View Balance'}
          </Button>

          {accountData && (
            <div className="p-4 rounded-lg bg-blue-100 dark:bg-blue-900 border-2 border-blue-400 dark:border-blue-600 animate-slide-down shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-blue-700 dark:text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-semibold text-blue-900 dark:text-white">Account Found!</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-100">Account ID:</span>
                  <span className="text-sm font-bold text-blue-900 dark:text-white">{accountData.account_id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-100">Balance:</span>
                  <span className="text-lg font-bold text-blue-700 dark:text-blue-200">${accountData.balance}</span>
                </div>
              </div>
            </div>
          )}

          {message.text && !accountData && (
            <Alert variant="destructive" className="animate-slide-down">
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

