const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

export async function subscribeToNewsletter(email: string): Promise<{ detail: string }> {
          const res = await fetch(`${API_BASE_URL}/api/v1/core/newsletter/subscribe/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
          });
          if (!res.ok) {
                    let data;
                    try {
                              data = await res.json();
                    } catch {
                              data = {};
                    }
                    throw new Error(data.detail || 'Subscription failed');
          }
          return res.json();
}
