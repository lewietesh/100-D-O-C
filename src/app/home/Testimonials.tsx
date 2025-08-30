'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

interface ApiTestimonial {
  id: string;
  content: string;
  project_title: string;
  service_name: string;
  featured: boolean;
  date_created: string;
  rating?: number | null;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<ApiTestimonial[]>([]);
  const [index, setIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

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
    if (!isAutoPlaying || testimonials.length <= 1) return;
    
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length, isAutoPlaying]);

  const handlePrevious = () => {
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const handleIndicatorClick = (i: number) => {
    setIndex(i);
    setIsAutoPlaying(false);
  };

  if (testimonials.length === 0) return null;

  const currentTestimonial = testimonials[index];
  const placeholderImg = `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentTestimonial.project_title?.split(' ')[0].toLowerCase()}`;

  return (
    <section className="py-20 bg-main dark:bg-secondary">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-blue-100 dark:bg-background dark:text-primary text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4"
          >
            <Star className="w-4 h-4 fill-current" />
            Client Testimonials
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            What Clients Say
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Real feedback from clients I've helped bring their digital visions to life
          </motion.p>
        </div>

        {/* Testimonial Card */}
        <div className="relative bg-main dark:bg-gradient-primary">
          <div 
            className="gradient-primary rounded-2xl shadow-xl p-8 md:p-12 relative overflow-hidden"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-500/10 to-blue-500/10 rounded-full blur-2xl"></div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
              >
                {/* Quote Icon */}
                <div className="flex justify-center mb-6">
                  <div className="bg-background p-3 rounded-full">
                    <Quote className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Testimonial Content */}
                <blockquote className="text-center mb-8">
                  <p className="text-lg md:text-xl text-inverse  leading-relaxed italic">
                    "{currentTestimonial.content}"
                  </p>
                </blockquote>

                {/* Client Info */}
                <div className="flex items-center justify-center gap-4">
                  <img
                    src={placeholderImg}
                    alt={`${currentTestimonial.project_title} avatar`}
                    className="w-12 h-12 rounded-full bg-gray-100 ring-2 ring-white shadow-md"
                  />
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {currentTestimonial.project_title}
                    </h4>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <span className="text-sm text-inverse">
                        {currentTestimonial.service_name}
                      </span>
                      {currentTestimonial.featured && (
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          {testimonials.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 border border-gray-200 p-3 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl group"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
              </button>
              
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 border border-gray-200 p-3 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl group"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
              </button>
            </>
          )}
        </div>

        {/* Indicators */}
        {testimonials.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => handleIndicatorClick(i)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i === index
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Stats or Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="text-center p-6 gradient-primary rounded-xl backdrop-blur-sm">
            <div className="text-3xl font-bold text-inverse mb-2">
              {testimonials.length}+
            </div>
            <div className=" text-inverse">Happy Clients</div>
          </div>

          <div className="text-center p-6 gradient-primary rounded-xl backdrop-blur-sm">
            <div className="text-3xl font-bold text-inverse mb-2">100%</div>
            <div className="text-inverse">Project Success</div>
          </div>
          
          <div className="text-center p-6 gradient-primary rounded-xl backdrop-blur-sm">
            <div className="text-3xl font-bold text-inverse mb-2">24/7</div>
            <div className="text-inverse">Support Available</div>
          </div>
        </div>
      </div>
    </section>
  );
}