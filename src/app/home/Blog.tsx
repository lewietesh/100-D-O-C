'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, MessageCircle, Calendar, Code, Zap } from 'lucide-react';

interface Author {
  full_name: string;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
  color?: string;
}

interface ApiBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image_url: string;
  author_name: string;
  tags: Tag[];
  date_published: string | null;
  category: string;
  featured: boolean;
  comments_count: number;
  reading_time: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export default function Blog() {
  const [posts, setPosts] = useState<ApiBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/blog/posts/?status=published&ordering=-date_published&limit=3`);
        if (!res.ok) throw new Error('Failed to fetch blog posts');
        const data = await res.json();
        setPosts(data.results || data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogPosts();
  }, []);

  // Helper function to format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Coming Soon';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Helper function to get category color
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Tech': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'AI': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'Software': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'Web': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      'Society': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'Innovation': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  };

  if (loading) {
    return (
      <section className="w-full overflow-x-hidden bg-secondary dark:bg-gray-900 py-20 px-6">
        <div className="mx-auto max-w-7xl">
          {/* Header Skeleton */}
          <div className="text-center mb-16">
            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4 animate-pulse"></div>
            <div className="h-12 w-80 bg-gray-300 dark:bg-gray-700 rounded mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 w-96 bg-gray-300 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
          </div>
          
          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg animate-pulse">
                <div className="aspect-[16/10] bg-gray-300 dark:bg-gray-700"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20 mb-3"></div>
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full overflow-x-hidden bg-secondary dark:bg-gray-900 py-20 px-6">
        <div className="mx-auto max-w-7xl text-center">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 max-w-md mx-auto">
            <div className="text-red-600 dark:text-red-400 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">Failed to Load Posts</h3>
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section className="w-full overflow-x-hidden bg-secondary dark:bg-gray-900 py-20 px-6">
        <div className="mx-auto max-w-7xl text-center">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Code className="w-4 h-4" />
              Tech Insights
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-4"
            >
              Latest Thoughts
            </motion.h2>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-12 max-w-md mx-auto">
            <div className="text-6xl mb-6">📝</div>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Coming Soon</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">I'm working on some insightful articles about technology and its impact on society.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full overflow-x-hidden bg-secondary dark:bg-gray-900 py-20 px-6">
      <div className="mx-auto max-w-7xl">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Code className="w-4 h-4" />
            Tech Insights
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary mb-6"
          >
            Latest Thoughts
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            Exploring how technology and software development address real challenges facing our society today
          </motion.p>

          {/* Blog Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6 mt-8 text-sm"
          >
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Zap className="w-4 h-4 text-blue-600" />
              <span>{posts.length} Recent Post{posts.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <MessageCircle className="w-4 h-4 text-blue-600" />
              <span>{posts.reduce((total, post) => total + post.comments_count, 0)} Comment{posts.reduce((total, post) => total + post.comments_count, 0) !== 1 ? 's' : ''}</span>
            </div>
          </motion.div>
        </div>

        {/* Blog Posts Grid with Improved Aspect Ratios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                {/* Image Container with Better Aspect Ratio */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={post.image_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=60'}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Featured Badge */}
                  {post.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        ⭐ Featured
                      </span>
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getCategoryColor(post.category)}`}>
                      {post.category}
                    </span>
                  </div>

                  {/* Reading Time Overlay */}
                  <div className="absolute bottom-4 right-4">
                    <div className="bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.reading_time} min read
                    </div>
                  </div>
                </div>

                {/* Content Area with Better Spacing */}
                <div className="p-6">
                  {/* Meta Information */}
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{formatDate(post.date_published)}</span>
                    <span className="mx-2">·</span>
                    <span>{post.author_name}</span>
                    {post.comments_count > 0 && (
                      <>
                        <span className="mx-2">·</span>
                        <MessageCircle className="w-4 h-4 mr-1" />
                        <span>{post.comments_count}</span>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold leading-tight text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag.id}
                          className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full"
                        >
                          #{tag.name}
                        </span>
                      ))}
                      {post.tags.length > 2 && (
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                          +{post.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Read More Indicator */}
                  <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:gap-2 transition-all">
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/25 group"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}