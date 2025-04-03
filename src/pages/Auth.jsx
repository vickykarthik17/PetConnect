import React, { useState, useEffect } from 'react';
import { Dog, LogIn, UserPlus, ArrowLeft, ChevronRight, ChevronLeft, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export function Auth() {
  const [step, setStep] = useState(1);
  const [authType, setAuthType] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    userType: 'adopter', // 'adopter', 'seller', or 'both'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const navigate = useNavigate();
  const { login, register, currentUser } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;
    return strength;
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^\+?[\d\s-]{10,}$/.test(phone);
  };

  const validateStep = (currentStep) => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (authType === 'signup') {
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        else if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';
      }
      
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email address';
      
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      else if (calculatePasswordStrength(formData.password) < 3) {
        newErrors.password = 'Password must contain uppercase, lowercase, numbers, and special characters';
      }
      
      if (authType === 'signup' && formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else if (currentStep === 2 && authType === 'signup') {
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      else if (!validatePhone(formData.phone)) newErrors.phone = 'Please enter a valid phone number';
      
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      else if (formData.address.length < 10) newErrors.address = 'Please enter a complete address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time password strength calculation
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    } else {
      toast.error('Please fix the errors before proceeding');
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(step)) {
      toast.error('Please fix the errors before submitting');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (authType === 'login') {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          toast.success('Login successful!');
          navigate('/dashboard');
        } else {
          toast.error(result.error || 'Login failed');
        }
      } else {
        if (step < 3) {
          nextStep();
          setIsSubmitting(false);
          return;
        }
        
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          setIsSubmitting(false);
          return;
        }
        
        const result = await register(formData);
        if (result.success) {
          toast.success('Registration successful!');
          navigate('/dashboard');
        } else {
          toast.error(result.error || 'Registration failed');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPasswordStrengthIndicator = () => {
    if (!formData.password) return null;
    
    const strength = calculatePasswordStrength(formData.password);
    const strengthText = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'][strength - 1];
    const strengthColor = ['red', 'orange', 'yellow', 'light-green', 'green'][strength - 1];
    
    return (
      <div className="mt-1">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-${strengthColor}-500 transition-all duration-300`}
              style={{ width: `${(strength / 4) * 100}%` }}
            />
          </div>
          <span className={`text-sm text-${strengthColor}-500`}>{strengthText}</span>
        </div>
      </div>
    );
  };

  const renderStep1 = () => (
    <>
      {authType === 'signup' && (
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md border ${errors.name ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500`}
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.name}
            </p>
          )}
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={`mt-1 block w-full rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500`}
          placeholder="Enter your email"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.email}
          </p>
        )}
      </div>
      
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md border ${errors.password ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500`}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {renderPasswordStrengthIndicator()}
        {errors.password && (
          <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.password}
          </p>
        )}
      </div>
      
      {authType === 'signup' && (
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500`}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.confirmPassword}
            </p>
          )}
        </div>
      )}
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="mb-4">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className={`mt-1 block w-full rounded-md border ${errors.phone ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500`}
          placeholder="Enter your phone number"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.phone}
          </p>
        )}
      </div>
      
      <div className="mb-4">
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          rows="3"
          className={`mt-1 block w-full rounded-md border ${errors.address ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500`}
          placeholder="Enter your complete address"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.address}
          </p>
        )}
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          I am interested in:
        </label>
        
        <div className="space-y-3">
          <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="radio"
              name="userType"
              value="adopter"
              checked={formData.userType === 'adopter'}
              onChange={() => setFormData({ ...formData, userType: 'adopter' })}
              className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300"
            />
            <span className="ml-3 text-gray-700">Adopting pets</span>
          </label>
          
          <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="radio"
              name="userType"
              value="seller"
              checked={formData.userType === 'seller'}
              onChange={() => setFormData({ ...formData, userType: 'seller' })}
              className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300"
            />
            <span className="ml-3 text-gray-700">Listing pets for adoption</span>
          </label>
          
          <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="radio"
              name="userType"
              value="both"
              checked={formData.userType === 'both'}
              onChange={() => setFormData({ ...formData, userType: 'both' })}
              className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300"
            />
            <span className="ml-3 text-gray-700">Both adopting and listing pets</span>
          </label>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Account Summary:</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-600"><span className="font-medium">Name:</span> {formData.name}</p>
          <p className="text-sm text-gray-600"><span className="font-medium">Email:</span> {formData.email}</p>
          <p className="text-sm text-gray-600"><span className="font-medium">Phone:</span> {formData.phone}</p>
          <p className="text-sm text-gray-600"><span className="font-medium">Address:</span> {formData.address}</p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Account Type:</span> {
              formData.userType === 'adopter' ? 'Pet Adopter' : 
              formData.userType === 'seller' ? 'Pet Lister' : 'Both'
            }
          </p>
        </div>
      </div>
    </>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };

  const renderStepIndicator = () => {
    if (authType === 'login') return null;
    
    return (
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                stepNumber <= step
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {stepNumber}
            </div>
            {stepNumber < 3 && (
              <div
                className={`w-16 h-1 mx-2 ${
                  stepNumber < step ? 'bg-orange-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Dog className="h-12 w-12 text-orange-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {authType === 'login' ? 'Welcome back!' : 'Create your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {authType === 'login' ? (
            <>
              Don't have an account?{' '}
              <button
                onClick={() => setAuthType('signup')}
                className="font-medium text-orange-500 hover:text-orange-600"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setAuthType('login')}
                className="font-medium text-orange-500 hover:text-orange-600"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {renderStepIndicator()}
            {renderStepContent()}
            
            <div className="flex items-center justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center text-sm font-medium text-orange-500 hover:text-orange-600"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </button>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    {authType === 'login' ? (
                      <>
                        <LogIn className="w-5 h-5 mr-2" />
                        Sign in
                      </>
                    ) : step < 3 ? (
                      <>
                        Next
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5 mr-2" />
                        Create Account
                      </>
                    )}
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}