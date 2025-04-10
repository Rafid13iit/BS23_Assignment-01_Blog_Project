import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../../hooks/useBlog';
import { AppContext } from '../../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { getUserBlogs, deleteBlog, loading } = useBlog();
  const { userData } = useContext(AppContext);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const result = await getUserBlogs();
      setBlogs(result);
    };
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      const success = await deleteBlog(id);
      if (success) {
        setBlogs(blogs.filter(blog => blog.id !== id));
      }
    }
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link 
          to="/dashboard/add-post" 
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Add New Post
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Welcome, {userData?.username || 'User'}</h2>
        <p className="text-gray-600">Manage your blog posts, profile, and more from this dashboard.</p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Blog Posts</h2>
        
        {blogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/blog/${blog.slug}`} className="text-indigo-600 hover:text-indigo-900 font-medium">
                        {blog.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        blog.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {blog.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(blog.published_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link to={`/dashboard/edit-post/${blog.slug}`} className="text-indigo-600 hover:text-indigo-900">
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDelete(blog.id)} 
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-500">You haven't created any blog posts yet.</p>
            <Link to="/dashboard/add-post" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 font-medium">
              Create your first post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;