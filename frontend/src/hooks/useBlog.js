import { useApi } from './useApi';
import { toast } from 'react-toastify';

export const useBlog = () => {
  const api = useApi();

  const getAllBlogs = async (page = 1) => {
    const result = await api.get(`/blogs/?page=${page}`);
    if (result.success) {
      return result.data;
    }
    // Returns a default pagination structure if the request fails
    return { 
      results: [], 
      count: 0, 
      total_pages: 0,
      current_page: page,
      next: null, 
      previous: null 
    };
  };

  // const getUserBlogs = async () => {  
  //   const result = await api.get('/blogs/user/');
  //   return result.success ? result.data : [];
  // };

  const getUserBlogs = async (page = 1) => {  
    const result = await api.get(`/blogs/user/?page=${page}`);
    if (result.success) {
      return result.data;
    }

    return { 
      results: [], 
      count: 0, 
      total_pages: 0,
      current_page: page,
      next: null, 
      previous: null 
    };
  };

  const getBlogBySlug = async (slug) => {
    const result = await api.get(`/blogs/${slug}/`);
    return result.success ? result.data : null;
  };

  const createBlog = async (blogData) => {
    const result = await api.post('/blogs/create/', blogData);
    if (result.success) {
      toast.success('Blog created successfully!');
      return result.data;
    }
    return null;
  };

  const updateBlog = async (blogData) => {
    const result = await api.post('/blogs/update/', blogData);
    if (result.success) {
      toast.success('Blog updated successfully!');
      return result.data;
    }
    return null;
  };

  const deleteBlog = async (id) => {
    const result = await api.post('/blogs/delete/', { id });
    if (result.success) {
      toast.success('Blog deleted successfully!');
      return true;
    }
    return false;
  };

  const addComment = async (blogId, comment) => {
    const result = await api.post(`/blogs/comment/${blogId}/`, { comment });
    if (result.success) {
      toast.success('Comment added successfully!');
      return result.data;
    }
    return null;
  };

  const addReply = async (commentId, comment) => {
    const result = await api.post(`/blogs/reply/${commentId}/`, { comment });
    if (result.success) {
      toast.success('Reply added successfully!');
      return result.data;
    }
    return null;
  };

  const getComments = async (blogId) => {
    const result = await api.get(`/blogs/comment/${blogId}/`);
    return result.success ? result.data : [];
  };

  const getReplies = async (commentId) => {
    const result = await api.get(`/blogs/reply/${commentId}/`);
    return result.success ? result.data : [];
  };

  return {
    getAllBlogs,
    getUserBlogs,
    getBlogBySlug,
    createBlog,
    updateBlog,
    deleteBlog,
    addComment,
    addReply,
    getComments,
    getReplies,
    loading: api.loading
  };
};