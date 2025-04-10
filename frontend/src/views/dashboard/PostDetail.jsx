import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBlog } from '../../hooks/useBlog';
import { AppContext } from '../../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Comments from './Comments';

const PostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getBlogBySlug, deleteBlog, loading } = useBlog();
  const { isLoggedin } = useContext(AppContext);
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      const result = await getBlogBySlug(slug);
      setBlog(result);
    };
    fetchBlog();
  }, []);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      const success = await deleteBlog(blog.id);
      if (success) {
        navigate('/dashboard');
      }
    }
  };

  if (loading || !blog) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
        <p className="text-gray-600 mb-8">
          Published on {new Date(blog.published_date).toLocaleDateString()}
        </p>
        
        {blog.subtitle && (
          <p className="text-xl text-gray-700 mb-8 italic">{blog.subtitle}</p>
        )}

        <div className="prose max-w-none mb-12">
          {/* Replace with a proper markdown renderer if needed */}
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>

        {isLoggedin && (
          <div className="flex space-x-4 mb-10">
            <Link 
              to={`/dashboard/edit-post/${blog.slug}`}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Edit
            </Link>
            <button 
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Comments</h2>
          <Comments blogId={blog.id} />
        </div>
      </div>
    </div>
  );
};

export default PostDetail;