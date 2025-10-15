import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { transactionsApi, accountsApi } from '@/services/api';
import { storageApi } from '@/lib/storage';
import { useToast } from '@/components/ui/Toast';
import { TransactionFormInputs } from './TransactionForm';
import { BalanceCheckDisplay } from './BalanceDisplay';
import { TransactionResultDisplay, AccountBalancesDisplay } from './ResultsDisplay';

export function ExecuteTransaction() {
  const [sourceAccountId, setSourceAccountId] = useState('');
  const [destinationAccountId, setDestinationAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [accountSuggestions, setAccountSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkingBalance, setCheckingBalance] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [sourceBalance, setSourceBalance] = useState(null);
  const [transactionResult, setTransactionResult] = useState(null);
  const [accountBalances, setAccountBalances] = useState(null);
  
  const toast = useToast();

  useEffect(() => {
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
          <TransactionFormInputs
            sourceAccountId={sourceAccountId}
            setSourceAccountId={setSourceAccountId}
            destinationAccountId={destinationAccountId}
            setDestinationAccountId={setDestinationAccountId}
            amount={amount}
            setAmount={setAmount}
            handleFormChange={handleFormChange}
            disabled={loading || checkingBalance}
            accountSuggestions={accountSuggestions}
          />

          {/* Balance Check Button */}
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
          {showConfirmation && (
            <BalanceCheckDisplay
              sourceBalance={sourceBalance}
              amount={amount}
              loading={loading}
              handleCancel={handleCancel}
            />
          )}

          {/* Transaction Results */}
          {transactionResult && (
            <div className="space-y-4">
              <TransactionResultDisplay transactionResult={transactionResult} />
              <AccountBalancesDisplay accountBalances={accountBalances} />
            </div>
          )}

          {/* Error Message */}
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

