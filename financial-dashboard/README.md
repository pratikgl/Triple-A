# Financial Account Dashboard

A React-based financial account management dashboard for creating accounts, checking balances, and executing transactions.

## Features

This dashboard includes enhanced features beyond basic API integration:

- ✅ **Balance Verification** - Check balances before executing transactions
- ✅ **Transaction History** - Complete audit trail with filtering
- ✅ **Account Manager** - Centralized account management
- ✅ **Smart Autocomplete** - Account ID suggestions
- ✅ **Toast Notifications** - Real-time feedback
- ✅ **Amount Presets** - Quick-select buttons ($10, $50, $100, $500)

All features use browser localStorage for data persistence - no additional backend required.

📖 **[View detailed features documentation →](./FEATURES.md)**

## Tech Stack

- React 19 + Vite
- Tailwind CSS + shadcn/ui
- Axios for API calls
- Browser localStorage for persistence

## Setup Instructions

### Prerequisites
- Node.js v16+
- npm or yarn
- API server running on `http://localhost:8860`

### Installation

1. Clone and navigate to the project:
```bash
git clone git@github.com:pratikgl/Triple-A.git
cd Triple-A/financial-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

## Project Structure

```
financial-dashboard/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Toast.jsx            # Toast notifications
│   │   │   └── AutocompleteInput.jsx # Smart autocomplete
│   │   ├── CreateAccount.jsx
│   │   ├── ViewAccount.jsx
│   │   ├── ExecuteTransaction.jsx
│   │   ├── AccountManager.jsx        # Account management
│   │   └── TransactionHistory.jsx    # Transaction timeline
│   ├── services/           # API integration
│   │   └── api.js
│   ├── lib/                # Utilities
│   │   ├── utils.js
│   │   └── storage.js      # localStorage wrapper
│   ├── App.jsx
│   └── main.jsx
├── FEATURES.md             # Detailed features documentation
└── package.json
```

## API Endpoints

The application expects these endpoints on `http://localhost:8860`:

**POST /accounts** - Create account
```json
{
  "account_id": 123,
  "initial_balance": "100.23344"
}
```

**GET /accounts/{account_id}** - Get account balance
```json
{
  "account_id": 123,
  "balance": "100.23344"
}
```

**POST /transactions** - Execute transaction
```json
{
  "source_account_id": 123,
  "destination_account_id": 456,
  "amount": "100.12345"
}
```

## Technical Choices

**Architecture**
- Component-based structure with separation of concerns
- UI components isolated in `components/ui/` (shadcn/ui pattern)
- Centralized API client in `services/api.js`
- Local state management using React hooks (no Redux needed for this scope)

**Styling**
- Tailwind CSS for rapid development and consistent design
- shadcn/ui for accessible, high-quality components
- Custom animations for better UX

**Build Tool**
- Vite for fast development server and optimized builds

**Validation & Error Handling**
- Client-side validation for immediate feedback (account IDs must be integers, amounts positive)
- Comprehensive error handling with user-friendly messages
- Loading states to prevent duplicate submissions

## Assumptions

1. API server runs on `http://localhost:8860` with CORS enabled for `http://localhost:5173`
2. Balances and amounts are strings (preserves decimal precision)
3. Account IDs are integers
4. Concurrency and race conditions handled by API
5. No authentication required
6. API returns structured error responses with appropriate HTTP status codes

## Configuration

To change the API URL, edit `src/services/api.js`:
```javascript
const API_BASE_URL = import.meta.env.DEV ? '/api' : 'http://your-api-url:port';
```

Or use environment variables:
```bash
# .env
VITE_API_URL=https://your-api.com
```

## Troubleshooting

**"Network error: Unable to reach the server"**
- Verify API server is running on `http://localhost:8860`
- Check CORS is configured correctly

**Build fails**
```bash
rm -rf node_modules package-lock.json
npm install
```
