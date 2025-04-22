import BlogLayout from './BlogLayout';
import BlogCard from './BlogCard';
import BlogSidebar from './BlogSidebar';
import { blogPosts } from '@/data/blogs';

export default function BlogPage() {
  return (
    <BlogLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Blog Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {/* Sidebar */}
        <BlogSidebar />
      </div>
    </BlogLayout>
  );
}
