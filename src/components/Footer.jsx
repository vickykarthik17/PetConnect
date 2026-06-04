import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dog, Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email');
      return;
    }

    setIsSubscribing(true);
    
    try {
      // TODO: Replace with actual API endpoint
      setTimeout(() => {
        toast.success(`Subscribed successfully! Check ${email} for confirmation.`);
        setEmail('');
        setIsSubscribing(false);
      }, 500);
    } catch (error) {
      toast.error('Subscription failed. Please try again.');
      setIsSubscribing(false);
    }
  };

  const socialLinks = [
    { icon: Facebook, url: 'https://facebook.com/petconnect', label: 'Facebook' },
    { icon: Twitter, url: 'https://twitter.com/petconnect', label: 'Twitter' },
    { icon: Instagram, url: 'https://instagram.com/petconnect', label: 'Instagram' },
  ];
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
              <li><Link to="/pets" className="text-gray-400 hover:text-orange-500 transition-colors">Available Pets</Link></li>
              <li><Link to="/adopt" className="text-gray-400 hover:text-orange-500 transition-colors">Adoption Process</Link></li>
              <li><Link to="/stories" className="text-gray-400 hover:text-orange-500 transition-colors">Success Stories</Link></li>
              <li><Link to="/volunteer" className="text-gray-400 hover:text-orange-500 transition-colors">Volunteer</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <a href="mailto:team@furtech.com" className="hover:text-orange-500 transition-colors">team@furtech.com</a>
              </li>
              <li>📍 Telangana, Hyderabad</li>
              <li>📞 1234567890</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4">Join our newsletter for pet care tips and adoption updates.</p>
            <form onSubmit={handleSubscribe} className="flex gap-2 mb-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 text-white px-4 py-2 rounded-md flex-grow focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button 
                type="submit"
                disabled={isSubscribing}
                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubscribing ? '...' : 'Subscribe'}
              </button>
            </form>
            <div className="flex gap-4">
              {socialLinks.map((link, idx) => (
                <a 
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.label}
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  <link.icon size={20} />
                </a>
              ))}
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