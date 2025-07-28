// app/data/blogs.ts
import { BlogPost } from '@/app/models/blog.model';

export const blogs: BlogPost[] = [
  {
    id: "blog-1",
    title: 'Customer Onboarding Strategies',
    slug: 'customer-onboarding-strategies',
    date: '2024-11-09',
    category: 'Analytics',
    tags: ['SaaS', 'Onboarding', 'Customer Success'],
    author: "Lewis Admin",
    authorId: "user-1",
    image: 'https://cdn.pixabay.com/photo/2017/01/22/20/51/space-2000945_1280.jpg',
    excerpt: 'Discover essential strategies for effective customer onboarding in SaaS and service-based businesses.',
    content: 'Customer onboarding is the process of getting new users set up and comfortable with your product. A smooth onboarding experience reduces churn and increases user satisfaction.\n\n## Key Onboarding Elements\n\n1. Welcome emails and messages\n2. Interactive product tours\n3. Step-by-step guides\n4. Progress tracking\n5. Early wins and value moments\n\n## Best Practices\n\nFocus on reducing time-to-value for new users. The faster they can accomplish something meaningful, the more likely they are to continue using your product.',
    status: 'published',
    viewCount: 156,
    comments: [
      {
        id: "bc-1",
        name: "Jane Smith",
        email: "jane@example.com",
        message: "Great article! I've implemented some of these strategies and seen a 15% reduction in churn.",
        createdAt: "2024-11-10T08:30:00Z",
        approved: true
      }
    ],
    featured: true
  },
  {
    id: "blog-2",
    title: 'Design Thinking for Product Teams',
    slug: 'design-thinking-for-product-teams',
    date: '2024-10-21',
    category: 'Product',
    tags: ['Design Thinking', 'Product Development', 'UX'],
    author: "Lewis Admin",
    authorId: "user-1",
    image: 'https://cdn.pixabay.com/photo/2020/03/21/23/18/hardware-4955429_1280.jpg',
    excerpt: 'Learn how to integrate design thinking into agile product development to build user-centered solutions.',
    content: 'Design thinking emphasizes empathy, rapid prototyping, and user feedback. For product teams, it\'s a powerful framework to innovate and validate faster with less waste.\n\n## The Design Thinking Process\n\n1. **Empathize**: Understand user needs through research\n2. **Define**: Identify key problems to solve\n3. **Ideate**: Generate creative solutions\n4. **Prototype**: Build quick, low-fidelity versions\n5. **Test**: Get user feedback early and often\n\nIntegrating this approach with agile methodologies creates a powerful framework for building products people actually want to use.',
    status: 'published',
    viewCount: 127,
    comments: [
      {
        id: "bc-2",
        name: "Alex Chen",
        email: "alex@example.com",
        message: "We've been using this approach for the past year and it's transformed how we build products.",
        createdAt: "2024-10-22T14:15:00Z",
        approved: true
      }
    ]
  },
  {
    id: "blog-3",
    title: 'Remote Work Tools Comparison 2024',
    slug: 'remote-work-tools-comparison-2024',
    date: '2024-09-12',
    category: 'Tech Stack',
    tags: ['Remote Work', 'Tools', 'Productivity'],
    author: "Content Editor",
    authorId: "user-2",
    image: 'https://cdn.pixabay.com/photo/2022/04/04/16/23/technology-7111752_1280.jpg',
    excerpt: 'We compared Slack, Zoom, Notion, Trello, and more to help you find the right tools for remote collaboration.',
    content: 'Remote work is here to stay. This guide breaks down essential collaboration tools by use case and pricing, so your distributed team can stay productive without tool overload.\n\n## Communication Tools\n\n- **Slack**: Real-time messaging and channels\n- **Microsoft Teams**: Enterprise-focused communications\n- **Discord**: Community-oriented chat platform\n\n## Video Conferencing\n\n- **Zoom**: Reliable video calls with large groups\n- **Google Meet**: Seamless integration with Google Workspace\n- **Whereby**: No-download browser-based meetings\n\n## Project Management\n\n- **Trello**: Visual kanban boards\n- **Asana**: Comprehensive task management\n- **ClickUp**: All-in-one productivity platform',
    status: 'published',
    viewCount: 289,
    featured: true
  },
  {
    id: "blog-4",
    title: 'The ROI of Great UX Writing',
    slug: 'the-roi-of-great-ux-writing',
    date: '2024-08-02',
    category: 'UX',
    tags: ['UX Writing', 'Conversion', 'Microcopy'],
    author: "Lewis Admin",
    authorId: "user-1",
    image: 'https://cdn.pixabay.com/photo/2022/12/29/15/58/earth-7685220_1280.jpg',
    excerpt: 'Good UX writing isnt just about clarity—it directly improves conversion, trust, and retention.',
    content: 'Copy is design. Clear, helpful microcopy reduces friction, guides users through flows, and creates confidence. See how small wording changes can have outsized business impact.\n\n## Case Studies\n\n1. **Error Messages**: Converting a technical error to a helpful suggestion increased form completions by 26%\n\n2. **CTA Buttons**: Changing "Submit" to "Get Started" improved click-through rates by 14%\n\n3. **Onboarding**: Simplified instructions reduced support tickets by 35%',
    status: 'published',
    viewCount: 94
  },
  {
    id: "blog-5",
    title: 'Building Scalable Design Systems',
    slug: 'building-scalable-design-systems',
    date: '2024-07-18',
    category: 'Design Systems',
    tags: ['Design Systems', 'UI', 'Frontend'],
    author: "Content Editor",
    authorId: "user-2",
    image: 'https://cdn.pixabay.com/photo/2016/10/12/23/23/mining-excavator-1736293_1280.jpg',
    excerpt: 'As your product grows, a robust design system ensures consistency, velocity, and quality across teams.',
    content: 'Design systems go beyond components—they\'re about shared values, usage patterns, and scalability. Learn how to structure and maintain one that evolves with your product.\n\n## Key Elements of a Design System\n\n- **Design Principles**: Core values that guide decisions\n- **Component Library**: Reusable UI elements\n- **Style Guide**: Colors, typography, spacing, etc.\n- **Pattern Library**: Common interaction patterns\n- **Documentation**: Usage guidelines and examples\n\n## Implementation Strategies\n\nStart small with core components and gradually expand. Involve both designers and developers from the beginning to ensure technical feasibility and design integrity.',
    status: 'published',
    viewCount: 112,
    comments: [
      {
        id: "bc-3",
        name: "Michael Johnson",
        email: "michael@example.com",
        message: "We implemented a design system last year and it's been game-changing for our development speed.",
        createdAt: "2024-07-20T09:45:00Z",
        approved: true
      }
    ]
  },
  {
    id: "blog-6",
    title: 'Upcoming Web Development Trends for 2025',
    slug: 'upcoming-web-development-trends-2025',
    date: '2024-10-05',
    category: 'Web Development',
    tags: ['Trends', 'Frontend', 'Web Development'],
    author: "Lewis Admin",
    authorId: "user-1",
    image: 'https://cdn.pixabay.com/photo/2018/05/08/08/44/artificial-intelligence-3382507_1280.jpg',
    excerpt: 'Explore the cutting-edge technologies and frameworks that will shape web development in 2025.',
    content: 'The web development landscape continues to evolve rapidly. Stay ahead of the curve by understanding these emerging trends and technologies.\n\n## AI-Powered Development\nAI assistants for code generation and debugging are becoming mainstream, dramatically increasing developer productivity.\n\n## WebAssembly Evolution\nWebAssembly is expanding beyond its initial use cases, enabling high-performance applications directly in browsers.\n\n## Edge Computing\nThe shift toward computing at the edge continues, with more frameworks supporting edge functions and distributed rendering.',
    status: 'draft',
    viewCount: 0
  }
];