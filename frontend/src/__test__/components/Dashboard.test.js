import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../../src/dashboard/Dashboard';
import { useBlog } from '../../hooks/useBlog';
import { AppContext } from '../../context/AppContext';
import { jest, describe, it, beforeEach, afterEach, expect } from 'jest-mock'

// Mock hooks and context
jest.mock('../../hooks/useBlog');
jest.mock('../../hooks/usePagination', () => () => ({
  items: [
    { 
      id: 1, 
      title: 'Test Blog', 
      slug: 'test-blog',
      status: 'published',
      published_date: '2023-01-01T00:00:00Z'
    }
  ],
  pagination: {
    count: 1,
    total_pages: 1,
    current_page: 1,
    next: null,
    previous: null
  },
  loading: false,
  handlePageChange: jest.fn(),
  refreshData: jest.fn()
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

describe('Dashboard Component', () => {
  const mockContextValue = {
    userData: { username: 'testuser' },
    isLoggedin: true
  };

  const mockDeleteBlog = jest.fn().mockResolvedValue(true);

  beforeEach(() => {
    useBlog.mockReturnValue({
      getUserBlogs: jest.fn(),
      deleteBlog: mockDeleteBlog
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the dashboard with user blogs', () => {
    render(
      <BrowserRouter>
        <AppContext.Provider value={mockContextValue}>
          <Dashboard />
        </AppContext.Provider>
      </BrowserRouter>
    );

    // Check dashboard elements
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Welcome, testuser')).toBeInTheDocument();
    expect(screen.getByText('Your Blog Posts')).toBeInTheDocument();
    
    // Check blog in the list
    expect(screen.getByText('Test Blog')).toBeInTheDocument();
    expect(screen.getByText('Published')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('handles delete blog action correctly', async () => {
    render(
      <BrowserRouter>
        <AppContext.Provider value={mockContextValue}>
          <Dashboard />
        </AppContext.Provider>
      </BrowserRouter>
    );

    // Click delete button
    fireEvent.click(screen.getByText('Delete'));

    // Confirmation modal should appear
    expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument();
    
    // Confirm deletion
    fireEvent.click(screen.getByText('Delete', { selector: 'button' }));

    // Check if delete function was called
    await waitFor(() => {
      expect(mockDeleteBlog).toHaveBeenCalledWith(1);
    });
  });
});