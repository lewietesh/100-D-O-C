'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    name: 'Judith Black',
    role: 'CEO of Workcation',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    quote:
      '“Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo expedita voluptas culpa sapiente alias molestiae. Numquam corrupti in laborum sed rerum et corporis.”',
    companyLogo: 'https://tailwindcss.com/plus-assets/img/logos/workcation-logo-indigo-600.svg',
  },
  {
    name: 'Michael Lee',
    role: 'CTO of InnovateX',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    quote:
      '“This platform has transformed the way we connect with clients. The design is sleek and the user experience is unmatched.”',
    companyLogo: 'https://tailwindcss.com/plus-assets/img/logos/tuple-logo-indigo-600.svg',
  },
  {
    name: 'Sofia Hernandez',
    role: 'Freelancer & UX Designer',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    quote:
      '“Clean UI, fast performance, and a team that listens. This is by far the best experience I’ve had in years.”',
    companyLogo: 'https://tailwindcss.com/plus-assets/img/logos/statickit-logo-indigo-600.svg',
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const t = testimonials[index];

  return (
    <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
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
            <img alt="" src={t.companyLogo} className="mx-auto h-12 mb-8" />
            <blockquote className="text-xl font-semibold text-gray-900 sm:text-2xl">
              <p>{t.quote}</p>
            </blockquote>
            <figcaption className="mt-10">
              <img
                src={t.image}
                alt={t.name}
                className="mx-auto size-12 rounded-full object-cover"
              />
              <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                <div className="font-semibold text-gray-900">{t.name}</div>
                <svg width={3} height={3} viewBox="0 0 2 2" aria-hidden="true" className="fill-gray-900">
                  <circle r={1} cx={1} cy={1} />
                </svg>
                <div className="text-gray-600">{t.role}</div>
              </div>
            </figcaption>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
