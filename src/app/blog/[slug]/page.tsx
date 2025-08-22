// src/app/blog/[slug]/page.tsx
'use client';


import React from 'react';

import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/app/context/ToastContext';
import BlogLayout from '@/components/blog/BlogLayout';
import CommentsSection from '@/components/CommentSection';
import NewsletterSignup from '@/components/NewsletterSignup';
import Link from 'next/link';
import { useBlogDetails } from '@/hooks/useBlogDetails';
import { BlogPost as UiBlogPost } from '@/app/models/blog.model';
import { ArrowLeftIcon, CalendarDaysIcon, TagIcon, ChatBubbleLeftRightIcon, EyeIcon, ClockIcon, UserIcon, ExclamationTriangleIcon, ShareIcon } from '@heroicons/react/24/outline';


export default function BlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const { post, loading, error } = useBlogDetails(slug);
  const { showToast } = useToast();

  // Share handler using toast
  const handleShare = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      showToast('Link copied to clipboard!', 'success');
    } catch {
      showToast('Failed to copy link', 'error');
    }
  };

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
    author:
      apiPost.authorDetails?.fullName ||
      apiPost.author_name ||
      apiPost.authorDetails?.author_name ||
      apiPost.author ||
      '',
    authorId:
      apiPost.authorDetails?.id ||
      apiPost.author_id ||
      apiPost.author ||
      '',
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

  // Calculate read time (rough estimate: 200 words per minute)
  const calculateReadTime = (content: string): number => {
    const wordCount = content.split(' ').length;
    return Math.ceil(wordCount / 200);
  };

  if (loading) {
    return (
      <BlogLayout>
        <div className="flex items-center justify-center py-20">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-500"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-300 animate-spin" style={{ animationDuration: '1.5s' }}></div>
          </div>
        </div>
      </BlogLayout>
    );
  }

  if (error || !post) {
    return (
      <BlogLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-error-50 flex items-center justify-center">
              <ExclamationTriangleIcon className="w-12 h-12 text-error-500" />
            </div>
            <h2 className="text-3xl font-bold text-text-inverse mb-4">Blog post not found</h2>
            <p className="text-text-secondary mb-8 leading-relaxed">
              The post you're looking for doesn't exist or has been removed. It might have been moved or deleted.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all duration-200 shadow-soft hover:shadow-medium"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Return to Blog
            </Link>
          </div>
        </div>
      </BlogLayout>
    );
  }

  const uiPost = mapApiToUiBlogPost(post);
  const readTime = calculateReadTime(uiPost.content);
  const formattedDate = new Date(uiPost.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <BlogLayout>
      <div className="max-w-4xl mx-auto">
        {/* Back to Blog */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-primary-500 mb-8 transition-colors duration-200 group"
        >
          <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Blog
        </Link>

        {/* Article Header */}
        <header className="mb-12">
          {/* Category Badge */}
          {uiPost.category && (
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                <TagIcon className="w-3.5 h-3.5" />
                {uiPost.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-inverse leading-tight mb-6 animate-slide-up">
            {uiPost.title}
          </h1>

          {/* Excerpt */}
          {uiPost.excerpt && (
            <p className="text-xl text-text-secondary leading-relaxed mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              {uiPost.excerpt}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-text-secondary mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-2">
              <CalendarDaysIcon className="w-4 h-4" />
              <time dateTime={uiPost.date}>{formattedDate}</time>
            </div>

            {uiPost.author && (
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                <span>{uiPost.author}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4" />
              <span>{readTime} min read</span>
            </div>

            <div className="flex items-center gap-2">
              <ChatBubbleLeftRightIcon className="w-4 h-4" />
              <span>{uiPost.comments?.length || 0} comments</span>
            </div>

            {uiPost.viewCount && (
              <div className="flex items-center gap-2">
                <EyeIcon className="w-4 h-4" />
                <span>{uiPost.viewCount.toLocaleString()} views</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {uiPost.tags && uiPost.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              {uiPost.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-light-tertiary text-text-secondary rounded-full text-sm hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200 cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Featured Image */}
        {uiPost.image && (
          <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="relative overflow-hidden rounded-2xl shadow-medium group">
              <img
                src={uiPost.image}
                alt={uiPost.title}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
        )}

        {/* Article Content */}
        <article className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="prose prose-lg max-w-none
            prose-headings:text-text-inverse prose-headings:font-bold prose-headings:tracking-tight
            prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-12
            prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-10 prose-h2:text-text-inverse
            prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-8 prose-h3:text-text-inverse
            prose-h4:text-xl prose-h4:mb-2 prose-h4:mt-6 prose-h4:text-text-inverse
            prose-p:text-text-inverse prose-p:leading-8 prose-p:mb-6 prose-p:text-lg
            prose-a:text-primary-500 prose-a:no-underline hover:prose-a:text-primary-600 prose-a:font-medium prose-a:transition-colors
            prose-strong:text-text-inverse prose-strong:font-semibold
            prose-em:text-text-secondary
            prose-blockquote:border-l-4 prose-blockquote:border-primary-200 prose-blockquote:bg-light-tertiary prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:rounded-r-lg prose-blockquote:my-8
            prose-blockquote:text-text-secondary prose-blockquote:italic prose-blockquote:not-italic
            prose-code:bg-light-tertiary prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-primary-600
            prose-pre:bg-dark-secondary prose-pre:border prose-pre:border-border-dark prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto
            prose-ul:mb-6 prose-ol:mb-6
            prose-li:text-text-inverse prose-li:mb-2 prose-li:leading-7
            prose-img:rounded-lg prose-img:shadow-soft prose-img:my-8
            prose-hr:border-border-light prose-hr:my-12
            prose-table:my-8 prose-table:border-collapse
            prose-th:bg-light-tertiary prose-th:border prose-th:border-border-light prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:font-semibold prose-th:text-text-inverse
            prose-td:border prose-td:border-border-light prose-td:px-4 prose-td:py-3 prose-td:text-text-inverse"
          >
            {/* Process content paragraphs with better formatting */}
            {uiPost.content.split('\n\n').map((paragraph, index) => {
              // Handle different content types
              if (paragraph.trim().startsWith('#')) {
                // Handle markdown headers
                const match = paragraph.match(/^#{1,6}/);
                const level = match ? Math.min(Math.max(match[0].length, 1), 6) : 1;
                const text = paragraph.replace(/^#{1,6}\s*/, '');
                return React.createElement(`h${level}`, { key: index }, text);
              } else if (paragraph.trim().startsWith('>')) {
                // Handle blockquotes
                const text = paragraph.replace(/^>\s*/, '');
                return <blockquote key={index}>{text}</blockquote>;
              } else if (paragraph.trim() === '---') {
                // Handle horizontal rules
                return <hr key={index} />;
              } else if (paragraph.trim()) {
                // Regular paragraphs
                return (
                  <p key={index} className="first:mt-0">
                    {paragraph}
                  </p>
                );
              }
              return null;
            })}
          </div>
        </article>

        {/* Article Footer */}
        <footer className="mt-16 pt-12  border-t border-border-light">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            {/* Author Info */}
            {uiPost.author && (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12  rounded-full flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <p className="font-semibold text-text-secondary">Written by</p>
                  <p className="text-text-secondary font-medium">{uiPost.author}</p>
                </div>
              </div>
            )}

            {/* Share Buttons */}
            <div className="flex items-center gap-3">
              <span className="text-text-secondary font-medium">Share:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-10 h-10 bg-light-tertiary hover:bg-primary-50 rounded-full flex items-center justify-center transition-colors duration-200 group"
                  aria-label="Copy article link"
                >
                  <ShareIcon className="w-5 h-5 text-text-secondary group-hover:text-primary-500" />
                </button>
              </div>
            </div>
          </div>
        </footer>

        {/* Comments Section */}
        <div className="mt-16">
          <CommentsSection postSlug={uiPost.slug} initialComments={uiPost.comments} />
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16">
          <NewsletterSignup />
        </div>
      </div>
    </BlogLayout>
  );
}