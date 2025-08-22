// types/about.ts
export interface ContactInfo {
  id: number;
  brand_name: string;
  email: string;
  phone: string;
  location: string;
  social_links: {
    x?: string;
    ig?: string;
    git?: string;
    reddit?: string;
    linkedin?: string;
    [key: string]: string | undefined;
  };
  date_created: string;
  date_updated: string;
}

export interface WhyChooseUs {
  id: number;
  reason_title: string;
  reason_description: string;
  icon_name: string;
  display_order: number;
  is_active: boolean;
  date_created: string;
  date_updated: string;
}

export interface WorkExperience {
  id: number;
  company_name: string;
  job_title: string;
  industry: string;
  company_logo?: string;
  company_website?: string;
  start_month: number;
  start_year: number;
  end_month?: number;
  end_year?: number;
  is_current: boolean;
  description: string;
  key_responsibilities?: string[];
  achievements?: string[];
  technology_stack?: string[];
  is_featured: boolean;
  display_order: number;
  duration_text: string;
  duration_months: number;
  date_created: string;
  date_updated: string;
}

export interface AboutStats {
  id: number;
  stat_name: string;
  stat_value: string;
  stat_description: string;
  icon_name: string;
  display_order: number;
  is_active: boolean;
  date_created: string;
  date_updated: string;
}

export interface RoadMapMilestone {
  id: number;
  milestone_title: string;
  milestone_description: string;
  target_date: string | null;
  is_completed: boolean;
  completion_date: string | null;
  icon_name: string;
  display_order: number;
  is_active: boolean;
  date_created: string;
  date_updated: string;
}

export interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface AboutPageData {
  contactInfo: ContactInfo | null;
  whyChooseUs: WhyChooseUs[];
  workExperience: WorkExperience[];
  aboutStats: AboutStats[];
  roadMap: RoadMapMilestone[];
}