'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown } from "lucide-react";

interface ServiceFAQ {
  id: string;
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  faqs: ServiceFAQ[];
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  if (!faqs || faqs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
          <HelpCircle className="w-8 h-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No FAQs Available
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Frequently asked questions for this service haven't been added yet.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors duration-200"
        >
          <HelpCircle className="w-5 h-5" />
          Ask a Question
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <motion.div
          key={faq.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
        >
          <button
            className="w-full px-6 py-5 text-left bg-gradient-to-r from-gray-50 to-blue-50/30 dark:from-gray-700/50 dark:to-blue-900/20 hover:from-gray-100 hover:to-blue-100/50 dark:hover:from-gray-600/50 dark:hover:to-blue-800/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            onClick={() => toggleItem(faq.id)}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white pr-4 text-lg">
                {faq.question}
              </h3>
              <motion.div
                animate={{ rotate: openItems.has(faq.id) ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex-shrink-0"
              >
                <ChevronDown className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </motion.div>
            </div>
          </button>

          <AnimatePresence>
            {openItems.has(faq.id) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-6 py-5 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                  <motion.p
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ delay: 0.1, duration: 0.2 }}
                    className="text-gray-700 dark:text-gray-300 leading-relaxed text-base"
                  >
                    {faq.answer}
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
      
      {/* Additional Help Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: faqs.length * 0.1 + 0.2 }}
        className="mt-8 text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
      >
        <HelpCircle className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Still Have Questions?
        </h4>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          I'm here to help! Feel free to reach out with any specific questions about this service.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          <HelpCircle className="w-5 h-5" />
          Contact Me
        </a>
      </motion.div>
    </div>
  );
}