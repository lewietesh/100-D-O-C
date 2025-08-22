import { apiRequest } from './projects';

export interface ServiceRequestPayload {
          service: string;
          pricing_tier?: string;
          name: string;
          email: string;
          phone?: string;
          company?: string;
          project_description: string;
          budget?: string;
          timeline?: string;
          requirements?: string;
          attachment?: File;
}

export async function submitServiceRequest(data: ServiceRequestPayload): Promise<any> {
          const formData = new FormData();
          formData.append('service', data.service);
          if (data.pricing_tier) formData.append('pricing_tier', data.pricing_tier);
          formData.append('name', data.name);
          formData.append('email', data.email);
          if (data.phone) formData.append('phone', data.phone);
          if (data.company) formData.append('company', data.company);
          formData.append('project_description', data.project_description);
          if (data.budget) formData.append('budget', data.budget);
          if (data.timeline) formData.append('timeline', data.timeline);
          if (data.requirements) formData.append('requirements', data.requirements);
          if (data.attachment) formData.append('attachment', data.attachment);

          return apiRequest<any>('/api/v1/business/service-requests/', {
                    method: 'POST',
                    body: formData,
                    headers: {}, // Let browser set Content-Type for FormData
          });
}
