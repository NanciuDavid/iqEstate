import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-9xl font-bold text-blue-900 mb-6">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-xl text-gray-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/" 
            className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-blue-900 text-white font-medium hover:bg-blue-800 transition-colors"
          >
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
          <Link 
            to="/properties" 
            className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-white border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            <Search className="mr-2 h-5 w-5" />
            Search Properties
          </Link>
        </div>
        
        <button 
          onClick={() => window.history.back()}
          className="mt-8 inline-flex items-center text-blue-900 font-medium hover:text-blue-700"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;