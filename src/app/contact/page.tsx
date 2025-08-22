'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  ClockIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { 
  FaGithub, 
  FaLinkedin, 
  FaTwitter, 
  FaInstagram,
  FaReddit,
  FaFacebook
} from 'react-icons/fa';
import { useContact } from '@/hooks/useContact';

// Social icons mapping
const socialIcons: { [key: string]: { icon: React.ReactNode; label: string; color: string } } = {
  git: { icon: <FaGithub />, label: 'GitHub', color: 'hover:bg-gray-700' },
  linkedin: { icon: <FaLinkedin />, label: 'LinkedIn', color: 'hover:bg-blue-600' },
  x: { icon: <FaTwitter />, label: 'X (Twitter)', color: 'hover:bg-blue-400' },
  ig: { icon: <FaInstagram />, label: 'Instagram', color: 'hover:bg-pink-500' },
  reddit: { icon: <FaReddit />, label: 'Reddit', color: 'hover:bg-orange-500' },
  facebook: { icon: <FaFacebook />, label: 'Facebook', color: 'hover:bg-blue-500' },
};

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

  // Use contact location for map, fallback to default
  const mapLocation = contact?.location || 'Nairobi, Kenya';
  const mapEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&q=${encodeURIComponent(mapLocation)}`;
  
  // Fallback map URL for Nairobi if no API key
  const fallbackMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255282.35853648147!2d36.70731465652196!3d-1.3031933983423102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d84d49a7%3A0xf7cf0254b297924c!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2sus!4v1696954495100!5m2!1sen!2sus";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus('success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 md:py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-600/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-emerald-400/10 to-blue-600/10 blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]"></div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <EnvelopeIcon className="w-4 h-4" />
            Get In Touch
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Let's Build Something Amazing
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Ready to turn your ideas into reality? I'm here to help with your next project, 
            whether it's web development, API integration, or technical consulting.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Contact Details Card */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Contact Information</h2>
                
                {loading ? (
                  <div className="space-y-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="animate-pulse flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
                          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                  </div>
                ) : contact ? (
                  <div className="space-y-8">
                    {/* Email */}
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <EnvelopeIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">Email</h3>
                        <a 
                          href={`mailto:${contact.email}`} 
                          className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-lg"
                        >
                          {contact.email}
                        </a>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <PhoneIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">Phone</h3>
                        {contact.phone ? (
                          <a 
                            href={`tel:${contact.phone}`} 
                            className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-lg"
                          >
                            {contact.phone}
                          </a>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500 text-lg">Available on request</span>
                        )}
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <MapPinIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">Location</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-lg">{contact.location || 'Remote Worldwide'}</p>
                      </div>
                    </div>

                    {/* Availability */}
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                        <ClockIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">Response Time</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-lg">Within 24 hours</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Usually much faster!</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <GlobeAltIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 dark:text-gray-500">Contact info loading...</p>
                  </div>
                )}
              </div>
              
              {/* Social Media Links */}
              {contact?.social_links && (
                <div className="px-8 pb-8">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-4">
                    Let's Connect
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(contact.social_links).map(([key, url]) => {
                      const socialData = socialIcons[key];
                      return url && socialData ? (
                        <a
                          key={key}
                          href={url}
                          className={`w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 transition-all duration-200 ${socialData.color} hover:text-white hover:shadow-lg`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={socialData.label}
                        >
                          {socialData.icon}
                        </a>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
            
            {/* Map */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
              <div className="relative h-64">
                <iframe 
                  src={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? mapEmbedUrl : fallbackMapUrl}
                  className="absolute inset-0 w-full h-full" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map showing ${mapLocation}`}
                />
              </div>
              <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-600">
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Current Location</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{mapLocation}</p>
              </div>
            </div>
          </motion.div>
          
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 p-8 lg:p-10">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Start a Conversation</h2>
              
              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center"
                >
                  <CheckCircleIcon className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">Message Sent Successfully!</h3>
                  <p className="text-green-700 dark:text-green-400 mb-4">
                    Thanks for reaching out! I've received your message and will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : status === 'error' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center mb-8"
                >
                  <ExclamationTriangleIcon className="w-16 h-16 text-red-600 dark:text-red-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-2">Oops! Something went wrong</h3>
                  <p className="text-red-700 dark:text-red-400 mb-4">
                    There was an issue sending your message. Please try again or reach out directly via email.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
                  >
                    Try again
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                        placeholder="john@example.com"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number <span className="text-gray-400">(Optional)</span>
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Project Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">What can I help you with?</option>
                        <option value="Web Development">Web Development Project</option>
                        <option value="Full Stack Application">Full Stack Application</option>
                        <option value="API Development">API Development & Integration</option>
                        <option value="E-commerce Solution">E-commerce Solution</option>
                        <option value="Mobile App Backend">Mobile App Backend</option>
                        <option value="Database Design">Database Design & Optimization</option>
                        <option value="Tech Consulting">Technical Consulting</option>
                        <option value="Code Review">Code Review & Audit</option>
                        <option value="Maintenance & Support">Maintenance & Support</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Collaboration">Partnership/Collaboration</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Tell me about your project <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={form.message}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Describe your project, timeline, budget, and any specific requirements or challenges you're facing..."
                    />
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <input
                      id="privacy"
                      name="privacy"
                      type="checkbox"
                      required
                      className="mt-1 h-5 w-5 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700"
                    />
                    <label htmlFor="privacy" className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      I'd like to hear back from you! By submitting this form, you agree that I can use your contact 
                      information to respond to your inquiry and provide project updates. 
                      <span className="text-gray-500 dark:text-gray-500"> Your information is safe with me.</span>
                    </label>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:shadow-none transition-all duration-200 disabled:cursor-not-allowed group"
                    >
                      {status === 'submitting' ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending your message...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <PaperAirplaneIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}