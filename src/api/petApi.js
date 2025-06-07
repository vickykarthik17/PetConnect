import api from './userApi';

export const getAllPets = async () => {
  try {
    const response = await api.get('/pets');
    return {
      success: true,
      pets: response.data
    };
  } catch (error) {
    console.error('Error fetching pets:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch pets'
    };
  }
};

export const getPetById = async (petId) => {
  try {
    const response = await api.get(`/pets/${petId}`);
    return {
      success: true,
      pet: response.data
    };
  } catch (error) {
    console.error('Error fetching pet details:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch pet details'
    };
  }
};

export const registerPet = async (petData) => {
  try {
    const formData = new FormData();
    
    // Create a separate object for pet data
    const pet = {
      name: petData.name,
      species: petData.species,
      breed: petData.breed,
      age: parseInt(petData.age),
      gender: petData.gender,
      description: petData.description,
      price: parseFloat(petData.price),
      available: petData.available
    };

    // Add pet data as JSON string
    formData.append('pet', new Blob([JSON.stringify(pet)], { type: 'application/json' }));

    // Add images if present
    if (petData.images && petData.images.length > 0) {
      petData.images.forEach(image => {
        formData.append('images', image);
      });
    }

    const response = await api.post('/pets', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return {
      success: true,
      pet: response.data
    };
  } catch (error) {
    console.error('Error registering pet:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to register pet'
    };
  }
};

export const updatePet = async (petId, petData) => {
  try {
    const response = await api.put(`/pets/${petId}`, petData);
    return {
      success: true,
      pet: response.data
    };
  } catch (error) {
    console.error('Error updating pet:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update pet'
    };
  }
};

export const deletePet = async (petId) => {
  try {
    await api.delete(`/pets/${petId}`);
    return {
      success: true
    };
  } catch (error) {
    console.error('Error deleting pet:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete pet'
    };
  }
};

export const toggleFavorite = async (petId) => {
  try {
    const response = await api.post(`/pets/${petId}/favorite`);
    return {
      success: true,
      isFavorite: response.data.isFavorite
    };
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update favorite status'
    };
  }
};

export const getFavorites = async () => {
  try {
    const response = await api.get('/pets/favorites');
    return {
      success: true,
      pets: response.data
    };
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch favorites'
    };
  }
};

export const getUserPets = async () => {
  try {
    const response = await api.get('/pets/user');
    return {
      success: true,
      pets: response.data
    };
  } catch (error) {
    console.error('Error fetching user pets:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch your pets'
    };
  }
};