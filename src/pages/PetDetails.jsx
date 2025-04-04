import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, Phone, Mail, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getPetById, toggleFavorite } from '../api/petApi';
import { toast } from 'react-hot-toast';

export function PetDetails() {
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchPetDetails();
  }, [id]);

  const fetchPetDetails = async () => {
    try {
      setLoading(true);
      const response = await getPetById(id);
      if (response.success) {
        setPet(response.pet);
        setIsFavorite(response.pet.isFavorite);
      } else {
        toast.error('Failed to fetch pet details');
        navigate('/pets');
      }
    } catch (error) {
      console.error('Error fetching pet details:', error);
      toast.error('Error loading pet details');
      navigate('/pets');
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!currentUser) {
      toast.error('Please login to add pets to favorites');
      navigate('/auth');
      return;
    }

    try {
      const response = await toggleFavorite(id);
      if (response.success) {
        setIsFavorite(response.isFavorite);
        toast.success(response.isFavorite ? 'Added to favorites' : 'Removed from favorites');
      } else {
        toast.error('Failed to update favorite status');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Error updating favorite status');
    }
  };

  const handleContact = (method) => {
    if (!currentUser) {
      toast.error('Please login to contact pet owners');
      navigate('/auth');
      return;
    }

    // Implement contact logic based on method (phone/email)
    switch (method) {
      case 'phone':
        window.location.href = `tel:${pet.owner.phone}`;
        break;
      case 'email':
        window.location.href = `mailto:${pet.owner.email}?subject=Interested in adopting ${pet.name}`;
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">Pet not found</p>
        <button
          onClick={() => navigate('/pets')}
          className="mt-4 inline-flex items-center text-orange-500 hover:text-orange-600"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Pets
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/pets')}
        className="mb-6 inline-flex items-center text-orange-500 hover:text-orange-600"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Pets
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pet Images */}
        <div className="relative">
          <img
            src={pet.imageUrl || 'https://via.placeholder.com/600x400?text=Pet+Image'}
            alt={pet.name}
            className="w-full h-96 object-cover rounded-lg"
          />
          <button
            onClick={handleFavorite}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
          >
            <Heart
              className={`w-6 h-6 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </button>
        </div>

        {/* Pet Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{pet.name}</h1>
          
          <div className="space-y-4 mb-8">
            <p className="text-lg text-gray-600">
              {pet.breed} • {pet.age} {pet.age === 1 ? 'year' : 'years'} • {pet.gender}
            </p>
            
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-2" />
              {pet.location}
            </div>

            <p className="text-gray-700">{pet.description}</p>
          </div>

          {/* Contact Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => handleContact('phone')}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Call Owner
            </button>

            <button
              onClick={() => handleContact('email')}
              className="w-full flex items-center justify-center gap-2 bg-white text-orange-500 border-2 border-orange-500 py-3 px-4 rounded-lg hover:bg-orange-50 transition-colors"
            >
              <Mail className="w-5 h-5" />
              Email Owner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 