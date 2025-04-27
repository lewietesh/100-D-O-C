'use client';

import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';

const footerLinks = [
  {
    heading: 'Explore',
    links: ['Home', 'About', 'Services', 'Projects', 'Contact'],
  },
  {
    heading: 'Technologies',
    links: ['React', 'Django', 'PHP', 'Python', 'Machine Learning'],
  },
  {
    heading: 'Resources',
    links: ['Blog', 'GitHub', 'Dissertation Help', 'API Integrations'],
  },
  {
    heading: 'Contact',
    links: ['lewismutembei001@gmail.com', '0795194449'],
  },
];

const socialIcons = [
  { icon: <FaGithub />, href: 'https://github.com/lewismutembei' },
  { icon: <FaLinkedin />, href: 'https://linkedin.com/in/lewismutembei' },
  { icon: <FaTwitter />, href: '#' },
  { icon: <FaFacebook />, href: '#' },
  { icon: <FaInstagram />, href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-silver  py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Grid Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {footerLinks.map((section) => (
            <div key={section.heading}>
              <h4 className="text-lg font-semibold mb-4 text-primary">{section.heading}</h4>
              <ul className="space-y-2 text-sm">
                {section.links.map((link, i) => (
                  <li key={i}>
                    {link.startsWith('http') || link.includes('@') || /^\d{7,}$/.test(link) ? (
                      <span className="block text-primary">{link}</span>
                    ) : (
                      <a href={`/${link.toLowerCase().replace(/ /g, '-')}`} className="text-muted hover:text-brand transition">
                        {link}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-700 my-12" />

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
          <div className="text-center md:text-left">
            <p className="font-bold text-primary text-lg">Lewis Mutembei</p>
            <p className="text-muted mt-1">Software Developer | Full Stack | ML & Web Systems</p>
          </div>

          <div className="text-center">
            <p>© {new Date().getFullYear()} Lewis Mutembei. All rights reserved.</p>
          </div>

          <div className="flex justify-center md:justify-end space-x-4 text-xl">
            {socialIcons.map((s, i) => (
              <a
                key={i}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-brand transition"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
