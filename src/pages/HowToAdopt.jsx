import React from 'react';
import { Search, Heart, FileText, Users, Calendar, Home, PawPrint, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

function HowToAdopt() {
  const adoptionSteps = [
    {
      icon: <Search className="text-orange-500" size={24} />,
      title: 'Find Your Perfect Match',
      description: 'Browse our available pets and use filters to find pets that match your lifestyle.',
      action: 'Browse Pets',
      link: '/pets'
    },
    {
      icon: <FileText className="text-orange-500" size={24} />,
      title: 'Submit an Application',
      description: 'Fill out our adoption application with your information and preferences.',
      action: 'Start Application',
      link: '/auth'
    },
    {
      icon: <Calendar className="text-orange-500" size={24} />,
      title: 'Schedule a Meet & Greet',
      description: 'Meet your potential new family member in person and spend some time together.',
      action: 'View Calendar',
      link: '#'
    },
    {
      icon: <Home className="text-orange-500" size={24} />,
      title: 'Home Check',
      description: "We'll visit your home to ensure it's a safe and suitable environment for your new pet.",
      action: 'Learn More',
      link: '#'
    },
    {
      icon: <Heart className="text-orange-500" size={24} />,
      title: 'Finalize Adoption',
      description: 'Complete the adoption process, pay fees, and welcome your new pet home!',
      action: 'View Fees',
      link: '#'
    }
  ];

  const faqs = [
    {
      question: 'What are the adoption fees?',
      answer: 'Adoption fees vary depending on the type and age of the pet. Dogs typically range from ₹2,000-5,000, while cats range from ₹1,500-3,000. All fees include vaccinations, microchipping, and spaying/neutering.'
    },
    {
      question: 'How long does the adoption process take?',
      answer: 'The adoption process typically takes 1-2 weeks from application to bringing your pet home. This allows time for application review, meet & greet, home check, and finalizing paperwork.'
    },
    {
      question: 'What do I need to adopt?',
      answer: "You'll need valid ID, proof of residence, and if you're renting, landlord approval. You should also be prepared for the responsibilities of pet ownership, including time commitment and financial obligations."
    },
    {
      question: 'Can I adopt if I have other pets?',
      answer: 'Yes! We encourage you to bring your current pets to the meet & greet to ensure compatibility. We can also provide advice on introducing new pets to your home.'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          How to Adopt Your New Best Friend
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          We've made our adoption process simple and straightforward. Follow these steps to welcome a new pet into your family.
        </p>
      </div>

      {/* Steps Section */}
      <div className="grid gap-8">
        {adoptionSteps.map((step, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                {step.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Step {index + 1}: {step.title}
                </h3>
                <p className="text-gray-600 mb-4">{step.description}</p>
                <Link
                  to={step.link}
                  className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium"
                >
                  {step.action} →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 rounded-xl p-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-start">
                  <HelpCircle className="text-orange-500 mr-2 flex-shrink-0" size={20} />
                  {faq.question}
                </h3>
                <p className="text-gray-600 ml-7">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-orange-500 text-white rounded-xl p-8 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Adoption Journey?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Browse our available pets and find your perfect match today.
          </p>
          <Link
            to="/pets"
            className="inline-flex items-center bg-white text-orange-500 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            <PawPrint className="mr-2" size={20} />
            Browse Available Pets
          </Link>
        </div>
      </div>

      {/* Contact Support */}
      <div className="text-center">
        <p className="text-gray-600">
          Need help with the adoption process?{' '}
          <Link to="/contact" className="text-orange-500 hover:text-orange-600 font-medium">
            Contact our support team
          </Link>
        </p>
      </div>
    </div>
  );
}

export default HowToAdopt; 