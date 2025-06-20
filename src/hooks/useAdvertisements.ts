import { useState, useEffect } from 'react';
import { apiService, Advertisement, CreateAdvertisementData } from '../lib/api';

export const useAdvertisements = () => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdvertisements = async () => {
    try {
      console.log('🔧 [DEBUG] Fetching advertisements...');
      setIsLoading(true);
      setError(null);
      const response = await apiService.getAllAdvertisements();
      
      if (response.success && response.data?.advertisements) {
        console.log('🔧 [DEBUG] Fetched advertisements:', response.data.advertisements.length);
        setAdvertisements(response.data.advertisements);
      } else {
        console.log('🔧 [DEBUG] No advertisements found');
        setAdvertisements([]);
      }
    } catch (err) {
      console.error('Error fetching advertisements:', err);
      setAdvertisements([]);
      setError(err instanceof Error ? err.message : 'Failed to fetch advertisements');
    } finally {
      setIsLoading(false);
    }
  };

  const createAdvertisement = async (adData: CreateAdvertisementData) => {
    try {
      const response = await apiService.createAdvertisement(adData);
      
      if (response.success && response.data?.advertisement) {
        setAdvertisements(prev => [response.data!.advertisement, ...prev]);
        return response.data.advertisement;
      }
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create advertisement');
    }
  };

  const getPendingCount = async () => {
    try {
      const response = await apiService.getPendingAdvertisements();
      return response.success && response.data?.advertisements ? response.data.advertisements.length : 0;
    } catch (err) {
      console.error('Error fetching pending count:', err);
      return 0;
    }
  };

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  return {
    advertisements,
    isLoading,
    error,
    refetch: fetchAdvertisements,
    createAdvertisement,
    getPendingCount,
  };
};

export const useMyAdvertisements = () => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyAdvertisements = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getMyAdvertisements();
      if (response.success && response.data?.advertisements) {
        setAdvertisements(response.data.advertisements);
      } else {
        setAdvertisements([]);
      }
    } catch (err) {
      console.error('Error fetching my advertisements:', err);
      setAdvertisements([]);
      setError(err instanceof Error ? err.message : 'Failed to fetch your advertisements');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyAdvertisements();
  }, []);

  return {
    advertisements,
    isLoading,
    error,
    refetch: fetchMyAdvertisements,
  };
}; 