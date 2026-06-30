# CBikes E-Commerce Platform

This repository contains the full stack for the CBikes store, including a React frontend, an Express.js backend, and a Python ETL web scraper for aggregating products from different vendors.

## Project Structure

- `/` (Root): React Frontend Application
- `/backend`: Node.js/Express Backend API
- `/crawler`: Python ETL pipeline to scrape, clean, and load bike data

---

## 1. Prerequisites

Make sure you have the following installed on your system:
- **Node.js** (v18 or higher recommended)
- **npm** (Node Package Manager)
- **Python** (v3.8 or higher)
- **PostgreSQL** database (Local or Cloud like Neon)

---

## 2. Setting Up the Backend

The backend is built with Node.js, Express, and PostgreSQL.

### Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

### Configuration
1. Create a `.env` file in the `backend` directory.
2. Add your database connection string and environment settings to the `.env` file:
   ```env
   # Set to production when deploying to ensure proper CORS and DB SSL validation
   NODE_ENV=development 
   DATABASE_URL=postgresql://your_db_user:your_password@your_db_host:5432/your_database?sslmode=require
   PORT=5001
   
   # Required in production to allow CORS requests from your deployed frontend
   FRONTEND_URL=https://your-frontend-domain.com
   ```
*(Note: During local development (`NODE_ENV !== "production"`), rate limits are relaxed and CORS is automatically bypassed so you won't be blocked while testing).*

### Running the Server
Start the backend server in development mode:
```bash
npm run dev
```
The API will be available at `http://localhost:5001`.

---

## 3. Setting Up the Frontend

The frontend is a React Single Page Application (SPA).

### Installation
1. Navigate to the root directory of the project:
   ```bash
   cd .. # from backend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

### Configuration
1. Create a `.env` file in the root directory.
2. Set the backend API URL for local development:
   ```env
   REACT_APP_API_URL=http://localhost:5001
   ```
*(Note: You do not need a `.env` file for Vercel/production deployment, as you will configure the environment variables directly in the Vercel dashboard.)*

### Running the App
Start the React development server:
```bash
npm start
```
The app will open automatically in your browser at `http://localhost:3000`.

---

## 4. Setting Up the Data Crawler (ETL Pipeline)

The python crawler scrapes bike data from several stores, cleans the data, and loads it into the PostgreSQL database.

### Installation
1. Navigate to the crawler directory:
   ```bash
   cd crawler
   ```
2. (Optional but recommended) Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

### Configuration
1. In the `crawler` directory, create a `.env` file (or copy the existing one in `Data_cleanning/.env`).
2. Add your database connection string:
   ```env
   DB_URL=postgresql://your_db_user:your_password@your_db_host:5432/your_database?sslmode=require
   ```

### Running the Crawler
1. **Extract**: Run the main crawler scripts located in `Main_Crawler/` to scrape the web data.
   ```bash
   cd Main_Crawler
   python run_all_crawlers.py
   ```
2. **Transform & Load**: Run the cleaning and database loading scripts in `Data_cleanning/`.
   ```bash
   cd ../Data_cleanning
   python load_to_db.py
   ```

---

## Deployment Notes

- **Frontend**: Can be easily deployed using platforms like Vercel or GitHub Pages (using `npm run deploy`).
- **Backend**: Can be deployed to services like Vercel (as Serverless Functions), Render, or Heroku. Make sure to define the `DATABASE_URL` and `FRONTEND_URL` environment variables on your hosting provider.
