'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Calendar, MessageCircle, ArrowRight, User } from 'lucide-react';
import { BlogPost } from '@/app/models/blog.model';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Format date with better error handling
  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // Try parsing ISO string or other common formats
      const parsedDate = Date.parse(dateString);
      if (isNaN(parsedDate)) return 'Invalid date';
      return new Date(parsedDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formattedDate = formatDate(post.date);
  const commentCount = post.comments?.length || 0;

  return (
    <article className="group bg-card border border-custom rounded-2xl shadow-soft overflow-hidden transition-all duration-300 hover:shadow-large hover:transform hover:-translate-y-2 flex flex-col h-full">
      {/* Image container with aspect ratio */}
      <div className="relative pt-[56.25%] overflow-hidden">
        {/* Skeleton loader while image loads */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
        )}

        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800 flex items-center justify-center">
            <div className="text-neutral-400 dark:text-neutral-500">
              <svg width="64" height="64" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
            </div>
          </div>
        )}

        {/* Category tag */}
        {post.category && (
          <span className="absolute top-4 left-4 bg-primary text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-soft">
            {post.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Meta information */}
        <div className="flex items-center text-xs text-secondary mb-3 gap-4">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}</span>
          </span>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-primary mb-3 line-clamp-2 group-hover:text-accent transition-colors leading-tight">
          {post.title}
        </h2>

        {/* Tags if available */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-surface text-secondary px-2.5 py-1 rounded-full border border-custom"
              >
                {tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs bg-accent/10 text-accent px-2.5 py-1 rounded-full border border-accent/20">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Excerpt */}
        <p className="text-secondary mb-4 text-sm line-clamp-3 flex-grow leading-relaxed">
          {post.excerpt || 'No preview available...'}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-custom">
          {/* Author */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold shadow-soft">
              {post.author ? post.author.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
            </div>
            <span className="text-sm font-medium text-primary truncate">
              {post.author || 'Anonymous'}
            </span>
          </div>

          {/* Read more link */}
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent/80 transition-colors group/link"
          >
            <span>Read more</span>
            <ArrowRight className="w-3.5 h-3.5 transform transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;