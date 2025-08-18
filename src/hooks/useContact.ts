import { useEffect, useState } from 'react';
import type { ContactInfo } from '@/types/contact';
import { getApiBaseUrl } from '@/utils/getApiBaseUrl';

export function useContact() {
          const [contact, setContact] = useState<ContactInfo | null>(null);
          const [loading, setLoading] = useState(true);
          const [error, setError] = useState<string | null>(null);

          useEffect(() => {
                    setLoading(true);
                    fetch(getApiBaseUrl() + '/api/v1/core/contact-info/?limit=1')
                              .then(async (res) => {
                                        if (!res.ok) throw new Error('Failed to fetch contact info');
                                        const data = await res.json();
                                        // If using DRF list endpoint, get first result
                                        setContact(Array.isArray(data.results) ? data.results[0] : data);
                              })
                              .catch((err) => setError(err.message))
                              .finally(() => setLoading(false));
          }, []);

          return { contact, loading, error };
}
