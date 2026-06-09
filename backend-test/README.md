# Test Backend for CBikes

This is a test backend API for the CBikes application with a PostgreSQL database containing product and product listing information.

## Features

- Product management with listings from multiple sources
- PostgreSQL database with normalized schema
- RESTful API endpoints
- Database seeding with sample data
- TypeScript support

## Setup

### Installation

```bash
cd backend-test
npm install
```

### Environment Configuration

Create a `.env` file based on `.env.example`:

```env
PORT=5001
DATABASE_URL=postgresql://user:password@localhost:5432/cbikes_test_db
NODE_ENV=development
```

### Database Setup

Make sure PostgreSQL is running and create the test database:

```bash
psql -U postgres
CREATE DATABASE cbikes_test_db;
```

### Seeding Test Data

Run the seed script to populate the database with sample products and listings:

```bash
npm run seed
```

## Running the Server

### Development

```bash
npm run dev
```

The server will start on `http://localhost:5001`

### Production Build

```bash
npm run build
npm start
```

## API Endpoints

### Health Check
- **GET** `/health` - Check server and database connection status

### Products
- **GET** `/api/products` - Get all products with their listings
- **GET** `/api/products/:productId` - Get a specific product with its listings

### Listings
- **GET** `/api/listings` - Get all product listings
- **GET** `/api/listings/product/:productId` - Get listings for a specific product

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

## Sample Data

The seed script creates 5 sample products with 3-5 listings each from different sources (Phoxedien, WheelHub, RideZone, BikeHub, CycleMart) with realistic pricing in Vietnamese Dong (VND).
