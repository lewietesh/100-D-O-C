//src/app/blog/page.tsx
"use client";

import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import BlogLayout from '@/components/blog/BlogLayout';
import BlogCard from '@/components/blog/BlogCard';
import BlogSidebar from '@/components/blog/BlogSidebar';
import { useBlog } from '@/hooks/useBlog';
import { BlogPost as ApiBlogPost } from '@/types/blog';
import { BlogPost as UiBlogPost } from '@/app/models/blog.model';

export default function BlogPage() {
  const { blogs, loading, error } = useBlog();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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
    authorId: post.author,
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

  // Filter blogs by search and category
  const filteredBlogs = blogs.filter((post) => {
    const q = search.toLowerCase();
    const matchesSearch = 
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      (post.content && post.content.toLowerCase().includes(q));
    
    const matchesCategory = selectedCategory === 'all' || 
      post.category?.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const categories = ['all', ...Array.from(new Set(blogs.map(post => post.category).filter(Boolean)))];

  return (
    <BlogLayout>
      {/* Search and Filter Section */}
      <div className="mb-12 bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 p-6 shadow-soft">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-neutral-900 dark:text-white placeholder-neutral-400"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-3 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-neutral-900 dark:text-white min-w-[150px]"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
            {filteredBlogs.length === blogs.length 
              ? `${blogs.length} articles`
              : `${filteredBlogs.length} of ${blogs.length} articles`
            }
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Blog Cards - Takes 3/4 of the width on xl screens */}
        <div className="xl:col-span-3">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}
          
          {error && (
            <div className="bg-error/10 border border-error/20 text-error px-6 py-4 rounded-xl">
              {error}
            </div>
          )}
          
          {!loading && !error && filteredBlogs.length === 0 && (
            <div className="text-center py-20 text-neutral-600 dark:text-neutral-400">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No articles found matching your criteria.</p>
              <p className="text-sm mt-2">Try adjusting your search or filter settings.</p>
            </div>
          )}
          
          {!loading && !error && filteredBlogs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredBlogs.map((post) => (
                <div key={post.id} className="animate-fade-in-up">
                  <BlogCard post={mapApiToUiBlogPost(post)} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar - Takes 1/4 of the width on xl screens */}
        <div className="xl:col-span-1">
          <BlogSidebar />
        </div>
      </div>
    </BlogLayout>
  );
}