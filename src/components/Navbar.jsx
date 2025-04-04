import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path) => location.pathname === path;
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-orange-500 focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className={`${isActive('/') ? 'text-orange-500 border-orange-500' : 'text-gray-700'} hover:text-orange-500 px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-orange-500 transition-colors`}>
              Home
            </Link>
            <Link to="/pets" className={`${isActive('/pets') ? 'text-orange-500 border-orange-500' : 'text-gray-700'} hover:text-orange-500 px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-orange-500 transition-colors`}>
              Find a Pet
            </Link>
            <Link to="/adopt" className={`${isActive('/adopt') ? 'text-orange-500 border-orange-500' : 'text-gray-700'} hover:text-orange-500 px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-orange-500 transition-colors`}>
              How to Adopt
            </Link>
            <Link to="/stories" className={`${isActive('/stories') ? 'text-orange-500 border-orange-500' : 'text-gray-700'} hover:text-orange-500 px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-orange-500 transition-colors`}>
              Success Stories
            </Link>
            <Link to="/about" className={`${isActive('/about') ? 'text-orange-500 border-orange-500' : 'text-gray-700'} hover:text-orange-500 px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-orange-500 transition-colors`}>
              About Us
            </Link>
            <Link to="/contact" className={`${isActive('/contact') ? 'text-orange-500 border-orange-500' : 'text-gray-700'} hover:text-orange-500 px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-orange-500 transition-colors`}>
              Contact
            </Link>
          </div>
          
          {/* User actions */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-700 hover:text-orange-500">
              <Search size={20} />
            </button>
            <button className="text-gray-700 hover:text-orange-500">
              <Heart size={20} />
            </button>
            
            {currentUser ? (
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-orange-500">
                  <User size={20} />
                  <span className="text-sm hidden sm:inline">{currentUser.username}</span>
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    Signed in as <span className="font-medium">{currentUser.username}</span>
                  </div>
                  <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</Link>
                  <Link to="/register-pet" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Register a Pet</Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/auth" className="text-gray-700 hover:text-orange-500">
                <User size={20} />
              </Link>
            )}
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className={`${isActive('/') ? 'text-orange-500' : 'text-gray-700'} hover:text-orange-500 px-3 py-2 text-sm font-medium`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/pets" 
                className={`${isActive('/pets') ? 'text-orange-500' : 'text-gray-700'} hover:text-orange-500 px-3 py-2 text-sm font-medium`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Find a Pet
              </Link>
              <Link 
                to="/adopt" 
                className={`${isActive('/adopt') ? 'text-orange-500' : 'text-gray-700'} hover:text-orange-500 px-3 py-2 text-sm font-medium`}
                onClick={() => setMobileMenuOpen(false)}
              >
                How to Adopt
              </Link>
              <Link 
                to="/stories" 
                className={`${isActive('/stories') ? 'text-orange-500' : 'text-gray-700'} hover:text-orange-500 px-3 py-2 text-sm font-medium`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Success Stories
              </Link>
              <Link 
                to="/about" 
                className={`${isActive('/about') ? 'text-orange-500' : 'text-gray-700'} hover:text-orange-500 px-3 py-2 text-sm font-medium`}
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                to="/contact" 
                className={`${isActive('/contact') ? 'text-orange-500' : 'text-gray-700'} hover:text-orange-500 px-3 py-2 text-sm font-medium`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              
              {currentUser ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="text-gray-700 hover:text-orange-500 px-3 py-2 text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center text-gray-700 hover:text-orange-500 px-3 py-2 text-sm font-medium"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link 
                  to="/auth" 
                  className="text-gray-700 hover:text-orange-500 px-3 py-2 text-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}