import React from 'react';
import { useBlog } from '../../hooks/useBlog';
import PostForm from '../components/PostForm';

const AddPost = () => {
  const { createBlog, loading } = useBlog();

  const handleSubmit = async (data) => {
    return await createBlog(data);
  };

  return (
    <PostForm
      onSubmit={handleSubmit}
      loading={loading}
      submitButtonText="Create Post"
      title="Create New Blog Post"
    />
  );
};

export default AddPost;