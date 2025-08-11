'use client';

import { useState } from 'react';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending to newsletter
    setJoined(true);
    setEmail('');
  };

  return (
    <section className="mt-16 bg-gray-50 rounded-lg p-6 text-center">
      <h3 className="text-xl font-bold mb-2">Stay Inspired</h3>
      <p className="text-sm text-gray-600 mb-4">Get design tips and new projects in your inbox.</p>
      <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 justify-center">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="border border-gray-300 px-4 py-2 rounded w-full sm:max-w-sm"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Subscribe
        </button>
      </form>
      {joined && <p className="text-green-600 text-sm mt-2">You're subscribed!</p>}
    </section>
  );
};

export default NewsletterSignup;
