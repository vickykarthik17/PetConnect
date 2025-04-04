import React, { createContext, useState, useEffect, useContext } from 'react';
import { registerUser as apiRegister, loginUser as apiLogin, logoutUser as apiLogout } from '../api/userApi';
import { registerPet, getUserPets, getAllPets } from '../api/petApi';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const register = async (userData) => {
    try {
      setLoading(true);
      
      // Validate required fields
      if (!userData.username || !userData.email || !userData.password) {
        return {
          success: false,
          error: 'Please fill in all required fields'
        };
      }

      const result = await apiRegister(userData);
      console.log('Registration result in AuthContext:', result);
      
      if (result.success) {
        // Store user data in localStorage
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);
        
        // Update context state
        setCurrentUser(result.user);
        setToken(result.token);
        
        return result;
      }
      
      return {
        success: false,
        error: result.error
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Registration failed'
      };
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      
      // Validate required fields
      if (!credentials.username || !credentials.password) {
        return {
          success: false,
          error: 'Please provide both username and password'
        };
      }

      const result = await apiLogin(credentials);
      console.log('Login result:', { ...result, token: result.token ? '[REDACTED]' : null });
      
      if (result.success) {
        // Store user data in localStorage
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);
        
        // Update context state
        setCurrentUser(result.user);
        setToken(result.token);
      }
      return result;
    } catch (error) {
      console.error('Login error in context:', error);
      return {
        success: false,
        error: error.message || 'Login failed'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    apiLogout();
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  };

  const value = {
    currentUser,
    loading,
    token,
    register,
    login,
    logout,
    registerPet,
    getUserPets,
    getAllPets
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};