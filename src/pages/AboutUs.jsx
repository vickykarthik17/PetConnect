import React from 'react';
import { Heart, Users, Shield, Trophy, PawPrint, Globe, Home, Phone, Mail, MapPin, Calendar, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

function AboutUs() {
  const stats = [
    { number: '1000+', label: 'Pets Adopted', icon: <Heart className="text-orange-500" size={24} /> },
    { number: '500+', label: 'Active Volunteers', icon: <Users className="text-orange-500" size={24} /> },
    { number: '50+', label: 'Partner Shelters', icon: <Home className="text-orange-500" size={24} /> },
    { number: '4.9/5', label: 'User Rating', icon: <Star className="text-orange-500" size={24} /> },
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Foundation',
      description: 'Started with a small team of passionate animal lovers in Mumbai.',
      icon: <Calendar className="text-orange-500" size={24} />
    },
    {
      year: '2022',
      title: 'Digital Platform Launch',
      description: 'Launched our online platform to streamline pet adoption.',
      icon: <Globe className="text-orange-500" size={24} />
    },
    {
      year: '2023',
      title: 'Regional Expansion',
      description: 'Expanded operations to major cities across India.',
      icon: <MapPin className="text-orange-500" size={24} />
    },
    {
      year: '2024',
      title: 'Community Growth',
      description: 'Reached milestone of 1000+ successful adoptions.',
      icon: <Users className="text-orange-500" size={24} />
    }
  ];

  const team = [
    {
      name: 'Mr.Vikramarthik',
      role: 'Founder & CEO',
      bio: 'Btech Student',
      contact: { email: 'vkarthik560@gmail.com', phone: '+91 7287982697' }
    },
    {
      name: 'R.Saketh',
      role: 'Operations Director',
      bio: 'Btech Student',
      contact: { email: 'sakethramagiri86@gmail.com', phone: '+91 9392539589' }
    },
    {
      name: 'P.Sanjeevaao',
      role: 'Adoption Coordinator',
      bio: 'Btech Student',
      contact: { email: 'sanjeevarao@gmail.com', phone: '+917995719821' }
    }
  ];

  const values = [
    {
      icon: <Heart className="text-orange-500" size={32} />,
      title: 'Compassion First',
      description: 'Every decision we make is guided by our love for animals and their well-being.',
    },
    {
      icon: <Shield className="text-orange-500" size={32} />,
      title: 'Responsible Adoption',
      description: 'We ensure each pet finds a safe, loving, and suitable forever home.',
    },
    {
      icon: <Users className="text-orange-500" size={32} />,
      title: 'Community Focus',
      description: 'We build strong relationships with adopters, volunteers, and partner shelters.',
    },
    {
      icon: <Globe className="text-orange-500" size={32} />,
      title: 'Global Impact',
      description: 'We work towards a world where every pet has a loving home.',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl overflow-hidden">
        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Mission: Finding Forever Homes
            </h1>
            <p className="text-xl opacity-90">
              PetConnect is dedicated to creating lasting bonds between pets and families, 
              one adoption at a time. Since 2020, we've been revolutionizing the pet 
              adoption process in India.
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-black/20"></div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {stat.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Milestones Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Our Journey
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {milestones.map((milestone, index) => (
            <div key={index} className="relative">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  {milestone.icon}
                </div>
                <h3 className="text-xl font-bold text-orange-500 mb-2">{milestone.year}</h3>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">{milestone.title}</h4>
                <p className="text-gray-600">{milestone.description}</p>
              </div>
              {index < milestones.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-orange-300"></div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Our Core Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {value.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-1">{member.name}</h3>
              <p className="text-orange-500 font-medium mb-3">{member.role}</p>
              <p className="text-gray-600 mb-4">{member.bio}</p>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <a href={`mailto:${member.contact.email}`} className="hover:text-orange-500">
                    {member.contact.email}
                  </a>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <a href={`tel:${member.contact.phone}`} className="hover:text-orange-500">
                    {member.contact.phone}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Join Us Section */}
      <section className="bg-gray-100 rounded-xl p-8 md:p-12">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Join Our Mission
          </h2>
          <p className="text-gray-600 mb-8">
            Whether you're looking to adopt, volunteer, or support our cause, 
            there are many ways to make a difference in pets' lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/volunteer"
              className="bg-orange-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-600 transition inline-flex items-center justify-center"
            >
              <Users className="mr-2" size={20} />
              Become a Volunteer
            </Link>
            <Link
              to="/pets"
              className="bg-white text-orange-500 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition inline-flex items-center justify-center border border-orange-500"
            >
              <PawPrint className="mr-2" size={20} />
              Browse Pets
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs; 