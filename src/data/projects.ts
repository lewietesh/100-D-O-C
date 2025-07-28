// src/app/data/projects.ts
import { Project } from '@/app/models/projects.model';

export const projects: Project[] = [
  {
    id: '1',
    title: 'Interior Design Platform',
    slug: 'interior-design-platform',
    category: 'Web Application',
    domain: 'Real Estate & Lifestyle',
    client: 'Interior Studio Client',
    image: 'https://cdn.pixabay.com/photo/2018/04/27/03/51/technology-3353701_1280.jpg',
    description: 'A sleek web platform showcasing high-end interior spaces for booking and inspiration.',
    url: 'https://interiorstudio-demo.com',
    likes: 128,
    reviews: [
      'This platform helped us book our dream space in minutes!',
      'Clean, modern, and user-friendly. Loved it.',
    ],
    comments: [
      {
        id: 'c1',
        name: 'Jane Doe',
        message: 'Incredible work! How long did this take to develop?',
        createdAt: '2025-03-28T10:00:00Z',
        approved: true
      },
    ],
    status: 'completed',
    createdAt: '2025-01-15T00:00:00Z',
    featured: true
  },
  {
    id: '2',
    title: 'E-commerce Mobile App',
    slug: 'ecommerce-mobile-app',
    category: 'Mobile Application',
    domain: 'Retail',
    client: 'Fashion Retailer',
    image: 'https://cdn.pixabay.com/photo/2017/12/02/14/38/contact-form-2993183_1280.jpg',
    description: 'A feature-rich mobile shopping application with AR try-on capabilities for a fashion retailer.',
    technologies: [
      { name: 'React Native' },
      { name: 'Redux' },
      { name: 'Node.js' },
      { name: 'MongoDB' }
    ],
    url: 'https://fashionapp-demo.com',
    likes: 95,
    reviews: [
      'The AR try-on feature is game-changing!',
      'Smooth checkout process and beautiful UI.'
    ],
    status: 'completed',
    createdAt: '2025-02-10T00:00:00Z'
  },
  {
    id: '3',
    title: 'Healthcare Management System',
    slug: 'healthcare-management-system',
    category: 'Web Application',
    domain: 'Healthcare',
    client: 'Regional Hospital',
    image: 'https://cdn.pixabay.com/photo/2017/10/17/20/42/medicine-icon-2862080_1280.png',
    description: 'A comprehensive system for managing patient records, appointments, and hospital resources.',
    technologies: [
      { name: 'React' },
      { name: 'TypeScript' },
      { name: 'Express.js' },
      { name: 'PostgreSQL' }
    ],
    status: 'maintenance',
    createdAt: '2024-11-05T00:00:00Z',
    updatedAt: '2025-04-12T00:00:00Z'
  },
  {
    id: '4',
    title: 'Finance Tracking Dashboard',
    slug: 'finance-tracking-dashboard',
    category: 'Web Application',
    domain: 'Finance',
    client: 'Investment Firm',
    image: 'https://cdn.pixabay.com/photo/2017/10/25/19/45/arrow-2889040_1280.jpg',
    description: 'Real-time financial analytics dashboard with customizable widgets and reporting tools.',
    technologies: [
      { name: 'Vue.js' },
      { name: 'D3.js' },
      { name: 'FastAPI' },
      { name: 'TimescaleDB' }
    ],
    url: 'https://fintrack-demo.com',
    likes: 72,
    status: 'completed',
    createdAt: '2025-03-15T00:00:00Z',
    featured: true
  },
  {
    id: '5',
    title: 'Educational Learning Platform',
    slug: 'educational-learning-platform',
    category: 'Web Application',
    domain: 'Education',
    client: 'Online University',
    image: 'https://cdn.pixabay.com/photo/2019/04/14/09/08/youtube-4126400_1280.jpg',
    description: 'Interactive learning platform with course creation tools, student progress tracking, and certification.',
    technologies: [
      { name: 'Next.js' },
      { name: 'Tailwind CSS' },
      { name: 'Django' },
      { name: 'AWS' }
    ],
    comments: [
      {
        id: 'c2',
        name: 'Education Professional',
        message: 'This platform completely transformed our online learning approach.',
        createdAt: '2025-04-02T14:20:00Z',
        approved: true
      }
    ],
    status: 'ongoing',
    createdAt: '2025-04-01T00:00:00Z'
  },
  {
    id: '6',
    title: 'Smart Home Control App',
    slug: 'smart-home-control-app',
    category: 'Mobile Application',
    domain: 'IoT',
    client: 'Home Automation Company',
    image: 'https://cdn.pixabay.com/photo/2020/04/12/22/24/home-5036497_1280.jpg',
    description: 'Mobile application for controlling and automating smart home devices and monitoring energy usage.',
    technologies: [
      { name: 'Flutter' },
      { name: 'Firebase' },
      { name: 'MQTT' }
    ],
    status: 'completed',
    createdAt: '2025-02-20T00:00:00Z'
  }
];