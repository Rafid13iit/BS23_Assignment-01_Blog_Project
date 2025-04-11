import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../../hooks/useBlog';
import LoadingSpinner from '../components/LoadingSpinner';
import ReactPaginate from 'react-paginate';

const Index = () => {
  const { getAllBlogs, loading } = useBlog();
  const [blogs, setBlogs] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [displayedBlogs, setDisplayedBlogs] = useState([]);
  const blogsPerPage = 6; // Number of blogs to display per page

  useEffect(() => {
    const fetchBlogs = async () => {
      const result = await getAllBlogs();
      setBlogs(result);
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    // Calculate the total number of pages
    const totalPages = Math.ceil(blogs.length / blogsPerPage);
    setPageCount(totalPages);

    // Get current page's blogs
    const offset = currentPage * blogsPerPage;
    const currentBlogs = blogs.slice(offset, offset + blogsPerPage);
    setDisplayedBlogs(currentBlogs);
  }, [blogs, currentPage]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    // window.scrollTo(0, 0);
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
        {displayedBlogs.length > 0 ? (
          displayedBlogs.map((blog) => (
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

      {pageCount > 1 && (
        <div className="flex justify-center mt-10">
          <ReactPaginate
            previousLabel={"← Previous"}
            nextLabel={"Next →"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={"flex items-center justify-center space-x-1  hover:cursor-pointer"}
            pageClassName={"px-3 py-1 rounded-md text-gray-600 hover:bg-gray-100"}
            previousClassName={"px-3 py-1 rounded-md text-gray-600 hover:bg-gray-100"}
            nextClassName={"px-3 py-1 rounded-md text-gray-600 hover:bg-gray-100"}
            breakClassName={"px-3 py-1 text-gray-400"}
            activeClassName={"bg-indigo-600 text-white hover:bg-indigo-700"}
            disabledClassName={"text-gray-300 cursor-not-allowed hover:bg-transparent"}
            forcePage={currentPage}
          />
        </div>
      )}
      
      {/* Page indication */}
      {blogs.length > 0 && (
        <div className="text-center text-gray-500 mt-4">
          Showing {currentPage * blogsPerPage + 1} to {Math.min((currentPage + 1) * blogsPerPage, blogs.length)} of {blogs.length} posts
        </div>
      )}
    </div>
  );
};

export default Index;