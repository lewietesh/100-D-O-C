// app/data/orders.ts
import { ServiceOrder } from '@/app/models/orders.model';

export const orders: ServiceOrder[] = [
  {
    id: "ord-1",
    serviceId: "serv-1",
    serviceName: "Custom Web Development",  // Add this property
    clientName: "TechStart Solutions",
    clientEmail: "projects@techstart.co.ke",
    clientPhone: "+254712345678",
    description: "E-commerce platform for a growing electronics business",
    requirements: [
      {
        title: "Responsive design",
        description: "The site must work well on mobile, tablet and desktop",
        completed: true
      },
      {
        title: "Payment integration",
        description: "Integration with M-Pesa, PayPal and credit cards",
        completed: false
      },
      {
        title: "Inventory management",
        description: "Real-time stock tracking and notifications",
        completed: false
      }
    ],
    budget: 2500,
    timeline: "3 months",
    startDate: "2025-04-10T00:00:00Z",
    endDate: "2025-07-10T00:00:00Z",
    status: "in-progress",
    priority: "high",
    payments: [
      {
        id: "pay-1",
        amount: 1000,
        status: "paid",
        method: "Bank Transfer",
        date: "2025-04-10T00:00:00Z"
      }
    ],
    notes: "Client needs the product catalog section completed by end of May",
    createdAt: "2025-04-05T14:30:00Z",
    updatedAt: "2025-04-10T09:15:00Z"
  },
  {
    id: "ord-2",
    serviceId: "serv-2",
    serviceName: "UI/UX Design",  // Add this property
    clientName: "CreativeVision Agency",
    clientEmail: "design@creativevision.com",
    description: "Redesign of mobile application interface",
    requirements: [
      {
        title: "User research",
        description: "Conduct interviews with current users",
        completed: true
      },
      {
        title: "Wireframing",
        description: "Create low-fidelity wireframes for key screens",
        completed: true
      },
      {
        title: "High-fidelity mockups",
        description: "Develop detailed visual designs in Figma",
        completed: false
      }
    ],
    budget: 1200,
    timeline: "1 month",
    status: "review",
    priority: "medium",
    attachments: ["/assets/orders/ord-2-brief.pdf", "/assets/orders/ord-2-wireframes.pdf"],
    createdAt: "2025-05-01T10:20:00Z",
    updatedAt: "2025-05-08T16:45:00Z"
  },
  {
    id: "ord-3",
    serviceId: "serv-3",
    serviceName: "Technical Consultation",  // Add this property
    clientName: "John Individual",
    clientEmail: "john@gmail.com",
    clientPhone: "+254723456789",
    description: "Need advice on choosing the right tech stack for a social networking app",
    budget: 300,
    timeline: "2 weeks",
    status: "pending",
    priority: "low",
    createdAt: "2025-05-10T11:30:00Z"
  }
];