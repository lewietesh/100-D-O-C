import { notFound } from 'next/navigation';

const posts = [
  {
    title: 'Boost your conversion rate',
    slug: 'boost-your-conversion-rate',
    content: 'Full article content for boosting conversion rate...',
  },
  {
    title: 'How to use SEO to drive sales',
    slug: 'seo-to-drive-sales',
    content: 'Everything you need to know about using SEO effectively...',
  },
  {
    title: 'Improve your customer experience',
    slug: 'improve-customer-experience',
    content: 'Best practices and tools to enhance UX and retention...',
  },
];

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug);

  if (!post) return notFound();

  return (
    <div className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <article className="prose lg:prose-lg">{post.content}</article>
    </div>
  );
}
