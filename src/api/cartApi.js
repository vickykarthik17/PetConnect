import axios from 'axios';
import { withBackendFallback, isBackendAvailable } from '../utils/backendHealth';

const API_URL = 'http://localhost:8082/api';

// Create axios instance with custom config
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to handle token
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

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.code === 'ECONNABORTED') {
      // Retry the request if it times out
      if (error.config && !error.config._retry) {
        error.config._retry = true;
        return api(error.config);
      }
    }
    return Promise.reject(error);
  }
);

const getFallbackCart = () => {
  const localCart = localStorage.getItem('cart');
  return localCart ? JSON.parse(localCart) : [];
};

const saveCartLocally = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

export const getCart = async () => {
  return withBackendFallback(
    async () => {
      const response = await api.get('/cart');
      const cart = response.data;
      saveCartLocally(cart);
      return {
        success: true,
        cart
      };
    },
    () => ({
      success: true,
      cart: getFallbackCart(),
      isOffline: true
    })
  );
};

export const addToCart = async (petId) => {
  return withBackendFallback(
    async () => {
      const response = await api.post('/cart/add', { petId });
      const cart = response.data;
      saveCartLocally(cart);
      return {
        success: true,
        cart
      };
    },
    () => {
      const localCart = getFallbackCart();
      if (!localCart.some(item => item.id === petId)) {
        localCart.push({ id: petId });
        saveCartLocally(localCart);
      }
      return {
        success: true,
        cart: localCart,
        isOffline: true
      };
    }
  );
};

export const removeFromCart = async (petId) => {
  return withBackendFallback(
    async () => {
      const response = await api.post('/cart/remove', { petId });
      const cart = response.data;
      saveCartLocally(cart);
      return {
        success: true,
        cart
      };
    },
    () => {
      const localCart = getFallbackCart().filter(item => item.id !== petId);
      saveCartLocally(localCart);
      return {
        success: true,
        cart: localCart,
        isOffline: true
      };
    }
  );
};

export const clearCart = async () => {
  return withBackendFallback(
    async () => {
      const response = await api.post('/cart/clear');
      const cart = response.data;
      saveCartLocally(cart);
      return {
        success: true,
        cart
      };
    },
    () => {
      saveCartLocally([]);
      return {
        success: true,
        cart: [],
        isOffline: true
      };
    }
  );
};

export const checkout = async () => {
  if (!isBackendAvailable()) {
    return {
      success: false,
      error: 'Cannot process checkout while offline. Please try again when the server is available.'
    };
  }

  try {
    const response = await api.post('/cart/checkout');
    saveCartLocally([]);
    return {
      success: true,
      order: response.data
    };
  } catch (error) {
    console.error('Error during checkout:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to complete checkout'
    };
  }
}; 