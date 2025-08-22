'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
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
        country: formData.country,
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
    <div className="w-full bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-600/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-emerald-400/20 to-blue-600/20 blur-3xl"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Mail className="w-4 h-4" />
            Contact Me
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Let's Work Together
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Have a project in mind or want to discuss how technology can solve your challenges? 
            I'd love to hear from you.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
                  <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Email</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Drop me a line anytime</p>
                </div>
              </div>
              <p className="text-gray-800 dark:text-gray-200 font-medium">hello@yoursite.com</p>
            </div>

            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-xl">
                  <Phone className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Phone</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Mon-Fri from 8am to 5pm</p>
                </div>
              </div>
              <p className="text-gray-800 dark:text-gray-200 font-medium">+1 (555) 000-0000</p>
            </div>

            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl">
                  <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Location</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Available worldwide</p>
                </div>
              </div>
              <p className="text-gray-800 dark:text-gray-200 font-medium">Remote & On-site</p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
              {/* Status Messages */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                </motion.div>
              )}
              
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl"
                >
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <p className="text-green-700 dark:text-green-300 text-sm">Message sent successfully! I'll get back to you soon.</p>
                </motion.div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* First Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    First name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                    placeholder="John"
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Last name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                    placeholder="Doe"
                  />
                </div>

                {/* Email */}
                <div className="sm:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                    placeholder="john.doe@example.com"
                  />
                </div>

                {/* Phone */}
                <div className="sm:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Phone Number
                  </label>
                  <div className="phone-input-wrapper">
                    <PhoneInput 
                      country={formData.country} 
                      phone={formData.phone} 
                      handleChange={handleChange} 
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="sm:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Tell me about your project or how I can help you..."
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Minimum 6 words required</p>
                </div>

                {/* Privacy Agreement */}
                <div className="sm:col-span-2 space-y-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={() => setAgreed(v => !v)}
                      className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      I agree to the{' '}
                      <a href="#" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                        privacy policy
                      </a>{' '}
                      and understand that my information will be used to respond to my inquiry.
                    </span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !agreed}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:shadow-none transition-all duration-200 disabled:cursor-not-allowed group"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 lg:mt-16"
        >
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Typically respond within 24 hours • Available for projects worldwide
          </p>
        </motion.div>
      </div>

      {/* Custom styles for PhoneInput dark mode compatibility */}
      <style jsx global>{`
        .phone-input-wrapper .PhoneInputInput {
          @apply w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200;
        }
        
        .phone-input-wrapper .PhoneInputCountrySelect {
          @apply border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-l-xl;
        }
        
        .phone-input-wrapper .PhoneInputCountrySelectArrow {
          @apply text-gray-500 dark:text-gray-400;
        }
      `}</style>
    </div>
  );
}