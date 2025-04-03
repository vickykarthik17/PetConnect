import React from 'react';
import { Link } from 'react-router-dom';
import { Dog, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Dog className="text-orange-500" size={32} />
              <div>
                <h2 className="text-xl font-bold">PetConnect</h2>
                <p className="text-sm text-gray-400">Making tails wag and hearts purr since 2020</p>
              </div>
            </div>
            <p className="text-gray-400">We're dedicated to connecting loving families with pets who need a forever home.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/pets" className="text-gray-400 hover:text-orange-500">Available Pets</Link></li>
              <li><Link to="/adopt" className="text-gray-400 hover:text-orange-500">Adoption Process</Link></li>
              <li><Link to="/stories" className="text-gray-400 hover:text-orange-500">Success Stories</Link></li>
              <li><Link to="/volunteer" className="text-gray-400 hover:text-orange-500">Volunteer</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Telangana, Hyderabad</li>
              <li>1234567890</li>
              <li>team@furtech.com</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4">Join our newsletter for pet care tips and adoption updates.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 text-white px-4 py-2 rounded-md flex-grow"
              />
              <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">
                Subscribe
              </button>
            </div>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-orange-500"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-orange-500"><Twitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-orange-500"><Instagram size={20} /></a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© 2025 PetConnect. All rights reserved. Made with ❤️ for pets.</p>
        </div>
      </div>
    </footer>
  );
}