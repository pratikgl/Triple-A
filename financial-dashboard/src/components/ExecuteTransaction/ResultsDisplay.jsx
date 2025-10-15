export function TransactionResultDisplay({ transactionResult }) {
  if (!transactionResult) return null;

  return (
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
  );
}

export function AccountBalancesDisplay({ accountBalances }) {
  if (!accountBalances) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-down">
      <AccountCard
        account={accountBalances.source}
        type="source"
        bgColor="bg-orange-100 dark:bg-orange-900"
        borderColor="border-orange-400 dark:border-orange-600"
        iconColor="text-orange-700 dark:text-orange-200"
        textColor="text-orange-800 dark:text-orange-100"
        boldColor="text-orange-900 dark:text-white"
        balanceColor="text-orange-700 dark:text-orange-200"
        label="Source Account"
        icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />}
      />

      <AccountCard
        account={accountBalances.destination}
        type="destination"
        bgColor="bg-teal-100 dark:bg-teal-900"
        borderColor="border-teal-400 dark:border-teal-600"
        iconColor="text-teal-700 dark:text-teal-200"
        textColor="text-teal-800 dark:text-teal-100"
        boldColor="text-teal-900 dark:text-white"
        balanceColor="text-teal-700 dark:text-teal-200"
        label="Destination Account"
        icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />}
      />
    </div>
  );
}

function AccountCard({ 
  account, 
  type, 
  bgColor, 
  borderColor, 
  iconColor, 
  textColor, 
  boldColor, 
  balanceColor, 
  label, 
  icon 
}) {
  return (
    <div className={`p-4 rounded-lg ${bgColor} border-2 ${borderColor} shadow-sm`}>
      <div className="flex items-center gap-2 mb-2">
        <svg className={`w-4 h-4 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {icon}
        </svg>
        <span className={`text-xs font-semibold ${boldColor} uppercase`}>{label}</span>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className={`text-xs font-medium ${textColor}`}>Account ID:</span>
          <span className={`text-sm font-bold ${boldColor}`}>{account.account_id}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className={`text-xs font-medium ${textColor}`}>Updated Balance:</span>
          <span className={`text-base font-bold ${balanceColor}`}>${account.balance}</span>
        </div>
      </div>
    </div>
  );
}

