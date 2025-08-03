'use client';

import { useState } from 'react';
import { useNewsletter } from '@/hooks/useNewsletter';
import { useToast } from '@/app/context/ToastContext';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const { isLoading, error, success, subscribe, reset } = useNewsletter();
  const { showToast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    try {
      await subscribe({
        email: email.trim(),
        name: name.trim() || undefined,
        source: 'website'
      });

      // Success handled by useNewsletter hook
      showToast('Successfully subscribed to newsletter!', 'success');
      setEmail('');
      setName('');
    } catch (error) {
      // Error handled by useNewsletter hook, but also show toast
      showToast('Failed to subscribe. Please try again.', 'error');
    }
  };

  return (
    <section className="mt-16 bg-gray-50 rounded-lg p-6 text-center">
      <h3 className="text-xl font-bold mb-2">Stay Inspired</h3>
      <p className="text-sm text-gray-600 mb-4">Get design tips and new projects in your inbox.</p>

      <form onSubmit={handleSubscribe} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            className="border border-gray-300 px-4 py-2 rounded w-full sm:max-w-sm"
            disabled={isLoading}
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) reset(); // Clear error when user starts typing
            }}
            placeholder="Enter your email"
            className={`border px-4 py-2 rounded w-full sm:max-w-sm ${error ? 'border-red-500' : 'border-gray-300'
              }`}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className={`px-4 py-2 rounded text-white font-medium ${isLoading || !email.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {isLoading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>

        {error && (
          <p className="text-red-600 text-sm mt-2">{error}</p>
        )}

        {success && (
          <p className="text-green-600 text-sm mt-2">
            You're subscribed! Check your email for confirmation.
          </p>
        )}
      </form>
    </section>
  );
};

export default NewsletterSignup;
