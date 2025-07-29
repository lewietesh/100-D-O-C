'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
  date_published: string;
  category: string;
  featured: boolean;
  comments_count: number;
  reading_time: number;
}

const API_BASE_URL = process.env.API_BASE_URL || "http://127.0.0.1:8000";

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
        setPosts(data.results || data); // support paginated & non-paginated
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogPosts();
  }, []);

  if (loading) return <div className="py-24 text-center text-primary">Loading blog posts...</div>;
  if (error) return <div className="py-24 text-center text-red-500">{error}</div>;

  return (
    <section className="w-full overflow-x-hidden bg-secondary dark:bg-gray-900 py-24 px-6 sm:py-32">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl mb-4">Latest Blog</h2>
        <p className="text-lg text-primary mb-14">Learn how to grow your business with our expert advice.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group relative overflow-hidden rounded-xl shadow-lg transition-transform hover:-translate-y-1"
            >
              <div className="relative h-60">
                <Image
                  src={post.image_url || 'https://via.placeholder.com/600x400'}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              </div>
              <div className="absolute bottom-0 w-full p-4 text-muted z-10">
                <div className="flex items-center text-sm space-x-2 mb-1 text-gray-300">
                  <span>{new Date(post.date_published).toLocaleDateString()}</span>
                  <span>·</span>
                  <span>{post.author_name}</span>
                </div>
                <h3 className="text-lg font-semibold leading-tight text-white group-hover:underline">{post.title}</h3>
                <p className="text-sm text-gray-300 line-clamp-2 opacity-90">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12">
          <Link href="/blog" className="text-indigo-600 font-medium hover:underline inline-flex items-center group">
            View all blog posts
            <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
