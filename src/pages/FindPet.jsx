import React, { useState } from 'react';
import { Search, Filter, PawPrint, Heart, MapPin } from 'lucide-react';

function FindPet() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('all');
  const [selectedAge, setSelectedAge] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');

  // Sample pet data (replace with API call in production)
  const pets = [
    {
      id: 1,
      name: 'Max',
      species: 'Dog',
      breed: 'Golden Retriever',
      age: '2 years',
      gender: 'Male',
      location: 'Hyderabad',
      description: 'Friendly and energetic dog who loves to play fetch.',
      imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 2,
      name: 'Luna',
      species: 'Cat',
      breed: 'Domestic Shorthair',
      age: '1 year',
      gender: 'Female',
      location: 'Hyderabad',
      description: 'Sweet and playful cat who enjoys cuddling.',
      imageUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 3,
      name: 'Buddy',
      species: 'Dog',
      breed: 'Labrador Mix',
      age: '3 years',
      gender: 'Male',
      location: 'Hyderabad',
      description: 'Loyal and affectionate dog, great with kids.',
      imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 4,
      name: 'Milo',
      species: 'Cat',
      breed: 'Persian',
      age: '4 years',
      gender: 'Male',
      location: 'Hyderabad',
      description: 'Gentle and calm cat who loves attention.',
      imageUrl: 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 5,
      name: 'Rocky',
      species: 'Dog',
      breed: 'German Shepherd',
      age: '1 year',
      gender: 'Male',
      location: 'Hyderabad',
      description: 'Smart and protective dog, excellent guard dog.',
      imageUrl: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 6,
      name: 'Lucy',
      species: 'Cat',
      breed: 'Maine Coon',
      age: '2 years',
      gender: 'Female',
      location: 'Hyderabad',
      description: 'Majestic and friendly cat with a luxurious coat.',
      imageUrl: 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    },
  ];

  // Filter pets based on search and filters
  const filteredPets = pets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pet.breed.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecies = selectedSpecies === 'all' || pet.species.toLowerCase() === selectedSpecies;
    const matchesAge = selectedAge === 'all' || pet.age.includes(selectedAge);
    const matchesGender = selectedGender === 'all' || pet.gender === selectedGender;
    
    return matchesSearch && matchesSpecies && matchesAge && matchesGender;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search pets by name or breed..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Species</option>
              <option value="dog">Dogs</option>
              <option value="cat">Cats</option>
            </select>
            
            <select
              value={selectedAge}
              onChange={(e) => setSelectedAge(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Ages</option>
              <option value="1 year">1 Year</option>
              <option value="2 years">2 Years</option>
              <option value="3 years">3 Years</option>
              <option value="4 years">4+ Years</option>
            </select>
            
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {filteredPets.length === 0 ? (
        <div className="text-center py-12">
          <PawPrint className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Pets Found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPets.map(pet => (
            <div key={pet.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img
                  src={pet.imageUrl}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                  <Heart className="text-orange-500" size={20} />
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{pet.name}</h3>
                <p className="text-gray-600 mb-2">{pet.breed} • {pet.age} • {pet.gender}</p>
                <div className="flex items-center text-gray-500 mb-4">
                  <MapPin size={16} className="mr-1" />
                  <span>{pet.location}</span>
                </div>
                <p className="text-gray-700 mb-4">{pet.description}</p>
                <button className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition">
                  Meet {pet.name}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FindPet; 