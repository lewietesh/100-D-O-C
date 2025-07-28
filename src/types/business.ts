// types/business.ts
// Business Operations and Core Management Types

export type OrderStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';
export type PaymentMethod = 'credit_card' | 'paypal' | 'bank_transfer' | 'mpesa' | 'stripe' | 'cash' | 'check';
export type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled';
export type ContractStatus = 'draft' | 'sent' | 'signed' | 'active' | 'completed' | 'terminated' | 'expired';

// Orders and transactions
export interface Order {
  id: string;
  client: string; // User ID
  orderNumber: string;
  type: 'service' | 'product' | 'custom';
  status: OrderStatus;
  totalAmount: number;
  currency: string;
  description: string;
  notes?: string;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  dateCreated: string;
  dateUpdated: string;
  dateCompleted?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
}

export interface OrderWithDetails extends Order {
  clientDetails: {
    id: string;
    email: string;
    fullName: string;
    companyName?: string;
    phone?: string;
  };
  items: OrderItem[];
  payments: Payment[];
  invoices: Invoice[];
  timeline: OrderTimeline[];
  totalItems: number;
  totalPaid: number;
  remainingBalance: number;
}

export interface OrderItem {
  id: string;
  order: string; // Order ID
  itemType: 'service' | 'product' | 'custom';
  itemId?: string; // Service/Product ID
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;
  customizations?: Record<string, any>;
  deliverables?: string[];
  dateCreated: string;
}

export interface OrderTimeline {
  id: string;
  order: string; // Order ID
  event: string;
  description: string;
  status: OrderStatus;
  user?: string; // User ID
  isClientVisible: boolean;
  dateCreated: string;
}

// Payments and financial transactions
export interface Payment {
  id: string;
  order?: string; // Order ID
  invoice?: string; // Invoice ID
  client: string; // User ID
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  reference: string;
  description?: string;
  processingFee?: number;
  netAmount: number;
  paymentGateway?: string;
  gatewayResponse?: Record<string, any>;
  dateCreated: string;
  dateProcessed?: string;
  dateCompleted?: string;
}

export interface PaymentWithDetails extends Payment {
  orderDetails?: {
    orderNumber: string;
    description: string;
  };
  clientDetails: {
    email: string;
    fullName: string;
    companyName?: string;
  };
  refunds: PaymentRefund[];
  totalRefunded: number;
}

export interface PaymentRefund {
  id: string;
  payment: string; // Payment ID
  amount: number;
  currency: string;
  reason: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  refundMethod: PaymentMethod;
  transactionId?: string;
  processedBy: string; // User ID
  dateCreated: string;
  dateProcessed?: string;
}

// Invoicing and billing
export interface Invoice {
  id: string;
  invoiceNumber: string;
  client: string; // User ID
  order?: string; // Order ID
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountRate?: number;
  discountAmount?: number;
  totalAmount: number;
  currency: string;
  description?: string;
  notes?: string;
  terms?: string;
  dateCreated: string;
  dateUpdated: string;
  datePaid?: string;
  dateSent?: string;
  dateViewed?: string;
}

export interface InvoiceWithDetails extends Invoice {
  clientDetails: {
    id: string;
    email: string;
    fullName: string;
    companyName?: string;
    billingAddress?: BusinessAddress;
  };
  items: InvoiceItem[];
  payments: Payment[];
  reminders: InvoiceReminder[];
  totalItems: number;
  totalPaid: number;
  remainingBalance: number;
  isOverdue: boolean;
  daysPastDue: number;
}

export interface InvoiceItem {
  id: string;
  invoice: string; // Invoice ID
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxable: boolean;
  sortOrder: number;
}

export interface InvoiceReminder {
  id: string;
  invoice: string; // Invoice ID
  reminderType: 'gentle' | 'firm' | 'final' | 'overdue';
  sentDate: string;
  method: 'email' | 'sms' | 'phone' | 'letter';
  response?: string;
  dateCreated: string;
}

// Contracts and agreements
export interface Contract {
  id: string;
  contractNumber: string;
  client: string; // User ID
  order?: string; // Order ID
  title: string;
  description: string;
  content: string;
  type: 'service_agreement' | 'product_license' | 'retainer' | 'custom';
  status: ContractStatus;
  value: number;
  currency: string;
  startDate: string;
  endDate?: string;
  signedDate?: string;
  terms: string;
  cancellationPolicy?: string;
  dateCreated: string;
  dateUpdated: string;
}

export interface ContractWithDetails extends Contract {
  clientDetails: {
    id: string;
    email: string;
    fullName: string;
    companyName?: string;
  };
  signatures: ContractSignature[];
  attachments: ContractAttachment[];
  amendments: ContractAmendment[];
  milestones: ContractMilestone[];
  isExpiringSoon: boolean;
  daysUntilExpiry?: number;
}

export interface ContractSignature {
  id: string;
  contract: string; // Contract ID
  signer: string; // User ID
  signerType: 'client' | 'provider';
  signatureData: string;
  ipAddress: string;
  userAgent: string;
  dateSigned: string;
}

export interface ContractAttachment {
  id: string;
  contract: string; // Contract ID
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  description?: string;
  dateUploaded: string;
}

export interface ContractAmendment {
  id: string;
  contract: string; // Contract ID
  title: string;
  description: string;
  changes: string;
  effectiveDate: string;
  createdBy: string; // User ID
  approved: boolean;
  dateCreated: string;
}

export interface ContractMilestone {
  id: string;
  contract: string; // Contract ID
  title: string;
  description: string;
  dueDate: string;
  completedDate?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  paymentAmount?: number;
  sortOrder: number;
}

// Business settings and configuration
export interface BusinessSettings {
  id: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyWebsite?: string;
  businessAddress: BusinessAddress;
  billingAddress?: BusinessAddress;
  taxId?: string;
  currency: string;
  timezone: string;
  locale: string;
  logoUrl?: string;
  theme: BusinessTheme;
  paymentSettings: PaymentSettings;
  invoiceSettings: InvoiceSettings;
  notificationSettings: NotificationSettings;
  dateCreated: string;
  dateUpdated: string;
}

export interface BusinessAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface BusinessTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  customCss?: string;
}

export interface PaymentSettings {
  enabledMethods: PaymentMethod[];
  stripePublicKey?: string;
  paypalClientId?: string;
  mpesaConsumerKey?: string;
  defaultCurrency: string;
  acceptedCurrencies: string[];
  minimumAmount: number;
  processingFeePercentage: number;
  autoCapture: boolean;
}

export interface InvoiceSettings {
  prefix: string;
  startingNumber: number;
  defaultTerms: string;
  defaultNotes?: string;
  paymentTerms: number; // days
  lateFeePercentage?: number;
  reminderSchedule: number[]; // days before/after due date
  autoSendReminders: boolean;
  logoUrl?: string;
  footerText?: string;
}

export interface NotificationSettings {
  emailNotifications: {
    newOrder: boolean;
    paymentReceived: boolean;
    invoicePaid: boolean;
    contractSigned: boolean;
    orderCompleted: boolean;
  };
  smsNotifications: {
    urgentOnly: boolean;
    paymentFailed: boolean;
    overdueInvoice: boolean;
  };
  clientNotifications: {
    orderUpdates: boolean;
    paymentReceipts: boolean;
    invoiceReminders: boolean;
    projectMilestones: boolean;
  };
}

// Business analytics and reporting
export interface BusinessMetrics {
  totalRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  revenueGrowth: number;
  totalOrders: number;
  completedOrders: number;
  averageOrderValue: number;
  totalClients: number;
  activeClients: number;
  newClients: number;
  clientRetentionRate: number;
  outstandingInvoices: number;
  overdueInvoices: number;
  totalOutstandingAmount: number;
  conversionRate: number;
  profitMargin: number;
}

export interface RevenueReport {
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate: string;
  totalRevenue: number;
  revenueByService: Array<{
    serviceId: string;
    serviceName: string;
    revenue: number;
    orders: number;
  }>;
  revenueByProduct: Array<{
    productId: string;
    productName: string;
    revenue: number;
    sales: number;
  }>;
  revenueByClient: Array<{
    clientId: string;
    clientName: string;
    revenue: number;
    orders: number;
  }>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    orders: number;
    growth: number;
  }>;
}

export interface ClientReport {
  totalClients: number;
  newClients: number;
  activeClients: number;
  churnedClients: number;
  retentionRate: number;
  averageLifetimeValue: number;
  topClients: Array<{
    clientId: string;
    clientName: string;
    totalSpent: number;
    orders: number;
    lastOrderDate: string;
  }>;
  clientsByIndustry: Record<string, number>;
  clientAcquisitionSources: Record<string, number>;
}

// Communication and correspondence
export interface Communication {
  id: string;
  type: 'email' | 'sms' | 'phone' | 'meeting' | 'note';
  direction: 'inbound' | 'outbound';
  client?: string; // User ID
  order?: string; // Order ID
  subject: string;
  content: string;
  status: 'draft' | 'sent' | 'delivered' | 'read' | 'replied' | 'failed';
  scheduled?: boolean;
  scheduledFor?: string;
  sentBy: string; // User ID
  recipients: string[];
  attachments?: string[];
  dateCreated: string;
  dateSent?: string;
  dateRead?: string;
}

export interface CommunicationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms';
  category: 'welcome' | 'order_confirmation' | 'invoice' | 'reminder' | 'completion' | 'follow_up';
  subject: string;
  content: string;
  variables: string[];
  active: boolean;
  dateCreated: string;
  dateUpdated: string;
}

// Business automation and workflows
export interface WorkflowTrigger {
  id: string;
  name: string;
  event: 'order_created' | 'payment_received' | 'invoice_overdue' | 'contract_signed' | 'project_completed';
  conditions: Record<string, any>;
  active: boolean;
  dateCreated: string;
}

export interface WorkflowAction {
  id: string;
  trigger: string; // WorkflowTrigger ID
  action: 'send_email' | 'send_sms' | 'create_task' | 'update_status' | 'generate_invoice';
  parameters: Record<string, any>;
  delay?: number; // minutes
  sortOrder: number;
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
  active: boolean;
  executionCount: number;
  lastExecuted?: string;
  dateCreated: string;
  dateUpdated: string;
}

// Business intelligence and insights
export interface BusinessInsight {
  id: string;
  type: 'revenue' | 'client' | 'product' | 'service' | 'performance';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical' | 'positive';
  data: Record<string, any>;
  recommendations: string[];
  dateGenerated: string;
  dateRead?: string;
  dismissed: boolean;
}

export interface PerformanceIndicator {
  id: string;
  name: string;
  description: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  lastUpdated: string;
}

// Order and business operations requests
export interface OrderCreateRequest {
  clientId: string;
  type: 'service' | 'product' | 'custom';
  description: string;
  items: Omit<OrderItem, 'id' | 'order' | 'dateCreated'>[];
  notes?: string;
  estimatedDelivery?: string;
}

export interface PaymentCreateRequest {
  orderId?: string;
  invoiceId?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  reference: string;
  description?: string;
}

export interface InvoiceCreateRequest {
  clientId: string;
  orderId?: string;
  description?: string;
  dueDate: string;
  items: Omit<InvoiceItem, 'id' | 'invoice'>[];
  taxRate?: number;
  discountRate?: number;
  notes?: string;
  terms?: string;
}

export interface ContractCreateRequest {
  clientId: string;
  orderId?: string;
  title: string;
  description: string;
  content: string;
  type: 'service_agreement' | 'product_license' | 'retainer' | 'custom';
  value: number;
  startDate: string;
  endDate?: string;
  terms: string;
  cancellationPolicy?: string;
}