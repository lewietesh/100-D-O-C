// src/hooks/useServices.ts
import { useState, useEffect } from 'react';
import { ServicesAPI, Service, ServiceResponse } from '@/lib/api/services';

export function useServices(params?: { 
  page?: number; 
  limit?: number; 
  category?: string; 
  featured?: boolean 
}) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await ServicesAPI.getServices(params);
        setServices(response.results);
        setTotalCount(response.count);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load services');
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [params?.page, params?.limit, params?.category, params?.featured]);

  const refetch = () => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await ServicesAPI.getServices(params);
        setServices(response.results);
        setTotalCount(response.count);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  };

  return {
    services,
    loading,
    error,
    totalCount,
    refetch
  };
}

export function useService(id: string) {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchService = async () => {
      try {
        setLoading(true);
        setError(null);
        const serviceData = await ServicesAPI.getService(id);
        setService(serviceData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load service');
        console.error('Error fetching service:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  return {
    service,
    loading,
    error
  };
}