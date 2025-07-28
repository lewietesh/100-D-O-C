# Hero - heading 1, sub-heading, cta_link, cta_text, date_created 
# About -  title, description, media_url, socials_urls - ( JSON), 
# Clients - userId, orders, acc_balance, testimonials, industry / domain
# Reviews  
I haven't categorically developed types and variables for the model but it needs to have a relationship with clients moreso. 
 

# Project 
 Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  domain: string;
  client: string;
  image: string;
  gallery?: string[]; // Additional project images
  description: string;
  content?: string; // Detailed description/case study
  technologies?: ProjectTech[];
  url?: string;
  repositoryUrl?: string; // For open source projects
  likes?: number;
  reviews?: string[];
  comments?: ProjectComment[];
  featured?: boolean;
  completionDate?: string;
  status: 'ongoing' | 'completed' | 'maintenance';
  createdAt: string;
  updatedAt?: string;
}

ProjectTech {
  name: string;
  icon?: string;
}


ProjectComment {
  id: string;
  name: string;
  email?: string;
  message: string;
  createdAt: string;
  approved?: boolean;
}

# BlogPost
  id: string;
  title: string;
  slug: string;
  date: string;
  category: string;
  tags?: string[];
  author: string;
  authorId: string;
  image: string;
  excerpt: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  comments?: BlogComment[];
  viewCount?: number;
  featured?: boolean;
  updatedAt?: string;
# BlogComments {  
  id: string;
  name: string;
  email?: string;
  message: string;
  createdAt: string;
  approved: boolean;
  }


# ServiceFeature {
  id: string;
  title: string;
  description: string;
  included: boolean;
}
# PricingTier {
  id: string;
  name: string; // e.g., "Basic", "Standard", "Premium"
  price: number;
  currency: string; // e.g., "USD", "KES"
  unit: string; // e.g., "per page", "per hour", "per project", "starting at"
  features: ServiceFeature[];
  estimatedDelivery?: string; // e.g., "2-3 days", "1 week"
  recommended?: boolean;
}

# ServiceFAQ {
  serviceID: string (fk)
  question: string;
  answer: string;
}

# Service {
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
#User - userId, email, phone, password, date_created, Orders (Optional), Blogs (Optional),Notifications (Optional), Services (Optional), Testimonials (Optional), Projects (Optional)
# Notifications
 Notification {
  id: string;
  type: 'order' | 'contact' | 'system';
  title: string;
  subject: string;
  message: string;
  read: boolean;
  resourceId?: string; // ID of related resource (order, contact, etc.)
  resourceType?: string; // Type of related resource
  createdAt: string;
}
# Contacts

ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}