'use client';

import Image from 'next/image';
import Link from 'next/link';

// Simulated blog post data (can later come from CMS or Markdown)
const blogPosts = [
  {
    id: 1,
    title: 'Boost your conversion rate',
    slug: 'boost-your-conversion-rate',
    date: 'Mar 16, 2020',
    author: {
      name: 'Michael Foster',
      imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    imageUrl: 'https://images.unsplash.com/photo-1737305457496-dc7503cdde1e?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 2,
    title: 'How to use search engine optimization to drive sales',
    slug: 'seo-to-drive-sales',
    date: 'Mar 10, 2020',
    author: {
      name: 'Lindsay Walton',
      imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    imageUrl: 'https://images.unsplash.com/photo-1742275346989-2d696fa2c9b3?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 3,
    title: 'Improve your customer experience',
    slug: 'improve-customer-experience',
    date: 'Feb 12, 2020',
    author: {
      name: 'Tom Cook',
      imageUrl: 'https://randomuser.me/api/portraits/men/85.jpg',
    },
    imageUrl: 'https://images.unsplash.com/photo-1742505709397-7d0cdeaaaf4b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

export default function Blog() {
  return (
    <section className="bg-white py-24 px-6 sm:py-32">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
          From the blog
        </h2>
        <p className="text-lg text-gray-600 mb-14">
          Learn how to grow your business with our expert advice.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group relative overflow-hidden rounded-xl shadow-lg transition-transform hover:-translate-y-1"
            >
              <div className="relative h-60">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              </div>
              <div className="absolute bottom-0 w-full p-4 text-white z-10">
                <div className="flex items-center text-sm space-x-2 mb-1">
                  <span>{post.date}</span>
                  <span>·</span>
                  <div className="flex items-center space-x-2">
                    <Image
                      src={post.author.imageUrl}
                      alt={post.author.name}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    <span>{post.author.name}</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold leading-tight group-hover:underline">
                  {post.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14">
          <Link
            href="/blog"
            className="text-indigo-600 font-medium hover:underline"
          >
            View all blog posts →
          </Link>
        </div>
      </div>
    </section>
  );
}
