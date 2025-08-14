// src/components/dashboard/SupportTab.tsx
import React, { useState } from 'react';
import { HelpCircle, MessageSquare, FileText, Plus } from 'lucide-react';
import { SupportTicketsList } from './SupportTicketList';
import { SupportTicketForm } from './SupportTicketForm';
import { SupportFAQ } from './SupportFAQ';

export const SupportTab: React.FC = () => {
  const [activeSection, setActiveSection] = useState('tickets');
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);

  const sections = [
    { id: 'tickets', label: 'My Tickets', icon: MessageSquare },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Support</h2>
        
        {activeSection === 'tickets' && (
          <button
            onClick={() => setShowNewTicketForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Ticket
          </button>
        )}
      </div>
      
      <div className="flex border-b">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center px-4 py-2 font-medium text-sm border-b-2 ${
                activeSection === section.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {section.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {activeSection === 'tickets' && !showNewTicketForm && (
          <SupportTicketsList />
        )}
        {activeSection === 'tickets' && showNewTicketForm && (
          <SupportTicketForm onClose={() => setShowNewTicketForm(false)} />
        )}
        {activeSection === 'faq' && <SupportFAQ />}
      </div>
    </div>
  );
};