// app/data/services.ts
import { Service } from '@/app/models/services.model';

export const services: Service[] = [
  // Dissertation Services
  {
    id: "serv-diss-1",
    name: "Dissertation Writing & Consultation",
    slug: "dissertation-writing-consultation",
    category: "Dissertation",
    description: "Professional assistance with planning, researching, and writing high-quality dissertations tailored to your academic requirements. Our comprehensive approach ensures original content, proper methodology, and adherence to academic standards.",
    shortDescription: "Expert guidance and writing support for undergraduate and postgraduate dissertations",
    imgUrl: "https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14",
    bannerUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353",
    iconUrl: "/assets/services/dissertation-icon.svg",
    pricing: {
      model: "tiered",
      tiers: [
        {
          id: "diss-basic",
          name: "Topic & Outline",
          price: 200,
          currency: "USD",
          unit: "per project",
          features: [
            {
              id: "df-1",
              title: "Topic exploration and selection",
              description: "In-depth research to identify viable dissertation topics",
              included: true
            },
            {
              id: "df-2",
              title: "Literature review assistance",
              description: "Preliminary literature search and organization",
              included: true
            },
            {
              id: "df-3",
              title: "Detailed dissertation outline",
              description: "Chapter-by-chapter structure with key points",
              included: true
            },
            {
              id: "df-4",
              title: "Methodology recommendation",
              description: "Suggested research methods based on your topic",
              included: true
            },
            {
              id: "df-5",
              title: "Full dissertation writing",
              description: "Complete writing of all dissertation chapters",
              included: false
            }
          ],
          estimatedDelivery: "7-10 days"
        },
        {
          id: "diss-standard",
          name: "Dissertation Chapters",
          price: 30,
          currency: "USD",
          unit: "per page",
          features: [
            {
              id: "df-6",
              title: "Individual chapter writing",
              description: "Write specific chapters as needed",
              included: true
            },
            {
              id: "df-7",
              title: "Literature review",
              description: "Comprehensive review of relevant literature",
              included: true
            },
            {
              id: "df-8",
              title: "Methodology section",
              description: "Detailed research methodology and justification",
              included: true
            },
            {
              id: "df-9",
              title: "Results and analysis",
              description: "Data presentation and in-depth analysis",
              included: true
            },
            {
              id: "df-10",
              title: "Revisions",
              description: "Two rounds of revisions included",
              included: true
            }
          ],
          estimatedDelivery: "2-3 weeks",
          recommended: true
        },
        {
          id: "diss-premium",
          name: "Complete Dissertation",
          price: 2500,
          currency: "USD",
          unit: "starting at",
          features: [
            {
              id: "df-11",
              title: "Full dissertation writing",
              description: "End-to-end dissertation development",
              included: true
            },
            {
              id: "df-12",
              title: "Topic selection and proposal",
              description: "Expert guidance on topic selection and proposal writing",
              included: true
            },
            {
              id: "df-13",
              title: "Data collection assistance",
              description: "Help with designing research instruments",
              included: true
            },
            {
              id: "df-14",
              title: "Statistical analysis",
              description: "Advanced data analysis and visualization",
              included: true
            },
            {
              id: "df-15",
              title: "Unlimited revisions",
              description: "Revisions until satisfaction",
              included: true
            },
            {
              id: "df-16",
              title: "Plagiarism report",
              description: "Detailed originality report included",
              included: true
            }
          ],
          estimatedDelivery: "4-8 weeks"
        }
      ]
    },
    deliverables: [
      "Fully formatted dissertation according to university guidelines",
      "Comprehensive reference list using required citation style",
      "Plagiarism report ensuring originality",
      "Executive summary or abstract"
    ],
    process: [
      {
        step: 1,
        title: "Initial Consultation",
        description: "Discuss your topic, requirements, and timeline"
      },
      {
        step: 2,
        title: "Research and Planning",
        description: "In-depth literature review and methodology design"
      },
      {
        step: 3,
        title: "Writing and Development",
        description: "Chapter-by-chapter writing with regular updates"
      },
      {
        step: 4,
        title: "Review and Revision",
        description: "Multiple rounds of editing and refinement"
      },
      {
        step: 5,
        title: "Finalization",
        description: "Final formatting, referencing, and quality check"
      }
    ],
    faqs: [
      {
        question: "How do you ensure my dissertation is original?",
        answer: "All dissertations are written from scratch and checked with premium plagiarism detection software before delivery."
      },
      {
        question: "Can you help with just specific sections of my dissertation?",
        answer: "Yes, our services are flexible. You can request assistance with individual chapters or sections."
      },
      {
        question: "What citation styles do you support?",
        answer: "We support all major citation styles including APA, MLA, Harvard, Chicago, Vancouver, and any specific style required by your institution."
      }
    ],
    featured: true,
    active: true,
    createdAt: "2024-12-01T00:00:00Z",
    updatedAt: "2025-05-01T12:30:00Z"
  },

  // Research Papers
  {
    id: "serv-research-1",
    name: "Research Paper Writing",
    slug: "research-paper-writing",
    category: "Research Papers",
    description: "Professional academic research paper writing for undergraduate and graduate students. Our research experts deliver well-structured, thoroughly researched papers that meet the highest academic standards.",
    imgUrl: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32",
    pricing: {
      model: "tiered",
      tiers: [
        {
          id: "rp-basic",
          name: "Standard Paper",
          price: 20,
          currency: "USD",
          unit: "per page",
          features: [
            {
              id: "rpf-1",
              title: "Original research",
              description: "Thorough investigation of your topic",
              included: true
            },
            {
              id: "rpf-2",
              title: "Academic formatting",
              description: "Proper formatting in required style",
              included: true
            },
            {
              id: "rpf-3",
              title: "Standard delivery",
              description: "7-10 day turnaround time",
              included: true
            },
            {
              id: "rpf-4",
              title: "One revision",
              description: "One round of revisions included",
              included: true
            }
          ],
          estimatedDelivery: "7-10 days"
        },
        {
          id: "rp-urgent",
          name: "Urgent Paper",
          price: 30,
          currency: "USD",
          unit: "per page",
          features: [
            {
              id: "rpf-5",
              title: "Original research",
              description: "Thorough investigation of your topic",
              included: true
            },
            {
              id: "rpf-6",
              title: "Academic formatting",
              description: "Proper formatting in required style",
              included: true
            },
            {
              id: "rpf-7",
              title: "Express delivery",
              description: "3-5 day turnaround time",
              included: true
            },
            {
              id: "rpf-8",
              title: "Two revisions",
              description: "Two rounds of revisions included",
              included: true
            }
          ],
          estimatedDelivery: "3-5 days",
          recommended: true
        }
      ]
    },
    deliverables: [
      "Complete research paper with proper citations",
      "Reference list in required academic style",
      "Free title page and bibliography"
    ],
    faqs: [
      {
        question: "What academic levels do you cover?",
        answer: "We cover all academic levels from undergraduate to doctoral research papers."
      },
      {
        question: "How do you handle sources and citations?",
        answer: "We use only credible academic sources and format all citations according to your required style guide."
      }
    ],
    featured: false,
    active: true,
    createdAt: "2025-01-15T00:00:00Z"
  },

  // IT and Programming
  {
    id: "serv-it-1",
    name: "Custom Programming Solutions",
    slug: "custom-programming-solutions",
    category: "IT and Programming",
    subcategory: "Software Development",
    description: "Tailored programming solutions for academic projects, businesses, and individual needs. Our experienced developers can help with assignments, create custom applications, or develop specific features for your existing systems.",
    imgUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
    pricing: {
      model: "hourly",
      tiers: [
        {
          id: "it-basic",
          name: "Basic Development",
          price: 50,
          currency: "USD",
          unit: "per hour",
          features: [
            {
              id: "itf-1",
              title: "Custom code development",
              description: "Programming in your required language",
              included: true
            },
            {
              id: "itf-2",
              title: "Code documentation",
              description: "Basic documentation of functionality",
              included: true
            },
            {
              id: "itf-3",
              title: "Bug fixes",
              description: "One round of bug fixes included",
              included: true
            }
          ],
          estimatedDelivery: "Based on project scope"
        },
        {
          id: "it-advanced",
          name: "Advanced Development",
          price: 75,
          currency: "USD",
          unit: "per hour",
          features: [
            {
              id: "itf-4",
              title: "Complex application development",
              description: "Full-scale application programming",
              included: true
            },
            {
              id: "itf-5",
              title: "Comprehensive documentation",
              description: "Detailed code and user documentation",
              included: true
            },
            {
              id: "itf-6",
              title: "Testing and debugging",
              description: "Thorough testing and bug fixing",
              included: true
            },
            {
              id: "itf-7",
              title: "Implementation support",
              description: "Assistance with deployment",
              included: true
            }
          ],
          estimatedDelivery: "Based on project scope",
          recommended: true
        }
      ]
    },
    tools: ["Python", "Java", "JavaScript", "C++", "PHP", "Ruby", "SQL", "Node.js", "React", "Angular", "Django", "Flask"],
    popularFor: [
      "Academic programming assignments",
      "Custom application development",
      "Software feature implementation",
      "Algorithm development and optimization"
    ],
    featured: true,
    active: true,
    createdAt: "2025-02-10T00:00:00Z",
    updatedAt: "2025-04-15T09:20:00Z"
  },

  // Web Applications
  {
    id: "serv-web-1",
    name: "Custom Web Application Development",
    slug: "web-application-development",
    category: "Web Applications",
    description: "End-to-end web application development services using modern technologies and frameworks. From simple websites to complex web platforms, we create responsive, user-friendly, and scalable solutions tailored to your specific requirements.",
    imgUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    bannerUrl: "https://images.unsplash.com/photo-1565106430482-8f6e74349ca1",
    pricing: {
      model: "tiered",
      tiers: [
        {
          id: "web-basic",
          name: "Basic Website",
          price: 1000,
          currency: "USD",
          unit: "per project",
          features: [
            {
              id: "webf-1",
              title: "Responsive design",
              description: "Mobile-friendly layout",
              included: true
            },
            {
              id: "webf-2",
              title: "Up to 5 pages",
              description: "Standard website pages",
              included: true
            },
            {
              id: "webf-3",
              title: "Content management",
              description: "Basic CMS implementation",
              included: true
            },
            {
              id: "webf-4",
              title: "Contact form",
              description: "Standard contact functionality",
              included: true
            }
          ],
          estimatedDelivery: "2-3 weeks"
        },
        {
          id: "web-standard",
          name: "Custom Web Application",
          price: 3500,
          currency: "USD",
          unit: "starting at",
          features: [
            {
              id: "webf-5",
              title: "Custom functionality",
              description: "Tailored features for your specific needs",
              included: true
            },
            {
              id: "webf-6",
              title: "User authentication",
              description: "Secure login and account management",
              included: true
            },
            {
              id: "webf-7",
              title: "Database integration",
              description: "Robust data storage and retrieval",
              included: true
            },
            {
              id: "webf-8",
              title: "Admin dashboard",
              description: "Custom administration interface",
              included: true
            },
            {
              id: "webf-9",
              title: "API development",
              description: "RESTful API endpoints",
              included: true
            }
          ],
          estimatedDelivery: "1-2 months",
          recommended: true
        },
        {
          id: "web-premium",
          name: "Enterprise Web Platform",
          price: 10000,
          currency: "USD",
          unit: "starting at",
          features: [
            {
              id: "webf-10",
              title: "Advanced functionality",
              description: "Complex business logic implementation",
              included: true
            },
            {
              id: "webf-11",
              title: "High scalability",
              description: "Architecture designed for growth",
              included: true
            },
            {
              id: "webf-12",
              title: "Third-party integrations",
              description: "Connection with external services and APIs",
              included: true
            },
            {
              id: "webf-13",
              title: "Advanced security",
              description: "Enhanced protection measures",
              included: true
            },
            {
              id: "webf-14",
              title: "Performance optimization",
              description: "Speed and efficiency tuning",
              included: true
            },
            {
              id: "webf-15",
              title: "Detailed documentation",
              description: "Comprehensive technical documentation",
              included: true
            }
          ],
          estimatedDelivery: "3-6 months"
        }
      ]
    },
    deliverables: [
      "Fully functional web application",
      "Mobile-responsive design",
      "Source code with documentation",
      "Deployment to hosting environment",
      "Basic training on system usage"
    ],
    process: [
      {
        step: 1,
        title: "Requirements Analysis",
        description: "Detailed discussion of your needs and objectives"
      },
      {
        step: 2,
        title: "Design Phase",
        description: "UI/UX design and architecture planning"
      },
      {
        step: 3,
        title: "Development",
        description: "Coding and implementation of features"
      },
      {
        step: 4,
        title: "Testing",
        description: "Quality assurance and bug fixing"
      },
      {
        step: 5,
        title: "Deployment",
        description: "Launch and installation on server"
      },
      {
        step: 6,
        title: "Support",
        description: "Post-launch assistance and maintenance"
      }
    ],
    tools: ["React", "Next.js", "Vue.js", "Angular", "Node.js", "Django", "Laravel", "PostgreSQL", "MongoDB", "AWS", "Vercel", "Netlify"],
    faqs: [
      {
        question: "How long does it take to build a web application?",
        answer: "Timeline varies based on complexity. A simple website might take 2-3 weeks, while complex applications can take several months."
      },
      {
        question: "Do you provide hosting services?",
        answer: "We don't provide hosting directly but can deploy your application to your preferred hosting provider and help set everything up."
      },
      {
        question: "What happens if I need changes after the project is completed?",
        answer: "We offer maintenance and support services for ongoing updates and improvements after launch."
      }
    ],
    featured: true,
    active: true,
    createdAt: "2024-11-15T00:00:00Z",
    updatedAt: "2025-04-20T14:15:00Z"
  },

  // Data Science and Machine Learning
  {
    id: "serv-ds-1",
    name: "Data Science & Machine Learning Solutions",
    slug: "data-science-machine-learning",
    category: "Data Science and Machine Learning",
    description: "Expert data science and machine learning services for academic, research, and business needs. From data analysis and visualization to predictive modeling and AI algorithm development, we provide comprehensive solutions to extract insights from your data.",
    imgUrl: "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d",
    pricing: {
      model: "custom",
      startingAt: 500,
      currency: "USD"
    },
    deliverables: [
      "Clean, processed datasets",
      "Statistical analysis reports",
      "Custom ML models with documentation",
      "Visualizations and dashboards",
      "Technical documentation and methodology explanation"
    ],
    process: [
      {
        step: 1,
        title: "Data Assessment",
        description: "Evaluation of available data and requirements"
      },
      {
        step: 2,
        title: "Data Preparation",
        description: "Cleaning, preprocessing, and feature engineering"
      },
      {
        step: 3,
        title: "Model Development",
        description: "Algorithm selection and model training"
      },
      {
        step: 4,
        title: "Evaluation & Refinement",
        description: "Performance assessment and optimization"
      },
      {
        step: 5,
        title: "Deployment & Documentation",
        description: "Implementation and comprehensive documentation"
      }
    ],
    tools: ["Python", "R", "TensorFlow", "PyTorch", "scikit-learn", "Pandas", "NumPy", "Matplotlib", "Tableau", "Power BI", "SQL", "Jupyter"],
    popularFor: [
      "Academic research projects",
      "Predictive analytics",
      "Business intelligence solutions",
      "Computer vision applications",
      "Natural language processing",
      "Time series forecasting"
    ],
    faqs: [
      {
        question: "What types of data science projects do you handle?",
        answer: "We work with various projects including predictive modeling, classification, clustering, regression analysis, time series forecasting, natural language processing, and computer vision."
      },
      {
        question: "How do you price data science projects?",
        answer: "Data science projects are priced based on complexity, data volume, required accuracy, timeline, and deliverables. We provide custom quotes after an initial consultation."
      }
    ],
    featured: true,
    active: true,
    createdAt: "2025-01-25T00:00:00Z",
    updatedAt: "2025-04-10T11:45:00Z"
  },

  // Course Projects
  {
    id: "serv-course-1",
    name: "Academic Course Project Assistance",
    slug: "course-project-assistance",
    category: "Course Projects",
    description: "Comprehensive support for university course projects across various disciplines. Whether you need help with computer science assignments, engineering projects, business case studies, or creative portfolios, our experts provide guidance and solutions tailored to your course requirements.",
    imgUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
    pricing: {
      model: "custom",
      startingAt: 150,
      currency: "USD"
    },
    deliverables: [
      "Complete project solution as per requirements",
      "Detailed documentation and explanation",
      "Source files and references",
      "Implementation support if needed"
    ],
    tools: ["Based on project requirements"],
    popularFor: [
      "Programming assignments",
      "Engineering design projects",
      "Business case analyses",
      "Research projects",
      "Portfolio development",
      "Technical reports"
    ],
    featured: false,
    active: true,
    createdAt: "2025-03-05T00:00:00Z"
  }
];