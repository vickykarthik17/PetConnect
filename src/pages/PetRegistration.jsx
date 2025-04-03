import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PawPrint, ArrowLeft, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function PetRegistration() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    type: 'dog',
    breed: '',
    age: '',
    gender: 'male',
    description: '',
    price: '',
    forSale: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const navigate = useNavigate();
  const { registerPet } = useAuth();
  
  const validateStep = (currentStep) => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.name.trim()) newErrors.name = 'Pet name is required';
      if (!formData.breed.trim()) newErrors.breed = 'Breed is required';
      if (!formData.age.trim()) newErrors.age = 'Age is required';
    } else if (currentStep === 2) {
      if (formData.forSale && (!formData.price || formData.price <= 0)) {
        newErrors.price = 'Please enter a valid price';
      }
      if (!formData.description.trim()) {
        newErrors.description = 'Please provide a description';
      } else if (formData.description.length < 10) {
        newErrors.description = 'Description is too short';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(step)) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await registerPet(formData);
      
      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setErrors({ submit: result.error || 'Failed to register pet' });
      }
    } catch (error) {
      console.error('Pet registration error:', error);
      setErrors({ submit: error.message || 'An error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderStep1 = () => (
    <>
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Pet Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`mt-1 block w-full rounded-md border ${errors.name ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500`}
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
      </div>
      
      <div className="mb-4">
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Pet Type
        </label>
        <select
          id="type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        >
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="bird">Bird</option>
          <option value="rabbit">Rabbit</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label htmlFor="breed" className="block text-sm font-medium text-gray-700">
          Breed
        </label>
        <input
          type="text"
          id="breed"
          value={formData.breed}
          onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
          className={`mt-1 block w-full rounded-md border ${errors.breed ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500`}
        />
        {errors.breed && <p className="mt-1 text-sm text-red-500">{errors.breed}</p>}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">
            Age
          </label>
          <input
            type="text"
            id="age"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            className={`mt-1 block w-full rounded-md border ${errors.age ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500`}
            placeholder="e.g. 2 years"
          />
          {errors.age && <p className="mt-1 text-sm text-red-500">{errors.age}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
            Gender
          </label>
          <select
            id="gender"
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>
    </>
  );
  
  const renderStep2 = () => (
    <>
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows="4"
          className={`mt-1 block w-full rounded-md border ${errors.description ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500`}
          placeholder="Tell us about your pet's personality, habits, and any special needs..."
        />
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
      </div>
      
      <div className="mb-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="forSale"
            checked={formData.forSale}
            onChange={(e) => setFormData({ ...formData, forSale: e.target.checked })}
            className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
          />
          <label htmlFor="forSale" className="ml-2 block text-sm text-gray-700">
            List this pet for adoption
          </label>
        </div>
      </div>
      
      {formData.forSale && (
        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Adoption Fee (if applicable)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className={`pl-7 block w-full rounded-md border ${errors.price ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500`}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
          {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
          <p className="mt-1 text-xs text-gray-500">
            Enter 0 if you're offering this pet for free adoption.
          </p>
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Pet Summary:</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-600"><span className="font-medium">Name:</span> {formData.name}</p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Type:</span> {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}
          </p>
          <p className="text-sm text-gray-600"><span className="font-medium">Breed:</span> {formData.breed}</p>
          <p className="text-sm text-gray-600"><span className="font-medium">Age:</span> {formData.age}</p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Gender:</span> {formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1)}
          </p>
          {formData.forSale && (
            <p className="text-sm text-orange-600 font-medium mt-1">
              Listed for adoption {formData.price > 0 ? `with a fee of $${formData.price}` : 'for free'}
            </p>
          )}
        </div>
      </div>
    </>
  );
  
  const renderSuccess = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="text-green-500" size={32} />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Pet Registered Successfully!</h3>
      <p className="text-gray-600 mb-6">
        Your pet has been added to your profile.
      </p>
      <p className="text-gray-600">
        Redirecting to dashboard...
      </p>
    </div>
  );
  
  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/dashboard')}
        className="inline-flex items-center text-gray-600 hover:text-orange-500 mb-6"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Dashboard
      </button>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-8 py-6">
          <div className="flex items-center mb-6">
            <PawPrint className="text-orange-500 mr-2" size={24} />
            <h1 className="text-2xl font-bold text-gray-900">Register a Pet</h1>
          </div>
          
          {!isSuccess ? (
            <>
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  {[1, 2].map((stepNumber) => (
                    <div key={stepNumber} className="flex flex-col items-center">
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step >= stepNumber ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {stepNumber}
                      </div>
                      <span className="text-xs mt-1 text-gray-600">
                        {stepNumber === 1 ? 'Basic Info' : 'Details'}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="relative flex items-center mt-2">
                  <div className="absolute left-4 right-4 h-1 bg-gray-200">
                    <div 
                      className="h-1 bg-orange-500 transition-all duration-300"
                      style={{ width: `${(step - 1) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {errors.submit && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {errors.submit}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                {step === 1 ? renderStep1() : renderStep2()}
                
                <div className="flex justify-between mt-8 pt-4 border-t">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="text-gray-600 hover:text-orange-500"
                    >
                      Back
                    </button>
                  )}
                  
                  <button
                    type={step === 2 ? 'submit' : 'button'}
                    onClick={step === 1 ? nextStep : undefined}
                    disabled={isSubmitting}
                    className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-70"
                  >
                    {isSubmitting ? 'Processing...' : step === 1 ? 'Next' : 'Register Pet'}
                  </button>
                </div>
              </form>
            </>
          ) : renderSuccess()}
        </div>
      </div>
    </div>
  );
}

export default PetRegistration;