import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

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
  console.log('Making request to:', config.baseURL + config.url, 'with data:', config.data);
  return config;
});

// Add response interceptor for better error logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

export const registerUser = async (userData) => {
  try {
    // Transform the data to match backend model
    const transformedData = {
      username: userData.username || userData.name, // support both formats
      email: userData.email,
      password: userData.password,
      role: userData.role || (userData.userType === 'adopter' ? 'USER' : 
            userData.userType === 'seller' ? 'SELLER' : 'USER')
    };

    console.log('Attempting to register user with data:', transformedData);
    const response = await api.post('/auth/register', transformedData);
    
    if (response.data) {
      console.log('Registration successful:', response.data);
      // Store the token and user data
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      localStorage.setItem('currentUser', JSON.stringify(response.data));
      return { 
        success: true, 
        data: response.data,
        message: 'Registration successful!'
      };
    }
    return { 
      success: false, 
      error: 'Registration failed - no data received' 
    };
  } catch (error) {
    console.error('Registration error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Registration failed'
    };
  }
};

export const loginUser = async (email, password) => {
  try {
    console.log('Attempting to login with email:', email);
    const response = await api.post('/auth/login', { email, password });
    
    if (response.data) {
      console.log('Login successful:', response.data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('currentUser', JSON.stringify(response.data));
      return { success: true, data: response.data };
    }
    return { success: false, error: 'Login failed - no data received' };
  } catch (error) {
    console.error('Login error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Login failed'
    };
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
  return { success: true };
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data.success ? response.data.user : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put('/users/profile', profileData);
    if (response.data.success) {
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error('Profile update error:', error.response?.data?.message || error.message);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update profile'
    };
  }
};