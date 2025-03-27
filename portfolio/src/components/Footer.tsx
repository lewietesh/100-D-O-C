'use client';

import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaWordpress } from 'react-icons/fa';

const footerLinks = [
  {
    heading: 'DevKinsta',
    links: ['Homepage', 'Features', 'Download'],
  },
  {
    heading: 'Get Support',
    links: ['Support Forum', 'Documentation', 'FAQ'],
  },
  {
    heading: 'Resources',
    links: ['Free Ebooks', 'Learn WordPress', 'Kinsta Blog'],
  },
  {
    heading: 'Kinsta',
    links: ['Hosting Plans', 'Features', 'About Kinsta'],
  },
];

const socialIcons = [
  { icon: <FaWordpress />, href: '#' },
  { icon: <FaFacebook />, href: '#' },
  { icon: <FaTwitter />, href: '#' },
  { icon: <FaInstagram />, href: '#' },
  { icon: <FaYoutube />, href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-[#0B0223] text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {footerLinks.map((section) => (
            <div key={section.heading}>
              <h4 className="text-lg font-semibold mb-4">{section.heading}</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-800 my-12" />

        {/* Bottom Row */}
        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-400 mt-12">
          {/* Company Name */}
          <div className="w-full md:w-auto text-center md:text-left">
            <p className="font-bold text-white text-lg">Kinsta</p>
          </div>

          {/* Copyright */}
          <div className="w-full text-center">
            <p>© {new Date().getFullYear()} Kinsta Inc. All rights reserved.</p>
          </div>

          {/* Social Icons */}
          <div className="w-full md:w-auto flex justify-center md:justify-end space-x-4 text-xl">
            {socialIcons.map((s, i) => (
              <a
                key={i}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
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
