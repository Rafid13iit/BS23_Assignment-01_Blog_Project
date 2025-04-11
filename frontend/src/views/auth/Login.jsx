import React from 'react';
import { Link } from 'react-router-dom';
import { loginSchema } from '../../utils/validationSchemas';
import { useAuth } from '../../hooks/useAuth';
import AuthenticationForm from '../components/AuthenticationForm';

const Login = () => {
  const { login, loading } = useAuth();

  const fields = [
    {
      id: 'email',
      name: 'email',
      type: 'email',
      label: 'Email address',
      placeholder: 'Email address'
    },
    {
      id: 'password',
      name: 'password',
      type: 'password',
      label: 'Password',
      placeholder: 'Password'
    }
  ];

  const forgotPasswordLink = (
    <div className="text-sm">
      {/* <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
        Forgot your password?
      </Link> */}
    </div>
  );

  return (
    <AuthenticationForm
      title="Log in to your account"
      schema={loginSchema}
      onSubmit={login}
      loading={loading}
      fields={fields}
      submitButtonText="Log in"
      footerText="Don't have an account?"
      footerLinkText="Register"
      footerLinkPath="/register"
      extraLinks={forgotPasswordLink}
    />
  );
};

export default Login;