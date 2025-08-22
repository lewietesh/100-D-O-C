import { useState } from 'react';
import { subscribeToNewsletter } from '../services/api/newsletter';

export function useNewsletter() {
          const [loading, setLoading] = useState(false);
          const [error, setError] = useState<string | null>(null);
          const [success, setSuccess] = useState<string | null>(null);

          const subscribe = async (email: string) => {
                    setLoading(true);
                    setError(null);
                    setSuccess(null);
                    try {
                              const res = await subscribeToNewsletter(email);
                              setSuccess(res.detail);
                    } catch (err: any) {
                              setError(err.message || 'Subscription failed');
                    } finally {
                              setLoading(false);
                    }
          };

          return { subscribe, loading, error, success };
}
