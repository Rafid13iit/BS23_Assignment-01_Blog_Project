import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    };
  };

  const handleApiError = (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    toast.error(message);
    setError(message);
    return { success: false, data: null, error: message };
  };

  const makeRequest = async (method, url, data = null, requiresAuth = true) => {
    setLoading(true);
    setError(null);
    
    try {
      const headers = requiresAuth ? getAuthHeaders() : { 'Content-Type': 'application/json' };
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const fullUrl = `${backendUrl}${url}`;
      
      const response = await axios({
        method,
        url: fullUrl,
        data,
        headers,
      });
      
      setLoading(false);
      return { success: true, data: response.data, error: null };
    } catch (error) {
      setLoading(false);
      return handleApiError(error);
    }
  };

  return {
    loading,
    error,
    get: (url, requiresAuth = true) => makeRequest('get', url, null, requiresAuth),
    post: (url, data, requiresAuth = true) => makeRequest('post', url, data, requiresAuth),
    put: (url, data, requiresAuth = true) => makeRequest('put', url, data, requiresAuth),
    delete: (url, data, requiresAuth = true) => makeRequest('delete', url, data, requiresAuth),
  };
};