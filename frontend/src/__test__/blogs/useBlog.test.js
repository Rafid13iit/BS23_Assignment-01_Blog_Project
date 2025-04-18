import { renderHook, act } from '@testing-library/react-hooks';
import { useBlog } from '../../hooks/useBlog';
import { toast } from 'react-toastify';
import axios from 'axios';
import { jest, describe, it, beforeEach, expect } from 'jest-mock'


// Mock dependencies
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

jest.mock('axios');

describe('useBlog hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('access_token', 'fake-token');
  });

  describe('getAllBlogs functionality', () => {
    it('should fetch all blogs successfully', async () => {
      // Mock response data
      const mockBlogs = {
        results: [
          { id: 1, title: 'Test Blog 1', content: 'Content 1' },
          { id: 2, title: 'Test Blog 2', content: 'Content 2' }
        ],
        count: 2,
        total_pages: 1,
        current_page: 1,
        next: null,
        previous: null
      };

      // Setup axios mock
      axios.mockResolvedValueOnce({
        data: mockBlogs
      });

      const { result } = renderHook(() => useBlog());

      let blogs;
      await act(async () => {
        blogs = await result.current.getAllBlogs();
      });

      expect(blogs).toEqual(mockBlogs);
      expect(axios).toHaveBeenCalledWith(expect.objectContaining({
        method: 'get',
        url: expect.stringContaining('/blogs/'),
      }));
    });

    it('should handle fetch error gracefully', async () => {
      // Mock API error response
      axios.mockRejectedValueOnce({
        response: { 
          data: { message: 'Server error' } 
        }
      });

      const { result } = renderHook(() => useBlog());

      let blogs;
      await act(async () => {
        blogs = await result.current.getAllBlogs();
      });

      // Should return default empty structure
      expect(blogs.results).toEqual([]);
      expect(blogs.count).toBe(0);
    });
  });

  describe('getUserBlogs functionality', () => {
    it('should fetch user blogs successfully', async () => {
      // Mock response data
      const mockUserBlogs = {
        results: [
          { id: 1, title: 'My Blog 1', content: 'My Content 1' },
          { id: 2, title: 'My Blog 2', content: 'My Content 2' }
        ],
        count: 2,
        total_pages: 1,
        current_page: 1,
        next: null,
        previous: null
      };

      // Setup axios mock
      axios.mockResolvedValueOnce({
        data: mockUserBlogs
      });

      const { result } = renderHook(() => useBlog());

      let userBlogs;
      await act(async () => {
        userBlogs = await result.current.getUserBlogs();
      });

      expect(userBlogs).toEqual(mockUserBlogs);
      expect(axios).toHaveBeenCalledWith(expect.objectContaining({
        method: 'get',
        url: expect.stringContaining('/blogs/user/'),
      }));
    });
  });

  describe('getBlogBySlug functionality', () => {
    it('should fetch a blog by slug successfully', async () => {
      // Mock response data
      const mockBlog = {
        id: 1,
        title: 'Test Blog',
        slug: 'test-blog',
        content: 'Test content'
      };

      // Setup axios mock
      axios.mockResolvedValueOnce({
        data: mockBlog
      });

      const { result } = renderHook(() => useBlog());

      let blog;
      await act(async () => {
        blog = await result.current.getBlogBySlug('test-blog');
      });

      expect(blog).toEqual(mockBlog);
      expect(axios).toHaveBeenCalledWith(expect.objectContaining({
        method: 'get',
        url: expect.stringContaining('/blogs/test-blog/'),
      }));
    });
  });

  describe('createBlog functionality', () => {
    it('should create a blog successfully', async () => {
      // Mock blog data
      const newBlog = {
        title: 'New Blog',
        content: 'New content',
        status: 'published'
      };

      // Mock response data
      const mockResponse = {
        id: 3,
        title: 'New Blog',
        content: 'New content',
        status: 'published',
        slug: 'new-blog'
      };

      // Setup axios mock
      axios.mockResolvedValueOnce({
        data: mockResponse
      });

      const { result } = renderHook(() => useBlog());

      let createdBlog;
      await act(async () => {
        createdBlog = await result.current.createBlog(newBlog);
      });

      expect(createdBlog).toEqual(mockResponse);
      expect(toast.success).toHaveBeenCalledWith('Blog created successfully!');
      expect(axios).toHaveBeenCalledWith(expect.objectContaining({
        method: 'post',
        url: expect.stringContaining('/blogs/create/'),
        data: newBlog
      }));
    });

    it('should handle creation errors', async () => {
      // Mock blog data
      const newBlog = {
        title: '',  // Invalid data
        content: 'New content'
      };

      // Mock API error response
      axios.mockRejectedValueOnce({
        response: { 
          data: { message: 'Title is required' } 
        }
      });

      const { result } = renderHook(() => useBlog());

      let createdBlog;
      await act(async () => {
        createdBlog = await result.current.createBlog(newBlog);
      });

      expect(createdBlog).toBeNull();
      expect(toast.success).not.toHaveBeenCalled();
    });
  });

  describe('updateBlog functionality', () => {
    it('should update a blog successfully', async () => {
      // Mock blog data
      const updateData = {
        id: 1,
        title: 'Updated Blog',
        content: 'Updated content',
        status: 'published'
      };

      // Mock response data
      const mockResponse = {
        id: 1,
        title: 'Updated Blog',
        content: 'Updated content',
        status: 'published',
        slug: 'updated-blog'
      };

      // Setup axios mock
      axios.mockResolvedValueOnce({
        data: mockResponse
      });

      const { result } = renderHook(() => useBlog());

      let updatedBlog;
      await act(async () => {
        updatedBlog = await result.current.updateBlog(updateData);
      });

      expect(updatedBlog).toEqual(mockResponse);
      expect(toast.success).toHaveBeenCalledWith('Blog updated successfully!');
      expect(axios).toHaveBeenCalledWith(expect.objectContaining({
        method: 'post',
        url: expect.stringContaining('/blogs/update/'),
        data: updateData
      }));
    });
  });

  describe('deleteBlog functionality', () => {
    it('should delete a blog successfully', async () => {
      // Mock response data
      const mockResponse = { success: true };

      // Setup axios mock
      axios.mockResolvedValueOnce({
        data: mockResponse
      });

      const { result } = renderHook(() => useBlog());

      let success;
      await act(async () => {
        success = await result.current.deleteBlog(1);
      });

      expect(success).toBe(true);
      expect(toast.success).toHaveBeenCalledWith('Blog deleted successfully!');
      expect(axios).toHaveBeenCalledWith(expect.objectContaining({
        method: 'post',
        url: expect.stringContaining('/blogs/delete/'),
        data: { id: 1 }
      }));
    });

    it('should handle deletion errors', async () => {
      // Mock API error response
      axios.mockRejectedValueOnce({
        response: { 
          data: { message: 'Blog not found' } 
        }
      });

      const { result } = renderHook(() => useBlog());

      let success;
      await act(async () => {
        success = await result.current.deleteBlog(999);
      });

      expect(success).toBe(false);
      expect(toast.success).not.toHaveBeenCalled();
    });
  });

  describe('comments and replies functionality', () => {
    it('should add a comment successfully', async () => {
      // Mock comment data
      const commentData = 'This is a test comment';
      
      // Mock response data
      const mockResponse = {
        id: 1,
        comment: 'This is a test comment',
        user: { username: 'testuser' },
        created_at: '2023-01-01T12:00:00Z'
      };

      // Setup axios mock
      axios.mockResolvedValueOnce({
        data: mockResponse
      });

      const { result } = renderHook(() => useBlog());

      let comment;
      await act(async () => {
        comment = await result.current.addComment(1, commentData);
      });

      expect(comment).toEqual(mockResponse);
      expect(toast.success).toHaveBeenCalledWith('Comment added successfully!');
      expect(axios).toHaveBeenCalledWith(expect.objectContaining({
        method: 'post',
        url: expect.stringContaining('/blogs/comment/1/'),
        data: { comment: commentData }
      }));
    });

    it('should fetch comments successfully', async () => {
      // Mock comments data
      const mockComments = [
        { id: 1, comment: 'Comment 1', user: { username: 'user1' } },
        { id: 2, comment: 'Comment 2', user: { username: 'user2' } }
      ];

      // Setup axios mock
      axios.mockResolvedValueOnce({
        data: mockComments
      });

      const { result } = renderHook(() => useBlog());

      let comments;
      await act(async () => {
        comments = await result.current.getComments(1);
      });

      expect(comments).toEqual(mockComments);
      expect(axios).toHaveBeenCalledWith(expect.objectContaining({
        method: 'get',
        url: expect.stringContaining('/blogs/comment/1/'),
      }));
    });

    it('should add a reply successfully', async () => {
      // Mock reply data
      const replyData = 'This is a test reply';
      
      // Mock response data
      const mockResponse = {
        id: 1,
        comment: 'This is a test reply',
        user: { username: 'testuser' },
        created_at: '2023-01-01T12:00:00Z'
      };

      // Setup axios mock
      axios.mockResolvedValueOnce({
        data: mockResponse
      });

      const { result } = renderHook(() => useBlog());

      let reply;
      await act(async () => {
        reply = await result.current.addReply(1, replyData);
      });

      expect(reply).toEqual(mockResponse);
      expect(toast.success).toHaveBeenCalledWith('Reply added successfully!');
      expect(axios).toHaveBeenCalledWith(expect.objectContaining({
        method: 'post',
        url: expect.stringContaining('/blogs/reply/1/'),
        data: { comment: replyData }
      }));
    });

    it('should fetch replies successfully', async () => {
      // Mock replies data
      const mockReplies = [
        { id: 1, comment: 'Reply 1', user: { username: 'user1' } },
        { id: 2, comment: 'Reply 2', user: { username: 'user2' } }
      ];

      // Setup axios mock
      axios.mockResolvedValueOnce({
        data: mockReplies
      });

      const { result } = renderHook(() => useBlog());

      let replies;
      await act(async () => {
        replies = await result.current.getReplies(1);
      });

      expect(replies).toEqual(mockReplies);
      expect(axios).toHaveBeenCalledWith(expect.objectContaining({
        method: 'get',
        url: expect.stringContaining('/blogs/reply/1/'),
      }));
    });
  });
});