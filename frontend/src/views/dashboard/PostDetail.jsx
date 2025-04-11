import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBlog } from '../../hooks/useBlog';
import { AppContext } from '../../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Comments from './Comments';
import ConfirmationModal from '../components/ConfirmationModal';
import { toast } from 'react-toastify';

const PostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getBlogBySlug, deleteBlog, loading } = useBlog();
  const { isLoggedin, userData } = useContext(AppContext);
  const [blog, setBlog] = useState(null);
  const [modalConfig, setModalConfig] = useState({
    show: false,
    title: '',
    message: '',
    confirmText: '',
    confirmButtonClass: '',
  });

  useEffect(() => {
    const fetchBlog = async () => {
      const result = await getBlogBySlug(slug);
      setBlog(result);
    };
    fetchBlog();
  }, [slug]);

  const showConfirmation = (config) => {
    setModalConfig({
      show: true,
      ...config
    });
  };

  const hideConfirmation = () => {
    setModalConfig({
      ...modalConfig,
      show: false
    });
  };

  const handleDeleteClick = () => {
    showConfirmation({
      title: "Delete Blog Post",
      message: `Are you sure you want to delete "${blog.title}"? This action cannot be undone.`,
      confirmText: "Delete",
      confirmButtonClass: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    });
  };

  const handleModalConfirm = async () => {
    const success = await deleteBlog(blog.id);
    if (success) {
      toast.success('Blog post deleted successfully');
      navigate('/dashboard');
    } else {
      toast.error('Failed to delete blog post');
    }
    hideConfirmation();
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
        <div className="text-gray-600 mb-8">
          <p>Author: {blog.author ? blog.author.username : 'Unknown'}</p>
          <p>Published on {new Date(blog.published_date).toLocaleDateString()}</p>
        </div>
        
        {blog.subtitle && (
          <p className="text-xl text-gray-700 mb-8 italic">{blog.subtitle}</p>
        )}

        <div className="prose max-w-none mb-12">
          {/* Replace with a proper markdown renderer if needed */}
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>

        {isLoggedin && blog.author && userData?.id === blog.author.id &&  (
          <div className="flex space-x-4 mb-10">
            <Link 
              to={`/edit-post/${blog.slug}`}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Edit
            </Link>
            <button 
              onClick={handleDeleteClick}
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

      {modalConfig.show && (
        <ConfirmationModal
          title={modalConfig.title}
          message={modalConfig.message}
          confirmText={modalConfig.confirmText}
          cancelText="Cancel"
          confirmButtonClass={modalConfig.confirmButtonClass}
          onConfirm={handleModalConfirm}
          onCancel={hideConfirmation}
        />
      )}
    </div>
  );
};

export default PostDetail;