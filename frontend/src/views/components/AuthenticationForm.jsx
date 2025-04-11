import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const AuthenticationForm = ({
  title,
  schema,
  onSubmit,
  loading,
  fields,
  submitButtonText,
  footerText,
  footerLinkText,
  footerLinkPath,
  extraLinks
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {title}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            {fields.map((field, index) => (
              <div className="mb-4" key={field.id}>
                <label htmlFor={field.id} className="sr-only">{field.label}</label>
                <input
                  id={field.id}
                  type={field.type}
                  {...register(field.name)}
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${
                    index === 0 ? 'rounded-t-md' : ''
                  } ${index === fields.length - 1 ? 'rounded-b-md' : ''}`}
                  placeholder={field.placeholder}
                />
                {errors[field.name] && (
                  <p className="mt-1 text-sm text-red-600">{errors[field.name].message}</p>
                )}
              </div>
            ))}
          </div>

          {extraLinks && (
            <div className="flex items-center justify-between">
              {extraLinks}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? <LoadingSpinner /> : submitButtonText}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            {footerText}{' '}
            <Link to={footerLinkPath} className="font-medium text-indigo-600 hover:text-indigo-500">
              {footerLinkText}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationForm;