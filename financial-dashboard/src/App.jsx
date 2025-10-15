import { CreateAccount } from '@/components/CreateAccount';
import { ViewAccount } from '@/components/ViewAccount';
import { ExecuteTransaction } from '@/components/ExecuteTransaction';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Financial Account Dashboard
          </h1>
          <p className="text-gray-600">
            Manage accounts and execute transactions
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="space-y-6">
          <CreateAccount />
          <ViewAccount />
          <ExecuteTransaction />
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>Backend running on http://localhost:8860</p>
        </div>
      </div>
    </div>
  );
}

export default App;
