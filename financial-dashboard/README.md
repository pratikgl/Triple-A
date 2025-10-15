# Financial Account Dashboard

A simple and elegant financial account transfer dashboard built with React, Vite, Tailwind CSS, and shadcn/ui components.

## Features

- **Create Account**: Create new financial accounts with initial balances
- **View Account Balance**: Check the balance of existing accounts
- **Execute Transaction**: Transfer funds between accounts
- **Form Validation**: All forms include validation for required fields and numeric values
- **Loading States**: Buttons are disabled during API calls to prevent duplicate submissions
- **Error Handling**: Clear error messages for failed operations
- **Responsive Design**: Clean, centered layout that works on all screen sizes

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful UI components built with Radix UI and Tailwind
- **Axios** - HTTP client for API calls
- **Lucide React** - Icon library

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on `http://localhost:8860`

## Installation

1. Clone or navigate to the project directory:
```bash
cd financial-dashboard
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

1. Make sure the backend server is running on `http://localhost:8860`

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:5173
```

## Building for Production

To create a production build:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

## Project Structure

```
financial-dashboard/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   └── Label.jsx
│   │   ├── CreateAccount.jsx
│   │   ├── ViewAccount.jsx
│   │   └── ExecuteTransaction.jsx
│   ├── lib/
│   │   └── utils.js         # Utility functions
│   ├── services/
│   │   └── api.js           # API client
│   ├── App.jsx              # Main application component
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles with Tailwind directives
├── public/                  # Static assets
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## API Endpoints

The application connects to the following backend endpoints:

### Create Account
- **POST** `/accounts`
- Request body:
  ```json
  {
    "account_id": 123,
    "initial_balance": "100.23344"
  }
  ```

### Get Account Balance
- **GET** `/accounts/{account_id}`
- Response:
  ```json
  {
    "account_id": 123,
    "balance": "100.23344"
  }
  ```

### Execute Transaction
- **POST** `/transactions`
- Request body:
  ```json
  {
    "source_account_id": 123,
    "destination_account_id": 456,
    "amount": "100.12345"
  }
  ```

## Form Validation

All forms include validation for:
- Required fields
- Numeric values (integers for account IDs, positive numbers for amounts)
- Business logic (e.g., source and destination accounts must be different)

## Customization

### Changing the Backend URL

Edit `src/services/api.js` and update the `API_BASE_URL` constant:
```javascript
const API_BASE_URL = 'http://your-backend-url:port';
```

### Styling

The application uses Tailwind CSS for styling. You can customize:
- Colors and theme in `tailwind.config.js`
- Global styles in `src/index.css`
- Component-specific styles inline with Tailwind classes

## Troubleshooting

### Backend Connection Issues

If you see connection errors:
1. Verify the backend is running on `http://localhost:8860`
2. Check for CORS configuration on the backend
3. Ensure the backend endpoints match the API specification

### Build Issues

If you encounter build errors:
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Clear Vite cache: `rm -rf node_modules/.vite`

## License

MIT
