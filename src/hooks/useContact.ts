import { useEffect, useState } from 'react';

// Types
export interface ContactInfo {
          id: number;
          brand_name: string;
          email: string;
          phone: string;
          location: string;
          social_links: {
                    ig?: string;
                    git?: string;
                    linkedin?: string;
                    x?: string;
                    reddit?: string;
                    facebook?: string;
                    [key: string]: string | undefined;
          };
          date_created: string;
          date_updated: string;
}

export interface Technology {
          id: number;
          name: string;
          icon_url: string;
          category: string;
}

interface ApiResponse<T> {
          count: number;
          next: string | null;
          previous: string | null;
          results: T[];
}

// Get API Base URL
function getApiBaseUrl(): string {
          return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
}

// Add this function
function isApiResponse<T>(data: any): data is ApiResponse<T> {
          return data && typeof data === 'object' && Array.isArray(data.results);
}


// Contact Info Hook
export function useContact() {
          const [contact, setContact] = useState<ContactInfo | null>(null);
          const [loading, setLoading] = useState(true);
          const [error, setError] = useState<string | null>(null);

          useEffect(() => {
                    async function fetchContactInfo() {
                              try {
                                        setLoading(true);
                                        setError(null);

                                        const response = await fetch(`${getApiBaseUrl()}/api/v1/core/contact-info/`);
                                        if (!response.ok) {
                                                  throw new Error(`Failed to fetch contact info: ${response.status} ${response.statusText}`);
                                        }

                                        const data = await response.json();
                                        if (isApiResponse<ContactInfo>(data)) {
                                                  setContact(data.results[0] || null);
                                        } else if (Array.isArray(data)) {
                                                  setContact(data[0] || null);
                                        } else {
                                                  setContact(null);
                                        }
                              } catch (err) {
                                        const errorMessage = err instanceof Error ? err.message : 'Failed to load contact info';
                                        setError(errorMessage);
                                        console.error('Contact info fetch error:', err);
                              } finally {
                                        setLoading(false);
                              }
                    }

                    fetchContactInfo();
          }, []);

          return { contact, loading, error };
}

// Technologies Hook
export function useTechnologies() {
          const [technologies, setTechnologies] = useState<Technology[]>([]);
          const [loading, setLoading] = useState(true);
          const [error, setError] = useState<string | null>(null);

          useEffect(() => {
                    async function fetchTechnologies() {
                              try {
                                        setLoading(true);
                                        setError(null);

                                        const response = await fetch(`${getApiBaseUrl()}/api/v1/projects/technologies/`);

                                        if (!response.ok) {
                                                  throw new Error(`Failed to fetch technologies: ${response.status} ${response.statusText}`);
                                        }

                                        const data: ApiResponse<Technology> = await response.json();

                                        // Handle both paginated and direct array responses
                                        if (data.results && Array.isArray(data.results)) {
                                                  setTechnologies(data.results);
                                        } else if (Array.isArray(data)) {
                                                  // Handle direct array response
                                                  setTechnologies(data as Technology[]);
                                        } else {
                                                  setTechnologies([]);
                                        }

                              } catch (err) {
                                        const errorMessage = err instanceof Error ? err.message : 'Failed to load technologies';
                                        setError(errorMessage);
                                        console.error('Technologies fetch error:', err);
                              } finally {
                                        setLoading(false);
                              }
                    }

                    fetchTechnologies();
          }, []);

          return { technologies, loading, error };
}

// Combined Hook (Optional - for components that need both)
export function useFooterData() {
          const contactData = useContact();
          const techData = useTechnologies();

          return {
                    contact: contactData.contact,
                    technologies: techData.technologies,
                    loading: contactData.loading || techData.loading,
                    error: contactData.error || techData.error,
                    contactLoading: contactData.loading,
                    techLoading: techData.loading,
                    contactError: contactData.error,
                    techError: techData.error,
          };
}