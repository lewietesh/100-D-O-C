// hooks/useAboutPageData.ts
import { useState, useEffect } from 'react';
import { 
  ContactInfo,
  WhyChooseUs,
  WorkExperience,
  AboutStats,
  RoadMapMilestone,
  AboutPageData,
  ApiResponse 
} from '@/types/about';

// Add the new interface for About Section matching your API
interface AboutSection {
  id: number;
  title: string;
  description: string;
  media_url: string;
  socials_urls: any;
  date_created: string;
}

// Updated AboutPageData interface
interface ExtendedAboutPageData extends AboutPageData {
  aboutSection: AboutSection | null;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export function useAboutPageData() {
  const [data, setData] = useState<ExtendedAboutPageData>({
    contactInfo: null,
    whyChooseUs: [],
    workExperience: [],
    aboutStats: [],
    roadMap: [],
    aboutSection: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAboutData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel, including the new about section
        const [
          contactResponse,
          whyChooseResponse,
          workExperienceResponse,
          statsResponse,
          roadMapResponse,
          aboutSectionResponse
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/api/v1/core/contact-info/`),
          fetch(`${API_BASE_URL}/api/v1/core/why-choose-us/`),
          fetch(`${API_BASE_URL}/api/v1/core/work-experience/`),
          fetch(`${API_BASE_URL}/api/v1/core/about-stats/`),
          fetch(`${API_BASE_URL}/api/v1/core/roadmap/`),
          fetch(`${API_BASE_URL}/api/v1/core/about-sections/`) // Removed /latest
        ]);

        // Parse responses
        const contactData: ApiResponse<ContactInfo> = contactResponse.ok 
          ? await contactResponse.json()
          : { count: 0, next: null, previous: null, results: [] };

        const whyChooseData: ApiResponse<WhyChooseUs> = whyChooseResponse.ok 
          ? await whyChooseResponse.json()
          : { count: 0, next: null, previous: null, results: [] };

        const workExperienceData: ApiResponse<WorkExperience> = workExperienceResponse.ok 
          ? await workExperienceResponse.json()
          : { count: 0, next: null, previous: null, results: [] };

        const statsData: ApiResponse<AboutStats> = statsResponse.ok 
          ? await statsResponse.json()
          : { count: 0, next: null, previous: null, results: [] };

        const roadMapData: ApiResponse<RoadMapMilestone> = roadMapResponse.ok 
          ? await roadMapResponse.json()
          : { count: 0, next: null, previous: null, results: [] };

        // Parse about section data
        let aboutSectionData: AboutSection | null = null;
        if (aboutSectionResponse.ok) {
          const response = await aboutSectionResponse.json();
          // Handle the API response structure you showed
          if (response.results && Array.isArray(response.results) && response.results.length > 0) {
            aboutSectionData = response.results[0]; // Get the first result
          } else if (response.count && response.count > 0 && response.results) {
            aboutSectionData = response.results[0];
          }
        }

        // Set processed data
        setData({
          contactInfo: contactData.results.length > 0 ? contactData.results[0] : null,
          whyChooseUs: whyChooseData.results
            .filter(item => item.is_active)
            .sort((a, b) => a.display_order - b.display_order),
          workExperience: workExperienceData.results
            .sort((a, b) => {
              // Sort by start date (newest first)
              const aDate = new Date(a.start_year, a.start_month - 1);
              const bDate = new Date(b.start_year, b.start_month - 1);
              return bDate.getTime() - aDate.getTime();
            }),
          aboutStats: statsData.results
            .filter(item => item.is_active)
            .sort((a, b) => a.display_order - b.display_order),
          roadMap: roadMapData.results
            .filter(item => item.is_active)
            .sort((a, b) => a.display_order - b.display_order),
          aboutSection: aboutSectionData
        });

      } catch (err) {
        console.error('Error fetching about page data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load page data');
      } finally {
        setLoading(false);
      }
    }

    fetchAboutData();
  }, []);

  return { data, loading, error };
}