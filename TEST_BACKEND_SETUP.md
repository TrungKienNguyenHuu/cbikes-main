# Test Backend Setup Guide

## Overview

This guide walks you through setting up the second test backend with real database and connecting it to the frontend.

## Backend Setup

### 1. Install Test Backend Dependencies

```bash
cd backend-test
npm install
```

### 2. Configure Environment

Create a `.env` file in the `backend-test` directory (copy from `.env.example`):

```env
PORT=5001
DATABASE_URL=postgresql://user:password@localhost:5432/cbikes_test_db
NODE_ENV=development
```

**Important:** Make sure you have PostgreSQL running and create the test database:

```bash
# Using psql
psql -U postgres -c "CREATE DATABASE cbikes_test_db;"
```

### 3. Seed Test Data

Run the seed script to populate the database with sample products and listings:

```bash
npm run seed
```

This will create:
- 5 sample products (VinFast Klara S, Yaeda E-Bike Pro, Kazuki Electric Cruiser, VinFast Theon, Yaeda City Commuter)
- 3-5 listings per product from different sources (Phoxedien, WheelHub, RideZone, BikeHub, CycleMart)
- Realistic pricing in Vietnamese Dong (VND)

### 4. Start the Test Backend

```bash
npm run dev
```

Server runs on: `http://localhost:5001`

## Frontend Setup

### 1. Update Environment Variables

The frontend `.env` file has been updated with:

```env
REACT_APP_TEST_BACKEND_URL=http://localhost:5001
```

This allows the frontend to communicate with the test backend.

### 2. New Components and Services Created

#### Services
- **[src/services/productService.ts](src/services/productService.ts)** - Service for fetching products from test backend
  - `fetchProductsFromTestBackend()` - Fetch all products with listings
  - `fetchProductByIdFromTestBackend()` - Fetch single product with listings
  - `formatVNDPrice()` - Format Vietnamese Dong prices

#### Components
- **[src/components/header/ProductDetail_copy.tsx](src/components/header/ProductDetail_copy.tsx)** - Product details page using real database data
  - Displays product information from test backend
  - Shows all available listings with prices
  - Real-time price filtering
  - Source information for each listing
  
- **[src/components/header/FavoritesDropdown_copy.tsx](src/components/header/FavoritesDropdown_copy.tsx)** - Favorites dropdown for test backend
  - Routes to test product details page
  - Maintains same UI as original

### 3. Routing

New route added to [src/App.tsx](src/App.tsx):

- **`/test/product/:productId`** - Product details page with real data from test backend
  - Access example: `http://localhost:3000/cbikes/test/product/{product-id}`

## Testing the Setup

### 1. Start Both Servers

Terminal 1 (Frontend):
```bash
npm start
```

Terminal 2 (Test Backend):
```bash
cd backend-test
npm run dev
```

### 2. Test the API

Test backend health check:
```bash
curl http://localhost:5001/health
```

Fetch all products:
```bash
curl http://localhost:5001/api/products
```

Fetch specific product (replace with actual product_id):
```bash
curl http://localhost:5001/api/products/{product-id}
```

### 3. Test in Frontend

1. Open `http://localhost:3000/cbikes`
2. Click on any product image to go to the main product details page (fake data)
3. Go to `http://localhost:3000/cbikes/test/product/{product-id}` to see the test backend version with real database data

## Database Schema

### Products Table
```sql
CREATE TABLE products (
  product_id UUID PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  brand VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Product Listings Table
```sql
CREATE TABLE product_listings (
  listing_id UUID PRIMARY KEY,
  product_id UUID REFERENCES products(product_id) ON DELETE CASCADE,
  source_name VARCHAR(50) NOT NULL,
  listing_title TEXT NOT NULL,
  price INTEGER NOT NULL,
  currency VARCHAR(10) DEFAULT 'VND',
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(product_id, source_name, listing_title)
);
```

## API Endpoints

### Health Check
- `GET /health` - Check server and database connection

### Products
- `GET /api/products` - Get all products with listings
- `GET /api/products/:productId` - Get specific product with listings

### Listings
- `GET /api/listings` - Get all listings
- `GET /api/listings/product/:productId` - Get listings for specific product

## File Structure

```
backend-test/
├── src/
│   ├── config/
│   │   ├── database.ts         # Database connection
│   │   └── initDB.ts           # Database initialization
│   ├── routes/
│   │   ├── products.ts         # Product endpoints
│   │   └── listings.ts         # Listing endpoints
│   ├── seed/
│   │   └── seedData.ts         # Test data seed script
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   └── index.ts                # Main server file
├── .env.example                # Environment template
├── package.json
├── tsconfig.json
└── README.md

src/ (Frontend)
├── services/
│   └── productService.ts       # Test backend service
├── components/
│   └── header/
│       ├── ProductDetail_copy.tsx       # Real data product page
│       └── FavoritesDropdown_copy.tsx   # Test backend favorites
└── App.tsx                     # Updated with new route
```

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Verify database `cbikes_test_db` exists

### Cannot Fetch Products
- Check if test backend is running on port 5001
- Verify `REACT_APP_TEST_BACKEND_URL` in frontend `.env`
- Check browser console for CORS errors

### Port Already in Use
- Backend: `npm run dev -- --port 5002`
- Or kill existing process on the port

### No Test Data
- Run `npm run seed` from `backend-test` directory
- Check database tables with: `psql cbikes_test_db -c "SELECT * FROM products;"`

## Next Steps

1. Replace placeholder image display in ProductDetail_copy with real images
2. Add more test data for better testing
3. Implement actual links for listing URLs
4. Add filtering and sorting for listings by price
5. Create comparison feature for listings from different sources
