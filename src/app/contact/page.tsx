// app/contact/page.tsx
'use client';


import { useState } from 'react';
import { EnvelopeIcon, PhoneIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useContact } from '@/hooks/useContact';


export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const { contact, loading, error } = useContact();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus('success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <>
      <main className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
                  {loading ? (
                    <p className="text-gray-500">Loading...</p>
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : contact ? (
                    <div className="space-y-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <EnvelopeIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-900">Email</h3>
                          <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                            {contact.email}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <PhoneIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-900">Phone</h3>
                          {contact.phone ? (
                            <a href={`tel:${contact.phone}`} className="text-gray-600 hover:text-blue-600">
                              {contact.phone}
                            </a>
                          ) : <span className="text-gray-400">Not provided</span>}
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <MapPinIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-900">Location</h3>
                          <p className="text-gray-600">{contact.location || 'Not provided'}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <ClockIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-900">Working Hours</h3>
                          <p className="text-gray-600">Monday - Friday: 9AM - 6PM</p>
                          <p className="text-gray-600">Saturday: 10AM - 2PM</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400">No contact info available.</p>
                  )}
                </div>
                
                {/* Social Media Links */}
                <div className="px-6 pb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Connect With Us</h3>
                  <div className="flex space-x-4">
                    {contact && contact.social_links && Object.entries(contact.social_links).map(([key, url]) => (
                      url ? (
                        <a
                          key={key}
                          href={url}
                          className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="sr-only">{key}</span>
                          {/* You can add platform-specific icons here if desired */}
                          <span className="font-bold text-lg">{key[0].toUpperCase()}</span>
                        </a>
                      ) : null
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Map Placeholder */}
              <div className="mt-6 bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                <div className="relative h-60">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255282.35853648147!2d36.70731465652196!3d-1.3031933983423102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d84d49a7%3A0xf7cf0254b297924c!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2sus!4v1696954495100!5m2!1sen!2sus" 
                    className="absolute inset-0 w-full h-full" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <div className="p-4 bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-900">Our Location</h3>
                  <p className="text-xs text-gray-600 mt-1">Nairobi, Kenya</p>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                
                {status === 'success' ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Thank You!</h3>
                    <p className="text-green-700">
                      Your message has been sent successfully. We'll get back to you as soon as possible.
                    </p>
                  </div>
                ) : status === 'error' ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
                    <p className="text-red-700">
                      There was a problem sending your message. Please try again or contact us directly via email.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Your Name *
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={form.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number (Optional)
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={form.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                          Subject *
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                          <option value="">Select a subject</option>
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Project Request">Project Request</option>
                          <option value="Support">Technical Support</option>
                          <option value="Partnership">Partnership Opportunity</option>
                          <option value="Feedback">Feedback</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        value={form.message}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="How can we help you?"
                      ></textarea>
                    </div>
                    
                    <div className="flex items-start">
                      <input
                        id="privacy"
                        name="privacy"
                        type="checkbox"
                        required
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                      />
                      <label htmlFor="privacy" className="ml-2 block text-sm text-gray-500">
                        I agree that my data will be stored and processed to answer my request in accordance with the privacy policy.
                      </label>
                    </div>
                    
                    <div>
                      <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75 disabled:cursor-not-allowed w-full sm:w-auto"
                      >
                        {status === 'submitting' ? 'Sending...' : 'Send Message'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}