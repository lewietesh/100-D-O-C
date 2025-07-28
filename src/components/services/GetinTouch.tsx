// src/components/services/GetInTouch.tsx
'use client';

import { useState } from 'react';
import { useData } from '@/app/context/DataContext';

interface GetInTouchProps {
  serviceId: string;
  serviceName: string;
}

export default function GetInTouch({ serviceId, serviceName }: GetInTouchProps) {
  const { createContact } = useData();  // Use the data context hook
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setStatus('submitting');
    
    try {
      // Use the createContact method from context
      createContact({
        name: form.name,
        email: form.email,
        subject: `Inquiry about ${serviceName}`,
        message: form.message,
        read: false
      });
      
      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '' });
      
      // Reset status after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
      
      // Reset status after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div id="contact-form" className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Get in touch</h3>
      <p className="text-sm text-gray-600 mb-4">
        Interested in our {serviceName} service? Send us a message and we'll get back to you shortly.
      </p>
      
      {status === 'success' ? (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded">
          Thank you for your inquiry! We'll contact you soon about the {serviceName} service.
        </div>
      ) : status === 'error' ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          There was an error submitting your inquiry. Please try again or contact us directly.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full p-3 border border-gray-300 rounded"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded"
            required
          />
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone (optional)"
            className="w-full p-3 border border-gray-300 rounded"
          />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            placeholder="Tell us about your project or requirements"
            className="w-full p-3 border border-gray-300 rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded transition"
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  );
}