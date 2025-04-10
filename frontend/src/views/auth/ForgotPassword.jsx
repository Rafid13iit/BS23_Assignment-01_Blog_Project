import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { post, loading } = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    const result = await post('/users/changepassword/', { email }, false);
    
    if (result.success) {
      toast.success('Password reset instructions sent to your email!');
      navigate('/login');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Forgot Password</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Reset Password'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <Link to="/login" className="text-blue-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;