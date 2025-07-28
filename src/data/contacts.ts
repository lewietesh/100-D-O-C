// app/data/contacts.ts
import { ContactMessage } from '@/app/models/contact.model';

export const contacts: ContactMessage[] = [
  {
    id: "cont-1",
    name: "Michael Johnson",
    email: "michael@example.com",
    subject: "Project Collaboration",
    message: "I'm interested in collaborating on a web application project. Would love to discuss details.",
    read: true,
    createdAt: "2025-04-28T15:20:00Z"
  },
  {
    id: "cont-2",
    name: "Sarah Williams",
    email: "sarah@example.com",
    subject: "Consulting Services",
    message: "I'd like to know more about your consulting services and availability for a project starting next month.",
    read: false,
    createdAt: "2025-05-10T09:15:00Z"
  }
];