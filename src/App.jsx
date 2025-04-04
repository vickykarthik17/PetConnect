import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Auth } from './pages/Auth';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import PetRegistration from './pages/PetRegistration';
import NotFound from './pages/NotFound';
import FindPet from './pages/FindPet';
import HowToAdopt from './pages/HowToAdopt';
import SuccessStories from './pages/SuccessStories';
import Volunteer from './pages/Volunteer';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/auth" />;
  }
  
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/register-pet" element={
        <ProtectedRoute>
          <PetRegistration />
        </ProtectedRoute>
      } />
      <Route path="/pets" element={<FindPet />} />
      <Route path="/adopt" element={<HowToAdopt />} />
      <Route path="/stories" element={<SuccessStories />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/volunteer" element={<Volunteer />} />
      <Route path="*" element={<NotFound />} />
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
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;