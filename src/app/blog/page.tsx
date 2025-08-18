//app/blog/page.tsx
"use client";
import { useState } from 'react';
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
      <div className="max-w-4xl mx-auto w-full px-2 sm:px-4 md:px-0">
        <BlogSearch onSearch={setSearch} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Blog Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
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
