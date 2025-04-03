import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerPet = async (petData) => {
  try {
    const response = await api.post('/pets', petData);
    return response.data;
  } catch (error) {
    console.error('Pet registration error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to register pet'
    };
  }
};

export const getUserPets = async () => {
  try {
    const response = await api.get('/pets/user');
    return response.data;
  } catch (error) {
    console.error('Error getting user pets:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to get pets'
    };
  }
};

export const getAllPets = async () => {
  try {
    const response = await api.get('/pets');
    return response.data;
  } catch (error) {
    console.error('Error getting all pets:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to get pets'
    };
  }
};