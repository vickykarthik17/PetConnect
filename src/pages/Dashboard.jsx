import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, PawPrint, Heart, Settings, User, LogOut, Search, Filter, Bell, Calendar, Clock, MapPin, Phone, Mail, Edit2, Save, X, Upload, MoreVertical, Trash2, Share2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

function Dashboard() {
  const { currentUser, logout, getUserPets, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [userPets, setUserPets] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'info',
      message: 'Welcome to your dashboard!',
      read: false,
      timestamp: new Date()
    }
  ]);
  const [showPetMenu, setShowPetMenu] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);
  const notificationRef = useRef(null);
  const petMenuRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    bio: currentUser?.bio || ''
  });
  const [stats, setStats] = useState({
    totalPets: 0,
    activeListings: 0,
    totalViews: 0,
    recentActivity: []
  });
  
  useEffect(() => {
    if (currentUser) {
      const result = getUserPets();
      if (result.success) {
        setUserPets(result.pets);
        updateStats(result.pets);
      }
    }
  }, [currentUser, getUserPets]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (petMenuRef.current && !petMenuRef.current.contains(event.target)) {
        setShowPetMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateStats = (pets) => {
    const activeListings = pets.filter(pet => pet.forSale).length;
    const totalViews = pets.reduce((sum, pet) => sum + (pet.views || 0), 0);
    const recentActivity = pets
      .map(pet => ({
        type: pet.forSale ? 'listing' : 'registration',
        petName: pet.name,
        date: new Date(pet.updatedAt || pet.createdAt),
        details: pet.forSale ? 'Listed for adoption' : 'Added new pet'
      }))
      .sort((a, b) => b.date - a.date)
      .slice(0, 5);

    setStats({
      totalPets: pets.length,
      activeListings,
      totalViews,
      recentActivity
    });
  };
  
  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const handleProfileEdit = () => {
    setIsEditing(true);
  };

  const handleProfileSave = async () => {
    try {
      await updateUserProfile(profileData);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleProfileCancel = () => {
    setProfileData({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      address: currentUser?.address || '',
      bio: currentUser?.bio || ''
    });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePetAction = (pet, action) => {
    switch(action) {
      case 'edit':
        navigate(`/edit-pet/${pet.id}`);
        break;
      case 'list':
        // Add listing functionality
        toast.success(`${pet.name} is now listed for adoption`);
        break;
      case 'unlist':
        // Remove listing functionality
        toast.success(`${pet.name} is now unlisted`);
        break;
      case 'delete':
        // Delete pet functionality
        if (window.confirm(`Are you sure you want to delete ${pet.name}?`)) {
          toast.success(`${pet.name} has been deleted`);
        }
        break;
      default:
        break;
    }
  };

  const handleImageUpload = async (event, petId) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      // Simulated API call for image upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Image uploaded successfully');
      // Update pet image in state
      setUserPets(prev => prev.map(pet => 
        pet.id === petId ? { ...pet, imageUrl: URL.createObjectURL(file) } : pet
      ));
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleNotificationClick = (notificationId) => {
    setNotifications(prev => prev.map(notif =>
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast.success('All notifications cleared');
  };

  const sharePet = (pet) => {
    const shareUrl = `${window.location.origin}/pets/${pet.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Pet link copied to clipboard');
  };

  const filteredPets = userPets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pet.breed.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'listed' && pet.forSale) ||
                         (filterType === 'unlisted' && !pet.forSale);
    return matchesSearch && matchesFilter;
  });

  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Pets</p>
            <h3 className="text-2xl font-bold text-gray-800">{stats.totalPets}</h3>
      </div>
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <PawPrint className="text-orange-500" size={24} />
          </div>
        </div>
        </div>
        
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Active Listings</p>
            <h3 className="text-2xl font-bold text-gray-800">{stats.activeListings}</h3>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Heart className="text-green-500" size={24} />
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Views</p>
            <h3 className="text-2xl font-bold text-gray-800">{stats.totalViews}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Calendar className="text-blue-500" size={24} />
          </div>
        </div>
          </div>
          
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Notifications</p>
            <h3 className="text-2xl font-bold text-gray-800">{notifications.length}</h3>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <Bell className="text-purple-500" size={24} />
          </div>
        </div>
      </div>
          </div>
  );

  const renderActivityFeed = () => (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {stats.recentActivity.map((activity, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              activity.type === 'listing' ? 'bg-green-100' : 'bg-orange-100'
            }`}>
              {activity.type === 'listing' ? (
                <Heart className="text-green-500" size={16} />
              ) : (
                <PawPrint className="text-orange-500" size={16} />
              )}
            </div>
          <div>
              <p className="text-sm text-gray-800">
                <span className="font-medium">{activity.petName}</span> - {activity.details}
              </p>
              <p className="text-xs text-gray-500">
                {activity.date.toLocaleDateString()} at {activity.date.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
          </div>
        </div>
  );

  const renderPetCard = (pet) => (
    <div key={pet.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <img
          src={pet.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={pet.name}
          className="w-full h-full object-cover"
        />
        {pet.forSale && (
          <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Listed
          </span>
        )}
        <div className="absolute bottom-2 right-2 flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
            disabled={uploadingImage}
          >
            <Upload size={16} className={uploadingImage ? 'animate-pulse' : ''} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, pet.id)}
          />
          <div className="relative">
            <button
              onClick={() => setShowPetMenu(showPetMenu === pet.id ? null : pet.id)}
              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
            >
              <MoreVertical size={16} />
            </button>
            {showPetMenu === pet.id && (
              <div
                ref={petMenuRef}
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"
              >
                <div className="py-1">
                  <button
                    onClick={() => handlePetAction(pet, 'edit')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                  >
                    <Edit2 size={14} className="mr-2" />
                    Edit Pet
                  </button>
                  <button
                    onClick={() => handlePetAction(pet, pet.forSale ? 'unlist' : 'list')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                  >
                    <Heart size={14} className="mr-2" />
                    {pet.forSale ? 'Unlist Pet' : 'List for Adoption'}
                  </button>
                  <button
                    onClick={() => sharePet(pet)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                  >
                    <Share2 size={14} className="mr-2" />
                    Share Pet
                  </button>
                  <button
                    onClick={() => handlePetAction(pet, 'delete')}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                  >
                    <Trash2 size={14} className="mr-2" />
                    Delete Pet
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{pet.name}</h3>
        <p className="text-gray-600">{pet.breed} • {pet.species}</p>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{pet.location || 'Location not specified'}</span>
        </div>
        <p className="text-gray-700 mt-2 line-clamp-2">{pet.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            <span>Added {new Date(pet.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome back, {currentUser?.name}!</h2>
        <p className="text-gray-600">
          Here's what's happening with your pets today.
        </p>
      </div>
      
      {renderStatsCards()}
      {renderActivityFeed()}
      
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Your Pets</h2>
        <Link
          to="/register-pet"
          className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 inline-flex items-center"
        >
          <PlusCircle size={16} className="mr-1" />
          Register New Pet
        </Link>
      </div>
      
      {userPets.length === 0 ? (
        <div className="text-center py-8">
          <PawPrint className="mx-auto text-gray-300" size={48} />
          <p className="mt-4 text-gray-600">You haven't registered any pets yet.</p>
          <Link
            to="/register-pet"
            className="mt-4 inline-block text-orange-500 hover:text-orange-600 font-medium"
          >
            Register your first pet
          </Link>
        </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPets.map(renderPetCard)}
          </div>
        )}
      </div>
    </div>
  );
  
  const renderProfile = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Your Profile</h2>
        {!isEditing ? (
          <button
            onClick={handleProfileEdit}
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 inline-flex items-center"
          >
            <Edit2 size={16} className="mr-2" />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleProfileSave}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 inline-flex items-center"
            >
              <Save size={16} className="mr-2" />
              Save
            </button>
            <button
              onClick={handleProfileCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 inline-flex items-center"
            >
              <X size={16} className="mr-2" />
              Cancel
            </button>
          </div>
        )}
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
              <User className="text-orange-500" size={40} />
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600">
                <Edit2 size={16} />
              </button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                />
              ) : (
                <div className="mt-1 p-3 bg-gray-50 rounded-md flex items-center">
                  <User className="text-gray-400 mr-2" size={16} />
                  {currentUser?.name}
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                />
              ) : (
                <div className="mt-1 p-3 bg-gray-50 rounded-md flex items-center">
                  <Mail className="text-gray-400 mr-2" size={16} />
                  {currentUser?.email}
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                />
              ) : (
                <div className="mt-1 p-3 bg-gray-50 rounded-md flex items-center">
                  <Phone className="text-gray-400 mr-2" size={16} />
                  {currentUser?.phone || 'Not provided'}
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              {isEditing ? (
                <textarea
                  name="address"
                  value={profileData.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                />
              ) : (
                <div className="mt-1 p-3 bg-gray-50 rounded-md flex items-center">
                  <MapPin className="text-gray-400 mr-2" size={16} />
                  {currentUser?.address || 'Not provided'}
                  </div>
                )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Type</label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                {currentUser?.userType === 'adopter' ? 'Pet Adopter' : 
                 currentUser?.userType === 'seller' ? 'Pet Lister' : 'Both'}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Member Since</label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Unknown'}
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          {isEditing ? (
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={handleInputChange}
              rows="4"
              className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              placeholder="Tell us about yourself..."
            />
          ) : (
            <div className="mt-1 p-3 bg-gray-50 rounded-md">
              {currentUser?.bio || 'No bio provided'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
  const renderPets = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <h2 className="text-xl font-semibold text-gray-800">Your Pets</h2>
        
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search pets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="flex-1 md:flex-none px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Pets</option>
            <option value="listed">Listed for Adoption</option>
            <option value="unlisted">Not Listed</option>
          </select>
          
          <Link
            to="/register-pet"
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 inline-flex items-center justify-center"
          >
            <PlusCircle size={16} className="mr-1" />
            Register New Pet
          </Link>
        </div>
      </div>
      
      {filteredPets.length === 0 ? (
        <div className="text-center py-8">
          <PawPrint className="mx-auto text-gray-300" size={48} />
          <p className="mt-4 text-gray-600">No pets found matching your criteria.</p>
          <Link
            to="/register-pet"
            className="mt-4 inline-block text-orange-500 hover:text-orange-600 font-medium"
          >
            Register your first pet
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPets.map(renderPetCard)}
        </div>
      )}
    </div>
  );
  
  const renderNotifications = () => (
    <div className="relative" ref={notificationRef}>
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 hover:text-orange-500"
      >
        <Bell size={20} />
        {notifications.some(n => !n.read) && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>
      
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Notifications</h3>
              <button
                onClick={clearAllNotifications}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear all
              </button>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell className="mx-auto mb-2" size={24} />
                No notifications
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    notification.read ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 ${
                      notification.type === 'info' ? 'text-blue-500' :
                      notification.type === 'success' ? 'text-green-500' :
                      'text-orange-500'
                    }`}>
                      <AlertCircle size={16} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-md ${
              activeTab === 'overview' 
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-md ${
              activeTab === 'profile' 
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('pets')}
              className={`px-4 py-2 rounded-md ${
              activeTab === 'pets' 
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Pets
            </button>
          </div>
          <div className="flex items-center space-x-4">
            {renderNotifications()}
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-500 flex items-center"
            >
              <LogOut size={20} className="mr-1" />
              Logout
          </button>
          </div>
        </div>
      </div>
      
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'profile' && renderProfile()}
      {activeTab === 'pets' && renderPets()}
    </div>
  );
}

export default Dashboard;