'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ApiTestimonial {
  id: string;
  content: string;
  project_title: string;
  service_name: string;
  featured: boolean;
  date_created: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<ApiTestimonial[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/business/testimonials/?approved=true&limit=5&ordering=-date_created`);
        const data = await res.json();
        setTestimonials(data.results || []);
      } catch (error) {
        console.error('Failed to load testimonials', error);
      }
    }

    fetchTestimonials();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;
  const t = testimonials[index];

  const placeholderImg = `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.project_title?.split(' ')[0].toLowerCase()}`;

  return (
    <section className="w-full relative isolate overflow-hidden bg-silver px-6 py-20 sm:py-16 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,var(--color-indigo-100),white)] opacity-20" />
      <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white ring-1 shadow-xl shadow-indigo-600/10 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />

      <div className="mx-auto max-w-2xl lg:max-w-4xl text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            <blockquote className="text-xl font-semibold text-gray-900 sm:text-2xl mb-4">
              <p>{t.content}</p>
            </blockquote>
            <figcaption className="mt-10">
              <img
                src={placeholderImg}
                alt={t.project_title}
                className="mx-auto size-12 rounded-full object-cover"
              />
              <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                <div className="font-semibold text-gray-900">{t.project_title}</div>
                <svg width={3} height={3} viewBox="0 0 2 2" aria-hidden="true" className="fill-gray-900">
                  <circle r={1} cx={1} cy={1} />
                </svg>
                <div className="text-gray-600">{t.service_name}</div>
              </div>
            </figcaption>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
