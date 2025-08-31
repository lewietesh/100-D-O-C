"use client";

import { useState } from 'react';
import { BookOpenIcon } from '@heroicons/react/24/outline';
import BlogLayout from '@/components/blog/BlogLayout';
import BlogCard from '@/components/blog/BlogCard';
import BlogSidebar from '@/components/blog/BlogSidebar';
import BlogSearch from '@/components/blog/BlogSearch';
import { useBlog } from '@/hooks/useBlog';
import { BlogPost as ApiBlogPost } from '@/types/blog';
import { BlogPost as UiBlogPost } from '@/app/models/blog.model';

export default function BlogPage() {
  const { blogs, loading, error } = useBlog();
  const [search, setSearch] = useState('');

  // Map API BlogPost to UI BlogPost shape
  const mapApiToUiBlogPost = (post: ApiBlogPost): UiBlogPost => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    date: post.datePublished || post.dateCreated || '',
    category: post.category || '',
    tags: Array.isArray((post as any).tags)
      ? (post as any).tags.map((tag: any) =>
        typeof tag === 'string' ? tag : tag.name || tag.slug || ''
      )
      : [],
    author: post.author,
    authorId: post.author, // If you have authorDetails, use its id
    image: post.imageUrl || '',
    excerpt: post.excerpt,
    content: post.content,
    status: post.status,
    comments: Array.isArray((post as any).comments)
      ? (post as any).comments.map((c: any) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        message: c.message,
        createdAt: c.dateCreated || c.date_created || '',
        approved: c.approved,
      }))
      : [],
    viewCount: post.viewCount,
    featured: post.featured,
    updatedAt: post.dateUpdated,
  });

  // Filter blogs by search
  const filteredBlogs = blogs.filter((post) => {
    const q = search.toLowerCase();
    return (
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      (post.content && post.content.toLowerCase().includes(q))
    );
  });

  return (
    <BlogLayout>
      {/* Blog Header */}
      <div className="text-center mb-12 p-8">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
          <BookOpenIcon className="w-4 h-4" />
          Blog & Insights
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
          Latest <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Articles</span>
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
          Insights on web development, technology, and building better digital experiences
        </p>
      </div>

      <div className="max-w-4xl mx-auto w-full px-2 sm:px-4 md:px-0">
        <BlogSearch onSearch={setSearch} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Blog Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-5">
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-500">{error}</div>}
          {!loading && !error && filteredBlogs.map((post) => (
            <BlogCard key={post.id} post={mapApiToUiBlogPost(post)} />
          ))}
        </div>

        {/* Sidebar */}
        <BlogSidebar />
      </div>
    </BlogLayout>
  );
}