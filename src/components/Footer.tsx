'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaInstagram, 
  FaLinkedin, 
  FaGithub,
  FaXTwitter, 
  FaReddit, 
  FaFacebook,
  FaReact,
  FaPython,
  FaNodeJs,
  FaDocker,
  FaDatabase
} from 'react-icons/fa6';
import { 
  SiDjango, 
  SiNextdotjs, 
  SiTypescript, 
  SiMongodb,
  SiPostgresql,
  SiMysql,
  SiTailwindcss
} from 'react-icons/si';

// Types
interface ContactInfo {
  id: number;
  brand_name: string;
  email: string;
  phone: string;
  location: string;
  social_links: {
    ig?: string;
    git?: string;
    linkedin?: string;
    x?: string;
    reddit?: string;
    facebook?: string;
    [key: string]: string | undefined;
  };
  date_created: string;
  date_updated: string;
}

interface Technology {
  id: number;
  name: string;
  icon_url: string;
  category: string;
}

interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Technology icons mapping
const techIconMap: { [key: string]: React.ReactNode } = {
  'React': <FaReact className="text-blue-400" />,
  'Next JS': <SiNextdotjs className="text-white" />,
  'NextJS': <SiNextdotjs className="text-white" />,
  'TypeScript': <SiTypescript className="text-blue-500" />,
  'Django': <SiDjango className="text-green-600" />,
  'Python': <FaPython className="text-yellow-400" />,
  'Node.js': <FaNodeJs className="text-green-500" />,
  'Docker': <FaDocker className="text-blue-400" />,
  'MongoDB': <SiMongodb className="text-green-500" />,
  'Mongodb': <SiMongodb className="text-green-500" />,
  'SQL': <FaDatabase className="text-blue-600" />,
  'PostgreSQL': <SiPostgresql className="text-blue-600" />,
  'MySQL': <SiMysql className="text-orange-500" />,
  'Tailwind': <SiTailwindcss className="text-cyan-400" />,
  'TailwindCSS': <SiTailwindcss className="text-cyan-400" />,
};

// Social icons mapping
const socialIconMap: { [key: string]: { icon: React.ReactNode; label: string; color: string } } = {
  ig: { 
    icon: <FaInstagram />, 
    label: 'Instagram', 
    color: 'hover:text-pink-500' 
  },
  linkedin: { 
    icon: <FaLinkedin />, 
    label: 'LinkedIn', 
    color: 'hover:text-blue-600' 
  },
  git: { 
    icon: <FaGithub />, 
    label: 'GitHub', 
    color: 'hover:text-gray-300' 
  },
  x: { 
    icon: <FaXTwitter />, 
    label: 'X (Twitter)', 
    color: 'hover:text-blue-400' 
  },
  reddit: { 
    icon: <FaReddit />, 
    label: 'Reddit', 
    color: 'hover:text-orange-500' 
  },
  facebook: { 
    icon: <FaFacebook />, 
    label: 'Facebook', 
    color: 'hover:text-blue-500' 
  },
};

// Custom hooks for data fetching
function useContactInfo() {
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContactInfo() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/core/contact-info/`);
        if (!response.ok) throw new Error('Failed to fetch contact info');
        
        const data: ApiResponse<ContactInfo> = await response.json();
        setContact(data.results.length > 0 ? data.results[0] : null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load contact info');
        console.error('Contact info fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchContactInfo();
  }, []);

  return { contact, loading, error };
}

function useTechnologies() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTechnologies() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/projects/technologies/`);
        if (!response.ok) throw new Error('Failed to fetch technologies');
        
        const data: ApiResponse<Technology> = await response.json();
        setTechnologies(data.results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load technologies');
        console.error('Technologies fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTechnologies();
  }, []);

  return { technologies, loading, error };
}

export default function Footer() {
  const { contact, loading: contactLoading, error: contactError } = useContactInfo();
  const { technologies, loading: techLoading, error: techError } = useTechnologies();

  // Group technologies by category
  const groupedTechnologies = technologies.reduce((acc, tech) => {
    const category = tech.category.toLowerCase();
    if (!acc[category]) acc[category] = [];
    acc[category].push(tech);
    return acc;
  }, {} as { [key: string]: Technology[] });

  // Static navigation links
  const navigationLinks = [
    {
      heading: 'Explore',
      links: [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
        { label: 'Services', href: '/services' },
        { label: 'Projects', href: '/projects' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      heading: 'Resources',
      links: [
        { label: 'Blog', href: '/blog' },
        { label: 'GitHub', href: contact?.social_links?.git || 'https://github.com' },
        { label: 'API Integrations', href: '/services' },
        { label: 'Documentation', href: '/docs' },
      ],
    },
  ];

  // Build contact links
  const contactLinks = contact ? [
    {
      heading: 'Contact',
      links: [
        { label: contact.email, href: `mailto:${contact.email}` },
        ...(contact.phone ? [{ label: contact.phone, href: `tel:${contact.phone}` }] : []),
        ...(contact.location ? [{ label: contact.location, href: null }] : []),
      ]
    }
  ] : [];

  // Build technology links
  const technologyLinks = Object.keys(groupedTechnologies).length > 0 ? [
    {
      heading: 'Technologies',
      links: Object.entries(groupedTechnologies).slice(0, 5).map(([category, techs]) => ({
        label: techs.map(t => t.name).join(', '),
        href: null,
        category: category.charAt(0).toUpperCase() + category.slice(1),
        techs: techs
      }))
    }
  ] : [];

  // Process social links
  const socialLinks = contact?.social_links 
    ? Object.entries(contact.social_links)
        .filter(([_, url]) => url && url.trim() !== '')
        .map(([key, url]) => ({
          key,
          url: url!,
          ...socialIconMap[key]
        }))
        .filter(link => link.icon)
    : [];

  if (contactLoading || techLoading) {
    return (
      <footer className="w-full bg-gray-900 dark:bg-gray-950 py-16 px-6 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="h-6 bg-gray-700 rounded w-20"></div>
                  <div className="space-y-2">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="h-4 bg-gray-700 rounded w-24"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="h-px bg-gray-700 mb-8"></div>
            <div className="flex justify-between items-center">
              <div className="h-6 bg-gray-700 rounded w-32"></div>
              <div className="h-6 bg-gray-700 rounded w-48"></div>
              <div className="flex space-x-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-6 w-6 bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-full bg-gray-900 dark:bg-gray-950 py-16 px-6 overflow-x-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Navigation Links */}
          {navigationLinks.map((section, index) => (
            <motion.div
              key={section.heading}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h4 className="text-lg font-bold mb-6 text-white">
                {section.heading}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                      target={link.href?.startsWith('http') ? '_blank' : undefined}
                      rel={link.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Technologies Section */}
          {technologyLinks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="text-lg font-bold mb-6 text-white">
                Technologies
              </h4>
              <div className="space-y-4">
                {Object.entries(groupedTechnologies).slice(0, 3).map(([category, techs]) => (
                  <div key={category}>
                    <h5 className="text-sm font-semibold text-gray-300 mb-2 capitalize">
                      {category}
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {techs.slice(0, 3).map((tech) => (
                        <div
                          key={tech.id}
                          className="flex items-center gap-1 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-md"
                          title={tech.name}
                        >
                          {techIconMap[tech.name] || <span className="w-3 h-3 bg-gray-600 rounded"></span>}
                          <span className="truncate max-w-[80px]">{tech.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Contact Section */}
          {contactLinks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="text-lg font-bold mb-6 text-white">
                Contact
              </h4>
              <ul className="space-y-3">
                {contactLinks[0].links.map((link, i) => (
                  <li key={i}>
                    {link.href ? (
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors duration-200 text-sm break-all"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">{link.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-800 my-12"></div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-col lg:flex-row justify-between items-center gap-6"
        >
          {/* Brand Info */}
          <div className="text-center lg:text-left">
            <h3 className="text-xl font-bold text-white mb-1">
              {contact?.brand_name || 'Lewis Mutembei'}
            </h3>
            <p className="text-gray-400 text-sm">
              {contact?.location || 'Software Developer | Full Stack | ML & Web Systems'}
            </p>
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} {contact?.brand_name || 'Lewis Mutembei'}. All rights reserved.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.length > 0 ? (
              socialLinks.map((social) => (
                <a
                  key={social.key}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 transition-colors duration-200 text-xl ${social.color}`}
                  aria-label={social.label}
                  title={social.label}
                >
                  {social.icon}
                </a>
              ))
            ) : (
              <div className="text-gray-500 text-sm">
                Connect with me
              </div>
            )}
          </div>
        </motion.div>

        {/* Error States (Development) */}
        {(contactError || techError) && process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-red-900/20 border border-red-800 rounded-lg">
            <p className="text-red-400 text-sm">
              Development Errors:
              {contactError && <span className="block">Contact: {contactError}</span>}
              {techError && <span className="block">Technologies: {techError}</span>}
            </p>
          </div>
        )}
      </div>
    </footer>
  );
}