//app/blog/page.tsx
'use client';
import BlogLayout from './BlogLayout';
import BlogCard from './BlogCard';
import BlogSidebar from './BlogSidebar';
import {useData} from '@/app/context/DataContext'
export default function BlogPage() {

  const { blogs } = useData();
  return (
    <BlogLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Blog Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {/* Sidebar */}
        <BlogSidebar />
      </div>
    </BlogLayout>
  );
}
