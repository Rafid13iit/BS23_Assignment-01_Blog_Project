import React from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../../hooks/useBlog';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import PageInfo from '../components/PageInfo';
import usePagination from '../../hooks/usePagination';

const Index = () => {
  const { getAllBlogs } = useBlog();
  
  const {
    items: blogs,
    pagination,
    // loading,
    handlePageChange
  } = usePagination(getAllBlogs);

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       <LoadingSpinner />
  //     </div>
  //   );
  // }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Latest Blog Posts</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div key={blog.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">
                  {blog.title}
                </h2>
                <div className="text-gray-600 text-sm mb-4">
                  Published on {new Date(blog.published_date).toLocaleDateString()}
                  <span className="mx-2">|</span>
                  Author: {blog.author ? blog.author.username : 'Unknown'}
                </div>
                <p className="text-gray-700 mb-4">
                  {blog.subtitle || 'No subtitle'}
                </p>
                <Link
                  to={`/blog/${blog.slug}`}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Read more ...
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            No blog posts available.
          </div>
        )}
      </div>

      <Pagination 
        pagination={pagination} 
        onPageChange={handlePageChange} 
      />
      
      <PageInfo pagination={pagination} />
    </div>
  );
};

export default Index;