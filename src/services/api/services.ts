import { apiRequest } from './projects';

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

export interface ServiceListResponse {
          count: number;
          next: string | null;
          previous: string | null;
          results: Service[];
}

export async function fetchServices(): Promise<ServiceListResponse> {
          return apiRequest<ServiceListResponse>(
                    '/api/v1/services/services/'
          );
}
