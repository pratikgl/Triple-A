import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { transactionsApi } from '@/services/api';

export function ExecuteTransaction() {
  const [sourceAccountId, setSourceAccountId] = useState('');
  const [destinationAccountId, setDestinationAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

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

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await transactionsApi.createTransaction({
        source_account_id: parseInt(sourceAccountId),
        destination_account_id: parseInt(destinationAccountId),
        amount: amount,
      });

      setMessage({
        type: 'success',
        text: `Transaction successful! Transferred ${result.amount} from Account ${result.source_account_id} to Account ${result.destination_account_id}`,
      });

      // Reset form
      setSourceAccountId('');
      setDestinationAccountId('');
      setAmount('');
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || error.message || 'Transaction failed',
      });
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

          {message.text && (
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

