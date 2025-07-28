// app/models/notifications.model.ts
export interface Notification {
  id: string;
  type: 'order' | 'contact' | 'system';
  title: string;
  subject: string;
  message: string;
  read: boolean;
  resourceId?: string; // ID of related resource (order, contact, etc.)
  resourceType?: string; // Type of related resource
  createdAt: string;
}