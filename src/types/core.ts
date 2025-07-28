// types/core.ts
// Core System Types and Shared Utilities

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: string;
  timestamp: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message?: string;
  timestamp: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  code?: string;
  details?: Record<string, any>;
  timestamp: string;
}

// Pagination and filtering
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
}

export interface BaseListParams extends PaginationParams, SortParams, SearchParams {
  fields?: string[];
  include?: string[];
  exclude?: string[];
}

// Database and model types
export interface BaseModel {
  id: string;
  dateCreated: string;
  dateUpdated: string;
}

export interface TimestampedModel {
  dateCreated: string;
  dateUpdated: string;
}

export interface SoftDeleteModel {
  isDeleted: boolean;
  dateDeleted?: string;
  deletedBy?: string;
}

// File and media types
export interface FileUpload {
  file: File;
  name?: string;
  description?: string;
  tags?: string[];
}

export interface UploadedFile {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  fileUrl: string;
  thumbnailUrl?: string;
  description?: string;
  tags: string[];
  uploadedBy: string; // User ID
  dateUploaded: string;
}

export interface MediaGallery {
  id: string;
  name: string;
  description?: string;
  files: UploadedFile[];
  totalFiles: number;
  totalSize: number;
  isPublic: boolean;
  dateCreated: string;
  dateUpdated: string;
}

// Notification and messaging types
export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type NotificationChannel = 'email' | 'sms' | 'push' | 'in_app';

export interface Notification {
  id: string;
  recipient: string; // User ID
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  dateRead?: string;
  dateCreated: string;
  expiresAt?: string;
}

export interface NotificationPreferences {
  userId: string;
  email: {
    orders: boolean;
    payments: boolean;
    projects: boolean;
    marketing: boolean;
    security: boolean;
  };
  sms: {
    urgent: boolean;
    payments: boolean;
    security: boolean;
  };
  push: {
    orders: boolean;
    messages: boolean;
    updates: boolean;
  };
  inApp: {
    all: boolean;
    mentions: boolean;
    assignments: boolean;
  };
}

// Activity and audit logging
export interface ActivityLog {
  id: string;
  user?: string; // User ID
  action: string;
  resource: string;
  resourceId: string;
  description: string;
  metadata: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

export interface AuditTrail {
  id: string;
  table: string;
  recordId: string;
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  changedBy: string; // User ID
  timestamp: string;
  reason?: string;
}

// System configuration and settings
export interface SystemSettings {
  id: string;
  category: string;
  key: string;
  value: any;
  dataType: 'string' | 'number' | 'boolean' | 'json' | 'array';
  description?: string;
  isPublic: boolean;
  isEditable: boolean;
  dateCreated: string;
  dateUpdated: string;
}

export interface FeatureFlag {
  id: string;
  name: string;
  key: string;
  description: string;
  enabled: boolean;
  enabledFor?: string[]; // User IDs or roles
  percentage?: number; // Rollout percentage
  environment: 'development' | 'staging' | 'production';
  dateCreated: string;
  dateUpdated: string;
}

// Cache and performance types
export interface CacheEntry {
  key: string;
  value: any;
  ttl: number;
  createdAt: string;
  expiresAt: string;
}

export interface PerformanceMetric {
  id: string;
  endpoint: string;
  method: string;
  responseTime: number;
  statusCode: number;
  userAgent?: string;
  ipAddress?: string;
  timestamp: string;
}

// Validation and form types
export interface ValidationRule {
  field: string;
  rules: Array<{
    type: 'required' | 'email' | 'min' | 'max' | 'pattern' | 'custom';
    value?: any;
    message: string;
  }>;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'file' | 'date';
  required: boolean;
  placeholder?: string;
  defaultValue?: any;
  options?: Array<{ label: string; value: any }>;
  validation?: ValidationRule[];
  helpText?: string;
  disabled?: boolean;
  hidden?: boolean;
}

export interface DynamicForm {
  id: string;
  name: string;
  title: string;
  description?: string;
  fields: FormField[];
  submitUrl: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH';
  redirectUrl?: string;
  emailNotification?: boolean;
  active: boolean;
  dateCreated: string;
  dateUpdated: string;
}

// Geographic and location types
export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
}

export interface Location {
  id: string;
  name: string;
  address: Address;
  type: 'office' | 'client' | 'meeting' | 'event' | 'other';
  description?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  timezone: string;
  active: boolean;
  dateCreated: string;
}

// Integration and webhook types
export interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  method: 'POST' | 'PUT' | 'PATCH';
  events: string[];
  headers?: Record<string, string>;
  secret?: string;
  active: boolean;
  retryCount: number;
  timeout: number;
  dateCreated: string;
  dateUpdated: string;
}

export interface WebhookDelivery {
  id: string;
  endpoint: string; // WebhookEndpoint ID
  event: string;
  payload: Record<string, any>;
  attempt: number;
  responseStatus?: number;
  responseBody?: string;
  error?: string;
  successful: boolean;
  dateCreated: string;
  dateDelivered?: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  userId: string;
  permissions: string[];
  rateLimit: number;
  usageCount: number;
  lastUsed?: string;
  expiresAt?: string;
  active: boolean;
  dateCreated: string;
}

// Search and indexing types
export interface SearchIndex {
  id: string;
  name: string;
  type: 'blog' | 'project' | 'product' | 'service' | 'user';
  fields: string[];
  weights: Record<string, number>;
  filters: string[];
  lastUpdated: string;
}

export interface SearchResult {
  id: string;
  type: string;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  score: number;
  highlights: Record<string, string[]>;
  metadata: Record<string, any>;
}

export interface SearchQuery {
  query: string;
  type?: string[];
  filters?: Record<string, any>;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  highlight?: boolean;
  facets?: string[];
}

// Backup and recovery types
export interface BackupJob {
  id: string;
  name: string;
  type: 'database' | 'files' | 'full';
  schedule: string; // cron expression
  retention: number; // days
  compression: boolean;
  encryption: boolean;
  destination: 's3' | 'local' | 'ftp';
  config: Record<string, any>;
  active: boolean;
  lastRun?: string;
  nextRun?: string;
  dateCreated: string;
}

export interface BackupRecord {
  id: string;
  job: string; // BackupJob ID
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  startTime: string;
  endTime?: string;
  duration?: number;
  fileSize?: number;
  filePath?: string;
  error?: string;
  metadata: Record<string, any>;
}

// Health monitoring and status types
export interface HealthCheck {
  id: string;
  name: string;
  type: 'database' | 'api' | 'service' | 'disk' | 'memory' | 'custom';
  url?: string;
  timeout: number;
  interval: number;
  retryCount: number;
  alertThreshold: number;
  active: boolean;
  dateCreated: string;
}

export interface HealthStatus {
  id: string;
  check: string; // HealthCheck ID
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  responseTime?: number;
  message?: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface SystemStatus {
  overall: 'operational' | 'degraded' | 'outage';
  services: Array<{
    name: string;
    status: 'operational' | 'degraded' | 'outage';
    uptime: number;
    lastIncident?: string;
  }>;
  incidents: Array<{
    id: string;
    title: string;
    status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
    severity: 'minor' | 'major' | 'critical';
    startTime: string;
    endTime?: string;
  }>;
  maintenance: Array<{
    id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    impact: 'none' | 'minor' | 'major';
  }>;
}

// Rate limiting and throttling
export interface RateLimit {
  id: string;
  name: string;
  key: string;
  limit: number;
  window: number; // seconds
  burst?: number;
  blockDuration?: number; // seconds
  whitelist?: string[];
  blacklist?: string[];
  active: boolean;
  dateCreated: string;
}

export interface RateLimitHit {
  id: string;
  rateLimit: string; // RateLimit ID
  identifier: string;
  requests: number;
  blocked: boolean;
  resetTime: string;
  timestamp: string;
}

// Task queue and job processing
export interface Task {
  id: string;
  name: string;
  type: string;
  payload: Record<string, any>;
  priority: 'low' | 'normal' | 'high' | 'critical';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  attempts: number;
  maxAttempts: number;
  runAt: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
  result?: any;
  dateCreated: string;
}

export interface TaskQueue {
  id: string;
  name: string;
  concurrency: number;
  retryDelay: number;
  maxRetries: number;
  active: boolean;
  stats: {
    pending: number;
    running: number;
    completed: number;
    failed: number;
  };
}

// Content delivery and CDN
export interface CdnConfiguration {
  id: string;
  name: string;
  provider: 'cloudflare' | 'aws' | 'azure' | 'custom';
  endpoint: string;
  zone: string;
  apiKey?: string;
  cacheSettings: {
    ttl: number;
    edgeTtl: number;
    browserTtl: number;
  };
  compressionEnabled: boolean;
  minifyEnabled: boolean;
  active: boolean;
  dateCreated: string;
}

// Utility types and helpers
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type PickRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type Nullable<T> = T | null;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type CreateRequest<T> = Omit<T, 'id' | 'dateCreated' | 'dateUpdated'>;

export type UpdateRequest<T> = Partial<Omit<T, 'id' | 'dateCreated' | 'dateUpdated'>>;

// Common enums and constants
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const MIME_TYPES = {
  JSON: 'application/json',
  XML: 'application/xml',
  PDF: 'application/pdf',
  ZIP: 'application/zip',
  TEXT: 'text/plain',
  HTML: 'text/html',
  CSS: 'text/css',
  JS: 'application/javascript',
  IMAGE_JPEG: 'image/jpeg',
  IMAGE_PNG: 'image/png',
  IMAGE_GIF: 'image/gif',
  IMAGE_SVG: 'image/svg+xml',
  VIDEO_MP4: 'video/mp4',
  AUDIO_MP3: 'audio/mpeg',
} as const;

export const CURRENCIES = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  KSH: 'Kenyan Shilling',
  CAD: 'Canadian Dollar',
  AUD: 'Australian Dollar',
  JPY: 'Japanese Yen',
  CHF: 'Swiss Franc',
} as const;

export const TIMEZONES = {
  UTC: 'UTC',
  EST: 'America/New_York',
  CST: 'America/Chicago',
  MST: 'America/Denver',
  PST: 'America/Los_Angeles',
  GMT: 'Europe/London',
  CET: 'Europe/Berlin',
  EAT: 'Africa/Nairobi',
  IST: 'Asia/Kolkata',
  JST: 'Asia/Tokyo',
} as const;