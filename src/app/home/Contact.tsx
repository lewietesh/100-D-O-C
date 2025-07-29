'use client';

import { useState, useEffect } from 'react';
import PhoneInput from '@/components/PhoneInput';
  import { useToast } from '@/app/context/ToastContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

interface Country {
  name: string;
  cca2: string;
}

export default function Contact() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    phone: '',
    message: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

const { showToast } = useToast();

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then(res => res.json())
      .then((data) => {
        const list = data.map((c: any) => ({
          name: c.name.common as string,
          cca2: c.cca2 as string,
        })).sort((a: Country, b: Country) => a.name.localeCompare(b.name));
        setCountries(list);
        setFormData(prev => ({ ...prev, country: list[0]?.cca2 || '' }));
      })
      .catch(() => { });
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { firstName, lastName, email, message } = formData;
    if (!firstName || !lastName || !email || message.split(/\s+/).length < 6) {
      return 'Please fill all required fields. Message must be at least 6 words.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) return setError(validationError);
    setError(null);
    setLoading(true);


    const res = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        country: formData.country, // <- include this
        subject: 'Website Contact Form',
        agreed,
      }),

      headers: { 'Content-Type': 'application/json' },
    });

    setLoading(false);


    if (res.ok) {
      setSubmitted(true);
      setFormData({ firstName: '', lastName: '', email: '', country: countries[0]?.cca2 || '', phone: '', message: '' });
      setAgreed(false);
      showToast('Thank you for contacting us!', 'success');

    } else {
      setError('Submission error. Please try again.');
      showToast('Failed to send message.', 'error');
    }
  };

  return (
    <div className="w-full bg-alternate px-6 py-20 overflow-hidden">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-semibold text-primary">Get in Touch</h2>
        <p className="mt-2 text-lg text-primary">Reach out and we’ll get back to you shortly.</p>
      </div>
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-8 rounded-md shadow-md">
        {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
        {submitted && <div className="text-green-600 mb-4 text-center">Message sent successfully! ✅</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* FirstName */}
          <div>
            <label className="block text-sm font-medium text-gray-700">First name*</label>
            <input name="firstName" value={formData.firstName} onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-indigo-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last name*</label>
            <input name="lastName" value={formData.lastName} onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-indigo-600" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Email*</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-indigo-600" />
          </div>

          <div className="sm:col-span-2">
            <PhoneInput country={formData.country} phone={formData.phone} handleChange={handleChange} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Message*</label>
            <textarea name="message" rows={4} value={formData.message} onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-indigo-600" />
          </div>
          <div className="sm:col-span-2 my-5 flex items-center space-x-3">
            <input type="checkbox" checked={agreed} onChange={() => setAgreed(v => !v)}
              className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
            <span className="text-sm text-gray-600">
              I agree to the <a href="#" className="text-indigo-600 font-medium underline">privacy policy</a>.
            </span>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="block w-full rounded-md bg-cta px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : "Let's talk"}
        </button>

      </form>
    </div>
  );
}
