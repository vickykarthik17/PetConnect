import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8082/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  timeout: 10000
});

// Update the registration data transformation
export const registerUser = async (userData) => {
  try {
    // Validate required fields
    if (!userData.username || !userData.email || !userData.password) {
      return {
        success: false,
        error: 'Please fill in all required fields'
      };
    }

    const transformedData = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: 'USER' // Explicitly set role
    };

    // Debug logging
    console.log('Registration payload:', {
      ...transformedData,
      password: '[REDACTED]'
    });

    const response = await api.post('/auth/register', transformedData);
    
    if (response.data) {
      console.log('Registration response:', {
        ...response.data,
        token: response.data.token ? '[REDACTED]' : null
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        
        const userData = {
          username: response.data.username,
          email: response.data.email,
          role: response.data.role,
          token: response.data.token
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));

        return { 
          success: true, 
          user: userData,
          token: response.data.token,
          message: 'Registration successful!'
        };
      }
    }

    return { 
      success: false, 
      error: response.data?.message || 'Registration failed - invalid response' 
    };
  } catch (error) {
    // Debug logging for errors
    console.error('Registration error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      data: error.response?.data
    });

    // Improved error handling
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error ||
                        error.message || 
                        'Registration failed';
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

// Add request interceptor to add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    }
    return Promise.reject(error);
  }
);

export const loginUser = async (credentials) => {
  try {
    if (!credentials.username) {
      return {
        success: false,
        error: 'Username is required'
      };
    }

    // Transform credentials to match Spring Boot AuthRequest format exactly
    const loginData = {
      username: credentials.username,
      password: credentials.password
    };

    // Debug logging for request
    console.log('Login request payload:', {
      username: loginData.username,
      password: '[REDACTED]'
    });

    const response = await api.post('/auth/login', loginData);
    
    if (response.data) {
      console.log('Login response:', {
        ...response.data,
        token: response.data.token ? '[REDACTED]' : null
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        
        const userData = {
          username: response.data.username || loginData.username,
          email: response.data.email,
          role: response.data.role || 'USER',
          token: response.data.token
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        return {
          success: true,
          user: userData,
          token: response.data.token
        };
      }
    }
    
    return {
      success: false,
      error: 'Invalid login response from server'
    };
  } catch (error) {
    console.error('Login error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    // More specific error message based on status code
    let errorMessage;
    switch (error.response?.status) {
      case 400:
        errorMessage = 'Invalid username or password';
        break;
      case 401:
        errorMessage = 'Incorrect username or password';
        break;
      case 404:
        errorMessage = 'Login service not found - please try again';
        break;
      case 500:
        errorMessage = 'Server error - please try again later';
        break;
      default:
        errorMessage = 'Login failed - please check your credentials';
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put('/users/profile', profileData);
    
    if (response.data) {
      const updatedUser = {
        ...response.data,
        token: localStorage.getItem('token') // Preserve the existing token
      };
      
      // Update localStorage with new user data
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      return {
        success: true,
        user: updatedUser
      };
    }
    
    return {
      success: false,
      error: 'Profile update failed - invalid response'
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Profile update failed'
    };
  }
};

export default api;