// src/app/models/projects.model.ts
export interface ProjectComment {
  id: string;
  name: string;
  email?: string;
  message: string;
  createdAt: string;
  approved?: boolean;
}

export interface ProjectTech {
  name: string;
  icon?: string;
}

export interface Project {
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