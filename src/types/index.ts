// types/index.ts
// Main types export file - imports and re-exports all type definitions

// Core system types
export * from './core';

// Authentication and user management
export * from './auth';

// Blog and content management
export * from './blog';

// Projects and portfolio
export * from './projects';

// Services and business offerings
export * from './services';

// Products and digital assets
export * from './products';

// Business operations and management
export * from './business';

// Re-export commonly used types with aliases for convenience
export type {
  User,
  UserRole,
  LoginCredentials,
  AuthResponse,
} from './auth';

export type {
  BlogPost,
  BlogPostStatus,
  Tag,
  BlogComment,
} from './blog';

export type {
  Project,
  ProjectStatus,
  Technology,
  ProjectComment,
} from './projects';

export type {
  Service,
  ServicePricingModel,
  ServicePricingTier,
  ServiceInquiry,
} from './services';

export type {
  Product,
  ProductType,
  ProductLicenseType,
  ProductPurchase,
  PurchaseStatus,
} from './products';

export type {
  Order,
  OrderStatus,
  Payment,
  PaymentStatus,
  Invoice,
  Contract,
} from './business';

export type {
  ApiResponse,
  PaginatedResponse,
  ErrorResponse,
  BaseListParams,
} from './core';

// Global type declarations for the application
declare global {
  interface Window {
    // Add any global window properties here
    APP_CONFIG?: {
      API_URL: string;
      VERSION: string;
      ENVIRONMENT: 'development' | 'staging' | 'production';
    };
  }
}