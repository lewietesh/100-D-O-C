// src/data/projects.ts

export interface ProjectComment {
        id: string;
        name: string;
        email?: string;
        message: string;
        createdAt: string;
      }
      
      export interface Project {
        id: string;
        title: string;
        slug: string;
        category: string;
        domain: string;
        client: string;
        image: string;
        description: string;
        url?: string;
        likes?: number;
        reviews?: string[];
        comments?: ProjectComment[];
      }
      
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
            },
          ],
        },
        {
          id: '2',
          title: 'Learning Management Tool',
          slug: 'learning-management-tool',
          category: 'E-Learning',
          domain: 'Education',
          client: 'Online Course Startup',
          image: 'https://cdn.pixabay.com/photo/2015/11/17/21/46/navigation-1048294_1280.jpg',
          description: 'Modern platform for managing and delivering online courses with analytics and progress tracking.',
          url: 'https://edu-course-demo.com',
          likes: 200,
          reviews: ['The best LMS we’ve ever used!', 'UI/UX is top-notch.'],
          comments: [],
        },
        {
          id: '3',
          title: 'Studio Workstation Showcase',
          slug: 'studio-workstation-showcase',
          category: 'Workspace',
          domain: 'Design & Production',
          client: 'Freelancer Network',
          image: 'https://cdn.pixabay.com/photo/2017/08/03/13/21/laptop-2576248_1280.jpg',
          description: 'High-end studio setup for showcasing gear, desk layouts, and production tools.',
          url: 'https://studiogear-portfolio.com',
          likes: 75,
          reviews: ['Perfect for creators and streamers.', 'Great layout ideas.'],
          comments: [],
        },
        {
          id: '4',
          title: 'Tech Overload Workspace',
          slug: 'tech-overload-workspace',
          category: 'Remote Work',
          domain: 'Technology',
          client: 'Tech Agency',
          image: 'https://cdn.pixabay.com/photo/2019/06/17/19/48/source-4280758_1280.jpg',
          description: 'A chaotic yet productive setup demonstrating heavy multitasking across multiple devices.',
          url: 'https://remoteworkspace.tech',
          likes: 103,
          reviews: ['This is what remote life looks like!', 'Nice cable management.'],
          comments: [],
        },
        {
          id: '5',
          title: 'Outdoor Freelance Setup',
          slug: 'outdoor-freelance-setup',
          category: 'Freelance',
          domain: 'Mobile Productivity',
          client: 'Independent Creator',
          image: 'https://cdn.pixabay.com/photo/2023/12/15/11/13/programming-8450423_1280.png',
          description: 'A portable yet powerful workspace for remote creators on the move.',
          url: 'https://outdoorfreelance.io',
          likes: 89,
          reviews: ['This is goals!', 'Inspired to work outside now.'],
          comments: [],
        },
      ];
      