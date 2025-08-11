// src/app/blog/[slug]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useData } from '@/app/context/DataContext';
import { BlogPost } from '@/app/models/blog.model';
import BlogLayout from '@/components/blog/BlogLayout';
import CommentsSection from '@/components/CommentSection';
import NewsletterSignup from '@/components/NewsletterSignup';
import Image from 'next/image';
import Link from 'next/link';

export default function BlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const { blogs } = useData();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (blogs.length > 0 && params.slug) {
      const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
      const foundPost = blogs.find((b) => b.slug === slug && b.status === 'published');
      
      if (foundPost) {
        setPost(foundPost);
      } else {
        // If no post is found, go to 404
        router.push('/404');
      }
      
      setIsLoading(false);
    }
  }, [blogs, params.slug, router]);
  
  if (isLoading) {
    return (
      <BlogLayout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </BlogLayout>
    );
  }
  
  if (!post) {
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
  
  return (
    <BlogLayout>
      <article className="prose lg:prose-lg max-w-none">
        <h1>{post.title}</h1>
        <p className="text-sm text-gray-500">
          {new Date(post.date).toLocaleDateString()} • {post.category} • 
          {post.comments ? ` ${post.comments.length} comments` : ' 0 comments'}
        </p>
        <div className="w-full flex justify-center my-6">
          <img
            src={post.image}
            alt={post.title}
            className="w-full max-w-2xl h-auto rounded-md object-cover"
          />
        </div>
        
        {/* Render content paragraphs */}
        {post.content.split('\n\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </article>
      
      {/* Pass the postId to CommentsSection */}
      <CommentsSection postId={post.id} initialComments={post.comments} />
      <NewsletterSignup />
    </BlogLayout>
  );
}