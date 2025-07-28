// src/components/services/CTACard.tsx
'use client';

import Link from 'next/link';

export default function CTACard() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg p-8 shadow-lg space-y-4">
      <h3 className="text-2xl font-bold">Ready to Transform Your Ideas into Reality?</h3>
      <p className="text-white/90">
        From academic excellence to cutting-edge digital solutions, we provide the expertise you need to succeed in today's competitive landscape.
      </p>
      <div className="flex flex-wrap gap-4 pt-2">
        <Link 
          href="/contact" 
          className="inline-block px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-gray-100 transition shadow-md"
        >
          Contact Us
        </Link>
        <Link 
          href="/request-service" 
          className="inline-block px-6 py-3 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-900 transition border border-blue-400"
        >
          Request Service
        </Link>
      </div>
    </div>
  );
}