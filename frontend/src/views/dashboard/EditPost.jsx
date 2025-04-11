import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBlog } from '../../hooks/useBlog';
import PostForm from '../components/PostForm';
import LoadingSpinner from '../components/LoadingSpinner';

const EditPost = () => {
  const { slug } = useParams();
  const { getBlogBySlug, updateBlog, loading } = useBlog();
  const [initialData, setInitialData] = useState({});
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blog = await getBlogBySlug(slug);
        if (blog) {
          setInitialData({
            id: blog.id,
            title: blog.title,
            subtitle: blog.subtitle,
            content: blog.content,
            status: blog.status
          });
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchBlog();
  }, [slug]);

  const handleSubmit = async (data) => {
    return await updateBlog(data);
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <PostForm
      initialData={initialData}
      onSubmit={handleSubmit}
      loading={loading}
      submitButtonText="Update Post"
      title="Edit Blog Post"
    />
  );
};

export default EditPost;