import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function Welcome() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-white rounded-lg shadow-lg p-6 z-50 animate-slide-up">
      <button
        onClick={() => setIsOpen(false)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        <X className="h-5 w-5" />
      </button>

      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Welcome to PetConnect! 🐾
      </h2>

      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold">1</span>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Browse Pets</h3>
            <p className="text-sm text-gray-600">
              Use filters to find your perfect companion by species, age, and gender
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 font-semibold">2</span>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Meet Your Pet</h3>
            <p className="text-sm text-gray-600">
              Click "Meet Pet" to add them to your cart and schedule a meeting
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-purple-600 font-semibold">3</span>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Save Favorites</h3>
            <p className="text-sm text-gray-600">
              Click the heart icon to save pets you're interested in
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-600 font-semibold">4</span>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Complete Adoption</h3>
            <p className="text-sm text-gray-600">
              Process your adoption securely through our payment system
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <button
          onClick={() => setIsOpen(false)}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300"
        >
          Got it, thanks!
        </button>
      </div>
    </div>
  );
} 