// Export database connection
export { connectToDatabase, disconnectFromDatabase, isConnectedToDatabase, getDbClient } from './db/connection';

// Export database queries
export { fetchAllBikes, fetchBikeById, fetchBikesByCategory, fetchBikesByPriceRange, type BikeFromDB } from './db/queries';

// Export React hooks
export { useFetchAllBikes, useFetchBikeById, useFetchBikesByCategory } from './hooks/useDatabase';

// Export example component
export { BikesGridExample } from './components/BikesGridExample';
