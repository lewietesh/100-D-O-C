export interface BlogPost {
        id: number;
        title: string;
        slug: string;
        date: string;
        category: string;
        comments: number;
        image: string;
        excerpt: string;
        content: string;
      }
      
      export const blogPosts: BlogPost[] = [
        {
          id: 1,
          title: 'Customer Onboarding Strategies',
          slug: 'customer-onboarding-strategies',
          date: '2024-11-09',
          category: 'Analytics',
          comments: 13,
          image: 'https://cdn.pixabay.com/photo/2017/01/22/20/51/space-2000945_1280.jpg',
          excerpt: 'Discover essential strategies for effective customer onboarding in SaaS and service-based businesses.',
          content: 'Customer onboarding is the process of getting new users set up and comfortable with your product. A smooth onboarding experience reduces churn and increases user satisfaction.'
        },
        {
          id: 2,
          title: 'Design Thinking for Product Teams',
          slug: 'design-thinking-for-product-teams',
          date: '2024-10-21',
          category: 'Product',
          comments: 8,
          image: 'https://cdn.pixabay.com/photo/2020/03/21/23/18/hardware-4955429_1280.jpg',
          excerpt: 'Learn how to integrate design thinking into agile product development to build user-centered solutions.',
          content: 'Design thinking emphasizes empathy, rapid prototyping, and user feedback. For product teams, it\'s a powerful framework to innovate and validate faster with less waste.'
        },
        {
          id: 3,
          title: 'Remote Work Tools Comparison 2024',
          slug: 'remote-work-tools-comparison-2024',
          date: '2024-09-12',
          category: 'Tech Stack',
          comments: 22,
          image: 'https://cdn.pixabay.com/photo/2022/04/04/16/23/technology-7111752_1280.jpg',
          excerpt: 'We compared Slack, Zoom, Notion, Trello, and more to help you find the right tools for remote collaboration.',
          content: 'Remote work is here to stay. This guide breaks down essential collaboration tools by use case and pricing, so your distributed team can stay productive without tool overload.'
        },
        {
          id: 4,
          title: 'The ROI of Great UX Writing',
          slug: 'the-roi-of-great-ux-writing',
          date: '2024-08-02',
          category: 'UX',
          comments: 5,
          image: 'https://cdn.pixabay.com/photo/2022/12/29/15/58/earth-7685220_1280.jpg',
          excerpt: 'Good UX writing isn’t just about clarity—it directly improves conversion, trust, and retention.',
          content: 'Copy is design. Clear, helpful microcopy reduces friction, guides users through flows, and creates confidence. See how small wording changes can have outsized business impact.'
        },
        {
          id: 5,
          title: 'Building Scalable Design Systems',
          slug: 'building-scalable-design-systems',
          date: '2024-07-18',
          category: 'Design Systems',
          comments: 11,
          image: 'https://cdn.pixabay.com/photo/2016/10/12/23/23/mining-excavator-1736293_1280.jpg',
          excerpt: 'As your product grows, a robust design system ensures consistency, velocity, and quality across teams.',
          content: 'Design systems go beyond components—they\'re about shared values, usage patterns, and scalability. Learn how to structure and maintain one that evolves with your product.'
        }
      ];
      