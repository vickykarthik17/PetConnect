import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const PetRegistration = lazy(() => import('./pages/PetRegistration'));
const NotFound = lazy(() => import('./pages/NotFound'));
const FindPet = lazy(() => import('./pages/FindPet'));
const HowToAdopt = lazy(() => import('./pages/HowToAdopt'));
const SuccessStories = lazy(() => import('./pages/SuccessStories'));
const Volunteer = lazy(() => import('./pages/Volunteer'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));

import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';
import TestAuth from './TestAuth';

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <LoadingFallback />;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={
        <Suspense fallback={<LoadingFallback />}>
          <HomePage />
        </Suspense>
      } />
      <Route path="/login" element={
        <Suspense fallback={<LoadingFallback />}>
          <Login />
        </Suspense>
      } />
      <Route path="/signup" element={
        <Suspense fallback={<LoadingFallback />}>
          <Signup />
        </Suspense>
      } />
      <Route path="/auth" element={<Navigate to="/login" replace />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Suspense fallback={<LoadingFallback />}>
            <Dashboard />
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/register-pet" element={
        <ProtectedRoute>
          <Suspense fallback={<LoadingFallback />}>
            <PetRegistration />
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/pets" element={
        <Suspense fallback={<LoadingFallback />}>
          <FindPet />
        </Suspense>
      } />
      <Route path="/adopt" element={
        <Suspense fallback={<LoadingFallback />}>
          <HowToAdopt />
        </Suspense>
      } />
      <Route path="/stories" element={
        <Suspense fallback={<LoadingFallback />}>
          <SuccessStories />
        </Suspense>
      } />
      <Route path="/about" element={
        <Suspense fallback={<LoadingFallback />}>
          <AboutUs />
        </Suspense>
      } />
      <Route path="/contact" element={
        <Suspense fallback={<LoadingFallback />}>
          <Contact />
        </Suspense>
      } />
      <Route path="/volunteer" element={
        <Suspense fallback={<LoadingFallback />}>
          <Volunteer />
        </Suspense>
      } />
      <Route path="*" element={
        <Suspense fallback={<LoadingFallback />}>
          <NotFound />
        </Suspense>
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              <AppRoutes />
            </main>
            <Footer />
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
              },
              success: {
                duration: 3000,
                theme: {
                  primary: '#4aed88',
                },
              },
              error: {
                duration: 4000,
                theme: {
                  primary: '#ff4b4b',
                },
              },
            }}
          />
          <TestAuth />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;