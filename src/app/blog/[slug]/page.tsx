//src/app/blog/[slug]/page.tsx
import { blogPosts } from '@/data/blogs';
import BlogLayout from '../BlogLayout';
import CommentsSection from '@/components/CommentSection';
import NewsletterSignup from '@/components/NewsletterSignup';
import { notFound } from 'next/navigation';

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((b) => b.slug === slug);

  if (!post) return notFound();

  return (
    <BlogLayout>
      <article className="prose lg:prose-lg max-w-none">
        <h1>{post.title}</h1>
        <p className="text-sm text-gray-500">
          {new Date(post.date).toLocaleDateString()} • {post.category} • {post.comments} comments
        </p>
        <div className="w-full flex justify-center my-6">
          <img
            src={post.image}
            alt={post.title}
            className="w-full max-w-2xl h-auto rounded-md object-cover"
          />
        </div>

        <p>{post.content}</p>
      </article>

      <CommentsSection />
      <NewsletterSignup />
    </BlogLayout>
  );
}
