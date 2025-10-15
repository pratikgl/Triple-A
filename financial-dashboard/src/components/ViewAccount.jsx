import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
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
        text: error.response?.data?.message || error.message || 'Failed to fetch account',
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
            <div className="p-4 rounded-md bg-blue-50 border border-blue-200">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Account ID:</span>
                  <span className="text-sm font-semibold text-gray-900">{accountData.account_id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Balance:</span>
                  <span className="text-lg font-bold text-blue-600">${accountData.balance}</span>
                </div>
              </div>
            </div>
          )}

          {message.text && !accountData && (
            <div
              className={`p-3 rounded-md text-sm ${
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

