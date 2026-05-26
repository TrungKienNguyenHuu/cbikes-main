import { getDbClient, connectToDatabase } from './connection';

export interface BikeFromDB {
  id: string;
  name: string;
  price: number;
  link: string;
  image_url: string;
}

// Fetch all bikes
export const fetchAllBikes = async (): Promise<BikeFromDB[]> => {
  try {
    await connectToDatabase();
    const client = getDbClient();
    
    const result = await client.query(
      'SELECT id, name, price, link, image_url FROM bikes ORDER BY id'
    );
    
    return result.rows as BikeFromDB[];
  } catch (error) {
    console.error('Error fetching bikes:', error);
    throw error;
  }
};

// Fetch bike by ID
export const fetchBikeById = async (id: string): Promise<BikeFromDB | null> => {
  try {
    await connectToDatabase();
    const client = getDbClient();
    
    const result = await client.query(
      'SELECT id, name, price, link, image_url FROM bikes WHERE id = $1',
      [id]
    );
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching bike:', error);
    throw error;
  }
};

// Fetch bikes by category
export const fetchBikesByCategory = async (category: string): Promise<BikeFromDB[]> => {
  try {
    await connectToDatabase();
    const client = getDbClient();
    
    const result = await client.query(
      'SELECT id, name, price, link, image_url FROM bikes WHERE category = $1 ORDER BY id',
      [category]
    );
    
    return result.rows as BikeFromDB[];
  } catch (error) {
    console.error('Error fetching bikes by category:', error);
    throw error;
  }
};

// Fetch bikes with price range
export const fetchBikesByPriceRange = async (minPrice: number, maxPrice: number): Promise<BikeFromDB[]> => {
  try {
    await connectToDatabase();
    const client = getDbClient();
    
    const result = await client.query(
      'SELECT id, name, price, link, image_url FROM bikes WHERE price >= $1 AND price <= $2 ORDER BY price',
      [minPrice, maxPrice]
    );
    
    return result.rows as BikeFromDB[];
  } catch (error) {
    console.error('Error fetching bikes by price range:', error);
    throw error;
  }
};
