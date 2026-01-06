import React from 'react';
import { Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import defaultPetImage from '../assets/default-pet.jpg';

export default function PetCard({ pet, onFavoriteToggle, isFavorite }) {
  const { addPetToCart, isProcessing, cart } = useCart();
  const { currentUser } = useAuth();

  const handleMeetPet = async () => {
    if (!pet.available) {
      toast.error('Sorry, this pet is no longer available');
      return;
    }

    if (cart.some(item => item.id === pet.id)) {
      toast('This pet is already in your cart');
      return;
    }

    try {
      await addPetToCart(pet);
    } catch (error) {
      console.error('Error adding pet to cart:', error);
      toast.error('Failed to add pet to cart. Please try again.');
    }
  };

  const handleImageError = (e) => {
    e.target.src = defaultPetImage;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={pet.imageUrls?.[0] || defaultPetImage}
          alt={pet.name}
          className="w-full h-48 object-cover"
          onError={handleImageError}
        />
        <button
          onClick={() => onFavoriteToggle(pet.id)}
          className={`absolute top-2 right-2 p-2 rounded-full ${
            isFavorite ? 'bg-red-500' : 'bg-white'
          }`}
        >
          <Heart
            className={`h-5 w-5 ${isFavorite ? 'text-white fill-current' : 'text-gray-400'}`}
          />
        </button>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-800">{pet.name}</h3>
          <span className="text-lg font-bold text-green-600">${pet.price}</span>
        </div>

        <div className="text-sm text-gray-600 mb-2">
          {pet.breed} • {pet.age} {pet.age === 1 ? 'year' : 'years'} • {pet.gender}
        </div>

        <div className="text-sm text-gray-500 mb-4">
          <span className="flex items-center">
            <svg className="h-4 w-4 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {pet.location}
          </span>
        </div>

        <p className="text-gray-700 mb-4 line-clamp-2">{pet.description}</p>

        <button
          onClick={handleMeetPet}
          disabled={isProcessing || !pet.available || cart.some(item => item.id === pet.id)}
          className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors duration-300 ${
            !pet.available
              ? 'bg-gray-400 cursor-not-allowed'
              : cart.some(item => item.id === pet.id)
              ? 'bg-green-500 cursor-not-allowed'
              : isProcessing
              ? 'bg-indigo-400 cursor-wait'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : !pet.available ? (
            'Not Available'
          ) : cart.some(item => item.id === pet.id) ? (
            'In Cart'
          ) : (
            'Meet Pet'
          )}
        </button>
      </div>
    </div>
  );
} 