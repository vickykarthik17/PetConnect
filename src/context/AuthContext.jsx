import React, { createContext, useState, useEffect, useContext } from 'react';
import { registerUser as apiRegister, loginUser as apiLogin, logoutUser as apiLogout, getCurrentUser as apiGetCurrentUser, updateUserProfile as apiUpdateProfile } from '../api/userApi';
import { registerPet as apiRegisterPet, getUserPets as apiGetUserPets, getAllPets as apiGetAllPets } from '../api/petApi';

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
    const result = await apiRegister(userData);
    if (result.success) {
      setCurrentUser(result.user);
      setToken(result.token);
    }
    return result;
  };

  const login = async (email, password) => {
    const result = await apiLogin(email, password);
    if (result.success) {
      setCurrentUser(result.user);
      setToken(result.token);
    }
    return result;
  };

  const logout = () => {
    apiLogout();
    setCurrentUser(null);
    setToken(null);
    return { success: true };
  };

  const registerPet = async (petData) => {
    return await apiRegisterPet(petData);
  };

  const getUserPets = async () => {
    return await apiGetUserPets();
  };

  const getAllPets = async () => {
    return await apiGetAllPets();
  };

  const updateUserProfile = async (profileData) => {
    try {
      const result = await apiUpdateProfile(profileData);
      if (result.success) {
        setCurrentUser(result.user);
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: 'Failed to update profile' };
    }
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
    getAllPets,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};