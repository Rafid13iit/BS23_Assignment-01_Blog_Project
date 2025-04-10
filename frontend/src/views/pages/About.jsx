import React from 'react';

const About = () => {
  return (
    <div>
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">About Our Blog App</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-4">
            Welcome to our blogging platform! We aim to create a space where people can share ideas,
            knowledge, and experiences with a community of like-minded individuals.
          </p>
          <p className="text-gray-600 mb-4">
            Our platform is built with modern technologies including Django REST framework for the backend
            and React with Tailwind CSS for the frontend, providing a seamless and responsive user experience.
          </p>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">What We Offer</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Easy-to-use blog creation and management</li>
            <li>Commenting and reply system for engaging discussions</li>
            <li>Responsive design that works on all devices</li>
            <li>Secure user authentication and profile management</li>
            <li>Rich text editing for creating beautiful content</li>
          </ul>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Join Our Community</h2>
          <p className="text-gray-600 mb-4">
            Whether you're an experienced writer or just starting out, our platform provides the tools
            you need to create and share your content with the world.
          </p>
          <p className="text-gray-600">
            Register today to start your blogging journey with us!
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;