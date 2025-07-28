// types/products.ts
// Products and Digital Assets Management Types

import { Tag } from "./blog";
import { Technology } from "./projects";

export type ProductType = 'website_template' | 'web_app' | 'component' | 'theme' | 'plugin' | 'tool';
export type ProductLicenseType = 'single_use' | 'multi_use' | 'unlimited' | 'open_source';
export type PurchaseStatus = 'pending' | 'completed' | 'refunded' | 'failed';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  type: ProductType;
  description: string;
  shortDescription?: string;
  creator: string; // User ID
  baseProject?: string; // Project ID
  imageUrl?: string;
  price: number;
  currency: string;
  demoUrl?: string;
  downloadUrl?: string;
  repositoryUrl?: string;
  documentationUrl?: string;
  featured: boolean;
  active: boolean;
  downloadCount: number;
  version: string;
  licenseType: ProductLicenseType;
  requirements?: string;
  installationNotes?: string;
  dateCreated: string;
  dateUpdated: string;
}

export interface ProductWithDetails extends Product {
  creatorDetails: {
    id: string;
    email: string;
    fullName: string;
  };
  baseProjectDetails?: {
    id: string;
    title: string;
    slug: string;
  };
  technologies: Technology[];
  tags: Tag[];
  galleryImages: ProductGalleryImage[];
  reviews: ProductReview[];
  purchases: ProductPurchase[];
  updates: ProductUpdate[];
  averageRating: number;
  reviewsCount: number;
  purchasesCount: number;
  totalRevenue: number;
}

export interface ProductGalleryImage {
  id: number;
  product: string; // Product ID
  imageUrl: string;
  altText?: string;
  sortOrder: number;
}

export interface ProductTechnology {
  product: string; // Product ID
  technology: number; // Technology ID
}

export interface ProductTag {
  product: string; // Product ID
  tag: number; // Tag ID
}

export interface ProductPurchase {
  id: string;
  product: string; // Product ID
  client: string; // User ID
  purchaseAmount: number;
  currency: string;
  status: PurchaseStatus;
  downloadCount: number;
  downloadLimit?: number;
  licenseKey?: string;
  expiresAt?: string;
  paymentMethod?: string;
  transactionId?: string;
  dateCreated: string;
  dateUpdated: string;
}

export interface ProductPurchaseWithDetails extends ProductPurchase {
  productDetails: {
    name: string;
    version: string;
    type: ProductType;
    downloadUrl?: string;
  };
  clientDetails: {
    email: string;
    fullName: string;
    companyName?: string;
  };
}

export interface ProductReview {
  id: string;
  product: string; // Product ID
  client: string; // User ID
  rating: number;
  reviewText?: string;
  approved: boolean;
  dateCreated: string;
}

export interface ProductReviewWithDetails extends ProductReview {
  productDetails: {
    name: string;
    category: string;
  };
  clientDetails: {
    email: string;
    fullName: string;
    companyName?: string;
  };
}

export interface ProductUpdate {
  id: string;
  product: string; // Product ID
  version: string;
  title: string;
  description: string;
  downloadUrl?: string;
  isMajor: boolean;
  dateCreated: string;
}

// Product creation and management
export interface ProductCreateRequest {
  name: string;
  category: string;
  type: ProductType;
  description: string;
  shortDescription?: string;
  baseProjectId?: string;
  imageUrl?: string;
  price: number;
  currency?: string;
  demoUrl?: string;
  downloadUrl?: string;
  repositoryUrl?: string;
  documentationUrl?: string;
  featured?: boolean;
  active?: boolean;
  version?: string;
  licenseType?: ProductLicenseType;
  requirements?: string;
  installationNotes?: string;
  technologyIds?: number[];
  tagIds?: number[];
  galleryImages?: Omit<ProductGalleryImage, 'id' | 'product'>[];
}

export interface ProductUpdateRequest {
  name?: string;
  category?: string;
  type?: ProductType;
  description?: string;
  shortDescription?: string;
  baseProjectId?: string;
  imageUrl?: string;
  price?: number;
  currency?: string;
  demoUrl?: string;
  downloadUrl?: string;
  repositoryUrl?: string;
  documentationUrl?: string;
  featured?: boolean;
  active?: boolean;
  version?: string;
  licenseType?: ProductLicenseType;
  requirements?: string;
  installationNotes?: string;
  technologyIds?: number[];
  tagIds?: number[];
  galleryImages?: Omit<ProductGalleryImage, 'id' | 'product'>[];
}

export interface ProductUpdateCreateRequest {
  productId: string;
  version: string;
  title: string;
  description: string;
  downloadUrl?: string;
  isMajor?: boolean;
}

// Product filtering and search
export interface ProductFilters {
  category?: string;
  type?: ProductType;
  licenseType?: ProductLicenseType;
  featured?: boolean;
  active?: boolean;
  creator?: string;
  priceMin?: number;
  priceMax?: number;
  currency?: string;
  technologies?: number[];
  tags?: number[];
  rating?: number;
  search?: string;
}

export interface ProductSearchParams {
  query?: string;
  filters?: ProductFilters;
  sortBy?: 'name' | 'price' | 'downloadCount' | 'dateCreated' | 'averageRating';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Product statistics and analytics
export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  featuredProducts: number;
  freeProducts: number;
  paidProducts: number;
  totalDownloads: number;
  totalRevenue: number;
  totalPurchases: number;
  totalReviews: number;
  approvedReviews: number;
  averageRating: number;
  productsByCategory: Record<string, number>;
  productsByType: Record<string, number>;
  productsByLicense: Record<string, number>;
  topSellingProducts: Array<{
    id: string;
    name: string;
    downloads: number;
    revenue: number;
  }>;
}

export interface ProductAnalytics {
  productId: string;
  name: string;
  views: number;
  downloads: number;
  purchases: number;
  revenue: number;
  conversionRate: number;
  averageRating: number;
  reviewsCount: number;
  refundRate: number;
  supportTickets: number;
  topReferrers: string[];
  downloadsByCountry: Record<string, number>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    purchases: number;
  }>;
}

// Product reviews and ratings
export interface ProductReviewCreateRequest {
  productId: string;
  rating: number;
  reviewText?: string;
}

export interface ProductReviewModerationRequest {
  reviewIds: string[];
  action: 'approve' | 'reject' | 'delete';
}

export interface ProductRatingStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

// Product licensing and downloads
export interface ProductLicense {
  id: string;
  product: string; // Product ID
  client: string; // User ID
  licenseKey: string;
  licenseType: ProductLicenseType;
  purchaseId: string; // ProductPurchase ID
  isActive: boolean;
  activatedAt?: string;
  expiresAt?: string;
  maxDownloads?: number;
  currentDownloads: number;
  allowedDomains?: string[];
  restrictions?: string[];
  dateCreated: string;
}

export interface ProductDownload {
  id: string;
  product: string; // Product ID
  client: string; // User ID
  license?: string; // ProductLicense ID
  ipAddress: string;
  userAgent: string;
  downloadUrl: string;
  fileSize: number;
  downloadTime: number;
  successful: boolean;
  error?: string;
  dateCreated: string;
}

// Product collections and bundles
export interface ProductCollection {
  id: string;
  name: string;
  description: string;
  slug: string;
  products: string[]; // Product IDs
  featured: boolean;
  active: boolean;
  imageUrl?: string;
  sortOrder: number;
  dateCreated: string;
  dateUpdated: string;
}

export interface ProductCollectionWithDetails extends ProductCollection {
  productDetails: Product[];
  totalProducts: number;
  totalValue: number;
  averageRating: number;
}

export interface ProductBundle {
  id: string;
  name: string;
  description: string;
  slug: string;
  products: string[]; // Product IDs
  originalPrice: number;
  bundlePrice: number;
  savings: number;
  discountPercentage: number;
  currency: string;
  featured: boolean;
  active: boolean;
  imageUrl?: string;
  validUntil?: string;
  maxPurchases?: number;
  currentPurchases: number;
  dateCreated: string;
  dateUpdated: string;
}

export interface ProductBundleWithDetails extends ProductBundle {
  productDetails: Product[];
  totalProducts: number;
}

// Product comparison and recommendations
export interface ProductComparison {
  products: Product[];
  features: Array<{
    name: string;
    values: Record<string, string | boolean>;
  }>;
  priceComparison: Array<{
    productId: string;
    price: number;
    currency: string;
    licenseType: ProductLicenseType;
  }>;
}

export interface ProductRecommendation {
  product: Product;
  score: number;
  reasons: string[];
  similarProducts: Product[];
}

// Product marketplace and selling
export interface ProductMarketplaceSubmission {
  id: string;
  product: string; // Product ID
  submitter: string; // User ID
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  reviewNotes?: string;
  submissionData: Record<string, any>;
  dateSubmitted: string;
  dateReviewed?: string;
  reviewedBy?: string; // User ID
}

export interface ProductCommission {
  id: string;
  product: string; // Product ID
  purchase: string; // ProductPurchase ID
  seller: string; // User ID
  amount: number;
  percentage: number;
  currency: string;
  status: 'pending' | 'paid' | 'cancelled';
  paymentDate?: string;
  paymentMethod?: string;
  dateCreated: string;
}

// Product support and documentation
export interface ProductSupportTicket {
  id: string;
  product: string; // Product ID
  client: string; // User ID
  purchase?: string; // ProductPurchase ID
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_for_client' | 'resolved' | 'closed';
  category: 'installation' | 'bug' | 'feature_request' | 'customization' | 'other';
  assignedTo?: string; // User ID
  resolution?: string;
  dateCreated: string;
  dateUpdated: string;
  dateResolved?: string;
}

export interface ProductDocumentation {
  id: string;
  product: string; // Product ID
  title: string;
  content: string;
  type: 'installation' | 'configuration' | 'api' | 'tutorial' | 'faq';
  version: string;
  featured: boolean;
  sortOrder: number;
  dateCreated: string;
  dateUpdated: string;
}

// Product versioning and updates
export interface ProductVersionHistory {
  product: Product;
  versions: ProductUpdate[];
  currentVersion: string;
  latestVersion: string;
  totalUpdates: number;
  majorUpdates: number;
  minorUpdates: number;
}

export interface ProductChangeLog {
  version: string;
  releaseDate: string;
  changes: Array<{
    type: 'added' | 'changed' | 'deprecated' | 'removed' | 'fixed' | 'security';
    description: string;
  }>;
  downloadUrl?: string;
  breaking: boolean;
}

// Product backup and restoration
export interface ProductBackup {
  id: string;
  product: string; // Product ID
  version: string;
  backupType: 'manual' | 'automatic' | 'pre_update';
  fileUrl: string;
  fileSize: number;
  checksum: string;
  description?: string;
  dateCreated: string;
  expiresAt?: string;
}