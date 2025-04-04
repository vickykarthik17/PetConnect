import api from './userApi';

export const getCart = async () => {
  try {
    const response = await api.get('/cart');
    return {
      success: true,
      cart: response.data
    };
  } catch (error) {
    console.error('Error fetching cart:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch cart'
    };
  }
};

export const addToCart = async (petId) => {
  try {
    const response = await api.post('/cart/add', { petId });
    return {
      success: true,
      cart: response.data
    };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to add pet to cart'
    };
  }
};

export const removeFromCart = async (petId) => {
  try {
    const response = await api.post('/cart/remove', { petId });
    return {
      success: true,
      cart: response.data
    };
  } catch (error) {
    console.error('Error removing from cart:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to remove pet from cart'
    };
  }
};

export const clearCart = async () => {
  try {
    await api.post('/cart/clear');
    return {
      success: true
    };
  } catch (error) {
    console.error('Error clearing cart:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to clear cart'
    };
  }
};

export const checkout = async () => {
  try {
    const response = await api.post('/cart/checkout');
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