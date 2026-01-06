import React from 'react';
import { Link } from 'react-router-dom';
import { Dog } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Dog className="text-orange-500" size={32} />
          <div>
            <h1 className="text-xl font-bold text-gray-900">PetConnect</h1>
            <p className="text-sm text-gray-600">Find your furry friend</p>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-gray-700"></span>
          <Link
            to="/donate"
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
          >
            Donate Now
          </Link>
        </div>
      </div>
    </header>
  );
}