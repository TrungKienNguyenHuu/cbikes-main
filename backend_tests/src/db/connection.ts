import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

// Initialize PostgreSQL client
const client = new Client({
  connectionString: process.env.REACT_APP_DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

let isConnected = false;

// Connect to database
export const connectToDatabase = async () => {
  if (isConnected) return;
  
  try {
    await client.connect();
    isConnected = true;
    console.log('✓ Connected to PostgreSQL database');
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    throw error;
  }
};

// Disconnect from database
export const disconnectFromDatabase = async () => {
  if (!isConnected) return;
  
  try {
    await client.end();
    isConnected = false;
    console.log('✓ Disconnected from database');
  } catch (error) {
    console.error('Error disconnecting:', error);
  }
};

// Check connection status
export const isConnectedToDatabase = () => isConnected;

// Get client instance
export const getDbClient = () => client;
