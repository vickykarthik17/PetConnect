import React, { useState } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';

export function PetCard({ pet }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();
  const { addPetToCart, cart } = useCart();
  const navigate = useNavigate();

  const isInCart = cart.some(item => item.id === pet.id);

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUser) {
      toast.error('Please login to add pets to favorites');
      navigate('/auth');
      return;
    }

    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      toast.error('Please login to add pets to cart');
      navigate('/auth');
      return;
    }

    if (isInCart) {
      navigate('/cart');
      return;
    }

    setIsLoading(true);
    try {
      const success = await addPetToCart(pet.id);
      if (success) {
        toast.success(`${pet.name} added to cart`);
        navigate('/cart');
      } else {
        toast.error('Failed to add pet to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('An error occurred while adding to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMeetPet = async () => {
    if (!currentUser) {
      toast.error('Please login to meet pets');
      navigate('/auth');
      return;
    }

    if (!pet.available) {
      toast.error('This pet is no longer available for adoption');
      return;
    }

    setIsLoading(true);
    try {
      if (!isInCart) {
        const success = await addPetToCart(pet.id);
        if (!success) {
          toast.error('Failed to add pet to cart');
          return;
        }
        toast.success(`${pet.name} added to cart`);
      }
      navigate('/cart', { 
        state: { 
          selectedPet: pet,
          fromMeetPet: true 
        } 
      });
    } catch (error) {
      console.error('Error in meet pet flow:', error);
      toast.error('An error occurred while processing your request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <img
          src={pet.imageUrl || 'https://via.placeholder.com/300x200?text=Pet+Image'}
          alt={pet.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={handleFavorite}
            className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
            disabled={isLoading}
          >
            <Heart
              className={`w-6 h-6 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </button>
          <button
            onClick={handleAddToCart}
            className={`p-2 rounded-full transition-colors ${
              isInCart 
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-white/80 hover:bg-white text-gray-600'
            }`}
            disabled={isLoading}
          >
            <ShoppingCart className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-gray-800">{pet.name}</h3>
          <div className="text-lg font-semibold text-green-600">
            ${pet.price || '0'}
          </div>
        </div>
        <div className="mt-1 text-sm text-gray-600">
          {pet.breed} • {pet.age} {pet.age === 1 ? 'year' : 'years'} • {pet.gender}
        </div>
        <div className="mt-1 text-sm text-gray-600">
          <span className="flex items-center">
            📍 {pet.location}
          </span>
        </div>
        <p className="mt-2 text-gray-700 line-clamp-2">{pet.description}</p>
        
        <button
          onClick={handleMeetPet}
          className={`mt-4 w-full py-2 px-4 rounded-md transition-colors ${
            isInCart 
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-orange-500 hover:bg-orange-600 text-white'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading || !pet.available}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : isInCart ? (
            'View in Cart'
          ) : !pet.available ? (
            'Not Available'
          ) : (
            `Meet ${pet.name}`
          )}
        </button>
      </div>
    </div>
  );
} 