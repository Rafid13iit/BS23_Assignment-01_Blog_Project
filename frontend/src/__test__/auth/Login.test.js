import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../../src/auth/Login';
import { useAuth } from '../../hooks/useAuth';
import { jest, describe, it, beforeEach, afterEach, expect } from 'jest-mock'
// Mock dependencies
jest.mock('../../hooks/useAuth');

describe('Login Component', () => {
  const mockLogin = jest.fn().mockResolvedValue(true);
  
  beforeEach(() => {
    useAuth.mockReturnValue({
      login: mockLogin,
      loading: false
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login form correctly', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByText('Log in to your account')).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('handles form submission correctly', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Fill the form
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' }
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));

    // Check if login function was called with correct data
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });

  it('shows loading state during submission', async () => {
    // Mock loading state
    useAuth.mockReturnValue({
      login: jest.fn(() => new Promise(resolve => setTimeout(() => resolve(true), 100))),
      loading: true
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Fill and submit the form
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByRole('button'));

    // Check for loading state
    expect(screen.queryByRole('button', { name: 'Log in' })).not.toBeInTheDocument();
    // Note: This might fail depending on how LoadingSpinner is implemented
    // You might need to check for a different indicator of loading state
  });
});