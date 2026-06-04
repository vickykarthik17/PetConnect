import React, { useState } from 'react';
import { Heart, Calendar, Clock, Users, PawPrint, Shield, Send, MessageCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

function Volunteer() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    availability: '',
    experience: '',
    interests: [],
    message: '',
  });

  const [loading, setLoading] = useState(false);

  const opportunities = [
    {
      icon: <PawPrint className="text-orange-500" size={32} />,
      title: 'Pet Care Assistant',
      description: 'Help with daily care routines, feeding, and exercise for our shelter pets.',
      commitment: '4-6 hours/week',
      skills: ['Animal handling', 'Basic pet care', 'Patience']
    },
    {
      icon: <Heart className="text-orange-500" size={32} />,
      title: 'Adoption Counselor',
      description: 'Guide potential adopters through the process and help match them with suitable pets.',
      commitment: '6-8 hours/week',
      skills: ['Communication', 'Customer service', 'Pet knowledge']
    },
    {
      icon: <Calendar className="text-orange-500" size={32} />,
      title: 'Event Coordinator',
      description: 'Help organize and run adoption events, fundraisers, and community outreach programs.',
      commitment: 'Flexible',
      skills: ['Event planning', 'Organization', 'Marketing']
    },
    {
      icon: <Users className="text-orange-500" size={32} />,
      title: 'Social Media Manager',
      description: 'Create and manage content to promote our pets and increase adoption visibility.',
      commitment: '3-5 hours/week',
      skills: ['Social media', 'Photography', 'Writing']
    }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      const interests = [...formData.interests];
      if (checked) {
        interests.push(value);
      } else {
        const index = interests.indexOf(value);
        if (index > -1) {
          interests.splice(index, 1);
        }
      }
      setFormData(prev => ({
        ...prev,
        interests
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success('Application submitted successfully! We will contact you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      age: '',
      availability: '',
      experience: '',
      interests: [],
      message: '',
    });
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-16">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Make a Difference in Pets' Lives
        </h1>
        <p className="text-xl text-gray-600">
          Join our team of dedicated volunteers and help create happy endings for pets in need.
        </p>
      </section>

      {/* Opportunities Section */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Volunteer Opportunities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {opportunities.map((opportunity, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  {opportunity.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{opportunity.title}</h3>
                  <p className="text-gray-600 mb-4">{opportunity.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Clock size={16} />
                    <span>Time Commitment: {opportunity.commitment}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {opportunity.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Application Form */}
      <section className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Volunteer Application Form
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="+91 123 456 7890"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min="18"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="18"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Availability
            </label>
            <select
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select availability</option>
              <option value="weekdays">Weekdays</option>
              <option value="weekends">Weekends</option>
              <option value="both">Both Weekdays and Weekends</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Areas of Interest
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {opportunities.map((opp, index) => (
                <label key={index} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="interests"
                    value={opp.title}
                    checked={formData.interests.includes(opp.title)}
                    onChange={handleChange}
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-700">{opp.title}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Previous Experience
            </label>
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Tell us about any relevant experience..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Why do you want to volunteer with us?
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Share your motivation..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <MessageCircle className="animate-spin" size={20} />
                Submitting...
              </>
            ) : (
              <>
                <Send size={20} />
                Submit Application
              </>
            )}
          </button>
        </form>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 rounded-xl p-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Why Volunteer With Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-orange-500" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Make a Difference</h3>
              <p className="text-gray-600">Help pets find their forever homes and create happy endings.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-orange-500" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Join Our Community</h3>
              <p className="text-gray-600">Meet like-minded animal lovers and make lasting friendships.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-orange-500" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Gain Experience</h3>
              <p className="text-gray-600">Learn valuable skills and get hands-on experience with animals.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Volunteer; 