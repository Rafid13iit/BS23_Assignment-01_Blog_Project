import { useContext } from 'react';
import { useApi } from './useApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';

export const useAuth = () => {
  const api = useApi();
  const navigate = useNavigate();
  const { SetIsLoggedin, SetUserData } = useContext(AppContext);

  const register = async (userData) => {
    // console.log('userData', userData);
    const result = await api.post('/users/register/', userData, false);
    console.log('result', result);
    
    if (result.success && result.data && result.data.token) {
      const { token, data } = result.data;
      localStorage.setItem('access_token', token.access);
      localStorage.setItem('refresh_token', token.refresh);
      localStorage.setItem('user_data', JSON.stringify(data));
      
      SetIsLoggedin(true);
      SetUserData(data);
      
      toast.success('Registration successful! Please verify your email.');
      navigate('/verify');
      return true;
    }
    return false;
  };

  const login = async (credentials) => {
    const result = await api.post('/users/login/', credentials, false);
    if (result.success) {
      const { token, data } = result.data;
      localStorage.setItem('user_data', JSON.stringify(data)); //Added extra   
      localStorage.setItem('access_token', token.access);
      localStorage.setItem('refresh_token', token.refresh);
      
      // Fetch user data
      const userResult = await api.get('/users/dashboard/');
      if (userResult.success) {
        localStorage.setItem('user_data', JSON.stringify(userResult.data.data));
        SetUserData(userResult.data.data);
      }
      
      SetIsLoggedin(true);
      toast.success('Login successful!');
      navigate('/dashboard');
      return true;
    }
    return false;
  };

//   const logout = () => {
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('refresh_token');
//     localStorage.removeItem('user_data');
//     SetIsLoggedin(false);
//     SetUserData(null);
//     toast.success('Logout successful!');
//     navigate('/');
//   };
  
  const verifyEmail = async (verificationData) => {
    const result = await api.post('/users/verify/', verificationData, false);
    if (result.success) {
      toast.success('Email verified successfully!');
      navigate('/login');
      return true;
    }
    return false;
  };

  const changePassword = async (passwordData) => {
    const result = await api.post('/users/changepassword/', passwordData);
    if (result.success) {
      toast.success('Password changed successfully!');
      return true;
    }
    return false;
  };

  return {
    register,
    login,
    verifyEmail,
    changePassword,
    loading: api.loading,
    error: api.error
  };
};