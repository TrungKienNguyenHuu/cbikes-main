# SETUP GUIDE: Direct Database Connection

This guide shows how to set up direct PostgreSQL connection from your React frontend.

## Step 1: Install Dependencies

```bash
# In your project root
npm install pg
```

## Step 2: Environment Configuration

Create `.env` in project root:

```env
REACT_APP_DATABASE_URL=postgresql://user:password@localhost:5432/cbikes_db
```

## Step 3: Copy backend_tests files to src

Option A: Copy directly to src:
```bash
cp -r backend_tests/src/* src/
```

Option B: Import from backend_tests:
```typescript
import { useFetchAllBikes } from './backend_tests/src/hooks/useDatabase';
```

## Step 4: Use in Your Components

### Example 1: BikesGrid Component

```typescript
// src/components/bikesGrid/BikesGrid.tsx
import React from 'react';
import { useFetchAllBikes } from '../../backend_tests/src/hooks/useDatabase';

export const BikesGrid: React.FC = () => {
  const { bikes, loading, error } = useFetchAllBikes();

  if (loading) return <div>Loading from database...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bikes-grid">
      {bikes.map((bike) => (
        <div key={bike.id}>
          <h3>{bike.name}</h3>
          <p>${bike.price}</p>
          <img src={bike.image_url} alt={bike.name} />
          <a href={bike.link}>View</a>
        </div>
      ))}
    </div>
  );
};
```

### Example 2: Filter Component

```typescript
// src/components/filter/Filter.tsx
import React, { useState } from 'react';
import { useFetchBikesByCategory } from '../../backend_tests/src/hooks/useDatabase';

export const Filter: React.FC<{ onSelect: (category: string) => void }> = ({ onSelect }) => {
  const [selected, setSelected] = useState('');
  const { bikes } = useFetchBikesByCategory(selected);

  return (
    <div>
      <button onClick={() => {
        setSelected('road');
        onSelect('road');
      }}>
        Road Bikes ({bikes.length})
      </button>
    </div>
  );
};
```

### Example 3: Price Filter

```typescript
// src/components/priceControl/PriceControl.tsx
import React, { useState } from 'react';
import { fetchBikesByPriceRange } from '../../backend_tests/src/db/queries';

export const PriceControl: React.FC = () => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [bikes, setBikes] = useState([]);

  const handlePriceChange = async () => {
    const filtered = await fetchBikesByPriceRange(minPrice, maxPrice);
    setBikes(filtered);
  };

  return (
    <div>
      <input 
        type="range" 
        min="0" 
        max="5000" 
        value={minPrice}
        onChange={(e) => setMinPrice(Number(e.target.value))}
      />
      <input 
        type="range" 
        min="0" 
        max="5000" 
        value={maxPrice}
        onChange={(e) => setMaxPrice(Number(e.target.value))}
      />
      <button onClick={handlePriceChange}>Filter</button>
    </div>
  );
};
```

## Step 5: Update App.tsx

```typescript
// src/App.tsx
import React from 'react';
import { BikesGrid } from './components/bikesGrid/BikesGrid';
import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <h1>CBikes - Direct Database</h1>
      </header>
      <main>
        <BikesGrid />
      </main>
    </div>
  );
}

export default App;
```

## Step 6: Run Your App

```bash
npm start
```

## Database Schema Required

Make sure your PostgreSQL database has this table:

```sql
CREATE TABLE bikes (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  link VARCHAR(500),
  image_url VARCHAR(500),
  category VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data
INSERT INTO bikes (id, name, price, link, image_url, category) VALUES
('cano_one', 'Cano One', 2850, 'https://amazon.com', 'im1-min.png', 'road'),
('predator', 'Predator', 1620, 'https://ebay.com', 'im12-min.png', 'bmx');
```

## Troubleshooting

### Issue: "pg" module not found
```bash
npm install pg
npm install --save-dev @types/pg  # For TypeScript
```

### Issue: Connection timeout
- Check if PostgreSQL is running
- Verify DATABASE_URL is correct
- Check firewall settings

### Issue: CORS/Browser errors
- This is expected with direct connections
- May need Vite/Webpack configuration
- Consider using the REST API instead

### Issue: "Operation timed out"
- Database connection limit reached
- Close unused connections: `disconnectFromDatabase()`

## API Comparison

| Feature | Direct DB | REST API |
|---------|-----------|----------|
| Security | ❌ Risky | ✅ Secure |
| Performance | ⚠️ Okay | ✅ Better |
| Complexity | ✅ Simple | ⚠️ Medium |
| Production Ready | ❌ No | ✅ Yes |
| Browser Support | ⚠️ Limited | ✅ Full |

## Recommendation

For **testing/development**: Use this direct connection

For **production**: Use the REST API in the `backend/` folder

## Next Steps

1. Test with one component first
2. Replace `data.ts` imports gradually
3. When deploying, switch to REST API approach
