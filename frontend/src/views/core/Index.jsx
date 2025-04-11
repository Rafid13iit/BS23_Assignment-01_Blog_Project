import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../../hooks/useBlog';
import LoadingSpinner from '../components/LoadingSpinner';

const Index = () => {
  const { getAllBlogs, loading } = useBlog();
  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState({
    count: 0,
    total_pages: 0,
    current_page: 1,
    next: null,
    previous: null
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      const result = await getAllBlogs(pagination.current_page);
      
      if (result) {
        setBlogs(result.results || []);
        setPagination({
          count: result.count || 0,
          total_pages: result.total_pages || 0,
          current_page: result.current_page || 1,
          next: result.next,
          previous: result.previous
        });
      }
    };
    fetchBlogs();
  }, [pagination.current_page]);

  const handlePageChange = (pageNumber) => {
    setPagination({
      ...pagination,
      current_page: pageNumber
    });
  };

  const handlePreviousPage = () => {
    if (pagination.previous) {
      handlePageChange(pagination.current_page - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.next) {
      handlePageChange(pagination.current_page + 1);
    }
  };

  // Function to generate page number buttons
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5;
    
    let startPage = Math.max(1, pagination.current_page - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(pagination.total_pages, startPage + maxPageButtons - 1);
    
    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md hover:cursor-pointer ${
            pagination.current_page === i
              ? "bg-indigo-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {i}
        </button>
      );
    }
    
    return pageNumbers;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

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

      {pagination.total_pages > 1 && (
        <div className="flex justify-center mt-10">
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePreviousPage}
              disabled={!pagination.previous}
              className={`px-3 py-1 rounded-md hover:cursor-pointer ${
                !pagination.previous
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              ← Previous
            </button>
            
            {renderPageNumbers()}
            
            <button
              onClick={handleNextPage}
              disabled={!pagination.next}
              className={`px-3 py-1 rounded-md hover:cursor-pointer ${
                !pagination.next
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Next →
            </button>
          </div>
        </div>
      )}
      
      {/* Page indication */}
      {pagination.count > 0 && (
        <div className="text-center text-gray-500 mt-4">
          Showing {((pagination.current_page - 1) * 6) + 1} to {Math.min(pagination.current_page * 6, pagination.count)} of {pagination.count} posts
        </div>
      )}
    </div>
  );
};

export default Index;