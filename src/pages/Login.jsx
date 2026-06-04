import React, { useState } from 'react';
import { LogIn, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const passwordMeetsPolicy = (password) => {
  const rules = [
    /.{8,}/,          // min length
    /[A-Z]/,          // uppercase
    /[a-z]/,          // lowercase
    /\d/,             // number
    /[^A-Za-z0-9]/    // special char
  ];
  return rules.every(rule => rule.test(password));
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }

    if (!passwordMeetsPolicy(password)) {
      toast.error('Password must be 8+ chars with upper, lower, number, special');
      return;
    }

    setIsSubmitting(true);
    const result = await login({ email: email.trim(), password });

    if (result.success) {
      toast.success('Logged in successfully');
      const redirectTo = location.state?.from || '/';
      navigate(redirectTo);
    } else {
      toast.error(result.error || 'Login failed');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
        <div className="flex items-center justify-center gap-2 mb-6">
          <ShieldCheck className="w-8 h-8 text-orange-500" />
          <h1 className="text-2xl font-semibold text-gray-900">Login</h1>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Password must be 8+ chars with upper, lower, number, and special character.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center gap-2 text-white py-2 px-4 rounded-md ${
              isSubmitting ? 'bg-orange-300 cursor-wait' : 'bg-orange-500 hover:bg-orange-600'
            }`}
          >
            <LogIn className="w-5 h-5" />
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-orange-500 hover:text-orange-600 font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

