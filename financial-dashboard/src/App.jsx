import { useState } from 'react';
import { CreateAccount } from '@/components/CreateAccount';
import { ViewAccount } from '@/components/ViewAccount';
import { ExecuteTransaction } from '@/components/ExecuteTransaction';

function App() {
  const [activeTab, setActiveTab] = useState('create');

  const tabs = [
    { id: 'create', label: 'Create Account' },
    { id: 'view', label: 'View Balance' },
    { id: 'transaction', label: 'Execute Transaction' },
  ];

  return (
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
        <div className="bg-white rounded-xl shadow-md p-2 animate-slide-up">
          <div className="flex flex-col sm:flex-row gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center px-3 sm:px-4 py-3 rounded-lg font-medium transition-all duration-300 cursor-pointer text-sm sm:text-base ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg sm:scale-105'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
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
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-8 animate-fade-in">
          <p className="bg-white px-4 py-2 rounded-full inline-block shadow-sm">
            API Server: http://localhost:8860
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
