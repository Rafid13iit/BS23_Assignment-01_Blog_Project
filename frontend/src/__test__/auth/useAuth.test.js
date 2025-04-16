import { renderHook, act } from '@testing-library/react-hooks';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import axios from 'axios';
import { jest, describe, it, beforeEach, expect } from 'jest-mock'

// Mock dependencies
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn()
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

jest.mock('axios');

// Mock AppContext
jest.mock('../../context/AppContext', () => ({
  AppContext: {
    Consumer: ({ children }) => children({
      SetIsLoggedin: jest.fn(),
      SetUserData: jest.fn()
    }),
    Provider: ({ children }) => children
  },
  useContext: () => ({
    SetIsLoggedin: jest.fn(),
    SetUserData: jest.fn()
  })
}));

describe('useAuth hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('login functionality', () => {
    it('should login successfully and redirect to dashboard', async () => {
      // Mock successful API response
      axios.mockResolvedValueOnce({
        data: {
          token: {
            access: 'test-access-token',
            refresh: 'test-refresh-token'
          },
          data: {
            id: 1,
            username: 'testuser',
            email: 'test@example.com'
          }
        }
      }).mockResolvedValueOnce({
        data: {
          data: {
            id: 1,
            username: 'testuser',
            email: 'test@example.com'
          }
        }
      });

      const { result } = renderHook(() => useAuth());

      const loginCredentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      let success;
      await act(async () => {
        success = await result.current.login(loginCredentials);
      });

      expect(success).toBe(true);
      expect(localStorage.getItem('access_token')).toBe('test-access-token');
      expect(localStorage.getItem('refresh_token')).toBe('test-refresh-token');
      expect(toast.success).toHaveBeenCalledWith('Login successful!');
    });

    it('should handle login failure', async () => {
      // Mock API error response
      axios.mockRejectedValueOnce({
        response: { 
          data: { message: 'Invalid credentials' } 
        }
      });

      const { result } = renderHook(() => useAuth());

      const loginCredentials = {
        email: 'wrong@example.com',
        password: 'wrongpassword'
      };

      let success;
      await act(async () => {
        success = await result.current.login(loginCredentials);
      });

      expect(success).toBe(false);
      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('refresh_token')).toBeNull();
    });
  });

  describe('register functionality', () => {
    it('should register successfully and redirect to verification page', async () => {
      // Mock successful API response
      axios.mockResolvedValueOnce({
        data: {
          token: {
            access: 'test-access-token',
            refresh: 'test-refresh-token'
          },
          data: {
            id: 1,
            username: 'newuser',
            email: 'new@example.com'
          }
        }
      });

      const { result } = renderHook(() => useAuth());

      const userData = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
        password2: 'password123'
      };

      let success;
      await act(async () => {
        success = await result.current.register(userData);
      });

      expect(success).toBe(true);
      expect(localStorage.getItem('access_token')).toBe('test-access-token');
      expect(localStorage.getItem('refresh_token')).toBe('test-refresh-token');
      expect(toast.success).toHaveBeenCalledWith('Registration successful! Please verify your email.');
    });

    it('should handle registration failure', async () => {
      // Mock API error response
      axios.mockRejectedValueOnce({
        response: { 
          data: { message: 'Email already exists' } 
        }
      });

      const { result } = renderHook(() => useAuth());

      const userData = {
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'password123',
        password2: 'password123'
      };

      let success;
      await act(async () => {
        success = await result.current.register(userData);
      });

      expect(success).toBe(false);
    });
  });

  describe('email verification functionality', () => {
    it('should verify email successfully', async () => {
      // Mock successful API response
      axios.mockResolvedValueOnce({
        data: { message: 'Email verified successfully' }
      });

      const { result } = renderHook(() => useAuth());

      const verificationData = {
        email: 'test@example.com',
        email_otp: '123456'
      };

      let success;
      await act(async () => {
        success = await result.current.verifyEmail(verificationData);
      });

      expect(success).toBe(true);
      expect(toast.success).toHaveBeenCalledWith('Email verified successfully!');
    });

    it('should handle verification failure', async () => {
      // Mock API error response
      axios.mockRejectedValueOnce({
        response: { 
          data: { message: 'Invalid OTP' } 
        }
      });

      const { result } = renderHook(() => useAuth());

      const verificationData = {
        email: 'test@example.com',
        email_otp: '000000'
      };

      let success;
      await act(async () => {
        success = await result.current.verifyEmail(verificationData);
      });

      expect(success).toBe(false);
    });
  });

  describe('change password functionality', () => {
    it('should change password successfully', async () => {
      // Mock successful API response
      axios.mockResolvedValueOnce({
        data: { message: 'Password changed successfully' }
      });

      const { result } = renderHook(() => useAuth());

      const passwordData = {
        password: 'newpassword123',
        password2: 'newpassword123'
      };

      let success;
      await act(async () => {
        success = await result.current.changePassword(passwordData);
      });

      expect(success).toBe(true);
      expect(toast.success).toHaveBeenCalledWith('Password changed successfully!');
    });

    it('should handle password change failure', async () => {
      // Mock API error response
      axios.mockRejectedValueOnce({
        response: { 
          data: { message: 'Current password is incorrect' } 
        }
      });

      const { result } = renderHook(() => useAuth());

      const passwordData = {
        password: 'wrongpassword',
        password2: 'wrongpassword'
      };

      let success;
      await act(async () => {
        success = await result.current.changePassword(passwordData);
      });

      expect(success).toBe(false);
    });
  });
});