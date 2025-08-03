// src/services/api/newsletter.ts
import { getApiBaseUrl } from '@/app/utils/config';

export interface NewsletterSubscribeRequest {
          email: string;
          name?: string;
          source?: string;
}

export interface NewsletterSubscribeResponse {
          detail: string;
          email: string;
          status: string;
}

export interface NewsletterError {
          email?: string[];
          name?: string[];
          non_field_errors?: string[];
          detail?: string;
}

export class NewsletterService {
          private static baseUrl = getApiBaseUrl();

          static async subscribe(data: NewsletterSubscribeRequest): Promise<NewsletterSubscribeResponse> {
                    try {
                              const response = await fetch(
                                        `${this.baseUrl}/api/v1/business/newsletter/subscribe/`,
                                        {
                                                  method: 'POST',
                                                  headers: {
                                                            'Content-Type': 'application/json',
                                                  },
                                                  body: JSON.stringify({
                                                            email: data.email.trim().toLowerCase(),
                                                            name: data.name?.trim() || '',
                                                            source: data.source || 'website',
                                                  }),
                                        }
                              );

                              const responseData = await response.json();

                              if (!response.ok) {
                                        throw {
                                                  status: response.status,
                                                  errors: responseData,
                                        };
                              }

                              return responseData;
                    } catch (error: any) {
                              if (error.status && error.errors) {
                                        throw error;
                              }

                              // Network or other errors
                              throw {
                                        status: 500,
                                        errors: {
                                                  detail: 'Network error. Please check your connection and try again.',
                                        },
                              };
                    }
          }

          static async getStats(): Promise<{
                    total_subscribers: number;
                    active_subscribers: number;
                    unsubscribed: number;
                    subscription_rate: number;
          }> {
                    try {
                              const response = await fetch(
                                        `${this.baseUrl}/api/v1/business/newsletter/stats/`,
                                        {
                                                  method: 'GET',
                                                  headers: {
                                                            'Content-Type': 'application/json',
                                                  },
                                        }
                              );

                              if (!response.ok) {
                                        throw new Error(`HTTP ${response.status}`);
                              }

                              return await response.json();
                    } catch (error) {
                              console.error('Failed to fetch newsletter stats:', error);
                              throw error;
                    }
          }
}
