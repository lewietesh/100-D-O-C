// types/services.ts
// Services and Business Management Types

export type ServicePricingModel = 'fixed' | 'tiered' | 'custom' | 'hourly' | 'per-page';

export interface Service {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory?: string;
  description: string;
  shortDescription?: string;
  imgUrl?: string;
  bannerUrl?: string;
  iconUrl?: string;
  pricingModel: ServicePricingModel;
  startingAt?: number;
  currency: string;
  timeline?: string;
  featured: boolean;
  active: boolean;
  sortOrder: number;
  dateCreated: string;
  dateUpdated: string;
}

export interface ServiceWithDetails extends Service {
  pricingTiers: ServicePricingTier[];
  processSteps: ServiceProcessStep[];
  deliverables: ServiceDeliverable[];
  tools: ServiceTool[];
  popularUseCases: ServicePopularUseCase[];
  faqs: ServiceFAQ[];
  features: ServiceFeature[];
}

export interface ServicePricingTier {
  id: string;
  service: string; // Service ID
  name: string;
  price: number;
  currency: string;
  unit: string;
  estimatedDelivery?: string;
  recommended: boolean;
  sortOrder: number;
}

export interface ServicePricingTierWithFeatures extends ServicePricingTier {
  features: ServiceFeature[];
  featuresIncluded: number;
  featuresExcluded: number;
}

export interface ServiceFeature {
  id: string;
  title: string;
  description?: string;
  iconClass?: string;
  category?: string;
  included: boolean;
}

export interface PricingTierFeature {
  pricingTier: string; // ServicePricingTier ID
  feature: string; // ServiceFeature ID
}

export interface ServiceFAQ {
  id: string;
  service: string; // Service ID
  question: string;
  answer: string;
  sortOrder: number;
}

export interface ServiceProcessStep {
  id: string;
  service: string; // Service ID
  stepOrder: number;
  title: string;
  description?: string;
  iconClass?: string;
}

export interface ServiceDeliverable {
  id: string;
  service: string; // Service ID
  description: string;
  iconClass?: string;
  sortOrder: number;
}

export interface ServiceTool {
  id: string;
  service: string; // Service ID
  toolName: string;
  toolUrl?: string;
  iconUrl?: string;
}

export interface ServicePopularUseCase {
  id: string;
  service: string; // Service ID
  useCase: string;
  description?: string;
}

// Service creation and management
export interface ServiceCreateRequest {
  name: string;
  category: string;
  subcategory?: string;
  description: string;
  shortDescription?: string;
  imgUrl?: string;
  bannerUrl?: string;
  iconUrl?: string;
  pricingModel: ServicePricingModel;
  startingAt?: number;
  currency?: string;
  timeline?: string;
  featured?: boolean;
  active?: boolean;
  sortOrder?: number;
  pricingTiers?: Omit<ServicePricingTier, 'id' | 'service'>[];
  processSteps?: Omit<ServiceProcessStep, 'id' | 'service'>[];
  deliverables?: Omit<ServiceDeliverable, 'id' | 'service'>[];
  tools?: Omit<ServiceTool, 'id' | 'service'>[];
  popularUseCases?: Omit<ServicePopularUseCase, 'id' | 'service'>[];
  faqs?: Omit<ServiceFAQ, 'id' | 'service'>[];
}

export interface ServiceUpdateRequest {
  name?: string;
  category?: string;
  subcategory?: string;
  description?: string;
  shortDescription?: string;
  imgUrl?: string;
  bannerUrl?: string;
  iconUrl?: string;
  pricingModel?: ServicePricingModel;
  startingAt?: number;
  currency?: string;
  timeline?: string;
  featured?: boolean;
  active?: boolean;
  sortOrder?: number;
  pricingTiers?: Omit<ServicePricingTier, 'id' | 'service'>[];
  processSteps?: Omit<ServiceProcessStep, 'id' | 'service'>[];
  deliverables?: Omit<ServiceDeliverable, 'id' | 'service'>[];
  tools?: Omit<ServiceTool, 'id' | 'service'>[];
  popularUseCases?: Omit<ServicePopularUseCase, 'id' | 'service'>[];
  faqs?: Omit<ServiceFAQ, 'id' | 'service'>[];
}

export interface ServiceFeatureCreateRequest {
  title: string;
  description?: string;
  iconClass?: string;
  category?: string;
  included?: boolean;
}

export interface ServiceFeatureUpdateRequest {
  title?: string;
  description?: string;
  iconClass?: string;
  category?: string;
  included?: boolean;
}

// Service filtering and search
export interface ServiceFilters {
  category?: string;
  subcategory?: string;
  pricingModel?: ServicePricingModel;
  featured?: boolean;
  active?: boolean;
  priceMin?: number;
  priceMax?: number;
  currency?: string;
  search?: string;
}

export interface ServiceSearchParams {
  query?: string;
  filters?: ServiceFilters;
  sortBy?: 'name' | 'category' | 'startingAt' | 'dateCreated' | 'sortOrder';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Service statistics and analytics
export interface ServiceStats {
  totalServices: number;
  activeServices: number;
  featuredServices: number;
  servicesByCategory: Record<string, number>;
  servicesByPricingModel: Record<string, number>;
  averageServicePrice: number;
  totalPricingTiers: number;
  totalServiceFeatures: number;
  popularCategories: Array<{
    category: string;
    count: number;
    revenue: number;
  }>;
}

export interface ServiceAnalytics {
  serviceId: string;
  name: string;
  views: number;
  inquiries: number;
  conversions: number;
  revenue: number;
  averageOrderValue: number;
  conversionRate: number;
  topReferrers: string[];
  popularPricingTiers: Array<{
    tierId: string;
    name: string;
    selections: number;
  }>;
}

// Service inquiries and quotes
export interface ServiceInquiry {
  id: string;
  service: string; // Service ID
  pricingTier?: string; // ServicePricingTier ID
  client: string; // User ID
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectDescription: string;
  budget?: number;
  timeline?: string;
  status: 'new' | 'reviewing' | 'quoted' | 'accepted' | 'declined' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string; // User ID
  notes?: string;
  dateCreated: string;
  dateUpdated: string;
}

export interface ServiceQuote {
  id: string;
  inquiry: string; // ServiceInquiry ID
  service: string; // Service ID
  client: string; // User ID
  quotedPrice: number;
  currency: string;
  validUntil: string;
  description: string;
  terms: string;
  deliverables: string[];
  timeline: string;
  status: 'draft' | 'sent' | 'accepted' | 'declined' | 'expired';
  sentAt?: string;
  respondedAt?: string;
  dateCreated: string;
  dateUpdated: string;
}

export interface ServiceInquiryCreateRequest {
  serviceId: string;
  pricingTierId?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectDescription: string;
  budget?: number;
  timeline?: string;
}

// Service packages and bundles
export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  services: string[]; // Service IDs
  discountPercentage: number;
  totalPrice: number;
  packagePrice: number;
  savings: number;
  currency: string;
  featured: boolean;
  active: boolean;
  validUntil?: string;
  dateCreated: string;
  dateUpdated: string;
}

export interface ServicePackageWithDetails extends ServicePackage {
  serviceDetails: Service[];
  totalServicePrice: number;
}

// Service reviews and testimonials
export interface ServiceReview {
  id: string;
  service: string; // Service ID
  client: string; // User ID
  rating: number;
  title: string;
  content: string;
  pros?: string[];
  cons?: string[];
  wouldRecommend: boolean;
  verified: boolean;
  approved: boolean;
  featured: boolean;
  dateCreated: string;
  dateUpdated: string;
}

export interface ServiceReviewWithDetails extends ServiceReview {
  clientDetails: {
    name: string;
    company?: string;
    industry?: string;
    verified: boolean;
  };
  serviceDetails: {
    name: string;
    category: string;
  };
}

export interface ServiceReviewCreateRequest {
  serviceId: string;
  rating: number;
  title: string;
  content: string;
  pros?: string[];
  cons?: string[];
  wouldRecommend: boolean;
}

// Service comparison and selection
export interface ServiceComparison {
  services: Service[];
  features: ServiceFeature[];
  comparisonMatrix: Record<string, Record<string, boolean | string>>;
}

export interface ServiceRecommendation {
  service: Service;
  matchScore: number;
  reasons: string[];
  suggestedTier?: ServicePricingTier;
}

// Service categories and taxonomy
export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconClass?: string;
  parentCategory?: string;
  servicesCount: number;
  featured: boolean;
  sortOrder: number;
}

export interface ServiceTaxonomy {
  categories: ServiceCategory[];
  subcategories: Record<string, ServiceCategory[]>;
  tags: string[];
  pricingModels: Array<{
    value: ServicePricingModel;
    label: string;
    description: string;
  }>;
}