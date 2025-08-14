// src/components/dashboard/SupportTicketsList.tsx
import React, { useState, useEffect } from 'react';
import { MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
  messages_count: number;
}

export const SupportTicketsList: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      // Mock data - replace with actual API call
      const mockTickets: SupportTicket[] = [
        {
          id: '1',
          subject: 'Payment processing issue',
          status: 'in_progress',
          priority: 'high',
          created_at: '2025-08-12T09:00:00Z',
          updated_at: '2025-08-14T10:30:00Z',
          messages_count: 3,
        },
        {
          id: '2',
          subject: 'Account verification help',
          status: 'resolved',
          priority: 'medium',
          created_at: '2025-08-10T14:20:00Z',
          updated_at: '2025-08-11T11:15:00Z',
          messages_count: 2,
        },
      ];
      setTickets(mockTickets);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'open':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="h-4 w-48 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-32 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tickets.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No support tickets yet</p>
          <p className="text-sm text-gray-500">Create a new ticket to get help from our support team</p>
        </div>
      ) : (
        tickets.map((ticket) => (
          <div key={ticket.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                {getStatusIcon(ticket.status)}
                <h3 className="text-lg font-semibold text-gray-900 ml-2">{ticket.subject}</h3>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                  {ticket.status.replace('_', ' ').charAt(0).toUpperCase() + ticket.status.replace('_', ' ').slice(1)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center">
                <span>#{ticket.id}</span>
                <span className="mx-2">•</span>
                <span>{ticket.messages_count} message{ticket.messages_count !== 1 ? 's' : ''}</span>
              </div>
              
              <div>
                <span>Created: {new Date(ticket.created_at).toLocaleDateString()}</span>
                <span className="mx-2">•</span>
                <span>Updated: {new Date(ticket.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};