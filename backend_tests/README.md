# Backend Tests - Direct Database Connection

This folder contains code to connect your React frontend **directly to PostgreSQL** without using a REST API. This is useful for:
- Development and testing
- Quick prototyping
- Understanding direct DB connections
- Learning purposes

⚠️ **Warning**: This approach is NOT recommended for production. Direct database exposure can be a security risk.

## Setup Instructions

### 1. Install Dependencies

In the main project root, install the `pg` package:

```bash
npm install pg
# or if using this folder independently
cd backend_tests
npm install pg
```

### 2. Configure Environment Variables

Create a `.env` file in your project root:

```
REACT_APP_DATABASE_URL=postgresql://username:password@localhost:5432/cbikes_db
```

**In production (if you must use this):**
```
REACT_APP_DATABASE_URL=postgresql://username:password@your-db-host.com:5432/cbikes_db?sslmode=require
```

### 3. Update React App Configuration

If using Create React App, you may need to install additional dependencies:

```bash
npm install pg browserify-zlib stream-browserify util
```

If using **Webpack**, add to `webpack.config.js`:
```javascript
module: {
  rules: [
    // ... existing rules
  ]
},
node: {
  fs: 'empty',
  path: 'empty',
  util: true,
  stream: true,
  zlib: true
}
```

### 4. Use in Your Components

**Option A: Using the Custom Hook**

```typescript
import { useFetchAllBikes } from './backend_tests/src/hooks/useDatabase';

const MyComponent = () => {
  const { bikes, loading, error } = useFetchAllBikes();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {bikes.map(bike => (
        <li key={bike.id}>{bike.name} - ${bike.price}</li>
      ))}
    </ul>
  );
};
```

**Option B: Direct Query**

```typescript
import { fetchAllBikes } from './backend_tests/src/db/queries';

const loadBikes = async () => {
  const bikes = await fetchAllBikes();
  console.log(bikes);
};
```

## Available Functions

### From `backend_tests/src/db/queries.ts`:

- `fetchAllBikes()` - Get all bikes
- `fetchBikeById(id)` - Get bike by ID
- `fetchBikesByCategory(category)` - Get bikes by category
- `fetchBikesByPriceRange(min, max)` - Get bikes within price range

### From `backend_tests/src/hooks/useDatabase.ts`:

- `useFetchAllBikes()` - Hook for all bikes
- `useFetchBikeById(id)` - Hook for single bike
- `useFetchBikesByCategory(category)` - Hook for category bikes

## File Structure

```
backend_tests/
├── src/
│   ├── db/
│   │   ├── connection.ts        # PostgreSQL connection
│   │   └── queries.ts           # Database queries
│   ├── hooks/
│   │   └── useDatabase.ts       # React hooks for data fetching
│   ├── components/
│   │   └── BikesGridExample.tsx # Example component
│   └── index.ts                 # Main exports
├── package.json
└── README.md
```

## Example Usage in Your App

Replace this:
```typescript
import { bikesList } from "./data";

const App = () => {
  return <BikesGrid bikes={bikesList} />;
};
```

With this:
```typescript
import { BikesGridExample } from "./backend_tests/src/components/BikesGridExample";

const App = () => {
  return <BikesGridExample />;
};
```

## Important Notes

### ✅ Advantages:
- No API server needed
- Direct database access
- Good for testing/prototyping
- Simpler setup

### ⚠️ Disadvantages:
- **Security Risk**: Database credentials exposed in frontend code
- **Performance**: Connection pooling not ideal for frontend
- **Scalability**: Not suitable for production
- **CORS Issues**: May have browser restrictions
- **Data Validation**: No server-side validation
- **Connection Limit**: Database has connection limits

## Troubleshooting

### Error: "Cannot find module 'pg'"
```bash
npm install pg
```

### Error: "Client is not defined"
Make sure `connectToDatabase()` is called before queries:
```typescript
import { connectToDatabase, fetchAllBikes } from './backend_tests/src/db/queries';

await connectToDatabase();
const bikes = await fetchAllBikes();
```

### Error: "Connection string undefined"
Check that `.env` file exists and has `REACT_APP_DATABASE_URL` variable.

### SSL Certificate Error
Add to `.env`:
```
NODE_TLS_REJECT_UNAUTHORIZED=0
```

## For Production: Use REST API Instead

When deploying to production, use the `backend/` folder with the REST API:

```bash
# Backend folder
cd backend
npm install
npm run build
npm start
```

This keeps your database credentials secure on the server!

## Learn More

- PostgreSQL Node.js: https://node-postgres.com/
- React Hooks: https://react.dev/reference/react
