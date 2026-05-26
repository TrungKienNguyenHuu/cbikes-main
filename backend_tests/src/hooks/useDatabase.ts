import React, { useEffect, useState } from 'react';
import { fetchAllBikes, fetchBikeById, fetchBikesByCategory, BikeFromDB } from '../db/queries';

// Hook to fetch all bikes
export const useFetchAllBikes = () => {
  const [bikes, setBikes] = useState<BikeFromDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBikes = async () => {
      try {
        setLoading(true);
        const data = await fetchAllBikes();
        setBikes(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch bikes');
        console.error('Error loading bikes:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBikes();
  }, []);

  return { bikes, loading, error };
};

// Hook to fetch single bike
export const useFetchBikeById = (id: string) => {
  const [bike, setBike] = useState<BikeFromDB | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBike = async () => {
      try {
        setLoading(true);
        const data = await fetchBikeById(id);
        setBike(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch bike');
        console.error('Error loading bike:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadBike();
    }
  }, [id]);

  return { bike, loading, error };
};

// Hook to fetch bikes by category
export const useFetchBikesByCategory = (category: string) => {
  const [bikes, setBikes] = useState<BikeFromDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBikes = async () => {
      try {
        setLoading(true);
        const data = await fetchBikesByCategory(category);
        setBikes(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch bikes');
        console.error('Error loading bikes:', err);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      loadBikes();
    }
  }, [category]);

  return { bikes, loading, error };
};
