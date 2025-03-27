import Link from 'next/link';

const posts = [
  {
    title: 'Boost your conversion rate',
    slug: 'boost-your-conversion-rate',
    excerpt: 'Learn how to optimize your sales funnel and drive more conversions.',
  },
  {
    title: 'How to use SEO to drive sales',
    slug: 'seo-to-drive-sales',
    excerpt: 'Get expert advice on optimizing for search engines effectively.',
  },
  {
    title: 'Improve your customer experience',
    slug: 'improve-customer-experience',
    excerpt: 'Create delightful interactions that keep users coming back.',
  },
];

export default function BlogPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-bold mb-8">All Blog Posts</h1>
      <ul className="space-y-8">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-2xl font-semibold text-indigo-600 hover:underline">{post.title}</h2>
            </Link>
            <p className="text-gray-700 mt-1">{post.excerpt}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
