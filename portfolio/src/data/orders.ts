export interface Order {
  id: string;
  topic: string;
  subject: string;
  dueDate: string;
  price: string;
  status: string;
  assignedWriter: string | null;
  instructions?: string; // optional if you use it in forms
}
