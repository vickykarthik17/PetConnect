import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { getCart, addToCart, removeFromCart, clearCart, checkout } from '../api/cartApi';
import { startHealthCheck, isBackendAvailable } from '../utils/backendHealth';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      fetchCart();
    } else {
      setCart([]);
      setLoading(false);
    }

    // Start health check
    const cleanup = startHealthCheck();
    return cleanup;
  }, [currentUser]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCart();
      
      if (response.success) {
        setCart(response.cart || []);
        setIsOffline(response.isOffline || false);
        if (response.isOffline) {
          toast('Working in offline mode. Changes will sync when the server is available.', {
            icon: '⚠️',
            duration: 5000,
          });
        }
      } else {
        setError(response.error);
        toast.error(response.error);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Failed to load cart. Please try again.');
      toast.error('Failed to load cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addPetToCart = async (petId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await addToCart(petId);
      
      if (response.success) {
        setCart(response.cart || []);
        setIsOffline(response.isOffline || false);
        if (response.isOffline) {
          toast('Added to cart (offline mode). Changes will sync when the server is available.', {
            icon: '⚠️',
            duration: 5000,
          });
        } else {
          toast.success('Pet added to cart');
        }
        return true;
      } else {
        setError(response.error);
        toast.error(response.error);
        return false;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError('Failed to add to cart. Please try again.');
      toast.error('Failed to add to cart. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removePetFromCart = async (petId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await removeFromCart(petId);
      
      if (response.success) {
        setCart(response.cart || []);
        setIsOffline(response.isOffline || false);
        if (response.isOffline) {
          toast('Removed from cart (offline mode). Changes will sync when the server is available.', {
            icon: '⚠️',
            duration: 5000,
          });
        } else {
          toast.success('Pet removed from cart');
        }
      } else {
        setError(response.error);
        toast.error(response.error);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      setError('Failed to remove from cart. Please try again.');
      toast.error('Failed to remove from cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearUserCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await clearCart();
      
      if (response.success) {
        setCart([]);
        setIsOffline(response.isOffline || false);
        if (response.isOffline) {
          toast('Cart cleared (offline mode). Changes will sync when the server is available.', {
            icon: '⚠️',
            duration: 5000,
          });
        } else {
          toast.success('Cart cleared successfully');
        }
      } else {
        setError(response.error);
        toast.error(response.error);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      setError('Failed to clear cart. Please try again.');
      toast.error('Failed to clear cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const processCheckout = async () => {
    if (!isBackendAvailable()) {
      toast.error('Cannot process checkout while offline. Please try again when the server is available.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await checkout();
      
      if (response.success) {
        setCart([]);
        toast.success('Checkout successful!');
        navigate('/orders');
      } else {
        setError(response.error);
        toast.error(response.error);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      setError('Failed to process checkout. Please try again.');
      toast.error('Failed to process checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        isOffline,
        addPetToCart,
        removePetFromCart,
        clearUserCart,
        processCheckout,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 