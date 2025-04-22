'use client';

import { useState } from 'react';

interface GetInTouchProps {
  serviceId: string;
}

export default function GetInTouch({ serviceId }: GetInTouchProps) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate API call, include `serviceId` for backend association
    console.log('Submitting:', { ...form, serviceId });

    // Optional: Reset form
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Get in touch !</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name :"
          className="w-full p-3 border border-gray-300 rounded"
          required
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email :"
          className="w-full p-3 border border-gray-300 rounded"
          required
        />
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={5}
          placeholder="Message :"
          className="w-full p-3 border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded transition"
        >
          SEND MESSAGE
        </button>
      </form>
    </div>
  );
}
