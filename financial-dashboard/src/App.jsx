import { useState } from 'react';
import { CreateAccount } from '@/components/CreateAccount';
import { ViewAccount } from '@/components/ViewAccount';
import { ExecuteTransaction } from '@/components/ExecuteTransaction';
import { AccountManager } from '@/components/AccountManager';
import { TransactionHistory } from '@/components/TransactionHistory';
import { ToastProvider } from '@/components/ui/Toast';

function App() {
  const [activeTab, setActiveTab] = useState('create');

  const tabs = [
    { 
      id: 'create', 
      label: 'Create Account',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
    { 
      id: 'view', 
      label: 'View Balance',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    },
    { 
      id: 'transaction', 
      label: 'Execute Transaction',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      )
    },
    { 
      id: 'accounts', 
      label: 'My Accounts',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    { 
      id: 'history', 
      label: 'History',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  ];

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-5xl font-bold text-gray-900 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Financial Account Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Manage accounts and execute transactions
            </p>
          </div>

        {/* Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg shadow-gray-200/50 p-3 animate-slide-up border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 cursor-pointer text-sm ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:scale-[1.01]'
                }`}
              >
                <span className={`transition-transform duration-300 ${
                  activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'
                }`}>
                  {tab.icon}
                </span>
                <span className="truncate">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area with Animation */}
        <div className="animate-fade-in">
          {activeTab === 'create' && (
            <div className="animate-slide-up">
              <CreateAccount />
            </div>
          )}
          {activeTab === 'view' && (
            <div className="animate-slide-up">
              <ViewAccount />
            </div>
          )}
          {activeTab === 'transaction' && (
            <div className="animate-slide-up">
              <ExecuteTransaction />
            </div>
          )}
          {activeTab === 'accounts' && (
            <div className="animate-slide-up">
              <AccountManager />
            </div>
          )}
          {activeTab === 'history' && (
            <div className="animate-slide-up">
              <TransactionHistory />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-8 animate-fade-in">
          <p className="bg-white/80 backdrop-blur-md px-6 py-2.5 rounded-full inline-flex items-center gap-2 shadow-md border border-gray-100">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            API Server: http://localhost:8860
          </p>
        </div>
        </div>
      </div>
    </ToastProvider>
  );
}

export default App;
