// src/types/contact.ts
export interface ContactInfo {
          id: string;
          brand_name: string;
          email: string;
          phone?: string;
          location?: string;
          social_links?: {
                    ig?: string;
                    git?: string;
                    linkedin?: string;
                    x?: string;
                    reddit?: string;
                    [key: string]: string | undefined;
          };
          date_created: string;
          date_updated: string;
}
