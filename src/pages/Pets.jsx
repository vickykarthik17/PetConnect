import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { PetCard } from '../components/PetCard';
import { useAuth } from '../context/AuthContext';
import { getAllPets } from '../api/petApi';
import { toast } from 'react-hot-toast';

export function Pets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    species: 'All Species',
    age: 'All Ages',
    gender: 'All Genders'
  });

  const { currentUser } = useAuth();

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await getAllPets();
      if (response.success) {
        setPets(response.pets);
      } else {
        toast.error('Failed to fetch pets');
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
      toast.error('Error loading pets');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const filteredPets = pets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pet.breed.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecies = filters.species === 'All Species' || pet.type === filters.species;
    const matchesAge = filters.age === 'All Ages' || pet.age.toString() === filters.age;
    const matchesGender = filters.gender === 'All Genders' || pet.gender === filters.gender;

    return matchesSearch && matchesSpecies && matchesAge && matchesGender;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search pets by name or breed..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <select
            value={filters.species}
            onChange={(e) => handleFilterChange('species', e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option>All Species</option>
            <option>Dog</option>
            <option>Cat</option>
            <option>Bird</option>
            <option>Other</option>
          </select>

          <select
            value={filters.age}
            onChange={(e) => handleFilterChange('age', e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option>All Ages</option>
            <option>0</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5+</option>
          </select>

          <select
            value={filters.gender}
            onChange={(e) => handleFilterChange('gender', e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option>All Genders</option>
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>
      </div>

      {/* Pet Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPets.map(pet => (
            <PetCard key={pet.id} pet={pet} />
          ))}
          {filteredPets.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No pets found matching your criteria
            </div>
          )}
        </div>
      )}
    </div>
  );
} 