//app/blog/BlogSidebar.tsx
'use client';

import Link from 'next/link';

const categories = [
  { name: 'Business Planning', count: 2 },
  { name: 'Financial Advices', count: 1 },
  { name: 'Business Analysis', count: 4 },
];

const tags = ['Analytics', 'Finance', 'Consultation', 'Data', 'Marketing'];

const BlogSidebar = () => (
  <aside className="space-y-6">
    {/* Categories */}
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Categories</h3>
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
    </div>

    {/* Tags */}
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <Link
            key={i}
            href={`/blog/tag/${tag.toLowerCase()}`}
            className="bg-gray-200 text-gray-800 text-sm px-2 py-1 rounded hover:bg-gray-300"
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  </aside>
);

export default BlogSidebar;
