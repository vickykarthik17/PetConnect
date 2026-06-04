import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <AlertTriangle size={64} className="text-orange-500 mb-6" />
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
      <p className="text-xl text-gray-600 mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link 
        to="/" 
        className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition flex items-center gap-2"
      >
        <Home size={20} />
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;