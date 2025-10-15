import { Button } from '@/components/ui/Button';

export function BalanceCheckDisplay({ sourceBalance, amount, loading, handleCancel }) {
  if (!sourceBalance) return null;

  return (
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

        <BalanceDetails sourceBalance={sourceBalance} amount={amount} />

        {sourceBalance.hasSufficientFunds ? (
          <ConfirmationButtons loading={loading} handleCancel={handleCancel} />
        ) : (
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
  );
}

function BalanceDetails({ sourceBalance, amount }) {
  return (
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
  );
}

function ConfirmationButtons({ loading, handleCancel }) {
  return (
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
  );
}

