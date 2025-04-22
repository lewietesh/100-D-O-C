'use client';

import Image from 'next/image';
import Link from 'next/link';

interface BlogCardProps {
  post: {
    id: number;
    slug: string; // ✅ Add this line
    title: string;
    image: string;
    category: string;
    date: string;
    comments: number;
    excerpt: string;
  };
}

const BlogCard = ({ post }: BlogCardProps) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <Image
      src={post.image}
      alt={post.title}
      width={600}
      height={400}
      className="w-full h-48 object-cover"
    />
    <div className="p-4">
      <div className="text-sm text-gray-500 space-x-1">
        <span>{post.date}</span> | <span>{post.category}</span> |{' '}
        <span>{post.comments} Comments</span>
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mt-2">{post.title}</h2>
      <p className="text-gray-600 mt-2">{post.excerpt}</p>
      <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:text-blue-800">
  Read more
</Link>

    </div>
  </div>
);

export default BlogCard;
