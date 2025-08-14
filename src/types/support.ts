// src/types/support.ts
export interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  messages: SupportMessage[];
  created_at: string;
  updated_at: string;
}

export interface SupportMessage {
  id: string;
  content: string;
  is_staff_reply: boolean;
  created_at: string;
  attachments?: string[];
}
