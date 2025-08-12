// src/components/services/FAQAccordion.tsx
'use client';

import { useState } from 'react';
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
      <div className="text-center py-8 text-gray-500">
        <HelpCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No FAQs available for this service yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {faqs.map((faq) => (
        <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none focus:bg-gray-100"
            onClick={() => toggleItem(faq.id)}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 pr-4">{faq.question}</h3>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${openItems.has(faq.id) ? 'rotate-180' : ''}`}
              />
            </div>
          </button>

          <div className={`transition-all duration-300 ease-in-out ${openItems.has(faq.id)
              ? 'max-h-96 opacity-100'
              : 'max-h-0 opacity-0 overflow-hidden'
            }`}>
            <div className="px-6 py-4 bg-white border-t border-gray-100">
              <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}