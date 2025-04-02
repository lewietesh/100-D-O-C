export interface Notification {
        id: string;
        message: string;
        type: 'info' | 'success' | 'warning' | 'error';
        date: string;
        read: boolean;
      }
      
      export const notifications: Notification[] = [
        {
          id: '1',
          message: 'Your order #7276083 has been assigned to a writer.',
          type: 'success',
          date: '2025-04-01',
          read: false,
        },
        {
          id: '2',
          message: 'New promotion: Get 10% off your next project!',
          type: 'info',
          date: '2025-03-30',
          read: true,
        },
        {
          id: '3',
          message: 'Payment failed for Order #7263001. Please update billing info.',
          type: 'error',
          date: '2025-03-28',
          read: false,
        },
      ];
      