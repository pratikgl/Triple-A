import { AutocompleteInput } from '@/components/ui/AutocompleteInput';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

export function AmountPresetButtons({ amount, setAmount, handleFormChange, disabled }) {
  const presets = [10, 50, 100, 500];

  return (
    <div className="flex items-center gap-2 pt-2">
      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium mr-1">Quick:</span>
      {presets.map((preset) => (
        <button
          key={preset}
          type="button"
          onClick={() => {
            setAmount(preset.toString());
            handleFormChange();
          }}
          disabled={disabled}
          className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
            amount === preset.toString()
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-sm'
          } ${
            disabled
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer hover:scale-105'
          }`}
        >
          ${preset}
        </button>
      ))}
    </div>
  );
}

export function TransactionFormInputs({ 
  sourceAccountId, 
  setSourceAccountId, 
  destinationAccountId, 
  setDestinationAccountId, 
  amount, 
  setAmount, 
  handleFormChange, 
  disabled,
  accountSuggestions 
}) {
  return (
    <>
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
          disabled={disabled}
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
          disabled={disabled}
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
            disabled={disabled}
          />
        </div>
        
        <AmountPresetButtons
          amount={amount}
          setAmount={setAmount}
          handleFormChange={handleFormChange}
          disabled={disabled}
        />
      </div>
    </>
  );
}

