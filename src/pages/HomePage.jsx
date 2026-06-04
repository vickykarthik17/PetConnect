import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, PawPrint, Users } from 'lucide-react';

function HomePage() {
  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative">
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl overflow-hidden">
          <div className="container mx-auto px-6 py-16 md:py-24 relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Find Your Perfect Furry Companion
              </h1>
              <p className="text-white text-lg mb-8">
                Thousands of adorable pets are waiting for their forever homes. 
                Browse our available pets and find your perfect match today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/pets"
                  className="bg-white text-orange-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition flex items-center justify-center gap-2"
                >
                  <Search size={20} />
                  Find a Pet
                </Link>
                <Link
                  to="/volunteer"
                  className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition flex items-center justify-center gap-2"
                >
                  <Heart size={20} />
                  Volunteer
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      </section>

      {/* Welcome Message for Logged In Users */}
      {currentUser && (
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome back, {currentUser.name}!
          </h2>
          <p className="text-gray-600 mt-2">
            Thank you for being part of our community. Continue browsing available pets or check out our latest success stories.
          </p>
        </section>
      )}

      {/* Features Section */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How PetConnect Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-orange-500" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Browse Pets</h3>
            <p className="text-gray-600">
              Search through our database of adorable pets waiting for their forever homes.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PawPrint className="text-orange-500" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Meet & Connect</h3>
            <p className="text-gray-600">
              Schedule a visit to meet your potential new family member in person.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="text-orange-500" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Adopt & Love</h3>
            <p className="text-gray-600">
              Complete the adoption process and welcome your new pet into your home.
            </p>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="bg-gray-100 rounded-xl p-8 md:p-12">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-gray-600 mb-8">
            Create an account to save your favorite pets, receive updates, and streamline the adoption process.
          </p>
          {!currentUser ? (
            <Link
              to="/signup"
              className="bg-orange-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-600 transition inline-flex items-center gap-2"
            >
              <Users size={20} />
              Create an Account
            </Link>
          ) : (
            <Link
              to="/pets"
              className="bg-orange-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-600 transition inline-flex items-center gap-2"
            >
              <Search size={20} />
              Browse Available Pets
            </Link>
          )}
        </div>
      </section>
      
      {/* Featured Pets Section */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Pets</h2>
          <Link to="/pets" className="text-orange-500 hover:text-orange-600 font-medium">
            View All →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Featured Pet Cards */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80" 
              alt="Dog" 
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Max</h3>
              <p className="text-gray-600 mb-4">Golden Retriever • 2 years • Male</p>
              <p className="text-gray-700 mb-4">
                Max is a friendly and energetic dog who loves to play fetch and go for long walks.
              </p>
              <Link to="/pets" className="text-orange-500 hover:text-orange-600 font-medium">
                Learn More →
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80" 
              alt="Cat" 
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Luna</h3>
              <p className="text-gray-600 mb-4">Domestic Shorthair • 1 year • Female</p>
              <p className="text-gray-700 mb-4">
                Luna is a sweet and playful cat who enjoys cuddling and chasing toys around the house.
              </p>
              <Link to="/pets" className="text-orange-500 hover:text-orange-600 font-medium">
                Learn More →
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80" 
              alt="Dog" 
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Buddy</h3>
              <p className="text-gray-600 mb-4">Labrador Mix • 3 years • Male</p>
              <p className="text-gray-700 mb-4">
                Buddy is a loyal and affectionate dog who gets along well with children and other pets.
              </p>
              <Link to="/pets" className="text-orange-500 hover:text-orange-600 font-medium">
                Learn More →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;