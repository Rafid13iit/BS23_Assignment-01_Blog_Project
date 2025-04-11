import React from 'react';
import { registerSchema } from '../../utils/validationSchemas';
import { useAuth } from '../../hooks/useAuth';
import AuthenticationForm from '../components/AuthenticationForm';

const Register = () => {
  const { register: registerUser, loading } = useAuth();

  const fields = [
    {
      id: 'username',
      name: 'username',
      type: 'text',
      label: 'Username',
      placeholder: 'Username'
    },
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
    },
    {
      id: 'password2',
      name: 'password2',
      type: 'password',
      label: 'Confirm Password',
      placeholder: 'Confirm Password'
    }
  ];

  return (
    <AuthenticationForm
      title="Create your account"
      schema={registerSchema}
      onSubmit={registerUser}
      loading={loading}
      fields={fields}
      submitButtonText="Register"
      footerText="Already have an account?"
      footerLinkText="Log in"
      footerLinkPath="/login"
    />
  );
};

export default Register;