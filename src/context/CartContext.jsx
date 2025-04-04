import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { getCart, addToCart, removeFromCart, clearCart, checkout } from '../api/cartApi';
import { startHealthCheck, isBackendAvailable, getConnectionStatus } from '../utils/backendHealth';
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

    // Start health check and get cleanup function
    const cleanup = startHealthCheck();
    return cleanup;
  }, [currentUser]);

  const getErrorDetails = (status) => {
    if (!status.lastError) return '';
    
    const { message, code, status: errorStatus } = status.lastError;
    let details = '';
    
    if (code === 'ECONNABORTED') {
      details = 'Connection timed out. The server may be down or unreachable.';
    } else if (errorStatus === 0) {
      details = 'Network error. Please check your internet connection.';
    } else {
      details = message;
    }
    
    return ` (${details})`;
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getCart();
      
      if (response.success) {
        setCart(response.cart || []);
        setIsOffline(response.isOffline || false);
        
        if (response.isOffline) {
          const status = getConnectionStatus();
          const errorDetails = getErrorDetails(status);
          toast(`Working in offline mode${errorDetails}. Last check: ${status.lastCheck ? new Date(status.lastCheck).toLocaleTimeString() : 'never'}`, {
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
      const status = getConnectionStatus();
      const errorDetails = getErrorDetails(status);
      setError(`Failed to load cart${errorDetails}`);
      toast.error(`Failed to load cart${errorDetails}`);
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
          const status = getConnectionStatus();
          const errorDetails = getErrorDetails(status);
          toast(`Added to cart (offline mode${errorDetails}). Changes will sync when the server is available.`, {
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
      const status = getConnectionStatus();
      const errorDetails = getErrorDetails(status);
      setError(`Failed to add to cart${errorDetails}`);
      toast.error(`Failed to add to cart${errorDetails}`);
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
          const status = getConnectionStatus();
          const errorDetails = getErrorDetails(status);
          toast(`Removed from cart (offline mode${errorDetails}). Changes will sync when the server is available.`, {
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
      const status = getConnectionStatus();
      const errorDetails = getErrorDetails(status);
      setError(`Failed to remove from cart${errorDetails}`);
      toast.error(`Failed to remove from cart${errorDetails}`);
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
          const status = getConnectionStatus();
          const errorDetails = getErrorDetails(status);
          toast(`Cart cleared (offline mode${errorDetails}). Changes will sync when the server is available.`, {
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
      const status = getConnectionStatus();
      const errorDetails = getErrorDetails(status);
      setError(`Failed to clear cart${errorDetails}`);
      toast.error(`Failed to clear cart${errorDetails}`);
    } finally {
      setLoading(false);
    }
  };

  const processCheckout = async () => {
    if (!isBackendAvailable()) {
      const status = getConnectionStatus();
      const errorDetails = getErrorDetails(status);
      toast.error(`Cannot process checkout while offline${errorDetails}. Last check: ${status.lastCheck ? new Date(status.lastCheck).toLocaleTimeString() : 'never'}`);
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
      const status = getConnectionStatus();
      const errorDetails = getErrorDetails(status);
      setError(`Failed to process checkout${errorDetails}`);
      toast.error(`Failed to process checkout${errorDetails}`);
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