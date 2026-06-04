import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { getCart, addToCart, removeFromCart, clearCart, checkout } from '../api/cartApi';
import { startHealthCheck, isBackendAvailable, getConnectionStatus } from '../utils/backendHealth';

const CartContext = createContext();
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    
    const initializeCart = async () => {
      if (currentUser) {
        try {
          await fetchCart();
        } catch (error) {
          console.error('Failed to initialize cart:', error);
        }
      } else {
        setCart([]);
        setLoading(false);
      }
    };

    // Start health check and get cleanup function
    const cleanup = startHealthCheck();
    initializeCart();

    return () => {
      mounted = false;
      cleanup();
    };
  }, [currentUser]);

  // Add automatic retry for fetchCart
  useEffect(() => {
    let retryTimeout;

    if (error && retryCount < 3) {
      retryTimeout = setTimeout(() => {
        console.log(`Retrying cart fetch (attempt ${retryCount + 1})...`);
        setRetryCount(prev => prev + 1);
        fetchCart();
      }, Math.pow(2, retryCount) * 1000); // Exponential backoff
    }

    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [error, retryCount]);

  const getErrorDetails = (status) => {
    if (!status.lastError) return '';
    
    const { message, code, status: errorStatus } = status.lastError;
    let details = '';
    
    if (code === 'ECONNABORTED') {
      details = 'Connection timed out. Please check if the backend server is running.';
    } else if (code === 'ECONNREFUSED') {
      details = 'Cannot connect to the backend server. Please ensure it is running.';
    } else if (errorStatus === 0) {
      details = 'Network error. Please check your internet connection.';
    } else if (errorStatus === 404) {
      details = 'Backend API endpoint not found. Please check the server configuration.';
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
        const wasOffline = isOffline;
        setIsOffline(response.isOffline || false);
        
        // Only show offline warning if:
        // 1. We're actually offline (response.isOffline is true)
        // 2. Backend health check confirms it's unavailable
        // 3. We weren't already offline (to avoid repeated toasts)
        if (response.isOffline && !isBackendAvailable() && !wasOffline) {
          const status = getConnectionStatus();
          const errorDetails = getErrorDetails(status);
          const lastCheck = status.lastCheckTime ? new Date(status.lastCheckTime).toLocaleTimeString() : 'just now';
          toast(`Working in offline mode${errorDetails}. Last check: ${lastCheck}`, {
            icon: '⚠️',
            duration: 4000,
          });
        }
      } else {
        setError(response.error);
        // Only show error toast if it's not a network/offline issue
        if (!response.error?.includes('offline') && !response.error?.includes('network')) {
          toast.error(response.error);
        }
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      const status = getConnectionStatus();
      const errorDetails = getErrorDetails(status);
      setError(`Failed to load cart${errorDetails}`);
      // Only show error if backend is confirmed unavailable
      if (!isBackendAvailable()) {
        toast.error(`Failed to load cart${errorDetails}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const addPetToCart = async (pet) => {
    if (!currentUser) {
      toast.error('Please log in to add pets to cart');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    // Prevent duplicate adds
    if (cart.some(item => item.id === pet.id)) {
      toast('This pet is already in your cart');
      return;
    }

    try {
      setIsProcessing(true);
      const response = await addToCart(pet.id, {
        name: pet.name,
        price: pet.price,
        imageUrl: pet.imageUrls?.[0] || pet.imageUrl,
        breed: pet.breed,
        age: pet.age,
        gender: pet.gender
      });
      if (response.success) {
        setCart(response.cart);
        toast.success('Pet added to cart successfully!');
        navigate('/cart');
      } else {
        toast.error(response.error || 'Failed to add pet to cart');
      }
    } catch (error) {
      console.error('Error adding pet to cart:', error);
      toast.error('Failed to add pet to cart');
    } finally {
      setIsProcessing(false);
    }
  };

  const removePetFromCart = async (petId) => {
    try {
      setIsProcessing(true);
      const response = await removeFromCart(petId);
      if (response.success) {
        setCart(response.cart);
        toast.success('Pet removed from cart');
      } else {
        toast.error(response.error || 'Failed to remove pet from cart');
      }
    } catch (error) {
      console.error('Error removing pet from cart:', error);
      toast.error('Failed to remove pet from cart');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearUserCart = async () => {
    try {
      setIsProcessing(true);
      const response = await clearCart();
      if (response.success) {
        setCart([]);
        toast.success('Cart cleared successfully');
      } else {
        toast.error(response.error || 'Failed to clear cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    } finally {
      setIsProcessing(false);
    }
  };

  const processCheckout = async () => {
    if (!currentUser) {
      toast.error('Please log in to checkout');
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    try {
      setIsProcessing(true);
      const stripe = await stripePromise;
      
      // Create checkout session
      const response = await checkout();
      
      if (response.success && response.sessionId) {
        // Redirect to Stripe checkout
        const result = await stripe.redirectToCheckout({
          sessionId: response.sessionId
        });

        if (result.error) {
          toast.error(result.error.message);
        }
      } else if (response.success && response.order) {
        // Fallback: if backend returns order info instead of sessionId
        toast.success('Order created successfully');
      } else {
        toast.error(response.error || 'Failed to process checkout');
      }
    } catch (error) {
      console.error('Error processing checkout:', error);
      toast.error('Failed to process checkout');
    } finally {
      setIsProcessing(false);
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const getCartCount = () => {
    return cart.length;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        isProcessing,
        isOffline,
        addPetToCart,
        removePetFromCart,
        clearUserCart,
        processCheckout,
        getCartTotal,
        getCartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 