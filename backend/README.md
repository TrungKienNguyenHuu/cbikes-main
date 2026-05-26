# CBikes Backend API

This is the backend API for the CBikes application, powered by Express.js and PostgreSQL.

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Database

Create a `.env` file in the backend folder with your PostgreSQL connection string:

```
DATABASE_URL=postgresql://username:password@localhost:5432/cbikes_db
PORT=5000
NODE_ENV=development
```

### 3. Create Database Schema

Before running the backend, create the `bikes` table in your PostgreSQL database:

```sql
CREATE TABLE bikes (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  link VARCHAR(500),
  image_url VARCHAR(500),
  category VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO bikes (id, name, price, link, image_url, category) VALUES
('cano_one', 'Cano One', 2850, 'https://amazon.com', 'im1-min.png', 'road'),
('predator', 'Predator', 1620, 'https://ebay.com', 'im12-min.png', 'bmx'),
('canyon', 'Canyon', 780, 'https://store.com', 'im2-min.png', 'mountain');
```

### 4. Build and Run

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode** (compiled):
```bash
npm run build
npm start
```

## API Endpoints

### Get All Bikes
```
GET /api/bikes
```

Response:
```json
[
  {
    "id": "cano_one",
    "name": "Cano One",
    "price": 2850,
    "link": "https://amazon.com",
    "image_url": "im1-min.png"
  }
]
```

### Get Bike by ID
```
GET /api/bikes/:id
```

Example: `GET /api/bikes/cano_one`

### Get Bikes by Category
```
GET /api/bikes/category/:category
```

Example: `GET /api/bikes/category/road`

### Health Check
```
GET /health
```

## Frontend Integration

To use this backend in your React app, update your API calls to fetch from this server:

```typescript
// Replace local data.ts imports with API calls
const response = await fetch('http://localhost:5000/api/bikes');
const bikes = await response.json();
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts      # PostgreSQL connection
│   ├── routes/
│   │   └── bikes.ts         # Bike API routes
│   ├── types/
│   │   └── index.ts         # TypeScript interfaces
│   └── index.ts             # Main server file
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
