// src/lib/api/services.ts

const getApiBaseUrl = () => {
          // Try NEXT_PUBLIC_API_BASE_URL, fallback to window.location.origin
          let base = process.env.NEXT_PUBLIC_API_BASE_URL || '';
          if (!base && typeof window !== 'undefined') {
                    base = window.location.origin;
          }
          // Ensure no trailing slash
          base = base.replace(/\/$/, '');
          return `${base}/api/v1`;
};

const API_BASE_URL = `${getApiBaseUrl()}/api/v1/services`;


export interface ServiceResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Service[];
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory: string;
  description: string;
  pricing_model: string;
  starting_at: string;
  currency: string;
  timeline: string;
  featured: boolean;
  min_price: number;
  pricing_tiers_count: number;
}

export interface PricingTier {
  id: string;
  service: string;
  name: string;
  price: string;
  currency: string;
  unit: string;
  estimated_delivery?: string;
  recommended: boolean;
  sort_order: number;
}

export interface ServiceFAQ {
  id: string;
  service: string;
  question: string;
  answer: string;
  sort_order: number;
}

export interface ProcessStep {
  id: string;
  service: string;
  step_order: number;
  title: string;
  description?: string;
  icon_class?: string;
}

export class ServicesAPI {
  static async getServices(params?: { 
    page?: number; 
    limit?: number; 
    category?: string; 
    featured?: boolean 
  }): Promise<ServiceResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.featured !== undefined) searchParams.append('featured', params.featured.toString());

    const url = `${API_BASE_URL}/services/?${searchParams.toString()}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch services: ${response.status}`);
    }
    
    return response.json();
  }

  static async getService(id: string): Promise<Service> {
    const response = await fetch(`${API_BASE_URL}/services/${id}/`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch service: ${response.status}`);
    }
    
    return response.json();
  }

  static async getPricingTiers(serviceId: string): Promise<PricingTier[]> {
    const response = await fetch(`${API_BASE_URL}/pricing-tiers/?service=${serviceId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch pricing tiers: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results || [];
  }

  static async getFAQs(serviceId: string): Promise<ServiceFAQ[]> {
    const response = await fetch(`${API_BASE_URL}/faqs/?service=${serviceId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch FAQs: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results || [];
  }

  static async getProcessSteps(serviceId: string): Promise<ProcessStep[]> {
    const response = await fetch(`${API_BASE_URL}/process-steps/?service=${serviceId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch process steps: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results || [];
  }

  static async getServicesByCategory(category: string): Promise<Service[]> {
    const response = await this.getServices({ category });
    return response.results;
  }

  static async getFeaturedServices(): Promise<Service[]> {
    const response = await this.getServices({ featured: true });
    return response.results;
  }
}
