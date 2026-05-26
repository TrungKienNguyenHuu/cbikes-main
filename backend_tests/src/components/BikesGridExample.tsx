import React from 'react';
import { useFetchAllBikes } from '../hooks/useDatabase';

/**
 * Example Component: Display all bikes from database
 * 
 * This component demonstrates how to fetch and display bikes
 * directly from PostgreSQL without using REST API
 */
export const BikesGridExample: React.FC = () => {
  const { bikes, loading, error } = useFetchAllBikes();

  if (loading) {
    return <div>Loading bikes from database...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div className="bikes-grid">
      <h1>Bikes from Database</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {bikes.map((bike) => (
          <div key={bike.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
            <img 
              src={bike.image_url} 
              alt={bike.name}
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }}
            />
            <h3>{bike.name}</h3>
            <p><strong>Price:</strong> ${bike.price}</p>
            <a href={bike.link} target="_blank" rel="noopener noreferrer">
              View Details
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BikesGridExample;
