//app/blog/BlogSidebar.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Tag, Folder, TrendingUp, Calendar, User, ArrowRight } from 'lucide-react';
import { fetchBlogCategories, BlogCategory } from '@/services/api/blogCategories';
import { fetchBlogTags, BlogTag } from '@/services/api/blogTags';

const BlogSidebar = () => {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchBlogCategories(), fetchBlogTags()])
      .then(([cats, tags]) => {
        setCategories(cats);
        setTags(tags);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load sidebar data');
        setLoading(false);
      });
  }, []);

  const recentPosts = [
    {
      title: "Optimizing React Performance for Scale",
      slug: "optimizing-react-performance",
      date: "2024-03-15",
    },
    {
      title: "Microservices Architecture Patterns",
      slug: "microservices-patterns",
      date: "2024-03-10",
    },
    {
      title: "Database Optimization Strategies",
      slug: "database-optimization",
      date: "2024-03-05",
    }
  ];

  return (
    <aside className="space-y-6 sticky top-8">
      {/* About Author Card */}
      <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 p-6 shadow-soft">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-medium">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white">Lewis Codes</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Full Stack Developer</p>
          </div>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Sharing insights on modern web development, scalable architecture, and business optimization through code.
        </p>
      </div>

      {/* Categories */}
      <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-gradient-to-br from-accent/20 to-accent/30 rounded-lg">
            <Folder className="w-4 h-4 text-accent" />
          </div>
          <h3 className="font-semibold text-neutral-900 dark:text-white">Categories</h3>
        </div>
        
        {loading && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex justify-between items-center">
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-24"></div>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-6"></div>
              </div>
            ))}
          </div>
        )}
        
        {error && (
          <div className="text-error text-sm p-3 bg-error/10 rounded-lg border border-error/20">
            {error}
          </div>
        )}
        
        {!loading && !error && (
          <ul className="space-y-3">
            {categories.map((cat, i) => (
              <li key={i}>
                <Link
                  href={`/blog/category/${cat.name.toLowerCase().replace(/ /g, '-')}`}
                  className="group flex items-center justify-between p-2 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-all duration-200"
                >
                  <span className="text-neutral-700 dark:text-neutral-300 group-hover:text-primary transition-colors">
                    {cat.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-500 group-hover:text-primary/80 transition-colors">
                      {cat.count}
                    </span>
                    <ArrowRight className="w-3 h-3 text-neutral-400 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-1 group-hover:translate-x-0" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Recent Posts */}
      <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-gradient-to-br from-success/20 to-success/30 rounded-lg">
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <h3 className="font-semibold text-neutral-900 dark:text-white">Recent Posts</h3>
        </div>
        
        <ul className="space-y-4">
          {recentPosts.map((post, i) => (
            <li key={i}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block p-3 rounded-lg hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 transition-all duration-200"
              >
                <h4 className="font-medium text-sm text-neutral-900 dark:text-white group-hover:text-primary transition-colors leading-tight mb-2">
                  {post.title}
                </h4>
                <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(post.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Tags */}
      <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/30 rounded-lg">
            <Tag className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-semibold text-neutral-900 dark:text-white">Popular Tags</h3>
        </div>
        
        {loading && (
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="inline-block animate-pulse">
                <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full w-16 mr-2"></div>
              </div>
            ))}
          </div>
        )}
        
        {error && (
          <div className="text-error text-sm p-3 bg-error/10 rounded-lg border border-error/20">
            {error}
          </div>
        )}
        
        {!loading && !error && Array.isArray(tags) && tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 15).map((tag) => (
              <Link
                key={tag.id}
                href={`/blog/tag/${tag.slug}`}
                className="inline-flex items-center gap-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition-all duration-200 hover:scale-105"
              >
                <Tag className="w-3 h-3" />
                {tag.name}
              </Link>
            ))}
          </div>
        ) : (
          !loading && !error && (
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">
              No tags available yet.
            </p>
          )
        )}
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm rounded-2xl border border-primary/20 p-6 shadow-soft">
        <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Stay Updated</h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
          Get the latest insights on web development and business optimization.
        </p>
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-sm"
          />
          <button className="w-full bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 text-sm font-medium">
            Subscribe
          </button>
        </div>
      </div>
    </aside>
  );
};

export default BlogSidebar;