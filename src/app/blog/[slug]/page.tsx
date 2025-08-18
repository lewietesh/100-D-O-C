// src/app/blog/[slug]/page.tsx
'use client';


import { useParams, useRouter } from 'next/navigation';
import BlogLayout from '@/components/blog/BlogLayout';
import CommentsSection from '@/components/CommentSection';
import NewsletterSignup from '@/components/NewsletterSignup';
import Link from 'next/link';
import { useBlogDetails } from '@/hooks/useBlogDetails';
import { BlogPost as UiBlogPost } from '@/app/models/blog.model';

export default function BlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const { post, loading, error } = useBlogDetails(slug);

  // Map API BlogPostWithDetails to UI BlogPost
  const mapApiToUiBlogPost = (apiPost: any): UiBlogPost => ({
    id: apiPost.id,
    title: apiPost.title,
    slug: apiPost.slug,
    date: apiPost.datePublished || apiPost.date_published || apiPost.dateCreated || apiPost.date_created || '',
    category: apiPost.category || '',
    tags: Array.isArray(apiPost.tags)
      ? apiPost.tags.map((tag: any) => tag.name || tag.slug || '')
      : [],
    author: apiPost.authorDetails?.fullName || apiPost.author || '',
    authorId: apiPost.authorDetails?.id || apiPost.author || '',
    image: apiPost.imageUrl || apiPost.image_url || '',
    excerpt: apiPost.excerpt,
    content: apiPost.content,
    status: apiPost.status,
    comments: Array.isArray(apiPost.comments)
      ? apiPost.comments.map((c: any) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        message: c.message,
        createdAt: c.dateCreated || c.date_created || '',
        approved: c.approved,
      }))
      : [],
    viewCount: apiPost.viewCount || apiPost.view_count,
    featured: apiPost.featured,
    updatedAt: apiPost.dateUpdated || apiPost.date_updated,
  });

  if (loading) {
    return (
      <BlogLayout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </BlogLayout>
    );
  }

  if (error || !post) {
    return (
      <BlogLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-800">Blog post not found</h2>
          <p className="mt-4 text-gray-600">The post you're looking for doesn't exist or has been removed.</p>
          <Link href="/blog" className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Return to Blog
          </Link>
        </div>
      </BlogLayout>
    );
  }

  const uiPost = mapApiToUiBlogPost(post);

  return (
    <BlogLayout>
      <article className="prose lg:prose-lg max-w-none">
        <h1>{uiPost.title}</h1>
        <p className="text-sm text-gray-500">
          {new Date(uiPost.date).toLocaleDateString()} • {uiPost.category} •
          {uiPost.comments ? ` ${uiPost.comments.length} comments` : ' 0 comments'}
        </p>
        <div className="w-full flex justify-center my-6">
          {uiPost.image ? (
            <img
              src={uiPost.image}
              alt={uiPost.title}
              className="w-full max-w-2xl h-auto rounded-md object-cover"
            />
          ) : null}
        </div>
        {/* Render content paragraphs */}
        {uiPost.content.split('\n\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </article>
      <CommentsSection postId={uiPost.id} initialComments={uiPost.comments} />
      <NewsletterSignup />
    </BlogLayout>
  );
}