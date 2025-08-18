//app/blog/BlogSidebar.tsx
'use client';

import Link from 'next/link';


import { useEffect, useState } from 'react';
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

  return (
    <aside className="space-y-6">
      {/* Categories */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Categories</h3>
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && (
          <ul className="space-y-2">
            {categories.map((cat, i) => (
              <li key={i} className="flex justify-between">
                <Link
                  href={`/blog/category/${cat.name.toLowerCase().replace(/ /g, '-')}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {cat.name}
                </Link>
                <span className="text-gray-500">{cat.count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Tags */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Tags</h3>
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && Array.isArray(tags) && tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/blog/tag/${tag.slug}`}
                className="bg-gray-200 text-gray-800 text-sm px-2 py-1 rounded hover:bg-gray-300"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        ) : (!loading && !error && <div className="text-gray-500">No tags found.</div>)}
      </div>
    </aside>
  );
};

export default BlogSidebar;
