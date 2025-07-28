// app/data/notifications.ts
import { Notification } from '@/app/models/notifications.model';

export const notifications: Notification[] = [
  {
    id: "notif-1",
    type: "order",
    title: "New Service Order",
    message: "Jane Smith has requested E-commerce website development",
    read: false,
    resourceId: "ord-1",
    resourceType: "order",
    createdAt: "2025-04-10T12:00:00Z",
    subject: ''
  },
  {
    id: "notif-2",
    type: "contact",
    title: "New Contact Message",
    message: "Sarah Williams sent a message about Consulting Services",
    read: false,
    resourceId: "cont-2",
    resourceType: "contact",
    createdAt: "2025-05-10T09:15:00Z",
    subject: ''
  },
  {
    id: "notif-3",
    type: "system",
    title: "Deployment Complete",
    message: "Your site has been successfully deployed to production",
    read: true,
    createdAt: "2025-05-08T14:30:00Z",
    subject: ''
  }
];