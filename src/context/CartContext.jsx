import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { getCart, addToCart, removeFromCart, clearCart, checkout } from '../api/cartApi';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Load cart when user logs in
  useEffect(() => {
    if (currentUser) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [currentUser]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await getCart();
      if (response.success) {
        setCart(response.cart);
      } else {
        toast.error('Failed to fetch cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Error loading cart');
    } finally {
      setLoading(false);
    }
  };

  const addPetToCart = async (petId) => {
    if (!currentUser) {
      toast.error('Please login to add pets to cart');
      navigate('/auth');
      return false;
    }

    try {
      setLoading(true);
      const response = await addToCart(petId);
      if (response.success) {
        setCart(response.cart);
        toast.success('Pet added to cart');
        return true;
      } else {
        toast.error(response.error || 'Failed to add pet to cart');
        return false;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Error adding pet to cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removePetFromCart = async (petId) => {
    try {
      setLoading(true);
      const response = await removeFromCart(petId);
      if (response.success) {
        setCart(response.cart);
        toast.success('Pet removed from cart');
        return true;
      } else {
        toast.error(response.error || 'Failed to remove pet from cart');
        return false;
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Error removing pet from cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearCartItems = async () => {
    try {
      setLoading(true);
      const response = await clearCart();
      if (response.success) {
        setCart([]);
        toast.success('Cart cleared');
        return true;
      } else {
        toast.error(response.error || 'Failed to clear cart');
        return false;
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Error clearing cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const processCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return false;
    }

    try {
      setLoading(true);
      const response = await checkout();
      if (response.success) {
        setCart([]);
        toast.success('Checkout successful!');
        navigate('/orders');
        return true;
      } else {
        toast.error(response.error || 'Checkout failed');
        return false;
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error('Error processing checkout');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cart,
    loading,
    addPetToCart,
    removePetFromCart,
    clearCartItems,
    processCheckout,
    cartCount: cart.length
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 