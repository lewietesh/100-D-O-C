export interface Order {
        id: string;
        topic: string;
        dueDate: string;
        price: string;
        status: string;
        assignedWriter: string | null;
      }
      