import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PostForm from '../../src/components/PostForm';
import { jest, describe, it, beforeEach, expect } from 'jest-mock'

// Mock dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

describe('PostForm Component', () => {
  const mockSubmit = jest.fn().mockResolvedValue(true);
  
  const defaultProps = {
    initialData: {},
    onSubmit: mockSubmit,
    loading: false,
    submitButtonText: 'Submit',
    title: 'Test Form'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form with correct fields', () => {
    render(
      <BrowserRouter>
        <PostForm {...defaultProps} />
      </BrowserRouter>
    );

    expect(screen.getByText('Test Form')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Subtitle (Optional)')).toBeInTheDocument();
    expect(screen.getByLabelText('Content')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('submits the form with valid data', async () => {
    render(
      <BrowserRouter>
        <PostForm {...defaultProps} />
      </BrowserRouter>
    );

    // Fill the form
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Test Title' }
    });
    
    fireEvent.change(screen.getByLabelText('Content'), {
      target: { value: 'Test content for the blog post' }
    });
    
    fireEvent.change(screen.getByLabelText('Status'), {
      target: { value: 'published' }
    });

    // Submit the form
    fireEvent.click(screen.getByText('Submit'));

    // Check if onSubmit was called with correct data
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        title: 'Test Title',
        subtitle: '',
        content: 'Test content for the blog post',
        status: 'published'
      });
    });
  });

  it('displays validation errors for required fields', async () => {
    render(
      <BrowserRouter>
        <PostForm {...defaultProps} />
      </BrowserRouter>
    );

    // Submit without filling required fields
    fireEvent.click(screen.getByText('Submit'));

    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(screen.getByText('Content is required')).toBeInTheDocument();
    });
  });

  it('pre-fills form with initial data', () => {
    const initialData = {
      id: 1,
      title: 'Initial Title',
      subtitle: 'Initial Subtitle',
      content: 'Initial content',
      status: 'published'
    };

    render(
      <BrowserRouter>
        <PostForm {...defaultProps} initialData={initialData} />
      </BrowserRouter>
    );

    expect(screen.getByLabelText('Title').value).toBe('Initial Title');
    expect(screen.getByLabelText('Subtitle (Optional)').value).toBe('Initial Subtitle');
    expect(screen.getByLabelText('Content').value).toBe('Initial content');
    expect(screen.getByLabelText('Status').value).toBe('published');
  });
});