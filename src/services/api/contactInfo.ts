// API Service for Contact Info and Technologies

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

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

// Fetch Contact Info
export async function fetchContactInfo(): Promise<ContactInfo | null> {
  try {
    // Ensure trailing slash for Django compatibility
    const url = `${API_BASE_URL}/api/v1/core/contact-info/`;
    console.log('Fetching contact info from:', url);
    
    const response = await fetch(url, { 
      next: { revalidate: 300 }, // Cache for 5 minutes
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Contact info response:', data);
    
    // Handle different response formats
    if (data.results && Array.isArray(data.results)) {
      return data.results.length > 0 ? data.results[0] : null;
    } else if (Array.isArray(data)) {
      return data.length > 0 ? data[0] : null;
    } else if (data.id) {
      return data;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to fetch contact info:', error);
    return null;
  }
}

// Fetch Technologies
export async function fetchTechnologies(): Promise<Technology[]> {
  try {
    const url = `${API_BASE_URL}/api/v1/projects/technologies/`;
    console.log('Fetching technologies from:', url);
    
    const response = await fetch(url, { 
      next: { revalidate: 600 }, // Cache for 10 minutes
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Technologies response:', data);
    
    // Handle different response formats
    if (data.results && Array.isArray(data.results)) {
      return data.results;
    } else if (Array.isArray(data)) {
      return data;
    }
    
    return [];
  } catch (error) {
    console.error('Failed to fetch technologies:', error);
    return [];
  }
}

// Utility function to get API base URL
export function getApiBaseUrl(): string {
  return API_BASE_URL;
}

// Health check function
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health/`, { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return response.ok;
  } catch {
    return false;
  }
}