// Raw API service type for backend response mapping
export interface ApiService {
  id: string;
  name: string;
  slug: string;
  category?: string;
  subcategory?: string;
  description?: string;
  pricing_model?: string;
  starting_at?: string;
  currency?: string;
  timeline?: string;
  featured?: boolean;
  min_price?: number;
  pricing_tiers_count?: number;
}
// app/models/services.model.ts
export interface ServiceFeature {
  id: string;
  title: string;
  description: string;
  included: boolean;
}

export interface PricingTier {
  id: string;
  name: string; // e.g., "Basic", "Standard", "Premium"
  price: number;
  currency: string; // e.g., "USD", "KES"
  unit: string; // e.g., "per page", "per hour", "per project", "starting at"
  features: ServiceFeature[];
  estimatedDelivery?: string; // e.g., "2-3 days", "1 week"
  recommended?: boolean;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  category: "Dissertation" | "Research Papers" | "Course Projects" | "IT and Programming" | "Web Applications" | "Data Science and Machine Learning" | "Other";
  subcategory?: string;
  description: string;
  shortDescription?: string;
  imgUrl: string;
  bannerUrl?: string;
  iconUrl?: string;
  pricing: {
    model: "fixed" | "tiered" | "custom" | "hourly" | "per-page";
    tiers?: PricingTier[];
    startingAt?: number; // For custom pricing
    currency?: string;
  };
  deliverables?: string[];
  timeline?: string;
  process?: {
    step: number;
    title: string;
    description: string;
  }[];
  tools?: string[];
  faqs?: ServiceFAQ[];
  popularFor?: string[]; // Common use cases
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}