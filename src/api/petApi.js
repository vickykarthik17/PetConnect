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
    
    // Add pet data to FormData
    Object.keys(petData).forEach(key => {
      if (key === 'images') {
        petData.images.forEach(image => {
          formData.append('images', image);
        });
      } else {
        formData.append(key, petData[key]);
      }
    });

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