import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { AutocompleteInput } from '@/components/ui/AutocompleteInput';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { transactionsApi, accountsApi } from '@/services/api';
import { storageApi } from '@/lib/storage';
import { useToast } from '@/components/ui/Toast';

export function ExecuteTransaction() {
  const [sourceAccountId, setSourceAccountId] = useState('');
  const [destinationAccountId, setDestinationAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingBalance, setCheckingBalance] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [transactionResult, setTransactionResult] = useState(null);
  const [accountBalances, setAccountBalances] = useState(null);
  const [sourceBalance, setSourceBalance] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [accountSuggestions, setAccountSuggestions] = useState([]);
  const toast = useToast();

  useEffect(() => {
    // Load account IDs for autocomplete
    const ids = storageApi.getAccountIds();
    setAccountSuggestions(ids);
  }, []);

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

  const checkSourceBalance = async () => {
    if (!validateForm()) {
      return;
    }

    setCheckingBalance(true);
    setMessage({ type: '', text: '' });
    setSourceBalance(null);
    setShowConfirmation(false);

    try {
      const sourceId = parseInt(sourceAccountId);
      const account = await accountsApi.getAccount(sourceId);
      const currentBalance = parseFloat(account.balance);
      const transferAmount = parseFloat(amount);

      setSourceBalance({
        current: currentBalance,
        afterTransaction: currentBalance - transferAmount,
        hasSufficientFunds: currentBalance >= transferAmount,
      });

      setShowConfirmation(true);
    } catch (error) {
      setMessage({
        type: 'error',
        text: `Failed to check balance: ${error.message}`,
      });
      setSourceBalance(null);
      setShowConfirmation(false);
    } finally {
      setCheckingBalance(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setTransactionResult(null);
    setAccountBalances(null);

    // Check if balance was verified
    if (!sourceBalance) {
      setMessage({
        type: 'error',
        text: 'Please check balance first before executing transaction',
      });
      return;
    }

    // Check if sufficient funds
    if (!sourceBalance.hasSufficientFunds) {
      setMessage({
        type: 'error',
        text: 'Insufficient funds in source account',
      });
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
      const transactionData = {
        source_account_id: result?.source_account_id || sourceId,
        destination_account_id: result?.destination_account_id || destId,
        amount: result?.amount || transferAmount,
      };
      
      setTransactionResult(transactionData);

      // Save transaction to localStorage
      storageApi.saveTransaction(transactionData);

      // Show success toast
      toast.success(`Transaction successful! $${transferAmount} transferred from #${sourceId} to #${destId}`);

      // Fetch updated balances for both accounts
      try {
        const [sourceAccount, destAccount] = await Promise.all([
          accountsApi.getAccount(sourceId),
          accountsApi.getAccount(destId),
        ]);

        // Update accounts in storage
        storageApi.saveAccount(sourceAccount);
        storageApi.saveAccount(destAccount);

        setAccountBalances({
          source: sourceAccount,
          destination: destAccount,
        });
      } catch (balanceError) {
        console.error('Failed to fetch updated balances:', balanceError);
        toast.warning('Transaction successful, but could not fetch updated balances');
        // Transaction was successful, just couldn't fetch balances
      }

      // Reset form
      setSourceAccountId('');
      setDestinationAccountId('');
      setAmount('');
      setSourceBalance(null);
      setShowConfirmation(false);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Transaction failed',
      });
      toast.error(error.message || 'Transaction failed');
      setTransactionResult(null);
      setAccountBalances(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSourceBalance(null);
    setShowConfirmation(false);
    setMessage({ type: '', text: '' });
  };

  const handleFormChange = () => {
    // Reset balance check when form changes
    if (sourceBalance || showConfirmation) {
      setSourceBalance(null);
      setShowConfirmation(false);
      setMessage({ type: '', text: '' });
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
            <AutocompleteInput
              id="source-account-id"
              type="text"
              placeholder="Enter source account ID"
              value={sourceAccountId}
              onChange={(e) => {
                setSourceAccountId(e.target.value);
                handleFormChange();
              }}
              disabled={loading || checkingBalance}
              suggestions={accountSuggestions}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination-account-id">Destination Account ID</Label>
            <AutocompleteInput
              id="destination-account-id"
              type="text"
              placeholder="Enter destination account ID"
              value={destinationAccountId}
              onChange={(e) => {
                setDestinationAccountId(e.target.value);
                handleFormChange();
              }}
              disabled={loading || checkingBalance}
              suggestions={accountSuggestions}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">$</span>
              <Input
                id="amount"
                type="text"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  handleFormChange();
                }}
                disabled={loading || checkingBalance}
              />
            </div>
            
            {/* Amount Presets */}
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium mr-1">Quick:</span>
              {[10, 50, 100, 500].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setAmount(preset.toString());
                    handleFormChange();
                  }}
                  disabled={loading || checkingBalance}
                  className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                    amount === preset.toString()
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-sm'
                  } ${
                    loading || checkingBalance
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer hover:scale-105'
                  }`}
                >
                  ${preset}
                </button>
              ))}
            </div>
          </div>

          {/* Balance Check Section */}
          {!showConfirmation && (
            <Button
              type="button"
              onClick={checkSourceBalance}
              disabled={loading || checkingBalance}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              {checkingBalance ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Checking Balance...
                </span>
              ) : (
                'Check Balance & Verify Transaction'
              )}
            </Button>
          )}

          {/* Balance Display & Confirmation */}
          {sourceBalance && showConfirmation && (
            <div
              className={`p-4 rounded-lg border-2 animate-slide-down shadow-sm ${
                sourceBalance.hasSufficientFunds
                  ? 'bg-indigo-50 dark:bg-indigo-900 border-indigo-400 dark:border-indigo-600'
                  : 'bg-red-50 dark:bg-red-900 border-red-400 dark:border-red-600'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  {sourceBalance.hasSufficientFunds ? (
                    <svg className="w-5 h-5 text-indigo-700 dark:text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-700 dark:text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <span className={`text-sm font-semibold ${
                    sourceBalance.hasSufficientFunds
                      ? 'text-indigo-900 dark:text-white'
                      : 'text-red-900 dark:text-white'
                  }`}>
                    {sourceBalance.hasSufficientFunds ? 'Sufficient Funds Available' : 'Insufficient Funds'}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className={`font-medium ${
                      sourceBalance.hasSufficientFunds
                        ? 'text-indigo-800 dark:text-indigo-100'
                        : 'text-red-800 dark:text-red-100'
                    }`}>Current Balance:</span>
                    <span className={`font-bold ${
                      sourceBalance.hasSufficientFunds
                        ? 'text-indigo-900 dark:text-white'
                        : 'text-red-900 dark:text-white'
                    }`}>${sourceBalance.current.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className={`font-medium ${
                      sourceBalance.hasSufficientFunds
                        ? 'text-indigo-800 dark:text-indigo-100'
                        : 'text-red-800 dark:text-red-100'
                    }`}>Transfer Amount:</span>
                    <span className={`font-bold ${
                      sourceBalance.hasSufficientFunds
                        ? 'text-indigo-900 dark:text-white'
                        : 'text-red-900 dark:text-white'
                    }`}>-${parseFloat(amount).toFixed(2)}</span>
                  </div>

                  <div className="border-t pt-2 border-indigo-200 dark:border-indigo-700">
                    <div className="flex justify-between items-center">
                      <span className={`font-semibold ${
                        sourceBalance.hasSufficientFunds
                          ? 'text-indigo-900 dark:text-white'
                          : 'text-red-900 dark:text-white'
                      }`}>Balance After:</span>
                      <span className={`text-lg font-bold ${
                        sourceBalance.afterTransaction >= 0
                          ? 'text-indigo-700 dark:text-indigo-200'
                          : 'text-red-700 dark:text-red-200'
                      }`}>${sourceBalance.afterTransaction.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {sourceBalance.hasSufficientFunds && (
                  <div className="pt-2 border-t border-indigo-200 dark:border-indigo-700">
                    <p className="text-xs text-indigo-700 dark:text-indigo-200 mb-3 text-center">
                      Confirm transaction to proceed
                    </p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={handleCancel}
                        disabled={loading}
                        className="flex-1 bg-gray-500 hover:bg-gray-600"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        {loading ? 'Processing...' : 'Confirm & Execute'}
                      </Button>
                    </div>
                  </div>
                )}

                {!sourceBalance.hasSufficientFunds && (
                  <Button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    className="w-full bg-gray-500 hover:bg-gray-600 mt-2"
                  >
                    Cancel
          </Button>
                )}
              </div>
            </div>
          )}

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

